import api from '../../api';

export default {
    state: {
        journeys: [],
    },
    mutations: {
        FETCH(state, journeys) {
            state.journeys = journeys;
        },
    },
    getters: {
        getJourney: state => id => {
            return state.journeys.data.find(journey => journey.id === id);
        }
    },
    actions: {
        fetchJourney(context, params) {
            context.commit('LOADING', true);
            return api.get('/journey/index', { params })
                .then(response => context.commit('FETCH', response.data))
                .catch()
                .finally(() => context.commit('LOADING', false));
        },
        fetchAllJourney(context, params) {
            context.commit('LOADING', true);
            return api.get('/journey/listall', { params })
                .then(response => context.commit('FETCH', response.data))
                .catch()
                .finally(() => context.commit('LOADING', false));
        },
        addJourney({}, formData) {
            return new Promise((resolve, reject) => {
                api.post('/journey/store', formData, { headers: { "Content-Type": "multipart/form-data" } })
                    .then(response => resolve(response))
                    .catch(error => reject(error));
            });
        },
        updateJourney({}, formData) {
            return new Promise((resolve, reject) => {
                api.post('/journey/update/' + formData.get('id'), formData, { headers: { "Content-Type": "multipart/form-data" } })
                    .then(response => resolve(response))
                    .catch(error => reject(error));
            });
        },
        deleteJourney({}, id) {
            return new Promise((resolve, reject) => {
                api.delete('/journey/destroy/' + id)
                    .then(response => resolve(response.data))
                    .catch(error => reject(error));
            });
        },
    }
};
