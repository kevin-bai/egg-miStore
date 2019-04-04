module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  var d = new Date();

  const GoodsTypeSchema = new Schema({
    title: {
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
    add_time: {
      type: Number,
      default: d.getTime()
    }

  });

  return mongoose.model('GoodsType', GoodsTypeSchema, 'goods_type');
}