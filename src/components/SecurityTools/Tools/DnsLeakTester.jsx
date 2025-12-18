import { useState } from "react";
import { testDnsLeak } from "../../../utils/securityUtils";
import "../Tools.css";

const DnsLeakTester = () => {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const runDnsLeakTest = async () => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    setProgress(0);

    try {
      const testPhases = ["IP Leak Test", "WebRTC Leak Test", "DNS Configuration"];
      let completedTests = 0;

      const progressInterval = setInterval(() => {
        completedTests++;
        setProgress(Math.round((completedTests / (testPhases.length * 2)) * 100));
        if (completedTests >= testPhases.length * 2) {
          clearInterval(progressInterval);
        }
      }, 600);

      const leakResults = await testDnsLeak();
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProgress(100);
      clearInterval(progressInterval);
      setResults(leakResults);
    } catch (err) {
      console.error("Error testing DNS leak:", err);
      setError("Failed to complete security tests. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getLeakStatus = () => {
    if (!results || !results.servers) return null;

    const uniqueIspCount = new Set(results.servers.map((s) => s.isp)).size;
    const uniqueCountryCount = new Set(results.servers.map((s) => s.country)).size;

    if (uniqueIspCount > 1 || uniqueCountryCount > 1) {
      return {
        isLeaking: true,
        message: "DNS Leak Detected! Multiple DNS servers from different providers or countries were detected.",
      };
    }

    return {
      isLeaking: false,
      message: "No DNS leak detected. All queries are going through the same DNS provider.",
    };
  };

  const leakStatus = results ? getLeakStatus() : null;

  return (
    <div className="security-tools">
      <div className="sec-tool-container">
        <div className="sec-tool-header">
          <h1 className="sec-tool-title page-title">DNS Leak Tester</h1>
          <p className="sec-tool-subtitle">Check if your DNS requests are leaking outside your VPN</p>
        </div>
        <div className="sec-tool-card">
          <div className="sec-tool-card-body">
            <p className="sec-tool-info">
              This tool tests whether your DNS requests are being properly routed through your VPN or if they're "leaking"
              to your ISP's DNS servers.
            </p>
            <button className="sec-tool-button" onClick={runDnsLeakTest} disabled={isLoading}>
              {isLoading ? "Testing..." : "Run DNS Leak Test"}
            </button>
            {isLoading && (
              <div className="sec-tool-loading">
                <div className="sec-tool-spinner"></div>
                <p>Testing DNS configuration... {progress}% complete</p>
              </div>
            )}
            {error && !isLoading && (
              <div className="sec-tool-result">
                <p className="sec-tool-error">{error}</p>
              </div>
            )}
            {results && !isLoading && !error && (
              <div className="sec-tool-result">
                <h4 className="sec-tool-result-header">DNS Leak Test Results:</h4>
                {leakStatus && (
                  <div
                    className={`sec-tool-leak-status ${
                      leakStatus.isLeaking ? "sec-tool-text-danger" : "sec-tool-text-success"
                    }`}
                  >
                    <p>
                      <strong>
                        {leakStatus.isLeaking ? "⚠️ " : "✓ "}
                        {leakStatus.message}
                      </strong>
                    </p>
                  </div>
                )}
                <p>
                  <strong>Your IP:</strong> {results.ip}
                </p>
                <p>
                  <strong>DNS Servers Detected:</strong> {results.servers ? results.servers.length : 0}
                </p>
                {results.servers && results.servers.length > 0 && (
                  <table className="sec-tool-table">
                    <thead>
                      <tr>
                        <th>DNS Server</th>
                        <th>ISP</th>
                        <th>Country</th>
                        <th>Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.servers.map((server, index) => (
                        <tr key={index}>
                          <td>{server.ip}</td>
                          <td>{server.isp || "Unknown"}</td>
                          <td>{server.country || "Unknown"}</td>
                          <td>{server.type || "Unknown"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {leakStatus && leakStatus.isLeaking && (
                  <div className="sec-tool-advice">
                    <h4>How to Fix DNS Leaks:</h4>
                    <ul className="sec-tool-list">
                      <li>Ensure your VPN's DNS settings are properly configured</li>
                      <li>Use your VPN's built-in DNS leak protection feature</li>
                      <li>Manually set your DNS servers to a secure provider</li>
                      <li>Disable WebRTC in your browser, which can leak your real IP</li>
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

export default DnsLeakTester;
