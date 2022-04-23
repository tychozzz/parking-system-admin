<template>
    <div class="app-container">

        <el-form :inline="true" :model="carParkQuery" class="demo-form-inline">
            <div>
                <el-form-item label="车场名称">
                    <el-input v-model="carParkQuery.name" placeholder="车场名称"></el-input>
                </el-form-item>
                <el-form-item label="车场地址">
                    <el-input v-model="carParkQuery.address" placeholder="车场地址"></el-input>
                </el-form-item>
                <el-form-item label="联系人姓名">
                    <el-input v-model="carParkQuery.contactPerson" placeholder="联系人姓名"></el-input>
                </el-form-item>
            </div>

            <div>
                <el-form-item label="价格区间">
                    <el-input-number v-model="carParkQuery.minPrice" :min="1" :max="10"></el-input-number>
                    &nbsp;~&nbsp;
                    <el-input-number v-model="carParkQuery.maxPrice" :min="1" :max="10"></el-input-number>
                </el-form-item>
                <!-- <el-form-item label='是否剩余'>
                    <el-switch v-model="carParkQuery.isLeft" active-color="#13ce66" inactive-color="#ff4949">
                    </el-switch>
                </el-form-item> -->
                <el-form-item>
                    <el-button @click="clearCarParkQuery">清空</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getCarList()">查询</el-button>
                </el-form-item>
            </div>

            <el-form-item>
                <el-button type="primary" @click="outputExcel()">导出Excel</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="openAdd()">添加</el-button>
            </el-form-item>

        </el-form>
        <el-table :data="list" id="parkingInfo_list">
            <el-table-column align="center" label="车场编号" width="95">
                <template slot-scope="scope">
                    {{ scope.$index + 1 }}
                </template>
            </el-table-column>
            <el-table-column label="车场名称" width="310" align="center">
                <template slot-scope="scope">
                    {{ scope.row.name }}
                </template>
            </el-table-column>
            <el-table-column label="车场地址" width="310" align="center">
                <template slot-scope="scope">
                    {{ scope.row.address }}
                </template>
            </el-table-column>
            <el-table-column label="车位数" width="120" align="center">
                <template slot-scope="scope">
                    {{ scope.row.carNum }}
                </template>
            </el-table-column>
            <el-table-column label="剩余车位数" width="120" align="center">
                <template slot-scope="scope">
                    {{ scope.row.leftCarNum }}
                </template>
            </el-table-column>
            <el-table-column label="收费标准" width="120" align="center">
                <template slot-scope="scope">
                    {{ scope.row.price ? scope.row.price + '元/小时' : '暂无' }}
                </template>
            </el-table-column>
            <el-table-column label="联系方式" width="200" align="center">
                <template slot-scope="scope">
                    {{ scope.row.contactPerson + '：' + scope.row.contactPhone}}
                </template>
            </el-table-column>
            <el-table-column label="车场图片" align="center">
                <template slot-scope="scope">
                    <el-image style="width: 30px; height: 30px" :src="scope.row.image" :preview-src-list="[scope.row.image]">
                        <div slot="error" class="image-slot">
                            <i class="el-icon-picture-outline"></i>
                        </div>
                    </el-image>
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
            <el-pagination :current-page="page" :page-size="limit" :total="total" style="padding: 30px 0; text-align: center;" layout="total, prev, pager, next, jumper" @current-change="getCarList" />
        </div>

        <el-dialog title="添加框" :visible.sync="dialogVisibleAdd">
            <span>
                <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px" class="demo-addForm">

                    <el-form-item label="停车场名称" prop="name">
                        <el-input v-model="addForm.name"></el-input>
                    </el-form-item>

                    <el-form-item label="车位数" prop="carNum">
                        <el-input v-model="addForm.carNum"></el-input>
                    </el-form-item>

                    <el-form-item label="联系人名字" prop="contactPerson">
                        <el-input v-model="addForm.contactPerson"></el-input>
                    </el-form-item>

                    <el-form-item label="联系人电话" prop="contactPhone">
                        <el-input v-model="addForm.contactPhone"></el-input>
                    </el-form-item>

                    <el-form-item label="入口数" prop="entranceNum">
                        <el-input v-model="addForm.entranceNum"></el-input>
                    </el-form-item>

                    <el-form-item label="出口数" prop="exitNum">
                        <el-input v-model="addForm.exitNum"></el-input>
                    </el-form-item>

                    <el-form-item label="具体地址" prop="address">
                        <el-input v-model="addForm.address"></el-input>
                    </el-form-item>

                    <el-form-item label="经纬度" prop="longiAndLati">
                        <el-input v-model="addForm.longitude" style="width: 200px;"></el-input>
                        &nbsp;,&nbsp;
                        <el-input v-model="addForm.latitude" style="width: 200px;"></el-input>
                        <div id="amap" style="margin: 25px 0 10px 0;">
                            <el-amap vid="amap" class="amap" :center="center" :plugin="plugin" :events="addMapEvents">
                                <el-amap-marker vid="component-marker" :position="mapInfo.lnglat"></el-amap-marker>
                            </el-amap>
                        </div>
                    </el-form-item>

                    <el-form-item label="车场图片" prop="image">
                        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShowAdd=true">更换头像</el-button>
                        <!--
          v-show：是否显示上传组件
          :key：类似于id，如果一个页面多个图片上传控件，可以做区分
          :url：后台上传的url地址
          @close：关闭上传组件
          @crop-upload-success：上传成功后的回调
          <input type="file" name="file"/>
          -->
                        <image-cropper v-show="imagecropperShowAdd" :width="300" :height="300" :key="'addUploadImage'" :url="'http://47.113.191.6:1302/oss/fileoss'" field="file" @close="closeAdd" @crop-upload-success="cropSuccessAdd" />
                    </el-form-item>

                </el-form>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetAddForm()">重 置</el-button>
                <el-button type="primary" @click="submitForm()">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="编辑框" :visible.sync="dialogVisibleEdit">
            <span>
                <el-form :model="editForm" :rules="rules" ref="addForm" label-width="100px" class="demo-addForm">

                    <el-form-item label="停车场名称" prop="name">
                        <el-input v-model="editForm.name"></el-input>
                    </el-form-item>

                    <el-form-item label="车位数" prop="carNum">
                        <el-input v-model="editForm.carNum"></el-input>
                    </el-form-item>

                    <el-form-item label="联系人名字" prop="contactPerson">
                        <el-input v-model="editForm.contactPerson"></el-input>
                    </el-form-item>

                    <el-form-item label="联系人电话" prop="contactPhone">
                        <el-input v-model="editForm.contactPhone"></el-input>
                    </el-form-item>

                    <el-form-item label="入口数" prop="entranceNum">
                        <el-input v-model="editForm.entranceNum"></el-input>
                    </el-form-item>

                    <el-form-item label="出口数" prop="exitNum">
                        <el-input v-model="editForm.exitNum"></el-input>
                    </el-form-item>

                    <el-form-item label="具体地址" prop="address">
                        <el-input v-model="editForm.address"></el-input>
                    </el-form-item>

                    <el-form-item label="经纬度" prop="longiAndLati">
                        <el-input v-model="editForm.longitude" style="width: 200px;"></el-input>
                        &nbsp;,&nbsp;
                        <el-input v-model="editForm.latitude" style="width: 200px;"></el-input>
                        <div id="amap" style="margin: 25px 0 10px 0;">
                            <el-amap vid="amap" class="amap" :center="center" :plugin="plugin" :events="editMapEvents">
                                <el-amap-marker vid="component-marker" :position="mapInfo.lnglat"></el-amap-marker>
                            </el-amap>
                        </div>
                    </el-form-item>

                    <el-form-item label="车场图片" prop="image">
                        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShowEdit=true">修改图片</el-button>
                        <!--
          v-show：是否显示上传组件
          :key：类似于id，如果一个页面多个图片上传控件，可以做区分
          :url：后台上传的url地址
          @close：关闭上传组件
          @crop-upload-success：上传成功后的回调
          <input type="file" name="file"/>
          -->
                        <image-cropper v-show="imagecropperShowEdit" :width="300" :height="300" :key="'addUploadImage'" :url="'http://47.113.191.6:1302/oss/fileoss'" field="file" @close="closeEdit" @crop-upload-success="cropSuccessEdit" />
                    </el-form-item>

                </el-form>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetEditForm()">重 置</el-button>
                <el-button type="primary" @click="confirmEdit()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import ImageCropper from '@/components/ImageCropper'


