import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
{
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true,
        index:true
    },

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
    }

},{timestamps:true})

const InventoryModel =
mongoose.models.Inventory ||
mongoose.model("Inventory",inventorySchema)

export default InventoryModel