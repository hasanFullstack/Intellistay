import { useEffect, useState } from "react";
import { getMyHostels, deleteHostel } from "../../api/hostel.api";
import { getRoomsByHostel, deleteRoom } from "../../api/room.api";
import {
  getOwnerBookings,
  acceptBooking,
  rejectBooking,
} from "../../api/booking.api";
import { useAuth } from "../../auth/AuthContext";
import AddHostel from "./AddHostel";
import AddRoom from "./AddRoom";
import "./OwnerDashboard.css";

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [hostels, setHostels] = useState([]);
  const [hostelRooms, setHostelRooms] = useState({});
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [showAddHostelModal, setShowAddHostelModal] = useState(false);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [selectedHostelId, setSelectedHostelId] = useState(null);
  const [expandedHostelId, setExpandedHostelId] = useState(null);
  const [activeTab, setActiveTab] = useState("hostels");

  const loadHostels = async () => {
    try {
      setLoading(true);
      const res = await getMyHostels();
      setHostels(res.data || []);
    } catch (err) {
      console.error("Error loading hostels:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadRoomsForHostel = async (hostelId) => {
    try {
      const res = await getRoomsByHostel(hostelId);
      setHostelRooms((prev) => ({
        ...prev,
        [hostelId]: res.data || [],
      }));
    } catch (err) {
      console.error("Error loading rooms:", err);
    }
  };

  const loadBookings = async () => {
    try {
      setBookingsLoading(true);
      const res = await getOwnerBookings();
      setBookings(res.data || []);
    } catch (err) {
      console.error("Error loading bookings:", err);
    } finally {
      setBookingsLoading(false);
    }
  };

  const handleExpandHostel = (hostelId) => {
    setExpandedHostelId((prev) => {
      const willExpand = prev !== hostelId;
      if (willExpand && !hostelRooms[hostelId]) {
        loadRoomsForHostel(hostelId);
      }
      return willExpand ? hostelId : null;
    });
  };

  const handleDeleteRoom = async (roomId, hostelId) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await deleteRoom(roomId);
        await loadRoomsForHostel(hostelId);
        alert("Room deleted successfully!");
      } catch (err) {
        alert("Failed to delete room");
        console.error(err);
      }
    }
  };

  const handleDeleteHostel = async (hostelId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this hostel? All rooms will also be deleted.",
      )
    ) {
      try {
        await deleteHostel(hostelId);
        await loadHostels();
        alert("Hostel deleted successfully!");
      } catch (err) {
        alert("Failed to delete hostel");
        console.error(err);
      }
    }
  };

  const handleAcceptBooking = async (bookingId) => {
    try {
      await acceptBooking(bookingId);
      alert("Booking accepted successfully!");
      loadBookings();
    } catch (err) {
      alert("Failed to accept booking");
      console.error(err);
    }
  };

  const handleRejectBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to reject this booking?")) {
      try {
        await rejectBooking(bookingId);
        alert("Booking rejected successfully!");
        loadBookings();
      } catch (err) {
        alert("Failed to reject booking");
        console.error(err);
      }
    }
  };

  useEffect(() => {
    loadHostels();
    loadBookings();
  }, []);

  const getTotalRoomsCount = () => {
    return Object.values(hostelRooms).reduce(
      (sum, rooms) => sum + rooms.length,
      0,
    );
  };

  const getTotalBedsCount = () => {
    return Object.values(hostelRooms).reduce(
      (sum, rooms) =>
        sum +
        rooms.reduce((roomSum, room) => roomSum + (room.totalBeds || 0), 0),
      0,
    );
  };

  const getTotalAvailableBedsCount = () => {
    return Object.values(hostelRooms).reduce(
      (sum, rooms) =>
        sum +
        rooms.reduce((roomSum, room) => roomSum + (room.availableBeds || 0), 0),
      0,
    );
  };

  return (
    <main className="owner-dashboard">
      <div className="container-fluid py-4">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-md-8">
            <h1 className="fw-bold">Welcome, {user?.name}!</h1>
            <p className="text-muted">
              Manage your hostels, rooms and bookings
            </p>
          </div>
          <div className="col-md-4 d-flex justify-content-end align-items-center">
            {activeTab === "hostels" && (
              <button
                className="btn btn-primary btn-lg"
                onClick={() => {
                  setSelectedHostelId(null);
                  setShowAddHostelModal(true);
                }}
              >
                <i className="bi bi-plus-circle me-2"></i> Add New Hostel
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="stat-card card border-0 shadow-sm">
              <div className="card-body">
                <div className="stat-icon bg-primary">
                  <i className="bi bi-building"></i>
                </div>
                <h6 className="card-title text-muted mt-3">Total Hostels</h6>
                <h3 className="fw-bold text-dark">{hostels.length}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="stat-card card border-0 shadow-sm">
              <div className="card-body">
                <div className="stat-icon bg-success">
                  <i className="bi bi-door-closed"></i>
                </div>
                <h6 className="card-title text-muted mt-3">Total Rooms</h6>
                <h3 className="fw-bold text-dark">{getTotalRoomsCount()}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="stat-card card border-0 shadow-sm">
              <div className="card-body">
                <div className="stat-icon bg-info">
                  <i className="bi bi-person-fill"></i>
                </div>
                <h6 className="card-title text-muted mt-3">Total Beds</h6>
                <h3 className="fw-bold text-dark">{getTotalBedsCount()}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="stat-card card border-0 shadow-sm">
              <div className="card-body">
                <div className="stat-icon bg-warning">
                  <i className="bi bi-check-circle"></i>
                </div>
                <h6 className="card-title text-muted mt-3">Bookings</h6>
                <h3 className="fw-bold text-dark">{bookings.length}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <ul className="nav nav-tabs mb-4" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === "hostels" ? "active" : ""}`}
              onClick={() => setActiveTab("hostels")}
            >
              <i className="bi bi-building me-2"></i> Hostels & Rooms
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === "bookings" ? "active" : ""}`}
              onClick={() => setActiveTab("bookings")}
            >
              <i className="bi bi-calendar-check me-2"></i> Bookings
            </button>
          </li>
        </ul>

        {/* Hostels List */}
        {activeTab === "hostels" && (
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom">
              <h5 className="card-title mb-0 fw-bold">Your Hostels</h5>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : hostels.length === 0 ? (
                <div className="text-center py-5">
                  <i
                    className="bi bi-inbox"
                    style={{ fontSize: "3rem", color: "#ccc" }}
                  ></i>
                  <p className="text-muted mt-3">
                    No hostels yet. Add your first hostel to get started!
                  </p>
                </div>
              ) : (
                <div className="accordion" id="hostelAccordion">
                  {hostels.map((hostel, idx) => {
                    const rooms = hostelRooms[hostel._id] || [];
                    const totalBeds = rooms.reduce(
                      (sum, r) => sum + (r.totalBeds || 0),
                      0,
                    );
                    const availableBeds = rooms.reduce(
                      (sum, r) => sum + (r.availableBeds || 0),
                      0,
                    );

                    return (
                      <div className="accordion-item" key={hostel._id}>
                        <h2 className="accordion-header">
                          <button
                            className="accordion-button"
                            type="button"
                            onClick={() => handleExpandHostel(hostel._id)}
                            aria-expanded={expandedHostelId === hostel._id}
                          >
                            <div className="w-100">
                              <div className="row align-items-center w-100">
                                <div className="col-md-3">
                                  <strong>{hostel.name}</strong>
                                  <div className="small text-muted">
                                    {hostel.location}
                                  </div>
                                </div>
                                <div className="col-md-2">
                                  <span className="badge bg-info">
                                    {rooms.length} rooms
                                  </span>
                                </div>
                                <div className="col-md-2">
                                  <span className="badge bg-success">
                                    {totalBeds} beds
                                  </span>
                                </div>
                                <div className="col-md-2">
                                  <span className="badge bg-warning">
                                    {availableBeds} available
                                  </span>
                                </div>
                                <div className="col-md-3 text-end">
                                  <span
                                    className={`accordion-toggle-icon me-2 ${
                                      expandedHostelId === hostel._id
                                        ? "open"
                                        : ""
                                    }`}
                                  >
                                    <i
                                      className={`bi ${
                                        expandedHostelId === hostel._id
                                          ? "bi-chevron-up"
                                          : "bi-chevron-down"
                                      }`}
                                    ></i>
                                  </span>
                                  <button
                                    className="btn btn-sm btn-outline-success me-2"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedHostelId(hostel._id);
                                      setShowAddRoomModal(true);
                                    }}
                                  >
                                    <i className="bi bi-plus"></i> Add Room
                                  </button>
                                  <button
                                    className="btn-delete"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteHostel(hostel._id);
                                    }}
                                    title="Delete hostel"
                                  >
                                    <i
                                      className="bi bi-trash"
                                      aria-hidden="true"
                                    ></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </button>
                        </h2>
                        <div
                          id={`collapse-${hostel._id}`}
                          className="accordion-collapse collapse"
                          data-bs-parent="#hostelAccordion"
                          style={{
                            display:
                              expandedHostelId === hostel._id
                                ? "block"
                                : "none",
                          }}
                        >
                          <div className="accordion-body">
                            {/* Hostel Info */}
                            <div className="mb-4">
                              <h6 className="fw-bold mb-2">Hostel Details</h6>
                              {hostel.description && (
                                <p className="text-muted mb-2">
                                  <strong>Description:</strong>{" "}
                                  {hostel.description}
                                </p>
                              )}
                              {hostel.amenities &&
                                hostel.amenities.length > 0 && (
                                  <p className="mb-2">
                                    <strong>Amenities:</strong>
                                    <div>
                                      {hostel.amenities.map((amenity, i) => (
                                        <span
                                          key={i}
                                          className="badge bg-light text-dark me-1 mb-1"
                                        >
                                          {amenity}
                                        </span>
                                      ))}
                                    </div>
                                  </p>
                                )}
                              {hostel.rules && (
                                <p className="text-muted">
                                  <strong>Rules:</strong> {hostel.rules}
                                </p>
                              )}
                            </div>

                            <hr />

                            {/* Rooms Section */}
                            <h6 className="fw-bold mb-3">Rooms</h6>
                            {rooms.length === 0 ? (
                              <p className="text-muted text-center py-3">
                                No rooms yet. Click "Add Room" to create one.
                              </p>
                            ) : (
                              <div className="table-responsive">
                                <table className="table table-sm table-hover">
                                  <thead className="table-light">
                                    <tr>
                                      <th>Type</th>
                                      <th>Gender</th>
                                      <th>Total Beds</th>
                                      <th>Available Beds</th>
                                      <th>Price/Bed (Rs)</th>
                                      <th>Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {rooms.map((room) => (
                                      <tr key={room._id}>
                                        <td>
                                          <strong>{room.roomType}</strong>
                                        </td>
                                        <td>{room.gender}</td>
                                        <td>{room.totalBeds}</td>
                                        <td>
                                          <span
                                            className={`badge ${
                                              room.availableBeds > 0
                                                ? "bg-success"
                                                : "bg-danger"
                                            }`}
                                          >
                                            {room.availableBeds}
                                          </span>
                                        </td>
                                        <td>Rs {room.pricePerBed}</td>
                                        <td>
                                          <button
                                            className="btn-delete"
                                            onClick={() =>
                                              handleDeleteRoom(
                                                room._id,
                                                hostel._id,
                                              )
                                            }
                                            title="Delete room"
                                          >
                                            <i
                                              className="bi bi-trash"
                                              aria-hidden="true"
                                            ></i>
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bookings List */}
        {activeTab === "bookings" && (
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom">
              <h5 className="card-title mb-0 fw-bold">Booking Requests</h5>
            </div>
            <div className="card-body">
              {bookingsLoading ? (
                <div className="text-center py-4">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-5">
                  <i
                    className="bi bi-inbox"
                    style={{ fontSize: "3rem", color: "#ccc" }}
                  ></i>
                  <p className="text-muted mt-3">No bookings yet</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Guest Name</th>
                        <th>Email</th>
                        <th>Hostel</th>
                        <th>Room Type</th>
                        <th>Check-in</th>
                        <th>Check-out</th>
                        <th>Beds</th>
                        <th>Total Price (Rs)</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking._id}>
                          <td>
                            <strong>{booking.userId?.name || "N/A"}</strong>
                          </td>
                          <td>{booking.userId?.email || "N/A"}</td>
                          <td>{booking.hostelId?.name || "N/A"}</td>
                          <td>{booking.roomId?.roomType || "N/A"}</td>
                          <td>
                            {new Date(booking.startDate).toLocaleDateString()}
                          </td>
                          <td>
                            {new Date(booking.endDate).toLocaleDateString()}
                          </td>
                          <td>
                            <span className="badge bg-info">
                              {booking.bedsBooked}
                            </span>
                          </td>
                          <td>
                            <strong>Rs {booking.totalPrice}</strong>
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                booking.status === "confirmed"
                                  ? "bg-success"
                                  : booking.status === "pending"
                                    ? "bg-warning"
                                    : "bg-danger"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-success me-2"
                              onClick={() => handleAcceptBooking(booking._id)}
                              disabled={booking.status === "cancelled"}
                              title="Accept booking"
                            >
                              <i className="bi bi-check"></i> Accept
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleRejectBooking(booking._id)}
                              disabled={booking.status === "cancelled"}
                              title="Reject booking"
                            >
                              <i className="bi bi-x"></i> Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Hostel Modal */}
      <div
        className={`modal fade ${showAddHostelModal ? "show" : ""}`}
        id="addHostelModal"
        tabIndex="-1"
        style={{ display: showAddHostelModal ? "block" : "none" }}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0">
            <div className="modal-header border-bottom">
              <h5 className="modal-title fw-bold">Add New Hostel</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowAddHostelModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <AddHostel
                onSuccess={() => {
                  setShowAddHostelModal(false);
                  loadHostels();
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add Room Modal */}
      <div
        className={`modal fade ${showAddRoomModal ? "show" : ""}`}
        id="addRoomModal"
        tabIndex="-1"
        style={{ display: showAddRoomModal ? "block" : "none" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0">
            <div className="modal-header border-bottom">
              <h5 className="modal-title fw-bold">Add New Room</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowAddRoomModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              {selectedHostelId && (
                <AddRoom
                  hostelId={selectedHostelId}
                  onSuccess={() => {
                    setShowAddRoomModal(false);
                    loadRoomsForHostel(selectedHostelId);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {showAddHostelModal && <div className="modal-backdrop fade show"></div>}
      {showAddRoomModal && <div className="modal-backdrop fade show"></div>}
    </main>
  );
};

export default OwnerDashboard;
