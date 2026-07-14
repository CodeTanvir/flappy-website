import { connectDB } from "@/lib/databaseConnection";
import { catchError, isAuthenticated, response } from "@/lib/helperFunctions";

import PurchaseModel from "@/models/Purchase.model";
import ProductVariantModel from "@/models/ProductVariant.model";
import ProductModel from "@/models/Product.model";
import MediaModel from "@/models/Media.model";
import ReceivedParcelModel from "@/models/ReceivedParcel.model";

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
      totalCostRMB: { $sum: "$totalCostRMB" },
      totalCostBDT: { $sum: "$totalCostBDT" },
      purchaseIds: { $push: "$_id" },
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

       const receivedTotals = await ReceivedParcelModel.aggregate([

    {
        $lookup: {
            from: "purchases",
            localField: "purchaseId",
            foreignField: "_id",
            as: "purchase"
        }
    },

    {
        $unwind: "$purchase"
    },

    {
        $group: {

            _id: "$purchase.productVariantId",

            totalReceived: {
                $sum: "$receivedQty"
            }

        }
    }

]);

const receivedMap = new Map();

receivedTotals.forEach(item => {

    receivedMap.set(
        item._id.toString(),
        item.totalReceived
    );

});

        /* ========= FORMAT ========= */

        const formatted = purchases.map(item => {

    const variant = variantMap.get(item._id.toString());

    const totalReceived =
        receivedMap.get(item._id.toString()) || 0;

    return {

        variantId: item._id,

        purchaseIds: item.purchaseIds,

        product: {

            name: variant?.product?.name || "Unnamed Product",

            slug: variant?.product?.slug || null,

            color: variant?.color || "-",

            size: variant?.size || "-",

            image: variant?.media?.[0]?.secure_url || null

        },

        totalQty: item.totalQty,

        totalCostRMB: item.totalCostRMB,

        totalCostBDT: item.totalCostBDT,

        avgPriceRMB:
            item.totalQty
                ? Number((item.totalCostRMB / item.totalQty).toFixed(2))
                : 0,

        totalReceived,

        remainingQty:
            item.totalQty - totalReceived,

        createdAt: item.createdAt

    };

});

        return response(
            true,
            200,
            "Purchase list",
            formatted
        );

    } catch (error) {

        console.log(error);

        return catchError(error);

    }
}