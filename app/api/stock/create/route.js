// app/api/stock/create/route.js

import { connectDB } from "@/lib/databaseConnection";
import {
  catchError,
  isAuthenticated,
  response,
} from "@/lib/helperFunctions";

import StockModel from "@/models/Stock.model";

export async function POST(request) {
  try {
    const auth = await isAuthenticated("admin");

    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized");
    }

    await connectDB();

    const {
      variantId,
      buyingPrice,
      receivedQty,
      location,
    } = await request.json();

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

    if (location === "cn-warehouse") {
      stock.cnWareHouse += Number(receivedQty);
    }

    if (location === "bd-warehouse") {
      stock.bdWareHouse += Number(receivedQty);
    }

    await stock.save();

    return response(
      true,
      200,
      "Stock updated successfully",
      stock
    );
  } catch (error) {
    return catchError(error);
  }
}