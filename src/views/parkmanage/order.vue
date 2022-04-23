<template>
    <div class="app-container">

        <el-form :inline="true" :model="orderQuery" class="demo-form-inline">
            <div>
                <el-form-item label="订单编号">
                    <el-input v-model="orderQuery.orderNo" placeholder="订单编号"></el-input>
                </el-form-item>
                <el-form-item label="用户ID">
                    <el-input v-model="orderQuery.userId" placeholder="用户ID"></el-input>
                </el-form-item>
                <el-form-item label="车场ID">
                    <el-input v-model="orderQuery.carParkId" placeholder="车场ID"></el-input>
                </el-form-item>
            </div>

            <div>
                <el-form-item label="订单金额区间">
                    <el-input-number v-model="orderQuery.minPrice" :min="1" :max="999"></el-input-number>
                    &nbsp;~&nbsp;
                    <el-input-number v-model="orderQuery.maxPrice" :min="1" :max="1000"></el-input-number>
                </el-form-item>
                <el-form-item>
                    <el-button @click="clearOrderQuery">清空</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getOrderList()">查询</el-button>
                </el-form-item>
            </div>

        </el-form>

        <el-table :data="list">
            <el-table-column align="center" label="id" width="95">
                <template slot-scope="scope">
                    {{ scope.$index + 1 }}
                </template>
            </el-table-column>
            <el-table-column label="订单编号" align="center" width="200">
                <template slot-scope="scope">
                    {{ scope.row.orderNo }}
                </template>
            </el-table-column>
            <el-table-column label="用户名" align="center">
                <template slot-scope="scope">
                    {{ scope.row.username }}
                </template>
            </el-table-column>
            <el-table-column label="车场名" align="center">
                <template slot-scope="scope">
                    {{ scope.row.carParkName }}
                </template>
            </el-table-column>
            <el-table-column label="车牌号" align="center">
                <template slot-scope="scope">
                    {{ scope.row.plate }}
                </template>
            </el-table-column>
            <el-table-column label="原始金额" align="center">
                <template slot-scope="scope">
                    ￥{{ scope.row.originalFee / 100 }}
                </template>
            </el-table-column>
            <el-table-column label="优惠金额" align="center">
                <template slot-scope="scope">
                    ￥{{ scope.row.discountAmount / 100 }}
                </template>
            </el-table-column>
            <el-table-column label="订单金额" align="center">
                <template slot-scope="scope">
                    ￥{{ scope.row.totalFee / 100 }}
                </template>
            </el-table-column>
            <el-table-column label="下单时间" align="center">
                <template slot-scope="scope">
                    {{ scope.row.createTime }}
                </template>
            </el-table-column>
            <el-table-column label="订单状态" align="center">
                <template slot-scope="scope">
                    {{ scope.row.status == 0 ? '已支付' : scope.row.status == 1 ? '待支付' : '已取消' }}
                </template>
            </el-table-column>
        </el-table>
        <div class="block">
            <span class="demonstration"></span>
            <el-pagination :current-page="page" :page-size="limit" :total="total" style="padding: 30px 0; text-align: center;" layout="total, prev, pager, next, jumper" @current-change="getOrderList" />
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            list: [],
            orderQuery: {},
            page: 1,
            limit: 5,
            total: 0,
        }
    },
    methods: {
        getOrderList(page = 1) {
            this.page = page
            this.$axios.post(`/carPark/order/selectConditionOrder/${this.page}/${this.limit}`, this.orderQuery)
                .then(res => {
                    console.log(res.data.data)
                    this.list = res.data.data.records
                    this.total = res.data.data.total
                })
        },
        clearOrderQuery() {
            this.orderQuery = {}
        }
    },
    created() {
        this.getOrderList()
    }
}
</script>