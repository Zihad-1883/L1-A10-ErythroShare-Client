"use client";
import React, { useState } from "react";
import Link from "next/link";
import districtsData from "@/data/district.json";
import upazilasData from "@/data/upazila.json";

const SignupPage = () => {
    // amateur state for form
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [bloodGroup, setBloodGroup] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedUpazila, setSelectedUpazila] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // extract actual data arrays from the json structure
    const districts = districtsData[2].data;
    const upazilas = upazilasData[2].data;

    // filter upazilas based on selected district
    const filteredUpazilas = upazilas.filter(u => u.district_id === selectedDistrict);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-6">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl w-full max-w-4xl border border-gray-100">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Create Account</h1>
                    <p className="text-gray-500">Join the ErythroShare community and save lives</p>
                </div>

                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 font-bold mb-2 text-sm">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-800 transition"
                                required
                            />
                        </div>

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

                        <div>
                            <label className="block text-gray-700 font-bold mb-2 text-sm">Profile Picture (Avatar)</label>
                            <input
                                type="file"
                                onChange={(e) => setAvatar(e.target.files[0])}
                                className="w-full p-3 rounded-xl border border-gray-200 bg-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-900 hover:file:bg-red-100"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-bold mb-2 text-sm">Blood Group</label>
                            <select
                                value={bloodGroup}
                                onChange={(e) => setBloodGroup(e.target.value)}
                                className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-800 transition appearance-none bg-white"
                                required
                            >
                                <option value="">Select Blood Group</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-bold mb-2 text-sm">District</label>
                            <select
                                value={selectedDistrict}
                                onChange={(e) => setSelectedDistrict(e.target.value)}
                                className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-800 transition bg-white"
                                required
                            >
                                <option value="">Select District</option>
                                {districts.map((d) => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-bold mb-2 text-sm">Upazila</label>
                            <select
                                value={selectedUpazila}
                                onChange={(e) => setSelectedUpazila(e.target.value)}
                                className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-800 transition bg-white"
                                disabled={!selectedDistrict}
                                required
                            >
                                <option value="">Select Upazila</option>
                                {filteredUpazilas.map((u) => (
                                    <option key={u.id} value={u.id}>{u.name}</option>
                                ))}
                            </select>
                        </div>

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

                        <div>
                            <label className="block text-gray-700 font-bold mb-2 text-sm">Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-800 transition"
                                required
                            />
                        </div>
                    </div>

                    <div className="mt-8">
                        <button
                            type="button"
                            className="w-full bg-[#991b1b] text-white p-5 rounded-2xl font-bold text-lg hover:bg-red-900 transition shadow-xl active:scale-95"
                        >
                            Sign Up
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center text-gray-600">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="text-red-800 font-bold hover:underline">
                        Log In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
