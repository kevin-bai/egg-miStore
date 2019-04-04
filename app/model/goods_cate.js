module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  let d = new Date();
  const GoodsCateSchema = new Schema({
    title: {
      type: String
    },
    cate_img: {
      type: String
    },
    filter_attr: { //筛选id
      type: String,
      default: ''
    },
    link: {
      type: String,
      default: ''
    },
    template: {
      /*指定当前分类的模板*/
      type: String,
      default: ''
    },
    pid: {
      type: Schema.Types.Mixed //混合类型 
    },
    sub_title: {
      type: String,
      default: ''
    },
    /*seo相关的标题  关键词  描述*/
    keywords: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    status: {
      type: Number,
      default: 1
    },

    sort: {
      type: Number,
      default: 100
    },
    add_time: {
      type: Number,
      default: d.getTime()
    }

  });

  return mongoose.model('GoodsCate', GoodsCateSchema, 'goods_cate');
}