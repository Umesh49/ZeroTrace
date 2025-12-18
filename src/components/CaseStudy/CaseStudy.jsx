import { useState, useEffect, memo } from "react";
import { cybersecurityData } from "./cybersecurityData.js";
import "./CaseStudy.css";

const CaseStudies = memo(() => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("cases");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const categories = [
    "All",
    ...new Set(cybersecurityData.caseStudies.map((study) => study.category)),
  ];

  const sortedCaseStudies = cybersecurityData.caseStudies.sort((a, b) => {
    const yearA = parseInt(a.date.split(" ")[1], 10);
    const yearB = parseInt(b.date.split(" ")[1], 10);
    return yearB - yearA;
  });

  const filteredCaseStudies = sortedCaseStudies.filter(
    (study) =>
      (selectedCategory === "All" || study.category === selectedCategory) &&
      (study.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        study.summary.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedTimeline = cybersecurityData.timeline.sort(
    (a, b) => b.year - a.year
  );

  return (
    <div className="case-study-container">
      <div className="case-study-header">
        <h2 className="page-title">CYBERCRIME CASE STUDIES</h2>
        <p>Analysis of Major Digital Security Incidents (2003-2025)</p>
      </div>

      <div className="case-study-tabs">
        {["cases", "timeline", "analysis"].map((tab) => (
          <button
            key={tab}
            className={`case-study-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "cases" && (
        <>
          <div className="case-study-filters">
            <div className="case-study-search">
              <input
                type="text"
                placeholder="Search case studies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="case-study-search-input"
              />
            </div>
            <div className="case-study-category-filter">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`case-study-category-btn ${
                    selectedCategory === category ? "active" : ""
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <p className="case-study-intro">
            Examining real-world cybercrime incidents provides insights into
            attack vectors, legal consequences, and lessons learned from
            significant cybersecurity incidents.
          </p>

          {filteredCaseStudies.map((caseStudy) => (
            <TerminalCard
              key={caseStudy.id}
              title={`[${caseStudy.date}] ${caseStudy.title}`}
              status={getStatusFromImpact(caseStudy.impact)}
              loading={loading}
            >
              <div className="case-study-content">
                <div className="case-study-badge-row">
                  <span
                    className={`case-study-impact-badge ${getImpactClass(
                      caseStudy.impact
                    )}`}
                  >
                    Impact: {caseStudy.impact}
                  </span>
                  <span className="case-study-category-badge">
                    {caseStudy.category}
                  </span>
                </div>

                <div className="case-study-section">
                  <h4>SUMMARY</h4>
                  <p>{caseStudy.summary}</p>
                </div>

                <div className="case-study-section">
                  <h4>LEGAL ACTION</h4>
                  <p>{caseStudy.legalAction}</p>
                </div>

                <div className="case-study-section">
                  <h4>SECURITY LESSON</h4>
                  <p>{caseStudy.lesson}</p>
                </div>

                <div className="case-study-tags">
                  {[
                    `#${caseStudy.title.split(" ")[0].toLowerCase()}`,
                    "#cybercrime",
                    "#security",
                  ].map((tag) => (
                    <span key={tag} className="case-study-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </TerminalCard>
          ))}
        </>
      )}

      {activeTab === "timeline" && (
        <div className="case-study-timeline-container">
          <h3 className="case-study-timeline-title">
            CYBERSECURITY INCIDENT TIMELINE
          </h3>
          <div className="case-study-timeline">
            {sortedTimeline.map((item, index) => (
              <div key={index} className="case-study-timeline-item">
                <div className="case-study-timeline-marker"></div>
                <div className="case-study-timeline-content">
                  <span className="case-study-timeline-year">{item.year}</span>
                  <p className="case-study-timeline-event">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "analysis" && (
        <>
          <TerminalCard
            title="CASE STUDY ANALYSIS"
            status="info"
            loading={loading}
          >
            <div className="case-study-analysis">
              <p>Key patterns in cybersecurity incidents:</p>
              <ul className="case-study-list">
                {[
                  "Critical infrastructure as prime ransomware targets",
                  "Supply chain vulnerabilities causing systemic risks",
                  "Increasingly sophisticated state-sponsored attacks",
                  "Financial institutions as primary cyber attack targets",
                  "Data protection lagging behind threat actor capabilities",
                  "Evolving legal frameworks for digital crimes",
                  "User verification as critical vulnerability point",
                  "Public awareness as essential cybersecurity component",
                ].map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </TerminalCard>

          <TerminalCard
            title="ATTACK TRENDS (2020-2025)"
            status="warning"
            loading={loading}
          >
            <div className="case-study-trends-container">
              {[
                {
                  title: "Ransomware Evolution",
                  description:
                    "From individual systems to critical infrastructure with increasing ransoms and double-extortion.",
                },
                {
                  title: "Supply Chain Vulnerabilities",
                  description:
                    "Targeting software supply chains for widespread access, as seen in SolarWinds and MOVEit.",
                },
                {
                  title: "Critical Infrastructure Targeting",
                  description:
                    "Strategic targeting of healthcare, energy, and financial services for maximum impact.",
                },
                {
                  title: "Nation-State Activity",
                  description:
                    "Increased sophistication in state-sponsored cyber operations.",
                },
              ].map((trend) => (
                <div key={trend.title} className="case-study-trend-card">
                  <h4>{trend.title}</h4>
                  <p>{trend.description}</p>
                </div>
              ))}
            </div>
          </TerminalCard>

          <TerminalCard
            title="IMPACT BY SECTOR"
            status="danger"
            loading={loading}
          >
            <div className="case-study-sector-impact">
              <div className="case-study-sector-row">
                {[
                  { name: "Healthcare", impact: "high" },
                  { name: "Financial Services", impact: "critical" },
                  { name: "Government", impact: "critical" },
                  { name: "Energy", impact: "high" },
                ].map((sector) => (
                  <div
                    key={sector.name}
                    className={`case-study-sector-box ${sector.impact}`}
                  >
                    {sector.name}
                  </div>
                ))}
              </div>
              <div className="case-study-sector-row">
                {[
                  { name: "Retail", impact: "medium" },
                  { name: "Manufacturing", impact: "high" },
                  { name: "Transportation", impact: "high" },
                  { name: "Education", impact: "medium" },
                ].map((sector) => (
                  <div
                    key={sector.name}
                    className={`case-study-sector-box ${sector.impact}`}
                  >
                    {sector.name}
                  </div>
                ))}
              </div>
              <div className="case-study-sector-legend">
                {["critical", "high", "medium"].map((level) => (
                  <span key={level}>
                    <span className={`case-study-legend-dot ${level}`}></span>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </span>
                ))}
              </div>
            </div>
          </TerminalCard>
        </>
      )}
    </div>
  );
});

const TerminalCard = memo(
  ({
    title,
    children,
    status = "info",
    collapsible = true,
    loading = false,
  }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
      <div
        className={`case-study-card ${status} ${
          isCollapsed ? "collapsed" : ""
        }`}
      >
        <div
          className="case-study-card-header"
          onClick={() => collapsible && setIsCollapsed(!isCollapsed)}
        >
          <div className="case-study-card-title">
            <span className="case-study-card-status"></span>
            <h3>{title}</h3>
          </div>
          {collapsible && (
            <button className="case-study-card-toggle">
              {isCollapsed ? "[+]" : "[-]"}
            </button>
          )}
        </div>
        <div className="case-study-card-content">
          {loading ? (
            <div className="case-study-loading">
              <span>LOADING DATA</span>
              <div className="case-study-loading-dots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </div>
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    );
  }
);

function getStatusFromImpact(impact) {
  return (
    {
      Critical: "danger",
      High: "warning",
      Medium: "info",
    }[impact] || "info"
  );
}

function getImpactClass(impact) {
  return (
    {
      Critical: "critical",
      High: "high",
      Medium: "medium",
    }[impact] || "medium"
  );
}

export default CaseStudies;
