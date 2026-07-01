"use client";
import React, { useState } from "react";
import Link from "next/link";
import { HiMenu, HiX } from "react-icons/hi";
import { useSession, authClient } from "@/lib/auth-client";
import { usePathname, useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { data: session } = useSession();
  const isLoggedIn = !!session;

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth/login");
        },
      },
    });
    setIsOpen(false);
    setIsMenuOpen(false);
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  const pathname = usePathname();

  const navLink = (href, label) => (
    <Link
      href={href}
      className={`${pathname === href ? "text-red-800 font-bold" : "text-gray-700 font-medium"} hover:text-red-800 transition`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="bg-[#f5f5f5] border-b border-gray-200 py-4 px-6 md:px-8 sticky top-0 z-50 font-sans">
      <div className="container mx-auto flex justify-between items-center">

        {/* Logo */}
        <Link href="/" className="text-[#991b1b] text-2xl font-bold tracking-tighter">
          ErythroShare
        </Link>

        {/* Mobile hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-700 hover:text-red-800 transition focus:outline-none"
          >
            {isMenuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
          </button>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLink("/donation-requests", "Donation Requests")}

          {!isLoggedIn ? (
            <>
              {navLink("/search", "Search Donors")}
              {navLink("/auth/login", "Login")}
              <Link
                href="/auth/signup"
                className="bg-[#991b1b] text-white px-6 py-2 rounded-full font-medium hover:bg-red-900 transition shadow-md"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="w-10 h-10 rounded-full bg-red-100 border-2 border-red-200 flex items-center justify-center overflow-hidden focus:outline-none"
              >
                <img
                  src={session?.user?.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </button>

              {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg py-2 z-50">
                  <Link
                    href={pathname.includes("dashboard") ? "/" : "/dashboard"}
                    className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-800"
                    onClick={() => setIsOpen(false)}
                  >
                    {pathname.includes("dashboard") ? "Homepage" : "Dashboard"}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 font-semibold hover:bg-red-50 hover:text-red-800"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 bg-white rounded-xl shadow-lg border border-gray-100 p-4 absolute left-6 right-6 top-full z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-4">
            <Link
              href="/donation-requests"
              className={`${pathname === "/donation-requests" ? "text-red-800 bg-red-50" : "text-gray-700"} font-bold p-2 rounded-lg hover:bg-gray-50`}
              onClick={() => setIsMenuOpen(false)}
            >
              Donation Requests
            </Link>

            {!isLoggedIn ? (
              <>
                <Link
                  href="/search"
                  className={`${pathname === "/search" ? "text-red-800 bg-red-50" : "text-gray-700"} font-bold p-2 rounded-lg hover:bg-gray-50`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Search Donors
                </Link>
                <Link
                  href="/auth/login"
                  className={`${pathname === "/auth/login" ? "text-red-800 bg-red-50" : "text-gray-700"} font-bold p-2 rounded-lg hover:bg-gray-50 text-center`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-red-800 text-white px-6 py-3 rounded-full font-medium text-center shadow-lg active:scale-95 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className={`${pathname === "/dashboard" ? "text-red-800 bg-red-50" : "text-gray-700"} font-bold p-2 rounded-lg hover:bg-gray-50`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-800 font-bold p-2 text-left"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
