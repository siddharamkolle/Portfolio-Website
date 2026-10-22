import { useEffect, useRef, useState } from "react";
import {
  profile,
  skills,
  projects,
  experience,
} from "../data/siteData";
import { soundManager } from "../utils/soundEffects";

/* ============================================================
   HELPERS
============================================================ */

const allSkills = Object.values(skills)
  .flat()
  .map((skill) => skill.name);

const skillGroups = Object.entries(skills);

const internships = experience?.internships || [];
const roles = experience?.roles || [];

/* ============================================================
   LOCAL AI REPLY
============================================================ */

function localReply(question) {
  const q = question.toLowerCase().trim();

  /* -----------------------------
     GREETING
  ----------------------------- */

  if (
    q === "hi" ||
    q === "hello" ||
    q === "hey" ||
    q.includes("who are you")
  ) {
    return `Hi! I'm ${profile.name}'s AI assistant. I can tell you about his skills, projects, internship experience, education, goals, and contact details.`;
  }

  /* -----------------------------
     NAME
  ----------------------------- */

  if (
    q.includes("your name") ||
    q.includes("his name") ||
    q.includes("name")
  ) {
    return `His name is ${profile.name}. He is a ${profile.role}.`;
  }

  /* -----------------------------
     ABOUT / BIO
  ----------------------------- */

  if (
    q.includes("about") ||
    q.includes("bio") ||
    q.includes("tell me about him") ||
    q.includes("who is siddharam") ||
    q.includes("who is he")
  ) {
    return profile.bio;
  }

  /* -----------------------------
     ROLE
  ----------------------------- */

  if (
    q.includes("role") ||
    q.includes("developer") ||
    q.includes("what does he do")
  ) {
    return `${profile.name} is a ${profile.role}. His main focus is Blockchain and Web3 development, especially Solidity, smart contracts, Ethereum/EVM and decentralized applications.`;
  }

  /* -----------------------------
     SKILLS
  ----------------------------- */

  if (
    q.includes("skill") ||
    q.includes("skills") ||
    q.includes("stack") ||
    q.includes("tech") ||
    q.includes("technologies") ||
    q.includes("technology")
  ) {
    const groupedSkills = skillGroups
      .map(
        ([group, items]) =>
          `${group}: ${items.map((item) => item.name).join(", ")}`
      )
      .join(" | ");

    return `His technical skills are: ${groupedSkills}.`;
  }

  /* -----------------------------
     PROGRAMMING LANGUAGES
  ----------------------------- */

  if (
    q.includes("language") ||
    q.includes("programming language") ||
    q.includes("coding language")
  ) {
    const languages = skills.Languages
      ? skills.Languages.map((item) => item.name).join(", ")
      : "JavaScript, TypeScript, Python and Solidity";

    return `His main programming languages are ${languages}.`;
  }

  /* -----------------------------
     BLOCKCHAIN SKILLS
  ----------------------------- */

  if (
    q.includes("blockchain") ||
    q.includes("web3") ||
    q.includes("smart contract") ||
    q.includes("ethereum") ||
    q.includes("evm")
  ) {
    const blockchainSkills = skills.Blockchain
      ? skills.Blockchain.map((item) => item.name).join(", ")
      : "";

    return `His Blockchain and Web3 skills include ${blockchainSkills}. He is particularly focused on Solidity, smart contracts, Ethereum/EVM and decentralized applications.`;
  }

  /* -----------------------------
     DEVELOPMENT SKILLS
  ----------------------------- */

  if (
    q.includes("react") ||
    q.includes("node") ||
    q.includes("frontend") ||
    q.includes("backend") ||
    q.includes("development")
  ) {
    const developmentSkills = skills.Development
      ? skills.Development.map((item) => item.name).join(", ")
      : "";

    return `His development stack includes ${developmentSkills}.`;
  }

  /* -----------------------------
     WEB3 TOOLS
  ----------------------------- */

  if (
    q.includes("tools") ||
    q.includes("hardhat") ||
    q.includes("foundry") ||
    q.includes("metamask") ||
    q.includes("remix") ||
    q.includes("openzeppelin")
  ) {
    const tools = skills["Web3 Tools"]
      ? skills["Web3 Tools"].map((item) => item.name).join(", ")
      : "";

    return `His Web3 tools include ${tools}.`;
  }

  /* -----------------------------
     PROJECTS - GENERAL
  ----------------------------- */

  if (
    q.includes("project") ||
    q.includes("projects") ||
    q.includes("built") ||
    q.includes("build")
  ) {
    const projectList = projects
      .map((project, index) => `${index + 1}. ${project.title}`)
      .join("\n");

    return `He has built these projects:\n\n${projectList}\n\nYou can ask me about any specific project.`;
  }

  /* -----------------------------
     NFT PROJECT
  ----------------------------- */

  if (
    q.includes("nft") ||
    q.includes("minting") ||
    q.includes("erc-721") ||
    q.includes("erc721")
  ) {
    const project = projects.find((p) =>
      p.title.toLowerCase().includes("nft")
    );

    if (project) {
      return `${project.title}: ${project.description} Tech stack: ${project.tags.join(
        ", "
      )}.`;
    }
  }

  /* -----------------------------
     SUPPLY CHAIN PROJECT
  ----------------------------- */

  if (
    q.includes("supply chain") ||
    q.includes("supplychain") ||
    q.includes("product tracking")
  ) {
    const project = projects.find((p) =>
      p.title.toLowerCase().includes("supply")
    );

    if (project) {
      return `${project.title}: ${project.description} Tech stack: ${project.tags.join(
        ", "
      )}.`;
    }
  }

  /* -----------------------------
     VOTING PROJECT
  ----------------------------- */

  if (
    q.includes("voting") ||
    q.includes("vote") ||
    q.includes("voting system")
  ) {
    const project = projects.find((p) =>
      p.title.toLowerCase().includes("voting")
    );

    if (project) {
      return `${project.title}: ${project.description} Tech stack: ${project.tags.join(
        ", "
      )}.`;
    }
  }

  /* -----------------------------
     PROJECT FEATURES
  ----------------------------- */

  if (
    q.includes("features") ||
    q.includes("nft features") ||
    q.includes("project features")
  ) {
    return `The NFT Minting Platform includes an ERC-721 smart contract, live NFT preview, MetaMask integration, free and paid minting, a real-time minted NFT gallery, and a responsive UI.`;
  }

  /* -----------------------------
     GITHUB / PROJECT LINKS
  ----------------------------- */

  if (
    q.includes("github") ||
    q.includes("repository") ||
    q.includes("repo") ||
    q.includes("source code")
  ) {
    return `His open-source projects and code repositories are available on GitHub at ${profile.links.github}. You can also explore his featured decentralized applications in the Projects section.`;
  }

  /* -----------------------------
     INTERNSHIP
  ----------------------------- */

  if (
    q.includes("intern") ||
    q.includes("internship") ||
    q.includes("experience") ||
    q.includes("work experience")
  ) {
    if (internships.length > 0) {
      const internshipText = internships
        .map(
          (item) =>
            `${item.title} at ${item.company}. Duration: ${item.duration}. ${item.description}`
        )
        .join("\n\n");

      return internshipText;
    }

    return "He is currently open to Blockchain and Web3 opportunities.";
  }

  /* -----------------------------
     COMPANY
  ----------------------------- */

  if (
    q.includes("skillinfy") ||
    q.includes("company") ||
    q.includes("interned where")
  ) {
    return `He completed an 8-week Blockchain Technology internship at SkillInfytech IT Solutions Private Limited from 22 May 2026 to 07 August 2026.`;
  }

  /* -----------------------------
     EDUCATION
  ----------------------------- */

  if (
    q.includes("education") ||
    q.includes("college") ||
    q.includes("university") ||
    q.includes("degree") ||
    q.includes("study") ||
    q.includes("student") ||
    q.includes("prn") ||
    q.includes("roll")
  ) {
    const s = profile.studentDetails;
    return `He is ${s.fullName} (PRN: ${s.prn}), currently in ${s.classYear}, ${s.sectionDivision} pursuing ${s.program} under the ${s.department} at ${s.institution}. Focus areas include Distributed Systems, Cryptographic Primitives, and EVM contract development.`;
  }

  /* -----------------------------
     CREDENTIALS & CERTIFICATES
  ----------------------------- */

  if (
    q.includes("credential") ||
    q.includes("certificate") ||
    q.includes("certified")
  ) {
    return `He holds the verified Blockchain Technology Specialist Certificate from SkillInfytech IT Solutions Private Limited (ID: SI-BT-2026-08819), awarded upon completing an 8-week professional internship in smart contracts and EVM engineering. You can inspect and verify it directly in the Credentials section!`;
  }

  /* -----------------------------
     TIMELINE & CAREER
  ----------------------------- */

  if (
    q.includes("timeline") ||
    q.includes("career") ||
    q.includes("journey") ||
    q.includes("milestone")
  ) {
    return `His interactive timeline features both Career and Education milestones in chronological order—including his 8-week Blockchain Technology internship at SkillInfytech, his Lateral B.Tech degree at JSPM University, and ongoing Web3 application engineering. Check out the Timeline section for complete interactive details!`;
  }

  /* -----------------------------
     RESUME & CV
  ----------------------------- */

  if (
    q.includes("resume") ||
    q.includes("cv") ||
    q.includes("curriculum vitae") ||
    q.includes("download resume") ||
    q.includes("download cv")
  ) {
    return `You can view and download ${profile.name}'s official Tech Resume (ATS 1-Page PDF) and Academic Curriculum Vitae (CV) in the dedicated "Resume / CV" section of this portfolio! Both direct PDF downloads and in-browser print options are available there.`;
  }

  /* -----------------------------
     FUTURE GOALS
  ----------------------------- */

  if (
    q.includes("goal") ||
    q.includes("goals") ||
    q.includes("future") ||
    q.includes("plan") ||
    q.includes("career") ||
    q.includes("dream")
  ) {
    return profile.futureGoals;
  }

  /* -----------------------------
     CONTACT
  ----------------------------- */

  if (
    q.includes("contact") ||
    q.includes("hire") ||
    q.includes("email") ||
    q.includes("reach") ||
    q.includes("linkedin")
  ) {
    return `The best way to contact ${profile.name} is through GitHub, LinkedIn, or email. His contact links are available in the Contact section of this portfolio.`;
  }

  /* -----------------------------
     EMAIL
  ----------------------------- */

  if (q.includes("mail") || q.includes("email address")) {
    return "You can contact him through the email address provided in the Contact section.";
  }

  /* -----------------------------
     CURRENT STATUS
  ----------------------------- */

  if (
    q.includes("available") ||
    q.includes("open to work") ||
    q.includes("job") ||
    q.includes("opportunity")
  ) {
    if (roles.length > 0) {
      return roles[0].description;
    }

    return "He is currently open to Blockchain and Web3 internships and collaborative opportunities.";
  }

  /* -----------------------------
     SPECIFIC SKILL QUESTIONS
  ----------------------------- */

  const matchedSkill = allSkills.find((skill) =>
    q.includes(skill.toLowerCase())
  );

  if (matchedSkill) {
    return `Yes, ${matchedSkill} is part of his technical skill set.`;
  }

  /* -----------------------------
     DEFAULT
  ----------------------------- */

  return `I can help you learn about ${profile.name}'s skills, projects, Blockchain experience, internship, education, future goals, and contact information. Try asking something like "What are his skills?" or "Tell me about his NFT project."`;
}

