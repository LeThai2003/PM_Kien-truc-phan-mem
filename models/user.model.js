const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  fullname: {type: String, required: true},
  slugName: {type: String},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  profilePicture: {
    type: String,
    // default: 'https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg',
  },
  major: {type: String},
  description: {type: String},
  refreshToken: {type: String}
}, {
  timestamps: true
});

userSchema.pre("save", async function name() {
  if(this.isModified("password"))
  {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

userSchema.methods.comparePassword = function (password){
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;