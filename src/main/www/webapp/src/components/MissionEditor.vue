<template>
  <v-container fluid>
    <v-row>
      <v-col cols="8">
        <div class="display-2 mb-4">{{ $tc("mission", 1) }} {{ id }}</div>
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
            <v-datetime-picker label="Ora inizio" v-model="startDateTime"
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
          <v-col cols="2">
            <v-text-field v-model="traceNumber" :label="this.$tc('traceNumber', 1)">
            </v-text-field>
          </v-col>
          <v-col cols="3">
            <v-autocomplete
                v-model="locomotor"
                :items="locomotorSelectList" :search-input.sync="locomotorSearch"
                item-text="description" return-object
                hide-no-data hide-details clearable :label="this.$tc('locomotor', 1)"
            ></v-autocomplete>
          </v-col>
          <v-col cols="2">
            <v-text-field v-model="trainSplit" label="Split">
            </v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field v-model="cutNumber" :label="this.$tc('cutNumber', 1)">
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            <v-autocomplete
                v-model="locomotorStartingPoint"
                :items="locomotorStartingPointSelectList" :search-input.sync="locomotorStartingPointSearch"
                item-text="description" return-object
                hide-no-data hide-details clearable :label="this.$tc('locomotorStartingPoint', 1)"
            ></v-autocomplete>
          </v-col>
          <v-col cols="3">
            <v-autocomplete
                v-model="trainStartingPoint"
                :items="trainStartingPointSelectList" :search-input.sync="trainStartingPointSearch"
                item-text="description" return-object
                hide-no-data hide-details clearable :label="this.$tc('trainStartingPoint', 1)"
            ></v-autocomplete>
          </v-col>
          <v-col cols="3">
            <v-autocomplete
                v-model="trainEndingPoint"
                :items="trainEndingPointSelectList" :search-input.sync="trainEndingPointSearch"
                item-text="description" return-object
                hide-no-data hide-details clearable :label="this.$tc('trainEndingPoint', 1)"
            ></v-autocomplete>
          </v-col>
          <v-col cols="3">
            <v-autocomplete
                v-model="wagonCutEndingPoint"
                :items="wagonCutEndingPointSelectList" :search-input.sync="wagonCutEndingPointSearch"
                item-text="description" return-object
                hide-no-data hide-details clearable :label="this.$tc('wagonCutEndingPoint', 1)"
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
    <v-row>
      <v-col cols="8">
        <div class="text-h6 mb-4">Tasks</div>
      </v-col>
      <v-col cols="4" class="text-right">
        <v-btn fab color="primary" to="/app/missiontask/new">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-card class="pa-4 mb-2">
      <v-simple-table class="mb-5" fixed-header dense>
        <template v-slot:default>
          <thead>
          <tr>
            <th width="100">{{ $tc("sequence", 1) }}</th>
            <th>{{ $tc("trainPart", 1) }}</th>
            <th>{{ $tc("departurePoint", 1) }}</th>
            <th>{{ $tc("arrivalPoint", 1) }}</th>
            <th width="100">{{ $tc("direction", 1) }}</th>
            <th>{{ $tc("couple", 1) }}</th>
            <th>{{ $tc("decouple", 1) }}</th>
            <th>Split</th>
            <th>{{ $tc("splitPart", 1) }}</th>
            <th>{{ $tc("splitPosition", 1) }}</th>
            <th>{{ $tc("splitNumber", 1) }}</th>
            <th width="200">{{ $tc("action", 2) }}</th>
          </tr>
          </thead>
          <tbody v-if="missionTaskList.length > 0">
          <tr v-for="item in missionTaskList" :key="item.id" >
            <td>{{ item.sequence }}</td>
            <td>{{ item.trainPart !== null ? item.trainPart : "" }}</td>
            <td>{{ item.departurePoint ? item.departurePoint.description : "" }}</td>
            <td>{{ item.arrivalPoint ? item.arrivalPoint.description : "" }}</td>
            <td>{{ mapMissionTaskDirection(item.direction) }}</td>
            <td>{{ item.couple ?  $tc("yes", 1)  : $tc("no", 1) }}</td>
            <td>{{ item.decouple ? $tc("yes", 1)  : $tc("no", 1) }}</td>
            <td>{{ item["split"] ? $tc("yes", 1)  : $tc("no", 1) }}</td>
            <td>{{ item.splitPart !== null ? item.splitPart : "" }}</td>
            <td>{{ item.splitPosition !== null ? mapMissionTaskSplitPosition(item.splitPosition) : "" }}</td>
            <td>{{ item.splitNumber !== null ? item.splitNumber : "" }}</td>
            <td>
              <v-btn fab x-small :to="'/app/missiontask/' + item.id" class="ma-1">
                <v-icon>mdi-pen</v-icon>
              </v-btn>
                <v-dialog v-model="dialog" persistent max-width="290" :retain-focus="false">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn fab x-small v-bind="attrs" v-on="on" class="ma-1">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-text>{{ $tc("taskRemovingConfirmMessage", 1) }}</v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="green darken-1" text @click="dialog = false">Cancel</v-btn>
                      <v-btn color="green darken-1" text @click="dialog = false; dissociateMissionTask(item.id)">Confirm</v-btn>
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
import { missionService } from "@/services/mission.service";
import { missionTaskService } from "@/services/missionTask.service";
import {pointService} from "@/services/point.service";
import {locomotorService} from "@/services/locomotor.service";

