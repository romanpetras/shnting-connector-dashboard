import {authHeader} from "@/helpers/auth-header";
import { commons } from './commons'

export const usersService = {
    login,
    logout,
    getUser,
    browseUsers,
    saveUser,
    whoAmI,
};

const resourceUrl = process.env.VUE_APP_USER_MANAGER_URL + `/users`;

function login(username, password) {

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, password: password })
    };

    return fetch(process.env.VUE_APP_USER_MANAGER_URL + `/auth/`, requestOptions)
        .then(commons.handleResponse)
        .then(response => {
            if (response.token) {
                sessionStorage.setItem('token', response.token);
            }
            if (response.user) {
                sessionStorage.setItem('user', JSON.stringify(response.user));
            }
            return response;
        });
}

function logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
}

function getUser(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(resourceUrl + `/${id}`, requestOptions).then(commons.handleResponse);
}

function browseUsers(offset, limit, filter) {

    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
            offset: offset,
            limit: limit,
            filter: filter,
            sortingList: []
        })
    };

    return fetch(resourceUrl + `/browse`, requestOptions).then(commons.handleResponse);
}

function saveUser(user) {

    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    let url = resourceUrl + '/';
    if (user.id) {
        url += user.id;
    }
    return fetch(url, requestOptions).then(commons.handleResponse);
}

function whoAmI() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(resourceUrl + `/whoami`, requestOptions).then(commons.handleResponse);
}
