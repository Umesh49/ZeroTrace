import { useState, useEffect } from "react";
import zxcvbn from "zxcvbn";
import { Eye, EyeOff } from 'lucide-react';
import "../Tools.css";

const PasswordStrengthMeter = () => {
  const [password, setPassword] = useState("");
  const [result, setResult] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (password) {
      const passwordStrength = zxcvbn(password);
      setResult(passwordStrength);
    } else {
      setResult(null);
    }
  }, [password]);

  const getStrengthLabel = (score) => {
    switch (score) {
      case 0: return "Very Weak";
      case 1: return "Weak";
      case 2: return "Fair";
      case 3: return "Good";
      case 4: return "Strong";
      default: return "N/A";
    }
  };

  const getProgressBarClass = (score) => {
    if (score === 0) return "sec-tool-progress-bar weak";
    if (score === 1) return "sec-tool-progress-bar weak";
    if (score === 2) return "sec-tool-progress-bar medium";
    if (score === 3) return "sec-tool-progress-bar medium";
    return "sec-tool-progress-bar strong";
  };

  return (
    <div className="security-tools">
      <div className="sec-tool-container">
        <div className="sec-tool-header">
          <h1 className="sec-tool-title page-title">Password Strength Meter</h1>
          <p className="sec-tool-subtitle">Check how strong your password is</p>
        </div>

        <div className="sec-tool-card">
          <div className="sec-tool-card-body">
            <div className="sec-tool-form-group">
              <label htmlFor="password" className="sec-tool-label">
                Enter Password
              </label>
              <div className="sec-tool-password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="sec-tool-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password to check"
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
                Your password is never sent to any server. All analysis happens in your browser.
              </p>
            </div>

            {result && (
              <div className="sec-tool-result">
                <h4 className="sec-tool-result-header">Password Strength: {getStrengthLabel(result.score)}</h4>

                <div className="sec-tool-progress">
                  <div
                    className={getProgressBarClass(result.score)}
                    style={{ width: `${(result.score + 1) * 20}%` }}
                  ></div>
                </div>

                {result.feedback.warning && <p className="sec-tool-text-danger">{result.feedback.warning}</p>}

                {result.feedback.suggestions && result.feedback.suggestions.length > 0 && (
                  <div>
                    <p className="sec-tool-label">Suggestions:</p>
                    <ul className="sec-tool-list">
                      {result.feedback.suggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="sec-tool-info">
                  Estimated crack time: {result.crack_times_display.offline_slow_hashing_1e4_per_second}
                </p>

                <div className="sec-tool-strength-details">
                  <h4>What Makes a Strong Password?</h4>
                  <ul className="sec-tool-list">
                    <li>Length: Longer passwords are generally more secure</li>
                    <li>Complexity: Mix of uppercase, lowercase, numbers, and symbols</li>
                    <li>Unpredictability: Avoid common words and patterns</li>
                    <li>Uniqueness: Don't reuse passwords across different sites</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
