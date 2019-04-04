module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  var d = new Date();

  const GoodsTypeAttributeSchema = new Schema({
    cate_id: {
      type: Schema.Types.ObjectId
    },
    title: {
      type: String,
      default: ''
    },
    attr_type: { //类型  1 input    2  textarea    3、select
      type: String,
      default: '1'
    },
    attr_value: { //默认值： input  textarea默认值是空     select框有默认值  多个默认值以回车隔开
      type: String,
      default: ''
    },
    status: {
      type: Number,
      default: 1
    },
    add_time: {
      type: Number,
      default: d.getTime()
    }
  });
  return mongoose.model('GoodsTypeAttribute', GoodsTypeAttributeSchema, 'goods_type_attribute');
}