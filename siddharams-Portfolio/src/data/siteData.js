export const profile = {
  name: "Siddharam Kolle",
  role: "Web3 & Application Developer",
  tagline: "Build Beyond Limits",
  subTagline: "Nothing Changes Until You Build It",
  photo: "/src/assets/portrait.png",

  // Shortened bio (~70% of original length, crisp & punchy)
  bio: "I’m a Computer Science Engineering student focused on Blockchain and Web3 development, with a strong interest in smart contract engineering and decentralized systems. I turn complex problems into scalable, practical solutions—from DApp frontends to smart contract protocols. Currently sharpening my Solidity and EVM foundations while building impactful decentralized applications.",

  education: {
    degree: "B.Tech (Computer Science and Engineering - Artificial Intelligence and Machine Learning)-Lateral",
    specialization: "Department of Computer Science and Engineering",
    institution: "JSPM University, Pune",
    year: "2nd year | Section Division-E (2024-2028)",
  },

  studentDetails: {
    fullName: "KOLLE SIDDHARAM DATTAKUMAR",
    prn: "32558023054",
    classYear: "2nd year",
    sectionDivision: "Section Division-E",
    program: "B. Tech (Computer Science and Engineering - Artificial Intelligence and Machine Learning)-Lateral",
    department: "Department of Computer Science and Engineering",
    institution: "JSPM University, Pune",
    highlights: [],
  },

  links: {
    github: "https://github.com/siddharamkolle",
    githubUsername: "siddharamkolle",
    linkedin: "https://www.linkedin.com/in/siddharamkolle",
    email: "mailto:siddharamkolle097@gmail.com",
    meetup: "https://www.meetup.com/members/siddharamkolle",
    twitter: "https://x.com/ShashankKolle",
    discord: "https://discord.com/users/shashank_0_",
  },

  futureGoals:
    "Transition from application-layer Web3 development into core protocol engineering over the next few years — building the infrastructure other developers build on.",
};


// =========================
// SKILLS
// =========================

export const skills = {
  Languages: [
    {
      name: "JavaScript",
      icon: "SiJavascript",
      color: "#F7DF1E",
    },
    {
      name: "TypeScript",
      icon: "SiTypescript",
      color: "#3178C6",
    },
    {
      name: "Python",
      icon: "SiPython",
      color: "#3776AB",
    },
    {
      name: "Solidity",
      icon: "SiSolidity",
      color: "#CCCCCC",
    },
  ],

  Development: [
    {
      name: "React",
      icon: "SiReact",
      color: "#61DAFB",
    },
    {
      name: "Node.js",
      icon: "SiNodedotjs",
      color: "#26A641",
    },
  ],

  Blockchain: [
    {
      name: "Ethereum / EVM",
      icon: "SiEthereum",
      color: "#627EEA",
    },
    {
      name: "Web3.js",
      icon: "SiWeb3Dotjs",
      color: "#F5F5F5",
    },
  ],

  Tools: [
    {
      name: "Git",
      icon: "SiGit",
      color: "#F05032",
    },
    {
      name: "GitHub",
      icon: "SiGithub",
      color: "#ffffff",
    },
    {
      name: "VS Code",
      icon: "VscVscode",
      set: "vsc",
      color: "#007ACC",
    },
    {
      name: "Vercel",
      icon: "SiVercel",
      color: "#ffffff",
    },
  ],
};


// =========================
// INITIAL TIMELINE (CAREER & EDUCATION)
// =========================

export const initialTimeline = [
  {
    id: "milestone-1",
    date: "2024 — Present",
    period: "2nd Year · Division-E",
    title: "B. Tech CSE (AI & ML) - Lateral",
    organization: "JSPM University, Pune",
    type: "Education",
    status: "Current",
    description:
      "Enrolled in the Lateral B.Tech program under the Department of Computer Science and Engineering. Specializing in Artificial Intelligence and Machine Learning with core focus on distributed algorithms, cryptographic primitives, and data structures.",
    skills: [
      "Distributed Systems",
      "Cryptographic Primitives",
      "Data Structures",
      "Algorithms",
      "EVM Development",
    ],
    details: [
      "Student PRN: 32558023054",
      "Class: 2nd year | Section Division-E",
    ],
  },
  {
    id: "milestone-2",
    date: "22 May 2026 — 07 August 2026",
    period: "8 Weeks Intensive",
    title: "Blockchain Technology Intern",
    organization: "SkillInfytech IT Solutions Private Limited",
    type: "Career",
    status: "Completed",
    description:
      "Completed an intensive 8-week corporate internship focused on Blockchain Technology, gaining hands-on smart contract programming, EVM architecture analysis, and Web3 integration experience under senior mentorship.",
    skills: [
      "Solidity",
      "Smart Contracts",
      "Hardhat",
      "Ethers.js",
      "EVM Chains",
      "Web3 Security",
    ],
    details: [
      "Engineered and deployed EVM-compatible smart contracts using Solidity and Hardhat.",
      "Implemented automated smart contract testing, debugging, and gas consumption optimizations.",
      "Connected frontend decentralized interfaces with Web3 provider injection (MetaMask).",
      "Earned verified corporate certification upon project milestone evaluations.",
    ],
  },
  {
    id: "milestone-3",
    date: "2026 — Present",
    period: "Active Exploration",
    title: "Web3 & Application Developer",
    organization: "Open for Opportunities & Hackathons",
    type: "Career",
    status: "Active",
    description:
      "Continuously architecting decentralized applications, experimenting with cross-chain tooling, and building production-ready Web3 solutions. Open to high-impact internships, grants, and collaborative engineering roles.",
    skills: [
      "Web3 Architecture",
      "ERC Standards",
      "React",
      "Solidity",
      "Decentralized Storage",
    ],
    details: [
      "Developed live projects including NFT Minting Platform, Supply Chain DApp, and Voting System.",
      "Actively engaging in Ethereum ecosystem and open-source protocol research.",
    ],
  },
];


