import { useEffect, useState } from "react";
import { getAllHostels } from "../api/hostel.api";
import "./Hostels.css";

const Hostels = () => {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredHostels, setFilteredHostels] = useState([]);

  useEffect(() => {
    loadHostels();
  }, []);

  const loadHostels = async () => {
    try {
      setLoading(true);
      const res = await getAllHostels();
      setHostels(res.data || []);
      setFilteredHostels(res.data || []);
    } catch (err) {
      console.error("Error loading hostels:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = hostels.filter(
      (hostel) =>
        hostel.name.toLowerCase().includes(value.toLowerCase()) ||
        hostel.location.toLowerCase().includes(value.toLowerCase()),
    );
    setFilteredHostels(filtered);
  };

  return (
    <div className="hostels-page">
      <div className="container-fluid">
        {/* Hero Section */}
        <div className="hostels-hero">
          <div className="hero-content">
            <h1 className="hero-title">Explore Our Hostels</h1>
            <p className="hero-subtitle">
              Discover comfortable and affordable accommodation for your journey
            </p>
          </div>

          {/* Search Bar */}
          <div className="search-container">
            <div className="search-box">
              <i className="bi bi-search"></i>
              <input
                type="text"
                placeholder="Search by hostel name or location..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading hostels...</p>
          </div>
        ) : filteredHostels.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-inbox"></i>
            <h3>No hostels found</h3>
            <p>
              {searchTerm
                ? "Try adjusting your search criteria"
                : "No hostels available at the moment"}
            </p>
          </div>
        ) : (
          <div className="hostels-container">
            <div className="results-info">
              <p>
                Showing <strong>{filteredHostels.length}</strong> hostel
                {filteredHostels.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="hostels-grid">
              {filteredHostels.map((hostel) => (
                <div key={hostel._id} className="hostel-card">
                  {/* Featured Image */}
                  {hostel.images && hostel.images.length > 0 && (
                    <div className="card-image-section">
                      <img
                        src={hostel.images[0]}
                        alt={hostel.name}
                        className="card-featured-image"
                      />
                    </div>
                  )}

                  {/* Card Header */}
                  <div className="card-header-section">
                    <div className="hostel-name-badge">
                      <h3 className="hostel-name">{hostel.name}</h3>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="card-body-section">
                    {/* Location */}
                    <div className="info-item">
                      <i className="bi bi-geo-alt-fill"></i>
                      <div className="info-content">
                        <label>Location</label>
                        <p>{hostel.location}</p>
                      </div>
                    </div>

                    {/* Description */}
                    {hostel.description && (
                      <div className="info-item">
                        <i className="bi bi-info-circle-fill"></i>
                        <div className="info-content">
                          <label>About</label>
                          <p className="description">
                            {hostel.description.substring(0, 100)}
                            {hostel.description.length > 100 ? "..." : ""}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Amenities */}
                    {hostel.amenities && hostel.amenities.length > 0 && (
                      <div className="info-item">
                        <i className="bi bi-star-fill"></i>
                        <div className="info-content">
                          <label>Amenities</label>
                          <div className="amenities-tags">
                            {hostel.amenities
                              .slice(0, 3)
                              .map((amenity, idx) => (
                                <span key={idx} className="amenity-tag">
                                  {amenity}
                                </span>
                              ))}
                            {hostel.amenities.length > 3 && (
                              <span className="amenity-tag more-badge">
                                +{hostel.amenities.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Rules */}
                    {hostel.rules && (
                      <div className="info-item">
                        <i className="bi bi-shield-check"></i>
                        <div className="info-content">
                          <label>Rules</label>
                          <p className="rules-text">
                            {hostel.rules.substring(0, 80)}
                            {hostel.rules.length > 80 ? "..." : ""}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="card-footer-section">
                    <button className="btn-view-rooms">
                      <i className="bi bi-door-open"></i>
                      <span>View Rooms</span>
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

export default Hostels;
