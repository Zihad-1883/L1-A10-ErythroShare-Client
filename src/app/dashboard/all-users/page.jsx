"use client";

import React, { useEffect, useState, useRef } from "react";
import { getAllUsers, updateStatus, updateRole } from "@/lib/actions/server";
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
    admin: <CrownDiamond className="size-3 text-amber-500" />,
    donor: <Person className="size-3 text-blue-500" />,
    volunteer: <ShieldCheck className="size-3 text-green-500" />,
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
                className="p-2 text-neutral-400 hover:text-[#991b1b] hover:bg-neutral-100 rounded-full transition-all duration-300 outline-none"
            >
                <EllipsisVertical className="size-6" />
            </button>

            {isOpen && (
                <div
                    className="absolute right-0 mt-2 w-56 bg-white border border-neutral-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl py-3 px-2 z-[100] animate-in fade-in zoom-in-95 duration-200"
                >
                    <div className="flex flex-col gap-0.5">
                        {/* Status Toggle */}
                        {user.status === "active" ? (
                            <button
                                onClick={() => handleStatusUpdate("blocked")}
                                className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl hover:bg-red-50 transition-colors text-left group outline-none"
                            >
                                <Ban className="size-4 text-danger group-hover:scale-110 transition-transform" />
                                <span className="text-[11px] font-black uppercase tracking-[0.15em] text-danger">Block User</span>
                            </button>
                        ) : (
                            <button
                                onClick={() => handleStatusUpdate("active")}
                                className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl hover:bg-green-50 transition-colors text-left group outline-none"
                            >
                                <Check className="size-4 text-success group-hover:scale-110 transition-transform" />
                                <span className="text-[11px] font-black uppercase tracking-[0.15em] text-success">Unblock User</span>
                            </button>
                        )}

                        <div className="h-px bg-neutral-100 my-1.5 mx-2 opacity-50" />

                        {/* Role Management */}
                        {user.role !== "admin" && (
                            <button
                                onClick={() => handleRoleUpdate("admin")}
                                className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl hover:bg-neutral-50 transition-colors text-left group outline-none"
                            >
                                <CrownDiamond className="size-4 text-amber-500 group-hover:scale-110 transition-transform" />
                                <span className="text-[11px] font-black uppercase tracking-[0.15em] text-neutral-800">Make Admin</span>
                            </button>
                        )}

                        {user.role !== "volunteer" && (
                            <button
                                onClick={() => handleRoleUpdate("volunteer")}
                                className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl hover:bg-neutral-50 transition-colors text-left group outline-none"
                            >
                                <ShieldCheck className="size-4 text-green-500 group-hover:scale-110 transition-transform" />
                                <span className="text-[11px] font-black uppercase tracking-[0.15em] text-neutral-800">Make Volunteer</span>
                            </button>
                        )}

                        {user.role !== "donor" && (
                            <button
                                onClick={() => handleRoleUpdate("donor")}
                                className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl hover:bg-neutral-50 transition-colors text-left group outline-none"
                            >
                                <Person className="size-4 text-blue-500 group-hover:scale-110 transition-transform" />
                                <span className="text-[11px] font-black uppercase tracking-[0.15em] text-neutral-800">Make Donor</span>
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

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers();
        }, 0);
        return () => clearTimeout(timer);
    }, [fetchUsers]);

    return (
        <section className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Banner Area */}
            <div className="relative p-10 md:p-14 overflow-hidden rounded-[3rem] bg-[#991b1b] shadow-[0_30px_100px_-20px_rgba(153,27,27,0.3)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent)] z-0"></div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-5 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-white backdrop-blur-md">
                            <Pulse className="size-3 animate-pulse" />
                            System Administration
                        </div>
                        <h1 className="mt-6 text-5xl md:text-6xl font-black text-white tracking-tight leading-none">
                            Membership <br /><span className="text-red-200 uppercase text-4xl mt-2 block opacity-80">Directorate</span>
                        </h1>
                        <p className="max-w-md text-white/70 text-sm font-bold mt-4 leading-relaxed">
                            Full visibility into authentication status and administrative privileges for all registered members.
                        </p>
                    </div>

                    <div className="flex flex-col items-end">
                        <Select className="w-72" aria-label="Filter Users">
                            <SelectTrigger className="bg-white border-2 border-white text-[#991b1b] font-black uppercase tracking-widest text-[11px] h-16 rounded-2xl hover:bg-neutral-50 transition-all px-6 cursor-pointer outline-none ring-0 shadow-2xl">
                                <div className="flex items-center gap-3 w-full">
                                    <LayoutHeaderCells className="size-5" />
                                    <SelectValue placeholder="System Filter: All Users" className="font-black" />
                                </div>
                            </SelectTrigger>
                            <SelectPopover className="bg-white border-neutral-100 rounded-[1.5rem] shadow-2xl overflow-hidden mt-3 outline-none">
                                <ListBox className="p-3 outline-none min-w-64">
                                    <ListBoxItem key="all" className="font-black uppercase text-[10px] tracking-widest rounded-xl px-5 py-4 hover:bg-neutral-50 text-neutral-800 outline-none">Show All Users</ListBoxItem>
                                    <ListBoxItem key="active" className="font-black uppercase text-[10px] tracking-widest rounded-xl px-5 py-4 hover:bg-neutral-50 text-success outline-none">Active Users</ListBoxItem>
                                    <ListBoxItem key="blocked" className="font-black uppercase text-[10px] tracking-widest rounded-xl px-5 py-4 hover:bg-neutral-50 text-danger outline-none">Blocked Users</ListBoxItem>
                                </ListBox>
                            </SelectPopover>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Premium Table Area */}
            <div className="bg-white border border-neutral-100 rounded-[3rem] p-4 md:p-8 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="overflow-x-hidden">
                    <table className="w-full text-left border-separate border-spacing-y-4">
                        <thead>
                            <tr className="">
                                <th className="px-8 py-4 text-neutral-400 font-black uppercase text-[10px] tracking-[0.25em]">Member Info</th>
                                <th className="px-8 py-4 text-neutral-400 font-black uppercase text-[10px] tracking-[0.25em]">Contact identity</th>
                                <th className="px-8 py-4 text-neutral-400 font-black uppercase text-[10px] tracking-[0.25em]">Access Level</th>
                                <th className="px-8 py-4 text-neutral-400 font-black uppercase text-[10px] tracking-[0.25em]">Status</th>
                                <th className="px-8 py-4 text-neutral-400 font-black uppercase text-[10px] tracking-[0.25em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="py-32 text-center text-neutral-300">
                                        <div className="flex flex-col items-center gap-6">
                                            <div className="size-12 border-[5px] border-neutral-50 border-t-[#991b1b] rounded-full animate-spin" />
                                            <p className="font-black text-[11px] uppercase tracking-[0.3em]">Inventorying Records...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-32 text-center text-neutral-200">
                                        <div className="flex flex-col items-center">
                                            <div className="size-24 bg-neutral-50 rounded-full flex items-center justify-center mb-8 font-black text-4xl">∅</div>
                                            <p className="font-black text-neutral-400 uppercase tracking-[0.3em] text-[11px]">No users found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user._id}>
                                        <td className="px-8 py-6 bg-neutral-50/50 group-hover:bg-white border-y border-l border-neutral-100/50 group-hover:border-neutral-200 rounded-l-[2rem] transition-colors shadow-sm group-hover:shadow-md">
                                            <div className="flex items-center gap-5">
                                                <Avatar className="h-14 w-14 rounded-2xl overflow-hidden shadow-xl ring-4 ring-white group-hover:ring-red-50 transition-all duration-500">
                                                    <Avatar.Image src={user.image} alt={user.name} className="object-cover scale-110" />
                                                    <Avatar.Fallback className="bg-red-50 text-red-800 font-black text-sm uppercase">{user.name?.slice(0, 2)}</Avatar.Fallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <p className="font-black text-neutral-900 text-lg leading-none tracking-tight">{user.name}</p>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#991b1b]/40 mt-2">{user.bloodGroup || "Donor"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 bg-neutral-50/50 group-hover:bg-white border-y border-neutral-100/50 group-hover:border-neutral-200 transition-colors shadow-sm group-hover:shadow-md">
                                            <div className="flex items-center gap-3 text-neutral-500 hover:text-neutral-800 transition-colors">
                                                <Envelope className="size-4 opacity-40" />
                                                <span className="text-[13px] font-bold">{user.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 bg-neutral-50/50 group-hover:bg-white border-y border-neutral-100/50 group-hover:border-neutral-200 transition-colors shadow-sm group-hover:shadow-md">
                                            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white border border-neutral-100 shadow-sm">
                                                {roleIconMap[user.role?.toLowerCase()] || roleIconMap.donor}
                                                <span className="text-[11px] uppercase font-black tracking-widest text-neutral-800">{user.role}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 bg-neutral-50/50 group-hover:bg-white border-y border-neutral-100/50 group-hover:border-neutral-200 transition-colors shadow-sm group-hover:shadow-md">
                                            <Chip
                                                className="capitalize font-black border-none px-4 h-8 text-[10px] tracking-[0.2em] shadow-sm"
                                                color={statusColorMap[user.status] || "default"}
                                                size="md"
                                                variant="shadow"
                                            >
                                                {user.status || "active"}
                                            </Chip>
                                        </td>
                                        <td className="px-8 py-6 bg-neutral-50/50 group-hover:bg-white border-y border-r border-neutral-100/50 group-hover:border-neutral-200 rounded-r-[2rem] text-right transition-colors shadow-sm group-hover:shadow-md overflow-visible">
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