import { connectDB } from "@/lib/databaseConnection";
import { catchError, isAuthenticated, response } from "@/lib/helperFunctions";

import MediaModel from "@/models/Media.model";
import OrderModel from "@/models/Order.model";
import ProductModel from "@/models/Product.model";
import ProductVariantModel from "@/models/ProductVariant.model";
import PurchaseModel from "@/models/Purchase.model";

MediaModel;
ProductModel;
ProductVariantModel;

export async function GET() {
  try {
    await connectDB();

    const auth = await isAuthenticated("admin");

    if (!auth.isAuth) {
      return response(false, 401, "Unauthorized");
    }

    const userId = auth.userId;

    // ✅ Get user orders
    const orders = await OrderModel.find({
      userId,
      deletedAt: null,
    })
      .populate("products.productId", "name slug")
      .populate({
        path: "products.variantId",
        populate: { path: "media" },
      })
      .lean();

    // ✅ Collect variantIds
    const variantIds = [];

    orders.forEach((order) => {
      order.products.forEach((p) => {
        if (p.variantId?._id) {
          variantIds.push(p.variantId._id);
        }
      });
    });

    // ✅ Get ALL related orders (for history)
    const similarOrders = await OrderModel.find({
      "products.variantId": { $in: variantIds },
    })
      .select("orderId name products createdAt")
      .lean();

    // ✅ Get purchases
    const purchases = await PurchaseModel.find({
      productVariantId: { $in: variantIds },
    }).lean();

    // ✅ Build allocation map → { orderId: allocatedQty }
    const allocationMap = {};

    purchases.forEach((purchase) => {
      purchase.allocations.forEach((a) => {
        const key = a.orderId.toString();

        if (!allocationMap[key]) allocationMap[key] = 0;

        allocationMap[key] += a.allocate;
      });
    });

    // ✅ Build history map (FIXED with remaining)
    const historyMap = {};

    similarOrders.forEach((order) => {
      order.products.forEach((p) => {
        const variantId = p.variantId?.toString();
        if (!variantId) return;

        if (!historyMap[variantId]) historyMap[variantId] = [];

        const allocated = allocationMap[order._id.toString()] || 0;
   const remaining = p.qty - allocated;

// ❌ Skip fully completed orders
if (remaining <= 0) return;

historyMap[variantId].push({
  orderId: order.orderId,
  customer: order.name,
  qty: p.qty,
  allocated,
  remaining,
  sellingPrice: p.sellingPrice,
  date: order.createdAt,
});
      });
    });

    // ✅ Attach purchase summary to UI rows
    const purchaseMap = {};

    purchases.forEach((p) => {
      const id = p.productVariantId.toString();

      purchaseMap[id] = {
        totalQty: p.totalQty,
        totalCost: p.totalCost,
      };
    });

    orders.forEach((order) => {
      order.products.forEach((p) => {
        const id = p.variantId?._id?.toString();

        p.purchase = purchaseMap[id] || null;
      });
    });

    return response(true, 200, "Orders fetched", {
      orders,
      historyMap,
    });
  } catch (error) {
    console.log(error);
    return catchError(error);
  }
}