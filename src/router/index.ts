import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import Home from '../pages/Home.vue'
import Clients from '../pages/Clients.vue'
import Accounting from '../pages/Accounting.vue'
import Invoices from '../pages/Invoices.vue'
import Settings from '../pages/Settings.vue'


const routes: Array<RouteRecordRaw> = [
    { path: '/', name:"home", component: Home},
    { path: '/clients',name:"clients",  component: Clients},
    { path: '/accounting', name:"accounting", component: Accounting},
    { path: '/invoices', name:"invoices", component: Invoices},
    { path: '/settings', name:"settings", component: Settings},
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;