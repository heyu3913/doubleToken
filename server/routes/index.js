const router = require('koa-router')()
const jwt = require('jsonwebtoken')
const { accessToken, refreshToken, secret }=require('../utils/token')
router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})
/*登录接口*/
router.get('/login',(ctx)=>{
  let code,msg,data=null
  code=2000
  msg='登录成功，获取到token'
  data={
    accessToken:accessToken(),
    refreshToken:refreshToken()
  }
  ctx.body={
    code,
    msg,
    data
  }
})

/*用于测试的获取数据接口*/
router.get('/getTestData',(ctx)=>{
  let code,msg,data=null
  code=2000
  msg='获取数据成功'
  ctx.body={
    code,
    msg,
    data
  }
})

/*验证长token是否有效，刷新短token
  这里要注意，在刷新短token的时候回也返回新的长token，延续长token，
  这样活跃用户在持续操作过程中不会被迫退出登录。长时间无操作的非活
  跃用户长token过期重新登录
*/
router.get('/refresh',(ctx)=>{

  let code,msg,data=null
  //获取请求头中携带的长token
  let r_tk=ctx.request.headers['pass']
  //解析token 参数 token 密钥 回调函数返回信息
  jwt.verify(r_tk,secret,(error)=>{
    if(error){
      code=4006,
      msg='长token无效，请重新登录'
    }
    else{
      code = 2000,
      msg = '长token有效，返回新的token'
      data = {
        accessToken: accessToken(),
        refreshToken: refreshToken()
      }
    }
    ctx.body={
      code,
      msg:msg?msg:null,
      data
    }
  })
})



module.exports = router
