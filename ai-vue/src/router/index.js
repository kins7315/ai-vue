import { createRouter, createWebHistory } from 'vue-router'
import BackendLayout from '../components/backendLayout.vue'
import AuthLayout from '../components/AuthLayout.vue'
import FrontendLayout from '../components/FrontendLayout.vue'


// 路由的配置
const backendRoutes = [
  {
    path: '/back',
    redirect: '/back/dashboard',//默认跳转路径
    component: BackendLayout,
    children: [
      {
        path: 'dashboard',
        component: () => import('../views/admin/dashboard.vue'),
        meta: {
          title: '数据分析',
          icon: 'PieChart'
        }
      },
      {
        path: 'knowledge',
        component: () => import('../views/admin/knowledge.vue'),
        meta: {
          title: '知识文章',
          icon: 'ChatLineSquare'
        }
      },
      {
        path: 'consultations',
        component: () => import('../views/admin/consultations.vue'),
        meta: {
          title: '咨询记录',
          icon: 'Message'
        }
      },
      {
        path: 'emotional',
        component: () => import('../views/admin/Emotional.vue'),
        meta: {
          title: '情绪日志',
          icon: 'User'
        }
      }
    ]
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        component: () => import('../views/front/login.vue'),
        meta: {
          title: '登录'
        }
      },
      {
        path: 'register',
        component: () => import('../views/front/register.vue'),
        meta: {
          title: '注册'
        }
      }

    ]
  }
]

const frontendRoutes = [
  {
    path: '/',
    component: FrontendLayout,
    children: [
      {
        path: '',
        component: () => import('../views/front/Home.vue'),
      },
      {
        path: 'consultation',
        component: () => import('../views/front/consultation.vue'),
      },
      {
        path: 'emotional-diary',
        component: () => import('../views/front/emotionalDiary.vue'),
      },
      {
        path: 'knowledge',
        component: () => import('../views/front/frontKnowledge.vue'),
      },
      {
        path: 'knowledge/article/:id',
        component: () => import('../views/front/articleDetail.vue'),
        props: true
      },
      {
        path: 'contact',
        component: () => import('../views/userDropdown/contact.vue'),
      },
      {
        path: 'personal-center',
        component: () => import('../views/userDropdown/PersonalCenter.vue'),
      },
      {
        path: 'feedback',
        component: () => import('../views/userDropdown/Feedback.vue'),
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: [...backendRoutes, ...frontendRoutes]
})
// 路由前置守卫
// router.beforeEach((to, from, next) => {
//   const token = localStorage.getItem('token')
//   if (token) {
//     //用户是否登录
//     const userInfo = JSON.parse(localStorage.getItem('userInfo'))
//     //如果是管理员
//     if (userInfo.userType == 2) {
//       if (to.path.startsWith('/back')) {
//         next()
//       } else {
//         next('/back/dashboard')
//       }
//     } else if (userInfo.userType == 1) {
//       //普通用户只能访问前台界面
//       if (to.path.startsWith('/back') || to.path.startsWith('/auth')) {
//         next('/')
//       } else {
//         next()
//       }
//     }
//   } else {
//     if (to.path.startsWith('/back')) {
//       //如果是访问后台页面
//       next('/auth/login')
//     } else {
//       next()
//     }
//   }
// })

export default router