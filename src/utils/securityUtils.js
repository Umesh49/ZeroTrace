import QRCode from "qrcode";
import { zxcvbn } from "@zxcvbn-ts/core";

import sha1 from "js-sha1";

export const generateQRCode = async (text) => {
  if (!text) return null;

  try {
    return await QRCode.toDataURL(text, {
      errorCorrectionLevel: "H",
      margin: 1,
      width: 200,
    });
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw error;
  }
};

export const lookupIPGeolocation = async (ipAddress) => {
  try {
    let targetIp = ipAddress;

    if (!targetIp) {
      const ipifyResponse = await fetch("https://api.ipify.org?format=json");
      const ipifyData = await ipifyResponse.json();
      targetIp = ipifyData.ip;
    }

    const geoResponse = await fetch(`https://ipapi.co/${targetIp}/json/`);
    const geoData = await geoResponse.json();

    return {
      ip: targetIp,
      city: geoData.city || null,
      region: geoData.region || null,
      country: geoData.country_name || null,
      countryCode: geoData.country || null,
      lat: geoData.latitude || null,
      lon: geoData.longitude || null,
      timezone: geoData.timezone || null,
      isp: geoData.org || null,
      org: geoData.org || null,
      as: geoData.asn || null,
    };
  } catch (error) {
    console.error("Error in IP geolocation lookup:", error.message || error);
    throw error;
  }
};

export const testDnsLeak = async () => {
  try {
    const ipData = await testIpLeak();
    const webRtcData = await testWebRtcLeak();

    const allIps = new Set([
      ...ipData.ipAddresses,
      ...(webRtcData.supported ? webRtcData.ips : []),
    ]);

    const servers = [];

    if (ipData.details?.length) {
      ipData.details.forEach((detail) => {
        if (!detail.error) {
          servers.push({
            ip: detail.ip,
            isp: detail.isp || "Unknown",
            country: detail.country || "Unknown",
            type: detail.source,
          });
        }
      });
    }

    if (webRtcData.supported && webRtcData.ips.length) {
      webRtcData.ips.forEach((ip) => {
        if (!servers.some((s) => s.ip === ip)) {
          servers.push({
            ip,
            isp: "WebRTC Exposed",
            country: "Unknown",
            type: "WebRTC",
          });
        }
      });
    }

    return {
      ip: servers[0]?.ip || "Unknown",
      servers,
      isLeaking: allIps.size > 1,
    };
  } catch (error) {
    console.error("Error testing DNS leak:", error);
    throw error;
  }
};

export const testWebRtcLeak = async () => {
  return new Promise((resolve, reject) => {
    try {
      if (typeof RTCPeerConnection === "undefined") {
        return resolve({
          supported: false,
          message: "WebRTC is not supported in this browser",
          ips: [],
        });
      }

      const ips = new Set();
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      const timeoutId = setTimeout(() => {
        pc.close();
        resolve({
          supported: true,
          ips: Array.from(ips),
          isLeaking: ips.size > 0,
        });
      }, 3000);

      pc.onicecandidate = (event) => {
        if (!event.candidate) {
          clearTimeout(timeoutId);
          pc.close();
          resolve({
            supported: true,
            ips: Array.from(ips),
            isLeaking: ips.size > 0,
          });
          return;
        }

        const match = /([0-9]{1,3}(\.[0-9]{1,3}){3})/.exec(
          event.candidate.candidate
        );
        if (match) {
          const ip = match[1];
          if (
            !/^192\.168\./.test(ip) &&
            !/^10\./.test(ip) &&
            !/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ip) &&
            !/^127\./.test(ip)
          ) {
            ips.add(ip);
          }
        }
      };

      pc.createDataChannel("");
      pc.createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .catch((err) => {
          clearTimeout(timeoutId);
          pc.close();
          reject(err);
        });
    } catch (error) {
      console.error("Error testing WebRTC leak:", error);
      reject(error);
    }
  });
};

