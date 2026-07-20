import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import AllocationModel from "@/models/Allocation.model";
import MediaModel from "@/models/Media.model";
import OrderModel from "@/models/Order.model";
import ProductModel from "@/models/Product.model";
import ProductVariantModel from "@/models/ProductVariant.model";
import PurchaseModel from "@/models/Purchase.model";

ProductModel;
ProductVariantModel;
PurchaseModel;
OrderModel;
MediaModel

export async function GET(){

try{

await connectDB();


const allocations = await AllocationModel.find()

.populate({
    path:"productVariantId",
    select:"color size product media",
    populate:[
        {
            path:"product",
            select:"name slug"
        },
        {
            path:"media",
            select:"secure_url"
        }
    ]
})

.populate({
    path:"purchaseId",
    select:"totalQty totalCostBDT createdAt"
})

.populate({
    path:"orderId",
    select:"orderId createdAt"
})

.lean();

allocations.sort((a, b) => {
  return new Date(a.orderId.createdAt) - new Date(b.orderId.createdAt);
});

return response(
    true,
    200,
    "Allocation list",
    allocations
);


}catch(error){

return catchError(error);

}

}