import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import BannerCard from "./BannerCard";
import ProductBox from "./ProductBox";

async function LatestProduct() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/get-latest-product`,
    {
      cache: "no-store",
    }
  );

  const productData = await res.json();

  return (
    <section className="py-6 md:py-10">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold">
          Monthly <span className="text-primary">Best Sell</span>
        </h2>

        <div className="flex flex-wrap gap-2">
          <button className="rounded-lg bg-[#f3dfb6] px-3 py-2 text-sm md:px-5 md:text-base">
            Featured
          </button>

          <button className="rounded-lg bg-muted px-3 py-2 text-sm md:px-5 md:text-base">
            Popular
          </button>

          <button className="rounded-lg bg-muted px-3 py-2 text-sm md:px-5 md:text-base">
            New Added
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 xl:grid-cols-[280px_minmax(0,1fr)] gap-6 items-stretch">
        <div className="h-full">
          <BannerCard />
        </div>

        <div className="min-w-0">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {productData?.data?.map((product) => (
                <CarouselItem
                  key={product._id}
                  className="
                    pl-4
                    basis-1/2
                    md:basis-1/3
                    lg:basis-1/4
                    min-w-0
                  "
                >
                  <ProductBox product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}

export default LatestProduct;