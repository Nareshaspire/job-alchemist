🎭 CulturePulse

CulturePulse is an AI-powered, single-page interactive web application (SPA) designed to combat workplace bullying, dismantle toxic organizational groupings (Silos, Echo Chambers, Gatekeepers), and restore psychological safety.

By leveraging Google's Gemini API and Firebase, CulturePulse provides both employees and HR professionals with a suite of 17 empathetic, trauma-informed, and highly actionable intervention tools.

📖 Table of Contents

About the Project

Core Architecture

Role-Based Access Control (RBAC)

The AI Toolkit

Getting Started

Configuration & Environment Variables

Contributing

License

🎯 About the Project

Workplace toxicity is rarely about overt shouting; it's characterized by subtle, systemic sabotage that drains productivity and drives talent attrition. CulturePulse shifts the paradigm from passive "reporting" to active intervention and healing.

Instead of generic advice, CulturePulse uses advanced LLMs to act as an on-demand organizational psychologist, communication coach, and HR compliance expert. It features an expressive, "Material 3" inspired UI built entirely with Tailwind CSS to create a calming, emotionally safe user experience.

🏗️ Core Architecture

CulturePulse is built under a strict Single-File Architecture constraint. All structural HTML, expressive Tailwind styling, Chart.js visualizations, Firebase backend logic, and Gemini API integrations are contained within a single index.html file.

Frontend: HTML5, Tailwind CSS (via CDN), Chart.js (via CDN).

Backend / BaaS: Firebase Auth (Anonymous & Custom Token) and Firestore (Real-time Database).

AI Engine: Gemini 2.5 Flash API (Strict JSON structured outputs).

🔐 Role-Based Access Control (RBAC)

The application features a secure, Firebase-authenticated entry gate. Users must select their role upon entry, which persists in Firestore:

Employee / Team Member: Accesses tools focused on self-advocacy, de-escalation, and reality-checking.

HR Professional / Admin: Unlocks advanced tools for systemic repair, policy drafting, pulse surveys, and bias detection.

🧰 The AI Toolkit

CulturePulse contains 17 distinct AI agents, each prompted with specialized psychological and HR frameworks.

🛡️ For Employees (Self-Advocacy & Protection)

🧊 The De-Escalator: Cools down angry email drafts into HR-proof, boundary-setting responses.

🤫 Gossip Neutralizer: Analyzes rumors and provides scripts for soft deflection or firm boundary setting.

🧭 Gaslight Reality Check: Validates user experiences against common manipulation tactics.

🚩 Non-Apology Detector: Identifies toxic deflections in "faux-pologies" and translates the subtext.

🔍 Passive-Aggressive Decoder: Uncovers the hidden hostility in "professional" messages.

🗣️ Tough Conversation Coach: Simulates a confrontation using the SBI (Situation-Behavior-Impact) model.

🤝 Upstander Drafter: Helps witnesses draft safe intervention messages to targets, instigators, or HR.

🏢 For HR & Admins (Systemic Repair)

🚀 Executive Escalator: Translates emotional reports into sterile, high-impact C-Suite risk briefings.

⚖️ Review Bias Scanner: Analyzes performance reviews for subjective, personality-based biases.

🧠 Neuro-Inclusion Reframer: Evaluates behavioral complaints through an accessibility lens to protect neurodivergent staff.

🩺 Pulse Survey Architect: Generates indirect, psychologically safe survey questions to detect toxic groupings.

🔄 Feedback Flipper: Separates personal attacks from objective work issues in harsh feedback.

🎙️ Meeting Dynamics Analyzer: Analyzes transcripts for credit-stealing, interruptions, and power plays.

🧩 Pattern Spotter: Aggregates minor incidents to identify systemic academic patterns (e.g., Strategic Marginalization).

✨ AI Incident Analyzer: Classifies raw incident reports into specific toxic typologies (Silos, Echo Chambers, Gatekeepers).

📜 Policy Drafter: Generates empathetic, values-aligned HR policy addendums.

🏕️ Workshop Planner: Designs 45-minute restorative justice workshops for broken teams.

🚀 Getting Started

Because CulturePulse is a single-file application, installation is incredibly simple.

Clone the repository:

git clone [https://github.com/yourusername/CulturePulse.git](https://github.com/yourusername/CulturePulse.git)
cd CulturePulse


Open in Browser:
Simply open the index.html file in any modern web browser. You can use an extension like VS Code Live Server for hot-reloading.

⚙️ Configuration & Environment Variables

To fully activate the backend and AI features, you must inject your API keys into the index.html file or provide them via your execution environment.

1. Gemini API Key

Locate the apiKey variable in the script block and add your Gemini API key:

// Locate this line in index.html
const apiKey = "YOUR_GEMINI_API_KEY_HERE"; 


2. Firebase Configuration

The application looks for global variables to initialize Firebase. If running locally without an injector, mock these variables at the very top of the <script> tag:

window.__app_id = "culturepulse-local-dev";
window.__firebase_config = JSON.stringify({
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
});
// Leave window.__initial_auth_token undefined to use Anonymous Auth


🤝 Contributing

We welcome contributions from HR professionals, organizational psychologists, and developers!

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

Note on Pull Requests: Please ensure any new AI tools strictly utilize the responseSchema JSON constraints established in the makeGeminiCall wrapper function to prevent UI breakage.

📄 License

Distributed under the MIT License. See LICENSE for more information.

Disclaimer: CulturePulse is an AI-assisted tool intended for educational and organizational development purposes. It does not replace professional legal counsel, certified HR mediation, or professional psychiatric help

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/fd0ba8a1-6b72-43c2-b65f-34c569b21783

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
