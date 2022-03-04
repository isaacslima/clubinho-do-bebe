import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'
import { firestorePlugin } from 'vuefire'
import Calendar from 'v-calendar/lib/components/calendar.umd'

Vue.component('calendar', Calendar)
Vue.config.productionTip = false
Vue.use(firestorePlugin)

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
