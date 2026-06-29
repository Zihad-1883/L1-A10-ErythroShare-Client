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
            ],
            donor: [
                { icon: Bars, label: "My Requests", link: "/dashboard/my-donation-requests" },
                { icon: Plus, label: "Create Request", link: "/dashboard/create-donation-request" },
            ],
        },
        volunteer: {
            main: [
                { icon: House, label: "Home", link: "/dashboard" },
                { icon: Person, label: "Profile", link: "/dashboard/profile" },
                { icon: Bars, label: "All Requests", link: "/dashboard/all-blood-donation-request" },
            ],
            donor: [
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
                className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                    isActive
                        ? "bg-red-50 text-[#991b1b]"
                        : "text-foreground/80 hover:bg-neutral-100 hover:text-[#991b1b]"
                }`}
                onClick={() => setIsOpen(false)}
            >
                <item.icon className={`size-5 transition-colors ${
                    isActive ? "text-[#991b1b]" : "text-muted group-hover:text-[#991b1b]"
                }`} />
                {item.label}
            </Link>
        );
    };

    const navLinks = (
        <nav className="flex flex-col gap-1 p-4 flex-1">
            <div className="mb-6 px-2 text-xl font-bold text-[#991b1b]">
                ErythroShare
            </div>
            {isPending ? (
                <div className="space-y-2">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-11 w-full animate-pulse rounded-xl bg-neutral-100/80" />
                    ))}
                </div>
            ) : (
                <>
                    {/* Main nav items */}
                    {currentMenu.main?.map((item) => (
                        <NavLink key={item.label} item={item} />
                    ))}

                    {/* Donor Actions section for admin/volunteer */}
                    {currentMenu.donor && (
                        <>
                            <div className="mt-4 mb-2 px-2">
                                <div className="flex items-center gap-2">
                                    <div className="h-px flex-1 bg-neutral-100" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-neutral-400">
                                        Donor Actions
                                    </span>
                                    <div className="h-px flex-1 bg-neutral-100" />
                                </div>
                            </div>
                            {currentMenu.donor.map((item) => (
                                <NavLink key={item.label} item={item} />
                            ))}
                        </>
                    )}
                </>
            )}
        </nav>
    );

    const userCard = session?.user && (
        <div className="border-t border-neutral-100 p-4">
            <div className="flex items-center gap-3 rounded-2xl bg-neutral-50 px-4 py-3">
                {/* Avatar */}
                {userImage ? (
                    <div className="relative size-9 shrink-0 overflow-hidden rounded-full border-2 border-red-100">
                        <Image src={userImage} alt={userName} fill className="object-cover" />
                    </div>
                ) : (
                    <div className="size-9 shrink-0 rounded-full bg-[#991b1b] flex items-center justify-center text-white font-black text-sm select-none">
                        {userInitial}
                    </div>
                )}
                {/* Info */}
                <div className="min-w-0 flex-1">
                    <div className="text-sm font-black text-neutral-800 truncate">{userName}</div>
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest truncate">
                        {role}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex">
            <div className="fixed top-4 left-4 z-50 md:hidden">
                <Button
                    className="rounded-full shadow-lg bg-white/80 backdrop-blur-md border border-neutral-100 h-10 w-10 min-w-0 p-0"
                    onClick={() => setIsOpen(true)}
                >
                    <Bars className="size-5 text-[#991b1b]" />
                </Button>
            </div>

            <aside className="hidden h-screen w-72 border-r border-red-50 bg-white/50 backdrop-blur-xl md:flex md:flex-col shadow-[1px_0_10px_rgba(0,0,0,0.02)] sticky top-0 overflow-y-auto">
                {navLinks}
                {userCard}
            </aside>

            <Drawer isOpen={isOpen} onOpenChange={setIsOpen}>
                <Drawer.Backdrop />
                <Drawer.Content placement="left" className="bg-white/95 backdrop-blur-xl w-[280px] p-0">
                    <Drawer.Dialog className="outline-none h-full">
                        <div className="flex flex-col h-full">
                            {/* Close Button Area */}
                            <div className="flex items-center justify-between p-4 border-b border-neutral-100">
                                <div className="text-xl font-bold text-[#991b1b]">
                                    ErythroShare
                                </div>
                                <Button
                                    isIconOnly
                                    className="rounded-full bg-neutral-100/50 hover:bg-neutral-100 h-9 w-9 min-w-0"
                                    variant="light"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Xmark className="size-5 text-neutral-600" />
                                </Button>
                            </div>

                            {/* Navigation Links */}
                            <div className="flex-1 overflow-y-auto pt-2">
                                <div className="[&_.mb-6]:hidden">
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


