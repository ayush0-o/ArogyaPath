import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Activity,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Server,
  HeartPulse,
  Lock,
} from 'lucide-react';
import { motion } from 'motion/react';

interface SplashStep {
  text: string;
  sub: string;
  progress: number;
}

const BOOT_STEPS: SplashStep[] = [
  {
    text: 'Connecting to ABDM Gateway',
    sub: 'National Health Authority (NHA) Secured Bus',
    progress: 25,
  },
  {
    text: 'Mounting Offline Clinical Store',
    sub: 'IndexedDB Offline Cache for Rural Sub-Centers',
    progress: 55,
  },
  {
    text: 'Calibrating AI Clinical Triage',
    sub: 'WHO & AIIMS Emergency Protocol Matrix',
    progress: 85,
  },
  {
    text: 'All Health Systems Operational',
    sub: 'District General Hospital & PHC Network Synced',
    progress: 100,
  },
];

interface SplashScreenProps {
  onComplete?: () => void;
  autoAdvance?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  autoAdvance = true,
}) => {
  const { navigate, currentUser } = useApp();
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(15);
  const [isReady, setIsReady] = useState(false);

  const handleFinish = () => {
    if (onComplete) {
      onComplete();
    } else {
      if (currentUser) {
        navigate('home');
      } else {
        navigate('welcome');
      }
    }
  };

  useEffect(() => {
    // Step progression sequence
    const timers: NodeJS.Timeout[] = [];

    timers.push(
      setTimeout(() => {
        setStepIndex(1);
        setProgress(BOOT_STEPS[1].progress);
      }, 600)
    );

    timers.push(
      setTimeout(() => {
        setStepIndex(2);
        setProgress(BOOT_STEPS[2].progress);
      }, 1200)
    );

    timers.push(
      setTimeout(() => {
        setStepIndex(3);
        setProgress(BOOT_STEPS[3].progress);
        setIsReady(true);
      }, 1800)
    );

    if (autoAdvance) {
      timers.push(
        setTimeout(() => {
          handleFinish();
        }, 2400)
      );
    }

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [autoAdvance]);

  const currentStep = BOOT_STEPS[stepIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#083a30] via-[#0e5c4d] to-[#062922] text-white flex flex-col justify-between p-6 max-w-md mx-auto relative overflow-hidden select-none">
      {/* Background ambient lighting effects */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#12b993]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#0e7c66]/25 rounded-full blur-3xl pointer-events-none" />

      {/* Top ABDM Badge */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-3 flex items-center justify-between z-10"
      >
        <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 text-[11px] font-medium tracking-wide">
          <ShieldCheck className="w-3.5 h-3.5 text-[#48e5c2]" />
          <span>ABDM & NHA Compliant</span>
        </div>

        <button
          onClick={handleFinish}
          className="text-xs text-white/70 hover:text-white font-medium px-2 py-1 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-1"
        >
          <span>Skip</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </motion.div>

      {/* Central Brand Identity & Emblem */}
      <div className="my-auto py-8 text-center flex flex-col items-center z-10">
        {/* Animated Brand Emblem */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative mb-6"
        >
          {/* Pulsing Aura Rings */}
          <div className="absolute -inset-3 bg-[#48e5c2]/20 rounded-3xl blur-md animate-pulse" />
          <div className="absolute -inset-6 bg-[#0e7c66]/30 rounded-full blur-xl" />

          {/* Center Emblem Container */}
          <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-[#12a382] to-[#094d3f] border border-[#48e5c2]/40 shadow-2xl flex items-center justify-center p-4">
            {/* Heartbeat icon with Devanagari character */}
            <div className="relative flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-white tracking-tighter drop-shadow-md">
                आ
              </span>
              <div className="absolute -bottom-2 flex items-center gap-0.5 text-[#48e5c2]">
                <Activity className="w-4 h-4 animate-pulse" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Platform Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-1.5"
        >
          <div className="inline-flex items-center gap-2">
            <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-sm">
              ArogyaPath
            </h1>
            <span className="text-xs font-bold uppercase tracking-wider bg-[#48e5c2] text-[#062922] px-2 py-0.5 rounded-md">
              v2.4
            </span>
          </div>

          <h2 className="text-xl font-bold text-[#48e5c2] tracking-wide">
            आरोग्य पथ
          </h2>

          <p className="text-xs text-white/80 max-w-xs mx-auto pt-1 font-normal leading-relaxed">
            National Digital Health & Clinical Triage Gateway
          </p>
        </motion.div>

        {/* Animated ECG Pulse Wave SVG */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="w-full max-w-xs my-6 px-4"
        >
          <svg
            className="w-full h-10 text-[#48e5c2]/60 overflow-visible"
            viewBox="0 0 300 40"
            fill="none"
          >
            <path
              d="M0 20 L70 20 L85 20 L95 5 L105 35 L115 12 L125 24 L135 20 L210 20 L220 7 L230 33 L240 18 L250 20 L300 20"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-[0_0_8px_rgba(72,229,194,0.6)]"
            />
          </svg>
        </motion.div>

        {/* Dynamic Boot Sequence Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full max-w-xs bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-left shadow-lg space-y-2.5"
        >
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#48e5c2] animate-ping" />
              <span className="font-semibold text-white tracking-wide text-[12px]">
                {currentStep.text}
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#48e5c2] font-bold">
              {progress}%
            </span>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full bg-black/20 h-1.5 rounded-full overflow-hidden p-0.5">
            <motion.div
              className="bg-gradient-to-r from-[#48e5c2] to-[#12b993] h-full rounded-full shadow-[0_0_6px_#48e5c2]"
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut', duration: 0.4 }}
            />
          </div>

          <p className="text-[10px] text-white/70 font-light truncate">
            {currentStep.sub}
          </p>
        </motion.div>
      </div>

      {/* Bottom Certifications & Enter Button */}
      <div className="pb-3 text-center space-y-3.5 z-10">
        <button
          onClick={handleFinish}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-[#48e5c2] to-[#12b993] hover:from-[#3cd6b4] hover:to-[#0ea783] text-[#062922] font-bold text-xs rounded-xl shadow-lg shadow-[#48e5c2]/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
        >
          <span>{isReady ? 'Enter Healthcare Portal' : 'Launch ArogyaPath'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="flex items-center justify-center gap-3 text-[10px] text-white/60">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[#48e5c2]" /> HL7 FHIR R4
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-[#48e5c2]" /> 256-bit Encrypted
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Server className="w-3 h-3 text-[#48e5c2]" /> Offline First
          </span>
        </div>
      </div>
    </div>
  );
};
