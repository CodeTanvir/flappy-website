import { getCNYtoBDTRate } from "@/app/services/apiExchangeRate";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";

import { allocatePurchase } from "@/lib/AllocatePurchase";
import PurchaseModel from "@/models/Purchase.model";



export async function POST(request) {

  try {

    await connectDB();


    const {
      productVariantId,
      totalQty,
      totalCost

    } = await request.json();



    // validation

    if(
      !productVariantId ||
      totalQty == null ||
      totalCost == null
    ){

      return response(
        false,
        400,
        "Missing required fields"
      );

    }



    // CNY -> BDT

    const rate = await getCNYtoBDTRate();


    const totalCostBDT =
      Number(
        (Number(totalCost) * rate).toFixed(2)
      );





    // CREATE NEW PURCHASE

    const purchase =
      await PurchaseModel.create({

        productVariantId,

        totalQty:Number(totalQty),

        totalCostRMB:Number(totalCost),

        totalCostBDT

      });







    // AUTO ALLOCATION

    await allocatePurchase(

      purchase._id,

      productVariantId,

      totalQty

    );







    return response(

      true,

      201,

      "Purchase saved",

      purchase

    );



  } catch(error){


    console.log(error);

    return catchError(error);

  }

}