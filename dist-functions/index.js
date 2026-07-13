var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/functions/index.ts
var index_exports = {};
__export(index_exports, {
  api: () => api
});
module.exports = __toCommonJS(index_exports);
var import_https = require("firebase-functions/v2/https");
var import_express = __toESM(require("express"), 1);
var import_genai = require("@google/genai");
var import_app = require("firebase-admin/app");
var import_firestore = require("firebase-admin/firestore");
(0, import_app.initializeApp)();
var db = (0, import_firestore.getFirestore)();
async function saveLead(lead) {
  await db.collection("leads").add({
    ...lead,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
}
var SYSTEM_INSTRUCTION = `You are MAD-K's advanced portfolio assistant (MAD-K Partner).
Your goal is to answer questions from potential clients about MAD-K's skills, experience, project catalog, services, pricing, and availability.

About MAD-K:
- Role: Full-Stack & Gen-AI Specialist.
- Tagline: "We build AI chatbots and automation that turn your website into a lead machine."
- Bio: Expertise in Retrieval-Augmented Generation (RAG), GenAI, Python automation, and high-performance Web / Full-Stack development.
- Work Ethic: Focused on high-performance, precision-engineered solutions with clean typography, dark-mode layouts, and fast loading speeds.

What MAD-K Builds (Services):
1. RAG Chatbots (Tech: Pinecone, Milvus, OpenAI, Gemini): High-accuracy smart knowledge retrieval systems grounding AI answers in proprietary business data.
2. Task Automation (Tech: Python, Selenium, BeautifulSoup, Celery): Custom scripts to eliminate repetitive manual work, data scraping, or report generation.
3. AI Web Apps (Tech: React, NestJS, Express, Tailwind CSS, Motion): Full-stack, high-performance web applications with seamless integrated AI features and reactive UIs.
4. Image Detection (Tech: PyTorch, YOLO, OpenCV): Custom computer vision solutions for quality control, object counting, or real-time surveillance.

Pricing & Service Tiers:
- Basic Portfolio (\u20B96,000 - \u20B915,000 / week): Basic portfolio static website with enquiry form. Quoted based on requirements and project duration.
- Advanced Portfolio (\u20B920,000 - \u20B945,000 / week): Advanced portfolio static site with chat agent, lead mailer, review autofetcher, feedback highlighter from google reviews and more. API key requirement excluded.
- Dedicated Automation (Starts from \u20B950,000): Dedicated task, work, process automation and onsite installation with 1 year Support, Yearly AMC based support, etc. Quoted based on requirements.
- AI Detection Systems (Starts from \u20B950,000): CCTV detection, PPE detection, anti-theft burglar systems with feed auto-telecast to public. Quoted based on requirements.

Guidelines for Your Tone & Style:
- Maintain a "technical" vibe\u2014precise, authoritative, confident, yet friendly and helpful.
- Keep responses concise and highly scannable (using bullet points or short paragraphs). Avoid long blocks of text.
- Directly answer questions about pricing, tech stacks, and timelines based on the information above.
- If asked about custom projects that don't fit the standard tiers, encourage the user to write their specific needs here, and state that MAD-K can build bespoke solutions ranging from \u20B920,000 to \u20B92,00,000 depending on complexity.
- Suggest booking or selecting a tier. You can say: "You can click 'Raise Enquiry' on the cards below to get started!"
- Do not make up any facts or details about MAD-K not listed above. If you don't know, suggest they contact MAD-K directly.
- Note that you can help estimate project budgets! For example, if they describe what they want to build, give a high-level technical recommendation and tell them which tier (or custom pricing) fits best.
- Lead Capture Protocol:
  Whenever a user expresses interest in booking a tier, raising an enquiry, or collaborating with MAD-K, make sure to ask for their name, email (mandatory), and a description of their requirements.
  Once they share these details, you MUST immediately invoke the 'submit_lead' function to register and forward their lead to kamatchi825@gmail.com. Warn them nicely that you are saving and sending their lead details to MAD-K.`;
var app = (0, import_express.default)();
app.use(import_express.default.json());
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages payload" });
    }
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        text: "Hello! It looks like the GEMINI_API_KEY is missing on this environment. However, as MAD-K's team assistant, I can tell you that we specialize in custom RAG Chatbots, Python automation scripts, and React/Full-Stack web applications! Feel free to explore the service tiers or projects below."
      });
    }
    const ai = new import_genai.GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
    const submitLeadFunctionDeclaration = {
      name: "submit_lead",
      description: "Call this function when the user provides their contact details (such as email or phone number) and explains what they want to build, or explicitly asks to submit an enquiry/lead. This function captures their name, email, phone, company, and project description.",
      parameters: {
        type: import_genai.Type.OBJECT,
        properties: {
          name: {
            type: import_genai.Type.STRING,
            description: "The name of the lead/user."
          },
          email: {
            type: import_genai.Type.STRING,
            description: "The email address of the lead/user."
          },
          phone: {
            type: import_genai.Type.STRING,
            description: "The phone number of the lead/user (optional)."
          },
          company: {
            type: import_genai.Type.STRING,
            description: "The company name of the lead/user (optional)."
          },
          project_description: {
            type: import_genai.Type.STRING,
            description: "A summary of the project requirements, services needed, or what the user wants to build."
          }
        },
        required: ["name", "email", "project_description"]
      }
    };
    const contents = messages.map((msg) => {
      const role = msg.sender === "user" ? "user" : "model";
      return {
        role,
        parts: [{ text: msg.text }]
      };
    });
    let response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        tools: [{ functionDeclarations: [submitLeadFunctionDeclaration] }]
      }
    });
    let leadCaptured = false;
    let leadDetails = null;
    const functionCalls = response.functionCalls;
    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];
      if (call.name === "submit_lead") {
        const args = call.args;
        leadCaptured = true;
        leadDetails = args;
        await saveLead(args);
        const previousContent = response.candidates?.[0]?.content;
        const functionResponsePart = {
          functionResponse: {
            name: "submit_lead",
            response: { status: "success", message: "Enquiry successfully registered and forwarded to MAD-K (kamatchi825@gmail.com)." }
          }
        };
        response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: [
            ...contents,
            previousContent,
            { role: "tool", parts: [functionResponsePart] }
          ],
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
            tools: [{ functionDeclarations: [submitLeadFunctionDeclaration] }]
          }
        });
      }
    }
    res.json({ text: response.text, leadCaptured, leadDetails });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to generate AI response: " + error.message });
  }
});
var api = (0, import_https.onRequest)({
  cors: true,
  secrets: ["GEMINI_API_KEY"]
}, app);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  api
});
//# sourceMappingURL=index.js.map
