<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>工作台</el-breadcrumb-item>
            <el-breadcrumb-item>我的收藏</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <!-- 搜索框 -->
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="请输入内容" v-model="queryInfo.queryKey" clearable @clear="getMyCollectList()">
                        <el-button slot="append" icon="el-icon-search" @click="getMyCollectList()"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <el-table :data="myCollectList">
                <el-table-column type="index"></el-table-column>
                <el-table-column label="标题" prop="kName"></el-table-column>
                <el-table-column label="作者" prop="username"></el-table-column>
                <el-table-column label="关键字" prop="keywords"></el-table-column>
                <el-table-column label="上架时间" prop="validTime"></el-table-column>
                <el-table-column label="查看详情" width="190px">
                    <template slot-scope="scope">
                        <!-- 详情按钮 -->
                        <el-button type="primary" icon="el-icon-view" size="mini" @click="showKnowledgeDetail(scope.row.id)"></el-button>
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
            myCollectList: [],
            knowledgeDialogVisible: false,
            total: 0,
            navigateLastPage: 0,
            knowledgeDetail: {}
        }
    },
    created() {
        this.getMyCollectList()
    },
    methods: {
        async getMyCollectList() {
            const {data: res} = await this.$http.post('/api/knowledge/myCollect', this.queryInfo)
            if (!res.success) return this.$message.error('查询失败')
            this.myCollectList = res.obj.list
            this.total = res.obj.total
            this.navigateLastPage = res.obj.navigateLastPage
        },
        // 监听 pageSize 改变
        handleSizeChange(newSize) {
            // console.log(newSize)
            this.queryInfo.size = newSize
            this.getMyCollectList()
        },
        handleCurrentChange(newPage) {
            // console.log(newPage)
            this.queryInfo.page = newPage
            this.getMyCollectList()
        },
        async showKnowledgeDetail(id) {
            // console.log(id)
            const {data: res} = await this.$http.get('/api/knowledge/selectById?id=' + id)
            this.knowledgeDetail = res.obj
            this.knowledgeDialogVisible = true
        }
    }
}
</script>
<style lang="less" scoped>
.title_div{
    margin-top: 5px;
    margin-bottom: 10px;
    font-size: 20px;
    color: #333333;
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
</style>
