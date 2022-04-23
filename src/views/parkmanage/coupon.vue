<template>
    <div class="app-container">
        <el-form :inline="true" :model="couponQuery" class="demo-form-inline">
            <el-form-item>
                <el-button type="success" @click="openAdd()">添加优惠券</el-button>
            </el-form-item>
            <div>
                <el-form-item label="用户ID">
                    <el-input v-model="couponQuery.userId" placeholder="用户ID"></el-input>
                </el-form-item>
                <el-form-item label="标题">
                    <el-input v-model="couponQuery.title" placeholder="标题"></el-input>
                </el-form-item>
            </div>

            <div>
                <el-form-item label="有效期（天）">
                    <el-input-number v-model="couponQuery.minValidTime" :min="1" :max="365"></el-input-number>
                    &nbsp;~&nbsp;
                    <el-input-number v-model="couponQuery.maxValidTime" :min="1" :max="365"></el-input-number>
                </el-form-item>
            </div>

            <div>
                <el-form-item label="门槛金额（元）">
                    <el-input-number v-model="couponQuery.minThresholdAmount" :min="1" :max="999"></el-input-number>
                    &nbsp;~&nbsp;
                    <el-input-number v-model="couponQuery.maxThresholdAmount" :min="1" :max="1000"></el-input-number>
                </el-form-item>
            </div>

            <div>
                <el-form-item label="优惠金额（元）">
                    <el-input-number v-model="couponQuery.minDiscountAmount" :min="1" :max="999"></el-input-number>
                    &nbsp;~&nbsp;
                    <el-input-number v-model="couponQuery.maxDiscountAmount" :min="1" :max="1000"></el-input-number>
                </el-form-item>
                <el-form-item>
                    <el-button @click="clearCouponQuery">清空</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getCouponList()">查询</el-button>
                </el-form-item>
            </div>

        </el-form>

        <el-table :data="list">
            <el-table-column align="center" label="id" width="50">
                <template slot-scope="scope">
                    {{ scope.$index + 1 }}
                </template>
            </el-table-column>
            <el-table-column label="标题" align="center" width="200">
                <template slot-scope="scope">
                    {{ scope.row.title }}
                </template>
            </el-table-column>
            <el-table-column label="门槛金额" align="center">
                <template slot-scope="scope">
                    {{ scope.row.thresholdAmount }}
                </template>
            </el-table-column>
            <el-table-column label="优惠金额" align="center">
                <template slot-scope="scope">
                    {{ scope.row.discountAmount }}
                </template>
            </el-table-column>
            <el-table-column label="所属用户id" align="center" width="180">
                <template slot-scope="scope">
                    {{ scope.row.userId }}
                </template>
            </el-table-column>
            <el-table-column label="有效期" align="center">
                <template slot-scope="scope">
                    {{ scope.row.validTime }}天
                </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" width="200">
                <template slot-scope="scope">
                    {{ scope.row.createTime }}
                </template>
            </el-table-column>
            <el-table-column label="过期时间" align="center" width="200">
                <template slot-scope="scope">
                    {{ scope.row.expirationTime }}
                </template>
            </el-table-column>
            <el-table-column label="状态" align="center">
                <template slot-scope="scope">
                    {{ scope.row.status == 0 ? '待使用' : scope.row.status == 1 ? '已使用' : '已过期' }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" icon="el-icon-edit" @click="editDataById(scope.row.id)">修改</el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="block">
            <span class="demonstration"></span>
            <el-pagination :current-page="page" :page-size="limit" :total="total" style="padding: 30px 0; text-align: center;" layout="total, prev, pager, next, jumper" @current-change="getCouponList" />
        </div>

        <el-dialog title="添加框" :visible.sync="dialogVisibleAdd">
            <span>
                <el-form :model="addForm" :rules="rules" ref="ruleForm" label-width="100px">
                    <el-form-item label="优惠券标题" prop="title">
                        <el-input v-model="addForm.title"></el-input>
                    </el-form-item>
                    <el-form-item label="门槛金额" prop="thresholdAmount">
                        <el-input-number v-model="addForm.thresholdAmount" :precision="1" :step="0.1" :max="1000"></el-input-number>
                    </el-form-item>
                    <el-form-item label="优惠金额" prop="discountAmount">
                        <el-input-number v-model="addForm.discountAmount" :precision="1" :step="0.1" :max="1000"></el-input-number>
                    </el-form-item>
                    <el-form-item label="用户ID" prop="userId">
                        <el-input v-model="addForm.userId" style="width: 200px;"></el-input>
                        <el-button type="text" @click="checkUserById(addForm.userId)" style="margin-left: 10px;">校验</el-button>
                    </el-form-item>
                    <el-form-item label="有效期" prop="validTime">
                        <el-input-number v-model="addForm.validTime" :min="1" :max="365"></el-input-number>
                    </el-form-item>
                </el-form>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetAddForm()">重 置</el-button>
                <el-button type="primary" @click="confirmAdd()">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="编辑框" :visible.sync="dialogVisibleEdit">
            <span>
                <el-form :model="editForm" :rules="rules" ref="ruleForm" label-width="100px">
                    <el-form-item label="优惠券标题" prop="title">
                        <el-input v-model="editForm.title"></el-input>
                    </el-form-item>
                    <el-form-item label="门槛金额" prop="thresholdAmount">
                        <el-input-number v-model="editForm.thresholdAmount" :precision="1" :step="0.1" :max="1000"></el-input-number>
                    </el-form-item>
                    <el-form-item label="优惠金额" prop="discountAmount">
                        <el-input-number v-model="editForm.discountAmount" :precision="1" :step="0.1" :max="1000"></el-input-number>
                    </el-form-item>
                    <el-form-item label="有效期" prop="validTime">
                        <el-input-number v-model="editForm.validTime" :min="1" :max="365"></el-input-number>
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-select v-model="editForm.status" placeholder="请选择">
                            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmEdit()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            list: [],
            couponQuery: {},
            page: 1,
            limit: 5,
            total: 0,
            editForm: {},
            addForm: {},
            dialogVisibleAdd: false,
            dialogVisibleEdit: false,
            statusOptions: [{
                value: 0,
                label: '待使用'
            }, {
                value: 1,
                label: '已使用'
            }, {
                value: 2,
                label: '已过期'
            }],
            rules: {
                title: [
                    { required: true, message: '请输入优惠券标题', trigger: 'blur' }
                ],
                thresholdAmount: [
                    { required: true, message: '请选择门槛金额', trigger: 'blur' }
                ],
                discountAmount: [
                    { required: true, message: '请选择优惠金额', trigger: 'blur' }
                ],
                userId: [
                    { required: true, message: '请输入用户ID', trigger: 'blur' }
                ],
                validTime: [
                    { required: true, message: '请选择有效期', trigger: 'blur' }
                ],
                status: [
                    { required: true, message: '请选择状态', trigger: 'blur' }
                ],
            },
        }
    },
    methods: {
        openAdd() {
            this.dialogVisibleAdd = true
        },
        getCouponList(page = 1) {
            this.page = page
            this.$axios.post(`/carPark/coupon/selectConditionCoupon/${this.page}/${this.limit}`, this.couponQuery)
                .then(res => {
                    console.log(res.data.data)
                    this.list = res.data.data.records
                    this.total = res.data.data.total
                })
        },
        clearCouponQuery() {
            this.couponQuery = {}
        },
        editDataById(id) {
            this.dialogVisibleEdit = true
            this.$axios.get(`/carPark/coupon/getCoupon/${id}`)
                .then(res => {
                    this.editForm = res.data.data.coupon
                })
        },
        removeDataById(id) {
            this.$confirm('此操作将永久删除记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.delete(`/carPark/coupon/deleteCoupon/${id}`)
                    .then(response => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getCouponList()
                    })
            })
        },
        resetAddForm() {
            this.addForm = {}
        },
        resetEditForm() {
            this.editForm = {}
        },
        confirmAdd() {
            this.$axios.post("/carPark/coupon/addCoupon", this.addForm)
                .then(res => {
                    this.$message({
                        type: 'success',
                        message: '添加成功!'
                    });
                    this.dialogVisibleAdd = false
                    this.resetAddForm()
                    this.getCouponList()
                })
        },
        confirmEdit() {
            this.$axios.post("/carPark/coupon/updateCoupon", this.editForm)
                .then(res => {
                    this.$message({
                        type: 'success',
                        message: '编辑成功!'
                    });
                    this.dialogVisibleEdit = false
                    this.resetEditForm()
                    this.getCouponList()
                })
        },
        checkUserById(userId) {
            this.$axios.post(`/carPark/coupon/checkUser/${userId}`)
                .then(res => {
                    if (res.data.data.num === 0) {
                        this.$message({
                            type: 'warning',
                            message: '不存在此用户，请重新输入！'
                        })
                    } else {
                        this.$message({
                            type: 'success',
                            message: '存在此用户，请继续操作！'
                        })
                    }
                })
        }
    },
    created() {
        this.getCouponList()
    }
}
</script>