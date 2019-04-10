module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const SettingSchema = new Schema({
    site_title: {
      type: String
    },
    site_logo: {
      type: String,
      defalut: ''
    },
    site_keywords: {
      type: String,
      defalut: ''
    },
    site_description: {
      type: String,
      defalut: ''
    },
    no_picture: {
      type: String,
      defalut: ''
    },
    site_icp: {
      type: String,
      defalut: ''
    },
    site_tel: {
      type: String,
      defalut: ''
    },
    search_keywords: {
      type: String,
      defalut: ''
    },
    tongji_code: {
      type: String,
      defalut: ''
    }

  });

  return mongoose.model('Setting', SettingSchema, 'setting');
}