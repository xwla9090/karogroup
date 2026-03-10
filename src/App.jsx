import { useState, useEffect, useRef, useCallback } from "react";

// ==================== CONFIG ====================
const PRIMARY = "#4DAF94";
const PRIMARY_DARK = "#3D9A82";
const PRIMARY_LIGHT = "#5FC4A8";
const PHONE = "+964 770 153 6017";
const EMAIL = "hawbirranya6@gmail.com";
const PROJECT_IMAGES = [
  "https://i.ibb.co/5h46CW2n/IMG-0443.jpg",
  "https://i.ibb.co/VYgVY00f/IMG-0442.jpg",
  "https://i.ibb.co/k2D9vJ3c/IMG-0441.jpg",
  "https://i.ibb.co/LD5rz2p9/IMG-0440.jpg",
  "https://i.ibb.co/QjX64FxD/IMG-0439.jpg",
  "https://i.ibb.co/0x44LW1/IMG-0438.jpg",
  "https://i.ibb.co/qFMVBWck/IMG-0437.jpg",
  "https://i.ibb.co/G38Hxksc/IMG-0435.jpg"
];
const USERS = [
  { username: "shasti", password: "shasti123", project: "shasti" },
  { username: "surosh", password: "surosh123", project: "surosh" },
  { username: "admin", password: "karo2024", project: "admin", isAdmin: true }
];

// ==================== TRANSLATIONS ====================
const translations = {
  ku: {
    nav: { home: "سەرەتا", services: "خزمەتگوزارییەکان", projects: "پڕۆژەکان", about: "دەربارە", contact: "پەیوەندی" },
    hero: { title: "بیناسازی پیشەسازانە", subtitle: "لە ٢٠١٧ ـەوە، کارۆ گروپ پێشەنگە لە بواری بیناسازی و کۆنکریت لە هەرێمی کوردستان", cta: "پڕۆژەکانمان ببینە" },
    services: {
      title: "خزمەتگوزارییەکانمان",
      s1: { name: "بیناسازی نیشتەجێبوون", desc: "دیزاین و دروستکردنی خانوو و کۆمپلێکسی نیشتەجێبوون بە ستانداردی نێودەوڵەتی" },
      s2: { name: "بیناسازی بازرگانی", desc: "دروستکردنی بینای بازرگانی، مۆڵ، ئۆفیس و پڕۆژەی گەورە بە کوالیتی بەرز" },
      s3: { name: "کۆنکریت و ستراکچەر", desc: "کاری کۆنکریتی ئامادە و ستراکچەری پۆڵایین بە مەوادی پێشکەوتوو" }
    },
    about: { title: "بۆچی کارۆ گروپ؟", items: ["مەوادی پێشکەوتوو — Doka ی ئەڵمانی، جەگ، پلاوودی ئەسڵی", "گرێنتی لەسەر هەموو کارەکان", "پابەندبوون بە سەیفتی و ستانداردی نێودەوڵەتی", "ستافی شارەزا و بە ئەزموون"] },
    projects: { title: "پڕۆژەکانمان" },
    contact: { title: "پەیوەندیمان پێوە بکە", phone: "تەلەفۆن", whatsapp: "واتسئاپ", viber: "ڤایبەر", email: "ئیمەیڵ" },
    footer: { rights: "هەموو مافەکان پارێزراون", poweredBy: "کارۆ گروپ" },
    dark: "تاریک", light: "ڕووناک",
    login: "چوونەژوورەوە", username: "ناوی بەکارهێنەر", password: "وشەی نهێنی", enter: "بچۆرە ژوورەوە", wrongLogin: "ناوی بەکارهێنەر یان وشەی نهێنی هەڵەیە", logout: "چوونەدەرەوە",
    sidebar: { cash: "قاسە", loans: "قەرز", concrete: "سلفە کۆنکرێت", contractor: "حیسابی مقاول", exchange: "ئالوگۆری دراو", invoice: "ئینڤۆیس", backup: "پاشەکەوتی داتاکان", reports: "ڕاپۆرتەکان", history: "هیستۆری داتا", monthlyReport: "کەشف حیسابی مانگانە", darkMode: "دۆخی تاریک/ڕووناک", langChange: "گۆڕینی زمان", expenses: "خەرجی (مەسارف)" },
    cashBox: "قاسەی پارە", iqd: "دینار", usd: "دۆلار",
    date: "بەروار", receiptNo: "ژمارەی وەسڵ", receiptImg: "وێنەی وەسڵ", amountIQD: "بڕ بە دینار", amountUSD: "بڕ بە دۆلار", note: "تێبینی",
    search: "گەڕان", filterMonth: "فلتەر بە مانگ", total: "کۆی گشتی", print: "پرینت", save: "پاشەکەوت", delete: "سڕینەوە", edit: "دەستکاری", add: "زیادکردن", cancel: "پاشگەزبوونەوە",
    mark: "مارک", marked: "مارککراو", showAll: "پیشاندانی هەمووی", showMarked: "تەنها مارککراوەکان",
    loanType: "جۆر", loanTake: "قەرز وەرگرتن", loanGive: "قەرز دان", personName: "ناوی کەس",
    meters: "بڕی مەتر", pricePerMeter: "نرخی هەر مەترێک", totalConcrete: "کۆی پارەی سلفە", deposit: "تەئمین (بارمتە)", received: "بڕی وەرگرتن",
    contractorType: "جۆر", withdraw: "ڕاکێشانی پارە", addMoney: "زیادکردنی پارە",
    cashIQD: "پارەی دینار لە قاسە", cashUSD: "پارەی دۆلار لە قاسە", totalInIQD: "کۆی گشتی بە دینار",
    exchangeRate: "نرخی دۆلار بە دینار", saveRate: "پاشەکەوتی نرخ", convertTo: "گۆڕین بۆ", fromUSD: "دۆلار → دینار", fromIQD: "دینار → دۆلار",
    amount: "بڕ", result: "ئەنجام", convert: "گۆڕین",
    invoiceNo: "ژمارەی ئینڤۆیس", itemName: "ناوی کاڵا", qty: "حەدەد", price: "نرخ", addItem: "زیادکردنی ئایتم", viewInvoice: "بینین",
    cashLog: "هاتن/چوونی پارە", type: "جۆر",
    noBalance: "بڕی پارەی پێویستت نییە، تکایە باڵانس زیاد بکە بۆ قاسە دواتر خەرجی بکە",
    allMonths: "هەموو مانگەکان", clickToChange: "کلیک بکە بۆ گۆڕین",
    savePDF: "سەیڤ بە PDF", saveExcel: "سەیڤ بە Excel", selectSize: "سایز هەڵبژێرە",
    totalExpIQD: "کۆی خەرجی بە دینار", totalExpUSD: "کۆی خەرجی بە دۆلار",
    totalConcreteReceived: "کۆی سلفە وەرگیراو", totalDeposit: "کۆی تەئمین",
    reportsTitle: "ڕاپۆرتی گشتی", noData: "هیچ داتایەک نییە",
    last30days: "٣٠ ڕۆژی ڕابردوو", dataCleared: "داتای کۆن سڕایەوە",
    backupSuccess: "داتاکان بە سەرکەوتوویی پاشەکەوت کران",
    downloadBackup: "داونلۆدی پاشەکەوت", uploadBackup: "بارکردنی پاشەکەوت",
    changeImg: "گۆڕینی وێنە", removeImg: "سڕینەوەی وێنە"
  },
  en: {
    nav: { home: "Home", services: "Services", projects: "Projects", about: "About", contact: "Contact" },
    hero: { title: "Professional Construction", subtitle: "Since 2017, Karo Group has been a leader in construction and concrete in Kurdistan Region", cta: "View Our Projects" },
    services: {
      title: "Our Services",
      s1: { name: "Residential Construction", desc: "Design and construction of houses and residential complexes to international standards" },
      s2: { name: "Commercial Construction", desc: "Building commercial properties, malls, offices and large projects with high quality" },
      s3: { name: "Concrete & Structure", desc: "Ready-mix concrete and steel structures with advanced materials" }
    },
    about: { title: "Why Karo Group?", items: ["Advanced materials — German Doka, scaffolding, original plywood", "Warranty on all work", "Committed to safety and international standards", "Experienced and expert staff"] },
    projects: { title: "Our Projects" },
    contact: { title: "Contact Us", phone: "Phone", whatsapp: "WhatsApp", viber: "Viber", email: "Email" },
    footer: { rights: "All rights reserved", poweredBy: "Karo Group" },
    dark: "Dark", light: "Light",
    login: "Login", username: "Username", password: "Password", enter: "Sign In", wrongLogin: "Wrong username or password", logout: "Logout",
    sidebar: { cash: "Cash Box", loans: "Loans", concrete: "Concrete Advance", contractor: "Contractor Account", exchange: "Currency Exchange", invoice: "Invoice", backup: "Data Backup", reports: "Reports", history: "Data History", monthlyReport: "Monthly Statement", darkMode: "Dark/Light Mode", langChange: "Change Language", expenses: "Expenses" },
    cashBox: "Cash Box", iqd: "IQD", usd: "USD",
    date: "Date", receiptNo: "Receipt No.", receiptImg: "Receipt Image", amountIQD: "Amount (IQD)", amountUSD: "Amount (USD)", note: "Note",
    search: "Search", filterMonth: "Filter by Month", total: "Total", print: "Print", save: "Save", delete: "Delete", edit: "Edit", add: "Add", cancel: "Cancel",
    mark: "Mark", marked: "Marked", showAll: "Show All", showMarked: "Show Marked Only",
    loanType: "Type", loanTake: "Loan Received", loanGive: "Loan Given", personName: "Person Name",
    meters: "Meters", pricePerMeter: "Price/Meter", totalConcrete: "Total Price", deposit: "Deposit", received: "Received",
    contractorType: "Type", withdraw: "Withdraw", addMoney: "Add Money",
    cashIQD: "Cash IQD", cashUSD: "Cash USD", totalInIQD: "Total in IQD",
    exchangeRate: "Dollar Rate (IQD)", saveRate: "Save Rate", convertTo: "Convert to", fromUSD: "USD → IQD", fromIQD: "IQD → USD",
    amount: "Amount", result: "Result", convert: "Convert",
    invoiceNo: "Invoice No.", itemName: "Item Name", qty: "Quantity", price: "Price", addItem: "Add Item", viewInvoice: "View",
    cashLog: "Cash Log", type: "Type",
    noBalance: "Insufficient balance. Please add balance to cash box first, then make the expense.",
    allMonths: "All Months", clickToChange: "Click to change",
    savePDF: "Save as PDF", saveExcel: "Save as Excel", selectSize: "Select Size",
    totalExpIQD: "Total Expenses (IQD)", totalExpUSD: "Total Expenses (USD)",
    totalConcreteReceived: "Total Concrete Received", totalDeposit: "Total Deposit",
    reportsTitle: "General Report", noData: "No data available",
    last30days: "Last 30 days", dataCleared: "Old data cleared",
    backupSuccess: "Data backed up successfully",
    downloadBackup: "Download Backup", uploadBackup: "Upload Backup",
    changeImg: "Change Image", removeImg: "Remove Image"
  },
  ar: {
    nav: { home: "الرئيسية", services: "الخدمات", projects: "المشاريع", about: "حولنا", contact: "اتصل بنا" },
    hero: { title: "بناء احترافي", subtitle: "منذ ٢٠١٧، مجموعة كارو رائدة في مجال البناء والخرسانة في إقليم كوردستان", cta: "شاهد مشاريعنا" },
    services: {
      title: "خدماتنا",
      s1: { name: "البناء السكني", desc: "تصميم وبناء المنازل والمجمعات السكنية وفق المعايير الدولية" },
      s2: { name: "البناء التجاري", desc: "بناء العقارات التجارية والمولات والمكاتب والمشاريع الكبيرة بجودة عالية" },
      s3: { name: "الخرسانة والهياكل", desc: "خرسانة جاهزة وهياكل فولاذية بمواد متطورة" }
    },
    about: { title: "لماذا مجموعة كارو؟", items: ["مواد متطورة — Doka الألمانية، سقالات، خشب رقائقي أصلي", "ضمان على جميع الأعمال", "الالتزام بالسلامة والمعايير الدولية", "طاقم ذو خبرة وكفاءة"] },
    projects: { title: "مشاريعنا" },
    contact: { title: "تواصل معنا", phone: "هاتف", whatsapp: "واتساب", viber: "فايبر", email: "بريد إلكتروني" },
    footer: { rights: "جميع الحقوق محفوظة", poweredBy: "مجموعة كارو" },
    dark: "داكن", light: "فاتح",
    login: "تسجيل الدخول", username: "اسم المستخدم", password: "كلمة المرور", enter: "دخول", wrongLogin: "اسم المستخدم أو كلمة المرور خاطئة", logout: "تسجيل الخروج",
    sidebar: { cash: "الصندوق", loans: "القروض", concrete: "سلفة خرسانة", contractor: "حساب المقاول", exchange: "صرف العملات", invoice: "فاتورة", backup: "نسخ احتياطي", reports: "التقارير", history: "سجل البيانات", monthlyReport: "كشف حساب شهري", darkMode: "الوضع الداكن/الفاتح", langChange: "تغيير اللغة", expenses: "المصاريف" },
    cashBox: "صندوق النقد", iqd: "دينار", usd: "دولار",
    date: "التاريخ", receiptNo: "رقم الوصل", receiptImg: "صورة الوصل", amountIQD: "المبلغ (دينار)", amountUSD: "المبلغ (دولار)", note: "ملاحظة",
    search: "بحث", filterMonth: "تصفية حسب الشهر", total: "المجموع", print: "طباعة", save: "حفظ", delete: "حذف", edit: "تعديل", add: "إضافة", cancel: "إلغاء",
    mark: "تعليم", marked: "معلّم", showAll: "عرض الكل", showMarked: "المعلّم فقط",
    loanType: "النوع", loanTake: "قرض مستلم", loanGive: "قرض ممنوح", personName: "اسم الشخص",
    meters: "الأمتار", pricePerMeter: "سعر المتر", totalConcrete: "الإجمالي", deposit: "التأمين", received: "المستلم",
    contractorType: "النوع", withdraw: "سحب", addMoney: "إيداع",
    cashIQD: "نقد دينار", cashUSD: "نقد دولار", totalInIQD: "الإجمالي بالدينار",
    exchangeRate: "سعر الدولار (دينار)", saveRate: "حفظ السعر", convertTo: "تحويل إلى", fromUSD: "دولار → دينار", fromIQD: "دينار → دولار",
    amount: "المبلغ", result: "النتيجة", convert: "تحويل",
    invoiceNo: "رقم الفاتورة", itemName: "اسم السلعة", qty: "العدد", price: "السعر", addItem: "إضافة عنصر", viewInvoice: "عرض",
    cashLog: "سجل النقد", type: "النوع",
    noBalance: "الرصيد غير كافٍ. يرجى إضافة رصيد للصندوق أولاً ثم قم بالمصروف.",
    allMonths: "كل الأشهر", clickToChange: "اضغط للتغيير",
    savePDF: "حفظ PDF", saveExcel: "حفظ Excel", selectSize: "اختر الحجم",
    totalExpIQD: "إجمالي المصاريف (دينار)", totalExpUSD: "إجمالي المصاريف (دولار)",
    totalConcreteReceived: "إجمالي الخرسانة المستلمة", totalDeposit: "إجمالي التأمين",
    reportsTitle: "التقرير العام", noData: "لا توجد بيانات",
    last30days: "آخر ٣٠ يوم", dataCleared: "تم حذف البيانات القديمة",
    backupSuccess: "تم النسخ الاحتياطي بنجاح",
    downloadBackup: "تحميل النسخة", uploadBackup: "استيراد النسخة",
    changeImg: "تغيير الصورة", removeImg: "حذف الصورة"
  }
};

