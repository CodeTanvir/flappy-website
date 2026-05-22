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
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HiMiniBars3 } from "react-icons/hi2";
import { IoIosSearch, IoMdClose } from "react-icons/io";
import { VscAccount } from "react-icons/vsc";
import { useSelector } from "react-redux";
import Cart from "./Cart";
import Search from "./Search";

// category dropdown no longer uses Radix; replaced with CSS hover menu
import { FaChevronDown } from "react-icons/fa";

function Header() {
  const auth = useSelector((store) => store.authStore.auth);
  const [isMobileMenu, setIsMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const [categories, setCategories] = useState([]);
  const [catOpen, setCatOpen] = useState(false);
  const closeTimer = useRef(null);

  const handleMouseEnter = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setCatOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => {
      setCatOpen(false);
      closeTimer.current = null;
    }, 200); // delay to allow pointer to reach menu
  };

  // load categories for dropdown
  useEffect(() => {
    const getCategories = async () => {
      try {
        const { data } = await axios.get("/api/category/get-category");
        if (data.success) {
          setCategories(data.data || []);
        }
      } catch (err) {
        console.error("Header: failed to fetch categories", err);
      }
    };
    getCategories();
  }, []);

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
            <Link
              href={WEBSITE_HOME}
              className="navLink hover:text-primary hover:font-bold"
            >
              Home
            </Link>
            <Link
              href="/about-us"
              className="navLink hover:text-primary hover:font-bold"
            >
              About
            </Link>
            <Link
              href={WEBSITE_SHOP}
              className="navLink hover:text-primary hover:font-bold"
            >
              Shop
            </Link>

            {/* category dropdown (hover + click with delay) */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <span
                onClick={() => setCatOpen((prev) => !prev)}
                className="navLink flex items-center gap-1 hover:text-primary hover:font-bold cursor-pointer"
              >
                Category <FaChevronDown />
              </span>
              <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={`absolute left-0 mt-2 w-40 bg-white border rounded shadow-lg transition-opacity ${
                  catOpen ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
              >
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <Link
                      key={cat._id}
                      href={`${WEBSITE_SHOP}?category=${encodeURIComponent(
                        cat.name.replace(/\s+/g, "-").toLowerCase().trim(),
                      )}`}
                      className="block px-4 py-2 hover:bg-primary rounded-xl hover:text-white"
                    >
                      {cat.name}
                    </Link>
                  ))
                ) : (
                  <span className="block px-4 py-2 text-gray-500">
                    Loading...
                  </span>
                )}
              </div>
            </div>
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
            <button className="lg:hidden" onClick={() => setIsMobileMenu(true)}>
              <HiMiniBars3 className="iconStyle" size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
     {/* Overlay */}
<div
  className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 lg:hidden ${
    isMobileMenu
      ? "opacity-100 visible"
      : "opacity-0 invisible"
  }`}
  onClick={() => setIsMobileMenu(false)}
/>

{/* Mobile Drawer */}
<nav
  className={`lg:hidden fixed top-0 right-0 h-screen w-[85%] max-w-sm bg-white shadow-2xl z-50 transition-transform duration-300 ${
    isMobileMenu ? "translate-x-0" : "translate-x-full"
  }`}
>
  {/* Header */}
  <div className="flex items-center justify-between p-5 border-b">
    <Image
      src={logo}
      alt="logo"
      width={140}
      height={40}
      className="object-contain"
    />

    <button
      onClick={() => setIsMobileMenu(false)}
      className="p-2 rounded-full hover:bg-gray-100 transition"
    >
      <IoMdClose size={24} />
    </button>
  </div>

  {/* User Section */}
  <div className="flex items-center gap-3 p-5 border-b">
    <Avatar className="w-12 h-12">
      <AvatarImage src={auth?.avatar?.url || userIcon.src} />
    </Avatar>

    <div>
      {auth ? (
        <>
          <p className="font-semibold text-gray-900">
            {auth?.name || "User"}
          </p>

          <Link
            href={USER_DASHBOARD}
            onClick={() => setIsMobileMenu(false)}
            className="text-sm text-primary"
          >
            Dashboard
          </Link>
        </>
      ) : (
        <>
          <p className="font-semibold text-gray-900">
            Welcome
          </p>

          <Link
            href={WEBSITE_LOGIN}
            onClick={() => setIsMobileMenu(false)}
            className="text-sm text-primary"
          >
            Sign In
          </Link>
        </>
      )}
    </div>
  </div>

  {/* Navigation */}
  <div className="p-5 overflow-y-auto h-[calc(100vh-160px)]">
    <div className="space-y-2">
      <Link
        href={WEBSITE_HOME}
        onClick={() => setIsMobileMenu(false)}
        className="flex items-center px-4 py-3 rounded-xl hover:bg-gray-100 transition font-medium"
      >
        Home
      </Link>

      <Link
        href="/about-us"
        onClick={() => setIsMobileMenu(false)}
        className="flex items-center px-4 py-3 rounded-xl hover:bg-gray-100 transition font-medium"
      >
        About
      </Link>

      <Link
        href={WEBSITE_SHOP}
        onClick={() => setIsMobileMenu(false)}
        className="flex items-center px-4 py-3 rounded-xl hover:bg-gray-100 transition font-medium"
      >
        Shop
      </Link>
    </div>

    {/* Categories */}
    <div className="mt-8">
      <h3 className="px-4 mb-3 text-xs font-semibold tracking-wider text-gray-500 uppercase">
        Categories
      </h3>

      <div className="space-y-1">
        {categories.length > 0 ? (
          categories.map((cat) => (
            <Link
              key={cat._id}
              href={`${WEBSITE_SHOP}?category=${encodeURIComponent(
                cat.name.replace(/\s+/g, "-").toLowerCase().trim()
              )}`}
              onClick={() => setIsMobileMenu(false)}
              className="block px-4 py-3 rounded-xl hover:bg-gray-100 transition"
            >
              {cat.name}
            </Link>
          ))
        ) : (
          <p className="px-4 text-sm text-gray-500">
            Loading categories...
          </p>
        )}
      </div>
    </div>
  </div>
</nav>

      <Search isShow={showSearch} />
    </header>
  );
}

export default Header;
