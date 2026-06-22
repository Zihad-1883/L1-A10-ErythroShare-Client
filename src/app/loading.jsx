import React from "react";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-md">
            <div className="relative flex flex-col items-center">
                {/* Outer Ring */}
                <div className="size-20 animate-spin rounded-full border-4 border-red-100 border-t-red-600"></div>

                {/* Pulsing Heart / Logo Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="size-10 animate-pulse rounded-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>
                </div>

                <div className="mt-6 text-sm font-bold tracking-widest text-red-600 uppercase animate-pulse">
                    ErythroShare
                </div>
            </div>
        </div>
    );
}
