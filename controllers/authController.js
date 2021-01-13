const jwt = require("jwt-simple");
const { use } = require("passport");
const config = require("../config");

const User = require("../models/user");
const validationHandler = require("../validations/validationHandler");

exports.login = async (req, res, next) => {
  try {

    const {email, password} = req.body
  
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      const error = new Error("Wrong Credentials");
      error.statusCode = 401;
      throw error;
    }

    const validPassword = await user.validPassword(password);
    if (!validPassword) {
      const error = new Error("Wrong Credentials");
      error.statusCode = 401;
      throw error;
    }

    const {userType, _id} = user;

    const token = jwt.encode(user, config.jwtSecret);
    return res.send({ userType, user_id:_id, token });
  } catch (err) {
    next(err);
  }
};

exports.signup = async (req, res, next) => {
  try {
    validationHandler(req);

    const { email, password,name, role} = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("Email already used");
      error.statusCode = 403;
      throw error;
    }

    let user = new User();
    user.email = email;
    user.password = await user.encryptPassword(password);
    user.name = name;
    user.userType = role;
    user = await user.save();

    const token = jwt.encode({ id: user.id }, config.jwtSecret);
    return res.send({ user, token });
  } catch (err) {
    next(err);
  }
};
