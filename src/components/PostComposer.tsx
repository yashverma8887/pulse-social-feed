'use client';

import React, { useState } from 'react';
import { useSocial } from '@/context/SocialContext';
import {
  Image as ImageIcon,
  BarChart2,
  Code,
  Sparkles,
  X,
  Plus,
  Send
} from 'lucide-react';

const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80'
];

export default function PostComposer() {
  const { currentUser, createPost } = useSocial();

  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [showImagePicker, setShowImagePicker] = useState(false);

  // Poll state
  const [showPollModal, setShowPollModal] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);

  // Code snippet state
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState('typescript');
  const [codeContent, setCodeContent] = useState('');

  const [submitting, setSubmitting] = useState(false);

  const handleAddPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const handlePollOptionChange = (idx: number, val: string) => {
    const next = [...pollOptions];
    next[idx] = val;
    setPollOptions(next);
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !mediaUrl && !pollQuestion && !codeContent) return;

    setSubmitting(true);
    try {
      const payload: any = {
        content: content.trim(),
        mediaUrl: mediaUrl || undefined
      };

      if (pollQuestion.trim() && pollOptions.filter(o => o.trim()).length >= 2) {
        payload.poll = {
          question: pollQuestion.trim(),
          options: pollOptions.filter(o => o.trim()).map(text => ({ text }))
        };
      }

      if (codeContent.trim()) {
        payload.codeSnippet = {
          language: codeLanguage,
          code: codeContent.trim()
        };
      }

      const success = await createPost(payload);
      if (success) {
        setContent('');
        setMediaUrl('');
        setShowImagePicker(false);
        setPollQuestion('');
        setPollOptions(['', '']);
        setShowPollModal(false);
        setCodeContent('');
        setShowCodeModal(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const charLimit = 280;
  const charsRemaining = charLimit - content.length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
      <div className="flex items-start gap-3.5">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-sky-500/20 shrink-0"
        />

        <div className="flex-1 min-w-0 space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening in tech, architecture, or code?"
            rows={3}
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none resize-none leading-relaxed"
          />

          {/* Attached Media Preview */}
          {mediaUrl && (
            <div className="relative rounded-2xl overflow-hidden border border-slate-700 aspect-video max-h-56 bg-slate-950">
              <img src={mediaUrl} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setMediaUrl('')}
                className="absolute top-2 right-2 p-1.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Attached Poll Preview */}
          {pollQuestion && (
            <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sky-400 flex items-center gap-1.5">
                  <BarChart2 className="w-3.5 h-3.5" /> Poll: {pollQuestion}
                </span>
                <button
                  onClick={() => {
                    setPollQuestion('');
                    setPollOptions(['', '']);
                  }}
                  className="text-slate-500 hover:text-rose-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-1">
                {pollOptions.filter(o => o.trim()).map((opt, i) => (
                  <div key={i} className="p-2 bg-slate-900 rounded-xl text-slate-300 border border-slate-800">
                    {opt}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attached Code Snippet Preview */}
          {codeContent && (
            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center text-slate-400 font-sans">
                <span className="font-bold text-sky-400 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5" /> Code Snippet ({codeLanguage})
                </span>
                <button onClick={() => setCodeContent('')} className="text-slate-500 hover:text-rose-400">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <pre className="text-slate-200 text-[11px] p-2 bg-slate-900 rounded-xl overflow-x-auto">
                {codeContent}
              </pre>
            </div>
          )}

          {/* Controls and Attachment Tools */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
            <div className="flex items-center gap-1">
              {/* Image Picker */}
              <button
                type="button"
                onClick={() => setShowImagePicker(!showImagePicker)}
                className="p-2 text-sky-400 hover:bg-sky-500/10 rounded-xl transition"
                title="Add Image"
              >
                <ImageIcon className="w-4 h-4" />
              </button>

              {/* Poll Creator */}
              <button
                type="button"
                onClick={() => setShowPollModal(true)}
                className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition"
                title="Create Poll"
              >
                <BarChart2 className="w-4 h-4" />
              </button>

              {/* Code Snippet Editor */}
              <button
                type="button"
                onClick={() => setShowCodeModal(true)}
                className="p-2 text-purple-400 hover:bg-purple-500/10 rounded-xl transition"
                title="Insert Code"
              >
                <Code className="w-4 h-4" />
              </button>
            </div>

            {/* Submit Bar */}
            <div className="flex items-center gap-3">
              <span className={`text-[11px] font-mono ${charsRemaining < 20 ? 'text-rose-400 font-bold' : 'text-slate-500'}`}>
                {charsRemaining}
              </span>

              <button
                type="button"
                onClick={handlePostSubmit}
                disabled={submitting || (!content.trim() && !mediaUrl && !pollQuestion && !codeContent)}
                className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black rounded-full text-xs transition shadow-lg shadow-sky-500/20 disabled:opacity-40 flex items-center gap-1.5"
              >
                {submitting ? 'Posting...' : 'Post'} <Send className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Presets Dropdown */}
      {showImagePicker && (
        <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
          <div className="flex justify-between items-center text-slate-400">
            <span>Select HD Preset or Paste URL:</span>
            <button onClick={() => setShowImagePicker(false)}><X className="w-3.5 h-3.5" /></button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {PRESET_IMAGES.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                onClick={() => {
                  setMediaUrl(img);
                  setShowImagePicker(false);
                }}
                className="h-16 w-full object-cover rounded-xl cursor-pointer hover:opacity-80 border border-slate-700"
              />
            ))}
          </div>
          <input
            type="url"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            placeholder="https://..."
            className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 text-xs"
          />
        </div>
      )}

      {/* Poll Creator Modal */}
      {showPollModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm">Create Interactive Poll</h3>
              <button onClick={() => setShowPollModal(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>

            <input
              type="text"
              placeholder="Ask a question..."
              value={pollQuestion}
              onChange={(e) => setPollQuestion(e.target.value)}
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white"
            />

            <div className="space-y-2">
              {pollOptions.map((opt, idx) => (
                <input
                  key={idx}
                  type="text"
                  placeholder={`Option ${idx + 1}`}
                  value={opt}
                  onChange={(e) => handlePollOptionChange(idx, e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              ))}
            </div>

            {pollOptions.length < 4 && (
              <button
                type="button"
                onClick={handleAddPollOption}
                className="text-sky-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add option
              </button>
            )}

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPollModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setShowPollModal(false)}
                className="px-5 py-2 bg-sky-500 text-slate-950 font-bold rounded-xl"
              >
                Attach Poll
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Code Snippet Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm">Insert Code Snippet</h3>
              <button onClick={() => setShowCodeModal(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>

            <select
              value={codeLanguage}
              onChange={(e) => setCodeLanguage(e.target.value)}
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
            >
              <option value="typescript">TypeScript / JavaScript</option>
              <option value="python">Python</option>
              <option value="rust">Rust</option>
              <option value="go">Go</option>
              <option value="sql">SQL / MongoDB</option>
            </select>

            <textarea
              rows={6}
              value={codeContent}
              onChange={(e) => setCodeContent(e.target.value)}
              placeholder="Paste or write your code..."
              className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl font-mono text-slate-200"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCodeModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setShowCodeModal(false)}
                className="px-5 py-2 bg-purple-500 text-white font-bold rounded-xl"
              >
                Attach Snippet
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
