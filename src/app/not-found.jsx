import React from "react";
import Link from "next/link";
import { HiHome, HiExclamationCircle } from "react-icons/hi";

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="max-w-2xl w-full text-center">
                {/* Visual Element */}
                <div className="relative mb-12">
                    <div className="text-[12rem] md:text-[16rem] font-extrabold text-gray-200 leading-none select-none">
                        404
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-red-800 p-6 rounded-3xl shadow-2xl transform rotate-12 hover:rotate-0 transition-transform duration-500">
                            <HiExclamationCircle className="text-white text-7xl md:text-8xl" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                    Oops! Page Not Found
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-lg mx-auto leading-relaxed">
                    It seems like the drop you&apos;re looking for has been misplaced.
                    Let&apos;s get you back on track to saving lives.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/"
                        className="flex items-center gap-2 bg-red-800 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-red-900 transition-all shadow-xl active:scale-95 group"
                    >
                        <HiHome className="text-2xl group-hover:-translate-y-0.5 transition-transform" />
                        Back to Home
                    </Link>
                    <Link
                        href="/donation-requests"
                        className="text-gray-700 font-bold px-8 py-4 rounded-2xl border-2 border-gray-200 hover:bg-white hover:border-red-800 hover:text-red-800 transition-all text-lg active:scale-95"
                    >
                        View Requests
                    </Link>
                </div>

                {/* Bottom Decoration */}
                <div className="mt-20">
                    <div className="inline-flex items-center gap-2 text-red-800 font-semibold opacity-50">
                        <span className="w-12 h-0.5 bg-red-800"></span>
                        <span className="uppercase tracking-widest text-sm">ErythroShare</span>
                        <span className="w-12 h-0.5 bg-red-800"></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
