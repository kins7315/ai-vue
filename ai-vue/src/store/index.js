import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menu', {
  state: () => ({
    isCollapsed: false
  }),
  actions: {
    // 切换菜单折叠状态
    toggleCollapsed() {
      this.isCollapsed = !this.isCollapsed
    }
  }
})