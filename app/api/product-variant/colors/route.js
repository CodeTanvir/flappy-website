import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import ProductVariantModel from "@/models/ProductVariant.model";


export async function GET(){
    try{
        
        await connectDB();
      
      
        const getColor = await ProductVariantModel.distinct('color')
        if(!getColor){
            return response(false,404,'color not found')
        }
        return response(true,200,'color found',getColor)
    }catch(error){
        return catchError(error)
    }
}