const express = require('express')
const connectDB = require('./config/database')
const bcrypt = require('bcrypt');
const validator = require('validator');
const User = require('./model/user')

const app = express()
const PORT = 3000

app.use(express.json())

app.post('/signup', async (req, res) => {

  const user = new User(req.body)

  try {
    await user.save();
    res.send("User Added Successfully!")
  } catch (err) {
    res.status(400).send({
      message: "Error Saving the User!",
      error: err.message
    })
  }

})

app.patch('/user/:id', async (req, res) => {
  const updates = Object.keys(req.body)

  const allowedUpdates = ['firstName', 'lastName', 'password', 'age', 'skills']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' })
  }

  try {
    const user = await User.findById(req.params.id)
    updates.forEach((update) => user[update] = req.body[update])

    await user.save()
    res.status(200).send({ message: 'user updated succefully', user })
  } catch (err) {
    res.status(400).send({ message: 'something went wrong', error: err.message })
  }
})

app.get('/user', async (req, res) => {

  try {
    const result = await User.find({ firstName: req.body.firstName });
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

