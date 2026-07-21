import { connectDB } from "@/lib/databaseConnection";
import { catchError, isAuthenticated, response } from "@/lib/helperFunctions";

import PurchaseModel from "@/models/Purchase.model";
import ProductVariantModel from "@/models/ProductVariant.model";
import ProductModel from "@/models/Product.model";
import MediaModel from "@/models/Media.model";
import ReceivedParcelModel from "@/models/ReceivedParcel.model";
import OrderModel from "@/models/Order.model";
import StockModel from "@/models/Stock.model";

ProductVariantModel;
ProductModel;
MediaModel;
ReceivedParcelModel;


export async function GET() {
    try {

        await connectDB();

        /* ========= AUTH ========= */

        const auth = await isAuthenticated("admin");

        if (!auth.isAuth) {
            return response(false, 401, "Unauthorized");
        }

        /* ========= PURCHASES ========= */

    const purchases = await PurchaseModel.aggregate([
  {
    $group: {
      _id: "$productVariantId",
      totalQty: { $sum: "$totalQty" },
      
      
      
      createdAt: { $max: "$createdAt" }
    }
  },
  {
    $sort: {
      createdAt: -1
    }
  }
]);
const variantIds = purchases.map(item => item._id);

const variants = await ProductVariantModel.find({
    _id: { $in: variantIds }
})
.populate({
    path: "product",
    select: "name slug"
})
.populate("media")
.lean();

const variantMap = new Map();

variants.forEach(variant => {
    variantMap.set(
        variant._id.toString(),
        variant
    );
});


/* ========= STOCK ========= */

const stocks = await StockModel.find(
  {
    variantId: { $in: variantIds },
  },
  {
    variantId: 1,
    cnWareHouse: 1,
    bdWareHouse: 1,
    inShipment: 1,
  }
).lean();

const stockMap = new Map(
  stocks.map((stock) => [
    stock.variantId.toString(),
    {
      totalReceived:
        (stock.cnWareHouse || 0) +
        (stock.bdWareHouse || 0) +
        (stock.inShipment || 0),
    },
  ])
);
        /* ========= FORMAT ========= */
const formatted = purchases.map(item => {
  const variant = variantMap.get(item._id.toString());

 const stock = stockMap.get(item._id.toString());

const totalReceived = stock?.totalReceived || 0;

  return {
    
     
  variantId: item._id,
   
    product: {
      name: variant?.product?.name || "Unnamed Product",
     
      color: variant?.color || "-",
      size: variant?.size || "-",
      image: variant?.media?.[0]?.secure_url || null,
    },
    totalQty: item.totalQty,
    totalReceived,
    remainingQty: item.totalQty - totalReceived,
    createdAt: item.createdAt,
  };
});
        return response(
            true,
            200,
            "Purchase list",
            formatted
        );

    } catch (error) {

      

        return catchError(error);

    }
}