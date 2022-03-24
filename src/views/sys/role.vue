<template>
    <div>
        <el-form :inline="true">
            <el-form-item>
                <el-input v-model="searchForm.name" placeholder="名称" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="getRoleList">搜索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="dialogVisible = true">新增</el-button>
            </el-form-item>
            <el-form-item>
                <el-popconfirm title="确定批量删除吗？" @confirm="delHandle(null)">
                    <el-button type="danger" slot="reference" :disabled="delStatus">批量删除</el-button>
                </el-popconfirm>
            </el-form-item>
        </el-form>

        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" border stripe @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>

            <el-table-column prop="name" label="名称" width="120">
            </el-table-column>

            <el-table-column prop="code" label="唯一编码" show-overflow-tooltip>
            </el-table-column>

            <el-table-column prop="remark" label="描述" show-overflow-tooltip>
            </el-table-column>

            <el-table-column prop="status" label="状态">
                <template slot-scope="scope">
                    <el-tag size="small" v-if="scope.row.status === 1" type="success">正常</el-tag>
                    <el-tag size="small" v-else-if="scope.row.status === 0" type="danger">禁用</el-tag>
                </template>
            </el-table-column>

            <el-table-column prop="icon" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="permHandle(scope.row.id)">分配权限</el-button>
                    <el-divider direction="vertical"></el-divider>

                    <el-button type="text" @click="editHandle(scope.row.id)">编辑</el-button>
                    <el-divider direction="vertical"></el-divider>

                    <template>
                        <el-popconfirm title="这是一段内容确定删除吗？" @confirm="delHandle(scope.row.id)">
                            <el-button type="text" slot="reference">删除</el-button>
                        </el-popconfirm>
                    </template>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="current" :page-sizes="[10, 20, 50, 100]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>

        <el-dialog title="提示" :visible.sync="dialogVisible" width="600px" :before-close="handleClose">
            <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px" class="demo-editForm">

                <el-form-item label="角色名称" prop="name" label-width="100px">
                    <el-input v-model="editForm.name" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="唯一编码" prop="code" label-width="100px">
                    <el-input v-model="editForm.code" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="描述" prop="remark" label-width="100px">
                    <el-input v-model="editForm.remark" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="状态" prop="status" label-width="100px">
                    <el-radio-group v-model="editForm.status">
                        <el-radio :label=0>禁用</el-radio>
                        <el-radio :label=1>正常</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submitForm('editForm')">立即创建</el-button>
                    <el-button @click="resetForm('editForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog title="分配权限" :visible.sync="permDialogVisible" width="600px">
            <el-form :model="permForm">
                <el-tree :data="permTreeData" :check-strictly=true show-checkbox ref="permTree" node-key="id" :props="defaultProps" :default-expand-all=true>
                </el-tree>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="permDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitPermFormhandle('permForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "role",
    data() {
        return {
            searchForm: {},
            delStatus: true,
            total: 1,
            size: 10,
            current: 1,
            dialogVisible: false,
            permDialogVisible: false,
            editForm: {},
            permForm: {},
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            permTreeData: [],
            tableData: [],
            editFormRules: {
                name: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' }
                ],
                code: [
                    { required: true, message: '请输入唯一编码', trigger: 'blur' }
                ],
                status: [
                    { required: true, message: '请选择状态', trigger: 'blur' }
                ]
            },
            multipleSelection: []
        }
    },
    created() {
        this.getRoleList()
        this.$axios.get('/sys/menu/list').then(res => {
            this.permTreeData = res.data.data
            console.log("permTreeData:" + res)
        })
    },
    methods: {
        toggleSelection(rows) {
            if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row);
                });
            } else {
                this.$refs.multipleTable.clearSelection();
            }
        },
        handleSelectionChange(val) {
            console.log(val)
            this.multipleSelection = val
            this.delStatus = val.length == 0
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.size = val
            this.getRoleList()
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.current = val
            this.getRoleList()
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.dialogVisible = false
            this.editForm = {}
        },
        handleClose() {
            this.resetForm('editForm')
        },
        getRoleList() {
            this.$axios.get("/sys/role/list", {
                params: {
                    name: this.searchForm.name,
                    current: this.current,
                    size: this.size
                }
            }).then(res => {
                this.tableData = res.data.data.records
                this.size = res.data.data.size
                this.total = res.data.data.total
                this.current = res.data.data.current
                console.log("RoleList:" + res)
            })
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$axios.post('/sys/role/' + (this.editForm.id ? 'update' : 'save'), this.editForm).then(res => {
                        this.$message({
                            showClose: true,
                            message: '操作成功',
                            type: 'success',
                            onClose: () => {
                                this.getRoleList()
                            },
                        });
                        this.dialogVisible = false
                        this.resetForm(formName)
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        editHandle(id) {
            this.$axios.get('/sys/role/info/' + id).then(res => {
                console.log('ltyzzz' + res.data.data)
                this.editForm = res.data.data.sysRole
                console.log(this.editForm)
                this.dialogVisible = true
            })
        },
        delHandle(id) {
            var ids = []
            if (id) {
                ids.push(id)
            } else {
                this.multipleSelection.forEach(row => {
                    ids.push(row.id)
                })
            }
            console.log(ids)
            this.$axios.post("/sys/role/delete/", ids).then(res => {
                this.$message({
                    showClose: true,
                    message: '删除成功',
                    type: 'success',
                    onClose: () => {
                        this.getRoleList()
                    },
                });
            })
        },
        permHandle(id) {
            this.permDialogVisible = true
            this.$axios.get("/sys/role/info/" + id).then(res => {
                console.log(res)
                this.$refs.permTree.setCheckedKeys(res.data.data.sysRole.menuIds)
                this.permForm = res.data.data.sysRole
                console.log(res)
            })
        },
        submitPermFormhandle(formName) {
            var menuIds = this.$refs.permTree.getCheckedKeys()
            console.log(menuIds)
            this.$axios.post("/sys/role/perm/" + this.permForm.id, menuIds).then(res => {
                this.$message({
                    showClose: true,
                    message: '提交成功',
                    type: 'success',
                    onClose: () => {
                        this.getRoleList()
                    },
                });
                this.permDialogVisible = false
                this.resetForm(formName)
            })
        }
    }
}
</script>

<style>
.el-pagination {
    float: right;
    margin-top: 22px;
}
</style>