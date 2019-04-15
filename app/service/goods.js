'use strict';

const Service = require('egg').Service;

class GoodsService extends Service {

    /**
     * 
     * @param {*} cate_id - 分类id
     * @param {*} type  -  hot  best  new
     * @param {*} limit -  数量
     */
    async get_category_recommend_goods(cate_id, type, limit) {

        try {
            let cateIdsResult = await this.ctx.model.GoodsCate.find({
                "pid": this.app.mongoose.Types.ObjectId(cate_id)
            }, '_id');
            if (cateIdsResult.length == 0) {
                cateIdsResult = [{
                    _id: cate_id
                }]
            }
            //组装查找数据的条件
            let cateIdsArr = [];
            cateIdsResult.forEach((value) => {
                cateIdsArr.push({
                    "cate_id": value._id
                })
            })
            //查找条件    
            let findJson = {
                $or: cateIdsArr
            };

            //判断类型 合并对象    
            switch (type) {
                case 'hot':
                    findJson = Object.assign(findJson, {
                        "is_hot": 1
                    });
                    break;
                case 'best':
                    findJson = Object.assign(findJson, {
                        "is_best": 1
                    });
                    break;
                case 'new':
                    findJson = Object.assign(findJson, {
                        "is_new": 1
                    });
                    break;
                default:
                    findJson = Object.assign(findJson, {
                        "is_hot": 1
                    });
                    break;
            }

            let limitSize = limit || 10;
            return await this.ctx.model.Goods.find(findJson, 'title shop_price goods_img sub_title').limit(limitSize);


        } catch (e) {
            console.log(e);
            return [];
        }

    }


    /**
     * str convert to id array
     * @param {*} str eg:   '5ca5cb53fcde8f8386f2e73a,5ca5cb53fcde8f8386f2e73a,5ca5cb53fcde8f8386f2e73a'
     */
    async strToIds(str){
        let arr = str.replace(/'，'/g,',').split(',')
        let ids = [];

        try {
            if (arr) {
                arr.forEach(item =>{
                    ids.push({
                        '_id': this.app.mongoose.Types.ObjectId(item)
                    })
                })
                return ids
            } else {
                return [{"1":-1}]
            }
        } catch (error) {
            return [{"1":-1}] // 返回一个不成立的条件
        }
    }
}

module.exports = GoodsService;