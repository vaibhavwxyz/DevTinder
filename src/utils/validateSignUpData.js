const validator = require('validator');

const validateSignUpData = (req) => {
  const { firstName, LastName, emailId, password, age, skills } = req.body;

  if (!firstName || !emailId || !password) {
    throw new Error("Please provide required fields")
  } else if (!validator.isEmail(emailId) || !validator.isStrongPassword(password)) {
    throw new Error("Invalid credentials")
  } else if (age < 13) {
    throw new Error("Age should be greater than 13")
  } else if (skills.length > 10) {
    throw new Error('Skills should be less thatn 10')
  }
}

module.exports = {
  validateSignUpData
}