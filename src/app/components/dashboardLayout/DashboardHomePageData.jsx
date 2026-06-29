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
            case "pending": return "text-amber-600 bg-amber-50 border-amber-100";
            case "inprogress": return "text-blue-600 bg-blue-50 border-blue-100";
            case "done": return "text-emerald-600 bg-emerald-50 border-emerald-100";
            case "canceled": return "text-rose-600 bg-rose-50 border-rose-100";
            default: return "default";
        }
    };

    const WelcomeSection = (
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#991b1b] p-8 shadow-2xl shadow-red-200 md:p-12">
            <div className="relative z-10 text-white">
                <span className="inline-block rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                    Dashboard Overview
                </span>
                <h1 className="mt-4 text-4xl font-extrabold md:text-5xl">
                    Welcome back, <span className="text-red-100">{session?.user?.name}</span>!
                </h1>
                <p className="mt-2 text-red-50/80">You are logged in as {role}.</p>
            </div>
            <div className="absolute -right-20 -top-20 size-64 rounded-full bg-white/10 blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 size-64 rounded-full bg-red-900/20 blur-3xl"></div>
        </div>
    );

    const AdminStats = (
        <div className="grid gap-6 md:grid-cols-3">
            {[
                { icon: Person, label: "Total Donors", value: allUsers.length },
                { icon: Bars, label: "Total Funding", value: "$0" },
                { icon: Bell, label: "Total Requests", value: requests.length }
            ].map((stat, idx) => (
                <div key={idx} className="rounded-[2.5rem] border border-neutral-100 bg-white p-8 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group">
                    <div className="bg-neutral-50 p-5 rounded-3xl text-[#991b1b] mb-4 group-hover:scale-110 transition-transform">
                        <stat.icon className="size-8" />
                    </div>
                    <div className="text-4xl font-black text-neutral-800">{stat.value}</div>
                    <div className="mt-1 text-xs font-bold text-neutral-400 uppercase tracking-widest">{stat.label}</div>
                </div>
            ))}
        </div>
    );

    const DonorRecentRequests = requests.length > 0 ? (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                    <div className="bg-red-50 p-2 rounded-xl text-red-600">
                        <Clock className="size-5" />
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-800 uppercase tracking-tight">Recent Donation Requests</h2>
                </div>
                <Link href="/dashboard/my-donation-requests" className="text-sm font-bold text-[#991b1b] hover:underline flex items-center gap-1">
                    View All <Bars className="size-4" />
                </Link>
            </div>

            <div className="rounded-[2.5rem] border border-neutral-100 bg-white p-4 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs text-neutral-400 uppercase tracking-[0.2em] border-b border-neutral-50 px-6">
                                <th className="px-6 py-5 font-black whitespace-nowrap">Recipient</th>
                                <th className="px-6 py-5 font-black whitespace-nowrap">Location</th>
                                <th className="px-6 py-5 font-black whitespace-nowrap text-center">Donor</th>
                                <th className="px-6 py-5 font-black whitespace-nowrap">Status</th>
                                <th className="px-6 py-5 font-black whitespace-nowrap text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50">
                            {requests.map((req) => (
                                <tr key={req._id} className="group hover:bg-neutral-50 transition-colors">
                                    <td className="px-6 py-6 font-bold text-neutral-900">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-full bg-red-50 flex items-center justify-center text-[#991b1b] font-bold text-xs">
                                                {req.bloodGroup}
                                            </div>
                                            <div>
                                                <div className="text-sm font-black whitespace-nowrap">{req.recipientName}</div>
                                                <div className="text-[10px] text-neutral-400 uppercase tracking-widest">{req.bloodGroup} Group</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-xs font-bold text-neutral-800">
                                                <MapPin className="size-3 text-red-400" />
                                                {req.recipientDistrict}, {req.recipientUpazila}
                                            </div>
                                            <div className="text-[10px] text-neutral-500 flex items-center gap-2">
                                                <Clock className="size-3" />
                                                {req.donationDate} at {req.donationTime}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        {req.status === "inprogress" ? (
                                            <div className="flex flex-col items-center gap-1">
                                                <div className="flex items-center gap-2 text-[11px] font-black text-neutral-800">
                                                    <Person className="size-3 text-blue-500" />
                                                    {req.donorName || "Assigned"}
                                                </div>
                                                <div className="text-[9px] text-neutral-400 font-bold italic">
                                                    {req.donorEmail || "N/A"}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-300 font-bold uppercase tracking-widest opacity-40">
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
                                                            className="p-2.5 rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm outline-none"
                                                        >
                                                            <Check className="size-4" />
                                                        </button>
                                                    </Tooltip>
                                                    <Tooltip content="Cancel Request" showArrow color="danger" size="sm" className="font-black uppercase text-[10px] tracking-wider">
                                                        <button
                                                            onClick={() => handleStatusChange(req._id, "canceled")}
                                                            className="p-2.5 rounded-xl border border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm outline-none"
                                                        >
                                                            <Xmark className="size-4" />
                                                        </button>
                                                    </Tooltip>
                                                </>
                                            )}

                                            <Tooltip content="View Details" showArrow size="sm" className="font-black uppercase text-[10px] tracking-wider">
                                                <Link
                                                    href={`/dashboard/donation-request-details/${req._id}`}
                                                    className="p-2.5 rounded-xl border border-neutral-100 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all text-neutral-400 outline-none"
                                                >
                                                    <Eye className="size-4" />
                                                </Link>
                                            </Tooltip>

                                            <Tooltip content="Edit Request" showArrow color="warning" size="sm" className="font-black uppercase text-[10px] tracking-wider">
                                                <Link
                                                    href={`/dashboard/edit-donation-request/${req._id}`}
                                                    className="p-2.5 rounded-xl border border-neutral-100 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-600 transition-all text-neutral-400 outline-none"
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
                                                    className="p-2.5 rounded-xl border border-neutral-100 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all text-neutral-400 outline-none"
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
                        className="bg-[#991b1b] text-white font-black px-12 py-7 rounded-2xl hover:bg-black transition-all shadow-xl shadow-red-100 uppercase tracking-widest text-xs"
                    >
                        View My All Requests
                    </Button></Link>
            </div>
        </div>
    ) : (
        <div className="rounded-[2.5rem] border border-neutral-100 bg-white p-12 shadow-sm flex flex-col items-center gap-4">
            <div className="size-16 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-200">
                <Bars className="size-8" />
            </div>
            <p className="text-neutral-400 font-bold italic text-lg">
                You haven&apos;t created any requests yet.
            </p>
            <Link href="/dashboard/create-donation-request">
                <Button className="bg-[#991b1b] text-white font-black px-8 py-6 rounded-2xl hover:bg-black transition-all shadow-xl shadow-red-100 uppercase tracking-widest text-xs mt-2">
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
                        className="absolute inset-0 bg-neutral-950/60 animate-in fade-in duration-300"
                        onClick={() => !isDeleting && setIsDeleteModalOpen(false)}
                    ></div>

                    <div className="relative w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl border border-neutral-100 animate-in zoom-in-95 duration-300">
                        <div className="mb-8 text-center">
                            <div className="size-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mx-auto mb-6">
                                <CircleInfo className="size-8" />
                            </div>
                            <h3 className="text-2xl font-black text-neutral-900 tracking-tight uppercase italic">Confirm Deletion</h3>
                            <p className="mt-2 text-neutral-500 text-sm font-bold">
                                This action is permanent. All data associated with this protocol will be purged from the live registry.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                disabled={isDeleting}
                                className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-neutral-100 text-neutral-400 hover:bg-neutral-50 transition-all font-sans"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex-1 py-4 bg-neutral-900 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-red-600 transition-all shadow-lg flex items-center justify-center gap-2 font-sans"
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
