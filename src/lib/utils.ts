export const uid = (p = ''): string => 
  (p || '') + Math.random().toString(36).slice(2, 7).toUpperCase();

export const today = (): string => new Date().toISOString().slice(0, 10);

export const addDays = (n: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

export const fmtDate = (d?: string): string => {
  if (!d) return '—';
  try {
    const x = new Date(d.includes('T') ? d : d + 'T00:00:00');
    return x.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  } catch {
    return d;
  }
};

export const fmtDateFull = (d?: string): string => {
  if (!d) return '—';
  try {
    const x = new Date(d.includes('T') ? d : d + 'T00:00:00');
    return x.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return d;
  }
};

export const ageOf = (dob?: string): number => {
  if (!dob || isNaN(new Date(dob).getTime())) return 0;
  const d = new Date(dob);
  return Math.max(0, Math.floor((Date.now() - d.getTime()) / (365.25 * 864e5)));
};

export const AVATAR_GRADIENTS = [
  'bg-gradient-to-br from-[#0e9c80] to-[#0a6b58]',
  'bg-gradient-to-br from-[#4a86f7] to-[#3159c9]',
  'bg-gradient-to-br from-[#f0a12e] to-[#d97c06]',
  'bg-gradient-to-br from-[#a55eea] to-[#7a3bd0]',
  'bg-gradient-to-br from-[#e5484d] to-[#b32a30]',
];

export const getAvatarGradient = (id: string | number): string => {
  const code = [...String(id)].reduce((a, c) => a + c.charCodeAt(0), 0);
  return AVATAR_GRADIENTS[code % AVATAR_GRADIENTS.length];
};

/**
 * Procedural pseudo-QR code SVG generator based on a deterministic string hash.
 * Completely reproduces the visual QR layout from final_kimi01.html.
 */
export const generateQrSvg = (str: string, size = 120): string => {
  let h = 7;
  for (const c of str) {
    h = (h * 31 + c.charCodeAt(0)) >>> 0;
  }
  const n = 21;
  let cells = '';
  const rng = (s: number) => () => {
    s = Math.imul(s ^ (s >>> 15), s | 1);
    return ((s ^ (s >>> 15)) >>> 0) / 4294967296;
  };
  const rnd = rng(h);

  const finder = (x: number, y: number) =>
    `<rect x="${x}" y="${y}" width="7" height="7" fill="#13231f"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#fff"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3" fill="#13231f"/>`;

  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const inF = (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
      if (inF) continue;
      if (rnd() > 0.52) {
        cells += `<rect x="${x}" y="${y}" width="1" height="1" fill="#13231f"/>`;
      }
    }
  }

  return `<svg viewBox="0 0 ${n} ${n}" style="width:${size}px;height:${size}px;background:#fff;border-radius:8px;padding:4px">${cells}${finder(0, 0)}${finder(n - 7, 0)}${finder(0, n - 7)}</svg>`;
};

/**
 * Calculates doctor slot schedule and marks booked slots based on real appointment state.
 */
export const calculateSlots = (
  docId: string,
  date: string,
  bookedTimes: string[]
): { time: string; booked: boolean }[] => {
  const base = ['09:00', '09:20', '09:40', '10:00', '10:20', '10:40', '11:00', '11:20', '11:40', '12:00'];
  const rot = [...docId].reduce((a, c) => a + c.charCodeAt(0), 0) + [...date].reduce((a, c) => a + c.charCodeAt(0), 0);
  const times = base.map((_, i) => base[(i + rot) % base.length]);
  return times.map(time => ({ time, booked: bookedTimes.includes(time) }));
};

/**
 * Rule-based symptom to clinical department classifier.
 */
export const classifyDepartment = (text: string): string => {
  const t = text.toLowerCase();
  if (/chest|heart|breath|bp|blood pressure|angina/.test(t)) return 'Cardiology';
  if (/joint|bone|back|fracture|knee|shoulder|sprain|spine/.test(t)) return 'Orthopedics';
  if (/skin|rash|itch|allergy|hair fall|pimple|eczema/.test(t)) return 'Dermatology';
  if (/ear|nose|throat|sinus|hearing|tonsil/.test(t)) return 'ENT';
  if (/pregnan|period|gynec|menstrual|baby care/.test(t)) return 'Gynecology';
  if (/stomach|gastric|diarr|vomit|abdom|constipat|acidity|pet/.test(t)) return 'Gastroenterology';
  if (/baby|child|kid|infant|son|daughter/.test(t)) return 'Pediatrics';
  return 'General Medicine';
};
