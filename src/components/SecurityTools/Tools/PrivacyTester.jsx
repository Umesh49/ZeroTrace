import { useState } from "react";
import { checkPrivacy } from "../../../utils/privacyUtils";
import "../Tools.css";

const PrivacyTester = () => {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(null);

  const runPrivacyTests = async () => {
    setRunning(true);
    try {
      const privacyResults = await checkPrivacy();
      setResults(privacyResults);
    } catch (error) {
      console.error("Error running privacy tests:", error);
      setResults({ score: 0, tests: [], recommendations: ["An error occurred while running the tests"] });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="security-tools">
      <div className="sec-tool-container">
        <div className="sec-tool-header">
          <h1 className="sec-tool-title page-title">Privacy Tester</h1>
          <p className="sec-tool-subtitle">Check your browser for privacy leaks</p>
        </div>
        <div className="sec-tool-card">
          <div className="sec-tool-card-body">
            <p className="sec-tool-description">
              This tool will check your browser for common privacy issues and provide recommendations.
            </p>

            <button className="sec-tool-button" onClick={runPrivacyTests} disabled={running}>
              {running ? "Running Tests..." : "Run Privacy Tests"}
            </button>

            {results && (
              <div className="sec-tool-result">
                <h4 className="sec-tool-result-header">Privacy Analysis:</h4>

                <div className="sec-tool-progress">
                  <div
                    className={`sec-tool-progress-bar ${
                      results.score > 80 ? "strong" : results.score > 50 ? "medium" : "weak"
                    }`}
                    style={{ width: `${results.score}%` }}
                  ></div>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <span
                    className={`sec-tool-badge ${
                      results.score > 80
                        ? "sec-tool-badge-success"
                        : results.score > 50
                        ? "sec-tool-badge-warning"
                        : "sec-tool-badge-danger"
                    }`}
                  >
                    Privacy Score: {results.score}/100
                  </span>
                </div>

                <h5>Test Results:</h5>
                <ul className="sec-tool-list">
                  {results.tests.map((test, index) => (
                    <li key={index}>
                      <strong>{test.name}:</strong>{" "}
                      <span className={test.pass ? "sec-tool-text-success" : "sec-tool-text-danger"}>
                        {test.pass ? "Pass" : "Fail"}
                      </span>{" "}
                      - {test.description}
                    </li>
                  ))}
                </ul>

                <h5>Recommendations:</h5>
                <ul className="sec-tool-list">
                  {results.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyTester;
