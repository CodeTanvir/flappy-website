import { connectDB } from "@/lib/databaseConnection";
import {
  catchError,
  isAuthenticated,
  response,
} from "@/lib/helperFunctions";
import { zSchema } from "@/lib/zodSchema";
import shipmentModel from "@/models/Shipment.model";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

export async function POST(request) {
  try {
    const auth = await isAuthenticated("admin");

    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized");
    }

    await connectDB();

    const formData = await request.formData();

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
        "Invalid or missing fields",
        validate.error
      );
    }

    const files = formData.getAll("documents");

    if (files.length === 0) {
      return response(false, 400, "Please upload at least one document");
    }

    const documentUrls = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const base64 = buffer.toString("base64");

      const dataURI = `data:${file.type};base64,${base64}`;

      const uploaded = await cloudinary.uploader.upload(dataURI, {
        folder: "shipment-documents",
      });

      documentUrls.push(uploaded.secure_url);
    }

    const shipment = await shipmentModel.create({
      ...validate.data,
      documents: documentUrls,
    });

    return response(true, 201, "Shipment created successfully", shipment);
  } catch (error) {
    return catchError(error);
  }
}