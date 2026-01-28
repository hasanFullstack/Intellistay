import React from 'react';
// import { Calendar, User, ChevronDown } from 'lucide-react';

const HostelHero = () => {
  return (
    <section className="ml-[10%]">
      <div className="relative w-full min-h-[600px] flex justify-center flex-col md:flex-row">
        {/* Left Content Side */}
        <div className='flex-1 flex items-center'>
          <div className=' bg-slate-50'>
            <div className="flex flex-col h-fit justify-center px-8 md:px-10 py-16">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
                Hosteller — amazing hostel for the free spirited traveler
              </h1>

              <div className="border-l-2 border-slate-900 pl-6 py-1">
                <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-md">
                  Egestas pretium aenean pharetra magna ac. Et tortor
                  consequat id porta nibh venenatis cras sed. Vel turpis
                  nunc eget lorem dolor sed.
                </p>
              </div>
            </div>
            <div className="ml-8 md:ml-10 w-full bg-white rounded-lg shadow-xl flex flex-col md:flex-row items-stretch overflow-hidden z-10">

              {/* Check-in */}
              <div className="flex-1 px-6 py-4 border-r border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">Check-in</span>
                <div className="flex items-center justify-between text-slate-400">
                  <div className="flex items-center gap-2">
                    {/* <Calendar size={18} /> */}
                    <span className="text-sm">Add date</span>
                  </div>
                  {/* <ChevronDown size={16} /> */}
                </div>
              </div>

              {/* Check-out */}
              <div className="flex-1 px-6 py-4 border-r border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">Check-out</span>
                <div className="flex items-center justify-between text-slate-400">
                  <div className="flex items-center gap-2">
                    {/* <Calendar size={18} /> */}
                    <span className="text-sm">Add date</span>
                  </div>
                  {/* <ChevronDown size={16} /> */}
                </div>
              </div>

              {/* Guests */}
              <div className="flex-1 px-6 py-4 hover:bg-slate-50 cursor-pointer transition-colors">
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">Guests</span>
                <div className="flex items-center gap-2 text-slate-400">
                  {/* <User size={18} /> */}
                  <span className="text-sm text-slate-600">1 adult</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Image Side */}
        <div className="relative flex-1 min-h-[400px]">
          <img
            src="https://html.merku.love/hosteller/img/index/hero.webp"
            alt="Cozy attic room with skylights"
            className="w-full h-full object-cover"
          />
          <button className="absolute rounded-r-20 bottom-21.5 left-0 bg-[#2b5a84] hover:bg-white hover:!translate-y-0 text-white px-12 py-20 h-23 w-[170px] font-semibold transition-colors">
            Search
          </button>
        </div>
      </div>
    </section>
  );
};

export default HostelHero;