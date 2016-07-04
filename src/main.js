import Vue from 'vue'
import Router from 'vue-router'
import { domain, fromNow } from './filters'
import App from './views/App.vue'
import VueAnimatedList from 'vue-animated-list'
import returnPdView from './views/returnPdView'
import storesView from './views/storesView'
import couponView from './views/couponView'
import evaluationView from './views/evaluation'
import couponDetailView from './views/couponView/couponDetail'
import mycouponView from './views/mycouponView'
import qrbacodeView from './views/qrbacodeView'
import registerView from './views/registerView'

// import returnPdView0 from './views/returnPdView0'
import tryscroller from './views/try/scroller.vue'


// import App from './components/App.vue'
// import NewsView from './components/NewsView.vue'
// import ItemView from './components/ItemView.vue'
// import UserView from './components/UserView.vue'
// import test from './views/test'
// import couponView from './views/couponView.vue'
// import {UrlParam} from './tools/GetUrlParam'
// let urlParam=UrlParam()
//开启测试
if(location.host.match('192.168')||location.host.match('127.0.0.1')||location.host.match('localhost')){
  Vue.config.debug = true
}
// install router
Vue.use(Router)
Vue.use(VueAnimatedList)

// register filters globally
Vue.filter('fromNow', fromNow)
Vue.filter('domain', domain)

// routing
var router = new Router()

router.map({
  // '/news/:page': {
  //   component: NewsView
  // },
  // '/user/:id': {
  //   component: UserView
  // },
  // '/item/:id': {
  //   component: ItemView
  // },
  '/returnProducts':{
    component:returnPdView
  },
  '/evaluation':{
    component:evaluationView,
    name:'evaluation'
  },
  '/coupon':{
    component:couponView,
    name:'coupon'
  },
  '/couponDetail/:code':{
    component:couponDetailView,
    name:'couponDetail'
  },
  '/mycoupon':{
    component:mycouponView,
     name: 'mycoupon',
  },
  '/qrbacode/:code/:name':{
    component:qrbacodeView,
    name: 'qrbacode',
  },
  '/stores':{
    component:storesView
  },
  // '/test':{
  //   component:returnPdView0
  // },
  '/try':{
    component:tryscroller
  },
  '/register':{
    component:registerView
  }
})

router.beforeEach(function () {
  window.scrollTo(0, 0)
})
// if(urlParam.action.type==9){
//   router.redirect({
//     '*': '/coupon'
//   })
// }else {
  router.redirect({
    '*': '/returnProducts'
  })
// }


router.start(App, '#app')
