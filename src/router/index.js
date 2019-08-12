import Vue from 'vue'
import Router from 'vue-router'
import Surf from '@/components/Surf'
import CIP from '@/components/CIP'
import AD_Grab from '@/components/AD_Grab'
import LookUp from '@/components/LookUp'
import Vml from '@/components/vml'
import ADP from '@/components/ADP'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Surf',
      component: Surf
    },
    {
      path: '/CIP',
      name: 'CIP',
      component: CIP
    },
    {
      path: '/AD_Grab',
      name: 'AD_Grab',
      component: AD_Grab
    },
    {
      path: '/LookUp',
      name: 'LookUp',
      component: LookUp
    },
    {
      path: '/vml',
      name: 'vml',
      component: Vml
    },
    {
      path: '/ADP',
      name: 'ADP',
      component: ADP
    },
    { path: '*', redirect: '/' }
  ],
  scrollBehavior (to, from, savedPosition) {
    return {x: 0, y: 0}
  }
})
