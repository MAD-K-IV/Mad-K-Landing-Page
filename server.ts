import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// Helper to auto-email lead details to MAD-K via Nodemailer
async function sendLeadEmail(lead: any, metadata: any = {}, convoHistory: any[] = []) {
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

    const leadName = lead.name || "Anonymous Visitor";

    let convoHtml = "";
    if (convoHistory && convoHistory.length > 0) {
      convoHtml = `
        <h3 style="color: #ffffff; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px; margin-top: 24px;">💬 Chat History</h3>
        <div style="background: rgba(0,0,0,0.2); padding: 16px; border-radius: 8px; font-size: 13px; max-height: 300px; overflow-y: auto;">
      `;
      for (const msg of convoHistory) {
        const isUser = msg.sender === 'user';
        const color = isUser ? '#a78bfa' : '#60a5fa';
        const label = isUser ? 'User' : 'Assistant';
        convoHtml += `
          <div style="margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.02); padding-bottom: 8px;">
            <strong style="color: ${color}; font-size: 11px; text-transform: uppercase;">${label}</strong>
            <p style="margin: 4px 0 0; color: #e0e0e0; line-height: 1.5; font-family: sans-serif; white-space: pre-wrap;">${msg.text}</p>
          </div>
        `;
      }
      convoHtml += `</div>`;
    }

    await transporter.sendMail({
      from: `"MAD-K Lead Bot" <${smtpEmail}>`,
      to: "madkinfo@gmail.com",
      subject: `🔥 New Lead / Requirement: ${leadName}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 1000px; margin: 0 auto; background: #1a1a2e; color: #e0e0e0; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.05);">
          <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 24px 32px;">
            <h1 style="margin: 0; font-size: 22px; color: #ffffff;">🚀 New Lead / Requirements</h1>
            <p style="margin: 4px 0 0; font-size: 13px; color: rgba(255,255,255,0.8);">Via MAD-K AI Assistant</p>
          </div>
          <div style="padding: 24px 32px;">
            <h3 style="margin-top: 0; color: #ffffff; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">Contact / Enquiry Details</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr><td style="padding: 6px 0; color: #a78bfa; font-weight: 600; width: 120px;">Name</td><td style="padding: 6px 0; color: #ffffff;">${lead.name || '<span style="color:#666; font-style:italic;">Not Provided</span>'}</td></tr>
              <tr><td style="padding: 6px 0; color: #a78bfa; font-weight: 600;">Email</td><td style="padding: 6px 0;">${lead.email ? `<a href="mailto:${lead.email}" style="color: #60a5fa;">${lead.email}</a>` : '<span style="color:#666; font-style:italic;">Not Provided</span>'}</td></tr>
              ${lead.phone ? `<tr><td style="padding: 6px 0; color: #a78bfa; font-weight: 600;">Phone</td><td style="padding: 6px 0; color: #ffffff;">${lead.phone}</td></tr>` : ''}
              ${lead.company ? `<tr><td style="padding: 6px 0; color: #a78bfa; font-weight: 600;">Company</td><td style="padding: 6px 0; color: #ffffff;">${lead.company}</td></tr>` : ''}
            </table>
            
            <div style="margin-bottom: 24px; padding: 16px; background: rgba(255,255,255,0.03); border-radius: 8px; border-left: 3px solid #a78bfa;">
              <p style="margin: 0 0 6px; font-size: 12px; color: #a78bfa; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Project Requirements</p>
              <p style="margin: 0; line-height: 1.6; color: #ffffff; font-size: 14px;">${lead.project_description}</p>
            </div>

            ${convoHtml}

            <h3 style="color: #ffffff; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px; margin-top: 24px;">Visitor Metadata & Diagnostics</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 12px; line-height: 1.5;">
              <tr><td style="padding: 5px 0; color: #a78bfa; font-weight: 600; width: 140px;">IP Address</td><td style="padding: 5px 0; font-family: monospace;">${metadata.ip || 'Unknown'}</td></tr>
              <tr><td style="padding: 5px 0; color: #a78bfa; font-weight: 600;">Approx. Location</td><td style="padding: 5px 0;">${metadata.location || 'Unknown'}</td></tr>
              <tr><td style="padding: 5px 0; color: #a78bfa; font-weight: 600;">Browser User Agent</td><td style="padding: 5px 0; word-break: break-all;">${metadata.browser || 'Unknown'}</td></tr>
              <tr><td style="padding: 5px 0; color: #a78bfa; font-weight: 600;">Screen Resolution</td><td style="padding: 5px 0;">${metadata.resolution || 'Unknown'}</td></tr>
              <tr><td style="padding: 5px 0; color: #a78bfa; font-weight: 600;">Timezone</td><td style="padding: 5px 0;">${metadata.timezone || 'Unknown'}</td></tr>
              <tr><td style="padding: 5px 0; color: #a78bfa; font-weight: 600;">Language</td><td style="padding: 5px 0;">${metadata.language || 'Unknown'}</td></tr>
              <tr><td style="padding: 5px 0; color: #a78bfa; font-weight: 600;">Referrer</td><td style="padding: 5px 0;">${metadata.referrer || 'Unknown'}</td></tr>
              <tr><td style="padding: 5px 0; color: #a78bfa; font-weight: 600;">Digital Signature Hash</td><td style="padding: 5px 0; font-family: monospace; color: #f472b6; font-weight: bold;">${metadata.signature || 'Unknown'}</td></tr>
            </table>
          </div>
          <div style="padding: 16px 32px; background: rgba(0,0,0,0.3); font-size: 11px; color: #666; text-align: center;">
            Captured at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST • MAD-K Portfolio System
          </div>
        </div>
      `,
    });

    console.log(`✅ Lead email sent successfully for: ${leadName}`);
  } catch (error: any) {
    console.error("❌ Failed to send lead email:", error.message);
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
  Whenever a user expresses interest in booking a tier, raising an enquiry, collaborating with MAD-K, OR simply describes their project requirements, you MUST immediately invoke the 'submit_lead' function. Do NOT wait for contact details (like name/email) to register the lead — register it as soon as their project requirements are clear! If they do offer contact details, capture them too. Warn them nicely that you are registering their enquiry details.`;

// Local static chatbot fallback gateway
async function runStaticFallback(messages: any[], metadataPayload: any) {
  let email = "";
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
  
  let phone = "";
  const phoneRegex = /\b\+?[0-9]{7,15}\b/;

  let name = "";

  const userMessages = messages.filter(m => m.sender === 'user');

  // strictly parse using pipe '|' separator
  for (const m of userMessages) {
    const text = m.text || "";
    if (text.includes('|')) {
      const split = text.split('|').map(p => p.trim());
      if (split.length >= 3) {
        name = split[0];
        phone = split[1];
        email = split[2];
        break;
      } else if (split.length === 2) {
        name = split[0];
        email = split[1];
        break;
      }
    }
  }

  // To find the project description:
  const descParts: string[] = [];
  for (const m of userMessages) {
    const text = m.text || "";
    const cleaned = text.trim();
    
    if (cleaned.includes('|') || cleaned.length < 8) {
      continue;
    }
    
    descParts.push(cleaned);
  }
  
  let project_description = descParts.join(" ");

  if (!project_description && userMessages.length > 0) {
    const nonSplitMsgs = userMessages.filter(m => !(m.text || "").includes('|'));
    if (nonSplitMsgs.length > 0) {
      project_description = nonSplitMsgs[nonSplitMsgs.length - 1].text || "";
    } else {
      project_description = userMessages[0].text || "";
    }
  }

  const latestMessage = userMessages[userMessages.length - 1]?.text || "";
  const query = latestMessage.toLowerCase();

  // If we have requirements and email, trigger the lead!
  if (project_description && email && emailRegex.test(email)) {
    if (!name) name = "Anonymous Visitor";
    const leadDetails = { name, email, phone, project_description };
    await sendLeadEmail(leadDetails, metadataPayload, messages);
    return {
      text: `Thank you! Your requirements have been successfully registered and emailed to the MAD-K team. We will reach out to you at **${email}** (Phone: ${phone || 'Not Provided'}) soon! 🚀`,
      leadCaptured: true,
      leadDetails
    };
  }

  // If we have requirements, but no email:
  if (project_description && project_description.length > 15) {
    return {
      text: `Got it! I've noted down your project requirements.
      
To submit this enquiry directly to the MAD-K team, please provide your **Name**, **Mobile Number**, and **Email Address** in this exact format:

**Name | Mobile | Email**

*For example: Madk | 9655841515 | madkinfo@gmail.com*`,
      leadCaptured: false,
      leadDetails: null
    };
  }

  // Keyword Matching responses
  let replyText = "";
  if (query.includes("price") || query.includes("pricing") || query.includes("cost") || query.includes("tier") || query.includes("rate") || query.includes("how much") || query.includes("package")) {
    replyText = `We offer four structured service tiers:
- **Basic Portfolio** (₹6k - ₹15k/week): Static responsive website with inquiry forms.
- **Advanced Portfolio** (₹20k - ₹45k/week): AI chatbot integration, lead mailer automation, review fetchers, and feedback highlights. (API keys excluded).
- **Dedicated Automation** (Starts from ₹50k): Custom Python scrapers, workflow automations, and onsite setup.
- **Detection Systems** (Starts from ₹50k): CCTV security & computer vision analytics with public feed integrations.

Describe what you'd like to build here, and we can register your enquiry!`;
  } else if (query.includes("about") || query.includes("mad-k") || query.includes("who are you") || query.includes("experience") || query.includes("team")) {
    replyText = `MAD-K is a high-performance specialist team focused on building AI chatbots, Retrieval-Augmented Generation (RAG) search engines, custom web applications, and Python task automation workflows. 

Tell me what you are looking to build, and I will capture your project requirements!`;
  } else if (query.includes("contact") || query.includes("email") || query.includes("reach") || query.includes("phone") || query.includes("whatsapp") || query.includes("linkedin")) {
    replyText = `You can reach the MAD-K team directly through:
- **Email**: madkinfo@gmail.com
- **WhatsApp**: +91 96558 41515
- **LinkedIn**: linkedin.com/in/kamatchi-somesh

Otherwise, describe your project requirements here, and we'll automatically mail them to the team!`;
  } else {
    replyText = `Hello! I am the MAD-K team's assistant. 

We build AI RAG chatbots, custom Python automation systems, React/Full-Stack web applications, and computer vision models.

What kind of website or automation project are you looking to build? Describe it here and I'll route it to the team!`;
  }

  return {
    text: replyText,
    leadCaptured: false,
    leadDetails: null
  };
}

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
      const { messages, clientMetadata } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid messages payload" });
      }

      // Guardrail against excessive token usage (e.g. massive paragraphs)
      const hasTooLongMessage = messages.some(msg => msg.text && msg.text.length > 1000);
      if (hasTooLongMessage) {
        return res.json({
          text: "⚠️ Your message exceeds our security guardrail limit of 1000 characters. Please shorten your response and try again."
        });
      }

      // Collect geolocation and network details from incoming request headers
      const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "Unknown";
      const clientIp = typeof rawIp === 'string' ? rawIp.split(',')[0].trim() : "Unknown";
      
      const country = req.headers['x-vercel-ip-country'] || "Unknown";
      const region = req.headers['x-vercel-ip-country-region'] || "Unknown";
      const city = req.headers['x-vercel-ip-city'] || "Unknown";
      const location = country !== "Unknown" ? `${city}, ${region}, ${country}` : "Local/Unknown";

      const metadataPayload = {
        ip: clientIp,
        location: location,
        browser: clientMetadata?.userAgent || req.headers['user-agent'] || "Unknown",
        resolution: clientMetadata?.screenResolution || "Unknown",
        timezone: clientMetadata?.timezone || "Unknown",
        language: clientMetadata?.language || "Unknown",
        referrer: clientMetadata?.referrer || "Unknown",
        signature: clientMetadata?.canvasFingerprint || "Unknown"
      };

      if (!ai) {
        console.warn("Gemini client not initialized. Falling back to static mode.");
        const fallbackRes = await runStaticFallback(messages, metadataPayload);
        return res.json(fallbackRes);
      }

      const submitLeadFunctionDeclaration = {
        name: "submit_lead",
        description: "Call this function when the user describes their project requirements or provides contact details. This registers the lead details and requirements.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            name: {
              type: Type.STRING,
              description: "The name of the lead/user (optional)."
            },
            email: {
              type: Type.STRING,
              description: "The email address of the lead/user (optional)."
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
          required: ["project_description"]
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
          
          // Auto-email lead details to MAD-K along with diagnostic metadata
          await sendLeadEmail(args, metadataPayload, messages);

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
      console.error("Gemini API Error, falling back to static mode:", error.message);
      try {
        const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "Unknown";
        const clientIp = typeof rawIp === 'string' ? rawIp.split(',')[0].trim() : "Unknown";
        const country = req.headers['x-vercel-ip-country'] || "Unknown";
        const region = req.headers['x-vercel-ip-country-region'] || "Unknown";
        const city = req.headers['x-vercel-ip-city'] || "Unknown";
        const location = country !== "Unknown" ? `${city}, ${region}, ${country}` : "Local/Unknown";

        const metadataPayload = {
          ip: clientIp,
          location: location,
          browser: req.body.clientMetadata?.userAgent || req.headers['user-agent'] || "Unknown",
          resolution: req.body.clientMetadata?.screenResolution || "Unknown",
          timezone: req.body.clientMetadata?.timezone || "Unknown",
          language: req.body.clientMetadata?.language || "Unknown",
          referrer: req.body.clientMetadata?.referrer || "Unknown",
          signature: req.body.clientMetadata?.canvasFingerprint || "Unknown"
        };
        
        const fallbackRes = await runStaticFallback(req.body.messages || [], metadataPayload);
        res.json(fallbackRes);
      } catch (innerError: any) {
        console.error("Critical double failure in static fallback mode:", innerError.message);
        res.status(500).json({ error: "Failed to generate AI response or run fallback: " + innerError.message });
      }
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
