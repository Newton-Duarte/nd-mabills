import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from './views/Dashboard.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/incomes',
      name: 'incomes',
      component: () => import('./views/Incomes.vue')
    },
    {
      path: '/expenses',
      name: 'expenses',
      component: () => import('./views/Expenses.vue')
    },
    {
      path: '/accounts',
      name: 'accounts',
      component: () => import('./views/Accounts.vue')
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('./views/Categories.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('./views/About.vue')
    }
  ]
})
