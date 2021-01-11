import Vue from 'vue'
import Vuex from 'vuex'

import {account} from "./account.module";
import {snackbar} from "./snackbar.module";

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    modules: {
        account,
        snackbar
    },
    strict: debug
})