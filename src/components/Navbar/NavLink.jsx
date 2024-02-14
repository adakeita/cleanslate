import { Link } from '@tanstack/react-router';
import PropTypes from 'prop-types';

const NavLink = ({ to, children, onClose }) => {
    return (
        <Link
            to={to}
            className="navitem-link"
            onClick={onClose}
            activeProps={{
                style: {
                    textDecoration: 'underline 1px rgb(255 255 255 / 64%)',
                    paddingRight: '1em',
                    textIndent: '1em',
                    fontWeight: 'bold',
                    backgroundColor:"#90e2cf82",
                    boxShadow:"rgb(168 174 172) 2px 3px 5px 0px"
                }
            }}
            inactiveProps={{
                style: { fontWeight: 'normal' }
            }}
        >
            {children}
        </Link>
    );
};

NavLink.propTypes = {
    to: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    onClose: PropTypes.func.isRequired
};

export default NavLink;
