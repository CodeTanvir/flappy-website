import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import ReviewModel from "@/models/Review.model";



export async function GET(request){
    try{
        const auth = await isAuthenticated('admin')
        if(!auth.isAuth){
            return response(false,403,'Unauthorized')
        }
        await connectDB();
       
        const filter = {
            deletedAt:null
        }

        const getReviews = await ReviewModel.find(filter).sort({createdAt: -1}).lean();

        if(!getReviews){
            return response(false, 404, 'Collection empty')
        }

        return response(true, 200, 'Data found', getReviews)
      
    }catch(error){
        return catchError(error)
    }
}