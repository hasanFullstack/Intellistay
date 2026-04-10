import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoomById, getRoomsByHostel } from "../api/room.api";
import { getHostelById } from "../api/hostel.api";
import { createBooking } from "../api/booking.api";
import { useAuth } from "../auth/AuthContext";
import { toast } from "react-toastify";
import { 
  Wifi, Car, Utensils, Wind, Shield, Tv, WashingMachine, Home, 
  Droplets, MapPin, CheckCircle2, VolumeX, CigaretteOff 
} from "lucide-react";

const getAmenityIcon = (amenityStr) => {
  if (!amenityStr) return <Home size={24} />;
  const lower = amenityStr.toLowerCase();
  if (lower.includes('wifi') || lower.includes('internet')) return <Wifi size={24} />;
  if (lower.includes('park') || lower.includes('car')) return <Car size={24} />;
  if (lower.includes('kitchen') || lower.includes('food')) return <Utensils size={24} />;
  if (lower.includes('ac') || lower.includes('air')) return <Wind size={24} />;
  if (lower.includes('secur') || lower.includes('guard') || lower.includes('cctv')) return <Shield size={24} />;
  if (lower.includes('tv') || lower.includes('television')) return <Tv size={24} />;
  if (lower.includes('wash') || lower.includes('laundry')) return <WashingMachine size={24} />;
  if (lower.includes('water') || lower.includes('geyser')) return <Droplets size={24} />;
  return <Home size={24} />;
};

