import '@mdi/font/css/materialdesignicons.css'
import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import it from "vuetify/lib/locale/it";

Vue.use(Vuetify);

export default new Vuetify({
    icons: {
        iconfont: 'mdi',
    },
    theme: {
        themes: {
            light: {
                primary: '#4791db',
                secondary: '#e33371',
                accent: '#009dda',
                error: '#e57373',
                warning: '#ffb74d',
                info: '#64b5f6',
                success: '#81c784'
            }
        }
    },
    lang: {
        locales: { it },
        current: 'it',
    }
});
