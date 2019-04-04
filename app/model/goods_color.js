module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    let d=new Date();   
    const GoodsColorSchema = new Schema({
      color_name: { type: String  },
      color_value: { type: String  },   
      status: { type: Number,default:1  },
      add_time: {           
        type:Number,        
        default: d.getTime()    
      }
    });
   
    return mongoose.model('GoodsColor', GoodsColorSchema,'goods_color');
}