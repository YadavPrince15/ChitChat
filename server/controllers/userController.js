import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js"




//    Create new user
//  POST /api/users/signup
export const signup = async (req, res) => {
    const { fullName, email, password, bio } = req.body;
  try {

    if(!fullName || !email || !password || !bio){
        return res.json({success: false, message: "Missing Details"})
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
    });

    const token = generateToken(newUser._id)

    res.status(201).json({
       success: true, userData: newUser,token,
       message:"Account Created Successfully"
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

//   Login user
//  POST /api/users/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const userData = await User.findOne({ email });
    if (!userData) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Match password
    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(userData._id)

    res.status(200).json({
       success: true, userData,token,
       message:"Login Successfully"
    });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({success:false, message: error.message });
  }
};


// controllers/userController.js
export const checkAuth = (req, res) => {
  res.json({
    success: true,
    message: "User authenticated",
    user: req.user
  });
};





// @desc    Update user profile
// @route   PUT /api/users/profile
export const updateProfile = async (req, res) => {
  try {
    const {profilePic,bio,fullName} = req.body;
    const   userId = req.user._id;
    let updateUser;

    if(!profilePic){
        updateUser = await User.findByIdAndUpdate(userId,{bio,fullName},{new: true})
    } else{
      const upload = await cloudinary.uploader.upload(profilePic);

      updateUser = await User.findByIdAndUpdate(userId,{profilePic: upload.secure_url,bio,fullName},{new: true})
    }

    res.json({
      success: true, user:updateUser
    });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({success:false, message: error.message });
  }
};
