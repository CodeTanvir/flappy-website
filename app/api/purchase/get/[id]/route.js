import { connectDB } from "@/lib/databaseConnection";
import { catchError, isAuthenticated, response } from "@/lib/helperFunctions";
import MediaModel from "@/models/Media.model";
import ProductModel from "@/models/Product.model";
import ProductVariantModel from "@/models/ProductVariant.model";
import PurchaseModel from "@/models/Purchase.model";
import mongoose from "mongoose";
MediaModel;
ProductVariantModel;
ProductModel;

export async function GET(request,{params}){

    try{

        const auth = await isAuthenticated('admin');

        if(!auth.isAuth){
            return response(false,403,'Unauthorized');
        }


        await connectDB();


        const {id} = params;

        console.log("ID:",id);


        if(!mongoose.isValidObjectId(id)){
            return response(false,400,'Invalid Object Id');
        }


        const purchase = await PurchaseModel.findById(id)
        .populate(
            "productVariantId"
        )
        .lean();


        console.log("PURCHASE:",purchase);


        if(!purchase){
            return response(false,404,'Purchase not found');
        }


        return response(
            true,
            200,
            'Purchase found',
            purchase
        );


    }catch(error){

        return catchError(error);

    }
}