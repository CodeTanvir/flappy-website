import mongoose from "mongoose";

const receivedParcelSchema = new mongoose.Schema(
  {
    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariant",
      required: true,
    },

    receivedQty: {
      type: Number,
      required: true,
    },

    note: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const ReceivedParcelModel =
  mongoose.models.ReceivedParcel ||
  mongoose.model("ReceivedParcel", receivedParcelSchema);

export default ReceivedParcelModel;