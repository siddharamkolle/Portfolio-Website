import { useState, useEffect } from 'react';
import { profile } from '../data/siteData';
import {
  getAcademicDetails,
  getResumeConfig,
  EVENT_DATA_UPDATED,
} from '../utils/portfolioStorage';
import { soundManager } from '../utils/soundEffects';
import {
  FiDownload,
  FiPrinter,
  FiFileText,
  FiExternalLink,
  FiCheckCircle,
  FiMail,
  FiGithub,
  FiLinkedin,
  FiCopy,
  FiCheck,
  FiShield,
  FiBookOpen,
} from 'react-icons/fi';

export default function Resume({ onNavigate }) {
  const [docMode, setDocMode] = useState('resume'); // 'resume' | 'cv'
  const [resumeConfig, setResumeConfig] = useState(() => getResumeConfig());
  const [academic, setAcademic] = useState(() => getAcademicDetails());
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState('');

  useEffect(() => {
    const handleUpdate = () => {
      setResumeConfig(getResumeConfig());
      setAcademic(getAcademicDetails());
    };
    window.addEventListener(EVENT_DATA_UPDATED, handleUpdate);
    return () => window.removeEventListener(EVENT_DATA_UPDATED, handleUpdate);
  }, []);

  const s = academic || profile.studentDetails;
  const cfg = resumeConfig;
  const officialPdfUrl = cfg.resumePdfUrl || '/Resume_Siddharam_Kolle.pdf';
  const officialPdfName = 'Resume_Siddharam_Kolle.pdf';

  // Direct file download trigger for the actual uploaded PDF
  const handleDownload = () => {
    soundManager.playClick();
    const link = document.createElement('a');
    link.href = officialPdfUrl;
    link.download = officialPdfName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess('Official Resume (Resume_Siddharam_Kolle.pdf) Downloaded!');
    setTimeout(() => setDownloadSuccess(''), 3500);
  };

  // Open PDF for printing
  const handlePrint = () => {
    soundManager.playClick();
    const pdfWindow = window.open(officialPdfUrl, '_blank');
    if (pdfWindow) {
      pdfWindow.focus();
    }
  };

  const handleCopyContact = () => {
    soundManager.playClick();
    const contactInfo = `Siddharam Kolle | Web3 & Application Developer\nEmail: ${cfg.email}\nGitHub: ${cfg.githubUrl}\nLinkedIn: ${cfg.linkedinUrl}\nJSPM University Pune | PRN: ${s.prn || '32558023054'}\nResume: ${window.location.origin}${officialPdfUrl}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(contactInfo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="section-inner resume-section-v2">
      {/* Top Section Header */}
      <div className="section-header-pill">
        <span className="section-pill-dot"></span>
        <span>CURRICULUM VITAE & TECHNICAL RESUME</span>
      </div>

      <h2 className="section-main-title">
        Professional Credentials & <span className="text-gradient">Official Resume</span>
      </h2>

      <p className="section-lead-text">
        Authenticated official resume of Siddharam Kolle ({officialPdfName}). Review the verified document in-browser or download the official PDF.
      </p>

      {/* Control Action Toolbar */}
      <div className="resume-toolbar-container">
        {/* Document Mode / View Switcher */}
        <div className="resume-mode-switch-group">
          <button
            type="button"
            className={`resume-mode-tab-btn ${docMode === 'resume' ? 'active' : ''}`}
            onClick={() => {
              soundManager.playClick();
              setDocMode('resume');
            }}
            onMouseEnter={() => soundManager.playHover()}
          >
            <FiFileText size={15} />
            <span>Official Resume</span>
            <span className="resume-tab-badge">ATS 1-PAGE</span>
          </button>

          <a
            href={officialPdfUrl}
            target="_blank"
            rel="noreferrer"
            className="resume-mode-tab-btn"
            onClick={() => soundManager.playClick()}
            onMouseEnter={() => soundManager.playHover()}
            title="Open official PDF document in a new browser tab"
          >
            <FiExternalLink size={15} />
            <span>Open in New Tab</span>
            <span className="resume-tab-badge">FULL VIEW</span>
          </a>
        </div>

        {/* Download & Print Action Buttons */}
        <div className="resume-actions-right">
          {/* Direct Resume Download */}
          <button
            type="button"
            className="resume-cta-btn resume-btn-download-primary"
            onClick={handleDownload}
            title="Download Official Resume PDF (Resume_Siddharam_Kolle.pdf)"
            onMouseEnter={() => soundManager.playHover()}
          >
            <FiDownload size={15} />
            <span>Download Resume (PDF)</span>
          </button>

          {/* Direct View in Browser */}
          <a
            href={officialPdfUrl}
            target="_blank"
            rel="noreferrer"
            className="resume-cta-btn resume-btn-download-secondary"
            title="Preview Resume_Siddharam_Kolle.pdf in high-res full window"
            onClick={() => soundManager.playClick()}
            onMouseEnter={() => soundManager.playHover()}
          >
            <FiExternalLink size={15} />
            <span>Preview Full PDF</span>
          </a>

          {/* Native Print / Save to PDF */}
          <button
            type="button"
            className="resume-cta-btn resume-btn-glass"
            onClick={handlePrint}
            title="Open official PDF to print or save"
            onMouseEnter={() => soundManager.playHover()}
          >
            <FiPrinter size={15} />
            <span>Print PDF</span>
          </button>

          {/* Quick Copy Contact */}
          <button
            type="button"
            className="resume-cta-btn resume-btn-glass"
            onClick={handleCopyContact}
            title="Copy Contact & Resume Link"
            onMouseEnter={() => soundManager.playHover()}
          >
            {copied ? <FiCheck size={15} color="#39D353" /> : <FiCopy size={15} />}
            <span>{copied ? 'Copied Link!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Download Alert Toast if triggered */}
      {downloadSuccess && (
        <div className="resume-download-toast" role="status">
          <FiCheckCircle size={16} />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Interactive Cyber-Glass Document Canvas */}
      <div className="resume-document-wrapper">
        <div className="resume-document-sheet" id="printable-resume-cv">
          
          {/* Document Verified Ribbon */}
          <div className="resume-doc-ribbon">
            <div className="ribbon-verified-tag">
              <FiShield size={12} />
              <span>OFFICIALLY VERIFIED CANDIDATE RECORD</span>
            </div>
            <div className="ribbon-doc-type">
              OFFICIAL RESUME · {officialPdfName}
            </div>
          </div>

          {/* Document Header */}
          <header className="resume-doc-header">
            <div className="doc-header-main">
              <h1 className="doc-person-name">
                {cfg.preferredName || s.fullName || cfg.fullName}
              </h1>
              <div className="doc-person-role">
                <span>{cfg.professionalTitle}</span>
                <span className="doc-role-dot">•</span>
                <span className="doc-role-sub">Blockchain & Smart Contracts</span>
              </div>
            </div>

            {/* Quick Contact & Reference Strip */}
            <div className="doc-contacts-grid">
              <a
                href={`mailto:${cfg.email}`}
                className="doc-contact-item"
                target="_blank"
                rel="noreferrer"
              >
                <FiMail size={13} />
                <span>{cfg.email}</span>
              </a>

              <a
                href={cfg.githubUrl}
                className="doc-contact-item"
                target="_blank"
                rel="noreferrer"
              >
                <FiGithub size={13} />
                <span>github.com/siddharamkolle</span>
              </a>

              <a
                href={cfg.linkedinUrl}
                className="doc-contact-item"
                target="_blank"
                rel="noreferrer"
              >
                <FiLinkedin size={13} />
                <span>linkedin.com/in/siddharamkolle</span>
              </a>

              <div className="doc-contact-item">
                <FiBookOpen size={13} />
                <span>JSPM University, Pune · PRN: {s.prn || '32558023054'}</span>
              </div>
            </div>
          </header>

          {/* Document Divider */}
          <div className="resume-doc-divider"></div>

          {/* Embedded Official PDF Document Viewer */}
          <div className="resume-pdf-container">
            {/* Terminal / Document Window Top Bar */}
            <div className="resume-pdf-header-bar">
              <div className="resume-pdf-window-dots">
                <span className="dot dot-red"></span>
                <span className="dot dot-yellow"></span>
                <span className="dot dot-green"></span>
                <span className="resume-pdf-doc-title">
                  <FiFileText size={13} />
                  {officialPdfName}
                </span>
                <span className="resume-pdf-badge-tag">VERIFIED PDF · ATS OPTIMIZED</span>
              </div>
              <div className="resume-pdf-toolbar-actions">
                <a
                  href={officialPdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="resume-pdf-action-link"
                  title="Open original PDF in full browser window"
                >
                  <FiExternalLink size={13} />
                  <span>New Tab</span>
                </a>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="resume-pdf-action-link"
                  title="Download Resume_Siddharam_Kolle.pdf"
                >
                  <FiDownload size={13} />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Embedded PDF Canvas */}
            <div className="resume-pdf-embed-wrapper">
              <object
                data={`${officialPdfUrl}#toolbar=1&view=FitH`}
                type="application/pdf"
                className="resume-pdf-object"
                aria-label="Official Resume PDF Preview"
              >
                <iframe
                  src={`${officialPdfUrl}#toolbar=1&view=FitH`}
                  title="Official Resume PDF Preview"
                  className="resume-pdf-iframe"
                >
                  <div className="resume-pdf-fallback">
                    <FiFileText size={44} className="fallback-icon" />
                    <h4>Official Resume ({officialPdfName})</h4>
                    <p>Your device or browser doesn't render inline PDF documents directly.</p>
                    <div className="fallback-actions">
                      <a
                        href={officialPdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="resume-cta-btn resume-btn-download-secondary"
                      >
                        <FiExternalLink size={15} />
                        <span>Open PDF in New Window</span>
                      </a>
                      <button
                        type="button"
                        onClick={handleDownload}
                        className="resume-cta-btn resume-btn-download-primary"
                      >
                        <FiDownload size={15} />
                        <span>Download PDF Directly</span>
                      </button>
                    </div>
                  </div>
                </iframe>
              </object>
            </div>
          </div>

          {/* Document Footer */}
          <footer className="resume-doc-footer">
            <div className="doc-footer-legal">
              <span>Official Technical Portfolio & Resume · {profile.name}</span>
              <span className="footer-dot">•</span>
              <span>Authentic Document: {officialPdfName}</span>
            </div>
            <div className="doc-footer-cta">
              <button
                type="button"
                className="btn-doc-footer-contact"
                onClick={() => {
                  soundManager.playClick();
                  onNavigate('contact');
                }}
              >
                <span>Get In Touch</span>
                <span>→</span>
              </button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
