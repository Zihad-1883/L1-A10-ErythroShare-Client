import { useSession } from "@/lib/auth-client"
import React, { useEffect, useState } from "react"
import { Person, Bars, Bell, Pencil, TrashBin, Eye, Clock, MapPin } from "@gravity-ui/icons";
import { serverQuery, getAllBloodDonationRequest, getAllUsers } from "@/lib/actions/server";
import {
    Button,
    Chip,
    Tooltip,
    TooltipTrigger,
    TooltipContent
} from "@heroui/react";
import Link from "next/link";

export default function DashboardHomePageData() {
    const { data: session } = useSession();
    const role = session?.user?.role;
    const [requests, setRequests] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!session?.user?.email) {
                setIsLoading(false);
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
        };

        if (role) {
            fetchData();
        } else if (session === null) {
            const timer = setTimeout(() => setIsLoading(false), 0);
            return () => clearTimeout(timer);
        }
    }, [role, session, session?.user?.email]);

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

    const DonorRecentRequests = requests.length > 0 && (
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
                                        <div className="flex justify-end gap-2">
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Button
                                                        as={Link}
                                                        href={`/dashboard/edit-donation-request/${req._id}`}
                                                        isIconOnly
                                                        variant="light"
                                                        size="sm"
                                                        className="text-neutral-400 hover:text-[#991b1b]"
                                                    >
                                                        <Pencil className="size-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent className="bg-white border text-[10px] font-bold p-2 rounded-lg shadow-xl">
                                                    Edit Request
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Button
                                                        isIconOnly
                                                        variant="light"
                                                        size="sm"
                                                        className="text-neutral-400 hover:text-red-600"
                                                    >
                                                        <TrashBin className="size-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent className="bg-white border text-[10px] font-bold p-2 rounded-lg shadow-xl">
                                                    Delete
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Button
                                                        as={Link}
                                                        href={`/dashboard/donation-request-details/${req._id}`}
                                                        isIconOnly
                                                        variant="light"
                                                        size="sm"
                                                        className="text-neutral-400 hover:text-blue-600"
                                                    >
                                                        <Eye className="size-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent className="bg-white border text-[10px] font-bold p-2 rounded-lg shadow-xl">
                                                    View Details
                                                </TooltipContent>
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
            {role === "donor" ? (requests.length > 0 ? DonorRecentRequests : null) : AdminStats}
        </section>
    )
}
