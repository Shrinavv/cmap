import { useState } from "react";

const styles = {
  tooltipCell: {
    position: "relative",
    cursor: "pointer"
  },
  tooltipBox: {
    position: "absolute",
    bottom: "40%",
    left: "100%",
    transform: "translateX(-115%)",
    background: "#222",
    color: "#fff",
    padding: "6px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    whiteSpace: "nowrap",
    zIndex: 1000
  }
};

const cookieDescriptions = {
  SID: "Session ID used by Google to identify user sessions",
  HSID: "Security cookie used for authentication",
  SSID: "Used for Google account authentication",
  APISID: "Used for personalization and ads",
  SAPISID: "Used for secure authentication and personalization",
  "__Secure-3PSIDCC": "Security cookie for protecting user data",
  "__Secure-1PSIDCC": "Google security and session protection cookie",
  NID: "Stores user preferences and personalization",
};

const getCookieDescription = (name) => {
  if (!name) return "Unknown cookie";

  const lower = name.toLowerCase();

  if (lower.includes("sess") || lower.includes("sid")) {
    return "Likely a session cookie used to maintain login state";
  }

  if (lower.includes("auth")) {
    return "Likely used for authentication and security";
  }

  if (lower.includes("ga") || lower.includes("track")) {
    return "Likely used for analytics or tracking";
  }

  if (lower.includes("pref")) {
    return "Stores user preferences";
  }

  return "General-purpose cookie (purpose unclear)";
};
const maskValue = (value) => {
  if (!value) return "N/A";

  if (value.length <= 12) return value;

  return value.slice(0, 6) + "..." + value.slice(-6);
};

const getCookieType = (name) => {
  const n = name?.toLowerCase() || "";

  if (n.includes("sid") || n.includes("sess")) return "Secure / Session";
  if (n.includes("auth")) return "Authentication";
  if (n.includes("ga") || n.includes("track")) return "Analytics";
  if (n.includes("ads")) return "Ads";

  return "Other";
};

const CookieTable = ({ cookies }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

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

              <td
                style={styles.tooltipCell}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {cookie.name || 'N/A'}

                {hoveredIndex === i && (
                  <span style={styles.tooltipBox}>
                    {cookieDescriptions[cookie.name] ||
                      getCookieDescription(cookie.name)}
                  </span>
                )}
              </td>

              <td>
                <div>{maskValue(cookie.value)}</div>
                <small style={{ color: "#666" }}>
                  {getCookieType(cookie.name)}
                </small>
              </td>
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