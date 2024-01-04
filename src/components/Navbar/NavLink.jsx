import { Link } from '@tanstack/react-router';
import PropTypes from 'prop-types';

const NavLink = ({ to, children }) => {
    return (
        <Link
            to={to}
            className="navitem-link"
            activeProps={{
                style: {
                    textDecoration: 'underline 1px rgb(255 255 255 / 64%)',
                    paddingRight: '1em',
                    textIndent: '1em',
                    fontWeight: 'bold'
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
    children: PropTypes.node.isRequired
};

export default NavLink;
