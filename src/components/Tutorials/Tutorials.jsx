import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  FaLock,
  FaShieldAlt,
  FaCode,
  FaUserSecret,
  FaServer,
  FaLaptopCode,
  FaPlay,
  FaSearch,
  FaTimes,
  FaFilter,
  FaAngleDown,
  FaSortAmountDown,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { tutorialData } from "./youtube.js";
import { SkeletonPage } from "../common/Skeleton/Skeleton.jsx";
import { useModal } from "../../context/ModalContext";
import "./Tutorials.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = useMemo(() => {
    const nums = [];
    const maxShow = 5;

    if (totalPages <= maxShow) {
      // If total pages is small, show all pages
      for (let i = 1; i <= totalPages; i++) nums.push(i);
    } else {
      // Always add first page
      nums.push(1);

      // Calculate the range of middle pages to show
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Special handling for when current page is near the beginning
      if (currentPage <= 3) {
        start = 2;
        end = Math.min(4, totalPages - 1);
      }

      // Special handling for when current page is near the end
      if (currentPage >= totalPages - 2) {
        start = Math.max(2, totalPages - 3);
        end = totalPages - 1;
      }

      // Add ellipsis if there's a gap after page 1
      if (start > 2) nums.push("...");

      // Add middle page numbers without duplicates
      for (let i = start; i <= end; i++) nums.push(i);

      // Add ellipsis if there's a gap before the last page
      if (end < totalPages - 1) nums.push("...");

      // Always add last page if not already included
      if (totalPages > 1) nums.push(totalPages);
    }

    return nums;
  }, [currentPage, totalPages]);

  return (
    <div className="tutorial-pagination">
      <button
        className="tutorial-pagination-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <FaChevronLeft />
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={i} className="tutorial-pagination-ellipsis">
            …
          </span>
        ) : (
          <button
            key={i} // Changed from key={p} to key={i} to avoid duplicate keys
            className={`tutorial-pagination-btn ${currentPage === p ? "active" : ""
              }`}
            onClick={() => onPageChange(p)}
            aria-current={currentPage === p ? "page" : undefined}
          >
            {p}
          </button>
        )
      )}

      <button
        className="tutorial-pagination-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <FaChevronRight />
      </button>

      <span className="tutorial-pagination-info">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
};

