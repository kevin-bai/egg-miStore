const url = require('url')
module.exports = (options, app) =>{
    return async function userAuth(ctx, next){

        // 判断用户登录有没有过期
        let userInfo = await ctx.service.cookies.get('userinfo')
        //console.log('request', ctx.request.url)
        //console.log('url',url.parse(ctx.request.url))
        ctx.locals.url = url.parse(ctx.request.url).pathname;

        //console.log(userInfo)
        if (userInfo && userInfo._id && userInfo.phone) {
            // 判断数据库有没有用户
            let user = await ctx.model.User.findOne({
                '_id':userInfo._id
            })
            if (user) {
                await next()
            } else {
                await ctx.redirect('/login')
            }
        } else {
            await ctx.redirect('/login')
        }


    }
}