import { useSession } from "@/lib/auth-client"
import React from "react"
import { Person, Bars, Bell } from "@gravity-ui/icons";

export default function DashboardHomePageData() {

    const { data: session } = useSession();
    const role = session?.user?.role

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
            <div className="rounded-[2.5rem] border border-neutral-100 bg-white p-8 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group">
                <div className="bg-neutral-50 p-5 rounded-3xl text-[#991b1b] mb-4 group-hover:scale-110 transition-transform">
                    <Person className="size-8" />
                </div>
                <div className="text-4xl font-black text-neutral-800">0</div>
                <div className="mt-1 text-xs font-bold text-neutral-400 uppercase tracking-widest">Total Donors</div>
            </div>
            <div className="rounded-[2.5rem] border border-neutral-100 bg-white p-8 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group">
                <div className="bg-neutral-50 p-5 rounded-3xl text-[#991b1b] mb-4 group-hover:scale-110 transition-transform">
                    <Bars className="size-8" />
                </div>
                <div className="text-4xl font-black text-neutral-800">$0</div>
                <div className="mt-1 text-xs font-bold text-neutral-400 uppercase tracking-widest">Total Funding</div>
            </div>
            <div className="rounded-[2.5rem] border border-neutral-100 bg-white p-8 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group">
                <div className="bg-neutral-50 p-5 rounded-3xl text-[#991b1b] mb-4 group-hover:scale-110 transition-transform">
                    <Bell className="size-8" />
                </div>
                <div className="text-4xl font-black text-neutral-800">0</div>
                <div className="mt-1 text-xs font-bold text-neutral-400 uppercase tracking-widest">Total Requests</div>
            </div>
        </div>
    );

    const DonorRecentRequests = (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <h2 className="text-2xl font-bold text-neutral-800">Recent Donation Requests</h2>
                <button className="text-sm font-bold text-[#991b1b] hover:underline">View All</button>
            </div>
            <div className="rounded-[2.5rem] border border-neutral-100 bg-white p-4 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs text-neutral-400 uppercase tracking-widest border-b border-neutral-50">
                                <th className="px-6 py-4 font-bold">Recipient</th>
                                <th className="px-6 py-4 font-bold">Location</th>
                                <th className="px-6 py-4 font-bold">Date/Time</th>
                                <th className="px-6 py-4 font-bold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50">
                            <tr>
                                <td colSpan="4" className="px-6 py-20 text-center text-neutral-400 font-medium italic">
                                    You haven&apos;t made any donation requests yet.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );


    return (
        <section className="space-y-10">
            {WelcomeSection}
            {role === "donor" ? DonorRecentRequests : AdminStats}
        </section>
    )
}
