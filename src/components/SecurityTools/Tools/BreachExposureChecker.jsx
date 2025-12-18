import { useState } from "react";
import { pwnedPassword } from "hibp";
import { Eye, EyeOff } from 'lucide-react';
import "../Tools.css";

const BreachExposureChecker = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [checkType, setCheckType] = useState("password");

  const checkBreaches = async () => {
    if (checkType === "password" && !password) return;
    if (checkType === "email" && !email) return;

    setIsLoading(true);
    setResult(null);

    try {
      if (checkType === "password") {
        const occurrences = await pwnedPassword(password);
        setResult({
          type: "password",
          compromised: occurrences > 0,
          count: occurrences,
        });
      } else if (checkType === "email") {
        window.open(`https://haveibeenpwned.com/account/${encodeURIComponent(email)}`, "_blank");
        setResult({
          type: "email",
          message: "Redirecting you to Have I Been Pwned to check your email securely.",
        });
      }
    } catch (error) {
      console.error("Error checking breaches:", error);
      setResult({
        error: "Failed to check breaches. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="security-tools">
      <div className="sec-tool-container">
        <div className="sec-tool-header">
          <h1 className="sec-tool-title page-title">Breach Exposure Checker</h1>
          <p className="sec-tool-subtitle">Check if your password has been exposed in data breaches</p>
        </div>

        <div className="sec-tool-card">
          <div className="sec-tool-card-body">
            <div className="sec-tool-toggle-group">
              <button
                className={`sec-tool-toggle ${checkType === "password" ? "active" : ""}`}
                onClick={() => setCheckType("password")}
              >
                Check Password
              </button>
              <button
                className={`sec-tool-toggle ${checkType === "email" ? "active" : ""}`}
                onClick={() => setCheckType("email")}
              >
                Check Email
              </button>
            </div>

            {checkType === "password" ? (
              <div className="sec-tool-form-group">
                <label htmlFor="breach-password" className="sec-tool-label">
                  Enter Password to Check
                </label>
                <div className="sec-tool-password-field">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="breach-password"
                    className="sec-tool-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password to check"
                  />
                  <button
                    type="button"
                    className="sec-tool-toggle-visibility"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="sec-tool-info">
                  Your password is never sent to any server. Only a partial hash is used for checking.
                </p>
              </div>
            ) : (
              <div className="sec-tool-form-group">
                <label htmlFor="breach-email" className="sec-tool-label">
                  Enter Email to Check
                </label>
                <input
                  type="email"
                  id="breach-email"
                  className="sec-tool-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email to check"
                />
                <p className="sec-tool-info">
                  You'll be redirected to Have I Been Pwned with your email pre-filled for secure checking.
                </p>
              </div>
            )}

            <button
              className="sec-tool-button"
              onClick={checkBreaches}
              disabled={isLoading || (checkType === "password" && !password) || (checkType === "email" && !email)}
            >
              {isLoading ? "Checking..." : checkType === "email" ? "Check on HIBP" : "Check Exposure"}
            </button>

            {result && !result.error && result.type === "password" && (
              <div
                className={`sec-tool-result ${result.compromised ? "sec-tool-result-danger" : "sec-tool-result-success"}`}
              >
                {result.compromised ? (
                  <>
                    <h4 className="sec-tool-result-header sec-tool-text-danger">Password Compromised!</h4>
                    <p>This password has been found in {result.count.toLocaleString()} data breaches.</p>
                    <p>You should change this password immediately on any site where you use it.</p>
                  </>
                ) : (
                  <>
                    <h4 className="sec-tool-result-header sec-tool-text-success">Good News!</h4>
                    <p>This password wasn't found in any known data breaches.</p>
                    <p>
                      Remember to use unique passwords for each site and enable two-factor authentication when available.
                    </p>
                  </>
                )}
              </div>
            )}

            {result && result.type === "email" && (
              <div className="sec-tool-result">
                <p>{result.message}</p>
              </div>
            )}

            {result && result.error && (
              <div className="sec-tool-result">
                <p className="sec-tool-error">{result.error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreachExposureChecker;