export const testIpLeak = async () => {
  try {
    const services = [
      {
        name: "ipify",
        url: "https://api.ipify.org?format=json",
        parser: (data) => ({ ip: data.ip }),
      },
      {
        name: "ipinfo.io",
        url: "https://ipinfo.io/json",
        parser: (data) => ({
          ip: data.ip,
          isp: data.org,
          country: data.country,
          city: data.city,
        }),
      },
      {
        name: "cloudflare",
        url: "https://cloudflare.com/cdn-cgi/trace",
        parser: (data) => {
          const parsed = {};
          data.split("\n").forEach((line) => {
            const [key, value] = line.split("=");
            if (key && value) parsed[key.trim()] = value.trim();
          });
          return { ip: parsed.ip };
        },
      },
    ];

    const results = await Promise.all(
      services.map(async (service) => {
        try {
          const response = await fetch(service.url);
          const rawData =
            service.name === "cloudflare"
              ? await response.text()
              : await response.json();
          const parsed = service.parser(rawData);
          return { source: service.name, ...parsed, error: false };
        } catch (err) {
          return { source: service.name, error: true, message: err.message };
        }
      })
    );

    const validResults = results.filter((r) => !r.error);
    const ips = new Set(validResults.map((r) => r.ip));

    return {
      ipAddresses: Array.from(ips),
      details: results,
      isLeaking: ips.size > 1,
    };
  } catch (error) {
    console.error("Error testing IP leak:", error);
    throw error;
  }
};

export const checkUrlSafety = async (url) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const urlObj = new URL(url);
    const domain = urlObj.hostname.toLowerCase();

    const analysis = analyzeUrlClientSide(url, domain, urlObj);

    return {
      url: url,
      isSafe: analysis.isSafe,
      threatType: !analysis.isSafe ? analysis.threatType : null,
      details: !analysis.isSafe ? analysis.details : [],
      lastChecked: new Date().toISOString(),
      isDemo: true,
    };
  } catch (error) {
    console.error("Error checking URL safety:", error);
    return {
      url: url,
      isSafe: false,
      threatType: "error",
      details: ["Invalid URL format or processing error"],
      lastChecked: new Date().toISOString(),
      isDemo: true,
    };
  }
};

const analyzeUrlClientSide = (url, domain, urlObj) => {
  const knownMaliciousDomains = [
    "malware-test.com",
    "phishing-example.com",
    "suspicious-site.net",
    "malicious.website",
    "virus-download.com",
    "fake-bank.com",
    "trojanhost.net",
    "ransomware.download",
    "spyware.site",
  ];

  const suspiciousTlds = [".tk", ".ml", ".ga", ".cf", ".gq", ".top", ".xyz"];

  const suspiciousPatterns = [
    /login.*\.php/i,
    /^https?:\/\/\d+\.\d+\.\d+\.\d+/i,
    /free.*download/i,
    /win.*prize/i,
    /password.*reset/i,
    /verify.*account/i,
    /bank.*login/i,
    /paypal.*secure/i,
    /free.*iphone/i,
    /dating.*meet/i,
  ];

  const suspiciousParams = [
    "password",
    "ssn",
    "cc",
    "creditcard",
    "credit-card",
    "banking",
  ];

  let isSafe = true;
  let threatType = null;
  let details = [];

  if (knownMaliciousDomains.some((bad) => domain.includes(bad))) {
    isSafe = false;
    threatType = "known_malicious";
    details.push("Domain appears in known malicious domain list");
  }

  if (suspiciousTlds.some((tld) => domain.endsWith(tld))) {
    if (isSafe) {
      details.push("Domain uses potentially high-risk TLD");
    }
  }

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(url)) {
      isSafe = false;
      threatType = threatType || "suspicious_pattern";
      details.push("URL matches suspicious pattern");
      break;
    }
  }

  const urlParams = new URLSearchParams(urlObj.search);
  for (const param of suspiciousParams) {
    if (urlParams.has(param)) {
      isSafe = false;
      threatType = threatType || "data_harvesting";
      details.push("URL contains suspicious query parameters");
      break;
    }
  }

  if (domain.length > 40) {
    isSafe = false;
    threatType = threatType || "deceptive_domain";
    details.push("Domain length is suspicious (possible IDN homograph attack)");
  }

  if (
    /^\d+\./.test(domain) ||
    domain.replace(/[^0-9]/g, "").length > domain.length * 0.5
  ) {
    if (isSafe) {
      details.push("Domain contains unusual number pattern");
    }
  }

  const knownShorteners = [
    "bit.ly",
    "tinyurl.com",
    "goo.gl",
    "t.co",
    "is.gd",
    "ow.ly",
  ];
  if (
    knownShorteners.some(
      (shortener) => domain === shortener || domain.endsWith("." + shortener)
    )
  ) {
    if (isSafe) {
      details.push(
        "URL uses a shortening service which may mask its destination"
      );
    }
  }

  if (domain === "google.com" || domain === "www.google.com") {
    isSafe = true;
    details = ["Known safe website"];
  } else if (domain === "example.com" || domain === "www.example.com") {
    isSafe = true;
    details = ["Example domain used for demonstration purposes"];
  } else if (
    domain === "malware-test.com" ||
    domain === "www.malware-test.com"
  ) {
    isSafe = false;
    threatType = "malware";
    details = ["Known malware distribution site (test case)"];
  }

  return {
    isSafe,
    threatType: threatType || "suspicious",
    details: details.length > 0 ? details : ["No specific threats detected"],
  };
};

