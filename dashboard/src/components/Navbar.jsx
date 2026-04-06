import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ padding: '1rem', background: '#1f2937', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <Link to="/" style={{ color: 'white', marginRight: '1rem' }}>Dashboard</Link>
        <Link to="/consent" style={{ color: 'white' }}>Consent Management</Link>
      </div>
      <div>
        {user ? (
          <>
            <span>Welcome, {user.name || user.email}</span>
            <button onClick={handleLogout} style={{ marginLeft: '1rem', background: 'red', color: 'white', border: 'none', padding: '5px 10px' }}>
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