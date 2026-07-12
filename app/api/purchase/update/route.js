import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";

import { getCNYtoBDTRate } from "@/app/services/apiExchangeRate";
import AllocationModel from "@/models/Allocation.model";
import OrderModel from "@/models/Order.model";
import PurchaseModel from "@/models/Purchase.model";

import ProductModel from "@/models/Product.model";
import { syncStock } from "@/lib/syncStock";
ProductModel;
export async function PUT(request) {
  try {
    await connectDB();

    const { purchaseId, totalQty, totalCost } = await request.json();

    const purchase = await PurchaseModel.findById(purchaseId);
    
    if (!purchase) {
      return response(false, 404, "Purchase not found");
    }

    // ================= REMOVE OLD ALLOCATION EFFECT =================

    const oldAllocations = await AllocationModel.find({
      purchaseId,
    });

    for (const alloc of oldAllocations) {
      const order = await OrderModel.findById(alloc.orderId);

      if (!order) continue;

      const product = order.products.find(
        (p) => p.variantId.toString() === purchase.productVariantId.toString(),
      );

      if (product) {
        product.boughtQty = Math.max(0, (product.boughtQty || 0) - alloc.qty);

        product.purchaseStatus =
          product.boughtQty >= product.qty
            ? "Completed"
            : product.boughtQty > 0
              ? "Partial"
              : "Pending";

        await order.save();
      }
    }

    // delete old allocations

    await AllocationModel.deleteMany({
      purchaseId,
    });




    // ================= UPDATE PURCHASE =================

    const rate = await getCNYtoBDTRate();

    purchase.totalQty = Number(totalQty);

    purchase.totalCostRMB = Number(totalCost);

    purchase.totalCostBDT = Number((totalCost * rate).toFixed(2));


 

await syncStock({
  type:"update",
  variantId: purchase.productVariantId,
  purchaseId: purchase._id,
  totalQty,
  totalCost,
  rate
});

    await purchase.save();

    // ================= CREATE NEW FIFO ALLOCATION =================

    const { allocatePurchase } = await import("@/lib/AllocatePurchase");

    await allocatePurchase(
      purchase._id,

      purchase.productVariantId,

      totalQty,
    );

    return response(true, 200, "Purchase updated", purchase);
  } catch (error) {
    console.log(error);

    return catchError(error);
  }
}
