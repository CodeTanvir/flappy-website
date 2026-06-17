import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";

import AllocationModel from "@/models/Allocation.model";
import PurchaseModel from "@/models/Purchase.model";


export async function DELETE(request){

try{

await connectDB();


const { id } = await request.json();


if(!id){

return response(
false,
400,
"Purchase id missing"
);

}



// delete allocations first
await AllocationModel.deleteMany({
purchaseId:id
});



// delete purchase
await PurchaseModel.findByIdAndDelete(id);



return response(
true,
200,
"Purchase deleted"
);


}catch(error){

console.log(error);

return catchError(error);

}


}