import banner1 from "@/public/assets/images/bestsell.png";
import Image from "next/image";

export default function BannerCard() {
  return (
    <div className="h-full">
      <div className="group h-full overflow-hidden rounded-2xl border bg-card">
        <div className="relative aspect-square">
          <Image
            src={banner1}
            alt="banner"
            
            className="object-cover  transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-black/35" />

          <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
            <p className="text-xs uppercase tracking-wider">
              Woman Area
            </p>

            <h3 className="mt-2 text-xl font-bold leading-tight">
              Save 17% on Clothing
            </h3>

            <button className="mt-3 w-fit text-sm font-medium">
              Shop Now →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}