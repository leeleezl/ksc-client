<template>
    <el-container class="home_container">
        <!-- 头部区域 -->
        <el-header class="header">
            <div>
                <img src="../assets/logo.png" alt="">
                <span>知识库后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <!-- 页面主体区 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="isCollapse ? '64px' : '200px '" class="aside">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <!-- 侧边菜单 -->
                <el-menu background-color="rgb(246, 249, 254)" unique-opened :collapse="isCollapse"
                 :collapse-transition="false" :router="true" active-text-color="#409EFF" :default-active="activePath">
                    <!-- 一级菜单 -->
                    <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
                        <!-- 一级菜单模板区域 -->
                        <template slot="title">
                            <!-- 图标 -->
                            <i :class="iconsObj[item.id]"></i>
                            <!-- 文本 -->
                            <span>{{ item.name }}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/' + subItem.path)">
                            <!-- 图标 -->
                            <i class="el-icon-menu"></i>
                            <!-- 文本 -->
                            <span slot="title">{{ subItem.name }}</span>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右侧内容 -->
            <el-main class="main">
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    name: 'Home',
    created() {
        this.getMenuList()
        this.activePath = window.sessionStorage.getItem('activePath')
    },
    data() {
        return {
            isCollapse: false,
            menuList: [],
            iconsObj: {
                '101': 'el-icon-s-custom',
                '104': 'el-icon-collection',
                '107': 'el-icon-setting',
                '110': 'el-icon-open'
            },
            activePath: ''
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
        async getMenuList() {
            const {data: res} = await this.$http.get('http://localhost:9090/sys/menus')
            // console.log(res)
            if (!res.success) return this.$message(res.msg)
            this.menuList = res.obj
        },
        saveNavState(activePath) {
            window.sessionStorage.setItem('activePath', activePath)
            this.activePath = activePath
        }
    }
}
</script>

<style lang="less" scoped>
.home_container {
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
