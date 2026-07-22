import { connectDB } from "@/lib/databaseConnection";
import {
  catchError,
  isAuthenticated,
  response,
} from "@/lib/helperFunctions";

import StockModel from "@/models/Stock.model";

export async function POST(request) {
  try {
    await connectDB();

    const auth = await isAuthenticated("admin");

    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized");
    }

    const {
      variantId,
      buyingPrice,
      cnWareHouse = 0,
      bdWareHouse = 0,
    } = await request.json();

    if (!variantId) {
      return response(false, 400, "Variant ID is required");
    }

    let stock = await StockModel.findOne({ variantId });

    if (!stock) {
      stock = new StockModel({
        variantId,
        buyingPrice,
        cnWareHouse: 0,
        bdWareHouse: 0,
        inShipment: 0,
      });
    }

    stock.buyingPrice = buyingPrice;

    stock.cnWareHouse += Number(cnWareHouse);
    stock.bdWareHouse += Number(bdWareHouse);

    await stock.save();

    return response(
      true,
      200,
      "Stock added successfully",
      stock
    );

  } catch (error) {
    return catchError(error);
  }
}