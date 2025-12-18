import { useState, useEffect, useRef } from "react";
import {
  FaSearch,
  FaChevronDown,
  FaChevronRight,
  FaQuestionCircle,
  FaShieldAlt,
  FaFileAlt,
  FaLock,
  FaUserSecret,
  FaHeadset,
  FaRobot,
  FaExclamationTriangle,
  FaTimes,
  FaAngleLeft,
  FaAngleRight,
} from "react-icons/fa";
import { SkeletonPage } from "../common/Skeleton/Skeleton.jsx";
import "./FAQ.css";
import faqs from "./FAQ_Data.js";

function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("general");
  const [activeFaq, setActiveFaq] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [animatedItems, setAnimatedItems] = useState([]);
  const faqListRef = useRef(null);
  const [filteredResults, setFilteredResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [categoryResults, setCategoryResults] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const faqsPerPage = 10;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    setActiveFaq(null);
  }, [activeCategory]);

  useEffect(() => {
    if (isSearching) {
      setCurrentPage(1);
      setActiveFaq(null);
    }
  }, [isSearching]);

  useEffect(() => {
    setAnimatedItems([]);

    if (!isLoading && faqListRef.current) {
      setTimeout(() => {
        try {
          const items = Array.from(
            faqListRef.current.querySelectorAll(".safeguard-faq-item") || []
          );
          if (items && items.length > 0) {
            items.forEach((item, index) => {
              setTimeout(() => {
                if (item && item.dataset && item.dataset.index !== undefined) {
                  setAnimatedItems((prev) => [...prev, item.dataset.index]);
                }
              }, index * 50);
            });
          }
        } catch (error) {
          console.log("Error setting up animations:", error);
        }
      }, 100);
    }
  }, [isLoading, activeCategory, isSearching, currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();

    if (searchQuery.trim() === "") {
      setIsSearching(false);
      setCategoryResults({});
      return;
    }

    setIsSearching(true);
    const resultsByCategory = {};
    const allResults = [];

    Object.entries(faqs).forEach(([category, categoryFaqs]) => {
      const categoryMatches = categoryFaqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );

      resultsByCategory[category] = categoryMatches.length;
      categoryMatches.forEach((faq) => {
        allResults.push({ ...faq, category });
      });
    });

    setCategoryResults(resultsByCategory);
    setFilteredResults(allResults);
    setActiveCategory("all");
    setCurrentPage(1);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 400);
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setActiveFaq(null);
    setCurrentPage(1);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 300);
  };

  const handleFaqClick = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
    if (activeFaq !== index && faqListRef.current) {
      setTimeout(() => {
        const faqItem = faqListRef.current.querySelector(
          `[data-index="${index - indexOfFirstFaq}"]`
        );
        if (faqItem) {
          faqItem.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }, 100);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
    setCategoryResults({});
    setActiveCategory("general");
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
    setActiveFaq(null);
    if (faqListRef.current) {
      faqListRef.current.scrollTop = 0;
    }
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => prev - 1);
    setActiveFaq(null);
    if (faqListRef.current) {
      faqListRef.current.scrollTop = 0;
    }
  };

  const categories = [
    { id: "general", name: "General", icon: <FaQuestionCircle /> },
    { id: "laws", name: "Indian Laws", icon: <FaFileAlt /> },
    { id: "complaints", name: "Filing Complaints", icon: <FaShieldAlt /> },
    { id: "security", name: "Cybersecurity", icon: <FaLock /> },
    { id: "privacy", name: "Privacy & Data", icon: <FaUserSecret /> },
    { id: "contact", name: "Contact & Support", icon: <FaHeadset /> },
  ];

  const displayFaqs = isSearching
    ? activeCategory === "all"
      ? filteredResults
      : filteredResults.filter((faq) => faq.category === activeCategory)
    : faqs[activeCategory] || [];

  const indexOfLastFaq = currentPage * faqsPerPage;
  const indexOfFirstFaq = indexOfLastFaq - faqsPerPage;
  const currentFaqs = displayFaqs.slice(indexOfFirstFaq, indexOfLastFaq);
  const totalPages = Math.ceil(displayFaqs.length / faqsPerPage);

  const totalSearchResults = isSearching ? filteredResults.length : 0;

  return (
    <div className="safeguard-faq-page">
      <div className="safeguard-grid-lines"></div>

      <section className="safeguard-page-header">
        <div className="safeguard-container">
          <div className="safeguard-header-content">
            <div className="safeguard-header-brackets">
              <span className="safeguard-header-bracket left">[</span>
              <div className="safeguard-header-inner">
                <h1 className="safeguard-header-title page-title">
                  FREQUENTLY ASKED QUESTIONS
                </h1>
                <div className="safeguard-header-subtitle">
                  <span className="safeguard-typed-text">
                    Find answers to common questions about cybersecurity
                  </span>
                  <span className="safeguard-cursor">_</span>
                </div>
              </div>
              <span className="safeguard-header-bracket right">]</span>
            </div>
          </div>
        </div>
      </section>

      <section className="safeguard-faq-search">
        <div className="safeguard-container">
          <form className="safeguard-search-form" onSubmit={handleSearch}>
            <div className="safeguard-form-header">
              <span className="safeguard-form-title">SEARCH FAQ DATABASE</span>
              <span className="safeguard-form-controls">
                <span className="safeguard-form-control"></span>
                <span className="safeguard-form-control"></span>
                <span className="safeguard-form-control"></span>
              </span>
            </div>
            <div className="safeguard-search-input-wrapper">
              <div className="safeguard-search-input">
                <FaSearch className="safeguard-search-icon" />
                <input
                  type="text"
                  placeholder="Search for questions or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="safeguard-input"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch(e);
                    }
                  }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="safeguard-clear-search"
                    onClick={handleClearSearch}
                    aria-label="Clear search"
                  >
                    <FaTimes />{" "}
                    <span className="safeguard-clear-text">Clear</span>
                  </button>
                )}
              </div>
              <button type="submit" className="safeguard-search-button">
                Search Database
              </button>
            </div>
            <div className="safeguard-search-status">
              {isSearching && (
                <span className="safeguard-search-results-info">
                  Found {totalSearchResults} result(s) for "{searchQuery}" •
                  Page {currentPage} of {totalPages} •
                  <button
                    onClick={handleClearSearch}
                    className="safeguard-clear-search-link"
                  >
                    Clear Search
                  </button>
                </span>
              )}
            </div>
          </form>
        </div>
      </section>

      <section className="safeguard-faq-content">
        <div className="safeguard-container">
          {isLoading ? (
            <SkeletonPage type="default" />
          ) : (
            <div className="safeguard-faq-layout">
              <div className="safeguard-faq-categories">
                <div className="safeguard-panel-header">
                  <span className="safeguard-panel-title">FAQ CATEGORIES</span>
                  <div className="safeguard-panel-indicator"></div>
                </div>
                <ul className="safeguard-categories-list">
                  {isSearching && (
                    <li
                      className={`safeguard-category-item ${activeCategory === "all" ? "active" : ""
                        }`}
                      onClick={() => setActiveCategory("all")}
                    >
                      <span className="safeguard-category-icon">
                        <FaSearch />
                      </span>
                      <span className="safeguard-category-name">
                        All Results
                      </span>
                      <span className="safeguard-category-count">
                        {filteredResults.length}
                      </span>
                      {activeCategory === "all" && (
                        <span className="safeguard-category-active-indicator"></span>
                      )}
                    </li>
                  )}

                  {categories.map((category) => (
                    <li
                      key={category.id}
                      className={`safeguard-category-item ${activeCategory === category.id ? "active" : ""
                        }`}
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      <span className="safeguard-category-icon">
                        {category.icon}
                      </span>
                      <span className="safeguard-category-name">
                        {category.name}
                      </span>
                      {isSearching && (
                        <span className="safeguard-category-count">
                          {categoryResults[category.id] || 0}
                        </span>
                      )}
                      {activeCategory === category.id && (
                        <span className="safeguard-category-active-indicator"></span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="safeguard-faq-list">
                <div className="safeguard-panel-header">
                  <span className="safeguard-panel-title">
                    {isSearching
                      ? `SEARCH RESULTS: ${activeCategory === "all"
                        ? "ALL CATEGORIES"
                        : categories
                          .find((c) => c.id === activeCategory)
                          ?.name.toUpperCase()
                      }`
                      : `${categories
                        .find((c) => c.id === activeCategory)
                        ?.name.toUpperCase()} FAQs`}
                  </span>
                  <div className="safeguard-panel-indicator"></div>
                </div>

                {displayFaqs.length === 0 ? (
                  <div className="safeguard-no-results">
                    <div className="safeguard-error-icon">
                      <FaExclamationTriangle />
                    </div>
                    <div className="safeguard-error-code">
                      NO DATA AVAILABLE
                    </div>
                    <p>
                      No matching entries found in this category. Try a
                      different category or search term.
                    </p>
                    {isSearching && (
                      <button
                        className="safeguard-btn-secondary"
                        onClick={handleClearSearch}
                      >
                        Clear Search
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="safeguard-faq-wrapper">
                    <div className="safeguard-faq-container" ref={faqListRef}>
                      {currentFaqs.map((faq, index) => {
                        const actualIndex = indexOfFirstFaq + index;
                        return (
                          <div
                            key={actualIndex}
                            className={`safeguard-faq-item ${activeFaq === actualIndex ? "active" : ""
                              } ${animatedItems.includes(index.toString())
                                ? "animated"
                                : ""
                              }`}
                            data-index={index.toString()}
                          >
                            <div
                              className="safeguard-faq-question"
                              onClick={() => handleFaqClick(actualIndex)}
                            >
                              <h3 className="safeguard-question-text">
                                <span className="safeguard-question-index">
                                  Q{actualIndex + 1}:
                                </span>
                                {faq.question}
                              </h3>
                              <div className="safeguard-faq-toggle">
                                {activeFaq === actualIndex ? (
                                  <FaChevronDown />
                                ) : (
                                  <FaChevronRight />
                                )}
                              </div>
                            </div>

                            {activeFaq === actualIndex && (
                              <div className="safeguard-faq-answer">
                                <p
                                  dangerouslySetInnerHTML={{
                                    __html: faq.answer,
                                  }}
                                ></p>
                                {isSearching && faq.category && (
                                  <div className="safeguard-faq-category-tag">
                                    Category:{" "}
                                    {categories.find(
                                      (c) => c.id === faq.category
                                    )?.name || faq.category}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {displayFaqs.length > 0 && (
                      <div className="safeguard-pagination">
                        <div className="safeguard-pagination-info">
                          Page {currentPage} of {totalPages}
                        </div>
                        <div className="safeguard-pagination-controls">
                          <button
                            className="safeguard-pagination-button"
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            aria-label="Previous page"
                          >
                            <FaAngleLeft /> Prev
                          </button>
                          <div className="safeguard-pagination-pages">
                            {Array.from(
                              { length: Math.min(5, totalPages) },
                              (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                  pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                  pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                  pageNum = totalPages - 4 + i;
                                } else {
                                  pageNum = currentPage - 2 + i;
                                }

                                return (
                                  <button
                                    key={pageNum}
                                    className={`safeguard-page-number ${currentPage === pageNum ? "active" : ""
                                      }`}
                                    onClick={() => {
                                      setCurrentPage(pageNum);
                                      setActiveFaq(null);
                                    }}
                                  >
                                    {pageNum}
                                  </button>
                                );
                              }
                            )}
                          </div>
                          <button
                            className="safeguard-pagination-button"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            aria-label="Next page"
                          >
                            Next <FaAngleRight />
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="safeguard-results-counter">
                      Showing {indexOfFirstFaq + 1}-
                      {Math.min(indexOfLastFaq, displayFaqs.length)} of{" "}
                      {displayFaqs.length} FAQs
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="safeguard-faq-more-help">
        <div className="safeguard-container">
          <h2 className="safeguard-more-help-title">
            / ADDITIONAL SECURITY PROTOCOLS /
          </h2>
          <p className="safeguard-more-help-subtitle">
            Activate advanced security modules for enhanced protection
          </p>

          <div className="safeguard-help-options">
            <div className="safeguard-help-option">
              <div className="safeguard-option-icon">
                <FaRobot />
              </div>
              <h3 className="safeguard-option-title">AI ASSISTANT</h3>
              <p>
                Deploy AI-powered neural network for real-time security analysis
                and personalized guidance.
              </p>
              <div className="safeguard-option-button-container">
                <a href="/chatbot" className="safeguard-btn-terminal">
                  <span className="safeguard-btn-prompt">$</span> sudo start
                  chatbot
                </a>
              </div>
            </div>

            <div className="safeguard-help-option">
              <div className="safeguard-option-icon">
                <FaHeadset />
              </div>
              <h3 className="safeguard-option-title">SECURITY TEAM</h3>
              <p>
                Establish secure connection with our specialized cybersecurity
                experts for personalized assistance.
              </p>
              <div className="safeguard-option-button-container">
                <a
                  href="mailto:zerotrace@gmail.com"
                  className="safeguard-btn-terminal"
                >
                  <span className="safeguard-btn-prompt">$</span> ssh
                  secure@savdhaan.india
                </a>
              </div>
            </div>

            <div className="safeguard-help-option">
              <div className="safeguard-option-icon">
                <FaExclamationTriangle />
              </div>
              <h3 className="safeguard-option-title">INCIDENT REPORT</h3>
              <p>
                Document and track security breaches or vulnerabilities using
                our advanced reporting system.
              </p>
              <div className="safeguard-option-button-container">
                <a href="/complaint-form" className="safeguard-btn-terminal">
                  <span className="safeguard-btn-prompt">$</span> sudo report
                  incident
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FAQ;
