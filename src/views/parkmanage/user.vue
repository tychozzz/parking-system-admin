<template>
    <div class="app-container">

        <el-form :inline="true" :model="carParkUserQuery" class="demo-form-inline">
            <el-form-item label="姓名">
                <el-input v-model="carParkUserQuery.name" placeholder="姓名"></el-input>
            </el-form-item>
            <el-form-item label="车牌号">
                <el-input v-model="carParkUserQuery.plate" placeholder="车牌号"></el-input>
            </el-form-item>
            <el-form-item label="手机号">
                <el-input v-model="carParkUserQuery.phone" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="clearCarParkUserQuery">清空</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getCarUserList()">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="outputExcel()">导出Excel</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="dialogVisibleAdd=true">添加</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="list">
            <el-table-column align="center" label="id" width="95">
                <template slot-scope="scope">
                    {{ scope.$index + 1 }}
                </template>
            </el-table-column>
            <el-table-column label="姓名" align="center">
                <template slot-scope="scope">
                    {{ scope.row.name }}
                </template>
            </el-table-column>
            <el-table-column label="手机号" align="center">
                <template slot-scope="scope">
                    {{ scope.row.phone }}
                </template>
            </el-table-column>
            <el-table-column label="车牌号" align="center">
                <template slot-scope="scope">
                    <!-- {{ scope.row.plate }} -->
                    <el-button v-if="scope.row.plates" type="success" size="mini" icon="el-icon-view" @click="checkPlateById(scope.row.id)">查看</el-button>
                    <el-button v-else type="success" size="mini" icon="el-icon-edit" @click="checkPlateById(scope.row.id)">添加</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="300" align="center">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" icon="el-icon-edit" @click="editDataById(scope.row.id)">修改</el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="block">
            <span class="demonstration"></span>
            <el-pagination :current-page="page" :page-size="limit" :total="total" style="padding: 30px 0; text-align: center;" layout="total, prev, pager, next, jumper" @current-change="getCarUserList" />
        </div>

        <!-- 添加车主 -->
        <el-dialog title="添加框" :visible.sync="dialogVisibleAdd">
            <span>
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="ruleForm.name"></el-input>
                    </el-form-item>

                    <el-form-item label="手机号" prop="phone">
                        <el-input v-model="ruleForm.phone"></el-input>
                    </el-form-item>
                </el-form>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetRuleForm()">重 置</el-button>
                <el-button type="primary" @click="submitAddUserForm()">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑车主 -->
        <el-dialog title="编辑框" :visible.sync="dialogVisibleEdit">
            <span>
                <el-form :model="editForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="editForm.name"></el-input>
                    </el-form-item>

                    <el-form-item label="手机号" prop="phone">
                        <el-input v-model="editForm.phone"></el-input>
                    </el-form-item>
                </el-form>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetEditForm()">重 置</el-button>
                <el-button type="primary" @click="confirmEdit()">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 查看车牌 -->
        <el-dialog title="车牌列表" :visible.sync="plateDialogVisibleCheck">
            <span>
                <el-form :model="plateForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="输入添加车牌" prop="plate">
                        <el-input v-model="plateForm.plate" style="width: 300px;"></el-input>
                        <el-button type="primary" @click="addPlate()" style="margin-left: 20px;">添加</el-button>
                    </el-form-item>

                    <el-form-item label="车牌列表" prop="plateList">
                        <el-card style="width: 480px">
                            <div v-if="plateForm.plateList.length == 0">
                                此用户暂无车牌，请添加！
                            </div>
                            <div v-else v-for="(item,index) in plateForm.plateList" :key="index" style="display: flex; justify-content:space-between;">
                                <div style="padding: 18px 0; font-size: 14px;">
                                    {{'车牌' + (index+1) + '：' + item}}
                                </div>
                                <el-button type="text" size="mini" @click="plateForm.plateList.splice(index,1)">删除</el-button>
                            </div>
                        </el-card>
                    </el-form-item>
                </el-form>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmPlateEdit()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            list: [],
            carParkUserQuery: {},
            ruleForm: {
                name: '',
                phone: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入车场名称', trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '请输入', trigger: 'blur' }
                ]
            },
            editForm: {
                name: '',
                phone: ''
            },
            plateForm: {
                id: '',
                plate: '鄂A',
                plateList: ['鄂ABY636', '鄂AZX723', '鄂AY0821']
            },
            page: 1,
            limit: 5,
            total: 0,
            dialogVisibleAdd: false,
            dialogVisibleEdit: false,
            plateDialogVisibleCheck: false,
        }
    },
    methods: {
        getCarUserList(page = 1) {
            this.page = page
            this.$axios.post(`/carPark/user/selectConditionCarParkUser/${this.page}/${this.limit}`, this.carParkUserQuery)
            .then(res => {
                console.log(res.data.data)
                this.list = res.data.data.records
                this.total = res.data.data.total
            })
        },
        outputExcel() {
            window.location =
                'http://47.113.191.6:1102/carPark/user/download'
        },
        removeDataById(id) {
            this.$confirm('此操作将永久删除记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.delete(`/carPark/user/deleteCarParkUser/${id}`)
                    .then(response => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getCarUserList()
                    })
            })
        },
        editDataById(id) {
            this.dialogVisibleEdit = true
            this.$axios.get(`/carPark/user/getCarParkUser/${id}`)
                .then(res => {
                    this.editForm = res.data.data.user
                })
        },
        checkPlateById(id) {
            this.plateDialogVisibleCheck = true
            this.$axios.get(`/carPark/user/getPlates/${id}`)
                .then(res => {
                    this.plateForm.plateList = res.data.data.plates
                    this.plateForm.id = id
                })
        },
        addPlate() {        
            this.plateForm.plateList.push(this.plateForm.plate)
        },
        confirmPlateEdit() {
            this.$axios.post(`/carPark/user/editPlate/${this.plateForm.id}`, this.plateForm.plateList)
                .then(res => {
                    this.$message({
                        type: 'success',
                        message: '编辑车牌成功!'
                    });
                })
            this.plateDialogVisibleCheck = false
            this.plateForm.plate = '鄂A'
        },
        confirmEdit() {
            this.$axios.post(`/carPark/user/updateCarParkUser`, this.editForm)
            .then(res => {
                this.$message({
                    type: 'success',
                    message: '编辑成功!'
                });
                this.getCarUserList()
            })
            this.dialogVisibleEdit = false
            this.editForm = {}
        },
        resetRuleForm() {
            this.ruleForm = {}
        },
        resetEditForm() {
            this.editForm = {}
        },
        submitAddUserForm() {
            this.$axios.post(`/carPark/user/addCarParkUser`,this.ruleForm).then(res => {
                this.$message({
                    type: 'success',
                    message: '添加成功!'
                });
                this.getCarUserList()
                }      
            )
            this.dialogVisibleAdd = false
            this.ruleForm = {}
        },
        clearCarParkUserQuery() {
            this.carParkUserQuery = {}      
        }
    },
    created() {
        this.getCarUserList()
    }
}
</script>