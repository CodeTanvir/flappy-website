import { connectDB } from "@/lib/databaseConnection";
import { catchError, isAuthenticated, response } from "@/lib/helperFunctions";

import MediaModel from "@/models/Media.model";
import ProductModel from "@/models/Product.model";
import ProductVariantModel from "@/models/ProductVariant.model";
import PurchaseModel from "@/models/Purchase.model";

ProductModel;
ProductVariantModel;
MediaModel;

export async function GET() {
  try {
    await connectDB();

    /* ========= AUTH ========= */
    const auth = await isAuthenticated("admin");

    if (!auth.isAuth) {
      return response(false, 401, "Unauthorized");
    }

    /* ========= FETCH ========= */
    const purchases = await PurchaseModel.find()
      .populate({
        path: "productVariantId",
        populate: [
          {
            path: "product",
            select: "name slug", // ✅ product data
          },
          {
            path: "media", // ✅ images
          },
        ],
      })
      .sort({ createdAt: -1 })
      .lean();

    /* ========= FORMAT ========= */
    const formatted = purchases.map((p) => {
      const variant = p.productVariantId;
      const product = variant?.product;

      return {
        _id: p._id,

        /* ===== PRODUCT INFO ===== */
        product: {
          name: product?.name || "Unnamed Product",
          slug: product?.slug || null,

          color: variant?.color || "-",
          size: variant?.size || "-",

          image:
            variant?.media?.[0]?.secure_url ||
            variant?.media?.[0]?.url ||
            null,
        },

        /* ===== PURCHASE INFO ===== */
        totalQty: p.totalQty,
        totalCostRMB: p.totalCostRMB,
        totalCostBDT: p.totalCostBDT,

        avgPriceRMB:
          p.totalQty > 0
            ? Number((p.totalCostRMB / p.totalQty).toFixed(2))
            : 0,

        allocationCount: p.allocations?.length || 0,

        /* ===== OPTIONAL FULL DATA ===== */
        allocations: p.allocations || [],

        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      };
    });

    return response(true, 200, "Purchase list", formatted);
  } catch (error) {
    console.log(error);
    return catchError(error);
  }
}