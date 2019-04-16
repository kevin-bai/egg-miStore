'use strict';

const Controller = require('egg').Controller;

class BaseController extends Controller {
    /**
     * 跳转成功页面，3秒后重定向
     * @param {string} redirectUrl 成功之后重定向url
     * @param {string} msg 成功页面提示信息
     */
    async success(redirectUrl, msg) {
        await this.ctx.render('/admin/public/success', {
            redirectUrl: redirectUrl,
            message: msg || 'operation success'
        });
    }

    /**
     * 跳转失败页面，3秒后重定向
     * @param {string} redirectUrl 失败之后重定向url
     * @param {string} msg 失败页面提示信息
     */
    async error(redirectUrl, msg) {
        await this.ctx.render('/admin/public/error', {
            redirectUrl: redirectUrl,
            message: msg || 'operation failed'
        });
    }

    async captcha() {
        let captcha = await this.ctx.service.tool.captcha();
        this.ctx.session.code = captcha.text;
        this.ctx.response.type = 'image/svg+xml';
        this.ctx.body = captcha.data
    }

    async delete() {
        let model = this.ctx.request.query.model // role
        let _id = this.ctx.request.query.id

        // this.ctx.model.model   ×
        await this.ctx.model[model].deleteOne({ // 注意写法
            _id
        })

        // 返回上一页面
        this.ctx.redirect(this.ctx.locals.prevPage)
    }

    /**
     * 判断mongo操作是否成功,然后跳转
     * @param {*} result MongoDB update result
     * @param {*} url 成功跳转 url
     * @param {*} msg 成功跳转提示信息
     */
    async mongoUpdateResultAndRedirect(result,url,msg) {
        if (result.ok === 1 && result.nModified === 1) {
            await this.success(url, msg)
        } else {
            await this.errorReturnPrevPage()
        }
    }


    /**
     * 判断mongo操作是否成功
     * @param {*} result MongoDB update result
     */
    async mongoUpdateResult(result){
        if (result.ok === 1 && result.nModified === 1) {
            // go to next
            return true
        } else {
            return false
        }
    }

    async mongoUpdateResult4Ajax(result){
        if (result.ok === 1 && result.nModified === 1) {
            // go to next
            this.ctx.response.body = {
                "success":true,
                "message":"数据更新成功！"
              }
            
        } else {
            this.ctx.response.body = {
                "success":false,
                "message":"数据更新失败！"
              }
        }
    }

    async mongoDeleteResult4Ajax(result){
        if (result.ok === 1 && result.deletedCount >0 ) {
            // go to next
            this.ctx.response.body = {
                "success":true,
                "message":"数据删除成功！"
              }
            
        } else {
            this.ctx.response.body = {
                "success":false,
                "message":"数据删除失败！"
              }
        }
    }


    /**
     * 操作失败，返回上一页面
     */
    async errorReturnPrevPage() {
        await this.error(this.ctx.locals.prevPage, '操作失败')
    }


    //改变状态的方法  Api接口
    async changeStatus() {
        var model = this.ctx.request.query.model; /*数据库表 Model*/
        var attr = this.ctx.request.query.attr; /*更新的属性 如:status is_best */
        var id = this.ctx.request.query.id; /*更新的 id*/

        var result = await this.ctx.model[model].find({
            "_id": id
        });

        if (result.length > 0) {
            if (result[0][attr] == 1) {
                var json = {
                    /*es6 属性名表达式*/
                    [attr]: 0
                }
            } else {
                var json = {
                    [attr]: 1
                }
            }

            //执行更新操作
            var updateResult = await this.ctx.model[model].updateOne({
                "_id": id
            }, json);

            if (updateResult) {
                this.ctx.body = {
                    "message": '更新成功',
                    "success": true
                };
            } else {
                this.ctx.body = {
                    "message": '更新失败',
                    "success": false
                };
            }
        } else {
            //接口
            this.ctx.body = {
                "message": '更新失败,参数错误',
                "success": false
            };
        }
    }


    //改变数量的方法
    async editNum() {
        var model = this.ctx.request.query.model; /*数据库表 Model*/
        var attr = this.ctx.request.query.attr; /*更新的属性 如:sort */
        var id = this.ctx.request.query.id; /*更新的 id*/
        var num = this.ctx.request.query.num; /*数量*/

        var result = await this.ctx.model[model].find({
            "_id": id
        });

        if (result.length > 0) {

            var json = {
                /*es6 属性名表达式*/

                [attr]: num
            }

            //执行更新操作
            var updateResult = await this.ctx.model[model].updateOne({
                "_id": id
            }, json);

            if (updateResult) {
                this.ctx.body = {
                    "message": '更新成功',
                    "success": true
                };
            } else {

                this.ctx.body = {
                    "message": '更新失败',
                    "success": false
                };
            }

        } else {

            //接口
            this.ctx.body = {
                "message": '更新失败,参数错误',
                "success": false
            };


        }


    }

}

module.exports = BaseController;
