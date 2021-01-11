<template>
    <v-container>
        <v-row>
            <v-col cols="2">
            </v-col>
            <v-col cols="7">
                <div class="mt-5">
<!--                    <img src="../assets/logo.png" width="400" class="ma-2">-->
                    <h1>{{ appTitle }}</h1>
                </div>
            </v-col>
            <v-col cols="3">
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="7"></v-col>
            <v-col cols="2">
                <div class="card">
                    <div class="card-body">
                        <v-form @submit.prevent="submit">
                            <div class="form-group">
                                <v-text-field v-model="username"
                                              label="Username"></v-text-field>
                            </div>
                            <div class="form-group">
                                <v-text-field v-model="password"
                                              label="Password"
                                              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                              :type="showPassword ? 'text' : 'password'"
                                              @click:append="showPassword = !showPassword"></v-text-field>
                            </div>
                            <v-btn color="primary" :disabled="status.loggingIn" type="submit">Login</v-btn>
                        </v-form>
                    </div>
                </div>
            </v-col>
            <v-col cols="3"></v-col>
        </v-row>
        <v-row>
            <v-col cols="12" div class="col-12 text-right" style="color: #aeaeae;">
              Version: {{ version }}<br>Mode: {{ mode }}
            </v-col>
        </v-row>
    </v-container>

</template>

<script>
    import {mapState, mapActions} from 'vuex'

    export default {
        name: "LandingPage",
        data() {
            return {
                username: '',
                password: '',
                submitted: false,
                showPassword: false,
                appTitle: process.env.VUE_APP_TITLE,
            }
        },
        computed: {
            ...mapState('account', ['status']),
            version() {
                return process.env.VUE_APP_VERSION
            },
            mode() {
                return process.env.NODE_ENV;
            }
        },
        created() {
            this.logout();
            console.log(process.env.VUE_APP_TITLE);
        },
        methods: {
            ...mapActions('account', ['login', 'logout']),
            submit() {
                this.submitted = true;
                const {username, password} = this;
                if (username && password) {
                    this.login({username, password});
                }
            }
        }
    }
</script>

<style scoped>

</style>