/* ============================================================
   COMPONENT
============================================================ */

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: `Hi! I'm ${profile.name}'s AI assistant. Ask me about his skills, projects, internship, education, or future goals.`,
    },
  ]);

  const [input, setInput] = useState("");

  const boxRef = useRef(null);

  /* ============================================================
     AUTO SCROLL
  ============================================================ */

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [messages]);

  /* ============================================================
     SEND MESSAGE
  ============================================================ */

  function sendMessage(message = input) {
    const question = message.trim();

    if (!question) return;

    soundManager.playClick();

    const userMessage = {
      role: "user",
      text: question,
    };

    const aiMessage = {
      role: "ai",
      text: localReply(question),
    };

    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
      aiMessage,
    ]);

    setInput("");
    setTimeout(() => {
      soundManager.playBlip(680, 0.08);
    }, 150);
  }

  /* ============================================================
     SUGGESTIONS
  ============================================================ */

  const suggestions = [
    "What are your skills?",
    "Tell me about your projects",
    "Tell me about your internship",
    "What are your future goals?",
    "How can I contact Siddharam?",
  ];

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <div className="section-inner ai-section-v2">
      <div className="section-header-pill">
        <span className="section-pill-dot"></span>
        <span>NEURAL ASSISTANT</span>
      </div>

      <h2 className="section-main-title">
        Interactive <span className="text-gradient">Portfolio Intelligence</span>
      </h2>

      <p className="section-lead-text">
        Ask questions about Siddharam's experience, smart contracts, project architecture, or how to collaborate.
      </p>

      {/* Cyber AI Terminal Window */}
      <div className="ai-terminal-window">
        {/* Terminal Title Bar */}
        <div className="terminal-titlebar">
          <div className="terminal-controls">
            <span className="term-dot term-dot-red"></span>
            <span className="term-dot term-dot-yellow"></span>
            <span className="term-dot term-dot-green"></span>
          </div>
          <div className="terminal-title-text">
            <span>siddharam-ai-core v2.4</span>
            <span className="terminal-status-badge">● ONLINE</span>
          </div>
          <div className="terminal-right-tag">EVM v1.4</div>
        </div>

        {/* Chat Messages Box */}
        <div className="chat-box-v2" ref={boxRef}>
          {messages.map((message, index) => (
            <div
              className={`chat-msg-v2 ${message.role}`}
              key={`${message.role}-${index}`}
            >
              <div className="chat-avatar-icon">
                {message.role === 'ai' ? '🤖' : '👤'}
              </div>
              <div className="chat-bubble-content">
                <div className="chat-author-label">
                  {message.role === 'ai' ? 'Siddharam AI' : 'You'}
                </div>
                <div className="chat-text-body">
                  {message.text.split("\n").map((line, lineIndex) => (
                    <span key={lineIndex}>
                      {line}
                      {lineIndex < message.text.split("\n").length - 1 && <br />}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="chat-suggestions-v2">
          <span className="suggestions-lead">Suggested:</span>
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              className="chip-v2"
              onClick={() => sendMessage(suggestion)}
              onMouseEnter={() => soundManager.playHover()}
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Input Row */}
        <div className="chat-input-row-v2">
          <div className="chat-prompt-prefix">&gt;</div>
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                sendMessage();
              }
            }}
            placeholder="Ask about Web3, projects, skills, internship..."
            aria-label="Ask AI assistant"
            className="chat-input-field"
          />

          <button
            type="button"
            className="btn-primary-glow btn-send-v2"
            onClick={() => sendMessage()}
            onMouseEnter={() => soundManager.playHover()}
          >
            <span>Send</span>
            <span className="send-arrow">↵</span>
          </button>
        </div>
      </div>
    </div>
  );
}