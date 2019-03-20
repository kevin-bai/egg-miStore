const url = require('url')
module.exports = options => {
    return async function adminAuth(ctx, next) {
        //全局变量
        ctx.locals.csrf = ctx.csrf // csrf token
        ctx.locals.prevPage = ctx.request.headers['referer'] // 上一页地址

        const urlWhiteList = options.adminAuthWhiteList;
        
        if (ctx.session.userinfo) {
            ctx.locals.userinfo = ctx.session.userinfo
            await next();
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