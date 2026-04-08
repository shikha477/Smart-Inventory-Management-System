const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

const protect = asyncHandler(async(req,res,next)=>{

let token;

if(
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
){

token = req.headers.authorization.split(" ")[1];

}

if(!token){
    throw new ApiError(401,"Not authorized");
}

const decoded = jwt.verify(token,process.env.JWT_SECRET);

req.user = await User.findById(decoded.id).select("-password");

next();

});

module.exports = protect;