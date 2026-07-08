"use client";

import React, { useEffect, useState, useCallback } from "react";
import { getAllBloodDonationRequest, deleteDonationRequest, updateDonationRequest } from "@/lib/actions/server";
import {
    Clock,
    MapPin,
    Person,
    EllipsisVertical,
    TrashBin,
    Check,
    Xmark,
    ArrowsRotateLeft,
    LayoutHeaderCells,
    Pulse
} from "@gravity-ui/icons";
import { toast } from "react-toastify";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

const statusConfig = {
    pending: { color: "text-amber-400 bg-amber-950/40 border-amber-900/30", label: "Pending" },
    inprogress: { color: "text-sky-400 bg-sky-950/40 border-sky-900/30", label: "In Progress" },
    done: { color: "text-emerald-400 bg-emerald-950/40 border-emerald-900/30", label: "Done" },
    canceled: { color: "text-rose-400 bg-rose-950/40 border-rose-900/30", label: "Canceled" },
};


const DonationActions = ({ request, onUpdate }) => {
    const { data: session } = useSession()
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = React.useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const handleStatusChange = async (newStatus) => {
        try {
            const result = await updateDonationRequest(request._id, { status: newStatus });
            if (result.success) {
                toast.success(`Request marked as ${newStatus}`);
                onUpdate();
                setIsOpen(false);
            } else {
                toast.error(result.message || "Failed to update status");
            }
        } catch (error) {
            toast.error("Status update failed");
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this request?")) return;
        try {
            const result = await deleteDonationRequest(request._id);
            if (result.success) {
                toast.success("Request deleted permanently");
                onUpdate();
            } else {
                toast.error(result.message || "Failed to delete");
            }
        } catch (error) {
            toast.error("Deletion failed");
        }
    };

    return (

        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-white/40 hover:text-red-400 hover:bg-white/5 rounded-full transition-all duration-300 outline-none"
            >
                <EllipsisVertical className="size-5" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#0f0404] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl py-2 px-1 z-[100] animate-in fade-in zoom-in-95 duration-200 text-white">
                    <div className="flex flex-col gap-0.5">
                        <Link
                            href={`/dashboard/donation-request-details/${request._id}`}
                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left group outline-none"
                        >
                            <LayoutHeaderCells className="size-4 text-white/40 group-hover:text-white" />
                            <span className="text-[11px] font-black uppercase tracking-wider text-white/80">View Details</span>
                        </Link>

                        <div className="h-px bg-white/10 my-1 mx-2" />

                        {request.status === "inprogress" && (
                            <>
                                <button
                                    onClick={() => handleStatusChange("done")}
                                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-emerald-950/30 transition-colors text-left group outline-none"
                                >
                                    <Check className="size-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">Mark Done</span>
                                </button>
                                <button
                                    onClick={() => handleStatusChange("canceled")}
                                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-rose-950/30 transition-colors text-left group outline-none"
                                >
                                    <Xmark className="size-4 text-rose-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-[11px] font-black uppercase tracking-wider text-rose-400">Cancel</span>
                                </button></>
                        )}

                        <div className="h-px bg-white/10 my-1 mx-2" />

                        {session?.user?.role === "admin" && (
                            <button
                                onClick={handleDelete}
                                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-red-950/30 transition-colors text-left group outline-none"
                            >
                                <TrashBin className="size-4 text-red-500 group-hover:scale-110 transition-transform" />
                                <span className="text-[11px] font-black uppercase tracking-wider text-red-400">Delete Request</span>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default function AllDonationRequestsPage() {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const handleRefresh = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getAllBloodDonationRequest();
            setRequests(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching requests:", error);
            toast.error("Failed to load records");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        let isMounted = true;

        const fetchInitialData = async () => {
            try {
                const data = await getAllBloodDonationRequest();
                if (isMounted) {
                    setRequests(Array.isArray(data) ? data : []);
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

        fetchInitialData();
        return () => { isMounted = false; };
    }, []);

    return (
        <section className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Premium Header */}
            <div className="relative p-10 md:p-14 overflow-hidden rounded-[3rem] bg-gradient-to-br from-red-950 via-[#991b1b] to-red-900 shadow-[0_30px_100px_-20px_rgba(153,27,27,0.3)] border border-red-800/30">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.05),transparent)] z-0"></div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-5 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-white backdrop-blur-md">
                            <Pulse className="size-3 animate-pulse text-red-500" />
                            Global Inventory Control
                        </div>
                        <h1 className="mt-6 text-5xl md:text-6xl font-black text-white tracking-tight leading-none">
                            Donation <br /><span className="text-red-200 uppercase text-4xl mt-2 block opacity-80">Ledger</span>
                        </h1>
                        <p className="max-w-md text-white/70 text-sm font-medium mt-4 leading-relaxed">
                            Full administrative oversight of every blood donation request issued across the system network.
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-4">
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-6 text-right">
                            <p className="text-white/60 text-[10px] uppercase font-black tracking-widest mb-1">Total Active Requests</p>
                            <p className="text-white text-4xl font-black tracking-tighter">{requests.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Table */}
            <div className="bg-white/[0.02] border border-white/10 rounded-[3rem] p-4 md:p-8 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)] overflow-hidden">
                <div className="flex items-center justify-between mb-8 px-4">
                    <div className="flex items-center gap-4">
                        <div className="size-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/80">
                            <LayoutHeaderCells className="size-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white tracking-tight leading-none uppercase italic">Master Request List</h2>
                            <p className="text-[10px] font-bold text-white/40 mt-1 uppercase tracking-widest">Real-time database sync active</p>
                        </div>
                    </div>

                    <button
                        onClick={handleRefresh}
                        className="p-3 bg-white/5 border border-white/10 hover:bg-red-600 hover:text-white rounded-2xl transition-all text-white/60 outline-none group animate-in fade-in"
                    >
                        <ArrowsRotateLeft className="size-5 group-active:rotate-180 transition-transform duration-500" />
                    </button>
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left border-separate border-spacing-y-4">
                        <thead>
                            <tr className="text-white/40 font-black uppercase text-[10px] tracking-[0.25em]">
                                <th className="px-8 py-4">Recipient Identity</th>
                                <th className="px-8 py-4">Surgical Location</th>
                                <th className="px-8 py-4">Schedule</th>
                                <th className="px-8 py-4">In-Charge Donor</th>
                                <th className="px-8 py-4 text-center">Status</th>
                                <th className="px-8 py-4 text-right">Control</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="py-32 text-center">
                                        <div className="flex flex-col items-center gap-6">
                                            <div className="size-14 border-[6px] border-white/5 border-t-red-600 rounded-full animate-spin" />
                                            <p className="font-black text-[11px] uppercase tracking-[0.4em] text-white/40">Synchronizing Data...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : requests.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-32 text-center text-white/20">
                                        <div className="flex flex-col items-center">
                                            <div className="size-28 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-8 font-black text-5xl">∅</div>
                                            <p className="font-black text-white/40 uppercase tracking-[0.4em] text-[11px]">No donation requests found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                requests.map((request) => (
                                    <tr key={request._id} className="group">
                                        <td className="px-8 py-7 bg-white/[0.02] group-hover:bg-white/[0.04] border-y border-l border-white/5 group-hover:border-white/10 rounded-l-[2.5rem] transition-all shadow-sm">
                                            <div className="flex items-center gap-5">
                                                <div className="h-14 w-1 flex-shrink-0 bg-red-900/30 rounded-full group-hover:bg-red-500 transition-colors" />
                                                <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
                                                    <span className="text-red-400 font-extrabold text-xs leading-none">{request.bloodGroup}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <p className="font-black text-white text-lg leading-none tracking-tight">{request.recipientName}</p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <Person className="size-3 text-white/35" />
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">Requested by {request.name}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-8 py-7 bg-white/[0.02] group-hover:bg-white/[0.04] border-y border-white/5 group-hover:border-white/10 transition-all shadow-sm">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-3">
                                                    <MapPin className="size-4 text-red-500 opacity-60" />
                                                    <span className="text-[13px] font-black text-white">{request.hospitalName}</span>
                                                </div>
                                                <span className="text-[10px] font-bold text-white/40 ml-7 uppercase tracking-tight">
                                                    {request.recipientUpazila}, {request.recipientDistrict}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-8 py-7 bg-white/[0.02] group-hover:bg-white/[0.04] border-y border-white/5 group-hover:border-white/10 transition-all shadow-sm">
                                            <div className="flex flex-col gap-2 text-white/60">
                                                <div className="flex items-center gap-3">
                                                    <Clock className="size-4 text-red-400 opacity-60" />
                                                    <span className="text-[13px] font-black text-white">{request.donationDate}</span>
                                                </div>
                                                <span className="text-[10px] font-bold text-white/40 ml-7 uppercase">{request.donationTime}</span>
                                            </div>
                                        </td>

                                        <td className="px-8 py-7 bg-white/[0.02] group-hover:bg-white/[0.04] border-y border-white/5 group-hover:border-white/10 transition-all shadow-sm">
                                            {request.status?.toLowerCase() === "inprogress" ? (
                                                <div className="flex flex-col gap-1.5 font-bold">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="size-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400">
                                                            <Person className="size-4" />
                                                        </div>
                                                        <span className="text-[13px] font-black text-white">{request.donorName || "Assigned Donor"}</span>
                                                    </div>
                                                    <span className="text-[10px] font-semibold text-white/40 ml-10 uppercase tracking-tight">
                                                        {request.donorEmail || "Contact Pending"}
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3 ml-2 opacity-30">
                                                    <Person className="size-4 text-white/40" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">No Donor Assigned</span>
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-8 py-7 bg-white/[0.02] group-hover:bg-white/[0.04] border-y border-white/5 group-hover:border-white/10 text-center transition-all shadow-sm">
                                            <span className={`inline-flex items-center px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] border ${statusConfig[request.status?.toLowerCase()]?.color || "text-white/60 bg-white/5 border-white/10"}`}>
                                                {statusConfig[request.status?.toLowerCase()]?.label || request.status}
                                            </span>
                                        </td>

                                        <td className="px-8 py-7 bg-white/[0.02] group-hover:bg-white/[0.04] border-y border-r border-white/5 group-hover:border-white/10 rounded-r-[2.5rem] text-right transition-all shadow-sm relative overflow-visible">
                                            <DonationActions request={request} onUpdate={handleRefresh} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}