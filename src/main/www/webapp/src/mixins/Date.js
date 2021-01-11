import moment from "moment";

export default {
    methods: {
        dateTimeObjToString(date) {
            if (!date) return null
            return moment(date).format('YYYY-MM-DD[T]HH:mm:ss')
        },
        dateTimeObjToItaString(date) {
            if (!date) return null
            return moment(date).format('DD/MM/YYYY HH:mm:ss')
        },
        dateTimeStringToObject(date) {
            if (!date) return null
            return moment(date,'YYYY-MM-DD[T]HH:mm:ss').toDate()
        },
        dateTimeItaStringToObject(date) {
            if (!date) return null
            return moment(date,'DD/MM/YYYY HH:mm:ss').toDate()
        },
        getYesterdayStartOfDay() {
            return moment().subtract(1, 'days').startOf('day').toDate();
        },
        getTomorrowEndOfDay() {
            return moment().add(1, 'days').endOf('day').toDate();
        },
    }
}