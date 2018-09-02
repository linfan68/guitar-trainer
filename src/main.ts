console.log('LOADED')
import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
const smoothscroll = require('smoothscroll-polyfill')

// kick off the polyfill!
smoothscroll.polyfill();

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
