import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './plugins/resource.js'
import './plugins/asyncdata.js'

Vue.config.productionTip = false

const storage = {}
Vue.prototype.storage = storage

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

export default storage;