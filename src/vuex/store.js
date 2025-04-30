import Vue from 'vue'
import Vuex from 'vuex'

import journeys from './modules/journeys'
import games from './modules/games'
import areas from './modules/areas'
import auth from './modules/auth'
import preloader from './modules/preloader'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        journeys: journeys,
        games: games,
        areas: areas,
        auth: auth,
        preloader: preloader
    },
    plugins: [createPersistedState({
        paths: ['areas']
    })]
})
