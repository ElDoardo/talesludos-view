import register from '../components/auth/Register.vue';
import login from '../components/auth/Login.vue';
import forgotpassword from '../components/auth/ForgotPassword.vue';
import resetpassword from '../components/auth/ResetPassword.vue';

import repository from '../components/web/Repository.vue';
import history from '../components/web/History.vue';
import contact from '../components/web/Contact.vue';
import page404 from '../components/web/Page404.vue';

import showgame from '../components/game/ShowGame.vue';
import viewgame from '../components/game/ViewGame.vue';
import drawgame from '../components/game/DrawGame.vue';

import journeyedit from '../components/journey/JourneyEdit.vue';
import journeylist from '../components/journey/JourneyList.vue';


export default [
    {
        name: 'register',
        path: '/register',
        component: register,
        meta: { auth: false }
    },
    {
        name: 'login',
        path: '/login',
        component: login,
        meta: { auth: false }
    },
    {
        name: 'forgotpassword',
        path: '/forgot-password',
        component: forgotpassword,
        meta: { auth: false }
    },
    {
        name: 'resetpassword',
        path: '/reset-password/:token',
        component: resetpassword,
        meta: { auth: false }
    },
    {
        name: 'History',
        path: '/',
        component: history,
        meta: { auth: false }
    },
    {
        name: 'Contact',
        path: '/contact',
        component: contact,
        meta: { auth: false }
    },
    {
        name: 'JourneyList',
        path: '/journey-list',
        component: journeylist,
        meta: { auth: true }
    },
    {
        name: 'Showgame',
        path: '/game-show',
        component: showgame,
        props: true,
        meta: { auth: false }
    },
    {
        name: 'Viewgame',
        path: '/game-view',
        component: viewgame,
        props: true,
        meta: { auth: false }
    },
    {
        name: 'Repository',
        path: '/repository',
        component: repository,
        meta: { auth: false }
    },
    {
        name: 'JourneyEdit',
        path: '/game-edit',
        component: journeyedit,
        props: true,
        meta: { auth: true }
    },
    {
        name: 'DrawGame',
        path: '/game-draw',
        component: drawgame,
        props: true, //{ title, image }
        meta: { auth: true }
    },
    // Rota 404
    { path: '*', component: page404 },
]

