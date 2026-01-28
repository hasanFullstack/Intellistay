import React from 'react';
import { Building2, Users, BedDouble, ArrowRight } from 'lucide-react';

const AccommodationSection = () => {
  const features = [
    {
      icon: <Building2 size={24} className="text-white" />,
      title: "Hostel territory",
      desc: "Consequat interdum varius sit amet mattis"
    },
    {
      icon: <Users size={24} className="text-white" />,
      title: "Accommodates guests",
      desc: "Consequat interdum varius sit amet mattis"
    },
    {
      icon: <BedDouble size={24} className="text-white" />,
      title: "Grateful guests",
      desc: "Consequat interdum varius sit amet mattis"
    }
  ];

  return (
    <section className="w-full bg-slate-50 py-20 px-6 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 relative">

        {/* Left Content Column */}
        <div className="w-full lg:w-1/2 z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Find suitable budget accommodation
          </h2>
          <p className="text-slate-500 mb-12 max-w-lg leading-relaxed">
            Condimentum id venenatis a condimentum vitae sapien pellentesque habitant.
            At augue eget arcu dictum varius duis at consectetur.
          </p>

          {/* Icon List */}
          <div className="space-y-8">
            {features.map((item, idx) => (
              <div key={idx} className="flex items-start gap-5">
                <div className="bg-[#2b5a84] p-4 rounded-lg shadow-lg">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{item.title}</h3>
                  <p className="text-slate-500 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Image with Floating Card */}
        <div className="w-full lg:w-1/2 relative h-[500px] lg:h-[600px]">
          {/* Main Background Image */}
          <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://html.merku.love/hosteller/img/index/promo.webp"
              alt="Luxury living room"
              className="w-full h-full object-cover"
            />
          </div>

          {/* The Overlapping Floating Card */}
          <div className="absolute top-1/2 -left-12 lg:-left-20 -translate-y-1/2 bg-white p-10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] w-[280px] md:w-[320px] z-20">
            <h4 className="text-xl font-bold text-slate-900 leading-tight mb-4">
              Family Room with Private Bathroom
            </h4>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-bold text-slate-900">$149</span>
              <span className="text-slate-400 text-sm">/ 1 night</span>
            </div>
            <button className="w-full bg-blue-50 text-[#2b5a84] hover:bg-blue-100 font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
              See availability
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AccommodationSection;