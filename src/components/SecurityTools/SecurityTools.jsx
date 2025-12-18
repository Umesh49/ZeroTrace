import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Lock,
  Globe,
  Search,
  Lightbulb,
  ExternalLink,
  AlertTriangle,
  EyeOff,
  Key,
  FileText,
  Map,
  Server,
  Wifi,
  FileLock,
  UserCheck,
  ClipboardCheck,
  Terminal,
  ShieldCheck,
  Activity,
  Users,
  AlertCircle,
  X,
  ChevronRight,
} from "lucide-react";
import "./SecurityTools.css";

const toolCategories = [
  {
    id: "password",
    name: "Password Tools",
    icon: <Lock size={24} />,
    description:
      "Tools for password management, generation and security assessment",
    color: "#00ffaa",
    tools: [
      {
        id: "password-generator",
        name: "Password Generator",
        description: "Generate strong, random passwords with custom parameters",
        icon: <Key size={18} />,
        path: "/password-generator",
      },
      {
        id: "password-strength",
        name: "Password Strength Meter",
        description: "Check the strength of your existing passwords",
        icon: <Shield size={18} />,
        path: "/password-strength-meter",
      },
    ],
  },
  {
    id: "privacy",
    name: "Privacy Protection",
    icon: <EyeOff size={24} />,
    description: "Tools to protect your privacy and check for data breaches",
    color: "#00cc88",
    tools: [
      {
        id: "breach-checker",
        name: "Breach Exposure Checker",
        description:
          "Check if your email or accounts have been compromised in data breaches",
        icon: <AlertTriangle size={18} />,
        path: "/breach-exposure-checker",
      },
      {
        id: "privacy-tester",
        name: "Privacy Tester",
        description: "Test your browser for privacy vulnerabilities",
        icon: <UserCheck size={18} />,
        path: "/privacy-tester",
      },
      {
        id: "browser-fingerprinting",
        name: "Browser Fingerprinting",
        description: "Check your browser's uniqueness and fingerprint",
        icon: <Terminal size={18} />,
        path: "/browser-fingerprinting",
      },
      {
        id: "privacy-policy",
        name: "Privacy Policy Analyzer",
        description: "Analyze website privacy policies for concerns",
        icon: <FileText size={18} />,
        path: "/privacy-policy-analyzer",
      },
    ],
  },
  {
    id: "network",
    name: "Network Security",
    icon: <Globe size={24} />,
    description: "Network scanning and analysis tools",
    color: "#33ffbb",
    tools: [
      {
        id: "ip-geolocation",
        name: "IP Geolocation",
        description: "Find geographic location of an IP address",
        icon: <Map size={18} />,
        path: "/ip-geolocation",
      },
      {
        id: "ip-reputation",
        name: "IP Reputation Lookup",
        description:
          "Check if an IP address is associated with malicious activity",
        icon: <Shield size={18} />,
        path: "/ip-reputation-lookup",
      },
      {
        id: "dns-leak",
        name: "DNS Leak Tester",
        description: "Test for DNS leaks that can expose your browsing",
        icon: <Wifi size={18} />,
        path: "/dns-leak-tester",
      },
    ],
  },
  {
    id: "web",
    name: "Web Security",
    icon: <Search size={24} />,
    description: "Tools to check website security and URL safety",
    color: "#ff3e00",
    tools: [
      {
        id: "safe-browsing",
        name: "Safe Browsing Check",
        description: "Check if a website is safe to visit",
        icon: <Shield size={18} />,
        path: "/safe-browsing-check",
      },
      {
        id: "security-headers",
        name: "Security Headers Audit",
        description: "Analyze website security headers",
        icon: <Server size={18} />,
        path: "/security-headers-audit",
      },
    ],
  },
  {
    id: "encryption",
    name: "Encryption Tools",
    icon: <Lock size={24} />,
    description: "File encryption and secure communication tools",
    color: "#ff7700",
    tools: [
      {
        id: "file-encryption",
        name: "File Encryption",
        description: "Encrypt and decrypt files securely",
        icon: <FileLock size={18} />,
        path: "/file-encryption",
      },
    ],
  },
  {
    id: "assessment",
    name: "Security Assessment",
    icon: <Lightbulb size={24} />,
    description: "Comprehensive security assessment and checklists",
    color: "#00ffaa",
    tools: [
      {
        id: "security-checklist",
        name: "Security Checklist",
        description: "Complete checklist to improve your security posture",
        icon: <ClipboardCheck size={18} />,
        path: "/security-checklist",
      },
    ],
  },
];

