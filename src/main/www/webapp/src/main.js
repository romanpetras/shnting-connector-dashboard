import Vue from 'vue'
import App from './App.vue'
import DatetimePicker from 'vuetify-datetime-picker';
import vuetify from './plugins/vuetify';
import store from './store'
import { router } from "./router";
import './filters'
import i18n from './i18n'
import Date from './mixins/Date'

Vue.config.productionTip = false

Vue.use(DatetimePicker)
Vue.mixin(Date);

new Vue({
  vuetify,
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
