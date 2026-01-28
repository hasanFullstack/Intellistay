import { useEffect, useState } from "react";
import AOS from "aos";
import { getAllHostels } from "../api/hostel.api";
import { getRoomsByHostel } from "../api/room.api";
import HostelHero from "../components/HostelHero";

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
    <>
      {/* HERO SECTION */}
      <HostelHero />

      {/* FEATURE SECTION */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row text-center">
            {["Verified Hostels", "Affordable Pricing", "Student Friendly"].map(
              (item, i) => (
                <div key={i} className="col-md-4" data-aos="zoom-in">
                  <h4 className="fw-bold">{item}</h4>
                  <p className="text-muted">
                    Trusted accommodation with modern facilities.
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* HOSTELS SECTION */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-4" data-aos="fade-up">
            Popular Hostels
          </h2>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row">
              {hostels.map((h) => (
                <div className="col-md-4 mb-4" key={h._id} data-aos="fade-up">
                  <div className="card shadow-sm h-100">
                    <img
                      src="https://images.unsplash.com/photo-1554995207-c18c203602cb"
                      className="card-img-top"
                      alt="hostel"
                    />
                    <div className="card-body">
                      <h5 className="card-title">{h.name}</h5>
                      <p className="card-text text-muted">{h.location}</p>

                      {/* Room Info */}
                      <div className="mb-3">
                        <div className="small mb-2">
                          <span className="badge bg-info">
                            {(hostelRooms[h._id] || []).length} rooms
                          </span>
                          {getAvailableRoomsCount(h._id) > 0 && (
                            <span className="badge bg-success ms-2">
                              {getAvailableRoomsCount(h._id)} available
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="fw-bold text-success">
                        From Rs {getMinPrice(h._id)} per bed
                      </p>

                      {h.amenities && h.amenities.length > 0 && (
                        <div className="mb-3">
                          <small className="text-muted">Amenities:</small>
                          <div>
                            {h.amenities.slice(0, 2).map((amenity, i) => (
                              <span
                                key={i}
                                className="badge bg-light text-dark me-1 mb-1"
                              >
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <button className="btn btn-outline-primary w-100">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-5 bg-dark text-white text-center">
        <div className="container" data-aos="zoom-in">
          <h2>Are You a Hostel Owner?</h2>
          <p>List your hostel and reach more students</p>
          <a href="/register" className="btn btn-warning">
            Register as Owner
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-4 bg-light text-center">
        <p className="mb-0">© 2026 IntelliStay. All rights reserved.</p>
      </footer>
    </>
  );
};

export default Home;
