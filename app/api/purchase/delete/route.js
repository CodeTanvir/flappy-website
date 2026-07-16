import { getCNYtoBDTRate } from "@/app/services/apiExchangeRate";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import { syncStock } from "@/lib/syncStock";

import AllocationModel from "@/models/Allocation.model";
import OrderModel from "@/models/Order.model";
import PurchaseModel from "@/models/Purchase.model";


export async function DELETE(request) {

    try {

        await connectDB();


        const {id} = await request.json();
        
        
        if (!id) {

            return response(
                false,
                400,
                "Purchase id missing"
            );

        }
        const purchase = await PurchaseModel.findById(id);
      






        

        
       
        const rate = await getCNYtoBDTRate();

       const latestStock =  await syncStock({
            type:"delete",
            purchaseId:id,
            totalQty:Number(purchase.totalQty),
            variantId:purchase.productVariantId,
            totalCost:Number(purchase.totalCostRMB),
            rate
        })
        
        console.log(`latest Stock ${latestStock}, pq ${purchase.totalQty}`)
if(latestStock < purchase.totalQty){

const allocations = await AllocationModel.find({
    productVariantId: purchase.productVariantId,
}).sort({ createdAt: -1 }); // newest first

let qtyToRemove = purchase.totalQty - latestStock;
console.log(`to remove ${qtyToRemove}`);

for (const allocation of allocations) {
    if (qtyToRemove <= 0) break;

    const removeQty = Math.min(qtyToRemove, allocation.qty);

    allocation.qty -= removeQty;
    qtyToRemove -= removeQty;

    // update the corresponding order's boughtQty
    await OrderModel.updateOne(
        { _id: allocation.orderId, "items.productVariantId": allocation.productVariantId },
        { $inc: { "items.$.boughtQty": -removeQty } }
    );

    if (allocation.qty === 0) {
        await allocation.deleteOne();
    } else {
        await allocation.save();
    }
}
    }
    await PurchaseModel.findByIdAndDelete(id);
        return response(
            true,
            200,
            "Purchase deleted"
        );


    } catch (error) {

        return catchError(error);

    }


}