// ==================== HELPERS ====================
const fmt = (n) => Number(n || 0).toLocaleString();
const today = () => new Date().toISOString().split("T")[0];
const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
function getLS(key, def) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch { return def; } }
function setLS(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }
function truncate(str, max = 30) { if (!str) return ""; return str.length > max ? str.slice(0, max) + "..." : str; }

// ==================== ICONS ====================
const Icons = {
  Sun: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
  Moon: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  Phone: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Mail: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  Menu: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  X: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Printer: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  Search: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Plus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Trash: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Edit: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Logout: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Eye: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Upload: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  Download: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
  File: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Globe: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Chart: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Clock: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
};

// ==================== LOGO ====================
function KaroLogo({ size = 48, ping }) {
  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      {ping && <div style={{
        position: "absolute", width: size + 16, height: size + 16, borderRadius: "50%",
        background: `${PRIMARY}25`, animation: "ping 2s cubic-bezier(0,0,0.2,1) infinite"
      }} />}
      <div style={{
        width: size, height: size, borderRadius: "50%", background: PRIMARY,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", zIndex: 1, boxShadow: `0 4px 20px ${PRIMARY}40`
      }}>
        <span style={{ color: "#fff", fontWeight: 900, fontSize: size * 0.4, letterSpacing: -1 }}>KG</span>
      </div>
    </div>
  );
}

// ==================== SHARED UI ====================
function Card({ children, s, style }) {
  return <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 14, padding: 20, ...style }}>{children}</div>;
}
function Btn({ children, s, variant = "primary", onClick, style, disabled }) {
  const base = { border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", gap: 5, transition: "all 0.2s", opacity: disabled ? 0.5 : 1, ...style };
  if (variant === "primary") Object.assign(base, { background: PRIMARY, color: "#fff" });
  else if (variant === "danger") Object.assign(base, { background: "#FEE2E2", color: "#EF4444" });
  else if (variant === "ghost") Object.assign(base, { background: "transparent", color: s.text, border: `1px solid ${s.border}` });
  else if (variant === "success") Object.assign(base, { background: "#D1FAE5", color: "#059669" });
  return <button onClick={disabled ? undefined : onClick} style={base}>{children}</button>;
}
function Input({ s, label, ...props }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {label && <label style={{ fontSize: 11, fontWeight: 600, color: s.textMuted }}>{label}</label>}
      <input {...props} style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, outline: "none", direction: props.type === "number" || props.type === "date" ? "ltr" : undefined, ...props.style }} onFocus={e => e.target.style.borderColor = PRIMARY} onBlur={e => e.target.style.borderColor = s.border} />
    </div>
  );
}
function Select({ s, label, children, ...props }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {label && <label style={{ fontSize: 11, fontWeight: 600, color: s.textMuted }}>{label}</label>}
      <select {...props} style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, outline: "none", cursor: "pointer", ...props.style }}>{children}</select>
    </div>
  );
}

// ==================== SIZE PICKER MODAL ====================
function SizePickerModal({ t, s, onSelect, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: s.bgCard, borderRadius: 16, padding: 28, minWidth: 280, textAlign: "center" }}>
        <h3 style={{ marginBottom: 20, fontSize: 16, fontWeight: 700 }}>{t.selectSize}</h3>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          {["A3", "A4", "A5"].map(sz => (
            <button key={sz} onClick={() => onSelect(sz)} style={{
              padding: "14px 28px", borderRadius: 10, border: `2px solid ${PRIMARY}`,
              background: "transparent", color: PRIMARY, fontSize: 16, fontWeight: 700,
              cursor: "pointer", transition: "all 0.2s"
            }}
            onMouseEnter={e => { e.target.style.background = PRIMARY; e.target.style.color = "#fff"; }}
            onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = PRIMARY; }}
            >{sz}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==================== PRINT / EXPORT HELPERS ====================
function printTable({ title, headers, rows, totalRow, size = "A4", isRtl }) {
  const sizeCSS = { A3: "420mm 297mm", A4: "210mm 297mm", A5: "148mm 210mm" };
  const w = window.open("", "_blank");
  w.document.write(`<html dir="${isRtl ? "rtl" : "ltr"}"><head><title>${title}</title><style>
    @page { size: ${sizeCSS[size] || sizeCSS.A4}; margin: 15mm; }
    body { font-family: sans-serif; padding: 20px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th { background: ${PRIMARY}; color: white; padding: 8px 6px; font-size: 12px; }
    td { border: 1px solid #ddd; padding: 6px; text-align: center; font-size: 12px; }
    h2 { color: ${PRIMARY}; text-align: center; }
    .total-row { font-weight: bold; background: #f0fdf4; }
  </style></head><body>
  <h2>KARO GROUP — ${title}</h2>
  <table><thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>
  ${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}
  ${totalRow ? `<tr class="total-row">${totalRow.map(c => `<td>${c}</td>`).join("")}</tr>` : ""}
  </tbody></table></body></html>`);
  w.document.close();
  w.print();
}

function exportExcel({ title, headers, rows, totalRow }) {
  let csv = "\uFEFF";
  csv += headers.join(",") + "\n";
  rows.forEach(r => { csv += r.map(c => `"${c}"`).join(",") + "\n"; });
  if (totalRow) csv += totalRow.map(c => `"${c}"`).join(",") + "\n";
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = `${title}.csv`; a.click();
  URL.revokeObjectURL(url);
}

// ==================== STYLES ====================
const getStyles = (dark) => {
  const bg = dark ? "#0f0f0f" : "#ffffff";
  const bgCard = dark ? "#1a1a1a" : "#ffffff";
  const bgCard2 = dark ? "#222" : "#f8f8f8";
  const text = dark ? "#e5e5e5" : "#1c1917";
  const textMuted = dark ? "#999" : "#78716c";
  const border = dark ? "#333" : "#e5e5e5";
  const danger = "#EF4444";
  const success = "#22C55E";
  return { bg, bgCard, bgCard2, text, textMuted, border, danger, success };
};

// ==================== MAIN APP ====================
export default function App() {
  const [lang, setLang] = useState(getLS("karo_lang", "ku"));
  const [dark, setDark] = useState(getLS("karo_dark", false));
  const [page, setPage] = useState("landing");
  const [loggedUser, setLoggedUser] = useState(getLS("karo_user", null));
  const [dashPage, setDashPage] = useState("reports");
  const [logoClicks, setLogoClicks] = useState(0);
  const logoTimer = useRef(null);

  const t = translations[lang];
  const isRtl = lang === "ku" || lang === "ar";
  const s = getStyles(dark);

  useEffect(() => { setLS("karo_lang", lang); }, [lang]);
  useEffect(() => { setLS("karo_dark", dark); }, [dark]);
  useEffect(() => { if (loggedUser) setLS("karo_user", loggedUser); }, [loggedUser]);

  const [cashIQD, setCashIQD] = useState(getLS("karo_cashIQD", 0));
  const [cashUSD, setCashUSD] = useState(getLS("karo_cashUSD", 0));
  const [exchangeRate, setExchangeRate] = useState(getLS("karo_rate", 1500));
  const [cashLog, setCashLog] = useState(getLS("karo_cashLog", []));

  useEffect(() => { setLS("karo_cashIQD", cashIQD); }, [cashIQD]);
  useEffect(() => { setLS("karo_cashUSD", cashUSD); }, [cashUSD]);
  useEffect(() => { setLS("karo_rate", exchangeRate); }, [exchangeRate]);
  useEffect(() => { setLS("karo_cashLog", cashLog); }, [cashLog]);

  const addCashLog = useCallback((desc, iqd, usd) => {
    setCashLog(prev => [...prev, { id: genId(), date: today(), desc, iqd: Number(iqd || 0), usd: Number(usd || 0), time: new Date().toLocaleTimeString() }]);
  }, []);

  // History cleanup - remove data older than 30 days
  useEffect(() => {
    const interval = setInterval(() => {
      const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 30);
      const cutoffStr = cutoff.toISOString().split("T")[0];
      setCashLog(prev => prev.filter(item => item.date >= cutoffStr));
    }, 86400000); // daily
    return () => clearInterval(interval);
  }, []);

  const handleLogoClick = () => {
    const nc = logoClicks + 1;
    setLogoClicks(nc);
    clearTimeout(logoTimer.current);
    if (nc >= 3) { setLogoClicks(0); setPage(loggedUser ? "dashboard" : "login"); }
    else logoTimer.current = setTimeout(() => setLogoClicks(0), 2000);
  };

  const handleLogin = (u, p) => {
    const user = USERS.find(x => x.username === u && x.password === p);
    if (user) { setLoggedUser(user); setPage("dashboard"); setDashPage("reports"); return true; }
    return false;
  };

  const handleLogout = () => { setLoggedUser(null); setPage("landing"); localStorage.removeItem("karo_user"); };

  if (page === "login") return <LoginPage t={t} s={s} isRtl={isRtl} dark={dark} onLogin={handleLogin} onBack={() => setPage("landing")} />;
  if (page === "dashboard" && loggedUser) return <Dashboard t={t} s={s} isRtl={isRtl} dark={dark} lang={lang} setLang={setLang} user={loggedUser} dashPage={dashPage} setDashPage={setDashPage} onLogout={handleLogout} cashIQD={cashIQD} setCashIQD={setCashIQD} cashUSD={cashUSD} setCashUSD={setCashUSD} exchangeRate={exchangeRate} setExchangeRate={setExchangeRate} cashLog={cashLog} addCashLog={addCashLog} setDark={setDark} />;

  return <LandingPage t={t} s={s} isRtl={isRtl} dark={dark} lang={lang} setLang={setLang} setDark={setDark} onLogoClick={handleLogoClick} />;
}

