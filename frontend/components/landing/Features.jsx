import React from 'react';
import { Wifi, MapPin, Briefcase, CircleSlash, ArrowRight, Play } from 'lucide-react';

const FeaturesSection = () => {
    const features = [
        {
            icon: <Wifi className="text-blue-600" size={28} />,
            title: "Free available high speed WiFi"
        },
        {
            icon: <MapPin className="text-blue-600" size={28} />,
            title: "Convenient location in the center"
        },
        {
            icon: <Briefcase className="text-blue-600" size={28} />,
            title: "Free storage of luggage of any size"
        },
        {
            icon: <div className="border-2 border-blue-600 rounded-full w-7 h-7 flex items-center justify-center text-blue-600 font-bold text-xs">P</div>,
            title: "Parking place allocated to you"
        }
    ];

    return (
        <section className="w-full flex flex-col lg:flex-row min-h-[600px] bg-white overflow-hidden">
            {/* Left Content Side */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16">
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                    We have everything you need
                </h2>

                <p className="text-slate-500 text-base md:text-lg mb-12 max-w-xl leading-relaxed">
                    Posuere morbi leo urna molestie at elementum eu facilisis
                    sed. Diam phasellus vestibulum lorem sed risus ultricies
                    tristique
                </p>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 mb-12">
                    {features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-4">
                            <div className="flex-shrink-0 mt-1">
                                {feature.icon}
                            </div>
                            <span className="text-slate-700 text-sm md:text-base leading-snug">
                                {feature.title}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-8">
                    <button className="bg-[#2b5a84] hover:bg-[#1e4161] text-white px-8 py-3 rounded-md font-semibold transition-all">
                        Book now
                    </button>
                    <button className="flex items-center gap-2 text-[#2b5a84] font-semibold hover:gap-3 transition-all">
                        More about <ArrowRight size={18} />
                    </button>
                </div>
            </div>

            {/* Right Image/Video Side */}
            <div className="w-full lg:w-1/2 relative min-h-[400px]">
                <img
                    src="https://html.merku.love/hosteller/img/index/about.webp"
                    alt="People laughing and reading in hostel"
                    className="w-full h-full object-cover"
                />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-20 h-20 bg-white/30 backdrop-blur-sm border-2 border-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                        <Play className="text-white fill-white ml-1" size={32} />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;