import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '../views/home.vue'
import login from '../views/login.vue'
import index from '../views/index.vue'

import axios from '../axios'
import store from '../store'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

const routes = [
    {
        path: '/',
        name: 'home',
        component: home,
        children: [
            {
                path: '/index',
                name: 'index',
                meta: {
                    title: "首页"
                },
                component: index
            },
            {
                path: '/userCenter',
                name: 'userCenter',
                meta: {
                    title: "个人中心"
                },
                component: () => import('@/views/userCenter.vue')
            },
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: login
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

//动态路由：从后端接口获取permission及与之对应的menu
//之后根据menu，动态的绑定路由
router.beforeEach((to, from, next) => {
    let hasRoute = store.state.menus.hasRoutes

    let token = localStorage.getItem("token")
    console.log(token)
    if (to.path == '/login') {
        console.log("to.path")
        next()
    } else if (!token) {
        console.log("!token")
        next({ path: '/login' })
    } else if (token && !hasRoute) {
        axios.get("/sys/menu/nav", {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(res => {
            console.log("ssssssssssssssss")
            console.log(res.data.data)
            //拿到menuList
            store.commit("setMenuList", res.data.data.nav)
            //拿到用户权限
            store.commit("setPermList", res.data.data.authorities)
            //动态绑定路由
            let newRoutes = router.options.routes
            res.data.data.nav.forEach(menu => {
                if (menu.children) {
                    menu.children.forEach(e => {
                        //转换路由
                        let route = menuToRoute(e)
                        //把路由添加到路由管理中
                        if (route) {
                            newRoutes[0].children.push(route)
                        }
                    })
                }
            })
            console.log("newRoutes")
            console.log(newRoutes)
            router.addRoutes(newRoutes)
            hasRoute = true
            store.commit("changeRouteStatus", hasRoute)
        })
    }
    next()
})

//导航菜单转为路由信息
const menuToRoute = (menu) => {
    if (!menu.component) {
        return null
    }
    let route = {
        name: menu.name,
        path: menu.path,
        meta: {
            icon: menu.icon,
            title: menu.title
        }
    }
    route.component = () => import('@/views/' + menu.component + '.vue')
    return route
}

export default router
