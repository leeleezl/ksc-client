<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>知识管理</el-breadcrumb-item>
            <el-breadcrumb-item>知识列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
        <!-- 搜索框 -->
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="请输入内容" v-model="queryInfo.queryKey" clearable @clear="getKnowledgeList()">
                        <el-button slot="append" icon="el-icon-search" @click="getKnowledgeList()"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <el-table :data="knowledgeList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="标题" prop="kName"></el-table-column>
                <el-table-column label="作者" prop="username"></el-table-column>
                <el-table-column label="摘要" prop="abstractInfo" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="内容" prop="content" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="关键词" prop="keywords"></el-table-column>
                <el-table-column label="评论数" prop="commentCount"></el-table-column>
                <el-table-column label="收藏数" prop="collectCount"></el-table-column>
                <el-table-column label="得分" prop="score"></el-table-column>
                <el-table-column label="审核人" prop="checkedName"></el-table-column>
                <el-table-column label="查看详情" width="90px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-view" size="mini" @click="showDetailDialog(scope.row.id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
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
            title="知识详情"
            :visible.sync="detailDialogVisible"
            width="60%" @close="detailDialogClosed">
            <el-form :model="detailForm" ref="detailFormRef" label-width="70px">
                <el-form-item label="标题" prop="kName">
                    <el-input v-model="detailForm.kName" disabled></el-input>
                </el-form-item>
                <el-form-item label="作者" prop="username">
                    <el-input v-model="detailForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="关键词" prop="keywords">
                    <el-input v-model="detailForm.keywords" disabled></el-input>
                </el-form-item>
                <el-form-item label="摘要" prop="abstractInfo">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="detailForm.abstractInfo" disabled></el-input>
                </el-form-item>
                <el-form-item label="内容" prop="content">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="detailForm.content" disabled></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="detailDialogVisible = false">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            queryInfo: {
                queryKey: '',
                page: 1,
                size: 5
            },
            knowledgeList: [],
            total: 0,
            navigateLastPage: 0,
            detailDialogVisible: false,
            detailForm: {}
        }
    },
    created() {
        this.getKnowledgeList()
    },
    methods: {
        async getKnowledgeList() {
            const {data: res} = await this.$http.post('/api/knowledge/list', this.queryInfo)
            if (!res.success) return this.$message.error('查询知识列表失败')
            this.knowledgeList = res.obj.list
            this.total = res.obj.total
            this.navigateLastPage = res.obj.navigateLastPage
        },
        // 监听 pageSize 改变
        handleSizeChange(newSize) {
            // console.log(newSize)
            this.queryInfo.size = newSize
            this.getKnowledgeList()
        },
        handleCurrentChange(newPage) {
            // console.log(newPage)
            this.queryInfo.page = newPage
            this.getKnowledgeList()
        },
        detailDialogClosed() {
        },
        async showDetailDialog(id) {
            this.detailDialogVisible = true
            // console.log(id)
            const {data: res} = await this.$http.get('/api/knowledge/selectById?id=' + id)
            if (!res.success) return this.$message.error('查询失败')
            this.detailForm = res.obj
        }
    }
}
</script>
<style lang="less" scoped>
</style>
