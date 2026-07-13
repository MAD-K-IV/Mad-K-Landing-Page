<div align="center">
  <img src="public/logo.png" alt="MAD-K Logo" width="120" />
  <br />
  <img src="public/brand.png" alt="MAD-K Brand" width="220" />
  
  <h3><strong>High-Performance Gen-AI Agents & Full-Stack Automation Engines</strong></h3>
  <p>We build production-ready digital solutions that turn standard websites into active lead machines.</p>

  <p>
    <img src="https://img.shields.io/badge/React-19-FC3E75?style=for-the-badge&logo=react&logoColor=white" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5.8-9138cc?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-4.1-4538f8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Gemini_API-3.5_Flash-0F9D58?style=for-the-badge&logo=google-gemini&logoColor=white" alt="Gemini API" />
    <img src="https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  </p>
</div>

---

## 🌌 About MAD-K
MAD-K is an engineering partner specializing in constructing high-fidelity AI assistants, custom business process automations, and intelligent computer vision platforms. 

Evolving from a freelance collective to a structured team of software engineers, UI/UX designers, and systems architects, we design, deploy, and maintain bespoke solutions for businesses aiming to optimize workflow conversion metrics.

---

## 🛡️ Core Capabilities

```mermaid
graph TD
    User([User Web Portal / Camera Stream]) -->|Interaction| UI[MAD-K Partner Interface / CCTV Feed]
    UI -->|Queries & Data| Core[Express backend API]
    Core -->|Context Retrieval| DB[(Vector DB / Pinecone / Storage)]
    Core -->|Cognitive Processing| LLM[Google Gemini 3.5 Flash]
    LLM -->|Function Calling| Lead[submit_lead Trigger]
    Lead -->|Automation Pipeline| Notify[Lead Mailer / WhatsApp / CRM APIs]
```

- **RAG Chatbots**: Direct vector database grounding (Pinecone/Milvus) with LLMs to query and answer based on proprietary business data.
- **Process Automation**: Scalable Python engines built with Celery, Puppeteer, and Selenium to schedule and run workflows.
- **AI Web Applications**: Full-stack Reactive architectures with motion libraries for sub-second loading states.
- **Computer Vision & Detection**: PyTorch, OpenCV, and YOLO implementations for anti-theft alerts, PPE compliance, and CCTV stream telecasting.

---

## 🏷️ Service Tiers & Pricing

| Tier | Price Range | Duration / Model | Key Details |
| :--- | :--- | :--- | :--- |
| **Basic Portfolio** | **₹6,000 - ₹15,000** | / week | Static portfolio layout, customized responsive structure, integrated enquiry forms. |
| **Advanced Portfolio** | **₹20,000 - ₹45,000** | / week | Interactive AI Chat assistant (Gemini/OpenAI), lead mailers, Google reviews fetcher & highlighting engine (API key requirements excluded). |
| **Dedicated Automation** | **Starts from ₹50,000** | / custom quoted | Task, workflow, or pipeline automation scripts, onsite deployment and setup, 1-year support & AMC packages. |
| **AI Detection Systems** | **Starts from ₹50,000** | / custom quoted | Computer vision setups (CCTV integration, anti-theft burglar alerts, PPE compliance checking) with public telecast stream support. |

---

## 🚀 Running Locally

### Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed.

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env` file in the root folder and add your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   *The application will boot in development mode and serve the landing page.*
