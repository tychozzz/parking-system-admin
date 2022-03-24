<template>
    <el-row type="flex" class="row-bg" justify="center">
        <el-col :xl="6" :lg="7">
            <h2>欢迎来到鸿讯停车场管理系统</h2>
            <el-image :src="require('@/assets/ltywechat.jpeg')"></el-image>
            <p>企业客服微信</p>
        </el-col>
        <el-col :span="1">
            <el-divider direction="vertical"></el-divider>
        </el-col>
        <el-col :xl="6" :lg="7">
            <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="100px" class="demo-loginForm">
                <el-form-item label="用户名" prop="username" style="width: 380px">
                    <el-input v-model="loginForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password" style="width: 380px">
                    <el-input v-model="loginForm.password" type="password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('loginForm')">登陆</el-button>
                    <!-- <el-button @click="resetForm('loginForm')">重置</el-button> -->
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<script>
import qs from 'qs'
export default {
    name: "login",
    data() {
        return {
            loginForm: {
                username: '',
                password: '',
                code: '11111',
                token: 'aaaaa',
            },
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                ]
            },
        };
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$axios.post('/sys/login?' + qs.stringify(this.loginForm)).then(res => {
                        const jwt = res.headers['authorization']
                        this.$store.commit('SET_TOKEN', jwt) //调用store中的SET_TOKEN方法，将token存入store
                        this.$router.push('/index')
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    },
    created() {
    }
}
</script>

<style scoped>
.el-divider {
    height: 200px;
}
.el-row {
    background-color: #fafafa;
    height: 100%;
    display: flex;
    align-items: center;
    /* text-align: c; */
    text-align: center;
}
.captchaImg {
    float: left;
    margin-left: 8px;
    border-radius: 4px;
}
</style>