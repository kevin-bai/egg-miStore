'use strict';

const Service = require('egg').Service;
const {
  parse
} = require('url')

class AdminService extends Service {
  /**
   * 根据角色id，判断是否有当前页面权限
   */
  async checkAuth() {
    let userRoleId = this.ctx.locals.userinfo.role_id
    let accessList = await this.ctx.model.RoleAccess.find({
      "role_id": userRoleId
    })
    let accessListArr = [];
    accessList.forEach(item => {
      accessListArr.push(item.access_id.toString())
    })
    // console.log('access list', accessListArr)

    let url = parse(this.ctx.request.url).pathname
    let accessResult = await this.ctx.model.Access.findOne({
      url
    })
    // console.log('accessResult',accessResult)

    if (accessResult) {
      if (accessListArr.indexOf(accessResult._id.toString()) != -1) {
        return true
      } else {
        return false
      }
    } else {
      return true
    }
  }

  /**
   * 根据角色id，获取所有权限列表，checked = 1 表示有权限， checked = 0 表示没有权限
   * @param {*} role_id 角色id
   */
  async getAuthList(role_id) {
    let list = await this.ctx.model.Access.aggregate([{
        $match: {
          module_id: '0'
        }
      },
      {
        $lookup: {
          from: "access",
          localField: '_id',
          foreignField: 'module_id',
          as: 'items'
        }
      }
    ])
    let roleAccess = await this.ctx.model.RoleAccess.find({
      "role_id": role_id
    })
    let roleAccessArr = []
    roleAccess.forEach(item => {
      roleAccessArr.push(item.access_id.toString())
    })
    // console.log(roleAccessArr)

    // 全部表匹配role_access表，id匹配表示 角色有此权限
    for (let i = 0; i < list.length; i++) {
      if (roleAccessArr.indexOf(list[i]._id.toString()) != -1) {
        list[i].checked = 1
      }
      for (let j = 0; j < list[i].items.length; j++) {
        if (roleAccessArr.indexOf(list[i].items[j]._id.toString()) != -1) {
          list[i].items[j].checked = 1
        }
      }
    }

    return list
  }


}

module.exports = AdminService;