# Аудит сайта по приказу № 114-НҚ (автоматический, 25.09.2026)

Audit of the private build (178 HTML files, kz/ru/en; served on :8412). I checked all 112 items against the generated HTML and in Chrome/Playwright: search, forms, the low-vision mode, reduced motion, page width at 360–1440 px, links, headings and dates.

Tally: COVERED 42, PENDING-OK 58, WEAK 12 (items 3, 4, 11, 19, 70, 97, 100, 103, 104, 109, 111, 112). Nothing is fully MISSING.

What already works:
- No broken internal links or anchors.
- Exactly one h1 on every page, with no skipped heading levels.
- Every inner page has breadcrumbs and a "published / updated" line.
- All external links open in a new tab and say so.
- kz, ru and en have identical page structure, and no Russian was found in the Kazakh pages.
- Search: 200-character field, results page that keeps the query, section filter and sort.
- Forms: labels, hints, text error messages, consent box, honeypot instead of a captcha.
- The a11y panel has font size, 4 colour schemes, images off, letter spacing and line spacing.
- In low-vision mode the landing has no 3D and the day section becomes a vertical grid.
- Default language is Kazakh; switching language keeps the same page. Footer, RSS, sitemap.xml, robots.txt and hreflang are all present.
- The State Emblem is left out of the header on purpose. The symbols page explains why (Constitutional Law ст. 6 п. 4) and shows the flag, emblem and anthem. I treat item 6 as covered.

PENDING-OK — slots exist, the school must fill them (item numbers):
- 21: city landline and official e-mail.
- 25: charter and registration certificate as PDF.
- 26: appendix to licence KZ29LAM00002781 and the PDF from elicense.
- 27: approved structure order.
- 28–29: director's photo, education, category, appointment order, reception hours; deputies.
- 30: regulations, membership, plans and minutes of the pedagogical, methodical and ethics councils.
- 31: development plan and reports.
- 32, 34: mission, achievements, international cooperation or the statement «не осуществляется».
- 35–37: teachers list (with consent), staff analytics, vacancies.
- 39: contingent.
- 40–41: application templates, contract, fees.
- 42, 44–46: working curriculum, electives, life-safety and road-safety topics and dates, bell schedule and timetable.
- 48–56: internal-control plan and reports, special-needs data, school academic calendar, distance-learning orders, methodical plans, results, upbringing plan, clubs timetable, parent meetings.
- 58–66: building basis and capacity, room equipment, medical contract, sanitary certificate and fire-safety report, meals supplier / menu / commission, security measures, accessibility details, library stock and textbook provision, ICT and e-journal.
- 75–77: internal documents, PDFs, 3-year archive (news for 2024 is empty).
- 78–82: board of trustees — announcement, membership, plan, meetings, minutes, annual report.
- 85–88: director's message and answers, reception schedule, person responsible for appeals, survey results.
- 90: bank details and e-mail.
- 91–92: daily news, archive.
- 93–95: meals rubric, finance and charity reports plus a statement on budget funding, ethics officer.

Only the owner can do these, outside the site:
- Renew keremet.edu.kz; the EDU.KZ registration expired on 18.08.2023.
- Host on servers in Kazakhstan with PHP mail() for api/feedback.php.
- Install a TLS certificate. .htaccess already redirects to HTTPS.
- Set up and confirm the info@ mailbox and set `$CONFIG['to']`.
- Supply real signed documents (PDF) and the school's own photos.
- Run the self-assessment for 39 criteria covering 2024–2025, 2025–2026 and 2026–2027. Publish it at least 5 days before the attestation, once the Перечень is approved (by 1 November).
- Update the site daily (news and menu), within 3 working days for everything else, and by 1 September each year.
- Register the site in Google and Yandex webmaster tools.

Test scripts and screenshots are in C:\Users\daulet\AppData\Local\Temp\claude\c--Users-daulet-Desktop-keremet-school-website\764f9a22-6334-4b28-ba09-dd67071739fb\scratchpad\qa\qa-audit114\ (b1–b16.mjs, a11y-*.png, ovf2-*.png, land-390.png).