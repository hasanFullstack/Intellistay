import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAllHostels } from "../api/hostel.api";
import { getRoomsByHostel } from "../api/room.api";
import "./Rooms.css";
import { toast } from "react-toastify";

const Rooms = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [hostels, setHostels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadHostels();
  }, []);

  const loadHostels = async () => {
    try {
      setLoading(true);
      const res = await getAllHostels();
      setHostels(res.data || []);
      const preselected = searchParams.get("hostel");
      const firstHostel = preselected && res.data?.find(h => h._id === preselected)
        ? preselected
        : res.data?.[0]?._id;
      if (firstHostel) {
        await loadRoomsForHostel(firstHostel);
        setSelectedHostel(firstHostel);
      }
    } catch (err) {
      toast.error("Failed to load hostels");
    } finally {
      setLoading(false);
    }
  };

  const loadRoomsForHostel = async (hostelId) => {
    try {
      const res = await getRoomsByHostel(hostelId);
      setRooms(res.data || []);
    } catch (err) {
      toast.error("Failed to load rooms");
      setRooms([]);
    }
  };

  const handleHostelChange = (hostelId) => {
    setSelectedHostel(hostelId);
    loadRoomsForHostel(hostelId);
    setSearchTerm("");
  };

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.roomType
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const hasAvailableBeds = room.availableBeds > 0;

    return matchesSearch && hasAvailableBeds;
  });

  const currentHostel = hostels.find((h) => h._id === selectedHostel);

  return (
    <div className="rooms-page">
      <div className="container-fluid py-5">
        {/* Page Header */}
        <div className="rooms-header mb-5">
          <h1 className="rooms-title">Available Rooms</h1>
          <p className="rooms-subtitle">
            Browse and book from our wide selection of hostel rooms
          </p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : hostels.length === 0 ? (
          <div className="alert alert-info text-center">
            No hostels available at the moment
          </div>
        ) : (
          <div className="row">
            {/* Sidebar - Hostels List */}
            <div className="col-lg-3 mb-4">
              <div className="hostels-sidebar">
                <h5 className="sidebar-title">Select Hostel</h5>
                <div className="hostels-list">
                  {hostels.map((hostel) => (
                    <button
                      key={hostel._id}
                      className={`hostel-item ${
                        selectedHostel === hostel._id ? "active" : ""
                      }`}
                      onClick={() => handleHostelChange(hostel._id)}
                    >
                      <img
                        src={(hostel?.images && hostel.images.length > 0) ? hostel.images[0] : "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=800"}
                        alt={hostel?.name || "Hostel"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="hostel-name">{hostel.name}</div>
                      <div className="hostel-location">
                        <i className="bi bi-geo-alt"></i> {hostel.location}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content - Rooms and Filters */}
            <div className="col-lg-9">
              {/* Filters */}
              <div className="rooms-filters mb-4">
                <div className="filter-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search rooms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Hostel Info Card */}
              {currentHostel && (
                <div className="hostel-info-card mb-4">
                  <div className="hostel-header">
                    <h2 className="hostel-name-large">{currentHostel.name}</h2>
                    <span className="hostel-location-large">
                      <i className="bi bi-geo-alt"></i> {currentHostel.location}
                    </span>
                  </div>
                  {currentHostel.description && (
                    <p className="hostel-description">
                      {currentHostel.description}
                    </p>
                  )}
                  <div style={{ marginBottom: "10px" }}>
                    <strong>Gender Policy:</strong>{" "}
                    <span
                      className={`gender-badge gender-${(currentHostel.gender || "co-ed").toLowerCase()}`}
                    >
                      {currentHostel.gender || "Co-ed"}
                    </span>
                  </div>
                  {currentHostel.amenities &&
                    currentHostel.amenities.length > 0 && (
                      <div className="amenities-section">
                        <h6>Amenities:</h6>
                        <div className="amenities-list">
                          {currentHostel.amenities.map((amenity, idx) => (
                            <span key={idx} className="amenity-badge">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              )}

              {/* Rooms Grid */}
              {filteredRooms.length === 0 ? (
                <div className="alert alert-warning text-center">
                  <i className="bi bi-info-circle me-2"></i>
                  No rooms available matching your criteria
                </div>
              ) : (
                <div className="rooms-grid">
                  {filteredRooms.map((room) => (
                    <div key={room._id} className="room-card">
                      {/* Room Featured Image */}
                      <div className="room-image-section">
                        <img
                          src={(room.images && room.images.length > 0) 
                            ? room.images[0] 
                            : "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800"}
                          alt={room.roomType}
                          className="room-featured-image"
                        />
                      </div>

                      <div className="room-header">
                        <h5 className="room-type">{room.roomType}</h5>
                      </div>

                      <div className="room-details">
                        <div className="detail-item">
                          <i className="bi bi-door-closed"></i>
                          <div>
                            <label>Room Type</label>
                            <p>{room.roomType}</p>
                          </div>
                        </div>

                        <div className="detail-item">
                          <i className="bi bi-people-fill"></i>
                          <div>
                            <label>Capacity</label>
                            <p>{room.totalBeds} Beds</p>
                          </div>
                        </div>

                        <div className="detail-item">
                          <i className="bi bi-check-circle"></i>
                          <div>
                            <label>Available</label>
                            <p
                              className={
                                room.availableBeds > 0
                                  ? "available"
                                  : "unavailable"
                              }
                            >
                              {room.availableBeds} Beds
                            </p>
                          </div>
                        </div>

                        <div className="detail-item">
                          <i className="bi bi-currency-rupee"></i>
                          <div>
                            <label>Price Per Bed</label>
                            <p className="price">Rs {room.pricePerBed}/month</p>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          navigate(`/room/${room._id}/${selectedHostel}`)
                        }
                        className="btn-book"
                      >
                        <i className="bi bi-calendar-check me-2"></i>
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rooms;
