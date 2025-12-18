import { useState } from "react";
import { checkSecurityHeaders } from "../../../utils/securityUtils";
import "../Tools.css";

const SecurityHeadersAudit = () => {
  const [url, setUrl] = useState("");
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const runAudit = async () => {
    if (!url.trim()) return;

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const headerResults = await checkSecurityHeaders(url);
      setResults(headerResults);
    } catch (err) {
      console.error("Error checking security headers:", err);
      setError("Failed to check security headers. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const getGradeColor = (grade) => {
    if (["A+", "A", "A-"].includes(grade)) return "sec-tool-text-success";
    if (["B+", "B", "B-"].includes(grade)) return "sec-tool-text-warning";
    return "sec-tool-text-danger";
  };

  const getHeaderStatus = (status) => {
    switch (status) {
      case "good":
        return { text: "Properly Configured", class: "sec-tool-text-success" };
      case "warning":
        return { text: "Needs Improvement", class: "sec-tool-text-warning" };
      case "bad":
        return { text: "Missing or Misconfigured", class: "sec-tool-text-danger" };
      case "unknown":
        return { text: "Status Unknown", class: "sec-tool-text-neutral" };
      default:
        return { text: "Not Found", class: "sec-tool-text-danger" };
    }
  };

  return (
    <div className="security-tools">
      <div className="sec-tool-container">
        <div className="sec-tool-header">
          <h1 className="sec-tool-title page-title">Security Headers Audit</h1>
          <p className="sec-tool-subtitle">Check a website's HTTP security headers</p>
        </div>
        <div className="sec-tool-card">
          <div className="sec-tool-card-body">
            <div className="sec-tool-form-group">
              <label htmlFor="headerAuditUrl" className="sec-tool-label">
                Enter Website URL
              </label>
              <input
                type="text"
                id="headerAuditUrl"
                className="sec-tool-input"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>

            <button className="sec-tool-button" onClick={runAudit} disabled={isLoading || !url.trim()}>
              {isLoading ? "Analyzing..." : "Check Security Headers"}
            </button>

            {isLoading && (
              <div className="sec-tool-loading">
                <div className="sec-tool-spinner"></div>
                <p>Analyzing security headers...</p>
              </div>
            )}

            {error && <div className="sec-tool-error">{error}</div>}

            {results && !error && (
              <div className="sec-tool-result">
                {results.externalScan && (
                  <div className="sec-tool-external-scan-notice">
                    <p>{results.message}</p>
                    <p>
                      <a href={results.scanUrl} target="_blank" rel="noopener noreferrer" className="sec-tool-link">
                        View full scan results
                      </a>
                    </p>
                  </div>
                )}

                {results.grade && results.grade !== "?" && (
                  <div className="sec-tool-grade">
                    <h4 className="sec-tool-result-header">Security Grade:</h4>
                    <div className={`sec-tool-grade-badge ${getGradeColor(results.grade)}`}>{results.grade}</div>
                    {results.score && <p>Score: {results.score}/100</p>}
                  </div>
                )}

                <h4>Security Headers Overview:</h4>
                <div className="sec-tool-headers-list">
                  {results.headers.map((header) => {
                    const status = getHeaderStatus(header.status);

                    return (
                      <div key={header.name} className="sec-tool-header-item">
                        <div className="sec-tool-header-name">
                          <strong>{header.name}</strong>
                        </div>
                        <div className={`sec-tool-header-status ${status.class}`}>{status.text}</div>
                        <div className="sec-tool-header-value">
                          {header.value ? (
                            <code>{header.value}</code>
                          ) : header.example ? (
                            <div>
                              <span>Example: </span>
                              <code>{header.example}</code>
                            </div>
                          ) : (
                            "Not set"
                          )}
                        </div>
                        <div className="sec-tool-header-description">
                          <p>{header.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {results.recommendations && results.recommendations.length > 0 && (
                  <div className="sec-tool-recommendations">
                    <h4>Recommendations:</h4>
                    <ul className="sec-tool-list">
                      {results.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="sec-tool-info">
              <p>Security headers help protect your website from common attacks like XSS, clickjacking, and more.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityHeadersAudit;
