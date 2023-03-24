<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>工作台</el-breadcrumb-item>
            <el-breadcrumb-item>待修改</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <!-- 搜索框 -->
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="请输入内容" v-model="queryInfo.queryKey" clearable @clear="getMyMistakeList()">
                        <el-button slot="append" icon="el-icon-search" @click="getMyMistakeList()"></el-button>
                    </el-input>
                </el-col>
                <!-- <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col> -->
            </el-row>
            <el-table :data="myKnowledgeList">
                <el-table-column type="index"></el-table-column>
                <el-table-column label="标题" prop="kName"></el-table-column>
                <el-table-column label="关键字" prop="keywords"></el-table-column>
                <el-table-column label="上架时间" prop="validTime"></el-table-column>
                <el-table-column label="操作" width="190px">
                    <template slot-scope="scope">
                        <!-- 详情按钮 -->
                        <el-button type="warning" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
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
        <!-- 展示知识详细 -->
        <el-dialog
        title="知识详情"
        :visible.sync="knowledgeDialogVisible"
        width="70%">
        <div class="user_div">{{ knowledgeDetail.username }}</div>
        <span class="time_span1">发布于 {{ knowledgeDetail.validTime }}</span>
        <div class="title_div">{{ knowledgeDetail.kName }}</div>
        <div class="content_div"><b>摘要：</b><br>{{ knowledgeDetail.abstractInfo }}</div>
        <div class="content_div"><b>正文：</b><br>{{ knowledgeDetail.content }}</div>
        <div class="content-bottom-action">
            <div>
                <span class="content-bottom-item">
                    <i class="el-icon-chat-dot-round">{{ knowledgeDetail.commentCount }}</i>
                </span>
                <span class="content-bottom-item">
                    <i class="el-icon-star-off">{{ knowledgeDetail.collectCount }}</i>
                </span>
            </div>
        </div>
        <div class="comment-text">
            全部评论
        </div>
        </el-dialog>
        <!-- 编辑知识对话框 -->
        <el-dialog
            title="编辑"
            :visible.sync="editDialogVisible"
            width="60%" @close="editDialogClosed">
            <el-form :model="editForm" ref="detailFormRef" label-width="70px">
                <el-form-item label="错误信息" prop="errInfo">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="editForm.errInfo" disabled></el-input>
                </el-form-item>
                <el-form-item label="标题" prop="kName">
                    <el-input v-model="editForm.kName"></el-input>
                </el-form-item>
                <el-form-item label="关键词" prop="keywords">
                    <el-input v-model="editForm.keywords"></el-input>
                </el-form-item>
                <el-form-item label="摘要" prop="abstractInfo">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="editForm.abstractInfo"></el-input>
                </el-form-item>
                <el-form-item label="内容" prop="content">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="editForm.content"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">关 闭</el-button>
                <el-button type="primary" @click="editKnowledge">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            myKnowledgeList: [],
            queryInfo: {
                queryKey: '',
                page: 1,
                size: 5
            },
            knowledgeDialogVisible: false,
            total: 0,
            navigateLastPage: 0,
            knowledgeDetail: {},
            editDialogVisible: false,
            editForm: {}
        }
    },
    created() {
        this.getMyMistakeList()
    },
    methods: {
        async getMyMistakeList() {
            const {data: res} = await this.$http.post('/api/knowledge/misList', this.queryInfo)
            if (!res.success) return this.$message.error('知识列表获取失败')
            this.myKnowledgeList = res.obj.list
            this.total = res.obj.total
            this.navigateLastPage = res.obj.navigateLastPage
        },
        // 监听 pageSize 改变
        handleSizeChange(newSize) {
            // console.log(newSize)
            this.queryInfo.size = newSize
            this.getMyMistakeList()
        },
        handleCurrentChange(newPage) {
            // console.log(newPage)
            this.queryInfo.page = newPage
            this.getMyMistakeList()
        },
        async showKnowledgeDialog(id) {
            const {data: res} = await this.$http.get('/api/knowledge/selectById?id=' + id)
            this.knowledgeDetail = res.obj
            this.knowledgeDialogVisible = true
        },
        async deleteMyKnowledge(id) {
            // 弹框询问
            const confirmResult = await this.$confirm('此操作将永久删除该知识, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            // console.log(confirmResult)
            if (confirmResult !== 'confirm') {
                // 用户点击了取消
                return this.$message.info('已取消删除')
            }
            const {data: res} = await this.$http.get('/api/knowledge/delete?id=' + id)
            if (!res.success) return this.$message('知识删除失败')
            this.$message.success('知识删除成功')
            this.getMyMistakeList()
        },
        async showEditDialog(id) {
            const {data: res} = await this.$http.get('/api/knowledge/selectById?id=' + id)
            this.editForm = res.obj
            this.editDialogVisible = true
        },
        async editKnowledge() {
            const {data: res} = await this.$http.post('/api/knowledge/edit', this.editForm)
            if (!res.success) return this.$message.error('修改失败')
            this.$message.success('修改成功')
            this.editDialogVisible = false
            this.getMyMistakeList()
        },
        editDialogClosed() {
        },
        getLabel(list, id, value, label) {
            if (id !== '' && Array.isArray(list) && list.length !== 0) {
                return !list.find(item => item[value] === id) ? id : list.find(item => item[value] === id)[label]
            } else {
                return id
            }
        }
    }
}
</script>
<style lang="less" scoped>
.knowledge_card{
    margin-top: 15px;
}
.time_span{
    font-size: small;
    color: burlywood;
}
.footer_div{
    font-size: small;
    color: rgb(118, 127, 135);
}
.title_div{
    margin-top: 5px;
    margin-bottom: 10px;
    font-size: 20px;
    color: #333333;
}
.el-link{
    margin-bottom: 10px;
}
.content_div {
    margin-top: 10px;
    font-size: 16px;
    line-height: 24px;
    white-space:pre-wrap;
}
.user_div{
    font-size: 16px;
    line-height: 16px;
    color: rgba(255,170,32);
    margin-bottom: 5px;
}
.time_span1{
    margin-top: 10px;
    font-size: 14px;
    line-height: 14px;
    color: rgba(187,187,187);
}
.content-bottom-action{
    display: flex;
    font-size: 16px;
    font-weight: 400;
    justify-content: space-between;
    line-height: 16px;
    margin-top: 30px;
}
.content-bottom-item{
    align-items: center;
    color: rgba(153,153,153,var(--tw-text-opacity));
    cursor: pointer;
    display: inline-flex;
    font-size: 14px;
    line-height: 21px;
}
.comment-text{
    align-items: center;
    color: rgba(51,51,51);
    display: flex;
    font-size: 18px;
    font-weight: 600;
    line-height: 18px;
    margin-bottom: 4px;
    margin-top: 20px;
}
.el-icon-chat-dot-round {
  font-size: 17px;
}
.el-icon-star-off{
    font-size: 17px;
}
</style>
