const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//register controller
const registerUser = async (req, res) => {
  try {
    //extract user information from our request body
    const { username, email, password, role } = req.body;
    //check if the user already exists in our database
    const checkExisitingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (checkExisitingUser) {
      return res.status(400).json({
        success: false,
        message:
          "User already exists either with same username or same email.Please try with a different username or email",
      });
    }
    //hash user password
    var salt = await bcrypt.genSalt(10);
    var hashedPassword = await bcrypt.hash(password, salt);

    //create a new user and save it in our database
    const newlyCreatedUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });
    await newlyCreatedUser.save();

    if (newlyCreatedUser) {
      res.status(201).json({
        success: true,
        message: "User registered successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Unable to register user please try again",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured please try again",
    });
  }
};

//login controller
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    //find if the current user exists in database or not
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: `User Doesn't Exist`,
      });
    }

    //Now we shall check if the password is correct or not
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    //create user token
    const accessToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "15m",
      }
    );

    res.status(200).json({
      success: true,
      message: "Log In Successful",
      accessToken,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Some error occured please try again",
    });
  }
};

module.exports = { registerUser, loginUser };
