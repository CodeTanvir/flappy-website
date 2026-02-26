"use client";
import { ButtonLoading } from "@/components/Application/ButtonLoading";
import CheckoutLoading from "@/components/Application/CheckoutLoading";
import Payment from "@/components/Application/website/Payment";
import WebsiteBreadcrumb from "@/components/Application/website/WebsiteBreadcrumb";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/useFetch";
import { showToast } from "@/lib/showToast";
import { zSchema } from "@/lib/zodSchema";
import {
  WEBSITE_ORDER_DETAILS,
  WEBSITE_PRODUCT_DETAILS,
  WEBSITE_SHOP,
} from "@/routes/WebsiteRoute";
import { addIntoCart, clearCart } from "@/store/reducer/cartReducer";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaShippingFast } from "react-icons/fa";
import { IoCloseCircleSharp } from "react-icons/io5";
import { MdMyLocation } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import z from "zod";

const breadCrumb = {
  title: "Checkout",
  links: [{ label: "Chekcout" }],
};

function Checkout() {
  const cart = useSelector((store) => store.cartStore);
  const auth = useSelector((store) => store.authStore);
  const router = useRouter();
  const dispatch = useDispatch();
  const [verifiedCartData, setVerifiedCartData] = useState([]);

  const {
    data: getVerifiedCartData,
    loading,
    error,
  } = useFetch("/api/cart-verification", "POST", {
    data: cart.products,
  });

  const [subtotal, setSubTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [couponDiscountAmount, setCouponDiscountAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [gettingLocation, setGettingLocation] = useState(false);

  // Use cart.products as the source of truth for verified cart data
  // This ensures products persist after page reload since Redux is persisted to localStorage
  const displayCartData =
    verifiedCartData.length > 0 ? verifiedCartData : cart.products;

  useEffect(() => {
    if (getVerifiedCartData && getVerifiedCartData.success) {
      const cartData = getVerifiedCartData.data;

      setVerifiedCartData(cartData);
      dispatch(clearCart());

      cartData.forEach((cartItem) => {
        dispatch(addIntoCart(cartItem));
      });
    }
  }, [dispatch, error, getVerifiedCartData]);

  useEffect(() => {
    const cartProducts = cart.products;
    const subTotalAmount = cartProducts.reduce(
      (sum, product) => sum + product.sellingPrice * product.qty,
      0,
    );
    const discount = cartProducts.reduce(
      (sum, product) =>
        sum + (product.mrp - product.sellingPrice) * product.qty,
      0,
    );
    setSubTotal(subTotalAmount);
    setDiscount(discount);
    setTotalAmount(subTotalAmount);
    couponForm.setValue("minShoppingAmount", subTotalAmount);
  }, [cart]);

  const couponFormSchema = zSchema.pick({
    code: true,
    minShoppingAmount: true,
  });
  const couponForm = useForm({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      code: "",
      minShoppingAmount: subtotal,
    },
  });

  const applyCoupon = async (values) => {
    setCouponLoading(true);
    try {
      const { data: response } = await axios.post("/api/coupon/apply", values);
      if (!response.success) {
        throw new Error(response.message);
      }
      const discountPercentage = response.data.discountPercentage;
      setCouponDiscountAmount((subtotal * discountPercentage) / 100);
      setTotalAmount(subtotal - (subtotal * discountPercentage) / 100);
      setIsCouponApplied(true);
      showToast("success", response.message);
      setCouponCode(couponForm.getValues("code"));
      couponForm.resetField("code", "");
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setCouponLoading(false);
    }
  };
  const removeCoupon = () => {
    setIsCouponApplied(false);
    setCouponCode("");
    setCouponDiscountAmount(0);
    setTotalAmount(subtotal);
  };

  const handleGetLocation = () => {
    setGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            );
            const data = await response.json();
            const address = data.address || {};
            const street =
              `${data.name || ""} ${address.road || ""} ${address.village || ""} ${address.town || ""}`.trim();
            orderForm.setValue("street", street);
            showToast("success", "Location fetched successfully");
          } catch (error) {
            showToast("error", "Failed to fetch address from coordinates");
          } finally {
            setGettingLocation(false);
          }
        },
        (error) => {
          showToast("error", error.message || "Failed to get location");
          setGettingLocation(false);
        },
      );
    } else {
      showToast("error", "Geolocation is not supported by this browser");
      setGettingLocation(false);
    }
  };
  //place order
  const orderFormSchema = zSchema
    .pick({
      name: true,
      email: true,
      phone: true,
      district: true,
      street: true,
    })
    .extend({
      paymentMethod: z.enum(["cod", "bkash"]),
      userId: z.string().optional(),
      bkashPhone: z.string().optional(),
      trxId: z.string().optional(),
      zipcode: z.string().optional(),
      ordernote: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.paymentMethod === "bkash") {
        if (!data.bkashPhone) {
          ctx.addIssue({
            code: "custom",
            path: ["bkashPhone"],
            message: "bkash phone number is required",
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
  const orderForm = useForm({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      paymentMethod: "cod",
      name: "",
      email: "",
      phone: "",
      district: "",
      street: "",
      zipcode: "",
      ordernote: "",
      userId: auth?.auth?._id,
    },
  });

  useEffect(() => {
    orderForm.setValue("paymentMethod", paymentMethod);
  }, [orderForm, paymentMethod]);

  // get order id by payment
  // const getOrderId = async (amount) => {
  //   try {
  //     const { data: orderIdData } = await axios.post(
  //       "/api/payment/get-order-id",
  //       { amount },
  //     );
  //     if (!orderIdData.success) {
  //       throw new Error(orderIdData.data);
  //     }
  //     return { success: true, order_id: orderIdData.data };
  //   } catch (error) {
  //     return { success: false, message: error.message };
  //   }
  // };

  //place holder action
  const placeOrder = async (formData) => {
    setSavingOrder(true);
    setPlacingOrder(true);
    try {
      const products = displayCartData.map((cartItem) => ({
        productId: cartItem.productId,
        variantId: cartItem.variantId,
        name: cartItem.name,
        qty: cartItem.qty,
        mrp: cartItem.mrp,
        sellingPrice: cartItem.sellingPrice,
      }));
      const { data: paymentResponseData } = await axios.post(
        "/api/payment/save-order",
        {
          ...formData,
          userId: auth?.auth?._id || undefined,
          products: products,
          subtotal: subtotal,
          discount: discount,
          couponDiscountAmount: couponDiscountAmount,
          totalAmount: totalAmount,
        },
      );
      // const generateOrderId = await getOrderId(totalAmount);
      if (paymentResponseData.success) {
        showToast("success", paymentResponseData.message);
        dispatch(clearCart());
        orderForm.reset();

        router.push(WEBSITE_ORDER_DETAILS(paymentResponseData.data.orderId));
        setSavingOrder(false);
      }
    } catch (error) {
      showToast("error", error.message);
      setSavingOrder(false);
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div>
      {savingOrder && (
        <div className="h-screen w-screen fixed top-0 left-0 flex justify-center items-center z-50">
          <CheckoutLoading />
        </div>
      )}
      <WebsiteBreadcrumb props={breadCrumb} />
      {cart.count === 0 ? (
        <div className="w-screen h-[500px] flex justify-center items-center py-32">
          <div className="text-center">
            <h4 className="text-4xl font-semibold mb-6">Your cart is empty!</h4>

            <Button type="button" asChild>
              <Link href={WEBSITE_SHOP}>Continue Shopping</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex lg:flex-nowrap flex-wrap gap-10 my-20 lg:px-32 px-4">
          <div className="lg:w-[60%] w-full">
            <div>
              <FaShippingFast size={25} /> Shipping Address:
            </div>
            <div className="mt-5">
              <Form {...orderForm}>
                <form
                  className="grid grid-cols-2 gap-5"
                  onSubmit={orderForm.handleSubmit(placeOrder)}
                >
                  <div className="mb-3">
                    <FormField
                      name="name"
                      control={orderForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="Enter your name*" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    ></FormField>
                  </div>
                  <div className="mb-3">
                    <FormField
                      name="email"
                      control={orderForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="Enter your email address*"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    ></FormField>
                  </div>
                  <div className="mb-3">
                    <FormField
                      type="tel"
                      name="phone"
                      control={orderForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder=" phone number*" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    ></FormField>
                  </div>
                  <div className="mb-3">
                    <FormField
                      name="district"
                      control={orderForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter your district name*"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    ></FormField>
                  </div>
                  <div className="mb-3">
                    <FormField
                      name="street"
                      control={orderForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                placeholder="Enter your street/village address*"
                              />
                              <button
                                type="button"
                                onClick={handleGetLocation}
                                disabled={gettingLocation}
                                className="absolute right-0 top-1/2 -translate-y-1/2 p-2
                                 text-gray-500 hover:text-blue-600 
                                 disabled:opacity-50 bg-gray-100
                                 disabled:cursor-not-allowed transition-colors"
                                title="Get current location"
                              >
                                <MdMyLocation size={20} />
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    ></FormField>
                  </div>
                  <div className="mb-3">
                    <FormField
                      name="zipcode"
                      control={orderForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="Enter zipcode" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    ></FormField>
                  </div>

                  <div className="mb-3 col-span-2">
                    <FormField
                      name="ordernote"
                      control={orderForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Enter your Order Note"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    ></FormField>
                  </div>
                  <div className="mb-3 col-span-2">
                    <Payment
                      paymentMethod={paymentMethod}
                      setPaymentMethod={setPaymentMethod}
                      register={orderForm.register}
                      errors={orderForm.formState.errors}
                    />
                  </div>

                  <div className="mb-3">
                    <ButtonLoading
                      loading={placingOrder}
                      type="submit"
                      text="Place Order"
                      className="bg-black rounded-full px-5 cursor-pointer"
                    />
                  </div>
                </form>
              </Form>
            </div>
          </div>
          <div className="lg:w-[40%] w-full">
            <div className="rounded bg-gray-50 p-5 sticky top-5">
              <h4 className="text-lg font-semibold mb-5">Order Summary</h4>
              <div>
                <table className="w-full border">
                  <tbody>
                    {displayCartData &&
                      displayCartData?.map((product) => (
                        <tr key={product.variantId}>
                          <td className="p-3">
                            <div className="flex items-center gap-5">
                              <Image
                                src={product.media}
                                width={60}
                                height={60}
                                alt={product.name}
                                className="rounded"
                              />
                              <div>
                                <h4 className="font-medium line-clamp-1">
                                  <Link
                                    href={WEBSITE_PRODUCT_DETAILS(product.url)}
                                  >
                                    {product.name}
                                  </Link>
                                </h4>
                                <p className="text-sm">
                                  Color: {product.color}
                                </p>

                                <p className="text-sm">Size: {product.size}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <p>
                              {product.qty} x{" "}
                              {product.sellingPrice.toLocaleString("en-BD", {
                                style: "currency",
                                currency: "BDT",
                              })}
                            </p>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="font-medium py-2">Subtotal</td>
                      <td className="text-end py-2">
                        {subtotal.toLocaleString("en-BD", {
                          style: "currency",
                          currency: "BDT",
                        })}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-medium py-2">Discount</td>
                      <td className="text-end py-2">
                        -{" "}
                        {discount.toLocaleString("en-BD", {
                          style: "currency",
                          currency: "BDT",
                        })}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-medium py-2"> Coupon Discount</td>
                      <td className="text-end py-2">
                        {" "}
                        -{" "}
                        {couponDiscountAmount.toLocaleString("en-BD", {
                          style: "currency",
                          currency: "BDT",
                        })}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-medium py-2 text-xl">Total</td>
                      <td className="text-end py-2">
                        {totalAmount.toLocaleString("en-BD", {
                          style: "currency",
                          currency: "BDT",
                        })}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="mt-2 mb-5">
                  {!isCouponApplied ? (
                    <Form {...couponForm}>
                      <form
                        className="flex justify-between gap-5"
                        onSubmit={couponForm.handleSubmit(applyCoupon)}
                      >
                        <div className="w-[calc(100%-100px)]">
                          <FormField
                            name="code"
                            control={couponForm.control}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Enter coupon code"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          ></FormField>
                        </div>
                        <div className="w-[100px]">
                          <ButtonLoading
                            type="submit"
                            text="Apply"
                            className="w-full"
                            loading={couponLoading}
                          />
                        </div>
                      </form>
                    </Form>
                  ) : (
                    <div className="flex justify-between py-1 px-5 rounded-lg bg-gray-200">
                      <div>
                        <span className="text-xs">Coupon:</span>
                        <p className="text-sm font-semibold">{couponCode}</p>
                      </div>
                      <button
                        onClick={removeCoupon}
                        type="button"
                        className="text-red-500 cursor-pointer"
                      >
                        <IoCloseCircleSharp size={25} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
     
    </div>
  );
}



export default Checkout;