// =========================
// INITIAL VERIFIED CREDENTIALS
// =========================

export const initialCredentials = [
  {
    id: "cred-1",
    title: "Blockchain Technology Specialist",
    issuer: "SkillInfytech IT Solutions Private Limited",
    type: "Professional Internship Certificate",
    date: "August 2026",
    credentialId: "SI-BT-2026-08819",
    verifyUrl: "https://skillinfytech.com/verify/SI-BT-2026-08819",
    imageUrl: "/src/assets/certificate-skillinfytech.svg",
    description:
      "Awarded for successfully completing the 8-Week Professional Internship in Blockchain Technology, demonstrating excellence in smart contract engineering, EVM architecture, testing, and decentralized application development.",
    skills: [
      "Solidity",
      "Ethereum",
      "Smart Contracts",
      "Hardhat",
      "Ethers.js",
      "Web3.js",
    ],
    verified: true,
  },
];


// =========================
// EXPERIENCE (Legacy export kept for backwards compatibility)
// =========================

export const experience = {
  internships: [
    {
      title: "Blockchain Technology Intern",
      company: "SkillInfytech IT Solutions Private Limited",
      duration: "22 May 2026 – 07 August 2026 · 8 Weeks",
      description:
        "Completed an 8-week internship focused on Blockchain Technology, gaining hands-on learning, real-world exposure, mentorship, and practical technical experience.",
      tags: ["Blockchain", "Solidity", "8 Weeks", "Completed"],
    },
  ],

  roles: [
    {
      title: "Open to Blockchain & Web3 Opportunities",
      company: "Currently Seeking",
      duration: "Open to Internships & Collaborative Roles",
      description:
        "Currently open to opportunities where I can apply my Blockchain and Web3 knowledge, strengthen my technical skills, and contribute to meaningful projects.",
      tags: ["Blockchain", "Web3", "Internships", "Collaboration"],
    },
  ],
};


// =========================
// PROJECTS
// =========================

export const projects = [
  {
    title: "NFT Minting Platform",
    description:
      "A decentralized NFT minting platform on Ethereum with ERC-721 smart contracts, live NFT preview, MetaMask integration, and a real-time minted NFT gallery.",
    tags: [
      "Solidity",
      "Hardhat",
      "ERC-721",
      "Ethers.js",
      "MetaMask",
      "JavaScript",
    ],
    liveUrl: "https://nftmintingplatform.vercel.app",
    githubUrl: "https://github.com/shashankkolle2006/NFT-Minting-Platform",
  },

  {
    title: "Supply Chain DApp",
    description:
      "A decentralized supply chain tracking system built on Ethereum for transparent and tamper-resistant product tracking from manufacturing to delivery.",
    tags: [
      "Solidity",
      "Hardhat",
      "Ethers.js",
      "MetaMask",
      "JavaScript",
      "DApp",
    ],
    liveUrl: "https://supply-chain-dapp-web.vercel.app",
    githubUrl: "https://github.com/siddharamkolle/Supply-Chain-Dapp",
  },

  {
    title: "Decentralized Voting System",
    description:
      "A blockchain-based voting application built with Solidity and Ethereum, enabling secure, transparent, and wallet-based voting through smart contracts.",
    tags: [
      "Solidity",
      "Ethereum",
      "Hardhat",
      "Web3",
      "JavaScript",
    ],
    liveUrl: "https://blockchain-votingsystem-web.vercel.app",
    githubUrl: "https://github.com/shashankkolle2006/Blockchain-Voting-System",
  },
];


// =========================
// STATS
// =========================

export const stats = [
  {
    label: "Projects Built",
    value: 4,
  },
  {
    label: "Internships Done",
    value: 1,
  },
  {
    label: "Certificates",
    value: 1,
  },
];


// =========================
// QUOTES
// =========================

export const quotes = [
  "Build Beyond Limits",
  "Nothing Changes Until You Build It",
];
