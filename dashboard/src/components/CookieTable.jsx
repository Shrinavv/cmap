const CookieTable = ({ cookies }) => {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Domain</th>
            <th>Name</th>
            <th>Value</th>
            <th>Expiration</th>
            <th>Secure</th>
          </tr>
        </thead>
        <tbody>
          {cookies.map((cookie, i) => (
            <tr key={i}>
              <td>{cookie.domain}</td>
              <td>{cookie.name}</td>
              <td>{cookie.value}</td>
              <td>{cookie.expirationDate}</td>
              <td>{cookie.secure ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CookieTable;