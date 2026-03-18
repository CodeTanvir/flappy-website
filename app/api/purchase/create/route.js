import { getCNYtoBDTRate } from "@/app/services/apiExchangeRate";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import OrderModel from "@/models/Order.model";
import PurchaseModel from "@/models/Purchase.model";

export async function POST(request) {
  try {
    await connectDB();

    const { productVariantId, totalQty, totalCost, allocations } =
      await request.json();

      
    // ✅ Validation
    if (!productVariantId || totalQty == null || !allocations?.length) {
      return response(false, 400, "Missing required fields");
    }

const cnyToBdtRate = await getCNYtoBDTRate();
console.log(cnyToBdtRate)
const totalCostBDT = Number((totalCost * cnyToBdtRate).toFixed(2));


    // ✅ Convert orderId -> Mongo _id
    const fixedAllocations = [];

    for (const a of allocations) {
      const order = await OrderModel.findOne({ orderId: a.orderId });

      if (!order) continue;

      fixedAllocations.push({
        orderId: order._id,
        allocate: a.allocate,
      });
    }

    if (!fixedAllocations.length) {
      return response(false, 400, "Invalid allocation data");
    }

    // 🔍 Find existing purchase
    let purchase = await PurchaseModel.findOne({ productVariantId });

    if (!purchase) {
      // ✅ CREATE NEW
      purchase = await PurchaseModel.create({
        productVariantId,
        totalQty,
        totalCostRMB:totalCost,
        totalCostBDT,
        allocations: fixedAllocations,
      });
    } else {
      // ✅ UPDATE EXISTING
      purchase.totalQty += totalQty;
      purchase.totalCostRMB += totalCost;
      purchase.totalCostBDT += totalCostBDT

      // 🔥 Merge allocations (NO duplicates)
      for (const newAlloc of fixedAllocations) {
        const existingAlloc = purchase.allocations.find(
          (a) => a.orderId.toString() === newAlloc.orderId.toString()
        );

        if (existingAlloc) {
          // ✅ Update existing allocation
          existingAlloc.allocate += newAlloc.allocate;
        } else {
          // ✅ Add new allocation
          purchase.allocations.push(newAlloc);
        }
      }

      await purchase.save();
    }

    // 🔄 Update order purchase status
    for (const alloc of fixedAllocations) {
      const order = await OrderModel.findById(alloc.orderId);

      if (!order) continue;

      const product = order.products.find(
        (p) => p.variantId.toString() === productVariantId
      );

      if (!product) continue;

      // ✅ Increase bought quantity
      product.boughtQty = (product.boughtQty || 0) + alloc.allocate;

      // ✅ Update status
      product.purchaseStatus =
        product.boughtQty >= product.qty ? "Completed" : "Partial";

      await order.save();
    }

    return response(true, 201, "Purchase saved", purchase);
  } catch (error) {
    return catchError(error);
  }
}