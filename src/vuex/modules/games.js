import api from '../../api';

export default {
    state: {
        form: {
            marks: { coords: [], nextMark: 1 },
            links: [],
            scenes: [],
            challenges: []
        }
    },
    mutations: {
        FETCHGAME(state, game) {
            console.log(game);
            console.log(state);
            
            state.form.marks = game.marks ? { coords: [], nextMark: 1 } : JSON.parse(game.marks);
            state.form.links = game.links ? [] : JSON.parse(game.links);
            state.form.scenes = game.scenes ? [] : JSON.parse(game.scenes);
            state.form.challenges = game.challenges ? [] : JSON.parse(game.challenges);
        },
    },
    actions: {
        editGame({ commit }, id) {
            return api.get('/game/edit/' + id)
                .then(response => commit('FETCHGAME', response.data.game))
                .catch();
        },
        updateGame({ state }, id) {
            const game = {
                marks: JSON.stringify(state.form.marks),
                links: JSON.stringify(state.form.links),
                scenes: JSON.stringify(state.form.scenes),
                challenges: JSON.stringify(state.form.challenges)
            };
            return new Promise((resolve, reject) => {
                api.put('/game/update/' + id, game)
                    .then(response => resolve(response))
                    .catch(error => reject(error));
            });
        },
    }
};
