CPR PUNE — Library Management System
======================================
Centre for Police Research, Pune
Excellence in Research & Training

HOW TO USE:
-----------
1. Open `login.html` in any modern browser (Chrome, Firefox, Edge)
2. Login with:
   Username: admin
   Password: cpr1234
3. You will be redirected to the main dashboard.

FEATURES:
---------
• Dashboard      — Live stats, recent transactions, quick actions, monthly bar chart
• Book Catalogue — Add / Edit / Delete books, search & filter by category/status
• AI Book Scanner — Upload a book image, OCR the cover/title/ISBN, run multiple title/ISBN searches against Google Books / Open Library, rank candidates, and verify edition metadata when an ISBN is available
• Book metadata — AI/manual entry captures ISBN, language, category, publisher, year and Book Type/Format (Book, Paperback, Hardcover, eBook, Audiobook, Reference Book, Manual, Report, Journal, Thesis, Other)
• Members        — Add / Edit / Delete members, rank & department tracking
• Issue & Return — Issue books to members, process returns, view active loans
• Transactions   — Complete audit trail with search and status filters
• Reports        — Category breakdown, utilization bars, print support
• Settings       — Configure loan duration, fine rate, max books per member

PAGES:
------
login.html  — Login screen
index.html  — Main application (dashboard, books, members, issue/return, etc.)
css/style.css — All styles
js/data.js    — Mock data and utility functions
js/main.js    — Application logic and page rendering

NOTES:
------
• All data is in-memory (resets on refresh). To persist data, integrate a
  backend or localStorage in js/data.js.
• The logo (CPR Pune) is embedded as base64 — no external image files needed.
• Fully responsive down to mobile screens.
• No framework dependencies — plain HTML, CSS, JavaScript only.
• AI scanner loads Tesseract.js from jsDelivr on first use and requires internet access for OCR/metadata lookup.
• Online metadata is retrieved through public Google Books and Open Library APIs rather than scraping arbitrary websites.
• For best results, upload a straight, well-lit cover/title-page/ISBN photo. Indian-language books are supported through multilingual OCR plus online catalogue matching.
• The scanner now prefers exact ISBN matches and longer title matches, and avoids treating a short author line as the book title.
• Always review AI-detected fields before saving because online catalogues can contain edition or contributor differences.

© Centre for Police Research, Pune
