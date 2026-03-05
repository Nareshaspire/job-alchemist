/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Sparkles, 
  Briefcase, 
  FileText, 
  ChevronRight, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';

// --- Types ---
type TransmuteMode = 'resume' | 'cover-letter' | 'interview' | 'skill-gap';

interface AlchemistOutput {
  mode: TransmuteMode;
  hook?: string; // For Resume/Cover Letter
  bullets?: string[]; // For Resume
  keywords: string[];
  interviewQuestions?: { question: string; talkingPoints: string[] }[]; // For Interview
  skillGaps?: { skill: string; importance: 'high' | 'medium' | 'low'; recommendation: string }[]; // For Skill Gap
  coverLetter?: string; // For Cover Letter
}

// --- Constants ---
const SYSTEM_INSTRUCTION = `You are the "Job Alchemist," a world-class Executive Headhunter and Prompt Engineer specializing in ATS (Applicant Tracking System) optimization.

Your mission is to transmute raw, generic work history into high-impact, strategic career assets based on the requested MODE.

### YOUR CORE FRAMEWORK (The Three C's):
1. CONCISE: Avoid flowery language. Use hard data and direct verbs.
2. CLEAR: Every bullet point MUST follow the formula: [Strong Action Verb] + [Specific Technical Task] + [Quantifiable Result/Business Impact].
3. CONSISTENT: Do not hallucinate experience.

### OPERATIONAL MODES:
- MODE: 'resume' -> Output 3-5 "Power Bullets" and a 150-word "Hook" (Professional Summary).
- MODE: 'cover-letter' -> Output a high-impact, aggressive cover letter (max 250 words) that addresses the job's specific pain points.
- MODE: 'interview' -> Output 3-5 likely interview questions based on the job description and user's background, with strategic "talking points" for each.
- MODE: 'skill-gap' -> Identify 3-5 critical missing skills or experiences from the user's history that are required by the job, with a recommendation for how to address each gap.

### CONSTRAINTS:
- Use Markdown for bolding key metrics.
- Maintain a tone that is aggressive, elite, and persuasive.
- Output the result in a structured format that can be easily parsed. Return a JSON object matching the AlchemistOutput interface.
- The JSON object MUST include the "mode" key matching the requested mode.`;

