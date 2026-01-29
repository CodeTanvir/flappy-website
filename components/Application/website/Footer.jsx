import logo from "@/public/assets/images/black.png";
import {
  WEBSITE_HOME,
  WEBSITE_LOGIN,
  WEBSITE_REGISTER,
} from "@/routes/WebsiteRoute";
import Image from "next/image";
import Link from "next/link";
import {
  AiOutlineFacebook,
  AiOutlineInstagram,
  AiOutlineTwitter,
  AiOutlineWhatsApp,
  AiOutlineYoutube,
} from "react-icons/ai";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineMail, MdOutlinePhone } from "react-icons/md";

function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div
        className="grid lg:grid-cols-5
     md:grid-cols-2 grid-cols-1 gap-10 py-10 lg:px-32 px-4"
      >
        <div className="lg:col-span-1 md:col-span-2 col-span-1">
          <Image
            src={logo}
            width={383}
            height={146}
            alt="logo"
            className="w-36 mb-2"
          />
          <p>
            E-store is your trusted destination for quality and convece. from
            fashion to essentials, we bring everything you need right to your
            desktop. Shop smart, live better-only at e shop
          </p>
        </div>
        <div>
          <h4 className="text-xl font-bold uppercase mb-5">Categories</h4>
          <ul>
            <li className="mb-2 text-gray-500">
              <Link href="">T shirt</Link>
            </li>
            <li className="mb-2 text-gray-500">
              <Link href="">Hoodies</Link>
            </li>
            <li className="mb-2 text-gray-500">
              <Link href="">Oversized</Link>
            </li>
            <li className="mb-2 text-gray-500">
              <Link href="">Full Sleeve</Link>
            </li>
            <li className="mb-2 text-gray-500">
              <Link href="">Polo</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xl font-bold uppercase mb-5">Userfull Links</h4>
          <ul>
            <li className="mb-2 text-gray-500">
              <Link href={WEBSITE_HOME}>Home</Link>
            </li>
            <li className="mb-2 text-gray-500">
              <Link href="">Shop</Link>
            </li>
            <li className="mb-2 text-gray-500">
              <Link href="">About</Link>
            </li>
            <li className="mb-2 text-gray-500">
              <Link href={WEBSITE_REGISTER}>Register</Link>
            </li>
            <li className="mb-2 text-gray-500">
              <Link href={WEBSITE_LOGIN}>Login</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xl font-bold uppercase mb-5">Userfull Links</h4>
          <ul>
            <li className="mb-2 text-gray-500">
              <Link href={WEBSITE_REGISTER}>Register</Link>
            </li>
            <li className="mb-2 text-gray-500">
              <Link href={WEBSITE_LOGIN}>Login</Link>
            </li>
            <li className="mb-2 text-gray-500">
              <Link href="">My Account</Link>
            </li>
            <li className="mb-2 text-gray-500">
              <Link href="">Privacy policy</Link>
            </li>
            <li className="mb-2 text-gray-500">
              <Link href="">Terms & Condition</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xl font-bold uppercase mb-5">Contact Us</h4>
          <ul>
            <li className="mb-2 text-gray-500">
              <IoLocationOutline size={20} />
              <span className="text-sm">E-store market Dhaka, Bangladesh</span>
            </li>
            <li className="mb-2 text-gray-500 gap-2">
              <MdOutlinePhone size={20} />
              <Link
                href="tel:+86618115466369"
                className="hover:text-primary text-sm"
              >
                +86618115466369
              </Link>
            </li>
            <li className="mb-2 text-gray-500 gap-2">
              <MdOutlineMail size={20} />
              <Link
                href="mailto:support@store.com"
                className="hover:text-primary text-sm"
              >
                support@store.com
              </Link>
            </li>
          </ul>
          <div className="flex gap-5 mt-5">
            <Link href="">
              <AiOutlineYoutube className="text-primary" size={25} />
            </Link>
            <Link href="">
              <AiOutlineInstagram className="text-primary" size={25} />
            </Link>
            <Link href="">
              <AiOutlineWhatsApp className="text-primary" size={25} />
            </Link>
            <Link href="">
              <AiOutlineFacebook className="text-primary" size={25} />
            </Link>
            <Link href="">
              <AiOutlineTwitter className="text-primary" size={25} />
            </Link>
          </div>
        </div>
      </div>
      <div className="py-5 bg-gray-100">
        <p className="text-center">2026 Flappy. All Right Reserved</p>
      </div>
    </footer>
  );
}

export default Footer;
