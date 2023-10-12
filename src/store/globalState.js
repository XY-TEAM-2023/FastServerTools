import { defineStore } from 'pinia'
import { getConstantRoutes } from '../router'

/**
 * 全局数据
 */
export const _useGlobalStore = defineStore('Gloabl', {
  state: () => {
    return {
      /** 应用名 */
      appName: import.meta.env.VITE_APP_NAME,
      /** 语言 */
      documentLang: 'en',
      /** 登录状态 */
      _login_status: 0,
      /** JWT令牌 */
      _jwt: '',
      /** 角色、权限 */
      roles: [],
      /** 不需要登录就可以访问的路由 */
      _whiteRouters: [],
    }
  },
  // computed 修饰值，有缓存
  getters: {
    /**
     * 给服务器发送请求的地址
     */
    baseUrl() {
      return process.env.NODE_ENV === 'development' ? import.meta.env.VITE_APP_BASE_API : import.meta.env.VITE_APP_BASE_API_TO_URL // 设置API的基本URL
    },
    /**
     * 获取登录状态。0：未登录，1：已登录，2：登录已失效
     */
    loginStatus() {
      if (this._login_status !== 1) {
        return this._login_status
      }

      // 已登录，但是JWT不存在，当做登录失效处理
      if (this._jwt === '') {
        this._login_status = 2
        return this._login_status
      }

      // 已登录，但是JWT已经失效
      if (isJwtExpired(this._jwt)) {
        this._login_status = 2
        return this._login_status
      }

      return this.loginStatus
    },
    /** 不需要登录就可以访问的路由列表 */
    whiteRouters() {
      if (this._whiteRouters.length == 0) {
        this._whiteRouters = getConstantRoutes()
      }

      return this._whiteRouters
    },
  },
  // 支持同步异步，提交数据到state
  actions: {
    /**
     * 设置登录状态
     */
    setLoginStatus(loginStatus) {
      this.loginStatus = value ? 1 : 0
    },
    /**
     * 用户注销登录
     */
    logout() {
      this.loginStatus = 0
      this.jwt = ''
    },
    /**
     * 设置文档语言
     */
    setDocumentLang(lang) {
      this.documentLang = lang
    },
  },
})

/** JWT是否已过期 */
function isJwtExpired(jwt) {
  const [header, payload, signature] = jwt.split('.')
  const decodedPayload = atob(payload)
  const payloadObj = JSON.parse(decodedPayload)
  const expirationTime = payloadObj.exp * 1000 // JWT中的exp是以秒为单位的，乘以1000转换为毫秒
  const currentTime = Date.now()

  return currentTime > expirationTime
}
