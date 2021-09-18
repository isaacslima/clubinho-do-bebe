import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Clientes from '../views/Clientes.vue'
import Produtos from '../views/Produtos.vue'
import Aluguel from '../views/Aluguel.vue'
import Login from '../views/Login.vue'
import Calendario from '../views/Calendario.vue'

Vue.use(VueRouter)

const routes = [{
    path: '*',
    redirect: '/login',
  },
  {
    path: '/', redirect: '/login',
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/clientes',
    name: 'Clientes',
    component: Clientes,
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/produtos',
    name: 'Produtos',
    component: Produtos,
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/aluguel',
    name: 'Aluguel',
    component: Aluguel,
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/calendario',
    name: 'Calendário',
    component: Calendario,
    meta: {
      requiresAuth: true
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
