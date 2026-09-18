const fs = require('fs');
const path = require('path');

function createPdf(title, subtitle, sections) {
  let objects = [];
  function addObject(content) {
    objects.push(content);
    return objects.length;
  }

  const catalogId = 1;
  const pagesId = 2;
  const pageId = 3;
  const fontRegId = 4;
  const fontBoldId = 5;
  const contentsId = 6;

  let stream = [];
  let y = 745;

  function addText(text, x, size = 10, isBold = false, color = [0.1, 0.1, 0.1]) {
    const fontName = isBold ? '/F2' : '/F1';
    const safeText = text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
    stream.push(`BT ${fontName} ${size} Tf ${color[0]} ${color[1]} ${color[2]} rg ${x} ${y} Td (${safeText}) Tj ET`);
  }

  function addLine(x1, y1, x2, y2, color = [0.7, 0.7, 0.7], width = 0.75) {
    stream.push(`${color[0]} ${color[1]} ${color[2]} RG ${width} w ${x1} ${y1} m ${x2} ${y2} l S`);
  }

  // Header Title
  addText(title, 50, 20, true, [0.05, 0.05, 0.05]);
  y -= 18;
  addText(subtitle, 50, 11, true, [0.1, 0.4, 0.7]);
  y -= 14;
  addText("Email: siddharamkolle097@gmail.com  |  GitHub: github.com/siddharamkolle  |  LinkedIn: linkedin.com/in/siddharamkolle", 50, 8.5, false, [0.35, 0.35, 0.35]);
  y -= 12;
  addText("Institution: JSPM University, Pune  |  Degree: B.Tech CSE (AI & ML) - Lateral  |  PRN: 32558023054", 50, 8.5, false, [0.35, 0.35, 0.35]);
  y -= 10;
  addLine(50, y, 560, y, [0.2, 0.5, 0.8], 1.5);
  y -= 18;

  // Sections
  sections.forEach((sec) => {
    if (y < 80) return;
    addText(sec.heading.toUpperCase(), 50, 11, true, [0.1, 0.3, 0.6]);
    y -= 4;
    addLine(50, y, 560, y, [0.85, 0.85, 0.85], 0.5);
    y -= 12;

    sec.items.forEach((item) => {
      if (y < 60) return;
      if (item.title) {
        addText(item.title, 50, 9.5, true, [0.1, 0.1, 0.1]);
        if (item.date) {
          addText(item.date, 440, 8.5, false, [0.4, 0.4, 0.4]);
        }
        y -= 11;
      }
      if (item.subtitle) {
        addText(item.subtitle, 50, 8.5, false, [0.25, 0.25, 0.25]);
        y -= 10;
      }
      if (item.bullets) {
        item.bullets.forEach((b) => {
          if (y < 50) return;
          addText(`*  ${b}`, 60, 8, false, [0.2, 0.2, 0.2]);
          y -= 9.5;
        });
      }
      if (item.text) {
        addText(item.text, 50, 8.5, false, [0.25, 0.25, 0.25]);
        y -= 11;
      }
      y -= 3;
    });
    y -= 8;
  });

  const streamContent = stream.join('\n');
  const streamLength = Buffer.byteLength(streamContent, 'utf-8');

  const obj1 = `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`;
  const obj2 = `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n`;
  const obj3 = `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj\n`;
  const obj4 = `4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`;
  const obj5 = `5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n`;
  const obj6 = `6 0 obj\n<< /Length ${streamLength} >>\nstream\n${streamContent}\nendstream\nendobj\n`;

  const allObjs = [obj1, obj2, obj3, obj4, obj5, obj6];
  let offset = 9;
  let xref = [`xref\n0 7\n0000000000 65535 f \n`];

  for (let i = 0; i < allObjs.length; i++) {
    const padded = String(offset).padStart(10, '0');
    xref.push(`${padded} 00000 n \n`);
    offset += Buffer.byteLength(allObjs[i], 'utf-8');
  }

  const trailer = `trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n${offset}\n%%EOF\n`;
  return `%PDF-1.4\n` + allObjs.join('') + xref.join('') + trailer;
}