export const checkPasswordSecurity = async (password) => {
  try {
    const hash = sha1(password).toUpperCase();
    const prefix = hash.substring(0, 5);
    const suffix = hash.substring(5);

    const response = await fetch(
      `https://api.pwnedpasswords.com/range/${prefix}`
    );
    const hashes = (await response.text()).split("\r\n");

    let breachCount = 0;
    for (const hashLine of hashes) {
      const [hashSuffix, count] = hashLine.split(":");

      if (hashSuffix === suffix) {
        breachCount = parseInt(count);
        break;
      }
    }

    return {
      secure: breachCount === 0,
      breachCount: breachCount,
      recommendations:
        breachCount > 0
          ? [
            "Change this password immediately on all sites where you use it",
            "Use a unique password for each service",
            "Consider using a password manager",
            "Create stronger passwords with a mix of characters, numbers, and symbols",
          ]
          : [],
    };
  } catch (error) {
    console.error("Error checking password security:", error);
    throw error;
  }
};

export const analyzePasswordStrength = (password) => {
  const result = zxcvbn(password);

  let strength = "Weak";
  let timeToBreak = "Instantly";

  if (result.score >= 4) {
    strength = "Very Strong";
    timeToBreak = "Centuries";
  } else if (result.score >= 3) {
    strength = "Strong";
    timeToBreak = "Decades";
  } else if (result.score >= 2) {
    strength = "Moderate";
    timeToBreak = "Years";
  } else if (result.score >= 1) {
    strength = "Weak";
    timeToBreak = "Months";
  }

  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  return {
    strength: strength,
    entropy: result.guesses_log10 * 3.32,
    length: password.length,
    hasLowercase: hasLowercase,
    hasUppercase: hasUppercase,
    hasNumbers: hasNumbers,
    hasSpecial: hasSpecial,
    timeToBreak: timeToBreak,
    suggestions: [
      hasLowercase ? null : "Add lowercase letters",
      hasUppercase ? null : "Add uppercase letters",
      hasNumbers ? null : "Add numbers",
      hasSpecial ? null : "Add special characters",
      password.length < 12
        ? "Make password longer (aim for 16+ characters)"
        : null,
      ...(result.feedback.suggestions || []),
    ].filter(Boolean),
  };
};

export const secureCompare = (a, b) => {
  if (typeof a !== "string" || typeof b !== "string") {
    return false;
  }

  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
};

