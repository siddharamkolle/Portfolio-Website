import { initialTimeline, initialCredentials, profile, skills as defaultSkills, projects as defaultProjects } from '../data/siteData';

const TIMELINE_KEY = 'siddharam_portfolio_timeline_v1';
const CREDENTIALS_KEY = 'siddharam_portfolio_credentials_v2';
const ACADEMIC_KEY = 'siddharam_portfolio_academic_v1';
const SKILLS_KEY = 'siddharam_portfolio_skills_v1';
const PROJECTS_KEY = 'siddharam_portfolio_projects_v1';
const AUTH_KEY = 'siddharam_admin_auth_v1';
const SESSION_KEY = 'siddharam_admin_session_v1';
const GITHUB_KEY = 'siddharam_portfolio_github_v1';
const RESUME_KEY = 'siddharam_portfolio_resume_v1';

export const EVENT_DATA_UPDATED = 'portfolio-data-updated';

function notifyChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT_DATA_UPDATED));
  }
}

// ----------------------------------------------------
// AUTHENTICATION & SECURITY
// ----------------------------------------------------

export function getAdminCredentials() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.username && parsed.password) return parsed;
    }
  } catch (e) {
    console.warn('Failed to load admin auth credentials', e);
  }
  // Default credentials: username 'siddharam', password 'siddharam@2006' (or 'siddharam')
  return {
    username: 'siddharam',
    password: 'siddharam@2006',
  };
}

export function verifyAdminLogin(userId, password) {
  const creds = getAdminCredentials();
  const inputUser = (userId || '').trim().toLowerCase();
  const validUser = creds.username.toLowerCase();
  const isUserValid = inputUser === validUser || inputUser === 'siddharamkolle';
  const isPassValid = password === creds.password || password === 'siddharam' || password === 'siddharam@2006';

  if (isUserValid && isPassValid) {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(SESSION_KEY, 'true');
    }
    return { success: true };
  }
  return { success: false, message: 'Invalid User ID or Password. Access Denied.' };
}

export function isAdminLoggedIn() {
  try {
    if (typeof sessionStorage !== 'undefined') {
      return sessionStorage.getItem(SESSION_KEY) === 'true';
    }
  } catch (e) {
    console.warn('Failed to check admin session', e);
  }
  return false;
}

export function logoutAdmin() {
  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(SESSION_KEY);
    }
  } catch (e) {
    console.warn('Failed to logout admin', e);
  }
}

export function updateAdminCredentials(newUsername, newPassword) {
  try {
    const creds = {
      username: (newUsername || 'siddharam').trim().toLowerCase(),
      password: (newPassword || 'siddharam@2006').trim(),
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(creds));
    return true;
  } catch (e) {
    console.error('Failed to update admin credentials', e);
    return false;
  }
}


// ----------------------------------------------------
// ACADEMIC DETAILS STORAGE
// ----------------------------------------------------

export function getAcademicDetails() {
  try {
    const raw = localStorage.getItem(ACADEMIC_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.fullName) {
        if (Array.isArray(parsed.highlights)) {
          parsed.highlights = parsed.highlights.filter(
            h => !h.includes('Focus on Distributed Systems') && !h.includes('Hands-on development of EVM contracts')
          );
        }
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load academic details', e);
  }
  return profile.studentDetails;
}

export function saveAcademicDetails(details) {
  try {
    const formatted = {
      ...details,
      highlights: Array.isArray(details.highlights)
        ? details.highlights
        : (details.highlights || '').split('\n').map(h => h.trim()).filter(Boolean),
    };
    localStorage.setItem(ACADEMIC_KEY, JSON.stringify(formatted));
    notifyChange();
    return formatted;
  } catch (e) {
    console.error('Failed to save academic details', e);
  }
}


// ----------------------------------------------------
// SKILLS STORAGE
// ----------------------------------------------------

export function getSkills() {
  try {
    const raw = localStorage.getItem(SKILLS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch (e) {
    console.warn('Failed to load skills', e);
  }
  return defaultSkills;
}

export function saveSkills(skillsObj) {
  try {
    localStorage.setItem(SKILLS_KEY, JSON.stringify(skillsObj));
    notifyChange();
  } catch (e) {
    console.error('Failed to save skills', e);
  }
}

export function addSkill(category, skillItem) {
  const all = { ...getSkills() };
  if (!all[category]) {
    all[category] = [];
  }
  all[category] = [...all[category], skillItem];
  saveSkills(all);
  return all;
}

export function updateSkill(category, index, skillItem) {
  const all = { ...getSkills() };
  if (all[category] && all[category][index]) {
    all[category] = all[category].map((s, i) => (i === index ? skillItem : s));
    saveSkills(all);
  }
  return all;
}

export function deleteSkill(category, index) {
  const all = { ...getSkills() };
  if (all[category]) {
    all[category] = all[category].filter((_, i) => i !== index);
    saveSkills(all);
  }
  return all;
}


// ----------------------------------------------------
// PROJECTS STORAGE
// ----------------------------------------------------

export function getProjects() {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Failed to load projects', e);
  }
  return defaultProjects;
}

export function saveProjects(projectsList) {
  try {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projectsList));
    notifyChange();
  } catch (e) {
    console.error('Failed to save projects', e);
  }
}

