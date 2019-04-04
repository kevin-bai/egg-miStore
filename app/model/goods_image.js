module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    let d = new Date();
    const GoodsImageSchema = new Schema({
        goods_id: {
            type: Schema.Types.ObjectId
        },
        img_url: {
            type: String,
            default: ''
        },
        sort: {
            type: Number,
            default: 0
        },
        status: {
            type: Number,
            default: 1
        },
        color_id: {
            type: Schema.Types.Mixed,
            default: ''
        },
        add_time: {
            type: Number,
            default: d.getTime()
        }
    });

    return mongoose.model('GoodsImage', GoodsImageSchema, 'goods_image');
}