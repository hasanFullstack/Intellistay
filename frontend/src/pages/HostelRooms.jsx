import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getHostelById } from "../api/hostel.api";
import { getRoomsByHostel } from "../api/room.api";
import { toast } from "react-toastify";
import "./Rooms.css";
import "./HostelRooms.css";

const HostelRooms = () => {
  const { hostelId } = useParams();
  const navigate = useNavigate();
  const [hostel, setHostel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGender, setFilterGender] = useState("all");

  useEffect(() => {
    const loadHostelRooms = async () => {
      if (!hostelId) return;

      try {
        setLoading(true);
        const [hostelRes, roomsRes] = await Promise.all([
          getHostelById(hostelId),
          getRoomsByHostel(hostelId),
        ]);

        setHostel(hostelRes.data || null);
        setRooms(roomsRes.data || []);
      } catch {
        setHostel(null);
        setRooms([]);
        toast.error("Failed to load hostel rooms");
      } finally {
        setLoading(false);
      }
    };

    loadHostelRooms();
  }, [hostelId]);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const roomName = room.roomType || "";
      const matchesSearch = roomName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesGender =
        filterGender === "all" || room.gender === filterGender;

      return matchesSearch && matchesGender && room.availableBeds > 0;
    });
  }, [filterGender, rooms, searchTerm]);

  const openRoomDetail = (roomId) => {
    navigate(`/room/${roomId}/${hostelId}`);
  };

  const handleRoomCardKeyDown = (event, roomId) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openRoomDetail(roomId);
    }
  };

  if (loading) {
    return (
      <div className="rooms-page">
        <div className="container-fluid py-5">
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading hostel rooms...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!hostel) {
    return (
      <div className="rooms-page">
        <div className="container-fluid py-5">
          <div className="hostel-rooms-empty-state text-center">
            <i className="bi bi-building"></i>
            <h2>Hostel not found</h2>
            <p>The hostel you selected could not be loaded.</p>
            <button
              type="button"
              className="btn-book hostel-rooms-back-btn"
              onClick={() => navigate("/hostels")}
            >
              <i className="bi bi-arrow-left"></i>
              Back to Hostels
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rooms-page hostel-rooms-page">
      <div className="container-fluid py-5">
        <div className="rooms-header hostel-rooms-header mb-4">
          <button
            type="button"
            className="hostel-rooms-breadcrumb"
            onClick={() => navigate("/hostels")}
          >
            <i className="bi bi-arrow-left"></i>
            Back to Hostels
          </button>

          <h1 className="rooms-title">Available Rooms in {hostel.name}</h1>
          <p className="rooms-subtitle">
            Explore rooms available only for this hostel and open any room to
            view its full details.
          </p>
        </div>

        <div className="hostel-info-card hostel-rooms-hero-card mb-4">
          <div className="hostel-rooms-hero-content">
            <div>
              <span className="hostel-rooms-badge">Single Hostel View</span>
              <div className="hostel-header mt-3">
                <h2 className="hostel-name-large">{hostel.name}</h2>
                <span className="hostel-location-large">
                  <i className="bi bi-geo-alt"></i>
                  {hostel.location}
                </span>
              </div>
              {hostel.description && (
                <p className="hostel-description">{hostel.description}</p>
              )}
            </div>

            <div className="hostel-rooms-stats">
              <div className="hostel-rooms-stat-card">
                <strong>{rooms.length}</strong>
                <span>Total Rooms</span>
              </div>
              <div className="hostel-rooms-stat-card">
                <strong>{filteredRooms.length}</strong>
                <span>Available Now</span>
              </div>
            </div>
          </div>

          {hostel.amenities && hostel.amenities.length > 0 && (
            <div className="amenities-section mt-4">
              <h6>Amenities:</h6>
              <div className="amenities-list">
                {hostel.amenities.map((amenity, index) => (
                  <span key={index} className="amenity-badge">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="rooms-filters mb-4">
          <div className="filter-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search rooms by type..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="filter-group">
            <select
              className="form-select"
              value={filterGender}
              onChange={(event) => setFilterGender(event.target.value)}
            >
              <option value="all">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Co-ed">Co-ed</option>
            </select>
          </div>
        </div>

        {filteredRooms.length === 0 ? (
          <div className="alert alert-warning text-center hostel-rooms-empty-results">
            <i className="bi bi-info-circle me-2"></i>
            No available rooms found for this hostel matching your filters.
          </div>
        ) : (
          <div className="rooms-grid">
            {filteredRooms.map((room) => (
              <article
                key={room._id}
                className="room-card hostel-room-card"
                role="button"
                tabIndex={0}
                onClick={() => openRoomDetail(room._id)}
                onKeyDown={(event) => handleRoomCardKeyDown(event, room._id)}
              >
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
                    className={`gender-badge gender-${(room.gender || "co-ed").toLowerCase()}`}
                  >
                    {room.gender}
                  </span>
                </div>

                <div className="room-details">
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
                      <p className="available">{room.availableBeds} Beds</p>
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

                <div className="hostel-room-card__footer">
                  <span className="btn-book hostel-room-card__cta">
                    <i className="bi bi-box-arrow-up-right"></i>
                    View Room Details
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HostelRooms;
