import { useState } from "react";
import { checkUrlSafety } from "../../../utils/securityUtils";
import "../Tools.css";

const SafeBrowsingCheck = () => {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkUrl = async () => {
    if (!url.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      let urlToCheck = url;
      if (!/^https?:\/\//i.test(url)) {
        urlToCheck = "https://" + url;
      }

      const safetyResult = await checkUrlSafety(urlToCheck);
      setResult(safetyResult);
    } catch (err) {
      console.error("Error checking URL safety:", err);
      setError("Failed to check URL safety. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <div className="security-tools">
      <div className="sec-tool-container">
        <div className="sec-tool-header">
          <h1 className="sec-tool-title page-title">Safe Browsing Check</h1>
          <p className="sec-tool-subtitle">Check if a URL is safe to visit</p>
        </div>
        <div className="sec-tool-card">
          <div className="sec-tool-card-body">
            <label htmlFor="urlToCheck" className="sec-tool-label">
              Enter URL to Check
            </label>
            <input
              type="text"
              id="urlToCheck"
              className="sec-tool-input"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
            />

            <button
              className="sec-tool-button"
              onClick={checkUrl}
              disabled={isLoading || !url.trim() || !isValidUrl(url)}
            >
              {isLoading ? "Checking..." : "Check URL Safety"}
            </button>

            {isLoading && (
              <div className="sec-tool-loading">
                <div className="sec-tool-spinner"></div>
                <p>Checking URL against threat databases...</p>
              </div>
            )}

            {error && (
              <div className="sec-tool-result">
                <p className="sec-tool-error">{error}</p>
              </div>
            )}

            {result && !error && (
              <div className="sec-tool-result">
                <h4 className="sec-tool-result-header">
                  Safety Check Results:
                </h4>

                <div
                  className={`sec-tool-safety-status ${
                    result.isSafe
                      ? "sec-tool-status-safe"
                      : "sec-tool-status-unsafe"
                  }`}
                >
                  <div className="sec-tool-status-icon">
                    {result.isSafe ? "✓" : "⚠️"}
                  </div>
                  <div className="sec-tool-status-text">
                    <p className="sec-tool-status-title">
                      {result.isSafe
                        ? "URL appears to be safe"
                        : "Potential threats detected!"}
                    </p>
                    <p className="sec-tool-status-description">
                      {result.isSafe
                        ? "No known threats were found associated with this URL."
                        : `This URL may be unsafe. ${
                            result.threatType
                              ? `Threat type: ${result.threatType}`
                              : ""
                          }`}
                    </p>
                  </div>
                </div>

                {!result.isSafe &&
                  result.details &&
                  result.details.length > 0 && (
                    <div className="sec-tool-threat-details">
                      <h4>Threat Details:</h4>
                      <ul className="sec-tool-list">
                        {result.details.map((detail, index) => (
                          <li key={index}>{detail}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                <div className="sec-tool-check-info">
                  <p>
                    <strong>URL Checked:</strong> {result.url}
                  </p>
                  <p>
                    <strong>Last Updated:</strong>{" "}
                    {result.lastChecked
                      ? new Date(result.lastChecked).toLocaleString()
                      : "Unknown"}
                  </p>
                </div>

                {!result.isSafe && (
                  <div className="sec-tool-advice">
                    <h4>Safety Recommendations:</h4>
                    <ul className="sec-tool-list">
                      <li>Do not enter personal information on this site</li>
                      <li>Avoid downloading files from this URL</li>
                      <li>
                        If you've already visited the site, consider scanning
                        your device for malware
                      </li>
                      <li>
                        Report this URL to Google Safe Browsing if it's a
                        phishing or malware site
                      </li>
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

export default SafeBrowsingCheck;
