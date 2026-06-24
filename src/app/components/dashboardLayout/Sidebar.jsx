"use client"

import { Bars, Bell, Envelope, Gear, House, Magnifier, Person, Xmark } from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

export function Sidebar() {
    const { data: session, isPending } = useSession();
    const role = session?.user?.role;
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const menuData = {
        donor: [
            { icon: House, label: "Home", link: "/dashboard" },
            { icon: Person, label: "Profile", link: "/dashboard/profile" },
            { icon: Bars, label: "My Requests", link: "/dashboard/my-donation-requests" },
            { icon: Envelope, label: "Create Request", link: "/dashboard/create-donation-request" },
        ],
        admin: [
            { icon: House, label: "Home", link: "/dashboard" },
            { icon: Person, label: "Profile", link: "/dashboard/profile" },
            { icon: Person, label: "All Users", link: "/dashboard/all-users" },
            { icon: Bars, label: "All Requests", link: "/dashboard/all-blood-donation-request" },
        ],
        volunteer: [
            { icon: House, label: "Home", link: "/dashboard" },
            { icon: Person, label: "Profile", link: "/dashboard/profile" },
            { icon: Bars, label: "All Requests", link: "/dashboard/all-blood-donation-request" },
        ],
    };

    const currentNavItems = role ? (menuData[role] || menuData.donor) : [];

    const navLinks = (
        <nav className="flex flex-col gap-2 p-4">
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
                currentNavItems.map((item) => {
                    const isActive = pathname === item.link;
                    return (
                        <Link
                            key={item.label}
                            href={item.link}
                            className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all hover:bg-red-50 hover:text-[#991b1b] ${
                                isActive 
                                ? "bg-red-50 text-[#991b1b]" 
                                : "text-foreground/80 hover:bg-neutral-100"
                            }`}
                            onClick={() => setIsOpen(false)}
                        >
                            <item.icon className={`size-5 transition-colors ${
                                isActive ? "text-[#991b1b]" : "text-muted group-hover:text-[#991b1b]"
                            }`} />
                            {item.label}
                        </Link>
                    );
                })
            )}
        </nav>
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
                                {/* We wrap currentNavItems mapping here directly to exclude the extra logo if desired, 
                                    but since navLinks is defined above, we can reuse it if we remove the logo from it 
                                    or just use it as is. Let's reuse navLinks but wrap it to hide the extra title in drawer. */}
                                <div className="[&_.mb-6]:hidden">
                                    {navLinks}
                                </div>
                            </div>
                        </div>
                    </Drawer.Dialog>
                </Drawer.Content>
            </Drawer>
        </div>
    );
}


