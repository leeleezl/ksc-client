<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>知识管理</el-breadcrumb-item>
            <el-breadcrumb-item>审核列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <!-- 搜索框 -->
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="请输入内容" v-model="queryInfo.queryKey" clearable @clear="getCheckList()">
                        <el-button slot="append" icon="el-icon-search" @click="getCheckList()"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <!-- 审核列表区域 -->
            <el-table :data="checkList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="标题" prop="kName"></el-table-column>
                <el-table-column label="作者" prop="username"></el-table-column>
                <el-table-column label="摘要" prop="abstractInfo" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="内容" prop="content" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="预计上架时间" prop="validTime"></el-table-column>
                <el-table-column label="预计下架时间" prop="invalidTime"></el-table-column>
                <el-table-column label="关键词" prop="keywords"></el-table-column>
                <el-table-column label="审核" width="90px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit-outline" size="mini" @click="showCheckDialog(scope.row.id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页条 -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.page"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="queryInfo.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </el-card>
        <el-dialog
            title="知识审核"
            :visible.sync="checkDialogVisible"
            width="60%" @close="checkDialogClosed">
            <el-form :model="checkForm" ref="checkFormRef" label-width="70px">
                <el-form-item label="标题" prop="kName">
                    <el-input v-model="checkForm.kName" disabled></el-input>
                </el-form-item>
                <el-form-item label="作者" prop="username">
                    <el-input v-model="checkForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="关键词" prop="keywords">
                    <el-input v-model="checkForm.keywords" disabled></el-input>
                </el-form-item>
                <el-form-item label="摘要" prop="abstractInfo">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="checkForm.abstractInfo" disabled></el-input>
                </el-form-item>
                <el-form-item label="内容" prop="content">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="checkForm.content" disabled></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="checkDialogVisible = false">取 消</el-button>
                <el-button type="danger" @click="checkKnowledgeNo">不通过</el-button>
                <el-button type="primary" @click="checkKnowledgeOk">通 过</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data () {
        return {
            // 获取审核列表的参数
            queryInfo: {
                queryKey: '',
                page: 1,
                size: 5
            },
            checkList: [],
            total: 0,
            navigateLastPage: 0,
            checkDialogVisible: false,
            checkForm: {}
        }
    },
    created() {
        this.getCheckList()
    },
    methods: {
        async getCheckList() {
            const {data: res} = await this.$http.post('http://localhost:9090/knowledge/checkList', this.queryInfo)
            // console.log(res)
            if (!res.success) return this.$message.error('查询失败')
            this.checkList = res.obj.list
            this.total = res.obj.total
            this.navigateLastPage = res.obj.navigateLastPage
        },
        // 监听 pageSize 改变
        handleSizeChange(newSize) {
            // console.log(newSize)
            this.queryInfo.size = newSize
            this.getCheckList()
        },
        handleCurrentChange(newPage) {
            // console.log(newPage)
            this.queryInfo.page = newPage
            this.getCheckList()
        },
        async showCheckDialog(id) {
            this.checkDialogVisible = true
            // console.log(id)
            const {data: res} = await this.$http.get('http://localhost:9090/knowledge/selectById?id=' + id)
            if (!res.success) return this.$message.error('查询失败')
            this.checkForm = res.obj
        },
        checkDialogClosed() {
            this.$refs.checkFormRef.resetFields()
        },
        async checkKnowledgeNo() {
            this.checkForm.status = 0
            const {data: res} = await this.$http.post('http://localhost:9090/knowledge/check', this.checkForm)
            if (!res.success) return this.$message.error('审核失败')
            this.$message.success('审核成功')
            this.checkDialogVisible = false
            this.getCheckList()
        },
        async checkKnowledgeOk() {
            this.checkForm.status = 3
            const {data: res} = await this.$http.post('http://localhost:9090/knowledge/check', this.checkForm)
            if (!res.success) return this.$message.error('审核失败')
            this.$message.success('审核成功')
            this.checkDialogVisible = false
            this.getCheckList()
        }
    }
}
</script>
<style lang="less" scoped>
</style>
