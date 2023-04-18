import {createRouter, createWebHistory} from "vue-router";
import {supabase} from "@/supabase/init.js";


const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "Home" */ '../views/Home.vue'),
    meta: {
      title: 'Home',
      auth: false
    }
  },

  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "Login" */ '../views/Login.vue'),
    meta: {
      title: 'Login',
      auth: false
    }
  },

  {
    path: '/register',
    name: 'register',
    component: () => import(/* webpackChunkName: "Register" */ '../views/Register.vue'),
    meta: {
      title: 'Register',
      auth: false
    }
  },

  {
    path: '/create',
    name: 'create',
    component: () => import(/* webpackChunkName: "Create" */ '../views/Create.vue'),
    meta: {
      title: 'Create',
      auth: true
    }
  },

  {
    path: '/workout/:id',
    name: 'view-workout',
    component: () => import(/* webpackChunkName: "ViewWorkout" */ '../views/ViewWorkout.vue'),
    meta: {
      title: 'View Workout',
      auth: false
    }
  },
]



const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | Workout Tracker`
  next()
})

router.beforeEach(async (to, from, next) => {

  const {data: { user }} = await supabase.auth.getUser()

  if (to.matched.some(record => record.meta.auth)) {
    if (user) {
      next()
      return
    }

    next({ name: 'login' })
    return;
  }

  next()
})



export default router
