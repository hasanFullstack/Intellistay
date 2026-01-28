import { useEffect, useState } from "react";
import { getUserBookings, cancelBooking } from "../../api/booking.api";
import { useAuth } from "../../auth/AuthContext";
import "./UserDashboard.css";

const UserDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await getUserBookings(user._id);
      setBookings(res.data || []);
    } catch (err) {
      console.error("Error loading bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await cancelBooking(bookingId);
        alert("Booking cancelled successfully!");
        await loadBookings();
      } catch (err) {
        alert("Failed to cancel booking");
        console.error(err);
      }
    }
  };

  useEffect(() => {
    if (user?._id) {
      loadBookings();
    }
  }, [user]);

  const getStatusBadge = (status) => {
    const statusClass = {
      confirmed: "badge-success",
      pending: "badge-warning",
      cancelled: "badge-danger",
      completed: "badge-info",
    };
    return statusClass[status] || "badge-secondary";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getActiveBookings = () =>
    bookings.filter((b) => b.status !== "cancelled");
  const getCancelledBookings = () =>
    bookings.filter((b) => b.status === "cancelled");

  return (
    <div className="user-dashboard">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>Welcome, {user?.name}!</h1>
            <p>Manage and view all your hostel bookings</p>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number">{getActiveBookings().length}</span>
              <span className="stat-label">Active Bookings</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {getCancelledBookings().length}
              </span>
              <span className="stat-label">Cancelled</span>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon bg-primary">🏢</div>
            <div className="stat-content">
              <h3>{getActiveBookings().length}</h3>
              <p>Active Bookings</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon bg-success">✓</div>
            <div className="stat-content">
              <h3>{bookings.filter((b) => b.status === "confirmed").length}</h3>
              <p>Confirmed</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon bg-warning">⏳</div>
            <div className="stat-content">
              <h3>{bookings.filter((b) => b.status === "pending").length}</h3>
              <p>Pending</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon bg-info">ℹ️</div>
            <div className="stat-content">
              <h3>{bookings.length}</h3>
              <p>Total Bookings</p>
            </div>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="bookings-section">
          <div className="section-header">
            <h2>📚 Your Bookings</h2>
          </div>

          {loading ? (
            <div className="loading-message">Loading your bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No Bookings Yet</h3>
              <p>You haven't booked any hostels yet. Start exploring!</p>
            </div>
          ) : (
            <>
              {getActiveBookings().length > 0 && (
                <div className="bookings-list">
                  {getActiveBookings().map((booking) => (
                    <div key={booking._id} className="booking-card">
                      <div className="booking-header">
                        <div className="booking-info">
                          <h3>{booking.hostelName}</h3>
                          <span
                            className={`booking-status badge ${getStatusBadge(
                              booking.status,
                            )}`}
                          >
                            {booking.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="booking-dates">
                          <span className="date-label">
                            📅 {formatDate(booking.checkInDate)} -{" "}
                            {formatDate(booking.checkOutDate)}
                          </span>
                        </div>
                      </div>

                      <div className="booking-details">
                        <div className="detail-group">
                          <span className="detail-label">Room Type:</span>
                          <span className="detail-value">
                            {booking.roomType}
                          </span>
                        </div>
                        <div className="detail-group">
                          <span className="detail-label">Price per Night:</span>
                          <span className="detail-value">
                            ₹{booking.pricePerNight}
                          </span>
                        </div>
                        <div className="detail-group">
                          <span className="detail-label">Total Price:</span>
                          <span className="detail-value highlight">
                            ₹{booking.totalPrice}
                          </span>
                        </div>
                        <div className="detail-group">
                          <span className="detail-label">Booking Date:</span>
                          <span className="detail-value">
                            {formatDate(booking.createdAt)}
                          </span>
                        </div>
                      </div>

                      <div className="booking-actions">
                        <button
                          className="btn btn--secondary"
                          onClick={() => handleCancelBooking(booking._id)}
                        >
                          Cancel Booking
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {getCancelledBookings().length > 0 && (
                <div className="cancelled-bookings">
                  <h3 className="cancelled-title">Cancelled Bookings</h3>
                  <div className="bookings-list">
                    {getCancelledBookings().map((booking) => (
                      <div
                        key={booking._id}
                        className="booking-card booking-card--cancelled"
                      >
                        <div className="booking-header">
                          <div className="booking-info">
                            <h3>{booking.hostelName}</h3>
                            <span className="booking-status badge badge-danger">
                              CANCELLED
                            </span>
                          </div>
                          <div className="booking-dates">
                            <span className="date-label">
                              📅 {formatDate(booking.checkInDate)} -{" "}
                              {formatDate(booking.checkOutDate)}
                            </span>
                          </div>
                        </div>

                        <div className="booking-details">
                          <div className="detail-group">
                            <span className="detail-label">Room Type:</span>
                            <span className="detail-value">
                              {booking.roomType}
                            </span>
                          </div>
                          <div className="detail-group">
                            <span className="detail-label">
                              Price per Night:
                            </span>
                            <span className="detail-value">
                              ₹{booking.pricePerNight}
                            </span>
                          </div>
                          <div className="detail-group">
                            <span className="detail-label">Total Price:</span>
                            <span className="detail-value highlight">
                              ₹{booking.totalPrice}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
