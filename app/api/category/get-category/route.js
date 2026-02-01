import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import CategoryModel from "@/models/Category.model";


export async function GET(request,{params}){
    try{
        
        await connectDB();
      
      
        const getCategory = await CategoryModel.find({deletedAt:null}).lean()
        
        if(!getCategory){
            return response(false,404,'category not found')
        }
        return response(true,200,'Category found',getCategory)
    }catch(error){
        return catchError(error)
    }
}