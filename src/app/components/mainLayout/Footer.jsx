"use client"

import React from "react";
import Link from "next/link";
import { FaTwitter, FaInstagram, FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { Droplet, Handset, Envelope, MapPin } from "@gravity-ui/icons";
import { usePathname } from "next/navigation";

const Footer = () => {
    const pathname = usePathname();
    
    // Hide footer on dashboard pages
    if (pathname?.includes('/dashboard')) {
        return null;
    }

    return (
        <footer className="relative bg-neutral-950 text-neutral-400 py-24 px-6 mt-auto overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent"></div>
            <div className="absolute top-0 right-0 size-96 bg-red-900/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>

            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    
                    {/* Brand Section */}
                    <div className="space-y-8">
                        <Link href="/" className="inline-flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-900/20">
                                <Droplet className="size-6" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
                                Erythro<span className="text-red-600">Share</span>
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed text-neutral-500 font-medium max-w-xs">
                            Revolutionizing blood donation through technology. We connect lifesavers with those in need, one drop at a time.
                        </p>
                        <div className="flex gap-4">
                            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, i) => (
                                <a 
                                    key={i} 
                                    href="#" 
                                    className="size-10 rounded-xl bg-neutral-900 flex items-center justify-center text-neutral-500 hover:bg-red-600 hover:text-white transition-all duration-300 border border-neutral-800 hover:border-red-500 shadow-sm"
                                >
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white text-[11px] font-black uppercase tracking-[0.3em] mb-10 italic">Platform Nav</h4>
                        <ul className="space-y-4">
                            {[
                                { label: "Home",              href: "/" },
                                { label: "Donation Requests", href: "/donation-requests" },
                                { label: "Search Donors",     href: "/search" },
                            ].map(({ label, href }) => (
                                <li key={label}>
                                    <Link 
                                        href={href}
                                        className="text-sm font-bold hover:text-red-500 transition-colors flex items-center gap-2 group"
                                    >
                                        <span className="size-1 bg-neutral-800 rounded-full group-hover:bg-red-500 transition-colors"></span>
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white text-[11px] font-black uppercase tracking-[0.3em] mb-10 italic">Reach Support</h4>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4">
                                <div className="text-red-600 mt-1"><Handset size={14} /></div>
                                <div className="text-sm font-bold text-neutral-300">
                                    <p className="text-[10px] uppercase text-neutral-500 font-black tracking-widest mb-1">Emergency Hotline</p>
                                    +880 1234-567890
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="text-red-600 mt-1"><Envelope size={14} /></div>
                                <div className="text-sm font-bold text-neutral-300">
                                    <p className="text-[10px] uppercase text-neutral-500 font-black tracking-widest mb-1">Email Inquiry</p>
                                    support@erythroshare.org
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="text-red-600 mt-1"><MapPin size={14} /></div>
                                <div className="text-sm font-bold text-neutral-300">
                                    <p className="text-[10px] uppercase text-neutral-500 font-black tracking-widest mb-1">HQ Distribution</p>
                                    Dhaka, Bangladesh
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="bg-neutral-900/50 p-8 rounded-[2rem] border border-neutral-800/50 backdrop-blur-sm">
                        <h4 className="text-white text-[11px] font-black uppercase tracking-[0.3em] mb-6 italic">Stay Updated</h4>
                        <p className="text-xs text-neutral-500 mb-6 font-medium">Join our mission to save lives. Get notified about urgent requests.</p>
                        <div className="relative">
                            <input 
                                type="email" 
                                placeholder="Enter email"
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl py-3.5 px-5 text-sm text-white focus:outline-none focus:border-red-600 transition-colors font-bold"
                            />
                            <button className="absolute right-2 top-2 bottom-2 bg-red-600 text-white px-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-colors">
                                Join
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="size-2 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-600">
                            System Version 2.0.4 - Operational
                        </p>
                    </div>
                    
                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                        &copy; {new Date().getFullYear()} <span className="text-neutral-300">ErythroShare Matrix</span>. All human rights Reserved.
                    </p>

                    <div className="flex gap-8">
                        {["Privacy", "Terms", "Cookies"].map((term) => (
                            <Link key={term} href="#" className="text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-colors">
                                {term}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
