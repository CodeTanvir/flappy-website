import { getCNYtoBDTRate } from "@/app/services/apiExchangeRate";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import OrderModel from "@/models/Order.model";
import PurchaseModel from "@/models/Purchase.model";

export async function PUT(request) {
  try {
    await connectDB();

    const { purchaseId, totalQty, totalCost, allocations } =
      await request.json();

    if (!purchaseId || !totalQty || !allocations?.length) {
      return response(false, 400, "Missing fields");
    }

    const purchase = await PurchaseModel.findById(purchaseId);

    if (!purchase) {
      return response(false, 404, "Purchase not found");
    }

    /* ================= REMOVE OLD EFFECT ================= */
    for (const oldAlloc of purchase.allocations) {
      const order = await OrderModel.findById(oldAlloc.orderId);

      if (!order) continue;

      const product = order.products.find(
        (p) =>
          p.variantId.toString() ===
          purchase.productVariantId.toString()
      );

      if (!product) continue;

      product.boughtQty -= oldAlloc.allocate;

      product.purchaseStatus =
        product.boughtQty >= product.qty
          ? "Completed"
          : product.boughtQty > 0
          ? "Partial"
          : "Pending";

      await order.save();
    }

    /* ================= NEW CALC ================= */
    const rate = await getCNYtoBDTRate();
    const totalCostBDT = Number((totalCost * rate).toFixed(2));

    /* ================= APPLY NEW ================= */
    purchase.totalQty = totalQty;
    purchase.totalCostRMB = totalCost;
    purchase.totalCostBDT = totalCostBDT;
    purchase.allocations = allocations;

    await purchase.save();

    /* ================= APPLY NEW TO ORDERS ================= */
    for (const alloc of allocations) {
      const order = await OrderModel.findById(alloc.orderId);

      if (!order) continue;

      const product = order.products.find(
        (p) =>
          p.variantId.toString() ===
          purchase.productVariantId.toString()
      );

      if (!product) continue;

      product.boughtQty =
        (product.boughtQty || 0) + alloc.allocate;

      product.purchaseStatus =
        product.boughtQty >= product.qty
          ? "Completed"
          : "Partial";

      await order.save();
    }

    return response(true, 200, "Purchase updated", purchase);
  } catch (error) {
    return catchError(error);
  }
}