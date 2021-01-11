import { usersService } from "../services/users.service";
import { router } from "../router";

const token = sessionStorage.getItem('token');
const userString = sessionStorage.getItem('user');

const state = token
    ? { status: { loggedIn: true }, token, user: JSON.parse(userString) }
    : { status: {}, token: null, user: null };

const actions = {
    login({ dispatch, commit }, { username, password }) {
        commit('loginRequest', { username });
        usersService.login(username, password)
            .then(
                response => {
                    commit('loginSuccess', response);
                    try {
                        router.push('/app');
                    } catch (e) {
                        console.error(e)

                    }
                },
                error => {
                    commit('loginFailure', error);
                    dispatch('alert/error', error, { root: true });
                }
            );
    },
    logout({ commit }) {
        usersService.logout();
        commit('logout');
//        router.push('/');
    }
};

const mutations = {
    loginRequest(state, token) {
        state.status = { loggingIn: true };
        state.token = token;
    },
    loginSuccess(state, response) {
        state.status = { loggedIn: true };
        state.token = response.token;
        state.user = response.user;
    },
    loginFailure(state) {
        state.status = {};
        state.token = null;
        state.user = null;
    },
    logout(state) {
        state.status = {};
        state.token = null;
        state.user = null;

        if (router.currentRoute.path !== '/')
            router.push('/');
    },
}

export const account = {
    namespaced: true,
    state,
    actions,
    mutations
}