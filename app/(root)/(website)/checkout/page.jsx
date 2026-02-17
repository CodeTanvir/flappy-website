"use client";
import { ButtonLoading } from "@/components/Application/ButtonLoading";
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
import { WEBSITE_PRODUCT_DETAILS, WEBSITE_SHOP } from "@/routes/WebsiteRoute";
import { addIntoCart, clearCart } from "@/store/reducer/cartReducer";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaShippingFast } from "react-icons/fa";
import { IoCloseCircleSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import z from "zod";

const breadCrumb = {
  title: "Checkout",
  links: [{ label: "Chekcout" }],
};

function Checkout() {
  const cart = useSelector((store) => store.cartStore);
  const auth = useSelector((store) => store.authStore);
  const dispatch = useDispatch();
  const [verifiedCartData, setVerifiedCartData] = useState([]);
  const { data: getVerifiedCartData } = useFetch(
    "/api/cart-verification",
    "POST",
    {
      data: cart.products,
    },
  );
  const [subtotal, setSubTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [couponDiscountAmount, setCouponDiscountAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  useEffect(() => {
    if (getVerifiedCartData && getVerifiedCartData.success) {
      const cartData = getVerifiedCartData.data;
      setVerifiedCartData(cartData);
      dispatch(clearCart());

      cartData.forEach((cartItem) => {
        dispatch(addIntoCart(cartItem));
      });
    }
  }, [dispatch, getVerifiedCartData]);
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
  //place order
  const orderFormSchema = zSchema
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
    });
  const orderForm = useForm({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      district: "",
      street: "",
      zipcode: "",
      ordernote: "",
      userId: auth?._id,
    },
  });
  const placeOrder = async (formData) => {
    setPlacingOrder(true);
    try {
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setPlacingOrder(false);
    }
  };
  return (
    <div>
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
                      name="phne"
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
                            <Input
                              {...field}
                              placeholder="Enter your street/village address*"
                            />
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
                            <Input placeholder="Enter zipcode" />
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
                            <Textarea placeholder="Enter your Order Note" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    ></FormField>
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
                    {verifiedCartData &&
                      verifiedCartData?.map((product) => (
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
