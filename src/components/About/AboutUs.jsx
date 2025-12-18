import {
  ShieldCheck,
  Users,
  Briefcase,
  Lightbulb,
  TrendingUp,
  Globe,
  Info,
  Award,
  Heart
} from "lucide-react";
import "../StaticPages/Tos_PP.css"; // Use shared styling

export default function AboutUs() {
  const fullText = "Our mission, vision, and the team behind India's premier cybersecurity awareness platform.";

  /* useEffect removed as CSS animations handle everything now */

  return (
    <div className="pp-tos-theme">
      <div className="tos-pp-container tos-pp-py-8">
        <div className="tos-pp-page-header">
          <div className="tos-pp-header-container">
            <h1 className="tos-pp-glitch-text">About ZeroTrace</h1>
            <p className="tos-pp-header-subtitle">
              {fullText}
            </p>
            <div className="tos-pp-grid-lines"></div>
          </div>
        </div>

        <div className="tos-pp-terms-container">
          {/* Our Story Section */}
          <div className="tos-pp-panel tos-pp-mb-6">
            <div className="tos-pp-terminal-header">
              <span className="tos-pp-terminal-button tos-pp-red"></span>
              <span className="tos-pp-terminal-button tos-pp-yellow"></span>
              <span className="tos-pp-terminal-button tos-pp-green"></span>
              <span className="tos-pp-terminal-title">Origin_Story.log</span>
            </div>
            <div className="tos-pp-policy-section">
              <div className="tos-pp-section-icon">
                <Info className="tos-pp-icon" size={24} />
              </div>
              <div className="tos-pp-section-content">
                <h2 className="tos-pp-section-title">Our Story</h2>
                <p className="tos-pp-text">
                  Founded in 2025 as part of a college capstone project, this
                  initiative was inspired by the popular TV series Savdhaan India,
                  which dramatizes real-life frauds and scams targeting everyday
                  citizens. We saw an opportunity to bring that same cautionary
                  spirit to the digital world, educating users about evolving
                  cyber threats.
                </p>
                <p className="tos-pp-text">
                  A group of postgraduate students pooled our skills in
                  cybersecurity, law, and education technology to build a
                  comprehensive platform. Our goal is to demystify complex cyber
                  laws and digital risks, making safety practices easy to
                  understand and apply for everyone.
                </p>
                <p className="tos-pp-text">
                  Through this project, users can explore engaging content on
                  common cybercrimes, learn about relevant Indian cyber
                  legislation, and discover step-by-step procedures to report
                  incidents. We aim to foster widespread awareness and equip
                  individuals to protect themselves online.
                </p>
              </div>
            </div>
          </div>

          {/* Mission & Vision Section */}
          <div className="tos-pp-panel tos-pp-mb-6">
            <div className="tos-pp-terminal-header">
              <span className="tos-pp-terminal-button tos-pp-red"></span>
              <span className="tos-pp-terminal-button tos-pp-yellow"></span>
              <span className="tos-pp-terminal-button tos-pp-green"></span>
              <span className="tos-pp-terminal-title">Mission_Vision.exe</span>
            </div>
            <div className="tos-pp-policy-section" style={{ flexDirection: 'column', gap: '2rem' }}>

              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                <div className="tos-pp-section-icon">
                  <ShieldCheck className="tos-pp-icon" size={24} />
                </div>
                <div className="tos-pp-section-content">
                  <h2 className="tos-pp-section-title" style={{ fontSize: '1.5rem' }}>Our Mission</h2>
                  <p className="tos-pp-text">
                    To translate the cautionary lessons of ZeroTrace into the
                    digital realm by providing clear, practical guidance on cyber
                    safety, empowering students and citizens to recognize and
                    counter online threats.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', borderTop: '1px solid var(--primary-dim)', paddingTop: '2rem' }}>
                <div className="tos-pp-section-icon">
                  <Lightbulb className="tos-pp-icon" size={24} />
                </div>
                <div className="tos-pp-section-content">
                  <h2 className="tos-pp-section-title" style={{ fontSize: '1.5rem' }}>Our Vision</h2>
                  <p className="tos-pp-text">
                    A digitally aware community where every user is equipped with
                    the knowledge and tools to defend against cybercrime, fostering
                    a culture of vigilance and resilience across India.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Core Values Section */}
          <div className="tos-pp-panel tos-pp-mb-6">
            <div className="tos-pp-terminal-header">
              <span className="tos-pp-terminal-button tos-pp-red"></span>
              <span className="tos-pp-terminal-button tos-pp-yellow"></span>
              <span className="tos-pp-terminal-button tos-pp-green"></span>
              <span className="tos-pp-terminal-title">Core_Values.config</span>
            </div>
            <div className="tos-pp-policy-section">
              <div className="tos-pp-section-icon">
                <Heart className="tos-pp-icon" size={24} />
              </div>
              <div className="tos-pp-section-content">
                <h2 className="tos-pp-section-title">Our Core Values</h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '1.5rem' }}>

                  <div className="tos-pp-contact-info" style={{ marginTop: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', color: 'var(--primary-color)' }}>
                      <Users size={20} style={{ marginRight: '0.5rem' }} />
                      <h3 style={{ margin: 0, fontFamily: 'var(--font-mono)' }}>Inclusivity</h3>
                    </div>
                    <p className="tos-pp-text" style={{ fontSize: '0.9rem', margin: 0 }}>
                      We believe cybersecurity knowledge should be accessible to
                      all Indians, regardless of technical background, language,
                      or location.
                    </p>
                  </div>

                  <div className="tos-pp-contact-info" style={{ marginTop: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', color: 'var(--primary-color)' }}>
                      <Briefcase size={20} style={{ marginRight: '0.5rem' }} />
                      <h3 style={{ margin: 0, fontFamily: 'var(--font-mono)' }}>Integrity</h3>
                    </div>
                    <p className="tos-pp-text" style={{ fontSize: '0.9rem', margin: 0 }}>
                      We are committed to providing accurate, unbiased information
                      and maintaining the highest ethical standards in all our
                      operations.
                    </p>
                  </div>

                  <div className="tos-pp-contact-info" style={{ marginTop: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', color: 'var(--primary-color)' }}>
                      <TrendingUp size={20} style={{ marginRight: '0.5rem' }} />
                      <h3 style={{ margin: 0, fontFamily: 'var(--font-mono)' }}>Innovation</h3>
                    </div>
                    <p className="tos-pp-text" style={{ fontSize: '0.9rem', margin: 0 }}>
                      We continuously evolve our platform and resources to address
                      emerging cyber threats and leverage new technologies for
                      better security solutions.
                    </p>
                  </div>

                  <div className="tos-pp-contact-info" style={{ marginTop: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', color: 'var(--primary-color)' }}>
                      <Globe size={20} style={{ marginRight: '0.5rem' }} />
                      <h3 style={{ margin: 0, fontFamily: 'var(--font-mono)' }}>Empowerment</h3>
                    </div>
                    <p className="tos-pp-text" style={{ fontSize: '0.9rem', margin: 0 }}>
                      We don't just inform; we equip users with practical tools
                      and actionable knowledge to take control of their digital
                      security.
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="tos-pp-panel">
            <div className="tos-pp-terminal-header">
              <span className="tos-pp-terminal-button tos-pp-red"></span>
              <span className="tos-pp-terminal-button tos-pp-yellow"></span>
              <span className="tos-pp-terminal-button tos-pp-green"></span>
              <span className="tos-pp-terminal-title">Join_Us.sh</span>
            </div>
            <div className="tos-pp-policy-section">
              <div className="tos-pp-section-icon">
                <Award className="tos-pp-icon" size={24} />
              </div>
              <div className="tos-pp-section-content">
                <h2 className="tos-pp-section-title">Join Our Mission</h2>
                <p className="tos-pp-text">
                  Help us create a safer digital India by spreading awareness and
                  sharing our resources with the community.
                </p>
                <div style={{ marginTop: '2rem' }}>
                  <a href="/contact" className="tos-pp-button" style={{ textDecoration: 'none', display: 'inline-block' }}>
                    &gt; Contact Us
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
