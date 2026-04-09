import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";
import { FiMapPin, FiPhone } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-[#245680] text-white">
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/logo.png"
              alt="INTELLISTAY Logo"
              className="navbar__logo-img"
            />
          </div>
          <p className="text-sm text-gray-200 leading-relaxed">
            Your trusted platform for finding the perfect hostel accommodation.
            Connecting students and travelers with comfortable, affordable homes
            away from home.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4 ml-7">Quick links</h4>
          <ul className="space-y-2 text-sm text-gray-200">
            <li>
              <Link
                to="/"
                className="hover:text-white"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/hostels"
                className="hover:text-white"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Hostels
              </Link>
            </li>
            <li>
              <Link
                to="/rooms"
                className="hover:text-white"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Rooms
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-white"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
          <div className="flex items-start gap-3 mb-4 text-sm text-gray-200">
            <FiMapPin className="text-xl mt-1" />
            <span>
              Bahria University <br />
              Islamabad Campus
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-200">
            <FiPhone className="text-xl" />
            <span>(329) 580-7077</span>
          </div>
        </div>

        {/* Social */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
          <p className="text-sm text-gray-200 mb-4">
            Follow us on social media.
          </p>
          <div className="flex gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-icon"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-icon"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-icon"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
            <a
              href="https://wa.me/923295807077"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-icon"
              aria-label="WhatsApp"
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-100 text-gray-600 text-sm py-4 text-center">
        © 2026 Intellistay. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
