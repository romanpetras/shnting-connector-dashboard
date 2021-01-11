<template>
    <div>
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn fab small class="mx-2" v-on="on" @click="browseFirst" :disabled="browseOffset <= 0">
                    <v-icon>mdi-arrow-collapse-left</v-icon>
                </v-btn>
            </template>
            <span>Prima pagina</span>
        </v-tooltip>

        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn fab small class="mx-2" v-on="on" @click="browsePrev" :disabled="browseOffset <= 0">
                    <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
            </template>
            <span>Pagina precedente</span>
        </v-tooltip>

        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn fab small class="mx-2" v-on="on" @click="browseNext"
                       :disabled="browseOffset + browseLimit >= browseCount">
                    <v-icon>mdi-arrow-right</v-icon>
                </v-btn>
            </template>
            <span>Pagina successiva</span>
        </v-tooltip>

        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn fab small class="mx-2" v-on="on" @click="browseLast"
                       :disabled="browseOffset + browseLimit >= browseCount">
                    <v-icon>mdi-arrow-collapse-right</v-icon>
                </v-btn>
            </template>
            <span>Ultima pagina</span>
        </v-tooltip>
    </div>
</template>

<script>
    export default {
        name: "TablePaging",
        props: [
            'browseCount',
            'browseLimit',
            'browseOffset'
        ],
        methods: {
            browsePrev: function () {
                this.$emit('offsetChanged', this.browseOffset - this.browseLimit);
            },
            browseNext: function () {
                this.$emit('offsetChanged', this.browseOffset + this.browseLimit);
            },
            browseFirst: function () {
                this.$emit('offsetChanged', 0);
            },
            browseLast: function () {
                this.$emit('offsetChanged', this.browseLimit * Math.floor(this.browseCount / this.browseLimit));
            }
        }
    }
</script>

<style scoped>

</style>