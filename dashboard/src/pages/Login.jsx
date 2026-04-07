import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client.js';
import useAuthStore from '../store/authStore.js';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setToken, setUser } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

return (
  <div
    style={{
      maxWidth: '400px',
      margin: '160px auto',
      padding: '4rem',
      background: "rgb(245,245,245)",
      borderRadius: "10px",
      textAlign: "center"
    }}
  >
    <h2 style={{ marginBottom: "1.5rem" }}>Login</h2>

    {error && <p style={{ color: 'red' }}>{error}</p>}

    <form
      onSubmit={handleLogin}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px"
      }}
    >
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        style={{
          width: '100%',
          padding: '10px',
          border: "1px solid #d1d5db",
          borderRadius: "4px"
        }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        style={{
          width: '100%',
          padding: '10px',
          border: "1px solid #d1d5db",
          borderRadius: "4px"
        }}
      />

      <button
        type="submit"
        style={{
          padding: '0.8rem',
          background: "#6baed6",
          border: "0px",
          borderRadius: "2rem",
          color: "white",
          cursor: "pointer",
          marginTop: "10px"
        }}
      >
        Login
      </button>
    </form>

    <p style={{ marginTop: "1rem" }}>
      Don't have an account? <a href="/register">Register</a>
    </p>
  </div>
);
};

export default Login;