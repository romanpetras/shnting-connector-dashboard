<template>
  <v-container fluid>
    <v-row>
      <v-col cols="8">
        <div class="display-2 mb-4">{{ $tc("simulationRequest", 1) }} {{ id }}</div>
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
          <v-col cols="3">
            <v-select
                v-model="status" :items="simulationRequestStatusList"
                clearable
                :label="this.$tc('status',1)"
            ></v-select>
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
    <v-row>
      <v-col cols="8">
        <div class="text-h6 mb-4">{{ $tc("mainManeuver", 2) }}</div>
      </v-col>
      <v-col cols="4" class="text-right">
        <v-btn fab color="primary" to="/app/mainmaneuver/new">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-card class="pa-4 mb-2">
      <v-simple-table class="mb-5" fixed-header dense>
        <template v-slot:default>
          <thead>
          <tr>
            <th width="100">ID</th>
            <th>{{ $tc("type", 1) }}</th>
            <th>{{ $tc("traceNumber", 1) }}</th>
            <th>Terminal</th>
            <th>ETA</th>
            <th>ETP</th>
            <th width="200">{{ $tc("action", 2) }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in mainManeuverList" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.maneuverType }}</td>
            <td>{{ item.traceNumber }}</td>
            <td>{{ item.terminal.description }}</td>
            <td>{{ dateTimeObjToItaString(item.eta) }}</td>
            <td>{{ dateTimeObjToItaString(item.etp) }}</td>
            <td>
              <v-btn fab x-small :to="'/app/mainmaneuver/' + item.id" class="ma-1">
                <v-icon>mdi-pen</v-icon>
              </v-btn>
              <v-dialog v-model="mainManeuverDialog" persistent max-width="290" :retain-focus="false">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn fab x-small v-bind="attrs" v-on="on" class="ma-1">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <v-card-text>{{ $tc("mainManeuverRemovingConfirmMessage", 1) }}</v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="mainManeuverDialog = false">Cancel</v-btn>
                    <v-btn color="green darken-1" text @click="mainManeuverDialog = false; dissociateMainManeuver(item.id)">Confirm</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>

    <v-row>
      <v-col cols="8">
        <div class="text-h6 mb-4">{{ $tc("mission", 2) }}</div>
      </v-col>
      <v-col cols="4" class="text-right">
        <v-btn fab color="primary" to="/app/mission/new">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-card class="pa-4 mb-2">
      <v-simple-table class="mb-5" fixed-header dense>
        <template v-slot:default>
          <thead>
          <tr>
            <th width="100">ID</th>
            <th>{{ $tc("startTime", 1) }}</th>
            <th>Locomotore</th>
            <th>{{ $tc("traceNumber", 1) }}</th>
            <th>Split</th>
            <th>{{ $tc("traceNumber", 1) }}</th>
            <th width="200">{{ $tc("action", 2) }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in missionList" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ dateTimeObjToItaString(item.startDateTime) }}</td>
            <td>{{ item.locomotor ? item.locomotor.description : ""}}</td>
            <td>{{ item.traceNumber }}</td>
            <td>{{ item.trainSplit === true ?  $tc("yes", 1)  : $tc("no", 1)}}</td>
            <td>{{ item.cutNumber }}</td>
            <td>
              <v-btn fab x-small :to="'/app/mission/' + item.id" class="ma-1">
                <v-icon>mdi-pen</v-icon>
              </v-btn>
              <v-dialog v-model="missionDialog" persistent max-width="290" :retain-focus="false">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn fab x-small v-bind="attrs" v-on="on" class="ma-1">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <v-card-text>{{ $tc("missionRemovingConfirmMessage", 1) }}</v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="missionDialog = false">Cancel</v-btn>
                    <v-btn color="green darken-1" text @click="missionDialog = false; dissociateMission(item.id)">Confirm</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>



  </v-container>
</template>

<script>
import { mapMutations } from "vuex";
import { simulationRequestService } from "@/services/simulationrequest.service";
import {missionService} from "@/services/mission.service";
import { mainManeuverService } from "@/services/mainmaneuver.service";

export default {
  name: "SimulationRequestEditor",
  data() {
    return {
      mainManeuverDialog : false,
      missionDialog:false,
      id: null,
      status: "",
      readonly: false,
      mainManeuverList: [],
      missionList: [],
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
  created() {
    if (this.$route.params.id !== "new") {
      this.loadSimulationRequest(this.$route.params.id);
    }
  },
  methods: {
    dissociateMission: function(missionId){
      let mission = this.missionList.find(m => m.id === missionId);
      mission.simulationRequestId = null;
      missionService
          .save(mission)
          .then((r) => {
            this.setSnackbarMessage({
              text: this.$tc("changesSavedSuccessfully", 1),
              color: "success",
            });
            this.restore();
          });
    },
    dissociateMainManeuver: function(mainManeuverId){
      let mainManeuver = this.mainManeuverList.find(maneuver => maneuver.id === mainManeuverId);
      mainManeuver.simulationRequestId = null;
      mainManeuverService
          .save(mainManeuver)
          .then((r) => {
            this.setSnackbarMessage({
              text: this.$tc("changesSavedSuccessfully", 1),
              color: "success",
            });
            this.restore();
          });
    },
    ...mapMutations({ setSnackbarMessage: "snackbar/setSnackbarMessage" }),
    save: function () {
      let obj = {
        id: this.id,
        status: this.status,
        mainManeuverList: this.mainManeuverList,
        missionList: this.missionList
      };
      simulationRequestService
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
        this.loadSimulationRequest(this.$route.params.id);
      } else {
        this.id = null;
        this.status = null;
        this.mainManeuverList = [];
        this.missionList = [];
      }
    },
    goBack: function () {
      // todo: notifica se ci sono modifiche non salvate
      this.$router.go(-1);
    },
    loadSimulationRequest: function (id) {
      simulationRequestService.get(id).then((r) => {
        this.id = r.id;
        this.status = r.status;
        this.mainManeuverList = r.mainManeuverList;
        this.missionList = r.missionList;
      });
    },
  },
  mapManeuverType: function (t) {
    if (t === 'ARRIVAL') {
      return 'Arrivo';
    } else {
      return 'Partenza';
    }
  }
};
</script>

<style scoped>
</style>