<template>
  <v-container>
    <MainToolbar></MainToolbar>
    <v-navigation-drawer permanent app clipped color="grey lighten-4">
      <v-list dense>
        <template v-for="(item, i) in drawerItems">
          <v-row v-if="item.heading" :key="i" align="center">
            <v-col cols="2">
            </v-col>
            <v-col cols="10">
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-col>
          </v-row>
          <v-divider v-else-if="item.divider" :key="i"/>
          <v-list-item v-else :key="i" link :to="{ path: item.link }">
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-list-item-action v-bind="attrs" v-on="on">
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-action>
              </template>
              <span>{{ item.text }}</span>
            </v-tooltip>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>

    <snackbar></snackbar>
  </v-container>
</template>

<script>
import MainToolbar from "./MainToolbar";
import Snackbar from "./Snackbar";

export default {
  name: "MainPage",
  components: {Snackbar, MainToolbar},
  data() {
    return {
      drawerItems: [],
    }
  },
  created() {
    let user = this.$store.state.account.user;
    let company = user.company;

    this.drawerItems.push({
      icon: 'mdi-view-dashboard',
      text: 'Dashboard',
      link: '/app/dashboard',
      show: true,
      key: 'DASHBOARD'
    });

    this.drawerItems.push({divider: true, show: true, key: 'DIVIDER_1'});

    this.drawerItems.push({
      icon: 'mdi-train',
      text: this.$tc('simulationRequest', 2),
      link: '/app/simulationrequest',
      show: false,
      key: 'SIMULATIONREQUEST'
    });

  },
}
</script>

<style scoped>

</style>