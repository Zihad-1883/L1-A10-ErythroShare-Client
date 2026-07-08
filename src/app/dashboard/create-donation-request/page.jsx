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

    const inputClasses = "w-full px-5 py-4 border border-white/10 bg-white/5 focus:bg-[#0f0404] focus:border-red-600 focus:ring-4 focus:ring-red-950/20 outline-none transition-all duration-300 text-white placeholder:text-white/20 font-bold rounded-2xl";
    const labelClasses = "block text-xs font-black text-white/50 uppercase tracking-widest mb-2 ml-1";
    const sectionTitleClasses = "text-lg font-black text-white border-b-2 border-red-800/30 pb-2 inline-block mb-8 uppercase tracking-widest";

    return (
        <section className="py-12 px-4 min-h-screen">
            <div className="max-w-4xl mx-auto border border-white/10 bg-white/[0.02] backdrop-blur-2xl shadow-2xl rounded-[2.5rem] p-8 md:p-12">
                <header className="mb-12 border-b border-white/10 pb-8">
                    <div className="inline-block bg-red-950 border border-red-800/60 text-red-400 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                        Urgent Request
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight uppercase italic">
                        New Donation Request
                    </h1>
                    <p className="text-white/60 font-bold text-lg">
                        Please fill out the form below. Clear information saves lives.
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-12">
                    {/* Requester Profile - Flat Style */}
                    <div className="bg-white/[0.01] border border-white/5 p-8 rounded-[2rem]">
                        <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.2em] mb-6">Requester Identification</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className={labelClasses}>Requester Name</label>
                                <input
                                    readOnly
                                    type="text"
                                    value={session?.user?.name || ""}
                                    className="w-full px-5 py-4 border border-white/5 bg-white/[0.01] text-white/30 font-bold rounded-2xl cursor-not-allowed outline-none"
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>Email Address</label>
                                <input
                                    readOnly
                                    type="email"
                                    value={session?.user?.email || ""}
                                    className="w-full px-5 py-4 border border-white/5 bg-white/[0.01] text-white/30 font-bold rounded-2xl cursor-not-allowed outline-none"
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
                                    <option value="" className="bg-[#0f0404] text-white">Select Group</option>
                                    {bloodGroups.map(group => (
                                        <option key={group} value={group} className="bg-[#0f0404] text-white">{group}</option>
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
                                    <option value="" className="bg-[#0f0404] text-white">Select District</option>
                                    {districts.map(d => (
                                        <option key={d.id} value={d.id} className="bg-[#0f0404] text-white">{d.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={labelClasses}>Upazila</label>
                                <select
                                    required
                                    disabled={!selectedDistrict}
                                    className={`${inputClasses} disabled:opacity-30 disabled:cursor-not-allowed`}
                                    onChange={handleUpazilaChange}
                                >
                                    <option value="" className="bg-[#0f0404] text-white">Select Upazila</option>
                                    {filteredUpazilas.map(u => (
                                        <option key={u.id} value={u.id} className="bg-[#0f0404] text-white">{u.name}</option>
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
                            className="w-full py-5 bg-gradient-to-r from-red-800 to-red-950 text-white font-black text-xl rounded-2xl hover:from-white hover:to-white hover:text-red-950 hover:scale-[1.01] border border-red-750/30 transition-all duration-300 shadow-[0_0_30px_rgba(153,27,27,0.2)]"
                        >
                            Post Donation Request
                        </button>
                    </div>
                </form>

            </div>
        </section>
    );
}
