import api from '../../api';

export default {
    state: {
        areas: [],
    },
    mutations: {
        FETCHAREA(state, areas) {
            state.areas = areas;
        },
    },
    actions: {
        fetchareas({ commit }) {
            return new Promise((resolve, reject) => {
                api.get('/areas')
                    .then(response => {
                        commit('FETCHAREA', response.data);
                        resolve(response);
                    })
                    .catch(error => reject(error));
            });
        }
    }
}
