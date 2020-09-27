import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import less from 'less'
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:7000/api/private/v1/'
Vue.prototype.$http = axios
Vue.use(less)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
