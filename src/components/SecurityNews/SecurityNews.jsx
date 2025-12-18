import { useState, useEffect } from "react"
import "./SecurityNews.css"

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2z" />
  </svg>
)

const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path
      fillRule="evenodd"
      d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
    />
  </svg>
)

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path
      fillRule="evenodd"
      d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
    />
  </svg>
)

const NewsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    fill="currentColor"
    viewBox="0 0 16 16"
    className="news-empty-icon"
  >
    <path d="M0 2.5A1.5 1.5 0 0 1 1.5 1h11A1.5 1.5 0 0 1 14 2.5v10.528c0 .3-.05.654-.238.972h.738a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 1 1 0v9a1.5 1.5 0 0 1-1.5 1.5H1.497A1.497 1.497 0 0 1 0 13.5v-11zM12 14c.37 0 .654-.211.853-.441.092-.106.147-.279.147-.531V2.5a.5.5 0 0 0-.5-.5h-11a.5.5 0 0 0-.5.5v11c0 .278.223.5.497.5H12z" />
    <path d="M2 3h10v2H2V3zm0 3h4v3H2V6zm0 4h4v1H2v-1zm0 2h4v1H2v-1zm5-6h2v1H7V6zm3 0h2v1h-2V6zM7 8h2v1H7V8zm3 0h2v1h-2V8zm-3 2h2v1H7v-1zm3 0h2v1h-2v-1zm-3 2h2v1H7v-1zm3 0h2v1h-2v-1z" />
  </svg>
)

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
    <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
  </svg>
)

