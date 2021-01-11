process.env.VUE_APP_VERSION = require('./package.json').version

module.exports = {
  "publicPath": "/",
  "transpileDependencies": [
    "vuetify"
  ],

  pluginOptions: {
    i18n: {
      locale: 'it',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  }
}
