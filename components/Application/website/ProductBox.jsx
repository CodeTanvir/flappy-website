"use client";

import { Card, CardContent } from "@/components/ui/card";
import ImagePlaceholder from "@/public/assets/images/img-placeholder.webp";
import { WEBSITE_PRODUCT_DETAILS } from "@/routes/WebsiteRoute";
import Image from "next/image";
import Link from "next/link";

function ProductBox({ product }) {
  const imageUrl = product?.media?.[0]?.secure_url || ImagePlaceholder;

  const discount =
    product?.mrp && product?.sellingPrice
      ? Math.round(
          ((product.mrp - product.sellingPrice) / product.mrp) * 100
        )
      : 0;

  const ratingPercentage = product?.averageRating
    ? Math.round((product.averageRating / 5) * 100)
    : 0;

  return (
    <Card
      className="group rounded-2xl border p-2 pb-0 border-teal-200 hover:shadow-xl transition-all duration-600 overflow-hidden"
    >
      <Link href={WEBSITE_PRODUCT_DETAILS(product.slug)}>
        {/* Image Section */}
        <div className="relative bg-gray-100 p-4 sm:p-6 rounded-2xl">
          {discount > 0 && (
            <span
              className="
              absolute
              top-2 left-2
              bg-pink-500
              text-white
              text-sm
              sm:text-sm
              rounded-2xl
              px-2 py-1
              z-10
         
            "
            >
              -{discount}% off
            </span>
          )}

          <Image
            src={imageUrl}
            width={500}
            height={500}
            alt={product?.name}
            className="
              mx-auto
              object-contain
              h-[140px]
              sm:h-[200px]
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />
        </div>

        {/* Content Section */}
        <CardContent className="p-3 sm:p-5 space-y-1">
          {/* Category */}
          <p className="text-xs sm:text-sm text-muted-foreground truncate">
            {product?.category?.name || "Clothing"}
          </p>

          {/* Product Name */}
          <h3 className="font-semibold text-sm sm:text-base  min-h-[20px]">
            {product?.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span className="text-yellow-500 text-xs sm:text-sm">
              ★★★★★
            </span>
            <span className="text-muted-foreground">
              {ratingPercentage}%
            </span>
          </div>

          {/* Price Section */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className="text-teal-600 font-bold text-sm sm:text-lg">
                {product?.sellingPrice?.toLocaleString("en-BD", {
                  style: "currency",
                  currency: "BDT",
                })}
              </span>

              {product?.mrp && (
                <span className="line-through text-gray-400 text-xs sm:text-sm">
                  {product?.mrp?.toLocaleString("en-BD", {
                    style: "currency",
                    currency: "BDT",
                  })}
                </span>
              )}
            </div>

            {/* Add to Cart Button */}
            {/* <Button
              size="icon"
              className="
                h-8 w-8 sm:h-10 sm:w-10
                rounded-full
                bg-teal-100
                text-teal-700
                hover:bg-teal-600
                hover:text-white
                transition
              "
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button> */}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}

export default ProductBox;