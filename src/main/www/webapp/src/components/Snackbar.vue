<template>
    <v-snackbar v-model="show" :color="color" :timeout="4000">
        {{text}}
        <v-btn @click.native="show = false">Close</v-btn>
    </v-snackbar>
</template>

<script>
    export default {
        name: "Snackbar",
        data () {
            return {
                show: false,
                text: '',
                color: 'info'
            }
        },
        created: function () {
            this.$store.watch(state => state.snackbar.text, () => {
                const msg = this.$store.state.snackbar.text
                if (msg !== '') {
                    this.show = true
                    this.text = this.$store.state.snackbar.text
                    this.color = this.$store.state.snackbar.color
                    this.$store.commit('snackbar/setSnackbarMessage', { text: '', color: 'info' });
                }
            })
        }
    }
</script>

<style scoped>

</style>