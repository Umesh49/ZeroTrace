import { useState, useEffect, useRef } from "react";
import {
  FaShieldAlt,
  FaBook,
  FaClipboardList,
  FaTools,
  FaUserSecret,
  FaSatelliteDish,
  FaVirus,
  FaNetworkWired,
  FaExclamationTriangle,
  FaServer,
  FaLaptopCode,
  FaNewspaper,
  FaQuestion,
  FaCommentAlt,
  FaChartBar,
} from "react-icons/fa";
import { RiAlarmWarningLine, RiShieldKeyholeLine } from "react-icons/ri";
import { GiBiohazard, GiFirewall } from "react-icons/gi";
import { SiHackaday } from "react-icons/si";
import { TbBinaryTree } from "react-icons/tb";
import MatrixBackground from "../common/MatrixBackground";
import { SkeletonPage } from "../common/Skeleton/Skeleton.jsx";
import "./Home.css";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [threatLevel, setThreatLevel] = useState("Elevated");
  const [threatData, setThreatData] = useState(null);
  const [isVisible, setIsVisible] = useState({});
  const sectionsRef = useRef({});

  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: "0px 0px -100px 0px",
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: true,
          }));
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    const sections = [
      "home-hero-section",
      "home-threat-dashboard",
      "home-stats-section",
      "home-services-section",
      "home-checklist-section",
      "home-laws-section",
      "home-tools-section",
      "home-quiz-section",
      "home-tutorials-section",
      "home-chatbot-section",
      "home-news-section",
      "home-cta-section",
      "home-terminal-section",
    ];

    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) {
        observer.observe(element);
        sectionsRef.current[section] = element;
      }
    });

    return () => {
      sections.forEach((section) => {
        const element = sectionsRef.current[section];
        if (element) observer.unobserve(element);
      });
    };
  }, [loading]);

  // Refs to hold latest values for the interval callback
  const statsRef = useRef(stats);
  const threatDataRef = useRef(threatData);
  const loadingRef = useRef(loading);

  // Keep refs in sync with state
  useEffect(() => {
    statsRef.current = stats;
    threatDataRef.current = threatData;
    loadingRef.current = loading;
  }, [stats, threatData, loading]);

  // Initial data fetch 
  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1200));

        const mockStats = {
          activeCases: 1243,
          resolvedComplaints: 892,
          ongoingInvestigations: 351,
          securityAlerts: 17,
          dataBreaches: 23,
          vulnerabilitiesDetected: 89,
        };

        const mockThreatData = {
          malwareDetections: 578,
          phishingAttempts: 892,
          ddosAttacks: 42,
          zerodays: 3,
          lastUpdated: new Date().toLocaleTimeString(),
        };

        setStats(mockStats);
        setThreatData(mockThreatData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Separate effect for the update interval
  useEffect(() => {
    const threatUpdateInterval = setInterval(() => {
      if (!loadingRef.current && statsRef.current && threatDataRef.current) {
        const levels = ["Low", "Moderate", "Elevated", "High", "Severe"];
        const newLevel = levels[Math.floor(Math.random() * levels.length)];
        setThreatLevel(newLevel);

        const newThreatData = { ...threatDataRef.current };
        const keys = Object.keys(newThreatData).filter(k => k !== 'lastUpdated');
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        if (typeof newThreatData[randomKey] === 'number') {
          newThreatData[randomKey] = Math.max(
            0,
            newThreatData[randomKey] + Math.floor(Math.random() * 7) - 3
          );
        }
        newThreatData.lastUpdated = new Date().toLocaleTimeString();
        setThreatData(newThreatData);
      }
    }, 15000);

    return () => {
      clearInterval(threatUpdateInterval);
    };
  }, []); // Only set up interval once

  const services = [
    {
      id: 1,
      title: "Cyber Laws",
      description: "Understand Indian IT Act and cybercrime legal framework",
      icon: <FaBook className="home-feature-icon" />,
      link: "/indian-laws",
      color: "blue",
    },
    {
      id: 2,
      title: "Incident Response",
      description: "Step-by-step procedures for handling security incidents",
      icon: <FaExclamationTriangle className="home-feature-icon" />,
      link: "/complaint-guide",
      color: "red",
    },
    {
      id: 3,
      title: "Security Toolkit",
      description: "Open-source tools for vulnerability assessment",
      icon: <FaTools className="home-feature-icon" />,
      link: "/security-tools",
      color: "green",
    },
    {
      id: 4,
      title: "Security Checklist",
      description:
        "Essential cybersecurity practices for personal and corporate security",
      icon: <FaClipboardList className="home-feature-icon" />,
      link: "/security-checklist",
      color: "purple",
    },
    {
      id: 5,
      title: "Security News",
      description: "Latest cybersecurity news, breaches and vulnerabilities",
      icon: <FaSatelliteDish className="home-feature-icon" />,
      link: "/security-news",
      color: "teal",
    },
    {
      id: 6,
      title: "Cyber Quiz",
      description:
        "Test your cybersecurity knowledge and learn through challenges",
      icon: <TbBinaryTree className="home-feature-icon" />,
      link: "/quiz",
      color: "indigo",
    },
    {
      id: 7,
      title: "Security Assistant",
      description: "AI-powered cybersecurity chatbot for instant guidance",
      icon: <FaUserSecret className="home-feature-icon" />,
      link: "/chatbot",
      color: "gray",
    },
    {
      id: 8,
      title: "FAQ",
      description: "Answers to commonly asked cybersecurity questions",
      icon: <RiAlarmWarningLine className="home-feature-icon" />,
      link: "/faq",
      color: "brown",
    },
    {
      id: 9,
      title: "Case Studies",
      description: "Explore real-world cybersecurity incidents and responses",
      icon: <FaLaptopCode className="home-feature-icon" />,
      link: "/case-study",
      color: "cyan",
    },
  ];

  const renderThreatLevelIndicator = () => {
    let levelColor = "blue";
    if (threatLevel === "Low") levelColor = "green";
    else if (threatLevel === "Moderate") levelColor = "blue";
    else if (threatLevel === "Elevated") levelColor = "orange";
    else if (threatLevel === "High") levelColor = "red";
    else if (threatLevel === "Severe") levelColor = "purple";

    let levelIcon = <FaShieldAlt />;
    if (threatLevel === "Low") levelIcon = <FaShieldAlt />;
    else if (threatLevel === "Moderate") levelIcon = <RiShieldKeyholeLine />;
    else if (threatLevel === "Elevated") levelIcon = <FaExclamationTriangle />;
    else if (threatLevel === "High") levelIcon = <GiBiohazard />;
    else if (threatLevel === "Severe") levelIcon = <FaVirus />;

    return (
      <div className={`home-threat-level-indicator ${levelColor}`}>
        <div className="home-threat-level-content">
          <div className="home-threat-level-icon">{levelIcon}</div>
          <div className="home-threat-level-text">
            <p className="home-threat-level-label">Current Threat Level</p>
            <h3 className="home-threat-level-value">{threatLevel}</h3>
          </div>
        </div>
        <div className="home-threat-level-pulse"></div>
      </div>
    );
  };

  const terminalLines = [
    {
      id: 1,
      type: "prompt",
      content: "$ system_scan --target=network --level=deep",
    },
    { id: 2, type: "output", content: "Initializing scan components..." },
    {
      id: 3,
      type: "output",
      content: "Checking for anomalies in network traffic patterns",
    },
    {
      id: 4,
      type: "output",
      content: "Analyzing packet headers for malicious signatures",
    },
    {
      id: 5,
      type: "output",
      content:
        "Alert: Suspicious connection attempt detected from 192.168.1.35",
    },
    {
      id: 6,
      type: "output",
      content: "Blocking origin IP and logging activity details",
    },
    {
      id: 7,
      type: "output",
      content:
        "Scan complete. 1 critical issue detected. Report available at /var/log/security/",
    },
    { id: 8, type: "prompt", content: "$ deploy_countermeasures --auto" },
    {
      id: 9,
      type: "output",
      content: "Deploying reactive protection protocols...",
    },
    {
      id: 10,
      type: "output",
      content: "Firewall rules updated. System secured.",
    },
  ];

  const securityChecklistItems = [
    {
      title: "Use Strong Passwords",
      description:
        "Create unique passwords with at least 12 characters including numbers, symbols, and mixed case.",
    },
    {
      title: "Enable Two-Factor Authentication",
      description:
        "Add an extra layer of security by enabling 2FA on all critical accounts.",
    },
    {
      title: "Keep Software Updated",
      description:
        "Regularly update operating systems and applications to patch security vulnerabilities.",
    },
  ];

  const indianLaws = [
    {
      title: "Information Technology Act, 2000",
      description:
        "Legal framework for electronic governance and cybercrime prevention.",
    },
    {
      title: "IT Amendment Act, 2008",
      description:
        "Strengthens the IT Act with provisions for data protection and cybercrime.",
    },
    {
      title: "CERT-In Guidelines",
      description:
        "Mandatory reporting requirements for cyber security incidents.",
    },
  ];

  const securityTools = [
    {
      title: "Network Vulnerability Scanner",
      description: "Identify vulnerabilities in your network infrastructure.",
    },
    {
      title: "Password Manager",
      description:
        "Securely store and generate strong passwords for all your accounts.",
    },
    {
      title: "Intrusion Detection System",
      description:
        "Monitor network traffic for suspicious activity and policy violations.",
    },
  ];

  const quizCategories = [
    {
      title: "Network Security",
      questions: 15,
      difficulty: "Intermediate",
    },
    {
      title: "Social Engineering",
      questions: 10,
      difficulty: "Beginner",
    },
    {
      title: "Cryptography",
      questions: 20,
      difficulty: "Advanced",
    },
  ];

  const tutorials = [
    {
      title: "Secure Your Home Network",
      duration: "25 mins",
      level: "Beginner",
    },
    {
      title: "Identify Phishing Attempts",
      duration: "15 mins",
      level: "Beginner",
    },
    {
      title: "Setup a Personal VPN",
      duration: "40 mins",
      level: "Intermediate",
    },
  ];

  const securityNews = [
    {
      title: "Major Bank Suffers Data Breach",
      date: "2023-05-15",
      source: "Cyber Security Times",
    },
    {
      title: "New Ransomware Variant Spreading Rapidly",
      date: "2023-05-10",
      source: "Threat Intelligence Weekly",
    },
    {
      title: "Critical Vulnerability Found in Popular Software",
      date: "2023-05-05",
      source: "Security Alerts Daily",
    },
  ];

  if (loading) {
    return <SkeletonPage type="default" />;
  }

  return (
    <div className="home-container">
      <div className="home-matrix-background">
        <MatrixBackground speed={1.2} density={1.2} colorVariant="cyber" />
      </div>

      <div className="home-cyber-grid-overlay"></div>

      <section
        id="home-hero-section"
        className={`home-hero-section ${isVisible["home-hero-section"] ? "visible" : ""
          }`}
      >
        <div className="home-hero-content">
          <div className="home-logo-container">
            <SiHackaday className="home-logo-icon home-pulse" />
            <div className="home-logo-glow"></div>
          </div>
          <h1
            className="home-hero-title home-neon-text home-glitch page-title"
            data-text="ZeroTrace"
          >
            ZeroTrace
          </h1>
          <p className="home-hero-subtitle">
            <span className="home-typing-text">
              Cybersecurity command center for threat intelligence and digital
              defense
            </span>
          </p>
          <div className="home-cyber-line"></div>
          <div className="home-hero-buttons">
            <a
              href="/complaint-guide"
              className="home-cyber-button home-primary"
            >
              <FaExclamationTriangle /> <span>Report Guide</span>
              <div className="home-button-glow"></div>
            </a>
            <a
              href="/threat-stats"
              className="home-cyber-button home-secondary"
            >
              <FaSatelliteDish /> <span>Threat Stats Intelligence</span>
              <div className="home-button-glow"></div>
            </a>
          </div>
        </div>
        <div className="home-hero-decoration">
          <div className="home-cyber-circle"></div>
          <div className="home-cyber-hexagon"></div>
        </div>
      </section>

      <section
        id="home-threat-dashboard"
        className={`home-threat-dashboard ${isVisible["home-threat-dashboard"] ? "visible" : ""
          }`}
      >
        <div className="home-dashboard-header">
          <div className="home-dashboard-title-container">
            <FaNetworkWired className="home-dashboard-icon" />
            <h2 className="home-dashboard-title">Threat Stats Dashboard</h2>
          </div>
          <div className="home-dashboard-status">
            <div className="home-status-indicator home-active"></div>
            <p className="home-dashboard-update">
              Last updated: {threatData ? threatData.lastUpdated : "Loading..."}
            </p>
          </div>
        </div>

        <div className="home-dashboard-grid">
          {renderThreatLevelIndicator()}

          <div className="home-threat-metrics">
            <div
              className="home-metric-item"
              onClick={() => (window.location.href = "/threat-stats")}
            >
              <FaVirus className="home-metric-icon" />
              <div className="home-metric-content">
                <span className="home-metric-value">
                  {threatData
                    ? threatData.malwareDetections.toLocaleString()
                    : "-"}
                </span>
                <span className="home-metric-label">Malware Detections</span>
              </div>
              <div className="home-metric-bar">
                <div
                  className="home-metric-fill"
                  style={{ width: "65%" }}
                ></div>
              </div>
            </div>

            <div
              className="home-metric-item"
              onClick={() => (window.location.href = "/threat-stats")}
            >
              <FaUserSecret className="home-metric-icon" />
              <div className="home-metric-content">
                <span className="home-metric-value">
                  {threatData
                    ? threatData.phishingAttempts.toLocaleString()
                    : "-"}
                </span>
                <span className="home-metric-label">Phishing Attempts</span>
              </div>
              <div className="home-metric-bar">
                <div
                  className="home-metric-fill"
                  style={{ width: "78%" }}
                ></div>
              </div>
            </div>

            <div
              className="home-metric-item"
              onClick={() => (window.location.href = "/threat-stats")}
            >
              <GiFirewall className="home-metric-icon" />
              <div className="home-metric-content">
                <span className="home-metric-value">
                  {threatData ? threatData.ddosAttacks.toLocaleString() : "-"}
                </span>
                <span className="home-metric-label">DDoS Attacks</span>
              </div>
              <div className="home-metric-bar">
                <div
                  className="home-metric-fill"
                  style={{ width: "42%" }}
                ></div>
              </div>
            </div>

            <div
              className="home-metric-item home-alert"
              onClick={() => (window.location.href = "/threat-stats")}
            >
              <RiAlarmWarningLine className="home-metric-icon" />
              <div className="home-metric-content">
                <span className="home-metric-value">
                  {threatData ? threatData.zerodays.toLocaleString() : "-"}
                </span>
                <span className="home-metric-label">Zero-day Exploits</span>
              </div>
              <div className="home-metric-bar">
                <div
                  className="home-metric-fill"
                  style={{ width: "25%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div className="home-dashboard-radar">
          <div className="home-radar-stats">
            <a href="/threat-stats" className="home-view-more-button">
              <span>View Detailed Threat Statistics</span>
              <FaChartBar />
            </a>
          </div>
        </div>
      </section>

      <section
        id="home-services-section"
        className={`home-services-section ${isVisible["home-services-section"] ? "visible" : ""
          }`}
      >
        <div className="home-section-header">
          <h2 className="home-section-title">Cyber Security Toolkit</h2>
          <p className="home-section-subtitle">
            Advanced defense tools and resources for digital warfare
          </p>
          <div className="home-section-underline"></div>
        </div>

        <div className="home-services-grid">
          {services.map((service) => (
            <a
              href={service.link}
              key={service.id}
              className={`home-service-card home-${service.color}`}
            >
              <div
                className={`home-service-icon-wrapper home-${service.color}`}
              >
                {service.icon}
                <div className="home-service-icon-glow"></div>
              </div>
              <h3 className="home-service-title">{service.title}</h3>
              <p className="home-service-description">{service.description}</p>
              <div className="home-service-hover-effect"></div>
            </a>
          ))}
        </div>
      </section>
      <section
        id="home-laws-section"
        className={`home-section home-section-alt ${isVisible["home-laws-section"] ? "visible" : ""
          }`}
      >
        <div className="home-section-container">
          <div className="home-section-header">
            <h2 className="home-section-title">
              <FaBook /> Indian Cyber Laws
            </h2>
            <p className="home-section-subtitle">
              Understanding the legal framework for cybersecurity in India
            </p>
            <div className="home-section-underline"></div>
          </div>

          <div className="home-cards-grid">
            {indianLaws.map((law, index) => (
              <a
                href="/indian-laws"
                key={index}
                className="home-info-card home-info-card-alt"
              >
                <h3 className="home-info-card-title">{law.title}</h3>
                <p className="home-info-card-description">{law.description}</p>
              </a>
            ))}
          </div>

          <div className="home-dashboard-radar"></div>
          <div className="home-view-more-container">
            <div className="home-radar-stats">
              <a
                href="/indian-laws"
                className="home-view-more-button home-view-more-button-alt"
              >
                <span>View All Cyber Laws</span>
                <FaBook />
              </a>
            </div>
          </div>
        </div>
      </section>
      <section
        id="home-chatbot-section"
        className={`home-section home-section-alt ${isVisible["home-chatbot-section"] ? "visible" : ""
          }`}
      >
        <div className="home-section-container">
          <div className="home-section-header">
            <h2 className="home-section-title">
              <FaCommentAlt /> Security Assistant
            </h2>
            <p className="home-section-subtitle">
              Get instant answers to your cybersecurity questions with our AI
              assistant
            </p>
            <div className="home-section-underline"></div>
          </div>

          <div className="home-chatbot-preview">
            <div className="home-chatbot-messages">
              <div className="home-chatbot-message home-chatbot-bot">
                How can I help with your cybersecurity needs today?
              </div>
              <div className="home-chatbot-message home-chatbot-user">
                How do I check if my account has been compromised?
              </div>
              <div className="home-chatbot-message home-chatbot-bot">
                You can check if your email has been involved in a data breach
                by visiting haveibeenpwned.com and entering your email address.
              </div>
            </div>

            <div className="home-chatbot-prompt">
              <div className="home-chatbot-input">
                Ask a cybersecurity question...
              </div>
              <div className="home-chatbot-icon">
                <FaCommentAlt />
              </div>
            </div>
          </div>

          <div className="home-view-more-container">
            <a
              href="/chatbot"
              className="home-view-more-button home-view-more-button-alt"
            >
              <span>Talk to Security Assistant</span>
              <FaCommentAlt />
            </a>
          </div>
        </div>
      </section>
      <section
        id="home-news-section"
        className={`home-section ${isVisible["home-news-section"] ? "visible" : ""
          }`}
      >
        <div className="home-section-container">
          <div className="home-section-header">
            <h2 className="home-section-title">
              <FaNewspaper /> Security News
            </h2>
            <p className="home-section-subtitle">
              Stay updated with the latest cybersecurity news and threat
              intelligence
            </p>
            <div className="home-section-underline"></div>
          </div>

          <div className="home-news-grid">
            {securityNews.map((news, index) => (
              <a href="/security-news" key={index} className="home-news-card">
                <div className="home-news-date">{news.date}</div>
                <h3 className="home-news-title">{news.title}</h3>
                <div className="home-news-source">Source: {news.source}</div>
              </a>
            ))}
          </div>

          <div className="home-view-more-container">
            <a href="/security-news" className="home-view-more-button">
              <span>Read All Security News</span>
              <FaNewspaper />
            </a>
            <a
              href="/threat-stats"
              className="home-view-more-button home-view-more-button-secondary"
            >
              <span>View Threat Statistics</span>
              <FaChartBar />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
