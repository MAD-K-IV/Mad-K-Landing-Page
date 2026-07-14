import React, { useState, useRef, useEffect, FormEvent } from "react";
import Markdown from "react-markdown";
import { 
  Database, 
  Cpu, 
  Terminal, 
  Eye, 
  Send, 
  Check, 
  MessageSquare, 
  Menu, 
  X, 
  ArrowRight, 
  Github, 
  Linkedin, 
  ShieldAlert,
  Mail,
  MessageCircle,
  Phone,
  User
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";


// YOUR PORTFOLIO WHATSAPP NUMBER (with country code, no + or spaces)
const PORTFOLIO_WHATSAPP_NUMBER = "919655841515"; 

function getClientMetadata() {
  const userAgent = navigator.userAgent;
  const screenResolution = `${window.screen.width}x${window.screen.height}`;
  const language = navigator.language;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const referrer = document.referrer || "Direct";
  
  // Simple Canvas Fingerprint / Digital Signature
  let canvasFingerprint = "Unknown";
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      canvas.width = 200;
      canvas.height = 50;
      ctx.textBaseline = "top";
      ctx.font = "14px 'Arial'";
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#f60";
      ctx.fillRect(125,1,62,20);
      ctx.fillStyle = "#069";
      ctx.fillText("MAD-K Fingerprint, alpha 123", 2, 15);
      ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
      ctx.fillText("MAD-K Fingerprint, alpha 123", 4, 17);
      const str = canvas.toDataURL();
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
      }
      canvasFingerprint = Math.abs(hash).toString(16);
    }
  } catch (e) {
    // ignore
  }

  return {
    userAgent,
    screenResolution,
    language,
    timezone,
    referrer,
    canvasFingerprint
  };
}

// Reusable scroll-triggered reveal animation wrapper

