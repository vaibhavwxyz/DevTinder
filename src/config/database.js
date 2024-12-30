const mongoose = require('mongoose')

const connectDB = async () => {
  await mongoose.connect('mongodb+srv://vaibhavwxyz:RVgXSlZS3iXNmJKz@devtinder.lhquk.mongodb.net/devTinder')
}

module.exports = connectDB;
