import FeaturedProduct from "@/components/Application/website/FeaturedProduct";
import MainSlider from "@/components/Application/website/MainSlider";
import Testimonial from "@/components/Application/website/Testimonial";
import advertisingBanner from "@/public/assets/images/advertising-banner.png";
import { BiSupport } from "react-icons/bi";
import { FaShippingFast } from "react-icons/fa";
import { GiReturnArrow } from "react-icons/gi";
import { TbRosetteDiscountFilled } from "react-icons/tb";

import LatestProduct from "@/components/Application/website/LatestProduct";
import banner1 from "@/public/assets/images/banner1.png";
import banner2 from "@/public/assets/images/banner2.png";
import Image from "next/image";
import Link from "next/link";
function page() {
  return (
    <>
      <section>
        <MainSlider />
      </section>
      <section className="px-4 sm:px-6 md:px-32 lg:px-16 xl:px-24 2xl:px-32 pt-5 sm:pt-10 lg:pt-20 pb-10">
  

  <FeaturedProduct />
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 mt-12 mb-12">
    
    <div className="overflow-hidden rounded-lg border">
      <Link href="" className="block">
        <Image
          src={banner1.src}
          alt="Promotional Banner 1"
          width={banner1.width}
          height={banner1.height}
          className="w-full h-auto transition-transform duration-300 hover:scale-105"
          priority
        />
      </Link>
    </div>

    <div className="overflow-hidden rounded-lg border">
      <Link href="" className="block">
        <Image
          src={banner2.src}
          alt="Promotional Banner 2"
          width={banner2.width}
          height={banner2.height}
          className="w-full h-auto transition-transform duration-300 hover:scale-105"
          priority
        />
      </Link>
    </div>

  </div>
  <LatestProduct />
</section>
      
        
     
    
      <section className="sm:pt-10 pt-6 pb-6 lg:px-32">
        <div className="relative w-full aspect-[16/3]">
          <Image
            src={advertisingBanner}
            alt="Advertisement"
            fill
            className="object-fill"
            priority
          />
        </div>
      </section>
      
      <Testimonial />
      
      <section className="lg:px-32 px-4 border-t py-10">
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-10">
          <div className="text-center">
            <p className="flex justify-center text-primary items-center mb-3">
              <GiReturnArrow size={30} />
            </p>
            <h3 className="text-xl font-semibold">7-Days Returns</h3>
            <p>Risk-free shopping with easy Returns</p>
          </div>

          <div className="text-center">
            <p className="flex text-primary justify-center items-center mb-3">
              <FaShippingFast size={30} />
            </p>
            <h3 className="text-xl font-semibold">Free Shipping</h3>
            <p>Risk-free shopping with easy Returns</p>
          </div>
          <div className="text-center">
            <p className="flex text-primary justify-center items-center mb-3">
              <BiSupport size={30} />
            </p>
            <h3 className="text-xl font-semibold">24/7 Support</h3>
            <p>Risk-free shopping with easy Returns</p>
          </div>
          <div className="text-center">
            <p className="flex text-primary justify-center items-center mb-3">
              <TbRosetteDiscountFilled size={30} />
            </p>
            <h3 className="text-xl font-semibold">Member Discounts</h3>
            <p>Risk-free shopping with easy Returns</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default page;