function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  className?: string;
}) {
  const offsets: Record<string, { x: number; y: number }> = {
    up: { x: 0, y: 30 },
    down: { x: 0, y: -30 },
    left: { x: 30, y: 0 },
    right: { x: -30, y: 0 },
    none: { x: 0, y: 0 },
  };
  const { x, y } = offsets[direction];
  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Custom dynamic brand logo component matching input_file_1.png shape and gradients
// export function MadKLogo({ className = "w-8 h-8" }: { className?: string }) {
//   return (
//     <svg
//       className={className}
//       viewBox="0 0 120 120"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <defs>
//         <linearGradient id="madk-logo-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
//           <stop offset="0%" stopColor="#e879f9" /> {/* Violet-Pink/Magenta */}
//           <stop offset="50%" stopColor="#a78bfa" /> {/* Purple */}
//           <stop offset="100%" stopColor="#38bdf8" /> {/* Light Blue/Cyan */}
//         </linearGradient>
//       </defs>
//       <path
//         d="M25 75 C 22 50, 36 32, 46 50 C 54 62, 59 75, 71 55 C 80 32, 95 40, 92 70"
//         stroke="url(#madk-logo-gradient)"
//         strokeWidth="15"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         style={{ filter: "drop-shadow(0 4px 10px rgba(167, 139, 250, 0.45))" }}
//       />
//     </svg>
//   );
// }



const PROJECTS = [
  {
    id: "anomaly-detection",
    title: "Anomaly Detection System",
    description: "Advanced network intelligence platform designed to detect malicious system anomalies and telemetry outliers in real-time.",
    url: "https://github.com/Somesh-S-Dev/Anomaly-Detection-System",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
    tags: ["Machine Learning", "Cybersecurity", "Python"]
  },
  {
    id: "mopso-solar-optimizer",
    title: "MOPSO Solar Optimizer",
    description: "Multi-Objective Particle Swarm Optimization framework engineered to maximize clean solar power absorption and optimize storage configuration metrics.",
    url: "https://github.com/Somesh-S-Dev/MOPSO-Solar-Optimizer",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80",
    tags: ["Optimization Algorithms", "Renewable Energy", "MATLAB"]
  },
  {
    id: "job-scout",
    title: "Job Scout",
    description: "Automated career intelligence crawler scraping live vacancies, mapping profile alignments, and pre-filling applications.",
    url: "https://github.com/Somesh-S-Dev/Job-Scout",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80",
    tags: ["Web Scraping", "Automation", "Node.js"]
  },
  {
    id: "post-scheduler",
    title: "Post Scheduler",
    description: "Python-driven social media automation tool, optimizing calendar posts, managing content queues, and scheduling cross-platform.",
    url: "https://github.com/Somesh-S-Dev/Post-Scheduler",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    tags: ["Automation", "Python", "API Integration"]
  },
  {
    id: "sentinel-secured",
    title: "Sentinel Secured Portal",
    description: "Quantum-grade encrypted messaging portal featuring advanced key exchange algorithms and total user isolation layers.",
    url: "https://github.com/Somesh-S-Dev/Sentinel-Secured-communication-portal",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    tags: ["Cryptography", "Network Security", "Fullstack"]
  }
];

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  leadCaptured?: boolean;
  promptLeadInput?: boolean;
  leadDetails?: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    project_description: string;
  };
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: "Hello! We are MAD-K's team. Our AI assistant can explain our technical stack, walk you through our projects, or help you estimate a project budget. What are you looking to build?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTier, setActiveTier] = useState<string | null>(null);

  // Enquiry state
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [enquiryTier, setEnquiryTier] = useState<{name: string, price: string} | null>(null);
  const [enquiryRequirements, setEnquiryRequirements] = useState("");
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Lead modal state
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadMobile, setLeadMobile] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadError, setLeadError] = useState("");

  const [view, setView] = useState<'home' | 'privacy' | 'terms'>('home');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  }, [view]);



  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  // Advanced Custom Glow Cursor states
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    // Check device capabilities
    const checkDevice = () => {
      const touchCapable = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(touchCapable);
      if (!touchCapable) {
        document.documentElement.classList.add('custom-cursor-enabled');
      } else {
        document.documentElement.classList.remove('custom-cursor-enabled');
      }
    };
    checkDevice();

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;

      const rotY = -(dx / cx) * 50; // max 35 degrees Y rotation
      const rotX = (dy / cy) * 50;  // max 35 degrees X rotation

      const container = document.getElementById("background-water-container");
      if (container) {
        container.style.setProperty("--rot-x", `${rotX}deg`);
        container.style.setProperty("--rot-y", `${rotY}deg`);
      }
    };

    const handleMouseLeave = () => {
      const container = document.getElementById("background-water-container");
      if (container) {
        container.style.setProperty("--rot-x", "0deg");
        container.style.setProperty("--rot-y", "0deg");
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') || 
        target.classList.contains('cursor-pointer') ||
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.classList.remove('custom-cursor-enabled');
    };
  }, []);

  // Auto-scroll to bottom of chat window
  const scrollToBottom = () => {
    const chatContainer = document.getElementById("chat-messages");
    if (chatContainer) {
      chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const currentTime = new Date().toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    const newUserMessage: Message = {
      sender: 'user',
      text: textToSend,
      time: currentTime
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          messages: updatedMessages,
          clientMetadata: getClientMetadata()
        })
      });

      if (!response.ok) {
        throw new Error("Failed to connect to the assistant server.");
      }

      const data = await response.json();
      
      const assistantTime = new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: data.text || "We apologize, but we received an empty response. Can you please rephrase?",
          time: assistantTime,
          leadCaptured: data.leadCaptured,
          promptLeadInput: data.promptLeadInput,
          leadDetails: data.leadDetails
        }
      ]);
    } catch (error: any) {
      console.error(error);
      const assistantTime = new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: "We're currently facing issues with our assistant. We'll be back soon — please try again in a moment! 🚧",
          time: assistantTime
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLeadError("");

    if (!leadName.trim()) {
      setLeadError("Name is required.");
      return;
    }

    const phoneCleaned = leadMobile.trim();
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(phoneCleaned)) {
      setLeadError("Please enter a valid mobile number (10 to 15 digits).");
      return;
    }

    const emailCleaned = leadEmail.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailCleaned)) {
      setLeadError("Please enter a valid email address.");
      return;
    }

    const formatted = `${leadName.trim()} | ${phoneCleaned} | ${emailCleaned}`;
    handleSendMessage(formatted);

    setLeadModalOpen(false);
    setLeadName("");
    setLeadMobile("");
    setLeadEmail("");
  };

  const handleOpenEnquiryModal = (tierName: string, price: string) => {
    setActiveTier(tierName);
    setEnquiryTier({ name: tierName, price });
    setEnquiryRequirements("");
    setEnquiryModalOpen(true);
  };

  const handleEnquirySubmit = (channel: 'email' | 'whatsapp' | 'linkedin') => {
    if (!enquiryTier) return;

    const { name: tierName, price } = enquiryTier;
    const requirementsText = enquiryRequirements.trim() || "No specific requirements specified.";

    // Close modal
    setEnquiryModalOpen(false);

    // Open the chosen external channel directly — no chatbot message
    if (channel === 'email') {
      const emailRecipient = "madkinfo@gmail.com";
      const emailSubject = encodeURIComponent(`MAD-K Enquiry: ${tierName} Tier`);
      const emailBody = encodeURIComponent(
        `Hello MAD-K,\n\nI would like to raise an enquiry for the "${tierName}" service tier (${price}).\n\nRequirements:\n${requirementsText}\n\nLooking forward to your response!\n`
      );
      const mailtoLink = `mailto:${emailRecipient}?subject=${emailSubject}&body=${emailBody}`;
      // Use temporary anchor tag to prevent opening blank browser tabs
      const link = document.createElement('a');
      link.href = mailtoLink;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (channel === 'whatsapp') {
      const waText = encodeURIComponent(
        `Hello MAD-K! I am interested in the "${tierName}" tier (${price}).\n\nRequirements:\n${requirementsText}`
      );
      window.open(`https://api.whatsapp.com/send?phone=${PORTFOLIO_WHATSAPP_NUMBER}&text=${waText}`, '_blank');
    } else if (channel === 'linkedin') {
      const linkedInText = `Hello MAD-K! I am interested in the "${tierName}" tier (${price}).\n\nRequirements:\n${requirementsText}`;
      navigator.clipboard.writeText(linkedInText);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 4000);
      window.open("https://linkedin.com/in/kamatchi-somesh", '_blank');
    }
  };

  const handleQuickCTA = () => {
    setView('home');
    setTimeout(() => {
      const chatElement = document.getElementById("chat");
      if (chatElement) {
        chatElement.scrollIntoView({ behavior: "smooth" });
      }
      setInputValue("Hello! I want to estimate a project budget with you.");
      setTimeout(() => {
        chatInputRef.current?.focus();
      }, 800);
    }, 100);
  };

  return (
    <div className="relative min-h-screen bg-background text-on-background font-sans selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden">
      


      {/* Grid Overlay for authentic tech feel */}
      <div id="grid-overlay" className="fixed inset-0 grid-pattern pointer-events-none z-0 opacity-40"></div>

      {/* Ambient background glows */}
      <div className="ambient-glow ambient-glow-1"></div>
      <div className="ambient-glow ambient-glow-2"></div>

      {/* Dissolved Water Logo Background */}
      <div id="background-water-container" className="background-water-container">
        <div className="background-water-float-wrapper">
          <img 
            src="/logo.png" 
            className="background-water-logo" 
            alt="MAD-K Background Logo" 
            referrerPolicy="no-referrer"
          />
        </div>
      </div>





        {/* Navigation */}
      <nav id="navbar" className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/10">
        <div className="flex justify-between items-center h-20 px-6 md:px-12 max-w-7xl mx-auto">
          <button 
            id="nav-logo" 
            onClick={() => setView('home')} 
            className="flex items-center gap-4 hover:opacity-90 transition-opacity cursor-pointer bg-transparent border-none p-0 focus:outline-none"
          >
            <img src="/logo.png" alt="MAD-K Logo" className="w-14 h-14 object-contain" referrerPolicy="no-referrer" />
            <img src="/brand.png" alt="MAD-K" className="h-9 object-contain" referrerPolicy="no-referrer" />
          </button>
          
          {/* Desktop Nav links */}
          <div id="desktop-nav" className="hidden md:flex gap-8 items-center">
            <a 
              id="link-services" 
              onClick={() => setView('home')} 
              className="font-display text-sm text-on-surface-variant hover:text-primary transition-colors" 
              href="#services"
            >
              Services
            </a>
            <a 
              id="link-projects" 
              onClick={() => setView('home')} 
              className="font-display text-sm text-on-surface-variant hover:text-primary transition-colors" 
              href="#projects"
            >
              Projects
            </a>
            <a 
              id="link-pricing" 
              onClick={() => setView('home')} 
              className="font-display text-sm text-on-surface-variant hover:text-primary transition-colors" 
              href="#pricing"
            >
              Pricing
            </a>
            <button 
              id="btn-get-started" 
              onClick={handleQuickCTA}
              className="px-5 py-2.5 bg-gradient-to-r from-inverse-primary to-secondary-container text-white font-bold rounded-lg active:scale-95 hover:brightness-110 transition-all primary-glow cursor-pointer"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            id="btn-mobile-menu" 
            className="md:hidden text-primary focus:outline-none p-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              id="mobile-nav-panel"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden w-full bg-background/95 backdrop-blur-lg border-b border-white/10 px-6 py-6 flex flex-col gap-4 absolute left-0 top-20 z-40"
            >
              <a 
                id="mob-link-services" 
                className="font-display text-lg py-2 text-on-surface-variant hover:text-primary transition-colors" 
                href="#services"
                onClick={() => {
                  setView('home');
                  setMobileMenuOpen(false);
                }}
              >
                Services
              </a>
              <a 
                id="mob-link-projects" 
                className="font-display text-lg py-2 text-on-surface-variant hover:text-primary transition-colors" 
                href="#projects"
                onClick={() => {
                  setView('home');
                  setMobileMenuOpen(false);
                }}
              >
                Projects
              </a>
              <a 
                id="mob-link-pricing" 
                className="font-display text-lg py-2 text-on-surface-variant hover:text-primary transition-colors" 
                href="#pricing"
                onClick={() => {
                  setView('home');
                  setMobileMenuOpen(false);
                }}
              >
                Pricing
              </a>
              <button 
                id="mob-btn-get-started" 
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleQuickCTA();
                }}
                className="w-full py-3 mt-2 bg-gradient-to-r from-inverse-primary to-secondary-container text-white font-bold rounded-lg text-center"
              >
                Get Started
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content Area */}
      {view === 'home' ? (
        <main className="relative z-10 pt-20">
        
        {/* Hero Section */}
        <section id="hero" className="relative min-h-[80vh] flex flex-col justify-center items-center text-center px-6 md:px-12 py-20 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            {/* Beautiful glowing large logo emblem */}
            {/* <div className="mb-12 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/25 via-purple-500/25 to-sky-500/25 blur-3xl rounded-full w-52 h-52 animate-pulse"></div>
              <div className="relative p-6 rounded-3xl bg-white/5 border border-white/10 shadow-2xl backdrop-blur-md">
                <img src="/logo.png" alt="MAD-K Logo" className="w-36 h-36 object-contain animate-float" referrerPolicy="no-referrer" />
              </div>
            </div> */}

            <span id="hero-chip" className="font-label-mono text-xs text-primary bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full mb-8 inline-block tracking-widest">
              FULL-STACK &amp; GEN-AI SPECIALIST
            </span>
            
            <h1 id="hero-title" className="font-display text-4xl md:text-6xl lg:text-7xl font-extrabold mb-8 tracking-tighter leading-tight max-w-4xl text-white">
              We build AI chatbots and automation that <span className="gradient-text">turn your website into a lead machine.</span>
            </h1>
            
            <p id="hero-subtitle" className="font-sans text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-12 leading-relaxed">
              Expertise in RAG, GenAI, Python automation, and high-performance Web/Full-Stack development. Let's automate your growth.
            </p>

            <div id="hero-actions" className="flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                id="btn-hero-chat"
                onClick={handleQuickCTA}
                className="px-8 py-4 bg-gradient-to-r from-inverse-primary to-secondary-container text-white font-extrabold rounded-lg active:scale-95 transition-transform primary-glow text-lg flex items-center gap-3 cursor-pointer"
              >
                Chat with our AI assistant <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        </section>

        {/* Live Demo Block */}
        <section id="chat" className="px-6 md:px-12 py-24 max-w-4xl mx-auto scroll-mt-24">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 id="chat-section-title" className="font-display text-3xl md:text-5xl font-bold mb-4 tracking-tight">
                Experience MAD-K Partner
              </h2>
              <p id="chat-section-subtitle" className="font-sans text-base md:text-lg text-on-surface-variant max-w-xl mx-auto">
                This is our AI assistant — talk to it about your project and see what we can build for yours.
              </p>
            </div>
          </ScrollReveal>

          {/* Chatbot UI Frame */}
          <ScrollReveal delay={0.1}>
          <div id="terminal-frame" className="glass rounded-xl overflow-hidden primary-glow border border-white/10">
            
            {/* Terminal Header */}
            <div id="terminal-header" className="bg-surface-container-high px-6 py-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3.5">
                <img src="/logo.png" alt="MAD-K Co-Pilot" className="w-10 h-10 object-contain" referrerPolicy="no-referrer" />
                <span id="terminal-title" className="font-display text-base font-semibold text-white tracking-tight">
                   MAD-K Partner
                </span>
              </div>
              <span className="font-label-mono text-[10px] text-primary/70 bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md uppercase tracking-wider">
                Active
              </span>
            </div>

            {/* Chat Body */}
            <div 
              id="chat-messages" 
              className="h-[420px] overflow-y-auto p-4 flex flex-col gap-3.5 bg-surface-container-lowest/40"
            >
              {messages.map((msg, index) => (
                <div 
                  key={index}
                  id={`chat-msg-${index}`}
                  className={`flex flex-col gap-1 max-w-[85%] ${msg.sender === 'user' ? 'self-end' : 'self-start'}`}
                >
                  <div 
                    className={`py-2 px-3.5 rounded-xl text-xs md:text-sm leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-primary/10 border border-primary/20 rounded-tr-none text-white' 
                        : 'glass rounded-tl-none border-primary/10 text-on-surface'
                    }`}
                  >
                    {msg.sender === 'user' ? (
                      <p className="font-sans whitespace-pre-wrap">{msg.text}</p>
                    ) : (
                      <div className="flex flex-col gap-4">
                        <div className="markdown-body">
                          <Markdown>{msg.text}</Markdown>
                        </div>
                        
                        {(msg.promptLeadInput || (msg.text && msg.text.includes("Name | Mobile | Email"))) && !messages.some(m => m.leadCaptured) && (
                          <button
                            id="btn-open-lead-modal"
                            onClick={() => setLeadModalOpen(true)}
                            className="mt-1 py-1.5 px-3 bg-primary/10 hover:bg-primary/20 border border-primary/30 hover:border-primary/50 text-white font-semibold text-xs rounded-xl hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 self-start shadow-sm"
                          >
                            <Mail size={13} className="text-primary" />
                            Submit Contact Details
                          </button>
                        )}
                        
                        {msg.leadCaptured && msg.leadDetails && (
                          <div className="mt-2.5 p-3 rounded-lg bg-black/50 border border-primary/20 flex flex-col gap-2">
                            <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                              <span className="text-[10px] font-bold font-label-mono text-primary flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                LEAD DETAILS REGISTERED
                              </span>
                              <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded uppercase font-label-mono">
                                Saved to Server
                              </span>
                            </div>
                            <div className="text-[11px] space-y-0.5 text-on-surface-variant font-sans">
                              <p><strong className="text-white">Name:</strong> {msg.leadDetails.name}</p>
                              <p><strong className="text-white">Email:</strong> {msg.leadDetails.email}</p>
                              {msg.leadDetails.phone && <p><strong className="text-white">Phone:</strong> {msg.leadDetails.phone}</p>}
                              {msg.leadDetails.company && <p><strong className="text-white">Company:</strong> {msg.leadDetails.company}</p>}
                              <p className="mt-2 border-t border-white/5 pt-1.5"><strong className="text-white">Description:</strong> {msg.leadDetails.project_description}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <span 
                    className={`font-label-mono text-[10px] text-on-surface-variant/60 ${
                      msg.sender === 'user' ? 'text-right mr-1' : 'ml-1'
                    }`}
                  >
                    {msg.time} — {msg.sender === 'user' ? 'YOU' : 'ASSISTANT'}
                  </span>
                </div>
              ))}

              {isTyping && (
                <div id="assistant-typing" className="flex flex-col gap-1 max-w-[85%] self-start">
                  <div className="glass py-2 px-3 rounded-xl rounded-tl-none border-primary/10 text-on-surface flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                  <span className="font-label-mono text-[9px] text-on-surface-variant/50 ml-1">
                    MAD-K Partner is thinking...
                  </span>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSubmit} id="chat-form" className="p-3 md:p-4 bg-surface-container-low border-t border-white/5">
              <div className="flex gap-3 items-center bg-black/40 p-2.5 md:p-3 rounded-lg border border-white/10 group focus-within:border-primary/50 transition-colors">
                <span className="font-label-mono text-primary font-bold text-base">&gt;</span>
                <input 
                  id="terminal-input"
                  ref={chatInputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  maxLength={800}
                  className="bg-transparent border-none focus:outline-none focus:ring-0 w-full font-label-mono text-xs md:text-sm text-white placeholder:text-on-surface-variant/30"
                  placeholder="Type your project needs or ask questions..."
                />
                {inputValue.length >= 600 && (
                  <span className="font-label-mono text-[9px] text-primary/70 select-none px-1.5 py-0.5 bg-primary/10 border border-primary/20 rounded mr-1">
                    {inputValue.length}/800
                  </span>
                )}
                <span className="font-label-mono text-primary cursor-blink text-base hidden md:inline">_</span>
                <button 
                  id="btn-terminal-send"
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="p-1 text-primary hover:scale-110 disabled:opacity-30 disabled:scale-100 disabled:hover:scale-100 transition-all focus:outline-none cursor-pointer"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </div>
        </ScrollReveal>
        </section>

        {/* What We Build Section (Services) */}
        <section id="services" className="px-6 md:px-12 py-24 max-w-7xl mx-auto scroll-mt-24">
          <ScrollReveal>
            <h2 id="services-title" className="font-display text-3xl md:text-5xl font-bold mb-16 text-center tracking-tight text-white">
              What We Build
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1 */}
            <ScrollReveal delay={0}>
            <div id="service-card-1" className="glass p-8 rounded-xl glass-hover transition-all duration-300 group flex flex-col justify-between h-full">
              <div>
                <span className="font-label-mono text-[10px] text-secondary tracking-widest block mb-6 uppercase">
                  TECH_STACK: PINECONE / OPENAI
                </span>
                <div className="p-3 bg-primary/5 border border-primary/10 rounded-lg w-fit mb-6 text-primary group-hover:bg-primary/10 group-hover:scale-105 transition-all">
                  <Database size={32} />
                </div>
                <h3 className="font-display text-xl md:text-2xl font-bold mb-4 text-white">
                  RAG Chatbots
                </h3>
                <p className="text-on-surface-variant text-sm md:text-base leading-relaxed">
                  High-accuracy smart knowledge retrieval systems that ground AI answers in your specific business data.
                </p>
              </div>
            </div>
            </ScrollReveal>

            {/* Card 2 */}
            <ScrollReveal delay={0.1}>
            <div id="service-card-2" className="glass p-8 rounded-xl glass-hover transition-all duration-300 group flex flex-col justify-between h-full">
              <div>
                <span className="font-label-mono text-[10px] text-secondary tracking-widest block mb-6 uppercase">
                  TECH_STACK: PYTHON / SELENIUM
                </span>
                <div className="p-3 bg-primary/5 border border-primary/10 rounded-lg w-fit mb-6 text-primary group-hover:bg-primary/10 group-hover:scale-105 transition-all">
                  <Cpu size={32} />
                </div>
                <h3 className="font-display text-xl md:text-2xl font-bold mb-4 text-white">
                  Task Automation
                </h3>
                <p className="text-on-surface-variant text-sm md:text-base leading-relaxed">
                  Python-driven efficiency boosters that eliminate repetitive data entry, scraping, or report generation.
                </p>
              </div>
            </div>
            </ScrollReveal>

            {/* Card 3 */}
            <ScrollReveal delay={0.2}>
            <div id="service-card-3" className="glass p-8 rounded-xl glass-hover transition-all duration-300 group flex flex-col justify-between h-full">
              <div>
                <span className="font-label-mono text-[10px] text-secondary tracking-widest block mb-6 uppercase">
                  TECH_STACK: REACT / EXPRESS
                </span>
                <div className="p-3 bg-primary/5 border border-primary/10 rounded-lg w-fit mb-6 text-primary group-hover:bg-primary/10 group-hover:scale-105 transition-all">
                  <Terminal size={32} />
                </div>
                <h3 className="font-display text-xl md:text-2xl font-bold mb-4 text-white">
                  AI Web Apps
                </h3>
                <p className="text-on-surface-variant text-sm md:text-base leading-relaxed">
                  Full-stack, high-performance web applications with seamless integrated AI features and reactive UIs.
                </p>
              </div>
            </div>
            </ScrollReveal>

            {/* Card 4 */}
            <ScrollReveal delay={0.3}>
            <div id="service-card-4" className="glass p-8 rounded-xl glass-hover transition-all duration-300 group flex flex-col justify-between h-full">
              <div>
                <span className="font-label-mono text-[10px] text-secondary tracking-widest block mb-6 uppercase">
                  TECH_STACK: PYTORCH / YOLO
                </span>
                <div className="p-3 bg-primary/5 border border-primary/10 rounded-lg w-fit mb-6 text-primary group-hover:bg-primary/10 group-hover:scale-105 transition-all">
                  <Eye size={32} />
                </div>
                <h3 className="font-display text-xl md:text-2xl font-bold mb-4 text-white">
                  Image Detection
                </h3>
                <p className="text-on-surface-variant text-sm md:text-base leading-relaxed">
                  Custom computer vision solutions for quality control, object counting, or real-time surveillance processing.
                </p>
              </div>
            </div>
            </ScrollReveal>

          </div>
        </section>

        {/* Proof of Work Section (Projects Catalog) */}
        <section id="projects" className="px-6 md:px-12 py-24 bg-surface-container-lowest/30 scroll-mt-24">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <h2 id="projects-title" className="font-display text-3xl md:text-5xl font-bold mb-4 tracking-tight text-white text-center md:text-left">
                Proof of Work
              </h2>
              <p className="text-on-surface-variant/80 text-sm md:text-base max-w-2xl mb-12 text-center md:text-left leading-relaxed">
                Explore some of our core production-grade projects. Click on any card to view the official source code on GitHub.
              </p>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {PROJECTS.map((project, index) => (
                <ScrollReveal key={project.id} delay={index * 0.1}>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  id={`project-card-${index + 1}`}
                  className="flex flex-col gap-5 group glass p-4 rounded-2xl glass-hover hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <div className="aspect-video w-full rounded-xl overflow-hidden border border-white/5 relative bg-black/40">
                    <img 
                      src={project.image} 
                      alt={`${project.title} dashboard visualization`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md p-2 rounded-full border border-white/10 text-white/80 group-hover:text-primary transition-colors">
                      <Github size={16} />
                    </div>
                  </div>
                  <div className="px-1 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.tags.map(tag => (
                          <span key={tag} className="font-label-mono text-[9px] px-2 py-0.5 rounded-md bg-white/5 text-primary/80 border border-white/5">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h4 id={`project-title-${index + 1}`} className="font-display text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors flex items-center gap-1.5">
                        {project.title}
                      </h4>
                      <p className="text-on-surface-variant text-xs md:text-sm leading-relaxed mb-4">
                        {project.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-label-mono text-primary group-hover:text-secondary-container transition-colors mt-auto pt-2">
                      <span>EXPLORE REPOSITORY</span>
                      <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </a>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing / Service Tiers Section */}
        <section id="pricing" className="px-6 md:px-12 py-24 max-w-7xl mx-auto scroll-mt-24">
          <ScrollReveal>
            <h2 id="pricing-title" className="font-display text-3xl md:text-5xl font-bold mb-16 text-center tracking-tight text-white">
              Service Tiers
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            
            {/* Tier 1 */}
            <ScrollReveal delay={0}>
            <div 
              id="pricing-tier-1" 
              className={`glass p-8 rounded-xl border border-white/5 flex flex-col justify-between h-full transition-all duration-300 ${activeTier === 'Basic Portfolio' ? 'ring-2 ring-primary bg-primary/5' : ''}`}
            >
              <div>
                <span className="font-label-mono text-xs text-on-surface-variant/70 mb-4 block tracking-wider uppercase">
                  FOR STARTERS
                </span>
                <h3 className="font-display text-2xl font-bold mb-2 text-white">
                  Basic Portfolio
                </h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-extrabold text-white">₹6k - ₹15k</span>
                  <span className="text-on-surface-variant text-sm">/week</span>
                </div>
                <span className="text-on-surface-variant/60 text-xs block mb-8 leading-relaxed">
                  Based on requirement & duration
                </span>
                <ul className="flex flex-col gap-4 mb-10 text-on-surface-variant">
                  <li className="flex gap-3 items-center text-sm">
                    <Check size={16} className="text-primary flex-shrink-0" /> 
                    <span>Static portfolio website</span>
                  </li>
                  <li className="flex gap-3 items-center text-sm">
                    <Check size={16} className="text-primary flex-shrink-0" /> 
                    <span>Integrated enquiry form</span>
                  </li>
                  <li className="flex gap-3 items-center text-sm">
                    <Check size={16} className="text-primary flex-shrink-0" /> 
                    <span>Custom responsive design</span>
                  </li>
                </ul>
              </div>
              <button 
                id="btn-buy-tier-1" 
                onClick={() => handleOpenEnquiryModal("Basic Portfolio", "₹6,000 - ₹15,000 / week")}
                className="w-full py-4 glass border-white/20 hover:border-primary/50 text-white font-semibold rounded-lg transition-all active:scale-95 cursor-pointer text-sm"
              >
                Raise Enquiry
              </button>
            </div>
            </ScrollReveal>

            {/* Tier 2 - Recommended / Most Requested */}
            <ScrollReveal delay={0.1}>
            <div 
              id="pricing-tier-2" 
              className={`glass p-8 rounded-xl border-primary bg-primary/5 flex flex-col justify-between h-full relative overflow-hidden transition-all duration-300 ${activeTier === 'Advanced Portfolio' ? 'ring-2 ring-primary bg-primary/10' : ''}`}
            >
              <div id="badge-popular" className="absolute top-0 right-0 bg-primary text-on-primary text-[9px] font-bold px-3 py-1 rounded-bl-lg tracking-widest">
                POPULAR
              </div>
              <div>
                <span className="font-label-mono text-xs text-primary mb-4 block tracking-wider uppercase">
                  RECOMMENDED
                </span>
                <h3 className="font-display text-2xl font-bold mb-2 text-white">
                  Advanced Portfolio
                </h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-extrabold text-white">₹20k-₹45k</span>
                  <span className="text-on-surface-variant text-sm">/week</span>
                </div>
                <span className="text-on-surface-variant/60 text-xs block mb-8 leading-relaxed">
                  API key requirement excluded
                </span>
                <ul className="flex flex-col gap-4 mb-10 text-on-surface-variant">
                  <li className="flex gap-3 items-center text-sm">
                    <Check size={16} className="text-primary flex-shrink-0" /> 
                    <span>AI chatbot integration</span>
                  </li>
                  <li className="flex gap-3 items-center text-sm">
                    <Check size={16} className="text-primary flex-shrink-0" /> 
                    <span>Lead mailer automation</span>
                  </li>
                  <li className="flex gap-3 items-center text-sm">
                    <Check size={16} className="text-primary flex-shrink-0" /> 
                    <span>Google Reviews auto-fetcher</span>
                  </li>
                  <li className="flex gap-3 items-center text-sm">
                    <Check size={16} className="text-primary flex-shrink-0" /> 
                    <span>Feedback highlights engine</span>
                  </li>
                </ul>
              </div>
              <button 
                id="btn-buy-tier-2" 
                onClick={() => handleOpenEnquiryModal("Advanced Portfolio", "₹20,000 - ₹45,000 / week")}
                className="w-full py-4 bg-primary text-on-primary font-bold rounded-lg hover:brightness-110 active:scale-95 transition-all primary-glow cursor-pointer text-sm"
              >
                Raise Enquiry
              </button>
            </div>
            </ScrollReveal>

            {/* Tier 3 */}
            <ScrollReveal delay={0.2}>
            <div 
              id="pricing-tier-3" 
              className={`glass p-8 rounded-xl border border-white/5 flex flex-col justify-between h-full transition-all duration-300 ${activeTier === 'Dedicated Automation' ? 'ring-2 ring-primary bg-primary/5' : ''}`}
            >
              <div>
                <span className="font-label-mono text-xs text-on-surface-variant/70 mb-4 block tracking-wider uppercase">
                  PROCESS AUTOMATION
                </span>
                <h3 className="font-display text-2xl font-bold mb-2 text-white">
                  Dedicated Automation
                </h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-extrabold text-white">₹50k+</span>
                  <span className="text-on-surface-variant text-sm">starts from</span>
                </div>
                <span className="text-on-surface-variant/60 text-xs block mb-8 leading-relaxed">
                  AMC &amp; custom support available
                </span>
                <ul className="flex flex-col gap-4 mb-10 text-on-surface-variant">
                  <li className="flex gap-3 items-center text-sm">
                    <Check size={16} className="text-primary flex-shrink-0" /> 
                    <span>Task &amp; process automation</span>
                  </li>
                  <li className="flex gap-3 items-center text-sm">
                    <Check size={16} className="text-primary flex-shrink-0" /> 
                    <span>Onsite deployment &amp; config</span>
                  </li>
                  <li className="flex gap-3 items-center text-sm">
                    <Check size={16} className="text-primary flex-shrink-0" /> 
                    <span>1 year developer support</span>
                  </li>
                  <li className="flex gap-3 items-center text-sm">
                    <Check size={16} className="text-primary flex-shrink-0" /> 
                    <span>Yearly AMC support packages</span>
                  </li>
                </ul>
              </div>
              <button 
                id="btn-buy-tier-3" 
                onClick={() => handleOpenEnquiryModal("Dedicated Automation", "Starts from ₹50,000")}
                className="w-full py-4 glass border-white/20 hover:border-primary/50 text-white font-semibold rounded-lg transition-all active:scale-95 cursor-pointer text-sm"
              >
                Raise Enquiry
              </button>
            </div>
            </ScrollReveal>

            {/* Tier 4 */}
            <ScrollReveal delay={0.3}>
            <div 
              id="pricing-tier-4" 
              className={`glass p-8 rounded-xl border border-white/5 flex flex-col justify-between h-full transition-all duration-300 ${activeTier === 'Detection Systems' ? 'ring-2 ring-primary bg-primary/5' : ''}`}
            >
              <div>
                <span className="font-label-mono text-xs text-on-surface-variant/70 mb-4 block tracking-wider uppercase">
                  COMPUTER VISION
                </span>
                <h3 className="font-display text-2xl font-bold mb-2 text-white">
                  Detection Systems
                </h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-extrabold text-white">₹50k+</span>
                  <span className="text-on-surface-variant text-sm">starts from</span>
                </div>
                <span className="text-on-surface-variant/60 text-xs block mb-8 leading-relaxed">
                  Feed auto-telecast integrations
                </span>
                <ul className="flex flex-col gap-4 mb-10 text-on-surface-variant">
                  <li className="flex gap-3 items-center text-sm">
                    <Check size={16} className="text-primary flex-shrink-0" /> 
                    <span>CCTV detection systems</span>
                  </li>
                  <li className="flex gap-3 items-center text-sm">
                    <Check size={16} className="text-primary flex-shrink-0" /> 
                    <span>PPE &amp; anti-theft monitoring</span>
                  </li>
                  <li className="flex gap-3 items-center text-sm">
                    <Check size={16} className="text-primary flex-shrink-0" /> 
                    <span>Auto-telecast to public feed</span>
                  </li>
                </ul>
              </div>
              <button 
                id="btn-buy-tier-4" 
                onClick={() => handleOpenEnquiryModal("Detection Systems", "Starts from ₹50,000")}
                className="w-full py-4 glass border-white/20 hover:border-primary/50 text-white font-semibold rounded-lg transition-all active:scale-95 cursor-pointer text-sm"
              >
                Raise Enquiry
              </button>
            </div>
            </ScrollReveal>

          </div>
        </section>

        {/* Final CTA */}
        <section id="cta" className="px-6 md:px-12 py-24 text-center border-t border-white/5 bg-gradient-to-b from-transparent to-surface-container-lowest/20">
          <ScrollReveal>
            <h2 id="cta-title" className="font-display text-3xl md:text-5xl font-bold mb-6 tracking-tight text-white">
              Ready to start?
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p id="cta-subtitle" className="font-sans text-base md:text-lg text-on-surface-variant mb-12 max-w-lg mx-auto">
              Chat with our assistant above or reach out via social links below.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <button 
              id="btn-cta-open-chat"
              onClick={handleQuickCTA}
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary/10 border border-primary/30 hover:border-primary/60 text-primary font-bold rounded-lg hover:bg-primary/20 transition-all active:scale-95 cursor-pointer"
            >
              <MessageSquare size={18} />
              Open Chat Assistant
            </button>
          </ScrollReveal>
        </section>

        </main>
      ) : view === 'privacy' ? (
        <PrivacyPolicyView setView={setView} />
      ) : (
        <TermsConditionsView setView={setView} />
      )}

      {/* Footer */}
      <footer id="footer" className="bg-surface-container-lowest border-t border-white/5 w-full py-12">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-12 max-w-7xl mx-auto gap-8">
          
          <ScrollReveal direction="left">
          <div id="footer-left" className="flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="MAD-K Logo" className="w-16 h-16 object-contain" referrerPolicy="no-referrer" />
              <img src="/brand.png" alt="MAD-K" className="h-10 object-contain" referrerPolicy="no-referrer" />
            </div>
            <p className="font-label-mono text-xs text-on-surface-variant/50">
              Built with Caffeine.
            </p>
          </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.1}>
          <div id="footer-right" className="flex flex-col items-center md:items-end gap-4">
            <div className="flex gap-8">
              <a 
                href="https://www.linkedin.com/in/kamatchi-somesh" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-label-mono text-xs text-on-surface-variant/70 hover:text-secondary transition-colors"
              >
                LinkedIn
              </a>
              <a 
                href="https://github.com/Somesh-S-Dev" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-label-mono text-xs text-on-surface-variant/70 hover:text-secondary transition-colors"
              >
                GitHub
              </a>
              <button 
                id="btn-footer-privacy"
                onClick={() => setView('privacy')} 
                className="font-label-mono text-xs text-on-surface-variant/70 hover:text-secondary transition-colors cursor-pointer bg-transparent border-none p-0 focus:outline-none"
              >
                Privacy Policy
              </button>
              <button 
                id="btn-footer-terms"
                onClick={() => setView('terms')} 
                className="font-label-mono text-xs text-on-surface-variant/70 hover:text-secondary transition-colors cursor-pointer bg-transparent border-none p-0 focus:outline-none"
              >
                Terms of Service
              </button>
            </div>
            <p className="font-label-mono text-[10px] text-on-surface-variant/40 text-center md:text-right">
              © 2026 MAD-K. Built for the high-fidelity web. Standard analytics used for performance.
            </p>
          </div>
          </ScrollReveal>

        </div>
      </footer>



      {/* Enquiry Modal */}
      <AnimatePresence>
        {enquiryModalOpen && enquiryTier && (
          <div id="enquiry-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              id="enquiry-modal-content"
              className="glass max-w-lg w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#1c1b1b]"
            >
              {/* Modal Header */}
              <div className="bg-[#2a2a2a] px-6 py-4 flex items-center justify-between border-b border-white/10">
                <div className="flex flex-col">
                  <span className="font-label-mono text-[10px] text-primary tracking-wider uppercase">
                    Raise Enquiry
                  </span>
                  <h3 className="font-display text-lg font-bold text-white">
                    {enquiryTier.name} — {enquiryTier.price}
                  </h3>
                </div>
                <button
                  id="btn-close-enquiry-modal"
                  onClick={() => setEnquiryModalOpen(false)}
                  className="p-1.5 text-on-surface-variant hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="enquiry-requirements" className="font-display text-sm font-semibold text-white">
                    Please describe your project requirements:
                  </label>
                  <textarea
                    id="enquiry-requirements"
                    rows={4}
                    value={enquiryRequirements}
                    onChange={(e) => setEnquiryRequirements(e.target.value)}
                    placeholder="E.g., I need a chatbot integrated with Google Sheets, scraping real estate leads weekly..."
                    className="w-full bg-black/40 p-3 rounded-lg border border-white/10 font-sans text-sm text-white placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                  />
                  <p className="text-[11px] text-on-surface-variant/60 font-sans">
                    The chosen tier and these requirements will be pre-filled automatically.
                  </p>
                </div>

                <div className="flex flex-col gap-3 mt-2">
                  <span className="font-display text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Select Your Preferred Channel:
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Mail Channel */}
                    <button
                      id="btn-enquiry-mail"
                      type="button"
                      onClick={() => handleEnquirySubmit('email')}
                      className="flex flex-col items-center justify-center p-4 bg-primary/5 hover:bg-primary/10 border border-primary/20 hover:border-primary/40 rounded-xl transition-all cursor-pointer group"
                    >
                      <Mail size={24} className="text-primary mb-2 group-hover:scale-110 transition-transform" />
                      <span className="font-display text-xs font-semibold text-white">Email Client</span>
                      <span className="text-[10px] text-on-surface-variant/70 mt-1">Direct Auto-fill</span>
                    </button>

                    {/* WhatsApp Channel */}
                    <button
                      id="btn-enquiry-whatsapp"
                      type="button"
                      onClick={() => handleEnquirySubmit('whatsapp')}
                      className="flex flex-col items-center justify-center p-4 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl transition-all cursor-pointer group"
                    >
                      <MessageCircle size={24} className="text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                      <span className="font-display text-xs font-semibold text-white">WhatsApp</span>
                      <span className="text-[10px] text-on-surface-variant/70 mt-1">Pre-filled Chat</span>
                    </button>

                    {/* LinkedIn Channel */}
                    <button
                      id="btn-enquiry-linkedin"
                      type="button"
                      onClick={() => handleEnquirySubmit('linkedin')}
                      className="flex flex-col items-center justify-center p-4 bg-sky-500/5 hover:bg-sky-500/10 border border-sky-500/20 hover:border-sky-500/40 rounded-xl transition-all cursor-pointer group"
                    >
                      <Linkedin size={24} className="text-sky-400 mb-2 group-hover:scale-110 transition-transform" />
                      <span className="font-display text-xs font-semibold text-white">LinkedIn</span>
                      <span className="text-[10px] text-on-surface-variant/70 mt-1">Copy &amp; Visit</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Footer / Guidance */}
              <div className="bg-[#2a2a2a]/40 px-6 py-4 border-t border-white/5 text-[11px] text-on-surface-variant/50 font-label-mono leading-relaxed">
                * Your selected channel will open directly so you can send the enquiry from your own account.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lead Contact Info Modal */}
      <AnimatePresence>
        {leadModalOpen && (
          <div id="lead-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              id="lead-modal-content"
              className="glass max-w-md w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#1c1b1b]"
            >
              {/* Modal Header */}
              <div className="bg-[#2a2a2a] px-6 py-4 flex items-center justify-between border-b border-white/10">
                <div className="flex flex-col">
                  <span className="font-label-mono text-[10px] text-primary tracking-wider uppercase">
                    Submit Lead
                  </span>
                  <h3 className="font-display text-lg font-bold text-white">
                    Contact Information
                  </h3>
                </div>
                <button
                  id="btn-close-lead-modal"
                  onClick={() => setLeadModalOpen(false)}
                  className="p-1.5 text-on-surface-variant hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleLeadSubmit} className="p-6 flex flex-col gap-4">
                {leadError && (
                  <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-sans">
                    ⚠️ {leadError}
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="lead-name" className="font-sans text-xs font-semibold text-white/70">
                    Full Name
                  </label>
                  <div className="relative flex items-center">
                    <User size={14} className="absolute left-3 text-on-surface-variant/40" />
                    <input
                      id="lead-name"
                      type="text"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      placeholder="Madk"
                      className="w-full bg-black/40 pl-9 pr-3 py-2 rounded-lg border border-white/10 font-sans text-sm text-white placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="lead-mobile" className="font-sans text-xs font-semibold text-white/70">
                    Mobile Number
                  </label>
                  <div className="relative flex items-center">
                    <Phone size={14} className="absolute left-3 text-on-surface-variant/40" />
                    <input
                      id="lead-mobile"
                      type="tel"
                      value={leadMobile}
                      onChange={(e) => setLeadMobile(e.target.value)}
                      placeholder="9655841515"
                      className="w-full bg-black/40 pl-9 pr-3 py-2 rounded-lg border border-white/10 font-sans text-sm text-white placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="lead-email" className="font-sans text-xs font-semibold text-white/70">
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <Mail size={14} className="absolute left-3 text-on-surface-variant/40" />
                    <input
                      id="lead-email"
                      type="email"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      placeholder="madkinfo@gmail.com"
                      className="w-full bg-black/40 pl-9 pr-3 py-2 rounded-lg border border-white/10 font-sans text-sm text-white placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-2 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setLeadModalOpen(false)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-semibold text-white transition-all cursor-pointer active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-on-primary font-semibold text-xs rounded-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-sm shadow-primary/20"
                  >
                    Register Enquiry
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Copied Clipboard Toast */}
      <AnimatePresence>
        {copiedNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-50 bg-sky-500/20 border border-sky-400/30 backdrop-blur-md px-4 py-3 rounded-lg flex items-center gap-2"
          >
            <Check size={16} className="text-sky-400" />
            <span className="text-sm text-white font-sans">
              Enquiry message copied to clipboard! Paste it on LinkedIn.
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Advanced Glowing Custom Cursor */}
      {!isMobile && (
        <>
          {/* Outer glowing cursor halo */}
          <div
            className="cursor-glow-outer fixed pointer-events-none rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out"
            style={{
              left: `${mousePos.x}px`,
              top: `${mousePos.y}px`,
              width: isHovering ? '64px' : '40px',
              height: isHovering ? '64px' : '40px',
              background: isHovering 
                ? 'radial-gradient(circle, rgba(0, 238, 252, 0.2) 0%, rgba(173, 199, 255, 0.05) 70%, transparent 100%)' 
                : 'radial-gradient(circle, rgba(173, 199, 255, 0.15) 0%, rgba(0, 238, 252, 0.02) 60%, transparent 100%)',
              border: isHovering 
                ? '1px solid rgba(0, 238, 252, 0.4)' 
                : '1px solid rgba(173, 199, 255, 0.2)',
              boxShadow: isHovering 
                ? '0 0 25px rgba(0, 238, 252, 0.5), inset 0 0 10px rgba(0, 238, 252, 0.2)' 
                : '0 0 15px rgba(173, 199, 255, 0.2)',
            }}
          />
          {/* Inner precision core dot */}
          <div
            className="cursor-glow-inner fixed pointer-events-none rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out"
            style={{
              left: `${mousePos.x}px`,
              top: `${mousePos.y}px`,
              width: '8px',
              height: '8px',
              backgroundColor: isHovering ? '#00eefc' : '#adc7ff',
              boxShadow: isHovering 
                ? '0 0 10px #00eefc, 0 0 20px #00eefc' 
                : '0 0 6px #adc7ff',
              transform: `translate(-50%, -50%) scale(${isHovering ? 1.5 : 1})`,
            }}
          />
        </>
      )}

    </div>
  );
}

interface ViewProps {
  setView: (view: 'home' | 'privacy' | 'terms') => void;
}

function PrivacyPolicyView({ setView }: ViewProps) {
  return (
    <main className="relative z-10 pt-32 px-6 md:px-12 max-w-4xl mx-auto pb-24">
      <button 
        onClick={() => setView('home')}
        className="font-label-mono text-xs text-primary hover:text-primary/80 mb-8 cursor-pointer flex items-center gap-2 focus:outline-none bg-transparent border-none p-0"
      >
        <span>&lt;</span> BACK_TO_HOME
      </button>
      
      <div className="glass p-8 md:p-12 rounded-2xl border-white/5 space-y-8">
        <div>
          <span className="font-label-mono text-xs text-secondary tracking-widest block mb-2 uppercase">
            DOCUMENT_REF: PRIVACY_POLICY_V1.0
          </span>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="font-label-mono text-xs text-on-surface-variant/50 mt-2">
            Last Updated: July 2026
          </p>
        </div>

        <hr className="border-white/10" />

        <div className="space-y-6 font-sans text-sm text-on-surface-variant leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <span className="font-label-mono text-xs text-primary">[01]</span> Scope & Data Collection
            </h2>
            <p>
              MAD-K is committed to respecting user privacy. We collect two types of data on our platform:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-white/90">
              <li>
                <strong>Directly Provided Data:</strong> Contact information (Name, Mobile, and Email) voluntarily submitted when you choose to register an enquiry or provide contact details to the chatbot.
              </li>
              <li>
                <strong>Automatically Collected Geolocation &amp; System Metadata:</strong> IP address, approximate geographical location (country, region, city), browser user agent, screen resolution, timezone, browser language, referrer document, and canvas fingerprint digital signature.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <span className="font-label-mono text-xs text-primary">[02]</span> Purpose of Processing
            </h2>
            <p>
              Your contact details are processed to register project requests, answer enquiries, and send Nodemailer notifications to the MAD-K dev team. 
            </p>
            <p>
              The automatically collected system and geolocation metadata are utilized exclusively to secure the chatbot service, enforce character limit guardrails to prevent token-exhausting API abuse, and generate spam diagnostics.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <span className="font-label-mono text-xs text-primary">[03]</span> Database &amp; Retention Policy
            </h2>
            <p>
              MAD-K does <strong>not</strong> persist chat transcripts or personal details in a permanent queryable database. Once your requirements and contact info are captured, they are formatted and forwarded instantly to <a href="mailto:madkinfo@gmail.com" className="text-secondary hover:underline">madkinfo@gmail.com</a> via Nodemailer SMTP. Chat history is cleared upon reloading or closing your browser session.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <span className="font-label-mono text-xs text-primary">[04]</span> Data Security &amp; Sharing
            </h2>
            <p>
              We implement industry-standard encryption protocols to protect all transmission payloads. We do not sell, trade, or share your personal data with third parties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <span className="font-label-mono text-xs text-primary">[05]</span> Contact Us
            </h2>
            <p>
              If you have any questions or would like to request deletion of any forwarded logs, please contact us directly at <a href="mailto:madkinfo@gmail.com" className="text-primary hover:underline">madkinfo@gmail.com</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

function TermsConditionsView({ setView }: ViewProps) {
  return (
    <main className="relative z-10 pt-32 px-6 md:px-12 max-w-4xl mx-auto pb-24">
      <button 
        onClick={() => setView('home')}
        className="font-label-mono text-xs text-primary hover:text-primary/80 mb-8 cursor-pointer flex items-center gap-2 focus:outline-none bg-transparent border-none p-0"
      >
        <span>&lt;</span> BACK_TO_HOME
      </button>
      
      <div className="glass p-8 md:p-12 rounded-2xl border-white/5 space-y-8">
        <div>
          <span className="font-label-mono text-xs text-secondary tracking-widest block mb-2 uppercase">
            DOCUMENT_REF: TERMS_CONDITIONS_V1.0
          </span>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="font-label-mono text-xs text-on-surface-variant/50 mt-2">
            Last Updated: July 2026
          </p>
        </div>

        <hr className="border-white/10" />

        <div className="space-y-6 font-sans text-sm text-on-surface-variant leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <span className="font-label-mono text-xs text-primary">[01]</span> Agreement to Terms
            </h2>
            <p>
              By accessing and using the MAD-K platform, you agree to follow and be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <span className="font-label-mono text-xs text-primary">[02]</span> Intellectual Property
            </h2>
            <p>
              All branding elements, designs, text, and custom AI chatbot interfaces on this site are the intellectual property of MAD-K. Open-source elements are governed by their respective repositories and licenses.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <span className="font-label-mono text-xs text-primary">[03]</span> Acceptable Use &amp; API Guardrails
            </h2>
            <p>
              To protect our server resources, we enforce strict usage guardrails on our chat assistant:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-white/90">
              <li>
                You may not send messages exceeding <strong>800 characters</strong> via the client input.
              </li>
              <li>
                Bypassing frontend limits or spamming the server with excessive paragraphs is strictly prohibited.
              </li>
              <li>
                Any automated scripting, scraping, or attempt to inject prompts designed to exploit API tokens is a violation of these terms.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <span className="font-label-mono text-xs text-primary">[04]</span> Service Estimates &amp; Disclaimers
            </h2>
            <p>
              TIMELINE AND BUDGET ESTIMATES PROVIDED BY THE AI CHATBOT ARE AUTOMATED HIGH-LEVEL PROPOSALS AND NOT BINDING CONTRACTS. Final project scope and cost terms are established solely via signed statements of work.
            </p>
            <p>
              The AI assistant is provided "as is" with fallback mechanisms in place for api downtime. MAD-K does not guarantee uninterrupted or error-free chat operations.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <span className="font-label-mono text-xs text-primary">[05]</span> Governing Law
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which MAD-K operates, without giving effect to conflicts of laws principles.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
