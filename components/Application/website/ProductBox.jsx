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
      className="
        group
        rounded-2xl
        border
        border-border
        bg-card
        p-2 pb-0
        hover:shadow-xl
        transition-all
        duration-500
        overflow-hidden
      "
    >
      <Link href={WEBSITE_PRODUCT_DETAILS(product.slug)}>
        {/* Image Section */}
        <div className="relative bg-muted p-4 sm:p-6 rounded-2xl">
          {discount > 0 && (
            <span
              className="
                absolute
                top-2 left-2
                bg-primary
                text-primary-foreground
                text-xs sm:text-sm
                rounded-xl
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
        <CardContent className="p-3 sm:p-5 space-y-2">
          {/* Category */}
          <p className="text-xs sm:text-sm text-muted-foreground truncate">
            {product?.category?.name || "Clothing"}
          </p>

          {/* Product Name */}
          <h3 className="font-semibold text-sm sm:text-base min-h-[20px] text-foreground">
            {product?.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span className="text-foreground">
              ★★★★★
            </span>
            <span className="text-muted-foreground">
              {ratingPercentage}%
            </span>
          </div>

          {/* Price Section */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className="text-primary font-semibold text-sm sm:text-lg">
                {product?.sellingPrice?.toLocaleString("en-BD", {
                  style: "currency",
                  currency: "BDT",
                })}
              </span>

              {product?.mrp && (
                <span className="line-through text-muted-foreground text-xs sm:text-sm">
                  {product?.mrp?.toLocaleString("en-BD", {
                    style: "currency",
                    currency: "BDT",
                  })}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}

export default ProductBox;