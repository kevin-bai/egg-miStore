const url = require('url')
module.exports = options => {
    return async function adminAuth(ctx, next) {
        //全局变量
        ctx.locals.csrf = ctx.csrf

        if (ctx.session.userinfo) {
            await next()
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