import { NavLink } from "react-router-dom";
import "../styles/navbar.css";
function Navbar() {
  return (
    <>
      <nav>
        <ul className="flex justify-center">
          <li className="mx-8 my-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              Home
            </NavLink>
          </li>
          <li className="mx-8 my-6">
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              About
            </NavLink>
          </li>
          <li className="mx-8 my-6">
            <NavLink
              to="/problems"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              Challenges
            </NavLink>
          </li>
          <li className="mx-8 my-6">
            <NavLink
              to="/discussions"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              Discussions
            </NavLink>
          </li>
          <li className="mx-8 my-6">
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              Contact
            </NavLink>
          </li>
          <li className="mx-8 my-6">
            <NavLink
              to="/lobby"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              Lobby
            </NavLink>
          </li>          
        </ul>
      </nav>
    </>
  );
}

export default Navbar;
