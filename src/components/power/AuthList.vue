<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <el-table :data="menus" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="权限名称" prop="name"></el-table-column>
                <el-table-column label="路径" prop="path"></el-table-column>
                <el-table-column label="权限等级" prop="level">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level === 0">一级</el-tag>
                        <el-tag type="success" v-else-if="scope.row.level === 1">二级</el-tag>
                        <el-tag type="warning" v-else>三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>
<script>
export default {
    data() {
        return {
            menus: []
        }
    },
    created() {
        this.getMenus()
    },
    methods: {
        async getMenus() {
            const {data: res} = await this.$http.get('/api/sys/menuList')
            if (!res.success) return this.$message.error('菜单数据获取失败')
            this.menus = res.obj
        }
    }
}
</script>
<style>
</style>
