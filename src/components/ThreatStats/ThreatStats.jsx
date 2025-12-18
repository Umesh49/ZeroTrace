import { useState, useEffect } from 'react';
import './ThreatStats.css';
import { SkeletonPage } from '../common/Skeleton/Skeleton.jsx';
import { useModal } from '../../context/ModalContext';

const threatCategories = [
  'APT (Advanced Persistent Threat)',
  'Ransomware',
  'Zero-day Exploit',
  'Brute Force Attack',
  'SQL Injection',
  'Cross-site Scripting (XSS)',
  'DDoS',
  'Phishing',
  'Credential Stuffing',
  'Man-in-the-Middle',
  'Supply Chain Attack',
  'DNS Poisoning',
  'Cryptojacking',
  'IoT Botnet',
  'Spear Phishing',
  'Business Email Compromise',
  'Watering Hole Attack'
];

const getRecentTimeStamp = () => {
  const now = new Date();
  const randomTime = new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000);
  return randomTime;
};

const getCountryThreatAssociation = (country) => {
  const countryThreatProfiles = {
    'United States': ['Ransomware', 'APT (Advanced Persistent Threat)', 'Business Email Compromise', 'DDoS'],
    'Russia': ['APT (Advanced Persistent Threat)', 'Zero-day Exploit', 'Credential Stuffing', 'Cryptojacking'],
    'China': ['APT (Advanced Persistent Threat)', 'Supply Chain Attack', 'Man-in-the-Middle', 'IoT Botnet'],
    'North Korea': ['APT (Advanced Persistent Threat)', 'Cryptocurrency Theft', 'Watering Hole Attack'],
    'Iran': ['APT (Advanced Persistent Threat)', 'DDoS', 'Watering Hole Attack'],
    'Brazil': ['Phishing', 'Banking Trojans', 'Credential Stuffing'],
    'India': ['Phishing', 'Cryptojacking', 'SQL Injection'],
    'Vietnam': ['Spear Phishing', 'APT (Advanced Persistent Threat)', 'Cross-site Scripting (XSS)'],
    'United Kingdom': ['Phishing', 'Ransomware', 'Business Email Compromise'],
    'Germany': ['Ransomware', 'Phishing', 'Business Email Compromise'],
    'Japan': ['Supply Chain Attack', 'Phishing', 'Cross-site Scripting (XSS)'],
    'South Korea': ['DDoS', 'Ransomware', 'Spear Phishing'],
    'Australia': ['Ransomware', 'Business Email Compromise', 'DDoS'],
    'Nigeria': ['Business Email Compromise', 'Phishing', 'Credential Stuffing'],
    'Israel': ['Zero-day Exploit', 'APT (Advanced Persistent Threat)', 'Supply Chain Attack'],
    'UAE': ['Spear Phishing', 'Business Email Compromise', 'Ransomware'],
    'Singapore': ['Phishing', 'Ransomware', 'Supply Chain Attack'],
    'Netherlands': ['DDoS', 'Ransomware', 'Phishing'],
    'France': ['Ransomware', 'APT (Advanced Persistent Threat)', 'Phishing'],
    'Italy': ['Phishing', 'Ransomware', 'Credential Stuffing'],
    'Spain': ['Phishing', 'Ransomware', 'SQL Injection'],
    'Turkey': ['DDoS', 'Phishing', 'Cross-site Scripting (XSS)'],
    'Indonesia': ['Phishing', 'Cryptojacking', 'IoT Botnet'],
    'Malaysia': ['Phishing', 'Business Email Compromise', 'Cross-site Scripting (XSS)'],
    'Mexico': ['Ransomware', 'Phishing', 'Business Email Compromise']
  };

  const profile = countryThreatProfiles[country];
  if (profile) {
    const numCategories = Math.floor(Math.random() * 3) + 1;
    return profile.slice(0, numCategories).join(', ');
  }

  const numCategories = Math.floor(Math.random() * 2) + 1;
  const randomCategories = [];
  for (let i = 0; i < numCategories; i++) {
    const randomCat = threatCategories[Math.floor(Math.random() * threatCategories.length)];
    if (!randomCategories.includes(randomCat)) {
      randomCategories.push(randomCat);
    }
  }
  return randomCategories.join(', ');
};

