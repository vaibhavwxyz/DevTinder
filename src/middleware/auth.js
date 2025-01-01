const jwt = require('jsonwebtoken');
const User = require('../model/user');

const userAuth = async (req, res, next) => {

  try {
    const token = req.cookies.token;
    if (!token) throw new Error("token is not valid")
    const decoded = await jwt.verify(token, 'thisisrandomsecretkey');

    const { id } = decoded;
    const user = await User.findById(id);

    if (!user) {
      throw new Error("User not found")
    }

    req.user = user;
    next()
  } catch (err) {
    res.status(401).send({
      message: "please authenticate",
      error: err.message
    })
  }

}

module.exports = {
  userAuth
}