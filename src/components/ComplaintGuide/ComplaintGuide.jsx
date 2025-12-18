import { useState, useEffect, memo, Component } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronUp,
  Database,
  FileText,
  Globe,
  HelpCircle,
  ImageIcon,
  Info,
  Mail,
  Phone,
  Server,
  Terminal,
  User,
} from "lucide-react";
import "./ComplaintGuide.css";
import {
  crimeCategories,
  reportingAuthorities,
  faqData,
  evidenceGuidelines,
  portalSteps,
  processSteps,
} from "./tabsData.jsx";
import { SkeletonPage } from "../common/Skeleton/Skeleton.jsx";

// Error Boundary Component
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="guide-container">
          <h2 style={{ color: "#ff3e00" }}>Something went wrong.</h2>
          <p>Please try refreshing the page or contact support.</p>
          <p>Error: {this.state.error?.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const SectionHeader = memo(({ icon, title, intro }) => {
  return (
    <>
      <h2>
        {icon && <span className="guide-section-icon">{icon}</span>} {title}
      </h2>
      {intro && <p className="guide-intro">{intro}</p>}
    </>
  );
});

const CardGrid = memo(({ children }) => {
  return <div className="guide-card-grid">{children}</div>;
});

const Accordion = memo(({ items }) => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (sectionId) => {
    setExpandedSection((prev) => (prev === sectionId ? null : sectionId));
  };

  return (
    <div className="guide-accordion">
      {items?.map((item, index) => (
        <div key={item.id} className="guide-accordion-item">
          <div
            className={`guide-accordion-header ${expandedSection === item.id ? "guide-expanded" : ""
              }`}
            onClick={() => toggleSection(item.id)}
          >
            <div className="guide-accordion-title">
              <div className="guide-step-number">{index + 1}</div>
              <div className="guide-step-icon">{item.icon}</div>
              <h3>{item.title}</h3>
            </div>
            <div className="guide-accordion-arrow">
              {expandedSection === item.id ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </div>
          </div>
          <div
            className={`guide-accordion-content ${expandedSection === item.id ? "guide-expanded" : ""
              }`}
          >
            {item.content}
          </div>
        </div>
      ))}
    </div>
  );
});

const EmergencyBanner = memo(() => {
  return (
    <div className="guide-emergency-banner">
      <div className="guide-emergency-icon">
        <AlertTriangle size={24} />
      </div>
      <div className="guide-emergency-content">
        <h2>Cyber Crime Emergency?</h2>
        <p>
          Call the National Cyber Crime Helpline immediately:{" "}
          <span className="guide-emergency-number">1930</span> or visit{" "}
          <a
            href="https://cybercrime.gov.in/"
            className="guide-emergency-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            cybercrime.gov.in
          </a>
        </p>
        <p>
          For financial fraud cases, reporting within the first 24 hours (the
          Golden Hour) significantly increases the chances of recovering your
          money. Act quickly!
        </p>
      </div>
    </div>
  );
});

const TabNavigation = memo(({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "process", label: "Complaint Process", icon: <FileText size={18} /> },
    { id: "portal", label: "Portal Guide", icon: <User size={18} /> },
    {
      id: "categories",
      label: "Crime Categories",
      icon: <Database size={18} />,
    },
    {
      id: "evidence",
      label: "Gathering Evidence",
      icon: <ImageIcon size={18} />,
    },
    {
      id: "authorities",
      label: "Reporting Authorities",
      icon: <Server size={18} />,
    },
    { id: "faq", label: "FAQs", icon: <Info size={18} /> },
  ];

  return (
    <div className="guide-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`guide-tab-button ${activeTab === tab.id ? "guide-active" : ""
            }`}
          onClick={() => setActiveTab(tab.id)}
        >
          <span className="guide-tab-icon">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
});

const ProcessTab = memo(() => {
  return (
    <div className="guide-section">
      <SectionHeader
        icon={<FileText />}
        title="Complaint Filing Process"
        intro="Filing a cybercrime complaint in India involves several steps. This guide will help ensure your complaint is properly registered and processed."
      />

      <div className="guide-process-steps">
        {processSteps?.map((step, index) => (
          <div key={index} className="guide-step">
            <div className="guide-step-header">
              <div className="guide-step-number">{index + 1}</div>
              <h3>{step.title}</h3>
            </div>
            <p>{step.description}</p>
            <ul className="guide-checklist">
              {step.items?.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <Check className="guide-check-icon" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
});

const PortalTab = memo(() => {
  return (
    <div className="guide-section">
      <SectionHeader
        icon={<User />}
        title="Step-by-Step Portal Guide"
        intro="This detailed guide walks you through the exact process of filing a complaint on the National Cyber Crime Reporting Portal."
      />

      <Accordion items={portalSteps} />
    </div>
  );
});

const FileComplaintForm = memo(() => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/complaint-form");
  };

  return (
    <div className="guide-two-columns">
      <div className="guide-ready-box">
        <h3>
          <Check className="guide-success-icon" /> Ready to File Your Complaint?
        </h3>
        <p>
          Now that you know the complete process, you can file your cybercrime
          complaint on the official National Cyber Crime Reporting Portal.
          Remember to gather all necessary evidence and information before
          starting.
        </p>
        <div className="guide-button-group">
          <a
            href="https://cybercrime.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="guide-primary-button"
          >
            <Globe className="guide-button-icon" /> Go to Official Portal
          </a>
          <button
            className="guide-secondary-button"
            onClick={handleClick}
            aria-label="Try test form"
          >
            <HelpCircle size={16} className="guide-button-icon" /> Try Test Form
          </button>
        </div>
      </div>

      <div className="guide-help-box">
        <h3>
          <HelpCircle className="guide-help-icon" /> Need More Information?
        </h3>
        <p>
          Check out our other guides on crime categories, evidence gathering
          tips, or FAQs using the tabs above. You can also call the National
          Cyber Crime Helpline at <strong>1930</strong> for direct assistance.
        </p>
      </div>
    </div>
  );
});

const CategoriesTab = memo(() => {
  return (
    <div className="guide-section">
      <SectionHeader
        icon={<Database />}
        title="Crime Categories"
        intro="Understanding the type of cybercrime you've experienced helps in properly reporting it. Below are the major categories of cybercrimes in India."
      />

      <CardGrid>
        {crimeCategories?.map((category) => (
          <div
            key={category.id}
            className="guide-card"
            style={{ borderTopColor: category.color }}
          >
            <div className="guide-card-header">
              <div className="guide-card-icon">{category.icon}</div>
              <h3>{category.title}</h3>
            </div>
            <div className="guide-card-content">
              <p>{category.description}</p>
              <h4>Common Types:</h4>
              <ul className="guide-card-list">
                {category.subcategories?.map((subcat, index) => (
                  <li key={index}>
                    <span>{subcat.icon}</span>
                    <span>{subcat.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </CardGrid>
    </div>
  );
});

const EvidenceTab = memo(() => {
  return (
    <div className="guide-section">
      <SectionHeader
        icon={<ImageIcon />}
        title="Gathering Evidence"
        intro="Proper evidence collection is crucial for successful cybercrime investigation and prosecution. Follow these guidelines to preserve and document evidence effectively."
      />

      <CardGrid>
        {evidenceGuidelines?.map((guideline, index) => (
          <div key={index} className="guide-card">
            <h3>{guideline.title}</h3>
            <p>{guideline.description}</p>
            <h4>Important Tips:</h4>
            <ul className="guide-checklist">
              {guideline.tips?.map((tip, tipIndex) => (
                <li key={tipIndex}>
                  <Check size={16} className="guide-check-icon" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </CardGrid>
    </div>
  );
});

const AuthoritiesTab = memo(() => {
  return (
    <div className="guide-section">
      <SectionHeader
        icon={<Server />}
        title="Reporting Authorities"
        intro="Different cybercrime complaints may need to be reported to specific authorities. Here are the main reporting channels in India."
      />

      <CardGrid>
        {reportingAuthorities?.map((authority, index) => (
          <div key={index} className="guide-card">
            <h3>{authority.title}</h3>
            <p>{authority.description}</p>
            <div className="guide-contact-info">
              {authority.website && (
                <div className="guide-contact-item">
                  <Globe size={16} className="guide-contact-icon" />
                  <a
                    href={authority.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {authority.website}
                  </a>
                </div>
              )}

              {authority.phone && (
                <div className="guide-contact-item">
                  <Phone size={16} className="guide-contact-icon" />
                  <span>{authority.phone}</span>
                </div>
              )}

              {authority.email && (
                <div className="guide-contact-item">
                  <Mail size={16} className="guide-contact-icon" />
                  <span>{authority.email}</span>
                </div>
              )}
            </div>
            <h4>Reporting Process:</h4>
            <ol className="guide-numbered-list">
              {authority.steps?.map((step, stepIndex) => (
                <li key={stepIndex}>{step}</li>
              ))}
            </ol>
          </div>
        ))}
      </CardGrid>
    </div>
  );
});

const FaqTab = memo(() => {
  return (
    <div className="guide-section">
      <SectionHeader
        icon={<Info />}
        title="Frequently Asked Questions"
        intro="Common questions and answers about cyber crime reporting in India."
      />

      <div className="guide-faq-list">
        {faqData?.map((faq, index) => (
          <div key={index} className="guide-faq-item">
            <h3>
              <HelpCircle size={16} className="guide-faq-icon" />
              {faq.question}
            </h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
});

const ComplaintGuide = () => {
  const [activeTab, setActiveTab] = useState("process");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case "process":
        return <ProcessTab />;
      case "portal":
        return <PortalTab />;
      case "categories":
        return <CategoriesTab />;
      case "evidence":
        return <EvidenceTab />;
      case "authorities":
        return <AuthoritiesTab />;
      case "faq":
        return <FaqTab />;
      default:
        return <ProcessTab />;
    }
  };

  if (isLoading) {
    return <SkeletonPage type="default" />;
  }

  return (
    <ErrorBoundary>
      <div className="guide-container">
        <div className="guide-header">
          <h1 className="page-title">
            <Terminal size={28} className="guide-header-icon" />
            <span>Cyber Crime Complaint Guide</span>
          </h1>
          <p>
            Step-by-step guidance on filing cybercrime complaints with relevant
            authorities in India
          </p>
        </div>

        <EmergencyBanner />
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="guide-content">
          {renderTabContent()}
          <FileComplaintForm />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ComplaintGuide;