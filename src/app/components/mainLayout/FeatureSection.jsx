"use client";
import React, { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";

/* ── Scroll-triggered fade-up wrapper ── */
const FadeUp = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.4, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
};

const FEATURES = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Verified & Safe",
    desc: "Every donor profile is verified. Medical standards and privacy are our top priorities.",
    color: "from-emerald-500/10 to-emerald-600/5",
    iconColor: "text-emerald-500",
    border: "border-emerald-500/10",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Instant Matching",
    desc: "Our smart system matches urgent requests with available donors in real time.",
    color: "from-amber-500/10 to-amber-600/5",
    iconColor: "text-amber-500",
    border: "border-amber-500/10",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Location Aware",
    desc: "Filter donors by district and upazila. Find help close to where you need it most.",
    color: "from-blue-500/10 to-blue-600/5",
    iconColor: "text-blue-500",
    border: "border-blue-500/10",
  },
];

const STEPS = [
  { num: "01", title: "Create Profile", desc: "Sign up and set your blood type, location, and availability in under 2 minutes." },
  { num: "02", title: "Search or Post", desc: "Search active donors nearby or post an urgent blood request visible to all donors." },
  { num: "03", title: "Connect & Donate", desc: "Coordinate directly and save a life through our secure, verified platform." },
];

const FeatureSection = () => {
  return (
    <>
      {/* ═══════════════════════════════════════
          SECTION 1 — Why ErythroShare (Features)
      ═══════════════════════════════════════ */}
      <section className="bg-white py-28 px-6">
        <div className="container mx-auto max-w-6xl">
          <FadeUp className="text-center mb-16">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-red-500 bg-red-50 px-4 py-1.5 rounded-full mb-4">
              Why Us
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
              Built for speed, safety,
              <br className="hidden md:block" /> and community.
            </h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto text-lg leading-relaxed">
              ErythroShare strips away the complexity of finding donors so you can focus on what matters.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <FadeUp key={f.title} delay={i * 0.12}>
                <div
                  className={`relative bg-gradient-to-br ${f.color} border ${f.border} rounded-3xl p-8 h-full group hover:-translate-y-1.5 transition-all duration-300 hover:shadow-xl`}
                >
                  {/* Number watermark */}
                  <span className="absolute top-5 right-6 text-5xl font-black text-gray-100 select-none">
                    0{i + 1}
                  </span>

                  <div className={`${f.iconColor} mb-5 w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center`}>
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 2 — How It Works (Steps)
      ═══════════════════════════════════════ */}
      <section className="bg-[#fafafa] py-28 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left — Text */}
            <FadeUp>
              <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-red-500 bg-red-50 px-4 py-1.5 rounded-full mb-4">
                How It Works
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">
                Three steps to save a life.
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-md">
                We&apos;ve made the donation process as simple as possible — because when it&apos;s urgent, every second counts.
              </p>
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-7 py-3.5 rounded-2xl transition-all shadow-lg hover:shadow-red-200 active:scale-95"
              >
                Get Started Free
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </FadeUp>

            {/* Right — Steps */}
            <div className="space-y-4">
              {STEPS.map((step, i) => (
                <FadeUp key={step.num} delay={i * 0.15}>
                  <div className="group flex items-start gap-5 bg-white border border-gray-100 rounded-2xl p-6 hover:border-red-100 hover:shadow-md transition-all duration-300">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-red-50 group-hover:bg-red-600 transition-colors flex items-center justify-center">
                      <span className="text-sm font-black text-red-600 group-hover:text-white transition-colors">
                        {step.num}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{step.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 3 — Stats / Impact 
      ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#0d0101] py-24 px-6">
        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-red-900/25 blur-[100px] rounded-full" />
        </div>

        <div className="relative z-10 container mx-auto max-w-5xl text-center">
          <FadeUp>
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-red-400 bg-red-900/30 px-4 py-1.5 rounded-full mb-4">
              Our Impact
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-16">
              Numbers that save lives.
            </h2>
          </FadeUp>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { num: "12,400+", label: "Active Donors", icon: "❤️" },
              { num: "3,400+", label: "Lives Saved", icon: "🩸" },
              { num: "64", label: "Districts", icon: "📍" },
              { num: "99%", label: "Match Rate", icon: "✓" },
            ].map((s, i) => (
              <FadeUp key={s.label} delay={i * 0.1}>
                <div className="bg-white/5 border border-white/8 rounded-2xl p-6 hover:bg-white/8 transition-colors">
                  <div className="text-3xl mb-3">{s.icon}</div>
                  <div className="text-3xl md:text-4xl font-black text-white mb-1">{s.num}</div>
                  <div className="text-white/40 text-sm font-medium">{s.label}</div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 4 — Blood Groups Info
      ═══════════════════════════════════════ */}
      <section className="bg-white py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <FadeUp className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-red-500 bg-red-50 px-4 py-1.5 rounded-full mb-4">
              Compatibility
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900">
              All blood types. One platform.
            </h2>
          </FadeUp>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"].map((bg, i) => {
              const isUniversal = bg === "O−";
              return (
                <FadeUp key={bg} delay={i * 0.05}>
                  <div
                    className={`flex flex-col items-center justify-center aspect-square rounded-2xl border font-black text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-default
                      ${isUniversal
                        ? "bg-red-600 text-white border-red-500 shadow-red-200"
                        : "bg-gray-50 text-gray-800 border-gray-100 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                      }`}
                  >
                    {bg}
                    {isUniversal && (
                      <span className="text-[9px] font-semibold text-red-100 mt-0.5 uppercase tracking-wider">Universal</span>
                    )}
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 5 — CTA Banner
      ═══════════════════════════════════════ */}
      <section className="bg-gradient-to-br from-red-600 via-red-700 to-rose-800 py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <FadeUp className="relative z-10 text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            Ready to save a life?
          </h2>
          <p className="text-red-100 text-lg mb-10 max-w-xl mx-auto">
            Join thousands of donors already on ErythroShare. Registration is free, fast, and it could change everything.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-white text-red-700 font-bold px-8 py-4 rounded-2xl text-base hover:bg-red-50 transition-all shadow-lg active:scale-95"
            >
              Register as Donor
            </Link>
            <Link
              href="/search"
              className="bg-red-800/50 backdrop-blur border border-white/20 text-white font-bold px-8 py-4 rounded-2xl text-base hover:bg-red-800/70 transition-all active:scale-95"
            >
              Find a Donor
            </Link>
          </div>
        </FadeUp>
      </section>
    </>
  );
};

export default FeatureSection;
