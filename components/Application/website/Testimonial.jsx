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
  {
    name: "Aisha Khan",
    review: `The user experience is very intuitive.
Even as a beginner, I had no confusion using it.
Everything feels simple yet powerful.`,
    rating: 5,
  },
  {
    name: "Rahul Verma",
    review: `At first, I faced a small issue during setup.
The support team resolved it quickly.
Since then, everything has been working perfectly.`,
    rating: 4.5,
  },
  {
    name: "Emily Carter",
    review: `The build quality exceeded my expectations.
It looks even better in real life.
I am very happy with my purchase.`,
    rating: 5,
  },
  {
    name: "Omar Faruk",
    review: `This product helped me save a lot of time.
The performance is smooth and reliable.
I would confidently buy from here again.`,
    rating: 4.5,
  },
];

function Testimonial() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    slidesToShow: 3,
    slidesToScroll: 1,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: true,
          infinite: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: true,
          infinite: true,
        },
      },
    ],
  };
  return (
    <div className="lg:px-32 px-4 sm:pt-20 pt-5 pb-10">
      <h2 className="text-center sm:text-4xl text-2xl mb-5 font-semibold"></h2>
      <Slider {...settings}>
        {testimonials.map((Item, index) => (
          <div key={index} className="p-8">
            <div className="border rounded-lg p-5">
              <BsChatQuote size={30} className="mb-3" />
              <p className="mb-5">{Item.review}</p>
              <h4 className="font-semibold">{Item.name}</h4>
              <div className="flex mt-5">
                {Array.from({ length: Item.rating }).map((_, i) => (
                  <IoStar key={`star`} className="text-yellow-400" size={20} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default Testimonial;
