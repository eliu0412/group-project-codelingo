import { NavLink } from "react-router-dom";
import "../styles/navbar.css";
function Navbar() {
  return (
    <>
      <nav className="flex justify-end">
        <ul className="flex justify-center mr-85">
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
        <ul className="">
          <li className="mx-8 my-6 text-sm text-white bg-blue-600 py-1 px-2 rounded-3xl">
            <NavLink to="/join-lobby">
              <span className="text-white">Join Lobby</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Navbar;
