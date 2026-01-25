import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import ProductVariantModel from "@/models/ProductVariant.model";


import { isValidObjectId } from "mongoose";

export async function GET(request,{params}){
    try{
        const auth = await isAuthenticated('admin')
        if(!auth.isAuth){
            return response(false,403,'Unauthorized')
        }
        await connectDB();
        const getParams = await params;
        const id = getParams.id;
        const filter = {
            deletedAt:null
        }
        if(!isValidObjectId(id)){
            return response(false,400,'Invalid Object Id')

        }
        filter._id = id;
        const getProductVariant = await ProductVariantModel.findOne(filter).
        populate('media','_id secure_url').populate('product', 'name _id').lean()

        if(!getProductVariant){
            return response(false,404,'product variant not found')
        }
        return response(true,200,'product variant found',getProductVariant)
    }catch(error){
        return catchError(error)
    }
}