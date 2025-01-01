const bcrypt = require('bcrypt');
const express = require('express')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const connectDB = require('./config/database')
const User = require('./model/user');
const { validateSignUpData } = require('./utils/validateSignUpData');
const { userAuth } = require('./middleware/auth');

const app = express()
const PORT = 3000

app.use(express.json())
app.use(cookieParser())

app.post('/register', async (req, res) => {

  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, password, age, gender, skills } = req.body;

    const hashedPassword = await bcrypt.hash(password, 8)
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
      age,
      gender,
      skills
    })

    await user.save();
    res.send("User Added Successfully!")
  } catch (err) {
    res.status(400).send({
      message: "Error Saving the User!",
      error: err.message
    })
  }

})

app.get('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });

    if (!user) {
      return res.status(404).send({
        message: "Invalid Credentials"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      var token = jwt.sign({ id: user._id }, 'thisisrandomsecretkey')
      res.cookie('token', token)
      res.status(200).send("Logged in Successfully!")
    } else {
      res.status(404).send({ message: "Invalid Credentials" });
    }

  } catch (err) {
    res.status(400).send({
      message: "Error Logging in",
      error: err.message
    })
  }
})

app.get('/whoiam', userAuth, async (req, res) => {
  try {
    const result = req.user;
    if (result.length === 0) res.send("there is no user");
    res.send(result)
  } catch (err) {
    res.status(400).send({
      message: "Something went wrong",
      error: err.message
    })
  }
})


connectDB()
  .then(() => {
    console.log('Database connection established!');
    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    })
  })
  .catch((err) => {
    console.log(`Database cannot be connected! ${err}`);
  });

