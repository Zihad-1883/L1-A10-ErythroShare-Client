"use client";

import React, { useState, useMemo, useEffect } from "react";
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
    Separator
} from "@heroui/react";
import { Pencil, FloppyDisk, Person, Envelope, MapPin, Droplet } from "@gravity-ui/icons";
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
        email: "",
        avatar: "",
        district: "",
        upazila: "",
        bloodGroup: ""
    });

    const [isInitialized, setIsInitialized] = useState(false);

    if (session?.user && !isInitialized) {
        setIsInitialized(true);
        setFormData({
            name: session.user.name || "",
            email: session.user.email || "",
            avatar: session.user.image || "",
            district: session.user.district || "",
            upazila: session.user.upazila || "",
            bloodGroup: session.user.bloodGroup || ""
        });
    }

    const filteredUpazilas = useMemo(() => {
        const districtId = districts.find(d => d.name === formData.district)?.id;
        if (!districtId) return [];
        return allUpazilas.filter(u => u.district_id === districtId);
    }, [formData.district]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            if (name === "district") newData.upazila = "";
            return newData;
        });
    };

    const handleSave = () => {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
    };

    const labelClasses = "text-[10px] font-black text-neutral-400 uppercase tracking-[0.15em] mb-2 block ml-1";

    return (
        <section className="min-h-screen py-16 px-4 bg-[#fafafa] relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-10%] size-[500px] bg-red-50 rounded-full blur-[120px] opacity-60 pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] size-[500px] bg-neutral-100 rounded-full blur-[120px] opacity-40 pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] rounded-[2.5rem] overflow-hidden bg-white/80 backdrop-blur-xl">
                    <CardHeader className="relative h-64 bg-neutral-900 border-b border-white/10 flex items-end justify-center pb-0 overflow-hidden">
                        {/* Mesh Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#991b1b] via-neutral-900 to-black opacity-90" />
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />

                        <div className="absolute top-6 right-8">
                            {!isEditing ? (
                                <Button
                                    className="bg-white/10 backdrop-blur-md text-white font-bold rounded-2xl px-6 border border-white/20 hover:bg-white/20 transition-all"
                                    onClick={() => setIsEditing(true)}
                                    startContent={<Pencil className="size-4" />}
                                >
                                    Edit Profile
                                </Button>
                            ) : (
                                <Button
                                    className="bg-white text-black font-black rounded-2xl px-8 shadow-xl hover:scale-105 transition-transform"
                                    onClick={handleSave}
                                    startContent={<FloppyDisk className="size-4" />}
                                >
                                    Save Changes
                                </Button>
                            )}
                        </div>

                        <div className="relative -mb-20 group">
                            <div className="absolute inset-0 bg-[#991b1b] rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                            <Avatar
                                src={formData.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                                className="w-40 h-40 text-large border-[6px] border-white shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                            />
                            {isEditing && (
                                <div className="absolute bottom-2 right-2">
                                    <div className="bg-white p-3 rounded-2xl shadow-2xl border border-neutral-100 cursor-pointer hover:bg-neutral-50 transition-colors">
                                        <Pencil className="size-5 text-[#991b1b]" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent className="pt-28 px-8 md:px-20 pb-20">
                        <div className="text-center mb-16">
                            <h1 className="text-4xl font-black text-neutral-900 tracking-tight">{formData.name || "User Name"}</h1>
                            <div className="flex items-center justify-center gap-3 mt-3">
                                <span className="bg-red-50 text-[#991b1b] px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-red-100">
                                    {session?.user?.role || "Member"}
                                </span>
                                <span className="bg-neutral-50 text-neutral-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-neutral-100">
                                    {formData.bloodGroup || "O+"} Blood Type
                                </span>
                            </div>
                        </div>

                        <Separator className="mb-16 opacity-10 bg-neutral-900" />

                        <form className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                            {/* Personal Info */}
                            <div className="space-y-10">
                                <h3 className="text-xs font-black text-neutral-900 uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                                    <div className="w-8 h-[2px] bg-[#991b1b]" /> Personal
                                </h3>

                                <div className="group">
                                    <label className={labelClasses}>Full Identity</label>
                                    <Input
                                        name="name"
                                        variant="bordered"
                                        isDisabled={!isEditing}
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        classNames={{
                                            input: "font-bold text-neutral-800",
                                            inputWrapper: "border-2 group-hover:border-neutral-400 transition-colors rounded-2xl h-14"
                                        }}
                                        placeholder="Full Name"
                                    />
                                </div>

                                <div className="group">
                                    <label className={labelClasses}>Contact Email</label>
                                    <Input
                                        name="email"
                                        variant="bordered"
                                        isDisabled={true}
                                        value={formData.email}
                                        classNames={{
                                            input: "font-bold text-neutral-500",
                                            inputWrapper: "border-2 rounded-2xl h-14 bg-neutral-50/50"
                                        }}
                                        startContent={<Envelope className="size-4 text-neutral-400" />}
                                    />
                                </div>

                                <Select
                                    isDisabled={!isEditing}
                                    selectedKey={formData.bloodGroup}
                                    onSelectionChange={(key) => handleSelectChange("bloodGroup", key)}
                                    className="w-full group"
                                >
                                    <label className={labelClasses}>Blood Group</label>
                                    <SelectTrigger
                                        className="border-2 rounded-2xl h-14 px-4 font-bold text-neutral-800 group-hover:border-neutral-400 transition-colors bg-white w-full flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Droplet className="size-4 text-[#991b1b]" />
                                            <SelectValue placeholder="Select Type" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectPopover className="bg-white/90 backdrop-blur-xl border border-neutral-100 shadow-2xl rounded-2xl mt-2 overflow-hidden min-w-[200px]">
                                        <ListBox className="p-2 outline-none">
                                            {bloodGroups.map(group => (
                                                <ListBoxItem key={group} id={group} className="px-4 py-3 rounded-xl cursor-pointer hover:bg-[#991b1b] hover:text-white transition-colors font-bold outline-none text-sm">
                                                    {group}
                                                </ListBoxItem>
                                            ))}
                                        </ListBox>
                                    </SelectPopover>
                                </Select>
                            </div>

                            {/* Location Info */}
                            <div className="space-y-10">
                                <h3 className="text-xs font-black text-neutral-900 uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                                    <div className="w-8 h-[2px] bg-red-300" /> Geography
                                </h3>

                                <Select
                                    isDisabled={!isEditing}
                                    selectedKey={formData.district}
                                    onSelectionChange={(key) => handleSelectChange("district", key)}
                                    className="w-full group"
                                >
                                    <label className={labelClasses}>Current District</label>
                                    <SelectTrigger
                                        className="border-2 rounded-2xl h-14 px-4 font-bold text-neutral-800 group-hover:border-neutral-400 transition-colors bg-white w-full flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <MapPin className="size-4 text-neutral-400" />
                                            <SelectValue placeholder="Select District" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectPopover className="bg-white/90 backdrop-blur-xl border border-neutral-100 shadow-2xl rounded-2xl mt-2 overflow-hidden min-w-[200px]">
                                        <ListBox className="p-2 outline-none max-h-60 overflow-y-auto">
                                            {districts.map(d => (
                                                <ListBoxItem key={d.name} id={d.name} className="px-4 py-3 rounded-xl cursor-pointer hover:bg-[#991b1b] hover:text-white transition-colors font-bold outline-none text-sm">
                                                    {d.name}
                                                </ListBoxItem>
                                            ))}
                                        </ListBox>
                                    </SelectPopover>
                                </Select>

                                <Select
                                    isDisabled={!isEditing || !formData.district}
                                    selectedKey={formData.upazila}
                                    onSelectionChange={(key) => handleSelectChange("upazila", key)}
                                    className="w-full group"
                                >
                                    <label className={labelClasses}>Local Upazila</label>
                                    <SelectTrigger
                                        className="border-2 rounded-2xl h-14 px-4 font-bold text-neutral-800 group-hover:border-neutral-400 transition-colors bg-white w-full flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <MapPin className="size-4 text-neutral-300" />
                                            <SelectValue placeholder="Select Upazila" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectPopover className="bg-white/90 backdrop-blur-xl border border-neutral-100 shadow-2xl rounded-2xl mt-2 overflow-hidden min-w-[200px]">
                                        <ListBox className="p-2 outline-none max-h-60 overflow-y-auto">
                                            {filteredUpazilas.map(u => (
                                                <ListBoxItem key={u.name} id={u.name} className="px-4 py-3 rounded-xl cursor-pointer hover:bg-[#991b1b] hover:text-white transition-colors font-bold outline-none text-sm">
                                                    {u.name}
                                                </ListBoxItem>
                                            ))}
                                        </ListBox>
                                    </SelectPopover>
                                </Select>

                                <div className="group">
                                    <label className={labelClasses}>Profile Image URL</label>
                                    <Input
                                        name="avatar"
                                        variant="bordered"
                                        isDisabled={!isEditing}
                                        value={formData.avatar}
                                        onChange={handleInputChange}
                                        classNames={{
                                            input: "font-bold text-neutral-800 text-xs",
                                            inputWrapper: "border-2 group-hover:border-neutral-400 transition-colors rounded-2xl h-14"
                                        }}
                                        placeholder="Paste image link"
                                    />
                                </div>
                            </div>
                        </form>

                        {isEditing && (
                            <div className="mt-20 flex justify-center gap-6 animate-in fade-in zoom-in-95 duration-500">
                                <Button
                                    variant="flat"
                                    className="font-black px-12 py-7 rounded-2xl border-2 border-neutral-100 hover:bg-neutral-100 transition-colors uppercase tracking-widest text-xs"
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="bg-black text-white font-black px-12 py-7 rounded-2xl hover:bg-[#991b1b] transition-all shadow-2xl shadow-neutral-200 uppercase tracking-widest text-xs"
                                    onClick={handleSave}
                                >
                                    Save Profile
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}

