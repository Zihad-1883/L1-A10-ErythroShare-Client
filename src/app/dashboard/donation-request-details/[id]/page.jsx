"use client"

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getDonationRequestById, updateDonationRequest } from '@/lib/actions/server'
import { useSession } from '@/lib/auth-client'
import {
    Droplet,
    MapPin,
    Clock,
    House,
    Envelope,
    Person,
    Comment,
    CircleCheck,
    Xmark,
    ShieldCheck,
    Handset
} from "@gravity-ui/icons"
import { toast } from 'react-toastify'

const DonationRequestDetails = () => {
    const { id } = useParams()
    const router = useRouter()
    const { data: session } = useSession()
    if (!session) {
        router.push("/auth/login")
    }

    const [request, setRequest] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const data = await getDonationRequestById(id)
                setRequest(data)
            } catch (error) {
                console.error("Error fetching details:", error)
                toast.error("Failed to load request details")
            } finally {
                setIsLoading(false)
            }
        }
        fetchDetails()
    }, [id])

    const handleConfirmDonation = async () => {
        setIsUpdating(true)
        try {
            const result = await updateDonationRequest(id, {
                status: "inprogress",
                donorName: session.user.name,
                donorEmail: session.user.email
            })

            if (result.success) {
                toast.success("Thank you! Donation in progress.")
                setIsModalOpen(false)
                // Refresh local data
                setRequest(prev => ({
                    ...prev,
                    status: "inprogress",
                    donorName: session.user.name,
                    donorEmail: session.user.email
                }))
            } else {
                toast.error(result.message || "Failed to confirm donation")
            }
        } catch (error) {
            console.error("Confirmation error:", error)
            toast.error("An unexpected error occurred")
        } finally {
            setIsUpdating(false)
        }
    }

    if (isLoading) return (
        <div className="flex h-[60vh] items-center justify-center">
            <div className="size-12 border-4 border-white/10 border-t-red-650 rounded-full animate-spin"></div>
        </div>
    )

    if (!request) return (
        <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-white/40">
            <Xmark className="size-12" />
            <p className="font-black uppercase tracking-widest text-xs">Request Not Found</p>
        </div>
    )

    return (
        <div className="container mx-auto px-6 py-12 max-w-5xl">
            {/* Header Card */}
            <div className="bg-white/[0.02] border border-white/10 backdrop-blur-2xl rounded-[2.5rem] p-10 mb-10 overflow-hidden relative shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-950/40 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 opacity-30"></div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                    <div className="flex items-center gap-6">
                        <div className="size-20 rounded-2xl bg-red-950 border border-red-800 flex items-center justify-center text-red-500 shadow-xl shadow-red-950/20 group">
                            <Droplet className="size-10 group-hover:scale-110 transition-transform" />
                        </div>
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/60 border border-red-800/40 text-red-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-2">
                                {request.bloodGroup} Requested
                            </div>
                            <h1 className="text-4xl font-black text-white tracking-tighter leading-tight">
                                {request.recipientName}
                            </h1>
                        </div>
                    </div>

                    <div className={`px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] border flex items-center gap-3 ${request.status === 'pending'
                        ? 'bg-amber-950/40 border-amber-900/30 text-amber-400'
                        : request.status === 'done'
                        ? 'bg-emerald-950/40 border-emerald-900/30 text-emerald-450'
                        : 'bg-sky-950/40 border-sky-900/30 text-sky-405'
                        }`}>
                        <div className={`size-2 rounded-full animate-pulse ${request.status === 'pending' 
                            ? 'bg-amber-400' 
                            : request.status === 'done'
                            ? 'bg-emerald-400'
                            : 'bg-sky-405'
                            }`}></div>
                        {request.status}
                    </div>
                </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
                {/* Left Column: Essential Info */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl backdrop-blur-2xl">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30 mb-8 italic">Hospital & Location</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="flex items-start gap-6">
                                <div className="size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-red-400">
                                    <House className="size-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase text-white/40 font-black tracking-widest mb-1">Facility Name</p>
                                    <p className="text-lg font-black text-white leading-tight">{request.hospitalName}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6">
                                <div className="size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-red-400">
                                    <MapPin className="size-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase text-white/40 font-black tracking-widest mb-1">Precise Location</p>
                                    <p className="text-lg font-black text-white leading-tight">
                                        {request.recipientUpazila}, {request.recipientDistrict}
                                    </p>
                                </div>
                            </div>

                            <div className="md:col-span-2 flex items-start gap-6">
                                <div className="size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 flex-shrink-0">
                                    <MapPin className="size-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase text-white/40 font-black tracking-widest mb-1">Full Address</p>
                                    <p className="text-white/70 font-bold leading-relaxed">{request.fullAddress || "Address details not provided"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl backdrop-blur-2xl">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30 mb-8 italic">Requester Narrative</h3>
                        <div className="flex gap-6">
                            <div className="size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-red-400 flex-shrink-0">
                                <Comment className="size-6" />
                            </div>
                            <div className="bg-white/[0.01] border border-white/5 p-8 rounded-3xl flex-grow">
                                <p className="text-white/80 font-medium leading-relaxed italic">
                                    &quot;{request.requestedMessage || "I am in urgent need of blood. Please help save a life if you are eligible to donate."}&quot;
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Time & Donor */}
                <div className="space-y-10">
                    <div className="bg-gradient-to-br from-red-950 to-red-900 border border-red-800/30 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute -bottom-10 -right-10 size-40 bg-white/5 blur-[40px] rounded-full"></div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-10 italic">Timeline</h3>

                        <div className="space-y-8">
                            <div className="flex items-center gap-5">
                                <div className="size-12 rounded-2xl bg-white/10 flex items-center justify-center text-amber-400">
                                    <Clock className="size-6" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-black text-white leading-none">{request.donationDate}</p>
                                    <p className="text-[10px] text-white/40 mt-1 uppercase tracking-tight">At {request.donationTime}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-5">
                                <div className="size-12 rounded-2xl bg-white/10 flex items-center justify-center text-blue-400">
                                    <ShieldCheck className="size-6" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-black text-white leading-none">Security Check</p>
                                    <p className="text-[10px] text-white/40 mt-1 uppercase tracking-tight">Verified Request</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {request.status === 'inprogress' && (
                        <div className="bg-sky-950/40 border border-sky-900/30 rounded-[2.5rem] p-8 text-sky-400 animate-in fade-in slide-in-from-right-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-400 mb-6 italic">In-Charge Donor</h3>
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-white">
                                    <Person className="size-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-white">{request.donorName}</p>
                                    <p className="text-[10px] text-white/40 font-bold">{request.donorEmail}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Section */}
            <div className="flex flex-col items-center gap-8 py-10 border-t border-white/10">
                {request.status === 'pending' ? (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="group flex items-center gap-4 px-12 py-5 bg-gradient-to-r from-red-800 to-red-950 border border-red-750/30 rounded-2xl text-white text-lg font-black uppercase tracking-[0.2em] hover:from-white hover:to-white hover:text-red-950 hover:scale-[1.02] transition-all duration-500 shadow-2xl shadow-red-950/50"
                    >
                        <Droplet className="size-6 animate-pulse group-hover:scale-125 transition-transform" />
                        Initiate Donation
                    </button>
                ) : (
                    <div className="flex items-center gap-4 px-10 py-5 bg-white/[0.02] border border-white/10 rounded-2xl text-white/40 text-sm font-black uppercase tracking-[0.2em]">
                        <CircleCheck className="size-5 text-emerald-450" />
                        Donation Assistance Logic Inactive
                    </div>
                )}
                <p className="text-[11px] text-white/40 font-bold uppercase tracking-widest">
                    By clicking, you agree to fulfill the requirements of this life-saving protocol.
                </p>
            </div>

            {/* Donation Confirmation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
                    <div
                        className="absolute inset-0 bg-[#080202]/85 backdrop-blur-md animate-in fade-in duration-500"
                        onClick={() => !isUpdating && setIsModalOpen(false)}
                    ></div>

                    <div className="relative w-full max-w-xl bg-[#0f0404] border border-white/10 rounded-[2.5rem] p-12 shadow-2xl animate-in zoom-in-95 duration-500 text-white">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-8 right-8 size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-red-950 hover:text-red-400 transition-all duration-300"
                        >
                            <Xmark size={20} />
                        </button>

                        <div className="mb-12 text-center">
                            <div className="size-20 bg-red-950/40 border border-red-900/30 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-8 shadow-inner">
                                <Handset className="size-10" />
                            </div>
                            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Confirm Donation</h2>
                            <p className="text-white/60 text-sm font-medium mt-4">
                                You are about to take responsibility for this request. Please verify your contact details below.
                            </p>
                        </div>

                        <div className="space-y-8 mb-12">
                            <div className="group">
                                <label className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30 ml-4 mb-3 block italic transition-colors">
                                    Identifying Name
                                </label>
                                <div className="flex items-center gap-5 px-8 py-5 bg-white/5 border border-white/10 rounded-2xl text-white font-black">
                                    <Person className="size-5 text-white/40" />
                                    {session?.user.name}
                                </div>
                            </div>

                            <div className="group">
                                <label className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30 ml-4 mb-3 block italic transition-colors">
                                    Satellite Email
                                </label>
                                <div className="flex items-center gap-5 px-8 py-5 bg-white/5 border border-white/10 rounded-2xl text-white font-black">
                                    <Envelope className="size-5 text-white/40" />
                                    {session?.user.email}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                disabled={isUpdating}
                                className="flex-1 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest border border-white/10 text-white/60 hover:bg-white/5 transition-all"
                            >
                                Revert
                            </button>
                            <button
                                onClick={handleConfirmDonation}
                                disabled={isUpdating}
                                className="flex-[2] py-5 bg-red-950 border border-red-800 rounded-2xl text-[11px] font-black uppercase tracking-widest text-red-400 hover:bg-red-800 hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {isUpdating ? (
                                    <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <CircleCheck className="size-4" />
                                        Authorize Execution
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DonationRequestDetails
