import { useState, useEffect, useCallback, useMemo } from "react"
import {
  FaCheck,
  FaLock,
  FaUserShield,
  FaWifi,
  FaMobile,
  FaFingerprint,
  FaChevronDown,
  FaChevronUp,
  FaPrint,
  FaTerminal,
  FaVirus,
  FaCode,
  FaInfoCircle,
  FaShieldAlt,
  FaQuestionCircle,
  FaHome,
  FaBriefcase,
  FaUserSecret,
} from "react-icons/fa"
import initialChecklist from "./checklist.js"
import "./SecurityChecklist.css"

const SECTIONS = {
  passwords: { title: "Password Security", icon: <FaLock /> },
  devices: { title: "Device Protection", icon: <FaUserShield /> },
  online: { title: "Online Safety", icon: <FaWifi /> },
  financial: { title: "Financial Security", icon: <FaFingerprint /> },
  mobile: { title: "Mobile Device Safety", icon: <FaMobile /> },
  privacy: { title: "Privacy Protection", icon: <FaShieldAlt /> },
  iot: { title: "Smart Home Security", icon: <FaHome /> },
  workFromHome: { title: "Work From Home", icon: <FaBriefcase /> },
  socialEngineering: { title: "Social Engineering Defense", icon: <FaUserSecret /> },
}

const getCategoryColor = (category) => {
  const categoryColors = {
    passwords: "var(--primary-color)",
    devices: "var(--secondary-color)",
    online: "var(--accent-color)",
    financial: "var(--primary-dim)",
    mobile: "var(--secondary-color)",
    privacy: "var(--accent-color)",
    iot: "var(--tertiary-color)",
    workFromHome: "var(--quaternary-color)",
    socialEngineering: "var(--warning-color)",
  }

  return categoryColors[category] || "var(--primary-color)"
}

const generateSessionId = () =>
  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

