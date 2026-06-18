import React from "react";
import Link from "next/link";

import { FaTwitter, FaInstagram, FaFacebookF, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-gray-950 text-gray-300 py-16 px-6 mt-auto font-sans">
            <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    <div className="col-span-1 lg:col-span-1">
                        <Link href="/" className="text-white text-2xl font-bold tracking-tighter block mb-6">
                            Erythro<span className="text-red-700">Share</span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Connecting life-savers with those in need. ErythroShare is a dedicated
                            platform for seamless blood donation and requests.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Platform</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link href="/" className="hover:text-red-600 transition">Home</Link></li>
                            <li><Link href="/donation-requests" className="hover:text-red-600 transition">Donation Requests</Link></li>
                            <li><Link href="/search" className="hover:text-red-600 transition">Search Donors</Link></li>
                            <li><Link href="/funding" className="hover:text-red-600 transition">Funding</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Support</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link href="#" className="hover:text-red-600 transition">Help Center</Link></li>
                            <li><Link href="#" className="hover:text-red-600 transition">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-red-600 transition">Terms of Service</Link></li>
                            <li><Link href="#" className="hover:text-red-600 transition">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Connect</h4>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-red-800 hover:text-white transition shadow-sm">
                                <FaFacebookF size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-red-800 hover:text-white transition shadow-sm">
                                <FaTwitter size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-red-800 hover:text-white transition shadow-sm">
                                <FaInstagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-red-800 hover:text-white transition shadow-sm">
                                <FaLinkedinIn size={18} />
                            </a>
                        </div>
                    </div>
                </div>


                <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center bg-transparent">
                    <p className="text-gray-500 text-xs mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} ErythroShare. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-xs text-gray-500">
                        <Link href="#" className="hover:text-white transition">Privacy</Link>
                        <Link href="#" className="hover:text-white transition">Terms</Link>
                        <Link href="#" className="hover:text-white transition">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