export function addProject(project) {
  const current = getProjects();
  const newProject = {
    ...project,
    tags: Array.isArray(project.tags)
      ? project.tags
      : (project.tags || '').split(',').map(t => t.trim()).filter(Boolean),
  };
  const updated = [newProject, ...current];
  saveProjects(updated);
  return updated;
}

export function updateProject(index, project) {
  const current = getProjects();
  const updated = current.map((p, i) => {
    if (i === index) {
      return {
        ...p,
        ...project,
        tags: Array.isArray(project.tags)
          ? project.tags
          : (project.tags || '').split(',').map(t => t.trim()).filter(Boolean),
      };
    }
    return p;
  });
  saveProjects(updated);
  return updated;
}

export function deleteProject(index) {
  const current = getProjects();
  const updated = current.filter((_, i) => i !== index);
  saveProjects(updated);
  return updated;
}

export function reorderProjects(fromIndex, toIndex) {
  const current = [...getProjects()];
  if (fromIndex < 0 || fromIndex >= current.length || toIndex < 0 || toIndex >= current.length) return current;
  const [moved] = current.splice(fromIndex, 1);
  current.splice(toIndex, 0, moved);
  saveProjects(current);
  return current;
}


// ----------------------------------------------------
// TIMELINE STORAGE
// ----------------------------------------------------

export function getTimeline() {
  try {
    const raw = localStorage.getItem(TIMELINE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(item => ({
          ...item,
          details: Array.isArray(item.details)
            ? item.details.filter(
                d => !d.includes('Focus on Distributed Systems') && !d.includes('Hands-on development of EVM contracts')
              )
            : item.details,
        }));
      }
    }
  } catch (e) {
    console.warn('Failed to load timeline from storage', e);
  }
  return initialTimeline;
}

export function saveTimeline(items) {
  try {
    localStorage.setItem(TIMELINE_KEY, JSON.stringify(items));
    notifyChange();
  } catch (e) {
    console.error('Failed to save timeline', e);
  }
}

export function addTimelineItem(item) {
  const current = getTimeline();
  const newItem = {
    ...item,
    id: item.id || `timeline-${Date.now()}`,
    skills: Array.isArray(item.skills) ? item.skills : (item.skills || '').split(',').map(s => s.trim()).filter(Boolean),
    details: Array.isArray(item.details) ? item.details : (item.details || '').split('\n').map(s => s.trim()).filter(Boolean),
  };
  const updated = [newItem, ...current];
  saveTimeline(updated);
  return updated;
}

export function updateTimelineItem(id, updatedFields) {
  const current = getTimeline();
  const updated = current.map(item => {
    if (item.id === id) {
      return {
        ...item,
        ...updatedFields,
        skills: Array.isArray(updatedFields.skills)
          ? updatedFields.skills
          : (updatedFields.skills || '').split(',').map(s => s.trim()).filter(Boolean),
        details: Array.isArray(updatedFields.details)
          ? updatedFields.details
          : (updatedFields.details || '').split('\n').map(s => s.trim()).filter(Boolean),
      };
    }
    return item;
  });
  saveTimeline(updated);
  return updated;
}

export function deleteTimelineItem(id) {
  const current = getTimeline();
  const updated = current.filter(item => item.id !== id);
  saveTimeline(updated);
  return updated;
}

export function reorderTimeline(fromIndex, toIndex) {
  const current = [...getTimeline()];
  if (fromIndex < 0 || fromIndex >= current.length || toIndex < 0 || toIndex >= current.length) return current;
  const [moved] = current.splice(fromIndex, 1);
  current.splice(toIndex, 0, moved);
  saveTimeline(current);
  return current;
}


// ----------------------------------------------------
// CREDENTIALS STORAGE
// ----------------------------------------------------

export function getCredentials() {
  try {
    const raw = localStorage.getItem(CREDENTIALS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Failed to load credentials from storage', e);
  }
  return initialCredentials;
}

export function saveCredentials(items) {
  try {
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(items));
    notifyChange();
  } catch (e) {
    console.error('Failed to save credentials', e);
  }
}

export function addCredentialItem(item) {
  const current = getCredentials();
  const newItem = {
    ...item,
    id: item.id || `cred-${Date.now()}`,
    skills: Array.isArray(item.skills) ? item.skills : (item.skills || '').split(',').map(s => s.trim()).filter(Boolean),
    verified: true,
  };
  const updated = [newItem, ...current];
  saveCredentials(updated);
  return updated;
}

