import mongoose from "mongoose";
import ProductVariantModel from "./ProductVariant.model";
ProductVariantModel
const stockSchema = new mongoose.Schema(
{
   

    variantId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ProductVariant",
        required:true
    },

    stock:{
        type:Number,
        default:0
    },

    buyingPrice:{
        type:Number
    },
    status:{
        type:String,
        enum:["cn","bd"],
        default:"cn",
        required:true
    }

},{timestamps:true})

const StockModel =
mongoose.models.Stock ||
mongoose.model("Stock",stockSchema)

export default StockModel