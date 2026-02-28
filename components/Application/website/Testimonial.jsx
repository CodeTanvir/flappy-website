"use client";

import { BsChatQuote } from "react-icons/bs";
import { IoStar } from "react-icons/io5";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const testimonials = [
  {
    name: "Ayaan Rahman",
    review: `The overall experience was far better than I expected.
The product quality feels premium and well thought out.
Customer support was fast, friendly, and genuinely helpful.`,
    rating: 5,
  },
  {
    name: "Sarah Williams",
    review: `I was initially unsure before ordering.
After using it for a few days, I am fully satisfied.
Everything works smoothly and looks great.`,
    rating: 4.5,
  },
  {
    name: "Tanvir Hossain",
    review: `The design is clean and very user friendly.
Performance is consistent even with heavy usage.
I would definitely recommend this to others.`,
    rating: 5,
  },
  {
    name: "Michael Chen",
    review: `Delivery was on time and packaging was solid.
The product matches the description perfectly.
Overall, it was a smooth and stress-free experience.`,
    rating: 4,
  },
  {
    name: "Nusrat Jahan",
    review: `I really appreciate the attention to detail.
Every feature feels useful and well implemented.
It clearly shows effort and quality.`,
    rating: 4.5,
  },
  {
    name: "David Miller",
    review: `I have tried similar products before.
This one stands out in terms of reliability.
It feels worth the money spent.`,
    rating: 4,
  },
];

function Testimonial() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    arrows: false,
    slidesToShow: 3, // mobile first
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 3,
        },
      },
    ],
  };

  return (
    <section className="bg-gray-50 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
        <h2 className="text-center text-2xl sm:text-4xl font-semibold mb-10">
          What Our Customers Say
        </h2>

        <Slider {...settings}>
          {testimonials.map((item, index) => (
            <div key={index} className="px-3">
              <div className="bg-white border rounded-xl p-6 h-full flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300">
                <div>
                  <BsChatQuote size={28} className="mb-4 text-gray-400" />

                  <p className="text-sm sm:text-base leading-relaxed text-gray-600 mb-6">
                    {item.review}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800">
                    {item.name}
                  </h4>

                  <div className="flex mt-3">
                    {[...Array(5)].map((_, i) => (
                      <IoStar
                        key={i}
                        size={18}
                        className={
                          i < Math.floor(item.rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}

export default Testimonial;

  