import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  Search,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Shield,
  AlertTriangle,
  Eye,
  Info,
  BookOpen,
  Calendar,
  Filter,
  List,
  Grid,
  Clock,
  Book,
  X,
} from "lucide-react";
import { cyberLawsData } from "./cyberlaws.js";
import "./IndianLaws.css";

export default function IndianLaws() {
  const [laws, setLaws] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedLaw, setExpandedLaw] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState("list");
  const [sortMethod, setSortMethod] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLaws(cyberLawsData);
      setIsLoading(false);
    }, 800);

    const handleMouseDown = () => document.body.classList.add("using-mouse");
    const handleKeyDown = () => document.body.classList.remove("using-mouse");

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
      if (animationRef.current) clearInterval(animationRef.current);
      if (canvasRef.current && containerRef.current) {
        containerRef.current.removeChild(canvasRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isLoading || !containerRef.current) return;

    const canvas = document.createElement("canvas");
    canvasRef.current = canvas;
    const ctx = canvas.getContext("2d");
    const container = containerRef.current;

    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "1";
    canvas.style.opacity = "0.05";

    container.appendChild(canvas);

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    function draw() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00ffaa";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = String.fromCharCode(Math.random() * 128);
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    animationRef.current = setInterval(draw, 33);

    return () => {
      clearInterval(animationRef.current);
      if (container.contains(canvas)) {
        container.removeChild(canvas);
      }
    };
  }, [isLoading]);

  const years = useMemo(() => {
    if (!laws.length) return ["All"];
    const uniqueYears = [...new Set(laws.map((law) => law.year))].sort(
      (a, b) => b - a
    );
    return ["All", ...uniqueYears];
  }, [laws]);

  const severities = useMemo(() => {
    if (!laws.length) return ["All"];
    const uniqueSeverities = [
      ...new Set(laws.filter((law) => law.severity).map((law) => law.severity)),
    ];
    return ["All", ...uniqueSeverities];
  }, [laws]);

  const categories = useMemo(() => {
    return ["All", ...new Set(laws.map((law) => law.category))];
  }, [laws]);

  const filteredLaws = useMemo(() => {
    if (!laws.length) return [];

    const filtered = laws.filter((law) => {
      const matchesSearch =
        searchTerm === "" ||
        law.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        law.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        law.sections.some(
          (section) =>
            section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            section.content.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === "All" || law.category === selectedCategory;
      const matchesSeverity =
        selectedSeverity === "All" || law.severity === selectedSeverity;
      const matchesYear =
        selectedYear === "All" || law.year.toString() === selectedYear;

      return matchesSearch && matchesCategory && matchesSeverity && matchesYear;
    });

    return [...filtered].sort((a, b) => {
      if (sortMethod === "newest") return b.year - a.year;
      if (sortMethod === "oldest") return a.year - b.year;
      if (sortMethod === "alphabetical") return a.title.localeCompare(b.title);
      return 0;
    });
  }, [
    searchTerm,
    selectedCategory,
    selectedSeverity,
    selectedYear,
    laws,
    sortMethod,
  ]);

  const toggleLawExpansion = useCallback((id) => {
    setExpandedLaw((prevId) => (prevId === id ? null : id));
  }, []);

  const clearSearch = useCallback(() => setSearchTerm(""), []);

  const resetFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedSeverity("All");
    setSelectedYear("All");
    setSortMethod("newest");
  }, []);

  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  const renderSeverityBadge = useCallback((severity) => {
    let badgeClass = "indian-laws-severity-badge ";
    let icon = null;

    if (severity === "High") {
      badgeClass += "indian-laws-severity-high";
      icon = <AlertTriangle size={14} />;
    } else if (severity === "Medium") {
      badgeClass += "indian-laws-severity-medium";
      icon = <Eye size={14} />;
    } else {
      badgeClass += "indian-laws-severity-low";
      icon = <Shield size={14} />;
    }

    return (
      <span className={badgeClass}>
        {icon}
        <span>{severity}</span>
      </span>
    );
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleKeyDown = useCallback(
    (e, id) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleLawExpansion(id);
      }
    },
    [toggleLawExpansion]
  );

  return (
    <div className="indian-laws-cyber-container" ref={containerRef}>
      <div className="indian-laws-terminal-header">
        <div className="indian-laws-terminal-controls">
          <span className="indian-laws-terminal-circle indian-laws-terminal-red"></span>
          <span className="indian-laws-terminal-circle indian-laws-terminal-yellow"></span>
          <span className="indian-laws-terminal-circle indian-laws-terminal-green"></span>
        </div>
        <div className="indian-laws-terminal-title">
          savdhaan@india:~/legal/framework$ ./view_laws
        </div>
      </div>

      <div className="indian-laws-terminal-body">
        <div className="indian-laws-cyber-header">
          <h1 className="page-title">&gt;_
            Indian Cyber Laws <span className="indian-laws-blink">_</span>
          </h1>
          <div className="indian-laws-matrix-animation"></div>
          <p>
            Comprehensive database of Indian cybersecurity legislative
            framework, IT Acts, and digital governance directives.
          </p>
        </div>

        <div className="indian-laws-search-filter-section">
          <div className="indian-laws-cyber-panel indian-laws-search-panel">
            <div className="indian-laws-search-row">
              <div className="indian-laws-search-input-container">
                <Search className="indian-laws-search-icon" size={18} />
                <input
                  type="text"
                  placeholder="search laws by keyword, section or provision..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="indian-laws-search-input"
                  aria-label="Search laws"
                />
                {searchTerm && (
                  <button
                    className="indian-laws-clear-search"
                    onClick={clearSearch}
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="indian-laws-filter-toggle-controls">
                <button
                  className="indian-laws-cyber-button indian-laws-filter-toggle"
                  onClick={toggleFilters}
                  aria-expanded={showFilters}
                  aria-controls="advanced-filters"
                >
                  <Filter size={16} />{" "}
                  {showFilters ? "HIDE FILTERS" : "SHOW FILTERS"}
                </button>
                <div
                  className="indian-laws-view-toggle"
                  role="group"
                  aria-label="Change view"
                >
                  <button
                    className={`indian-laws-view-button ${view === "grid" ? "indian-laws-active" : ""
                      }`}
                    onClick={() => setView("grid")}
                    title="Grid View"
                    aria-pressed={view === "grid"}
                  >
                    <Grid size={16} />
                  </button>
                  <button
                    className={`indian-laws-view-button ${view === "list" ? "indian-laws-active" : ""
                      }`}
                    onClick={() => setView("list")}
                    title="List View"
                    aria-pressed={view === "list"}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {showFilters && (
              <div
                className="indian-laws-advanced-filters"
                id="advanced-filters"
              >
                <div className="indian-laws-filter-group">
                  <label
                    className="indian-laws-filter-label"
                    htmlFor="category-select"
                  >
                    <BookOpen size={16} /> Category:
                  </label>
                  <select
                    id="category-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="indian-laws-cyber-select"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="indian-laws-filter-group">
                  <label
                    className="indian-laws-filter-label"
                    htmlFor="severity-select"
                  >
                    <AlertTriangle size={16} /> Severity:
                  </label>
                  <select
                    id="severity-select"
                    value={selectedSeverity}
                    onChange={(e) => setSelectedSeverity(e.target.value)}
                    className="indian-laws-cyber-select"
                  >
                    {severities.map((severity) => (
                      <option key={severity} value={severity}>
                        {severity}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="indian-laws-filter-group">
                  <label
                    className="indian-laws-filter-label"
                    htmlFor="year-select"
                  >
                    <Calendar size={16} /> Year:
                  </label>
                  <select
                    id="year-select"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="indian-laws-cyber-select"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="indian-laws-filter-group">
                  <label
                    className="indian-laws-filter-label"
                    htmlFor="sort-select"
                  >
                    <Clock size={16} /> Sort:
                  </label>
                  <select
                    id="sort-select"
                    value={sortMethod}
                    onChange={(e) => setSortMethod(e.target.value)}
                    className="indian-laws-cyber-select"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="alphabetical">Alphabetical</option>
                  </select>
                </div>

                <button
                  className="indian-laws-cyber-button indian-laws-reset-filters"
                  onClick={resetFilters}
                >
                  RESET ALL FILTERS
                </button>
              </div>
            )}

            {!isLoading && (
              <div className="indian-laws-results-summary">
                <span className="indian-laws-results-count">
                  <span className="indian-laws-results-count-value">
                    {filteredLaws.length}
                  </span>{" "}
                  laws found
                </span>
                {filteredLaws.length < laws.length && (
                  <span className="indian-laws-filters-applied">
                    • Filters applied
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="indian-laws-cyber-panel indian-laws-loading-panel">
            <div className="indian-laws-terminal-output">
              <p>Connecting to secure database...</p>
              <p>Decrypting legal records...</p>
              <p>Establishing secure connection...</p>
              <div className="indian-laws-loading-line">
                <div className="indian-laws-loading-progress"></div>
              </div>
            </div>
          </div>
        ) : filteredLaws.length === 0 ? (
          <div className="indian-laws-cyber-panel indian-laws-empty-panel">
            <p className="indian-laws-terminal-text">
              ! ERROR: No legal documents matching query parameters found in
              database.
            </p>
            <p className="indian-laws-terminal-text">
              ! SUGGESTION: Modify search parameters or reset filters.
            </p>
            <button
              className="indian-laws-cyber-button indian-laws-reset-button"
              onClick={resetFilters}
            >
              RESET QUERY PARAMETERS
            </button>
          </div>
        ) : (
          <div
            className={`indian-laws-container ${view === "grid"
                ? "indian-laws-grid-view"
                : "indian-laws-list-view"
              }`}
          >
            {filteredLaws.map((law) => (
              <div
                key={law.id}
                className={`indian-laws-cyber-panel indian-laws-law-card ${expandedLaw === law.id ? "indian-laws-expanded" : ""
                  }`}
              >
                <div
                  className="indian-laws-law-header"
                  onClick={() => toggleLawExpansion(law.id)}
                  role="button"
                  aria-expanded={expandedLaw === law.id}
                  aria-controls={`law-content-${law.id}`}
                  tabIndex={0}
                  onKeyDown={(e) => handleKeyDown(e, law.id)}
                >
                  <div className="indian-laws-law-title-container">
                    <div className="indian-laws-law-title-wrapper">
                      <h2>{law.title}</h2>
                      <div className="indian-laws-law-metadata">
                        <span
                          className="indian-laws-law-id"
                          title="Law Identifier"
                        >
                          <Book size={14} /> {law.id}
                        </span>
                        <span
                          className="indian-laws-law-year"
                          title="Year Enacted"
                        >
                          <Calendar size={14} /> {law.year}
                        </span>
                        <span
                          className="indian-laws-law-category"
                          title="Category"
                        >
                          {law.category}
                        </span>
                        {law.severity && renderSeverityBadge(law.severity)}
                      </div>
                    </div>

                    <div className="indian-laws-law-expander">
                      {expandedLaw === law.id ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </div>
                  </div>

                  {expandedLaw !== law.id && (
                    <p className="indian-laws-law-preview">
                      {law.description.substring(0, 120)}...
                    </p>
                  )}
                </div>

                {expandedLaw === law.id && (
                  <div
                    className="indian-laws-law-content"
                    id={`law-content-${law.id}`}
                  >
                    <div className="indian-laws-law-summary">
                      <div className="indian-laws-summary-header">
                        <Info size={18} />
                        <h3>Summary</h3>
                      </div>
                      <p>{law.description}</p>
                    </div>

                    <div className="indian-laws-quick-info-panel">
                      <div className="indian-laws-info-item">
                        <div className="indian-laws-info-label">Enacted</div>
                        <div className="indian-laws-info-value">{law.year}</div>
                      </div>
                      <div className="indian-laws-info-item">
                        <div className="indian-laws-info-label">Category</div>
                        <div className="indian-laws-info-value">
                          {law.category}
                        </div>
                      </div>
                      {law.severity && (
                        <div className="indian-laws-info-item">
                          <div className="indian-laws-info-label">Severity</div>
                          <div className="indian-laws-info-value">
                            {renderSeverityBadge(law.severity)}
                          </div>
                        </div>
                      )}
                      {law.amendedBy && (
                        <div className="indian-laws-info-item">
                          <div className="indian-laws-info-label">
                            Amended By
                          </div>
                          <div className="indian-laws-info-value">
                            {law.amendedBy}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="indian-laws-law-sections-header">
                      <h3>Key Provisions & Clauses</h3>
                      <div className="indian-laws-section-divider"></div>
                    </div>

                    <div className="indian-laws-law-sections">
                      {law.sections.map((section) => (
                        <div
                          key={section.id}
                          className="indian-laws-law-section"
                        >
                          <h4>
                            <span className="indian-laws-section-marker">
                              §
                            </span>
                            {section.title}
                          </h4>
                          <p>{section.content}</p>
                          {section.penalty && (
                            <div className="indian-laws-section-penalty">
                              <span className="indian-laws-penalty-label">
                                PENALTY:
                              </span>{" "}
                              {section.penalty}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {law.keyTakeaways && (
                      <div className="indian-laws-key-takeaways">
                        <div className="indian-laws-takeaways-header">
                          <h3>Key Takeaways</h3>
                          <div className="indian-laws-section-divider"></div>
                        </div>
                        <ul className="indian-laws-takeaways-list">
                          {law.keyTakeaways.map((takeaway, index) => (
                            <li
                              key={index}
                              className="indian-laws-takeaway-item"
                            >
                              <div className="indian-laws-takeaway-bullet">
                                ✓
                              </div>
                              <div className="indian-laws-takeaway-content">
                                {takeaway}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="indian-laws-law-actions">
                      <a
                        href={law.pdfUrl}
                        className="indian-laws-cyber-button"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download size={16} /> DOWNLOAD DOCUMENT
                      </a>
                      <a
                        href={law.officialLink}
                        className="indian-laws-cyber-button indian-laws-secondary"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink size={16} /> OFFICIAL SOURCE
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {filteredLaws.length > 0 && (
          <div className="indian-laws-results-footer">
            <div className="indian-laws-result-stats">
              Displaying {filteredLaws.length} of {laws.length} laws
            </div>
            {filteredLaws.length >= 10 && (
              <button
                className="indian-laws-cyber-button indian-laws-scroll-top"
                onClick={scrollToTop}
                aria-label="Back to top"
              >
                BACK TO TOP
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
