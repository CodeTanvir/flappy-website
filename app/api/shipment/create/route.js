import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

import { connectDB } from "@/lib/databaseConnection";
import {
  catchError,
  isAuthenticated,
  response,
} from "@/lib/helperFunctions";
import { zSchema } from "@/lib/zodSchema";

import ShipmentModel from "@/models/Shipment.model";
import ShipmentAllocationModel from "@/models/ShipmentAllocation.model";
import StockModel from "@/models/Stock.model";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

export async function POST(request) {
  const session = await mongoose.startSession();
 const uploadedImages = [];
  try {
    const auth = await isAuthenticated("admin");

    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized");
    }

    await connectDB();

    const formData = await request.formData();

    const allocation = JSON.parse(
      formData.get("allocation") || "{}"
    );

    const payload = {
      shipmentType: formData.get("shipmentType"),
      date: formData.get("date"),
      costPerWeight: Number(formData.get("costPerWeight")),
      totalWeight: Number(formData.get("totalWeight")),
      additionalCost: Number(formData.get("additionalCost") || 0),
      city: formData.get("city"),
      name: formData.get("name"),
      phoneNumber: formData.get("phoneNumber"),
    };

    const schema = zSchema.pick({
      shipmentType: true,
      date: true,
      costPerWeight: true,
      totalWeight: true,
      additionalCost: true,
      city: true,
      name: true,
      phoneNumber: true,
    });

    const validate = schema.safeParse(payload);

    if (!validate.success) {
      return response(
        false,
        400,
        "Invalid fields",
        validate.error
      );
    }

    if (Object.keys(allocation).length === 0) {
      return response(false, 400, "No products selected");
    }

    const files = formData.getAll("documents");

    if (!files.length) {
      return response(false, 400, "Upload shipment documents");
    }

    // --------------------------
    // Validate stock first
    // --------------------------

    const variantIds = Object.keys(allocation);

    const stocks = await StockModel.find({
      variantId: { $in: variantIds },
    }).lean();

    const stockMap = new Map();

    stocks.forEach((stock) => {
      stockMap.set(stock.variantId.toString(), stock);
    });

    for (const [variantId, qty] of Object.entries(allocation)) {
      const sendQty = Number(qty);

      if (sendQty <= 0) {
        return response(false, 400, "Invalid quantity");
      }

      const stock = stockMap.get(variantId);

      if (!stock) {
        return response(false, 400, "Stock not found");
      }

      if (stock.cnWareHouse < sendQty) {
        return response(
          false,
          400,
          "Insufficient China warehouse stock"
        );
      }
    }

    // --------------------------
    // Upload documents
    // --------------------------

   

    for (const file of files) {
      const bytes = await file.arrayBuffer();

      const buffer = Buffer.from(bytes);

      const uploaded = await cloudinary.uploader.upload(
        `data:${file.type};base64,${buffer.toString("base64")}`,
        {
          folder: "shipment-documents",
        }
      );

      uploadedImages.push(uploaded);
    }

    const documentUrls = uploadedImages.map(
      (item) => item.secure_url
    );

    // --------------------------
    // Transaction starts
    // --------------------------

    session.startTransaction();

    const shipment = await ShipmentModel.create(
      [
        {
          ...validate.data,
          documents: documentUrls,
        },
      ],
      { session }
    );

    const shipmentId = shipment[0]._id;

  const products = [];

for (const [variantId, qty] of Object.entries(allocation)) {
  products.push({
    variantId,
    qty: Number(qty),
  });
}
if (products.length === 0) {
  throw new Error("No products selected.");
}
await ShipmentAllocationModel.create(
  [
    {
      shipmentId,
      products,
    },
  ],
  { session }
);
    for (const [variantId, qty] of Object.entries(allocation)) {
     const result = await StockModel.updateOne(
  {
    variantId,
    cnWareHouse: { $gte: Number(qty) },
  },
  {
    $inc: {
      cnWareHouse: -Number(qty),
      inShipment: Number(qty),
    },
  },
  { session }
);

if (result.modifiedCount !== 1) {
  throw new Error("Insufficient stock.");
}
    }

    await session.commitTransaction();

    session.endSession();

    return response(
      true,
      201,
      "Shipment created successfully",
      shipment[0]
    );
  } catch (error) {

  if (session.inTransaction()) {
    await session.abortTransaction();
  }

  // Delete uploaded images if anything fails
  if (uploadedImages.length > 0) {

    await Promise.allSettled(

      uploadedImages.map((image) =>
        cloudinary.uploader.destroy(
          image.public_id
        )
      )

    );

  }

  session.endSession();

  return catchError(error);
}
}