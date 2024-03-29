import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import AuthList from '../components/power/AuthList.vue'
import RoleAuth from '../components/power/RoleAuth.vue'
import Dept from '../components/user/Dept.vue'
import CheckList from '../components/knowledge/CheckList.vue'
import KnowledgeList from '../components/knowledge/knowledgeList.vue'
import Index from '../components/client/Index.vue'
import MyKnowledge from '../components/client/workbench/MyKnowledge.vue'
import MyCollect from '../components/client/workbench/MyCollect.vue'
import KnowledgeIndex from '../components/client/allKnowledge/KnowledgeIndex.vue'
import AllKnowledge from '../components/client/allKnowledge/AllKnowledge.vue'
import MyMistake from '../components/client/workbench/MyMistake.vue'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: 'Login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/authList', component: AuthList },
        { path: '/roleAuth', component: RoleAuth },
        { path: '/dept', component: Dept },
        { path: '/checkList', component: CheckList },
        { path: '/knowledgeList', component: KnowledgeList }
      ]
    },
    {
      path: '/index',
      name: 'Index',
      component: Index,
      redirect: '/myKnowledge',
      children: [
        { path: '/myKnowledge', component: MyKnowledge },
        { path: '/myCollect', component: MyCollect },
        { path: '/myMistake', component: MyMistake },
        {
          path: '/knowledgeIndex',
          component: KnowledgeIndex,
          redirect: '/allKnowledge',
          children: [
            { path: '/allKnowledge', component: AllKnowledge }
          ]
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
