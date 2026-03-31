<template>
  <div class="nav-bar">
    <div class="flex-box">
      <el-button @click="handleClick">
        <el-icon>
          <Expand />
        </el-icon>
      </el-button>
      <p class="page-title">{{route.meta.title}}</p>
    </div>
    <div class="flex-box">
      <el-dropdown @command="handleCommand">
        <div class="flex-box">
          <el-avatar :src="avatar" />
          <p class="user-name">admin</p>
          <el-icon><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>

</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useMenuStore } from '../store/index'
import { logout } from '../api/admin'
import { ElMessageBox } from 'element-plus'
import avatar from '../assets/images/机器人.png'

const menuStore = useMenuStore()
const router = useRouter()
const route = useRoute()
const handleCommand = (command) => {
  if (command === 'logout') {
    ElMessageBox.confirm('确定退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      logout().then(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        router.push('/auth/login')
      })
    })
  }
}

const handleClick = () => {
  menuStore.toggleCollapsed()
}
</script>

<style lang="scss" scoped>
.nav-bar {
  height: 74px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.1);
  border-bottom: 1px solid #e5e7eb;
  background-color: #fff;

  .flex-box {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }

  .page-title {
    margin-left: 20px;
    font-size: 20px;
    font-weight: bold;
    color: #1f2937;
  }
}
</style>
