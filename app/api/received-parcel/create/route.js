import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";

import ProductVariantModel from "@/models/ProductVariant.model";
import ReceivedParcelModel from "@/models/ReceivedParcel.model";

export async function POST(request) {
    try {

        await connectDB();

        const {
            variantId,
            receivedQty,
            note
        } = await request.json();

        if (!variantId) {
            return response(false, 400, "Variant is required");
        }

        if (!receivedQty || receivedQty <= 0) {
            return response(false, 400, "Invalid quantity");
        }

        const variant = await ProductVariantModel.findById(variantId);

        if (!variant) {
            return response(false, 404, "Variant not found");
        }

        const receivedParcel = await ReceivedParcelModel.create({

            variantId,

            receivedQty,

            note

        });

        return response(
            true,
            201,
            "Parcel received successfully",
            receivedParcel
        );

    } catch (error) {

        return catchError(error);

    }
}