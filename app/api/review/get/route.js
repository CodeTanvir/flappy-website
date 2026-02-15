
import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunctions";
import ReviewModel from "@/models/Review.model";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request){
   try{
        await connectDB();

        const searchParams = request.nextUrl.searchParams;
        const productId = searchParams.get('productId');
        const page = parseInt(searchParams.get('page') || "0");

        const limit = 10;
        const skip = page * limit;

        const matchQuery = {
            deletedAt: null,
            product: new mongoose.Types.ObjectId(productId)
        };

        const aggregation = [
            {$match: matchQuery},
            {$sort:{createdAt: -1}},
            {$skip: skip},
            {$limit: limit + 1},
        ];

        const reviews = await ReviewModel.aggregate(aggregation);
        const totalReview = await ReviewModel.countDocuments(matchQuery);

        console.log("TOTAL REVIEW:", totalReview);

        let nextPage = null;
        if(reviews.length > limit){
            nextPage = page + 1;
            reviews.pop();
        }

        // return response(true, 'Review data', {reviews, nextPage, totalReview});

        return NextResponse.json({
  success: true,
  message: "Review data",
  data: {
    reviews,
    nextPage,
    totalReview
  }
});

   
   }catch(error){
      console.error(error);
      return catchError(error);
   }
}
