import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Lazy initialize Gemini client
let aiClient: GoogleGenAI | null = null;
const getAI = () => {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
};

// Fallback rule-based structured clinical extractor if GEMINI_API_KEY is not configured
const ruleBasedClinicalExtract = (conversation: { who: string; text: string }[]) => {
  const fullText = conversation.map(c => c.text).join(' ');
  const t = fullText.toLowerCase();

  const symptoms: string[] = [];
  if (/fever|temperature|bukhar/.test(t)) symptoms.push('Fever');
  if (/cough|khansi/.test(t)) symptoms.push('Cough');
  if (/cold|sardi|chills|thand/.test(t)) symptoms.push('Cold & Chills');
  if (/headache|sir dard|sar dard/.test(t)) symptoms.push('Headache');
  if (/stomach|pet dard|vomit|nausea|loose motion/.test(t)) symptoms.push('Abdominal Discomfort');
  if (/chest|chhati|heart/.test(t)) symptoms.push('Chest Pain/Pressure');
  if (/body ache|badan dard|weakness|kamzori/.test(t)) symptoms.push('Body Ache');
  if (/joint|knee|back pain|kamar dard/.test(t)) symptoms.push('Joint/Back Pain');
  if (/skin|rash|khujli|itch/.test(t)) symptoms.push('Skin Rash/Itching');

  const chief = conversation[0]?.text.slice(0, 70) || (symptoms[0] || 'General malaise');

  let duration = '2–3 days';
  const durMatch = t.match(/(\d+)\s*(day|days|din|week|weeks|month|months|hafte)/);
  if (durMatch) {
    duration = `${durMatch[1]} ${durMatch[2]}`;
  }

  let severity = 'Moderate (4–6)';
  if (/severe|unbearable|bahut jyada|high|104|acute|critical/.test(t)) {
    severity = 'Severe (7–10)';
  } else if (/mild|thoda|kam|slight/.test(t)) {
    severity = 'Mild (1–3)';
  }

  return {
    chief: chief.charAt(0).toUpperCase() + chief.slice(1),
    symptoms: symptoms.length > 0 ? symptoms : ['Unspecified discomfort'],
    duration,
    severity,
    appetite: /not feel like eating|bhookh nahi|no appetite|kam bhookh/.test(t) ? 'Reduced' : 'Normal',
    sleep: /not sleeping|neend nahi|disturbed|insomnia/.test(t) ? 'Disturbed' : 'Normal',
    past: /diabetes|sugar|bp|pressure|asthma|migraine/.test(t) ? 'Relevant chronic history noted' : 'No major chronic illness recalled',
    meds: /paracetamol|tablet|dawa|medicine|crocin/.test(t) ? 'Self-medicated with over-the-counter medicine' : 'None reported',
    allergies: /penicillin|sulfa|allergy/.test(t) ? 'Suspected drug allergy' : 'No known drug allergies reported',
    missing: ['Exact onset trigger', 'Current body temperature reading'],
  };
};

// Conversational Question Generator Endpoint
router.post('/triage/chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const { history, lastAnswer, lang = 'en' } = req.body;

    const ai = getAI();
    if (ai) {
      const prompt = `You are ArogyaPath Clinical Intake Assistant for rural and semi-urban primary healthcare.
The current conversation in ${lang === 'hi' ? 'Hindi (Devanagari or Romanized)' : 'English'} is:
${JSON.stringify(history)}

Latest patient statement: "${lastAnswer || ''}"

TASK: Generate the NEXT single, empathetic, concise clarifying clinical intake question (maximum 1-2 short sentences) to understand the patient's condition (duration, severity, accompanying symptoms, appetite, or past medications).
Do NOT give medical advice or prescribe medicine. Only ask the next question.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const reply = response.text?.trim() || 'Could you please describe if you have taken any medication for this?';
      res.json({ success: true, reply, aiPowered: true });
      return;
    }

    // Fallback deterministic questions
    const count = (history || []).length;
    const fallbacksEn = [
      'Since how many days have you been experiencing this?',
      'How severe is the pain or discomfort on a scale of 1 to 10?',
      'Have you noticed any other symptoms like fever, chills, or headache?',
      'How is your appetite and sleep recently?',
      'Have you taken any medication or do you have any drug allergies?',
    ];
    const reply = fallbacksEn[count % fallbacksEn.length];
    res.json({ success: true, reply, aiPowered: false });
  } catch (err: any) {
    res.json({
      success: true,
      reply: 'Could you tell me how long you have had this problem and whether it gets worse at night?',
      aiPowered: false,
    });
  }
});

// Triage Case Summary Synthesis Endpoint
router.post('/triage/summarize', async (req: Request, res: Response): Promise<void> => {
  try {
    const { conversation } = req.body;
    if (!conversation || !Array.isArray(conversation)) {
      res.status(400).json({ success: false, message: 'Invalid conversation format' });
      return;
    }

    const ai = getAI();
    if (ai) {
      const prompt = `You are a clinical intake summarizer for ArogyaPath.
Analyze this intake dialogue:
${JSON.stringify(conversation)}

Return a strict JSON object with this exact schema:
{
  "chief": string, // Chief complaint
  "symptoms": string[], // List of confirmed symptoms
  "duration": string, // e.g. "3 days"
  "severity": string, // e.g. "Moderate (4–6)" or "Severe (7–10)" or "Mild (1–3)"
  "appetite": string, // "Normal" | "Reduced" | "Poor"
  "sleep": string, // "Normal" | "Disturbed"
  "past": string, // Past illnesses or "None reported"
  "meds": string, // Current or taken medications
  "allergies": string, // Known allergies or "No known allergies"
  "missing": string[] // 1-2 parameters still unclear for the doctor
}

Return ONLY pure valid JSON without markdown fences.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      let jsonStr = response.text || '';
      jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(jsonStr);
      res.json({ success: true, summary: parsed, aiPowered: true });
      return;
    }

    // Fallback extraction
    const summary = ruleBasedClinicalExtract(conversation);
    res.json({ success: true, summary, aiPowered: false });
  } catch (err) {
    const summary = ruleBasedClinicalExtract(req.body?.conversation || []);
    res.json({ success: true, summary, aiPowered: false });
  }
});

export default router;
