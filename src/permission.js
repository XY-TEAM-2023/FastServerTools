import { router, loadAsyncRoutes } from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { useGlobalStore } from './store'
import { toRef } from 'vue'
import { ElMessageBox } from 'element-plus'

/**
 * 登录页面
 */
const loginPageUrl = '/home'

export function setupPermission() {
  NProgress.configure({ showSpinner: false }) // NProgress Configuration

  router.beforeEach(async (to, from, next) => {
    // start progress bar
    NProgress.start()
    const globalState = useGlobalStore()
    console.log('appName: ', globalState.appName)
    console.log('loginStatus: ', globalState.loginStatus)
    console.log('whiteList: ', globalState.whiteRouters)
    console.log('roles: ', globalState.roles)

    // 设置页面标题
    if (to.meta.title) {
      document.title = `${to.meta.title} - ${globalState.appName}`
    } else {
      document.title = `${globalState.appName}`
    }
    console.log('document.title = ', document.title)

    if (globalState.loginStatus == 1) {
      if (to.path === loginPageUrl) {
        // 已登录, 访问登录页面，自动重定向到主页
        next({ path: '/' })
        NProgress.done()
      } else {
        const hasRoles = globalState.roles.length > 0
        if (hasRoles) {
          // 已经获取过用户角色
          next()
        } else {
          try {
            // 请求获取用户角色
            const response = await window.app.$get('user/getInfo')
            // 获取响应里的roles
            const { new_roles } = response
            // 更新全局数据
            roles.value = new_roles
            // 动态生成路由
            loadAsyncRoutes(new_roles)

            // 设置replace: true，这样导航就不会留下历史记录
            next({ ...to, replace: true })
          } catch (error) {
            Message.error(error || 'Has Error')
            next(false)
          } finally {
            NProgress.done()
          }
        }
      }
    } else {
      if (globalState.whiteRouters.indexOf(to.path) !== -1) {
        // 在白名单里, 继续访问
        console.log('在白名单里, 继续访问')
        if (to.path === loginPageUrl) {
          // 切换用户状态为未登录
          globalState.logout()
          loginStatus.value = 0
          authorization.value = ''
          roles.value = []
        }
        next()
      } else {
        if (loginStatus.value === 2) {
          NProgress.done()

          // 登录过期
          ElMessageBox.alert('您的身份已过期，请重新登录。', '提示', {
            confirmButtonText: '重新登录',
            type: 'warning',
            callback: () => {
              next(loginPageUrl + '?redirect=${to.path}')
            },
          })
        } else {
          // 没有登录
          console.log('需要登录, 跳转到登录页面 ' + loginPageUrl)
          next(loginPageUrl + '?redirect=${to.path}')
          NProgress.done()
        }
      }
    }
  })

  router.afterEach(() => {
    // finish progress bar
    NProgress.done()
  })
}
