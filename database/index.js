const mongoose = require("mongoose");

class Database{
  constructor(){
    if(!Database.instance){
      mongoose.connect(process.env.MONGO_URL)
        .then(() => console.log("Connect database successfully"))
        .catch((err) => console.log(err))
      Database.instance = this; // this	Là object được tạo ra khi gọi new Database()
    }
    return Database.instance;
  }
}

module.exports = new Database();