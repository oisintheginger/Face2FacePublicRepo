const User = require('./../Models/userModel.js');

const { FileUpload, s3Get, s3Delete } = require('../Utils/s3Tools.js');
const { default: queryModifier } = require('./../Utils/queryModifier');
const CustomError = require('./../Utils/customError.js');

async function deleteAvatar(avatar) {
  try {
    console.log(avatar);
    avatar != null && avatar != '' && (await s3Delete(avatar));
  } catch (error) {
    console.log(error.message);
  }
}
exports.getAllUsers = async (req, res, next) => {
  try {
    const usersQuery = new queryModifier(User.find(), req.query)
      .filter()
      .selectFields('name,id,avatar,description');
    let users = await usersQuery.queryObject;
    users = await Promise.all(
      users.map(async (user) => {
        if (user.avatar) {
          user.avatar = await s3Get(user.avatar);
        }
        return user;
      })
    );
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users: users,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'Internal Server Error',
      success: false,
      message: 'failure',
      data: {},
    });
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    try {
      deleteAvatar(req.avatarName);
    } catch (error) {
      console.log(error.message);
    }
    req.user.remove();
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: 'Internal Server Error',
      success: false,
      message: 'failure',
      data: {},
    });
  }
};

exports.updateEmail = async (req, res, next) => {
  try {
    let changes = {};
    if (req.body.email) changes = { email: req.body.email };
    const user = await User.findByIdAndUpdate(req.user.id, changes, {
      new: true,
      runValidators: true,
    });
    res.status(204).json({
      status: 'success',
      data: {
        user: user,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'Internal Server Error',
      success: false,
      message: 'failure',
      data: {},
    });
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const updateObject = {
      ...(req.file && { avatar: await FileUpload(req.file) }),
      ...(req.body.description && {
        description: req.body.description,
      }),
      ...(req.body.name && {
        name: req.body.name,
      }),
    };
    const user = await User.findByIdAndUpdate(req.user.id, updateObject, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'OK',
      success: true,
      data: {
        user: user,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'Internal Server Error',
      success: false,
      message: 'Something went wrong with updating the profile',
      data: {},
    });
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    if (
      !req.body.password ||
      !req.body.newPassword ||
      !req.body.newPasswordConfirm
    ) {
      throw new CustomError.default('Bad Request', 'Incorrect Parameters', 400);
    }
    if (
      req.body.password &&
      (await req.user.checkPassword(req.body.password, req.user._id)) &&
      req.body.newPassword == req.body.newPasswordConfirm
    ) {
      req.user.password = req.body.newPassword;
      req.user.passwordChangedTime = Date.now();
      req.user.save();
    }
    res.status(200).json({
      status: 'success',
    });
  } catch (error) {
    res.status(500).json({
      status: 'Internal Server Error',
      success: false,
      message: 'Something went wrong with updating the profile',
      data: {},
    });
  }
};

exports.getAccountDetails = async (req, res, next) => {
  const userData = { ...req.user._doc };
  res.status(200).json({
    status: 'success',
    data: {
      user: userData,
    },
  });
};
