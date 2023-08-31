import { createWebHistory, createRouter } from 'vue-router'
import Zzz from '@/views/Zzz.vue'
import Type from '@/views/Type.vue'

const routes = [
  {
    path: '/',
    name: 'Type',
    component: Type,
  },
  {
    path: '/zzz',
    name: 'Zzz',
    component: Zzz,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router