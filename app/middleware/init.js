module.exports = (options, app) => {

    return async function init(ctx, next) {
        ctx.locals.csrf = ctx.csrf // csrf token
        // 顶部导航
        let topNav = await ctx.service.cache.get('index_topNav');
        if (!topNav) {
            topNav = await ctx.model.Nav.find({
                "position": 1
            })
            await ctx.service.cache.set('index_topNav', topNav, 60 * 10)
        }



        // 中部导航
        let middleNav = await ctx.service.cache.get('index_middleNav');
        if (!middleNav) {
            middleNav = await ctx.model.Nav.find({
                "position": 2
            })
            // 转化不可拓展对象  为 可拓展对象
            middleNav = JSON.parse(JSON.stringify(middleNav));



            //串行
            // for (const item of middleNav) {
            //   if (item.relation) {
            //     try {
            //       let temlStr = item.relation.replace(/，/g, ',').split(',')
            //       let temlArr = []
            //       temlStr.forEach(value => {
            //         temlArr.push({
            //           "_id": this.app.mongoose.Types.ObjectId(value)
            //         })
            //       })
            //       //console.log('temlArr', temlArr)
            //       let subGoods = await this.ctx.model.Goods.find({
            //         $or: temlArr
            //       },'title goods_img')
            //       item.subGoods = subGoods
            //       //console.log(item.subGoods)
            //     } catch (error) {
            //       //如果用户输入了错误的ObjectID（商品id）
            //       item.subGoods = []
            //     }
            //   } else {
            //     item.subGoods = []
            //   }
            // }

            //并行
            await Promise.all(middleNav.map(async item => {
                if (item.relation) {
                    try {
                        let temlStr = item.relation.replace(/，/g, ',').split(',')
                        let temlArr = []
                        temlStr.forEach(value => {
                            temlArr.push({
                                "_id": app.mongoose.Types.ObjectId(value)
                            })
                        })
                        //console.log('temlArr', temlArr)
                        let subGoods = await ctx.model.Goods.find({
                            $or: temlArr
                        }, 'title goods_img')
                        item.subGoods = subGoods
                        //console.log(item.subGoods)
                    } catch (error) {
                        //如果用户输入了错误的ObjectID（商品id）
                        item.subGoods = []
                    }
                } else {
                    item.subGoods = []
                }
            }))

            //console.log('middleNav', middleNav)
            await ctx.service.cache.set('index_middleNav', middleNav)
        }


        // 商品分类
        let goodsCate = await ctx.service.cache.get('index_goodsCate');
        if (!goodsCate) {
            goodsCate = await ctx.model.GoodsCate.aggregate([{
                    $lookup: {
                        from: 'goods_cate',
                        localField: '_id',
                        foreignField: 'pid',
                        as: 'items'
                    }
                },
                {
                    $match: {
                        "pid": '0'
                    }
                }, {
                    $limit: 10
                }
            ])

            await ctx.service.cache.set('index_goodsCate', goodsCate, 60 * 10)
        }

        ctx.locals.topNav = topNav
        ctx.locals.middleNav = middleNav
        ctx.locals.goodsCate = goodsCate


        await next();
    }
};