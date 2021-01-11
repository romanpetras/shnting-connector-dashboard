export const dateFilter = {
    formatDate
}

import moment from 'moment';

function formatDate(value) {
    if (value) {
        return moment(String(value)).format('DD/MM/YYYY HH:mm')
    }
}