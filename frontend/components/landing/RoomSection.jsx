import React from 'react';
import { User, Bed, ArrowRight } from 'lucide-react';

const RoomSection = () => {
  const rooms = [
    {
      id: 1,
      title: "Bed in 6-Bed Room with Shared Bathroom",
      price: "18",
      image: "https://html.merku.love/hosteller/img/about/01.webp",
      sleeps: "2 Sleeps",
      bedType: "1 bunk bed"
    },
    {
      id: 2,
      title: "Double Room with Private Bathroom",
      price: "35",
      image: "https://html.merku.love/hosteller/img/about/02.webp",
      sleeps: "2 Sleeps",
      bedType: "2 twin beds"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 bg-white font-sans">
      {/* Header Row */}
      <div className="flex justify-between items-end mb-10">
        <h2 className="text-4xl font-bold text-slate-900">Hostel rooms</h2>
        <button className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-sm font-medium transition-colors">
          View all rooms
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
            {/* Image Container */}
            <div className="relative h-64">
              <img 
                src={room.image} 
                alt={room.title} 
                className="w-full h-full object-cover"
              />
              {/* Price Tag */}
              <div className="absolute bottom-4 right-0 bg-white px-4 py-2 rounded-l-md shadow-md">
                <span className="text-xl font-bold text-slate-900">${room.price}</span>
                <span className="text-xs text-slate-500 ml-1">/ 1 night</span>
              </div>
            </div>

            {/* Content Container */}
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-slate-900 mb-4 leading-snug h-14">
                {room.title}
              </h3>
              
              <div className="flex items-center gap-6 mb-8 text-slate-500 text-sm">
                <div className="flex items-center gap-2">
                  <User size={18} className="text-slate-400" />
                  <span>{room.sleeps}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bed size={18} className="text-slate-400" />
                  <span>{room.bedType}</span>
                </div>
              </div>

              <button className="mt-auto flex items-center gap-2 text-[#2b5a84] font-semibold hover:gap-3 transition-all">
                See availability <ArrowRight size={18} />
              </button>
            </div>
          </div>
        ))}

        {/* Promo Blue Card */}
        <div className="bg-[#2b5a84] rounded-xl p-8 text-white flex flex-col justify-between">
          <div>
            <h3 className="text-3xl font-bold mb-6 leading-tight">
              Stay Longer,<br />Save More
            </h3>
            <p className="text-blue-100 mb-6 text-lg">
              It's simple: the longer you stay, the more you save!
            </p>
            
            <div className="space-y-4 border-l border-blue-400/50 pl-4 py-2">
              <p className="text-sm leading-relaxed">
                Save up to <span className="font-bold">30% on daily rate</span> for stays longer than 14 nights
              </p>
              <p className="text-sm leading-relaxed">
                Save up to <span className="font-bold">20% off the nightly rate</span> on stays between 7-14 nights
              </p>
            </div>
          </div>

          <button className="mt-8 w-full bg-blue-50 text-[#2b5a84] font-bold py-3 rounded-lg hover:bg-white transition-colors">
            Choose room
          </button>
        </div>
      </div>
    </section>
  );
};

export default RoomSection;