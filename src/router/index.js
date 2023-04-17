import {createRouter, createWebHistory} from "vue-router";


const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "Home" */ '../views/Home.vue')
  },

  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "Login" */ '../views/Login.vue')
  },

  {
    path: '/register',
    name: 'register',
    component: () => import(/* webpackChunkName: "Register" */ '../views/Register.vue')
  },

  {
    path: '/create',
    name: 'create',
    component: () => import(/* webpackChunkName: "Create" */ '../views/Create.vue')
  },

  {
    path: '/workout/:id',
    name: 'view-workout',
    component: () => import(/* webpackChunkName: "ViewWorkout" */ '../views/ViewWorkout.vue')
  },
]



const router = createRouter({
  history: createWebHistory(),
  routes
})



export default router
