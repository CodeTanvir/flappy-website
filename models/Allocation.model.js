import mongoose from "mongoose";


const allocationSchema = new mongoose.Schema(
{

productVariantId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"ProductVariant",
    required:true
},


purchaseId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Purchase",
    required:true
},


orderId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Order",
    required:true
},


qty:{
    type:Number,
    required:true
}


},
{
    timestamps:true
}

);



const AllocationModel =
mongoose.models.Allocation ||
mongoose.model(
    "Allocation",
    allocationSchema
);



export default AllocationModel;