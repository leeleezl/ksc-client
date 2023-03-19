<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区 -->
        <el-card>
            <!-- 搜索框 -->
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="请输入内容" v-model="queryInfo.queryKey" clearable @clear="getUserList()">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表区 -->
            <el-table :data="userList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="realName"></el-table-column>
                <el-table-column label="联系方式" prop="contact"></el-table-column>
                <el-table-column label="用户名" prop="username"></el-table-column>
                <el-table-column label="用户角色" prop="roleName"></el-table-column>
                <el-table-column label="部门" prop="deptName"></el-table-column>
                <el-table-column label="创建时间" prop="createTime"></el-table-column>
                <el-table-column label="状态" prop="status">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.state" @change="userStateChanged(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="190px">
                    <template slot-scope="scope">
                        <!-- 编辑按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
                        <!-- 分配角色按钮 -->
                        <el-tooltip class="item" effect="dark" content="分配角色" placement="top-start" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showRoleDialog(scope.row.username)"></el-button>
                        </el-tooltip>
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
        <!-- 添加用户的对话框 -->
        <el-dialog
            title="添加用户"
            :visible.sync="addDialogVisible"
            width="50%"
            @close="addDialogClosed">
            <!-- 内容主题区 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="真实姓名" prop="realName">
                    <el-input v-model="addForm.realName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="contact">
                    <el-input v-model="addForm.contact"></el-input>
                </el-form-item>
                <el-form-item label="部门" prop="deptId">
                    <el-select v-model="addForm.deptId" placeholder="请选择部门" filterable clearable>
                        <el-option :label="dept.deptName" :value="dept.id" v-for="dept in deptList" :key="dept.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改用户对话框 -->
        <el-dialog
            title="修改用户"
            :visible.sync="editDialogVisible"
            width="50%" @close="editDialogClosed">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="真实姓名" prop="realName">
                    <el-input v-model="editForm.realName"></el-input>
                </el-form-item>
                <el-form-item label="联系方式" prop="contact">
                    <el-input v-model="editForm.contact"></el-input>
                </el-form-item>
                <el-form-item label="部门" prop="deptId">
                    <el-select v-model="editForm.deptId" placeholder="请选择部门" filterable clearable>
                        <el-option :label="dept.deptName" :value="dept.id" v-for="dept in deptList" :key="dept.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUser">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 分配角色对话框 -->
        <el-dialog
            title="分配角色"
            :visible.sync="roleDialogVisible"
            width="50%"
            @close="roleDialogClosed">
            <!-- 内容主题区 -->
            <el-form :model="roleForm" :rules="roleFormRules" ref="roleFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="roleForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="roleId">
                    <el-select v-model="roleForm.roleId" placeholder="请选择角色" filterable>
                        <el-option :label="role.name" :value="role.id" v-for="role in roleList" :key="role.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="roleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateUserRole">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            // 获取用户列表的参数
            queryInfo: {
                queryKey: '',
                page: 1,
                size: 5
            },
            userList: [],
            deptList: [],
            total: 0,
            navigateLastPage: 0,
            addDialogVisible: false,
            editDialogVisible: false,
            addForm: {
                username: '',
                password: '',
                realName: '',
                contact: '',
                deptId: ''
            },
            addFormRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10  个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入登录密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ],
                contact: [
                    { min: 11, max: 11, message: '手机号码为11位' }
                ]
            },
            editForm: {},
            editFormRules: {
                contact: [
                    { min: 11, max: 11, message: '手机号码为11位' }
                ]
            },
            roleForm: {},
            roleFormRules: {},
            roleList: {},
            roleDialogVisible: false
        }
    },
    created() {
        this.getUserList()
        this.depts()
        this.getRoleList()
    },
    methods: {
        async getUserList() {
           const {data: res} = await this.$http.get('/api/user/users', { params: this.queryInfo })
           // console.log(res)
           if (!res.success) return this.$message(res.msg)
           this.userList = res.obj.list
           this.total = res.obj.total
           this.navigateLastPage = res.obj.navigateLastPage
        },
        // 监听 pageSize 改变
        handleSizeChange(newSize) {
            // console.log(newSize)
            this.queryInfo.size = newSize
            this.getUserList()
        },
        handleCurrentChange(newPage) {
            // console.log(newPage)
            this.queryInfo.page = newPage
            this.getUserList()
        },
        async userStateChanged(userinfo) {
            // console.log(userinfo)
            const {data: res} = await this.$http.post('/api/user/status', userinfo)
            if (!res.success) {
                userinfo.state = !userinfo.state
                return this.$message.error('更改用户状态失败')
            }
            this.$message.success(res.msg)
        },
        addDialogClosed() {
            this.$refs.addFormRef.resetFields()
        },
        roleDialogClosed() {
            this.$refs.roleFormRef.resetFields()
        },
        addUser() {
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return
                const {data: res} = await this.$http.post('/api/user/addUser', this.addForm)
                if (!res.success) {
                    this.$message.error('添加用户失败')
                } else {
                    this.$message.success(res.msg)
                }
                // 关闭对话框
                this.addDialogVisible = false
                this.getUserList()
                this.queryInfo.page = this.navigateLastPage
                this.getUserList()
            })
        },
        async depts() {
           const {data: res} = await this.$http.get('/api/dept/depts')
           // console.log(res)
           if (!res.success) return this.$message.error('部门数据查询失败')
           this.deptList = res.obj
        },
        async showEditDialog(id) {
            console.log(id)
            const {data: res} = await this.$http.get('/api/user/byId?id=' + id)
            if (!res.success) return this.$message.error('获取用户数据失败')
            // console.log(res)
            this.editForm = res.obj
            this.editDialogVisible = true
        },
        editUser() {
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) return
                const {data: res} = await this.$http.post('/api/user/edit', this.editForm)
                if (!res.success) return this.$message.error('修改失败')
                this.editDialogVisible = false
                this.getUserList()
                this.$message.success('修改成功')
            })
        },
        editDialogClosed() {
            this.$refs.editFormRef.resetFields()
        },
        async removeUserById(id) {
            // 弹框询问
            const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            // console.log(confirmResult)
            if (confirmResult !== 'confirm') {
                // 用户点击了取消
                return this.$message.info('已取消删除')
            }
            const {data: res} = await this.$http.get('/api/user/deleteById?id=' + id)
            if (!res.success) return this.$message('用户删除失败')
            this.$message.success('删除用户成功')
            this.getUserList()
        },
        async getRoleList() {
            const {data: res} = await this.$http.get('/api/role/roleList')
            if (!res.success) return this.$message.error('获取角色列表失败')
            this.roleList = res.obj
        },
        async showRoleDialog(username) {
            const {data: res} = await this.$http.get('/api/user/selectUserRoleByUsername?username=' + username)
            if (!res.success) return this.$message.error('查询失败')
            this.roleForm = res.obj
            this.roleDialogVisible = true
        },
        async updateUserRole() {
            const {data: res} = await this.$http.post('/api/user/updateUserRole', this.roleForm)
            if (!res.success) return this.$message.error('分配失败')
            this.$message.success('修改成功')
            this.roleDialogVisible = false
            this.getUserList()
        }
    }
}
</script>
<style lang="less" scoped>
</style>
