import { useEffect, useState } from 'react';
import api from '../api/client';
import CookieTable from '../components/CookieTable.jsx';

const Dashboard = () => {
  const [cookies, setCookies] = useState([]);

  useEffect(() => {
    api.get('/cookies')
      .then(res => setCookies(res.data.cookies))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h1>My Synced Cookies</h1>
      <CookieTable cookies={cookies} />
    </div>
  );
};

export default Dashboard;