"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import logo from "@/public/assets/images/black.png";
import userIcon from "@/public/assets/images/user.png";
import {
  USER_DASHBOARD,
  WEBSITE_HOME,
  WEBSITE_LOGIN,
  WEBSITE_SHOP,
} from "@/routes/WebsiteRoute";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { HiMiniBars3 } from "react-icons/hi2";
import { IoIosSearch, IoMdClose } from "react-icons/io";
import { VscAccount } from "react-icons/vsc";
import { useSelector } from "react-redux";
import Cart from "./Cart";
import Search from "./Search";

function Header() {
  const auth = useSelector((store) => store.authStore.auth);
  const [isMobileMenu, setIsMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="bg-white border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          
          {/* Logo */}
          <Link href={WEBSITE_HOME} className="flex items-center">
            <Image
              src={logo}
              alt="logo"
              width={260}
              height={40}
              className="object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href={WEBSITE_HOME} className="navLink">Home</Link>
            <Link href={WEBSITE_HOME} className="navLink">About</Link>
            <Link href={WEBSITE_SHOP} className="navLink">Shop</Link>
            <Link href={WEBSITE_HOME} className="navLink">Hoodies</Link>
            <Link href={WEBSITE_HOME} className="navLink">Oversized</Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-6">
            <button onClick={() => setShowSearch(!showSearch)}>
              <IoIosSearch className="iconStyle" size={22} />
            </button>

            <Cart />

            {!auth ? (
              <Link href={WEBSITE_LOGIN}>
                <VscAccount className="iconStyle" size={22} />
              </Link>
            ) : (
              <Link href={USER_DASHBOARD}>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={auth?.avatar?.url || userIcon.src} />
                </Avatar>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden"
              onClick={() => setIsMobileMenu(true)}
            >
              <HiMiniBars3 className="iconStyle" size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <nav
        className={`lg:hidden fixed top-0 left-0 w-full h-screen bg-white z-50 transition-all duration-300 ${
          isMobileMenu ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <Image src={logo} alt="logo" width={100} height={30} />
          <button onClick={() => setIsMobileMenu(false)}>
            <IoMdClose size={24} />
          </button>
        </div>

        <ul className="flex flex-col gap-6 p-6 text-lg">
          <Link href={WEBSITE_HOME}>Home</Link>
          <Link href={WEBSITE_HOME}>About</Link>
          <Link href={WEBSITE_SHOP}>Shop</Link>
          <Link href={WEBSITE_HOME}>Hoodies</Link>
          <Link href={WEBSITE_HOME}>Oversized</Link>
        </ul>
      </nav>

      <Search isShow={showSearch} />
    </header>
  );
}

export default Header;