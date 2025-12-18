import { useState } from "react";
import { lookupIPGeolocation } from "../../../utils/securityUtils";
import "../Tools.css";

const IpGeolocation = () => {
  const [ip, setIp] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const lookupIp = async () => {
    if (ip.trim() && !ip.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/)) {
      setError("Please enter a valid IP address.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const geoData = await lookupIPGeolocation(ip);
      setResult(geoData);
    } catch (err) {
      console.error("Error looking up IP:", err);
      setError("Failed to lookup IP geolocation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      lookupIp();
    }
  };

  return (
    <div className="security-tools">
      <div className="sec-tool-container">
        <div className="sec-tool-header">
          <h1 className="sec-tool-title page-title">IP Geolocation</h1>
          <p className="sec-tool-subtitle">Find the geographical location of an IP address</p>
        </div>
        <div className="sec-tool-card">
          <div className="sec-tool-card-body">
            <div className="sec-tool-form-group">
              <label htmlFor="ipAddress" className="sec-tool-label">
                Enter IP Address
              </label>
              <input
                type="text"
                id="ipAddress"
                className="sec-tool-input"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., 8.8.8.8"
              />
              <p className="sec-tool-info">Leave blank to lookup your current IP address.</p>
            </div>
            <button className="sec-tool-button" onClick={lookupIp} disabled={isLoading}>
              {isLoading ? "Looking up..." : "Lookup IP"}
            </button>
            {error && <div className="sec-tool-error">{error}</div>}
            {isLoading && (
              <div className="sec-tool-loading">
                <div className="sec-tool-spinner"></div>
                <p>Looking up IP geolocation...</p>
              </div>
            )}
            {result && !error && (
              <div className="sec-tool-result">
                <h4 className="sec-tool-result-header">IP Geolocation Results:</h4>
                <div className="sec-tool-geo-details">
                  <div className="sec-tool-geo-map">
                    <a
                      href={`https://www.openstreetmap.org/?mlat=${result.lat}&mlon=${result.lon}#map=10/${result.lat}/${result.lon}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sec-tool-button"
                      style={{ display: 'inline-block', marginBottom: '1rem' }}
                    >
                      View on OpenStreetMap
                    </a>
                  </div>
                  <table className="sec-tool-table">
                    <tbody>
                      <tr>
                        <td><strong>IP Address:</strong></td>
                        <td>{result.ip}</td>
                      </tr>
                      <tr>
                        <td><strong>City:</strong></td>
                        <td>{result.city || "Unknown"}</td>
                      </tr>
                      <tr>
                        <td><strong>Region:</strong></td>
                        <td>{result.region || "Unknown"}</td>
                      </tr>
                      <tr>
                        <td><strong>Country:</strong></td>
                        <td>{result.country || "Unknown"}</td>
                      </tr>
                      <tr>
                        <td><strong>Coordinates:</strong></td>
                        <td>{result.lat}, {result.lon}</td>
                      </tr>
                      <tr>
                        <td><strong>ISP:</strong></td>
                        <td>{result.isp || "Unknown"}</td>
                      </tr>
                      <tr>
                        <td><strong>Timezone:</strong></td>
                        <td>{result.timezone || "Unknown"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="sec-tool-info">
                  <p>
                    <strong>Note:</strong> IP geolocation is not always accurate and typically provides the location of
                    the ISP's servers, not the exact physical location.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IpGeolocation;
