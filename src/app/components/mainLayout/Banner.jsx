"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useAnimation, useInView } from "framer-motion";
import { getAllBloodDonationRequest } from "@/lib/actions/server";

/* ── Heart-rate / ECG path data ── */
const ECG_PATH =
  "M0,50 L60,50 L75,50 L85,10 L95,90 L105,10 L115,50 L125,50 L135,50 L145,30 L155,70 L160,50 L220,50 L240,50 L250,10 L260,90 L270,10 L280,50 L290,50 L340,50";

const HeartRateCanvas = () => (
  <svg
    viewBox="0 0 340 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full max-w-[520px]"
    aria-hidden="true"
  >
    {/* Static faded base line */}
    <path d={ECG_PATH} stroke="rgba(239,68,68,0.15)" strokeWidth="2" fill="none" />

    {/* Animated drawing line */}
    <motion.path
      d={ECG_PATH}
      stroke="#ef4444"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 2.2, ease: "easeInOut", delay: 0.6 }}
    />

    {/* Glowing dot at the end that keeps pulsing */}
    <motion.circle
      cx="340"
      cy="50"
      r="5"
      fill="#ef4444"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 1, 0.7, 1], scale: [0, 1.2, 0.9, 1] }}
      transition={{ duration: 0.6, delay: 2.7, repeat: Infinity, repeatDelay: 3 }}
    />
  </svg>
);

