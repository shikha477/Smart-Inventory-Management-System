const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/user.model");

exports.getAllUsers = asyncHandler(async(req,res)=>{

const users = await User.find().select("-password").sort({ createdAt: -1 });
res.json({
    success:true,
    data:users,
    message:"Admin accessed all users route"
});


});