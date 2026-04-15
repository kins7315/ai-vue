<template>
  <el-aside height="264px" :class="{'collapsed': menuStore.isCollapsed}">
    <el-menu :collapse="menuStore.isCollapsed" :collapse-transition="false" default-active="2" class="el-menu-vertical-demo">
      <div class="brand">
        <el-image style="width: 50px; height: 50px; margin-right: 10px;" :src="iconUrl" alt="logo" />
        <div v-show="!menuStore.isCollapsed" class="info-card">
          <h1 class="brand-title">小KAI助手</h1>
          <p class="brand-subtitle">管理后台</p>
        </div>
      </div>
      <el-menu-item @click="selectMenu" v-for="item in router.options.routes[0].children" :key="item.path" :index="item.path">
        <el-icon>
          <component :is="item.meta.icon" />
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useMenuStore } from '../store/index'

const menuStore = useMenuStore()  
const router = useRouter()
const iconUrl = new URL('@/assets/images/机器人 .png', import.meta.url).href
const selectMenu = (path) => {
  console.log(path.index)
  const currentRoute = router.options.routes[0]
  const newPath = `${currentRoute.path}/${path.index}`
  router.push(newPath)
}
</script>

<style lang="scss" scoped>
.collapsed {
  width: 64px;
  .span {
    margin-left: 0;
  }
}

.el-menu-vertical-demo {
  height: 100%;

  .brand {
    display: flex;
    justify-content: center;
    padding: 10px;
    background-color: #fff;
    border-bottom: 1px solid #e5e7eb;

    .brand-title {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 5px;
      color: #1f2937;
    }

    .brand-subtitle {
      font-size: 14px;
      color: #6b7280;
    }
  }
}
</style>
