"use client"

import { Bars, Bell, Envelope, Gear, House, Magnifier, Person, Plus, Xmark } from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";

export function Sidebar() {
    const { data: session, isPending } = useSession();
    const role = session?.user?.role;
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const menuData = {
        donor: {
            main: [
                { icon: House, label: "Home", link: "/dashboard" },
                { icon: Person, label: "Profile", link: "/dashboard/profile" },
                { icon: Bars, label: "My Requests", link: "/dashboard/my-donation-requests" },
                { icon: Plus, label: "Create Request", link: "/dashboard/create-donation-request" },
            ],
        },
        admin: {
            main: [
                { icon: House, label: "Home", link: "/dashboard" },
                { icon: Person, label: "Profile", link: "/dashboard/profile" },
                { icon: Person, label: "All Users", link: "/dashboard/all-users" },
                { icon: Bars, label: "All Requests", link: "/dashboard/all-blood-donation-request" },
                { icon: Bars, label: "My Requests", link: "/dashboard/my-donation-requests" },
                { icon: Plus, label: "Create Request", link: "/dashboard/create-donation-request" },
            ],
        },
        volunteer: {
            main: [
                { icon: House, label: "Home", link: "/dashboard" },
                { icon: Person, label: "Profile", link: "/dashboard/profile" },
                { icon: Bars, label: "All Requests", link: "/dashboard/all-blood-donation-request" },
                { icon: Bars, label: "My Requests", link: "/dashboard/my-donation-requests" },
                { icon: Plus, label: "Create Request", link: "/dashboard/create-donation-request" },
            ],
        },
    };

    const currentMenu = role ? (menuData[role] || menuData.donor) : { main: [] };

    // Avatar: image or initial letter fallback
    const userImage = session?.user?.image;
    const userName = session?.user?.name || "";
    const userInitial = userName.charAt(0).toUpperCase();
    const userEmail = session?.user?.email || "";

    const NavLink = ({ item }) => {
        const isActive = pathname === item.link;
        return (
            <Link
                key={item.label}
                href={item.link}
                className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all border ${isActive
                    ? "bg-red-950/40 text-red-400 border-red-900/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                    : "text-white/60 border-transparent hover:bg-white/[0.04] hover:text-white"
                    }`}
                onClick={() => setIsOpen(false)}
            >
                <item.icon className={`size-5 transition-colors ${isActive ? "text-red-400" : "text-white/40 group-hover:text-red-400"
                    }`} />
                {item.label}
            </Link>
        );
    };

    const navLinks = (
        <nav className="flex flex-col gap-1.5 p-4 flex-1">
            <div className="mb-8 px-2 text-2xl font-black text-white flex items-center gap-2 select-none tracking-tight">
                <span className="animate-pulse text-red-600 drop-shadow-[0_0_8px_rgba(220,38,38,0.6)]">🩸</span>
                Erythro<span className="text-red-500">Share</span>
            </div>
            {isPending ? (
                <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-11 w-full animate-pulse rounded-xl bg-white/[0.04]" />
                    ))}
                </div>
            ) : (
                <>
                    {currentMenu.main?.map((item) => (
                        <NavLink key={item.label} item={item} />
                    ))}

                </>
            )}
        </nav>
    );

    const userCard = session?.user && (
        <div className="border-t border-white/10 p-4">
            <div className="flex items-center gap-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors px-4 py-3">
                {/* Avatar */}
                {userImage ? (
                    <div className="relative size-9 shrink-0 overflow-hidden rounded-full border-2 border-red-500/30">
                        <Image src={userImage} alt={userName} fill className="object-cover" />
                    </div>
                ) : (
                    <div className="size-9 shrink-0 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white font-black text-sm select-none shadow-[0_0_10px_rgba(239,68,68,0.25)]">
                        {userInitial}
                    </div>
                )}
                {/* Info */}
                <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-white truncate">{userName}</div>
                    <div className="text-[10px] font-black text-white/40 uppercase tracking-widest truncate">
                        {role}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex relative z-50">
            <div className="fixed top-4 left-4 z-50 md:hidden">
                <Button
                    className="rounded-full shadow-lg bg-white/5 backdrop-blur-md border border-white/10 text-white h-10 w-10 min-w-0 p-0 hover:bg-white/10"
                    onClick={() => setIsOpen(true)}
                >
                    <Bars className="size-5 text-red-500" />
                </Button>
            </div>

            <aside className="hidden h-[calc(100vh-2rem)] w-72 border border-white/10 bg-white/[0.02] backdrop-blur-2xl md:flex md:flex-col shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] rounded-[2rem] sticky top-4 overflow-y-auto">
                {navLinks}
                {userCard}
            </aside>

            <Drawer isOpen={isOpen} onOpenChange={setIsOpen}>
                <Drawer.Backdrop className="bg-black/60 backdrop-blur-sm" />
                <Drawer.Content placement="left" className="bg-[#0c0303] border-r border-white/10 w-[280px] p-0 text-white">
                    <Drawer.Dialog className="outline-none h-full">
                        <div className="flex flex-col h-full bg-[#0c0303]">
                            {/* Close Button Area */}
                            <div className="flex items-center justify-between p-4 border-b border-white/10">
                                <div className="text-xl font-bold text-white flex items-center gap-2 select-none">
                                    <span className="text-red-500">🩸</span> ErythroShare
                                </div>
                                <Button
                                    isIconOnly
                                    className="rounded-full bg-white/5 hover:bg-white/10 text-white h-9 w-9 min-w-0"
                                    variant="light"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Xmark className="size-5 text-neutral-300" />
                                </Button>
                            </div>

                            {/* Navigation Links */}
                            <div className="flex-1 overflow-y-auto pt-2">
                                <div className="[&_.mb-8]:mb-3">
                                    {navLinks}
                                </div>
                            </div>

                            {/* User card in drawer */}
                            {userCard}
                        </div>
                    </Drawer.Dialog>
                </Drawer.Content>
            </Drawer>
        </div>
    );
}


