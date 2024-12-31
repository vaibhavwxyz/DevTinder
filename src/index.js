const bcrypt = require('bcrypt');
const express = require('express')
const connectDB = require('./config/database')
const User = require('./model/user');
const { validateSignUpData } = require('./utils/validateSignUpData');

const app = express()
const PORT = 3000

app.use(express.json())

app.post('/signup', async (req, res) => {

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
    isMatch ? res.status(200).send("Logged in Successfully!") : res.status(404).send({ message: "Invalid Credentials" });

  } catch (err) {
    res.status(400).send({
      message: "Error Logging in",
      error: err.message
    })
  }

})


app.patch('/user/:id', async (req, res) => {
  const updates = Object.keys(req.body)

  const allowedUpdates = ['firstName', 'lastName', 'password', 'age', 'skills']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidOperation) return res.status(400).send({ error: 'Invalid updates!' })

  try {
    const user = await User.findById(req.params.id)
    updates.forEach((update) => user[update] = req.body[update])

    await user.save()
    res.status(200).send({ message: 'user updated succefully', user })
  } catch (err) {
    res.status(400).send({ message: 'something went wrong', error: err.message })
  }
})

app.get('/getusers', async (req, res) => {

  try {
    const result = await User.find({});
    if (result.length === 0) res.send("there is no user");
    res.send(result)
  } catch (err) {
    res.status(400).send({
      message: "Something went wrong",
      error: err.message
    })
  }
})

app.delete('/user/:id', async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).send({
        message: "User not found"
      });
    }
    res.status(200).send({
      message: "User deleted successfully"
    });
  } catch (err) {
    res.status(400).send({
      message: "Error deleting the user",
      error: err.message
    });
  }
});

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