const RoomDetail = () => {
  const { roomId, hostelId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const backToRoomsPath = hostelId ? `/hostels/${hostelId}/rooms` : "/rooms";
  const [room, setRoom] = useState(null);
  const [hostel, setHostel] = useState(null);
  const [relatedRooms, setRelatedRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Booking modal state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bedsBooked, setBedsBooked] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const roomRes = await getRoomById(roomId);
        setRoom(roomRes.data);

        const hostelRes = await getHostelById(hostelId);
        setHostel(hostelRes.data);

        const relatedRes = await getRoomsByHostel(hostelId);
        const filtered = relatedRes.data.filter(
          (r) => r._id !== roomId && r.availableBeds > 0
        );
        setRelatedRooms(filtered.slice(0, 3));
      } catch (err) {
        toast.error("Failed to load room details");
      } finally {
        setLoading(false);
      }
    };

    if (roomId && hostelId) {
      fetchData();
    }
  }, [roomId, hostelId]);

  const handlePrevImage = () => {
    if (room?.images?.length) {
      setSelectedImageIndex(
        (prev) => (prev - 1 + room.images.length) % room.images.length
      );
    }
  };

  const handleNextImage = () => {
    if (room?.images?.length) {
      setSelectedImageIndex((prev) => (prev + 1) % room.images.length);
    }
  };

  const handleBooking = () => {
    if (!user) {
      toast.info("Please log in to book a room");
      navigate("/login");
      return;
    }
    if (user.role === "owner") {
      toast.warning("Owners cannot book rooms. Switch to a student account.");
      return;
    }
    setShowBookingModal(true);
  };

  // Calculate total price dynamically
  const calculateTotalPrice = () => {
    if (!room) return 0;
    return room.pricePerBed * bedsBooked;
  };

  // Calculate stay duration in days for display
  const getStayDuration = () => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : null;
  };

  const handleSubmitBooking = async () => {
    // Validation
    if (!startDate || !endDate) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      toast.error("Check-in date cannot be in the past");
      return;
    }

    if (end <= start) {
      toast.error("Check-out date must be after check-in date");
      return;
    }

    if (bedsBooked < 1 || bedsBooked > room.availableBeds) {
      toast.error(`Please select between 1 and ${room.availableBeds} beds`);
      return;
    }

    try {
      setBookingLoading(true);
      const res = await createBooking({
        hostelId,
        roomId,
        startDate,
        endDate,
        bedsBooked,
      });

      setShowBookingModal(false);

      // Navigate to success page with booking data
      navigate("/booking-success", {
        state: {
          booking: {
            ...res.data,
            hostelName: hostel?.name,
            hostelLocation: hostel?.location,
            roomType: room?.roomType,
          },
          userRole: user?.role,
        },
      });
    } catch (err) {
      toast.error(err.response?.data?.msg || "Booking failed. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  const getTodayStr = () => {
    return new Date().toISOString().split("T")[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading room details...</p>
        </div>
      </div>
    );
  }

  if (!room || !hostel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Room not found</p>
          <button
            onClick={() => navigate(backToRoomsPath)}
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Hostel Rooms
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 font-sans text-slate-900 min-h-screen">
      {/* Top Navbar replacement - we already have global Nav, but we can put a "Back" bar here */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate(backToRoomsPath)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition font-medium"
          >
            ← Back to {hostel.name}
          </button>
        </div>
      </div>

      <main className="pt-8 pb-16 px-6 max-w-7xl mx-auto">
        {/* Hero Gallery: Bento Style */}
        <section className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[500px] mb-12">
          {/* Main Large Image */}
          <div className="md:col-span-2 md:row-span-2 overflow-hidden rounded-xl bg-white relative">
            <img 
              src={room.images?.[0] || hostel.images?.[0] || "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1200"} 
              alt="Room View 1" 
              className="w-full h-full object-cover" 
            />
            <div className="absolute top-4 right-4 bg-green-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
              <CheckCircle2 size={16} /> Verified
            </div>
          </div>
          
          {/* Image 2 */}
          <div className="md:col-span-1 overflow-hidden rounded-xl bg-white">
            <img 
              src={room.images?.[1] || hostel.images?.[1] || "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800"} 
              alt="Room View 2" 
              className="w-full h-full object-cover" 
            />
          </div>

          {/* Image 3 */}
          <div className="md:col-span-1 overflow-hidden rounded-xl bg-white">
             <img 
              src={room.images?.[2] || hostel.images?.[2] || "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=800"} 
              alt="Room View 3" 
              className="w-full h-full object-cover" 
            />
          </div>

          {/* Image 4 */}
          <div className="md:col-span-2 overflow-hidden rounded-xl bg-white">
             <img 
              src={room.images?.[3] || hostel.images?.[3] || "https://images.pexels.com/photos/275484/pexels-photo-275484.jpeg?auto=compress&cs=tinysrgb&w=800"} 
              alt="Room View 4" 
              className="w-full h-full object-cover" 
            />
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
          {/* Content Column */}
          <div className="space-y-12">
            {/* Title & Meta */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-xs font-bold tracking-wider uppercase">
                  {room.gender} ONLY
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold tracking-wider flex items-center gap-1 uppercase">
                  <CheckCircle2 size={14} /> {room.availableBeds}/{room.totalBeds} BEDS AVAILABLE
                </span>
              </div>
              
              <h1 className="text-5xl font-extrabold text-blue-900 leading-[1.1] mb-2 tracking-tight font-headline">
                {hostel.name}
              </h1>
              <p className="text-lg text-slate-600 flex items-center gap-1">
                <MapPin size={20} className="text-blue-600" /> {hostel.location}
              </p>
            </section>

            {/* Description */}
            <section className="border-t border-slate-200 pt-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-4 font-headline">The Space</h2>
              <p className="text-slate-600 leading-relaxed text-lg max-w-2xl whitespace-pre-line">
                {room.description || "Experience privacy and comfort in our premium room designed for modern living. Providing ample natural light and a refreshing environment."}
              </p>
            </section>

            {/* Amenities Grid */}
            <section className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-blue-900 mb-6 font-headline">Premium Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {hostel.amenities && hostel.amenities.length > 0 ? (
                  hostel.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center text-blue-600">
                        {getAmenityIcon(amenity)}
                      </div>
                      <span className="font-medium capitalize text-slate-700">{amenity}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500">No amenities listed.</p>
                )}
              </div>
            </section>

            {/* House Rules */}
            <section>
              <h2 className="text-2xl font-bold text-blue-900 mb-6 font-headline">House Rules</h2>
              {hostel.rules ? (
                <div className="space-y-4">
                  <p className="text-slate-600 whitespace-pre-line leading-relaxed text-lg">
                    {hostel.rules}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <VolumeX size={20} className="text-red-500 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-800">No Loudspeakers</p>
                      <p className="text-sm text-slate-600">Quiet hours are observed after 10:00 PM.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CigaretteOff size={20} className="text-red-500 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-800">No Smoking</p>
                      <p className="text-sm text-slate-600">This is strictly a smoke-free environment.</p>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Booking Sidebar */}
          <aside className="relative">
            <div className="sticky top-28 bg-white/85 backdrop-blur-xl border border-white/20 p-8 rounded-xl shadow-2xl shadow-blue-900/10 z-10 w-full max-w-sm mx-auto">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <span className="text-4xl font-black text-blue-900 tracking-tighter">Rs {room.pricePerBed}</span>
                  <span className="text-slate-600 font-medium">/month</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs font-bold text-slate-500 mb-1 tracking-widest uppercase">ROOM TYPE</p>
                  <p className="font-semibold text-blue-900 capitalize">{room.roomType}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-slate-500 mb-1 tracking-widest uppercase">STAY PERIOD</p>
                    <p className="font-semibold text-blue-900">Monthly Subscription</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleBooking}
                disabled={room.availableBeds === 0}
                className={`w-full py-4 text-white font-bold rounded-lg text-lg shadow-lg hover:scale-[0.98] transition-transform ${
                  room.availableBeds > 0 
                  ? "bg-blue-600 shadow-blue-600/20" 
                  : "bg-slate-400 cursor-not-allowed shadow-none"
                }`}
              >
                {room.availableBeds > 0 ? "Reserve Now" : "Not Available"}
              </button>
              
              <p className="text-center text-xs text-slate-500 mt-4 font-medium italic">You won't be charged yet</p>

              <div className="mt-8 pt-8 border-t border-slate-200 space-y-4">
                <div className="flex justify-between text-slate-600">
                  <span>Service Fee</span>
                  <span>Rs 500</span>
                </div>
                <div className="flex justify-between text-blue-900 font-bold text-lg pt-4 border-t border-dashed border-slate-300">
                  <span>Total (Est.)</span>
                  <span>Rs {(room.pricePerBed + 500).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Rooms Section */}
        {relatedRooms.length > 0 && (
          <section className="mt-24">
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="text-3xl font-extrabold text-blue-900">Related Rooms</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedRooms.map((relRoom) => (
                <div 
                  key={relRoom._id}
                  onClick={() => navigate(`/room/${relRoom._id}/${hostelId}`)}
                  className="bg-white rounded-xl overflow-hidden shadow-md group cursor-pointer hover:shadow-xl transition-all"
                >
                  <div className="relative h-48">
                    {relRoom.images && relRoom.images.length > 0 ? (
                      <img 
                        src={relRoom.images[0]} 
                        alt="Related Room" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                       <div className="w-full h-full bg-slate-200" />
                    )}
                    <div className="absolute top-4 right-4 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold uppercase">
                      {relRoom.availableBeds} BEDS
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-xs font-bold text-slate-500 mb-2 tracking-widest uppercase">{relRoom.gender} SHARED</p>
                    <h3 className="text-xl font-bold text-blue-900 mb-4 leading-tight">{relRoom.roomType}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-blue-900">Rs {relRoom.pricePerBed}<span className="text-sm font-normal text-slate-400">/mo</span></span>
                      <button className="px-4 py-2 bg-slate-100 text-blue-800 text-sm font-bold rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Booking Modal */}

      {showBookingModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)" }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            style={{ animation: "slideUp 0.3s ease-out" }}
          >
            {/* Modal Header */}
            <div
              className="px-6 py-5 text-white"
              style={{ background: "linear-gradient(135deg, #1e40af, #3b82f6)" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Book Your Stay</h3>
                  <p className="text-blue-100 text-sm mt-1">
                    {hostel.name} — {room.roomType}
                  </p>
                </div>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-white/80 hover:text-white transition p-1"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6 space-y-5">
              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Check-in
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={getTodayStr()}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Check-out
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || getTodayStr()}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50"
                  />
                </div>
              </div>

              {getStayDuration() && (
                <p className="text-sm text-gray-500 -mt-2">
                  📅 {getStayDuration()} day{getStayDuration() > 1 ? "s" : ""} stay
                </p>
              )}

              {/* Beds selector */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Number of Beds
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setBedsBooked(Math.max(1, bedsBooked - 1))}
                    className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition font-bold text-lg"
                  >
                    −
                  </button>
                  <span className="text-xl font-bold text-gray-900 w-10 text-center">
                    {bedsBooked}
                  </span>
                  <button
                    onClick={() => setBedsBooked(Math.min(room.availableBeds, bedsBooked + 1))}
                    className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition font-bold text-lg"
                  >
                    +
                  </button>
                  <span className="text-sm text-gray-400 ml-2">
                    of {room.availableBeds} available
                  </span>
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5">
                <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
                  <span>Rs {room.pricePerBed} × {bedsBooked} bed{bedsBooked > 1 ? "s" : ""}</span>
                  <span>Rs {calculateTotalPrice().toLocaleString()}</span>
                </div>
                <div className="border-t border-blue-200/50 pt-2 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-blue-600">
                    Rs {calculateTotalPrice().toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitBooking}
                disabled={bookingLoading}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {bookingLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Booking...
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slide-up animation for modal */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(24px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default RoomDetail;
