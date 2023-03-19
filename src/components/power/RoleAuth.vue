<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- 添加角色按钮区域 -->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addDialogVisible = true">添加角色 </el-button>
                </el-col>
            </el-row>
            <!-- 角色列表区域 -->
            <el-table :data="roleList" border stripe>
                <!-- 展开列 -->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                            <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '']" v-for="(item1, i1) in scope.row.authList" :key="item1.id">
                                <!-- 渲染一级权限 -->
                                <el-col :span="5">
                                    <el-tag>{{ item1.name }}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <!-- 渲染二级权限 -->
                                <el-col :span="19">
                                    <el-row :class="[i2 === 0 ? '' : 'bdtop']" v-for="(item2, i2) in item1.children" :key="item2.id">
                                        <el-col :span="6">
                                            <el-tag type="success">{{ item2.name }}</el-tag>
                                            <i class="el-icon-caret-right"></i>
                                        </el-col>
                                        <el-col :span="18">
                                            <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" closable @close="removeAuthById(item3.id)">{{ item3.name }}</el-tag>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="name"></el-table-column>
                <el-table-column label="角色描述" prop="desc"></el-table-column>
                <el-table-column label="操作" width="190px">
                    <template slot-scope="scope">
                        <!-- 编辑按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRoleById(scope.row.id)"></el-button>
                        <!-- 分配角色按钮 -->
                        <el-tooltip class="item" effect="dark" content="分配权限" placement="top-start" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showAuthDialog(scope.row.id)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 添加角色对话框 -->
        <el-dialog
            title="添加用户"
            :visible.sync="addDialogVisible"
            width="50%"
            @close="addDialogClosed">
            <!-- 内容主题区 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-form-item label="角色名" prop="name">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <el-form-item label="角色编码" prop="code">
                    <el-input v-model="addForm.code" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="desc">
                    <el-input v-model="addForm.desc"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑角色对话框 -->
        <el-dialog
            title="修改角色"
            :visible.sync="editDialogVisible"
            width="50%" @close="editDialogClosed">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                <el-form-item label="角色名" prop="name">
                    <el-input v-model="editForm.name"></el-input>
                </el-form-item>
                <el-form-item label="角色编码" prop="code">
                    <el-input v-model="editForm.code"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="desc">
                    <el-input v-model="editForm.desc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRole">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 分配权限 -->
        <el-dialog
            title="分配权限"
            :visible.sync="authDialogVisible"
            width="50%" @close="authDialogClosed">
            <!-- 树形控件 -->
            <el-tree :data="authList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="authDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="setAuth">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            roleList: [],
            addForm: {
                name: '',
                code: '',
                desc: ''
            },
            editForm: {},
            addFormRules: {
                name: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                code: [
                    { required: true, message: '请输入角色编码', trigger: 'blur' }
                ],
                desc: [
                    { required: true, message: '请输入角色描述', trigger: 'blur' }
                ]
            },
            editFormRules: {
                name: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                code: [
                    { required: true, message: '请输入角色编码', trigger: 'blur' }
                ],
                desc: [
                    { required: true, message: '请输入角色描述', trigger: 'blur' }
                ]
            },
            addDialogVisible: false,
            editDialogVisible: false,
            authDialogVisible: false,
            authList: [],
            treeProps: {
                children: 'children',
                label: 'name'
            },
            defKeys: [],
            roleId: ''
        }
    },
    created() {
        this.getRoleList()
    },
    methods: {
        async getRoleList() {
            const {data: res} = await this.$http.get('/api/role/roleList')
            console.log(res)
            if (!res.success) return this.$message.error('角色列表获取失败')
            this.roleList = res.obj
        },
        async removeAuthById(id) {
            // 弹框提示用户是否删除
            const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            // console.log(confirmResult)
            if (confirmResult !== 'confirm') {
                // 用户点击了取消
                return this.$message.info('已取消删除')
            }
            // 发送请求
            const {data: res} = await this.$http.get('/api/sys/deleteAuth?id=' + id)
            if (!res.success) return this.$message.error('删除权限失败')
            this.$message.success('删除成功')
            this.getRoleList()
        },
        addRole() {
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return
                const {data: res} = await this.$http.post('/api/role/add', this.addForm)
                if (!res.success) {
                    this.$message.error('添加角色失败')
                } else {
                    this.$message.success(res.msg)
                }
                // 关闭对话框
                this.addDialogVisible = false
                this.getRoleList()
            })
        },
        addDialogClosed() {
            this.$refs.addFormRef.resetFields()
        },
        editDialogClosed() {
            this.$refs.editFormRef.resetFields()
        },
        async showEditDialog(id) {
            console.log(id)
            const {data: res} = await this.$http.get('/api/role/byId?id=' + id)
            if (!res.success) return this.$message.error('获取角色数据失败')
            // console.log(res)
            this.editForm = res.obj
            this.editDialogVisible = true
        },
        editRole() {
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) return
                const {data: res} = await this.$http.post('/api/role/edit', this.editForm)
                if (!res.success) return this.$message.error('修改失败')
                this.editDialogVisible = false
                this.getRoleList()
                this.$message.success('修改成功')
            })
        },
        async removeRoleById(id) {
            // 弹框询问
            const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            // console.log(confirmResult)
            if (confirmResult !== 'confirm') {
                // 用户点击了取消
                return this.$message.info('已取消删除')
            }
            const {data: res} = await this.$http.get('/api/role/delete?id=' + id)
            if (!res.success) return this.$message('角色删除失败')
            this.$message.success('删除用户成功')
            this.getRoleList()
        },
        authDialogClosed() {
            this.defKeys = []
        },
        async showAuthDialog(id) {
            this.roleId = id
            // 获取所有权限的数据
            const {data: res} = await this.$http.get('/api/sys/getAuthTree')
            if (!res.success) return this.$message.error('查询失败')
            const {data: res1} = await this.$http.get('/api/sys/getThreeLevelAuth?roleId=' + id)
            if (!res1.success) return this.$message.error('查询失败')
            this.defKeys = res1.obj
            this.authList = res.obj
            this.authDialogVisible = true
        },
        async setAuth() {
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ]
            // console.log(keys)
            const idStr = keys.join(',')
            const {data: res} = await this.$http.post('/api/sys/setAuth', {roleId: this.roleId, authIds: idStr})
            if (!res.success) return this.$message.error('分配失败')
            this.$message.success('分配成功')
            this.getRoleList()
            this.authDialogVisible = false
        }
    }
}
</script>
<style lang="less" scoped>
    .el-tag{
        margin: 7px;
    }
    .bdtop{
        border-top: 1px solid #eee;
    }
    .bdbottom{
        border-bottom: 1px solid #eee;
    }
</style>
