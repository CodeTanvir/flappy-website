import mongoose from "mongoose";

const returnSchema = new mongoose.Schema({

    orderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order"
    },

    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    },

    variantId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ProductVariant"
    },

    qty:{
        type:Number,
        required:true
    },

    reason:String

},{timestamps:true})

const ReturnModel =
mongoose.models.Return ||
mongoose.model("Return",returnSchema)

export default ReturnModel