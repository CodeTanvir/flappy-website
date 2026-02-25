import { orderStatus } from "@/lib/utils";
import mongoose from "mongoose";
import { customAlphabet } from "nanoid";

// Generate short unique order ID
const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const nanoid = customAlphabet(alphabet, 8);
const generateOrderId = () => `FP-${nanoid()}`;

// models/Order.model.js — simplified, no duplicates

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      index: true,
     
    },

   

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    district: { type: String, required: true },
    street: { type: String, required: true },
    zipcode: { type: String, required: false },
    ordernote: { type: String, required: false },

   products: {
  type: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      variantId: { type: mongoose.Schema.Types.ObjectId, ref: "ProductVariant", required: true },
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      mrp: { type: Number, required: true },
      sellingPrice: { type: Number, required: true },
      _id: false
    }
  ],
  required: true,
  validate: {
    validator: (arr) => Array.isArray(arr) && arr.length > 0,
    message: 'Order must contain at least one product'
  }
},

    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    couponDiscountAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },

    status: {
      type: String,
      enum: orderStatus,
      default: "unverified",
    },

    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },

    paymentMethod: {
      type: String,
      enum: ["cod", "bkash"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: function () {
        return this.paymentMethod === "cod" ? "pending" : "pending";
      },
    },

    bkash: {
      phoneNumber: { type: String,  },
      trxId: { type: String, },
      
    },
  },
  { timestamps: true }
);

// Only generate one ID
orderSchema.pre("save", async function (next) {
  if (!this.orderId) {
    let isUnique = false;
    while (!isUnique) {
      const newId = generateOrderId();
      const existing = await mongoose.models.Order?.findOne({ orderId: newId });
      if (!existing) {
        this.orderId = newId;
        isUnique = true;
      }
    }
  }
  next();
});

const OrderModel = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default OrderModel;