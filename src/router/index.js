import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import EventView from '../views/EventView.vue'
import BingoView from '../views/BingoView.vue'
import AdminView from '../views/AdminView.vue'
import GuideView from '../views/GuideView.vue'
import GuidesView from '../views/GuidesView.vue'
import PlayerView from '../views/PlayerView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/next',
    name: 'next',
    component: EventView
  },
  {
    path: '/event/:id',
    name: 'event',
    component: EventView
  },
  {
    path: '/bingo',
    name: 'bingo',
    component: BingoView
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView
  },
  {
    path: '/join',
    redirect: '/next'
  },
  {
    path: '/instructions',
    redirect: '/next'
  },
  {
    path: '/guide/:slug',
    name: 'guide',
    component: GuideView
  },
  {
    path: '/guides',
    name: 'guides',
    component: GuidesView
  },
  {
    path: '/player/:short',
    name: 'player',
    component: PlayerView
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
