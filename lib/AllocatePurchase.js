import AllocationModel from "@/models/Allocation.model";
import OrderModel from "@/models/Order.model";
import mongoose from "mongoose";


export async function allocatePurchase(
    purchaseId,
    productVariantId,
    purchaseQty
){

let remainingQty = Number(purchaseQty);


const orders = await OrderModel.find({

    "products.variantId":productVariantId,
    deletedAt:null

})
.sort({
    createdAt:1
});



for(const order of orders){


const product = order.products.find(
p =>
p.variantId.toString()
===
productVariantId.toString()
);



if(!product)
continue;



if(remainingQty<=0)
break;



const result =
await AllocationModel.aggregate([

{
$match:{
orderId:order._id,
productVariantId:new mongoose.Types.ObjectId(productVariantId)
}
},

{
$group:{
_id:null,
total:{
$sum:"$qty"
}
}
}

]);



const alreadyAllocated =
result[0]?.total || 0;



const need =
product.qty - alreadyAllocated;



if(need<=0)
continue;



const allocate =
Math.min(
need,
remainingQty
);



await AllocationModel.create({

purchaseId,

productVariantId,

orderId:order._id,

qty:allocate

});




product.boughtQty =
(product.boughtQty || 0)
+
allocate;



product.purchaseStatus =
product.boughtQty >= product.qty
?
"Completed"
:
"Partial";



await order.save();



remainingQty -= allocate;



}



}