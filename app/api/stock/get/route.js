import { connectDB } from "@/lib/databaseConnection";
import { catchError, isAuthenticated, response } from "@/lib/helperFunctions";

import StockModel from "@/models/Stock.model";
import ProductVariantModel from "@/models/ProductVariant.model";
import ProductModel from "@/models/Product.model";
import MediaModel from "@/models/Media.model";

ProductVariantModel;
ProductModel;
MediaModel;

export async function GET() {
  try {
    await connectDB();

    const auth = await isAuthenticated("admin");

    if (!auth.isAuth) {
      return response(false, 401, "Unauthorized");
    }

    const stocks = await StockModel.find({
      cnWareHouse: { $gt: 0 },
    })
      .populate({
        path: "variantId",
        populate: [
          {
            path: "product",
            select: "name",
          },
          {
            path: "media",
          },
        ],
      })
      .sort({ updatedAt: -1 })
      .lean();

    const data = stocks.map((stock) => ({
      stockId: stock._id,
      variantId: stock.variantId._id,

      product: {
        name: stock.variantId.product?.name || "Unnamed Product",
        
        color: stock.variantId.color || "-",
        size: stock.variantId.size || "-",
        image:
          stock.variantId.media?.[0]?.secure_url ||
          "/assets/images/img-placeholder.webp",
      },

     

      cnWareHouse: stock.cnWareHouse,
      bdWareHouse: stock.bdWareHouse,
    
    }));

    return response(
      true,
      200,
      "Shipment allocation list",
      data
    );
  } catch (error) {
    return catchError(error);
  }
}