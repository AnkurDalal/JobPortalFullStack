import userModel from "../models/userModel.js";

export const updateUserController = async (req, resp, next) => {
  const { name, email, lastName, location } = req.body;
  if (!name || !email || !lastName || !location) {
    next("Please Provide All Fields !");
  }
  const user = userModel.findOne({ _id: req.user.userId });
  user.name = name;
  user.lastName = lastName;
  user.email = email;
  user.location = location;

  await user.save();
  const token = user.createJwt();
  resp.status(200).json({
    user,
    token,
  });
};

//get userData
export const getUserController = async (req, resp, next) => {
  try {
    const user = await userModel.findById({ _id: req.body.user.userId });
    user.password = undefined;
    if (!user) {
      return resp.status(200).send({
        message: "User not found",
        success: false,
      });
    } else {
      resp.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      message: "auth error",
      success: false,
      error: error.message,
    });
  }
};
