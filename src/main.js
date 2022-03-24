import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Element from "element-ui"
import "element-ui/lib/theme-chalk/index.css"

import axios from './axios'
import global from './globalFun'
Vue.prototype.$axios = axios
Vue.config.productionTip = false

import VueAMap from 'vue-amap'

Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: '51c0df0bebf287fed5424fe8b415d6d0',
  plugin: [                // 这里根据自己项目按需引入插件
    'Autocomplete',
    'PlaceSearch',
    'Scale',
    'OverView',
    'ToolBar',
    'MapType',
    'PolyEditor',
    'AMap.CircleEditor'
  ]
});

// require("./mock.js")

Vue.use(Element)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
