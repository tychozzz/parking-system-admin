import axios from "axios"
import router from "./router"
import Element from "element-ui"

axios.defaults.baseURL = "http://localhost:1001"

const request = axios.create({
    timeout: 5000,
    headers: {
        'Content-Type': "application/json; charset=utf-8"
    }
})

request.interceptors.request.use(config => {
    config.headers['Authorization'] = localStorage.getItem("token")
    return config
})

request.interceptors.response.use(response => {
    let res = response.data
    if (res.code === 200) {
        return response 
    } else {
        console.log("lty" + res)
        Element.Message.error(!res.message ? '系统异常' : res.message)
        return Promise.reject(response.data.message)
    }
}, error => {
    console.log(error)
    console.log(error.response.status)
    if (error.response.data) {
        error.message = error.response.data.message
    }

    if (error.response.status === 401) {
        router.push('/login')
    }

    if (error.response.status === 403) {
        router.push('/login')
    }

    Element.Message.error(error.message, {duration: 3000})
    return Promise.reject(error.messag)
})

export default request 