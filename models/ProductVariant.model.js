import mongoose from "mongoose";


const productVariantSchema = new mongoose.Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Product"
    },
    color:{
       type:String,
       required:true,
       trim:true
    },
    size:{
        type:String,
        trim:true,
        required:true
    },
    mrp:{
        type:Number,
        required:true
    },
    sellingPrice:{
        type:Number,
        required:true
    },
    discountPercentage:{
        type:Number,
        required:true,
    },
    stock:{
        type:Number,
        required:true,
        default:0
    },
    orders:{
        type:Number,
        required:false,
        default:0,
    },
    media:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Media",
            required:true
        }
    ],
   
    deletedAt:{
        type:Date,
        default:null,
        index:true
    }
 
},{timestamps:true});


const ProductVariantModel = mongoose.models.ProductVariant || mongoose.model('ProductVariant',productVariantSchema,'productvariants');

export default ProductVariantModel;