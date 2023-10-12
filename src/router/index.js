import { createRouter, createWebHistory } from 'vue-router'

/**
 * 固定路由，没有登录可以看到的页面
 */
export const constantRoutes = [
  {
    path: '/',
    name: 'login',
    component: () => import('../views/login/index.vue'),
    hidden: true,
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/home/index.vue'),
  },
  {
    path: '/404',
    component: () => import('../views/error-page/404.vue'),
    hidden: true,
  },
]

/**
 * 获取不需要登录就可以访问的路径
 */
export function getConstantRoutes() {
  const result = []
  constantRoutes.forEach((route) => {
    result.push(route.path)
    if (route.children) {
      route.children.forEach((childRoute) => {
        result.push(childRoute)
      })
    }
  })
  return result
}

/**
 * 异步路由，登录后根据角色权限动态添加路由
 */
export const asyncRoutes = [
  // {
  //   path: '/zip',
  //   component: Layout,
  //   redirect: '/zip/download',
  //   alwaysShow: true,
  //   name: 'Zip',
  //   meta: { title: 'Zip', icon: 'zip' },
  //   children: [
  //     {
  //       path: 'download',
  //       component: () => import('@/views/zip/index'),
  //       name: 'ExportZip',
  //       meta: { title: 'Export Zip' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true },
]

/**
 * 创建路由
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
})

/**
 * 重新生成路由，注销的时候需要调用
 */
export function resetRouter() {
  const newRouter = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: constantRoutes,
  })
  router.matcher = newRouter.matcher // 重置路由
}

/**
 * 根据分身动态添加异步路由
 */
export function loadAsyncRoutes(roles) {
  let accessedRoutes
  if (roles.includes('admin')) {
    accessedRoutes = asyncRoutes || []
  } else {
    accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
  }
  router.addRoute(accessedRoutes)
}

export { router }
export default router
