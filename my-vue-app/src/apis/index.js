import server from "../utils/server.js";
/*登录*/
export const login = () => {
    return server({
        url: '/login',
        method: 'get'
    })
}
/*请求数据*/
export const getList = () => {
    return server({
        url: '/getTestData',
        method: 'get'
    })
}
