import { useState, useEffect } from 'react';
import { getCredentials, EVENT_DATA_UPDATED } from '../utils/portfolioStorage';
import { soundManager } from '../utils/soundEffects';
import { FiAward, FiCheckCircle, FiExternalLink, FiCopy, FiEye, FiCheck, FiX, FiShield } from 'react-icons/fi';

export default function Credentials() {
  const [credentials, setCredentials] = useState(() => getCredentials());
  const [previewCredential, setPreviewCredential] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const handleUpdate = () => {
      setCredentials(getCredentials());
    };
    window.addEventListener(EVENT_DATA_UPDATED, handleUpdate);
    return () => window.removeEventListener(EVENT_DATA_UPDATED, handleUpdate);
  }, []);

  const handleCopyId = (id, text) => {
    soundManager.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const openPreview = (cred) => {
    soundManager.playClick();
    setPreviewCredential(cred);
  };

  const closePreview = () => {
    soundManager.playClick();
    setPreviewCredential(null);
  };

  return (
    <div className="section-inner credentials-section-v2">
      <div className="section-header-pill">
        <span className="section-pill-dot"></span>
        <span>VERIFIED CREDENTIALS ARCHIVE</span>
      </div>

      <h2 className="section-main-title">
        Certifications & <span className="text-gradient">Professional Proofs</span>
      </h2>

      <p className="section-lead-text">
        Authenticated industry internship credentials and cryptographic achievements demonstrating core technical proficiencies in smart contract engineering.
      </p>

      {/* Credentials Grid */}
      <div className="credentials-grid-v2">
        {credentials.map((cred) => (
          <div
            key={cred.id}
            className="cred-card-v2"
            onMouseEnter={() => soundManager.playHover()}
          >
            {/* Card Window Top Bar */}
            <div className="cred-card-topbar">
              <div className="cred-type-chip">
                <FiAward size={13} />
                <span>{cred.type || 'Certification'}</span>
              </div>
              <div className="cred-verified-badge">
                <FiShield size={12} />
                <span>VERIFIED</span>
              </div>
            </div>

            {/* Certificate Preview Thumbnail Banner */}
            <div
              className="cred-thumbnail-banner"
              onClick={() => openPreview(cred)}
              title="Click to preview certificate"
            >
              <img
                src={cred.imageUrl || '/src/assets/certificate-skillinfytech.svg'}
                alt={cred.title}
                className="cred-thumb-img"
              />
              <div className="cred-thumb-overlay">
                <span className="cred-thumb-action">
                  <FiEye size={16} /> View Certificate
                </span>
              </div>
            </div>

            {/* Card Content Body */}
            <div className="cred-card-body">
              <h3 className="cred-title">{cred.title}</h3>
              <div className="cred-issuer">{cred.issuer}</div>

              {/* Credential ID & Date Row */}
              <div className="cred-meta-strip">
                <div className="cred-date-tag">
                  <span>Issued:</span> <strong>{cred.date}</strong>
                </div>

                {cred.credentialId && (
                  <button
                    className="cred-id-copy-btn"
                    onClick={() => handleCopyId(cred.id, cred.credentialId)}
                    title="Click to copy Credential ID"
                  >
                    <span>ID: {cred.credentialId}</span>
                    {copiedId === cred.id ? (
                      <span className="copied-text"><FiCheck size={12} /> Copied</span>
                    ) : (
                      <FiCopy size={12} />
                    )}
                  </button>
                )}
              </div>

              <p className="cred-description">{cred.description}</p>

              {/* Skills & Technologies Tags */}
              {Array.isArray(cred.skills) && cred.skills.length > 0 && (
                <div className="cred-skills-wrap">
                  {cred.skills.map((s, idx) => (
                    <span className="cred-skill-pill" key={idx}>
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {/* Card Action Buttons */}
              <div className="cred-actions-row">
                <button
                  className="btn-cred-view"
                  onClick={() => openPreview(cred)}
                >
                  <FiEye size={14} />
                  <span>View Certificate</span>
                </button>

                {cred.verifyUrl && (
                  <a
                    href={cred.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-cred-verify"
                    onClick={() => soundManager.playClick()}
                  >
                    <span>Verify Credential</span>
                    <FiExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Certificate High-Res Viewer Modal */}
      {previewCredential && (
        <div className="modal-backdrop" onClick={closePreview}>
          <div className="modal-dialog cert-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <span className="modal-icon">📜</span>
                <div>
                  <h3>{previewCredential.title}</h3>
                  <div className="modal-subtitle-org">{previewCredential.issuer} · {previewCredential.date}</div>
                </div>
              </div>
              <button className="modal-close-btn" onClick={closePreview} title="Close Preview">
                <FiX size={18} />
              </button>
            </div>

            <div className="modal-body cert-modal-body">
              {/* Full Certificate Visual Display */}
              <div className="cert-full-display-frame">
                <img
                  src={previewCredential.imageUrl || '/src/assets/certificate-skillinfytech.svg'}
                  alt={previewCredential.title}
                  className="cert-full-img"
                />
              </div>

              {/* Credential Attributes */}
              <div className="cert-modal-meta-grid">
                <div className="cert-meta-box">
                  <span className="meta-lbl">Credential ID</span>
                  <div className="meta-val-copy">
                    <code>{previewCredential.credentialId || 'N/A'}</code>
                    {previewCredential.credentialId && (
                      <button
                        className="btn-mini-copy"
                        onClick={() => handleCopyId('modal', previewCredential.credentialId)}
                      >
                        {copiedId === 'modal' ? 'Copied ✓' : 'Copy'}
                      </button>
                    )}
                  </div>
                </div>

                <div className="cert-meta-box">
                  <span className="meta-lbl">Verification Status</span>
                  <span className="meta-val-verified">
                    <FiCheckCircle size={14} /> Official & Verified
                  </span>
                </div>

                <div className="cert-meta-box">
                  <span className="meta-lbl">Credential Type</span>
                  <span className="meta-val-text">{previewCredential.type}</span>
                </div>
              </div>

              <div className="cert-modal-actions">
                {previewCredential.verifyUrl && (
                  <a
                    href={previewCredential.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary-glow"
                  >
                    <span>Verify at Official Issuer Portal</span>
                    <FiExternalLink size={14} />
                  </a>
                )}

                <a
                  href={previewCredential.imageUrl || '/src/assets/certificate-skillinfytech.svg'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-glass"
                  download={`Certificate-${previewCredential.title.replace(/\s+/g, '-')}.svg`}
                >
                  Download / Open Asset ↗
                </a>

                <button className="btn-glass" onClick={closePreview}>
                  Close Viewer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
