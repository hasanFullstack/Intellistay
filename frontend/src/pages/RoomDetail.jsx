import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoomById, getRoomsByHostel } from "../api/room.api";
import { getHostelById } from "../api/hostel.api";

const RoomDetail = () => {
  const { roomId, hostelId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [hostel, setHostel] = useState(null);
  const [relatedRooms, setRelatedRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch room details
        const roomRes = await getRoomById(roomId);
        setRoom(roomRes.data);

        // Fetch hostel details
        const hostelRes = await getHostelById(hostelId);
        setHostel(hostelRes.data);

        // Fetch related rooms from same hostel
        const relatedRes = await getRoomsByHostel(hostelId);
        const filtered = relatedRes.data.filter(
          (r) => r._id !== roomId && r.availableBeds > 0,
        );
        setRelatedRooms(filtered.slice(0, 3));
      } catch (err) {
        console.error("Error fetching room details:", err);
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
        (prev) => (prev - 1 + room.images.length) % room.images.length,
      );
    }
  };

  const handleNextImage = () => {
    if (room?.images?.length) {
      setSelectedImageIndex((prev) => (prev + 1) % room.images.length);
    }
  };

  const handleBooking = () => {
    // TODO: Implement booking functionality
    alert("Booking feature coming soon!");
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
            onClick={() => navigate("/rooms")}
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Rooms
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate("/rooms")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition font-medium"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Rooms
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Main Info */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
              <div className="relative bg-gray-900 h-96 md:h-[500px] flex items-center justify-center group">
                {room.images && room.images.length > 0 ? (
                  <>
                    <img
                      src={room.images[selectedImageIndex]}
                      alt={room.roomType}
                      className="w-full h-full object-cover"
                    />

                    {/* Image Navigation */}
                    {room.images.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 rounded-full p-2 transition z-10"
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 rounded-full p-2 transition z-10"
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {selectedImageIndex + 1} / {room.images.length}
                    </div>
                  </>
                ) : (
                  <div className="text-white text-center">
                    <svg
                      className="w-20 h-20 mx-auto mb-2 opacity-50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p>No images available</p>
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {room.images && room.images.length > 1 && (
                <div className="p-4 bg-gray-50 flex gap-2 overflow-x-auto">
                  {room.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                        selectedImageIndex === idx
                          ? "border-blue-600"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Room Information */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {room.roomType}
                  </h1>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span
                      className={`px-4 py-1 rounded-full text-sm font-semibold text-white ${
                        room.gender === "Male"
                          ? "bg-blue-500"
                          : room.gender === "Female"
                            ? "bg-pink-500"
                            : "bg-green-500"
                      }`}
                    >
                      {room.gender}
                    </span>
                    <span className="text-lg font-semibold text-gray-700">
                      Rs {room.pricePerBed}/month
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-1">
                    Available Beds
                  </div>
                  <div
                    className={`text-3xl font-bold ${
                      room.availableBeds > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {room.availableBeds}/{room.totalBeds}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Room Details
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {room.totalBeds}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Total Beds</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {room.availableBeds}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Available</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {room.roomType}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Room Type</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {room.gender}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Gender</div>
                  </div>
                </div>

                {room.description && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Description
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {room.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Booking & Hostel Info */}
          <div className="lg:col-span-1">
            {/* Booking Card */}
            <div className="bg-white rounded-xl shadow-lg p-8 sticky top-24 mb-6">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">Hostel</h3>
                <p className="text-blue-600 font-semibold text-lg">
                  {hostel.name}
                </p>
                <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  </svg>
                  {hostel.location}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 mb-6">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  Rs {room.pricePerBed}
                </div>
                <div className="text-sm text-gray-700">
                  Price per bed per month
                </div>
              </div>

              <button
                onClick={handleBooking}
                disabled={room.availableBeds === 0}
                className={`w-full py-3 rounded-lg font-bold text-white transition mb-3 flex items-center justify-center gap-2 ${
                  room.availableBeds > 0
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 cursor-pointer"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {room.availableBeds > 0 ? "Book Now" : "Not Available"}
              </button>

              {room.availableBeds === 0 && (
                <p className="text-center text-red-600 text-sm font-medium">
                  This room is currently full
                </p>
              )}
            </div>

            {/* Amenities Card */}
            {hostel.amenities && hostel.amenities.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Amenities
                </h3>
                <div className="space-y-3">
                  {hostel.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rules Card */}
            {hostel.rules && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  House Rules
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  {hostel.rules}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Rooms Section */}
        {relatedRooms.length > 0 && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Related Rooms
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedRooms.map((relRoom) => (
                <div
                  key={relRoom._id}
                  onClick={() => navigate(`/room/${relRoom._id}/${hostelId}`)}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition cursor-pointer group"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    {relRoom.images && relRoom.images.length > 0 ? (
                      <>
                        <img
                          src={relRoom.images[0]}
                          alt={relRoom.roomType}
                          className="w-full h-full object-cover group-hover:scale-110 transition"
                        />
                        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                          Rs {relRoom.pricePerBed}
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                        <svg
                          className="w-12 h-12 text-white opacity-50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {relRoom.roomType}
                    </h3>
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                          relRoom.gender === "Male"
                            ? "bg-blue-500"
                            : relRoom.gender === "Female"
                              ? "bg-pink-500"
                              : "bg-green-500"
                        }`}
                      >
                        {relRoom.gender}
                      </span>
                      <span
                        className={`text-sm font-bold ${
                          relRoom.availableBeds > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {relRoom.availableBeds} beds available
                      </span>
                    </div>
                    <button className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition">
                      View Room
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomDetail;
