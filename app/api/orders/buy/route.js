import { connectDB } from "@/lib/databaseConnection";
import { catchError, isAuthenticated, response } from "@/lib/helperFunctions";

import AllocationModel from "@/models/Allocation.model";
import MediaModel from "@/models/Media.model";
import OrderModel from "@/models/Order.model";
import ProductModel from "@/models/Product.model";
import ProductVariantModel from "@/models/ProductVariant.model";
import PurchaseModel from "@/models/Purchase.model";

MediaModel;
ProductModel;
ProductVariantModel

export async function GET() {
  try {
    await connectDB();

    const auth = await isAuthenticated("admin");

    if (!auth.isAuth) {
      return response(false, 401, "Unauthorized");
    }

    const userId = auth.userId;

    // ================= GET USER ORDERS =================

    const orders = await OrderModel.find({
      userId,

      deletedAt: null,
    })
      .populate("products.productId", "name slug")
      .populate({
        path: "products.variantId",

        populate: {
          path: "media",
        },
      })
      .lean();

    // ================= COLLECT VARIANT IDS =================

    const variantIds = [];

    orders.forEach((order) => {
      order.products.forEach((product) => {
        if (product.variantId?._id) {
          variantIds.push(product.variantId._id);
        }
      });
    });

    // ================= ALL ORDERS WITH SAME PRODUCTS =================

    const similarOrders = await OrderModel.find({
      "products.variantId": {
        $in: variantIds,
      },
    })
      .select("orderId name products createdAt")
      .lean();

    // ================= PURCHASES =================

    const purchases = await PurchaseModel.find({
      productVariantId: {
        $in: variantIds,
      },
    }).lean();

    // ================= ALLOCATIONS =================

    const allocations = await AllocationModel.find({
      productVariantId: {
        $in: variantIds,
      },
    }).lean();

    // ================= CREATE ALLOCATION MAP =================

    const allocationMap = {};

    allocations.forEach((a) => {
      const key = `${a.orderId.toString()}_${a.productVariantId.toString()}`;

      if (!allocationMap[key]) {
        allocationMap[key] = 0;
      }

      allocationMap[key] += a.qty;
    });

    // ================= HISTORY =================

    const historyMap = {};

    similarOrders.forEach((order) => {
      order.products.forEach((product) => {
        const variantId = product.variantId?.toString();

        if (!variantId) {
          return;
        }

        if (!historyMap[variantId]) {
          historyMap[variantId] = [];
        }

        const allocated =
          allocationMap[`${order._id.toString()}_${variantId}`] || 0;

        const remaining = product.qty - allocated;

        // hide completed

        if (remaining <= 0) {
          return;
        }

        historyMap[variantId].push({
          orderId: order.orderId,

          customer: order.name,

          qty: product.qty,

          allocated,

          remaining,

          sellingPrice: product.sellingPrice,

          date: order.createdAt,
        });
      });
    });

    // ================= PURCHASE SUMMARY =================

    const purchaseMap = {};

    purchases.forEach((p) => {
      const id = p.productVariantId.toString();

      if (!purchaseMap[id]) {
        purchaseMap[id] = {
          totalQty: 0,

          totalCostRMB: 0,

          totalCostBDT: 0,
        };
      }

      purchaseMap[id].totalQty += p.totalQty;

      purchaseMap[id].totalCostRMB += p.totalCostRMB;

      purchaseMap[id].totalCostBDT += p.totalCostBDT;
    });

    // ================= ATTACH PURCHASE TO UI =================

    orders.forEach((order) => {
      order.products.forEach((product) => {
        const id = product.variantId?._id?.toString();

        product.purchase = purchaseMap[id] || null;
      });
    });

    return response(
      true,

      200,

      "Orders fetched",

      {
        orders,

        historyMap,
      },
    );
  } catch (error) {
    console.log(error);

    return catchError(error);
  }
}
