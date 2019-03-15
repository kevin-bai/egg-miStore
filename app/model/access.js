module.exports = app => {
    const mongoose = app.mongoose
    const Schema = mongoose.Schema
    const d = new Date();

    const AccessSchema = new Schema({
        module_name: { // 模块名称
            type: String
        },
        action_name: { // 操作名称
            type: String
        },
        type: { // 节点类型 1.表示模块 2.表示菜单 3.表示操作
            type: Number,
            default: 0
        },
        module_id: { // ??  此module_id和当前模型的_id关联
            type: Schema.types.Mixed // 混合类型
        },
        url: {
            type: String
        },
        sort: {
            type: Number,
            default: 100
        },
        description: {
            type: String
        },
        status: {
            type: Number,
            default: 1
        },
        add_time: {
            type: Number,
            default: date.getTime()
        }
    })

    return mongoose.model('Access', AccessSchema, 'access')
}