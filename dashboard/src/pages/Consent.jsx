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

  // For updating grievance status
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [status, setStatus] = useState('');
  const [fiduciaryReply, setFiduciaryReply] = useState('');

  const fetchData = async () => {
    try {
      const [consentRes, grievanceRes] = await Promise.all([
        api.get('/consent'),
        api.get('/consent/grievances')
      ]);
      setConsents(consentRes.data.consents || []);
      setGrievances(grievanceRes.data.grievances || []);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmitGrievance = async (e) => {
    e.preventDefault();
    if (!domain || !subject || !description) {
      setMessage("All fields are required");
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await api.post('/consent/grievance', { domain, subject, description });
      setMessage("✅ Grievance filed successfully and notification sent!");
      setDomain('');
      setSubject('');
      setDescription('');
      fetchData();
    } catch (err) {
      setMessage("❌ Failed to file grievance");
    } finally {
      setLoading(false);
    }
  };

  // Open update modal/form for a grievance
  const openUpdateForm = (grievance) => {
    setSelectedGrievance(grievance);
    setStatus(grievance.status);
    setFiduciaryReply(grievance.fiduciaryReply || '');
  };

  // Update grievance status and reply
  const handleUpdateGrievance = async (e) => {
    e.preventDefault();
    if (!selectedGrievance || !status) return;

    try {
      await api.put(`/consent/grievance/${selectedGrievance._id}`, {
        status,
        fiduciaryReply
      });
      setMessage(`Grievance marked as ${status.toUpperCase()}`);
      setSelectedGrievance(null);
      fetchData();
    } catch (err) {
      setMessage("Failed to update grievance");
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <h1>DPDP Consent & Grievance Management</h1>

      {/* Consent Section */}
      <h2 style={{ margin: '30px 0 15px' }}>Your Active Consents</h2>
      {consents.length === 0 ? (
        <p>No consents recorded yet.</p>
      ) : (
        consents.map(c => (
          <ConsentCard 
            key={c._id} 
            consent={c} 
            onWithdraw={(id) => api.post('/consent/withdraw', { consentId: id }).then(fetchData)} 
          />
        ))
      )}

      {/* File New Grievance */}
      <div style={{ 
        marginTop: '50px', 
        padding: '25px', 
        border: '2px solid #ef4444', 
        borderRadius: '12px', 
        background: '#fff' 
      }}>
        <h2 style={{ color: '#b91c1c' }}>File a Grievance (DPDP Compliant)</h2>
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
            {loading ? 'Submitting...' : 'Submit & Notify Website'}
          </button>
        </form>
        {message && <p style={{ marginTop: '15px', color: 'green', fontWeight: '500' }}>{message}</p>}
      </div>

      {/* Grievances List */}
      <h2 style={{ margin: '50px 0 20px' }}>Your Filed Grievances</h2>
      
      {grievances.length === 0 ? (
        <p>You have not filed any grievances yet.</p>
      ) : (
        grievances.map(g => (
          <div key={g._id} style={{ 
            border: '1px solid #ddd', 
            padding: '20px', 
            margin: '15px 0', 
            borderRadius: '10px',
            background: '#f9fafb'
          }}>
            <h4>{g.subject}</h4>
            <p><strong>Domain:</strong> {g.domain}</p>
            <p>{g.description}</p>
            
            <p>
              <strong>Status:</strong> 
              <span style={{ 
                color: g.status === 'notified' ? '#f59e0b' : 
                       g.status === 'resolved' ? '#16a34a' : '#ef4444',
                fontWeight: '600',
                marginLeft: '10px'
              }}>
                {g.status.toUpperCase()}
              </span>
            </p>

            {g.fiduciaryReply && (
              <div style={{ marginTop: '10px', padding: '10px', background: '#fff', borderRadius: '6px' }}>
                <strong>Reply from Website:</strong><br />
                {g.fiduciaryReply}
              </div>
            )}

            <button 
              onClick={() => openUpdateForm(g)}
              style={{ 
                marginTop: '15px', 
                padding: '8px 16px', 
                background: '#3b82f6', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Update Status / Add Reply
            </button>
          </div>
        ))
      )}

      {/* Update Status Modal/Form */}
      {selectedGrievance && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          zIndex: 1000,
          width: '90%',
          maxWidth: '500px'
        }}>
          <h3>Update Grievance Status</h3>
          <p><strong>Domain:</strong> {selectedGrievance.domain}</p>

          <form onSubmit={handleUpdateGrievance}>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
              style={{ width: '100%', padding: '10px', margin: '15px 0' }}
            >
              <option value="notified">Notified</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>

            <textarea
              placeholder="Paste the reply received from the website (optional)"
              value={fiduciaryReply}
              onChange={(e) => setFiduciaryReply(e.target.value)}
              rows="6"
              style={{ width: '100%', padding: '12px', margin: '10px 0' }}
            />

            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <button 
                type="submit"
                style={{ flex: 1, padding: '12px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '6px' }}
              >
                Save Update
              </button>
              <button 
                type="button"
                onClick={() => setSelectedGrievance(null)}
                style={{ flex: 1, padding: '12px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '6px' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Consent;