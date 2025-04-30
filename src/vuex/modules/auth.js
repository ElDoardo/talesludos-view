import api from '../../api';

const state = {
    me: {},
    authenticated: false
}

const mutations = {
    AUTH_USER_OK(state, user) {
        state.me = user;
        state.authenticated = true
    },
    AUTH_USER_LOGOUT(state) {
        state.me = {};
        state.authenticated = false
    }
}

const actions = {
    login(context, formData) {
        return new Promise((resolve, reject) => {
            api.post('/auth/login', formData)
                .then(response => {
                    context.commit('AUTH_USER_OK', response.data.user)
                    localStorage.setItem('token', response.data.access_token)
                    resolve(response)
                })
                .catch(error => {
                    reject(error.response?.data || error.message)
                })
        })
    },

    logout(context) {
        return new Promise((resolve, reject) => {
            api.post('/auth/logout')
                .then(response => {
                    localStorage.removeItem('token')
                    context.commit('AUTH_USER_LOGOUT')
                    resolve(response)
                })
                .catch(error => {
                    reject(error.response?.data || error.message)
                })
        })
    },

    register(context, formData) {
        return new Promise((resolve, reject) => {
            api.post("/auth/register", formData)
                .then(response => {
                    context.commit('AUTH_USER_OK', response.data.user)
                    localStorage.setItem('token', response.data.access_token)
                    resolve(response);
                })
                .catch(error => {
                    reject(error.response?.data || error.message);
                });
        });
    },

    forgotpassword({ }, formData) {
        return new Promise((resolve, reject) => {
            api.post("/auth/forgotpassword", formData)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error.response?.data || error.message);
                });
        });
    },

    resetpassword({ }, formData) {
        return new Promise((resolve, reject) => {
            api.post("/auth/resetpassword", formData)
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    reject(error.response?.data || error.message);
                });
        });
    },
}

export default {
    state,
    mutations,
    actions
}