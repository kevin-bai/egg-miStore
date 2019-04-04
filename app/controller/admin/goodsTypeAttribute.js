let BaseController = require('./base.js');
class GoodsTypeAttributeController extends BaseController {
    async index() {

        //显示对应类型的属性

        //获取当前属性的类型id   分类id


        let cate_id = this.ctx.request.query.id;

        // console.log(cate_id);

        //获取当前的类型

        let goodsType = await this.ctx.model.GoodsType.find({
            "_id": cate_id
        })

        //  let result=await this.ctx.model.GoodsTypeAttribute.find({"cate_id":cate_id});

        let result = await this.ctx.model.GoodsTypeAttribute.aggregate([

            {
                $lookup: {
                    from: 'goods_type',
                    localField: 'cate_id',
                    foreignField: '_id',
                    as: 'goods_type'
                }
            },
            {
                $match: { //cate_id字符串
                    "cate_id": this.app.mongoose.Types.ObjectId(cate_id) //注意
                }
            }
        ])

        // console.log(result)
        await this.ctx.render('admin/goodsTypeAttribute/index', {

            list: result,
            cate_id: cate_id,
            goodsType: goodsType[0]
        });
    }


    async add() {
        //获取类型数据

        let cate_id = this.ctx.request.query.id;
        let goodsTypes = await this.ctx.model.GoodsType.find({});

        await this.ctx.render('admin/goodsTypeAttribute/add', {

            cate_id: cate_id,
            goodsTypes: goodsTypes

        });

    }

    async doAdd() {
        let res = new this.ctx.model.GoodsTypeAttribute(this.ctx.request.body);

        await res.save(); //注意

        await this.success('/admin/goodsTypeAttribute?id=' + this.ctx.request.body.cate_id, '增加商品类型属性成功');


    }



    //功能还没有实现
    async edit() {
        let id = this.ctx.query.id;

        let list = await this.ctx.model.GoodsTypeAttribute.findOne({
            "_id": id
        });

        let goodsTypes = await this.ctx.model.GoodsType.find({});

        await this.ctx.render('admin/goodsTypeAttribute/edit', {

            list,
            goodsTypes: goodsTypes
        });

    }

    async doEdit() {


        let _id = this.ctx.request.body._id;

        // let title=this.ctx.request.body.title;

        // let cate_id=this.ctx.request.body.cate_id;

        // let attr_type=this.ctx.request.body.attr_type;

        // let attr_value=this.ctx.request.body.attr_value;

        // console.log(this.ctx.request.body);


        let result = await this.ctx.model.GoodsTypeAttribute.updateOne({
            "_id": _id
        }, this.ctx.request.body);

        await this.mongoUpdateResultAndRedirect(result, '/admin/goodsTypeAttribute?id=' + this.ctx.request.body.cate_id, '修改商品类型属性成功')

        // await this.success('/admin/goodsTypeAttribute?id='+this.ctx.request.body.cate_id,'修改商品类型属性成功');

    }

}
module.exports = GoodsTypeAttributeController;