"use client";
import React, { useState } from "react";
import Link from "next/link";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-6">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Welcome Back</h1>
                    <p className="text-gray-500">Log in to your ErythroShare account</p>
                </div>

                <form className="space-y-6">
                    {/* Email */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2 text-sm">Email Address</label>
                        <input 
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@mail.com"
                            className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-800 transition"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2 text-sm">Password</label>
                        <input 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-800 transition"
                            required
                        />
                    </div>

                    <div className="mt-8">
                        <button 
                            type="button"
                            className="w-full bg-[#991b1b] text-white p-5 rounded-2xl font-bold text-lg hover:bg-red-900 transition shadow-xl active:scale-95"
                        >
                            Log In
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center text-gray-600">
                    Don't have an account?{" "}
                    <Link href="/auth/signup" className="text-red-800 font-bold hover:underline">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
