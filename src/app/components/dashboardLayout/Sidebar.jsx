"use client"

import { Bars, Bell, Envelope, Gear, House, Magnifier, Person } from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import React, { useState } from "react";

export function Sidebar() {
    const { data: session } = useSession();
    const role = session?.user?.role || "donor";
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

    const currentNavItems = menuData[role] || menuData.donor;

    const navLinks = (
        <nav className="flex flex-col gap-2 p-4">
            <div className="mb-6 px-2 text-xl font-bold text-[#991b1b]">
                ErythroShare
            </div>
            {currentNavItems.map((item) => (
                <Link
                    key={item.label}
                    href={item.link}
                    className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-foreground/80 transition-all hover:bg-neutral-100 hover:text-[#991b1b]"
                    onClick={() => setIsOpen(false)}
                >
                    <item.icon className="size-5 text-muted transition-colors group-hover:text-[#991b1b]" />
                    {item.label}
                </Link>
            ))}
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
                <Drawer.Content placement="left" className="bg-white/95 backdrop-blur-xl w-[280px]">
                    <div className="h-full pt-8">
                        {navLinks}
                    </div>
                </Drawer.Content>
            </Drawer>
        </div>
    );
}


