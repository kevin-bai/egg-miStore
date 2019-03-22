module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    let date = new Date()
  
    const FileSchema = new Schema({
      title: {
        type: String
      },
      focus_img: {
        type: String
      },
      type: {
        type: Number,
        default: 1
      },
      link: {
        type: String
      },
      sort: {
        type: Number
      },
      add_time: {
        type: Number,
        default: date.getTime()
      },
    });
  
    return mongoose.model('File', FileSchema, 'file');
  }