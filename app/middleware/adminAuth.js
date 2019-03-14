const url = require('url')
module.exports = options => {
    return async function adminAuth(ctx, next) {
        //全局变量
        ctx.locals.csrf = ctx.csrf // csrf token
        ctx.locals.prevPage = ctx.request.headers['referer'] // 上一页地址

        if (ctx.session.userinfo) {
            ctx.locals.userinfo = ctx.session.userinfo
            await next();
        } else {
            let pathname = url.parse(ctx.request.url).pathname

            if (pathname == '/admin/login' || pathname == '/admin/doLogin' || pathname == "/admin/verify") {
                await next()
            } else {
                ctx.redirect('/admin/login')
            }
        }
    };
};