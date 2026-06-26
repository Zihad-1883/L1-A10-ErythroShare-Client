"use client";

import React, { useEffect, useState } from "react";
import { getAllBloodDonationRequest } from "@/lib/actions/server";
import {
    Clock,
    MapPin,
    Pulse,
    Eye,
    Magnifier,
    Droplet
} from "@gravity-ui/icons";
import { toast } from "react-toastify";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

export default function PublicDonationRequestsPage() {
    const { data: session } = useSession();
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterGroup, setFilterGroup] = useState("all");

    const fetchRequests = async () => {
        setIsLoading(true);
        try {
            const data = await getAllBloodDonationRequest();
            const pending = Array.isArray(data) ? data.filter(req => req.status?.toLowerCase() === "pending") : [];
            setRequests(pending);
        } catch (error) {
            console.error("Error fetching requests:", error);
            toast.error("Failed to load records");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;
        const loadRequests = async () => {
            try {
                const data = await getAllBloodDonationRequest();
                if (isMounted) {
                    const pending = Array.isArray(data) ? data.filter(req => req.status?.toLowerCase() === "pending") : [];
                    setRequests(pending);
                }
            } catch (error) {
                if (isMounted) {
                    console.error("Error fetching requests:", error);
                    toast.error("Failed to load records");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadRequests();
        return () => { isMounted = false; };
    }, []);

    const bloodGroups = ["all", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

    const filteredRequests = filterGroup === "all"
        ? requests
        : requests.filter(req => req.bloodGroup === filterGroup);

    return (
        <main className="min-h-screen bg-[#fafafa]">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden bg-white border-b border-neutral-100">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-red-50/30 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="container mx-auto px-10 relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-[0.2em] mb-8 animate-in fade-in slide-in-from-left-4 duration-700">
                            <Pulse className="size-3 animate-pulse" />
                            Live Request Matrix
                        </div>
                        <h1 className="text-6xl md:text-7xl font-black text-neutral-900 leading-[0.95] tracking-tighter animate-in fade-in slide-in-from-bottom-4 duration-700 outline-none">
                            Urgent <br />
                            <span className="text-red-600">Donation</span> <br />
                            Registry
                        </h1>
                        <p className="mt-8 text-lg text-neutral-500 font-medium leading-relaxed max-w-xl animate-in fade-in slide-in-from-bottom-6 duration-700">
                            Browse active requests for blood across the network. Every minute counts.
                            Your small contribution can be someone&apos;s second chance.
                        </p>
                    </div>
                </div>
            </section>

            {/* Filter Section */}
            <section className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-neutral-100 py-6">
                <div className="container mx-auto px-10">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex items-center gap-4 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide no-scrollbar">
                            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mr-2 flex-shrink-0">
                                Filter Group:
                            </span>
                            {bloodGroups.map((group) => (
                                <button
                                    key={group}
                                    onClick={() => setFilterGroup(group)}
                                    className={`px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 border flex-shrink-0 ${filterGroup === group
                                        ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-100"
                                        : "bg-white border-neutral-100 text-neutral-400 hover:border-neutral-300 hover:text-neutral-900"
                                        }`}
                                >
                                    {group}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-3 text-neutral-400 font-black text-[10px] uppercase tracking-widest">
                            <Magnifier className="size-4" />
                            Active Requests: <span className="text-neutral-900">{filteredRequests.length}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Results Grid */}
            <section className="py-20 container mx-auto px-10">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-6">
                        <div className="size-16 border-[6px] border-neutral-100 border-t-red-600 rounded-full animate-spin"></div>
                        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-neutral-300">Scanning Database...</p>
                    </div>
                ) : filteredRequests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-40 text-center animate-in zoom-in duration-700">
                        <div className="size-32 bg-white rounded-full flex items-center justify-center shadow-xl border border-neutral-50 mb-10">
                            <Droplet className="size-12 text-neutral-100" />
                        </div>
                        <h3 className="text-2xl font-black text-neutral-900 uppercase tracking-tight">No Requests Found</h3>
                        <p className="text-neutral-400 text-sm font-bold mt-2 uppercase tracking-widest leading-relaxed">
                            There are currently no pending requests {filterGroup !== "all" && `for ${filterGroup}`}.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredRequests.map((req, idx) => (
                            <div
                                key={req._id}
                                className="group relative bg-white border border-neutral-100 rounded-[3rem] p-10 hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.06)] hover:border-neutral-200 transition-all duration-700 animate-in fade-in slide-in-from-bottom-8"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                {/* Blood Group Tag */}
                                <div className="absolute top-10 right-10 size-16 rounded-[1.5rem] bg-red-50 flex items-center justify-center border border-red-100 group-hover:scale-110 group-hover:bg-red-600 transition-all duration-500">
                                    <span className="text-red-600 font-black text-xs leading-none group-hover:text-white transition-colors">{req.bloodGroup}</span>
                                </div>

                                <div className="mb-12">
                                    <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-300 mb-4 italic transition-colors group-hover:text-red-400">
                                        Active Recipient
                                    </div>
                                    <h4 className="text-3xl font-black text-neutral-900 tracking-tighter leading-none group-hover:translate-x-1 transition-transform">
                                        {req.recipientName}
                                    </h4>
                                </div>

                                <div className="space-y-8 mb-12">
                                    <div className="flex items-start gap-6">
                                        <div className="size-12 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:text-blue-500 transition-colors">
                                            <MapPin className="size-6" />
                                        </div>
                                        <div>
                                            <p className="text-[16px] font-black text-neutral-800 leading-tight">{req.hospitalName}</p>
                                            <p className="text-[11px] font-bold text-neutral-400 mt-1 uppercase tracking-tight italic">
                                                {req.recipientUpazila}, {req.recipientDistrict}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-6">
                                        <div className="size-12 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:text-amber-500 transition-colors">
                                            <Clock className="size-6" />
                                        </div>
                                        <div>
                                            <p className="text-[16px] font-black text-neutral-800 leading-tight">{req.donationDate}</p>
                                            <p className="text-[11px] font-bold text-neutral-400 mt-1 uppercase tracking-tight">At {req.donationTime}</p>
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    href={`/dashboard/donation-request-details/${req._id}`}
                                    className="flex items-center justify-between w-full p-6 bg-neutral-900 rounded-[2rem] text-white hover:bg-red-600 transition-all duration-500 group/btn overflow-hidden relative"
                                >
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent)] opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                                    <span className="relative z-10 text-[11px] font-black uppercase tracking-[0.2em]">View Analysis</span>
                                    <Eye className="relative z-10 size-5 translate-x-2 opacity-0 group-hover/btn:translate-x-0 group-hover/btn:opacity-100 transition-all duration-500" />
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
