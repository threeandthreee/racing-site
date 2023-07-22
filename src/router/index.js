import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BingoView from '../views/BingoView.vue'
import ChecklistView from '../views/ChecklistView.vue'
import AdminView from '../views/AdminView.vue'
import InstructionsView from '../views/InstructionsView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/bingo',
    name: 'bingo',
    component: BingoView
  },
  {
    path: '/checklist',
    name: 'checklist',
    component: ChecklistView
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView
  },
  {
    path: '/instructions',
    name: 'instructions',
    component: InstructionsView
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
