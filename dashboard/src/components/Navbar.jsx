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
    color: hovered === name ? '#60a5fa' : 'white',
    marginRight: '1.5rem',
    textDecoration: 'none',
    position: 'relative',
    paddingBottom: '4px',
    transition: 'color 0.3s ease',
    borderBottom: hovered === name ? '2px solid #60a5fa' : '2px solid transparent'
  });

  return (
    <nav style={{
      padding: '1rem',
      background: '#1f2937',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      
      <div>
        <Link
          to="/"
          style={linkStyle('dashboard')}
          onMouseEnter={() => setHovered('dashboard')}
          onMouseLeave={() => setHovered(null)}
        >
          Dashboard
        </Link>

        <Link
          to="/consent"
          style={linkStyle('consent')}
          onMouseEnter={() => setHovered('consent')}
          onMouseLeave={() => setHovered(null)}
        >
          Consent
        </Link>

        {user?.role === 'admin' && (
          <Link
            to="/admin/grievances"
            style={{ color: '#60a5fa', fontWeight: '600' }}
          >
            Admin Grievances
          </Link>
        )}
      </div>

      <div>
        {user ? (
          <>
            <span style={{ marginRight: '1rem' }}>
              {user.role === 'admin' ? 'Admin' : 'User'} — {user.name || user.email}
            </span>

            <button
              onClick={handleLogout}
              style={{
                background: 'red',
                color: 'white',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '2rem',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" style={{ color: 'white' }}>Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;