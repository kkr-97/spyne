import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import Cookie from "js-cookie";

import { useSelector } from "react-redux";

const navItems = [
  {
    path: "/",
    name: "Home",
    icon: "fa-solid fa-house",
  },
  {
    path: "/products",
    name: "Products",
    icon: "fa-solid fa-list",
  },
];

function Navbar() {
  const [isDropDownOpen, setDropDown] = useState(false);

  const userName = useSelector((state) => state.user.username);

  const onClickProfile = () => {
    setDropDown(!isDropDownOpen);
  };

  const navigate = useNavigate();

  const onLogout = () => {
    Cookie.remove("token");
    navigate("/sign", { replace: true });
  };

  const Profile = () => (
    <div className="position-relative align-items-center justify-content-center">
      <div
        onClick={onClickProfile}
        className="profile-container d-flex align-items-center"
      >
        <p
          className="rounded-circle text-white m-0 mx-1 d-flex align-items-center justify-content-center p-2 bg-secondary"
          style={{ width: "30px", height: "30px" }}
        >
          {userName[0]?.toUpperCase()}
        </p>
        <i
          className={
            "fa-solid fa-chevron-down text-secondary ms-1 rotate-arrow d-none d-md-flex " +
            (isDropDownOpen ? "down" : "up")
          }
        ></i>
      </div>
      {isDropDownOpen && (
        <div className="drop-down bg-secondary p-3">
          <h5 className="d-flex align-items-center profile-name border-bottom py-2">
            Hello {userName}
          </h5>

          <button className="btn btn-warning" onClick={onLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );

  return (
    <nav className="navbar navbar-expand-md bg-dark navbar-dark border-bottom border-secondary p-2 mb-4 position-sticky z-1 top-0">
      <div className="container">
        <NavLink className="navbar-brand" to="/">
          Spyne
          {/* <img
            src="assets/images/journaling.png"
            alt="logo"
            style={{ height: "2.5rem", marginLeft: "4px" }}
          /> */}
        </NavLink>

        <div
          className="d-flex align-items-center d-md-none"
          aria-expanded="false"
        >
          <Profile />
          <button
            className="navbar-toggler navbar-toggler-icon d-flex align-items-center"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          ></button>
        </div>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {navItems.map((item) => (
              <li className="nav-item" key={item.path}>
                <NavLink className="nav-link" to={item.path}>
                  <i className={"mx-2 " + item.icon}></i>
                  {item.name}
                </NavLink>
              </li>
            ))}
            <li className="d-none d-md-flex align-items-center">
              <Profile />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
