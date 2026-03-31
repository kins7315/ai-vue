<template>
    <div class="backend-layout">
        <el-container class="main-container">
            <SideBar />
            <el-container>
                <el-header>
                    <NavBar />
                </el-header>
                <el-main class="main-content">
                    <router-view class="content-container"></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>

import SideBar from './SideBar.vue'
import NavBar from './NavBar.vue'


</script>

<style lang="scss" scoped>
.backend-layout {
    height: 100vh;
    .el-header {
        height: 74px !important;
    }
    .main-container {
        height: 100%;
        .main-content {
            height: 100%;
            padding: 0;
            background-color: #f5f7fa;
            :deep(.content-container) {
                padding: 20px;
                background-color: #fff;
                min-height: calc(100% - 74px);/* 计算内容高度 */
            }
        }
    }
}
</style>