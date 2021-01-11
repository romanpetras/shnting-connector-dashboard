<template>
  <v-container fluid>
    <v-row>
      <v-col cols="8">
        <div class="display-2 mb-4">{{ $tc("simulationRequest", 2) }}</div>
      </v-col>
      <v-col cols="4" class="text-right">
        <v-btn fab color="primary" to="/app/loadingorders/new">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-card class="pa-4 mb-2">
      <v-card-text>
        <v-row>
          <v-col cols="3">
            <v-text-field v-model="browseFilter.id" label="ID">
            </v-text-field>
          </v-col>
          <v-col cols="3">
            <v-select
                      v-model="browseFilter.status" :items="simulationRequestStatusList"
                      clearable
                      :label="this.$tc('status',1)"
            ></v-select>
          </v-col>
          <v-col cols="3">
            <v-datetime-picker :label="this.$t('createDateFrom')" v-model="createdAtFrom"
                               date-format="dd/MM/yyyy" time-format="HH:mm:ss"
                               :text-field-props="textFieldProps" :date-picker-props="dateProps" :time-picker-props="timeProps">
              <template slot="dateIcon">
                <v-icon>mdi-calendar</v-icon>
              </template>
              <template slot="timeIcon">
                <v-icon>mdi-clock</v-icon>
              </template>
            </v-datetime-picker>
          </v-col>
          <v-col cols="3">
            <v-datetime-picker :label="this.$t('createDateTo')" v-model="createdAtTo"
                               date-format="dd/MM/yyyy" time-format="HH:mm:ss"
                               :text-field-props="textFieldProps" :date-picker-props="dateProps" :time-picker-props="timeProps">
              <template slot="dateIcon">
                <v-icon>mdi-calendar</v-icon>
              </template>
              <template slot="timeIcon">
                <v-icon>mdi-clock</v-icon>
              </template>
            </v-datetime-picker>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="primary" @click="browse">
          <v-icon>mdi-magnify</v-icon> {{ $t("search") }}
        </v-btn>
        <v-btn @click="resetFilterAndBrowse">
          <v-icon>mdi-restore</v-icon> {{ $t("reset") }}
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-card class="pa-4 mb-2">
      <v-simple-table fixed-header dense>
        <template v-slot:default>
          <thead>
            <tr>
              <th>ID</th>
              <th>{{ $tc("status",1) }}</th>
              <th>{{ $t("createDate") }}</th>
              <th>{{ $t("updateDate") }}</th>
              <th>{{ $tc("action",2) }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in browseResult" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ $t(item.status) }}</td>
              <td>{{ item.createdAt ? dateTimeObjToItaString(item.createdAt) : "N/A" }}</td>
              <td>{{ item.updatedAt ? dateTimeObjToItaString(item.updatedAt) : "N/A" }}</td>
              <td>
                <v-btn fab x-small :to="'/app/simulationrequest/' + item.id" class="ma-1" v-if="item.status === 'DRAFT'">
                  <v-icon>mdi-pen</v-icon>
                </v-btn>
                <v-btn fab x-small :to="'/app/simulationrequest/' + item.id" class="ma-1" v-if="item.status !== 'DRAFT'">
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
                <v-btn fab x-small :to="'/app/simulationrequest/' + item.id" class="ma-1" v-if="item.status === 'DRAFT'">
                  <v-icon>mdi-send</v-icon>
                </v-btn>
                <v-btn fab x-small :to="'/app/simulationrequest/' + item.id" class="ma-1" v-if="item.status === 'DRAFT'">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
    <v-row>
      <v-col class="text-left" cols="6">
        <span v-if="browseCount === 0">{{$tc('noResultsFound', 1)}}</span>
        <span v-else>{{$tc('resultsFrom', 1)}} {{ browseOffset + 1 }} {{$tc('to', 1)}}
          {{ Math.min(browseOffset + browseResult ? browseResult.length : 0, browseCount) }} {{$tc('outOf', 1)}}
          {{ browseCount }}</span>
      </v-col>
      <v-col cols="2" class="text-center">
        <v-select v-model="browseLimit" :items="browseLimitList" dense></v-select>
      </v-col>
      <v-col class="text-right" cols="4">
        <TableNav @offsetChanged="offsetChanged"
                  :browse-count="browseCount"
                  :browse-limit="browseLimit"
                  :browse-offset="browseOffset"></TableNav>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TableNav from "./TableNav";
import {simulationRequestService} from "@/services/simulationrequest.service";

export default {
  name: "SimulationRequestBrowser",
  components: { TableNav },
  data() {
    return {
      createdAtFrom: this.getYesterdayStartOfDay(),
      createdAtTo: this.getTomorrowEndOfDay(),
      browseFilter: {},
      browseResult: [],
      browseCount: 0,
      browseLimit: 10,
      browseOffset: 0,
      browseLimitList: [10, 20, 50],
      textFieldProps: {
        prependIcon: "mdi-calendar",
      },
      dateProps: {
        firstDayOfWeek: 1,
      },
      timeProps: {
        useSeconds: true,
        format: "24hr",
      },
      simulationRequestStatusList: [
        { text: this.$t("DRAFT"), value: "DRAFT" },
        { text: this.$t("PENDING"), value: "PENDING" },
        { text: this.$t("SUBMITTED"), value: "SUBMITTED" },
        { text: this.$t("CANCELLED"), value: "CANCELLED" },
      ]
    };
  },
  watch: {
    browseLimit: function () {
      this.browseOffset = 0;
      this.browse();
    },
  },
  created() {
    this.browse();
  },
  methods: {
    browse: function () {
      this.browseFilter.createdAtFrom = this.dateTimeObjToString(this.createdAtFrom);
      this.browseFilter.createdAtTo = this.dateTimeObjToString(this.createdAtTo);

      simulationRequestService
        .browse(this.browseOffset, this.browseLimit, this.browseFilter)
        .then((r) => {
          this.browseCount = r.totalCount;
          this.browseResult = r.resultList;
        });

    },
    resetFilter() {
      this.browseFilter = {};
      this.browseOffset = 0;
      this.browseLimit = 10;
      this.createdAtFrom = this.getYesterdayStartOfDay();
      this.createdAtTo = this.getTomorrowEndOfDay();
    },
    resetFilterAndBrowse() {
      this.resetFilter();
      this.browse();
    },
    offsetChanged(newOffset) {
      this.browseOffset = newOffset;
      this.browse();
    },
  },
};
</script>

<style scoped>
</style>