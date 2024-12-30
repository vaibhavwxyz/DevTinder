const express = require('express')
const connectDB = require('./config/database')
const User = require('./model/user')

const app = express()
const PORT = 3000

app.use(express.json())

app.post('/signup', async (req, res) => {
  // const user = new User({
  //   firstName: 'Pawan',
  //   lastName: 'Bangar',
  //   emailId: 'pawan@gmail.com',
  //   password: '12345'
  // })

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

