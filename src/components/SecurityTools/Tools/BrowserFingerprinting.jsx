import { useState } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import "../Tools.css";

const BrowserFingerprinting = () => {
  const [fingerprint, setFingerprint] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const generateFingerprint = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fpPromise = FingerprintJS.load();
      const fp = await fpPromise;
      const result = await fp.get();
      setFingerprint(result);
    } catch (err) {
      console.error("Error generating fingerprint:", err);
      setError("Failed to generate browser fingerprint");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateUniqueness = () => {
    if (!fingerprint || !fingerprint.components) return 0;
    let totalConfidence = 0;
    let componentCount = 0;
    Object.entries(fingerprint.components).forEach(([key, value]) => {
      if (typeof value === "object" && value.confidence !== undefined) {
        totalConfidence += value.confidence;
        componentCount++;
      }
    });
    return componentCount ? (totalConfidence / componentCount) * 100 : 0;
  };

  const uniqueness = fingerprint ? calculateUniqueness() : 0;

  return (
    <div className="security-tools">
      <div className="sec-tool-container">
        <div className="sec-tool-header">
          <h1 className="sec-tool-title page-title">Browser Fingerprinting</h1>
          <p className="sec-tool-subtitle">See how unique your browser fingerprint is</p>
        </div>

        <div className="sec-tool-card">
          <div className="sec-tool-card-body">
            <p className="sec-tool-info">
              Browser fingerprinting is a tracking technique that identifies you based on your browser's unique
              characteristics. This tool shows how easily you can be tracked across websites.
            </p>

            <button className="sec-tool-button" onClick={generateFingerprint} disabled={isLoading}>
              {isLoading ? "Analyzing..." : "Check Your Fingerprint"}
            </button>

            {isLoading && (
              <div className="sec-tool-loading">
                <div className="sec-tool-spinner"></div>
                <p>Generating browser fingerprint...</p>
              </div>
            )}

            {error && (
              <div className="sec-tool-result">
                <p className="sec-tool-error">{error}</p>
              </div>
            )}

            {fingerprint && !error && (
              <div className="sec-tool-result">
                <h4 className="sec-tool-result-header">Your Browser Fingerprint:</h4>

                <div className="sec-tool-fingerprint-id">
                  <p>
                    <strong>Visitor ID:</strong> <span className="sec-tool-code">{fingerprint.visitorId}</span>
                  </p>
                </div>

                <div className="sec-tool-uniqueness-meter">
                  <p>
                    <strong>Estimated Uniqueness:</strong> {uniqueness.toFixed(1)}%
                  </p>
                  <div className="sec-tool-progress">
                    <div className="sec-tool-progress-bar" style={{ width: `${uniqueness}%` }}></div>
                  </div>
                  <p className="sec-tool-info">
                    {uniqueness > 90
                      ? "Your browser is highly identifiable across websites."
                      : uniqueness > 70
                      ? "Your browser has a distinctive fingerprint."
                      : "Your browser is somewhat common and less uniquely identifiable."}
                  </p>
                </div>

                <button className="sec-tool-toggle-button" onClick={() => setShowDetails(!showDetails)}>
                  {showDetails ? "Hide Details" : "Show Fingerprint Details"}
                </button>

                {showDetails && (
                  <div className="sec-tool-details">
                    <h4>Browser Details:</h4>
                    <table className="sec-tool-table">
                      <tbody>
                        <tr>
                          <td>User Agent:</td>
                          <td>{navigator.userAgent}</td>
                        </tr>
                        <tr>
                          <td>Platform:</td>
                          <td>{navigator.platform}</td>
                        </tr>
                        <tr>
                          <td>Screen Resolution:</td>
                          <td>
                            {window.screen.width} x {window.screen.height}
                          </td>
                        </tr>
                        <tr>
                          <td>Color Depth:</td>
                          <td>{window.screen.colorDepth} bits</td>
                        </tr>
                        <tr>
                          <td>Timezone:</td>
                          <td>{Intl.DateTimeFormat().resolvedOptions().timeZone}</td>
                        </tr>
                        <tr>
                          <td>Languages:</td>
                          <td>{navigator.languages ? navigator.languages.join(", ") : navigator.language}</td>
                        </tr>
                        <tr>
                          <td>Do Not Track:</td>
                          <td>{navigator.doNotTrack || "Not set"}</td>
                        </tr>
                        <tr>
                          <td>Cookies Enabled:</td>
                          <td>{navigator.cookieEnabled ? "Yes" : "No"}</td>
                        </tr>
                        <tr>
                          <td>Local Storage:</td>
                          <td>{typeof localStorage !== "undefined" ? "Available" : "Not available"}</td>
                        </tr>
                        <tr>
                          <td>Canvas Support:</td>
                          <td>{document.createElement("canvas").getContext ? "Yes" : "No"}</td>
                        </tr>
                        <tr>
                          <td>WebGL Support:</td>
                          <td>
                            {(() => {
                              try {
                                return document.createElement("canvas").getContext("webgl") ? "Yes" : "No";
                              } catch (e) {
                                return "No";
                              }
                            })()}
                          </td>
                        </tr>
                        <tr>
                          <td>Audio Context:</td>
                          <td>
                            {typeof AudioContext !== "undefined" || typeof window.webkitAudioContext !== "undefined"
                              ? "Available"
                              : "Not available"}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <h4>Protection Tips:</h4>
                    <ul className="sec-tool-list">
                      <li>Use privacy-focused browsers like Firefox or Brave</li>
                      <li>Install anti-fingerprinting extensions</li>
                      <li>Enable "Strict" tracking protection in your browser</li>
                      <li>Consider using the Tor Browser for maximum anonymity</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowserFingerprinting;
