import Vue from 'vue'
import Router from 'vue-router'
import Surf from '@/components/Surf'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Surf',
      component: Surf
    },
    { path: '*', redirect: '/' }
  ],
  scrollBehavior (to, from, savedPosition) {
    return {x: 0, y: 0}
  }
})
