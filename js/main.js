// ─── ROUTER ──────────────────────────────────────────────────────────────────
const routes = {
  dashboard: renderDashboard,
  books: renderBooks,
  members: renderMembers,
  issue: renderIssueReturn,
  transactions: renderTransactions,
  reports: renderReports,
  settings: renderSettings
};

let currentPage = 'dashboard';

function navigate(page) {
  currentPage = page;
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === page);
  });
  document.getElementById('page-title').textContent = {
    dashboard: 'Dashboard', books: 'Book Catalogue', members: 'Members',
    issue: 'Issue & Return', transactions: 'Transactions', reports: 'Reports', settings: 'Settings'
  }[page] || page;
  const content = document.getElementById('page-content');
  content.innerHTML = '';
  routes[page]?.(content);
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function toast(msg, type = 'success') {
  const icons = { success:'✓', error:'✕', warning:'⚠' };
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span>${icons[type]}</span><span>${msg}</span>`;
  document.getElementById('toast-container').appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
function openModal(title, bodyHTML, onSave) {
  const ov = document.getElementById('modal-overlay');
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHTML;
  ov.classList.add('show');
  document.getElementById('modal-save-btn').onclick = () => {
    const result = onSave();
    if (result !== false) closeModal();
  };
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('show');
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function renderDashboard(el) {
  const totalBooks = DATA.books.reduce((s, b) => s + b.copies, 0);
  const availableBooks = DATA.books.reduce((s, b) => s + b.available, 0);
  const activeMembers = DATA.members.filter(m => m.status === 'active').length;
  const overdueCount = DATA.transactions.filter(t => t.status === 'overdue').length;
  const issuedToday = DATA.transactions.filter(t => t.issueDate === today()).length;

  const monthLabels = ['Aug','Sep','Oct','Nov','Dec','Jan'];
  const issuesByMonth = [18,24,31,22,28,issuedToday + 6];
  const maxVal = Math.max(...issuesByMonth);

  el.innerHTML = `
    <div class="page-header">
      <div>
        <h1>Library Dashboard</h1>
        <p>Overview of ${DATA.settings.libraryName} Library System</p>
      </div>
      <button class="btn btn-primary" onclick="navigate('issue')">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        Issue Book
      </button>
    </div>

    <div class="stats-grid">
      <div class="stat-card navy">
        <div class="stat-label">Total Books (Titles)</div>
        <div class="stat-value">${DATA.books.length}</div>
        <div class="stat-change up">▲ ${totalBooks} total copies</div>
        <div class="stat-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg></div>
      </div>
      <div class="stat-card gold">
        <div class="stat-label">Books Available</div>
        <div class="stat-value">${availableBooks}</div>
        <div class="stat-change">${totalBooks - availableBooks} currently issued</div>
        <div class="stat-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
      </div>
      <div class="stat-card success">
        <div class="stat-label">Active Members</div>
        <div class="stat-value">${activeMembers}</div>
        <div class="stat-change">${DATA.members.length} total registered</div>
        <div class="stat-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg></div>
      </div>
      <div class="stat-card danger">
        <div class="stat-label">Overdue Books</div>
        <div class="stat-value">${overdueCount}</div>
        <div class="stat-change down">${overdueCount > 0 ? 'Requires attention' : 'All on time'}</div>
        <div class="stat-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
      </div>
    </div>

    <div class="dash-grid">
      <div class="table-card">
        <div class="table-card-header">
          <h3>Recent Transactions</h3>
          <button class="btn btn-outline btn-sm" onclick="navigate('transactions')">View All</button>
        </div>
        <table>
          <thead><tr>
            <th>Book</th><th>Member</th><th>Issue Date</th><th>Due Date</th><th>Status</th>
          </tr></thead>
          <tbody>
            ${DATA.transactions.slice(0,5).map(t => `
              <tr>
                <td><span style="font-weight:600;color:var(--navy)">${t.bookTitle.length > 28 ? t.bookTitle.slice(0,28)+'…' : t.bookTitle}</span></td>
                <td>${t.memberName}</td>
                <td>${formatDate(t.issueDate)}</td>
                <td>${formatDate(t.dueDate)}</td>
                <td><span class="badge badge-${t.status}">${t.status}</span></td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>

      <div style="display:flex;flex-direction:column;gap:20px">
        <div class="table-card">
          <div class="table-card-header" style="padding-bottom:0"><h3>Issues (Last 6 Months)</h3></div>
          <div class="bar-chart">
            ${monthLabels.map((m,i) => `
              <div class="bar-wrap">
                <div class="bar-val">${issuesByMonth[i]}</div>
                <div class="bar ${i === monthLabels.length-1 ? 'gold' : ''}" style="height:${Math.round((issuesByMonth[i]/maxVal)*84)}px"></div>
                <div class="bar-label">${m}</div>
              </div>`).join('')}
          </div>
        </div>

        <div class="table-card">
          <div class="table-card-header"><h3>Quick Actions</h3></div>
          <div class="quick-actions">
            <button class="quick-action-btn" onclick="navigate('issue')">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              Issue Book
            </button>
            <button class="quick-action-btn" onclick="navigate('issue')">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"/></svg>
              Return Book
            </button>
            <button class="quick-action-btn" onclick="openAddBook()">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
              Add Book
            </button>
            <button class="quick-action-btn" onclick="openAddMember()">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
              Add Member
            </button>
          </div>
        </div>
      </div>
    </div>`;
}

// ─── BOOKS ────────────────────────────────────────────────────────────────────
let booksFilter = { search:'', category:'all', status:'all', page:1 };

function renderBooks(el) {
  booksFilter = { search:'', category:'all', status:'all', page:1 };
  el.innerHTML = `
    <div class="page-header">
      <div><h1>Book Catalogue</h1><p>${DATA.books.length} titles · ${DATA.books.reduce((s,b)=>s+b.copies,0)} total copies</p></div>
      <button class="btn btn-primary" onclick="openAddBook()">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        Add Book
      </button>
    </div>
    <div class="table-card">
      <div class="table-card-header">
        <h3>All Books</h3>
        <div class="table-toolbar">
          <div class="search-box">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0"/></svg>
            <input type="text" placeholder="Search title, author, ISBN..." id="book-search" oninput="booksFilter.search=this.value;booksFilter.page=1;renderBooksTable()">
          </div>
          <select class="filter-select" onchange="booksFilter.category=this.value;booksFilter.page=1;renderBooksTable()">
            <option value="all">All Categories</option>
            ${[...new Set(DATA.books.map(b=>b.category))].map(c=>`<option>${c}</option>`).join('')}
          </select>
          <select class="filter-select" onchange="booksFilter.status=this.value;booksFilter.page=1;renderBooksTable()">
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="issued">Issued</option>
          </select>
        </div>
      </div>
      <div id="books-table-body"></div>
    </div>`;
  renderBooksTable();
}

function renderBooksTable() {
  const filtered = DATA.books.filter(b => {
    const q = booksFilter.search.toLowerCase();
    const matchQ = !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.isbn.includes(q);
    const matchCat = booksFilter.category === 'all' || b.category === booksFilter.category;
    const matchStatus = booksFilter.status === 'all' || b.status === booksFilter.status;
    return matchQ && matchCat && matchStatus;
  });

  const perPage = 8;
  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const p = Math.min(booksFilter.page, pages);
  const slice = filtered.slice((p-1)*perPage, p*perPage);

  const tbody = document.getElementById('books-table-body');
  if (!tbody) return;

  if (!slice.length) {
    tbody.innerHTML = `<div class="empty-state"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg><p>No books match your filters.</p></div>`;
    return;
  }

  tbody.innerHTML = `
    <table>
      <thead><tr><th>Book</th><th>ISBN</th><th>Language</th><th>Type</th><th>Category</th><th>Location</th><th>Copies</th><th>Available</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>
        ${slice.map(b => `
          <tr>
            <td>
              <div class="book-info">
                <div class="book-cover" style="background:${getBookColor(b.id)}">${initials(b.title)}</div>
                <div><div class="book-title">${b.title}</div><div class="book-author">${b.author} · ${b.year}</div></div>
              </div>
            </td>
            <td style="font-size:0.78rem;color:var(--text-muted)">${b.isbn || '—'}</td>
            <td><span class="language-badge">${b.language || 'Unknown'}</span></td>
            <td style="font-size:.78rem">${escapeHtml(b.bookType || 'Book')}</td>
            <td>${b.category}</td>
            <td><code style="background:var(--bg);padding:2px 6px;border-radius:4px;font-size:0.78rem">${b.location}</code></td>
            <td>${b.copies}</td>
            <td><strong style="color:${b.available>0?'var(--success)':'var(--danger)'}">${b.available}</strong></td>
            <td><span class="badge badge-${b.status}">${b.status}</span></td>
            <td>
              <div style="display:flex;gap:6px">
                <button class="btn btn-outline btn-sm" onclick="editBook('${b.id}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteBook('${b.id}')">Del</button>
              </div>
            </td>
          </tr>`).join('')}
      </tbody>
    </table>
    <div class="table-footer">
      <span>Showing ${(p-1)*perPage+1}–${Math.min(p*perPage,filtered.length)} of ${filtered.length}</span>
      <div class="pagination">
        ${Array.from({length:pages},(_,i)=>`<button class="page-btn${p===i+1?' active':''}" onclick="booksFilter.page=${i+1};renderBooksTable()">${i+1}</button>`).join('')}
      </div>
    </div>`;
}

// ─── AI BOOK SCAN / ONLINE METADATA LOOKUP ────────────────────────────────────
let bookScanState = { file:null, objectUrl:null, ocrText:'', metadata:null };

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  }[ch]));
}

