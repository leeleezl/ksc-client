<template>
    <el-container class="index_container">
    <!-- 头部区域 -->
        <el-header class="header">
            <div>
                <img src="../../assets/logo.png" alt="">
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <!-- 页面主体区域 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="isCollapse ? '64px' : '200px '" class="aside">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <!-- 侧边菜单 -->
                <el-menu background-color="rgb(246, 249, 254)" unique-opened :collapse="isCollapse"
                :collapse-transition="false" :router="true" active-text-color="#409EFF" :default-active="activePath">
                    <el-submenu index="/workbench" @click="saveNavState('/workbench')">
                        <!-- 一级菜单模板区域 -->
                        <template slot="title">
                            <!-- 图标 -->
                            <i class="el-icon-menu"></i>
                            <!-- 文本 -->
                            <span>工作台</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item index="/myKnowledge" @click="saveNavState('/myKnowledge')">
                            <!-- 图标 -->
                            <i class="el-icon-s-home"></i>
                            <!-- 文本 -->
                            <span slot="title">我的知识</span>
                        </el-menu-item>
                        <el-menu-item index="/myMistake" @click="saveNavState('/myMistake')">
                            <!-- 图标 -->
                            <i class="el-icon-s-release"></i>
                            <!-- 文本 -->
                            <span slot="title">待修改</span>
                        </el-menu-item>
                        <el-menu-item index="/myCollect" @click="saveNavState('/myCollect')">
                            <!-- 图标 -->
                            <i class="el-icon-star-on"></i>
                            <!-- 文本 -->
                            <span slot="title">我的收藏</span>
                        </el-menu-item>
                    </el-submenu>
                    <el-menu-item index="/allKnowledge" @click="saveNavState('/allKnowledge')">
                        <i class="el-icon-folder-opened"></i>
                        <span slot="title">知识库</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-main class="main">
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
export default {
    data() {
        return {
            isCollapse: false,
            activePath: '/myKnowledge'
        }
    },
    methods: {
        logout() {
            window.sessionStorage.clear()
            this.$router.push('/login')
        },
        toggleCollapse() {
            this.isCollapse = !this.isCollapse
        },
        saveNavState(activePath) {
            window.sessionStorage.setItem('activePath', activePath)
            this.activePath = activePath
        }
    }
}
</script>
<style lang="less" scoped>
.index_container {
    height: 100%;
}

.header {
    background-color: rgb(246, 249, 254);
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    font-size: 20px;

    >div {
        display: flex;
        justify-content: space-between;
        span {
            margin-left: 15px;
        }
        img {
            width: 12%;
            height: 12%;
            border-radius: 50%;
            background-color: rgb(246, 249, 254);
        }
    }
}

.aside {
    background-color: rgb(246, 249, 254);
}

.main {
    background-color: #fff;
}
.toggle-button{
    background-color: rgb(246, 249, 254);
    font-size: 10px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
    border: 1px solid #eee;
}
</style>
