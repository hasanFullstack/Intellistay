import { useEffect, useState } from "react";
import AOS from "aos";
import { getAllHostels } from "../api/hostel.api";
import { getRoomsByHostel } from "../api/room.api";
import HostelHero from "../../components/landing/HostelHero";
import RoomSection from "../../components/landing/RoomSection";
import FeaturesSection from "../../components/landing/Features";
import AccommodationSection from "../../components/landing/AccommodationSection";
import ContactsSection from "../../components/landing/Contact";

const Home = () => {
  const [hostels, setHostels] = useState([]);
  const [hostelRooms, setHostelRooms] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 900, once: true });

    const fetchData = async () => {
      try {
        const hostelRes = await getAllHostels();
        const hostelsData = hostelRes.data || [];
        setHostels(hostelsData);

        // Fetch rooms for each hostel
        const roomsData = {};
        for (const hostel of hostelsData) {
          const roomRes = await getRoomsByHostel(hostel._id);
          roomsData[hostel._id] = roomRes.data || [];
        }
        setHostelRooms(roomsData);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getMinPrice = (hostelId) => {
    const rooms = hostelRooms[hostelId] || [];
    if (rooms.length === 0) return "N/A";
    const prices = rooms.map((r) => r.pricePerBed);
    return Math.min(...prices);
  };

  const getAvailableRoomsCount = (hostelId) => {
    const rooms = hostelRooms[hostelId] || [];
    return rooms.filter((r) => r.availableBeds > 0).length;
  };

  return (
    <div>
      {/* HERO SECTION */}
      <HostelHero />
      <RoomSection />
      <FeaturesSection />
      <AccommodationSection />
      <ContactsSection />
      {/* Floating Cart Icon (Bottom Right) */}
      <div className="fixed bottom-8 right-8 will-change-transform">
        <div className="bg-white hover:bg-[#235784] p-3 rounded-full shadow-lg border border-slate-100 text-slate-700 hover:bg-slate-50 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
        </div>
      </div>
    </div>
  );
};

export default Home;