export default function App() {
  const [jobDescription, setJobDescription] = useState('');
  const [workHistory, setWorkHistory] = useState('');
  const [mode, setMode] = useState<TransmuteMode>('resume');
  const [loading, setLoading] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [result, setResult] = useState<AlchemistOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    "Initializing Alchemical Chamber...",
    "Phase 1: Analyzing Job Description Pain Points...",
    "Phase 2: Synthesizing Work History Alignment...",
    "Phase 3: Transmuting Strategic Career Assets...",
    "Finalizing High-Impact Output..."
  ];

  React.useEffect(() => {
    let interval: any;
    if (loading) {
      setProcessingStep(0);
      interval = setInterval(() => {
        setProcessingStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
      }, 1500);
    } else {
      setProcessingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleTransmute = async () => {
    if (!jobDescription || !workHistory) {
      setError("Both Job Description and Work History are required for transmutation.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3.1-pro-preview";
      
      const prompt = `
        MODE: ${mode}
        
        JOB DESCRIPTION:
        ${jobDescription}

        USER WORK HISTORY:
        ${workHistory}
      `;

      const response = await ai.models.generateContent({
        model,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
        },
      });

      const text = response.text;
      if (text) {
        const parsed: AlchemistOutput = JSON.parse(text);
        setResult(parsed);
      } else {
        throw new Error("Empty response from the Alchemist.");
      }
    } catch (err) {
      console.error(err);
      setError("The transmutation failed. Ensure your API key is valid and try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Simple feedback could be added here
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E4E4E7] font-sans selection:bg-emerald-500/30 selection:text-emerald-400">
      {/* Header */}
      <header className="border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <span className="font-bold tracking-tighter text-xl uppercase italic">Job Alchemist</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-xs font-mono uppercase tracking-widest text-zinc-500">
            <span>ATS Optimization Engine v1.0</span>
            <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
            <span>Ready for Transmutation</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Input Section */}
          <div className="lg:col-span-5 space-y-8">
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-400">
                <Briefcase className="w-4 h-4" />
                <h2 className="text-xs font-mono uppercase tracking-widest font-bold">Target Job Description</h2>
              </div>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here... (The 'Pain Points')"
                className="w-full h-48 bg-zinc-900/50 border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors resize-none placeholder:text-zinc-700"
              />
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-400">
                <FileText className="w-4 h-4" />
                <h2 className="text-xs font-mono uppercase tracking-widest font-bold">Raw Work History</h2>
              </div>
              <textarea
                value={workHistory}
                onChange={(e) => setWorkHistory(e.target.value)}
                placeholder="Paste your current resume or work history here... (The 'Raw Material')"
                className="w-full h-64 bg-zinc-900/50 border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors resize-none placeholder:text-zinc-700"
              />
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-400">
                <Terminal className="w-4 h-4" />
                <h2 className="text-xs font-mono uppercase tracking-widest font-bold">Select Transmutation Mode</h2>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(['resume', 'cover-letter', 'interview', 'skill-gap'] as TransmuteMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`px-4 py-3 rounded-xl text-[10px] font-mono uppercase tracking-widest transition-all border ${
                      mode === m 
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                        : 'bg-zinc-900/50 border-white/5 text-zinc-500 hover:border-white/20'
                    }`}
                  >
                    {m.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </section>

            <button
              onClick={handleTransmute}
              disabled={loading}
              className="w-full group relative overflow-hidden bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center gap-2 relative z-10">
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Transmuting...</span>
                  </>
                ) : (
                  <>
                    <span>Begin Transmutation</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-sm"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}
          </div>

          {/* Output Section */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {!result && !loading ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full min-h-[400px] border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center p-12 space-y-6"
                >
                  <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center">
                    <Terminal className="w-8 h-8 text-zinc-700" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Awaiting Input</h3>
                    <p className="text-zinc-500 max-w-sm mx-auto text-sm leading-relaxed">
                      Provide the target job description and your raw work history to generate elite, ATS-optimized career assets.
                    </p>
                  </div>
                </motion.div>
              ) : loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full min-h-[500px] border border-white/5 bg-zinc-900/20 rounded-2xl flex flex-col items-center justify-center p-8 md:p-12 space-y-12 relative overflow-hidden"
                >
                  {/* Background Glow */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full" />
                  
                  <div className="relative z-10 flex flex-col items-center space-y-8 w-full max-w-md">
                    <div className="relative">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="w-32 h-32 border-2 border-emerald-500/10 border-t-emerald-500 rounded-full"
                      />
                      <motion.div 
                        animate={{ rotate: -360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-2 border border-dashed border-emerald-500/20 rounded-full"
                      />
                      <Sparkles className="absolute inset-0 m-auto w-10 h-10 text-emerald-500 animate-pulse" />
                    </div>

                    <div className="w-full space-y-6">
                      <div className="space-y-2 text-center">
                        <h3 className="text-xl font-bold tracking-tight text-white">Transmutation in Progress</h3>
                        <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-[0.3em]">Processing Mode: {mode.replace('-', ' ')}</p>
                      </div>

                      {/* Progress Bar */}
                      <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-emerald-500"
                          initial={{ width: "0%" }}
                          animate={{ width: `${((processingStep + 1) / steps.length) * 100}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>

                      {/* Step List */}
                      <div className="space-y-3">
                        {steps.map((step, i) => (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ 
                              opacity: i === processingStep ? 1 : i < processingStep ? 0.4 : 0.1,
                              x: i === processingStep ? 0 : -5,
                              color: i === processingStep ? "#10b981" : i < processingStep ? "#71717a" : "#3f3f46"
                            }}
                            className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-wider"
                          >
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              i === processingStep ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]' : i < processingStep ? 'bg-zinc-600' : 'bg-zinc-800'
                            }`} />
                            {step}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Terminal Log Decoration */}
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center text-[9px] font-mono text-zinc-700 uppercase tracking-widest">
                    <div className="flex gap-4">
                      <span>MEM_ALLOC: OK</span>
                      <span>GEN_SEED: {Math.random().toString(16).slice(2, 8)}</span>
                    </div>
                    <span>SYS_LOAD: {(Math.random() * 10 + 80).toFixed(1)}%</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  {/* Keywords */}
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <h2 className="text-xs font-mono uppercase tracking-widest font-bold">Priority Keywords Identified</h2>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result?.keywords.map((kw, i) => (
                        <span key={i} className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono rounded-full">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </section>

                  {/* Mode Specific Displays */}
                  {result?.mode === 'resume' && (
                    <>
                      {/* The Hook */}
                      <section className="space-y-4 bg-zinc-900/30 border border-white/5 rounded-2xl p-6 relative group">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-emerald-400">
                            <Sparkles className="w-4 h-4" />
                            <h2 className="text-xs font-mono uppercase tracking-widest font-bold">The Hook (Professional Summary)</h2>
                          </div>
                          <button 
                            onClick={() => copyToClipboard(result?.hook || '')}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-zinc-500 hover:text-emerald-400"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="prose prose-invert prose-sm max-w-none">
                          <ReactMarkdown>{result?.hook}</ReactMarkdown>
                        </div>
                      </section>

                      {/* Power Bullets */}
                      <section className="space-y-4">
                        <div className="flex items-center gap-2 text-emerald-400">
                          <Terminal className="w-4 h-4" />
                          <h2 className="text-xs font-mono uppercase tracking-widest font-bold">Transmuted Power Bullets</h2>
                        </div>
                        <div className="space-y-3">
                          {result?.bullets?.map((bullet, i) => (
                            <motion.div 
                              key={i}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="p-4 bg-zinc-900/50 border border-white/5 rounded-xl group relative"
                            >
                              <button 
                                onClick={() => copyToClipboard(bullet)}
                                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-1 hover:bg-white/5 rounded transition-all text-zinc-500 hover:text-emerald-400"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                              <div className="prose prose-invert prose-sm max-w-none pr-8">
                                <ReactMarkdown>{bullet}</ReactMarkdown>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </section>
                    </>
                  )}

                  {result?.mode === 'cover-letter' && (
                    <section className="space-y-4 bg-zinc-900/30 border border-white/5 rounded-2xl p-6 relative group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-emerald-400">
                          <FileText className="w-4 h-4" />
                          <h2 className="text-xs font-mono uppercase tracking-widest font-bold">Transmuted Cover Letter</h2>
                        </div>
                        <button 
                          onClick={() => copyToClipboard(result?.coverLetter || '')}
                          className="p-2 hover:bg-white/5 rounded-lg transition-colors text-zinc-500 hover:text-emerald-400"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap">
                        <ReactMarkdown>{result?.coverLetter}</ReactMarkdown>
                      </div>
                    </section>
                  )}

                  {result?.mode === 'interview' && (
                    <section className="space-y-4">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <Briefcase className="w-4 h-4" />
                        <h2 className="text-xs font-mono uppercase tracking-widest font-bold">Interview Prep Strategy</h2>
                      </div>
                      <div className="space-y-4">
                        {result?.interviewQuestions?.map((item, i) => (
                          <div key={i} className="p-6 bg-zinc-900/50 border border-white/5 rounded-2xl space-y-4">
                            <h3 className="text-emerald-400 font-bold text-sm">Q: {item.question}</h3>
                            <div className="space-y-2">
                              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Talking Points:</p>
                              <ul className="space-y-1">
                                {item.talkingPoints.map((tp, j) => (
                                  <li key={j} className="text-xs text-zinc-400 flex items-start gap-2">
                                    <span className="text-emerald-500 mt-1">•</span>
                                    {tp}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {result?.mode === 'skill-gap' && (
                    <section className="space-y-4">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <AlertCircle className="w-4 h-4" />
                        <h2 className="text-xs font-mono uppercase tracking-widest font-bold">Skill Gap Analysis</h2>
                      </div>
                      <div className="space-y-4">
                        {result?.skillGaps?.map((gap, i) => (
                          <div key={i} className="p-6 bg-zinc-900/50 border border-white/5 rounded-2xl flex flex-col md:flex-row gap-6">
                            <div className="md:w-1/3 space-y-2">
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${
                                  gap.importance === 'high' ? 'bg-red-500' : gap.importance === 'medium' ? 'bg-orange-500' : 'bg-blue-500'
                                }`} />
                                <h3 className="text-sm font-bold uppercase tracking-tight">{gap.skill}</h3>
                              </div>
                              <span className="text-[10px] font-mono uppercase text-zinc-600">Priority: {gap.importance}</span>
                            </div>
                            <div className="md:w-2/3">
                              <p className="text-xs text-zinc-400 leading-relaxed">
                                <span className="text-emerald-400 font-mono text-[10px] uppercase block mb-1">Recommendation:</span>
                                {gap.recommendation}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  <div className="pt-8 border-t border-white/5 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-600">
                    <span>Generated by Job Alchemist AI</span>
                    <span>Confidential & Elite</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-white/5 py-12 bg-black/40">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-black" />
              </div>
              <span className="font-bold tracking-tighter text-sm uppercase italic">Job Alchemist</span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-xs">
              Transmuting generic career history into strategic assets for the world's most competitive roles.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400">The Framework</h3>
            <ul className="space-y-2 text-xs text-zinc-500 font-mono">
              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-emerald-500 rounded-full" /> Concise</li>
              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-emerald-500 rounded-full" /> Clear</li>
              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-emerald-500 rounded-full" /> Consistent</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400">System Status</h3>
            <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-zinc-500">Engine</span>
                <span className="text-emerald-400">Operational</span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-zinc-500">Uptime</span>
                <span className="text-emerald-400">99.9%</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
