import { FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

const ContactUs = () => {
    return (
        <div className="bg-[#f2f2f0] py-24 px-6">
            <div className="container mx-auto max-w-5xl">
                <div className="flex flex-col lg:flex-row gap-16 items-start">

                    <div className="w-full lg:w-3/5">
                        <h2 className="text-4xl font-bold text-gray-900 mb-10">Get in touch</h2>

                        <form className="space-y-6">
                            <div>
                                <label className="block text-gray-700 font-bold mb-2 text-sm uppercase tracking-wider">Name</label>
                                <input
                                    type="text"
                                    placeholder="Your full name"
                                    className="w-full p-4 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-800 transition"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-bold mb-2 text-sm uppercase tracking-wider">Email</label>
                                <input
                                    type="email"
                                    placeholder="email@address.com"
                                    className="w-full p-4 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-800 transition"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-bold mb-2 text-sm uppercase tracking-wider">Message</label>
                                <textarea
                                    placeholder="How can we help?"
                                    rows="4"
                                    className="w-full p-4 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-800 transition resize-none"
                                ></textarea>
                            </div>

                            <button
                                type="button"
                                className="bg-[#991b1b] text-white px-10 py-4 rounded-full font-bold hover:bg-red-900 transition shadow-lg active:scale-95"
                            >
                                Send request
                            </button>
                        </form>
                    </div>

                    <div className="hidden lg:block w-[1px] bg-gray-200 self-stretch"></div>

                    <div className="w-full lg:w-2/5 space-y-10 pt-10 lg:pt-20">

                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm">
                                <FaPhoneAlt className="text-[#991b1b]" size={20} />
                            </div>
                            <div>
                                <span className="block text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">Phone</span>
                                <p className="text-xl font-bold text-gray-800">+880 1234 567 890</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm">
                                <FaMapMarkerAlt className="text-[#991b1b]" size={22} />
                            </div>
                            <div>
                                <span className="block text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">Location</span>
                                <p className="text-xl font-bold text-gray-800">Dhaka, Bangladesh</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};


export default ContactUs;
