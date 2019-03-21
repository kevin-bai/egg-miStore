module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    let date = new Date()
  
    const RoleAccessSchema = new Schema({
      role_id: {
        type: Schema.Types.ObjectId
      },
      access_id: {
        type: Schema.Types.ObjectId
      },
      add_time: {
        type: Number,
        default: date.getTime()
      },
    });
  
    return mongoose.model('RoleAccess', RoleAccessSchema, 'role_access');
  }