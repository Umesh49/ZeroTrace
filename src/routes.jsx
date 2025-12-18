import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { SkeletonPage } from "./components/common/Skeleton/Skeleton.jsx";

// Lazy load all route components for optimal code-splitting
const Home = lazy(() => import("./components/Home/Home"));
const IndianLaws = lazy(() => import("./components/IndianLaws/IndianLaws"));
const ComplaintGuide = lazy(() => import("./components/ComplaintGuide/ComplaintGuide.jsx"));
const ComplaintForm = lazy(() => import("./components/ComplaintForm/ComplaintForm.jsx"));
const SecurityTools = lazy(() => import("./components/SecurityTools/SecurityTools"));
const CyberAwarenessQuiz = lazy(() => import("./components/Quiz/CyberAwarenessQuiz"));
const QuizCategorySelector = lazy(() => import("./components/Quiz/QuizCategorySelector"));
const SecurityChecklist = lazy(() => import("./components/SecurityChecklist/SecurityChecklist"));
const FAQ = lazy(() => import("./components/FAQs/FAQ"));
const Contact = lazy(() => import("./components/Contact/Contact"));
const AboutUs = lazy(() => import("./components/About/AboutUs"));
const Tutorials = lazy(() => import("./components/Tutorials/Tutorials"));
const Chatbot = lazy(() => import("./components/Chatbot/Chatbot.jsx"));
const PrivacyPolicy = lazy(() => import("./components/StaticPages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./components/StaticPages/TermsOfService"));
const NotFound = lazy(() => import("./components/NotFound/NotFound"));
const ThreatStats = lazy(() => import("./components/ThreatStats/ThreatStats.jsx"));
const SecurityNews = lazy(() => import("./components/SecurityNews/SecurityNews.jsx"));
const CaseStudies = lazy(() => import("./components/CaseStudy/CaseStudy.jsx"));

// Security Tools - Lazy loaded
const BreachExposureChecker = lazy(() => import("./components/SecurityTools/Tools/BreachExposureChecker.jsx"));
const BrowserFingerprinting = lazy(() => import("./components/SecurityTools/Tools/BrowserFingerprinting.jsx"));
const DnsLeakTester = lazy(() => import("./components/SecurityTools/Tools/DnsLeakTester.jsx"));
const FileEncryption = lazy(() => import("./components/SecurityTools/Tools/FileEncryption.jsx"));
const IpGeolocation = lazy(() => import("./components/SecurityTools/Tools/IpGeolocation.jsx"));
const IpReputationLookup = lazy(() => import("./components/SecurityTools/Tools/IpReputationLookup.jsx"));
const PasswordGenerator = lazy(() => import("./components/SecurityTools/Tools/PasswordGenerator.jsx"));
const PasswordStrengthMeter = lazy(() => import("./components/SecurityTools/Tools/PasswordStrengthMeter.jsx"));
const PrivacyPolicyAnalyzer = lazy(() => import("./components/SecurityTools/Tools/PrivacyPolicyAnalyzer.jsx"));
const PrivacyTester = lazy(() => import("./components/SecurityTools/Tools/PrivacyTester.jsx"));
const QrCodeGenerator = lazy(() => import("./components/SecurityTools/Tools/QrCodeGenerator.jsx"));
const SafeBrowsingCheck = lazy(() => import("./components/SecurityTools/Tools/SafeBrowsingCheck.jsx"));
const SecurityHeadersAudit = lazy(() => import("./components/SecurityTools/Tools/SecurityHeadersAudit.jsx"));
const UrlMalwareScanner = lazy(() => import("./components/SecurityTools/Tools/UrlMalwareScanner.jsx"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<SkeletonPage type="default" />}>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/security-checklist" element={<SecurityChecklist />} />
        <Route path="/indian-laws" element={<IndianLaws />} />
        <Route path="/complaint-guide" element={<ComplaintGuide />} />
        <Route path="/complaint-form" element={<ComplaintForm />} />
        <Route path="/security-tools" element={<SecurityTools />} />
        <Route path="/quiz" element={<QuizCategorySelector />} />
        <Route path="/quiz/:categoryId" element={<CyberAwarenessQuiz />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/tutorials" element={<Tutorials />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/security-news" element={<SecurityNews />} />
        <Route path="/threat-stats" element={<ThreatStats />} />
        <Route path="/case-study" element={<CaseStudies />} />

        {/* Tools */}
        <Route path="/breach-exposure-checker" element={<BreachExposureChecker />} />
        <Route path="/browser-fingerprinting" element={<BrowserFingerprinting />} />
        <Route path="/dns-leak-tester" element={<DnsLeakTester />} />
        <Route path="/file-encryption" element={<FileEncryption />} />
        <Route path="/ip-geolocation" element={<IpGeolocation />} />
        <Route path="/ip-reputation-lookup" element={<IpReputationLookup />} />
        <Route path="/password-generator" element={<PasswordGenerator />} />
        <Route path="/password-strength-meter" element={<PasswordStrengthMeter />} />
        <Route path="/privacy-policy-analyzer" element={<PrivacyPolicyAnalyzer />} />
        <Route path="/privacy-tester" element={<PrivacyTester />} />
        <Route path="/qr-code-generator" element={<QrCodeGenerator />} />
        <Route path="/safe-browsing-check" element={<SafeBrowsingCheck />} />
        <Route path="/security-headers-audit" element={<SecurityHeadersAudit />} />
        <Route path="/url-malware-scanner" element={<UrlMalwareScanner />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
