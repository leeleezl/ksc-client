<template>
    <el-container class="allKnowledge-container">
        <el-header>
            <div>
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item>首页</el-breadcrumb-item>
                    <el-breadcrumb-item>知识库</el-breadcrumb-item>
                 </el-breadcrumb>
                 <el-divider></el-divider>
            </div>
        </el-header>
        <!-- 主体部分 -->
        <el-container class="main-container">
            <!-- 侧边栏 -->
            <el-aside width="200px" class="aside">
                <el-input
                placeholder="输入命名空间"
                v-model="filterText" class="dept-input">
                </el-input>
                <el-tree :data="deptList" :props="treeProps" node-key="id" default-expand-all ref="treeRef"
                :filter-node-method="filterNode" @node-click="handleNodeClick" :highlight-current="true"></el-tree>
            </el-aside>
            <el-main class="main">
                <el-card>
                    <!-- 搜索框 -->
                    <el-row :gutter="20">
                        <el-col :span="7">
                            <el-input placeholder="请输入内容" v-model="queryInfo.queryKey" clearable @clear="getKnowledgeList()">
                                <el-button slot="append" icon="el-icon-search" @click="getKnowledgeList()"></el-button>
                            </el-input>
                        </el-col>
                        <el-col :span="4">
                            <el-button type="primary" @click="addDialogVisible = true">知识上报</el-button>
                        </el-col>
                    </el-row>
                    <!-- 知识列表 -->
                    <el-table :data="knowledgeList">
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="标题" prop="kName"></el-table-column>
                        <el-table-column label="作者" prop="username"></el-table-column>
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
            </el-main>
        </el-container>
        <!-- 知识详情对话框 -->
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
        <!-- 添加知识对话框 -->
        <el-dialog
            title="知识上报"
            :visible.sync="addDialogVisible"
            width="70%"
            @close="addDialogClosed">
            <!-- 内容主题区 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="标题" prop="kName">
                    <el-input v-model="addForm.kName"></el-input>
                </el-form-item>
                <el-form-item label="关键字" prop="keywords">
                    <el-input v-model="addForm.keywords"></el-input>
                </el-form-item>
                <el-form-item label="摘要" prop="abstractInfo">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="addForm.abstractInfo" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="内容" prop="content">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" v-model="addForm.content"></el-input>
                </el-form-item>
                <el-form-item label="预计上架时间" prop="validTime">
                    <el-date-picker
                    v-model="addForm.validTime"
                    type="datetime"
                    placeholder="选择日期时间"
                    value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addKnowledge">确 定</el-button>
            </span>
        </el-dialog>
    </el-container>
</template>
<script>

export default {
    created() {
        this.deptTree()
        this.getKnowledgeList()
    },
    watch: {
      filterText(val) {
        this.$refs.treeRef.filter(val)
      }
    },
    data() {
        return {
            deptList: [],
            treeProps: {
                children: 'children',
                label: 'deptName'
            },
            filterText: '',
            queryInfo: {
                queryKey: '',
                deptId: '',
                page: 1,
                size: 5
            },
            addDialogVisible: false,
            knowledgeList: [],
            total: 0,
            navigateLastPage: 0,
            knowledgeDialogVisible: false,
            knowledgeDetail: {},
            addForm: {
                kName: '',
                abstractInfo: '',
                content: '',
                keywords: '',
                validTime: ''
            },
            addFormRules: {
                kName: [
                    { required: true, message: '请输入标题', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10  个字符', trigger: 'blur' }
                ],
                abstractInfo: [
                    { required: true, message: '请输入摘要', trigger: 'blur' },
                    { min: 6, max: 50, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ],
                content: [
                    { required: true, message: '请输入知识内容', trigger: 'blur' }
                ],
                validTime: [
                    { required: true, trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        async deptTree() {
            const {data: res} = await this.$http.get('/api/dept/allDept')
            if (!res.success) return this.$message.error('获取部门列表失败')
            this.deptList = res.obj
        },
        filterNode(value, deptList) {
            if (!value) return true
            return deptList.deptName.indexOf(value) !== -1
        },
        async handleNodeClick(data) {
            // console.log(data)
            if (data.id === 101) {
                this.queryInfo.deptId = ''
                this.queryInfo.queryKey = ''
                this.getKnowledgeList()
            }
            if (data.children.length === 0) {
                // console.log(data.id)
                this.queryInfo.deptId = data.id
                this.getKnowledgeList()
            }
        },
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
        async showKnowledgeDetail(id) {
            // console.log(id)
            const {data: res} = await this.$http.get('/api/knowledge/selectById?id=' + id)
            this.knowledgeDetail = res.obj
            this.knowledgeDialogVisible = true
        },
        addDialogClosed() {
            this.$refs.addFormRef.resetFields()
        },
        addKnowledge() {
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return
                const {data: res} = await this.$http.post('/api/knowledge/addKnowledge', this.addForm)
                if (!res.success) {
                    this.$message.error('知识上报失败')
                } else {
                    this.$message.success('上报成功')
                }
                // 关闭对话框
                this.addDialogVisible = false
                this.getKnowledgeList()
            })
        }
    }
}
</script>
<style lang="less" scoped>
.allKnowledge-container{
    height: 100%;
}
.aside{
    border-right: 1px solid #d4d4d4;
}
.dept-input{
    margin-right: 10px;
}
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
