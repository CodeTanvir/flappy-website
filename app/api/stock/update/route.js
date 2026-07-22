import { connectDB } from "@/lib/databaseConnection";
import { catchError, isAuthenticated, response } from "@/lib/helperFunctions";
import StockModel from "@/models/Stock.model";




export async function PUT(request){
    try{
        await connectDB();
        const auth = await isAuthenticated("admin");

        if(!auth){
            return response(false, 401, "Unauthorized")
        }

        const payload = await request.json();

        const {
            variantId,
            cnWareHouse,
            bdWareHouse
        } = payload;
        if(!variantId){
            return response(false,400,"Variant ID required")
        }
          if(!variantId){
            return response(false,400,"Variant ID required");
        }



        const updateData = {};



        if(cnWareHouse !== undefined){

            updateData.cnWareHouse =
                Number(cnWareHouse) > 0
                ? Number(cnWareHouse)
                : 0;

        }



        if(bdWareHouse !== undefined){

            updateData.bdWareHouse =
                Number(bdWareHouse) > 0
                ? Number(bdWareHouse)
                : 0;

        }




        const updatedStock =
            await StockModel.findOneAndUpdate(

                {
                    variantId
                },

                {
                    $set:updateData
                },

                {
                    new:true,
                    upsert:true
                }

            );



        // delete document if everything becomes 0

        if(
            updatedStock.cnWareHouse <= 0 &&
            updatedStock.bdWareHouse <= 0 &&
            updatedStock.inShipment <= 0
        ){

            await StockModel.findByIdAndDelete(
                updatedStock._id
            );


        }



        return response(
            true,
            200,
            "Stock updated successfully",
            updatedStock
        );



    }catch(error){
       return catchError(error.message)
    }
}