const generateThreatCount = (country) => {
  const highThreatCountries = ['United States', 'China', 'Russia', 'Brazil', 'India', 'Germany', 'United Kingdom'];
  const moderateThreatCountries = ['Japan', 'France', 'Canada', 'South Korea', 'Australia', 'Italy', 'Spain', 'Netherlands', 'Turkey'];

  let baseCount;
  if (highThreatCountries.includes(country)) {
    baseCount = 150 + Math.floor(Math.random() * 350);
  } else if (moderateThreatCountries.includes(country)) {
    baseCount = 70 + Math.floor(Math.random() * 130);
  } else {
    baseCount = 20 + Math.floor(Math.random() * 80);
  }

  if (Math.random() < 0.1) {
    baseCount = baseCount * (1 + Math.random());
  }

  return Math.floor(baseCount);
};

const generateSeverityDistribution = (threatCount) => {
  const highSeverityPct = 0.15 + (Math.random() * 0.25);
  const mediumSeverityPct = 0.4 + (Math.random() * 0.3);
  const highSeverity = Math.floor(threatCount * highSeverityPct);
  const mediumSeverity = Math.floor(threatCount * mediumSeverityPct);
  const lowSeverity = threatCount - highSeverity - mediumSeverity;
  return { highSeverity, mediumSeverity, lowSeverity };
};

const generateConfidenceScore = (country, categories) => {
  let baseConfidence = 65 + Math.floor(Math.random() * 20);
  if (categories.includes('APT')) {
    baseConfidence -= Math.floor(Math.random() * 10);
  }
  if (categories.includes('Ransomware')) {
    baseConfidence += Math.floor(Math.random() * 7);
  }
  return Math.min(95, Math.max(45, baseConfidence));
};

