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
                    <i class="el-icon-star-off" @click="collect">{{ knowledgeDetail.collectCount }}</i>
                </span>
            </div>
        </div>
        <div class="add-comment">
            <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="在这里输入你的评论吧！"
                v-model="comment.content" class="comment-input">
            </el-input>
            <el-button type="success" class="add-button" @click="addComment(knowledgeDetail.id)">评论</el-button>
        </div>
        <div>
            <div class="comment-text">
                全部评论({{ knowledgeDetail.commentCount }})
            </div>
            <div class="comment-box" v-for="item in knowledgeDetail.commentList" :key="item.id">
                <div class="user-box">
                    <div class="user-realname">{{ item.username }}</div>
                    <div class="user-deptname">{{ item.deptName }}</div>
                </div>
                <div class="content-box">
                    <div class="text-box">
                        <span>{{ item.content }}</span>
                    </div>
                </div>
                <div class="foot-box">
                    <i class="el-icon-chat-dot-square" @click="showReplyInput(item)">回复</i>
                    <span style="color: rgba(187,187,187);">&nbsp;&nbsp;&nbsp;&nbsp;发布于：{{ item.createTime }}</span>
                </div>
                <div class="reply-box" v-for="item1 in item.replyList" :key="item1.id">
                    <div style="margin-top: 10px;margin-bottom: 10px;">{{ item1.username }}：@{{ item1.targetUser }} {{ item1.content }}</div>
                    <i class="el-icon-chat-dot-square" @click="showReplyInput(item1)">回复</i>
                    <span style="font-size: small;color: rgba(187,187,187);margin-top: 10px;">&nbsp;&nbsp;&nbsp;&nbsp;{{ item1.createTime }}</span>
                </div>
            </div>
            <!-- <div class="reply-area" :id="item.id" style="display: none;">
                    <el-input v-model="reply.content" :placeholder="replyArea"></el-input>
                    <el-button type="success" size="mini" round>发送</el-button>
            </div> -->
            <div class="reply-area" id="111" style="display: none;">
                    <el-input v-model="reply.content" :placeholder="'回复@' + replyArea.username"></el-input>
                    <el-button type="success" size="mini" round @click="addReply()">发送</el-button>
            </div>
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
            knowledgeDetail: {},
            comment: {
                content: '',
                entityType: '',
                entityId: '',
                targetId: ''
            },
            reply: {
                content: '',
                entityType: '',
                entityId: '',
                targetId: ''
            },
            replyWord: '回复',
            replyArea: {},
            nowKnowledgeId: ''
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
            this.nowKnowledgeId = id
            const {data: res} = await this.$http.get('/api/knowledge/selectById?id=' + id)
            this.knowledgeDetail = res.obj
            this.knowledgeDialogVisible = true
        },
        async collect(id) {
            const {data: res} = await this.$http.post('/api/knowledge/collect', this.knowledgeDetail)
            if (!res.success) return this.$message.error('操作失败')
            this.showKnowledgeDetail(this.knowledgeDetail.id)
            this.getMyCollectList()
        },
        async addComment(id) {
            this.comment.entityId = id
            this.comment.entityType = 1
            this.comment.targetId = this.knowledgeDetail.userId
            const {data: res} = await this.$http.post(`/api/comment/add/${id}`, this.comment)
            if (!res.success) return this.$message.error('评论失败')
            this.showKnowledgeDetail(id)
            this.comment.content = ''
            return this.$message.success('操作成功')
        },
        async addReply() {
            this.reply.targetId = this.replyArea.userId
            if (this.replyArea.entityType === 1) {
                this.reply.entityId = this.replyArea.id
            } else {
                this.reply.entityId = this.replyArea.entityId
            }
            this.reply.entityType = 2
            const {data: res} = await this.$http.post(`/api/comment/add/${this.replyArea.entityId}`, this.reply)
            if (!res.success) return this.$message.error('回复失败')
            this.showKnowledgeDetail(this.nowKnowledgeId)
            this.reply.content = ''
            return this.$message.success('操作成功')
        },
        // showReplyInput(username) {
            // if (document.getElementById('111').style.display !== 'none') {
            //     document.getElementById('111').style.display = 'none'
            //     this.replyArea = '回复@' + username
            // } else {
            //     document.getElementById('111').style.display = ''
            //     this.replyArea = '回复@' + username
            // }
        // }
        showReplyInput(item) {
            if (document.getElementById('111').style.display === 'none') {
                document.getElementById('111').style.display = ''
                this.replyArea = item
                console.log(this.replyArea)
                // this.replyArea = '回复@' + item.username
            } else {
                this.replyArea = item
                console.log(this.replyArea)
                // this.replyArea = '回复@' + item.username
            }
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
.el-icon-chat-dot-round {
  font-size: 17px;
}
.el-icon-star-off{
    font-size: 17px;
}
.add-comment{
    padding-bottom: 16px;
    padding-top: 16px;
    background-color: rgba(248,248,248);
    padding-right: 20px;
    padding-left: 20px;
}
.add-button{
    display:      block;
    margin-left:  auto;
    margin-right: 0;
    margin-top: 10px;
}
.comment-box{
    padding-left: 12px;
    padding-top: 16px;
    border-bottom: 1px solid #f8f8f8;
}
.user-box{
    display: flex;
    flex-direction: column;
    padding-top: 10px;
}
.user-realname {
    align-items: center;
    cursor: pointer;
    display: flex;
    height: 16px;
}
.user-deptname{
    align-items: center;
    cursor: pointer;
    display: flex;
    height: 12px;
    margin-top: 8px;
    color: rgba(187,187,187);
    font-size: 12px;
}
.content-box{
    padding-top: 10px;
    // margin-left: 40px;
}
.text-box{
    color: rgba(34,34,34);
    font-size: 14px;
    line-height: 21px;
    word-break: break-all;
}
.foot-box{
    margin-top: 12px;
}
.reply-area{
    display: flex;
}
.reply-box{
    background-color: #f8f8f8;
    margin-top: 10px;
    margin-bottom: 10px;
}
</style>
