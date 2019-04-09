'use strict';
const BaseController = require('./base.js');

class GoodsController extends BaseController {
  async index() {
    let page = this.ctx.request.query.page || 1;
    let pageSize = 2;
    let totalCount = await this.ctx.model.Goods.find({}).count();
    let totalPages = Math.ceil(totalCount/pageSize)
    let goods = await this.ctx.model.Goods.find({}).skip((page - 1)*pageSize).limit(pageSize)
    console.log('goods', goods)
  

    await this.ctx.render('admin/goods/index', {
      list: goods,
      page,
      totalPages
    });
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
      if (typeof (goods_image_list) === 'string') {
        goods_image_list = new Array(goods_image_list)
      }
      console.log('goods_img', goods_image_list)

      goods_image_list.forEach(async item => {
        let newGoodsImage = new this.ctx.model.GoodsImage({
          goods_id: result._id,
          img_url: item
        })
        await newGoodsImage.save()
      })


    }


    // 添加商品类型数据
    if (result._id && formFields.attr_id_list && formFields.attr_value_list) {
      let attr_id_list = formFields.attr_id_list;
      let attr_value_list = formFields.attr_value_list;

      if (typeof (attr_id_list) === 'string') {
        attr_id_list = new Array(attr_id_list)
        attr_value_list = new Array(attr_value_list)
      }

      for (let i = 0; i < attr_id_list.length; i++) {
        let goodsTypeAttributeResult = await this.ctx.model.GoodsTypeAttribute.findOne({
          '_id': attr_id_list[i]
        })

        let newGoodsAttr = new this.ctx.model.GoodsAttr({
          goods_id: result._id,
          cate_id: formFields.cate_id,
          attribute_id: attr_id_list[i],
          attribute_type: goodsTypeAttributeResult.attr_type,
          attribute_title: goodsTypeAttributeResult.title,
          attribute_value: attr_value_list[i],
        })

        await newGoodsAttr.save()
      }

    }

