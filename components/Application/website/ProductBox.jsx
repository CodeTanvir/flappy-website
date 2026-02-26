"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ImagePlaceholder from "@/public/assets/images/img-placeholder.webp";
import { WEBSITE_PRODUCT_DETAILS } from "@/routes/WebsiteRoute";
import { ShoppingBag } from "lucide-react";
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

      const ratingPercentage = ((product?.averageRating / 5) * 100) ?? 0;

  return (
    <Card className="group rounded-2xl border p-2 pb-0
     border-teal-200 hover:shadow-xl transition-all duration-600 overflow-hidden">
      <Link href={WEBSITE_PRODUCT_DETAILS(product.slug)}>
        {/* Image Section */}
        <div className="relative bg-gray-100 p-6 rounded-2xl">
          {discount > 0 && (
            <Badge className="absolute z-10 top-4 left-4 bg-pink-400 text-white rounded-full px-3 py-1">
              -{discount}% off
            </Badge>
          )}

          <Image
            src={imageUrl}
            width={500}
            height={500}
            alt={product?.media?.[0]?.alt || product?.name}
            className="mx-auto object-contain h-[220px] 
            transition-transform duration-1000 group-hover:scale-110"
          />
        </div>

        {/* Content Section */}
        <CardContent className="p-5 space-y-1">
          {/* Category */}
          <p className="text-sm text-muted-foreground">
            {product?.category?.name || "Clothing"}
          </p>

          {/* Product Name */}
          <h3 className="font-semibold text-lg line-clamp-2">
            {product?.name}
          </h3>

          {/* Rating + Discount */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-yellow-500">★★★★★</span>
            <span className="text-muted-foreground">
              {ratingPercentage}%
            </span>
          </div>

          {/* Price Section */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <span className="text-teal-600 font-bold text-lg">
                {product?.sellingPrice?.toLocaleString("en-BD", {
                  style: "currency",
                  currency: "BDT",
                })}
              </span>

              {product?.mrp && (
                <span className="line-through text-gray-400 text-sm">
                  {product?.mrp?.toLocaleString("en-BD", {
                    style: "currency",
                    currency: "BDT",
                  })}
                </span>
              )}
            </div>

            {/* Add to Cart Button */}
            <Button
              size="icon"
              className="rounded-full bg-teal-100 text-teal-700 hover:bg-teal-600 hover:text-white transition"
            >
              <ShoppingBag className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}

export default ProductBox;