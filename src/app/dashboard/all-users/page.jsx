"use client";

import React, { useEffect, useState, useRef } from "react";
import { getAllUsers, updateStatus, updateRole, filteredUsersByStatus } from "@/lib/actions/server";
import {
    Avatar,
    Chip,
    Select,
    SelectTrigger,
    SelectValue,
    SelectPopover,
    ListBox,
    ListBoxItem
} from "@heroui/react";
import { ShieldCheck, Person, EllipsisVertical, Ban, LayoutHeaderCells, Envelope, CrownDiamond, Pulse, Check } from "@gravity-ui/icons";
import { toast } from "react-toastify";

const statusColorMap = {
    active: "success",
    blocked: "danger",
};

const roleIconMap = {
    admin: <CrownDiamond className="size-3 text-amber-400" />,
    donor: <Person className="size-3 text-sky-400" />,
    volunteer: <ShieldCheck className="size-3 text-emerald-400" />,
};

const UserActions = ({ user, onUpdate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleStatusUpdate = async (newStatus) => {
        try {
            const result = await updateStatus({ id: user._id, status: newStatus });
            if (result.success) {
                toast.success(`User ${newStatus === 'blocked' ? 'blocked' : 'unblocked'} successfully`);
                setIsOpen(false);
                if (onUpdate) onUpdate();
            } else {
                toast.error(result.message || "Failed to update status");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const handleRoleUpdate = async (newRole) => {
        try {
            const result = await updateRole({ id: user._id, role: newRole });
            if (result.success) {
                toast.success(`User role updated to ${newRole}`);
                setIsOpen(false);
                if (onUpdate) onUpdate();
            } else {
                toast.error(result.message || "Failed to update role");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };


    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-white/40 hover:text-red-400 hover:bg-white/5 rounded-full transition-all duration-300 outline-none"
            >
                <EllipsisVertical className="size-6" />
            </button>

            {isOpen && (
                <div
                    className="absolute right-0 mt-2 w-56 bg-[#0f0404] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl py-3 px-2 z-[100] animate-in fade-in zoom-in-95 duration-200 text-white"
                >
                    <div className="flex flex-col gap-0.5">

                        {user.status === "active" ? (
                            <button
                                onClick={() => handleStatusUpdate("blocked")}
                                className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl hover:bg-red-950/30 transition-colors text-left group outline-none"
                            >
                                <Ban className="size-4 text-red-500 group-hover:scale-110 transition-transform" />
                                <span className="text-[11px] font-black uppercase tracking-[0.15em] text-red-400">Block User</span>
                            </button>
                        ) : (
                            <button
                                onClick={() => handleStatusUpdate("active")}
                                className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl hover:bg-emerald-950/30 transition-colors text-left group outline-none"
                            >
                                <Check className="size-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                                <span className="text-[11px] font-black uppercase tracking-[0.15em] text-emerald-400">Unblock User</span>
                            </button>
                        )}

                        <div className="h-px bg-white/10 my-1.5 mx-2" />

                        {user.role !== "admin" && (
                            <button
                                onClick={() => handleRoleUpdate("admin")}
                                className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl hover:bg-white/5 transition-colors text-left group outline-none text-white/80 hover:text-white"
                            >
                                <CrownDiamond className="size-4 text-amber-400 group-hover:scale-110 transition-transform" />
                                <span className="text-[11px] font-black uppercase tracking-[0.15em]">Make Admin</span>
                            </button>
                        )}

                        {user.role !== "volunteer" && (
                            <button
                                onClick={() => handleRoleUpdate("volunteer")}
                                className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl hover:bg-white/5 transition-colors text-left group outline-none text-white/80 hover:text-white"
                            >
                                <ShieldCheck className="size-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                                <span className="text-[11px] font-black uppercase tracking-[0.15em]">Make Volunteer</span>
                            </button>
                        )}

                        {user.role !== "donor" && (
                            <button
                                onClick={() => handleRoleUpdate("donor")}
                                className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl hover:bg-white/5 transition-colors text-left group outline-none text-white/80 hover:text-white"
                            >
                                <Person className="size-4 text-sky-400 group-hover:scale-110 transition-transform" />
                                <span className="text-[11px] font-black uppercase tracking-[0.15em]">Make Donor</span>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default function AllUsersPage() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUsers = React.useCallback(async () => {
        try {
            const data = await getAllUsers();
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to load users");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleFilteredUsers = async (status) => {
        setIsLoading(true);
        try {
            let data;
            if (status === "all") {
                data = await getAllUsers();
            } else {
                data = await filteredUsersByStatus(status);
            }
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error filtering users:", error);
            toast.error("Failed to filter users");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers();
        }, 0);
        return () => clearTimeout(timer);
    }, [fetchUsers]);

    return (
        <section className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Banner Area */}
            <div className="relative p-10 md:p-14 overflow-hidden rounded-[3rem] bg-gradient-to-br from-red-950 via-[#991b1b] to-red-900 shadow-[0_30px_100px_-20px_rgba(153,27,27,0.3)] border border-red-800/30">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.05),transparent)] z-0"></div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-5 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-white backdrop-blur-md">
                            <Pulse className="size-3 animate-pulse text-red-500" />
                            System Administration
                        </div>
                        <h1 className="mt-6 text-5xl md:text-6xl font-black text-white tracking-tight leading-none">
                            Membership <br /><span className="text-red-200 uppercase text-4xl mt-2 block opacity-80">Directorate</span>
                        </h1>
                        <p className="max-w-md text-white/70 text-sm font-medium mt-4 leading-relaxed">
                            Full visibility into authentication status and administrative privileges for all registered members.
                        </p>
                    </div>

                    <div className="flex flex-col items-end">
                        <Select className="w-72" aria-label="Filter Users">
                            <SelectTrigger className="bg-white/[0.04] border border-white/10 text-white font-black uppercase tracking-widest text-[11px] h-16 rounded-2xl hover:bg-white/[0.08] transition-all px-6 cursor-pointer outline-none ring-0 shadow-2xl">
                                <div className="flex items-center gap-3 w-full">
                                    <LayoutHeaderCells className="size-5 text-red-400" />
                                    <SelectValue placeholder="System Filter: All Users" className="font-black" />
                                </div>
                            </SelectTrigger>
                            <SelectPopover className="bg-[#0f0404] border border-white/10 rounded-[1.5rem] shadow-2xl overflow-hidden mt-3 outline-none">
                                <ListBox className="p-3 outline-none min-w-64">
                                    <ListBoxItem textValue="Show All Users" onClick={() => handleFilteredUsers("all")} key="all" className="font-black uppercase text-[10px] tracking-widest rounded-xl px-5 py-4 hover:bg-white/5 text-white outline-none text-left">Show All Users</ListBoxItem>
                                    <ListBoxItem textValue="Active Users" onClick={() => handleFilteredUsers("active")} key="active" className="font-black uppercase text-[10px] tracking-widest rounded-xl px-5 py-4 hover:bg-white/5 text-emerald-450 outline-none text-left">Active Users</ListBoxItem>
                                    <ListBoxItem textValue="Blocked Users" onClick={() => handleFilteredUsers("blocked")} key="blocked" className="font-black uppercase text-[10px] tracking-widest rounded-xl px-5 py-4 hover:bg-white/5 text-rose-450 outline-none text-left">Blocked Users</ListBoxItem>
                                </ListBox>
                            </SelectPopover>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Premium Table Area */}
            <div className="bg-white/[0.02] border border-white/10 rounded-[3rem] p-4 md:p-8 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-y-4">
                        <thead>
                            <tr className="">
                                <th className="px-8 py-4 text-white/40 font-black uppercase text-[10px] tracking-[0.25em]">Member Info</th>
                                <th className="px-8 py-4 text-white/40 font-black uppercase text-[10px] tracking-[0.25em]">Contact identity</th>
                                <th className="px-8 py-4 text-white/40 font-black uppercase text-[10px] tracking-[0.25em]">Access Level</th>
                                <th className="px-8 py-4 text-white/40 font-black uppercase text-[10px] tracking-[0.25em]">Status</th>
                                <th className="px-8 py-4 text-white/40 font-black uppercase text-[10px] tracking-[0.25em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="py-32 text-center text-white/40">
                                        <div className="flex flex-col items-center gap-6">
                                            <div className="size-12 border-[5px] border-white/10 border-t-red-650 rounded-full animate-spin" />
                                            <p className="font-black text-[11px] uppercase tracking-[0.3em]">Inventorying Records...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-32 text-center text-white/20">
                                        <div className="flex flex-col items-center">
                                            <div className="size-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-8 font-black text-4xl">∅</div>
                                            <p className="font-black uppercase tracking-[0.3em] text-[11px]">No users found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user._id} className="group">
                                        <td className="px-8 py-6 bg-white/[0.02] group-hover:bg-white/[0.04] border-y border-l border-white/5 group-hover:border-white/10 rounded-l-[2rem] transition-colors shadow-sm">
                                            <div className="flex items-center gap-5">
                                                <Avatar className="h-14 w-14 rounded-2xl overflow-hidden shadow-xl ring-4 ring-white/5 group-hover:ring-red-500/20 transition-all duration-500">
                                                    <Avatar.Image src={user.image} alt={user.name} className="object-cover scale-110" />
                                                    <Avatar.Fallback className="bg-red-950/40 text-red-400 font-black text-sm uppercase">{user.name?.slice(0, 2)}</Avatar.Fallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <p className="font-black text-white text-lg leading-none tracking-tight">{user.name}</p>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-red-400/50 mt-2">{user.bloodGroup || "Donor"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 bg-white/[0.02] group-hover:bg-white/[0.04] border-y border-white/5 group-hover:border-white/10 transition-colors shadow-sm">
                                            <div className="flex items-center gap-3 text-white/60 hover:text-white transition-colors">
                                                <Envelope className="size-4 opacity-40 text-red-400" />
                                                <span className="text-[13px] font-bold">{user.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 bg-white/[0.02] group-hover:bg-white/[0.04] border-y border-white/5 group-hover:border-white/10 transition-colors shadow-sm">
                                            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 shadow-sm text-white">
                                                {roleIconMap[user.role?.toLowerCase()] || roleIconMap.donor}
                                                <span className="text-[11px] uppercase font-black tracking-widest">{user.role}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 bg-white/[0.02] group-hover:bg-white/[0.04] border-y border-white/5 group-hover:border-white/10 transition-colors shadow-sm">
                                            <Chip
                                                className="capitalize font-black border-none px-4 h-8 text-[10px] tracking-[0.2em] shadow-sm"
                                                color={statusColorMap[user.status] || "default"}
                                                size="md"
                                                variant="flat"
                                            >
                                                {user.status || "active"}
                                            </Chip>
                                        </td>
                                        <td className="px-8 py-6 bg-white/[0.02] group-hover:bg-white/[0.04] border-y border-r border-white/5 group-hover:border-white/10 rounded-r-[2rem] text-right transition-colors shadow-sm overflow-visible">
                                            <UserActions user={user} onUpdate={fetchUsers} />
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