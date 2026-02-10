"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ImagePlaceholder from "@/public/assets/images/img-placeholder.webp";
import { WEBSITE_PRODUCT_DETAILS, WEBSITE_SHOP } from "@/routes/WebsiteRoute";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

function ProductDetails({ product, variant, colors, sizes, reviewCount }) {
  const [activeThumb, setActiveThumb] = useState();
  console.log(variant);
  useEffect(() => {
    setActiveThumb(variant?.media[0].secure_url);
  }, [variant]);

  const handleThumb = (thumbUrl) => {
    console.log(thumbUrl);
    setActiveThumb(thumbUrl);
  };

  return (
    <div className="lg:px-32 px-4">
      <div className="my-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={WEBSITE_SHOP}>Product</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={WEBSITE_PRODUCT_DETAILS(product?.slug)}>
                  {product?.name}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="md:flex justify-between items-start lg:gap-10 gap-5 mb-20">
        <div className="md:w-1/2 xl:flex xl:justify-center xl:gap-5 md:sticky md:top-0">
          <div className="xl:order-last xl:mb-0 mb-5 xl:w-[calc(100%-144px)]">
            <Image
              src={activeThumb || ImagePlaceholder.src}
              width={650}
              height={650}
              alt="product"
              className="border rounded max-w-full"
            />
          </div>
          <div
            className="flex xl:flex-col items-center xl:gap-5 gap-3 xl:w-36
          overflow-auto xl:pb-0 pb-2 max-h-[600px]"
          >
            {variant?.media?.map((thumb) => (
              <Image
                key={thumb._id}
                src={thumb?.secure_url || ImagePlaceholder.src}
                width={100}
                height={100}
                alt="product thumbnail"
                className={`md:max-w-full max-w-16 rounded cursor-pointer ${thumb.secure_url === activeThumb ? "border-2 border-primary" : "border"}`}
                onClick={() => handleThumb(thumb.secure_url)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
