import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Notice from '../views/Notice.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/notice',
    name: 'Notice',
    component: Notice
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, _from, next) => {
  fetch('http://127.0.0.1:5000/access?path=' + encodeURIComponent(to.path), 
    { 
      method: 'GET', 
      credentials: 'include',
      headers: {
        'X-Token-Scrypt': Vue.prototype.storage.tokenId
      }
    })
  .then(response => response.json())
  .then(json => {
    if (json.accessible) next();
    else next('/login');
  })
})

export default router
