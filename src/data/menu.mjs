// School menu data for /{kz,ru,en}/meals.html (owner: campus). Order No. 598, para. 106: the head of the school
// approves the DAILY menu (with portion sizes) on the basis of the long-term menu and makes it visible to parents.
// Publishing a day = add one object to `days` and rebuild; nothing in src/pages/meals.mjs has to change.
// The newest date is shown as "today's menu"; older dates go to the archive (grouped by month) automatically.
//
//   days: [{
//     date: 'YYYY-MM-DD',                          // required
//     photo: 'img/meals/2026-09-28.jpg',           // optional, path under public/assets/
//     photoAlt: { kz, ru, en },                    // optional
//     meals: [{
//       slot:  { kz, ru, en },                     // e.g. breakfast / lunch — as the school names them
//       dish:  { kz, ru, en },                     // dish name (several dishes: one row each)
//       grams: 200,                                // portion (выход), g — optional
//       price: 450,                                // ₸ — optional
//       photo: 'img/meals/…jpg',                   // optional per-dish photo
//     }],
//   }]
//
//   week: null | {                                 // the weekly board (from the approved long-term menu)
//     from: 'YYYY-MM-DD', to: 'YYYY-MM-DD',        // optional period
//     days: [{ day: 1..5, meals: [{ slot:{kz,ru,en}, dish:{kz,ru,en} }] }],
//   }
//
// Supplier and commission come from S.meals.{supplier, commission} in src/data/school.mjs:
//   supplier:   { name, bin?, type:{kz,ru,en}?, contract:{number,date,term}?, sez:{number,date}?, responsible? , cost:{kz,ru,en}? }
//   commission: { monitoring:[{ name, role:{kz,ru,en} }], brakerazh:[{ name, role:{kz,ru,en} }] }
// S.meals.menu (if it is an array of days in the shape above) is merged with `days`.
//
// TODO(school): nothing has been provided yet — while both lists are empty the page shows one pending block.
export const days = [];
export const week = null;

export default { days, week };
