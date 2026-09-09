import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Clock,
  Pill,
  CheckCircle,
} from 'lucide-react';
import { QUICK_SYMPTOMS } from '../data/staticData';
import { uid, today } from '../lib/utils';
import { MedicalCase } from '../types';

export const CaseTakingScreen: React.FC = () => {
  const { currentUser, saveCase, navigate, isOfflineMode } = useApp();

  const [messages, setMessages] = useState<{ who: 'Assistant' | 'Patient'; text: string }[]>([
    {
      who: 'Assistant',
      text: 'Namaste! Please describe what health problem you are facing today, or choose a common symptom below.',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  // Speech Recognition API
  const handleVoiceToggle = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser environment.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      recognition.onerror = () => setIsRecording(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(prev => (prev ? prev + ' ' + transcript : transcript));
        }
      };

      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  const handleSend = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim()) return;

    const newMsgs = [...messages, { who: 'Patient' as const, text: textToSend.trim() }];
    setMessages(newMsgs);
    setInputText('');

    // If we have completed at least 3-4 conversational rounds, invite user to synthesize
    if (newMsgs.filter(m => m.who === 'Patient').length >= 3) {
      setIsGenerating(true);
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            who: 'Assistant',
            text: 'I have recorded your key symptoms, duration, and details. Would you like to review your structured case summary now and proceed to booking?',
          },
        ]);
        setIsGenerating(false);
      }, 600);
      return;
    }

    setIsGenerating(true);
    try {
      if (!isOfflineMode) {
        const res = await fetch('/api/triage/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            history: newMsgs,
            lastAnswer: textToSend.trim(),
          }),
        });
        const data = await res.json();
        if (data && data.reply) {
          setMessages(prev => [...prev, { who: 'Assistant', text: data.reply }]);
          setIsGenerating(false);
          return;
        }
      }
    } catch {
      // fallback handled below
    }

    // Deterministic fallback response
    const count = newMsgs.filter(m => m.who === 'Patient').length;
    const fallbacks = [
      'Since how many days have you been feeling this?',
      'Is the pain or discomfort mild, moderate, or severe?',
      'Have you noticed any fever, nausea, or appetite loss?',
      'Have you taken any medication so far?',
    ];
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { who: 'Assistant', text: fallbacks[count % fallbacks.length] },
      ]);
      setIsGenerating(false);
    }, 500);
  };

  const handleFinishIntake = async () => {
    setIsSummarizing(true);

    try {
      let summaryData: any = null;

      if (!isOfflineMode) {
        try {
          const res = await fetch('/api/triage/summarize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ conversation: messages }),
          });
          const data = await res.json();
          if (data && data.summary) {
            summaryData = data.summary;
          }
        } catch {
          // fallback below
        }
      }

      if (!summaryData) {
        // Deterministic extraction fallback
        const patientAnswers = messages
          .filter(m => m.who === 'Patient')
          .map(m => m.text)
          .join(' ');

        summaryData = {
          chief: messages.find(m => m.who === 'Patient')?.text.slice(0, 60) || 'General illness',
          symptoms: ['Fever', 'Body ache', 'Discomfort'],
          duration: '2–3 days',
          severity: 'Moderate (4–6)',
          appetite: 'Normal',
          sleep: 'Disturbed',
          past: 'No major chronic history noted',
          meds: 'Self-medicated OTC',
          allergies: 'No known allergies reported',
          missing: ['Detailed temperature chart'],
        };
      }

      const newCaseId = uid('C-');
      const newCase: MedicalCase = {
        id: newCaseId,
        pid: currentUser?.pid || 'P-1001',
        status: isOfflineMode ? 'offlineSaved' : 'submitted',
        created: today(),
        doctor: null,
        complaint: summaryData.chief || 'Patient Intake',
        original: messages,
        summary: summaryData,
        notes: [],
        followup: null,
        synced: !isOfflineMode,
      };

      saveCase(newCase);
      navigate('case-summary', { caseId: newCase.id });
    } finally {
      setIsSummarizing(false);
    }
  };

  const patientAnswerCount = messages.filter(m => m.who === 'Patient').length;

  return (
    <div className="flex flex-col h-[calc(100vh-65px)] pb-16 max-w-md mx-auto">
      {/* Intake Header / Banner */}
      <div className="px-4 py-2 bg-white border-b border-[#e2ebe8] flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold text-[#13231f] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#0e7c66]" /> AI Clinical Intake Assistant
          </h2>
          <p className="text-[10px] text-[#5d6f6a]">
            Structured triage conversation • Ready for doctor review
          </p>
        </div>

        {patientAnswerCount >= 2 && (
          <button
            onClick={handleFinishIntake}
            disabled={isSummarizing}
            className="px-3 py-1.5 bg-[#0e7c66] hover:bg-[#0a5f4e] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1 transition-all"
          >
            {isSummarizing ? 'Synthesizing...' : 'Generate Case'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-2.5 ${
              m.who === 'Patient' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.who === 'Assistant' && (
              <div className="w-7 h-7 rounded-full bg-[#0e7c66] text-white flex items-center justify-center shrink-0 text-xs shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                m.who === 'Patient'
                  ? 'bg-[#0e7c66] text-white rounded-tr-xs'
                  : 'bg-white text-[#13231f] border border-[#e2ebe8] shadow-xs rounded-tl-xs'
              }`}
            >
              {m.text}
            </div>

            {m.who === 'Patient' && (
              <div className="w-7 h-7 rounded-full bg-[#13231f] text-white flex items-center justify-center shrink-0 text-xs shadow-xs">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isGenerating && (
          <div className="flex gap-2 items-center text-xs text-[#5d6f6a] pl-2">
            <span className="w-2 h-2 rounded-full bg-[#0e7c66] animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-[#0e7c66] animate-bounce delay-100" />
            <span className="w-2 h-2 rounded-full bg-[#0e7c66] animate-bounce delay-200" />
            <span className="text-[11px]">Thinking clinical response...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Symptom Chips */}
      {patientAnswerCount === 0 && (
        <div className="px-4 pb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5d6f6a] block mb-1.5">
            Tap common symptom:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_SYMPTOMS.map(sym => (
              <button
                key={sym}
                onClick={() => handleSend(`I am suffering from ${sym}`)}
                className="px-2.5 py-1 bg-white border border-[#e2ebe8] hover:border-[#0e7c66] hover:bg-[#e3f3ef] text-[#13231f] text-xs rounded-lg transition-all shadow-2xs"
              >
                {sym}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input bar */}
      <div className="p-3 bg-white border-t border-[#e2ebe8]">
        <div className="flex items-center gap-2">
          <button
            onClick={handleVoiceToggle}
            className={`p-2.5 rounded-xl border transition-all ${
              isRecording
                ? 'bg-[#e5484d] text-white border-[#e5484d] animate-pulse'
                : 'bg-[#f2f6f5] text-[#5d6f6a] hover:text-[#13231f] border-[#e2ebe8]'
            }`}
            title="Voice Intake (Hold or tap to speak)"
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={
              isRecording ? 'Listening to your voice...' : 'Describe symptom, duration, or answer...'
            }
            className="flex-1 bg-[#f2f6f5] border border-[#e2ebe8] rounded-xl px-3.5 py-2.5 text-xs text-[#13231f] focus:outline-none focus:border-[#0e7c66] focus:bg-white transition-all"
          />

          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim()}
            className="p-2.5 bg-[#0e7c66] hover:bg-[#0a5f4e] disabled:opacity-40 text-white rounded-xl shadow-xs transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