const generateIPDetails = (count, country) => {
  const details = [];
  const countryIPRanges = {
    'United States': ['104.', '107.', '23.', '64.', '65.', '70.', '96.', '97.', '98.', '75.', '76.', '99.'],
    'China': ['1.', '14.', '27.', '36.', '39.', '42.', '58.', '101.', '103.', '106.', '111.', '113.', '115.', '117.', '119.', '153.', '171.', '175.', '180.', '182.', '202.', '218.', '220.', '221.', '222.', '223.'],
    'Russia': ['2.', '5.', '31.', '37.', '46.', '62.', '78.', '79.', '80.', '81.', '82.', '83.', '84.', '85.', '87.', '88.', '93.', '94.', '95.', '109.', '176.', '178.', '185.', '188.', '195.', '212.', '213.', '217.'],
    'Brazil': ['143.', '152.', '170.', '177.', '179.', '186.', '187.', '189.', '191.', '200.', '201.', '207.', '208.', '216.', '219.'],
    'India': ['43.', '45.', '49.', '59.', '61.', '101.', '103.', '104.', '106.', '111.', '112.', '113.', '115.', '116.', '117.', '169.', '175.', '180.', '182.', '202.', '203.', '219.', '220.', '223.'],
    'Japan': ['43.', '60.', '61.', '114.', '118.', '119.', '121.', '124.', '125.', '126.', '150.', '153.', '157.', '160.', '163.', '210.', '219.'],
    'Germany': ['2.', '3.', '17.', '46.', '78.', '80.', '81.', '84.', '85.', '88.', '89.', '93.', '136.', '138.', '143.', '158.', '178.', '188.', '193.', '195.', '213.', '217.'],
    'United Kingdom': ['2.', '5.', '31.', '51.', '62.', '77.', '78.', '79.', '80.', '81.', '82.', '83.', '84.', '85.', '86.', '87.', '88.', '89.', '90.', '149.', '151.', '176.', '178.', '185.', '188.', '195.', '212.', '213.']
  };
  const defaultRanges = ['13.', '34.', '52.', '104.', '192.', '200.', '172.', '191.'];
  const ipRanges = countryIPRanges[country] || defaultRanges;

  for (let i = 0; i < count; i++) {
    const timestamp = getRecentTimeStamp();
    const range = ipRanges[Math.floor(Math.random() * ipRanges.length)];
    const ip = `${range}${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
    details.push({ ip, timestamp });
  }

  return details;
};

const fetchCountryThreatStats = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const countries = [
        'United States', 'China', 'Russia', 'Brazil', 'India', 'Germany',
        'United Kingdom', 'Japan', 'France', 'Canada', 'South Korea', 'Australia',
        'Italy', 'Spain', 'Netherlands', 'Turkey', 'Indonesia', 'Mexico',
        'Vietnam', 'Saudi Arabia', 'Singapore', 'Israel', 'Ukraine', 'North Korea', 'Iran'
      ];

      const countryCount = 15 + Math.floor(Math.random() * 10);
      const selectedCountries = [];
      const keyCountries = ['United States', 'China', 'Russia', 'North Korea', 'Iran'];

      keyCountries.forEach(country => {
        if (countries.includes(country)) {
          selectedCountries.push(country);
        }
      });

      while (selectedCountries.length < countryCount) {
        const country = countries[Math.floor(Math.random() * countries.length)];
        if (!selectedCountries.includes(country)) {
          selectedCountries.push(country);
        }
      }

      const mockStats = selectedCountries.map(country => {
        const threatCount = generateThreatCount(country);
        const { highSeverity, mediumSeverity, lowSeverity } = generateSeverityDistribution(threatCount);
        const categories = getCountryThreatAssociation(country);
        const avgConfidence = generateConfidenceScore(country, categories);
        const totalReports = threatCount * (2 + Math.floor(Math.random() * 5));
        const ipDetails = generateIPDetails(Math.min(10, threatCount), country);

        return {
          country,
          threatCount,
          highSeverity,
          mediumSeverity,
          lowSeverity,
          categories,
          avgConfidence,
          totalReports,
          ipDetails,
          lastUpdated: getRecentTimeStamp()
        };
      });

      mockStats.sort((a, b) => b.threatCount - a.threatCount);
      resolve(mockStats);
    }, 1000);
  });
};

const ThreatStats = () => {
  const [countries, setCountries] = useState([]);
  const [stats, setStats] = useState({ active: 0, topCategory: 'Unknown', today: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [refreshTime, setRefreshTime] = useState(new Date());
  const { showError, showInfo } = useModal();

  const fetchThreats = async () => {
    setLoading(true);
    try {
      const countryData = await fetchCountryThreatStats();
      setCountries(countryData);
      setStats(calculateStats(countryData));
      setRefreshTime(new Date());
      setLoading(false);
    } catch (err) {
      const msg = 'Failed to load threat data. Network connection issue detected.';
      setError(msg);
      showError('Connection Failed', msg);
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const active = data.reduce((sum, c) => sum + c.threatCount, 0);

    const allCategories = [];
    data.forEach(country => {
      const cats = country.categories.split(', ');
      cats.forEach(cat => allCategories.push(cat));
    });

    const categoryCount = {};
    allCategories.forEach(cat => {
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });

    let topCategory = 'Unknown';
    let maxCount = 0;

    Object.entries(categoryCount).forEach(([cat, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topCategory = cat;
      }
    });

    const todayMultiplier = 0.8 + (Math.random() * 0.4);
    const today = Math.floor(active * todayMultiplier);

    return { active, topCategory, today };
  };

  useEffect(() => {
    fetchThreats();

    const intervalId = setInterval(() => {
      fetchThreats();
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleCountryClick = (country) => {
    setSelectedCountry(country === selectedCountry ? null : country);
  };

  const SeverityBadge = ({ count, type }) => count > 0 && (
    <span className={`threat-map-severity-badge ${type}`}>
      {count} {type}
    </span>
  );

  const DetailView = ({ country }) => {
    if (!country) return null;

    const countryData = countries.find(c => c.country === country);
    if (!countryData) return null;

    return (
      <div className="threat-map-detail-view">
        <div className="threat-map-detail-header">
          <h3>{countryData.country} Threat Details</h3>
          <button className="threat-map-close-button" onClick={() => setSelectedCountry(null)}>×</button>
        </div>

        <div className="threat-map-detail-stats">
          <div className="threat-map-detail-stat">
            <span className="threat-map-detail-label">Active Threats:</span>
            <span className="threat-map-detail-value">{countryData.threatCount.toLocaleString()}</span>
          </div>
          <div className="threat-map-detail-stat">
            <span className="threat-map-detail-label">Categories:</span>
            <span className="threat-map-detail-value">{countryData.categories}</span>
          </div>
          <div className="threat-map-detail-stat">
            <span className="threat-map-detail-label">Average Confidence:</span>
            <span className={`threat-map-detail-value threat-map-confidence-value ${countryData.avgConfidence > 75 ? 'high' : countryData.avgConfidence > 50 ? 'medium' : 'low'
              }`}>
              {countryData.avgConfidence}%
            </span>
          </div>
          <div className="threat-map-detail-stat">
            <span className="threat-map-detail-label">Last Updated:</span>
            <span className="threat-map-detail-value">{formatTime(countryData.lastUpdated)}</span>
          </div>
        </div>

        <div className="threat-map-severity-distribution">
          <h4>Threat Severity Distribution</h4>
          <div className="threat-map-severity-bars">
            <div className="threat-map-severity-bar high" style={{ width: `${(countryData.highSeverity / countryData.threatCount) * 100}%` }}>
              {Math.round((countryData.highSeverity / countryData.threatCount) * 100)}%
            </div>
            <div className="threat-map-severity-bar medium" style={{ width: `${(countryData.mediumSeverity / countryData.threatCount) * 100}%` }}>
              {Math.round((countryData.mediumSeverity / countryData.threatCount) * 100)}%
            </div>
            <div className="threat-map-severity-bar low" style={{ width: `${(countryData.lowSeverity / countryData.threatCount) * 100}%` }}>
              {Math.round((countryData.lowSeverity / countryData.threatCount) * 100)}%
            </div>
          </div>
          <div className="threat-map-severity-legend">
            <div className="threat-map-legend-item">
              <span className="threat-map-legend-color high"></span>
              <span className="threat-map-legend-text">High ({countryData.highSeverity})</span>
            </div>
            <div className="threat-map-legend-item">
              <span className="threat-map-legend-color medium"></span>
              <span className="threat-map-legend-text">Medium ({countryData.mediumSeverity})</span>
            </div>
            <div className="threat-map-legend-item">
              <span className="threat-map-legend-color low"></span>
              <span className="threat-map-legend-text">Low ({countryData.lowSeverity})</span>
            </div>
          </div>
        </div>

        <div className="threat-map-recent-activity">
          <h4>Recent Activity</h4>
          <table className="threat-map-activity-table">
            <thead>
              <tr>
                <th>IP Address</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {countryData.ipDetails.slice(0, 5).map((detail, index) => (
                <tr key={index}>
                  <td>{detail.ip}</td>
                  <td>{formatTime(detail.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (loading) return <SkeletonPage type="default" />;

  if (error) return (
    <div className="threat-map-error-container">
      <div className="threat-map-error-icon">!</div>
      <p>{error}</p>
      <button onClick={() => {
        showInfo("Retrying", "Attempting to reconnect...");
        fetchThreats();
      }} className="threat-map-retry-button">Retry Connection</button>
    </div>
  );

  return (
    <div className="threat-map-grid-wrapper">
      <div className="threat-map-grid-header">
        <h1 className="threat-map-grid-title page-title">Global Threat Map</h1>
        <p className="threat-map-grid-subtitle">Real-time threat monitoring and analysis</p>
      </div>

      <div className="threat-map-stats-container">
        <div className="threat-map-stat-card">
          <h3 className="threat-map-stat-title">Active Threats</h3>
          <p className="threat-map-stat-value">{stats.active.toLocaleString()}</p>
        </div>
        <div className="threat-map-stat-card">
          <h3 className="threat-map-stat-title">Top Threat Category</h3>
          <p className="threat-map-stat-value threat-map-category-value">{stats.topCategory}</p>
        </div>
        <div className="threat-map-stat-card">
          <h3 className="threat-map-stat-title">Threats Today</h3>
          <p className="threat-map-stat-value">{stats.today.toLocaleString()}</p>
        </div>
      </div>

      <div className="threat-map-grid-container">
        <table className="threat-map-threat-table">
          <thead>
            <tr>
              <th>Country</th>
              <th>Threats</th>
              <th className="threat-map-hide-mobile">Severity</th>
              <th className="threat-map-hide-tablet">Categories</th>
              <th className="threat-map-hide-mobile">Confidence</th>
              <th className="threat-map-hide-tablet">Reports</th>
            </tr>
          </thead>
          <tbody>
            {countries.map(c => (
              <tr key={c.country} onClick={() => handleCountryClick(c.country)} className={selectedCountry === c.country ? 'threat-map-selected-row' : ''}>
                <td className="threat-map-country-cell">{c.country}</td>
                <td>{c.threatCount.toLocaleString()}</td>
                <td className="threat-map-hide-mobile threat-map-severity-cell">
                  <SeverityBadge count={c.highSeverity} type="high" />
                  <SeverityBadge count={c.mediumSeverity} type="medium" />
                  <SeverityBadge count={c.lowSeverity} type="low" />
                </td>
                <td className="threat-map-hide-tablet threat-map-category-cell">{c.categories}</td>
                <td className="threat-map-hide-mobile threat-map-confidence-cell">
                  <span className={`threat-map-confidence-value ${c.avgConfidence > 75 ? 'high' : c.avgConfidence > 50 ? 'medium' : 'low'
                    }`}>
                    {c.avgConfidence}%
                  </span>
                </td>
                <td className="threat-map-hide-tablet">{c.totalReports.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedCountry && <DetailView country={selectedCountry} />}

      <div className="threat-map-grid-footer">
        <div>Last updated: {formatDate(refreshTime)} {formatTime(refreshTime)}</div>
        <div>Monitoring {countries.length} countries with active threats</div>
      </div>
    </div>
  );
};

export default ThreatStats;