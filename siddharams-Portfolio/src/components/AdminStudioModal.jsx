import { useState, useEffect } from 'react';
import {
  getTimeline,
  addTimelineItem,
  updateTimelineItem,
  deleteTimelineItem,
  reorderTimeline,
  getCredentials,
  addCredentialItem,
  updateCredentialItem,
  deleteCredentialItem,
  reorderCredentials,
  getAcademicDetails,
  saveAcademicDetails,
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  reorderProjects,
  verifyAdminLogin,
  isAdminLoggedIn,
  logoutAdmin,
  updateAdminCredentials,
  resetAllToDefaults,
  getResumeConfig,
  saveResumeConfig,
} from '../utils/portfolioStorage';
import { soundManager } from '../utils/soundEffects';
import {
  FiX,
  FiLock,
  FiUnlock,
  FiUser,
  FiKey,
  FiShield,
  FiClock,
  FiBookOpen,
  FiCode,
  FiFolder,
  FiAward,
  FiFileText,
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiArrowUp,
  FiArrowDown,
  FiCheck,
  FiRotateCcw,
  FiSave,
  FiLogOut,
  FiAlertTriangle,
  FiEye,
  FiEyeOff,
} from 'react-icons/fi';

export default function AdminStudioModal({ isOpen, onClose }) {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => isAdminLoggedIn());
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Active navigation tab once authenticated
  const [activeTab, setActiveTab] = useState('academic'); // 'academic' | 'internships' | 'skills' | 'projects' | 'credentials' | 'security'

  // Data states
  const [academicForm, setAcademicForm] = useState(() => getAcademicDetails());
  const [academicSaved, setAcademicSaved] = useState(false);

  const [resumeForm, setResumeForm] = useState(() => getResumeConfig());
  const [resumeSaved, setResumeSaved] = useState(false);

  const [timelineItems, setTimelineItems] = useState(() => getTimeline());
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const [milestoneForm, setMilestoneForm] = useState({
    title: '',
    organization: '',
    type: 'Career',
    date: '',
    period: '',
    status: 'Completed',
    description: '',
    skills: '',
    details: '',
  });

  const [skillsData, setSkillsData] = useState(() => getSkills());
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [skillForm, setSkillForm] = useState({
    category: 'Blockchain',
    name: '',
    color: '#00f0ff',
    icon: 'SiSolidity',
  });

  const [projectsList, setProjectsList] = useState(() => getProjects());
  const [editingProject, setEditingProject] = useState(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    tags: '',
    liveUrl: '',
    githubUrl: '',
  });

  const [credentialsList, setCredentialsList] = useState(() => getCredentials());
  const [editingCredential, setEditingCredential] = useState(null);
  const [isAddingCredential, setIsAddingCredential] = useState(false);
  const [credentialForm, setCredentialForm] = useState({
    title: '',
    issuer: '',
    type: 'Professional Internship Certificate',
    date: '',
    credentialId: '',
    verifyUrl: '',
    imageUrl: '/src/assets/certificate-skillinfytech.svg',
    description: '',
    skills: '',
  });

  // Security Credentials form
  const [newAdminUser, setNewAdminUser] = useState('siddharam');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [securitySuccess, setSecuritySuccess] = useState(false);

  useEffect(() => {
    setIsAuthenticated(isAdminLoggedIn());
  }, [isOpen]);

  if (!isOpen) return null;

  // ------------------------------------------
  // LOGIN & AUTH HANDLERS
  // ------------------------------------------
  const handleLogin = (e) => {
    e.preventDefault();
    soundManager.playClick();
    const res = verifyAdminLogin(loginUser, loginPass);
    if (res.success) {
      setIsAuthenticated(true);
      setLoginError('');
      setLoginPass('');
    } else {
      soundManager.playBlip(300, 0.2);
      setLoginError(res.message || 'Access Denied');
    }
  };

  const handleLogout = () => {
    soundManager.playClick();
    logoutAdmin();
    setIsAuthenticated(false);
    setLoginError('');
  };

  const handleUpdateSecurity = (e) => {
    e.preventDefault();
    soundManager.playClick();
    if (!newAdminPass.trim()) {
      alert('Password cannot be empty');
      return;
    }
    updateAdminCredentials(newAdminUser, newAdminPass);
    setSecuritySuccess(true);
    setTimeout(() => setSecuritySuccess(false), 2500);
  };

  // ------------------------------------------
  // ACADEMIC HANDLERS
  // ------------------------------------------
  const handleSaveAcademic = (e) => {
    e.preventDefault();
    soundManager.playClick();
    saveAcademicDetails(academicForm);
    setAcademicSaved(true);
    setTimeout(() => setAcademicSaved(false), 2000);
  };

  // ------------------------------------------
  // TIMELINE / INTERNSHIP HANDLERS
  // ------------------------------------------
  const handleStartAddMilestone = () => {
    soundManager.playClick();
    setEditingMilestone(null);
    setMilestoneForm({
      title: '',
      organization: '',
      type: 'Career',
      date: '2026',
      period: '8 Weeks',
      status: 'Completed',
      description: '',
      skills: 'Solidity, Smart Contracts, EVM',
      details: 'Conducted smart contract development\nTested EVM deployment pipeline',
    });
    setIsAddingMilestone(true);
  };

  const handleStartEditMilestone = (m) => {
    soundManager.playClick();
    setIsAddingMilestone(false);
    setEditingMilestone(m.id);
    setMilestoneForm({
      title: m.title || '',
      organization: m.organization || '',
      type: m.type || 'Career',
      date: m.date || '',
      period: m.period || '',
      status: m.status || 'Completed',
      description: m.description || '',
      skills: Array.isArray(m.skills) ? m.skills.join(', ') : m.skills || '',
      details: Array.isArray(m.details) ? m.details.join('\n') : m.details || '',
    });
  };

  const handleSaveMilestone = (e) => {
    e.preventDefault();
    soundManager.playClick();
    if (isAddingMilestone) {
      const updated = addTimelineItem(milestoneForm);
      setTimelineItems(updated);
      setIsAddingMilestone(false);
    } else if (editingMilestone) {
      const updated = updateTimelineItem(editingMilestone, milestoneForm);
      setTimelineItems(updated);
      setEditingMilestone(null);
    }
  };

  const handleDeleteMilestone = (id) => {
    if (window.confirm('Delete this milestone from timeline?')) {
      soundManager.playClick();
      const updated = deleteTimelineItem(id);
      setTimelineItems(updated);
    }
  };

  const handleMoveMilestone = (index, direction) => {
    soundManager.playClick();
    const toIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = reorderTimeline(index, toIndex);
    setTimelineItems(updated);
  };

  // ------------------------------------------
  // SKILLS HANDLERS
  // ------------------------------------------
  const handleSaveSkill = (e) => {
    e.preventDefault();
    soundManager.playClick();
    const updated = addSkill(skillForm.category, {
      name: skillForm.name,
      color: skillForm.color || '#00f0ff',
      icon: skillForm.icon || 'SiSolidity',
    });
    setSkillsData(updated);
    setIsAddingSkill(false);
    setSkillForm({ category: 'Blockchain', name: '', color: '#00f0ff', icon: 'SiSolidity' });
  };

  const handleDeleteSkill = (cat, index) => {
    if (window.confirm(`Delete skill from ${cat}?`)) {
      soundManager.playClick();
      const updated = deleteSkill(cat, index);
      setSkillsData(updated);
    }
  };

  // ------------------------------------------
  // PROJECTS HANDLERS
  // ------------------------------------------
  const handleStartAddProject = () => {
    soundManager.playClick();
    setEditingProject(null);
    setProjectForm({
      title: '',
      description: '',
      tags: 'Solidity, Ethereum, React',
      liveUrl: 'https://',
      githubUrl: 'https://github.com/siddharamkolle/',
    });
    setIsAddingProject(true);
  };

  const handleStartEditProject = (p, idx) => {
    soundManager.playClick();
    setIsAddingProject(false);
    setEditingProject(idx);
    setProjectForm({
      title: p.title || '',
      description: p.description || '',
      tags: Array.isArray(p.tags) ? p.tags.join(', ') : p.tags || '',
      liveUrl: p.liveUrl || '',
      githubUrl: p.githubUrl || '',
    });
  };

  const handleSaveProject = (e) => {
    e.preventDefault();
    soundManager.playClick();
    if (isAddingProject) {
      const updated = addProject(projectForm);
      setProjectsList(updated);
      setIsAddingProject(false);
    } else if (editingProject !== null) {
      const updated = updateProject(editingProject, projectForm);
      setProjectsList(updated);
      setEditingProject(null);
    }
  };

  const handleDeleteProject = (idx) => {
    if (window.confirm('Delete this project from showcase?')) {
      soundManager.playClick();
      const updated = deleteProject(idx);
      setProjectsList(updated);
    }
  };

  const handleMoveProject = (index, direction) => {
    soundManager.playClick();
    const toIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = reorderProjects(index, toIndex);
    setProjectsList(updated);
  };

  // ------------------------------------------
  // CREDENTIALS HANDLERS
  // ------------------------------------------
  const handleStartAddCredential = () => {
    soundManager.playClick();
    setEditingCredential(null);
    setCredentialForm({
      title: '',
      issuer: 'SkillInfytech IT Solutions Private Limited',
      type: 'Professional Internship Certificate',
      date: 'August 2026',
      credentialId: `SI-BT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      verifyUrl: 'https://skillinfytech.com/verify/',
      imageUrl: '/src/assets/certificate-skillinfytech.svg',
      description: '',
      skills: 'Solidity, Ethereum, Hardhat',
    });
    setIsAddingCredential(true);
  };

  const handleStartEditCredential = (c) => {
    soundManager.playClick();
    setIsAddingCredential(false);
    setEditingCredential(c.id);
    setCredentialForm({
      title: c.title || '',
      issuer: c.issuer || '',
      type: c.type || 'Professional Internship Certificate',
      date: c.date || '',
      credentialId: c.credentialId || '',
      verifyUrl: c.verifyUrl || '',
      imageUrl: c.imageUrl || '/src/assets/certificate-skillinfytech.svg',
      description: c.description || '',
      skills: Array.isArray(c.skills) ? c.skills.join(', ') : c.skills || '',
    });
  };

  const handleSaveCredential = (e) => {
    e.preventDefault();
    soundManager.playClick();
    if (isAddingCredential) {
      const updated = addCredentialItem(credentialForm);
      setCredentialsList(updated);
      setIsAddingCredential(false);
    } else if (editingCredential) {
      const updated = updateCredentialItem(editingCredential, credentialForm);
      setCredentialsList(updated);
      setEditingCredential(null);
    }
  };

  const handleDeleteCredential = (id) => {
    if (window.confirm('Delete this credential?')) {
      soundManager.playClick();
      const updated = deleteCredentialItem(id);
      setCredentialsList(updated);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all portfolio data back to default initial values?')) {
      soundManager.playClick();
      resetAllToDefaults();
      setTimelineItems(getTimeline());
      setCredentialsList(getCredentials());
      setAcademicForm(getAcademicDetails());
      setSkillsData(getSkills());
      setProjectsList(getProjects());
      alert('Portfolio data reset to defaults successfully!');
    }
  };

  return (
    <div className="modal-backdrop admin-modal-backdrop" onClick={onClose}>
      <div className="modal-dialog admin-studio-dialog" onClick={(e) => e.stopPropagation()}>
        {/* If NOT Authenticated: Render High-Security Login Screen */}
        {!isAuthenticated ? (
          <div className="admin-login-screen">
            <div className="admin-login-header">
              <div className="security-icon-halo">
                <FiShield size={36} />
              </div>
              <div className="security-badge-tag">RESTRICTED ACCESS // AUTHORIZED ACCESS ONLY</div>
              <h3 className="admin-login-title">Siddharam's Admin Studio</h3>
              <p className="admin-login-sub">
                This management studio is strictly protected and accessible only by <strong>Siddharam</strong> with valid credentials.
              </p>
            </div>

            <form className="admin-login-form" onSubmit={handleLogin}>
              {loginError && (
                <div className="admin-error-banner">
                  <FiAlertTriangle size={15} />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="form-field">
                <label>
                  <FiUser size={12} /> User ID
                </label>
                <div className="input-icon-wrap">
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="Enter User ID (siddharam)"
                    value={loginUser}
                    onChange={(e) => setLoginUser(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-field">
                <label>
                  <FiKey size={12} /> Password
                </label>
                <div className="input-icon-wrap">
                  <input
                    type={showLoginPass ? 'text' : 'password'}
                    required
                    placeholder="Enter Secure Password"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn-toggle-eye"
                    onClick={() => setShowLoginPass(!showLoginPass)}
                    title={showLoginPass ? 'Hide password' : 'Show password'}
                  >
                    {showLoginPass ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                  </button>
                </div>
              </div>


              <div className="admin-login-actions">
                <button type="submit" className="btn-primary-glow btn-login-submit">
                  <FiUnlock size={15} />
                  <span>Authenticate &amp; Enter Studio</span>
                </button>
                <button type="button" className="btn-glass" onClick={onClose}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* If Authenticated: Render Full Portfolio Management Studio */
          <>
            <div className="admin-studio-header">
              <div className="admin-title-wrap">
                <span className="admin-badge-icon">⚡</span>
                <div>
                  <div className="admin-auth-indicator">
                    <span className="auth-pulse-dot"></span>
                    <span>AUTHENTICATED: SIDDHARAM</span>
                  </div>
                  <h3>Portfolio Admin Studio</h3>
                </div>
              </div>

              <div className="admin-top-actions">
                <button
                  className="btn-admin-logout"
                  onClick={handleLogout}
                  title="Logout from Admin Studio"
                >
                  <FiLogOut size={13} />
                  <span>Lock / Logout</span>
                </button>

                <button
                  className="btn-admin-reset"
                  onClick={handleResetDefaults}
                  title="Reset all modifications back to default data"
                >
                  <FiRotateCcw size={13} />
                  <span>Reset All</span>
                </button>

                <button className="modal-close-btn" onClick={onClose} title="Close Studio">
                  <FiX size={18} />
                </button>
              </div>
            </div>

            {/* Studio Navigation Tabs */}
            <div className="admin-tabs-bar">
              <button
                className={`admin-tab-btn ${activeTab === 'academic' ? 'active' : ''}`}
                onClick={() => {
                  soundManager.playClick();
                  setActiveTab('academic');
                }}
              >
                <FiBookOpen size={14} />
                <span>🎓 Academic Foundation</span>
              </button>

              <button
                className={`admin-tab-btn ${activeTab === 'internships' ? 'active' : ''}`}
                onClick={() => {
                  soundManager.playClick();
                  setActiveTab('internships');
                }}
              >
                <FiClock size={14} />
                <span>💼 Internships &amp; Timeline ({timelineItems.length})</span>
              </button>

              <button
                className={`admin-tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
                onClick={() => {
                  soundManager.playClick();
                  setActiveTab('skills');
                }}
              >
                <FiCode size={14} />
                <span>⚡ Skills Matrix</span>
              </button>

              <button
                className={`admin-tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
                onClick={() => {
                  soundManager.playClick();
                  setActiveTab('projects');
                }}
              >
                <FiFolder size={14} />
                <span>🚀 Projects ({projectsList.length})</span>
              </button>

              <button
                className={`admin-tab-btn ${activeTab === 'credentials' ? 'active' : ''}`}
                onClick={() => {
                  soundManager.playClick();
                  setActiveTab('credentials');
                }}
              >
                <FiAward size={14} />
                <span>📜 Credentials ({credentialsList.length})</span>
              </button>

              <button
                className={`admin-tab-btn ${activeTab === 'resume' ? 'active' : ''}`}
                onClick={() => {
                  soundManager.playClick();
                  setActiveTab('resume');
                }}
              >
                <FiFileText size={14} />
                <span>📄 Resume &amp; CV</span>
              </button>

              <button
                className={`admin-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => {
                  soundManager.playClick();
                  setActiveTab('security');
                }}
              >
                <FiShield size={14} />
                <span>🛡️ Security</span>
              </button>
            </div>

            {/* Studio Body Content */}
            <div className="admin-studio-body">
              {/* TAB 1: ACADEMIC FOUNDATION */}
              {activeTab === 'academic' && (
                <div className="admin-tab-pane">
                  <p className="pane-help-text">
                    Update student enrollment details, university PRN, branch, division, and core academic highlights.
                  </p>

                  <form className="admin-editor-form" onSubmit={handleSaveAcademic}>
                    <div className="form-grid-2col">
                      <div className="form-field">
                        <label>Student Full Name</label>
                        <input
                          type="text"
                          required
                          value={academicForm.fullName || ''}
                          onChange={(e) => setAcademicForm({ ...academicForm, fullName: e.target.value })}
                        />
                      </div>

                      <div className="form-field">
                        <label>Student PRN / Roll Number</label>
                        <input
                          type="text"
                          required
                          value={academicForm.prn || ''}
                          onChange={(e) => setAcademicForm({ ...academicForm, prn: e.target.value })}
                        />
                      </div>

                      <div className="form-field">
                        <label>Year &amp; Section Division</label>
                        <input
                          type="text"
                          required
                          value={academicForm.classYear ? `${academicForm.classYear} | ${academicForm.sectionDivision || ''}` : ''}
                          onChange={(e) => {
                            const [yr, div] = e.target.value.split('|');
                            setAcademicForm({
                              ...academicForm,
                              classYear: (yr || '').trim(),
                              sectionDivision: (div || '').trim(),
                            });
                          }}
                          placeholder="2nd year | Section Division-E"
                        />
                      </div>

                      <div className="form-field">
                        <label>University / Institution</label>
                        <input
                          type="text"
                          required
                          value={academicForm.institution || ''}
                          onChange={(e) => setAcademicForm({ ...academicForm, institution: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-field">
                      <label>Degree Program</label>
                      <input
                        type="text"
                        required
                        value={academicForm.program || ''}
                        onChange={(e) => setAcademicForm({ ...academicForm, program: e.target.value })}
                      />
                    </div>

                    <div className="form-field">
                      <label>Department</label>
                      <input
                        type="text"
                        required
                        value={academicForm.department || ''}
                        onChange={(e) => setAcademicForm({ ...academicForm, department: e.target.value })}
                      />
                    </div>

                    <div className="form-field">
                      <label>Curriculum Highlights (One bullet per line)</label>
                      <textarea
                        rows={3}
                        value={Array.isArray(academicForm.highlights) ? academicForm.highlights.join('\n') : academicForm.highlights || ''}
                        onChange={(e) => setAcademicForm({ ...academicForm, highlights: e.target.value })}
                      />
                    </div>

                    <div className="form-actions-row">
                      <button type="submit" className="btn-primary-glow btn-sm">
                        <FiSave size={14} />
                        <span>Save Academic Details</span>
                      </button>
                      {academicSaved && (
                        <span className="save-success-msg">
                          <FiCheck size={14} /> Academic Foundation Updated!
                        </span>
                      )}
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 2: INTERNSHIPS & TIMELINE */}
              {activeTab === 'internships' && (
                <div className="admin-tab-pane">
                  <div className="pane-header-row">
                    <p className="pane-help-text">
                      Manage Blockchain internships and career milestones. Add, edit, delete, and reorder.
                    </p>
                    {!isAddingMilestone && !editingMilestone && (
                      <button className="btn-primary-glow btn-sm" onClick={handleStartAddMilestone}>
                        <FiPlus size={14} />
                        <span>Add Internship / Milestone</span>
                      </button>
                    )}
                  </div>

                  {/* Add / Edit Milestone Form */}
                  {(isAddingMilestone || editingMilestone) && (
                    <form className="admin-editor-form" onSubmit={handleSaveMilestone}>
                      <div className="form-header-bar">
                        <h4>{isAddingMilestone ? 'New Milestone' : 'Edit Milestone'}</h4>
                        <button
                          type="button"
                          className="btn-glass btn-xs"
                          onClick={() => {
                            setIsAddingMilestone(false);
                            setEditingMilestone(null);
                          }}
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="form-grid-2col">
                        <div className="form-field">
                          <label>Title / Role</label>
                          <input
                            type="text"
                            required
                            value={milestoneForm.title}
                            onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                            placeholder="e.g. Blockchain Technology Intern"
                          />
                        </div>

                        <div className="form-field">
                          <label>Organization / Company</label>
                          <input
                            type="text"
                            required
                            value={milestoneForm.organization}
                            onChange={(e) => setMilestoneForm({ ...milestoneForm, organization: e.target.value })}
                            placeholder="e.g. SkillInfytech IT Solutions"
                          />
                        </div>

                        <div className="form-field">
                          <label>Type</label>
                          <select
                            value={milestoneForm.type}
                            onChange={(e) => setMilestoneForm({ ...milestoneForm, type: e.target.value })}
                          >
                            <option value="Career">Career Experience / Internship</option>
                            <option value="Education">Education</option>
                          </select>
                        </div>

                        <div className="form-field">
                          <label>Status</label>
                          <input
                            type="text"
                            value={milestoneForm.status}
                            onChange={(e) => setMilestoneForm({ ...milestoneForm, status: e.target.value })}
                            placeholder="Completed / In Progress / Current"
                          />
                        </div>

                        <div className="form-field">
                          <label>Date / Duration</label>
                          <input
                            type="text"
                            required
                            value={milestoneForm.date}
                            onChange={(e) => setMilestoneForm({ ...milestoneForm, date: e.target.value })}
                            placeholder="22 May 2026 – 07 August 2026"
                          />
                        </div>

                        <div className="form-field">
                          <label>Period Subtext</label>
                          <input
                            type="text"
                            value={milestoneForm.period}
                            onChange={(e) => setMilestoneForm({ ...milestoneForm, period: e.target.value })}
                            placeholder="8 Weeks Intensive"
                          />
                        </div>
                      </div>

                      <div className="form-field">
                        <label>Overview</label>
                        <textarea
                          rows={2}
                          required
                          value={milestoneForm.description}
                          onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
                        />
                      </div>

                      <div className="form-field">
                        <label>Skills (Comma-separated)</label>
                        <input
                          type="text"
                          value={milestoneForm.skills}
                          onChange={(e) => setMilestoneForm({ ...milestoneForm, skills: e.target.value })}
                        />
                      </div>

                      <div className="form-field">
                        <label>Key Bullet Points (One per line)</label>
                        <textarea
                          rows={3}
                          value={milestoneForm.details}
                          onChange={(e) => setMilestoneForm({ ...milestoneForm, details: e.target.value })}
                        />
                      </div>

                      <div className="form-actions-row">
                        <button type="submit" className="btn-primary-glow btn-sm">
                          <FiSave size={14} />
                          <span>Save Milestone</span>
                        </button>
                        <button
                          type="button"
                          className="btn-glass btn-sm"
                          onClick={() => {
                            setIsAddingMilestone(false);
                            setEditingMilestone(null);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="admin-items-list">
                    {timelineItems.map((item, idx) => (
                      <div className="admin-item-row" key={item.id || idx}>
                        <div className="reorder-btns-col">
                          <button
                            className="btn-order"
                            onClick={() => handleMoveMilestone(idx, 'up')}
                            disabled={idx === 0}
                            title="Move Up"
                          >
                            <FiArrowUp size={12} />
                          </button>
                          <button
                            className="btn-order"
                            onClick={() => handleMoveMilestone(idx, 'down')}
                            disabled={idx === timelineItems.length - 1}
                            title="Move Down"
                          >
                            <FiArrowDown size={12} />
                          </button>
                        </div>

                        <div className="admin-item-info">
                          <div className="item-title-line">
                            <strong>{item.title}</strong>
                            <span className="badge-pill">{item.type}</span>
                            <span className="badge-status">{item.status}</span>
                          </div>
                          <div className="item-sub-line">
                            <span>{item.organization}</span> · <span>{item.date}</span>
                          </div>
                        </div>

                        <div className="admin-item-actions">
                          <button
                            className="btn-glass btn-xs"
                            onClick={() => handleStartEditMilestone(item)}
                          >
                            <FiEdit2 size={13} /> Edit
                          </button>
                          <button
                            className="btn-glass btn-xs btn-danger"
                            onClick={() => handleDeleteMilestone(item.id)}
                          >
                            <FiTrash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: SKILLS MATRIX */}
              {activeTab === 'skills' && (
                <div className="admin-tab-pane">
                  <div className="pane-header-row">
                    <p className="pane-help-text">
                      Manage skills across Languages, Development, Blockchain, and Tools.
                    </p>
                    {!isAddingSkill && (
                      <button className="btn-primary-glow btn-sm" onClick={() => setIsAddingSkill(true)}>
                        <FiPlus size={14} />
                        <span>Add New Skill</span>
                      </button>
                    )}
                  </div>

                  {isAddingSkill && (
                    <form className="admin-editor-form" onSubmit={handleSaveSkill}>
                      <div className="form-header-bar">
                        <h4>Add New Skill</h4>
                        <button type="button" className="btn-glass btn-xs" onClick={() => setIsAddingSkill(false)}>
                          Cancel
                        </button>
                      </div>

                      <div className="form-grid-2col">
                        <div className="form-field">
                          <label>Category</label>
                          <select
                            value={skillForm.category}
                            onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                          >
                            <option value="Blockchain">Blockchain</option>
                            <option value="Languages">Languages</option>
                            <option value="Development">Development</option>
                            <option value="Tools">Tools</option>
                          </select>
                        </div>

                        <div className="form-field">
                          <label>Skill Name</label>
                          <input
                            type="text"
                            required
                            value={skillForm.name}
                            onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                            placeholder="e.g. Solidity / Rust / Foundry"
                          />
                        </div>

                        <div className="form-field">
                          <label>Hex Accent Color</label>
                          <input
                            type="text"
                            value={skillForm.color}
                            onChange={(e) => setSkillForm({ ...skillForm, color: e.target.value })}
                            placeholder="#00f0ff"
                          />
                        </div>
                      </div>

                      <div className="form-actions-row">
                        <button type="submit" className="btn-primary-glow btn-sm">
                          <FiSave size={14} />
                          <span>Save Skill</span>
                        </button>
                        <button type="button" className="btn-glass btn-sm" onClick={() => setIsAddingSkill(false)}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="admin-skills-grouped">
                    {Object.entries(skillsData).map(([cat, items]) => (
                      <div className="admin-skill-category-block" key={cat}>
                        <div className="category-block-title">{cat} ({items.length})</div>
                        <div className="admin-skills-chip-list">
                          {(Array.isArray(items) ? items : []).map((sk, sIdx) => (
                            <div className="admin-skill-chip-item" key={sIdx}>
                              <span className="skill-color-indicator" style={{ backgroundColor: sk.color || '#00f0ff' }}></span>
                              <span className="skill-chip-name">{sk.name}</span>
                              <button
                                type="button"
                                className="btn-delete-chip"
                                onClick={() => handleDeleteSkill(cat, sIdx)}
                                title="Delete Skill"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: PROJECTS */}
              {activeTab === 'projects' && (
                <div className="admin-tab-pane">
                  <div className="pane-header-row">
                    <p className="pane-help-text">
                      Manage featured Web3 and smart contract projects. Add, edit, reorder, or remove projects.
                    </p>
                    {!isAddingProject && editingProject === null && (
                      <button className="btn-primary-glow btn-sm" onClick={handleStartAddProject}>
                        <FiPlus size={14} />
                        <span>Add Project</span>
                      </button>
                    )}
                  </div>

                  {/* Add / Edit Project Form */}
                  {(isAddingProject || editingProject !== null) && (
                    <form className="admin-editor-form" onSubmit={handleSaveProject}>
                      <div className="form-header-bar">
                        <h4>{isAddingProject ? 'New Project' : 'Edit Project'}</h4>
                        <button
                          type="button"
                          className="btn-glass btn-xs"
                          onClick={() => {
                            setIsAddingProject(false);
                            setEditingProject(null);
                          }}
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="form-grid-2col">
                        <div className="form-field">
                          <label>Project Title</label>
                          <input
                            type="text"
                            required
                            value={projectForm.title}
                            onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                            placeholder="e.g. NFT Minting Platform"
                          />
                        </div>

                        <div className="form-field">
                          <label>Live URL</label>
                          <input
                            type="text"
                            value={projectForm.liveUrl}
                            onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                            placeholder="https://..."
                          />
                        </div>

                        <div className="form-field">
                          <label>GitHub Repository URL</label>
                          <input
                            type="text"
                            value={projectForm.githubUrl}
                            onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                            placeholder="https://github.com/..."
                          />
                        </div>

                        <div className="form-field">
                          <label>Tech Stack Tags (Comma-separated)</label>
                          <input
                            type="text"
                            value={projectForm.tags}
                            onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                            placeholder="Solidity, Hardhat, Ethers.js, MetaMask"
                          />
                        </div>
                      </div>

                      <div className="form-field">
                        <label>Description</label>
                        <textarea
                          rows={2}
                          required
                          value={projectForm.description}
                          onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                        />
                      </div>

                      <div className="form-actions-row">
                        <button type="submit" className="btn-primary-glow btn-sm">
                          <FiSave size={14} />
                          <span>Save Project</span>
                        </button>
                        <button
                          type="button"
                          className="btn-glass btn-sm"
                          onClick={() => {
                            setIsAddingProject(false);
                            setEditingProject(null);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="admin-items-list">
                    {projectsList.map((p, idx) => (
                      <div className="admin-item-row" key={idx}>
                        <div className="reorder-btns-col">
                          <button
                            className="btn-order"
                            onClick={() => handleMoveProject(idx, 'up')}
                            disabled={idx === 0}
                            title="Move Up"
                          >
                            <FiArrowUp size={12} />
                          </button>
                          <button
                            className="btn-order"
                            onClick={() => handleMoveProject(idx, 'down')}
                            disabled={idx === projectsList.length - 1}
                            title="Move Down"
                          >
                            <FiArrowDown size={12} />
                          </button>
                        </div>

                        <div className="admin-item-info">
                          <div className="item-title-line">
                            <strong>{p.title}</strong>
                            <span className="badge-pill">Web3 Project</span>
                          </div>
                          <div className="item-sub-line">
                            <span>{p.liveUrl || 'No Live URL'}</span> · <span>{p.githubUrl || 'No Repo'}</span>
                          </div>
                        </div>

                        <div className="admin-item-actions">
                          <button
                            className="btn-glass btn-xs"
                            onClick={() => handleStartEditProject(p, idx)}
                          >
                            <FiEdit2 size={13} /> Edit
                          </button>
                          <button
                            className="btn-glass btn-xs btn-danger"
                            onClick={() => handleDeleteProject(idx)}
                          >
                            <FiTrash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: CREDENTIALS (INTERNSHIP ONLY) */}
              {activeTab === 'credentials' && (
                <div className="admin-tab-pane">
                  <div className="pane-header-row">
                    <p className="pane-help-text">
                      Manage verified internship certificates.
                    </p>
                    {!isAddingCredential && !editingCredential && (
                      <button className="btn-primary-glow btn-sm" onClick={handleStartAddCredential}>
                        <FiPlus size={14} />
                        <span>Add Certificate</span>
                      </button>
                    )}
                  </div>

                  {/* Add / Edit Credential Form */}
                  {(isAddingCredential || editingCredential) && (
                    <form className="admin-editor-form" onSubmit={handleSaveCredential}>
                      <div className="form-header-bar">
                        <h4>{isAddingCredential ? 'New Verified Credential' : 'Edit Credential'}</h4>
                        <button
                          type="button"
                          className="btn-glass btn-xs"
                          onClick={() => {
                            setIsAddingCredential(false);
                            setEditingCredential(null);
                          }}
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="form-grid-2col">
                        <div className="form-field">
                          <label>Certificate Title</label>
                          <input
                            type="text"
                            required
                            value={credentialForm.title}
                            onChange={(e) => setCredentialForm({ ...credentialForm, title: e.target.value })}
                            placeholder="e.g. Blockchain Technology Specialist"
                          />
                        </div>

                        <div className="form-field">
                          <label>Issuing Organization</label>
                          <input
                            type="text"
                            required
                            value={credentialForm.issuer}
                            onChange={(e) => setCredentialForm({ ...credentialForm, issuer: e.target.value })}
                            placeholder="e.g. SkillInfytech IT Solutions"
                          />
                        </div>

                        <div className="form-field">
                          <label>Credential Type</label>
                          <input
                            type="text"
                            value={credentialForm.type}
                            onChange={(e) => setCredentialForm({ ...credentialForm, type: e.target.value })}
                            placeholder="Professional Internship Certificate"
                          />
                        </div>

                        <div className="form-field">
                          <label>Issue Date</label>
                          <input
                            type="text"
                            required
                            value={credentialForm.date}
                            onChange={(e) => setCredentialForm({ ...credentialForm, date: e.target.value })}
                            placeholder="August 2026"
                          />
                        </div>

                        <div className="form-field">
                          <label>Credential ID</label>
                          <input
                            type="text"
                            value={credentialForm.credentialId}
                            onChange={(e) => setCredentialForm({ ...credentialForm, credentialId: e.target.value })}
                            placeholder="SI-BT-2026-08819"
                          />
                        </div>

                        <div className="form-field">
                          <label>Verification Link URL</label>
                          <input
                            type="text"
                            value={credentialForm.verifyUrl}
                            onChange={(e) => setCredentialForm({ ...credentialForm, verifyUrl: e.target.value })}
                            placeholder="https://..."
                          />
                        </div>
                      </div>

                      <div className="form-field">
                        <label>Description</label>
                        <textarea
                          rows={2}
                          required
                          value={credentialForm.description}
                          onChange={(e) => setCredentialForm({ ...credentialForm, description: e.target.value })}
                        />
                      </div>

                      <div className="form-field">
                        <label>Skills (Comma-separated)</label>
                        <input
                          type="text"
                          value={credentialForm.skills}
                          onChange={(e) => setCredentialForm({ ...credentialForm, skills: e.target.value })}
                        />
                      </div>

                      <div className="form-actions-row">
                        <button type="submit" className="btn-primary-glow btn-sm">
                          <FiSave size={14} />
                          <span>Save Credential</span>
                        </button>
                        <button
                          type="button"
                          className="btn-glass btn-sm"
                          onClick={() => {
                            setIsAddingCredential(false);
                            setEditingCredential(null);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="admin-items-list">
                    {credentialsList.map((cred, idx) => (
                      <div className="admin-item-row" key={cred.id || idx}>
                        <div className="reorder-btns-col">
                          <button
                            className="btn-order"
                            onClick={() => handleMoveCredential(idx, 'up')}
                            disabled={idx === 0}
                            title="Move Up"
                          >
                            <FiArrowUp size={12} />
                          </button>
                          <button
                            className="btn-order"
                            onClick={() => handleMoveCredential(idx, 'down')}
                            disabled={idx === credentialsList.length - 1}
                            title="Move Down"
                          >
                            <FiArrowDown size={12} />
                          </button>
                        </div>

                        <div className="admin-item-info">
                          <div className="item-title-line">
                            <strong>{cred.title}</strong>
                            <span className="badge-pill">{cred.type}</span>
                            {cred.credentialId && <code className="item-code-tag">{cred.credentialId}</code>}
                          </div>
                          <div className="item-sub-line">
                            <span>{cred.issuer}</span> · <span>{cred.date}</span>
                          </div>
                        </div>

                        <div className="admin-item-actions">
                          <button
                            className="btn-glass btn-xs"
                            onClick={() => handleStartEditCredential(cred)}
                          >
                            <FiEdit2 size={13} /> Edit
                          </button>
                          <button
                            className="btn-glass btn-xs btn-danger"
                            onClick={() => handleDeleteCredential(cred.id)}
                          >
                            <FiTrash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: RESUME & CV MANAGEMENT */}
              {activeTab === 'resume' && (
                <div className="admin-tab-pane">
                  <p className="pane-help-text">
                    Manage your downloadable Resume and CV configuration, direct download URLs, ATS professional summary, and recruiter contact info.
                  </p>

                  <form
                    className="admin-editor-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      soundManager.playClick();
                      saveResumeConfig(resumeForm);
                      setResumeSaved(true);
                      setTimeout(() => setResumeSaved(false), 2500);
                    }}
                  >
                    <div className="form-grid-2col">
                      <div className="form-field">
                        <label>Full Legal Name</label>
                        <input
                          type="text"
                          value={resumeForm.fullName || ''}
                          onChange={(e) => setResumeForm({ ...resumeForm, fullName: e.target.value })}
                          placeholder="KOLLE SIDDHARAM DATTAKUMAR"
                        />
                      </div>

                      <div className="form-field">
                        <label>Preferred Professional Name</label>
                        <input
                          type="text"
                          value={resumeForm.preferredName || ''}
                          onChange={(e) => setResumeForm({ ...resumeForm, preferredName: e.target.value })}
                          placeholder="Siddharam Kolle"
                        />
                      </div>

                      <div className="form-field">
                        <label>Professional Title</label>
                        <input
                          type="text"
                          value={resumeForm.professionalTitle || ''}
                          onChange={(e) => setResumeForm({ ...resumeForm, professionalTitle: e.target.value })}
                          placeholder="Web3 & Application Developer | Blockchain Specialist"
                        />
                      </div>

                      <div className="form-field">
                        <label>Recruiter Contact Email</label>
                        <input
                          type="email"
                          value={resumeForm.email || ''}
                          onChange={(e) => setResumeForm({ ...resumeForm, email: e.target.value })}
                          placeholder="siddharamkolle097@gmail.com"
                        />
                      </div>

                      <div className="form-field">
                        <label>Tech Resume Download Path (.PDF)</label>
                        <input
                          type="text"
                          value={resumeForm.resumePdfUrl || ''}
                          onChange={(e) => setResumeForm({ ...resumeForm, resumePdfUrl: e.target.value })}
                          placeholder="/Resume_Siddharam_Kolle.pdf"
                        />
                      </div>

                      <div className="form-field">
                        <label>Academic CV Download Path (.PDF)</label>
                        <input
                          type="text"
                          value={resumeForm.cvPdfUrl || ''}
                          onChange={(e) => setResumeForm({ ...resumeForm, cvPdfUrl: e.target.value })}
                          placeholder="/Resume_Siddharam_Kolle.pdf"
                        />
                      </div>
                    </div>

                    <div className="form-field">
                      <label>Executive Professional Summary (ATS / Recruiter Highlight)</label>
                      <textarea
                        rows={3}
                        value={resumeForm.summary || ''}
                        onChange={(e) => setResumeForm({ ...resumeForm, summary: e.target.value })}
                        placeholder="Executive summary of skills, EVM smart contracts, and projects..."
                      />
                    </div>

                    <div className="form-actions-row">
                      <button type="submit" className="btn-primary-glow btn-sm">
                        <FiSave size={14} />
                        <span>Save Resume &amp; CV Settings</span>
                      </button>
                      {resumeSaved && (
                        <span className="save-success-msg">
                          <FiCheck size={14} /> Resume Settings Saved!
                        </span>
                      )}
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 6: SECURITY & CREDENTIALS */}
              {activeTab === 'security' && (
                <div className="admin-tab-pane">
                  <p className="pane-help-text">
                    Control security credentials for the Admin Studio. Change your User ID and access Password.
                  </p>

                  <form className="admin-editor-form" onSubmit={handleUpdateSecurity}>
                    <div className="form-grid-2col">
                      <div className="form-field">
                        <label>Admin User ID</label>
                        <input
                          type="text"
                          required
                          value={newAdminUser}
                          onChange={(e) => setNewAdminUser(e.target.value)}
                          placeholder="siddharam"
                        />
                      </div>

                      <div className="form-field">
                        <label>New Admin Password</label>
                        <input
                          type="password"
                          required
                          value={newAdminPass}
                          onChange={(e) => setNewAdminPass(e.target.value)}
                          placeholder="Enter new password"
                        />
                      </div>
                    </div>

                    <div className="form-actions-row">
                      <button type="submit" className="btn-primary-glow btn-sm">
                        <FiSave size={14} />
                        <span>Update Security Credentials</span>
                      </button>
                      {securitySuccess && (
                        <span className="save-success-msg">
                          <FiCheck size={14} /> Password Updated Successfully!
                        </span>
                      )}
                    </div>
                  </form>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
