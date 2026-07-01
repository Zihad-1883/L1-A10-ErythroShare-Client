"use client";
import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { FaPhoneAlt, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";

const FadeUp = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 36 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.4, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
};

const INFO = [
  {
    icon: <FaPhoneAlt size={18} />,
    label: "Phone",
    value: "+880 1234 567 890",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: <FaEnvelope size={18} />,
    label: "Email",
    value: "support@erythroshare.com",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: <FaMapMarkerAlt size={20} />,
    label: "Location",
    value: "Dhaka, Bangladesh",
    color: "bg-red-50 text-red-600",
  },
];

const ContactUs = () => {
  return (
    <section className="bg-[#fafafa] py-28 px-6">
      <div className="container mx-auto max-w-6xl">

        {/* Heading */}
        <FadeUp className="text-center mb-16">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-red-500 bg-red-50 px-4 py-1.5 rounded-full mb-4">
            Contact
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Get in touch
          </h2>
          <p className="text-gray-400 mt-3 max-w-lg mx-auto text-base leading-relaxed">
            Have a question, partnership idea, or urgent request? We&apos;re here to help 24/7.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">

          {/* ── Form (3/5 wide) ── */}
          <FadeUp delay={0.1} className="lg:col-span-3">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-10">
              <form className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1.5 text-sm">Full Name</label>
                    <input
                      type="text"
                      placeholder="Your full name"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 transition text-sm text-gray-800 placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1.5 text-sm">Email</label>
                    <input
                      type="email"
                      placeholder="email@address.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 transition text-sm text-gray-800 placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1.5 text-sm">Subject</label>
                  <input
                    type="text"
                    placeholder="How can we help?"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 transition text-sm text-gray-800 placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1.5 text-sm">Message</label>
                  <textarea
                    placeholder="Tell us more..."
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 transition text-sm text-gray-800 placeholder:text-gray-400 resize-none"
                  />
                </div>

                <button
                  type="button"
                  className="w-full sm:w-auto inline-flex items-center gap-2.5 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3.5 rounded-2xl transition-all shadow-lg shadow-red-100 active:scale-95 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Send Message
                </button>
              </form>
            </div>
          </FadeUp>

          {/* ── Info cards (2/5 wide) ── */}
          <FadeUp delay={0.25} className="lg:col-span-2 space-y-4">
            {INFO.map((item) => (
              <div
                key={item.label}
                className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                  {item.icon}
                </div>
                <div>
                  <span className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-0.5">{item.label}</span>
                  <p className="text-gray-800 font-semibold text-sm">{item.value}</p>
                </div>
              </div>
            ))}

            {/* Social links */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">Follow us</p>
              <div className="flex gap-3">
                {["Facebook", "Twitter", "Instagram"].map((s) => (
                  <button
                    key={s}
                    className="flex-1 text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-red-50 hover:text-red-600 border border-gray-100 hover:border-red-100 py-2 rounded-xl transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick note — links to donation requests */}
            <Link
              href="/donation-requests"
              className="block bg-red-50 border border-red-100 rounded-2xl p-5 hover:bg-red-100/60 hover:border-red-200 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-100 group-hover:bg-red-200 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors">
                  <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
                  </svg>
                </div>
                <div>
                  <p className="text-red-800 font-semibold text-sm group-hover:text-red-900">Emergency request?</p>
                  <p className="text-red-600/70 text-xs mt-0.5 leading-relaxed">
                    Post directly on the platform for the fastest donor response. →
                  </p>
                </div>
              </div>
            </Link>
          </FadeUp>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