const Tutorials = () => {
  const { showInfo } = useModal();
  const getCategoryIcon = useCallback((cat) => {
    switch (cat) {
      case "security":
        return <FaShieldAlt className="tutorial-icon-neon" />;
      case "privacy":
        return <FaUserSecret className="tutorial-icon-neon" />;
      case "coding":
        return <FaCode className="tutorial-icon-neon" />;
      case "network":
        return <FaServer className="tutorial-icon-neon" />;
      case "hacking":
        return <FaLaptopCode className="tutorial-icon-neon" />;
      default:
        return <FaLock className="tutorial-icon-neon" />;
    }
  }, []);

  const parseDuration = useCallback((str) => {
    if (!str) return 0;
    const parts = str.split(":").map(Number);
    return parts.length === 2 ? parts[0] * 60 + parts[1] : parts[0] || 0;
  }, []);

  const sortTutorials = useCallback(
    (list, opt) => {
      const arr = [...list];
      switch (opt) {
        case "newest":
          return arr.sort((a, b) => (b.dateAdded || 0) - (a.dateAdded || 0));
        case "oldest":
          return arr.sort((a, b) => (a.dateAdded || 0) - (b.dateAdded || 0));
        case "shortest":
          return arr.sort(
            (a, b) => parseDuration(a.duration) - parseDuration(b.duration)
          );
        case "longest":
          return arr.sort(
            (a, b) => parseDuration(b.duration) - parseDuration(a.duration)
          );
        case "alphabetical":
          return arr.sort((a, b) => a.title.localeCompare(b.title));
        default:
          return arr;
      }
    },
    [parseDuration]
  );

  const [loading, setLoading] = useState(true);
  const [tutorials, setTutorials] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const filterPanelRef = useRef(null);

  useEffect(() => {
    const processed = tutorialData.map((t, i) => ({
      ...t,
      dateAdded: t.dateAdded || Date.now() - i * 86400000,
    }));
    setTutorials(sortTutorials(processed, sortOption));
    setLoading(false);
  }, [sortTutorials, sortOption]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortOption]);

  useEffect(() => {
    if (!isFilterOpen) return;

    const onClick = (e) => {
      if (
        filterPanelRef.current &&
        !filterPanelRef.current.contains(e.target) &&
        !e.target.closest(".tutorial-filter-button")
      ) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [isFilterOpen]);

  const availableCategories = useMemo(() => {
    const setCats = new Set();
    tutorialData.forEach((t) => {
      if (t.category && t.categoryName) {
        setCats.add(JSON.stringify({ id: t.category, name: t.categoryName }));
      }
    });

    return [
      { id: "all", name: "All Tutorials" },
      ...Array.from(setCats)
        .map((s) => JSON.parse(s))
        .sort((a, b) => a.name.localeCompare(b.name)),
    ];
  }, []);

  const filteredTutorials = useMemo(() => {
    return tutorials.filter((t) => {
      const byCat =
        selectedCategory === "all" || t.category === selectedCategory;
      const bySearch =
        searchQuery === "" ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());
      return byCat && bySearch;
    });
  }, [tutorials, selectedCategory, searchQuery]);

  const totalPages = Math.ceil(filteredTutorials.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentTutorials = filteredTutorials.slice(
    startIdx,
    startIdx + itemsPerPage
  );

  const handlePageChange = useCallback(
    (n) => {
      if (n < 1 || n > totalPages) return;
      setCurrentPage(n);
      window.scrollTo({
        top: document.querySelector(".tutorial-grid")?.offsetTop - 100 || 0,
        behavior: "smooth",
      });
    },
    [totalPages]
  );

  const openYouTubeLink = useCallback((url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  if (loading) return <SkeletonPage type="grid" />;

  return (
    <div className="tutorial-container">
      <header className="tutorial-page-header">
        <h1 className="tutorial-page-title page-title">
          <span className="tutorial-title-prefix">&gt;_</span> Security
          Tutorials
        </h1>
        <p className="tutorial-page-subtitle">
          Master cybersecurity with our comprehensive training modules
        </p>
      </header>

      <div className="tutorial-cyber-panel">
        <div className="tutorial-search-filter-container">
          <div className="tutorial-search-group">
            <FaSearch className="tutorial-search-icon" />
            <input
              type="text"
              placeholder="Search tutorials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="tutorial-search-input"
              aria-label="Search tutorials"
            />
            {searchQuery && (
              <button
                className="tutorial-search-clear"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                <FaTimes />
              </button>
            )}
          </div>

          <div className="tutorial-filter-group">
            <button
              className="tutorial-filter-button"
              onClick={() => setIsFilterOpen((o) => !o)}
              aria-expanded={isFilterOpen}
              aria-label="Filter tutorials"
            >
              <FaFilter /> <span>Filter</span>
              <FaAngleDown
                className={`tutorial-filter-arrow ${isFilterOpen ? "open" : ""
                  }`}
              />
            </button>

            <div className="tutorial-sort-dropdown">
              <FaSortAmountDown className="tutorial-sort-icon" />
              <select
                className="tutorial-sort-select"
                value={sortOption}
                onChange={(e) => {
                  setSortOption(e.target.value);
                  setTutorials(sortTutorials(tutorials, e.target.value));
                }}
                aria-label="Sort tutorials"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="shortest">Shortest</option>
                <option value="longest">Longest</option>
                <option value="alphabetical">A-Z</option>
              </select>
            </div>
          </div>

          {isFilterOpen && (
            <div className="tutorial-filter-panel" ref={filterPanelRef}>
              <h4 className="tutorial-filter-title">Categories</h4>
              <div className="tutorial-category-grid">
                {availableCategories.map((cat) => (
                  <button
                    key={cat.id}
                    className={`tutorial-category-pill ${selectedCategory === cat.id ? "active" : ""
                      }`}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setIsFilterOpen(false);
                    }}
                    aria-pressed={selectedCategory === cat.id}
                  >
                    {cat.id !== "all" && getCategoryIcon(cat.id)}
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="tutorial-results-summary">
        <div className="tutorial-results-count">
          <FaEye className="tutorial-results-icon" />
          <span>
            Showing {filteredTutorials.length}{" "}
            {filteredTutorials.length === 1 ? "result" : "results"}
            {selectedCategory !== "all" &&
              ` in ${availableCategories.find((c) => c.id === selectedCategory)?.name
              }`}
            {searchQuery && ` for "${searchQuery}"`}
          </span>
        </div>
        <div className="tutorial-per-page">
          <label htmlFor="tutorial-items-per-page">Show:</label>
          <select
            id="tutorial-items-per-page"
            className="tutorial-per-page-select"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(+e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={48}>48</option>
          </select>
        </div>
      </div>

      {filteredTutorials.length === 0 ? (
        <div className="tutorial-empty-state">
          <FaLaptopCode size={50} className="tutorial-empty-icon" />
          <h3 className="tutorial-empty-title">No tutorials found</h3>
          <p className="tutorial-empty-text">
            Try adjusting your search or filters
          </p>
          <button
            className="tutorial-reset-button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              showInfo("Filters Reset", "All filters have been cleared.");
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <div className="tutorial-grid">
            {currentTutorials.map((tut) => (
              <article key={tut.id} className="tutorial-card">
                <a
                  href={tut.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tutorial-image-container"
                  aria-label={`Watch ${tut.title} on YouTube`}
                >
                  <div className="tutorial-category-badge">
                    {getCategoryIcon(tut.category)}
                    <span className="tutorial-category-name">
                      {tut.categoryName}
                    </span>
                  </div>
                  <img
                    src={tut.image || "/placeholder-cyber.jpg"}
                    alt={`${tut.title} thumbnail`}
                    className="tutorial-image"
                    loading="lazy"
                  />
                  <div className="tutorial-image-overlay">
                    <div className="tutorial-play-btn">
                      <FaPlay />
                    </div>
                  </div>
                </a>

                <div className="tutorial-card-content">
                  <a
                    href={tut.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tutorial-card-title"
                  >
                    {tut.title}
                  </a>
                  <p className="tutorial-card-description">{tut.description}</p>
                  <div className="tutorial-card-meta">
                    <span className="tutorial-duration">
                      <FaPlay className="tutorial-duration-icon" />{" "}
                      {tut.duration}
                    </span>
                    <span className="tutorial-level">{tut.level}</span>
                  </div>
                  <a
                    href={tut.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tutorial-watch-btn"
                  >
                    <FaPlay className="tutorial-btn-icon" /> Watch on YouTube
                  </a>
                </div>
              </article>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Tutorials;