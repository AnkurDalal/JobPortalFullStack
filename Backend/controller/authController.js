import userModel from "../models/userModel.js";

export const registerController = async (req, resp, next) => {
  const { name, email, password, lastName } = req.body;
  //validate
  if (!name) {
    next("name is required !");
  }
  if (!email) {
    next("email is required !");
  }
  if (!password) {
    next("password is required and greater than 6 character !");
  }
  //check if email already exists
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    next("Email already registered please login !");
  }
  //create new user
  const user = await userModel.create({ name, email, password, lastName });
  //token
  const token = user.createJWT();
  resp.status(201).send({
    success: true,
    message: "User created Successfully",
    user: {
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      location: user.location,
    },
    token,
  });
};

export const loginController = async (req, resp, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return next("Please provide all fields");
    }

    // Find user by email
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return next("Invalid Username or Password");
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next("Invalid Username or Password");
    }

    // Remove password before sending response
    user.password = undefined;

    // Create token
    const token = user.createJWT();

    resp.status(200).send({
      success: true,
      message: "Login Successfully",
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

