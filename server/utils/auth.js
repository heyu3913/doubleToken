const { secret } = require('./token')
const jwt = require('jsonwebtoken')

/*白名单，登录、刷新短token不受限制，也就不用token验证*/
const whiteList=['/login','/refresh']
const isWhiteList=(url,whiteList)=>{
    return whiteList.find(item => item === url) ? true : false
}

/*中间件
 验证短token是否有效
*/
const auth = async (ctx,next)=>{
    let code, msg, data = null
    let url = ctx.path
    if(isWhiteList(url,whiteList)){
        // 执行下一步
        return await next()
    } else {
        // 获取请求头携带的短token
        const a_tk=ctx.request.headers['authorization']
        if(!a_tk){
            code=4003
            msg='accessToken无效，无权限'
            ctx.body={
                code,
                msg,
                data
            }
        } else{
            // 解析token
            await jwt.verify(a_tk,secret,async (error)=>{
                if(error){
                    code=4003
                    msg='accessToken无效，无权限'
                    ctx.body={
                        code,
                        msg,
                        data
                    }
                } else {
                    // token有效
                    return await next()
                }
            })
        }
    }
}
module.exports=auth