// 1. Tech Resume
const resumeSections = [
  {
    heading: "Executive Summary",
    items: [
      {
        text: "Computer Science and Engineering undergraduate specializing in Blockchain & Web3 development. Hands-on experience developing EVM smart contracts, decentralized applications, and frontend Web3 interfaces. Proven track record in corporate blockchain internship, smart contract testing, and decentralized application architecture."
      }
    ]
  },
  {
    heading: "Core Technical Skills",
    items: [
      {
        bullets: [
          "Blockchain & Smart Contracts: Solidity, Ethereum / EVM, ERC-721, Hardhat, Ethers.js, Web3.js, MetaMask",
          "Languages: JavaScript (ES6+), TypeScript, Python, Solidity, HTML5 / CSS3",
          "Frontend & Frameworks: React.js, Vite, Responsive Design, State Management, UI/UX Systems",
          "Developer Tools: Git, GitHub, VS Code, Vercel, Remix IDE, IPFS Decentralized Storage",
          "Computer Science Foundations: Distributed Systems, Cryptography, Data Structures, Algorithms"
        ]
      }
    ]
  },
  {
    heading: "Work Experience & Internship",
    items: [
      {
        title: "Blockchain Technology Intern - SkillInfytech IT Solutions Pvt. Ltd.",
        date: "May 2026 - Aug 2026 (8 Weeks)",
        subtitle: "Corporate Internship | Smart Contracts & EVM Architecture",
        bullets: [
          "Engineered and deployed EVM-compatible smart contracts using Solidity and Hardhat.",
          "Implemented automated smart contract testing suites and optimized gas consumption overhead.",
          "Integrated decentralized web interfaces with MetaMask provider injection via Ethers.js.",
          "Earned verified corporate certification (Credential ID: SI-BT-2026-08819) upon project evaluation."
        ]
      }
    ]
  },
  {
    heading: "Featured Web3 Projects",
    items: [
      {
        title: "NFT Minting Platform",
        date: "Solidity, Hardhat, ERC-721, Ethers.js",
        bullets: [
          "Decentralized NFT minting application with real-time preview and minted gallery on Ethereum Sepolia.",
          "Implemented automated metadata handling, live gas fee estimation, and wallet connection state."
        ]
      },
      {
        title: "Supply Chain DApp",
        date: "Solidity, Ethereum, MetaMask, React",
        bullets: [
          "Decentralized product tracking protocol ensuring end-to-end tamper-resistant audit trails.",
          "Multi-role access control for manufacturers, distributors, retailers, and consumer verification."
        ]
      },
      {
        title: "Decentralized Voting System",
        date: "Solidity, Ethereum, Web3.js",
        bullets: [
          "Cryptographic wallet-based governance platform enabling transparent, tamper-proof voting on-chain."
        ]
      }
    ]
  },
  {
    heading: "Education & Academic Credentials",
    items: [
      {
        title: "B.Tech in Computer Science and Engineering (AI & ML) - Lateral",
        date: "2024 - 2028",
        subtitle: "JSPM University, Pune | PRN: 32558023054 | 2nd Year, Section Division-E",
        bullets: [
          "Specialization in Artificial Intelligence and Machine Learning with core focus on distributed systems."
        ]
      }
    ]
  }
];