// ==================== LANDING PAGE ====================
function LandingPage({ t, s, isRtl, dark, lang, setLang, setDark, onLogoClick }) {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h);
  }, []);

  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMobileMenu(false); };

  return (
    <div dir={isRtl ? "rtl" : "ltr"} style={{ background: "#fff", color: "#1c1917", fontFamily: "'Segoe UI', Tahoma, sans-serif", minHeight: "100vh", overflowX: "hidden" }}>
      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? "rgba(255,255,255,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid #e5e5e5" : "none",
        transition: "all 0.4s", padding: scrolled ? "10px 0" : "18px 0"
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={onLogoClick}>
            <KaroLogo size={36} ping />
            <span style={{ fontWeight: 800, fontSize: 20, color: PRIMARY }}>KARO GROUP</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }} className="desktop-nav">
            {["home", "services", "projects", "about", "contact"].map(sec => (
              <button key={sec} onClick={() => scrollTo(sec)} style={{ background: "none", border: "none", color: "#1c1917", cursor: "pointer", fontSize: 14, fontWeight: 500, padding: "4px 0", borderBottom: "2px solid transparent", transition: "all 0.3s" }}
              onMouseEnter={e => e.target.style.borderBottomColor = PRIMARY} onMouseLeave={e => e.target.style.borderBottomColor = "transparent"}>{t.nav[sec]}</button>
            ))}
            <select value={lang} onChange={e => setLang(e.target.value)} style={{ background: "#f5f5f5", color: "#333", border: "1px solid #e5e5e5", borderRadius: 8, padding: "5px 10px", fontSize: 12, cursor: "pointer" }}>
              <option value="ku">کوردی</option><option value="en">English</option><option value="ar">عربي</option>
            </select>
          </div>
          <button onClick={() => setMobileMenu(!mobileMenu)} style={{ display: "none", background: "none", border: "none", color: "#1c1917", cursor: "pointer" }} className="mobile-btn">
            {mobileMenu ? <Icons.X /> : <Icons.Menu />}
          </button>
        </div>
        {mobileMenu && (
          <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "rgba(255,255,255,0.98)", backdropFilter: "blur(20px)", padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
            {["home", "services", "projects", "about", "contact"].map(sec => (
              <button key={sec} onClick={() => scrollTo(sec)} style={{ background: "none", border: "none", color: "#1c1917", cursor: "pointer", fontSize: 15, fontWeight: 500, textAlign: isRtl ? "right" : "left", padding: "6px 0" }}>{t.nav[sec]}</button>
            ))}
            <select value={lang} onChange={e => setLang(e.target.value)} style={{ background: "#f5f5f5", border: "1px solid #e5e5e5", borderRadius: 8, padding: "8px 12px", fontSize: 14 }}>
              <option value="ku">کوردی</option><option value="en">English</option><option value="ar">عربي</option>
            </select>
          </div>
        )}
      </nav>

      {/* HERO WITH PROJECTS ON TOP */}
      <section id="home" style={{ paddingTop: 90, background: "#fff" }}>
        {/* Project Images Carousel on top */}
        <div style={{ padding: "0 24px", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 0 }} className="hero-grid">
            {PROJECT_IMAGES.map((img, i) => (
              <div key={i} onClick={() => setLightbox(img)} style={{ borderRadius: 12, overflow: "hidden", cursor: "pointer", aspectRatio: "4/3", position: "relative" }}>
                <img src={img} alt={`Project ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }}
                onMouseEnter={e => e.target.style.transform = "scale(1.05)"} onMouseLeave={e => e.target.style.transform = "scale(1)"} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
        {/* Hero text */}
        <div style={{ textAlign: "center", padding: "60px 24px 80px", position: "relative" }}>
          <div style={{ marginBottom: 24 }}><KaroLogo size={70} ping /></div>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 20, color: PRIMARY }}>{t.hero.title}</h1>
          <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "#78716c", lineHeight: 1.7, marginBottom: 36, maxWidth: 600, margin: "0 auto 36px" }}>{t.hero.subtitle}</p>
          <button onClick={() => scrollTo("services")} style={{
            background: PRIMARY, color: "#fff", border: "none", borderRadius: 10, padding: "14px 36px",
            fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: `0 6px 24px ${PRIMARY}40`, transition: "transform 0.3s"
          }} onMouseEnter={e => e.target.style.transform = "translateY(-2px)"} onMouseLeave={e => e.target.style.transform = "translateY(0)"}>{t.hero.cta}</button>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{ padding: "80px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: 32, fontWeight: 800, marginBottom: 50, color: PRIMARY }}>{t.services.title}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {[t.services.s1, t.services.s2, t.services.s3].map((svc, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: 14, padding: 32, transition: "all 0.3s", borderTop: `4px solid ${PRIMARY}` }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10, color: PRIMARY }}>{svc.name}</h3>
              <p style={{ color: "#78716c", lineHeight: 1.7, fontSize: 14 }}>{svc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding: "80px 24px", background: "#f9fafb" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 40, color: PRIMARY }}>{t.about.title}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {t.about.items.map((item, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: 10, padding: "20px 16px", textAlign: isRtl ? "right" : "left", display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ color: PRIMARY, fontSize: 18, fontWeight: 800 }}>✦</span>
                <span style={{ fontSize: 14, lineHeight: 1.7 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" style={{ padding: "80px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: 32, fontWeight: 800, marginBottom: 50, color: PRIMARY }}>{t.projects.title}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {PROJECT_IMAGES.map((img, i) => (
            <div key={i} onClick={() => setLightbox(img)} style={{ borderRadius: 12, overflow: "hidden", cursor: "pointer", aspectRatio: "4/3", border: "1px solid #e5e5e5" }}>
              <img src={img} alt={`Project ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }}
              onMouseEnter={e => e.target.style.transform = "scale(1.05)"} onMouseLeave={e => e.target.style.transform = "scale(1)"} loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding: "80px 24px", background: "#f9fafb" }}>
        <div style={{ maxWidth: 550, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 40, color: PRIMARY }}>{t.contact.title}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { icon: <Icons.Phone />, label: t.contact.phone, value: PHONE, href: `tel:${PHONE.replace(/\s/g, "")}` },
              { icon: "💬", label: t.contact.whatsapp, value: PHONE, href: `https://wa.me/${PHONE.replace(/[^0-9]/g, "")}` },
              { icon: "📱", label: t.contact.viber, value: PHONE, href: `viber://chat?number=${PHONE.replace(/[^0-9]/g, "")}` },
              { icon: <Icons.Mail />, label: t.contact.email, value: EMAIL, href: `mailto:${EMAIL}` },
            ].map((c, i) => (
              <a key={i} href={c.href} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", background: "#fff", border: "1px solid #e5e5e5", borderRadius: 10, textDecoration: "none", color: "#1c1917", transition: "all 0.3s", direction: "ltr" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = PRIMARY} onMouseLeave={e => e.currentTarget.style.borderColor = "#e5e5e5"}>
                <span style={{ fontSize: 18, color: PRIMARY, display: "flex" }}>{c.icon}</span>
                <span style={{ fontWeight: 600, minWidth: 70 }}>{c.label}:</span>
                <span style={{ color: "#78716c" }}>{c.value}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "28px 24px", textAlign: "center", borderTop: "1px solid #e5e5e5", background: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 6 }}>
          <div onClick={onLogoClick} style={{ cursor: "pointer" }}><KaroLogo size={24} /></div>
          <span style={{ fontWeight: 700, color: PRIMARY }}>KARO GROUP</span>
        </div>
        <p style={{ color: "#78716c", fontSize: 12 }}>© 2024 {t.footer.poweredBy}. {t.footer.rights}.</p>
      </footer>

      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 20 }}>
          <img src={lightbox} alt="" style={{ maxWidth: "90%", maxHeight: "90vh", borderRadius: 8, objectFit: "contain" }} />
          <button onClick={() => setLightbox(null)} style={{ position: "absolute", top: 20, right: 20, background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%", width: 40, height: 40, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><Icons.X /></button>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) { .desktop-nav { display: none !important; } .mobile-btn { display: flex !important; } .hero-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (min-width: 769px) { .mobile-btn { display: none !important; } }
        * { margin: 0; padding: 0; box-sizing: border-box; } body { margin: 0; }
        @keyframes ping { 0% { transform: scale(1); opacity: 0.6; } 75%, 100% { transform: scale(1.6); opacity: 0; } }
        input, select, textarea { font-family: inherit; }
      `}</style>
    </div>
  );
}

// ==================== LOGIN PAGE ====================
function LoginPage({ t, s, isRtl, dark, onLogin, onBack }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const handleSubmit = () => { if (!onLogin(username, password)) setError(true); };
  return (
    <div dir={isRtl ? "rtl" : "ltr"} style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9fafb", fontFamily: "'Segoe UI', Tahoma, sans-serif", padding: 24 }}>
      <div style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: 18, padding: 44, width: "100%", maxWidth: 380, boxShadow: "0 10px 40px rgba(0,0,0,0.06)" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <KaroLogo size={56} ping />
          <h2 style={{ color: PRIMARY, marginTop: 14, fontSize: 22, fontWeight: 800 }}>{t.login}</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", marginBottom: 4, fontSize: 12, color: "#78716c", fontWeight: 600 }}>{t.username}</label>
            <input value={username} onChange={e => { setUsername(e.target.value); setError(false); }} style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: `1px solid ${error ? "#EF4444" : "#e5e5e5"}`, background: "#f8f8f8", color: "#333", fontSize: 14, outline: "none", direction: "ltr" }} placeholder="username" onFocus={e => e.target.style.borderColor = PRIMARY} onBlur={e => e.target.style.borderColor = "#e5e5e5"} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: 4, fontSize: 12, color: "#78716c", fontWeight: 600 }}>{t.password}</label>
            <input type="password" value={password} onChange={e => { setPassword(e.target.value); setError(false); }} style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: `1px solid ${error ? "#EF4444" : "#e5e5e5"}`, background: "#f8f8f8", color: "#333", fontSize: 14, outline: "none", direction: "ltr" }} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && handleSubmit()} onFocus={e => e.target.style.borderColor = PRIMARY} onBlur={e => e.target.style.borderColor = "#e5e5e5"} />
          </div>
          {error && <p style={{ color: "#EF4444", fontSize: 12, textAlign: "center" }}>{t.wrongLogin}</p>}
          <button onClick={handleSubmit} style={{ background: PRIMARY, color: "#fff", border: "none", borderRadius: 8, padding: "12px", fontSize: 15, fontWeight: 700, cursor: "pointer", marginTop: 6 }}>{t.enter}</button>
          <button onClick={onBack} style={{ background: "none", border: "none", color: "#78716c", cursor: "pointer", fontSize: 13 }}>← {t.nav.home}</button>
        </div>
      </div>
    </div>
  );
}

// ==================== DASHBOARD ====================
function Dashboard({ t, s, isRtl, dark, lang, setLang, user, dashPage, setDashPage, onLogout, cashIQD, setCashIQD, cashUSD, setCashUSD, exchangeRate, setExchangeRate, cashLog, addCashLog, setDark }) {
  const prefix = user.project || "default";
  const sidebarItems = [
    { id: "reports", label: t.sidebar.reports, icon: <Icons.Chart /> },
    { id: "cash", label: t.sidebar.cash, icon: "🏦" },
    { id: "expenses", label: t.sidebar.expenses, icon: "💰" },
    { id: "loans", label: t.sidebar.loans, icon: "🤝" },
    { id: "concrete", label: t.sidebar.concrete, icon: "🏗️" },
    { id: "contractor", label: t.sidebar.contractor, icon: "👷" },
    { id: "exchange", label: t.sidebar.exchange, icon: "💱" },
    { id: "invoice", label: t.sidebar.invoice, icon: "📄" },
    { id: "backup", label: t.sidebar.backup, icon: "💾" },
    { id: "history", label: t.sidebar.history, icon: <Icons.Clock /> },
    { id: "monthly", label: t.sidebar.monthlyReport, icon: "📊" },
  ];

  const themeS = {
    bg: dark ? "#0f0f0f" : "#ffffff",
    bgCard: dark ? "#1a1a1a" : "#ffffff",
    bgCard2: dark ? "#222" : "#f8f8f8",
    text: dark ? "#e5e5e5" : "#1c1917",
    textMuted: dark ? "#999" : "#78716c",
    border: dark ? "#333" : "#e5e5e5",
    danger: "#EF4444", success: "#22C55E"
  };

  return (
    <div dir={isRtl ? "rtl" : "ltr"} style={{ display: "flex", minHeight: "100vh", background: themeS.bg, fontFamily: "'Segoe UI', Tahoma, sans-serif", color: themeS.text }}>
      {/* Sidebar - always visible */}
      <aside style={{
        width: 250, minWidth: 250, background: dark ? "#141414" : "#fff",
        borderRight: isRtl ? "none" : `1px solid ${themeS.border}`,
        borderLeft: isRtl ? `1px solid ${themeS.border}` : "none",
        display: "flex", flexDirection: "column", position: "fixed",
        top: 0, bottom: 0, [isRtl ? "right" : "left"]: 0, zIndex: 100, overflowY: "auto"
      }}>
        {/* Logo */}
        <div style={{ padding: "16px 14px", borderBottom: `1px solid ${themeS.border}`, display: "flex", alignItems: "center", gap: 8 }}>
          <KaroLogo size={30} />
          <div>
            <div style={{ fontWeight: 800, color: PRIMARY, fontSize: 14 }}>KARO GROUP</div>
            <div style={{ fontSize: 10, color: themeS.textMuted }}>{user.project}</div>
          </div>
        </div>
        {/* Cash Summary */}
        <div style={{ padding: "12px 14px", borderBottom: `1px solid ${themeS.border}`, background: dark ? "#0d0d0d" : `${PRIMARY}08` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: themeS.textMuted, marginBottom: 6, textTransform: "uppercase" }}>{t.cashBox}</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
            <span style={{ fontSize: 12 }}>{t.iqd}:</span>
            <span style={{ fontWeight: 700, color: cashIQD >= 0 ? themeS.success : themeS.danger, fontSize: 12 }}>{fmt(cashIQD)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12 }}>{t.usd}:</span>
            <span style={{ fontWeight: 700, color: cashUSD >= 0 ? themeS.success : themeS.danger, fontSize: 12 }}>${fmt(cashUSD)}</span>
          </div>
        </div>
        {/* Nav Items */}
        <nav style={{ flex: 1, padding: "8px 6px" }}>
          {sidebarItems.map(p => (
            <button key={p.id} onClick={() => setDashPage(p.id)} style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%",
              padding: "10px 12px", borderRadius: 8, border: "none",
              background: dashPage === p.id ? `${PRIMARY}18` : "transparent",
              color: dashPage === p.id ? PRIMARY : themeS.text,
              cursor: "pointer", fontSize: 13, fontWeight: dashPage === p.id ? 700 : 500,
              textAlign: isRtl ? "right" : "left", marginBottom: 1, transition: "all 0.2s"
            }}>{typeof p.icon === "string" ? <span style={{ fontSize: 16 }}>{p.icon}</span> : <span style={{ color: dashPage === p.id ? PRIMARY : themeS.textMuted }}>{p.icon}</span>}{p.label}</button>
          ))}
        </nav>
        {/* Bottom controls */}
        <div style={{ padding: "10px 14px", borderTop: `1px solid ${themeS.border}`, display: "flex", flexDirection: "column", gap: 6 }}>
          {/* Language */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
            <Icons.Globe />
            <select value={lang} onChange={e => setLang(e.target.value)} style={{ flex: 1, background: themeS.bgCard2, color: themeS.text, border: `1px solid ${themeS.border}`, borderRadius: 6, padding: "5px 8px", fontSize: 12, cursor: "pointer" }}>
              <option value="ku">کوردی</option><option value="en">English</option><option value="ar">عربي</option>
            </select>
          </div>
          <button onClick={() => setDark(!dark)} style={{ display: "flex", alignItems: "center", gap: 6, width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${themeS.border}`, background: themeS.bgCard2, color: themeS.text, cursor: "pointer", fontSize: 12 }}>
            {dark ? <Icons.Sun /> : <Icons.Moon />} {dark ? t.light : t.dark}
          </button>
          <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 6, width: "100%", padding: "8px 10px", borderRadius: 6, border: "none", background: "#FEE2E2", color: "#EF4444", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
            <Icons.Logout /> {t.logout}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, [isRtl ? "marginRight" : "marginLeft"]: 250, padding: "20px", minHeight: "100vh", width: "calc(100vw - 250px)" }}>
        <div style={{ maxWidth: "100%" }}>
          {dashPage === "reports" && <ReportsPage t={t} s={themeS} isRtl={isRtl} prefix={prefix} cashIQD={cashIQD} cashUSD={cashUSD} exchangeRate={exchangeRate} />}
          {dashPage === "expenses" && <ExpensesPage t={t} s={themeS} isRtl={isRtl} prefix={prefix} cashIQD={cashIQD} setCashIQD={setCashIQD} cashUSD={cashUSD} setCashUSD={setCashUSD} addCashLog={addCashLog} />}
          {dashPage === "loans" && <LoansPage t={t} s={themeS} isRtl={isRtl} prefix={prefix} cashIQD={cashIQD} setCashIQD={setCashIQD} cashUSD={cashUSD} setCashUSD={setCashUSD} addCashLog={addCashLog} />}
          {dashPage === "concrete" && <ConcretePage t={t} s={themeS} isRtl={isRtl} prefix={prefix} cashIQD={cashIQD} setCashIQD={setCashIQD} cashUSD={cashUSD} setCashUSD={setCashUSD} addCashLog={addCashLog} />}
          {dashPage === "contractor" && <ContractorPage t={t} s={themeS} isRtl={isRtl} prefix={prefix} cashIQD={cashIQD} setCashIQD={setCashIQD} cashUSD={cashUSD} setCashUSD={setCashUSD} addCashLog={addCashLog} />}
          {dashPage === "cash" && <CashPage t={t} s={themeS} isRtl={isRtl} cashIQD={cashIQD} setCashIQD={setCashIQD} cashUSD={cashUSD} setCashUSD={setCashUSD} exchangeRate={exchangeRate} cashLog={cashLog} />}
          {dashPage === "exchange" && <ExchangePage t={t} s={themeS} isRtl={isRtl} exchangeRate={exchangeRate} setExchangeRate={setExchangeRate} cashIQD={cashIQD} setCashIQD={setCashIQD} cashUSD={cashUSD} setCashUSD={setCashUSD} addCashLog={addCashLog} />}
          {dashPage === "invoice" && <InvoicePage t={t} s={themeS} isRtl={isRtl} prefix={prefix} />}
          {dashPage === "backup" && <BackupPage t={t} s={themeS} isRtl={isRtl} />}
          {dashPage === "history" && <HistoryPage t={t} s={themeS} isRtl={isRtl} cashLog={cashLog} />}
          {dashPage === "monthly" && <MonthlyReportPage t={t} s={themeS} isRtl={isRtl} prefix={prefix} cashIQD={cashIQD} cashUSD={cashUSD} />}
        </div>
      </main>

      <style>{`
        @media (max-width: 768px) { aside { width: 200px !important; min-width: 200px !important; } main { margin-left: 200px !important; margin-right: 200px !important; width: calc(100vw - 200px) !important; } }
        * { margin: 0; padding: 0; box-sizing: border-box; } body { margin: 0; }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-thumb { background: ${PRIMARY}40; border-radius: 3px; }
        input, select, textarea { font-family: inherit; }
        @media print { aside, .no-print { display: none !important; } main { margin: 0 !important; padding: 10px !important; width: 100% !important; } }
        @keyframes ping { 0% { transform: scale(1); opacity: 0.6; } 75%, 100% { transform: scale(1.6); opacity: 0; } }
      `}</style>
    </div>
  );
}

// ==================== REPORTS PAGE (Dashboard Home) ====================
function ReportsPage({ t, s, isRtl, prefix, cashIQD, cashUSD, exchangeRate }) {
  const expenses = getLS(`karo_expenses_${prefix}`, []);
  const loans = getLS(`karo_loans_${prefix}`, []);
  const concrete = getLS(`karo_concrete_${prefix}`, []);
  const contractor = getLS(`karo_contractor_${prefix}`, []);

  const totalExpIQD = expenses.reduce((a, b) => a + Number(b.amountIQD || 0), 0);
  const totalExpUSD = expenses.reduce((a, b) => a + Number(b.amountUSD || 0), 0);
  const totalConcReceived = concrete.reduce((a, b) => a + Number(b.received || 0), 0);
  const totalDeposit = concrete.reduce((a, b) => a + Number(b.deposit || 0), 0);
  const totalLoanTake = loans.filter(l => l.type === "take").reduce((a, b) => a + Number(b.amountIQD || 0), 0);
  const totalLoanGive = loans.filter(l => l.type === "give").reduce((a, b) => a + Number(b.amountIQD || 0), 0);

  const statCards = [
    { label: t.cashIQD, value: fmt(cashIQD) + " " + t.iqd, color: cashIQD >= 0 ? s.success : s.danger },
    { label: t.cashUSD, value: "$" + fmt(cashUSD), color: cashUSD >= 0 ? s.success : s.danger },
    { label: t.totalInIQD, value: fmt(Math.round(cashIQD + cashUSD * exchangeRate)) + " " + t.iqd, color: PRIMARY },
    { label: t.totalExpIQD, value: fmt(totalExpIQD) + " " + t.iqd, color: s.danger },
    { label: t.totalExpUSD, value: "$" + fmt(totalExpUSD), color: s.danger },
    { label: t.totalConcreteReceived, value: fmt(totalConcReceived) + " " + t.iqd, color: s.success },
    { label: t.totalDeposit, value: fmt(totalDeposit) + " " + t.iqd, color: "#F59E0B" },
    { label: t.loanTake, value: fmt(totalLoanTake) + " " + t.iqd, color: s.success },
    { label: t.loanGive, value: fmt(totalLoanGive) + " " + t.iqd, color: s.danger },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20, color: PRIMARY }}>{t.reportsTitle}</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
        {statCards.map((c, i) => (
          <Card key={i} s={s} style={{ borderTop: `3px solid ${c.color}`, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: s.textMuted, fontWeight: 600, marginBottom: 8, textTransform: "uppercase" }}>{c.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: c.color, direction: "ltr" }}>{c.value}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ==================== TABLE HEADER STYLE ====================
const thStyle = (isRtl) => ({
  padding: "10px 8px", textAlign: isRtl ? "right" : "left",
  fontWeight: 600, fontSize: 12, whiteSpace: "nowrap",
  background: PRIMARY, color: "#fff", position: "sticky", top: 0
});

// ==================== GENERIC LIST COMPONENT ====================
function ListPage({ t, s, isRtl, title, items, setItems, headers, renderRow, getRowData, totalRow, formContent, onSave, prefix, noImage = true }) {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [showMarkedOnly, setShowMarkedOnly] = useState(false);
  const [sizeModal, setSizeModal] = useState(null); // {type: 'pdf'|'excel'}
  const [imagePreview, setImagePreview] = useState(null);

  const months = [...new Set(items.map(it => it.date?.slice(0, 7)))].sort().reverse();

  const filtered = items.filter(it => {
    if (search && !Object.values(it).some(v => String(v || "").toLowerCase().includes(search.toLowerCase()))) return false;
    if (filterMonth && !it.date?.startsWith(filterMonth)) return false;
    if (showMarkedOnly && !it.marked) return false;
    return true;
  });

  const totals = totalRow ? totalRow(filtered) : null;

  const handleMark = (id) => { setItems(prev => prev.map(it => it.id === id ? { ...it, marked: !it.marked } : it)); };

  const handleExport = (type, size) => {
    const hdrs = headers.filter(h => h !== t.receiptImg);
    const rows = filtered.map(it => {
      const rd = getRowData(it);
      // remove image column
      const imgIdx = headers.indexOf(t.receiptImg);
      if (imgIdx >= 0) rd.splice(imgIdx, 0); // already no image in getRowData
      return rd;
    });
    const tRow = totals ? Object.values(totals) : null;
    if (type === "pdf") printTable({ title, headers: hdrs, rows, totalRow: tRow, size, isRtl });
    else exportExcel({ title, headers: hdrs, rows, totalRow: tRow });
    setSizeModal(null);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: PRIMARY }}>{title}</h1>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <Btn s={s} variant="ghost" onClick={() => setSizeModal({ type: "pdf" })}><Icons.File /> {t.savePDF}</Btn>
          <Btn s={s} variant="ghost" onClick={() => setSizeModal({ type: "excel" })}><Icons.Download /> {t.saveExcel}</Btn>
          <Btn s={s} onClick={() => setShowForm(!showForm)}><Icons.Plus /> {t.add}</Btn>
        </div>
      </div>

      {/* Totals on top */}
      {totals && (
        <div style={{ display: "flex", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
          {Object.entries(totals).map(([k, v]) => (
            <div key={k} style={{ background: `${PRIMARY}10`, borderRadius: 8, padding: "8px 16px", display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 11, color: s.textMuted, fontWeight: 600 }}>{k}:</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: PRIMARY, direction: "ltr" }}>{v}</span>
            </div>
          ))}
        </div>
      )}

      {/* Search & Filter */}
      <Card s={s} style={{ marginBottom: 12, padding: 14 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: 1, minWidth: 160 }}><Input s={s} label={t.search} placeholder={t.search} value={search} onChange={e => setSearch(e.target.value)} /></div>
          <Select s={s} label={t.filterMonth} value={filterMonth} onChange={e => setFilterMonth(e.target.value)}>
            <option value="">{t.allMonths}</option>
            {months.map(m => <option key={m} value={m}>{m}</option>)}
          </Select>
          {showMarkedOnly ? (
            <Btn s={s} variant="success" onClick={() => setShowMarkedOnly(false)}>{t.showAll}</Btn>
          ) : (
            <Btn s={s} variant="ghost" onClick={() => setShowMarkedOnly(true)}>{t.showMarked}</Btn>
          )}
        </div>
      </Card>

      {showForm && (
        <Card s={s} style={{ marginBottom: 12, border: `1px solid ${PRIMARY}40`, padding: 16 }}>
          {formContent}
          <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
            <Btn s={s} onClick={() => { onSave(); setShowForm(false); }}>{t.save}</Btn>
            <Btn s={s} variant="ghost" onClick={() => setShowForm(false)}>{t.cancel}</Btn>
          </div>
        </Card>
      )}

      {/* Table */}
      <Card s={s} style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr>{[...headers, t.mark, ""].map((h, i) => <th key={i} style={thStyle(isRtl)}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id} style={{ borderBottom: `1px solid ${s.border}`, background: item.marked ? `${PRIMARY}06` : "transparent" }}>
                  {renderRow(item, setImagePreview)}
                  <td style={{ padding: "8px 6px", textAlign: "center" }}>
                    <button onClick={() => handleMark(item.id)} style={{
                      width: 22, height: 22, borderRadius: 4, border: `2px solid ${item.marked ? PRIMARY : s.border}`,
                      background: item.marked ? PRIMARY : "transparent", cursor: "pointer",
                      display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", transition: "all 0.2s"
                    }}>{item.marked && <Icons.Check />}</button>
                  </td>
                  <td style={{ padding: "8px 6px" }}>
                    <div style={{ display: "flex", gap: 3 }}>
                      <button onClick={() => setItems(prev => prev.filter(it => it.id !== item.id))} style={{ background: "none", border: "none", color: s.danger, cursor: "pointer", padding: 2 }}><Icons.Trash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div style={{ padding: 40, textAlign: "center", color: s.textMuted }}>{t.noData}</div>}
        </div>
      </Card>

      {/* Size Picker */}
      {sizeModal && <SizePickerModal t={t} s={s} onSelect={(sz) => handleExport(sizeModal.type, sz)} onClose={() => setSizeModal(null)} />}

      {/* Image Preview */}
      {imagePreview && (
        <div onClick={() => setImagePreview(null)} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 20 }}>
          <img src={imagePreview} alt="" style={{ maxWidth: "90%", maxHeight: "90vh", borderRadius: 8 }} />
        </div>
      )}
    </div>
  );
}

// ==================== EXPENSES PAGE ====================
function ExpensesPage({ t, s, isRtl, prefix, cashIQD, setCashIQD, cashUSD, setCashUSD, addCashLog }) {
  const KEY = `karo_expenses_${prefix}`;
  const [items, setItems] = useState(getLS(KEY, []));
  const [form, setForm] = useState({ date: today(), receiptNo: "", receiptImg: "", amountIQD: "", amountUSD: "", note: "" });
  const [blockMsg, setBlockMsg] = useState("");
  useEffect(() => { setLS(KEY, items); }, [items, KEY]);

  const handleImgUpload = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm(prev => ({ ...prev, receiptImg: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const iqd = Number(form.amountIQD || 0);
    const usd = Number(form.amountUSD || 0);
    if (iqd === 0 && usd === 0) return;
    if (iqd > 0 && cashIQD < iqd) { setBlockMsg(t.noBalance); return; }
    if (usd > 0 && cashUSD < usd) { setBlockMsg(t.noBalance); return; }
    setItems(prev => [{ ...form, id: genId(), marked: false }, ...prev]);
    if (iqd > 0) setCashIQD(prev => prev - iqd);
    if (usd > 0) setCashUSD(prev => prev - usd);
    addCashLog(`${t.sidebar.expenses}: ${form.note || form.receiptNo}`, -iqd, -usd);
    setForm({ date: today(), receiptNo: "", receiptImg: "", amountIQD: "", amountUSD: "", note: "" });
    setBlockMsg("");
  };

  const headers = [t.date, t.receiptNo, t.receiptImg, t.amountIQD, t.amountUSD, t.note];

  const renderRow = (item, setImagePreview) => (<>
    <td style={{ padding: "8px 6px", direction: "ltr", whiteSpace: "nowrap", fontSize: 12 }}>{item.date}</td>
    <td style={{ padding: "8px 6px" }}>{item.receiptNo}</td>
    <td style={{ padding: "8px 6px" }}>
      {item.receiptImg ? (
        <div style={{ position: "relative", display: "inline-block" }}>
          <img src={item.receiptImg} alt="" style={{ width: 28, height: 28, objectFit: "cover", borderRadius: 4, cursor: "pointer" }} onClick={() => setImagePreview(item.receiptImg)} />
        </div>
      ) : "—"}
    </td>
    <td style={{ padding: "8px 6px", direction: "ltr", fontWeight: 600 }}>{Number(item.amountIQD) ? fmt(item.amountIQD) : "—"}</td>
    <td style={{ padding: "8px 6px", direction: "ltr", fontWeight: 600 }}>{Number(item.amountUSD) ? "$" + fmt(item.amountUSD) : "—"}</td>
    <td style={{ padding: "8px 6px", color: s.textMuted, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={item.note}>{truncate(item.note)}</td>
  </>);

  const getRowData = (item) => [item.date, item.receiptNo, Number(item.amountIQD) ? fmt(item.amountIQD) : "0", Number(item.amountUSD) ? fmt(item.amountUSD) : "0", item.note || ""];

  const totalRow = (filtered) => {
    const tIQD = filtered.reduce((a, b) => a + Number(b.amountIQD || 0), 0);
    const tUSD = filtered.reduce((a, b) => a + Number(b.amountUSD || 0), 0);
    return { [t.total + " " + t.iqd]: fmt(tIQD), [t.total + " " + t.usd]: "$" + fmt(tUSD) };
  };

  const formContent = (
    <>
      {blockMsg && <div style={{ background: "#FEE2E2", color: "#EF4444", padding: "10px 14px", borderRadius: 8, marginBottom: 12, fontSize: 13, fontWeight: 600 }}>{blockMsg}</div>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
        <Input s={s} label={t.date} type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
        <Input s={s} label={t.receiptNo} value={form.receiptNo} onChange={e => setForm({ ...form, receiptNo: e.target.value })} />
        <Input s={s} label={t.amountIQD} type="number" value={form.amountIQD} onChange={e => setForm({ ...form, amountIQD: e.target.value })} />
        <Input s={s} label={t.amountUSD} type="number" value={form.amountUSD} onChange={e => setForm({ ...form, amountUSD: e.target.value })} />
        <Input s={s} label={t.note} value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: s.textMuted }}>{t.receiptImg}</label>
          <label style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 8, border: `1px dashed ${s.border}`, background: s.bgCard2, cursor: "pointer", fontSize: 12, color: s.textMuted }}>
            <Icons.Upload /> {t.receiptImg}
            <input type="file" accept="image/*" onChange={handleImgUpload} style={{ display: "none" }} />
          </label>
          {form.receiptImg && (
            <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 4 }}>
              <img src={form.receiptImg} alt="" style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 4 }} />
              <button onClick={() => setForm(prev => ({ ...prev, receiptImg: "" }))} style={{ background: "none", border: "none", color: s.danger, cursor: "pointer", fontSize: 11 }}>{t.removeImg}</button>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return <ListPage t={t} s={s} isRtl={isRtl} title={t.sidebar.expenses} items={items} setItems={setItems} headers={headers} renderRow={renderRow} getRowData={getRowData} totalRow={totalRow} formContent={formContent} onSave={handleSave} prefix={prefix} />;
}

// ==================== LOANS PAGE ====================
function LoansPage({ t, s, isRtl, prefix, cashIQD, setCashIQD, cashUSD, setCashUSD, addCashLog }) {
  const KEY = `karo_loans_${prefix}`;
  const [items, setItems] = useState(getLS(KEY, []));
  const [form, setForm] = useState({ date: today(), type: "take", personName: "", amountIQD: "", amountUSD: "", note: "" });
  useEffect(() => { setLS(KEY, items); }, [items, KEY]);

  const handleSave = () => {
    const iqd = Number(form.amountIQD || 0), usd = Number(form.amountUSD || 0);
    if (iqd === 0 && usd === 0) return;
    if (form.type === "give") {
      if (iqd > cashIQD || usd > cashUSD) { alert(t.noBalance); return; }
      setCashIQD(prev => prev - iqd); setCashUSD(prev => prev - usd);
      addCashLog(`${t.loanGive}: ${form.personName}`, -iqd, -usd);
    } else {
      setCashIQD(prev => prev + iqd); setCashUSD(prev => prev + usd);
      addCashLog(`${t.loanTake}: ${form.personName}`, iqd, usd);
    }
    setItems(prev => [{ ...form, id: genId(), marked: false }, ...prev]);
    setForm({ date: today(), type: "take", personName: "", amountIQD: "", amountUSD: "", note: "" });
  };

  const headers = [t.date, t.loanType, t.personName, t.amountIQD, t.amountUSD, t.note];
  const renderRow = (item) => (<>
    <td style={{ padding: "8px 6px", direction: "ltr", whiteSpace: "nowrap" }}>{item.date}</td>
    <td style={{ padding: "8px 6px" }}><span style={{ padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 600, background: item.type === "take" ? "#D1FAE5" : "#FEE2E2", color: item.type === "take" ? "#059669" : "#EF4444" }}>{item.type === "take" ? t.loanTake : t.loanGive}</span></td>
    <td style={{ padding: "8px 6px", fontWeight: 600 }}>{item.personName}</td>
    <td style={{ padding: "8px 6px", direction: "ltr" }}>{Number(item.amountIQD) ? fmt(item.amountIQD) : "—"}</td>
    <td style={{ padding: "8px 6px", direction: "ltr" }}>{Number(item.amountUSD) ? "$" + fmt(item.amountUSD) : "—"}</td>
    <td style={{ padding: "8px 6px", color: s.textMuted, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={item.note}>{truncate(item.note)}</td>
  </>);
  const getRowData = (item) => [item.date, item.type === "take" ? t.loanTake : t.loanGive, item.personName, fmt(item.amountIQD || 0), fmt(item.amountUSD || 0), item.note || ""];
  const totalRow = (filtered) => {
    const take = filtered.filter(i => i.type === "take").reduce((a, b) => a + Number(b.amountIQD || 0), 0);
    const give = filtered.filter(i => i.type === "give").reduce((a, b) => a + Number(b.amountIQD || 0), 0);
    return { [t.loanTake]: fmt(take), [t.loanGive]: fmt(give) };
  };
  const formContent = (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
      <Input s={s} label={t.date} type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
      <Select s={s} label={t.loanType} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}><option value="take">{t.loanTake}</option><option value="give">{t.loanGive}</option></Select>
      <Input s={s} label={t.personName} value={form.personName} onChange={e => setForm({ ...form, personName: e.target.value })} />
      <Input s={s} label={t.amountIQD} type="number" value={form.amountIQD} onChange={e => setForm({ ...form, amountIQD: e.target.value })} />
      <Input s={s} label={t.amountUSD} type="number" value={form.amountUSD} onChange={e => setForm({ ...form, amountUSD: e.target.value })} />
      <Input s={s} label={t.note} value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
    </div>
  );
  return <ListPage t={t} s={s} isRtl={isRtl} title={t.sidebar.loans} items={items} setItems={setItems} headers={headers} renderRow={renderRow} getRowData={getRowData} totalRow={totalRow} formContent={formContent} onSave={handleSave} prefix={prefix} />;
}

// ==================== CONCRETE PAGE ====================
function ConcretePage({ t, s, isRtl, prefix, cashIQD, setCashIQD, cashUSD, setCashUSD, addCashLog }) {
  const KEY = `karo_concrete_${prefix}`;
  const [items, setItems] = useState(getLS(KEY, []));
  const [form, setForm] = useState({ date: today(), meters: "", pricePerMeter: "", deposit: "", note: "" });
  useEffect(() => { setLS(KEY, items); }, [items, KEY]);

  const totalPrice = Number(form.meters || 0) * Number(form.pricePerMeter || 0);
  const received = totalPrice - Number(form.deposit || 0);

  const handleSave = () => {
    const dep = Number(form.deposit || 0);
    if (dep > 0 && dep > cashIQD) { alert(t.noBalance); return; }
    setItems(prev => [{ ...form, id: genId(), totalPrice, received, marked: false }, ...prev]);
    if (dep > 0) { setCashIQD(prev => prev - dep); addCashLog(`${t.deposit} ${t.sidebar.concrete}`, -dep, 0); }
    if (received > 0) { setCashIQD(prev => prev + received); addCashLog(`${t.received} ${t.sidebar.concrete}`, received, 0); }
    setForm({ date: today(), meters: "", pricePerMeter: "", deposit: "", note: "" });
  };

  const headers = [t.date, t.meters, t.pricePerMeter, t.totalConcrete, t.deposit, t.received, t.note];
  const renderRow = (item) => (<>
    <td style={{ padding: "8px 6px", direction: "ltr", whiteSpace: "nowrap" }}>{item.date}</td>
    <td style={{ padding: "8px 6px", direction: "ltr" }}>{fmt(item.meters)}</td>
    <td style={{ padding: "8px 6px", direction: "ltr" }}>{fmt(item.pricePerMeter)}</td>
    <td style={{ padding: "8px 6px", direction: "ltr", fontWeight: 700, color: PRIMARY }}>{fmt(item.totalPrice)}</td>
    <td style={{ padding: "8px 6px", direction: "ltr", color: s.danger }}>{fmt(item.deposit)}</td>
    <td style={{ padding: "8px 6px", direction: "ltr", color: s.success, fontWeight: 700 }}>{fmt(item.received)}</td>
    <td style={{ padding: "8px 6px", color: s.textMuted, maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={item.note}>{truncate(item.note)}</td>
  </>);
  const getRowData = (item) => [item.date, fmt(item.meters), fmt(item.pricePerMeter), fmt(item.totalPrice), fmt(item.deposit), fmt(item.received), item.note || ""];
  const totalRow = (filtered) => {
    const tRec = filtered.reduce((a, b) => a + Number(b.received || 0), 0);
    const tDep = filtered.reduce((a, b) => a + Number(b.deposit || 0), 0);
    return { [t.received]: fmt(tRec), [t.deposit]: fmt(tDep) };
  };
  const formContent = (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
      <Input s={s} label={t.date} type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
      <Input s={s} label={t.meters} type="number" value={form.meters} onChange={e => setForm({ ...form, meters: e.target.value })} />
      <Input s={s} label={t.pricePerMeter} type="number" value={form.pricePerMeter} onChange={e => setForm({ ...form, pricePerMeter: e.target.value })} />
      <div><label style={{ fontSize: 11, fontWeight: 600, color: s.textMuted }}>{t.totalConcrete}</label><div style={{ padding: "8px 12px", borderRadius: 8, background: `${PRIMARY}10`, fontWeight: 700, color: PRIMARY, fontSize: 13 }}>{fmt(totalPrice)}</div></div>
      <Input s={s} label={t.deposit} type="number" value={form.deposit} onChange={e => setForm({ ...form, deposit: e.target.value })} />
      <div><label style={{ fontSize: 11, fontWeight: 600, color: s.textMuted }}>{t.received}</label><div style={{ padding: "8px 12px", borderRadius: 8, background: "#D1FAE5", fontWeight: 700, color: "#059669", fontSize: 13 }}>{fmt(received)}</div></div>
      <Input s={s} label={t.note} value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
    </div>
  );
  return <ListPage t={t} s={s} isRtl={isRtl} title={t.sidebar.concrete} items={items} setItems={setItems} headers={headers} renderRow={renderRow} getRowData={getRowData} totalRow={totalRow} formContent={formContent} onSave={handleSave} prefix={prefix} />;
}

// ==================== CONTRACTOR PAGE ====================
function ContractorPage({ t, s, isRtl, prefix, cashIQD, setCashIQD, cashUSD, setCashUSD, addCashLog }) {
  const KEY = `karo_contractor_${prefix}`;
  const [items, setItems] = useState(getLS(KEY, []));
  const [form, setForm] = useState({ date: today(), type: "withdraw", amountIQD: "", amountUSD: "", note: "" });
  useEffect(() => { setLS(KEY, items); }, [items, KEY]);

  const handleSave = () => {
    const iqd = Number(form.amountIQD || 0), usd = Number(form.amountUSD || 0);
    if (iqd === 0 && usd === 0) return;
    if (form.type === "withdraw") {
      if (iqd > cashIQD || usd > cashUSD) { alert(t.noBalance); return; }
      setCashIQD(prev => prev - iqd); setCashUSD(prev => prev - usd);
      addCashLog(`${t.withdraw} ${t.sidebar.contractor}`, -iqd, -usd);
    } else {
      setCashIQD(prev => prev + iqd); setCashUSD(prev => prev + usd);
      addCashLog(`${t.addMoney} ${t.sidebar.contractor}`, iqd, usd);
    }
    setItems(prev => [{ ...form, id: genId(), marked: false }, ...prev]);
    setForm({ date: today(), type: "withdraw", amountIQD: "", amountUSD: "", note: "" });
  };

  const headers = [t.date, t.contractorType, t.amountIQD, t.amountUSD, t.note];
  const renderRow = (item) => (<>
    <td style={{ padding: "8px 6px", direction: "ltr", whiteSpace: "nowrap" }}>{item.date}</td>
    <td style={{ padding: "8px 6px" }}><span style={{ padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 600, background: item.type === "add" ? "#D1FAE5" : "#FEE2E2", color: item.type === "add" ? "#059669" : "#EF4444" }}>{item.type === "add" ? t.addMoney : t.withdraw}</span></td>
    <td style={{ padding: "8px 6px", direction: "ltr", fontWeight: 600 }}>{Number(item.amountIQD) ? fmt(item.amountIQD) : "—"}</td>
    <td style={{ padding: "8px 6px", direction: "ltr", fontWeight: 600 }}>{Number(item.amountUSD) ? "$" + fmt(item.amountUSD) : "—"}</td>
    <td style={{ padding: "8px 6px", color: s.textMuted, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={item.note}>{truncate(item.note)}</td>
  </>);
  const getRowData = (item) => [item.date, item.type === "add" ? t.addMoney : t.withdraw, fmt(item.amountIQD || 0), fmt(item.amountUSD || 0), item.note || ""];
  const totalRow = (filtered) => {
    const wIQD = filtered.filter(i => i.type === "withdraw").reduce((a, b) => a + Number(b.amountIQD || 0), 0);
    const aIQD = filtered.filter(i => i.type === "add").reduce((a, b) => a + Number(b.amountIQD || 0), 0);
    return { [t.withdraw]: fmt(wIQD), [t.addMoney]: fmt(aIQD) };
  };
  const formContent = (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
      <Input s={s} label={t.date} type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
      <Select s={s} label={t.contractorType} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}><option value="withdraw">{t.withdraw}</option><option value="add">{t.addMoney}</option></Select>
      <Input s={s} label={t.amountIQD} type="number" value={form.amountIQD} onChange={e => setForm({ ...form, amountIQD: e.target.value })} />
      <Input s={s} label={t.amountUSD} type="number" value={form.amountUSD} onChange={e => setForm({ ...form, amountUSD: e.target.value })} />
      <Input s={s} label={t.note} value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
    </div>
  );
  return <ListPage t={t} s={s} isRtl={isRtl} title={t.sidebar.contractor} items={items} setItems={setItems} headers={headers} renderRow={renderRow} getRowData={getRowData} totalRow={totalRow} formContent={formContent} onSave={handleSave} prefix={prefix} />;
}

// ==================== CASH PAGE ====================
function CashPage({ t, s, isRtl, cashIQD, setCashIQD, cashUSD, setCashUSD, exchangeRate, cashLog }) {
  const [editIQD, setEditIQD] = useState(false);
  const [editUSD, setEditUSD] = useState(false);
  const [tempIQD, setTempIQD] = useState(cashIQD);
  const [tempUSD, setTempUSD] = useState(cashUSD);
  const totalInIQD = cashIQD + (cashUSD * exchangeRate);

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20, color: PRIMARY }}>{t.sidebar.cash}</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 20 }}>
        <Card s={s} style={{ textAlign: "center", cursor: "pointer", borderTop: `3px solid ${s.success}` }} onClick={() => { if (!editIQD) { setEditIQD(true); setTempIQD(cashIQD); } }}>
          <div style={{ fontSize: 11, color: s.textMuted, fontWeight: 600, marginBottom: 6 }}>{t.cashIQD}</div>
          {editIQD ? (
            <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center" }}>
              <input type="number" value={tempIQD} onChange={e => setTempIQD(Number(e.target.value))} style={{ width: 130, padding: "6px 10px", borderRadius: 6, border: `1px solid ${PRIMARY}`, background: s.bgCard2, color: s.text, fontSize: 16, textAlign: "center", outline: "none", direction: "ltr" }} autoFocus />
              <Btn s={s} onClick={e => { e.stopPropagation(); setCashIQD(tempIQD); setEditIQD(false); }} style={{ padding: "4px 10px" }}>{t.save}</Btn>
            </div>
          ) : (<><div style={{ fontSize: 24, fontWeight: 800, color: cashIQD >= 0 ? s.success : s.danger, direction: "ltr" }}>{fmt(cashIQD)}</div><div style={{ fontSize: 10, color: s.textMuted, marginTop: 3 }}>{t.clickToChange}</div></>)}
        </Card>
        <Card s={s} style={{ textAlign: "center", cursor: "pointer", borderTop: `3px solid ${s.success}` }} onClick={() => { if (!editUSD) { setEditUSD(true); setTempUSD(cashUSD); } }}>
          <div style={{ fontSize: 11, color: s.textMuted, fontWeight: 600, marginBottom: 6 }}>{t.cashUSD}</div>
          {editUSD ? (
            <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center" }}>
              <input type="number" value={tempUSD} onChange={e => setTempUSD(Number(e.target.value))} style={{ width: 130, padding: "6px 10px", borderRadius: 6, border: `1px solid ${PRIMARY}`, background: s.bgCard2, color: s.text, fontSize: 16, textAlign: "center", outline: "none", direction: "ltr" }} autoFocus />
              <Btn s={s} onClick={e => { e.stopPropagation(); setCashUSD(tempUSD); setEditUSD(false); }} style={{ padding: "4px 10px" }}>{t.save}</Btn>
            </div>
          ) : (<><div style={{ fontSize: 24, fontWeight: 800, color: cashUSD >= 0 ? s.success : s.danger, direction: "ltr" }}>${fmt(cashUSD)}</div><div style={{ fontSize: 10, color: s.textMuted, marginTop: 3 }}>{t.clickToChange}</div></>)}
        </Card>
        <Card s={s} style={{ textAlign: "center", borderTop: `3px solid ${PRIMARY}`, background: `${PRIMARY}05` }}>
          <div style={{ fontSize: 11, color: s.textMuted, fontWeight: 600, marginBottom: 6 }}>{t.totalInIQD}</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: PRIMARY, direction: "ltr" }}>{fmt(Math.round(totalInIQD))}</div>
          <div style={{ fontSize: 10, color: s.textMuted, marginTop: 3 }}>1$ = {fmt(exchangeRate)} {t.iqd}</div>
        </Card>
      </div>

      <Card s={s} style={{ padding: 0, overflow: "hidden" }}>
        <h3 style={{ padding: "14px 16px 0", fontWeight: 700, fontSize: 15 }}>{t.cashLog}</h3>
        <div style={{ overflowX: "auto", maxHeight: 450, overflowY: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead><tr>{[t.date, "", t.type, t.iqd, t.usd].map((h, i) => <th key={i} style={thStyle(isRtl)}>{h}</th>)}</tr></thead>
            <tbody>
              {[...cashLog].reverse().map(log => (
                <tr key={log.id} style={{ borderBottom: `1px solid ${s.border}` }}>
                  <td style={{ padding: "7px 6px", direction: "ltr", fontSize: 11 }}>{log.date}</td>
                  <td style={{ padding: "7px 6px", fontSize: 10, color: s.textMuted }}>{log.time}</td>
                  <td style={{ padding: "7px 6px" }}>{log.desc}</td>
                  <td style={{ padding: "7px 6px", direction: "ltr", color: log.iqd >= 0 ? s.success : s.danger, fontWeight: 600 }}>{log.iqd >= 0 ? "+" : ""}{fmt(log.iqd)}</td>
                  <td style={{ padding: "7px 6px", direction: "ltr", color: log.usd >= 0 ? s.success : s.danger, fontWeight: 600 }}>{log.usd >= 0 ? "+" : ""}${fmt(log.usd)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ==================== EXCHANGE PAGE ====================
function ExchangePage({ t, s, isRtl, exchangeRate, setExchangeRate, cashIQD, setCashIQD, cashUSD, setCashUSD, addCashLog }) {
  const [tempRate, setTempRate] = useState(exchangeRate);
  const [direction, setDirection] = useState("usd_to_iqd");
  const [amount, setAmount] = useState("");
  const result = direction === "usd_to_iqd" ? Number(amount || 0) * exchangeRate : Number(amount || 0) / exchangeRate;

  const handleConvert = () => {
    const amt = Number(amount || 0); if (amt <= 0) return;
    if (direction === "usd_to_iqd") {
      if (amt > cashUSD) { alert(t.noBalance); return; }
      setCashUSD(prev => prev - amt); setCashIQD(prev => prev + Math.round(amt * exchangeRate));
      addCashLog(`${t.convert}: $${amt} → ${fmt(Math.round(amt * exchangeRate))}`, Math.round(amt * exchangeRate), -amt);
    } else {
      if (amt > cashIQD) { alert(t.noBalance); return; }
      setCashIQD(prev => prev - amt); setCashUSD(prev => prev + Math.round(amt / exchangeRate));
      addCashLog(`${t.convert}: ${fmt(amt)} → $${Math.round(amt / exchangeRate)}`, -amt, Math.round(amt / exchangeRate));
    }
    setAmount("");
  };

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20, color: PRIMARY }}>{t.sidebar.exchange}</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        <Card s={s}>
          <h3 style={{ marginBottom: 14, fontWeight: 700, fontSize: 15 }}>{t.exchangeRate}</h3>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
            <Input s={s} label="1 USD =" type="number" value={tempRate} onChange={e => setTempRate(Number(e.target.value))} style={{ flex: 1 }} />
            <Btn s={s} onClick={() => setExchangeRate(tempRate)}>{t.saveRate}</Btn>
          </div>
          <div style={{ marginTop: 10, padding: "10px 14px", background: `${PRIMARY}10`, borderRadius: 8, textAlign: "center" }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: PRIMARY }}>1$ = {fmt(exchangeRate)} {t.iqd}</span>
          </div>
        </Card>
        <Card s={s}>
          <h3 style={{ marginBottom: 14, fontWeight: 700, fontSize: 15 }}>{t.convert}</h3>
          <Select s={s} label={t.convertTo} value={direction} onChange={e => setDirection(e.target.value)} style={{ marginBottom: 10 }}><option value="usd_to_iqd">{t.fromUSD}</option><option value="iqd_to_usd">{t.fromIQD}</option></Select>
          <Input s={s} label={t.amount} type="number" value={amount} onChange={e => setAmount(e.target.value)} style={{ marginBottom: 10 }} />
          <div style={{ padding: "14px", background: "#D1FAE5", borderRadius: 8, textAlign: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: s.textMuted }}>{t.result}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#059669", direction: "ltr" }}>{direction === "usd_to_iqd" ? `${fmt(Math.round(result))} ${t.iqd}` : `$${fmt(Math.round(result * 100) / 100)}`}</div>
          </div>
          <Btn s={s} onClick={handleConvert} style={{ width: "100%", justifyContent: "center" }}>{t.convert}</Btn>
        </Card>
      </div>
    </div>
  );
}

// ==================== INVOICE PAGE ====================
function InvoicePage({ t, s, isRtl, prefix }) {
  const KEY = `karo_invoices_${prefix}`;
  const [invoices, setInvoices] = useState(getLS(KEY, []));
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: today(), invoiceNo: "", items: [{ name: "", qty: "", price: "", note: "" }] });
  const [preview, setPreview] = useState(null);
  useEffect(() => { setLS(KEY, invoices); }, [invoices, KEY]);

  const addItem = () => setForm({ ...form, items: [...form.items, { name: "", qty: "", price: "", note: "" }] });
  const removeItem = (i) => setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) });
  const updateItem = (i, field, val) => { const n = [...form.items]; n[i] = { ...n[i], [field]: val }; setForm({ ...form, items: n }); };
  const invoiceTotal = form.items.reduce((a, b) => a + (Number(b.qty || 0) * Number(b.price || 0)), 0);

  const handleSave = () => {
    setInvoices(prev => [{ ...form, id: genId(), total: invoiceTotal, marked: false }, ...prev]);
    setForm({ date: today(), invoiceNo: "", items: [{ name: "", qty: "", price: "", note: "" }] });
    setShowForm(false);
  };

  const printInvoice = (inv) => {
    const w = window.open("", "_blank");
    w.document.write(`<html dir="${isRtl ? "rtl" : "ltr"}"><head><title>Invoice</title><style>
      body { font-family: sans-serif; padding: 40px; max-width: 700px; margin: 0 auto; }
      .header { text-align: center; margin-bottom: 24px; border-bottom: 3px solid ${PRIMARY}; padding-bottom: 16px; }
      .header h1 { color: ${PRIMARY}; font-size: 26px; margin: 0; }
      table { width: 100%; border-collapse: collapse; margin-top: 16px; }
      th { background: ${PRIMARY}; color: white; padding: 8px; }
      td { border: 1px solid #ddd; padding: 8px; text-align: center; }
      .total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 16px; color: ${PRIMARY}; }
    </style></head><body>
    <div class="header"><h1>KARO GROUP</h1></div>
    <div style="display:flex;justify-content:space-between;margin-bottom:16px"><div><strong>${t.invoiceNo}:</strong> ${inv.invoiceNo}</div><div><strong>${t.date}:</strong> ${inv.date}</div></div>
    <table><thead><tr><th>#</th><th>${t.itemName}</th><th>${t.qty}</th><th>${t.price}</th><th>${t.total}</th><th>${t.note}</th></tr></thead><tbody>
    ${inv.items.map((it, i) => `<tr><td>${i + 1}</td><td>${it.name}</td><td>${it.qty}</td><td>${fmt(it.price)}</td><td>${fmt(Number(it.qty || 0) * Number(it.price || 0))}</td><td>${it.note || ""}</td></tr>`).join("")}
    </tbody></table><div class="total">${t.total}: ${fmt(inv.total)} ${t.iqd}</div></body></html>`);
    w.document.close(); w.print();
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: PRIMARY }}>{t.sidebar.invoice}</h1>
        <Btn s={s} onClick={() => setShowForm(!showForm)}><Icons.Plus /> {t.add}</Btn>
      </div>

      {showForm && (
        <Card s={s} style={{ marginBottom: 14, border: `1px solid ${PRIMARY}40`, padding: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            <Input s={s} label={t.date} type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            <Input s={s} label={t.invoiceNo} value={form.invoiceNo} onChange={e => setForm({ ...form, invoiceNo: e.target.value })} />
          </div>
          {form.items.map((item, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: 6, marginBottom: 6, alignItems: "flex-end" }}>
              <Input s={s} label={i === 0 ? t.itemName : ""} value={item.name} onChange={e => updateItem(i, "name", e.target.value)} />
              <Input s={s} label={i === 0 ? t.qty : ""} type="number" value={item.qty} onChange={e => updateItem(i, "qty", e.target.value)} />
              <Input s={s} label={i === 0 ? t.price : ""} type="number" value={item.price} onChange={e => updateItem(i, "price", e.target.value)} />
              <Input s={s} label={i === 0 ? t.note : ""} value={item.note} onChange={e => updateItem(i, "note", e.target.value)} />
              {form.items.length > 1 && <button onClick={() => removeItem(i)} style={{ background: "none", border: "none", color: s.danger, cursor: "pointer", padding: 6 }}><Icons.Trash /></button>}
            </div>
          ))}
          <Btn s={s} variant="ghost" onClick={addItem} style={{ fontSize: 11, marginBottom: 10 }}><Icons.Plus /> {t.addItem}</Btn>
          <div style={{ padding: "10px 14px", background: `${PRIMARY}10`, borderRadius: 8, textAlign: "center", marginBottom: 10 }}>
            <span style={{ fontWeight: 800, color: PRIMARY, fontSize: 16 }}>{t.total}: {fmt(invoiceTotal)} {t.iqd}</span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <Btn s={s} onClick={handleSave}>{t.save}</Btn>
            <Btn s={s} variant="ghost" onClick={() => setShowForm(false)}>{t.cancel}</Btn>
          </div>
        </Card>
      )}

      <Card s={s} style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead><tr>{[t.date, t.invoiceNo, t.total, ""].map((h, i) => <th key={i} style={thStyle(isRtl)}>{h}</th>)}</tr></thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id} style={{ borderBottom: `1px solid ${s.border}` }}>
                  <td style={{ padding: "8px 6px", direction: "ltr", whiteSpace: "nowrap" }}>{inv.date}</td>
                  <td style={{ padding: "8px 6px", fontWeight: 600 }}>{inv.invoiceNo}</td>
                  <td style={{ padding: "8px 6px", direction: "ltr", fontWeight: 700, color: PRIMARY }}>{fmt(inv.total)} {t.iqd}</td>
                  <td style={{ padding: "8px 6px" }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      <Btn s={s} variant="ghost" onClick={() => printInvoice(inv)} style={{ padding: "3px 8px", fontSize: 10 }}><Icons.Printer /></Btn>
                      <Btn s={s} variant="ghost" onClick={() => setPreview(inv)} style={{ padding: "3px 8px", fontSize: 10 }}><Icons.Eye /></Btn>
                      <button onClick={() => setInvoices(prev => prev.filter(it => it.id !== inv.id))} style={{ background: "none", border: "none", color: s.danger, cursor: "pointer" }}><Icons.Trash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {preview && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", color: "#000", borderRadius: 12, padding: 36, maxWidth: 650, width: "100%", maxHeight: "90vh", overflow: "auto" }}>
            <div style={{ textAlign: "center", borderBottom: `3px solid ${PRIMARY}`, paddingBottom: 14, marginBottom: 16 }}>
              <h2 style={{ color: PRIMARY, margin: 0 }}>KARO GROUP</h2>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, fontSize: 13 }}>
              <div><strong>{t.invoiceNo}:</strong> {preview.invoiceNo}</div>
              <div><strong>{t.date}:</strong> {preview.date}</div>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginBottom: 14 }}>
              <thead><tr style={{ background: PRIMARY, color: "#fff" }}><th style={{ padding: 6 }}>#</th><th style={{ padding: 6 }}>{t.itemName}</th><th style={{ padding: 6 }}>{t.qty}</th><th style={{ padding: 6 }}>{t.price}</th><th style={{ padding: 6 }}>{t.total}</th></tr></thead>
              <tbody>{preview.items.map((it, i) => (<tr key={i} style={{ borderBottom: "1px solid #ddd", textAlign: "center" }}><td style={{ padding: 6 }}>{i + 1}</td><td style={{ padding: 6 }}>{it.name}</td><td style={{ padding: 6 }}>{it.qty}</td><td style={{ padding: 6 }}>{fmt(it.price)}</td><td style={{ padding: 6, fontWeight: 600 }}>{fmt(Number(it.qty || 0) * Number(it.price || 0))}</td></tr>))}</tbody>
            </table>
            <div style={{ textAlign: "right", fontSize: 18, fontWeight: 800, color: PRIMARY }}>{t.total}: {fmt(preview.total)} {t.iqd}</div>
            <div style={{ textAlign: "center", marginTop: 20 }}><Btn s={s} variant="ghost" onClick={() => setPreview(null)} style={{ color: "#333", borderColor: "#ddd" }}>{t.cancel}</Btn></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== BACKUP PAGE ====================
function BackupPage({ t, s, isRtl }) {
  const handleDownload = () => {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("karo_")) data[key] = localStorage.getItem(key);
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `karo_backup_${today()}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpload = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        Object.entries(data).forEach(([k, v]) => localStorage.setItem(k, v));
        alert(t.backupSuccess);
        window.location.reload();
      } catch { alert("Error"); }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20, color: PRIMARY }}>{t.sidebar.backup}</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
        <Card s={s} style={{ textAlign: "center", padding: 30 }}>
          <Icons.Download />
          <h3 style={{ margin: "12px 0 8px", fontWeight: 700 }}>{t.downloadBackup}</h3>
          <Btn s={s} onClick={handleDownload} style={{ marginTop: 8 }}><Icons.Download /> {t.downloadBackup}</Btn>
        </Card>
        <Card s={s} style={{ textAlign: "center", padding: 30 }}>
          <Icons.Upload />
          <h3 style={{ margin: "12px 0 8px", fontWeight: 700 }}>{t.uploadBackup}</h3>
          <label style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, background: PRIMARY, color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600, marginTop: 8 }}>
            <Icons.Upload /> {t.uploadBackup}
            <input type="file" accept=".json" onChange={handleUpload} style={{ display: "none" }} />
          </label>
        </Card>
      </div>
    </div>
  );
}

// ==================== HISTORY PAGE ====================
function HistoryPage({ t, s, isRtl, cashLog }) {
  const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 30);
  const cutoffStr = cutoff.toISOString().split("T")[0];
  const recent = cashLog.filter(l => l.date >= cutoffStr);

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6, color: PRIMARY }}>{t.sidebar.history}</h1>
      <p style={{ color: s.textMuted, fontSize: 12, marginBottom: 16 }}>{t.last30days}</p>
      <Card s={s} style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto", maxHeight: 500, overflowY: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead><tr>{[t.date, "", t.type, t.iqd, t.usd].map((h, i) => <th key={i} style={thStyle(isRtl)}>{h}</th>)}</tr></thead>
            <tbody>
              {[...recent].reverse().map(log => (
                <tr key={log.id} style={{ borderBottom: `1px solid ${s.border}` }}>
                  <td style={{ padding: "7px 6px", direction: "ltr", fontSize: 11 }}>{log.date}</td>
                  <td style={{ padding: "7px 6px", fontSize: 10, color: s.textMuted }}>{log.time}</td>
                  <td style={{ padding: "7px 6px" }}>{log.desc}</td>
                  <td style={{ padding: "7px 6px", direction: "ltr", color: log.iqd >= 0 ? s.success : s.danger, fontWeight: 600 }}>{log.iqd >= 0 ? "+" : ""}{fmt(log.iqd)}</td>
                  <td style={{ padding: "7px 6px", direction: "ltr", color: log.usd >= 0 ? s.success : s.danger, fontWeight: 600 }}>{log.usd >= 0 ? "+" : ""}${fmt(log.usd)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {recent.length === 0 && <div style={{ padding: 40, textAlign: "center", color: s.textMuted }}>{t.noData}</div>}
        </div>
      </Card>
    </div>
  );
}

// ==================== MONTHLY REPORT PAGE ====================
function MonthlyReportPage({ t, s, isRtl, prefix, cashIQD, cashUSD }) {
  const expenses = getLS(`karo_expenses_${prefix}`, []);
  const concrete = getLS(`karo_concrete_${prefix}`, []);
  const [sizeModal, setSizeModal] = useState(null);

  const currentMonth = today().slice(0, 7);
  const monthlyExp = expenses.filter(e => e.date?.startsWith(currentMonth));
  const monthlyConc = concrete.filter(c => c.date?.startsWith(currentMonth));

  const totalExpIQD = monthlyExp.reduce((a, b) => a + Number(b.amountIQD || 0), 0);
  const totalExpUSD = monthlyExp.reduce((a, b) => a + Number(b.amountUSD || 0), 0);
  const totalConcRec = monthlyConc.reduce((a, b) => a + Number(b.received || 0), 0);
  const totalConcDep = monthlyConc.reduce((a, b) => a + Number(b.deposit || 0), 0);

  const handleExport = (type, size) => {
    const headers = [t.type, t.iqd, t.usd];
    const rows = [
      [t.totalExpIQD, fmt(totalExpIQD), "—"],
      [t.totalExpUSD, "—", "$" + fmt(totalExpUSD)],
      [t.totalConcreteReceived, fmt(totalConcRec), "—"],
      [t.totalDeposit, fmt(totalConcDep), "—"],
    ];
    if (type === "pdf") printTable({ title: `${t.sidebar.monthlyReport} — ${currentMonth}`, headers, rows, size, isRtl });
    else exportExcel({ title: `monthly_${currentMonth}`, headers, rows });
    setSizeModal(null);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: PRIMARY }}>{t.sidebar.monthlyReport} — {currentMonth}</h1>
        <div style={{ display: "flex", gap: 6 }}>
          <Btn s={s} variant="ghost" onClick={() => setSizeModal({ type: "pdf" })}><Icons.File /> {t.savePDF}</Btn>
          <Btn s={s} variant="ghost" onClick={() => setSizeModal({ type: "excel" })}><Icons.Download /> {t.saveExcel}</Btn>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
        <Card s={s} style={{ borderTop: `3px solid ${s.danger}`, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: s.textMuted, fontWeight: 600, marginBottom: 6 }}>{t.totalExpIQD}</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: s.danger, direction: "ltr" }}>{fmt(totalExpIQD)}</div>
        </Card>
        <Card s={s} style={{ borderTop: `3px solid ${s.danger}`, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: s.textMuted, fontWeight: 600, marginBottom: 6 }}>{t.totalExpUSD}</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: s.danger, direction: "ltr" }}>${fmt(totalExpUSD)}</div>
        </Card>
        <Card s={s} style={{ borderTop: `3px solid ${s.success}`, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: s.textMuted, fontWeight: 600, marginBottom: 6 }}>{t.totalConcreteReceived}</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: s.success, direction: "ltr" }}>{fmt(totalConcRec)}</div>
        </Card>
        <Card s={s} style={{ borderTop: `3px solid #F59E0B`, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: s.textMuted, fontWeight: 600, marginBottom: 6 }}>{t.totalDeposit}</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#F59E0B", direction: "ltr" }}>{fmt(totalConcDep)}</div>
        </Card>
      </div>

      {/* Expenses List */}
      <Card s={s} style={{ marginTop: 16, padding: 0, overflow: "hidden" }}>
        <h3 style={{ padding: "12px 14px 0", fontWeight: 700, fontSize: 14 }}>{t.sidebar.expenses}</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead><tr>{[t.date, t.receiptNo, t.amountIQD, t.amountUSD, t.note].map((h, i) => <th key={i} style={thStyle(isRtl)}>{h}</th>)}</tr></thead>
            <tbody>
              {monthlyExp.map(item => (
                <tr key={item.id} style={{ borderBottom: `1px solid ${s.border}` }}>
                  <td style={{ padding: "7px 6px", direction: "ltr", whiteSpace: "nowrap" }}>{item.date}</td>
                  <td style={{ padding: "7px 6px" }}>{item.receiptNo}</td>
                  <td style={{ padding: "7px 6px", direction: "ltr", fontWeight: 600 }}>{Number(item.amountIQD) ? fmt(item.amountIQD) : "—"}</td>
                  <td style={{ padding: "7px 6px", direction: "ltr", fontWeight: 600 }}>{Number(item.amountUSD) ? "$" + fmt(item.amountUSD) : "—"}</td>
                  <td style={{ padding: "7px 6px", color: s.textMuted }}>{item.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {monthlyExp.length === 0 && <div style={{ padding: 30, textAlign: "center", color: s.textMuted }}>{t.noData}</div>}
        </div>
      </Card>

      {sizeModal && <SizePickerModal t={t} s={s} onSelect={(sz) => handleExport(sizeModal.type, sz)} onClose={() => setSizeModal(null)} />}
    </div>
  );
}
