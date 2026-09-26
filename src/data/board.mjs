// =====================================================================================
//  src/data/board.mjs — Board of Trustees (Қамқоршылық кеңес / Попечительский совет) data slot.
//  Read by src/pages/board.mjs. Owner: about. Rules: Order No. 355, Annex 2 (paras 11, 13, 17, 27).
//  RULE: never invent facts. Everything below stays null / [] until the school supplies it;
//  the page shows a pending block for every empty slot and renders the real data as soon as it is filled.
//  Localised values are { kz, ru, en } (a plain string is also accepted for names and places).
//  Dates: 'YYYY-MM-DD'; times: 'HH:MM'. Files: path under public/assets/ (e.g. 'docs/board-2026-q1.pdf').
// =====================================================================================

export const board = {
  schoolYear: '2026–2027',

  // Notice of the parents' meeting that nominates candidates (para. 11(1), ≥ 10 calendar days ahead).
  // Shape: { date: 'YYYY-MM-DD', time: 'HH:MM', place: {kz,ru,en}, text: {kz,ru,en}, posted: 'YYYY-MM-DD' }
  announcement: null, // TODO(school)

  // Approved membership (para. 13). category ∈ parents | veteran | authority | ngo | donor | media | pupils.
  // Shape: [{ name: {kz,ru,en} | 'Full Name', category: 'parents', note: {kz,ru,en} /* e.g. "2nd-grade parallel" */ }]
  members: [], // TODO(school)
  // Who approved the membership and by which order (para. 13).
  // Shape: { body: {kz,ru,en}, number: '…', date: 'YYYY-MM-DD' }
  approved: null, // TODO(school)
  chair: null, // TODO(school): { kz, ru, en } or 'Full Name' — elected by members (para. 19)
  secretary: null, // TODO(school): { kz, ru, en } or 'Full Name' — not a member (para. 21)

  // Meetings for the school year, at least one per quarter (para. 17). Add a row as soon as a meeting is called,
  // then add `decision` after it is held (para. 27).
  // Shape: [{ quarter: 1..4, date: 'YYYY-MM-DD', time: 'HH:MM', place: {kz,ru,en}, agenda: {kz,ru,en},
  //           decision: { title: {kz,ru,en}, file: 'docs/….pdf' | null, url: 'https://…' | null, number: '…', date: 'YYYY-MM-DD' } | null }]
  meetings: [], // TODO(school)
};

export default board;
