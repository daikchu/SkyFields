import Vue from 'vue';
import Router from 'vue-router';
// import axios from 'axios';

Vue.use(Router);
const router = new Router({
   /* mode: '',*/
    base: '/skyFields',
    routes: [
        {
            path: '/',
            name: 'Login',
            component: () => import('/src/App.vue'),
            meta: {requiredAuth: true},
            beforeEnter: (to, from, next) => {


            }
        },
        {
            path: '/jobs',
            name: 'ListJob',
            component: () => import('/src/views/jobs/proJobs.vue'),
            meta: {requiredAuth: true},
            beforeEnter: (to, from, next) => {

            }
        }
    ]
})