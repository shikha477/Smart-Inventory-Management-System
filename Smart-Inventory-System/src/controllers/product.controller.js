exports.deleteProduct = async (req,res)=>{

res.json({
success:true,
message:"Product deleted successfully"
});

};
exports.getProducts = async (req,res)=>{

res.json({
success:true,
message:"All products fetched successfully"
});

};