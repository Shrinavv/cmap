import { useEffect, useState } from 'react';
import api from '../api/client';

const AdminGrievances = () => {
  const [grievances, setGrievances] = useState([]);
  const [message, setMessage] = useState('');
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');

  const fetchGrievances = async () => {
    try {
      const res = await api.get('/consent/admin/grievances');
      setGrievances(res.data.grievances);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  // Save Reply (keeps current status)
  const saveReply = async (id) => {
    try {
      await api.put(`/consent/grievance/${id}`, {
        fiduciaryReply: replyText
        // Do NOT send status here → preserve existing status
      });
      setMessage('✅ Reply saved successfully');
      setReplyingId(null);
      setReplyText('');
      fetchGrievances();
    } catch (err) {
      setMessage('❌ Failed to save reply');
      console.error(err);
    }
  };

  // Update Status (keeps existing reply)
  const updateStatus = async (id) => {
    if (!selectedStatus) return;
    try {
      await api.put(`/consent/grievance/${id}`, {
        status: selectedStatus
        // Do NOT send fiduciaryReply → preserve existing reply
      });
      setMessage(`✅ Status updated to ${selectedStatus.toUpperCase()}`);
      setUpdatingId(null);
      fetchGrievances();
    } catch (err) {
      setMessage('❌ Failed to update status');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Admin - Manage All Grievances</h1>
      {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}

      <table border="1" cellPadding="12" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ background: '#1f2937', color: 'white' }}>
            <th>User</th>
            <th>Domain</th>
            <th>Subject</th>
            <th>Description</th>
            <th>Status</th>
            <th>Admin Reply</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {grievances.map(g => (
            <tr key={g._id}>
              <td>{g.userId?.name || g.userId?.email}</td>
              <td>{g.domain}</td>
              <td>{g.subject}</td>
              <td style={{ maxWidth: '250px' }}>{g.description}</td>
              <td><strong>{g.status.toUpperCase()}</strong></td>
              <td style={{ maxWidth: '300px' }}>
                {g.fiduciaryReply || <em style={{ color: '#888' }}>No reply yet</em>}
              </td>
              <td>
                <button
                  onClick={() => { 
                    setReplyingId(g._id); 
                    setReplyText(g.fiduciaryReply || ''); 
                  }}
                  style={{ marginRight: '8px', padding: '6px 12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                  Reply
                </button>
                <button
                  onClick={() => { 
                    setUpdatingId(g._id); 
                    setSelectedStatus(g.status); 
                  }}
                  style={{ padding: '6px 12px', background: '#eab308', color: 'black', border: 'none', borderRadius: '4px' }}
                >
                  Update Status
                </button>

                {/* Reply Input Box */}
                {replyingId === g._id && (
                  <div style={{ marginTop: '10px' }}>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows="3"
                      style={{ width: 'auto', padding: '8px',resize:"none" }}
                      placeholder="Type reply from the website..."
                    />
                    <br />
                    <button onClick={() => saveReply(g._id)} style={{ marginRight: '8px', background: '#16a34a', color: 'white' }}>Save Reply</button>
                    <button onClick={() => setReplyingId(null)}>Cancel</button>
                  </div>
                )}

                {/* Status Update Box */}
                {updatingId === g._id && (
                  <div style={{ marginTop: '10px' }}>
                    <select 
                      value={selectedStatus} 
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      style={{ padding: '8px', marginRight: '8px' }}
                    >
                      <option value="notified">Notified</option>
                      <option value="resolved">Resolved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <br />
                    <button onClick={() => updateStatus(g._id)} style={{ background: '#16a34a', color: 'white', marginRight: '8px' }}>Save Status</button>
                    <button onClick={() => setUpdatingId(null)}>Cancel</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminGrievances;