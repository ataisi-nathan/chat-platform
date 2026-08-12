'use client';

import React, { useState } from 'react';
import {
  Bot,
  Zap,
  ShieldCheck,
  Database,
  BarChart3,
  UserCheck,
  ArrowRight,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Globe,
} from 'lucide-react';

export default function DescasioLanding() {
  const [demoInput, setDemoInput] = useState('');
  const [demoMessages, setDemoMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am your Descasio AI assistant. How can I help your customers today?',
    },
  ]);

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoInput.trim()) return;

    const userText = demoInput;
    setDemoMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setDemoInput('');

    // Simulate AI response grounded in business context
    setTimeout(() => {
      setDemoMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `Thanks for reaching out! Based on Descasio's current knowledge base, I can seamlessly guide you through integrating RAG-powered agents into your platform.`,
        },
      ]);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <header className=" z-50 border-b border-slate-800/80 backdrop-blur-md bg-slate-950/70 sticky top-0">
        <div className="max-w-7xl mx-m-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Bot className="h-6 w-6" />
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              descasio<span className="text-blue-500">.</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#demo" className="hover:text-white transition-colors">
              Live Demo
            </a>
            <a href="#architecture" className="hover:text-white transition-colors">
              Enterprise RAG
            </a>
            <a href="#pricing" className="hover:text-white transition-colors">
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <a href="/auth" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors hidden sm:block">
              Sign In
            </a>
            <a
              href="#demo"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Started
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-24 pb-20 px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold mb-8">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Next-Gen Agentic RAG Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.15]">
          Intelligent Customer Support grounded in{' '}
          <span className="bg-linear-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Your Business Knowledge
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
          Descasio integrates autonomous AI support agents into your website. Vectorize your custom business documentation, capture user intent, and enable seamless human agent takeovers in real time.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-xl shadow-blue-600/25 transition-all flex items-center justify-center gap-2"
          >
            Deploy Your AI Agent
            <ArrowRight className="h-5 w-5" />
          </a>
          <a
            href="#demo"
            className="w-full sm:w-auto px-8 py-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 font-semibold text-base transition-all flex items-center justify-center gap-2"
          >
            Try Interactive Demo
          </a>
        </div>

        {/* Stats Strip */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm">
          <div>
            <p className="text-3xl font-black text-white">99.4%</p>
            <p className="text-xs text-slate-400 mt-1">Factual Accuracy (RAG)</p>
          </div>
          <div>
            <p className="text-3xl font-black text-blue-400">&lt; 1.2s</p>
            <p className="text-xs text-slate-400 mt-1">Average Response Speed</p>
          </div>
          <div>
            <p className="text-3xl font-black text-indigo-400">100%</p>
            <p className="text-xs text-slate-400 mt-1">Contextual Isolation</p>
          </div>
          <div>
            <p className="text-3xl font-black text-emerald-400">24/7</p>
            <p className="text-xs text-slate-400 mt-1">Autonomous Availability</p>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="relative z-10 py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Built for Modern Enterprise SaaS
          </h2>
          <p className="text-slate-400 mt-4 text-sm sm:text-base max-w-xl mx-auto">
            Everything you need to turn raw company documents into conversational support systems.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition-all">
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-6">
              <Database className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Knowledge Vectorization</h3>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              Upload PDFs, web docs, or custom guides. Descasio automatically chunks, embeds, and stores your business knowledge safely in isolated vector indexes.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition-all">
            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6">
              <UserCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Seamless Human Handover</h3>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              When queries get complex, your human agents can take over chats instantly. The AI automatically pauses and resumes seamlessly when handed back.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition-all">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Tenant Data Isolation</h3>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              Strict multi-tenant security guarantees your customer metadata and vectorized business files never cross paths with other organizations.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo" className="relative z-10 py-20 px-6 max-w-7xl mx-auto">
        <div className="rounded-3xl border border-slate-800 bg-linear-to-b from-slate-900 to-slate-950 p-8 md:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-500/10 text-blue-400 text-xs font-semibold mb-4">
                <Globe className="h-3.5 w-3.5" />
                <span>Live Interactive Sandbox</span>
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">
                Experience Descasio in Action
              </h2>
              <p className="text-slate-400 mt-4 text-sm leading-relaxed">
                Test how the Descasio bot engages visitors, extracts business context, and presents crisp, actionable answers on your site.
              </p>

              <ul className="mt-6 space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-400" />
                  Automatic visitor lead & name capture
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-400" />
                  Grounded response generation (No Hallucinations)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-400" />
                  Instant live dashboard synchronization
                </li>
              </ul>
            </div>

            {/* Chat Sandbox Widget */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-105">
              <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-200">Descasio Bot Demo</span>
                </div>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Agent Active</span>
              </div>

              {/* Thread */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
                {demoMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col max-w-[80%] ${
                      msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                    }`}
                  >
                    <div
                      className={`p-3 rounded-2xl leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Form Input */}
              <form onSubmit={handleDemoSubmit} className="p-3 border-t border-slate-800 bg-slate-900/40 flex gap-2">
                <input
                  type="text"
                  value={demoInput}
                  onChange={(e) => setDemoInput(e.target.value)}
                  placeholder="Ask the demo bot a question..."
                  className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 transition-all"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs transition-all shrink-0"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 py-12 px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
            D
          </div>
          <span className="font-bold text-slate-300">Descasio Technologies</span>
          <span>© {new Date().getFullYear()} All rights reserved.</span>
        </div>

        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-slate-300 transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-slate-300 transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-slate-300 transition-colors">
            Documentation
          </a>
        </div>
      </footer>
    </div>
  );
}