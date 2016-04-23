import Vue from 'vue'
import Router from 'vue-router'
import { domain, fromNow } from './filters'
// import App from './components/App.vue'
import App from './views/App.vue'
import NewsView from './components/NewsView.vue'
import ItemView from './components/ItemView.vue'
import UserView from './components/UserView.vue'
import returnPdView from './views/returnPdView.vue'

Vue.config.debug = true
// install router
Vue.use(Router)

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
  }
})

router.beforeEach(function () {
  window.scrollTo(0, 0)
})

router.redirect({
  '*': '/returnProducts'
})

router.start(App, '#app')
