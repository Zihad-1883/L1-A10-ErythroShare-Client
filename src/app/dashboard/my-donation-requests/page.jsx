"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { serverQuery } from "@/lib/actions/server";
import { Bars, Clock, MapPin, Person } from "@gravity-ui/icons";

export default function MyDonationRequests() {
    const { data: session } = useSession();
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            if (session?.user?.email) {
                try {
                    const data = await serverQuery(`/dashboard/my-donation-requests/${session.user.email}`);
                    setRequests(data);
                } catch (error) {
                    console.error("Error fetching requests:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchRequests();
    }, [session]);

    console.log(requests)

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "pending": return "text-amber-600 bg-amber-50 border-amber-100";
            case "inprogress": return "text-blue-600 bg-blue-50 border-blue-100";
            case "done": return "text-emerald-600 bg-emerald-50 border-emerald-100";
            case "canceled": return "text-rose-600 bg-rose-50 border-rose-100";
            default: return "text-neutral-600 bg-neutral-50 border-neutral-100";
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="size-12 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-[#991b1b] p-8 shadow-2xl shadow-red-200 md:p-12">
                <div className="relative z-10 text-white">
                    <span className="inline-block rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                        Personal Records
                    </span>
                    <h1 className="mt-4 text-4xl font-extrabold md:text-5xl">
                        My Donation <span className="text-red-100 tracking-tight">Requests🩸</span>
                    </h1>
                    <p className="mt-2 text-red-50/80 font-medium">Manage and monitor all your blood donation requests in one place.</p>
                </div>
                <div className="absolute -right-20 -top-20 size-64 rounded-full bg-white/10 blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 size-64 rounded-full bg-red-900/20 blur-3xl"></div>
            </div>

            {/* Table Section */}
            <div className="rounded-[2.5rem] border border-neutral-100 bg-white p-6 shadow-sm overflow-hidden">
                <div className="mb-6 flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                        <div className="bg-red-50 p-2 rounded-xl text-red-600">
                            <Bars className="size-5" />
                        </div>
                        <h2 className="text-xl font-black text-neutral-800 uppercase tracking-tight">Request History</h2>
                    </div>
                    <span className="text-sm font-bold text-neutral-400">Total: {requests.length}</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs text-neutral-400 uppercase tracking-[0.2em] border-b border-neutral-50">
                                <th className="px-6 py-5 font-black">Recipient</th>
                                <th className="px-6 py-5 font-black">Location</th>
                                <th className="px-6 py-5 font-black">Date & Time</th>
                                <th className="px-6 py-5 font-black text-center">Status</th>
                                <th className="px-6 py-5 font-black text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50">
                            {requests.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-24 text-center ">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="size-16 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-200">
                                                <Bars className="size-8" />
                                            </div>
                                            <p className="text-neutral-400 font-bold italic text-lg">
                                                You haven&apos;t created any requests yet.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                requests.map((req) => (
                                    <tr key={req._id} className="group hover:bg-neutral-50 transition-colors">
                                        <td className="px-6 py-6 font-bold text-neutral-900">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-full bg-red-50 flex items-center justify-center text-[#991b1b] font-bold text-xs">
                                                    {req.bloodGroup}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-black">{req.recipientName}</div>
                                                    <div className="text-[10px] text-neutral-400 uppercase tracking-widest">{req.bloodGroup} Group</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 font-medium text-neutral-600">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-xs font-bold text-neutral-800">
                                                    <MapPin className="size-3 text-red-400" />
                                                    {req.hospitalName}
                                                </div>
                                                <div className="text-[10px] text-neutral-400 ml-5">
                                                    {req.recipientDistrict}, {req.recipientUpazila}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 font-medium text-neutral-600">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-xs font-bold text-neutral-800">
                                                    <Clock className="size-3 text-red-400" />
                                                    {req.donationDate}
                                                </div>
                                                <div className="text-[10px] text-neutral-400 ml-5 font-bold">
                                                    {req.donationTime}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-center">
                                            <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(req.status)}`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-2 rounded-xl border border-neutral-100 hover:bg-white hover:border-red-100 hover:text-red-600 transition-all text-neutral-400">
                                                    <Bars className="size-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
