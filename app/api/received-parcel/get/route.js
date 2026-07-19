import { connectDB } from "@/lib/databaseConnection";
import { catchError, isAuthenticated, response } from "@/lib/helperFunctions";

import PurchaseModel from "@/models/Purchase.model";
import ProductVariantModel from "@/models/ProductVariant.model";
import ProductModel from "@/models/Product.model";
import MediaModel from "@/models/Media.model";
import ReceivedParcelModel from "@/models/ReceivedParcel.model";
import OrderModel from "@/models/Order.model";

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


        /* ========= RECEIVED TOTAL ========= */

    const receivedParcels = await ReceivedParcelModel.find(
  { location: "cn-warehouse" },
  {
    _id:1,
    variantId: 1,
    receivedQty: 1,
  }
).lean();
const receivedMap = new Map(
  receivedParcels.map(parcel => [
    parcel.variantId.toString(),
    {
      _id: parcel._id,
      receivedQty: parcel.receivedQty,
    },
  ])
);
        /* ========= FORMAT ========= */
const formatted = purchases.map(item => {
  const variant = variantMap.get(item._id.toString());

 const received = receivedMap.get(item._id.toString());

const totalReceived = received?.receivedQty || 0;
const receivedParcelId = received?._id || null;

  return {
    
     receivedParcelId,
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