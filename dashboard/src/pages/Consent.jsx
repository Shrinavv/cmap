import { useEffect, useState } from 'react';
import api from '../api/client';
import ConsentCard from '../components/ConsentCard';

const Consent = () => {
  const [consents, setConsents] = useState([]);
  const [grievances, setGrievances] = useState([]);
  const [domain, setDomain] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [consentRes, grievanceRes] = await Promise.all([
        api.get('/consent'),
        api.get('/consent/grievances')
      ]);
      setConsents(consentRes.data.consents || []);
      setGrievances(grievanceRes.data.grievances || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmitGrievance = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await api.post('/consent/grievance', { domain, subject, description });
      setMessage("✅ Grievance filed successfully and notification sent to the website!");
      setDomain(''); setSubject(''); setDescription('');
      fetchData();
    } catch (err) {
      setMessage("❌ Failed to file grievance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <h1>DPDP Consent & Grievance Management</h1>

      {/* Consents */}
      <h2 style={{ margin: '30px 0 15px' }}>Your Active Consents</h2>
      {consents.length === 0 ? <p>No consents recorded yet.</p> :
        consents.map(c => <ConsentCard key={c._id} consent={c} onWithdraw={() => {}} />)
      }

      {/* File Grievance */}
      <div style={{ marginTop: '50px', padding: '25px', border: '2px solid #ef4444', borderRadius: '12px', background: '#fff' }}>
        <h2 style={{ color: '#b91c1c' }}>File a Grievance</h2>
        <form onSubmit={handleSubmitGrievance}>
          <input
            type="text"
            placeholder="Domain (e.g. google.com)"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            required
            style={{ width: '50%', padding: '12px', margin: '10px 0', fontSize: '16px',border:"2px solid #d1d5db",borderRadius:"4px" }}
          /><br></br>
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            style={{ width: '95%', padding: '12px', margin: '10px 0', fontSize: '16px',border:"2px solid #d1d5db",borderRadius:"4px" }}
          />
          <textarea
            placeholder="Describe your grievance in detail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="5"
            required
            style={{ width: '95%', padding: '12px', margin: '10px 0', fontSize: '16px',border:"2px solid #d1d5db",borderRadius:"4px",resize:"none" }}
          />
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: '12px 25px', 
              background: '#dc2626', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px',
              fontSize: '16px'
            }}
          >
          <input type="text" placeholder="Domain (e.g. google.com)" value={domain} onChange={e => setDomain(e.target.value)} required style={{width:'100%', padding:'12px', margin:'10px 0'}} />
          <input type="text" placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} required style={{width:'100%', padding:'12px', margin:'10px 0'}} />
          <textarea placeholder="Describe your grievance..." value={description} onChange={e => setDescription(e.target.value)} rows="5" required style={{width:'100%', padding:'12px', margin:'10px 0'}} />
          <button type="submit" disabled={loading} style={{padding:'12px 25px', background:'#dc2626', color:'white', border:'none', borderRadius:'6px'}}>
            {loading ? 'Submitting...' : 'Submit & Notify Website'}
          </button>
        </form>
        {message && <p style={{marginTop:'15px', color:'green'}}>{message}</p>}
      </div>

      {/* User's Grievances - View Only */}
      <h2 style={{ margin: '50px 0 20px' }}>Your Grievances</h2>
      {grievances.length === 0 ? (
        <p>You have not filed any grievances yet.</p>
      ) : (
        grievances.map(g => (
          <div key={g._id} style={{ border: '1px solid #ddd', padding: '20px', margin: '15px 0', borderRadius: '10px', background: '#f9fafb' }}>
            <h4>{g.subject}</h4>
            <p><strong>Domain:</strong> {g.domain}</p>
            <p>{g.description}</p>
            <p><strong>Status:</strong> <span style={{ color: g.status === 'resolved' ? 'green' : g.status === 'rejected' ? 'red' : 'orange' }}>{g.status.toUpperCase()}</span></p>
            
            {g.fiduciaryReply && (
              <div style={{ marginTop: '15px', padding: '15px', background: '#fff', borderLeft: '4px solid #3b82f6' }}>
                <strong>Reply from Website:</strong><br />
                {g.fiduciaryReply}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Consent;