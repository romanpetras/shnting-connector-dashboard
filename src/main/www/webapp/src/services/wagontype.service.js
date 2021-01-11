import { authHeader } from '@/helpers/auth-header';
import { commons } from "./commons";

const resourceUrl = process.env.VUE_APP_SHUNTING_CONNECTOR_URL + `/wagonType`;

export const wagonTypeService = {
    get,
    browse,
    save,
    getAll
};

function get(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(resourceUrl + `/${id}`, requestOptions)
        .then(commons.handleResponse);
}

function browse(offset, limit, filter) {
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

    return fetch(resourceUrl + `/browse`, requestOptions)
        .then(commons.handleResponse);
}

function save(obj) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(obj)
    };
    let url = resourceUrl + '/';
    if (obj.id) {
        url += obj.id;
    }
    return fetch(url, requestOptions)
        .then(commons.handleResponse);
}

async function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(resourceUrl + `/`, requestOptions)
        .then(commons.handleResponse);
}

function autocomplete(hint) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };
    return fetch(resourceUrl + `/search?hint=` + hint, requestOptions)
        .then(commons.handleResponse);
}
