import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import { Candidate } from '../types';
import { 
  Building2, 
  GraduationCap, 
  Briefcase, 
  Sparkles, 
  ChevronRight, 
  FileText, 
  Mail, 
  Phone, 
  Calendar,
  AlertCircle
} from 'lucide-react';

interface ResumeCardProps {
  key?: string;
  candidate: Candidate;
  onSwipe: (approved: boolean) => void;
  isActive: boolean;
}

export function ResumeCard({ candidate, onSwipe, isActive }: ResumeCardProps) {
  const [activeTab, setActiveTab] = useState<'ai' | 'resume'>('ai');
  const x = useMotionValue(0);
  
  // Swipe rotations and opacity animations
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0.5, 1, 1, 1, 0.5]);
  
  // Dynamic badge opacities based on swipe direction
  const listOverlayOpacity = useTransform(x, [-120, -40, 0, 40, 120], [1, 0, 0, 0, 1]);
  const approveOpacity = useTransform(x, [10, 100], [0, 1]);
  const rejectOpacity = useTransform(x, [-100, -10], [1, 0]);

  // Handle Drag End event
  const handleDragEnd = (_event: any, info: any) => {
    const swipeThreshold = 140;
    const swipeVelocity = 350;

    if (info.offset.x > swipeThreshold || info.velocity.x > swipeVelocity) {
      // Swipe Right (Accept)
      animate(x, 400, { duration: 0.2 }).then(() => onSwipe(true));
    } else if (info.offset.x < -swipeThreshold || info.velocity.x < -swipeVelocity) {
      // Swipe Left (Reject)
      animate(x, -400, { duration: 0.2 }).then(() => onSwipe(false));
    } else {
      // Snap back to center
      animate(x, 0, { type: 'spring', stiffness: 300, damping: 20 });
    }
  };

  if (!isActive) return null;

  return (
    <div id={`card-${candidate.id}`} className="absolute inset-0 flex items-center justify-center p-4">
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={1}
        onDragEnd={handleDragEnd}
        style={{ x, rotate, opacity }}
        whileDrag={{ scale: 1.02, cursor: 'grabbing' }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl hover:shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[520px] select-none clip-path-swipe relative"
      >
        {/* Swipe stamps */}
        <motion.div 
          style={{ opacity: approveOpacity }}
          className="absolute top-10 left-10 border-4 border-emerald-500 text-emerald-500 font-extrabold text-3xl px-4 py-2 rounded-xl z-20 pointer-events-none rotate-[-12deg] bg-emerald-50/90 tracking-wider"
        >
          SHORTLIST
        </motion.div>
        <motion.div 
          style={{ opacity: rejectOpacity }}
          className="absolute top-10 right-10 border-4 border-rose-500 text-rose-500 font-extrabold text-3xl px-4 py-2 rounded-xl z-20 pointer-events-none rotate-[12deg] bg-rose-50/90 tracking-wider"
        >
          PASS
        </motion.div>

        {/* Card Header (Profile Summary / Role Name) */}
        <div className="bg-slate-900 text-white p-5 relative shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-emerald-500/30">
                  CV APPLICANT
                </span>
                <span className="text-slate-400 text-xs flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Received: {candidate.appliedDate}
                </span>
              </div>
              <h2 id={`title-${candidate.id}`} className="text-2xl font-bold tracking-tight text-white mb-0.5">
                {candidate.name}
              </h2>
              <p className="text-slate-300 font-medium text-sm flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-emerald-400" /> {candidate.role}
              </p>
            </div>

            {/* Match Percentage circular / badge */}
            {candidate.matchPercentage !== undefined && (
              <div className="flex flex-col items-end">
                <div className={`px-3 py-1.5 rounded-lg flex items-center gap-2 border font-mono ${
                  candidate.matchPercentage >= 90 
                    ? 'bg-emerald-600/30 border-emerald-500/40 text-emerald-300'
                    : candidate.matchPercentage >= 80
                    ? 'bg-blue-600/30 border-blue-500/40 text-blue-300'
                    : 'bg-amber-600/30 border-amber-500/40 text-amber-300'
                }`}>
                  <Sparkles className="w-4.5 h-4.5 shrink-0" />
                  <div className="text-right">
                    <span className="text-lg font-bold">{candidate.matchPercentage}%</span>
                    <span className="text-[10px] block opacity-80 leading-none">AI FIT</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-xs text-slate-300 border-t border-slate-800 pt-3">
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" /> {candidate.email || "No Email"}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" /> {candidate.phone || "No Phone"}
            </span>
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" /> {candidate.experience} Exp
            </span>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-slate-200 bg-slate-50 shrink-0">
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider border-b-2 flex items-center justify-center gap-2 transition-all ${
              activeTab === 'ai'
                ? 'border-slate-900 text-slate-950 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${activeTab === 'ai' ? 'text-emerald-500' : ''}`} />
            AI Screening Evaluation
          </button>
          <button
            onClick={() => setActiveTab('resume')}
            className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider border-b-2 flex items-center justify-center gap-2 transition-all ${
              activeTab === 'resume'
                ? 'border-slate-900 text-slate-950 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <FileText className={`w-4 h-4 ${activeTab === 'resume' ? 'text-emerald-500' : ''}`} />
            Full CV Document Context
          </button>
        </div>

        {/* Card Content body */}
        <div className="flex-1 overflow-y-auto p-5 bg-white leading-relaxed">
          {activeTab === 'ai' ? (
            <div className="space-y-4">
              {/* Core summary */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Executive Highlight</h4>
                <p className="text-slate-700 text-sm italic border-l-3 border-emerald-500 pl-3 bg-slate-50 py-1.5 rounded-r">
                   "{candidate.summary}"
                </p>
              </div>

              {/* Skills pill grid */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Core Competency Focus</h4>
                <div className="flex flex-wrap gap-1.5">
                  {candidate.skills.map((skill, i) => (
                    <span 
                      key={i} 
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs px-2.5 py-1 rounded-md font-medium border border-slate-200 transition-colors cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* AI matching justification */}
              {candidate.aiReasoning && (
                <div className="bg-emerald-50/50 border border-emerald-500/20 rounded-xl p-3.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Gemini AI Assessment
                  </h4>
                  <p className="text-slate-700 text-xs leading-relaxed font-normal">
                    {candidate.aiReasoning}
                  </p>
                </div>
              )}

              {/* Work Experience Quick Line */}
              <div className="border-t border-slate-100 pt-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-500" /> Education Background
                </h4>
                <p className="text-slate-700 text-xs">
                  {candidate.education}
                </p>
              </div>
            </div>
          ) : (
            <div className="font-mono text-[11px] leading-relaxed text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-4 whitespace-pre-wrap select-text h-full overflow-y-auto">
              {candidate.resumeText}
            </div>
          )}
        </div>

        {/* Footer tip */}
        <div className="bg-slate-50 border-t border-slate-100 px-5 py-2.5 flex justify-between items-center text-xs text-slate-400 shrink-0 select-none">
          <span className="flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
            Drag horizontally or use arrow keys: Left (Reject), Right (Accept)
          </span>
          <ChevronRight className="w-4 h-4 ml-1 opacity-50 shrink-0 animate-pulse" />
        </div>
      </motion.div>
    </div>
  );
}
