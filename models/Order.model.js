import mongoose from "mongoose";
import { customAlphabet } from "nanoid";

// Only uppercase letters + numbers (clean & readable)
const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const generateId = customAlphabet(alphabet, 8);

// Function to generate Order ID
const generateOrderId = () => {
  return `FP-${generateId()}`;
};

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
      required: true,
    },

    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        price: Number,
        quantity: Number,
        variantId: String,
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["cod", "bkash"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    bkash: {
      trxId: String,
      phoneNumber: String,
    },

    shippingAddress: {
      fullName: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
  },
  { timestamps: true }
);

// 🔥 Auto-generate short unique orderId
orderSchema.pre("save", function (next) {
  if (!this.orderId) {
    this.orderId = generateOrderId();
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
