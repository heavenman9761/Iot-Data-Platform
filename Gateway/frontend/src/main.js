import Vue from 'vue'
import App from './App.vue'
import router from './Routes'
import store from './store/index'
import vuetify from './plugins/vuetify'
import * as VueGoogleMaps from 'vue2-google-maps';
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import VuetifyDialog from 'vuetify-dialog'
import 'vuetify-dialog/dist/vuetify-dialog.css'
import VueSocketIO from 'socket.io-client'

// var socket = VueSocketIO('http://127.0.0.1:6008', {transports: ['websocket', 'polling']})
var socket = VueSocketIO('http://127.0.0.1:6007')
Vue.prototype.$socket = socket

Vue.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 20,
  newestOnTop: true,
  position: "bottom-right",
  timeout: 1500,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: "button",
  icon: true,
  rtl: false
});

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyB7OXmzfQYua_1LEhRdqsoYzyJOPh9hGLg',
  },
});

Vue.use(VuetifyDialog, {
  context: {
    vuetify
  }
});

Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  render: h => h(App), store
}).$mount('#app')
