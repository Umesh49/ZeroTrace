import { useState } from "react";
import { ArrowLeft, Copy, Check } from 'lucide-react';
import "../Tools.css";

const PasswordGenerator = () => {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const lowerChars = "abcdefghijklmnopqrstuvwxyz";
  const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numberChars = "0123456789";
  const symbolChars = "!@#$%^&*()_-+=<>?/[]{}|~";

  const generatePassword = () => {
    let chars = "";
    if (includeLowercase) chars += lowerChars;
    if (includeUppercase) chars += upperChars;
    if (includeNumbers) chars += numberChars;
    if (includeSymbols) chars += symbolChars;

    if (chars.length === 0) {
      chars = lowerChars;
    }

    const randomValues = new Uint32Array(length);
    crypto.getRandomValues(randomValues);

    let newPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = randomValues[i] % chars.length;
      newPassword += chars.charAt(randomIndex);
    }

    setPassword(newPassword);
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(password)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy password: ", err);
      });
  };

  return (
    <div className="security-tools">
      <div className="sec-tool-container">
        <div className="sec-tool-header">
          <h1 className="sec-tool-title page-title">Password Generator</h1>
          <p className="sec-tool-subtitle">Create strong, random passwords</p>
        </div>
        <div className="sec-tool-card">
          <div className="sec-tool-card-body">
            <div className="sec-tool-result">
              <div className="sec-tool-password-output-container">
                <input
                  type="text"
                  id="generatedPassword"
                  className="sec-tool-password-output"
                  value={password}
                  readOnly
                  placeholder="Generated password will appear here"
                />
                <button
                  className="sec-tool-copy-button"
                  onClick={copyToClipboard}
                  disabled={!password}
                  title="Copy to clipboard"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </div>

            <div className="sec-tool-options">
              <label className="sec-tool-label">Password Length: {length}</label>
              <input
                type="range"
                min="8"
                max="64"
                value={length}
                onChange={(e) => setLength(Number.parseInt(e.target.value))}
                className="sec-tool-range"
              />

              <div className="sec-tool-checkbox-group">
                <label className="sec-tool-checkbox">
                  <input
                    type="checkbox"
                    checked={includeUppercase}
                    onChange={() => setIncludeUppercase(!includeUppercase)}
                  />
                  Include Uppercase (A-Z)
                </label>

                <label className="sec-tool-checkbox">
                  <input
                    type="checkbox"
                    checked={includeLowercase}
                    onChange={() => setIncludeLowercase(!includeLowercase)}
                  />
                  Include Lowercase (a-z)
                </label>

                <label className="sec-tool-checkbox">
                  <input type="checkbox" checked={includeNumbers} onChange={() => setIncludeNumbers(!includeNumbers)} />
                  Include Numbers (0-9)
                </label>

                <label className="sec-tool-checkbox">
                  <input type="checkbox" checked={includeSymbols} onChange={() => setIncludeSymbols(!includeSymbols)} />
                  Include Symbols (!@#$%^&*)
                </label>
              </div>

              <button className="sec-tool-button" onClick={generatePassword}>
                Generate Password
              </button>

              {password && (
                <div className="sec-tool-password-strength-info">
                  <h4>Password Strength Tips:</h4>
                  <ul className="sec-tool-list">
                    <li>Use a minimum of 12 characters for better security</li>
                    <li>Include a mix of uppercase, lowercase, numbers, and symbols</li>
                    <li>Avoid common words or patterns</li>
                    <li>Use different passwords for different accounts</li>
                    <li>Consider using a password manager to store your passwords securely</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;
