import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuthStore from '../store/authStore.js';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [hovered, setHovered] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkStyle = (name) => ({
    color: hovered === name ? "#38bdf8" : "white",
    textDecoration: "none",
    marginRight: "1rem",
    transition: "0.2s",
    paddingBottom: "2px"
  });

  return (
    <nav style={{
      padding: '1rem',
      background: '#1f2937',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between'
    }}>
      
      <div>
        <Link
          to="/"
          style={linkStyle("dashboard")}
          onMouseEnter={() => setHovered("dashboard")}
          onMouseLeave={() => setHovered(null)}
        >
          Dashboard
        </Link>

        <Link
          to="/consent"
          style={linkStyle("consent")}
          onMouseEnter={() => setHovered("consent")}
          onMouseLeave={() => setHovered(null)}
        >
          Consent Management
        </Link>
      </div>

      <div>
        {user ? (
          <>
            <span>Welcome, {user.name || user.email}</span>

            <button
              onClick={handleLogout}
              style={{
                marginLeft: '1rem',
                background: 'red',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                borderRadius: "1rem",
                cursor: "pointer"
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" style={{ color: 'white', textDecoration: "none" }}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;