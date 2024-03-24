import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const NavLink = ({ to, children, onClose }) => {
  return (
    <Link
      to={to}
      className="navitem-link"
      onClick={onClose}
      activeprops={{
        style: {
          paddingRight: "1em",
          textIndent: "1em",
          backgroundColor: "#d4f2eb",
          boxShadow: "rgb(168 174 172) inset 2px 2px 4px 0px",
        },
      }}
      inactiveprops={{
        style: {
          fontWeight: "bold",
          boxShadow: "rgb(168 174 172) 0px 16px 12px 0px",
          padding: "0.6em",
        },
      }}
    >
      {children}
    </Link>
  );
};

NavLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default NavLink;
