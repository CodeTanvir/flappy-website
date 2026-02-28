"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { showToast } from "@/lib/showToast";
import imgPlaceholder from "@/public/assets/images/img-placeholder.webp";
import { WEBSITE_CART, WEBSITE_CHECKOUT } from "@/routes/WebsiteRoute";
import { removeFromCart } from "@/store/reducer/cartReducer";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsCart2 } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
function Cart() {
  const [open, setOpen] = useState(false);
  const [subtotal, setSubTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const cart = useSelector((store) => store.cartStore);
  const dispatch = useDispatch();
  useEffect(() => {
    const cartProducts = cart.products;
    const totalAmount = cartProducts.reduce(
      (sum, product) => sum + product.sellingPrice * product.qty,
      0,
    );
    const discount = cartProducts.reduce(
      (sum, product) =>
        sum + (product.mrp - product.sellingPrice) * product.qty,
      0,
    );
    setSubTotal(totalAmount);
    setDiscount(discount);
  }, [cart]);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="relative">
        <BsCart2 size={25} className="text-gray-500 hover:text-primary" />
        <span className="absolute bg-red-500 text-white text-xs rounded-full w-4 h-4 flex justify-center items-center -right-2 -top-1">
          {cart.count}
        </span>
      </SheetTrigger>
     <SheetContent className="sm:max-w-[450px] w-full flex flex-col p-0">

  <SheetHeader className="p-4 border-b">
    <SheetTitle className="text-2xl">My Cart</SheetTitle>
  </SheetHeader>

  {/* Scrollable Products */}
  <div className="flex-1 overflow-y-auto px-4 py-3">
    {cart.count === 0 && (
      <div className="h-full flex justify-center items-center text-xl font-semibold">
        Your Cart is Empty
      </div>
    )}

    {cart.products?.map((product) => (
      <div
        key={product.variantId}
        className="flex justify-between items-center gap-4 mb-4 border-b pb-4"
      >
        <div className="flex gap-4 items-center">
          <Image
            src={product?.media || imgPlaceholder.src}
            height={80}
            width={80}
            alt={product.name}
            className="w-20 h-20 rounded border object-cover"
          />
          <div>
            <h4 className="text-base font-medium">{product.name}</h4>
            <p className="text-gray-500 text-sm">
              {product.size}/{product.color}
            </p>
          </div>
        </div>

        <div className="text-right">
          <button
            onClick={() =>
              dispatch(
                removeFromCart({
                  productId: product.productId,
                  variantId: product.variantId,
                }),
              )
            }
            type="button"
            className="text-red-500 text-sm underline mb-1"
          >
            Remove
          </button>

          <p className="font-semibold text-sm">
            {product.qty} ×{" "}
            {product.sellingPrice.toLocaleString("en-BD", {
              style: "currency",
              currency: "BDT",
            })}
          </p>
        </div>
      </div>
    ))}
  </div>

  {/* Fixed Bottom Section */}
  <div className="border-t p-4 space-y-3 bg-white">
    <div className="flex justify-between font-semibold">
      <span>Subtotal</span>
      <span>
        {subtotal.toLocaleString("en-BD", {
          style: "currency",
          currency: "BDT",
        })}
      </span>
    </div>

    <div className="flex justify-between font-semibold">
      <span>Discount</span>
      <span>
        {discount.toLocaleString("en-BD", {
          style: "currency",
          currency: "BDT",
        })}
      </span>
    </div>

    <div className="flex gap-3 pt-2">
      <Button asChild variant="secondary" className="flex-1">
        <Link href={WEBSITE_CART} onClick={() => setOpen(false)}>
          View Cart
        </Link>
      </Button>

      <Button asChild className="flex-1">
        {cart.count ? (
          <Link href={WEBSITE_CHECKOUT} onClick={() => setOpen(false)}>
            Checkout
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => showToast("error", "Your cart is Empty")}
          >
            Checkout
          </button>
        )}
      </Button>
    </div>
  </div>

</SheetContent>
    </Sheet>
  );
}

export default Cart;
