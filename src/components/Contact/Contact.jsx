import React, { useState, useEffect } from "react";
import {
  FaShieldAlt,
  FaUserSecret,
  FaLock,
  FaBug,
  FaInfoCircle,
  FaHandsHelping,
  FaMobileAlt,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaExternalLinkAlt,
  FaGlobe,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import "./Contact.css";

// AnimatedBackground component
const AnimatedBackground = () => {
  return (
    <div className="contact-background">
      <div className="contact-grid-overlay"></div>
      <div className="contact-scan-line"></div>
      <div className="contact-horizontal-scan"></div>
      <div className="contact-vertical-scan"></div>

      {/* Floating security nodes */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={`node-${i}`}
          className="contact-security-node"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        >
          <div className="contact-node-pulse"></div>
        </div>
      ))}

      {/* Glow dots */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={`dot-${i}`}
          className="contact-glow-dot"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${3 + Math.random() * 5}s`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  );
};

// EmergencyCard component
const EmergencyCard = ({ contact, index }) => {
  return (
    <div
      className="contact-emergency-card"
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      <div className="contact-card-icon-wrapper">{contact.icon}</div>
      <h3>{contact.title}</h3>
      <a href={`tel:${contact.phone}`} className="contact-phone-button">
        <FaPhone /> {contact.phone}
      </a>
      <p>{contact.description}</p>
    </div>
  );
};

// CyberTeamCard component
const CyberTeamCard = ({ team, index }) => {
  return (
    <div
      className="contact-team-card"
      style={{ animationDelay: `${index * 0.2}s` }}
    >
      <h3>{team.name}</h3>
      <div className="contact-team-specialty">
        <span>Specialty:</span> <span>{team.specialty}</span>
      </div>
      <ul className="contact-team-details">
        <li>
          <strong>Location:</strong> {team.address}
        </li>
        <li>
          <strong>Helpline:</strong>{" "}
          <a href={`tel:${team.phone}`}>
            <FaPhone className="contact-mini-icon" /> {team.phone}
          </a>
        </li>
        <li>
          <strong>Email:</strong>{" "}
          <a href={`mailto:${team.email}`}>
            <FaEnvelope className="contact-mini-icon" /> {team.email}
          </a>
        </li>
      </ul>
    </div>
  );
};

// StateCellCard component
const StateCellCard = ({ cell, index }) => {
  return (
    <div
      className="contact-team-card"
      style={{ animationDelay: `${index * 0.2}s` }}
    >
      <h3>{cell.state} Cyber Crime Cell</h3>
      <ul className="contact-team-details">
        <li>
          <strong>Location:</strong> {cell.address}
        </li>
        <li>
          <strong>Helpline:</strong>{" "}
          <a href={`tel:${cell.phone}`}>
            <FaPhone className="contact-mini-icon" /> {cell.phone}
          </a>
        </li>
        <li>
          <strong>Email:</strong>{" "}
          <a href={`mailto:${cell.email}`}>
            <FaEnvelope className="contact-mini-icon" /> {cell.email}
          </a>
        </li>
        <li>
          <strong>Website:</strong>{" "}
          <a href={cell.website} target="_blank" rel="noopener noreferrer">
            {cell.website.replace(/(^\w+:|^)\/\//, "").replace(/\/$/, "")}{" "}
            <FaExternalLinkAlt className="contact-mini-icon" />
          </a>
        </li>
      </ul>
    </div>
  );
};

// ResourceCard component
const ResourceCard = ({ resource, index }) => {
  return (
    <div
      className="contact-resource-card"
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      <div className="contact-resource-icon">{resource.icon}</div>
      <h3>{resource.title}</h3>
      <p className="contact-resource-desc">{resource.description}</p>
      <div className="contact-resource-footer">
        <p>
          <strong>Contact:</strong> {resource.contact}
        </p>
        <a
          href={resource.website}
          target="_blank"
          rel="noopener noreferrer"
          className="contact-website-link"
        >
          Visit Website <FaExternalLinkAlt />
        </a>
      </div>
    </div>
  );
};

// CrimeTypeCard component
const CrimeTypeCard = ({ crime, index }) => {
  return (
    <div
      className="contact-crime-type-card"
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      <div className="contact-crime-type-badge">{crime.type}</div>
      <p>
        <strong>Where to Report:</strong> <span>{crime.reportTo}</span>
      </p>
      <p>
        <strong>Immediate Action:</strong> <span>{crime.action}</span>
      </p>
    </div>
  );
};

// FAQ component
const FAQ = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);

  // FAQ data
  const faqs = [
    {
      question: "What details should I include when reporting a cybercrime?",
      answer:
        "Include your contact details, date and time of the incident, description of the crime, details of suspects (if known), evidence like screenshots, transaction IDs, suspicious emails/messages, and information about financial loss if applicable.",
    },
    {
      question: "How quickly should I report financial fraud?",
      answer:
        "Report within 24 hours by calling 1930 or visiting cybercrime.gov.in for the best chance of recovering your money. Banks and financial institutions can often freeze transactions if alerted quickly.",
    },
    {
      question: "Will I need to visit a police station after online reporting?",
      answer:
        "It depends on the nature of the crime. For formal investigations, you may need to visit your local police station or cyber cell to provide statements or additional evidence. The online portal will guide you through next steps.",
    },
    {
      question: "What if the cybercrime involves an international party?",
      answer:
        "Still report through the National Cybercrime Reporting Portal. Indian agencies coordinate with international law enforcement through Interpol for cross-border cybercrimes. CERT-In handles international coordination for technical investigations.",
    },
  ];

  return (
    <section id="faq" className="contact-faq-section">
      <div className="contact-container">
        <h2 className="contact-animated-heading">Cybercrime Reporting FAQ</h2>

        <div className="contact-enhanced-faq-grid">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`contact-enhanced-faq-card ${expandedFaq === index ? "contact-faq-expanded" : ""
                }`}
              style={{ animationDelay: `${index * 0.2}s` }}
              onClick={() =>
                setExpandedFaq(expandedFaq === index ? null : index)
              }
            >
              <div className="contact-faq-header">
                <h3>{faq.question}</h3>
                <div className="contact-faq-toggle">
                  {expandedFaq === index ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </div>
              <div className="contact-faq-content">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Main Contact component
const Contact = () => {
  const [activeSection, setActiveSection] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Animate elements on page load
    setIsLoaded(true);

    // Intersection Observer for section animations
    const sections = document.querySelectorAll("section");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            entry.target.classList.add("contact-section-visible");
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  // Data sources for the various sections
  const emergencyContacts = [
    {
      title: "National Cyber Crime Helpline",
      phone: "1930",
      description:
        "Report financial frauds, online scams, and get immediate assistance for cybercrime incidents.",
      icon: <FaShieldAlt className="contact-icon" />,
    },
    {
      title: "Women & Child Helpline",
      phone: "1098",
      description:
        "Report online harassment, cyberbullying, and cybercrimes against women and children.",
      icon: <FaUserSecret className="contact-icon" />,
    },
    {
      title: "Police Emergency Helpline",
      phone: "112",
      description:
        "For immediate police assistance in cyber emergencies and time-sensitive situations.",
      icon: <FaLock className="contact-icon" />,
    },
    {
      title: "Cyber Swachhta Kendra",
      phone: "1800-11-4000",
      description:
        "Technical assistance for malware cleaning, virus removal, and device security issues.",
      icon: <FaBug className="contact-icon" />,
    },
  ];

  const cyberSecurityTeams = [
    {
      name: "CERT-In (Indian Computer Emergency Response Team)",
      address:
        "Electronics Niketan, 6 CGO Complex, Lodhi Road, New Delhi - 110003",
      phone: "1800-11-4949",
      email: "incident@cert-in.org.in",
      specialty: "National nodal agency for cybersecurity incident response",
    },
    {
      name: "National Critical Information Infrastructure Protection Centre",
      address: "Block-III, Old JNU Campus, New Delhi - 110067",
      phone: "011-26981795",
      email: "info@nciipc.gov.in",
      specialty: "Protection of critical national infrastructure systems",
    },
    {
      name: "Cyber Crime Cells (State Police)",
      address: "Available in all state police headquarters",
      phone: "Check your state police website",
      email: "cybercell@statename.police.gov.in",
      specialty: "Local cybercrime investigation and assistance",
    },
  ];

  const stateCyberCells = [
    {
      state: "Maharashtra",
      name: "Maharashtra Cyber Crime Cell",
      address: "Mumbai Police Headquarters, Mumbai",
      phone: "022-22026636",
      email: "cybercell.mumbai@mahapolice.gov.in",
      website: "https://mahacyber.maharashtra.gov.in",
    },
    {
      state: "Delhi",
      name: "Delhi Police Cyber Crime Cell",
      address: "Delhi Police Headquarters, New Delhi",
      phone: "011-20892515",
      email: "cybercell@delhipolice.gov.in",
      website: "https://www.delhipolice.nic.in",
    },
    {
      state: "Karnataka",
      name: "Cyber Crime Police Station, Bangalore",
      address: "Bangalore City Police, Bangalore",
      phone: "080-22943050",
      email: "ccps@kar.nic.in",
      website: "https://www.ksp.gov.in",
    },
  ];

  const helpResources = [
    {
      title: "I-4C (Indian Cybercrime Coordination Centre)",
      description:
        "Comprehensive support for cybercrime victims with investigation coordination",
      contact: "011-23093731",
      website: "https://i4c.mha.gov.in",
      icon: <FaInfoCircle className="contact-icon" />,
    },
    {
      title: "Cyber Dost (Police Cybersecurity Awareness)",
      description: "Prevention advisories and awareness from Indian Police",
      contact: "Follow @CyberDost on Twitter",
      website: "https://twitter.com/cyberdost",
      icon: <FaHandsHelping className="contact-icon" />,
    },
    {
      title: "National Cyber Security Helpline",
      description:
        "Technical assistance for malware, ransomware and security issues",
      contact: "1800-11-4000",
      website: "https://www.cyberswachhtakendra.gov.in",
      icon: <FaMobileAlt className="contact-icon" />,
    },
    {
      title: "Cyber Peace Foundation",
      description:
        "NGO providing cybersecurity assistance and legal aid to victims",
      contact: "0121-4608400",
      website: "https://www.cyberpeace.org",
      icon: <FaGlobe className="contact-icon" />,
    },
  ];

  const commonCybercrimeTypes = [
    {
      type: "Financial Fraud",
      reportTo:
        "National Cyber Crime Helpline (1930) or your bank's fraud department",
      action:
        "Block compromised cards/accounts immediately, preserve evidence like SMS alerts and transaction details",
    },
    {
      type: "Phishing & Identity Theft",
      reportTo:
        "National Cybercrime Reporting Portal and affected service providers",
      action:
        "Don't click suspicious links, change passwords, report fake profiles to platforms",
    },
    {
      type: "Online Harassment",
      reportTo: "Women Helpline (1098) or Local Police Cyber Cell",
      action:
        "Preserve evidence, block harassers, use platform reporting tools",
    },
    {
      type: "Ransomware/Malware",
      reportTo: "Cyber Swachhta Kendra (1800-11-4000) or CERT-In",
      action:
        "Disconnect infected devices from network, don't pay ransom, seek professional help",
    },
  ];

  return (
    <div className={`contact-page ${isLoaded ? "contact-page-loaded" : ""}`}>
      {/* Enhanced animated background */}
      <AnimatedBackground />

      {/* Floating navigation controls */}
      <div className="contact-floating-nav">
        <div
          className={`contact-nav-item ${activeSection === "hero" ? "active" : ""
            }`}
          onClick={() =>
            document
              .getElementById("hero")
              .scrollIntoView({ behavior: "smooth" })
          }
        >
          <FaShieldAlt />
          <span className="contact-tooltip">Home</span>
        </div>
        <div
          className={`contact-nav-item ${activeSection === "emergency" ? "active" : ""
            }`}
          onClick={() =>
            document
              .getElementById("emergency")
              .scrollIntoView({ behavior: "smooth" })
          }
        >
          <FaPhone />
          <span className="contact-tooltip">Emergency</span>
        </div>
        <div
          className={`contact-nav-item ${activeSection === "channels" ? "active" : ""
            }`}
          onClick={() =>
            document
              .getElementById("channels")
              .scrollIntoView({ behavior: "smooth" })
          }
        >
          <FaInfoCircle />
          <span className="contact-tooltip">Channels</span>
        </div>
        <div
          className={`contact-nav-item ${activeSection === "units" ? "active" : ""
            }`}
          onClick={() =>
            document
              .getElementById("units")
              .scrollIntoView({ behavior: "smooth" })
          }
        >
          <FaUserSecret />
          <span className="contact-tooltip">Units</span>
        </div>
        <div
          className={`contact-nav-item ${activeSection === "resources" ? "active" : ""
            }`}
          onClick={() =>
            document
              .getElementById("resources")
              .scrollIntoView({ behavior: "smooth" })
          }
        >
          <FaHandsHelping />
          <span className="contact-tooltip">Resources</span>
        </div>
        <div
          className={`contact-nav-item ${activeSection === "faq" ? "active" : ""
            }`}
          onClick={() =>
            document
              .getElementById("faq")
              .scrollIntoView({ behavior: "smooth" })
          }
        >
          <FaInfoCircle />
          <span className="contact-tooltip">FAQ</span>
        </div>
      </div>

      {/* Hero Section with interactive elements */}
      <section id="hero" className="contact-hero-section">
        <div className="contact-container">
          <div className="contact-hero-content">
            <div className="contact-badge contact-badge-animated">
              Official Security Resource Center
            </div>
            <h1 className="contact-animated-title page-title">
              Cybercrime Help & Support Centre
            </h1>
            <p className="contact-hero-description">
              Official resources for reporting cybercrimes, getting help during
              cyber incidents, and accessing support services in India
            </p>

            <div className="contact-hero-buttons">
              <a
                href="https://cybercrime.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-button contact-primary-button contact-button-animated"
              >
                <FaShieldAlt /> <span>Report a Cybercrime</span>
                <span className="contact-button-glow"></span>
              </a>
              <a
                href="tel:1930"
                className="contact-button contact-secondary-button contact-button-animated"
              >
                <FaPhone /> <span>Call Helpline: 1930</span>
              </a>
            </div>

            {/* Interactive alert banner */}
            <div className="contact-alert-banner">
              <div className="contact-alert-icon">
                <FaInfoCircle />
              </div>
              <div className="contact-alert-text">
                <div className="contact-alert-title">
                  Financial fraud? Act now!
                </div>
                <div className="contact-alert-content">
                  Report within 24 hours to maximize chances of recovering your
                  money
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Matrix text effect */}
        <div className="contact-matrix-container">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="contact-matrix-column"
              style={{
                animationDuration: `${8 + Math.random() * 15}s`,
                left: `${i * 10}%`,
              }}
            >
              {Array.from({ length: 20 }).map((_, j) => (
                <span
                  key={j}
                  className="contact-matrix-character"
                  style={{
                    animationDelay: `${Math.random() * 5}s`,
                    opacity: Math.random() > 0.5 ? 0.8 : 0.3,
                  }}
                >
                  {String.fromCharCode(33 + Math.floor(Math.random() * 94))}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Emergency Helplines Section */}
      <section id="emergency" className="contact-emergency-section">
        <div className="contact-container">
          <div className="contact-section-header">
            <h2 className="contact-animated-heading">
              Emergency Cybercrime Helplines
            </h2>
            <div className="contact-badge-alert contact-badge-pulse">
              AVAILABLE 24/7
            </div>
          </div>

          <div className="contact-emergency-grid">
            {emergencyContacts.map((contact, index) => (
              <EmergencyCard key={index} contact={contact} index={index} />
            ))}
          </div>

          <div className="contact-portal-info contact-animated-card">
            <h3>National Cybercrime Reporting Portal</h3>
            <p>
              File official complaints for all types of cybercrimes with Indian
              law enforcement:
            </p>
            <a
              href="https://cybercrime.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-external-link"
            >
              cybercrime.gov.in <FaExternalLinkAlt />
            </a>
          </div>
        </div>
      </section>

      {/* Official Contact Channels & How to Report */}
      <section id="channels" className="contact-channels-section">
        <div className="contact-container">
          <div className="contact-two-column">
            {/* Left column - Official Contacts */}
            <div className="contact-column">
              <h2 className="contact-animated-heading">
                Official Contact Channels
              </h2>

              <div className="contact-info-cards">
                {[
                  {
                    icon: <FaEnvelope />,
                    title: "National Cybercrime Coordination",
                    email: "info.cybercrime@mha.gov.in",
                    desc: "For coordination with law enforcement agencies across states",
                  },
                  {
                    icon: <FaPhone />,
                    title: "Financial Fraud Reporting",
                    phone: "1930",
                    desc: "Report within 24 hours for best chance of fund recovery",
                  },
                  {
                    icon: <FaMapMarkerAlt />,
                    title: "National Cyber Crime Reporting Centre",
                    address:
                      "Indian Cyber Crime Coordination Centre (I4C), Ministry of Home Affairs, North Block, New Delhi - 110001",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="contact-info-card"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="contact-info-icon">{item.icon}</div>
                    <div className="contact-info-content">
                      <h3>{item.title}</h3>
                      {item.email && (
                        <p className="contact-link">
                          <a href={`mailto:${item.email}`}>{item.email}</a>
                        </p>
                      )}
                      {item.phone && (
                        <p className="contact-link">
                          <a href={`tel:${item.phone}`}>{item.phone}</a>{" "}
                          (Toll-Free National Helpline)
                        </p>
                      )}
                      {item.address && <p>{item.address}</p>}
                      {item.desc && <p>{item.desc}</p>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="contact-advisory contact-animated-card">
                <h3>Important Advisory</h3>
                <p>
                  Always report cybercrimes promptly. For financial frauds, call
                  1930 immediately to improve chances of recovering your money.
                  Preserve all evidence including screenshots, transaction IDs,
                  and communication before taking any action.
                </p>
              </div>
            </div>

            {/* Right column - How to Report Different Cybercrimes */}
            <div className="contact-column">
              <h2 className="contact-animated-heading">
                How to Report Different Cybercrimes
              </h2>

              <div className="contact-crime-types-grid">
                {commonCybercrimeTypes.map((crime, index) => (
                  <CrimeTypeCard key={index} crime={crime} index={index} />
                ))}
              </div>

              <div className="contact-mobile-apps contact-animated-card">
                <h3>Official Mobile Apps</h3>
                <p>
                  Download these official apps for cybercrime reporting and
                  assistance:
                </p>
                <ul>
                  {[
                    {
                      icon: <FaMobileAlt />,
                      name: "NCRP Citizen App",
                      desc: "For reporting all types of cybercrimes",
                    },
                    {
                      icon: <FaMobileAlt />,
                      name: "Cyber Trivia",
                      desc: "For cybersecurity awareness and education",
                    },
                    {
                      icon: <FaMobileAlt />,
                      name: "Cyber Surakshit",
                      desc: "For quick cybersecurity best practices",
                    },
                  ].map((app, index) => (
                    <li
                      key={index}
                      style={{ animationDelay: `${index * 0.2 + 0.3}s` }}
                    >
                      <span className="contact-list-icon">{app.icon}</span>
                      <span>
                        <strong>{app.name}</strong> - {app.desc}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialized Cybercrime Units Section */}
      <section id="units" className="contact-specialized-units">
        <div className="contact-container">
          <h2 className="contact-animated-heading">
            Specialized Cybercrime Units in India
          </h2>
          <p className="contact-section-intro">
            Contact these official agencies for specialized assistance with
            different types of cybercrimes
          </p>

          <div className="contact-teams-grid">
            {cyberSecurityTeams.map((team, index) => (
              <CyberTeamCard key={index} team={team} index={index} />
            ))}
          </div>

          <h2
            className="contact-animated-heading"
            style={{ marginTop: "60px" }}
          >
            State-Specific Cybercrime Cells
          </h2>
          <p className="contact-section-intro">
            For localized assistance, contact your state's cybercrime cell:
          </p>

          <div className="contact-teams-grid">
            {stateCyberCells.map((cell, index) => (
              <StateCellCard key={index} cell={cell} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Additional Support Resources with animated cards */}
      <section id="resources" className="contact-resources-section">
        <div className="contact-container">
          <h2 className="contact-animated-heading">
            Additional Support Resources
          </h2>

          <div className="contact-resources-grid">
            {helpResources.map((resource, index) => (
              <ResourceCard key={index} resource={resource} index={index} />
            ))}
          </div>

          <p className="contact-note">
            <strong>Note:</strong> Contact details may change over time. Please
            verify from official sources before use.
          </p>
        </div>
      </section>

      {/* Enhanced FAQ Section with animations and interaction */}
      <FAQ />

      {/* Animated security status indicator */}
      <div className="contact-security-status">
        <div className="contact-security-pulse"></div>
        <div className="contact-security-text">
          <span className="contact-security-label">SECURE CONNECTION</span>
          <span className="contact-security-value">ACTIVE</span>
        </div>
      </div>

      {/* Digital particles overlay effect */}
      <div className="contact-particles-overlay">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="contact-particle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${1 + Math.random() * 3}px`,
              height: `${1 + Math.random() * 3}px`,
              animationDuration: `${20 + Math.random() * 40}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Contact;