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
        w-full
        overflow-hidden
        rounded-xl
        border
        transition-all
        duration-300
        hover:shadow-lg
      "
    >
      <Link href={WEBSITE_PRODUCT_DETAILS(product.slug)}>
        {/* Image Section */}
        <div className="relative aspect-square bg-muted overflow-hidden">
          {discount > 0 && (
            <span className="absolute top-2 left-2 z-10 rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground">
              -{discount}%
            </span>
          )}

          <Image
            src={imageUrl}
            alt={product?.name}
            fill
            sizes="
              (max-width: 640px) 50vw,
              (max-width: 1024px) 33vw,
              20vw
            "
            className="
              object-contain
              p-4
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />
        </div>

        {/* Content */}
        <CardContent className="p-3">
          <p className="truncate text-xs text-muted-foreground">
            {product?.category?.name || "Clothing"}
          </p>

          <h3 className="mt-1 line-clamp-2 min-h-[2rem] text-sm font-medium">
            {product?.name}
          </h3>

          <div className=" flex items-center gap-2 text-xs">
            <span>★★★★★</span>
            <span className="text-muted-foreground">
              {ratingPercentage}%
            </span>
          </div>

          <div className="flex items-center  gap-1 pt-1">
            <span className="font-semibold text-primary">
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
        </CardContent>
      </Link>
    </Card>
  );
}

export default ProductBox;