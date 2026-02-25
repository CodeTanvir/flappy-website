import { orderNotification } from "@/email/orderNotification";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import Order from "@/models/Order.model";
import z from "zod";

export async function POST(request) {
  try {
    await connectDB();

    const payload = await request.json();
console.log(payload)
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
      subtotal,
      discount,
      couponDiscountAmount,
      totalAmount,
      paymentMethod,
      bkashPhone,
      trxId,
    } = validatedData;

    const bkash = paymentMethod === "bkash"
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
          products,
          subtotal,
          discount,
          couponDiscountAmount,
          totalAmount,
          paymentMethod,
          bkash,                    // ← correct – nested object
          paymentStatus: "pending",
          // DO NOT pass trxId or bkashPhone here
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

    try{
       const mailData = {
      order_id: order.orderId,
      orderDetailsUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/order-details/${order_id}`
    }
    await sendMail('Order placed successfully', validatedData.email,orderNotification(mailData))
    }catch(error){

    }
   

    return response(true, 201, "Order created successfully");
  } catch (error) {
    console.log(error)
    return catchError(error);
  }
}