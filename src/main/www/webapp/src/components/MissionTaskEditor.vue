<template>
  <v-container fluid>
    <v-row>
      <v-col cols="8">
        <div class="display-2 mb-4">Task {{ id }}</div>
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
            <v-text-field v-model="sequence" :label="this.$tc('sequence', 1)">
            </v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="trainPart" :label="this.$tc('trainPart', 1)">
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            <v-autocomplete
                v-model="departurePoint"
                :items="departurePointSelectList" :search-input.sync="departurePointSearch"
                item-text="description" return-object
                hide-no-data hide-details clearable :label="this.$tc('departurePoint', 1)"
            ></v-autocomplete>
          </v-col>
          <v-col cols="3">
            <v-autocomplete
                v-model="arrivalPoint"
                :items="arrivalPointSelectList" :search-input.sync="arrivalPointSearch"
                item-text="description" return-object
                hide-no-data hide-details clearable :label="this.$tc('arrivalPoint', 1)"
            ></v-autocomplete>
          </v-col>
          <v-col cols="2">
            <v-select v-model="direction" :items="directionSelectList"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            <v-switch v-model="couple" :label="this.$tc('couple', 1)"
            ></v-switch>
          </v-col>
          <v-col cols="3">
            <v-switch v-model="decouple" :label="this.$tc('decouple', 1)"
            ></v-switch>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            <v-switch v-model="split" label="Split"></v-switch>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="splitPart" :label="this.$tc('splitPart', 1)">
            </v-text-field>
          </v-col>
          <v-col cols="3">
            <v-select v-model="splitPosition" :label="this.$tc('splitPosition', 1)"
                      :items="splitPositionSelectList"
            ></v-select>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="splitNumber" :label="this.$tc('splitNumber', 1)">
            </v-text-field>
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
import { missionTaskService } from "@/services/missionTask.service";
import {pointService} from "@/services/point.service";

export default {
  name: "MissionTaskEditor",
  data() {
    return {
      id: null,
      sequence: null,
      mainManouverId: null,
      trainPart: null,
      departurePoint: null,
      arrivalPoint: null,
      direction: null,
      couple: null,
      decouple: null,
      split: null,
      splitPart: null,
      splitPosition: null,
      splitNumber: null,
      arrivalPointSelectList:[],
      arrivalPointSearch:null,
      departurePointSelectList:[],
      departurePointSearch:null,
      readonly: false,
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
      directionSelectList: [
        { text: 'SX -> RX', value: 'LEFT_TO_RIGHT' },
        { text: 'SX <- RX', value: 'RIGHT_TO_LEFT' },
      ],
      splitPositionSelectList: [
        { text: '-', value: null },
        { text: this.$tc("head", 1), value: 'HEAD' },
        { text: this.$tc("tail", 1), value: 'TAIL' },
      ],
      pointSelectList: [
        { id: 3, code: "SE12", description: "Binario 7 parco FM" },
        { id: 5, code: "S1", description: "Binario 1lev terminal IMT" }
      ],
      missionId:null
    };
  },
  created() {
    if (this.$route.params.id !== "new") {
      this.loadMissionTask(this.$route.params.id);

    }
  },
  watch:{
    arrivalPointSearch (val) {
      if (!val) { return; }
      this.searchArrivalPointDebounced(val);
    },
    departurePointSearch (val){
      if (!val) { return; }
      this.searchDeparturePointDebounced(val);
    }
  },
  methods: {
    ...mapMutations({ setSnackbarMessage: "snackbar/setSnackbarMessage" }),
    save: function () {
      let obj = {
        id : this.id,
        sequence : this.sequence,
        mainManouverId : this.mainManouverId,
        trainPart : this.trainPart,
        departurePoint : this.departurePoint,
        arrivalPoint : this.arrivalPoint,
        direction : this.direction,
        couple : this.couple,
        decouple : this.decouple,
        split : this.split,
        splitPart : this.splitPart,
        splitPosition : this.splitPosition,
        splitNumber : this.splitNumber,
        missionId : this.missionId,
      };
      missionTaskService
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
        this.loadMissionTask(this.$route.params.id);
      } else {
        this.id =  null;
        this.sequence =  null;
        this.mainManouverId =  null;
        this.trainPart =  null;
        this.departurePoint =  null;
        this.arrivalPoint =  null;
        this.direction =  null;
        this.couple =  null;
        this.decouple =  null;
        this.split =  null;
        this.splitPart =  null;
        this.splitPosition =  null;
        this.splitNumber =  null;
        this.readonly =  false;
        this.missionId = null;
      }
    },
    goBack: function () {
      // todo: notifica se ci sono modifiche non salvate
      this.$router.go(-1);
    },
    loadMissionTask: function (id) {
      missionTaskService.get(id).then((r) => {
        this.id = r.id;
        this.sequence = r.sequence;
        this.mainManouverId = r.mainManouverId;
        this.trainPart = r.trainPart;
        this.departurePoint = r.departurePoint;
        this.arrivalPoint = r.arrivalPoint;
        this.direction = r.direction;
        this.couple = r.couple;
        this.decouple = r.decouple;
        this.split = r.split;
        this.splitPart = r.splitPart;
        this.splitPosition = r.splitPosition;
        this.splitNumber = r.splitNumber;
        this.missionId = r.missionId;

        this.arrivalPointSelectList = [this.arrivalPoint];
        this.departurePointSelectList = [this.departurePoint];
      });
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
    searchDeparturePointDebounced(hint) {
      clearTimeout(this._searchTimerId)
      this._searchTimerId = setTimeout(() => {
        pointService.autocomplete(hint)
            .then(res => {
              this.departurePointSelectList = res;
            });
      }, 500) /* 500ms throttle */
    },
    mapManeuverType: function (t) {
      if (t === 'ARRIVAL') {
        return 'Arrivo';
      } else {
        return 'Partenza';
      }
    },
    mapMissionTaskDirection: function (dir) {
      if (dir === 'LEFT_TO_RIGHT') {
        return 'SX -> RX';
      } else {
        return 'SX <- RX';
      }
    },
    mapMissionTaskSplitPosition: function (pos) {
      if (pos === 'HEAD') {
        return 'Testa';
      } else {
        return 'Coda';
      }
    }
  },
};
</script>

<style scoped>
</style>