import { useSession } from "@/lib/auth-client"
import React, { useEffect, useState } from "react"
import { Person, Bars, Bell, Pencil, TrashBin, Eye, Clock, MapPin, Check, Xmark, CircleInfo } from "@gravity-ui/icons";
import { serverQuery, getAllBloodDonationRequest, getAllUsers, updateDonationRequest, deleteDonationRequest } from "@/lib/actions/server";
import {
    Button,
    Chip,
    Tooltip,
    TooltipTrigger,
    TooltipContent
} from "@heroui/react";
import Link from "next/link";
import { toast } from "react-toastify";



export default function DashboardHomePageData() {
    const { data: session } = useSession();
    const role = session?.user?.role;
    const [requests, setRequests] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [requestToDelete, setRequestToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchData = React.useCallback(async () => {
        if (!session?.user?.email) {
            // Avoid synchronous state update
            setTimeout(() => setIsLoading(false), 0);
            return;
        };

        try {
            if (role === "donor") {
                const data = await serverQuery(`/dashboard/my-donation-requests/${session.user.email}`);
                setRequests(Array.isArray(data) ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3) : []);
            } else if (role === "admin" || role === "volunteer") {
                const data = await getAllBloodDonationRequest();
                setRequests(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [role, session]);

    useEffect(() => {
        let timer;
        if (role) {
            // Use setTimeout to ensure state updates happen in the next tick
            // and avoid "cascading renders" warning.
            timer = setTimeout(() => {
                fetchData();
            }, 0);
        } else if (session === null) {
            timer = setTimeout(() => setIsLoading(false), 0);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [role, session, fetchData]);

    const handleStatusChange = async (id, newStatus) => {
        try {
            const result = await updateDonationRequest(id, { status: newStatus });
            if (result.success) {
                toast.success(`Request marked as ${newStatus}`);
                fetchData();
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

    useEffect(() => {
        const fetchAllUsers = async () => {
            const data = await getAllUsers();
            const donors = data.filter(d => d.role === "donor")
            setAllUsers(donors);
            setIsLoading(false);
        }
        fetchAllUsers();
    }, []);

    // console.log(allUsers);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "pending": return "text-amber-400 bg-amber-950/40 border-amber-900/30";
            case "inprogress": return "text-sky-400 bg-sky-950/40 border-sky-900/30";
            case "done": return "text-emerald-400 bg-emerald-950/40 border-emerald-900/30";
            case "canceled": return "text-rose-400 bg-rose-950/40 border-rose-900/30";
            default: return "default";
        }
    };

    const WelcomeSection = (
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-red-950 via-[#991b1b] to-red-900 p-8 shadow-[0_20px_50px_rgba(153,27,27,0.3)] md:p-12 border border-red-800/30">
            <div className="relative z-10 text-white">
                <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-md border border-white/10">
                    Dashboard Overview
                </span>
                <h1 className="mt-4 text-4xl font-extrabold md:text-5xl tracking-tight">
                    Welcome back, <span className="text-red-200">{session?.user?.name}</span>!
                </h1>
                <p className="mt-2 text-white/70 font-medium">You are logged in as <span className="text-red-300 font-bold uppercase tracking-wider">{role}</span>.</p>
            </div>
            <div className="absolute -right-20 -top-20 size-64 rounded-full bg-white/5 blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 size-64 rounded-full bg-red-800/10 blur-3xl"></div>
        </div>
    );

    const AdminStats = (
        <div className="grid gap-6 md:grid-cols-3">
            {[
                { icon: Person, label: "Total Donors", value: allUsers.length },
                { icon: Bars, label: "Total Funding", value: "$0" },
                { icon: Bell, label: "Total Requests", value: requests.length }
            ].map((stat, idx) => (
                <div key={idx} className="rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-8 shadow-2xl hover:bg-white/[0.05] hover:border-red-500/30 transition-all flex flex-col items-center text-center group">
                    <div className="bg-red-500/10 p-5 rounded-3xl text-red-400 mb-4 group-hover:scale-110 transition-transform">
                        <stat.icon className="size-8" />
                    </div>
                    <div className="text-4xl font-black text-white">{stat.value}</div>
                    <div className="mt-1 text-xs font-bold text-white/40 uppercase tracking-widest">{stat.label}</div>
                </div>
            ))}
        </div>
    );

    const DonorRecentRequests = requests.length > 0 ? (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                    <div className="bg-red-500/10 p-2 rounded-xl text-red-400 border border-red-500/20">
                        <Clock className="size-5" />
                    </div>
                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Recent Donation Requests</h2>
                </div>
                <Link href="/dashboard/my-donation-requests" className="text-sm font-bold text-red-450 hover:text-red-300 transition-colors flex items-center gap-1">
                    View All <Bars className="size-4" />
                </Link>
            </div>

            <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-4 shadow-2xl overflow-hidden backdrop-blur-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs text-white/40 uppercase tracking-[0.2em] border-b border-white/5 px-6">
                                <th className="px-6 py-5 font-black whitespace-nowrap">Recipient</th>
                                <th className="px-6 py-5 font-black whitespace-nowrap">Location</th>
                                <th className="px-6 py-5 font-black whitespace-nowrap text-center">Donor</th>
                                <th className="px-6 py-5 font-black whitespace-nowrap">Status</th>
                                <th className="px-6 py-5 font-black whitespace-nowrap text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {requests.map((req) => (
                                <tr key={req._id} className="group hover:bg-white/[0.04] transition-colors">
                                    <td className="px-6 py-6 font-bold text-white">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-full bg-red-950/40 border border-red-900/30 flex items-center justify-center text-red-400 font-bold text-xs shadow-[0_0_10px_rgba(239,68,68,0.15)]">
                                                {req.bloodGroup}
                                            </div>
                                            <div>
                                                <div className="text-sm font-black whitespace-nowrap">{req.recipientName}</div>
                                                <div className="text-[10px] text-white/40 uppercase tracking-widest">{req.bloodGroup} Group</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-xs font-bold text-white/90">
                                                <MapPin className="size-3 text-red-400" />
                                                {req.recipientDistrict}, {req.recipientUpazila}
                                            </div>
                                            <div className="text-[10px] text-white/40 flex items-center gap-2">
                                                <Clock className="size-3" />
                                                {req.donationDate} at {req.donationTime}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        {req.status === "inprogress" ? (
                                            <div className="flex flex-col items-center gap-1">
                                                <div className="flex items-center gap-2 text-[11px] font-black text-white/90">
                                                    <Person className="size-3 text-blue-400" />
                                                    {req.donorName || "Assigned"}
                                                </div>
                                                <div className="text-[9px] text-white/40 font-bold italic">
                                                    {req.donorEmail || "N/A"}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center gap-2 text-[10px] text-white/20 font-bold uppercase tracking-widest opacity-40">
                                                <Person className="size-3" /> None
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-6">
                                        <Chip
                                            variant="flat"
                                            size="sm"
                                            className={`uppercase text-[9px] font-black tracking-widest px-2 ${getStatusColor(req.status)}`}
                                        >
                                            {req.status}
                                        </Chip>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <div className="flex justify-end gap-2 isolate">
                                            {req.status === "inprogress" && (
                                                <>
                                                    <Tooltip content="Mark as Done" showArrow color="success" size="sm" className="font-black uppercase text-[10px] tracking-wider">
                                                        <button
                                                            onClick={() => handleStatusChange(req._id, "done")}
                                                            className="p-2.5 rounded-xl border border-emerald-600/30 bg-emerald-950/40 text-emerald-450 hover:bg-emerald-600 hover:text-white transition-all shadow-sm outline-none"
                                                        >
                                                            <Check className="size-4" />
                                                        </button>
                                                    </Tooltip>
                                                    <Tooltip content="Cancel Request" showArrow color="danger" size="sm" className="font-black uppercase text-[10px] tracking-wider">
                                                        <button
                                                            onClick={() => handleStatusChange(req._id, "canceled")}
                                                            className="p-2.5 rounded-xl border border-rose-600/30 bg-rose-950/40 text-rose-450 hover:bg-rose-600 hover:text-white transition-all shadow-sm outline-none"
                                                        >
                                                            <Xmark className="size-4" />
                                                        </button>
                                                    </Tooltip>
                                                </>
                                            )}

                                            <Tooltip content="View Details" showArrow size="sm" className="font-black uppercase text-[10px] tracking-wider">
                                                <Link
                                                    href={`/dashboard/donation-request-details/${req._id}`}
                                                    className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-red-650 hover:text-white transition-all text-white/60 outline-none"
                                                >
                                                    <Eye className="size-4" />
                                                </Link>
                                            </Tooltip>

                                            <Tooltip content="Edit Request" showArrow color="warning" size="sm" className="font-black uppercase text-[10px] tracking-wider">
                                                <Link
                                                    href={`/dashboard/edit-donation-request/${req._id}`}
                                                    className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-amber-600 hover:text-white transition-all text-white/60 outline-none"
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
                                                    className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-red-600 hover:text-white transition-all text-white/60 outline-none"
                                                >
                                                    <TrashBin className="size-4" />
                                                </button>
                                            </Tooltip>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex justify-center pt-4">
                <Link href="/dashboard/my-donation-requests">
                    <Button
                        className="bg-red-600 text-white font-black px-12 py-7 rounded-2xl hover:bg-red-500 transition-all shadow-[0_0_35px_rgba(239,68,68,0.25)] uppercase tracking-widest text-xs"
                    >
                        View My All Requests
                    </Button></Link>
            </div>
        </div>
    ) : (
        <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-12 shadow-2xl flex flex-col items-center gap-4 text-center">
            <div className="size-16 rounded-full bg-white/5 flex items-center justify-center text-white/20">
                <Bars className="size-8" />
            </div>
            <p className="text-white/60 font-bold italic text-lg">
                You haven&apos;t created any requests yet.
            </p>
            <Link href="/dashboard/create-donation-request">
                <Button className="bg-red-600 text-white font-black px-8 py-6 rounded-2xl hover:bg-red-500 transition-all shadow-[0_0_35px_rgba(239,68,68,0.2)] uppercase tracking-widest text-xs mt-2">
                    Create Your First Request
                </Button>
            </Link>
        </div>
    );

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="size-12 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <section className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {WelcomeSection}
            {role === "donor" ? DonorRecentRequests : AdminStats}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm">
                    <div
                        className="absolute inset-0 bg-neutral-950/80 animate-in fade-in duration-355"
                        onClick={() => !isDeleting && setIsDeleteModalOpen(false)}
                    ></div>

                    <div className="relative w-full max-w-md bg-[#0f0404] rounded-[2.5rem] p-10 shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300 text-white">
                        <div className="mb-8 text-center">
                            <div className="size-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-6">
                                <CircleInfo className="size-8 animate-pulse" />
                            </div>
                            <h2 className="text-2xl font-black tracking-tight uppercase italic text-white leading-none">Confirm Deletion</h2>
                            <p className="mt-3 text-white/50 text-sm font-medium">
                                This action is permanent. All data associated with this protocol will be purged from the live registry.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                disabled={isDeleting}
                                className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 text-white/60 hover:bg-white/5 transition-all font-sans outline-none"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex-1 py-4 bg-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-red-500 transition-all shadow-[0_0_20px_rgba(220,38,38,0.2)] flex items-center justify-center gap-2 font-sans outline-none"
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
        </section>
    )
}
