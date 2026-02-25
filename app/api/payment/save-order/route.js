import { orderNotification } from "@/email/orderNotification";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import Order from "@/models/Order.model";
import ProductVariantModel from "@/models/ProductVariant.model";
import z from "zod";

export async function POST(request) {
  try {
    await connectDB();

    const payload = await request.json();

    const productSchema = z.object({
      productId: z.string().length(24, "Invalid product id format"),
      variantId: z.string().length(24, "Invalid variant id format"),
      name: z.string().min(3),
      qty: z.number().min(1),
      mrp: z.number().nonnegative(),
      sellingPrice: z.number().nonnegative(),
    });

    const orderSchema = zSchema
      .pick({
        name: true,
        email: true,
        phone: true,
        district: true,
        street: true,
        zipcode: false,
        ordernote: false,
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

    const validate = orderSchema.safeParse(payload);
   
    if (!validate.success) {
      return response(false, 400, "Invalid or missing fields", validate.error);
    }

    const validatedData = validate.data;

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
    } = validatedData;

    // ✅ SECURITY: Verify all products exist and recalculate amounts on server
    // This prevents clients from tampering with prices or quantities
    const verifiedProducts = await Promise.all(
      products.map(async (item) => {
        const variant = await ProductVariantModel.findById(item.variantId)
          .populate("product")
          .lean();

        if (!variant) {
          throw new Error(`Variant ${item.variantId} not found or invalid`);
        }

        // Verify the product data matches database (prevents price tampering)
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

    // ✅ SECURITY: Recalculate all totals on server (don't trust client values)
    const recalculatedSubtotal = verifiedProducts.reduce(
      (sum, product) => sum + product.sellingPrice * product.qty,
      0
    );

    const recalculatedDiscount = verifiedProducts.reduce(
      (sum, product) =>
        sum + (product.mrp - product.sellingPrice) * product.qty,
      0
    );

    // Use server-calculated values, not client values
    const recalculatedTotalAmount =
      recalculatedSubtotal - couponDiscountAmount;

    const bkash =
      paymentMethod === "bkash"
        ? { phoneNumber: bkashPhone, trxId }
        : undefined;

    let order;
    let created = false;

    while (!created) {
      try {
        order = await Order.create({
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
          couponDiscountAmount: couponDiscountAmount,
          totalAmount: recalculatedTotalAmount,
          paymentMethod,
          bkash,
          paymentStatus: "pending",
        });

        created = true;
      } catch (err) {
        if (err.code === 11000) {
          // duplicate orderId → retry with new one
          continue;
        }
        throw err;
      }
    }

    try {
      const mailData = {
        order_id: order.orderId,
        orderDetailsUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/order-details/${order.orderId}`,
      };
      await sendMail(
        "Order placed successfully",
        email,
        orderNotification(mailData)
      );
    } catch (error) {
      console.log("Email sending failed:", error);
    }

    return response(true, 201, "Order created successfully");
  } catch (error) {
    console.log(error);
    return catchError(error);
  }
}