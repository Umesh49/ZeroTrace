import { useState } from "react";
import * as openpgp from "openpgp";
import { Eye, EyeOff } from 'lucide-react';
import "../Tools.css";

const FileEncryption = () => {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [operation, setOperation] = useState("encrypt");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile || null);
    setResult(null);
    setError(null);
  };

  const processFile = async () => {
    if (!file) {
      setError("Please select a file.");
      return;
    }

    if (!password) {
      setError("Please enter a password.");
      return;
    }

    if (operation === "encrypt" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      if (operation === "encrypt") {
        await encryptFile();
      } else {
        await decryptFile();
      }
    } catch (err) {
      console.error(`Error ${operation}ing file:`, err);
      setError(`Failed to ${operation} file: ${err.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const encryptFile = async () => {
    // Read the file
    const fileContent = await readFileAsUint8Array(file);

    // Encrypt the file
    const message = await openpgp.createMessage({ binary: fileContent });
    const encrypted = await openpgp.encrypt({
      message,
      passwords: [password],
      format: "binary",
    });

    // Create and download the encrypted file
    const encryptedBlob = new Blob([encrypted], { type: "application/octet-stream" });
    const encryptedFileName = `${file.name}.pgp`;

    createDownloadLink(encryptedBlob, encryptedFileName);

    setResult({
      success: true,
      operation: "encrypt",
      originalName: file.name,
      encryptedName: encryptedFileName,
    });
  };

  const decryptFile = async () => {
    try {
      // Check if it's a PGP file
      if (!file.name.endsWith(".pgp")) {
        throw new Error("File does not appear to be PGP encrypted (missing .pgp extension)");
      }

      // Read the file
      const fileContent = await readFileAsUint8Array(file);

      // Decrypt the file
      const message = await openpgp.readMessage({
        binaryMessage: fileContent,
      });

      const { data: decrypted } = await openpgp.decrypt({
        message,
        passwords: [password],
        format: "binary",
      });

      // Create and download the decrypted file
      const decryptedBlob = new Blob([decrypted], { type: "application/octet-stream" });
      const decryptedFileName = file.name.endsWith(".pgp")
        ? file.name.slice(0, -4) // Remove .pgp extension
        : `decrypted_${file.name}`;

      createDownloadLink(decryptedBlob, decryptedFileName);

      setResult({
        success: true,
        operation: "decrypt",
        originalName: file.name,
        decryptedName: decryptedFileName,
      });
    } catch (err) {
      if (err.message.includes("Error decrypting message")) {
        throw new Error("Incorrect password or the file is not properly encrypted");
      }
      throw err;
    }
  };

  const readFileAsUint8Array = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Convert ArrayBuffer to Uint8Array
        const arrayBuffer = reader.result;
        const uint8Array = new Uint8Array(arrayBuffer);
        resolve(uint8Array);
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsArrayBuffer(file);
    });
  };

  const createDownloadLink = (blob, fileName) => {
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = fileName;
    downloadLink.click();
    URL.revokeObjectURL(downloadLink.href);
  };

  return (
    <div className="security-tools">
      <div className="sec-tool-container">
        <div className="sec-tool-header">
          <h1 className="sec-tool-title page-title">File Encryption</h1>
          <p className="sec-tool-subtitle">Encrypt and decrypt your files using PGP</p>
        </div>
        <div className="sec-tool-card">
          <div className="sec-tool-card-body">
            <div className="sec-tool-toggle-group">
              <button
                className={`sec-tool-toggle ${operation === "encrypt" ? "active" : ""}`}
                onClick={() => {
                  setOperation("encrypt");
                  setResult(null);
                  setError(null);
                }}
              >
                Encrypt File
              </button>
              <button
                className={`sec-tool-toggle ${operation === "decrypt" ? "active" : ""}`}
                onClick={() => {
                  setOperation("decrypt");
                  setResult(null);
                  setError(null);
                }}
              >
                Decrypt File
              </button>
            </div>

            <div className="sec-tool-form-group">
              <label className="sec-tool-label">Select File to {operation === "encrypt" ? "Encrypt" : "Decrypt"}</label>
              <input type="file" onChange={handleFileChange} className="sec-tool-file-input" />
              {file && (
                <p className="sec-tool-info">
                  {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </p>
              )}
            </div>

            <div className="sec-tool-form-group">
              <label htmlFor="encryptionPassword" className="sec-tool-label">
                Password
              </label>
              <div className="sec-tool-password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  id="encryptionPassword"
                  className="sec-tool-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={`Enter password to ${operation} file`}
                />
                <button
                  type="button"
                  className="sec-tool-toggle-visibility"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {operation === "encrypt" && (
              <div className="sec-tool-form-group">
                <label htmlFor="confirmPassword" className="sec-tool-label">
                  Confirm Password
                </label>
                <div className="sec-tool-password-field">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    className="sec-tool-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm encryption password"
                  />
                </div>
              </div>
            )}

            <button
              className="sec-tool-button"
              onClick={processFile}
              disabled={isLoading || !file || !password || (operation === "encrypt" && !confirmPassword)}
            >
              {isLoading
                ? `${operation === "encrypt" ? "Encrypting" : "Decrypting"}...`
                : `${operation === "encrypt" ? "Encrypt" : "Decrypt"} File`}
            </button>

            {error && <div className="sec-tool-error">{error}</div>}

            {result && result.success && (
              <div className="sec-tool-result">
                <p className="sec-tool-text-success">
                  {result.operation === "encrypt"
                    ? `File encrypted successfully as ${result.encryptedName}.`
                    : `File decrypted successfully as ${result.decryptedName}.`}
                </p>
                <p className="sec-tool-info">Your file download should begin automatically.</p>
              </div>
            )}

            <div className="sec-tool-info">
              <p>
                <strong>Note:</strong> All encryption/decryption happens in your browser. Your files and passwords are
                never sent to any server.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileEncryption;
