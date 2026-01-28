import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../src/auth/AuthContext";

const Navbar = ({ openAuth }) => {
  const { user } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <div className="navbar__brand">
          <Link to="/" className="navbar__logo">
            <img
              src="../public/logo.png"
              alt="INTELLISTAY Logo"
              className="navbar__logo-img"
            />
          </Link>
        </div>

        <nav className="navbar__links">
          <NavLink to="/" end className="navlink">
            Home
          </NavLink>
          <NavLink to="/about" className="navlink">
            About
          </NavLink>
        </nav>

        <div className="navbar__actions">
          {!user && (
            <button className="btn btn--ghost" onClick={openAuth}>
              Login
            </button>
          )}

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
        </div>
      </div>
    </header>
  );
};

export default Navbar;