export const generateRandomString = (length = 16) => {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0"))
    .join("")
    .substring(0, length);
};

export const validateHashFormat = (hash, algorithm) => {
  if (typeof hash !== "string") {
    return false;
  }

  const expectedLengths = {
    "SHA-1": 40,
    "SHA-256": 64,
    "SHA-384": 96,
    "SHA-512": 128,
  };

  const expectedLength = expectedLengths[algorithm];
  if (!expectedLength) {
    return false;
  }

  return hash.length === expectedLength && /^[0-9a-f]+$/i.test(hash);
};

export const checkPasswordStrength = (password) => {
  const analysis = analyzePasswordStrength(password);

  let strength = "weak";
  if (analysis.strength === "Very Strong" || analysis.strength === "Strong") {
    strength = "strong";
  } else if (analysis.strength === "Moderate") {
    strength = "medium";
  }

  return {
    strength,
    score: Math.min(5, Math.ceil(analysis.entropy / 20)),
    feedback: analysis.suggestions,
  };
};

export const analyzePrivacyPolicy = async (url) => {
  const extractDomain = (u) => {
    try {
      const n = u.startsWith("http") ? u : `https://${u}`;
      return new URL(n).hostname.replace(/^www\./, "");
    } catch (error) {
      console.error("Domain extraction error:", error);
      return null;
    }
  };

  const getScoreFromGrade = (grade, percentage) => {
    if (percentage && !isNaN(parseInt(percentage))) {
      return parseInt(percentage);
    }
    return (
      { A: 90, B: 75, C: 60, D: 40, E: 25, F: 10 }[grade?.toUpperCase()] ?? 50
    );
  };

  const caseToRating = (c) => {
    if (!c) return "Average";
    switch (c.toLowerCase()) {
      case "good":
        return "Good";
      case "neutral":
        return "Average";
      case "bad":
      case "blocker":
        return "Poor";
      default:
        return "Average";
    }
  };

  const domain = extractDomain(url);
  if (!domain) throw new Error("Invalid URL");

  try {
    const searchRes = await fetch(
      `https://api.tosdr.org/search/v5/?query=${encodeURIComponent(domain)}`
    );
    if (!searchRes.ok) throw new Error(`Search API error ${searchRes.status}`);
    const searchData = await searchRes.json();
    const services = searchData.services || [];

    const meta = services.find((s) =>
      (s.urls || []).some((u) => {
        try {
          return (
            new URL(`https://${u}`).hostname.replace(/^www\./, "") === domain
          );
        } catch (error) {
          console.warn("URL parsing error in find service:", error);
          return false;
        }
      })
    );

    if (!meta) {
      return {
        grade: "N/A",
        score: 50,
        summary: `No ToS;DR data for ${domain}.`,
        categories: [
          {
            name: "Data Collection",
            rating: "Average",
            description: "No data available",
          },
          {
            name: "Data Sharing",
            rating: "Average",
            description: "No data available",
          },
          {
            name: "User Rights",
            rating: "Average",
            description: "No data available",
          },
        ],
        highlights: [
          { positive: false, text: "Not in ToS;DR database." },
          { positive: true, text: "You can contribute at edit.tosdr.org." },
        ],
        dataSharing: { count: 0, parties: [] },
      };
    }

    let service = {
      name: meta.name || domain,
      id: meta.id,
      rating: meta.rating || "N/A",
      points: [],
      urls: meta.urls || [],
      description: meta.description || `Privacy policy for ${domain}`,
    };

    try {
      const detailRes = await fetch(
        `https://api.tosdr.org/service/v3/?id=${meta.id}`
      );
      if (detailRes.ok) {
        const detailData = await detailRes.json();
        if (detailData?.parameters?.service) {
          service = detailData.parameters.service;
        } else if (detailData?.service) {
          service = detailData.service;
        } else if (detailData?.data?.service) {
          service = detailData.data.service;
        }
      }
    } catch (error) {
      console.warn("Error fetching service details:", error);
    }

    const pts = service.points || [];
    const seen = new Set();
    const categories = pts.reduce((arr, p) => {
      if (!p) return arr;
      const t = p.title || "General";
      if (!seen.has(t)) {
        seen.add(t);
        const caseClassification =
          p.case && typeof p.case === "object"
            ? p.case.classification
            : typeof p.case === "string"
              ? p.case
              : null;
        arr.push({
          name: t,
          rating: caseToRating(caseClassification),
          description: p.analysis || t,
        });
      }
      return arr;
    }, []);

    if (categories.length === 0) {
      categories.push(
        {
          name: "Data Collection",
          rating: "Average",
          description: "Limited information available",
        },
        {
          name: "Data Sharing",
          rating: "Average",
          description: "Limited information available",
        },
        {
          name: "User Rights",
          rating: "Average",
          description: "Limited information available",
        }
      );
    }

    const highlights = pts
      .filter((p) => p && p.analysis)
      .slice(0, 10)
      .map((p) => ({
        positive: p.case && p.case.classification === "good",
        text: p.analysis,
      }));

    if (highlights.length === 0) {
      highlights.push({
        positive: true,
        text: "Basic privacy information available.",
      });
    }

    const parties = (service.urls || []).map((u) => ({
      name: u,
      purpose: "Data sharing/tracking",
    }));

    return {
      grade: service.rating || "N/A",
      score: getScoreFromGrade(service.rating, service.points_percentage),
      summary: service.description || service.name || domain,
      categories,
      highlights,
      dataSharing: { count: parties.length, parties },
      tosdrUrl: `https://tosdr.org/en/service/${service.id}`,
    };
  } catch (error) {
    console.error("Privacy policy analysis error:", error);
    return {
      grade: "N/A",
      score: 50,
      summary: `Could not analyze ${domain}. API error or service unavailable.`,
      categories: [
        {
          name: "Data Collection",
          rating: "Average",
          description: "Analysis failed",
        },
        {
          name: "Data Sharing",
          rating: "Average",
          description: "Analysis failed",
        },
        {
          name: "User Rights",
          rating: "Average",
          description: "Analysis failed",
        },
      ],
      highlights: [
        { positive: false, text: "Analysis service failed." },
        { positive: true, text: "Try again later or check the URL." },
      ],
      dataSharing: { count: 0, parties: [] },
      tosdrUrl: "https://tosdr.org",
    };
  }
};

