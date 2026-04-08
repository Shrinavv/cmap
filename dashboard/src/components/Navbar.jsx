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
    <nav style={{ padding: '1rem', background: '#1f2937', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <Link to="/" style={{ color: 'white', marginRight: '1.5rem' }}>Dashboard</Link>
        <Link to="/consent" style={{ color: 'white', marginRight: '1.5rem' }}>Consent</Link>
        
        {user?.role === 'admin' && (
          <Link to="/admin/grievances" style={{ color: '#60a5fa', fontWeight: '600' }}>
            👑 Admin Grievances
          </Link>
        )}
      </div>

      <div>
        {user ? (
          <>
            <span style={{ marginRight: '1rem' }}>
              {user.role === 'admin' ? '👑 Admin' : 'User'} — {user.name || user.email}
            </span>
            <button onClick={handleLogout} style={{ background: 'red', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px' }}>
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