function SecurityNews() {
  const [allNews, setAllNews] = useState([])
  const [displayedNews, setDisplayedNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [activeFilter, setActiveFilter] = useState("latest")
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    const fetchSecurityNews = async () => {
      setLoading(true)
      setError(null)

      try {
        try {
          const response = await fetch(
            "https://api.rss2json.com/v1/api.json?rss_url=https://feeds.feedburner.com/TheHackersNews",
          )

          if (response.ok) {
            const data = await response.json()
            if (data.items && data.items.length > 0) {
              const formattedNews = data.items.map((item) => ({
                date: new Date(item.pubDate).toLocaleDateString(),
                title: item.title,
                description: item.description.replace(/<[^>]*>?/gm, "").substring(0, 150) + "...",
                link: item.link,
                thumbnail: item.thumbnail || "/placeholder.svg?height=80&width=80",
                pubDate: new Date(item.pubDate),
              }))

              setAllNews(formattedNews)
              setDisplayedNews(formattedNews)
              setLoading(false)
              return
            }
          }
          throw new Error("API failed")
        } catch (error) {
          console.error("Failed to fetch security news:", error)

          const mockNews = generateMockNews()
          setAllNews(mockNews)
          setDisplayedNews(mockNews)
          setLoading(false)
        }
      } catch (error) {
        console.error("Error fetching news:", error)
        setError("Failed to load security news. Please try again later.")
        setLoading(false)
      }
    }

    fetchSecurityNews()
  }, [])

  const generateMockNews = () => {
    const mockNewsItems = [
      {
        date: "April 15, 2025",
        title: "Critical Windows Vulnerability Discovered",
        description:
          "Security researchers have identified a zero-day vulnerability affecting Windows systems. The exploit allows attackers to gain system-level privileges.",
        link: "/news/windows-vulnerability",
        thumbnail: "/placeholder.svg?height=80&width=80",
        pubDate: new Date(2025, 3, 15),
      },
      {
        date: "April 12, 2025",
        title: "New Phishing Campaign Targets Banking Users",
        description:
          "A sophisticated phishing operation is underway, using fake bank emails to steal credentials and financial information from unsuspecting victims.",
        link: "/news/banking-phishing",
        thumbnail: "/placeholder.svg?height=80&width=80",
        pubDate: new Date(2025, 3, 12),
      },
      {
        date: "April 10, 2025",
        title: "Major Data Breach Affects 1.5M Users",
        description:
          "A popular online service has disclosed a data breach affecting approximately 1.5 million user accounts. The stolen data includes emails and hashed passwords.",
        link: "/news/major-data-breach",
        thumbnail: "/placeholder.svg?height=80&width=80",
        pubDate: new Date(2025, 3, 10),
      },
      {
        date: "April 8, 2025",
        title: "Ransomware Attack Shuts Down Hospital Network",
        description:
          "A major hospital network has been forced to divert patients after a ransomware attack encrypted critical systems. IT teams are working to restore services.",
        link: "/news/hospital-ransomware",
        thumbnail: "/placeholder.svg?height=80&width=80",
        pubDate: new Date(2025, 3, 8),
      },
      {
        date: "April 5, 2025",
        title: "New AI-Powered Security Tool Detects Zero-Day Threats",
        description:
          "A cybersecurity firm has released an AI-powered tool that can detect previously unknown threats by analyzing patterns in network traffic and system behavior.",
        link: "/news/ai-security-tool",
        thumbnail: "/placeholder.svg?height=80&width=80",
        pubDate: new Date(2025, 3, 5),
      },
      {
        date: "April 3, 2025",
        title: "Critical Vulnerability in Popular IoT Devices",
        description:
          "Researchers have discovered a critical vulnerability affecting millions of IoT devices. The flaw could allow attackers to remotely control affected devices.",
        link: "/news/iot-vulnerability",
        thumbnail: "/placeholder.svg?height=80&width=80",
        pubDate: new Date(2025, 3, 3),
      },
      {
        date: "April 1, 2025",
        title: "Government Issues Advisory on State-Sponsored Attacks",
        description:
          "The cybersecurity agency has issued an advisory warning about increased state-sponsored cyber attacks targeting critical infrastructure and government systems.",
        link: "/news/government-advisory",
        thumbnail: "/placeholder.svg?height=80&width=80",
        pubDate: new Date(2025, 3, 1),
      },
      {
        date: "March 29, 2025",
        title: "New Malware Strain Targets Cryptocurrency Wallets",
        description:
          "A new malware strain has been discovered that specifically targets cryptocurrency wallets. The malware can modify wallet addresses during transactions.",
        link: "/news/crypto-malware",
        thumbnail: "/placeholder.svg?height=80&width=80",
        pubDate: new Date(2025, 2, 29),
      },
      {
        date: "March 27, 2025",
        title: "Security Researchers Discover Bluetooth Vulnerability",
        description:
          "Security researchers have identified a vulnerability in Bluetooth protocol that could allow attackers to intercept and modify data transmitted between devices.",
        link: "/news/bluetooth-vulnerability",
        thumbnail: "/placeholder.svg?height=80&width=80",
        pubDate: new Date(2025, 2, 27),
      },
      {
        date: "March 25, 2025",
        title: "Major Browser Update Patches Critical Security Flaws",
        description:
          "A popular web browser has released an emergency update to patch multiple critical security vulnerabilities that could allow remote code execution.",
        link: "/news/browser-security-update",
        thumbnail: "/placeholder.svg?height=80&width=80",
        pubDate: new Date(2025, 2, 25),
      },
      {
        date: "March 22, 2025",
        title: "New Legislation Requires Improved Cybersecurity Standards",
        description:
          "Lawmakers have passed new legislation requiring companies to implement stronger cybersecurity measures and report breaches within 48 hours.",
        link: "/news/cybersecurity-legislation",
        thumbnail: "/placeholder.svg?height=80&width=80",
        pubDate: new Date(2025, 2, 22),
      },
      {
        date: "March 20, 2025",
        title: "Supply Chain Attack Affects Software Developers",
        description:
          "A sophisticated supply chain attack has compromised a popular development tool, potentially affecting thousands of software projects worldwide.",
        link: "/news/supply-chain-attack",
        thumbnail: "/placeholder.svg?height=80&width=80",
        pubDate: new Date(2025, 2, 20),
      },
      {
        date: "March 18, 2025",
        title: "New Encryption Standard Announced",
        description:
          "A new encryption standard has been announced that promises to be quantum-resistant, protecting data against future quantum computing attacks.",
        link: "/news/encryption-standard",
        thumbnail: "/placeholder.svg?height=80&width=80",
        pubDate: new Date(2025, 2, 18),
      },
      {
        date: "March 15, 2025",
        title: "Mobile Banking Trojan Steals Two-Factor Authentication Codes",
        description:
          "A sophisticated mobile banking trojan has been discovered that can intercept SMS messages to steal two-factor authentication codes.",
        link: "/news/mobile-banking-trojan",
        thumbnail: "/placeholder.svg?height=80&width=80",
        pubDate: new Date(2025, 2, 15),
      },
      {
        date: "March 12, 2025",
        title: "Cloud Service Provider Reports Attempted Breach",
        description:
          "A major cloud service provider has reported an attempted breach of their systems. The company states that no customer data was compromised.",
        link: "/news/cloud-provider-breach",
        thumbnail: "/placeholder.svg?height=80&width=80",
        pubDate: new Date(2025, 2, 12),
      },
    ]

    return mockNewsItems
  }

  useEffect(() => {
    const filtered = [...allNews]

    switch (activeFilter) {
      case "latest":
        filtered.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
        break
      case "oldest":
        filtered.sort((a, b) => new Date(a.pubDate) - new Date(b.pubDate))
        break
      case "alphabetical":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      default:
        break
    }

    setDisplayedNews(filtered)
  }, [activeFilter, allNews])

  const getCurrentPageNews = () => {
    return displayedNews
  }

  const handleFilterSelect = (filter) => {
    setActiveFilter(filter)
    setShowFilterMenu(false)
  }

  const handleRefresh = () => {
    setLoading(true)
    setError(null)

    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  const loadMoreNews = async () => {
    setLoadingMore(true)

    try {
      setTimeout(() => {
        const lastNewsDate = allNews.length > 0 ? new Date(allNews[allNews.length - 1].pubDate) : new Date()

        const olderDate = new Date(lastNewsDate)
        olderDate.setDate(olderDate.getDate() - 7)

        const moreNews = generateMoreMockNews(olderDate, 8)

        if (moreNews.length === 0) {
          setHasMore(false)
        } else {
          setAllNews((prevNews) => [...prevNews, ...moreNews])
          setDisplayedNews((prevNews) => [...prevNews, ...moreNews])
        }

        setLoadingMore(false)
      }, 1500)
    } catch (error) {
      console.error("Error loading more news:", error)
      setLoadingMore(false)
    }
  }

  const generateMoreMockNews = (startDate, count) => {
    const mockNewsItems = []
    const topics = [
      "Vulnerability",
      "Data Breach",
      "Ransomware",
      "Phishing",
      "Zero-Day",
      "Malware",
      "Security Update",
      "Cyber Attack",
    ]

    const companies = [
      "Microsoft",
      "Google",
      "Apple",
      "Amazon",
      "Facebook",
      "Twitter",
      "LinkedIn",
      "GitHub",
      "Cisco",
      "Intel",
    ]

    for (let i = 0; i < count; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() - i)

      const topic = topics[Math.floor(Math.random() * topics.length)]
      const company = companies[Math.floor(Math.random() * companies.length)]

      mockNewsItems.push({
        date: date.toLocaleDateString(),
        title: `New ${topic} Affects ${company} Systems`,
        description: `Security researchers have discovered a new ${topic.toLowerCase()} that impacts ${company} systems. Users are advised to update their software immediately to protect against potential exploits.`,
        link: `/news/${topic.toLowerCase()}-${company.toLowerCase()}`,
        thumbnail: "/placeholder.svg?height=80&width=80",
        pubDate: date,
      })
    }

    return mockNewsItems
  }

  return (
    <div className="news-page">
      <div className="security-news-container">
        <div className="news-page-header">
          <h1 className="news-page-title page-title">Security News</h1>
          <p className="news-page-subtitle">Latest cybersecurity news and updates</p>
        </div>

        <div className="news-page-content">
          <div className="news-filter-bar">
            <div className="news-filter-dropdown">
              <button className="news-filter-button" onClick={() => setShowFilterMenu(!showFilterMenu)}>
                <FilterIcon /> Sort by: {activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}
              </button>

              {showFilterMenu && (
                <div className="news-filter-menu">
                  <div
                    className={`news-filter-item ${activeFilter === "latest" ? "active" : ""}`}
                    onClick={() => handleFilterSelect("latest")}
                  >
                    Latest First
                  </div>
                  <div
                    className={`news-filter-item ${activeFilter === "oldest" ? "active" : ""}`}
                    onClick={() => handleFilterSelect("oldest")}
                  >
                    Oldest First
                  </div>
                  <div
                    className={`news-filter-item ${activeFilter === "alphabetical" ? "active" : ""}`}
                    onClick={() => handleFilterSelect("alphabetical")}
                  >
                    Alphabetical
                  </div>
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="news-loading">
              <div className="news-spinner"></div>
              <p>Loading security news...</p>
            </div>
          ) : error ? (
            <div className="news-empty-state">
              <NewsIcon />
              <h3 className="news-empty-title">Error Loading News</h3>
              <p className="news-empty-message">{error}</p>
              <button className="news-refresh-button" onClick={handleRefresh}>
                <RefreshIcon /> Try Again
              </button>
            </div>
          ) : displayedNews.length === 0 ? (
            <div className="news-empty-state">
              <NewsIcon />
              <h3 className="news-empty-title">No News Found</h3>
              <p className="news-empty-message">
                No security news matching your search criteria were found. Try adjusting your search terms or filters.
              </p>
              <button className="news-refresh-button" onClick={handleRefresh}>
                <RefreshIcon /> Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="news-grid">
                {getCurrentPageNews().map((item, index) => (
                  <div className="news-card" key={index}>
                    <div className="news-content">
                      <div className="news-date">{item.date}</div>
                      <h3 className="news-title">{item.title}</h3>
                      <p className="news-description">{item.description}</p>
                      <a href={item.link} className="news-link">
                        Read Full Article
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {displayedNews.length > 0 && (
                <div className="news-pagination">
                  {hasMore ? (
                    <button
                      className="news-pagination-button load-more-button"
                      onClick={loadMoreNews}
                      disabled={loadingMore}
                    >
                      {loadingMore ? (
                        <>
                          <div className="news-spinner-small"></div> Loading More...
                        </>
                      ) : (
                        <>Load More News</>
                      )}
                    </button>
                  ) : (
                    <span className="news-pagination-info">No more news to load</span>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default SecurityNews