export default {
    components: { ImageCropper },
    component: { ImageCropper },
    filters: {
        statusFilter(status) {
            const statusMap = {
                published: 'success',
                draft: 'gray',
                deleted: 'danger'
            }
            return statusMap[status]
        }
    },
    data() {
        return {
            center: [114.343979, 30.513985],   // 地图初始化视图中心点
            plugin: [                          // 这里放扩展的插件
                {
                    pName: 'Scale',                // 比例尺
                }
            ],
            mapInfo: {
                lnglat: [114.343979, 30.513985]
            },
            addMapEvents: {
                click: e => {
                    this.addForm.longitude = e.lnglat.lng
                    this.addForm.latitude = e.lnglat.lat
                    this.mapInfo.lnglat = [e.lnglat.lng, e.lnglat.lat];
                }
            },
            editMapEvents: {
                click: e => {   
                    this.editForm.longitude = e.lnglat.lng
                    this.editForm.latitude = e.lnglat.lat
                    this.mapInfo.lnglat = [e.lnglat.lng, e.lnglat.lat]; 
                }
            },
            list: [],
            carParkQuery: {
                name: '',
                address: '',
                contactPerson: '',
                minPrice: 1,
                maxPrice: 10
            },
            page: 1,
            limit: 5,
            total: 0,
            dialogVisibleAdd: false,
            dialogVisibleEdit: false,
            addForm: {
                name: '',
                carNum: '',
                contactPerson: '',
                contactPhone: '',
                entranceNum: '',
                exitNum: '',
                address: '',
                image: '',
                longitude: '',
                latitude: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入车场名称', trigger: 'blur' }
                ],
                carNum: [
                    { required: true, message: '请输入xx', trigger: 'blur' }
                ],
                contactPerson: [
                    { required: true, message: '请输入', trigger: 'blur' }
                ],
                contactPhone: [
                    { required: true, message: '请输入', trigger: 'blur' }
                ],
                entranceNum: [
                    { required: true, message: '请输入', trigger: 'blur' }
                ],
                exitNum: [
                    { required: true, message: '请输入', trigger: 'blur' }
                ],
                address: [
                    { required: true, message: '请输入', trigger: 'blur' }
                ],
                image: [
                    { required: true, message: '请输入', trigger: 'blur' }
                ],
                longiAndLati: [
                    { required: true, message: '请输入', trigger: 'blur' }
                ]
            },
            editForm: {},
            imagecropperShowAdd: false,
            imagecropperKeyAdd: 0,
            imagecropperShowEdit: false,
            imagecropperKeyEdit: 0
        }
    },
    methods: {
        openAdd() {
            this.dialogVisibleAdd = true
        },
        getCarList(page = 1) {
            this.page = page
            this.$axios.post(`/carPark/list/selectConditionCarPark/${this.page}/${this.limit}`, this.carParkQuery)
                .then(res => {
                    this.list = res.data.data.records
                    this.total = res.data.data.total
                    // console.log("车场数据" + JSON.stringify(res.data.data.records))
                })
        },
        outputExcel() {
            window.location =
                'http://47.113.191.6:1102/carPark/list/download'
        },
        removeDataById(id) {
            this.$confirm('此操作将永久删除记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.delete(`/carPark/list/deleteCarPark/${id}`)
                    .then(response => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getCarList()
                    })
            })
        },
        editDataById(id) {
            this.dialogVisibleEdit = true
            this.$axios.get(`/carPark/list/getCarPark/${id}`)
                .then(res => {
                    this.editForm = res.data.data.carPark
                    console.log(res.data.data.carPark)
                })
        },
        confirmEdit() {
            this.$axios.post(`/carPark/list/updateCarPark`, this.editForm)
                .then(res => {
                    this.$message({
                        type: 'success',
                        message: '编辑成功!'
                    });
                    this.getCarList()
                })
            this.dialogVisibleEdit = false
            this.editForm = {}
        },
        resetAddForm() {
            this.addForm = {}
        },
        resetEditForm() {
            this.editForm = {}
        },
        submitForm() {
            this.$axios.post(`/carPark/list/addCarPark`, this.addForm).then(res => {
                this.$message({
                    type: 'success',
                    message: '添加成功!'
                });
                this.getCarList()
            }
            )
            this.dialogVisibleAdd = false
            this.addForm = {}
        },
        cropSuccessAdd(data) {
            this.imagecropperShowAdd = false
            this.addForm.image = data.url
            this.imagecropperKey = this.imagecropperKey + 1
        },
        closeAdd() {
            this.imagecropperShowAdd = false
            //上传组件初始化
            this.imagecropperKey = this.imagecropperKey + 1
        },
        cropSuccessEdit(data) {
            this.imagecropperShowEdit = false
            this.editForm.image = data.url
            this.imagecropperKey = this.imagecropperKey + 1
        },
        closeEdit() {
            this.imagecropperShowEdit = false
            //上传组件初始化
            this.imagecropperKey = this.imagecropperKey + 1
        },
        clearCarParkQuery() {
            this.carParkQuery = {}
        },
    },
    created() {
        this.getCarList()
    }
}
</script>

<style scoped>
#amap {
    height: 300px;
    width: 700px;
}
</style>