'use strict';
const BaseController = require('./base.js');

class GoodsController extends BaseController {
  async index() {
    let goods = await this.ctx.model.Goods.find({})
    console.log('goods',goods)

    await this.ctx.render('admin/goods/index');
  }

  async add() {

    //获取所有的颜色值
    let colorResult = await this.ctx.model.GoodsColor.find({});

    //获取所有的商品类型
    let goodsType = await this.ctx.model.GoodsType.find({});

    let goodsCate = await this.ctx.model.GoodsCate.aggregate([{
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
      }
    ])


    await this.ctx.render('admin/goods/add', {
      goodsCate,
      colorResult: colorResult,
      goodsType: goodsType
    });

  }

  async doAdd() {
    // console.log(this.ctx.request.body);
    let uploadResult = await this.service.tool.getUploadFile(this.ctx)
    let formFields = Object.assign(uploadResult.files, uploadResult.field)
    console.log('form fileds', formFields)
    let newGoods = new this.ctx.model.Goods(formFields)
    let result = await newGoods.save();

    // 添加商品相册
    if (result._id && formFields.goods_image_list) {
      let goods_image_list = formFields.goods_image_list;
      if (typeof (goods_image_list === 'strin')) {
        goods_image_list = new Array(goods_image_list)
      }

      for (let i = 0; i < goods_image_list.length; i++) {
        let newGoodsImage = new this.ctx.model.goodsImage({
          goods_id: result._id,
          img_url: goods_image_list[i]
        })
        await newGoodsImage.save()
      }
    }


    // 添加商品类型数据
    if (result._id && formFields.attr_id_list && formFields.attr_value_list) {
      let attr_id_list = formFields.attr_id_list;
      let attr_value_list = formFields.attr_value_list;

      if(typeof(attr_id_list) === 'string'){
        attr_id_list = new Array(attr_id_list)
        attr_value_list = new Array(attr_value_list)
      }

      for (let i = 0; i < attr_id_list.length; i++) {
        let goodsTypeAttributeResult = await this.ctx.model.GoodsTypeAttribute.findOne({'_id': attr_id_list[i]})
        
        let newGoodsAttr = new this.ctx.model.GoodsAttr({
          goods_id: result._id,
          cate_id:formFields.cate_id,
          attribute_id: attr_id_list[i],
          attribute_type: goodsTypeAttributeResult.attr_type,
          attribute_title: goodsTypeAttributeResult.title,
          attribute_value: attr_value_list[i],
        })

        await newGoodsAttr.save()

      }



    }



    await this.success('/admin/goods','添加商品成功');


  }


  //获取商品类型的属性 api接口
  async goodsTypeAttribute() {


    let cate_id = this.ctx.request.query.cate_id;

    //注意 await
    let goodsTypeAttribute = await this.ctx.model.GoodsTypeAttribute.find({
      "cate_id": cate_id
    })

    // console.log(goodsTypeAttribute);

    this.ctx.body = {
      result: goodsTypeAttribute
    }

  }

  //上传商品详情的图片
  async goodsUploadImage() {

    let result = await this.service.tool.getUploadFile(this.ctx)
    // console.log('files',result)

    //图片的地址转化成 {link: 'path/to/image.jpg'} 

    this.ctx.response.body = {
      link: result.files.file
    };
  }


  //上传相册的图片
  async goodsUploadPhoto() {
    let result = await this.service.tool.getUploadFile(this.ctx, true)

    this.ctx.body = {
      link: result.files.file
    };
  }




}

module.exports = GoodsController;