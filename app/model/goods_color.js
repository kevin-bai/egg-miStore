module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  let d = new Date();
  const GoodsColorSchema = new Schema({
    color_name: {
      type: String,
      default: ''
    },
    color_value: {
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

  return mongoose.model('GoodsColor', GoodsColorSchema, 'goods_color');
}