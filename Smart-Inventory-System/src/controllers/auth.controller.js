const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");


// REGISTER
exports.register = asyncHandler(async(req,res)=>{

const {name,email,password} = req.body;

const userExists = await User.findOne({email});

if(userExists){
    throw new ApiError(400,"User already exists");
}

const hashedPassword = await bcrypt.hash(password,10);

const user = await User.create({
    name,
    email,
    password:hashedPassword
});

const token = generateToken(user._id);

res.status(201).json({
    success:true,
    token,
    user:{
        id:user._id,
        name:user.name,
        email:user.email,
        role:user.role
    }
});

});


// LOGIN
exports.login = asyncHandler(async(req,res)=>{

const {email,password} = req.body;

const user = await User.findOne({email});

if(!user){
    throw new ApiError(401,"Invalid credentials");
}

const isMatch = await bcrypt.compare(password,user.password);

if(!isMatch){
    throw new ApiError(401,"Invalid credentials");
}

const token = generateToken(user._id);

res.json({
    success:true,
    token,
    user:{
        id:user._id,
        name:user.name,
        email:user.email,
        role:user.role
    }
});

});

// Logout
exports.logout = asyncHandler(async(req,res)=>{

res.json({
    success:true,
    message:"Logged out successfully"
});

});

// Current user
exports.getMe = asyncHandler(async(req,res)=>{

const user = await User.findById(req.user.id).select("-password");

res.json({
    success:true,
    user
});

});