<template>
    <div class="app-container">

        <el-form :inline="true" :model="appointmentQuery" class="demo-form-inline">
            <el-form-item label="用户ID">
                <el-input v-model="appointmentQuery.userId" placeholder="用户ID"></el-input>
            </el-form-item>
            <el-form-item label="车场ID">
                <el-input v-model="appointmentQuery.carParkId" placeholder="车场ID"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="clearAppointmentQuery">清空</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getAppointmentList()">查询</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="list">
            <el-table-column align="center" label="id" width="95">
                <template slot-scope="scope">
                    {{ scope.$index + 1 }}
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
                    <!-- <el-button type="primary" size="mini" icon="el-icon-edit" @click="checkCarParkById(scope.row.id)">查看</el-button> -->
                </template>
            </el-table-column>
            <el-table-column label="预约时间" align="center">
                <template slot-scope="scope">
                    {{ scope.row.createTime }}
                </template>
            </el-table-column>
            <el-table-column label="预约状态" align="center">
                <template slot-scope="scope">
                    {{ scope.row.status == 0 ? '未进入' : scope.row.status == 1 ? '已进入' : '已超时' }}
                </template>
            </el-table-column>
        </el-table>
        <div class="block">
            <span class="demonstration"></span>
            <el-pagination :current-page="page" :page-size="limit" :total="total" style="padding: 30px 0; text-align: center;" layout="total, prev, pager, next, jumper" @current-change="getAppointmentList" />
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            list: [],
            appointmentQuery: {},
            page: 1,
            limit: 5,
            total: 0,
        }
    },
    methods: {
        getAppointmentList(page = 1) {
            this.page = page
            this.$axios.post(`/carPark/appointment/selectConditionAppointment/${this.page}/${this.limit}`, this.appointmentQuery)
            .then(res => {
                console.log(res.data.data)
                this.list = res.data.data.records
                this.total = res.data.data.total
            })
        },
        clearAppointmentQuery() {
            this.appointmentQuery = {}      
        }
    },
    created() {
        this.getAppointmentList()
    }
}
</script>