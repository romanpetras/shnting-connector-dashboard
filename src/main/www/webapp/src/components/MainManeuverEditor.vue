<template>
  <v-container fluid>
    <v-row>
      <v-col cols="8">
        <div class="display-2 mb-4">{{ $tc("mainManeuver", 1) }} {{ id }}</div>
      </v-col>
      <v-col cols="4" class="text-right">
        <v-btn fab color="primary" @click="goBack">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-card class="pa-4 mb-2">
      <v-card-text>
        <v-row>
          <v-col cols="2">
            <v-select v-model="maneuverType" :label="this.$tc('maneuverType', 1)"
                      :items="maneuverTypeList"
            ></v-select>
          </v-col>
          <v-col cols="2">
            <v-text-field v-model="traceNumber" label="Traccia">
            </v-text-field>
          </v-col>
          <v-col cols="2">
            <v-select v-model="terminal" :label="this.$tc('terminal', 1)"
                      :items="terminalList" item-text="description" return-object
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            <v-datetime-picker label="ETA" v-model="etaDate"
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
            <v-datetime-picker label="ETP" v-model="etpDate"
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
            <v-text-field v-model="wagonsNumber" label="Numero vagoni">
            </v-text-field>
          </v-col>
          <v-col cols="3">
            <v-select v-model="wagonsType" :label="this.$tc('wagonsType', 1)"
                      :items="wagonTypeList" item-text="description" return-object
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            <v-autocomplete
                v-model="arrivalPoint"
                :items="arrivalPointSelectList" :search-input.sync="arrivalPointSearch"
                item-text="description" return-object
                hide-no-data hide-details clearable :label="this.$tc('arrivalPoint', 1)"
            ></v-autocomplete>
          </v-col>
          <v-col cols="3">
            <v-autocomplete
                v-model="maneuverParkPoint"
                :items="maneuverParkPointSelectList" :search-input.sync="maneuverParkPointSearch"
                item-text="description" return-object
                hide-no-data hide-details clearable :label="this.$tc('maneuverParkPoint', 1)"
            ></v-autocomplete>
          </v-col>
          <v-col cols="3">
            <v-autocomplete
                v-model="regressionPoint"
                :items="regressionPointSelectList" :search-input.sync="regressionPointSearch"
                item-text="description" return-object
                hide-no-data hide-details clearable :label="this.$tc('regressionPoint', 1)"
            ></v-autocomplete>
          </v-col>
          <v-col cols="3">
            <v-autocomplete
                v-model="locomotorEndingPoint"
                :items="locomotorEndingPointSelectList" :search-input.sync="locomotorEndingPointSearch"
                item-text="description" return-object
                hide-no-data hide-details clearable :label="this.$tc('locomotorEndingPoint', 1)"
            ></v-autocomplete>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="primary" @click="save">
          <v-icon>mdi-content-save</v-icon>
          {{ $t("save") }}
        </v-btn>
        <v-btn @click="restore">
          <v-icon>mdi-restore</v-icon>
          {{ $t("reset") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { mapMutations } from "vuex";
import { terminalService } from "@/services/terminal.service";
import { wagonTypeService } from "@/services/wagontype.service";
import { mainManeuverService } from "@/services/mainmaneuver.service";
import { pointService } from "@/services/point.service";

export default {
  name: "MainManeuverEditor",
  data() {
    return {
      id: null,
      maneuverType: null,
      traceNumber: null,
      terminal: null,
      eta: null,
      etaDate: null,
      etp: null,
      etpDate: null,
      arrivalPoint: null,
      maneuverParkPoint: null,
      regressionPoint: null,
      locomotorEndingPoint: null,
      wagonsNumber: 0,
      wagonsType: null,
      readonly: false,
      textFieldProps: { prependIcon: "mdi-calendar", },
      dateProps: { firstDayOfWeek: 1, },
      timeProps: { useSeconds: true, format: "24hr", },
      maneuverTypeList: [
        { text: this.$tc('arrival', 1), value: 'ARRIVAL' },
        { text: this.$tc('departure', 1), value: 'DEPARTURE' }
      ],
      terminalList: [],
      wagonTypeList: [],
      arrivalPointSelectList: [],
      arrivalPointSearch: null,
      maneuverParkPointSelectList: [],
      maneuverParkPointSearch: null,
      regressionPointSelectList: [],
      regressionPointSearch: null,
      locomotorEndingPointSelectList: [],
      locomotorEndingPointSearch: null,
    };
  },
  async beforeCreate() {
    await wagonTypeService
        .getAll()
        .then((r) => {
          this.wagonTypeList = r;
        });
    await terminalService
        .getAll()
        .then((r) => {
          this.terminalList = r;
        });
  },
  created() {
    if (this.$route.params.id !== "new") {
      this.loadMainManeuver(this.$route.params.id);
    }
  },
  watch: {
    arrivalPointSearch (val) {
      if (!val) { return; }
      this.searchArrivalPointDebounced(val);
    },
    maneuverParkPointSearch (val) {
      if (!val) { return; }
      this.searchManeuverParkPointDebounced(val);
    },
    regressionPointSearch (val) {
      if (!val) { return; }
      this.searchRegressionPointDebounced(val);
    },
    locomotorEndingPointSearch (val) {
      if (!val) { return; }
      this.searchLocomotorEndingPointDebounced(val);
    },
  },
  methods: {
    ...mapMutations({ setSnackbarMessage: "snackbar/setSnackbarMessage" }),
    save: function () {
      let obj = {
        id: this.id,
        status: this.status,
      };
      mainManeuverService
        .save(obj)
        .then((r) => {
          this.setSnackbarMessage({
            text: this.$tc("changesSavedSuccessfully", 1),
            color: "success",
          });
          this.$router.go(-1);
        })
        .catch((error) => {
          console.error(error);
          this.setSnackbarMessage({
            text: this.$tc("failedToSaveChanges", 1),
            color: "error",
          });
        });
    },
    restore: function () {
      if (this.$route.params.id !== "new") {
        this.loadMainManeuver(this.$route.params.id);
      } else {
        this.id = null;
        this.maneuverType = null;
        this.traceNumber = null;
        this.terminal = null;
        this.eta = null;
        this.etaDate = null;
        this.etp = null;
        this.etpDate = null;
        this.arrivalPoint = null;
        this.maneuverParkPoint = null;
        this.regressionPoint = null;
        this.locomotorEndingPoint = null;
        this.wagonsNumber = 0;
        this.wagonsType = null;
        this.terminalList = [];
        this.wagonTypeList = [];
        this.arrivalPointSelectList = [];
        this.arrivalPointSearch = null;
        this.maneuverParkPointSelectList = [];
        this.maneuverParkPointSearch = null;
        this.regressionPointSelectList = [];
        this.regressionPointSearch = null;
        this.locomotorEndingPointSelectList = [];
        this.locomotorEndingPointSearch = null;
      }
    },
    goBack: function () {
      // todo: notifica se ci sono modifiche non salvate
      this.$router.go(-1);
    },
    loadMainManeuver: function (id) {

      mainManeuverService .get(id).then((r) => {
        this.id = r.id;
        this.maneuverType = r.maneuverType;
        this.traceNumber = r.traceNumber;
        this.terminal = r.terminal;
        this.eta = r.eta;
        this.etaDate = this.dateTimeStringToObject(this.eta);
        this.etp = r.etp;
        this.etpDate = this.dateTimeStringToObject(this.etp);
        this.arrivalPoint = r.arrivalPoint;
        this.maneuverParkPoint = r.maneuverParkPoint;
        this.regressionPoint = r.regressionPoint;
        this.locomotorEndingPoint = r.locomotorEndingPoint;
        this.wagonsNumber = r.wagonsNumber
        this.wagonsType = r.wagonsType;

        this.arrivalPointSelectList = [this.arrivalPoint];
        this.maneuverParkPointSelectList = [this.maneuverParkPoint];
        this.regressionPointSelectList = [this.regressionPoint];
        this.locomotorEndingPointSelectList = [this.locomotorEndingPoint];
      });

    },
    mapManeuverType: function (t) {
      if (t === 'ARRIVAL') {
        return 'Arrivo';
      } else {
        return 'Partenza';
      }
    },
    searchArrivalPointDebounced(hint) {
      clearTimeout(this._searchTimerId)
      this._searchTimerId = setTimeout(() => {
        pointService.autocomplete(hint)
            .then(res => {
              this.arrivalPointSelectList = res;
            });
      }, 500) /* 500ms throttle */
    },
    searchManeuverParkPointDebounced(hint) {
      clearTimeout(this._searchTimerId)
      this._searchTimerId = setTimeout(() => {
        pointService.autocomplete(hint)
            .then(res => {
              this.maneuverParkPointSelectList = res;
            });
      }, 500) /* 500ms throttle */
    },
    searchRegressionPointDebounced(hint) {
      clearTimeout(this._searchTimerId)
      this._searchTimerId = setTimeout(() => {
        pointService.autocomplete(hint)
            .then(res => {
              this.regressionPointSelectList = res;
            });
      }, 500) /* 500ms throttle */
    },
    searchLocomotorEndingPointDebounced(hint) {
      clearTimeout(this._searchTimerId)
      this._searchTimerId = setTimeout(() => {
        pointService.autocomplete(hint)
            .then(res => {
              this.locomotorEndingPointSelectList = res;
            });
      }, 500) /* 500ms throttle */
    },
  },
};
</script>

<style scoped>
</style>