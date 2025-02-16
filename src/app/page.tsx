"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BlogPost } from "@/types/blog";

const PERSPECTIVES = [
  { id: 'software-engineer', label: 'Software Engineer' },
  { id: 'student', label: 'Student' },
  { id: 'teacher', label: 'Teacher' },
  { id: 'business-professional', label: 'Business Professional' },
  { id: 'casual-blogger', label: 'Casual Blogger' },
];

const formatContent = (content: string) => {
  // Remove markdown-style line breaks and replace with proper paragraphs
  return content
    .replace(/---/g, '') // Remove triple dashes
    .replace(/###/g, '') // Remove markdown headers
    .replace(/\*\*/g, '') // Remove bold markers
    .split('\n')
    .filter(line => line.trim() !== '') // Remove empty lines
    .map(line => line.trim()) // Trim whitespace
    .join('\n\n'); // Add proper paragraph spacing
};

export default function Home() {
  const [title, setTitle] = useState("");
  const [keywords, setKeywords] = useState("");
  const [perspective, setPerspective] = useState("software-engineer");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const contentRef = useRef("");
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsGenerating(false);
    }
  };

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setError("");
      setGeneratedContent("");
      contentRef.current = "";

      // Create new AbortController for this request
      abortControllerRef.current = new AbortController();

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          keywords: keywords.split(",").map((k) => k.trim()),
          perspective,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error("Failed to generate blog post");
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        contentRef.current += text;
        setGeneratedContent(formatContent(contentRef.current));
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError("Generation stopped by user.");
      } else {
        setError("Failed to generate blog post. Please try again.");
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-100%,#ffffff10,#00000000)]"></div>
      
      <main className="relative min-h-screen flex items-center justify-center py-10">
        <div className="w-full max-w-3xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <motion.h1
              className="text-4xl font-bold tracking-tight lg:text-5xl text-center text-white pb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              AI Blog Generator
            </motion.h1>
            
            <div className="rounded-xl border border-gray-800 bg-black/50 backdrop-blur-sm shadow-2xl p-6 space-y-6">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <label htmlFor="title" className="text-sm font-medium leading-none mb-2 block text-gray-400">
                  Blog Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-gray-800 bg-black/50 px-3 py-2 text-sm text-gray-100 ring-offset-black focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                  placeholder="Enter blog title..."
                />
              </motion.div>

              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <label htmlFor="keywords" className="text-sm font-medium leading-none mb-2 block text-gray-400">
                  Keywords (comma-separated)
                </label>
                <input
                  id="keywords"
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-gray-800 bg-black/50 px-3 py-2 text-sm text-gray-100 ring-offset-black focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                  placeholder="Enter keywords..."
                />
              </motion.div>

              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <label htmlFor="perspective" className="text-sm font-medium leading-none mb-2 block text-gray-400">
                  Writing Perspective
                </label>
                <select
                  id="perspective"
                  value={perspective}
                  onChange={(e) => setPerspective(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-gray-800 bg-black/50 px-3 py-2 text-sm text-gray-100 ring-offset-black focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                >
                  {PERSPECTIVES.map((p) => (
                    <option key={p.id} value={p.id} className="bg-black">
                      {p.label}
                    </option>
                  ))}
                </select>
              </motion.div>

              <motion.button
                onClick={isGenerating ? handleStopGeneration : handleGenerate}
                disabled={!isGenerating && (!title && !keywords)}
                className="w-full inline-flex items-center justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {isGenerating ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Stop Generating
                  </span>
                ) : (
                  "Generate Blog Post"
                )}
              </motion.button>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="rounded-lg bg-red-900/20 border border-red-800/50 p-4 text-red-400"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {generatedContent && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="rounded-xl border border-gray-800 bg-black/50 backdrop-blur-sm shadow-2xl overflow-hidden"
                >
                  <div className="p-6 border-b border-gray-800">
                    <motion.h2
                      className="text-2xl font-semibold text-white"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      Generated Blog Post
                    </motion.h2>
                  </div>
                  <motion.div
                    className="p-6 prose prose-invert max-w-none"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {generatedContent.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="text-gray-300 leading-relaxed mb-4 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                  </motion.div>
                  <div className="px-6 py-4 bg-gray-900/50 border-t border-gray-800 flex justify-end">
                    <motion.button
                      onClick={handleCopy}
                      className="inline-flex items-center px-4 py-2 rounded-lg bg-white/10 border border-gray-800 text-sm font-medium text-gray-300 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2 text-gray-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {isCopied ? (
                          <motion.path
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.3 }}
                            d="M20 6L9 17l-5-5"
                          />
                        ) : (
                          <>
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                          </>
                        )}
                      </svg>
                      <span>{isCopied ? "Copied!" : "Copy"}</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
    </div>
  );
} 