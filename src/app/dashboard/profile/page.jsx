"use client";

import React, { useState, useMemo } from "react";
import { useSession } from "@/lib/auth-client";
import {
    Button,
    Input,
    Select,
    SelectTrigger,
    SelectValue,
    SelectPopover,
    ListBox,
    ListBoxItem,
    Avatar,
    Card,
    CardHeader,
    CardContent,
    Chip
} from "@heroui/react";
import {
    Pencil,
    FloppyDisk,
    Person,
    MapPin,
    Droplet,
    Xmark,
    ShieldCheck
} from "@gravity-ui/icons";
import districtsData from "@/data/district.json";
import upazilasData from "@/data/upazila.json";
import { toast } from "react-toastify";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const districts = districtsData[2]?.data || [];
const allUpazilas = upazilasData[2]?.data || [];

export default function ProfilePage() {
    const { data: session } = useSession();
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        image: "",
        district: "",
        upazila: "",
        bloodGroup: ""
    });

    const startEditing = () => {
        setFormData({
            name: session?.user?.name || "",
            image: session?.user?.image || "",
            district: session?.user?.district || "",
            upazila: session?.user?.upazila || "",
            bloodGroup: session?.user?.bloodGroup || ""
        });
        setIsEditing(true);
    };

    const filteredUpazilas = useMemo(() => {
        const targetDistrict = isEditing ? formData.district : session?.user?.district;
        const districtId = districts.find(d => d.name === targetDistrict)?.id;
        if (!districtId) return [];
        return allUpazilas.filter(u => u.district_id === districtId);
    }, [formData.district, session?.user?.district, isEditing]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        const selectedValue = Array.from(value)[0] || "";
        setFormData(prev => {
            const newData = { ...prev, [name]: selectedValue };
            if (name === "district") newData.upazila = "";
            return newData;
        });
    };

    const handleSave = (e) => {
        e.preventDefault();
        // Here you would normally send formData to your API
        toast.success("Profile changes saved to temporary state!");
        setIsEditing(false);
    };

    const labelClasses = "text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-2 block ml-1";

    return (
        <section className="min-h-screen py-8 md:py-12 px-4 bg-[#fafafa] relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] size-[800px] bg-red-50 rounded-full blur-[150px] opacity-60 pointer-events-none" />

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Header Section */}
                <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                    <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                        <Avatar
                            src={session?.user?.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                            className="w-24 h-24 border-4 border-white shadow-2xl"
                        />
                        <div>
                            <h1 className="text-3xl font-black text-neutral-900 tracking-tight">
                                {session?.user?.name || "Getting User Profile..."}
                            </h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-1">
                                <span className="bg-[#991b1b]/10 text-[#991b1b] font-black uppercase text-[9px]">
                                    {session?.user?.role}
                                </span>
                                <span className="text-xs font-bold text-neutral-400 flex items-center gap-1">
                                    {session?.user?.district || "Location pending..."}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-auto">
                        {!isEditing ? (
                            <Button
                                className="w-full md:w-auto bg-[#991b1b] text-white font-black rounded-2xl px-8 h-12 shadow-xl hover:scale-105"
                                onClick={startEditing}
                                startContent={<Pencil className="size-4" />}
                            >
                                Modify Profile
                            </Button>
                        ) : (
                            <div className="flex gap-3">
                                <Button
                                    variant="bordered"
                                    className="flex-1 md:flex-none border-2 font-bold rounded-2xl px-6 h-12"
                                    onClick={() => setIsEditing(false)}
                                    startContent={<Xmark className="size-4" />}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1 md:flex-none bg-black text-white font-black rounded-2xl px-10 h-12 shadow-2xl"
                                    onClick={handleSave}
                                    startContent={<FloppyDisk className="size-4" />}
                                >
                                    Save Profile
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <Card className={`border-none shadow-2xl rounded-[2.5rem] md:rounded-[3rem] overflow-hidden bg-white/80 backdrop-blur-2xl transition-all duration-500 ${isEditing ? "ring-2 ring-[#991b1b]/20" : ""}`}>
                    <CardContent className="p-8 md:p-16">
                        <form className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 md:gap-y-10">
                            {/* Personal Details */}
                            <div className="space-y-2">
                                <label className={labelClasses}>Full Legal Identity</label>
                                <Input
                                    name="name"
                                    variant="bordered"
                                    isDisabled={!isEditing}
                                    value={isEditing ? formData.name : (session?.user?.name || "")}
                                    onChange={handleInputChange}
                                    classNames={{
                                        input: "font-bold text-neutral-800",
                                        inputWrapper: `border-2 rounded-3xl h-14 transition-colors ${isEditing ? "bg-white border-[#991b1b]/30" : "bg-neutral-50/50"}`
                                    }}
                                    startContent={<Person className="size-4 text-neutral-400" />}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className={labelClasses}>Email Address (Protected)</label>
                                <Input
                                    isDisabled={true}
                                    value={session?.user?.email || ""}
                                    classNames={{
                                        input: "font-bold text-neutral-400",
                                        inputWrapper: "border-2 rounded-3xl h-14 bg-neutral-100/50 border-neutral-100"
                                    }}
                                    startContent={<ShieldCheck className="size-4 text-neutral-300" />}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className={labelClasses}>Blood Type Module</label>
                                <Select
                                    isDisabled={!isEditing}
                                    placeholder={session?.user?.bloodGroup}
                                    selectedKeys={isEditing ? (formData.bloodGroup ? [formData.bloodGroup] : []) : (session?.user?.bloodGroup ? [session?.user?.bloodGroup] : [])}
                                    onSelectionChange={(keys) => handleSelectChange("bloodGroup", keys)}
                                    className="w-full"
                                >
                                    <SelectTrigger className={`border-2 rounded-3xl h-14 px-6 font-bold text-neutral-800 transition-colors ${isEditing ? "bg-white border-[#991b1b]/30" : "bg-neutral-50/50"}`}>
                                        <div className="flex items-center gap-3">
                                            <Droplet className="size-4 text-[#991b1b]" />
                                            <SelectValue placeholder="Unknown Group" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectPopover className="bg-white/95 backdrop-blur-3xl border border-neutral-100 shadow-2xl rounded-3xl mt-2 outline-none">
                                        <ListBox className="p-2 outline-none">
                                            {bloodGroups.map(group => (
                                                <ListBoxItem key={group} id={group} className="px-5 py-4 rounded-2xl hover:bg-[#991b1b] hover:text-white font-bold transition-all outline-none">
                                                    {group} Type
                                                </ListBoxItem>
                                            ))}
                                        </ListBox>
                                    </SelectPopover>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className={labelClasses}>Avatar Source URL</label>
                                <Input
                                    name="avatar"
                                    variant="bordered"
                                    isDisabled={!isEditing}
                                    value={isEditing ? formData.image : (session?.user?.image || "")}
                                    onChange={handleInputChange}
                                    classNames={{
                                        input: "font-mono text-[10px] text-neutral-500",
                                        inputWrapper: `border-2 rounded-3xl h-14 transition-colors ${isEditing ? "bg-white border-[#991b1b]/30" : "bg-neutral-50/50"}`
                                    }}
                                    placeholder="Enter image link"
                                />
                            </div>

                            {/* Geography Section */}
                            <div className="space-y-2">
                                <label className={labelClasses}>State / District</label>
                                <Select
                                    isDisabled={!isEditing}
                                    placeholder={session?.user?.district}
                                    selectedKeys={isEditing ? (formData.district ? [formData.district] : []) : (session?.user?.district ? [session?.user?.district] : [])}
                                    onSelectionChange={(keys) => handleSelectChange("district", keys)}
                                    className="w-full"
                                >
                                    <SelectTrigger className={`border-2 rounded-3xl h-14 px-6 font-bold text-neutral-800 transition-colors ${isEditing ? "bg-white border-[#991b1b]/30" : "bg-neutral-50/50"}`}>
                                        <div className="flex items-center gap-3">
                                            <MapPin className="size-4 text-neutral-400" />
                                            <SelectValue placeholder="No District" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectPopover className="bg-white/95 backdrop-blur-3xl border border-neutral-100 shadow-2xl rounded-3xl mt-2 overflow-hidden outline-none">
                                        <ListBox className="p-2 max-h-64 overflow-y-auto outline-none">
                                            {districts.map(d => (
                                                <ListBoxItem key={d.name} id={d.name} className="px-5 py-3 rounded-2xl hover:bg-neutral-900 hover:text-white font-bold transition-all outline-none">
                                                    {d.name}
                                                </ListBoxItem>
                                            ))}
                                        </ListBox>
                                    </SelectPopover>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className={labelClasses}>Regional Upazila</label>
                                <Select
                                    isDisabled={!isEditing || (isEditing && !formData.district)}
                                    placeholder={session?.user?.upazila}
                                    selectedKeys={isEditing ? (formData.upazila ? [formData.upazila] : []) : (session?.user?.upazila ? [session?.user?.upazila] : [])}
                                    onSelectionChange={(keys) => handleSelectChange("upazila", keys)}
                                    className="w-full"
                                >
                                    <SelectTrigger className={`border-2 rounded-3xl h-14 px-6 font-bold text-neutral-800 transition-colors ${isEditing ? "bg-white border-[#991b1b]/30" : "bg-neutral-50/50"}`}>
                                        <div className="flex items-center gap-3">
                                            <MapPin className="size-4 text-neutral-300" />
                                            <SelectValue placeholder="No Upazila" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectPopover className="bg-white/95 backdrop-blur-3xl border border-neutral-100 shadow-2xl rounded-3xl mt-2 overflow-hidden outline-none">
                                        <ListBox className="p-2 max-h-64 overflow-y-auto outline-none">
                                            {filteredUpazilas.map(u => (
                                                <ListBoxItem key={u.name} id={u.name} className="px-5 py-3 rounded-2xl hover:bg-[#991b1b] hover:text-white font-bold transition-all outline-none">
                                                    {u.name}
                                                </ListBoxItem>
                                            ))}
                                        </ListBox>
                                    </SelectPopover>
                                </Select>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}

