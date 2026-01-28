import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../src/auth/AuthContext";

const Navbar = ({ openAuth }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
    }
  };

  return (
    <header className="navbar">
      <div className="navbar__inner container mx-auto">
        <div className="navbar__brand">
          <Link to="/" className="navbar__logo">
            <img
              src="/logo.png"
              alt="INTELLISTAY Logo"
              className="navbar__logo-img"
            />
          </Link>
        </div>

        <nav className="navbar__links">
          <NavLink to="/" end className="navlink">
            Home
          </NavLink>
          <NavLink to="/hostels" className="navlink">
            Hostels
          </NavLink>
          <NavLink to="/rooms" className="navlink">
            Rooms
          </NavLink>
          <NavLink to="/contact" className="navlink">
            Contact
          </NavLink>
        </nav>

        <div className="navbar__actions">
          {!user && (
            <button className="btn btn--ghost" onClick={openAuth}>
              Login
            </button>
          )}

          {user && (
            <div className="navbar__user-menu">
              {user?.role === "student" && (
                <Link to="/dashboard/user" className="btn btn--ghost">
                  Dashboard
                </Link>
              )}
              {user?.role === "owner" && (
                <Link to="/dashboard/owner" className="btn btn--ghost">
                  Dashboard
                </Link>
              )}

              <button className="btn btn--outline" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
