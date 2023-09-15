import axios from "axios";
import * as storage from "../config/storage"
import * as constants from '../config/constants'
import { addRequest, refreshToken } from "./refresh";

const server = axios.create({
    baseURL: 'http://localhost:3000', // 你的服务器
    timeout: 1000 * 10,
    headers: {
        "Content-type": "application/json"
    }
})

/*请求拦截器*/
server.interceptors.request.use(config => {
    // 获取短token，携带到请求头，服务端校验
    let aToken = storage.getAccessToken(constants.ACCESS_TOKEN)
    config.headers[constants.AUTH] = aToken
    return config
})

/*响应拦截器*/
server.interceptors.response.use(
    async response => {
        // 获取到配置和后端响应的数据
        let { config, data } = response
        console.log('响应提示信息：', data.msg);
        return new Promise((resolve, reject) => {
            // 短token失效
            if (data.code === 4003) {
                // 移除失效的短token
                storage.removeAccessToken(constants.ACCESS_TOKEN)
                // 把过期请求存储起来，用于请求到新的短token，再次请求，达到无感刷新
                addRequest(() => resolve(server(config)))
                // 携带长token去请求新的token
                refreshToken()
            } else {
                // 有效返回相应的数据
                resolve(data)
            }

        })

    },
    error => {
        return Promise.reject(error)
    }
)
export default  server
