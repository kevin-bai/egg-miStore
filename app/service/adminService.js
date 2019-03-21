'use strict';

const Service = require('egg').Service;
const {parse} = require('url')

class AdminService extends Service {
  async checkAuth() {
    let userRoleId = this.ctx.locals.userinfo.role_id
    let accessList = await this.ctx.model.RoleAccess.find({"role_id":userRoleId})
    let accessListArr = [];
    accessList.forEach(item =>{
        accessListArr.push(item.access_id.toString())
    })
    // console.log('access list', accessListArr)

    let url = parse(this.ctx.request.url).pathname
    let accessResult = await this.ctx.model.Access.findOne({url})
    // console.log('accessResult',accessResult)

    if(accessResult){
      if(accessListArr.indexOf(accessResult._id.toString())!= -1){
        return true
      }else{
        return false
      }
    }else{
      return true
    }
  }
}

module.exports = AdminService;