/* ── Latest Blood Request card (fetched from API) ── */
const LatestRequestCard = () => {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getAllBloodDonationRequest();
        if (!mounted) return;
        const arr = Array.isArray(data) ? data : [];
        // Pick the most recent pending request
        const pending = arr.filter((r) => r.status?.toLowerCase() === "pending");
        // Sort by creation date descending (use _id as proxy — MongoDB ObjectIds are time-ordered)
        pending.sort((a, b) => (b._id > a._id ? 1 : -1));
        setRequest(pending[0] ?? null);
      } catch {
        // silently fail — card just won't show
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <motion.div
      className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 z-10"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.5, ease: "backOut" }}
    >
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 w-64 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-white/60 text-xs font-semibold uppercase tracking-wider">Blood Request</span>
          <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold animate-pulse">
            Urgent
          </span>
        </div>

        {loading ? (
          /* Skeleton */
          <div className="space-y-3 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-white/10 rounded w-3/4" />
                <div className="h-2 bg-white/10 rounded w-1/2" />
              </div>
            </div>
            <div className="h-14 bg-white/10 rounded-xl" />
            <div className="h-2 bg-white/10 rounded w-full" />
            <div className="h-9 bg-white/10 rounded-xl" />
          </div>
        ) : request ? (
          <>
            {/* Avatar row */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                {request.recipientName?.charAt(0)?.toUpperCase() ?? "?"}
              </div>
              <div className="min-w-0">
                <div className="text-white text-sm font-bold truncate">{request.recipientName}</div>
                <div className="text-white/40 text-xs truncate">
                  {request.recipientUpazila}, {request.recipientDistrict}
                </div>
              </div>
            </div>

            {/* Blood type */}
            <div className="bg-red-600/20 border border-red-500/20 rounded-xl py-3 text-center">
              <div className="text-red-400 text-xs font-semibold uppercase tracking-wider mb-0.5">Needs</div>
              <div className="text-white font-black text-2xl">{request.bloodGroup}</div>
            </div>

            {/* Hospital */}
            <div className="flex items-start gap-2 text-white/50 text-xs">
              <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-red-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="truncate">{request.hospitalName}</span>
            </div>

            {/* Date */}
            {request.donationDate && (
              <div className="flex items-center gap-2 text-white/50 text-xs">
                <svg className="w-3.5 h-3.5 flex-shrink-0 text-red-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>{request.donationDate}{request.donationTime ? ` · ${request.donationTime}` : ""}</span>
              </div>
            )}

            {/* Mini ECG */}
            <svg viewBox="0 0 120 30" className="w-full opacity-60">
              <motion.path
                d="M0,15 L20,15 L25,5 L30,25 L35,5 L40,15 L60,15 L65,8 L70,22 L75,15 L120,15"
                stroke="#ef4444"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 1, ease: "easeInOut", repeat: Infinity, repeatDelay: 2 }}
              />
            </svg>

            <Link
              href={`/donation-requests`}
              className="block w-full text-center bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-2.5 rounded-xl transition-colors"
            >
              Respond Now →
            </Link>
          </>
        ) : (
          /* No requests state */
          <div className="text-center py-4 space-y-3">
            <div className="text-white/20 text-xs uppercase tracking-widest">No pending requests</div>
            <Link
              href="/donation-requests"
              className="block w-full text-center bg-white/10 hover:bg-white/15 text-white/70 text-sm font-semibold py-2.5 rounded-xl transition-colors"
            >
              View All Requests
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const Banner = () => {
  const BLOOD_GROUPS = ["A+", "B+", "O+", "AB-", "O-"];

  return (
    <section className="relative overflow-hidden bg-[#0d0101] min-h-screen flex items-center">

      {/* ── Background radial glows ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-red-900/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-red-800/10 blur-[100px]" />
        <div className="absolute top-[30%] left-[-5%] w-[300px] h-[300px] rounded-full bg-red-900/10 blur-[80px]" />
      </div>

      {/* ── Animated grid lines ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(239,68,68,1) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Floating blood-group pills ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {BLOOD_GROUPS.map((bg, i) => (
          <motion.div
            key={bg}
            className="absolute text-xs font-black text-red-500/30 border border-red-500/10 rounded-lg px-3 py-1 backdrop-blur-sm"
            style={{
              top: `${15 + i * 16}%`,
              left: i % 2 === 0 ? `${5 + i * 3}%` : undefined,
              right: i % 2 !== 0 ? `${5 + i * 2}%` : undefined,
            }}
            animate={{ y: [0, -12, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.7 }}
          >
            {bg}
          </motion.div>
        ))}
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 container mx-auto max-w-5xl px-6 py-28 md:py-36">

        {/* Live badge */}
        <motion.div
          className="inline-flex items-center gap-2 bg-red-950/60 border border-red-800/40 text-red-400 text-xs font-semibold px-4 py-2 rounded-full mb-8 backdrop-blur-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          Live blood requests in your area
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tight mb-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Someone nearby{" "}
          <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-400 to-red-600">
            needs blood
          </span>
          <br className="hidden md:block" /> today.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-white/50 text-lg md:text-xl max-w-xl leading-relaxed mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          A simple donation is a signal waiting to be answered — a heartbeat
          shared across the community. Every drop counts.
        </motion.p>

        {/* ── Heart-rate ECG animation ── */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <HeartRateCanvas />
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link
            href="/auth/signup"
            className="group relative inline-flex items-center gap-3 bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-2xl font-bold text-base transition-all duration-200 shadow-[0_0_30px_rgba(239,68,68,0.35)] hover:shadow-[0_0_50px_rgba(239,68,68,0.5)] active:scale-95"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
            </svg>
            Become a Donor
          </Link>

          <Link
            href="/search"
            className="inline-flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/80 hover:text-white px-8 py-4 rounded-2xl font-bold text-base transition-all duration-200 active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
            Search Donors
          </Link>
        </motion.div>

        {/* Trust stats */}
        <motion.div
          className="flex flex-wrap gap-8 mt-14 pt-10 border-t border-white/8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          {[
            { num: "12K+", label: "Active Donors" },
            { num: "3.4K", label: "Lives Saved" },
            { num: "64", label: "Districts Covered" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-black text-white">{s.num}</div>
              <div className="text-white/40 text-sm mt-0.5 font-medium">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Live Blood Request Card ── */}
      <LatestRequestCard />

    </section>
  );
};

export default Banner;
