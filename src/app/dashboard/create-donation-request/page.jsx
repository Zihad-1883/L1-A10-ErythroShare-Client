"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import districtsData from "@/data/district.json";
import upazilasData from "@/data/upazila.json";
import { serverMutation } from "@/lib/actions/server";
import { toast } from "react-toastify";
import { redirect } from "next/navigation";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const districts = districtsData[2]?.data || [];
const allUpazilas = upazilasData[2]?.data || [];

export default function CreateDonationRequest() {
    const { data: session } = useSession();
    const [selectedDistrict, setSelectedDistrict] = useState("");
    useEffect(() => {
        if (session?.user?.status === "blocked") {
            toast.error("You are blocked from creating donation requests", { toastId: "blocked-user" });
            redirect("/dashboard");
        }
    }, [session?.user?.status]);

    const [addData, setAddData] = useState({
        recipientName: "",
        recipientDistrict: "",
        recipientUpazila: "",
        hospitalName: "",
        address: "",
        bloodGroup: "",
        donationDate: "",
        donationTime: "",
        requestedMessage: "",
        status: "pending"
    });

    const filteredUpazilas = useMemo(() => {
        if (!selectedDistrict) return [];
        return allUpazilas.filter(u => u.district_id === selectedDistrict);
    }, [selectedDistrict]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAddData(prev => ({ ...prev, [name]: value }));
    };

    const handleDistrictChange = (e) => {
        const id = e.target.value;
        const districtName = districts.find(d => d.id === id)?.name || "";
        setSelectedDistrict(id);
        setAddData(prev => ({ ...prev, recipientDistrict: districtName, recipientUpazila: "" }));
    };

    const handleUpazilaChange = (e) => {
        const id = e.target.value;
        const upazilaName = allUpazilas.find(u => u.id === id)?.name || "";
        setAddData(prev => ({ ...prev, recipientUpazila: upazilaName }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const finalData = {
            ...addData,
            name: session?.user?.name || "",
            email: session?.user?.email || ""
        };
        console.log("Form Data:", finalData);
        const res = await serverMutation("/dashboard/create-donation-request", "POST", finalData);
        console.log(res);
        if (res.success) {
            toast.success("Donation request created successfully");
            setAddData({
                recipientName: "",
                recipientDistrict: "",
                recipientUpazila: "",
                hospitalName: "",
                address: "",
                bloodGroup: "",
                donationDate: "",
                donationTime: "",
                requestedMessage: "",
                status: "pending"
            });
        } else {
            toast.error("Failed to create donation request");
        }
        redirect("/dashboard/my-donation-requests");
    };

    const inputClasses = "w-full px-5 py-4 border-2 border-neutral-200 bg-white focus:border-[#991b1b] outline-none transition-colors text-neutral-900 placeholder:text-neutral-400 font-bold rounded-xl";
    const labelClasses = "block text-sm font-black text-neutral-900 uppercase tracking-wide mb-2";
    const sectionTitleClasses = "text-2xl font-black text-neutral-900 border-b-4 border-[#991b1b] pb-2 inline-block mb-8";

    return (
        <section className="min-h-screen bg-white py-12 px-4">
            <div className="max-w-4xl mx-auto border-2 border-neutral-100 shadow-md rounded-3xl p-8 md:p-12">
                <header className="mb-12 border-b-2 border-neutral-100 pb-8">
                    <div className="inline-block bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded mb-4">
                        Urgent Request
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-neutral-900 mb-4 tracking-tight">
                        New Donation Request
                    </h1>
                    <p className="text-neutral-600 font-bold text-lg">
                        Please fill out the form below. Clear information saves lives.
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-12">
                    {/* Requester Profile - Flat Style */}
                    <div className="bg-neutral-50 p-8 rounded-2xl border border-neutral-200">
                        <h3 className="text-xs font-black text-neutral-400 uppercase tracking-[0.2em] mb-6">Requester Identification</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className={labelClasses}>Requester Name</label>
                                <input
                                    readOnly
                                    type="text"
                                    value={session?.user?.name || ""}
                                    className="w-full px-5 py-4 border-2 border-neutral-300 bg-neutral-100 text-neutral-700 font-bold rounded-xl cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>Email Address</label>
                                <input
                                    readOnly
                                    type="email"
                                    value={session?.user?.email || ""}
                                    className="w-full px-5 py-4 border-2 border-neutral-300 bg-neutral-100 text-neutral-700 font-bold rounded-xl cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Recipient Details */}
                    <div>
                        <h3 className={sectionTitleClasses}>Patient & Blood Details</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <label className={labelClasses}>Patient Full Name</label>
                                <input
                                    required
                                    name="recipientName"
                                    type="text"
                                    placeholder="Enter name"
                                    value={addData.recipientName}
                                    onChange={handleInputChange}
                                    className={inputClasses}
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>Required Blood Group</label>
                                <select
                                    required
                                    name="bloodGroup"
                                    value={addData.bloodGroup}
                                    onChange={handleInputChange}
                                    className={inputClasses}
                                >
                                    <option value="">Select Group</option>
                                    {bloodGroups.map(group => (
                                        <option key={group} value={group}>{group}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className={labelClasses}>District</label>
                                <select
                                    required
                                    className={inputClasses}
                                    value={selectedDistrict}
                                    onChange={handleDistrictChange}
                                >
                                    <option value="">Select District</option>
                                    {districts.map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={labelClasses}>Upazila</label>
                                <select
                                    required
                                    disabled={!selectedDistrict}
                                    className={`${inputClasses} disabled:bg-neutral-50 disabled:border-neutral-200`}
                                    onChange={handleUpazilaChange}
                                >
                                    <option value="">Select Upazila</option>
                                    {filteredUpazilas.map(u => (
                                        <option key={u.id} value={u.id}>{u.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Logistics */}
                    <div>
                        <h3 className={sectionTitleClasses}>Location & Schedule</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <label className={labelClasses}>Hospital Name</label>
                                <input
                                    required
                                    name="hospitalName"
                                    type="text"
                                    placeholder="e.g. Dhaka Medical"
                                    value={addData.hospitalName}
                                    onChange={handleInputChange}
                                    className={inputClasses}
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>Full Address</label>
                                <input
                                    required
                                    name="address"
                                    type="text"
                                    placeholder="House, Road, Area"
                                    value={addData.address}
                                    onChange={handleInputChange}
                                    className={inputClasses}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className={labelClasses}>Donation Date</label>
                                <input
                                    required
                                    name="donationDate"
                                    type="date"
                                    value={addData.donationDate}
                                    onChange={handleInputChange}
                                    className={inputClasses}
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>Donation Time</label>
                                <input
                                    required
                                    name="donationTime"
                                    type="time"
                                    value={addData.donationTime}
                                    onChange={handleInputChange}
                                    className={inputClasses}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Message */}
                    <div>
                        <h3 className={sectionTitleClasses}>Required Message</h3>
                        <div>
                            <label className={labelClasses}>Why is this needed?</label>
                            <textarea
                                required
                                name="requestedMessage"
                                rows={4}
                                placeholder="Details about the situation..."
                                value={addData.requestedMessage}
                                onChange={handleInputChange}
                                className={`${inputClasses} resize-none`}
                            ></textarea>
                        </div>
                    </div>

                    <div className="pt-8">
                        <button
                            type="submit"
                            className="w-full bg-[#991b1b] hover:bg-black text-white font-black text-xl py-6 rounded-xl transition-colors duration-200"
                        >
                            Post Donation Request
                        </button>
                    </div>
                </form>

            </div>
        </section>
    );
}