export default {
  name: "MissionEditor",
  data() {
    return {
      dialog:false,
      id: null,
      startDateTime: null,
      locomotor:null,
      readonly: false,
      missionTaskList: [],
      traceNumber: null,
      simulationRequestId: null,
      locomotorStartingPoint: null,
      trainStartingPoint: {
        id:null,
        code:"",
        description:""
      },
      trainEndingPoint: {
        id:null,
        code:"",
        description:""
      },
      trainSplit: false,
      cutNumber: null,
      wagonCutEndingPoint: {
        id:null,
        code:"",
        description:""
      },
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
      emptyPoint : {
        id:null,
        code:"",
        description:""
      },
      locomotorStartingPointSelectList:[],
      locomotorStartingPointSearch:null,
      trainStartingPointSelectList:[],
      trainStartingPointSearch:null,
      trainEndingPointSelectList: [],
      trainEndingPointSearch: null,
      wagonCutEndingPointSelectList: [],
      wagonCutEndingPointSearch: null,
      locomotorSelectList: [],
      locomotorSearch: null

    };
  },
  created() {
    if (this.$route.params.id !== "new") {
      this.loadMission(this.$route.params.id);
    }
  },
  watch:{
    locomotorStartingPointSearch (val){
      if (!val) { return; }
      this.searchLocomotorStartingPointDebounced(val);
    },
    trainStartingPointSearch (val){
      if (!val) { return; }
      this.searchTrainStartingPointDebounced(val);
    },
    trainEndingPointSearch (val){
      if (!val) { return; }
      this.searchTrainEndingPointDebounced(val);
    },
    wagonCutEndingPointSearch (val){
      if (!val) { return; }
      this.searchWagonCutEndingPointDebounced(val);
    },
    locomotorSearch (val){
      if (!val) { return; }
      this.searchLocomotorDebounced(val);
    }
  },
  methods: {
    ...mapMutations({ setSnackbarMessage: "snackbar/setSnackbarMessage" }),
    dissociateMissionTask: function(missionTaskId){
      let missionTask = this.missionTaskList.find(task => task.id === missionTaskId);
      missionTask.missionId = null;
      missionTaskService
          .save(missionTask)
          .then((r) => {
          this.setSnackbarMessage({
          text: this.$tc("changesSavedSuccessfully", 1),
          color: "success",
        });
          this.restore();
      });
    },
    save: function () {
      let obj = {
        id : this.id,
        startDateTime: this.startDateTime,
        locomotor : this.locomotor,
        missionTaskList : this.missionTaskList,
        traceNumber : this.traceNumber,
        locomotorStartingPoint : this.locomotorStartingPoint,
        trainStartingPoint : this.trainStartingPoint,
        trainEndingPoint : this.trainEndingPoint,
        trainSplit: this.trainSplit,
        cutNumber : this.cutNumber,
        wagonCutEndingPoint : this.wagonCutEndingPoint,
        simulationRequestId : this.simulationRequestId
      };
      missionService
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
        this.loadMission(this.$route.params.id);
      } else {
        this.id = null;
        this.startDateTime= null;
        this.locomotor = null;
        this.missionTaskList = [];
        this.traceNumber = null;
        this.locomotorStartingPoint = null;
        this.trainStartingPoint = null;
        this.trainEndingPoint = null;
        this.trainSplit= null;
        this.cutNumber = null;
        this.wagonCutEndingPoint = null;
        this.simulationRequestId = null;

        this.locomotorStartingPointSelectList=[];
        this.locomotorStartingPointSearch=null;
        this.trainStartingPointSelectList=[];
        this.trainStartingPointSearch=null;
        this.trainEndingPointSelectList= [];
        this.trainEndingPointSearch= null;
        this.wagonCutEndingPointSelectList= [];
        this.wagonCutEndingPointSearch= null
      }
    },
    goBack: function () {
      // todo: notifica se ci sono modifiche non salvate
      this.$router.go(-1);
    },
    loadMission: function (id) {
      missionService.get(id).then((r) => {
        this.id = r.id;
        this.startDateTime = this.dateTimeStringToObject(r.startDateTime);
        this.locomotor = r.locomotor;
        this.missionTaskList = r.missionTaskList;
        this.traceNumber = r.traceNumber;
        this.locomotorStartingPoint = r.locomotorStartingPoint;
        this.trainStartingPoint = r.trainStartingPoint;
        this.trainEndingPoint = r.trainEndingPoint;
        this.trainSplit= r.trainSplit;
        this.cutNumber = r.cutNumber;
        this.wagonCutEndingPoint = r.wagonCutEndingPoint;
        this.simulationRequestId = r.simulationRequestId;

        this.locomotorStartingPointSelectList = [this.locomotorStartingPoint];
        this.trainStartingPointSelectList = [this.trainStartingPoint];
        this.trainEndingPointSelectList = [this.trainEndingPoint];
        this.wagonCutEndingPointSelectList = [this.wagonCutEndingPoint];
        this.locomotorSelectList = [this.locomotor];
      });
    },
    searchLocomotorStartingPointDebounced(hint) {
      clearTimeout(this._searchTimerId)
      this._searchTimerId = setTimeout(() => {
        pointService.autocomplete(hint)
            .then(res => {
              this.locomotorStartingPointSelectList = res;
            });
      }, 500) /* 500ms throttle */
    },
    searchTrainStartingPointDebounced(hint) {
      clearTimeout(this._searchTimerId)
      this._searchTimerId = setTimeout(() => {
        pointService.autocomplete(hint)
            .then(res => {
              this.trainStartingPointSelectList = res;
            });
      }, 500) /* 500ms throttle */
    },
    searchTrainEndingPointDebounced(hint) {
      clearTimeout(this._searchTimerId)
      this._searchTimerId = setTimeout(() => {
        pointService.autocomplete(hint)
            .then(res => {
              this.trainEndingPointSelectList = res;
            });
      }, 500) /* 500ms throttle */
    },
    searchWagonCutEndingPointDebounced(hint) {
      clearTimeout(this._searchTimerId)
      this._searchTimerId = setTimeout(() => {
        pointService.autocomplete(hint)
            .then(res => {
              this.wagonCutEndingPointSelectList = res;
            });
      }, 500) /* 500ms throttle */
    },
    searchLocomotorDebounced(hint) {
      clearTimeout(this._searchTimerId)
      this._searchTimerId = setTimeout(() => {
        locomotorService.autocomplete(hint)
            .then(res => {
              this.locomotorSelectList = res;
            });
      }, 500) /* 500ms throttle */
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