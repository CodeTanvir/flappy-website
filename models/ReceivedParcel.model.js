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
    location:{
    type:String,
    enum:["cn-warehouse","bd-warehouse"],
    default:"cn-warehouse"
  }
  },
  
  {
    timestamps: true,
  }
);

const ReceivedParcelModel =
  mongoose.models.ReceivedParcel ||
  mongoose.model("ReceivedParcel", receivedParcelSchema);

export default ReceivedParcelModel;