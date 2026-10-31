import React, { useState } from 'react';
import { X, Sparkles, FileCode2, Copy, Check, Loader2, GitCommit, Heart } from 'lucide-react';
import { Project } from '../types';

interface ChangelogTributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export const ChangelogTributeModal: React.FC<ChangelogTributeModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const [version, setVersion] = useState('v2.9.0');
  const [isLoading, setIsLoading] = useState(false);
  const [changelog, setChangelog] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/generate-changelog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ version, projectId: project.id }),
      });
      const data = await res.json();
      if (data.success) {
        setChangelog(data.changelogMarkdown);
      }
    } catch (err) {
      console.error('Changelog generation failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyChangelog = () => {
    if (changelog) {
      navigator.clipboard.writeText(changelog);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-zinc-900 border border-zinc-700/80 shadow-2xl overflow-hidden my-8">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-1/4 -z-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/70">
          <div className="flex items-center space-x-2">
            <GitCommit className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400">
              Gemini 3.8 Flash • AI Release Changelog &amp; Sponsor Tribute
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Draft Release Notes with Backer Attribution
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Gemini automatically drafts structured release notes for <span className="text-white font-mono">{project.repo}</span>, attributing specific PRs and CI compute to your community backers.
            </p>
          </div>

          {/* Version Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-950 border border-zinc-800">
            <div className="flex items-center space-x-3">
              <span className="text-xs text-zinc-400 font-mono">Release Tag:</span>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="bg-zinc-900 text-xs font-mono font-bold text-white border border-zinc-700 rounded-lg px-3 py-1.5 focus:outline-none focus:border-purple-500 w-28"
                placeholder="v2.9.0"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-300 hover:to-pink-300 text-zinc-950 font-bold text-xs shadow-lg shadow-purple-500/20 transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Composing Changelog...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Release Notes</span>
                </>
              )}
            </button>
          </div>

          {/* Generated Markdown Preview */}
          {changelog && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span className="text-purple-400 font-bold">CHANGELOG.md Preview</span>
                <button
                  onClick={copyChangelog}
                  className="flex items-center space-x-1 text-emerald-400 hover:underline cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Markdown'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 whitespace-pre-wrap max-h-72 overflow-y-auto leading-relaxed">
                <code>{changelog}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
