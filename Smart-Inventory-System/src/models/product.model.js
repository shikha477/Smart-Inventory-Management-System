
const mongoose = require("mongoose");
const Alert = require("./alert.model");

const productSchema = new mongoose.Schema(
{
name:{
type:String,
required:[true,"Product name required"],
trim:true
},

sku:{
type:String,
required:true,
unique:true
},

description:{
type:String,
trim:true
},

category:{
type:String,
trim:true
},

price:{
type:Number,
required:true,
min:0
},

stock:{
type:Number,
required:true,
default:0
},

reorderLevel:{
type:Number,
default:10
},

supplier:{
type:mongoose.Schema.Types.ObjectId,
ref:"Supplier"
},

isLowStock:{
type:Boolean,
default:false
}

},
{timestamps:true}
);


productSchema.pre("save", async function(next){

if(this.stock <= this.reorderLevel){

this.isLowStock = true;

const existingAlert = await Alert.findOne({
product:this._id,
type:"LOW_STOCK",
isRead:false
});

if(!existingAlert){

await Alert.create({
product:this._id,
type:"LOW_STOCK",
message:`${this.name} stock is low`
});

}

}else{

this.isLowStock = false;

}

// next();

});


module.exports = mongoose.model("Product",productSchema);