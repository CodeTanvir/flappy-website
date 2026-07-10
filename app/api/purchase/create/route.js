import { getCNYtoBDTRate } from "@/app/services/apiExchangeRate";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";

import { allocatePurchase } from "@/lib/AllocatePurchase";
import PurchaseModel from "@/models/Purchase.model";
import StockModel from "@/models/Stock.model";

export async function POST(request) {
  try {
    await connectDB();

    const {
      productVariantId,
      totalQty,
      totalCost,
      totalRemaining,
    } = await request.json();

    // Validation
    if (
      !productVariantId ||
      totalQty == null ||
      totalCost == null ||
      totalRemaining == null
    ) {
      return response(false, 400, "Missing required fields");
    }

    // CNY -> BDT
    const rate = await getCNYtoBDTRate();
    const totalCostBDT = Number((Number(totalCost) * rate).toFixed(2));

    // Create Purchase
    const purchase = await PurchaseModel.create({
      productVariantId,
      totalQty: Number(totalQty),
      totalCostRMB: Number(totalCost),
      totalCostBDT,
    });

    // Allocate Purchase
    await allocatePurchase(
      purchase._id,
      productVariantId,
      Number(totalQty)
    );

    // Store extra quantity in Stock
    if (Number(totalQty) > Number(totalRemaining)) {
      const extraQty = Number(totalQty) - Number(totalRemaining);

      await StockModel.findOneAndUpdate(
        {
          variantId: productVariantId,
        },
        {
          $inc: {
            stock: extraQty,
          },
          $set: {
            buyingPrice: Number(totalCost) / Number(totalQty),
            status: "cn"
          },
        },
        {
          upsert: true,
          new: true,
        }
      );
    }

    return response(
      true,
      201,
      "Purchase saved successfully",
      purchase
    );
  } catch (error) {
    console.error(error);
    return catchError(error);
  }
}