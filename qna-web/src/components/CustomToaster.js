// CustomToaster.js
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const CustomToaster = ({
  message,
  duration,
  position,
  onClose,
  appearance,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setVisible(false);
    onClose();
  };

  const getPositionStyles = () => {
    switch (position) {
      case "top":
        return { top: "20px", left: "50%", transform: "translateX(-50%)" };
      case "bottom":
        return { bottom: "20px", left: "50%", transform: "translateX(-50%)" };
      case "right-top":
        return { top: "10%", right: "20px" };
      case "left-top":
        return { top: "20px", left: "20px" };
      // Add more positions as needed
      default:
        return { top: "20px", left: "50%", transform: "translateX(-50%)" };
    }
  };

  const getAppearanceStyles = () => {
    switch (appearance) {
      case "success":
        return {
          background:
            "linear-gradient(0deg, #00E05D, #00E05D), linear-gradient(0deg, #CCFFE1, #CCFFE1)",
        };
      case "error":
        return {
          background:
            "linear-gradient(0deg, #FF5757, #FF5757), linear-gradient(0deg, #FFB2B2, #FFB2B2)",
        };
      // Add more appearances as needed
      default:
        return {
          background:
            "linear-gradient(0deg, #00E05D, #00E05D), linear-gradient(0deg, #CCFFE1, #CCFFE1)",
        };
    }
  };

  return (
    <div className="greenToast"
      style={{
        zIndex: "1",
        position: "fixed",
        color: "#00E05D",
        borderRadius: "16px",
        display: visible ? "flex" : "none",
        alignItems: "center",
        ...getPositionStyles(),
        ...getAppearanceStyles(),
      }}
    >
      <div className="insideGreen">
        {appearance === "success" ? (
          <div style={{display: "flex", height: "26px"}}>
            <img
              src="/images/white-circle-check.svg"
              alt="check"
              style={{ color: "#fffff" }}
            />
          </div>
        ) : (
          <div style={{ marginRight: "10px", display: "flex"}}>
            <img src="/images/Info.svg" alt="check" />
          </div>
        )}
      </div>
      <div style={{ flex: 1 }}>{message}</div>

      <img
        src="/images/greenClose.svg"
        alt="check"
        style={{ marginLeft: "10px" }}
        onClick={handleClose}
      />
    </div>
  );
};

CustomToaster.propTypes = {
  message: PropTypes.string.isRequired,
  duration: PropTypes.number.isRequired,
  position: PropTypes.oneOf(["top", "bottom", "right-top", "left-top"]),
  onClose: PropTypes.func.isRequired,
  appearance: PropTypes.oneOf(["success", "error"]),
};

CustomToaster.defaultProps = {
  position: "top",
  appearance: "success",
};

export default CustomToaster;
