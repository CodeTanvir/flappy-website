import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import AllocationModel from "@/models/Allocation.model";
import ProductModel from "@/models/Product.model";
import ProductVariantModel from "@/models/ProductVariant.model";
import PurchaseModel from "@/models/Purchase.model";

ProductModel;
ProductVariantModel;
PurchaseModel;


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
    select:"orderId"
})

.sort({
    createdAt:-1
})

.lean();



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