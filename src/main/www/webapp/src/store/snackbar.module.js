const state = {
    show: false,
    text: '',
    color: 'info'
}

const mutations = {
    setSnackbarMessage(state, {text, color}) {
        state.text = text;
        state.color = color;
        state.show = true;
    },
}

export const snackbar = {
    namespaced: true,
    state,
    mutations
}