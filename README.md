# ZeroTrace - Cybersecurity Awareness Platform

A comprehensive cybersecurity awareness and education platform designed to help users understand cyber threats, learn about Indian cyber laws, and access practical security tools.

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-61dafb.svg)
![Vite](https://img.shields.io/badge/Vite-6.4-646cff.svg)

## 🌐 Live Demo

**Website:** [https://zero-trace-uy.web.app](https://zero-trace-uy.web.app) 
*Some features might not work since the API keys may have expired.*

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Security Tools](#-security-tools)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Core Modules

| Module | Description |
|--------|-------------|
| **Indian Cyber Laws** | Comprehensive coverage of IT Act 2000, DPDP Act 2023, and relevant sections |
| **Complaint Guide** | Step-by-step instructions for filing cybercrime complaints |
| **Security Tools** | 14 interactive tools for security assessment |
| **Cyber Quiz** | Category-based quizzes with immediate feedback |
| **Case Studies** | Real-world examples of cyber incidents in India |
| **Tutorials** | Educational content on cybersecurity fundamentals |
| **ZeroBot** | AI-powered chatbot for cybersecurity queries |
| **Threat Stats** | Real-time global cyber threat visualization |
| **Security News** | Latest cybersecurity news and updates |

### Key Highlights

- 🎨 Modern dark theme with cybersecurity aesthetic
- 📱 Fully responsive design (mobile, tablet, desktop)
- ♿ Accessibility-focused with ARIA labels
- 🔒 Client-side processing for privacy (no data leaves your browser)
- ⚡ Progressive Web App (PWA) support
- 🔍 SEO optimized with Open Graph tags

---

## 🛠 Tech Stack

### Frontend
- **React 18.3** - UI Framework
- **Vite 6.4** - Build Tool
- **React Router 6** - Navigation
- **Vanilla CSS** - Styling (no frameworks)

### Key Libraries
| Library | Purpose |
|---------|---------|
| `openpgp` | Client-side file encryption |
| `zxcvbn` | Password strength analysis |
| `hibp` | Data breach verification |
| `@fingerprintjs/fingerprintjs` | Browser fingerprinting demo |
| `lucide-react` | Icon components |
| `react-markdown` | Content rendering |
| `qrcode` | QR code generation |

### Development
- **ESLint** - Code linting
- **Firebase** - Hosting
- **PWA Plugin** - Offline support

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0+
- npm 9.0+

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/zerotrace.git
cd zerotrace

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`

---

## 🔐 Environment Variables

Create a `.env` file in the project root:

```env
# Optional - For AI Chatbot
VITE_OPENAI_API_KEY=your_openai_key
VITE_GEMINI_API_KEY=your_gemini_key
VITE_XAI_API_KEY=your_xai_key

# Optional - For URL Scanning
VITE_IPQS_API_KEY=your_ipqualityscore_key
VITE_ABUSE_IPDB_KEY=your_abuseipdb_key
```

> **Note:** The application works without API keys with limited functionality. The chatbot uses rule-based responses when no AI keys are configured. On the live demo, certain functionalities may be limited if integrated API keys expire.

### Demo Credentials

For testing purposes, use the following credentials:

| Field | Value |
|-------|-------|
| Password | `12345678` |

> *(The most secure password which isn't secure 😄)*

---

## 📁 Project Structure

```
zerotrace/
├── public/                    # Static assets
├── src/
│   ├── components/
│   │   ├── About/            # About page
│   │   ├── CaseStudy/        # Cyber incident case studies
│   │   ├── Chatbot/          # ZeroBot assistant
│   │   ├── ComplaintForm/    # Complaint submission
│   │   ├── ComplaintGuide/   # Complaint filing guide
│   │   ├── Contact/          # Contact page
│   │   ├── FAQs/             # FAQ section
│   │   ├── Footer/           # Site footer
│   │   ├── Header/           # Navigation
│   │   ├── Home/             # Homepage
│   │   ├── IndianLaws/       # IT Act information
│   │   ├── Quiz/             # Cyber awareness quiz
│   │   ├── SecurityChecklist/# Security assessment
│   │   ├── SecurityNews/     # News aggregation
│   │   ├── SecurityTools/    # Security tools dashboard
│   │   │   └── Tools/        # Individual tools
│   │   ├── ThreatStats/      # Threat visualization
│   │   ├── Tutorials/        # Educational content
│   │   └── common/           # Shared components
│   │       ├── Modal/        # Modal dialog
│   │       ├── PageTransition/
│   │       └── Skeleton/     # Loading states
│   ├── context/              # React context
│   ├── utils/                # Utility functions
│   ├── App.jsx               # Main app component
│   ├── routes.jsx            # Route definitions
│   └── index.css             # Global styles
├── index.html                # HTML template
├── vite.config.js            # Vite configuration
└── package.json              # Dependencies
```

---

## 🔧 Security Tools

| # | Tool | Description |
|---|------|-------------|
| 1 | **Password Generator** | Generate cryptographically secure passwords |
| 2 | **Password Strength Meter** | Analyze password strength with detailed feedback |
| 3 | **Breach Exposure Checker** | Check if credentials were compromised in data breaches |
| 4 | **IP Geolocation** | Lookup geographical information for IP addresses |
| 5 | **IP Reputation Lookup** | Check if an IP has been reported for malicious activity |
| 6 | **DNS Leak Tester** | Test for DNS leaks exposing browsing activity |
| 7 | **URL Malware Scanner** | Scan URLs for malware and phishing threats |
| 8 | **Safe Browsing Check** | Verify website safety |
| 9 | **Security Headers Audit** | Analyze HTTP security headers |
| 10 | **QR Code Generator** | Generate QR codes for URLs and text |
| 11 | **File Encryption** | Client-side file encryption (OpenPGP) |
| 12 | **Privacy Tester** | Test browser privacy settings |
| 13 | **Browser Fingerprinting** | Demonstrate browser fingerprinting |
| 14 | **Privacy Policy Analyzer** | Analyze and rate privacy policies |

---

## 🔮 Future Enhancements

- [ ] User authentication for saving progress
- [ ] Multi-language support (Hindi, regional languages)
- [ ] Mobile apps (React Native)
- [ ] Community forum
- [ ] Offline mode (PWA)
- [ ] Email alerts for new threats

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📚 References

- [Information Technology Act, 2000](https://www.meity.gov.in/content/information-technology-act-2000)
- [National Cyber Crime Reporting Portal](https://cybercrime.gov.in)
- [CERT-In](https://cert-in.org.in)
- [OWASP Guidelines](https://owasp.org)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Umesh Y**

---

<p align="center">
  Made with ❤️ for a safer digital India
</p>