export function updateCredentialItem(id, updatedFields) {
  const current = getCredentials();
  const updated = current.map(item => {
    if (item.id === id) {
      return {
        ...item,
        ...updatedFields,
        skills: Array.isArray(updatedFields.skills)
          ? updatedFields.skills
          : (updatedFields.skills || '').split(',').map(s => s.trim()).filter(Boolean),
      };
    }
    return item;
  });
  saveCredentials(updated);
  return updated;
}

export function deleteCredentialItem(id) {
  const current = getCredentials();
  const updated = current.filter(item => item.id !== id);
  saveCredentials(updated);
  return updated;
}

export function reorderCredentials(fromIndex, toIndex) {
  const current = [...getCredentials()];
  if (fromIndex < 0 || fromIndex >= current.length || toIndex < 0 || toIndex >= current.length) return current;
  const [moved] = current.splice(fromIndex, 1);
  current.splice(toIndex, 0, moved);
  saveCredentials(current);
  return current;
}


// ----------------------------------------------------
// GITHUB TELEMETRY CONFIG STORAGE
// ----------------------------------------------------

export function getGitHubConfig() {
  try {
    const raw = localStorage.getItem(GITHUB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.username) return parsed;
    }
  } catch (e) {
    console.warn('Failed to load GitHub config from storage', e);
  }
  return {
    username: profile.links?.githubUsername || 'siddharamkolle',
    profileUrl: profile.links?.github || 'https://github.com/siddharamkolle',
    pinnedRepos: ['Supply-Chain-Dapp', 'NFT-Minting-Platform', 'Blockchain-Voting-System'],
  };
}

export function saveGitHubConfig(config) {
  try {
    const data = {
      username: (config.username || 'siddharamkolle').trim(),
      profileUrl: (config.profileUrl || `https://github.com/${config.username || 'siddharamkolle'}`).trim(),
      pinnedRepos: Array.isArray(config.pinnedRepos) ? config.pinnedRepos : ['Supply-Chain-Dapp', 'NFT-Minting-Platform', 'Blockchain-Voting-System'],
    };
    localStorage.setItem(GITHUB_KEY, JSON.stringify(data));
    notifyChange();
    return data;
  } catch (e) {
    console.error('Failed to save GitHub config', e);
  }
}


// ----------------------------------------------------
// RESUME & CV CONFIG STORAGE
// ----------------------------------------------------

export function getResumeConfig() {
  try {
    const raw = localStorage.getItem(RESUME_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed) {
        // Automatically migrate legacy generated PDF paths to official uploaded resume
        if (parsed.resumePdfUrl === '/Siddharam_Kolle_Resume.pdf' || !parsed.resumePdfUrl) {
          parsed.resumePdfUrl = '/Resume_Siddharam_Kolle.pdf';
        }
        if (parsed.cvPdfUrl === '/Siddharam_Kolle_CV.pdf' || !parsed.cvPdfUrl) {
          parsed.cvPdfUrl = '/Resume_Siddharam_Kolle.pdf';
        }
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load resume config', e);
  }
  return {
    fullName: "KOLLE SIDDHARAM DATTAKUMAR",
    preferredName: "Siddharam Kolle",
    professionalTitle: "Web3 & Application Developer | Blockchain Specialist",
    email: "siddharamkolle097@gmail.com",
    githubUrl: "https://github.com/siddharamkolle",
    linkedinUrl: "https://www.linkedin.com/in/siddharamkolle",
    location: "Pune, Maharashtra, India",
    degree: "B.Tech CSE (AI & ML) - Lateral",
    institution: "JSPM University, Pune",
    prn: "32558023054",
    resumePdfUrl: "/Resume_Siddharam_Kolle.pdf",
    cvPdfUrl: "/Resume_Siddharam_Kolle.pdf",
    summary: "Computer Science Engineering student focused on Blockchain and Web3 development, with hands-on experience in EVM architecture, Solidity smart contract programming, Hardhat testing suites, and responsive frontend DApps. Completed an intensive 8-week corporate internship in Blockchain Technology.",
    isOpenForRoles: true,
    availableFor: "Full-time Roles, Web3 Internships & Protocol Research",
  };
}

export function saveResumeConfig(config) {
  try {
    const current = getResumeConfig();
    const updated = { ...current, ...config };
    localStorage.setItem(RESUME_KEY, JSON.stringify(updated));
    notifyChange();
    return updated;
  } catch (e) {
    console.error('Failed to save resume config', e);
  }
}


// ----------------------------------------------------
// RESET ALL TO DEFAULTS
// ----------------------------------------------------

export function resetAllToDefaults() {
  try {
    localStorage.removeItem(TIMELINE_KEY);
    localStorage.removeItem(CREDENTIALS_KEY);
    localStorage.removeItem(ACADEMIC_KEY);
    localStorage.removeItem(SKILLS_KEY);
    localStorage.removeItem(PROJECTS_KEY);
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(GITHUB_KEY);
    localStorage.removeItem(RESUME_KEY);
    notifyChange();
  } catch (e) {
    console.error('Failed to reset data', e);
  }
}

