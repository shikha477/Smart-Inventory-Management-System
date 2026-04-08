const asyncHandler = require("../utils/asyncHandler");

exports.getAllUsers = asyncHandler(async(req,res)=>{

res.json({
    success:true,
    message:"Admin accessed all users route"
});

});