// 2. Comprehensive Academic CV
const cvSections = [
  {
    heading: "Curriculum Vitae Profile",
    items: [
      {
        text: "KOLLE SIDDHARAM DATTAKUMAR - Undergraduate Engineer in Computer Science and Engineering (Artificial Intelligence and Machine Learning - Lateral). Focus areas include decentralized consensus, cryptographic primitives, smart contract protocol security, EVM execution mechanics, and decentralized applications."
      }
    ]
  },
  {
    heading: "Academic Education",
    items: [
      {
        title: "Bachelor of Technology - Computer Science and Engineering (AI & ML)",
        date: "2024 - 2028",
        subtitle: "Department of Computer Science and Engineering, JSPM University, Pune",
        bullets: [
          "Permanent Registration Number (PRN): 32558023054",
          "Current Academic Standing: 2nd Year | Section Division-E (Lateral Entry)",
          "Coursework: Distributed Systems, Cryptographic Primitives, Data Structures, Algorithms, EVM Development"
        ]
      }
    ]
  },
  {
    heading: "Professional Experience & Corporate Training",
    items: [
      {
        title: "Blockchain Technology Specialist Intern - SkillInfytech IT Solutions Pvt. Ltd.",
        date: "22 May 2026 - 07 August 2026",
        subtitle: "8-Week Intensive Corporate Training & Development Program",
        bullets: [
          "Spearheaded hands-on Solidity smart contract engineering and test suite configuration on Hardhat.",
          "Conducted gas audits, reentrancy defense reviews, and EVM opcode optimization.",
          "Built full-stack DApp integrations binding Web3 JSON-RPC providers with React frontend modules.",
          "Verified Credential SI-BT-2026-08819 accredited upon milestone delivery."
        ]
      }
    ]
  },
  {
    heading: "Technical Competencies & Stack",
    items: [
      {
        bullets: [
          "Blockchain & Protocols: Solidity, Ethereum Virtual Machine (EVM), ERC-20, ERC-721, Hardhat, Ethers.js",
          "Programming: JavaScript (ES6+), TypeScript, Python, Solidity, Shell",
          "Web Technologies: React.js, Node.js, Vite, HTML5, CSS3, Three.js (3D Graphics)",
          "Infrastructure & Tooling: Git, GitHub, VS Code, Vercel, IPFS, MetaMask, Remix IDE"
        ]
      }
    ]
  },
  {
    heading: "Engineering Projects Portfolio",
    items: [
      {
        title: "1. NFT Minting Platform (Live: nftmintingplatform.vercel.app)",
        subtitle: "ERC-721 Smart Contract Architecture, Sepolia Deployment, MetaMask Integration",
        bullets: [
          "Engineered verifiable digital asset minting contract with live wallet state reconciliation."
        ]
      },
      {
        title: "2. Decentralized Supply Chain Tracking System (Live: supply-chain-dapp-web.vercel.app)",
        subtitle: "Multi-Role Lifecycle State Machine on Ethereum",
        bullets: [
          "Immutable shipment transit logging with cryptographic proof of provenance."
        ]
      },
      {
        title: "3. Blockchain Voting Protocol (Live: blockchain-votingsystem-web.vercel.app)",
        subtitle: "Tamper-Proof On-Chain Ballot & Real-Time Tally",
        bullets: [
          "Decentralized ballot with anti-double voting constraints and live cryptographic tallies."
        ]
      }
    ]
  },
  {
    heading: "Verified Certifications & Accreditations",
    items: [
      {
        title: "Blockchain Technology Specialist (SI-BT-2026-08819) - Verified",
        date: "August 2026",
        subtitle: "SkillInfytech IT Solutions Private Limited",
        bullets: [
          "Demonstrated excellence in smart contract engineering, testing, EVM architecture, and DApp development."
        ]
      }
    ]
  }
];

const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const resumePdf = createPdf("SIDDHARAM KOLLE", "Web3 & Application Developer | Blockchain Specialist", resumeSections);
const cvPdf = createPdf("KOLLE SIDDHARAM DATTAKUMAR", "Curriculum Vitae | Computer Science Engineering (AI & ML)", cvSections);

fs.writeFileSync(path.join(publicDir, 'Siddharam_Kolle_Resume.pdf'), resumePdf, 'binary');
fs.writeFileSync(path.join(publicDir, 'Siddharam_Kolle_CV.pdf'), cvPdf, 'binary');

console.log("Successfully generated public/Siddharam_Kolle_Resume.pdf and public/Siddharam_Kolle_CV.pdf!");