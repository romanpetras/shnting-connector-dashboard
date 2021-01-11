import Vue from 'vue';
import Router from 'vue-router';

import LandingPage from "./components/LandingPage";
import MainPage from "./components/MainPage";
import DashboardPage from "./components/DashboardPage";
import SimulationRequestBrowser from "@/components/SimulationRequestBrowser";
import SimulationRequestEditor from "@/components/SimulationRequestEditor";
import MissionEditor from "@/components/MissionEditor";
import MainManeuverEditor from "@/components/MainManeuverEditor";
import MissionTaskEditor from "@/components/MissionTaskEditor";

Vue.use(Router);

export const router = new Router({
    mode: 'history',
    base: '',
    routes: [
        { path: '/', name: 'landing', component: LandingPage, meta: { title: '' } },
        { path: '/app', name: 'main', component: MainPage, meta: { title: '' },
            children : [
                { path: 'dashboard', name: 'dashboard', component: DashboardPage },
                { path: 'simulationrequest', name: 'simulationRequestBrowser', component: SimulationRequestBrowser },
                { path: 'simulationrequest/:id', name: 'simulationRequestEditor', component: SimulationRequestEditor },
                { path: 'mission/:id', name: 'missionEditor', component: MissionEditor },
                { path: 'missiontask/:id', name: 'missionTaskEditor', component: MissionTaskEditor },
                { path: 'mainmaneuver/:id', name: 'mainManeuverEditor', component: MainManeuverEditor },
            ]
        },
        { path: '*', redirect: '/' }
    ]
});

router.beforeEach((to, from, next) => {
    const publicPages = ['/'];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = sessionStorage.getItem('token');
    if (authRequired && !loggedIn) {
        return next('/');
    }
    next();
})