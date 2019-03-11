const url = require('url')
module.exports = options => {
    return async function adminAuth(ctx, next) {


        if (ctx.session.userinfo) {
            await next()
        } else {
            let pathname = url.parse(ctx.request.url).pathname

            if (pathname == '/admin/login' || pathname == "/admin/verify") {
                await next()
            }else{
                ctx.redirect('/admin/login')
            }
            
        }



    };
};