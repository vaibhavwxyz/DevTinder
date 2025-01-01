const validator = require('validator');

const validateSignUpData = (req) => {
  const { firstName, LastName, emailId, password, age, skills } = req.body;

  if (!firstName || !emailId || !password) {
    throw new Error("Please provide required fields")
  } else if (!validator.isEmail(emailId) || !validator.isStrongPassword(password)) {
    throw new Error("Invalid credentials")
  }
}

module.exports = {
  validateSignUpData
}