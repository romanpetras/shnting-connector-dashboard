import { usersService } from "./users.service";

export const commons = {
    handleResponse,
    backendUrl
};

function backendUrl() { return process.env.VUE_APP_BACKEND_URL; }

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                usersService.logout()
                location.reload(true);
            }
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}
