module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    let date = new Date()

    const RoleSchema = new Schema({
      title: { type: String  },
      description: { type: String  },
      status: { type: Number,defaulr:1  },
      add_time: { type: Number, default: date.getTime()  },
    });
  
    return mongoose.model('role', RoleSchema, 'role');
  }