const securityStats = [
  {
    id: 1,
    value: "4.8M",
    label: "Threats Blocked",
    icon: <ShieldCheck size={24} color="#00ffaa" />,
  },
  {
    id: 2,
    value: "821K",
    label: "Protected Users",
    icon: <Users size={24} color="#33ffbb" />,
  },
  {
    id: 3,
    value: "32.7K",
    label: "Vulnerabilities Detected",
    icon: <AlertCircle size={24} color="#ff3e00" />,
  },
  {
    id: 4,
    value: "99.9%",
    label: "Uptime Reliability",
    icon: <Activity size={24} color="#ff7700" />,
  },
];

const SecurityTools = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // Enhanced search function that returns detailed results
  const performSearch = useCallback(
    (query) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      const lowerQuery = query.toLowerCase();
      const results = [];

      // Search in categories
      toolCategories.forEach((category) => {
        if (
          category.name.toLowerCase().includes(lowerQuery) ||
          category.description.toLowerCase().includes(lowerQuery)
        ) {
          results.push({
            type: "category",
            id: category.id,
            name: category.name,
            description: category.description,
            icon: category.icon,
            color: category.color,
            relevance: category.name.toLowerCase().includes(lowerQuery) ? 2 : 1,
          });
        }

        // Search in tools
        category.tools.forEach((tool) => {
          if (
            tool.name.toLowerCase().includes(lowerQuery) ||
            tool.description.toLowerCase().includes(lowerQuery)
          ) {
            results.push({
              type: "tool",
              id: tool.id,
              name: tool.name,
              description: tool.description,
              icon: tool.icon,
              path: tool.path,
              categoryName: category.name,
              categoryId: category.id,
              color: category.color,
              relevance: tool.name.toLowerCase().includes(lowerQuery) ? 2 : 1,
            });
          }
        });
      });

      // Sort by relevance
      results.sort((a, b) => b.relevance - a.relevance);
      setSearchResults(results);
    },
    [setSearchResults]
  );

  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true);
      const debounceTimer = setTimeout(() => {
        performSearch(searchQuery);
        setIsSearching(false);
      }, 300);

      return () => clearTimeout(debounceTimer);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchQuery, performSearch]);

  const handleToolClick = useCallback(
    (e, path) => {
      e.preventDefault();
      e.stopPropagation();
      navigate(path);
    },
    [navigate]
  );

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleSearchFocus = useCallback(() => {
    setSearchFocused(true);
  }, []);

  const handleSearchBlur = useCallback(() => {
    // Delay to allow click on search results
    setTimeout(() => {
      setSearchFocused(false);
    }, 200);
  }, []);

  const handleSearchResultClick = useCallback(
    (e, result) => {
      e.preventDefault();
      e.stopPropagation();

      if (result.type === "tool") {
        navigate(result.path);
      } else {
        // Scroll to category
        const categoryElement = document.getElementById(
          `category-${result.id}`
        );
        if (categoryElement) {
          categoryElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          // Highlight the category briefly
          categoryElement.classList.add("sec-tm-highlight-category");
          setTimeout(() => {
            categoryElement.classList.remove("sec-tm-highlight-category");
          }, 2000);
        }
      }
      setSearchQuery("");
      setSearchResults([]);
    },
    [navigate]
  );

  // Function to highlight matching text
  const highlightMatch = (text, query) => {
    if (!query.trim()) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="sec-tm-highlight">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const filteredCategories = searchQuery
    ? toolCategories.filter(
      (category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        category.tools.some(
          (tool) =>
            tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tool.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
    )
    : toolCategories;

  const adjustColorBrightness = (hex, percent) => {
    let r = Number.parseInt(hex.substring(1, 3), 16);
    let g = Number.parseInt(hex.substring(3, 5), 16);
    let b = Number.parseInt(hex.substring(5, 7), 16);

    r = Math.min(255, Math.round((r * (100 + percent)) / 100));
    g = Math.min(255, Math.round((g * (100 + percent)) / 100));
    b = Math.min(255, Math.round((b * (100 + percent)) / 100));

    const RR = r.toString(16).padStart(2, "0");
    const GG = g.toString(16).padStart(2, "0");
    const BB = b.toString(16).padStart(2, "0");

    return `#${RR}${GG}${BB}`;
  };

  const getCategoryGradientStyle = (color) => {
    return {
      background: `linear-gradient(135deg, ${color} 0%, ${adjustColorBrightness(
        color,
        -30
      )} 100%)`,
    };
  };

  return (
    <div className="sec-tm-container">
      <div className="sec-tm-content">
        <section className="sec-tm-header">
          <h1 className="sec-tm-title page-title">
            <span className="sec-tm-title-prefix">&gt;</span>
            Security Toolkit Portal
          </h1>
          <p className="sec-tm-subtitle">
            Access our interactive security tools to enhance your online
            security and privacy in the digital age.
          </p>
        </section>

        <section
          className="sec-tm-search-section"
          aria-label="Search security tools"
        >
          <div className="sec-tm-search-container">
            <div
              className={`sec-tm-search-input-group ${searchFocused ? "focused" : ""
                }`}
            >
              <span className="sec-tm-search-icon" aria-hidden="true">
                <Search size={18} />
              </span>
              <input
                type="text"
                className="sec-tm-search-input"
                placeholder="Search security tools and categories..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                name="security-search"
                id="security-search"
                aria-label="Search security tools and categories"
              />
              {searchQuery && (
                <button
                  className="sec-tm-search-clear-button"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Enhanced search results dropdown */}
            {searchFocused && searchResults.length > 0 && (
              <div className="sec-tm-search-results">
                <div className="sec-tm-search-results-header">
                  <span>Search Results</span>
                  <span className="sec-tm-search-results-count">
                    {searchResults.length} found
                  </span>
                </div>
                <div className="sec-tm-search-results-list">
                  {searchResults.map((result) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      className="sec-tm-search-result-item"
                      onClick={(e) => handleSearchResultClick(e, result)}
                      style={{
                        "--result-color": result.color,
                      }}
                    >
                      <div
                        className="sec-tm-search-result-icon"
                        style={{ color: result.color }}
                      >
                        {result.icon}
                      </div>
                      <div className="sec-tm-search-result-content">
                        <div className="sec-tm-search-result-name">
                          {highlightMatch(result.name, searchQuery)}
                        </div>
                        <div className="sec-tm-search-result-description">
                          {highlightMatch(result.description, searchQuery)}
                        </div>
                        {result.type === "tool" && (
                          <div className="sec-tm-search-result-category">
                            in {result.categoryName}
                          </div>
                        )}
                      </div>
                      <ChevronRight
                        size={16}
                        className="sec-tm-search-result-arrow"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No results message */}
            {searchFocused &&
              searchQuery &&
              searchResults.length === 0 &&
              !isSearching && (
                <div className="sec-tm-search-results sec-tm-search-no-results">
                  <div className="sec-tm-search-no-results-content">
                    <AlertCircle size={24} />
                    <p>No results found for "{searchQuery}"</p>
                    <button
                      className="sec-tm-search-clear-button"
                      onClick={handleClearSearch}
                    >
                      Clear search
                    </button>
                  </div>
                </div>
              )}

            {/* Loading indicator */}
            {isSearching && (
              <div className="sec-tm-search-results sec-tm-search-loading">
                <div className="sec-tm-search-loading-spinner"></div>
                <p>Searching...</p>
              </div>
            )}
          </div>
        </section>

        <section
          className="sec-tm-stats-section"
          aria-label="Security statistics"
        >
          <div className="sec-tm-stats-container">
            {securityStats.map((stat) => (
              <div key={stat.id} className="sec-tm-stat-item" tabIndex="0">
                <div className="sec-tm-stat-icon" aria-hidden="true">
                  {stat.icon}
                </div>
                <div className="sec-tm-stat-value">{stat.value}</div>
                <div className="sec-tm-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section
          className="sec-tm-categories-section"
          aria-label="Security tool categories"
        >
          <div className="sec-tm-categories-grid">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                id={`category-${category.id}`}
                className="sec-tm-category-card"
              >
                <div
                  className="sec-tm-category-card-inner"
                  style={getCategoryGradientStyle(category.color)}
                >
                  <div className="sec-tm-category-card-content">
                    <div>
                      <div className="sec-tm-category-icon-container">
                        <div
                          className="sec-tm-category-icon"
                          style={{ backgroundColor: `${category.color}33` }}
                          aria-hidden="true"
                        >
                          {category.icon}
                        </div>
                        <h3 className="sec-tm-category-title">
                          {category.name}
                        </h3>
                      </div>
                      <p className="sec-tm-category-description">
                        {category.description}
                      </p>
                    </div>

                    <div className="sec-tm-card-tools">
                      {category.tools.map((tool) => (
                        <button
                          key={tool.id}
                          className="sec-tm-tool-item"
                          onClick={(e) => handleToolClick(e, tool.path)}
                          aria-label={`Open ${tool.name}`}
                        >
                          <div className="sec-tm-tool-icon" aria-hidden="true">
                            {tool.icon}
                          </div>
                          <div className="sec-tm-tool-info">
                            <div className="sec-tm-tool-name">{tool.name}</div>
                            <div className="sec-tm-tool-description">
                              {tool.description}
                            </div>
                          </div>
                          <ExternalLink
                            size={14}
                            className="sec-tm-tool-arrow"
                            aria-hidden="true"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          className="sec-tm-quick-access-section"
          aria-label="Quick access to popular tools"
        >
          <div className="sec-tm-section-container">
            <h2 className="sec-tm-section-title">
              Quick Access to Popular Tools
            </h2>
            <div className="sec-tm-quick-access-grid">
              {[
                {
                  id: "password-strength",
                  icon: <Shield size={24} />,
                  text: "Password Checker",
                  color: "#00ffaa",
                  path: "/password-strength-meter",
                },
                {
                  id: "breach-checker",
                  icon: <AlertTriangle size={24} />,
                  text: "Breach Checker",
                  color: "#00cc88",
                  path: "/breach-exposure-checker",
                },
                {
                  id: "safe-browsing",
                  icon: <Search size={24} />,
                  text: "URL Scanner",
                  color: "#33ffbb",
                  path: "/safe-browsing-check",
                },
                {
                  id: "password-generator",
                  icon: <Key size={24} />,
                  text: "Password Generator",
                  color: "#ff3e00",
                  path: "/password-generator",
                },
                {
                  id: "file-encryption",
                  icon: <FileLock size={24} />,
                  text: "File Encryption",
                  color: "#ff7700",
                  path: "/file-encryption",
                },
                {
                  id: "ip-geolocation",
                  icon: <Map size={24} />,
                  text: "IP Geolocation",
                  color: "#00ffaa",
                  path: "/ip-geolocation",
                },
                {
                  id: "dns-leak",
                  icon: <Wifi size={24} />,
                  text: "DNS Leak Test",
                  color: "#00cc88",
                  path: "/dns-leak-tester",
                },
                {
                  id: "privacy-tester",
                  icon: <UserCheck size={24} />,
                  text: "Privacy Tester",
                  color: "#33ffbb",
                  path: "/privacy-tester",
                },
              ].map((item) => (
                <button
                  key={item.id}
                  className="sec-tm-quick-access-button"
                  onClick={(e) => handleToolClick(e, item.path)}
                  style={{
                    "--button-color": item.color,
                  }}
                  aria-label={`Open ${item.text}`}
                >
                  <span className="sec-tm-quick-access-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="sec-tm-quick-access-text">{item.text}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SecurityTools;
