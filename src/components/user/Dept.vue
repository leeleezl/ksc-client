<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>部门管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-button type="primary" @click="addDialogVisible = true">添加部门</el-button>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>
<script>
export default {}
</script>
<style lang="less" scoped>
</style>