function SecurityChecklist() {
  const [checklist, setChecklist] = useState(initialChecklist)
  const [expandedSections, setExpandedSections] = useState(
    Object.keys(SECTIONS).reduce((acc, section) => {
      acc[section] = section === "passwords"
      return acc
    }, {}),
  )
  const [showExplanation, setShowExplanation] = useState({})
  const [sessionId, setSessionId] = useState("")

  useEffect(() => {
    let currentSessionId = localStorage.getItem("securityChecklistSessionId")
    if (!currentSessionId) {
      currentSessionId = generateSessionId()
      localStorage.setItem("securityChecklistSessionId", currentSessionId)
    }
    setSessionId(currentSessionId)

    try {
      const savedChecklist = localStorage.getItem(`securityChecklist_${currentSessionId}`)
      if (savedChecklist) {
        setChecklist(JSON.parse(savedChecklist))
      }

      const savedExpandedSections = localStorage.getItem(`securityChecklistSections_${currentSessionId}`)
      if (savedExpandedSections) {
        setExpandedSections(JSON.parse(savedExpandedSections))
      }
    } catch (error) {
      console.error("Error loading saved data:", error)
    }
  }, [])

  useEffect(() => {
    if (!sessionId) return

    try {
      localStorage.setItem(`securityChecklist_${sessionId}`, JSON.stringify(checklist))
      const expirationDate = new Date()
      expirationDate.setFullYear(expirationDate.getFullYear() + 1)
      localStorage.setItem(`securityChecklistExpires_${sessionId}`, expirationDate.toISOString())
      document.cookie = `securityChecklistSaved=true; expires=${expirationDate.toUTCString()}; path=/; SameSite=Strict`
    } catch (error) {
      console.error("Error saving checklist data:", error)
    }
  }, [checklist, sessionId])

  useEffect(() => {
    if (!sessionId) return

    try {
      localStorage.setItem(`securityChecklistSections_${sessionId}`, JSON.stringify(expandedSections))
    } catch (error) {
      console.error("Error saving expanded sections:", error)
    }
  }, [expandedSections, sessionId])

  const handleCheckItem = useCallback((category, id) => {
    setChecklist((prevChecklist) => ({
      ...prevChecklist,
      [category]: prevChecklist[category].map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      ),
    }))
  }, [])

  const toggleExplanation = useCallback((itemId) => {
    setShowExplanation((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }))
  }, [])

  const toggleSection = useCallback((section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }, [])

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  const handleResetProgress = useCallback(() => {
    if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
      const newSessionId = generateSessionId()
      setSessionId(newSessionId)
      setChecklist(initialChecklist)
      localStorage.setItem("securityChecklistSessionId", newSessionId)
      localStorage.removeItem(`securityChecklist_${sessionId}`)
      localStorage.removeItem(`securityChecklistSections_${sessionId}`)
      localStorage.removeItem(`securityChecklistExpires_${sessionId}`)
    }
  }, [sessionId])

  const calculateProgress = useCallback(
    (category) => {
      const items = checklist[category] || []
      if (items.length === 0) return 0
      const checkedCount = items.filter((item) => item.checked).length
      return (checkedCount / items.length) * 100
    },
    [checklist]
  )

  const totalProgress = useMemo(() => {
    const allItems = Object.values(checklist).flat()
    if (allItems.length === 0) return 0
    const checkedCount = allItems.filter((item) => item.checked).length
    return (checkedCount / allItems.length) * 100
  }, [checklist])

  return (
    <div className="security-checklist-container">
      <header className="security-checklist-page-header">
        <h1 className="security-checklist-page-title page-title">
          <span className="security-checklist-title-prefix">&gt;_</span> Security Checklist
        </h1>
        <p className="security-checklist-page-subtitle">
          Complete this checklist to protect yourself from common cyber threats and safeguard your personal information
        </p>
      </header>

      <main className="security-checklist-dashboard">
        <div className="security-checklist-panel">
          <div className="security-checklist-panel-header">
            <h2>
              <FaTerminal aria-hidden="true" /> Your Security Status
            </h2>
            <div className="security-checklist-button-group">
              <button onClick={handlePrint} className="security-checklist-button" aria-label="Print Checklist">
                <FaPrint aria-hidden="true" /> Print Checklist
              </button>
              <button onClick={handleResetProgress} className="security-checklist-button" aria-label="Reset Progress">
                Reset Progress
              </button>
            </div>
          </div>

          <div className="security-checklist-progress-tracker">
            <div className="security-checklist-progress-header">
              <span>Overall Security Score</span>
              <span>{Math.round(totalProgress)}%</span>
            </div>
            <div
              className="security-checklist-progress-bar"
              role="progressbar"
              aria-valuenow={Math.round(totalProgress)}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                className="security-checklist-progress-fill"
                style={{ width: `${totalProgress}%` }}
              ></div>
            </div>
          </div>

          <div className="security-checklist-metrics">
            {Object.entries(SECTIONS).map(([key, section]) => {
              const color = getCategoryColor(key)
              const progress = Math.round(calculateProgress(key))

              return (
                <div
                  key={key}
                  className="security-checklist-metric-card"
                  style={{ borderLeft: `3px solid ${color}` }}
                >
                  <div aria-hidden="true" style={{ color }}>
                    {section.icon}
                  </div>
                  <h3>{section.title}</h3>
                  <div>{progress}%</div>
                </div>
              )
            })}
          </div>

          <div className="security-checklist-session-info">
            <small>
              Your progress is automatically saved to this device. Session ID: {sessionId.slice(0, 8)}...
            </small>
          </div>
        </div>

        {Object.entries(SECTIONS).map(([key, section]) => {
          const isOpen = expandedSections[key]
          const color = getCategoryColor(key)
          const progress = Math.round(calculateProgress(key))

          return (
            <div key={key} className="security-checklist-protocol-section">
              <div
                className="security-checklist-protocol-header"
                onClick={() => toggleSection(key)}
                role="button"
                aria-expanded={isOpen}
                aria-controls={`section-${key}-content`}
                style={{
                  borderLeft: `3px solid ${color}`,
                  borderTop: `1px solid var(--border-color)`,
                  borderRight: `1px solid var(--border-color)`,
                  borderBottom: isOpen ? "none" : `1px solid var(--border-color)`,
                }}
              >
                <h2 style={{ color }}>
                  {section.icon} {section.title}
                </h2>
                <div className="security-checklist-protocol-header-right">
                  <div>{progress}%</div>
                  {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </div>

              {isOpen && (
                <div
                  id={`section-${key}-content`}
                  className="security-checklist-protocol-content"
                  style={{
                    borderLeft: `3px solid ${color}`,
                    borderRight: `1px solid var(--border-color)`,
                    borderBottom: `1px solid var(--border-color)`,
                  }}
                >
                  <div className="security-checklist-category-progress">
                    <div className="security-checklist-progress-header">
                      <span>Completion Progress</span>
                      <span style={{ color }}>{progress}%</span>
                    </div>
                    <div
                      className="security-checklist-progress-bar"
                      role="progressbar"
                      aria-valuenow={progress}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <div
                        className="security-checklist-progress-fill"
                        style={{ width: `${progress}%`, backgroundColor: color }}
                      ></div>
                    </div>
                  </div>

                  <div className="security-checklist-task-list">
                    {checklist[key]?.map((item) => (
                      <div key={item.id}>
                        <div className={`security-checklist-task-item ${item.checked ? "checked" : ""}`}>
                          <div
                            className={`security-checklist-task-checkbox ${item.checked ? "checked" : ""}`}
                            role="checkbox"
                            aria-checked={item.checked}
                            tabIndex={0}
                            onClick={() => handleCheckItem(key, item.id)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                handleCheckItem(key, item.id)
                              }
                            }}
                            style={{ borderColor: color, backgroundColor: item.checked ? color : "transparent" }}
                          >
                            {item.checked && <FaCheck />}
                          </div>
                          <span className="security-checklist-task-text">{item.text}</span>
                          <button
                            className="security-checklist-info-button"
                            onClick={(e) => { e.stopPropagation(); toggleExplanation(item.id); }}
                            aria-expanded={showExplanation[item.id]}
                            aria-label={`More information about ${item.text}`}
                          >
                            <FaQuestionCircle />
                          </button>
                        </div>
                        {showExplanation[item.id] && (
                          <div className="security-checklist-explanation">
                            <FaInfoCircle />
                            <span>{item.explanation}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </main>

      <section className="security-checklist-cta">
        <div>
          <h2>Learn More About Protecting Yourself</h2>
          <p>Access easy-to-understand guides and tools to keep yourself safe online.</p>
          <div className="security-checklist-cta-buttons">
            <a href="/tutorials" className="security-checklist-cta-button primary">
              <FaVirus /> Increase Your Knowledge
            </a>
            <a href="/privacy-quiz" className="security-checklist-cta-button secondary">
              <FaCode /> Test Your Knowledge
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default SecurityChecklist;