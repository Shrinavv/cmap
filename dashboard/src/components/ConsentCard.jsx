const ConsentCard = ({ consent, onWithdraw }) => {
  return (
    <div style={{ 
      border: '1px solid #e5e7eb', 
      padding: '18px', 
      margin: '12px 0', 
      borderRadius: '8px',
      background: '#fff'
    }}>
      <h4>{consent.consentType.charAt(0).toUpperCase() + consent.consentType.slice(1)} Consent</h4>
      <p>Status: <strong>{consent.consentGiven ? '✅ Granted' : '❌ Withdrawn'}</strong></p>
      
      {consent.consentGiven && (
        <button 
          onClick={() => onWithdraw(consent._id)} 
          style={{ 
            background: '#dc2626', 
            color: 'white', 
            border: 'none', 
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Withdraw Consent
        </button>
      )}
    </div>
  );
};

export default ConsentCard;