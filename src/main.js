import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Snotify, { SnotifyPosition } from 'vue-snotify'


import 'vue-snotify/styles/material.css'
import 'bootstrap-css-only/css/bootstrap.min.css'
import 'mdbvue/lib/css/mdb.min.css'

import store from './vuex/store'
import router from './routes/routers'
import MainApp from './components/MainApp.vue'

// Global components
import GameCanvas from './components/game/GameCanvas.vue'
Vue.component('game-canvas', GameCanvas)

// Configuração do Snotify
const options = {
    toast: {
        timeout: 2000,
        showProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        position: SnotifyPosition.rightTop
    }
}

// Plugins
Vue.use(VueRouter)
Vue.use(VueAxios, axios)
Vue.use(Snotify, options)

// App
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(MainApp)
})
