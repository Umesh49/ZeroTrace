import { useState, useEffect } from "react";
import "./Header.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [terminalReady, setTerminalReady] = useState(false);
  const [binaryStream, setBinaryStream] = useState("");

  const terminalText = "ZeroTrace Terminal v0.1";
  const navItems = [
    { path: "/home", label: "Home" },
    { path: "/indian-laws", label: "Indian Laws" },
    { path: "/complaint-guide", label: "Complaint Guide" },
    { path: "/quiz", label: "CyberSec Quiz" },
    { path: "/security-checklist", label: "CyberSec Checklist" },
    { path: "/security-tools", label: "Security Tools" },
    { path: "/contact", label: "Helplines" },
    { path: "/faq", label: "FAQ" },
  ];

  useEffect(() => {
    const generateBinary = () => {
      const binary = Array(48)
        .fill(0)
        .map(() => Math.floor(Math.random() * 2))
        .join("");
      setBinaryStream(binary);
    };

    generateBinary();
    const interval = setInterval(generateBinary, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setTerminalReady(false);
      return;
    }

    const timer = setTimeout(() => {
      setTerminalReady(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [isOpen]);

  return (
    <>
      <header className="nav-desktop-header">
        <div className="nav-binary-stream nav-binary-top">
          <div className="nav-binary-text nav-slide-left">{binaryStream}</div>
        </div>

        <div className="nav-header-container">
          <div className="nav-header-content">
            <a href="/home" className="nav-header-logo">
              <div className="nav-logo-box">
                <img src="/logo.svg" alt="ZeroTrace Logo" />
                <div className="nav-logo-pulse"></div>
              </div>
              <div className="nav-title-box">
                <span className="nav-title">ZeroTrace</span>
                <span className="nav-cursor">_</span>
              </div>
            </a>

            <nav className="nav-desktop-menu">
              {navItems.map((item, index) => (
                <a key={index} href={item.path} className="nav-desktop-link">
                  <span className="nav-link-text">{item.label}</span>
                  <span className="nav-link-underline"></span>
                </a>
              ))}
            </nav>

            <a href="/chatbot" className="nav-emergency-btn">
              <span className="nav-emergency-icon"></span>
              <span>ZeroBot Help</span>
            </a>
          </div>
        </div>

        <div className="nav-binary-stream nav-binary-bottom">
          <div className="nav-binary-text nav-slide-right">
            {binaryStream.split("").reverse().join("")}
          </div>
        </div>
      </header>

      <header className="nav-mobile-header">
        <button onClick={() => setIsOpen(true)} className="nav-menu-toggle">
          <svg
            className="nav-menu-icon"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 12H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 6H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 18H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <a href="/home" className="nav-mobile-logo">
          <img src="/logo.svg" height="30px" alt="ZeroTrace Logo" />
          <span className="nav-app-title">ZeroTrace</span>
        </a>
      </header>

      {isOpen && (
        <div className="nav-sidebar-container">
          <div
            className="nav-sidebar-backdrop"
            onClick={() => setIsOpen(false)}
          />
          <aside className="nav-sidebar">
            <div className="nav-sidebar-header">
              <div className="nav-terminal-controls">
                <div className="nav-terminal-dots">
                  <span className="nav-terminal-dot nav-terminal-dot-red"></span>
                  <span className="nav-terminal-dot nav-terminal-dot-yellow"></span>
                  <span className="nav-terminal-dot nav-terminal-dot-green"></span>
                </div>
                <button
                  className="nav-close-btn"
                  onClick={() => setIsOpen(false)}
                >
                  <svg
                    className="nav-close-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18 6L6 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6 6L18 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              <div className="nav-terminal-text">
                <div
                  className={`nav-terminal-content ${terminalReady ? "nav-terminal-ready" : ""
                    }`}
                >
                  {terminalText}
                  <span className="nav-terminal-cursor"></span>
                </div>
              </div>

              <div className="nav-access-status">
                <span className="nav-status-dot"></span>
                <span className="nav-status-text">
                  Secure Connection Established
                </span>
              </div>
            </div>

            <nav className="nav-sidebar-menu">
              <ul className="nav-item-list">
                {navItems.map((item, index) => (
                  <li key={index} className="nav-item">
                    <a href={item.path} className="nav-mobile-link">
                      <span className="nav-label">{item.label}</span>
                      <svg
                        className="nav-chevron"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 18L15 12L9 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="nav-sidebar-footer">
              <div className="nav-emergency-box">
                <p className="nav-emergency-contact">
                  <span className="nav-emergency-label">
                    Cyber Crime Helpline:
                  </span>
                  <span className="nav-emergency-number">1930</span>
                </p>
              </div>
            </div>
          </aside>
        </div>
      )}

      <div className="nav-content-padding"></div>
    </>
  );
};

export default Navbar;