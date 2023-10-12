import { createPinia } from 'pinia'
import { _useGlobalStore } from './globalState'
import { toRaw } from 'vue'

/**********************************************
 *              Pinia持久化插件                *
 **********************************************/
const __piniaKey__ = 'coco'
const setStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}
const getStorage = (key) => {
  return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : {}
}
const piniaPlugin = (options) => {
  return (context) => {
    const { store } = context
    const data = getStorage(`${options?.key ?? __piniaKey__}-${store.$id}`)
    store.$subscribe(() => {
      setStorage(`${options?.key ?? __piniaKey__}-${store.$id}`, toRaw(store.$state))
    })
    return {
      ...data,
    }
  }
}

export const store = createPinia()
store.use(
  piniaPlugin({
    key: 'pinia',
  })
)

/*****************************************
 *             再次导出模块               *
 *****************************************/
export const useGlobalStore = _useGlobalStore
