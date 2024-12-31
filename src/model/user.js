const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("please enter valid email address")
      }
    }
  },
  password: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isStrongPassword(value)) {
        throw new Error("password is not strong")
      }
    }
  },
  age: {
    type: Number,
    min: 13
  },
  gender: {
    type: String,
    validate(value) {
      if (!["male", "female", "others"].includes(value)) {
        throw new Error("gender is not valid")
      }
    },
  },
  skills: {
    type: [String]
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema)