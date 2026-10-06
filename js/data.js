// ─── MOCK DATA ───────────────────────────────────────────────────────────────
const LOGO_B64 = window.LOGO_B64 || '';

const BOOK_COLORS = [
  '#1B2A6B','#2E4090','#7C3AED','#065F46','#92400E',
  '#B91C1C','#0369A1','#047857','#6D28D9','#1E40AF'
];

let DATA = {
  books: [
    { id:'B001', title:'Criminal Law & Procedure', author:'R.V. Kelkar', isbn:'978-0-19-845678-2', language:'English', bookType:'Book', category:'Law', publisher:'Eastern Book', year:2019, copies:5, available:3, location:'A-101', status:'available' },
    { id:'B002', title:'Indian Police Act Commentary', author:'M.L. Singhal', isbn:'978-0-19-965432-1', language:'English', bookType:'Book', category:'Police Science', publisher:'Universal Law', year:2020, copies:3, available:0, location:'A-102', status:'issued' },
    { id:'B003', title:'Forensic Science & Criminalistics', author:'Richard Saferstein', isbn:'978-0-13-404228-5', language:'English', bookType:'Book', category:'Forensics', publisher:'Pearson', year:2018, copies:4, available:2, location:'B-201', status:'available' },
    { id:'B004', title:'Criminology & Penology', author:'N.V. Paranjape', isbn:'978-93-5038-415-6', language:'English', bookType:'Book', category:'Criminology', publisher:'Central Law', year:2021, copies:6, available:6, location:'B-202', status:'available' },
    { id:'B005', title:'Police Administration', author:'O.P. Sharma', isbn:'978-81-7188-765-3', language:'English', bookType:'Book', category:'Police Science', publisher:'APH Publishing', year:2017, copies:2, available:1, location:'A-103', status:'available' },
    { id:'B006', title:'Constitution of India', author:'D.D. Basu', isbn:'978-81-8012-679-4', language:'English', bookType:'Book', category:'Law', publisher:'LexisNexis', year:2022, copies:8, available:5, location:'C-301', status:'available' },
    { id:'B007', title:'Cyber Crime & Investigation', author:'Prashant Mali', isbn:'978-81-940123-4-5', language:'English', bookType:'Book', category:'Cyber Crime', publisher:'Snow White', year:2020, copies:3, available:0, location:'D-401', status:'issued' },
    { id:'B008', title:'Traffic Management Manual', author:'Bureau of Police Research', isbn:'978-81-901234-5-6', language:'English', bookType:'Book', category:'Traffic', publisher:'BPR&D', year:2019, copies:5, available:4, location:'E-501', status:'available' },
    { id:'B009', title:'Human Rights & Police', author:'N.S. Saksena', isbn:'978-81-7188-423-2', language:'English', bookType:'Book', category:'Human Rights', publisher:'APH Publishing', year:2018, copies:3, available:3, location:'C-302', status:'available' },
    { id:'B010', title:'Investigation of Crimes', author:'P.M. Bakshi', isbn:'978-81-8012-001-3', language:'English', bookType:'Book', category:'Law', publisher:'Eastern Book', year:2021, copies:4, available:2, location:'A-104', status:'available' },
    { id:'B011', title:'Narcotics Control Bureau Manual', author:'NCB India', isbn:'978-81-901234-6-7', language:'English', bookType:'Book', category:'Narcotics', publisher:'Govt. of India', year:2020, copies:2, available:2, location:'D-402', status:'available' },
    { id:'B012', title:'Terrorism & Counter-Terrorism', author:'Rohan Gunaratna', isbn:'978-0-7658-0325-7', language:'English', bookType:'Book', category:'Security', publisher:'Transaction', year:2016, copies:3, available:1, location:'E-502', status:'available' },
  ],

  members: [
    { id:'M001', name:'Suresh Patil', email:'s.patil@cprindia.org', phone:'9876543210', rank:'IPS - DIG', department:'Training', joined:'2023-01-15', status:'active', issued:2 },
    { id:'M002', name:'Priya Sharma', email:'p.sharma@cprindia.org', phone:'9865432109', rank:'PI', department:'Research', joined:'2023-03-22', status:'active', issued:1 },
    { id:'M003', name:'Amit Deshmukh', email:'a.deshmukh@cprindia.org', phone:'9854321098', rank:'PSI', department:'Administration', joined:'2023-06-10', status:'active', issued:0 },
    { id:'M004', name:'Kavita Joshi', email:'k.joshi@cprindia.org', phone:'9843210987', rank:'Researcher', department:'Criminology', joined:'2022-11-05', status:'active', issued:3 },
    { id:'M005', name:'Rajesh Kulkarni', email:'r.kulkarni@cprindia.org', phone:'9832109876', rank:'API', department:'Forensics', joined:'2023-02-28', status:'active', issued:1 },
    { id:'M006', name:'Meena Gaikwad', email:'m.gaikwad@cprindia.org', phone:'9821098765', rank:'Researcher', department:'Research', joined:'2022-09-14', status:'inactive', issued:0 },
    { id:'M007', name:'Vikram Shinde', email:'v.shinde@cprindia.org', phone:'9810987654', rank:'IPS - SP', department:'Training', joined:'2023-07-20', status:'active', issued:2 },
    { id:'M008', name:'Sunita Pawar', email:'s.pawar@cprindia.org', phone:'9809876543', rank:'HC', department:'Library', joined:'2022-05-30', status:'active', issued:0 },
  ],

  transactions: [
    { id:'T001', bookId:'B002', bookTitle:'Indian Police Act Commentary', memberId:'M001', memberName:'Suresh Patil', issueDate:'2024-01-10', dueDate:'2024-01-24', returnDate:null, status:'issued', fine:0 },
    { id:'T002', bookId:'B007', bookTitle:'Cyber Crime & Investigation', memberId:'M004', memberName:'Kavita Joshi', issueDate:'2024-01-08', dueDate:'2024-01-22', returnDate:null, status:'overdue', fine:50 },
    { id:'T003', bookId:'B003', bookTitle:'Forensic Science & Criminalistics', memberId:'M005', memberName:'Rajesh Kulkarni', issueDate:'2024-01-05', dueDate:'2024-01-19', returnDate:'2024-01-17', status:'returned', fine:0 },
    { id:'T004', bookId:'B006', bookTitle:'Constitution of India', memberId:'M002', memberName:'Priya Sharma', issueDate:'2024-01-12', dueDate:'2024-01-26', returnDate:null, status:'issued', fine:0 },
    { id:'T005', bookId:'B001', bookTitle:'Criminal Law & Procedure', memberId:'M007', memberName:'Vikram Shinde', issueDate:'2024-01-03', dueDate:'2024-01-17', returnDate:'2024-01-16', status:'returned', fine:0 },
    { id:'T006', bookId:'B005', bookTitle:'Police Administration', memberId:'M004', memberName:'Kavita Joshi', issueDate:'2024-01-09', dueDate:'2024-01-23', returnDate:null, status:'issued', fine:0 },
  ],

  settings: {
    loanDays: 14,
    finePerDay: 5,
    maxBooksPerMember: 3,
    libraryName: 'Centre for Police Research',
    librarySubtitle: 'Excellence in Research & Training',
    address: 'University of Pune Campus, Ganeshkhind, Pune - 411 007'
  }
};

// helper
function getBookColor(id) {
  const idx = parseInt(id.replace('B','')) % BOOK_COLORS.length;
  return BOOK_COLORS[idx];
}

function initials(str) {
  return str.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
}

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
}

function today() {
  return new Date().toISOString().split('T')[0];
}

function dueDate(days) {
  const d = new Date();
  d.setDate(d.getDate() + (days || DATA.settings.loanDays));
  return d.toISOString().split('T')[0];
}

function isOverdue(due) {
  return due && new Date(due) < new Date() && due !== today();
}