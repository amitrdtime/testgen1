import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Icon, Input, Button, Image, Grid,Popup } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../actions/authActions";

const NavItem = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const currentUserType = useSelector((state) => state.auth.user);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const isActive = () => {
    var linkPath = item.link;
    if (
      item.link === "/data-console" &&
      location.pathname.includes("/add-doc")
    ) {
      return true;
    } else {
      return location.pathname.includes(linkPath);
    }
  };

  return (
    <li className={isActive() ? "active" : ""}>
      <Link to={item.link} onClick={handleToggle}>
        {item.icon && typeof item.icon === "string" && (
          <Image
            src={item.icon}
            alt="Icon"
            className="icon"
            style={{ border: " #14181F" }}
          />
        )}
        <span className="title">{item.text}</span>
      </Link>
      {item.submenu && isOpen && (
        <ul className="submenu">
          {item.submenu.map((subitem) => (
            <li key={subitem.text}>
              <Link to={subitem.link}>
                {subitem.icon && typeof subitem.icon === "string" && (
                  <Image
                    src={subitem.icon}
                    alt="Subitem Icon"
                    className="icon"
                  />
                )}
                <span className="title">{subitem.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

const Sidebar = () => {
  const dispatch = useDispatch();
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [userName, setusername] = useState("");
  const [userEmail, setuserEmail] = useState("");
  const [userType, setuserType] = useState("");
  const currentUserType = useSelector((state) => state.auth.user);
  const userToken = useSelector((state) => state.auth.token);

  const [isProfilePopupVisible, setProfilePopupVisible] = useState(false);
  const profilePopupRef = useRef(null);
  const userProfileBoxRef = useRef(null);

  const toggleProfilePopup = () => {
    setProfilePopupVisible(!isProfilePopupVisible);
  };

  const handleClickOutside = (event) => {
    if (
      profilePopupRef.current &&
      !profilePopupRef.current.contains(event.target) &&
      !userProfileBoxRef.current.contains(event.target)
    ) {
      setProfilePopupVisible(false);
    }
  };

  useEffect(() => {
    // Add event listener when the component mounts
    document.addEventListener("mousedown", handleClickOutside);
    // Clean up event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // empty dependency array means this effect will run only once, when the component mounts

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  useEffect(() => {
    if (userToken) {
      setusername(userToken.name);
      setuserEmail(userToken.extension_UserEmail);
    }
    setuserType(currentUserType);
  }, [currentUserType, userToken]);

  const generateUserNav = (userType) => {
    if (userType === "User") {
      // return [
      //   {
      //     text: "Admin Console",
      //     link: "/admin-console",
      //     icon: "/images/admin-console-icon.svg",
      //     submenu: [
      //       {
      //         text: "All Users",
      //         link: "/admin-console/all-users",
      //         icon: "/images/users.svg",
      //       },
      //       {
      //         text: "Requests",
      //         link: "/admin-console/requests",
      //         icon: "/images/user.svg",
      //       },
      //     ],
      //   },
      // ];
      return [
        {
          text: "AI Assistant",
          link: "/ai-assistant",
          icon: "/images/ai-assistant.svg",
        },
      ];
    } else if (userType === "Admin") {
      return [
        {
          text: "Data Console",
          link: "/data-console",
          icon: "/images/data-console.svg",
        },
        {
          text: "AI Assistant",
          link: "/ai-assistant",
          icon: "/images/ai-assistant.svg",
        },
      ];
    } else {
      // Handle other user types or default case
      return [];
    }
  };

  const nav = generateUserNav(userType);

  return (
    <>
      {isSidebarVisible && (
        <div className="sidebar" data-simplebar>
          <div style={{ padding: "34px 36px 22px 36px" }}>
            <Image src="/images/Logo.svg" alt="Logo" />
          </div>
          <div className="navigationIcons">
            <ul>
              {nav.map((item) => (
                <NavItem key={item.text} item={item} />
              ))}
            </ul>
            <div className="bottomNav">
              <div className="pramoteImage">
                <div className="textImage">
                  <h4>Upload,</h4>
                  <h4>Question,</h4>
                  <h4>Understand!</h4>
                </div>
                <Image src="/images/NavigationImage.svg" />
              </div>
              {isProfilePopupVisible && (
                <div ref={profilePopupRef} className="profile-popup">
                  {/* <div className="profile-settings">
                    <img src="/images/Settings.svg" alt="check" />
                    <span>Settings</span>
                  </div> */}
                  <div className="profile-logout" onClick={handleLogout}>
                    <img src="/images/log_out.svg" alt="check" />
                    <span>Logout</span>
                  </div>
                </div>
              )}
              <div
                ref={userProfileBoxRef}
                className="userProfileBox"
                onClick={toggleProfilePopup}
              >
                <div className="userIcon">
                  <svg
                    width="18"
                    height="20"
                    viewBox="0 0 18 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17 19V17C17 15.9391 16.5786 14.9217 15.8284 14.1716C15.0783 13.4214 14.0609 13 13 13H5C3.93913 13 2.92172 13.4214 2.17157 14.1716C1.42143 14.9217 1 15.9391 1 17V19M13 5C13 7.20914 11.2091 9 9 9C6.79086 9 5 7.20914 5 5C5 2.79086 6.79086 1 9 1C11.2091 1 13 2.79086 13 5Z"
                      stroke="#97A3BA"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="nameEmail">
                  <h4>{userName}</h4>
                  <Popup
                            content={userEmail}
                            inverted
                            position="right center"
                            style={{ borderRadius: "15px" }}
                            trigger={<p className="email">{userEmail.slice(0, 14) + "..."}</p>}
                          />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
