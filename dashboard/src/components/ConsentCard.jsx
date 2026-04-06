const ConsentCard = ({ consent, onWithdraw }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', margin: '10px 0', borderRadius: '8px' }}>
      <h4>{consent.consentType} Consent</h4>
      <p>Status: <strong>{consent.consentGiven ? 'Granted' : 'Withdrawn'}</strong></p>
      {consent.consentGiven && (
        <button onClick={() => onWithdraw(consent._id)} style={{ background: '#dc2626', color: 'white' }}>
          Withdraw Consent
        </button>
      )}
    </div>
  );
};

export default ConsentCard;