function normalizeLanguage(value) {
  if (!value) return '';
  const raw = String(value).trim().toLowerCase();
  const v = raw.split('/').pop().trim();
  const map = {
    en:'English', eng:'English', english:'English',
    hi:'Hindi', hin:'Hindi', hindi:'Hindi',
    mr:'Marathi', mar:'Marathi', marathi:'Marathi',
    gu:'Gujarati', gujarati:'Gujarati',
    bn:'Bengali', ben:'Bengali', bengali:'Bengali',
    ta:'Tamil', tam:'Tamil', tamil:'Tamil',
    te:'Telugu', tel:'Telugu', telugu:'Telugu',
    kn:'Kannada', kan:'Kannada', kannada:'Kannada',
    ml:'Malayalam', mal:'Malayalam', malayalam:'Malayalam',
    pa:'Punjabi', pan:'Punjabi', punjabi:'Punjabi',
    ur:'Urdu', urdu:'Urdu',
    fr:'French', fra:'French', french:'French',
    de:'German', deu:'German', german:'German',
    es:'Spanish', spa:'Spanish', spanish:'Spanish',
    it:'Italian', ita:'Italian', italian:'Italian',
    pt:'Portuguese', por:'Portuguese', portuguese:'Portuguese',
    ru:'Russian', rus:'Russian', russian:'Russian'
  };
  return map[v] || String(value).replace(/\b\w/g, c => c.toUpperCase());
}

function inferLanguageFromText(text) {
  if (!text) return '';
  // These checks are only a fallback. Online catalogue language metadata is preferred.
  if (/[\u0B80-\u0BFF]/.test(text)) return 'Tamil';
  if (/[\u0C00-\u0C7F]/.test(text)) return 'Telugu';
  if (/[\u0C80-\u0CFF]/.test(text)) return 'Kannada';
  if (/[\u0D00-\u0D7F]/.test(text)) return 'Malayalam';
  if (/[\u0980-\u09FF]/.test(text)) return 'Bengali';
  if (/[\u0A80-\u0AFF]/.test(text)) return 'Gujarati';
  if (/[\u0A00-\u0A7F]/.test(text)) return 'Punjabi';
  if (/[\u0900-\u097F]/.test(text)) {
    // Marathi commonly contains these letters/words; otherwise keep Hindi as the
    // safest Devanagari fallback until catalogue metadata confirms the language.
    if (/[ळऱॲऑ]/.test(text) || /\b(आहे|आणि|महाराष्ट्र|मराठी|एक|ही|या|करा|पुस्तक)\b/.test(text)) return 'Marathi';
    return 'Hindi';
  }
  return '';
}

function extractISBN(text) {
  const clean = String(text || '').replace(/[^\dXx-]/g, ' ');
  const matches = clean.match(/\b(?:97[89][ -]?)?\d(?:[ -]?\d){9,12}[Xx]?\b/g) || [];
  for (const raw of matches) {
    const isbn = raw.replace(/[\s-]/g, '').toUpperCase();
    if (isbn.length === 10 || isbn.length === 13) return isbn;
  }
  return '';
}