export const checkSecurityHeaders = async (url) => {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  const securityHeadersUrl = `https:
    url
  )}&followRedirects=on&hide=on`;
  window.open(securityHeadersUrl, "_blank");

  const domainName = new URL(url).hostname;

  try {
    await fetch(url, {
      method: "HEAD",
      mode: "no-cors",
      cache: "no-cache",
    });
  } catch (error) {
    console.warn("Error fetching headers (expected due to CORS):", error);
  }

  const securityHeaders = [
    {
      name: "Content-Security-Policy",
      value: null,
      description:
        "Prevents XSS attacks by specifying which resources can be loaded",
      status: "unknown",
      example: "default-src 'self'; script-src 'self' trusted-cdn.com",
    },
    {
      name: "Strict-Transport-Security",
      value: null,
      description: "Forces browsers to use HTTPS for future visits",
      status: "unknown",
      example: "max-age=31536000; includeSubDomains; preload",
    },
    {
      name: "X-Content-Type-Options",
      value: null,
      description:
        "Prevents browsers from MIME-sniffing a response from declared content-type",
      status: "unknown",
      example: "nosniff",
    },
    {
      name: "X-Frame-Options",
      value: null,
      description:
        "Prevents clickjacking attacks by not allowing the site to be framed",
      status: "unknown",
      example: "DENY",
    },
    {
      name: "X-XSS-Protection",
      value: null,
      description:
        "(Legacy) Enables cross-site scripting filtering in browsers",
      status: "unknown",
      example: "1; mode=block",
    },
    {
      name: "Referrer-Policy",
      value: null,
      description:
        "Controls how much referrer information is sent when following links",
      status: "unknown",
      example: "strict-origin-when-cross-origin",
    },
    {
      name: "Permissions-Policy",
      value: null,
      description: "Modern replacement for Feature-Policy header",
      status: "unknown",
      example: "camera=(), microphone=(), geolocation=()",
    },
  ];

  const recommendations = [
    "Implement Content-Security-Policy to control which resources can be loaded",
    "Use Strict-Transport-Security to ensure HTTPS usage",
    "Add X-Content-Type-Options: nosniff to prevent MIME type sniffing",
    "Set X-Frame-Options to DENY or SAMEORIGIN to prevent clickjacking",
    "Implement Referrer-Policy to control referrer information leakage",
    "Consider adding Permissions-Policy to control browser feature usage",
  ];

  return {
    url,
    grade: "?",
    score: null,
    headers: securityHeaders,
    recommendations,
    message: `For accurate results, please check the SecurityHeaders.io tab that opened. Due to browser security restrictions (CORS), we can't directly access the security headers of ${domainName} from your browser.`,
    externalScan: true,
    scanUrl: securityHeadersUrl,
  };
};

