import { orderNotification } from "@/email/orderNotification";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import OrderModel from "@/models/Order.model";
import ProductVariantModel from "@/models/ProductVariant.model";
import z from "zod";

export async function POST(request) {
  console.log(request)
  try {
    await connectDB();

    const payload = await request.json();

    // Product item schema (single cart item)
    const productSchema = z.object({
      productId: z.string().length(24, "Invalid product id format"),
      variantId: z.string().length(24, "Invalid variant id format"),
      name: z.string().min(3),
      qty: z.number().min(1),
      mrp: z.number().nonnegative(),
      sellingPrice: z.number().nonnegative(),
    });

    // Main order schema
    const orderSchema = zSchema
      .pick({
        name: true,
        email: true,
        phone: true,
        district: true,
        street: true,
        zipcode: true,
        ordernote: true,
      })
      .extend({
        userId: z.string().optional(),
        subtotal: z.number().nonnegative(),
        discount: z.number().nonnegative(),
        couponDiscountAmount: z.number().nonnegative(),
        totalAmount: z.number(),
        products: z.array(productSchema),
        paymentMethod: z.enum(["cod", "bkash"]),
        bkashPhone: z.string().optional(),
        trxId: z.string().optional(),
      })
      .superRefine((data, ctx) => {
        if (data.paymentMethod === "bkash") {
          if (!data.bkashPhone) {
            ctx.addIssue({
              code: "custom",
              path: ["bkashPhone"],
              message: "bKash phone number is required",
            });
          }
          if (!data.trxId) {
            ctx.addIssue({
              code: "custom",
              path: ["trxId"],
              message: "Transaction ID is required",
            });
          }
        }
      });

    const validation = orderSchema.safeParse(payload);

    if (!validation.success) {
      return response(false, 400, "Invalid or missing fields", validation.error);
    }

    const {
      userId,
      name,
      email,
      phone,
      district,
      street,
      zipcode,
      ordernote,
      products,
      couponDiscountAmount,
      paymentMethod,
      bkashPhone,
      trxId,
    } = validation.data;

    // ────────────────────────────────────────────────
    // SECURITY: Server-side product & price verification
    // ────────────────────────────────────────────────
    const verifiedProducts = await Promise.all(
      products.map(async (item) => {
        const variant = await ProductVariantModel.findById(item.variantId).populate(
          "product"
        );

        if (!variant) {
          throw new Error(`Variant ${item.variantId} not found or invalid`);
        }

        // Prevent price tampering
        if (variant.mrp !== item.mrp || variant.sellingPrice !== item.sellingPrice) {
          throw new Error(
            `Price mismatch for ${item.name}. Possible tampering detected.`
          );
        }

        return {
          productId: variant.product._id,
          variantId: variant._id,
          name: variant.product.name,
          qty: item.qty,
          mrp: variant.mrp,
          sellingPrice: variant.sellingPrice,
        };
      })
    );

    // Recalculate everything on server — never trust client
    const recalculatedSubtotal = verifiedProducts.reduce(
      (sum, p) => sum + p.sellingPrice * p.qty,
      0
    );

    const recalculatedDiscount = verifiedProducts.reduce(
      (sum, p) => sum + (p.mrp - p.sellingPrice) * p.qty,
      0
    );

    let recalculatedTotalAmount = recalculatedSubtotal - couponDiscountAmount;
if(paymentMethod === 'bkash'){
  recalculatedTotalAmount = Math.round((recalculatedSubtotal - couponDiscountAmount) * 0.9)
}
    const bkash =
      paymentMethod === "bkash"
        ? { phoneNumber: bkashPhone, trxId }
        : undefined;

    // ────────────────────────────────────────────────
    // Create order (with retry on duplicate orderId)
    // ────────────────────────────────────────────────
    let order;
    let created = false;

    while (!created) {
      try {
        order = await OrderModel.create({
          userId,
          name,
          email,
          phone,
          district,
          street,
          zipcode,
          ordernote,
          products: verifiedProducts,
          subtotal: recalculatedSubtotal,
          discount: recalculatedDiscount,
          couponDiscountAmount,
          totalAmount: recalculatedTotalAmount,
          paymentMethod,
          bkash,
          paymentStatus: "pending",
        });

        created = true;
      } catch (err) {
        if (err.code === 11000) {
          // Duplicate key (orderId) → retry
          continue;
        }
        throw err;
      }
    }

    // ────────────────────────────────────────────────
    // Send confirmation email (fire-and-forget)
    // ────────────────────────────────────────────────
    try {
      const mailData = {
        order_id: order.orderId,
        orderDetailsUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/order-details/${order.orderId}`,
      };

      await sendMail(
        "Order placed successfully",
        email,
        orderNotification(mailData) // assuming this function exists
      );
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr);
      // Still return success — email failure shouldn't fail the order
    }

    return response(true, 201, "Order created successfully", {
      orderId: order.orderId,
    });
  } catch (error) {
    console.log(error)
    return catchError(error);
  }
}