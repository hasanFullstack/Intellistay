import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllHostels } from "../api/hostel.api";
import { Select } from "antd";
import "antd/dist/antd.css";
import "./Hostels.css";
import { useAuth } from "../auth/AuthContext";
import AuthModal from "./AuthModal";
import { toast } from "react-toastify";

const HOSTELS_CACHE_KEY = "intellistay.hostels.all.v2";

const readCachedHostels = () => {
  try {
    const rawData = sessionStorage.getItem(HOSTELS_CACHE_KEY);
    if (!rawData) return null;

    const parsed = JSON.parse(rawData);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const writeCachedHostels = (data) => {
  try {
    sessionStorage.setItem(HOSTELS_CACHE_KEY, JSON.stringify(data));
  } catch {
    // Ignore cache write issues quietly.
  }
};

const Hostels = () => {
  const navigate = useNavigate();
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredHostels, setFilteredHostels] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All Hostels");
  const [filterGender, setFilterGender] = useState("all");
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    loadHostels();
  }, []);

  const loadHostels = async () => {
    const cachedHostels = readCachedHostels();

    if (cachedHostels?.length) {
      setHostels(cachedHostels);
      setFilteredHostels(cachedHostels);
      setLoading(false);
    } else {
      setLoading(true);
    }

    try {
      const res = await getAllHostels();
      const freshHostels = res.data || [];
      setHostels(freshHostels);
      applyFilters(freshHostels, selectedFilter, searchTerm, filterGender);
      writeCachedHostels(freshHostels);
    } catch (err) {
      if (!cachedHostels?.length) {
        toast.error("Failed to load hostels");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    applyFilters(hostels, selectedFilter, value, filterGender);
  };

  const applyFilters = (hostelList, filter, search, gender) => {
    let filtered = hostelList.filter((hostel) =>
      hostel.name.toLowerCase().includes(search.toLowerCase()) ||
      (hostel.city && hostel.city.toLowerCase().includes(search.toLowerCase()))
    );

    // Apply gender filter (filter treats undefined/null as "Male")
    if (gender !== "all") {
      filtered = filtered.filter((hostel) => (hostel.gender || "Male") === gender);
    }

    setFilteredHostels(filtered);
  };

  const handleFilterChange = (value) => {
    // If the user is not a student, prompt to login/register for student-only filters
    if (value !== "All Hostels" && user?.role !== "student") {
      setAuthModalOpen(true);
      return;
    }

    setSelectedFilter(value);

    // For 'All Hostels' keep using local state
    if (value === "All Hostels") {
      applyFilters(hostels, value, searchTerm, filterGender);
      return;
    }

    // For other filters, ask the backend (backend enforces student role)
    (async () => {
      try {
        setLoading(true);
        const res = await getAllHostels(value);
        const data = res.data || [];
        applyFilters(data, value, searchTerm, filterGender);
      } catch (err) {
        toast.error("Filter request failed");
      } finally {
        setLoading(false);
      }
    })();
  };

  const handleGenderFilter = (gender) => {
    setFilterGender(gender);
    if (selectedFilter === "All Hostels") {
      applyFilters(hostels, selectedFilter, searchTerm, gender);
    } else {
      applyFilters(filteredHostels, selectedFilter, searchTerm, gender);
    }
  };

  // Close auth modal callback also resets selectedFilter to All Hostels
  const handleCloseAuthModal = () => {
    setAuthModalOpen(false);
    setSelectedFilter("All Hostels");
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
                placeholder="Search by hostel name or city..."
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
          <div className="hostels-container">
            <div className="flex results-info justify-between items-center gap-4">
              <p>
                Showing <strong>{filteredHostels.length}</strong> hostel
                {filteredHostels.length !== 1 ? "s" : ""}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleGenderFilter("all")}
                    style={{ borderRadius: "9999px" }}
                    className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-colors focus:outline-none ${
                      filterGender === "all"
                        ? "bg-[#235784] text-white hover:opacity-95"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-300"
                    }`}
                  >
                    All Genders
                  </button>
                  <button
                    onClick={() => handleGenderFilter("Male")}
                    style={{ borderRadius: "9999px" }}
                    className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-colors focus:outline-none ${
                      filterGender === "Male"
                        ? "bg-[#235784] text-white hover:opacity-95"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-300"
                    }`}
                  >
                    Male
                  </button>
                  <button
                    onClick={() => handleGenderFilter("Female")}
                    style={{ borderRadius: "9999px" }}
                    className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-colors focus:outline-none ${
                      filterGender === "Female"
                        ? "bg-[#235784] text-white hover:opacity-95"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-300"
                    }`}
                  >
                    Female
                  </button>
                </div>
                <div className="dropdown">
                  {user?.role === "student" && (
                    <Select
                      value={selectedFilter}
                      onChange={handleFilterChange}
                      style={{ width: 220 }}
                      options={[
                        { label: "All Hostels", value: "All Hostels" },
                        { label: "Available Now", value: "available" },
                        { label: "Recommended", value: "recommended" },
                        { label: "Most Popular", value: "popular" },
                        { label: "Budget Friendly", value: "budget" },
                      ]}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="empty-state">
              <i className="bi bi-inbox"></i>
              <h3>No hostels found</h3>
              <p>
                {searchTerm
                  ? "Try adjusting your search criteria"
                  : "No hostels available at the moment"}
              </p>
            </div>
          </div>
        ) : (
          <div className="hostels-container">
            <div className="flex results-info justify-between items-center gap-4">
              <p>
                Showing <strong>{filteredHostels.length}</strong> hostel
                {filteredHostels.length !== 1 ? "s" : ""}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleGenderFilter("all")}
                    style={{ borderRadius: "9999px" }}
                    className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-colors focus:outline-none ${
                      filterGender === "all"
                        ? "bg-blue-600 text-white hover:opacity-95"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-300"
                    }`}
                  >
                    All Genders
                  </button>
                  <button
                    onClick={() => handleGenderFilter("Male")}
                    style={{ borderRadius: "9999px" }}
                    className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-colors focus:outline-none ${
                      filterGender === "Male"
                        ? "bg-blue-600 text-white hover:opacity-95"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-300"
                    }`}
                  >
                    Male
                  </button>
                  <button
                    onClick={() => handleGenderFilter("Female")}
                    style={{ borderRadius: "9999px" }}
                    className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-colors focus:outline-none ${
                      filterGender === "Female"
                        ? "bg-blue-600 text-white hover:opacity-95"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-300"
                    }`}
                  >
                    Female
                  </button>
                </div>
                <div className="dropdown">
                  {user?.role === "student" && (
                    <Select
                      value={selectedFilter}
                      onChange={handleFilterChange}
                      style={{ width: 220 }}
                      options={[
                        { label: "All Hostels", value: "All Hostels" },
                        { label: "Available Now", value: "available" },
                        { label: "Recommended", value: "recommended" },
                        { label: "Most Popular", value: "popular" },
                        { label: "Budget Friendly", value: "budget" },
                      ]}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="hostels-grid">
              {filteredHostels.map((hostel) => (
                <div key={hostel._id} className="hostel-card">
                  {/* Featured Image */}
                  <div className="card-image-section">
                    <img
                      src={(hostel.images && hostel.images.length > 0) 
                        ? hostel.images[0] 
                        : "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=800"}
                      alt={hostel.name}
                      className="card-featured-image"
                    />
                  </div>

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
                        <p>{hostel.city && hostel.addressLine1 ? `${hostel.addressLine1}, ${hostel.city}` : "Address not set"}</p>
                      </div>
                    </div>

                    {/* Gender Policy */}
                    <div className="info-item">
                      <i className="bi bi-people-fill"></i>
                      <div className="info-content">
                        <label>Gender Policy</label>
                        <p className="fw-semibold">
                          <span className={`badge bg-${hostel.gender === "Male" ? "info" : "warning"}`}>
                            {hostel.gender || "Male"}
                          </span>
                        </p>
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
                    <button
                      className="btn-view-rooms"
                      onClick={() => navigate(`/hostels/${hostel._id}/rooms`)}
                    >
                      <i className="bi bi-door-open"></i>
                      <span>Available Rooms</span>
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
