import { createRouter, createWebHashHistory } from 'vue-router'
import { isLoggedIn } from '../api/auth.js'

const routes = [
  {
    path: '/',
    redirect: () => isLoggedIn() ? '/home' : '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/digimon/:id',
    name: 'DigimonDetail',
    component: () => import('../views/DigimonDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/digimon',
    name: 'Digimon',
    component: () => import('../views/Digimon.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/battle',
    name: 'Battle',
    component: () => import('../views/Battle.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/hatch/:eggId',
    name: 'Hatch',
    component: () => import('../views/Hatch.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/shop',
    name: 'Shop',
    component: () => import('../views/Shop.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/trade',
    name: 'Trade',
    component: () => import('../views/Trade.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/dex',
    name: 'Dex',
    component: () => import('../views/Dex.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/skills',
    name: 'Skills',
    component: () => import('../views/Skills.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/backpack',
    name: 'Backpack',
    component: () => import('../views/Backpack.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isLoggedIn()) {
    next('/login')
  } else if ((to.path === '/login' || to.path === '/register') && isLoggedIn()) {
    next('/home')
  } else {
    next()
  }
})

export default router