function normalizeSearchText(text) {
  return String(text || '')
    .replace(/[|*_~`]/g, ' ')
    .replace(/[“”‘’]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizedTokens(text) {
  const stop = new Set(['the','a','an','of','and','to','in','on','for','with','by','from','book','edition','new','revised']);
  return [...new Set(normalizeSearchText(text).toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 2 && !stop.has(w)))];
}

function tokenSimilarity(a, b) {
  const A = normalizedTokens(a), B = normalizedTokens(b);
  if (!A.length || !B.length) return 0;
  const setB = new Set(B);
  const overlap = A.filter(x => setB.has(x)).length;
  return overlap / Math.max(1, Math.max(A.length, B.length));
}

function cleanAuthorNames(authors) {
  const arr = String(authors || '')
    .split(/[,;]|\s+&\s+/)
    .map(x => normalizeSearchText(x))
    .filter(Boolean);
  const seen = new Set();
  const unique = [];
  for (const a of arr) {
    const key = a.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
    if (!seen.has(key)) { seen.add(key); unique.push(a); }
  }
  return unique.join(', ');
}

function pickBestISBN(list, fallback='') {
  const ids = Array.isArray(list) ? list.map(x => String(x || '').replace(/[\s-]/g,'')).filter(Boolean) : [];
  return ids.find(x => /^97[89]\d{10}$/.test(x)) || ids.find(x => /^\d{9}[\dX]$/.test(x)) || fallback || '';
}

function mapBookType(meta) {
  const physical = String(meta?.physical_format || meta?.format || '').toLowerCase();
  const printType = String(meta?.printType || '').toLowerCase();
  if (/journal|magazine|periodical/.test(physical) || /magazine/.test(printType)) return 'Journal';
  if (/hardcover|hardback/.test(physical)) return 'Hardcover';
  if (/paperback|softcover/.test(physical)) return 'Paperback';
  if (/ebook|e-book|electronic/.test(physical)) return 'eBook';
  if (/audiobook|audio book/.test(physical)) return 'Audiobook';
  if (/report/.test(physical)) return 'Report';
  if (/thesis|dissertation/.test(physical)) return 'Thesis';
  return 'Book';
}

function likelyTitleCandidates(ocrText) {
  const lines = String(ocrText || '').split(/\n+/)
    .map(normalizeSearchText)
    .filter(x => x.length >= 3 && x.length <= 100)
    .filter(x => !/^(isbn|www\.|http|copyright|published|publisher|www|edition|printed|price|rs\.?|₹)/i.test(x));

  const scored = lines.map(line => {
    const words = normalizedTokens(line);
    let score = Math.min(words.length, 8) * 2;
    if (words.length >= 3 && words.length <= 12) score += 8;
    if (/^[A-Z0-9\s&:'’\-]+$/.test(line)) score += 5;
    if (/\b(how|why|what|who|when|where|guide|manual|introduction|principles|history|law|police|criminal|science|management|research)\b/i.test(line)) score += 4;
    if (/\b(carneg|gandhi|sharma|patil|author|by)\b/i.test(line)) score -= 2;
    return {line, score};
  }).sort((a,b) => b.score - a.score);

  const out = [];
  for (const x of scored) {
    if (!out.some(y => tokenSimilarity(x.line, y) > 0.85)) out.push(x.line);
    if (out.length >= 6) break;
  }
  return out;
}

function uniqueQueries(ocrText, isbn='') {
  const lines = String(ocrText || '').split(/\n+/).map(normalizeSearchText).filter(x => x.length >= 3);
  const candidates = [];
  if (isbn) candidates.push(`isbn ${isbn}`);
  candidates.push(...likelyTitleCandidates(ocrText));
  candidates.push(...lines.slice(0, 8));
  if (lines.length >= 2) candidates.push(lines.slice(0, 2).join(' '));
  if (lines.length >= 3) candidates.push(lines.slice(0, 3).join(' '));
  return [...new Set(candidates.map(normalizeSearchText).filter(x => x.length >= 3))].slice(0, 12);
}

function scoreBookResult(info, ocrText, queries=[], isbn='') {
  const title = normalizeSearchText(info.title);
  if (!title) return -Infinity;
  const normalizedISBN = String(isbn || '').replace(/[-\s]/g,'');
  const resultISBN = String(info.isbn || '').replace(/[-\s]/g,'');
  if (normalizedISBN && resultISBN === normalizedISBN) return 1000;

  const titleScores = queries.map(q => tokenSimilarity(title, q));
  const bestQueryScore = Math.max(0, ...titleScores);
  const ocrScore = tokenSimilarity(title, ocrText);
  const titleWords = normalizedTokens(title).length;
  let score = bestQueryScore * 70 + ocrScore * 45;
  if (titleWords >= 3 && bestQueryScore >= 0.65) score += 30 + Math.min(24, titleWords * 3);
  if (titleWords >= 5 && bestQueryScore >= 0.55) score += 18;
  if (info.author && tokenSimilarity(info.author, ocrText) > 0.35) score += 10;
  if (info.publisher) score += 2;
  if (info.year) score += 1;
  if (info.source === 'Google Books' && bestQueryScore >= 0.8) score += 4;
  return score;
}

function chooseBestBook(results, ocrText='', isbn='') {
  const queries = uniqueQueries(ocrText, isbn);
  const ranked = results.filter(r => r && r.title).map(r => ({
    ...r,
    _score: scoreBookResult(r, ocrText, queries, isbn)
  })).sort((a,b) => b._score - a._score);

  if (!ranked.length) return null;
  const exact = ranked.find(r => isbn && String(r.isbn || '').replace(/[-\s]/g,'') === String(isbn).replace(/[-\s]/g,''));
  if (exact) return exact;
  return ranked[0]._score >= 45 ? ranked[0] : null;
}

async function searchGoogleBooks(query, isbn='') {
  const q = isbn ? `isbn:${isbn}` : query;
  const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=20`);
  if (!res.ok) throw new Error('Google Books lookup failed');
  const data = await res.json();
  return (data.items || []).map(item => {
    const v = item.volumeInfo || {};
    const ids = v.industryIdentifiers || [];
    return {
      title:v.title || '',
      author:cleanAuthorNames((v.authors || []).join(', ')),
      isbn:pickBestISBN(ids.map(x => x.identifier), isbn),
      language:normalizeLanguage(v.language),
      category:(v.categories || [])[0] || 'Other',
      publisher:v.publisher || '',
      year:parseInt((v.publishedDate || '').slice(0,4)) || '',
      description:v.description || '',
      coverImage:(v.imageLinks?.thumbnail || v.imageLinks?.smallThumbnail || '').replace(/^http:/,'https:'),
      printType:v.printType || '',
      bookType:mapBookType({printType:v.printType}),
      pageCount:v.pageCount || '',
      source:'Google Books',
      sourceUrl:v.infoLink || '',
      volumeId:item.id || ''
    };
  });
}

async function searchOpenLibrary(query, isbn='') {
  const params = new URLSearchParams({limit:'20'});
  if (isbn) params.set('isbn', isbn);
  else params.set('q', query);
  const res = await fetch(`https://openlibrary.org/search.json?${params.toString()}`);
  if (!res.ok) throw new Error('Open Library lookup failed');
  const data = await res.json();
  return (data.docs || []).map(d => ({
    title:d.title || '',
    author:cleanAuthorNames((d.author_name || []).slice(0,5).join(', ')),
    isbn:pickBestISBN(d.isbn || [], isbn),
    language:normalizeLanguage((d.language || [])[0] || ''),
    category:(d.subject || [])[0] || 'Other',
    publisher:(d.publisher || [])[0] || '',
    year:d.first_publish_year || (d.publish_year || [])[0] || '',
    description:'',
    coverImage:d.cover_i ? `https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg` : '',
    editionKey:(d.edition_key || [])[0] || '',
    source:'Open Library',
    sourceUrl:d.key ? `https://openlibrary.org${d.key}` : ''
  }));
}

async function enrichOpenLibraryISBN(isbn) {
  if (!isbn) return {};
  try {
    const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${encodeURIComponent(isbn)}&jscmd=data&format=json`;
    const res = await fetch(url);
    if (!res.ok) return {};
    const data = await res.json();
    const d = data[`ISBN:${isbn}`];
    if (!d) return {};
    return {
      isbn:pickBestISBN([...(d.identifiers?.isbn_13 || []), ...(d.identifiers?.isbn_10 || []), isbn], isbn),
      language:normalizeLanguage((d.languages || [])[0]?.key?.split('/').pop() || ''),
      publisher:(d.publishers || [])[0]?.name || '',
      year:parseInt(String(d.publish_date || '').match(/\d{4}/)?.[0] || '',10) || '',
      bookType:mapBookType({physical_format:d.physical_format}),
      source:'Open Library',
      sourceUrl:d.url || '',
      pageCount:d.number_of_pages || ''
    };
  } catch (_) { return {}; }
}

function mergeMetadata(primary, fallback, ocrText='') {
  const merged = { ...(primary || {}) };
  const fb = fallback || {};
  ['title','author','isbn','language','category','publisher','year','description','coverImage','source','sourceUrl','pageCount','bookType']
    .forEach(k => { if (!merged[k] && fb[k]) merged[k] = fb[k]; });
  merged.language = normalizeLanguage(merged.language) || inferLanguageFromText(ocrText) || '';
  merged.bookType = merged.bookType || mapBookType(merged) || 'Book';
  return merged;
}

async function ensureTesseract() {
  if (window.Tesseract) return window.Tesseract;
  await new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
    script.onload = resolve;
    script.onerror = () => reject(new Error('Could not load OCR engine. Check internet access.'));
    document.head.appendChild(script);
  });
  return window.Tesseract;
}

async function recognizeBookImage(Tesseract, file, status) {
  // First pass: normal multilingual OCR.
  status.textContent = 'Reading the cover/title page…';
  const first = await Tesseract.recognize(file, 'eng+hin+mar', {
    logger: m => {
      if (m.status === 'recognizing text' && typeof m.progress === 'number')
        status.textContent = `Reading the book image… ${Math.round(m.progress * 100)}%`;
    }
  });
  let text = first.data.text || '';

  // A second pass can recover large cover titles that the first pass misses.
  // Keep it lightweight so ordinary scans don't become unnecessarily slow.
  if (text.trim().length < 12) {
    try {
      const second = await Tesseract.recognize(file, 'eng', { psm: 11 });
      if ((second.data.text || '').length > text.length) text = second.data.text;
    } catch (_) {}
  }
  return text;
}

async function scanBookImage(file) {
  const status = document.getElementById('book-ai-status');
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    toast('Please upload a JPG, PNG, WEBP or other image file.', 'error');
    return;
  }
  if (file.size > 12 * 1024 * 1024) {
    toast('Image is too large. Please use an image below 12 MB.', 'error');
    return;
  }

  bookScanState.file = file;
  if (bookScanState.objectUrl) URL.revokeObjectURL(bookScanState.objectUrl);
  bookScanState.objectUrl = URL.createObjectURL(file);

  const preview = document.getElementById('book-ai-preview');
  preview.innerHTML = `<img src="${bookScanState.objectUrl}" alt="Book preview">`;
  status.className = 'ai-scan-status working';

  try {
    const Tesseract = await ensureTesseract();
    bookScanState.ocrText = await recognizeBookImage(Tesseract, file, status);
    const isbn = extractISBN(bookScanState.ocrText);
    const queries = uniqueQueries(bookScanState.ocrText, isbn);

    if (!queries.length) {
      status.className = 'ai-scan-status error';
      status.textContent = 'I could not read enough text from this image. Try a clearer photo of the front cover, title page, or ISBN/barcode area.';
      return;
    }

    status.textContent = isbn
      ? `ISBN ${isbn} detected. Checking online catalogues…`
      : 'Searching online catalogues using several detected title/author clues…';

    // Search several OCR candidates and both catalogues, then rank all results.
    const jobs = [];
    if (isbn) {
      jobs.push(searchGoogleBooks('', isbn).catch(() => []));
      jobs.push(searchOpenLibrary('', isbn).catch(() => []));
    }
    const titleCandidates = likelyTitleCandidates(bookScanState.ocrText).slice(0, 4);
    for (const q of titleCandidates) {
      jobs.push(searchGoogleBooks(`intitle:${q}`).catch(() => []));
      jobs.push(searchOpenLibrary(q).catch(() => []));
    }
    for (const q of queries.slice(0, 6)) {
      if (/^isbn\s/i.test(q)) continue;
      jobs.push(searchGoogleBooks(q).catch(() => []));
      jobs.push(searchOpenLibrary(q).catch(() => []));
    }
    const batches = await Promise.all(jobs);
    const onlineResults = batches.flat();
    const best = chooseBestBook(onlineResults, bookScanState.ocrText, isbn);

    if (!best) {
      status.className = 'ai-scan-status error';
      status.textContent = 'I could read the image, but could not match it reliably to an online catalogue record. Try the front cover + title page or ISBN page, or enter the details manually.';
      return;
    }

    // Prefer a verified ISBN record when available. This fills edition-specific
    // publisher, language and physical format instead of guessing them.
    const verified = await enrichOpenLibraryISBN(best.isbn || isbn);
    const enriched = mergeMetadata(best, verified, bookScanState.ocrText);

    // If another result has a much better title match, use its author/publisher
    // instead of trusting an unrelated edition returned by a broad query.
    const ranked = onlineResults
      .filter(r => r && r.title)
      .map(r => ({r, score: scoreBookResult(r, bookScanState.ocrText, uniqueQueries(bookScanState.ocrText, isbn), isbn)}))
      .sort((a,b) => b.score - a.score);
    const titleWinner = ranked[0]?.r;
    if (titleWinner && tokenSimilarity(titleWinner.title, enriched.title) > 0.75) {
      enriched.author = enriched.author || titleWinner.author;
      enriched.publisher = enriched.publisher || titleWinner.publisher;
      enriched.language = enriched.language || titleWinner.language;
      enriched.category = enriched.category || titleWinner.category;
      enriched.year = enriched.year || titleWinner.year;
      enriched.isbn = enriched.isbn || titleWinner.isbn;
    }

    enriched.language = normalizeLanguage(enriched.language) || inferLanguageFromText(bookScanState.ocrText) || '';
    enriched.bookType = enriched.bookType || mapBookType(enriched);
    bookScanState.metadata = enriched;
    fillBookMetadata(enriched);
    status.className = 'ai-scan-status success';
    status.textContent = `Book identified: ${enriched.title}${enriched.author ? ` — ${enriched.author}` : ''}. Metadata found from ${enriched.source || 'online catalogue'}; please review all fields before saving.`;
    toast('Book information found. Review and save it.', 'success');
  } catch (err) {
    console.error(err);
    status.className = 'ai-scan-status error';
    status.textContent = `Automatic scan failed: ${err.message || 'Unknown error'}. You can enter the book manually.`;
    toast('Book scan could not be completed.', 'error');
  }
}

function fillBookMetadata(m) {
  const set = (id, value) => { const el = document.getElementById(id); if (el && value) el.value = value; };
  set('f-title', m.title);
  set('f-author', m.author);
  set('f-isbn', m.isbn);
  set('f-pub', m.publisher);
  set('f-year', m.year);
  set('f-language', m.language);
  set('f-type', m.bookType || 'Book');

  const cat = document.getElementById('f-cat');
  if (cat && m.category) {
    if (![...cat.options].some(o => o.value.toLowerCase() === m.category.toLowerCase())) {
      cat.add(new Option(m.category, m.category));
    }
    cat.value = m.category;
  }

  const source = document.getElementById('book-ai-source');
  if (source) source.innerHTML = m.source
    ? `<span class="ai-source-dot"></span> Metadata source: <strong>${escapeHtml(m.source)}</strong>${m.isbn ? ` · ISBN: ${escapeHtml(m.isbn)}` : ''}${m.bookType ? ` · Format: ${escapeHtml(m.bookType)}` : ''}`
    : '';
}

function resetBookScanState() {
  if (bookScanState.objectUrl) URL.revokeObjectURL(bookScanState.objectUrl);
  bookScanState = { file:null, objectUrl:null, ocrText:'', metadata:null };
}

function openAddBook() {
  resetBookScanState();
  openModal('Add New Book', `
    <div class="ai-book-scanner">
      <div class="ai-scanner-header">
        <div>
          <div class="ai-scanner-title">AI Book Scanner</div>
          <div class="ai-scanner-subtitle">Upload a clear cover, title page, or ISBN/barcode photo. The scanner reads the image, matches the book against online catalogues, verifies edition metadata where possible, and fills the form for review.</div>
        </div>
        <span class="ai-badge">AI ASSISTED</span>
      </div>
      <div class="ai-scanner-grid">
        <label class="ai-upload-zone" for="book-image-input">
          <input id="book-image-input" type="file" accept="image/*" style="display:none"
                 onchange="scanBookImage(this.files[0])">
          <div id="book-ai-preview" class="book-ai-preview">
            <div class="upload-icon">↑</div>
            <strong>Upload book image</strong>
            <span>Cover, title page or ISBN page</span>
          </div>
        </label>
        <div>
          <div id="book-ai-status" class="ai-scan-status">Waiting for an image…</div>
          <div id="book-ai-source" class="ai-source"></div>
          <div class="ai-help">Tip: For Indian-language books, a straight, well-lit cover/title-page photo works best. If available, include the ISBN/barcode page for edition-accurate publisher and format data.</div>
        </div>
      </div>
    </div>

    <div class="form-section-title">Book Information</div>
    <div class="form-grid">
      <div class="form-group full"><label>Title *</label><input id="f-title" placeholder="Book title"></div>
      <div class="form-group"><label>Author *</label><input id="f-author" placeholder="Author name"></div>
      <div class="form-group"><label>ISBN</label><input id="f-isbn" placeholder="978-xx-xxxx-xxx-x"></div>
      <div class="form-group"><label>Language</label>
        <select id="f-language">
          <option value="">Unknown / Not specified</option>
          <option>English</option><option>Hindi</option><option>Marathi</option>
          <option>Gujarati</option><option>Bengali</option><option>Tamil</option>
          <option>Telugu</option><option>Kannada</option><option>Malayalam</option>
          <option>Punjabi</option><option>Urdu</option><option>Other</option>
        </select>
      </div>
      <div class="form-group"><label>Book Type / Format</label>
        <select id="f-type">
          <option>Book</option><option>Paperback</option><option>Hardcover</option><option>eBook</option><option>Audiobook</option><option>Reference Book</option><option>Manual</option>
          <option>Report</option><option>Journal</option><option>Thesis</option><option>Other</option>
        </select>
      </div>
      <div class="form-group"><label>Category</label>
        <select id="f-cat">
          ${[...new Set(DATA.books.map(b=>b.category)),'Other'].map(c=>`<option>${escapeHtml(c)}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label>Publisher</label><input id="f-pub" placeholder="Publisher name"></div>
      <div class="form-group"><label>Year</label><input id="f-year" type="number" placeholder="2024" min="1500" max="2099"></div>
      <div class="form-group"><label>Copies</label><input id="f-copies" type="number" placeholder="1" min="1" value="1"></div>
      <div class="form-group"><label>Location</label><input id="f-loc" placeholder="e.g. A-101"></div>
    </div>`, () => {
    const title = document.getElementById('f-title').value.trim();
    const author = document.getElementById('f-author').value.trim();
    if (!title || !author) { toast('Title and Author are required.','error'); return false; }

    const copies = parseInt(document.getElementById('f-copies').value) || 1;
    const newId = 'B' + String(DATA.books.length + 1).padStart(3,'0');
    DATA.books.push({
      id: newId,
      title, author,
      isbn: document.getElementById('f-isbn').value || '—',
      language: document.getElementById('f-language').value || 'Unknown',
      bookType: document.getElementById('f-type').value || 'Book',
      category: document.getElementById('f-cat').value,
      publisher: document.getElementById('f-pub').value || '—',
      year: parseInt(document.getElementById('f-year').value) || new Date().getFullYear(),
      copies, available: copies,
      location: document.getElementById('f-loc').value || 'TBD',
      status: 'available',
      metadataSource: bookScanState.metadata?.source || 'Manual'
    });
    toast(`"${title}" added to catalogue.`);
    navigate('books');
    resetBookScanState();
  });
}

function editBook(id) {
  const b = DATA.books.find(x => x.id === id);
  if (!b) return;
  openModal(`Edit: ${b.title}`, `
    <div class="form-grid">
      <div class="form-group full"><label>Title</label><input id="f-title" value="${escapeHtml(b.title)}"></div>
      <div class="form-group"><label>Author</label><input id="f-author" value="${escapeHtml(b.author)}"></div>
      <div class="form-group"><label>ISBN</label><input id="f-isbn" value="${escapeHtml(b.isbn || '')}"></div>
      <div class="form-group"><label>Language</label>
        <select id="f-language">
          ${['','English','Hindi','Marathi','Gujarati','Bengali','Tamil','Telugu','Kannada','Malayalam','Punjabi','Urdu','Other']
            .map(x=>`<option value="${escapeHtml(x)}"${(x === (b.language||''))?' selected':''}>${x || 'Unknown / Not specified'}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label>Book Type / Format</label>
        <select id="f-type">
          ${['Book','Paperback','Hardcover','eBook','Audiobook','Reference Book','Manual','Report','Journal','Thesis','Other']
            .map(x=>`<option${x === (b.bookType||'Book')?' selected':''}>${x}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label>Category</label>
        <select id="f-cat">${[...new Set(DATA.books.map(x=>x.category)),'Other'].map(c=>`<option${c===b.category?' selected':''}>${escapeHtml(c)}</option>`).join('')}</select>
      </div>
      <div class="form-group"><label>Publisher</label><input id="f-pub" value="${escapeHtml(b.publisher || '')}"></div>
      <div class="form-group"><label>Year</label><input id="f-year" type="number" value="${b.year || ''}"></div>
      <div class="form-group"><label>Total Copies</label><input id="f-copies" type="number" value="${b.copies}" min="1"></div>
      <div class="form-group"><label>Location</label><input id="f-loc" value="${escapeHtml(b.location || '')}"></div>
    </div>`, () => {
    const newCopies = parseInt(document.getElementById('f-copies').value) || b.copies;
    const diff = newCopies - b.copies;
    b.title = document.getElementById('f-title').value.trim() || b.title;
    b.author = document.getElementById('f-author').value.trim() || b.author;
    b.isbn = document.getElementById('f-isbn').value || b.isbn;
    b.language = document.getElementById('f-language').value || 'Unknown';
    b.bookType = document.getElementById('f-type').value || 'Book';
    b.category = document.getElementById('f-cat').value;
    b.publisher = document.getElementById('f-pub').value || b.publisher;
    b.year = parseInt(document.getElementById('f-year').value) || b.year;
    b.copies = newCopies;
    b.available = Math.max(0, b.available + diff);
    b.location = document.getElementById('f-loc').value || b.location;
    b.status = b.available > 0 ? 'available' : 'issued';
    toast(`"${b.title}" updated.`);
    navigate('books');
  });
}

function deleteBook(id) {
  const b = DATA.books.find(x => x.id === id);
  if (!b) return;
  if (!confirm(`Delete "${b.title}"? This cannot be undone.`)) return;
  DATA.books = DATA.books.filter(x => x.id !== id);
  toast(`"${b.title}" removed from catalogue.`, 'warning');
  navigate('books');
}

// ─── MEMBERS ──────────────────────────────────────────────────────────────────
let membersFilter = { search:'', status:'all', page:1 };

function renderMembers(el) {
  membersFilter = { search:'', status:'all', page:1 };
  el.innerHTML = `
    <div class="page-header">
      <div><h1>Members</h1><p>${DATA.members.length} registered · ${DATA.members.filter(m=>m.status==='active').length} active</p></div>
      <button class="btn btn-primary" onclick="openAddMember()">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
        Add Member
      </button>
    </div>
    <div class="table-card">
      <div class="table-card-header">
        <h3>Member Registry</h3>
        <div class="table-toolbar">
          <div class="search-box">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0"/></svg>
            <input placeholder="Search name, email, ID..." oninput="membersFilter.search=this.value;membersFilter.page=1;renderMembersTable()">
          </div>
          <select class="filter-select" onchange="membersFilter.status=this.value;membersFilter.page=1;renderMembersTable()">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      <div id="members-table-body"></div>
    </div>`;
  renderMembersTable();
}

function renderMembersTable() {
  const filtered = DATA.members.filter(m => {
    const q = membersFilter.search.toLowerCase();
    const matchQ = !q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.id.toLowerCase().includes(q);
    const matchS = membersFilter.status === 'all' || m.status === membersFilter.status;
    return matchQ && matchS;
  });

  const perPage = 8;
  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const p = Math.min(membersFilter.page, pages);
  const slice = filtered.slice((p-1)*perPage, p*perPage);
  const tbody = document.getElementById('members-table-body');
  if (!tbody) return;

  tbody.innerHTML = `
    <table>
      <thead><tr><th>Member</th><th>ID</th><th>Rank / Dept</th><th>Contact</th><th>Joined</th><th>Books Issued</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>
        ${slice.map(m => `
          <tr>
            <td>
              <div style="display:flex;align-items:center;gap:10px">
                <div style="width:34px;height:34px;background:var(--navy);border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--gold-light);font-weight:700;font-size:0.8rem;flex-shrink:0">${initials(m.name)}</div>
                <div><div style="font-weight:600;color:var(--navy)">${m.name}</div><div style="font-size:0.78rem;color:var(--text-muted)">${m.email}</div></div>
              </div>
            </td>
            <td><code style="background:var(--bg);padding:2px 6px;border-radius:4px;font-size:0.78rem">${m.id}</code></td>
            <td>${m.rank}<br><span style="font-size:0.75rem;color:var(--text-muted)">${m.department}</span></td>
            <td style="font-size:0.83rem">${m.phone}</td>
            <td style="font-size:0.83rem">${formatDate(m.joined)}</td>
            <td><strong style="color:${m.issued>0?'var(--navy)':'var(--text-muted)'}">${m.issued}</strong> / ${DATA.settings.maxBooksPerMember}</td>
            <td><span class="badge badge-${m.status}">${m.status}</span></td>
            <td>
              <div style="display:flex;gap:6px">
                <button class="btn btn-outline btn-sm" onclick="editMember('${m.id}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteMember('${m.id}')">Del</button>
              </div>
            </td>
          </tr>`).join('')}
      </tbody>
    </table>
    <div class="table-footer">
      <span>Showing ${(p-1)*perPage+1}–${Math.min(p*perPage,filtered.length)} of ${filtered.length}</span>
      <div class="pagination">
        ${Array.from({length:pages},(_,i)=>`<button class="page-btn${p===i+1?' active':''}" onclick="membersFilter.page=${i+1};renderMembersTable()">${i+1}</button>`).join('')}
      </div>
    </div>`;
}

function openAddMember() {
  openModal('Add New Member', `
    <div class="form-grid">
      <div class="form-group"><label>Full Name *</label><input id="f-name" placeholder="Full name"></div>
      <div class="form-group"><label>Email *</label><input id="f-email" type="email" placeholder="email@cprindia.org"></div>
      <div class="form-group"><label>Phone</label><input id="f-phone" placeholder="10-digit number"></div>
      <div class="form-group"><label>Rank / Designation</label><input id="f-rank" placeholder="e.g. IPS - SP, Researcher"></div>
      <div class="form-group"><label>Department</label>
        <select id="f-dept">
          <option>Training</option><option>Research</option><option>Administration</option>
          <option>Criminology</option><option>Forensics</option><option>Library</option><option>Other</option>
        </select>
      </div>
      <div class="form-group"><label>Status</label>
        <select id="f-status"><option value="active">Active</option><option value="inactive">Inactive</option></select>
      </div>
    </div>`, () => {
    const name = document.getElementById('f-name').value.trim();
    const email = document.getElementById('f-email').value.trim();
    if (!name || !email) { toast('Name and email are required.','error'); return false; }
    const newId = 'M' + String(DATA.members.length + 1).padStart(3,'0');
    DATA.members.push({
      id: newId, name, email,
      phone: document.getElementById('f-phone').value || '—',
      rank: document.getElementById('f-rank').value || 'Staff',
      department: document.getElementById('f-dept').value,
      joined: today(),
      status: document.getElementById('f-status').value,
      issued: 0
    });
    toast(`Member "${name}" registered.`);
    navigate('members');
  });
}

function editMember(id) {
  const m = DATA.members.find(x => x.id === id);
  if (!m) return;
  const depts = ['Training','Research','Administration','Criminology','Forensics','Library','Other'];
  openModal(`Edit: ${m.name}`, `
    <div class="form-grid">
      <div class="form-group"><label>Full Name</label><input id="f-name" value="${m.name}"></div>
      <div class="form-group"><label>Email</label><input id="f-email" value="${m.email}"></div>
      <div class="form-group"><label>Phone</label><input id="f-phone" value="${m.phone}"></div>
      <div class="form-group"><label>Rank</label><input id="f-rank" value="${m.rank}"></div>
      <div class="form-group"><label>Department</label>
        <select id="f-dept">${depts.map(d=>`<option${d===m.department?' selected':''}>${d}</option>`).join('')}</select>
      </div>
      <div class="form-group"><label>Status</label>
        <select id="f-status"><option value="active"${m.status==='active'?' selected':''}>Active</option><option value="inactive"${m.status==='inactive'?' selected':''}>Inactive</option></select>
      </div>
    </div>`, () => {
    m.name = document.getElementById('f-name').value || m.name;
    m.email = document.getElementById('f-email').value || m.email;
    m.phone = document.getElementById('f-phone').value || m.phone;
    m.rank = document.getElementById('f-rank').value || m.rank;
    m.department = document.getElementById('f-dept').value;
    m.status = document.getElementById('f-status').value;
    toast(`"${m.name}" updated.`);
    navigate('members');
  });
}

function deleteMember(id) {
  const m = DATA.members.find(x => x.id === id);
  if (!m) return;
  if (m.issued > 0) { toast('Cannot delete: member has books issued.','error'); return; }
  if (!confirm(`Remove member "${m.name}"?`)) return;
  DATA.members = DATA.members.filter(x => x.id !== id);
  toast(`"${m.name}" removed.`,'warning');
  navigate('members');
}

// ─── ISSUE & RETURN ───────────────────────────────────────────────────────────
function renderIssueReturn(el) {
  const activeMembers = DATA.members.filter(m => m.status === 'active');
  const availableBooks = DATA.books.filter(b => b.available > 0);
  const issuedTxns = DATA.transactions.filter(t => t.status === 'issued' || t.status === 'overdue');

  el.innerHTML = `
    <div class="page-header">
      <div><h1>Issue & Return</h1><p>Manage book lending and returns</p></div>
    </div>
    <div class="ir-grid">
      <div class="card">
        <div class="card-header">
          <div class="card-header-icon blue">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          </div>
          <h3>Issue a Book</h3>
        </div>
        <div class="card-body">
          <div class="form-grid one-col">
            <div class="form-group">
              <label>Select Member</label>
              <select id="issue-member">
                <option value="">-- Select member --</option>
                ${activeMembers.map(m => `<option value="${m.id}">${m.name} (${m.id}) — ${m.rank}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label>Select Book</label>
              <select id="issue-book">
                <option value="">-- Select book --</option>
                ${availableBooks.map(b => `<option value="${b.id}">${b.title} (Avail: ${b.available})</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label>Issue Date</label>
              <input type="date" id="issue-date" value="${today()}">
            </div>
            <div class="form-group">
              <label>Due Date</label>
              <input type="date" id="issue-due" value="${dueDate()}">
            </div>
          </div>
          <button class="btn btn-primary" style="margin-top:16px;width:100%" onclick="issueBook()">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width:16px;height:16px"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Confirm Issue
          </button>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-header-icon green">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"/></svg>
          </div>
          <h3>Return a Book</h3>
        </div>
        <div class="card-body">
          <div class="form-group" style="margin-bottom:16px">
            <label>Select Transaction to Return</label>
            <select id="return-txn">
              <option value="">-- Select issued book --</option>
              ${issuedTxns.map(t => `<option value="${t.id}">${t.bookTitle} → ${t.memberName}${t.status==='overdue'?' ⚠ OVERDUE':''}</option>`).join('')}
            </select>
          </div>
          <div id="return-info" style="background:var(--bg);border-radius:8px;padding:14px;font-size:0.85rem;color:var(--text-muted);margin-bottom:16px">
            Select a transaction to see details.
          </div>
          <button class="btn btn-gold" style="width:100%" onclick="returnBook()">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width:16px;height:16px"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"/></svg>
            Confirm Return
          </button>
        </div>
      </div>
    </div>

    <div class="table-card" style="margin-top:20px">
      <div class="table-card-header">
        <h3>Currently Issued Books</h3>
        <span style="font-size:0.82rem;color:var(--text-muted)">${issuedTxns.length} active</span>
      </div>
      <table>
        <thead><tr><th>Book</th><th>Member</th><th>Issue Date</th><th>Due Date</th><th>Status</th><th>Fine</th></tr></thead>
        <tbody>
          ${issuedTxns.length ? issuedTxns.map(t => `
            <tr>
              <td style="font-weight:600;color:var(--navy)">${t.bookTitle}</td>
              <td>${t.memberName}</td>
              <td>${formatDate(t.issueDate)}</td>
              <td>${formatDate(t.dueDate)}</td>
              <td><span class="badge badge-${t.status}">${t.status}</span></td>
              <td style="color:${t.fine>0?'var(--danger)':'var(--text-muted)'}">₹${t.fine}</td>
            </tr>`).join('') : `<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:24px">No books currently issued.</td></tr>`}
        </tbody>
      </table>
    </div>`;

  document.getElementById('return-txn').addEventListener('change', function() {
    const t = DATA.transactions.find(x => x.id === this.value);
    const info = document.getElementById('return-info');
    if (!t) { info.textContent = 'Select a transaction to see details.'; return; }
    const fine = t.status === 'overdue' ? t.fine : 0;
    info.innerHTML = `
      <strong style="color:var(--navy)">${t.bookTitle}</strong><br>
      Issued to: ${t.memberName}<br>
      Due: ${formatDate(t.dueDate)}<br>
      ${fine > 0 ? `<span style="color:var(--danger);font-weight:600">Fine: ₹${fine}</span>` : '<span style="color:var(--success)">No fine</span>'}`;
  });
}

function issueBook() {
  const memberId = document.getElementById('issue-member').value;
  const bookId = document.getElementById('issue-book').value;
  const issueDate = document.getElementById('issue-date').value;
  const dueD = document.getElementById('issue-due').value;

  if (!memberId || !bookId) { toast('Please select member and book.','error'); return; }

  const member = DATA.members.find(m => m.id === memberId);
  const book = DATA.books.find(b => b.id === bookId);

  if (member.issued >= DATA.settings.maxBooksPerMember) {
    toast(`${member.name} has reached the maximum limit of ${DATA.settings.maxBooksPerMember} books.`,'error');
    return;
  }

  const newId = 'T' + String(DATA.transactions.length + 1).padStart(3,'0');
  DATA.transactions.push({
    id: newId, bookId, bookTitle: book.title,
    memberId, memberName: member.name,
    issueDate, dueDate: dueD, returnDate: null,
    status: 'issued', fine: 0
  });

  book.available--;
  if (book.available === 0) book.status = 'issued';
  member.issued++;

  toast(`"${book.title}" issued to ${member.name}.`);
  navigate('issue');
}

function returnBook() {
  const txnId = document.getElementById('return-txn').value;
  if (!txnId) { toast('Please select a transaction.','error'); return; }

  const txn = DATA.transactions.find(t => t.id === txnId);
  const book = DATA.books.find(b => b.id === txn.bookId);
  const member = DATA.members.find(m => m.id === txn.memberId);

  txn.returnDate = today();
  txn.status = 'returned';
  book.available++;
  book.status = 'available';
  member.issued = Math.max(0, member.issued - 1);

  toast(`"${book.title}" returned by ${member.name}.`);
  navigate('issue');
}

// ─── TRANSACTIONS ─────────────────────────────────────────────────────────────
function renderTransactions(el) {
  el.innerHTML = `
    <div class="page-header">
      <div><h1>Transactions</h1><p>Complete lending history</p></div>
    </div>
    <div class="table-card">
      <div class="table-card-header">
        <h3>All Transactions</h3>
        <div class="table-toolbar">
          <div class="search-box">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0"/></svg>
            <input placeholder="Search book, member..." id="txn-search" oninput="filterTransactions()">
          </div>
          <select class="filter-select" id="txn-status" onchange="filterTransactions()">
            <option value="all">All Status</option>
            <option value="issued">Issued</option>
            <option value="returned">Returned</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>
      <div id="txn-body"></div>
    </div>`;
  filterTransactions();
}

function filterTransactions() {
  const q = (document.getElementById('txn-search')?.value || '').toLowerCase();
  const s = document.getElementById('txn-status')?.value || 'all';
  const filtered = DATA.transactions.filter(t => {
    const matchQ = !q || t.bookTitle.toLowerCase().includes(q) || t.memberName.toLowerCase().includes(q);
    const matchS = s === 'all' || t.status === s;
    return matchQ && matchS;
  });

  document.getElementById('txn-body').innerHTML = `
    <table>
      <thead><tr><th>Txn ID</th><th>Book</th><th>Member</th><th>Issue Date</th><th>Due Date</th><th>Return Date</th><th>Status</th><th>Fine</th></tr></thead>
      <tbody>
        ${filtered.length ? filtered.map(t => `
          <tr>
            <td><code style="background:var(--bg);padding:2px 6px;border-radius:4px;font-size:0.78rem">${t.id}</code></td>
            <td style="font-weight:600;color:var(--navy);max-width:180px">${t.bookTitle}</td>
            <td>${t.memberName}</td>
            <td>${formatDate(t.issueDate)}</td>
            <td>${formatDate(t.dueDate)}</td>
            <td>${formatDate(t.returnDate)}</td>
            <td><span class="badge badge-${t.status}">${t.status}</span></td>
            <td style="color:${t.fine>0?'var(--danger)':'inherit'}">₹${t.fine}</td>
          </tr>`).join('') : `<tr><td colspan="8" style="text-align:center;color:var(--text-muted);padding:24px">No transactions found.</td></tr>`}
      </tbody>
    </table>
    <div class="table-footer">
      <span>${filtered.length} transaction${filtered.length!==1?'s':''} found</span>
    </div>`;
}

// ─── REPORTS ──────────────────────────────────────────────────────────────────
function renderReports(el) {
  const totalFine = DATA.transactions.reduce((s,t) => s + (t.fine||0), 0);
  el.innerHTML = `
    <div class="page-header">
      <div><h1>Reports</h1><p>Library analytics and statistics</p></div>
      <button class="btn btn-outline" onclick="window.print()">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
        Print Report
      </button>
    </div>

    <div class="reports-grid">
      ${[
        { icon:`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>`, title:'Book Inventory', desc:`${DATA.books.length} titles, ${DATA.books.reduce((s,b)=>s+b.copies,0)} copies, ${DATA.books.reduce((s,b)=>s+b.available,0)} available` },
        { icon:`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>`, title:'Member Summary', desc:`${DATA.members.filter(m=>m.status==='active').length} active of ${DATA.members.length} total members` },
        { icon:`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>`, title:'Transaction Log', desc:`${DATA.transactions.length} total, ${DATA.transactions.filter(t=>t.status==='issued').length} active` },
        { icon:`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>`, title:'Overdue Report', desc:`${DATA.transactions.filter(t=>t.status==='overdue').length} overdue, ₹${totalFine} total fines pending` },
        { icon:`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>`, title:'Category Analysis', desc:`${[...new Set(DATA.books.map(b=>b.category))].length} categories across the collection` },
        { icon:`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>`, title:'Usage Statistics', desc:'Monthly trends and lending patterns over time' },
      ].map(r => `
        <div class="report-card">
          <div class="report-card-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">${r.icon}</svg>
          </div>
          <h4>${r.title}</h4>
          <p>${r.desc}</p>
        </div>`).join('')}
    </div>

    <div class="table-card">
      <div class="table-card-header"><h3>Category Breakdown</h3></div>
      <table>
        <thead><tr><th>Category</th><th>Titles</th><th>Total Copies</th><th>Available</th><th>Utilization</th></tr></thead>
        <tbody>
          ${[...new Set(DATA.books.map(b=>b.category))].map(cat => {
            const catBooks = DATA.books.filter(b => b.category === cat);
            const totalCopies = catBooks.reduce((s,b)=>s+b.copies,0);
            const available = catBooks.reduce((s,b)=>s+b.available,0);
            const util = Math.round(((totalCopies-available)/totalCopies)*100) || 0;
            return `<tr>
              <td style="font-weight:600">${cat}</td>
              <td>${catBooks.length}</td>
              <td>${totalCopies}</td>
              <td>${available}</td>
              <td>
                <div style="display:flex;align-items:center;gap:8px">
                  <div style="flex:1;background:var(--bg);border-radius:4px;height:6px;overflow:hidden">
                    <div style="width:${util}%;background:var(--navy);height:100%;border-radius:4px"></div>
                  </div>
                  <span style="font-size:0.78rem;color:var(--text-muted);width:32px">${util}%</span>
                </div>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>`;
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
function renderSettings(el) {
  el.innerHTML = `
    <div class="page-header">
      <div><h1>Settings</h1><p>Library configuration & preferences</p></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
      <div class="card">
        <div class="card-header"><h3>Lending Rules</h3></div>
        <div class="card-body">
          <div class="form-grid one-col">
            <div class="form-group">
              <label>Loan Duration (days)</label>
              <input type="number" id="s-days" value="${DATA.settings.loanDays}" min="1" max="60">
            </div>
            <div class="form-group">
              <label>Fine per Day (₹)</label>
              <input type="number" id="s-fine" value="${DATA.settings.finePerDay}" min="0">
            </div>
            <div class="form-group">
              <label>Max Books per Member</label>
              <input type="number" id="s-max" value="${DATA.settings.maxBooksPerMember}" min="1" max="10">
            </div>
            <button class="btn btn-primary" onclick="saveSettings()">Save Lending Rules</button>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><h3>Library Information</h3></div>
        <div class="card-body">
          <div class="form-grid one-col">
            <div class="form-group">
              <label>Library Name</label>
              <input id="s-name" value="${DATA.settings.libraryName}">
            </div>
            <div class="form-group">
              <label>Tagline</label>
              <input id="s-sub" value="${DATA.settings.librarySubtitle}">
            </div>
            <div class="form-group">
              <label>Address</label>
              <textarea id="s-addr">${DATA.settings.address}</textarea>
            </div>
            <button class="btn btn-primary" onclick="saveLibraryInfo()">Save Library Info</button>
          </div>
        </div>
      </div>
    </div>`;
}

function saveSettings() {
  DATA.settings.loanDays = parseInt(document.getElementById('s-days').value) || 14;
  DATA.settings.finePerDay = parseInt(document.getElementById('s-fine').value) || 5;
  DATA.settings.maxBooksPerMember = parseInt(document.getElementById('s-max').value) || 3;
  toast('Lending rules saved.');
}

function saveLibraryInfo() {
  DATA.settings.libraryName = document.getElementById('s-name').value || DATA.settings.libraryName;
  DATA.settings.librarySubtitle = document.getElementById('s-sub').value || DATA.settings.librarySubtitle;
  DATA.settings.address = document.getElementById('s-addr').value || DATA.settings.address;
  toast('Library info saved.');
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // date
  const d = new Date();
  document.getElementById('topbar-date').textContent =
    d.toLocaleDateString('en-IN', { weekday:'short', day:'2-digit', month:'short', year:'numeric' });

  navigate('dashboard');
});
