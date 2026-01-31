
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import MediaModel from "@/models/Media.model";
import ProductModel from "@/models/Product.model";
MediaModel

export const dynamic = 'force-dynamic';
export async function GET(){
    try{
       
        await connectDB();
     
        
        const getProduct = await ProductModel.find({deleteType:null}).
        populate('media').limit(8).lean()

        if(!getProduct){
            return response(false,404,'product not found')
        }
        return response(true,200,'product found',getProduct)
    }catch(error){
        return catchError(error)
    }
}