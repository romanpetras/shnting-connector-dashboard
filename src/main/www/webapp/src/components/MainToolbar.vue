<template>
    <v-app-bar app color="white" clipped-left>
        <div class="title ml-3 mr-5 font-weight-black">
<!--            <img src="../assets/yilport-scct.png" width="200" class="ma-2">-->
        </div>
        <div class="title ml-3 mr-5 font-weight-black">
            <div class="text-h5 secondary--text font-weight-bold">Shunting Connector Dashboard</div>
        </div>

        <v-spacer/>

        <v-dialog v-model="dialog" width="300">
            <template v-slot:activator="{ on, attrs }">
                <v-btn fab small v-bind="attrs" v-on="on" class="primary">
                    <v-icon>mdi-account</v-icon>
                </v-btn>
            </template>
            <v-card style="text-align: center;">
                <v-card-text style="padding: 5px">
                    <div class="font-weight-bold title" style="margin: 3px">{{ userFullname }}</div>
                    <div style="margin: 2px">{{ userEmail }}</div>
                    <hr>
                    <v-btn class="error" @click="logout" style="margin: 3px">
                        <v-icon>mdi-logout</v-icon>
                        Logout
                    </v-btn>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-app-bar>
</template>

<script>
    import { mapActions } from "vuex";

    export default {
        name: "MainToolbar",
        data () {
            return {
                dialog: false,
            }
        },
        computed: {
            userFullname() {
                return this.$store.state.account.user.lastName + " " + this.$store.state.account.user.firstName;
            },
            userEmail() {
                return this.$store.state.account.user.email;
            }
        },
        methods: {
            ...mapActions('account', ['logout']),
        }
    }
</script>

<style scoped>

</style>