    await this.success('/admin/goods', '添加商品成功');

  }

  async edit() {
    //获取修改数据的id
    let id = this.ctx.request.query.id;

    //获取所有的颜色值
    let colorResult = await this.ctx.model.GoodsColor.find({});

    //获取所有的商品类型
    let goodsType = await this.ctx.model.GoodsType.find({});

    //获取商品分类

    let goodsCate = await this.ctx.model.GoodsCate.aggregate([

      {
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


    //获取修改的商品

    let goodsResult = await this.ctx.model.Goods.find({
      '_id': id
    });
    //获取当前商品的颜色
    // 5bbb68dcfe498e2346af9e4a,5bbb68effe498e2346af9e4b,5bc067d92e5f889dc864aa96
    let colorArrTemp = goodsResult[0].goods_color.split(',');

    //console.log(colorArrTemp);

    let goodsColorArr = [];
    let goodsColorReulst = [];
    try {
      colorArrTemp.forEach((value) => {
        goodsColorArr.push({
          "_id": value
        })
      })
      goodsColorReulst = await this.ctx.model.GoodsColor.find({
        $or: goodsColorArr
      })
    } catch (error) {

    }
    // console.log(colorReulst);

    //获取规格信息 

    let goodsAttsResult = await this.ctx.model.GoodsAttr.find({
      "goods_id": goodsResult[0]._id
    });
    console.log('goodsAttsResult',goodsAttsResult)

    let goodsAttsStr = '';

    goodsAttsResult.forEach(async (val) => {

      if (val.attribute_type == 1) {

        goodsAttsStr += `<li><span>${val.attribute_title}: 　</span><input type="hidden" name="attr_id_list" value="${val.attribute_id}" />  <input type="text" name="attr_value_list"  value="${val.attribute_value}" /></li>`;
      } else if (val.attribute_type == 2) {
        goodsAttsStr += `<li><span>${val.attribute_title}: 　</span><input type="hidden" name="attr_id_list" value="${val.attribute_id}" />  <textarea cols="50" rows="3" name="attr_value_list">${val.attribute_value}</textarea></li>`;
      } else {
        //获取 attr_value  获取可选值列表
        let oneGoodsTypeAttributeResult = await this.ctx.model.GoodsTypeAttribute.find({
          _id: val.attribute_id
        })

        let arr = oneGoodsTypeAttributeResult[0].attr_value.split('\n');

        goodsAttsStr += `<li><span>${val.attribute_title}: 　</span><input type="hidden" name="attr_id_list" value="${val.attribute_id}" />`;

        goodsAttsStr += `<select name="attr_value_list">`;

        for (let j = 0; j < arr.length; j++) {

          if (arr[j] == val.attribute_value) {
            goodsAttsStr += `<option value="${arr[j]}" selected >${arr[j]}</option>`;
          } else {
            goodsAttsStr += `<option value="${arr[j]}" >${arr[j]}</option>`;
          }
        }
        goodsAttsStr += `</select>`;
        goodsAttsStr += `</li>`;
      }

    })

    //商品的图库信息
    let goodsImageResult = await this.ctx.model.GoodsImage.find({
      "goods_id": goodsResult[0]._id
    });

    console.log('goodsImageResult',goodsImageResult);

    await this.ctx.render('admin/goods/edit', {
      colorResult: colorResult,
      goodsType: goodsType,
      goodsCate: goodsCate,
      goods: goodsResult[0],
      goodsAtts: goodsAttsStr,
      goodsImage: goodsImageResult,
      goodsColor: goodsColorReulst

    });
  }

  async doEdit() {
    let uploadResult = await this.service.tool.getUploadFile(this.ctx)
    let formFields = Object.assign(uploadResult.files, uploadResult.field)
    let goods_id = formFields.id
    console.log('form fileds', formFields)

    // 修改商品信息
    let goodsResult = await this.ctx.model.Goods.updateOne({
      '_id': goods_id
    }, formFields)
    await this.mongoUpdateResult(goodsResult)

    //修改图库信息  （增加）
    let goods_image_list = formFields.goods_image_list;
    if (goods_id && goods_image_list) {
      if (typeof (goods_image_list) == 'string') {
        goods_image_list = new Array(goods_image_list);
      }

      goods_image_list.forEach(async item => {
        let goodsImageRes = new this.ctx.model.GoodsImage({
          goods_id: goods_id,
          img_url: item
        });

        await goodsImageRes.save();
      })
    }

    //修改商品类型数据    1、删除以前的类型数据     2、重新增加新的商品类型数据

    let result = await this.ctx.model.GoodsAttr.deleteMany({"goods_id":goods_id})
    console.log('result',result)

    // 添加商品类型数据
    if (goods_id && formFields.attr_id_list && formFields.attr_value_list) {
      let attr_id_list = formFields.attr_id_list;
      let attr_value_list = formFields.attr_value_list;

      if (typeof (attr_id_list) === 'string') {
        attr_id_list = new Array(attr_id_list)
        attr_value_list = new Array(attr_value_list)
      }

      for (let i = 0; i < attr_id_list.length; i++) {
        let goodsTypeAttributeResult = await this.ctx.model.GoodsTypeAttribute.findOne({
          '_id': attr_id_list[i]
        })

        let newGoodsAttr = new this.ctx.model.GoodsAttr({
          goods_id: goods_id,
          cate_id: formFields.cate_id,
          attribute_id: attr_id_list[i],
          attribute_type: goodsTypeAttributeResult.attr_type,
          attribute_title: goodsTypeAttributeResult.title,
          attribute_value: attr_value_list[i],
        })

        await newGoodsAttr.save()
      }

    }

    await this.success('/admin/goods', '修改商品成功');

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


  // 修改图片对应颜色
  async changeGoodsImageColor(){
    let color_id = this.ctx.request.body.color_id;
    let goods_image_id = this.ctx.request.body.goods_image_id;

    
    // if(color_id){
    //   color_id = this.app.mongoose.Types.ObjectId(color_id)
    // }

    let result = await this.ctx.model.GoodsImage.updateOne({"_id":goods_image_id},{
      color_id: color_id
    })

    await this.mongoUpdateResult4Ajax(result);

    // if(await this.mongoUpdateResult(result)){
    //   this.ctx.response.body = {
    //     "success":true,
    //     "message":"数据更新成功！"
    //   }
    // }else{
    //   this.ctx.response.body = {
    //     "success":false,
    //     "message":"数据更新失败！"
    //   }
    // }
    
  }


  async goodsImageRemove(){
    let goods_image_id = this.ctx.request.body.goods_image_id;
    console.log('goods_id',goods_image_id)

    let result = await this.ctx.model.GoodsImage.deleteOne({"_id": this.app.mongoose.Types.ObjectId(goods_image_id)})

    console.log('result',result)
    await this.mongoDeleteResult4Ajax(result);
    
  }




}

module.exports = GoodsController;