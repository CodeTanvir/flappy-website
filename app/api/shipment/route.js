import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunctions";
import ShipmentModel from "@/models/Shipment.model";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const auth = await isAuthenticated("admin");

    if (!auth.isAuth) {
      return NextResponse.json({
        success: false,
        statusCode: 403,
        message: "Unauthorized",
      });
    }

    await connectDB();

    const searchParams = request.nextUrl.searchParams;

    const start = Number(searchParams.get("start")) || 0;
    const size = Number(searchParams.get("size")) || 10;
    const deleteType = searchParams.get("deleteType");

    const filter = {
      deletedAt:
        deleteType === "PD"
          ? { $ne: null }
          : null,
    };

    const [data, totalRowCount] = await Promise.all([
      ShipmentModel.find(
        filter,
        {
          _id: 1,
          date: 1,
          city: 1,
          name: 1,
          totalWeight: 1,
        }
      )
        .sort({ createdAt: -1 })
        .skip(start)
        .limit(size)
        .lean(),

      ShipmentModel.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      statusCode: 200,
      message: "Shipment List",

      // IMPORTANT
      data,

      // IMPORTANT
      meta: {
        totalRowCount,
      },
    });
  } catch (error) {
    return catchError(error);
  }
}