export async function scanUrlForMalware(url) {
  try {
    if (!url.match(/^https?:\/\/.+/)) {
      throw new Error(
        "Please enter a valid URL starting with http:// or https://"
      );
    }

    const corsProxy = "https://corsproxy.io/?";
    const mockResult = createMockScanResult(url);

    try {
      const IPQS_API_KEY = import.meta.env.VITE_IPQS_API_KEY;
      const encodedUrl = encodeURIComponent(url);
      const apiUrl = `https://www.ipqualityscore.com/api/json/url/${IPQS_API_KEY}/${encodedUrl}`;
      const proxiedUrl = corsProxy + encodeURIComponent(apiUrl);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(proxiedUrl, {
        method: "GET",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        return {
          url,
          scanDate: new Date().toISOString(),
          score: calculateScoreFromIPQS(data),
          enginesDetected: data.unsafe ? 1 : 0,
          enginesTotal: 1,
          categories: extractCategoriesFromIPQS(data),
          detections: createDetectionsFromIPQS(data),
          recommendations: createRecommendationsFromIPQS(data),
          apiData: data,
        };
      } else {
        return mockResult;
      }
    } catch {
      return mockResult;
    }
  } catch (error) {
    return {
      error: true,
      message: error.message || "An unknown error occurred during the scan",
      url,
    };
  }
}

function calculateScoreFromIPQS(data) {
  let score = 0;
  if (data.unsafe) score += 4;
  if (data.spamming) score += 2;
  if (data.malware) score += 3;
  if (data.phishing) score += 3;
  if (data.suspicious) score += 2;
  if (data.adult) score += 1;
  if (data.risk_score) score += Math.round(data.risk_score / 20);
  return Math.min(10, score);
}

function extractCategoriesFromIPQS(data) {
  const categories = [];
  if (data.phishing) categories.push("Phishing");
  if (data.malware) categories.push("Malware");
  if (data.spamming) categories.push("Spam");
  if (data.suspicious) categories.push("Suspicious");
  if (data.adult) categories.push("Adult Content");
  return categories;
}

function createDetectionsFromIPQS(data) {
  return [
    {
      engine: "Domain Security",
      category: "Security",
      result: data.unsafe ? "malicious" : "clean",
    },
    {
      engine: "Phishing Scanner",
      category: "Phishing",
      result: data.phishing ? "malicious" : "clean",
    },
    {
      engine: "Malware Scanner",
      category: "Malware",
      result: data.malware ? "malicious" : "clean",
    },
  ];
}

function createRecommendationsFromIPQS(data) {
  if (data.unsafe || data.malware || data.phishing) {
    return [
      "Avoid this site",
      "Do not enter personal information",
      "Consider running a virus scan if you've visited this site",
    ];
  }

  if (data.suspicious || data.spamming) {
    return [
      "Exercise caution with this site",
      "Verify the site's legitimacy before sharing information",
    ];
  }

  return [
    "No significant threats detected",
    "Always practice safe browsing habits",
  ];
}

function createMockScanResult(url) {
  let score = 0;
  const lowerUrl = url.toLowerCase();
  const suspiciousTerms = [
    "free",
    "win",
    "prize",
    "crypto",
    "wallet",
    "password",
    "reset",
    "login",
  ];
  const suspiciousTlds = [".tk", ".ml", ".ga", ".cf", ".xyz"];

  if (suspiciousTlds.some((tld) => lowerUrl.endsWith(tld))) score += 3;
  if (suspiciousTerms.some((term) => lowerUrl.includes(term))) score += 2;

  const domainHash = simpleHash(extractDomain(url));
  const domainScore = domainHash % 10;

  if (countOccurrences(url, ".") > 3) score += 1;
  if (url.includes("@")) score += 2;
  if (url.includes("//") && url.indexOf("//") !== url.indexOf("://"))
    score += 3;
  if (url.length > 100) score += 1;

  score = Math.min(10, score + (domainScore > 7 ? 2 : 0));

  if (
    lowerUrl.includes("google.com") ||
    lowerUrl.includes("microsoft.com") ||
    lowerUrl.includes("apple.com") ||
    lowerUrl.includes("amazon.com")
  ) {
    score = 0;
  }

  const detections = [
    {
      engine: "Local Security Check",
      category: "Basic",
      result: score > 5 ? "malicious" : "clean",
    },
    {
      engine: "Domain Analyzer",
      category: "Domain",
      result: score > 3 ? "malicious" : "clean",
    },
    {
      engine: "Pattern Scanner",
      category: "URL Pattern",
      result: score > 4 ? "malicious" : "clean",
    },
  ];

  const categories = [];
  if (score > 5) {
    categories.push("Suspicious");
    if (score > 7) categories.push("Potentially Malicious");
  }

  return {
    url,
    scanDate: new Date().toISOString(),
    score,
    enginesDetected: detections.filter((d) => d.result === "malicious").length,
    enginesTotal: detections.length,
    categories,
    detections,
    recommendations:
      score > 5
        ? [
          "Exercise caution with this site",
          "Verify the site's legitimacy before sharing information",
        ]
        : [
          "No obvious threats detected",
          "Always practice safe browsing habits",
        ],
    isMockData: true,
  };
}

function extractDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash &= hash;
  }
  return Math.abs(hash);
}

