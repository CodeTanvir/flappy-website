import mongoose from "mongoose";

const allocationSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    allocate: {
      type: Number,
      required: true,
    },

  },
  { _id: false }
);

// const purchaseBatchSchema = new mongoose.Schema(
//   {
   

  

//     createdAt: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   { _id: false }
// );

const purchaseSchema = new mongoose.Schema(
  {
    productVariantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariant",
      required: true,
     
      index: true,
    },
     totalQty: {
      type: Number,
      required: true,
    },
 totalCostRMB: {           
      type: Number,
      required: true,
      default: 0,
    },
    totalCostBDT: {           
      type: Number,
      required: true,
      default: 0,
    },
     allocations: {
      type: [allocationSchema],
      required: true,
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: "At least one allocation is required",
      },
    },
  },
  { timestamps: true }
);

const PurchaseModel =
  mongoose.models.Purchase ||
  mongoose.model("Purchase", purchaseSchema);

export default PurchaseModel;