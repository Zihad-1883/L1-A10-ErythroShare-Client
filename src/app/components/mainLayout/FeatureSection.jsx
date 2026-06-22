import React from "react";

const FeatureSection = () => {
    return (
        <div className="bg-white py-24 px-6">
            <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left Side: Title and Info */}
                    <div className="text-left">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                            Why ErythroShare?
                        </h2>
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-gray-800">Donor Safety</h3>
                            <p className="text-gray-600 leading-relaxed max-w-md">
                                We ensure every donation meets strict medical standards,
                                prioritizing the health of both donor and recipient.
                            </p>
                        </div>
                    </div>

                    {/* Right Side: Feature Cards */}
                    <div className="flex flex-col gap-6 w-full max-w-lg mx-auto lg:mx-0">

                        {/* Card 1 */}
                        <div className="bg-[#f2f2f0] p-8 rounded-2xl relative overflow-hidden group hover:shadow-md transition">
                            <span className="absolute top-4 right-6 text-4xl font-bold text-gray-300 opacity-70">
                                01
                            </span>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Register</h3>
                            <p className="text-gray-600">
                                Create your profile in seconds and set your blood type and availability.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-[#f2f2f0] p-8 rounded-2xl relative overflow-hidden group hover:shadow-md transition">
                            <span className="absolute top-4 right-6 text-4xl font-bold text-gray-300 opacity-70">
                                02
                            </span>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Search Donors</h3>
                            <p className="text-gray-600">
                                Search for donors in your area and find the perfect match for your needs.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-[#f2f2f0] p-8 rounded-2xl relative overflow-hidden group hover:shadow-md transition">
                            <span className="absolute top-4 right-6 text-4xl font-bold text-gray-300 opacity-70">
                                03
                            </span>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Save Lives</h3>
                            <p className="text-gray-600">
                                Respond to a request and coordinate your donation through our secure platform.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeatureSection;
