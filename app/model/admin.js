module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    let date = new date()

    const AdminSchema = new Schema({
      username: { type: String  },
      password: { type: String  },
      mobile: { type: String  },
      email: { type: String  },
      status: { type: Number,defaulr:1  },
      role_id: { type: Schema.Types.ObjectId  },
      add_time: { type: Number, default: date.getTime()  },
      is_super: { type: Number  },
    });
  
    return mongoose.model('User', AdminSchema);
  }