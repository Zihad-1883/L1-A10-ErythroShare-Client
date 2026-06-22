import React from "react";
import Link from "next/link";

const Banner = () => {
    return (
        <div className="bg-[#f5f5f5] py-20 px-6 md:py-32">
            <div className="container mx-auto text-center max-w-4xl">
                <h1 className="text-4xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight">
                    Someone nearby <br className="hidden md:block" /> needs blood today.
                </h1>
                <p className="text-gray-600 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                    A simple donation is a signal waiting to be answered — a heartbeat
                    shared across the community.
                </p>

                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                    <Link
                        href="/auth/signup"
                        className="bg-[#991b1b] text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-red-900 transition shadow-lg w-full md:w-auto"
                    >
                        Join as a donor
                    </Link>
                    <Link
                        href="#"
                        className="bg-transparent border-2 border-[#991b1b] text-[#991b1b] px-8 py-4 rounded-2xl font-bold text-lg hover:bg-red-50 transition w-full md:w-auto"
                    >
                        Search Donors
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Banner;
