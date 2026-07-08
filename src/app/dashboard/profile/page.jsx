"use client";
import Image from "next/image";


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
    Card,
    CardContent
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
import { profileUpdate } from "@/lib/actions/server";
import uploadImage from "@/lib/uploadImage";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const districts = districtsData[2]?.data || [];
const allUpazilas = upazilasData[2]?.data || [];

export default function ProfilePage() {
    const { data: session } = useSession();
    // console.log(session?.user?.image)
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [imageFile, setImageFile] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        image: "",
        district: "",
        upazila: "",
        bloodGroup: ""
    });
    // console.log(formData);

    const startEditing = () => {
        setFormData({
            name: session?.user?.name || "",
            email: session?.user?.email || "",
            image: session?.user?.image || "",
            district: session?.user?.district || "",
            upazila: session?.user?.upazila || "",
            bloodGroup: session?.user?.bloodGroup || ""
        });
        setImageFile(null);
        setIsEditing(true);
    };

    const filteredUpazilas = useMemo(() => {
        const targetDistrict = isEditing ? formData.district : session?.user?.district;
        if (!targetDistrict) return [];
        const district = districts.find(d => d.name === targetDistrict);
        if (!district) return [];
        return allUpazilas.filter(u => u.district_id === district.id);
    }, [formData.district, session?.user?.district, isEditing]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        const selectedValue = value instanceof Set ? Array.from(value)[0] : (Array.isArray(value) ? value[0] : value);
        const finalValue = selectedValue?.toString() || "";

        setFormData(prev => {
            const newData = { ...prev, [name]: finalValue };
            if (name === "district") newData.upazila = "";
            return newData;
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            let currentFormData = { ...formData };

            if (imageFile) {
                const uploadedUrl = await uploadImage(imageFile);
                if (uploadedUrl) {
                    currentFormData.image = uploadedUrl;
                }
            }

            const result = await profileUpdate(currentFormData);
            if (result.success) {
                toast.success("Profile changes saved successfully!");
                setIsEditing(false);
                // Optionally reload to sync everything, but state update might be enough
                window.location.reload();
            } else {
                toast.error(result.message || "Failed to save profile");
            }
        } catch (error) {
            console.error("Save error:", error);
            toast.error("An error occurred while saving profile");
        } finally {
            setIsSaving(false);
        }
    };

    const labelClasses = "text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 block ml-1";

    return (
        <section className="min-h-screen py-8 md:py-12 px-4 relative overflow-hidden bg-transparent">
            {/* Glow effect */}
            <div className="absolute top-[-20%] right-[-10%] size-[800px] bg-red-950/10 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Header Section */}
                <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                    <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                        <div className="relative w-24 h-24 rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl bg-white/5 flex-shrink-0">
                            <Image
                                src={session?.user?.image || "https://plus.unsplash.com/premium_photo-1677252438411-9a930d7a5168?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                                alt="Profile"
                                className="object-cover"
                                fill
                                sizes="96px"
                            />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-tight leading-none">
                                {session?.user?.name || "Getting User Profile..."}
                            </h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-3">
                                <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full font-black uppercase text-[9px] tracking-widest">
                                    {session?.user?.role}
                                </span>
                                <span className="text-xs font-bold text-white/50 flex items-center gap-1.5 ml-2">
                                    <MapPin className="size-3 text-red-500" />
                                    {session?.user?.district || "Location pending..."}, {session?.user?.upazila}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-auto">
                        {!isEditing ? (
                            <Button
                                className="w-full md:w-auto bg-red-600 text-white font-black rounded-2xl px-8 h-12 shadow-[0_0_20px_rgba(220,38,38,0.25)] hover:bg-red-500 transition-all uppercase tracking-wider text-xs"
                                onClick={startEditing}
                                startContent={<Pencil className="size-4" />}
                            >
                                Modify Profile
                            </Button>
                        ) : (
                            <div className="flex gap-3">
                                <Button
                                    variant="bordered"
                                    className="flex-1 md:flex-none border border-white/10 hover:bg-white/5 font-bold rounded-2xl px-6 h-12 text-white"
                                    onClick={() => setIsEditing(false)}
                                    startContent={<Xmark className="size-4" />}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 md:flex-none bg-red-600 hover:bg-red-500 text-white font-black rounded-2xl px-10 h-12 shadow-[0_0_25px_rgba(220,38,38,0.3)] transition-all uppercase tracking-wider text-xs"
                                    onClick={handleSave}
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <FloppyDisk className="size-4" />
                                            Save Profile
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <Card className={`border border-white/10 shadow-2xl rounded-[2.5rem] md:rounded-[3rem] overflow-hidden bg-white/[0.02] backdrop-blur-2xl transition-all duration-500 ${isEditing ? "ring-2 ring-red-500/20" : ""}`}>
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
                                        input: "font-bold text-white placeholder:text-white/20",
                                        inputWrapper: `border rounded-3xl h-14 transition-all ${isEditing ? "bg-white/5 border-white/20 focus-within:border-red-500/50" : "bg-white/[0.01] border-white/5 text-white/55 cursor-not-allowed"}`
                                    }}
                                    startContent={<Person className="size-4 text-white/40" />}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className={labelClasses}>Email Address (Protected)</label>
                                <Input
                                    isDisabled={true}
                                    value={session?.user?.email || ""}
                                    classNames={{
                                        input: "font-bold text-white/40",
                                        inputWrapper: "border rounded-3xl h-14 bg-white/[0.01] border-white/5"
                                    }}
                                    startContent={<ShieldCheck className="size-4 text-white/30" />}
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
                                    <SelectTrigger className={`border rounded-3xl h-14 px-6 font-bold text-white transition-all ${isEditing ? "bg-white/5 border-white/20 hover:border-white/30 text-white" : "bg-white/[0.01] border-white/5 text-white/55 cursor-not-allowed"}`}>
                                        <div className="flex items-center gap-3">
                                            <Droplet className="size-4 text-red-500 animate-pulse" />
                                            <SelectValue placeholder="Unknown Group" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectPopover className="bg-[#0f0404] border border-white/10 shadow-2xl rounded-3xl mt-2 outline-none">
                                        <ListBox className="p-2 outline-none">
                                            {bloodGroups.map(group => (
                                                <ListBoxItem key={group} id={group} className="px-5 py-4 rounded-2xl hover:bg-red-900 hover:text-white text-white font-bold transition-all outline-none">
                                                    {group} Type
                                                </ListBoxItem>
                                            ))}
                                        </ListBox>
                                    </SelectPopover>
                                </Select>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className={labelClasses}>Avatar Source URL</label>
                                    <Input
                                        name="image"
                                        variant="bordered"
                                        isDisabled={!isEditing}
                                        value={isEditing ? formData.image : (session?.user?.image || "")}
                                        onChange={handleInputChange}
                                        classNames={{
                                            input: "font-mono text-[10px] text-white/60",
                                            inputWrapper: `border rounded-3xl h-14 transition-all ${isEditing ? "bg-white/5 border-white/20 focus-within:border-red-500/50" : "bg-white/[0.01] border-white/5 text-white/55 cursor-not-allowed"}`
                                        }}
                                        placeholder="Enter image link"
                                    />
                                </div>

                                {isEditing && (
                                    <div className="space-y-2">
                                        <label className={labelClasses}>Or Upload From PC</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setImageFile(e.target.files[0])}
                                            className="w-full p-3 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] text-sm text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-red-600 file:text-white hover:file:bg-red-500 transition-all cursor-pointer"
                                        />
                                        {imageFile && (
                                            <p className="text-[10px] font-bold text-emerald-400 ml-2">
                                                Selected: {imageFile.name}
                                            </p>
                                        )}
                                    </div>
                                )}
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
                                    <SelectTrigger className={`border rounded-3xl h-14 px-6 font-bold text-white transition-all ${isEditing ? "bg-white/5 border-white/20 hover:border-white/30 text-white" : "bg-white/[0.01] border-white/5 text-white/55 cursor-not-allowed"}`}>
                                        <div className="flex items-center gap-3">
                                            <MapPin className="size-4 text-white/40" />
                                            <SelectValue placeholder="No District" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectPopover className="bg-[#0f0404] border border-white/10 shadow-2xl rounded-3xl mt-2 overflow-hidden outline-none">
                                        <ListBox className="p-2 max-h-64 overflow-y-auto outline-none">
                                            {districts.map(d => (
                                                <ListBoxItem key={d.name} id={d.name} className="px-5 py-3 rounded-2xl hover:bg-red-900 hover:text-white text-white font-bold transition-all outline-none">
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
                                    isDisabled={!isEditing || !formData.district}
                                    placeholder={session?.user?.upazila}
                                    selectedKeys={isEditing ? (formData.upazila ? [formData.upazila] : []) : (session?.user?.upazila ? [session?.user?.upazila] : [])}
                                    onSelectionChange={(keys) => handleSelectChange("upazila", keys)}
                                    className="w-full"
                                >
                                    <SelectTrigger className={`border rounded-3xl h-14 px-6 font-bold text-white transition-all ${isEditing ? "bg-white/5 border-white/20 hover:border-white/30 text-white" : "bg-white/[0.01] border-white/5 text-white/55 cursor-not-allowed"}`}>
                                        <div className="flex items-center gap-3">
                                            <MapPin className="size-4 text-white/30" />
                                            <SelectValue placeholder="No Upazila" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectPopover className="bg-[#0f0404] border border-white/10 shadow-2xl rounded-3xl mt-2 overflow-hidden outline-none">
                                        <ListBox className="p-2 max-h-64 overflow-y-auto outline-none">
                                            {filteredUpazilas.map(u => (
                                                <ListBoxItem key={u.name} id={u.name} className="px-5 py-3 rounded-2xl hover:bg-red-900 hover:text-white text-white font-bold transition-all outline-none">
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
