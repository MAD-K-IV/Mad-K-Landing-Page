import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs/promises";
import nodemailer from "nodemailer";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to save leads to a JSON file
async function saveLead(lead: any) {
  const filePath = path.join(process.cwd(), "leads.json");
  let leads = [];
  try {
    const data = await fs.readFile(filePath, "utf-8");
    leads = JSON.parse(data);
  } catch (error) {
    // File doesn't exist or is invalid JSON, start with empty list
  }
  leads.push({
    ...lead,
    timestamp: new Date().toISOString()
  });
  await fs.writeFile(filePath, JSON.stringify(leads, null, 2), "utf-8");
}

// Helper to auto-email lead details to MAD-K via Nodemailer
async function sendLeadEmail(lead: any) {
  const smtpEmail = process.env.SMTP_EMAIL;
  const smtpPassword = process.env.SMTP_PASSWORD;

  if (!smtpEmail || !smtpPassword) {
    console.warn("SMTP_EMAIL or SMTP_PASSWORD not set. Skipping lead email notification.");
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpEmail,
        pass: smtpPassword,
      },
    });

    await transporter.sendMail({
      from: `"MAD-K Lead Bot" <${smtpEmail}>`,
      to: "madkinfo@gmail.com",
      subject: `🔥 New Lead Captured: ${lead.name}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; color: #e0e0e0; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 24px 32px;">
            <h1 style="margin: 0; font-size: 22px; color: #ffffff;">🚀 New Lead Captured</h1>
            <p style="margin: 4px 0 0; font-size: 13px; color: rgba(255,255,255,0.8);">Via MAD-K AI Assistant</p>
          </div>
          <div style="padding: 24px 32px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #a78bfa; font-weight: 600; width: 120px;">Name</td><td style="padding: 8px 0;">${lead.name}</td></tr>
              <tr><td style="padding: 8px 0; color: #a78bfa; font-weight: 600;">Email</td><td style="padding: 8px 0;"><a href="mailto:${lead.email}" style="color: #60a5fa;">${lead.email}</a></td></tr>
              ${lead.phone ? `<tr><td style="padding: 8px 0; color: #a78bfa; font-weight: 600;">Phone</td><td style="padding: 8px 0;">${lead.phone}</td></tr>` : ''}
              ${lead.company ? `<tr><td style="padding: 8px 0; color: #a78bfa; font-weight: 600;">Company</td><td style="padding: 8px 0;">${lead.company}</td></tr>` : ''}
            </table>
            <div style="margin-top: 16px; padding: 16px; background: rgba(255,255,255,0.05); border-radius: 8px; border-left: 3px solid #a78bfa;">
              <p style="margin: 0 0 6px; font-size: 12px; color: #a78bfa; font-weight: 600; text-transform: uppercase;">Project Description</p>
              <p style="margin: 0; line-height: 1.6;">${lead.project_description}</p>
            </div>
          </div>
          <div style="padding: 16px 32px; background: rgba(0,0,0,0.3); font-size: 11px; color: #666;">
            Captured at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST • MAD-K Portfolio
          </div>
        </div>
      `,
    });

    console.log(`✅ Lead email sent successfully for: ${lead.name} (${lead.email})`);
  } catch (error: any) {
    console.error("❌ Failed to send lead email:", error.message);
    // Don't throw — email failure should not block the chat response
  }
}

const SYSTEM_INSTRUCTION = `You are MAD-K's advanced portfolio assistant (MAD-K Partner).
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
- Basic Portfolio (₹6,000 - ₹15,000 / week): Basic portfolio static website with enquiry form. Quoted based on requirements and project duration.
- Advanced Portfolio (₹20,000 - ₹45,000 / week): Advanced portfolio static site with chat agent, lead mailer, review autofetcher, feedback highlighter from google reviews and more. API key requirement excluded.
- Dedicated Automation (Starts from ₹50,000): Dedicated task, work, process automation and onsite installation with 1 year Support, Yearly AMC based support, etc. Quoted based on requirements.
- AI Detection Systems (Starts from ₹50,000): CCTV detection, PPE detection, anti-theft burglar systems with feed auto-telecast to public. Quoted based on requirements.

Guidelines for Your Tone & Style:
- Maintain a "technical" vibe—precise, authoritative, confident, yet friendly and helpful.
- Keep responses concise and highly scannable (using bullet points or short paragraphs). Avoid long blocks of text.
- Directly answer questions about pricing, tech stacks, and timelines based on the information above.
- If asked about custom projects that don't fit the standard tiers, encourage the user to write their specific needs here, and state that MAD-K can build bespoke solutions ranging from ₹20,000 to ₹2,00,000 depending on complexity.
- Suggest booking or selecting a tier. You can say: "You can click 'Raise Enquiry' on the cards below to get started!"
- Do not make up any facts or details about MAD-K not listed above. If you don't know, suggest they contact MAD-K directly.
- Note that you can help estimate project budgets! For example, if they describe what they want to build, give a high-level technical recommendation and tell them which tier (or custom pricing) fits best.
- Lead Capture Protocol:
  Whenever a user expresses interest in booking a tier, raising an enquiry, or collaborating with MAD-K, make sure to ask for their name, email (mandatory), and a description of their requirements.
  Once they share these details, you MUST immediately invoke the 'submit_lead' function to register and forward their lead to madkinfo@gmail.com. Warn them nicely that you are saving and sending their lead details to MAD-K.`;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini AI client successfully initialized on backend server.");
  } else {
    console.warn("GEMINI_API_KEY is not defined in environment variables. Running in Demo Mode.");
  }

  // API endpoint for chatbot
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid messages payload" });
      }

      if (!ai) {
        return res.json({
          text: "Hello! It looks like the GEMINI_API_KEY is missing on this environment. However, as MAD-K's team assistant, I can tell you that we specialize in custom RAG Chatbots, Python automation scripts, and React/Full-Stack web applications! Feel free to explore the service tiers or projects below."
        });
      }

      const submitLeadFunctionDeclaration = {
        name: "submit_lead",
        description: "Call this function when the user provides their contact details (such as email or phone number) and explains what they want to build, or explicitly asks to submit an enquiry/lead. This function captures their name, email, phone, company, and project description.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            name: {
              type: Type.STRING,
              description: "The name of the lead/user."
            },
            email: {
              type: Type.STRING,
              description: "The email address of the lead/user."
            },
            phone: {
              type: Type.STRING,
              description: "The phone number of the lead/user (optional)."
            },
            company: {
              type: Type.STRING,
              description: "The company name of the lead/user (optional)."
            },
            project_description: {
              type: Type.STRING,
              description: "A summary of the project requirements, services needed, or what the user wants to build."
            }
          },
          required: ["name", "email", "project_description"]
        }
      };

      // Format messages for the @google/genai SDK
      // We map the incoming messages array to Gemini's format: { role: 'user'|'model', parts: [{ text: string }] }
      const contents = messages.map(msg => {
        const role = msg.sender === 'user' ? 'user' : 'model';
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
          const args = call.args as any;
          leadCaptured = true;
          leadDetails = args;
          
           // Save lead to local disk
          await saveLead(args);

          // Auto-email lead details to MAD-K
          await sendLeadEmail(args);

          const previousContent = response.candidates?.[0]?.content;
          const functionResponsePart = {
            functionResponse: {
              name: "submit_lead",
              response: { status: "success", message: "Enquiry successfully registered and forwarded to MAD-K (madkinfo@gmail.com)." }
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
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: "Failed to generate AI response: " + error.message });
    }
  });

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