function countOccurrences(str, subStr) {
  return str.split(subStr).length - 1;
}

export const lookupIPReputation = async (ip) => {
  const apiKey = import.meta.env.VITE_ABUSE_IPDB_KEY;

  const corsProxy = "https://thingproxy.freeboard.io/fetch/";
  const apiUrl = `https://api.abuseipdb.com/api/v2/check?ipAddress=${encodeURIComponent(
    ip
  )}&maxAgeInDays=90&key=${encodeURIComponent(apiKey)}`;
  const proxiedUrl = corsProxy + apiUrl;

  try {
    const response = await fetch(proxiedUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`AbuseIPDB request failed (${response.status}): ${text}`);
    }

    const { data: ipData } = await response.json();
    if (!ipData) {
      throw new Error("No data returned from AbuseIPDB");
    }

    return {
      ipAddress: ip,
      abuseScore: ipData.abuseConfidenceScore ?? 0,
      countryCode: ipData.countryCode ?? "Unknown",
      isp: ipData.isp ?? "Unknown",
      usageType: ipData.usageType ?? "Unknown",
      lastReportedAt: ipData.lastReportedAt ?? null,
      reports: ipData.reports ?? [],
    };
  } catch (error) {
    console.error("Error in lookupIPReputation:", error);
    throw error;
  }
};
