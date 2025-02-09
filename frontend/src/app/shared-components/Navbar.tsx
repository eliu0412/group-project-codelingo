import { Link } from "react-router-dom";

function Navbar() {
  return (
    <>
      <nav>
        <ul className="flex justify-center">
          <li className="mx-8 my-6 px-4 py-1 bg-sky-100 rounded-3xl">
            <Link to="/" className="text-sm">
              Home
            </Link>
          </li>
          <li className="mx-8 my-6 px-4 py-1">
            <Link to="/about" className="text-sm">
              About
            </Link>
          </li>
          <li className="mx-8 my-6 px-4 py-1">
            <Link to="/contact" className="text-sm">
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Navbar;
