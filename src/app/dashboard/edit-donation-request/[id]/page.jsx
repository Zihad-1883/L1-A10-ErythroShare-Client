"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import districtsData from "@/data/district.json";
import upazilasData from "@/data/upazila.json";
import { getDonationRequestById, editDonationRequest } from "@/lib/actions/server";
import { toast } from "react-toastify";
import { Pencil, ArrowsRotateLeft } from "@gravity-ui/icons";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const districts = districtsData[2]?.data || [];
const allUpazilas = upazilasData[2]?.data || [];

export default function EditDonationRequest() {
    const { id } = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [selectedDistrict, setSelectedDistrict] = useState("");
    
    const [formData, setFormData] = useState({
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

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const data = await getDonationRequestById(id);
                if (data) {
                    setFormData(data);
                    const districtObj = districts.find(d => d.name === data.recipientDistrict);
                    if (districtObj) {
                        setSelectedDistrict(districtObj.id);
                    }
                }
            } catch (error) {
                console.error("Error fetching request details:", error);
                toast.error("Failed to load request data");
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    const filteredUpazilas = useMemo(() => {
        if (!selectedDistrict) return [];
        return allUpazilas.filter(u => u.district_id === selectedDistrict);
    }, [selectedDistrict]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDistrictChange = (e) => {
        const distId = e.target.value;
        const districtName = districts.find(d => d.id === distId)?.name || "";
        setSelectedDistrict(distId);
        setFormData(prev => ({ ...prev, recipientDistrict: districtName, recipientUpazila: "" }));
    };

    const handleUpazilaChange = (e) => {
        const uName = e.target.value;
        setFormData(prev => ({ ...prev, recipientUpazila: uName }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            const res = await editDonationRequest(id, formData);
            if (res.success) {
                toast.success("Request updated successfully");
                router.push("/dashboard/my-donation-requests");
            } else {
                toast.error(res.message || "Failed to update request");
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error("An unexpected error occurred");
        } finally {
            setIsUpdating(false);
        }
    };

    const inputClasses = "w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-3xl text-neutral-900 font-bold focus:bg-white focus:border-red-600 focus:ring-4 focus:ring-red-50 outline-none transition-all duration-300 placeholder:text-neutral-300";
    const labelClasses = "block text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-3 ml-4 italic";

    if (isLoading) return (
        <div className="flex h-[60vh] items-center justify-center">
            <div className="size-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="container mx-auto px-6 py-12 max-w-5xl">
            <header className="mb-12 relative">
                <div className="absolute -top-10 -left-10 size-40 bg-red-50 blur-[60px] rounded-full opacity-50"></div>
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                        <Pencil className="size-3" /> Edit Protocol
                    </div>
                    <h1 className="text-5xl font-black text-neutral-900 tracking-tighter mb-4 leading-none italic uppercase">
                        Refine <span className="text-red-600">Donation</span> <br /> Request Parameters
                    </h1>
                    <p className="text-neutral-500 font-bold max-w-xl">Update the information below to ensure potential donors have current and accurate details.</p>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Form Fields */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Basic Info */}
                    <div className="bg-white rounded-[3rem] p-10 border border-neutral-100 shadow-sm">
                        <h3 className="text-xs font-black text-neutral-900 uppercase tracking-widest mb-10 pb-4 border-b border-neutral-50">Recipient Specification</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="md:col-span-1">
                                <label className={labelClasses}>Full Identity</label>
                                <input
                                    required
                                    name="recipientName"
                                    type="text"
                                    value={formData.recipientName}
                                    onChange={handleInputChange}
                                    className={inputClasses}
                                    placeholder="Patient Name"
                                />
                            </div>
                            <div className="md:col-span-1">
                                <label className={labelClasses}>Required Blood</label>
                                <select
                                    required
                                    name="bloodGroup"
                                    value={formData.bloodGroup}
                                    onChange={handleInputChange}
                                    className={inputClasses}
                                >
                                    <option value="">Select Group</option>
                                    {bloodGroups.map(group => <option key={group} value={group}>{group}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Geography */}
                    <div className="bg-white rounded-[3rem] p-10 border border-neutral-100 shadow-sm">
                        <h3 className="text-xs font-black text-neutral-900 uppercase tracking-widest mb-10 pb-4 border-b border-neutral-50">Geographical Matrix</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <label className={labelClasses}>Administrative District</label>
                                <select
                                    required
                                    className={inputClasses}
                                    value={selectedDistrict}
                                    onChange={handleDistrictChange}
                                >
                                    <option value="">Select District</option>
                                    {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={labelClasses}>Sub-District/Upazila</label>
                                <select
                                    required
                                    name="recipientUpazila"
                                    disabled={!selectedDistrict}
                                    className={inputClasses}
                                    value={formData.recipientUpazila}
                                    onChange={handleUpazilaChange}
                                >
                                    <option value="">Select Upazila</option>
                                    {filteredUpazilas.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className={labelClasses}>Precise Hospital Address</label>
                            <input
                                required
                                name="hospitalName"
                                type="text"
                                value={formData.hospitalName}
                                onChange={handleInputChange}
                                className={inputClasses}
                                placeholder="Hospital Name"
                            />
                        </div>
                        <div className="mt-8">
                            <label className={labelClasses}>Coordinates / Detailed Address</label>
                            <input
                                required
                                name="address"
                                type="text"
                                value={formData.address}
                                onChange={handleInputChange}
                                className={inputClasses}
                                placeholder="Full Street Address"
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar Controls */}
                <div className="space-y-10">
                    <div className="bg-neutral-900 rounded-[3rem] p-10 text-white shadow-xl">
                        <h3 className="text-xs font-black uppercase tracking-widest mb-10 text-white/40 italic">Temporal Logic</h3>
                        <div className="space-y-8">
                            <div>
                                <label className="text-[10px] font-black uppercase text-white/50 mb-3 block">Donation Date</label>
                                <input
                                    required
                                    name="donationDate"
                                    type="date"
                                    value={formData.donationDate}
                                    onChange={handleInputChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold focus:border-red-600 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-white/50 mb-3 block">Donation Time</label>
                                <input
                                    required
                                    name="donationTime"
                                    type="time"
                                    value={formData.donationTime}
                                    onChange={handleInputChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold focus:border-red-600 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[3rem] p-10 border border-neutral-100 shadow-sm">
                        <h3 className="text-xs font-black text-neutral-900 uppercase tracking-widest mb-6 italic">Narrative</h3>
                        <textarea
                            required
                            name="requestedMessage"
                            rows={5}
                            value={formData.requestedMessage}
                            onChange={handleInputChange}
                            className={`${inputClasses} resize-none text-sm`}
                            placeholder="Reason for request..."
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={isUpdating}
                        className="w-full py-8 bg-red-600 text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-neutral-900 hover:scale-[1.02] active:scale-95 transition-all duration-500 shadow-2xl shadow-red-100 flex items-center justify-center gap-4"
                    >
                        {isUpdating ? (
                            <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <ArrowsRotateLeft className="size-5" />
                                Synchronize Update
                            </>
                        )}
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="w-full py-6 text-neutral-400 font-black text-[10px] uppercase tracking-widest hover:text-neutral-900 transition-colors"
                    >
                        Cancel Operations
                    </button>
                </div>
            </form>
        </div>
    );
}
