import { useEffect, useState } from "react";
import { getAllHostels } from "../api/hostel.api";
import { getRoomsByHostel } from "../api/room.api";
import "./Rooms.css";

const Rooms = () => {
  const [hostels, setHostels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGender, setFilterGender] = useState("all");

  useEffect(() => {
    loadHostels();
  }, []);

  const loadHostels = async () => {
    try {
      setLoading(true);
      const res = await getAllHostels();
      setHostels(res.data || []);
      if (res.data && res.data.length > 0) {
        await loadRoomsForHostel(res.data[0]._id);
        setSelectedHostel(res.data[0]._id);
      }
    } catch (err) {
      console.error("Error loading hostels:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadRoomsForHostel = async (hostelId) => {
    try {
      const res = await getRoomsByHostel(hostelId);
      setRooms(res.data || []);
    } catch (err) {
      console.error("Error loading rooms:", err);
      setRooms([]);
    }
  };

  const handleHostelChange = (hostelId) => {
    setSelectedHostel(hostelId);
    loadRoomsForHostel(hostelId);
    setSearchTerm("");
    setFilterGender("all");
  };

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.roomType
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesGender =
      filterGender === "all" || room.gender === filterGender;
    const hasAvailableBeds = room.availableBeds > 0;

    return matchesSearch && matchesGender && hasAvailableBeds;
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

                <div className="filter-group">
                  <select
                    className="form-select"
                    value={filterGender}
                    onChange={(e) => setFilterGender(e.target.value)}
                  >
                    <option value="all">All Genders</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Co-ed">Co-ed</option>
                  </select>
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
                      {room.images && room.images.length > 0 && (
                        <div className="room-image-section">
                          <img
                            src={room.images[0]}
                            alt={room.roomType}
                            className="room-featured-image"
                          />
                        </div>
                      )}

                      <div className="room-header">
                        <h5 className="room-type">{room.roomType}</h5>
                        <span
                          className={`gender-badge gender-${room.gender.toLowerCase()}`}
                        >
                          {room.gender}
                        </span>
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

                      <button className="btn-book">
                        <i className="bi bi-calendar-check me-2"></i>
                        Book Now
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
