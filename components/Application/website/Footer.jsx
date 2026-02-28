"use client";

import logo from "@/public/assets/images/black.png";
import Image from "next/image";
import Link from "next/link";
import {
  AiOutlineFacebook,
  AiOutlineInstagram,
  AiOutlineTwitter,
  AiOutlineYoutube,
} from "react-icons/ai";
import { FaFacebook, FaPinterest, FaTiktok } from "react-icons/fa";
import { IoCheckmarkSharp } from "react-icons/io5";
import { MdOutlineMail, MdOutlinePhone } from "react-icons/md";

function Footer() {
  return (
    <footer className="bg-[#5c5c5c] text-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-20 py-14">

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* LEFT SIDE */}
          <div className="space-y-6 text-center lg:text-left">
            <Image src={logo} width={60} height={60} alt="logo" />

            <ul className="space-y-3 text-sm">
              <li><Link href="#">About</Link></li>
              <li><Link href="#">Terms & Conditions</Link></li>
              <li><Link href="#">Privacy Policy</Link></li>
              <li><Link href="#">Cancellation & Return Policy</Link></li>
              <li><Link href="#">FAQs</Link></li>
              <li><Link href="#">Contact Us</Link></li>
            </ul>
          </div>

          {/* MIDDLE */}
          <div className="space-y-10 text-center lg:text-left">

            {/* Newsletter */}
            <div>
              <div className="flex items-center justify-center lg:justify-start gap-2 text-sm font-medium mb-4">
                <MdOutlineMail className="text-primary" />
                <span>GET SPECIAL DISCOUNTS IN YOUR INBOX</span>
              </div>

              <div className="flex max-w-xl mx-auto lg:mx-0">
                <input
                  type="email"
                  placeholder="Enter email to get offers, discounts and more."
                  className="flex-1 bg-transparent border-b border-gray-300 px-2 py-2 text-sm focus:outline-none"
                />
                <button className="bg-primary px-4 text-sm text-white">
                  Subscribe
                </button>
              </div>
            </div>

            {/* Phone */}
            <div>
              <div className="flex items-center justify-center lg:justify-start gap-2 text-sm font-medium mb-4">
                <MdOutlinePhone className="text-primary" />
                <span>FOR ANY HELP YOU MAY CALL US AT</span>
              </div>

              <p className="text-sm">+8809677666888</p>
              <p className="text-sm">Customer Service</p>
              <p className="text-sm">
                Track your order or get help returning an order
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-8 text-center lg:text-left">

            <div>
              <div className="flex items-center justify-center lg:justify-start gap-2 text-sm font-medium mb-3">
                <IoCheckmarkSharp className="text-primary" />
                <span>FOLLOW US</span>
              </div>

              <p className="text-sm mb-4">
                Stay updated on our latest arrivals, exclusive promotions and events.
              </p>

              {/* Social Icons */}
              <div className="flex justify-center lg:justify-start gap-4 text-xl">
                <AiOutlineInstagram />
                <FaTiktok />
                <AiOutlineFacebook />
                <AiOutlineTwitter />
                <FaPinterest />
                <AiOutlineYoutube />
              </div>
            </div>

            {/* Facebook Page Embed */}
           {/* Facebook Custom Card */}
<div className="flex justify-center lg:justify-start">
  
    
   
   {/* Facebook Glass Row */}
<div className="flex justify-center lg:justify-start">
  <div className="flex items-center gap-4 
                  w-full max-w-[380px] 
                  px-4 py-3 
                  rounded-xl
                  bg-white/10 
                  backdrop-blur-md
                  border border-white/20
                  shadow-lg">

    {/* Facebook Logo */}
    <div className="w-10 h-10 flex items-center justify-center 
                    rounded-full bg-blue-600 text-white">
      <FaFacebook size={20} />
    </div>

    {/* Facebook Iframe */}
    <div className="flex-1 rounded-md overflow-hidden">
      <iframe
        src="https://www.facebook.com/plugins/page.php?href=https://www.facebook.com/profile.php?id=61575287226275&tabs=&width=300&height=70&small_header=true&adapt_container_width=true&hide_cover=true&show_facepile=false"
        width="100%"
        height="70"
        style={{ border: "none", overflow: "hidden" }}
        
      />
    </div>

  </div>
</div>
  </div>
</div>
    </div>
  </div>

   
    </footer>
  );
}

export default Footer;