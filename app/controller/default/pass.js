'use strict';

const Controller = require('egg').Controller;

class PassController extends Controller {

  //登录
  async login() {
    await this.ctx.render('default/pass/login.html');
  }
  //注册第一步 输入手机号
  async registerStep1() {
    await this.ctx.render('default/pass/register_step1.html');
  }
  //注册第二步  验证码验证码是否正确
  async registerStep2() {
    let sign = this.ctx.request.query.sign;
    let identify_code = this.ctx.request.query.identify_code;
    let add_day = await this.service.tool.getDay(); //年月日   
    let userTempResult = await this.ctx.model.UserTemp.find({
      "sign": sign,
      add_day: add_day
    });

    if (userTempResult.length == 0) {

      this.ctx.redirect('/register/registerStep1');
    } else {
      await this.ctx.render('default/pass/register_step2.html', {
        sign: sign,
        phone: userTempResult[0].phone,
        identify_code: identify_code
      });
    }

  }
  //注册第三步  输入密码
  async registerStep3() {
    let sign = this.ctx.request.query.sign;
    let phone_code = this.ctx.request.query.phone_code
    let add_day = await this.service.tool.getDay(); //年月日   
    let userTempResult = await this.ctx.model.UserTemp.findOne({
      "sign":sign,
      add_day:add_day
    })
    let msg = '';
    //console.log(sign)

    //console.log('userTempResult',userTempResult)
    if (!userTempResult) {
      await this.ctx.redirect('/register/registerStep1');
    } else {
      await this.ctx.render('default/pass/register_step3.html',{
        sign,
        phone_code,
        msg
      });

    }



  }
  //完成注册  post
  async doRegister() {
    console.log('body',this.ctx.request.body)
    let sign = this.ctx.request.body.sign;
    let phone_code = this.ctx.request.body.phone_code;
    let password = this.ctx.request.body.password;
    let rpassword = this.ctx.request.body.rpassword;
    
    let add_day =await this.service.tool.getDay()
    let ip = this.ctx.request.ip.replace(/::ffff:/,'')

    // 返回页面错误信息
    if(this.ctx.session.phone_code != phone_code){
      await this.ctx.redirect('/register/registerStep1')
    }
    let msg = ''
    if(password.length < 6 || password != rpassword){
      msg = '密码必须大于6位并且一致'
      await this.ctx.redirect(`/register/registerStep3?sign=${sign}&phone_code=${phone_code}&msg=${msg}`)
    }

    let userTemp = await this.ctx.model.UserTemp.findOne({
      'sign':sign,
      add_day
    })
    if (!userTemp) {
      await this.ctx.redirect('/register/registerStep1')
    }

    let userResult = await this.ctx.model.User({
      phone: userTemp.phone,
      password: await this.service.tool.md5(password),
      last_ip: ip
    })
    userResult.save();
    if (userResult) {
      let userInfo = await this.ctx.model.User.findOne({
        phone: userTemp.phone
      },'_id phone last_ip add_time')
      this.service.cookies.set('userinfo', userInfo);
    }


    this.ctx.redirect('/')
    //this.ctx.session.userInfo = userInfo;
  }
  //验证验证码

  async validatePhoneCode() {

    let sign = this.ctx.request.query.sign;
    let phone_code = this.ctx.request.query.phone_code;
    let add_day = await this.service.tool.getDay(); //年月日   


    if (this.ctx.session.phone_code != phone_code) {
      this.ctx.body = {
        success: false,
        msg: '您输入的手机验证码错误'
      }
    } else {

      let userTempResult = await this.ctx.model.UserTemp.find({
        "sign": sign,
        add_day: add_day
      });
      if (userTempResult.length <= 0) {
        this.ctx.body = {
          success: false,
          msg: '参数错误'
        }

      } else {

        //判断验证码是否超时
        let nowTime = await this.service.tool.getTime();
        if ((userTempResult[0].add_time - nowTime) / 1000 / 60 > 30) {
          this.ctx.body = {
            success: false,
            msg: '验证码已经过期'
          }
        } else {
          //用户表有没有当前这个手机号        手机号有没有注册
          let userResult = await this.ctx.model.User.find({
            "phone": userTempResult[0].phone
          });
          if (userResult.length > 0) {
            this.ctx.body = {
              success: false,
              msg: '此用户已经存在'
            }
          } else {
            this.ctx.body = {
              success: true,
              msg: '验证码输入正确',
              sign: sign
            }
          }

        }

      }


    }



  }


  //发送短信验证码
  async sendCode() {

    let phone = this.ctx.request.query.phone;
    let identify_code = this.ctx.request.query.identify_code; //用户输入的验证码

    if (identify_code.toUpperCase() != this.ctx.session.identify_code.toUpperCase()) {

      this.ctx.body = {
        success: false,
        msg: '输入的图形验证码不正确'
      }
    } else {

      //判断手机格式是否合法
      let reg = /^[\d]{11}$/;
      if (!reg.test(phone)) {
        this.ctx.body = {
          success: false,
          msg: '手机号不合法'
        }
      } else {

        let add_day = await this.service.tool.getDay(); //年月日    
        let add_time = await this.service.tool.getTime(); //增加时间
        let sign = await this.service.tool.md5(phone + add_day); //签名
        let ip = this.ctx.request.ip.replace(/::ffff:/, ''); //获取客户端ip         
        let phone_code = await this.service.tool.getRandomNum(); //发送短信的随机码    

        let userTempResult = await this.ctx.model.UserTemp.find({
          "sign": sign,
          add_day: add_day
        });

        //1个ip 一天只能发20个手机号
        let ipCount = await this.ctx.model.UserTemp.find({
          "ip": ip,
          add_day: add_day
        }).count();


        if (userTempResult.length > 0) {
          if (userTempResult[0].send_count < 6 && ipCount < 10) { //执行发送
            let send_count = userTempResult[0].send_count + 1;
            await this.ctx.model.UserTemp.updateOne({
              "_id": userTempResult[0]._id
            }, {
              "send_count": send_count,
              'add_time': add_time
            });


            this.ctx.session.phone_code = phone_code;
            console.log('---------------------------------')
            console.log(phone_code, ipCount);
            //发送短信
            await this.service.sendmsg.send(phone, phone_code)

            this.ctx.body = {
              success: true,
              msg: '短信发送成功',
              sign: sign
            }



          } else {
            this.ctx.body = {
              "success": false,
              msg: '当前手机号码发送次数达到上限，明天重试'
            };

          }

        } else {
          let userTmep = new this.ctx.model.UserTemp({
            phone,
            add_day,
            sign,
            ip,
            send_count: 1
          });
          userTmep.save();
          //发送短信
          await  this.service.sendmsg.send(phone, phone_code)
          this.ctx.session.phone_code = phone_code;
          this.ctx.body = {
            success: true,
            msg: '短信发送成功',
            sign: sign
          }

        }

      }

    }

  }

}

module.exports = PassController;
