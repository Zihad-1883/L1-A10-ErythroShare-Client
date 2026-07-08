"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { Bars, Clock, MapPin, Person, Pencil, TrashBin, Eye, CircleInfo, Check, Xmark } from "@gravity-ui/icons";
import { deleteDonationRequest, serverQuery, updateDonationRequest } from "@/lib/actions/server";
import { toast } from "react-toastify";
import Link from "next/link";
import { Tooltip } from "@heroui/react";

export default function MyDonationRequests() {
    const { data: session } = useSession();
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [requestToDelete, setRequestToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const loadRequests = React.useCallback(async () => {
        if (!session?.user?.email) return;

        try {
            const data = await serverQuery(`/dashboard/my-donation-requests/${session.user.email}`);
            setRequests(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching requests:", error);
        } finally {
            setIsLoading(false);
        }
    }, [session]);

    useEffect(() => {
        let isMounted = true;

        const init = async () => {
            if (session?.user?.email) {
                await loadRequests();
            } else if (session === null) {
                // Wrap in a microtask/timeout to avoid "synchronous setState in effect"
                setTimeout(() => {
                    if (isMounted) setIsLoading(false);
                }, 0);
            }
        };

        init();

        return () => {
            isMounted = false;
        };
    }, [session, loadRequests]);


    const handleStatusChange = async (id, newStatus) => {
        try {
            const result = await updateDonationRequest(id, { status: newStatus });
            if (result.success) {
                toast.success(`Request marked as ${newStatus}`);
                loadRequests();
            } else {
                toast.error(result.message || "Failed to update status");
            }
        } catch (error) {
            toast.error("Status update failed");
        }
    };

    const handleDelete = async () => {
        if (!requestToDelete) return;
        setIsDeleting(true);
        try {
            const res = await deleteDonationRequest(requestToDelete);
            if (res.success) {
                toast.success("Request deleted successfully");
                setRequests(prev => prev.filter(req => req._id !== requestToDelete));
                setIsDeleteModalOpen(false);
            } else {
                toast.error(res.message || "Failed to delete request");
            }
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("An unexpected error occurred");
        } finally {
            setIsDeleting(false);
            setRequestToDelete(null);
        }
    };

    // console.log(requests)

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "pending": return "text-amber-400 bg-amber-950/40 border-amber-900/30";
            case "inprogress": return "text-sky-400 bg-sky-950/40 border-sky-900/30";
            case "done": return "text-emerald-400 bg-emerald-950/40 border-emerald-900/30";
            case "canceled": return "text-rose-400 bg-rose-950/40 border-rose-900/30";
            default: return "text-white/60 bg-white/5 border-white/10";
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="size-12 animate-spin rounded-full border-4 border-white/10 border-t-red-650"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-red-950 via-[#991b1b] to-red-900 p-8 shadow-2xl border border-red-800/30 md:p-12">
                <div className="relative z-10 text-white">
                    <span className="inline-block rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                        Personal Records
                    </span>
                    <h1 className="mt-4 text-4xl font-extrabold md:text-5xl">
                        My Donation <span className="text-red-100 tracking-tight">Requests🩸</span>
                    </h1>
                    <p className="mt-2 text-red-200/80 font-medium">Manage and monitor all your blood donation requests in one place.</p>
                </div>
                <div className="absolute -right-20 -top-20 size-64 rounded-full bg-white/5 blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 size-64 rounded-full bg-red-900/10 blur-3xl"></div>
            </div>

            {/* Table Section */}
            <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-6 shadow-2xl overflow-hidden">
                <div className="mb-6 flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/5 border border-white/10 p-2 rounded-xl text-red-400">
                            <Bars className="size-5" />
                        </div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tight">Request History</h2>
                    </div>
                    <span className="text-sm font-bold text-white/40">Total: {requests.length}</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs text-white/40 uppercase tracking-[0.2em] border-b border-white/5">
                                <th className="px-6 py-5 font-black">Recipient</th>
                                <th className="px-6 py-5 font-black">Location</th>
                                <th className="px-6 py-5 font-black">Date & Time</th>
                                <th className="px-6 py-5 font-black whitespace-nowrap">Info</th>
                                <th className="px-6 py-5 font-black text-center">Status</th>
                                <th className="px-6 py-5 font-black text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {requests.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-24 text-center ">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="size-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/20">
                                                <Bars className="size-8" />
                                            </div>
                                            <p className="text-white/40 font-bold italic text-lg">
                                                You haven&apos;t created any requests yet.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                requests.map((req) => (
                                    <tr key={req._id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-6 font-bold text-white">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-red-400 font-bold text-xs shadow-md">
                                                    {req.bloodGroup}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-black">{req.recipientName}</div>
                                                    <div className="text-[10px] text-white/40 uppercase tracking-widest">{req.bloodGroup} Group</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 font-medium text-white/80">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-xs font-bold text-white">
                                                    <MapPin className="size-3 text-red-500" />
                                                    {req.hospitalName}
                                                </div>
                                                <div className="text-[10px] text-white/40 ml-5">
                                                    {req.recipientDistrict}, {req.recipientUpazila}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 font-medium text-white/80">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-xs font-bold text-white">
                                                    <Clock className="size-3 text-red-400" />
                                                    {req.donationDate}
                                                </div>
                                                <div className="text-[10px] text-white/40 ml-5 font-bold">
                                                    {req.donationTime}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 font-medium text-white/80">
                                            {req.status?.toLowerCase() === "inprogress" ? (
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                                                        <Person className="size-3 text-[#38bdf8]" />
                                                        {req.donorName || "Assigned"}
                                                    </div>
                                                    <div className="text-[10px] text-white/40 ml-5 italic">
                                                        {req.donorEmail || "N/A"}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-[10px] text-white/20 font-bold uppercase tracking-widest ml-1">
                                                    <Person className="size-3" /> None
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-6 text-center">
                                            <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(req.status)}`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <div className="flex justify-end gap-2 isolate">
                                                {req.status === "inprogress" && (
                                                    <>
                                                        <Tooltip content="Mark as Done" showArrow color="success" size="sm" className="font-black uppercase text-[10px] tracking-wider">
                                                            <button
                                                                onClick={() => handleStatusChange(req._id, "done")}
                                                                className="p-2.5 rounded-xl border border-emerald-990/30 bg-emerald-950/40 text-emerald-450 hover:bg-emerald-600 hover:text-white transition-all shadow-sm outline-none"
                                                            >
                                                                <Check className="size-4" />
                                                            </button>
                                                        </Tooltip>
                                                        <Tooltip content="Cancel Request" showArrow color="danger" size="sm" className="font-black uppercase text-[10px] tracking-wider">
                                                            <button
                                                                onClick={() => handleStatusChange(req._id, "canceled")}
                                                                className="p-2.5 rounded-xl border border-rose-990/30 bg-rose-955/40 text-rose-450 hover:bg-rose-600 hover:text-white transition-all shadow-sm outline-none"
                                                            >
                                                                <Xmark className="size-4" />
                                                            </button>
                                                        </Tooltip>
                                                    </>
                                                )}

                                                <Tooltip content="View Details" showArrow size="sm" className="font-black uppercase text-[10px] tracking-wider">
                                                    <Link
                                                        href={`/dashboard/donation-request-details/${req._id}`}
                                                        className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white transition-all text-white/60 outline-none"
                                                    >
                                                        <Eye className="size-4" />
                                                    </Link>
                                                </Tooltip>

                                                <Tooltip content="Edit Request" showArrow color="warning" size="sm" className="font-black uppercase text-[10px] tracking-wider">
                                                    <Link
                                                        href={`/dashboard/edit-donation-request/${req._id}`}
                                                        className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white transition-all text-white/60 outline-none"
                                                    >
                                                        <Pencil className="size-4" />
                                                    </Link>
                                                </Tooltip>

                                                <Tooltip content="Delete Request" showArrow color="danger" size="sm" className="font-black uppercase text-[10px] tracking-wider">
                                                    <button
                                                        onClick={() => {
                                                            setRequestToDelete(req._id);
                                                            setIsDeleteModalOpen(true);
                                                        }}
                                                        className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-red-950/40 hover:text-red-400 transition-all text-white/60 outline-none"
                                                    >
                                                        <TrashBin className="size-4" />
                                                    </button>
                                                </Tooltip>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm">
                    <div
                        className="absolute inset-0 bg-[#080202]/85 animate-in fade-in duration-300"
                        onClick={() => !isDeleting && setIsDeleteModalOpen(false)}
                    ></div>

                    <div className="relative w-full max-w-md bg-[#0f0404] rounded-[2.5rem] p-10 shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300 text-white">
                        <div className="mb-8 text-center">
                            <div className="size-16 bg-red-950/40 border border-red-900/30 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-6">
                                <CircleInfo className="size-8" />
                            </div>
                            <h3 className="text-2xl font-black text-white tracking-tight uppercase italic">Confirm Deletion</h3>
                            <p className="mt-2 text-white/60 text-sm font-medium">
                                This action is permanent. All data associated with this protocol will be purged from the live registry.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                disabled={isDeleting}
                                className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 text-white/70 hover:bg-white/5 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex-1 py-4 bg-red-950 border border-red-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-800 hover:text-white transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                {isDeleting ? (
                                    <div className="size-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <TrashBin className="size-3" />
                                        Delete Forever
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
