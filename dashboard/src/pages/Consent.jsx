import { useEffect, useState } from 'react';
import api from '../api/client';
import ConsentCard from '../components/ConsentCard.jsx';

const Consent = () => {
  const [consents, setConsents] = useState([]);

  const fetchConsents = () => {
    api.get('/consent')
      .then(res => setConsents(res.data.consents))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchConsents();
  }, []);

  const handleWithdraw = (id) => {
    api.post('/consent/withdraw', { consentId: id })
      .then(() => fetchConsents());
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>DPDP Consent Management</h1>
      {consents.map(c => (
        <ConsentCard key={c._id} consent={c} onWithdraw={handleWithdraw} />
      ))}
    </div>
  );
};

export default Consent;