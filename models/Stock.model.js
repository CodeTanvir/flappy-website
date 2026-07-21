import mongoose from "mongoose";
import ProductVariantModel from "./ProductVariant.model";
import PurchaseModel from "./Purchase.model";
ProductVariantModel,
PurchaseModel
const stockSchema = new mongoose.Schema(
{
   
   
    variantId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ProductVariant",
        required:true
    },

    

    buyingPrice:{
        type:Number
    },
    cnWareHouse:{
        type:Number
    },
    bdWareHouse:{
        type:Number
    },
    inShipment:{
        type:Number
    }


},{timestamps:true})

const StockModel =
mongoose.models.Stock ||
mongoose.model("Stock",stockSchema)

export default StockModel