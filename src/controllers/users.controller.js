const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error.model');
const User = require('../models/user.model');

const getUsers = async (req, res, next) => {


  try {

  } catch(err) {

  }
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError('Invalid inputs parameters.', 422);
    return next(error);
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch(err) {
    const error = new HttpError('Signing up failed, please try again later.', 500);
    return next(error);
  }

  if (existingUser) {
    const error = HttpError('User already exists.', 422);
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image: 'ímg',
    password,
    places
  });

  try {
    await createdUser.save();
  } catch(err) {
    const error = new HttpError('Creating user fail, please try again', 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true })});
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  
  const identifiedUser = DUMMY_USERS.find(user => user.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError('Could not identify user, credentials seem to be wrong.', 401);
  }

  res.json({ message: 'Logged in!' });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;