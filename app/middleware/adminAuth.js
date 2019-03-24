const url = require('url')
module.exports = options => {
    return async function adminAuth(ctx, next) {
        //全局变量
        ctx.locals.csrf = ctx.csrf // csrf token
        ctx.locals.prevPage = ctx.request.headers['referer'] // 上一页地址

        const urlWhiteList = ctx.app.config.adminAuthWhiteList;// app挂在ctx上
    
        
        if (ctx.session.userinfo) {
            ctx.locals.userinfo = ctx.session.userinfo
            let hasAuth = await ctx.service.adminService.checkAuth();
            // console.log('hasAuth',hasAuth)
            if(!hasAuth){
                // ctx.redirect(ctx.locals.prevPage, '没有操作权限')
                await ctx.render('/admin/public/error', {
                    redirectUrl: ctx.locals.prevPage,
                    message: '没有操作权限'
                });
            }else{
                ctx.locals.asliderList = await ctx.service.adminService.getAuthList(ctx.locals.userinfo.role_id)

                // todo 根据权限显示隐藏侧边栏


                await next();
            }
            

        } else {
            let pathname = url.parse(ctx.request.url).pathname
            let inWhiteList = urlWhiteList.some(item =>{
                return item === pathname;
            })
            
            if (inWhiteList){
                await next()
            } else {
                ctx.redirect('/admin/login')
            }
        }
    };
};