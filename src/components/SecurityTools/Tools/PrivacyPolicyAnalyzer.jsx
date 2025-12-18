import { useState } from "react";
import { analyzePrivacyPolicy } from "../../../utils/securityUtils";
import "../Tools.css";

const PrivacyPolicyAnalyzer = () => {
  const [url, setUrl] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeSite = async () => {
    if (!url.trim()) return;
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await analyzePrivacyPolicy(url);
      setAnalysis(result);
    } catch (err) {
      console.error("Error analyzing privacy policy:", err);
      setError("Failed to analyze privacy policy. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const getPrivacyScoreClass = (score) => {
    if (score >= 75) return "sec-tool-text-success";
    if (score >= 50) return "sec-tool-text-warning";
    return "sec-tool-text-danger";
  };

  const getCategoryColor = (rating) => {
    switch (rating.toLowerCase()) {
      case "good":
        return "sec-tool-text-success";
      case "average":
        return "sec-tool-text-warning";
      case "poor":
        return "sec-tool-text-danger";
      default:
        return "";
    }
  };

  return (
    <div className="security-tools">
      <div className="sec-tool-container">
        <div className="sec-tool-header">
          <h1 className="sec-tool-title page-title">Privacy Policy Analyzer</h1>
          <p className="sec-tool-subtitle">Check how websites handle your personal data</p>
        </div>
        <div className="sec-tool-card">
          <div className="sec-tool-card-body">
            <div className="sec-tool-form-group">
              <label htmlFor="policyUrl" className="sec-tool-label">
                Enter Website URL
              </label>
              <input
                id="policyUrl"
                type="text"
                className="sec-tool-input"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>

            <button className="sec-tool-button" onClick={analyzeSite} disabled={isLoading || !url.trim()}>
              {isLoading ? "Analyzing..." : "Analyze Privacy Policy"}
            </button>

            {isLoading && (
              <div className="sec-tool-loading">
                <div className="sec-tool-spinner" />
                <p>Analyzing privacy policy...</p>
              </div>
            )}

            {error && <div className="sec-tool-error">{error}</div>}

            {analysis && !error && (
              <div className="sec-tool-result">
                <div className="sec-tool-privacy-score">
                  <h4 className="sec-tool-result-header">Privacy Grade:</h4>
                  <div className={`sec-tool-grade-badge ${getPrivacyScoreClass(analysis.score)}`}>{analysis.grade}</div>
                  <p>Score: {analysis.score}/100</p>
                </div>

                <div className="sec-tool-summary">
                  <h4>Summary:</h4>
                  <p>{analysis.summary}</p>
                </div>

                <div className="sec-tool-categories">
                  <h4>Privacy Categories:</h4>
                  <div className="sec-tool-category-list">
                    {analysis.categories.map((cat) => (
                      <div key={cat.name} className="sec-tool-category-item">
                        <div className="sec-tool-category-name">{cat.name}</div>
                        <div className={`sec-tool-category-rating ${getCategoryColor(cat.rating)}`}>{cat.rating}</div>
                        <div className="sec-tool-category-description">{cat.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {analysis.highlights && (
                  <div className="sec-tool-highlights">
                    <h4>Key Points:</h4>
                    <ul className="sec-tool-list">
                      {analysis.highlights.map((h, i) => (
                        <li key={i} className={h.positive ? "sec-tool-text-success" : "sec-tool-text-danger"}>
                          {h.positive ? "✓ " : "⚠️ "}
                          {h.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysis.dataSharing && (
                  <div className="sec-tool-data-sharing">
                    <h4>Data Sharing:</h4>
                    <p>This site shares your data with {analysis.dataSharing.count} third parties:</p>
                    <div className="sec-tool-data-sharing-list">
                      {analysis.dataSharing.parties.map((p, i) => (
                        <div key={i} className="sec-tool-data-sharing-item">
                          <div className="sec-tool-party-name">{p.name}</div>
                          <div className="sec-tool-party-purpose">{p.purpose}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="sec-tool-report-link">
                  <p>
                    <a
                      href={analysis.tosdrUrl || "https://tosdr.org"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sec-tool-link"
                    >
                      View Full Privacy Report on ToS;DR
                    </a>
                  </p>
                </div>
              </div>
            )}

            <div className="sec-tool-info">
              <p>
                This tool uses the ToS;DR API to analyze privacy policies and make them more accessible and
                understandable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyAnalyzer;
