import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/navbar.css';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="logo"><Link to="/">CineMatch</Link></div>

      <ul className="nav-links">
        <li><Link to="/search">Search</Link></li>

        {user ? (
          <>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li onClick={logout} style={{ cursor: "pointer" }}>Logout</li>
          </>
        ) : (
          <li><Link to="/login">Login</Link></li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
