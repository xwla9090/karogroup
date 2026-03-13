import { useState, useEffect, useRef, useCallback, useMemo } from "react";

const PRIMARY = "#4DAF94";
const PRIMARY_DARK = "#3D9A82";
const PHONE = "+964 770 153 6017";
const EMAIL = "hawbirranya6@gmail.com";

const PROJECT_IMAGES = [
  { src: "https://i.ibb.co/5h46CW2n/IMG-0443.jpg", desc_ku: "بیناسازی نیشتەجێبوون", desc_en: "Residential Construction", desc_ar: "بناء سكني" },
  { src: "https://i.ibb.co/VYgVY00f/IMG-0442.jpg", desc_ku: "ستراکچەری پۆڵایین", desc_en: "Steel Structure", desc_ar: "هياكل فولاذية" },
  { src: "https://i.ibb.co/k2D9vJ3c/IMG-0441.jpg", desc_ku: "کاری کۆنکریت", desc_en: "Concrete Work", desc_ar: "أعمال خرسانية" },
  { src: "https://i.ibb.co/LD5rz2p9/IMG-0440.jpg", desc_ku: "بیناسازی بازرگانی", desc_en: "Commercial Building", desc_ar: "بناء تجاري" },
  { src: "https://i.ibb.co/QjX64FxD/IMG-0439.jpg", desc_ku: "دیزاینی ناوخۆ", desc_en: "Interior Design", desc_ar: "تصميم داخلي" },
  { src: "https://i.ibb.co/0x44LW1/IMG-0438.jpg", desc_ku: "پڕۆژەی کۆمپلێکس", desc_en: "Complex Project", desc_ar: "مشروع مجمع" },
  { src: "https://i.ibb.co/qFMVBWck/IMG-0437.jpg", desc_ku: "قاڵبی Doka ئەڵمانی", desc_en: "German Doka Formwork", desc_ar: "قوالب Doka الألمانية" },
  { src: "https://i.ibb.co/G38Hxksc/IMG-0435.jpg", desc_ku: "ستراکچەری بنەڕەت", desc_en: "Foundation Structure", desc_ar: "هيكل الأساسات" },
];

const USERS = [
  { username: "shasti", password: "shasti123", project: "shasti", label: "شاستی" },
  { username: "surosh", password: "surosh123", project: "surosh", label: "بەرزایەکانی سروشت" },
  { username: "admin", password: "karo2024", project: "admin", label: "Admin", isAdmin: true }
];

const FONTS = [
  { name: "Segoe UI", value: "'Segoe UI', Tahoma, sans-serif" },
  { name: "NRT", value: "'NRT', sans-serif" },
  { name: "Rudaw", value: "'Rudaw', sans-serif" },
  { name: "Rabar", value: "'Rabar', sans-serif" },
  { name: "Noto Sans Arabic", value: "'Noto Sans Arabic', sans-serif" },
  { name: "Ava TV", value: "'Ava TV', sans-serif" },
];

const T = {
  ku: {
    nav: { home: "سەرەتا", services: "خزمەتگوزارییەکان", projects: "پڕۆژەکان", about: "دەربارە", contact: "پەیوەندی" },
    hero: { title: "بیناسازی پیشەسازانە", subtitle: "لە ٢٠١٧ ـەوە، کارۆ گروپ پێشەنگە لە بواری بیناسازی و کۆنکریت لە هەرێمی کوردستان", cta: "پڕۆژەکانمان ببینە" },
    services: { title: "خزمەتگوزارییەکانمان", s1: { name: "بیناسازی نیشتەجێبوون", desc: "دیزاین و دروستکردنی خانوو و کۆمپلێکسی نیشتەجێبوون بە ستانداردی نێودەوڵەتی" }, s2: { name: "بیناسازی بازرگانی", desc: "دروستکردنی بینای بازرگانی، مۆڵ، ئۆفیس و پڕۆژەی گەورە بە کوالیتی بەرز" }, s3: { name: "کۆنکریت و ستراکچەر", desc: "کاری کۆنکریتی ئامادە و ستراکچەری پۆڵایین بە مەوادی پێشکەوتوو" } },
    about: { title: "بۆچی کارۆ گروپ؟", items: ["مەوادی پێشکەوتوو — Doka ی ئەڵمانی، جەگ، پلاوودی ئەسڵی", "گرێنتی لەسەر هەموو کارەکان", "پابەندبوون بە سەیفتی و ستانداردی نێودەوڵەتی", "ستافی شارەزا و بە ئەزموون"] },
    contact: { title: "پەیوەندیمان پێوە بکە", phone: "تەلەفۆن", whatsapp: "واتسئاپ", viber: "ڤایبەر", email: "ئیمەیڵ" },
    footer: { rights: "هەموو مافەکان پارێزراون", poweredBy: "کارۆ گروپ" },
    login: "چوونەژوورەوە", username: "ناوی بەکارهێنەر", password: "وشەی نهێنی", enter: "بچۆرە ژوورەوە", wrongLogin: "ناوی بەکارهێنەر یان وشەی نهێنی هەڵەیە", logout: "چوونەدەرەوە",
    sidebar: { cash: "قاسە", loans: "قەرز", concrete: "سلفە کۆنکرێت", contractor: "حیسابی مقاول", exchange: "ئالوگۆری دراو", invoice: "ئینڤۆیس", backup: "پاشەکەوتی داتاکان", reports: "ڕاپۆرتەکان", history: "هیستۆری داتا", monthlyReport: "کەشف حیسابی مانگانە", expenses: "خەرجی (مەسارف)", formatData: "سڕینەوەی هەموو داتاکان" },
    cashBox: "قاسەی پارە", iqd: "دینار", usd: "دۆلار", dark: "تاریک", light: "ڕووناک",
    date: "بەروار", receiptNo: "ژمارەی وەسڵ", receiptImg: "وێنە", amountIQD: "بڕ بە دینار", amountUSD: "بڕ بە دۆلار", note: "تێبینی",
    search: "گەڕان", filterMonth: "فلتەر بە مانگ", total: "کۆی گشتی", print: "پرینت", save: "پاشەکەوت", delete: "سڕینەوە", edit: "دەستکاری", add: "زیادکردن", cancel: "هەڵوەشاندنەوە",
    mark: "مارک", marked: "✓", showAll: "پیشاندانی هەمووی", showMarked: "تەنها مارککراوەکان",
    loanType: "جۆر", loanTake: "قەرز وەرگرتن", loanGive: "قەرز دان", personName: "ناوی کەس",
    meters: "بڕی مەتر", pricePerMeter: "نرخی مەتر", totalConcrete: "کۆی گشتی", deposit: "تەئمین", depositPercent: "ڕێژەی تەئمین %", received: "بڕی وەرگرتن", claimDeposit: "وەرگرتنی تەئمین",
    contractorType: "جۆر", withdraw: "ڕاکێشان", addMoney: "زیادکردن",
    cashIQD: "دینار لە قاسە", cashUSD: "دۆلار لە قاسە", totalInIQD: "کۆی گشتی بە دینار",
    exchangeRate: "نرخی دۆلار بە دینار", saveRate: "پاشەکەوت", convertTo: "گۆڕین بۆ", fromUSD: "دینار ← دۆلار", fromIQD: "دۆلار ← دینار",
    amount: "بڕ", result: "ئەنجام", convert: "گۆڕین",
    invoiceNo: "ژمارەی ئینڤۆیس", itemName: "ناوی کاڵا", qty: "حەدەد", price: "نرخ", addItem: "زیادکردنی ئایتم", viewInvoice: "بینین", billTo: "بۆ", billPhone: "ژمارەی مۆبایل",
    cashLog: "هاتن/چوونی پارە", type: "جۆر",
    noBalance: "بڕی پارەی پێویستت نییە لە قاسەدا، تکایە باڵانس زیاد بکە بۆ قاسە",
    allMonths: "هەموو مانگەکان", clickToChange: "کلیک بکە بۆ گۆڕین",
    savePDF: "PDF", saveExcel: "Excel", selectSize: "سایز هەڵبژێرە",
    totalExpIQD: "کۆی خەرجی (دینار)", totalExpUSD: "کۆی خەرجی (دۆلار)", totalConcreteReceived: "کۆی سلفە وەرگیراو", totalDeposit: "کۆی تەئمین",
    reportsTitle: "ڕاپۆرتی گشتی", noData: "هیچ داتایەک نییە",
    downloadBackup: "داونلۆدی پاشەکەوت", uploadBackup: "بارکردنی پاشەکەوت", backupSuccess: "سەرکەوتوو بوو",
    ok: "باشە", addPerson: "زیادکردنی کەس", persons: "کەسەکان", allPersons: "هەموو کەسەکان",
    font: "فۆنت", importExcel: "هاوردە لە Excel",
    from: "لە", to: "تا", profitLoss: "قازانج/زەرەر", income: "داهات", expense: "خەرجی", profit: "قازانج", loss: "زەرەر",
    formatConfirm: "بۆ سڕینەوەی هەموو داتاکان، تکایە ناوی بەکارهێنەر و وشەی نهێنی ئەدمین بنووسە",
    formatSuccess: "هەموو داتاکان سڕانەوە",
    currency: "دراو", onlyIQD: "تەنها دینار", onlyUSD: "تەنها دۆلار",
    removeImg: "سڕینەوەی وێنە",
    depositNotClaimed: "تەئمین وەرنەگیراوە",
    confirmDelete: "دڵنیایت لە سڕینەوەی ئەم داتایە؟",
    yes: "بەڵێ، بسڕەوە",
    no: "نەخێر",
    receivedStatus: "وەرگیراو",
    notReceived: "وەرنەگیراو",
    concCurrency: "دراوی سلفە",
  },
  en: {
    nav: { home: "Home", services: "Services", projects: "Projects", about: "About", contact: "Contact" },
    hero: { title: "Professional Construction", subtitle: "Since 2017, Karo Group has been a leader in construction and concrete in Kurdistan Region", cta: "View Our Projects" },
    services: { title: "Our Services", s1: { name: "Residential Construction", desc: "Design and construction of houses and residential complexes to international standards" }, s2: { name: "Commercial Construction", desc: "Building commercial properties, malls, offices and large projects" }, s3: { name: "Concrete & Structure", desc: "Ready-mix concrete and steel structures with advanced materials" } },
    about: { title: "Why Karo Group?", items: ["Advanced materials — German Doka, scaffolding, original plywood", "Warranty on all work", "Committed to safety and international standards", "Experienced and expert staff"] },
    contact: { title: "Contact Us", phone: "Phone", whatsapp: "WhatsApp", viber: "Viber", email: "Email" },
    footer: { rights: "All rights reserved", poweredBy: "Karo Group" },
    login: "Login", username: "Username", password: "Password", enter: "Sign In", wrongLogin: "Wrong username or password", logout: "Logout",
    sidebar: { cash: "Cash Box", loans: "Loans", concrete: "Concrete Advance", contractor: "Contractor", exchange: "Exchange", invoice: "Invoice", backup: "Backup", reports: "Reports", history: "History", monthlyReport: "Monthly Statement", expenses: "Expenses", formatData: "Format All Data" },
    cashBox: "Cash Box", iqd: "IQD", usd: "USD", dark: "Dark", light: "Light",
    date: "Date", receiptNo: "Receipt #", receiptImg: "Image", amountIQD: "Amount IQD", amountUSD: "Amount USD", note: "Note",
    search: "Search", filterMonth: "Filter Month", total: "Total", print: "Print", save: "Save", delete: "Delete", edit: "Edit", add: "Add", cancel: "Cancel",
    mark: "Mark", marked: "✓", showAll: "Show All", showMarked: "Marked Only",
    loanType: "Type", loanTake: "Received", loanGive: "Given", personName: "Person",
    meters: "Meters", pricePerMeter: "Price/m", totalConcrete: "Total", deposit: "Deposit", depositPercent: "Deposit %", received: "Received", claimDeposit: "Claim Deposit",
    contractorType: "Type", withdraw: "Withdraw", addMoney: "Add",
    cashIQD: "Cash IQD", cashUSD: "Cash USD", totalInIQD: "Total (IQD)",
    exchangeRate: "USD Rate", saveRate: "Save", convertTo: "Convert to", fromUSD: "IQD ← USD", fromIQD: "USD ← IQD",
    amount: "Amount", result: "Result", convert: "Convert",
    invoiceNo: "Invoice #", itemName: "Item", qty: "Qty", price: "Price", addItem: "Add Item", viewInvoice: "View", billTo: "Bill To", billPhone: "Phone",
    cashLog: "Cash Log", type: "Type",
    noBalance: "Insufficient balance. Please add balance to cash box first.",
    allMonths: "All Months", clickToChange: "Click to change",
    savePDF: "PDF", saveExcel: "Excel", selectSize: "Select Size",
    totalExpIQD: "Expenses (IQD)", totalExpUSD: "Expenses (USD)", totalConcreteReceived: "Concrete Received", totalDeposit: "Total Deposit",
    reportsTitle: "Reports", noData: "No data",
    downloadBackup: "Download Backup", uploadBackup: "Upload Backup", backupSuccess: "Success",
    ok: "OK", addPerson: "Add Person", persons: "Persons", allPersons: "All Persons",
    font: "Font", importExcel: "Import Excel",
    from: "From", to: "To", profitLoss: "Profit/Loss", income: "Income", expense: "Expense", profit: "Profit", loss: "Loss",
    formatConfirm: "To format all data, enter admin username and password",
    formatSuccess: "All data has been cleared",
    currency: "Currency", onlyIQD: "IQD Only", onlyUSD: "USD Only",
    removeImg: "Remove Image",
    depositNotClaimed: "Deposit not claimed",
    confirmDelete: "Are you sure you want to delete this item?",
    yes: "Yes, delete",
    no: "No",
    receivedStatus: "Received",
    notReceived: "Not Received",
    concCurrency: "Concrete Currency",
  },
  ar: {
    nav: { home: "الرئيسية", services: "الخدمات", projects: "المشاريع", about: "حولنا", contact: "اتصل بنا" },
    hero: { title: "بناء احترافي", subtitle: "منذ ٢٠١٧، مجموعة كارو رائدة في مجال البناء والخرسانة في إقليم كوردستان", cta: "شاهد مشاريعنا" },
    services: { title: "خدماتنا", s1: { name: "البناء السكني", desc: "تصميم وبناء المنازل والمجمعات السكنية وفق المعايير الدولية" }, s2: { name: "البناء التجاري", desc: "بناء العقارات التجارية والمولات والمكاتب" }, s3: { name: "الخرسانة والهياكل", desc: "خرسانة جاهزة وهياكل فولاذية بمواد متطورة" } },
    about: { title: "لماذا مجموعة كارو؟", items: ["مواد متطورة — Doka الألمانية، سقالات، خشب رقائقي أصلي", "ضمان على جميع الأعمال", "الالتزام بالسلامة والمعايير الدولية", "طاقم ذو خبرة وكفاءة"] },
    contact: { title: "تواصل معنا", phone: "هاتف", whatsapp: "واتساب", viber: "فايبر", email: "بريد إلكتروني" },
    footer: { rights: "جميع الحقوق محفوظة", poweredBy: "مجموعة كارو" },
    login: "تسجيل الدخول", username: "اسم المستخدم", password: "كلمة المرور", enter: "دخول", wrongLogin: "خطأ في الاسم أو كلمة المرور", logout: "خروج",
    sidebar: { cash: "الصندوق", loans: "القروض", concrete: "سلفة خرسانة", contractor: "المقاول", exchange: "صرف العملات", invoice: "فاتورة", backup: "نسخ احتياطي", reports: "التقارير", history: "السجل", monthlyReport: "كشف حساب", expenses: "المصاريف", formatData: "مسح جميع البيانات" },
    cashBox: "صندوق النقد", iqd: "دينار", usd: "دولار", dark: "داكن", light: "فاتح",
    date: "التاريخ", receiptNo: "رقم الوصل", receiptImg: "صورة", amountIQD: "المبلغ (دينار)", amountUSD: "المبلغ (دولار)", note: "ملاحظة",
    search: "بحث", filterMonth: "تصفية", total: "المجموع", print: "طباعة", save: "حفظ", delete: "حذف", edit: "تعديل", add: "إضافة", cancel: "إلغاء",
    mark: "تعليم", marked: "✓", showAll: "عرض الكل", showMarked: "المعلّم فقط",
    loanType: "النوع", loanTake: "مستلم", loanGive: "ممنوح", personName: "الشخص",
    meters: "الأمتار", pricePerMeter: "سعر/م", totalConcrete: "الإجمالي", deposit: "التأمين", depositPercent: "نسبة التأمين %", received: "المستلم", claimDeposit: "استلام التأمين",
    contractorType: "النوع", withdraw: "سحب", addMoney: "إيداع",
    cashIQD: "نقد دينار", cashUSD: "نقد دولار", totalInIQD: "الإجمالي (دينار)",
    exchangeRate: "سعر الدولار", saveRate: "حفظ", convertTo: "تحويل إلى", fromUSD: "دينار ← دولار", fromIQD: "دولار ← دینار",
    amount: "المبلغ", result: "النتيجة", convert: "تحويل",
    invoiceNo: "رقم الفاتورة", itemName: "السلعة", qty: "العدد", price: "السعر", addItem: "إضافة عنصر", viewInvoice: "عرض", billTo: "إلى", billPhone: "الهاتف",
    cashLog: "سجل النقد", type: "النوع",
    noBalance: "الرصيد غير كافٍ. أضف رصيداً للصندوق أولاً.",
    allMonths: "الكل", clickToChange: "اضغط للتغيير",
    savePDF: "PDF", saveExcel: "Excel", selectSize: "اختر الحجم",
    totalExpIQD: "مصاريف (دينار)", totalExpUSD: "مصاريف (دولار)", totalConcreteReceived: "خرسانة مستلمة", totalDeposit: "إجمالي التأمين",
    reportsTitle: "التقارير", noData: "لا توجد بيانات",
    downloadBackup: "تحميل النسخة", uploadBackup: "استيراد النسخة", backupSuccess: "تم بنجاح",
    ok: "حسناً", addPerson: "إضافة شخص", persons: "الأشخاص", allPersons: "جميع الأشخاص",
    font: "الخط", importExcel: "استيراد Excel",
    from: "من", to: "إلى", profitLoss: "ربح/خسارة", income: "الدخل", expense: "المصروف", profit: "ربح", loss: "خسارة",
    formatConfirm: "لمسح جميع البيانات، أدخل اسم المستخدم وكلمة المرور للمدير",
    formatSuccess: "تم مسح جميع البيانات",
    currency: "العملة", onlyIQD: "دينار فقط", onlyUSD: "دولار فقط",
    removeImg: "حذف الصورة",
    depositNotClaimed: "التأمين لم يُستلم",
    confirmDelete: "هل أنت متأكد من حذف هذا العنصر؟",
    yes: "نعم، احذف",
    no: "لا",
    receivedStatus: "مستلم",
    notReceived: "لم يُستلم",
    concCurrency: "عملة السلفة",
  }
};

const fmt = (n) => { const v = Number(n || 0); return v.toLocaleString(); };
const today = () => new Date().toISOString().split("T")[0];
const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const getLS = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } };
const setLS = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const trunc = (s, m = 25) => (!s ? "" : s.length > m ? s.slice(0, m) + "…" : s);

// ==================== ICONS (SVG) ====================
const I = {
  Sun: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5"/>
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  ),
  Moon: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  ),
  Phone: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  Mail: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  ),
  Menu: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  X: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Plus: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  Trash: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
  ),
  Edit: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  Logout: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  Eye: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  Upload: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  ),
  Download: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  File: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  ),
  Chart: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  Printer: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6 9 6 2 18 2 18 9"/>
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
      <rect x="6" y="14" width="12" height="8"/>
    </svg>
  ),
  Globe: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  Clock: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Warn: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  Wallet: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3z"/>
      <circle cx="7" cy="12" r="1.5" fill="currentColor"/>
      <circle cx="17" cy="12" r="1.5" fill="currentColor"/>
    </svg>
  ),
  Loan: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="6" width="20" height="12" rx="2"/>
      <path d="M12 12h4"/>
      <path d="M8 12h2"/>
    </svg>
  ),
  Concrete: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="4" width="16" height="16" rx="2"/>
      <line x1="4" y1="10" x2="20" y2="10"/>
      <line x1="4" y1="14" x2="20" y2="14"/>
    </svg>
  ),
  Contractor: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Exchange: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 2l4 4-4 4"/>
      <path d="M3 12h4l3-3 3 3 3-3 3 3 4-4"/>
      <path d="M7 22l-4-4 4-4"/>
      <path d="M21 12h-4l-3 3-3-3-3 3-3-3-4 4"/>
    </svg>
  ),
  Invoice: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  Backup: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
      <polyline points="17 21 17 13 7 13 7 21"/>
      <polyline points="7 3 7 8 15 8"/>
    </svg>
  ),
};
// ==================== LOGO ====================
function Logo({ size = 40 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="8" fill={PRIMARY} />
        <path d="M10 20L20 10L30 20L20 30L10 20Z" fill="white" />
        <circle cx="20" cy="20" r="6" fill={PRIMARY_DARK} />
      </svg>
      <span style={{ fontWeight: 800, fontSize: size * 0.5, color: PRIMARY }}>KARO</span>
    </div>
  );
}

// ==================== DASHBOARD ====================
function Dashboard({ t, s, isRtl, pKey, user, logout }) {
  const [active, setActive] = useState("cash");
  const [cashIQD, setCashIQD] = useState(() => getLS(`karo_cashIQD_${pKey}`, 0));
  const [cashUSD, setCashUSD] = useState(() => getLS(`karo_cashUSD_${pKey}`, 0));
  const [exchangeRate, setExchangeRate] = useState(() => getLS(`karo_rate_${pKey}`, 1500));
  const [cashLog, setCashLog] = useState(() => getLS(`karo_cashLog_${pKey}`, []));
  const [dark, setDark] = useState(() => getLS("karo_theme", false));
  const [lang, setLang] = useState(() => getLS("karo_lang", "ku"));
  const [font, setFont] = useState(() => getLS("karo_font", FONTS[0].value));
  const [showSidebar, setShowSidebar] = useState(true);
  const [formatModal, setFormatModal] = useState(false);
  const [formatUser, setFormatUser] = useState("");
  const [formatPass, setFormatPass] = useState("");
  
  useEffect(() => { setLS(`karo_cashIQD_${pKey}`, cashIQD); }, [cashIQD, pKey]);
  useEffect(() => { setLS(`karo_cashUSD_${pKey}`, cashUSD); }, [cashUSD, pKey]);
  useEffect(() => { setLS(`karo_rate_${pKey}`, exchangeRate); }, [exchangeRate, pKey]);
  useEffect(() => { setLS(`karo_cashLog_${pKey}`, cashLog); }, [cashLog, pKey]);
  useEffect(() => { setLS("karo_theme", dark); }, [dark]);
  useEffect(() => { setLS("karo_lang", lang); }, [lang]);
  useEffect(() => { setLS("karo_font", font); }, [font]);
  
  const addCashLog = (action, iqd = 0, usd = 0) => {
    setCashLog(prev => [{ date: today(), action, iqd, usd, id: genId() }, ...prev].slice(0, 100));
  };
  
  const doFormat = () => {
    if (formatUser === "admin" && formatPass === "karo2024") {
      Object.keys(localStorage).forEach(k => { if (k.startsWith("karo_")) localStorage.removeItem(k); });
      window.location.reload();
    }
    setFormatModal(false);
  };
  
  const sidebarItems = [
    { id: "cash", icon: <I.Wallet />, label: t.sidebar.cash },
    { id: "loans", icon: <I.Loan />, label: t.sidebar.loans },
    { id: "concrete", icon: <I.Concrete />, label: t.sidebar.concrete },
    { id: "contractor", icon: <I.Contractor />, label: t.sidebar.contractor },
    { id: "exchange", icon: <I.Exchange />, label: t.sidebar.exchange },
    { id: "invoice", icon: <I.Invoice />, label: t.sidebar.invoice },
    { id: "reports", icon: <I.Chart />, label: t.sidebar.reports },
    { id: "backup", icon: <I.Backup />, label: t.sidebar.backup },
  ];
  
  if (user?.isAdmin) {
    sidebarItems.push({ id: "format", icon: <I.Warn />, label: t.sidebar.formatData });
  }
  
  const sTheme = {
    bg: dark ? "#0A0F1E" : "#F8FAFC",
    bgCard: dark ? "#151E2F" : "#FFFFFF",
    bgCard2: dark ? "#1E2A3A" : "#F1F5F9",
    text: dark ? "#E2E8F0" : "#1E293B",
    textMuted: dark ? "#94A3B8" : "#64748B",
    border: dark ? "#2D3A4A" : "#E2E8F0",
    success: "#10B981",
    danger: "#EF4444",
    warning: "#F59E0B",
    primary: PRIMARY,
  };
  
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: sTheme.bg, color: sTheme.text, fontFamily: font, direction: isRtl ? "rtl" : "ltr" }}>
      {/* Sidebar */}
      <div style={{ width: showSidebar ? 240 : 70, background: sTheme.bgCard, borderRight: `1px solid ${sTheme.border}`, transition: "0.2s", padding: "16px 0" }}>
        <div style={{ padding: "0 16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo size={showSidebar ? 36 : 28} />
          <button onClick={() => setShowSidebar(!showSidebar)} style={{ background: "none", border: "none", color: sTheme.textMuted, cursor: "pointer" }}>
            <I.Menu />
          </button>
        </div>
        
        {sidebarItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            style={{
              width: "100%", padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
              background: active === item.id ? sTheme.primary : "transparent",
              color: active === item.id ? "#fff" : sTheme.textMuted,
              border: "none", borderLeft: active === item.id ? `4px solid ${sTheme.primary}` : "none",
              cursor: "pointer", fontSize: 14, fontWeight: 500, transition: "0.1s"
            }}
          >
            <span style={{ width: 20 }}>{item.icon}</span>
            {showSidebar && <span>{item.label}</span>}
          </button>
        ))}
        
        <div style={{ position: "absolute", bottom: 20, left: 0, right: 0, padding: "0 16px" }}>
          <button
            onClick={logout}
            style={{ width: "100%", padding: "10px", background: "none", border: `1px solid ${sTheme.border}`, color: sTheme.danger, borderRadius: 8, cursor: "pointer" }}
          >
            <I.Logout /> {showSidebar && t.logout}
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div style={{ flex: 1, padding: 24, overflow: "auto" }}>
        {/* Header with theme/language controls */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>
            {sidebarItems.find(i => i.id === active)?.label}
          </h2>
          
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setDark(!dark)} style={{ background: sTheme.bgCard2, border: `1px solid ${sTheme.border}`, borderRadius: 8, padding: "6px 12px", cursor: "pointer" }}>
              {dark ? <I.Sun /> : <I.Moon />} {dark ? t.light : t.dark}
            </button>
            
            <select value={lang} onChange={e => setLang(e.target.value)} style={{ background: sTheme.bgCard2, border: `1px solid ${sTheme.border}`, borderRadius: 8, padding: "6px 12px", color: sTheme.text }}>
              <option value="ku">کوردی</option>
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
            
            <select value={font} onChange={e => setFont(e.target.value)} style={{ background: sTheme.bgCard2, border: `1px solid ${sTheme.border}`, borderRadius: 8, padding: "6px 12px", color: sTheme.text }}>
              {FONTS.map(f => <option key={f.name} value={f.value}>{f.name}</option>)}
            </select>
          </div>
        </div>
        
        {/* Active page */}
        {active === "cash" && <CashPage t={t} s={sTheme} isRtl={isRtl} cashIQD={cashIQD} setCashIQD={setCashIQD} cashUSD={cashUSD} setCashUSD={setCashUSD} exchangeRate={exchangeRate} cashLog={cashLog} />}
        {active === "loans" && <LoansPage t={t} s={sTheme} isRtl={isRtl} pKey={pKey} cashIQD={cashIQD} setCashIQD={setCashIQD} cashUSD={cashUSD} setCashUSD={setCashUSD} addCashLog={addCashLog} />}
        {active === "concrete" && <ConcretePage t={t} s={sTheme} isRtl={isRtl} pKey={pKey} cashIQD={cashIQD} setCashIQD={setCashIQD} cashUSD={cashUSD} setCashUSD={setCashUSD} addCashLog={addCashLog} />}
        {active === "contractor" && <ContractorPage t={t} s={sTheme} isRtl={isRtl} pKey={pKey} cashIQD={cashIQD} setCashIQD={setCashIQD} cashUSD={cashUSD} setCashUSD={setCashUSD} addCashLog={addCashLog} />}
        {active === "exchange" && <ExchangePage t={t} s={sTheme} isRtl={isRtl} exchangeRate={exchangeRate} setExchangeRate={setExchangeRate} cashIQD={cashIQD} setCashIQD={setCashIQD} cashUSD={cashUSD} setCashUSD={setCashUSD} addCashLog={addCashLog} />}
        {active === "invoice" && <InvoicePage t={t} s={sTheme} isRtl={isRtl} pKey={pKey} />}
        {active === "reports" && <ReportsPage t={t} s={sTheme} isRtl={isRtl} pKey={pKey} cashIQD={cashIQD} cashUSD={cashUSD} exchangeRate={exchangeRate} />}
        {active === "backup" && <BackupPage t={t} s={sTheme} />}
        {active === "format" && (
          <div style={{ background: sTheme.bgCard, border: `1px solid ${sTheme.border}`, borderRadius: 12, padding: 24 }}>
            <h3 style={{ margin: "0 0 16px", color: sTheme.danger }}>{t.sidebar.formatData}</h3>
            <p style={{ marginBottom: 16 }}>{t.formatConfirm}</p>
            <div style={{ display: "flex", gap: 12, flexDirection: "column", maxWidth: 300 }}>
              <input placeholder={t.username} value={formatUser} onChange={e => setFormatUser(e.target.value)} style={{ padding: 8, borderRadius: 6, border: `1px solid ${sTheme.border}`, background: sTheme.bgCard2, color: sTheme.text }} />
              <input type="password" placeholder={t.password} value={formatPass} onChange={e => setFormatPass(e.target.value)} style={{ padding: 8, borderRadius: 6, border: `1px solid ${sTheme.border}`, background: sTheme.bgCard2, color: sTheme.text }} />
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={doFormat} style={{ background: sTheme.danger, color: "#fff", border: "none", borderRadius: 6, padding: "8px 20px", cursor: "pointer" }}>{t.delete}</button>
                <button onClick={() => { setFormatModal(false); setFormatUser(""); setFormatPass(""); }} style={{ background: sTheme.bgCard2, color: sTheme.text, border: `1px solid ${sTheme.border}`, borderRadius: 6, padding: "8px 20px", cursor: "pointer" }}>{t.cancel}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Simple page components
function CashPage({ t, s, isRtl, cashIQD, setCashIQD, cashUSD, setCashUSD, exchangeRate, cashLog }) {
  return (
    <div style={{ background: s.bgCard, padding: 20, borderRadius: 12 }}>
      <h3>{t.cashBox}</h3>
      <div style={{ display: "flex", gap: 20, marginTop: 16 }}>
        <div style={{ background: s.bgCard2, padding: 16, borderRadius: 8 }}>
          <div>{t.cashIQD}: {fmt(cashIQD)}</div>
          <div>{t.cashUSD}: ${fmt(cashUSD)}</div>
        </div>
      </div>
    </div>
  );
}

function LoansPage({ t, s, isRtl, pKey, cashIQD, setCashIQD, cashUSD, setCashUSD, addCashLog }) {
  return <div style={{ background: s.bgCard, padding: 20, borderRadius: 12 }}>{t.sidebar.loans}</div>;
}

function ConcretePage({ t, s, isRtl, pKey, cashIQD, setCashIQD, cashUSD, setCashUSD, addCashLog }) {
  return <div style={{ background: s.bgCard, padding: 20, borderRadius: 12 }}>{t.sidebar.concrete}</div>;
}

function ContractorPage({ t, s, isRtl, pKey, cashIQD, setCashIQD, cashUSD, setCashUSD, addCashLog }) {
  return <div style={{ background: s.bgCard, padding: 20, borderRadius: 12 }}>{t.sidebar.contractor}</div>;
}

function ExchangePage({ t, s, isRtl, exchangeRate, setExchangeRate, cashIQD, setCashIQD, cashUSD, setCashUSD, addCashLog }) {
  return <div style={{ background: s.bgCard, padding: 20, borderRadius: 12 }}>{t.sidebar.exchange}</div>;
}

function InvoicePage({ t, s, isRtl, pKey }) {
  return <div style={{ background: s.bgCard, padding: 20, borderRadius: 12 }}>{t.sidebar.invoice}</div>;
}

function ReportsPage({ t, s, isRtl, pKey, cashIQD, cashUSD, exchangeRate }) {
  return <div style={{ background: s.bgCard, padding: 20, borderRadius: 12 }}>{t.sidebar.reports}</div>;
}

function BackupPage({ t, s }) {
  const handleDownload = () => {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith("karo_")) data[k] = localStorage.getItem(k);
    }
    const b = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(b);
    a.download = `karo_backup_${today()}.json`;
    a.click();
  };
  
  const handleUpload = e => {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = ev => {
      try {
        const d = JSON.parse(ev.target.result);
        Object.entries(d).forEach(([k, v]) => localStorage.setItem(k, v));
        alert(t.backupSuccess);
        window.location.reload();
      } catch {
        alert("Error");
      }
    };
    r.readAsText(f);
  };
  
  return (
    <div style={{ background: s.bgCard, padding: 20, borderRadius: 12 }}>
      <h3>{t.sidebar.backup}</h3>
      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <button onClick={handleDownload} style={{ background: s.primary, color: "#fff", border: "none", padding: "10px 20px", borderRadius: 6, cursor: "pointer" }}>
          {t.downloadBackup}
        </button>
        <label style={{ background: s.bgCard2, border: `1px solid ${s.border}`, padding: "10px 20px", borderRadius: 6, cursor: "pointer" }}>
          {t.uploadBackup}
          <input type="file" accept=".json" onChange={handleUpload} style={{ display: "none" }} />
        </label>
      </div>
    </div>
  );
}

// ==================== LANDING PAGE ====================
function LandingPage({ t, s, isRtl, dark, lang, fontFamily, setLang, setDark, onLogoClick }) {
  return (
    <div style={{ minHeight: "100vh" }}>
      <h1>{t.hero.title}</h1>
    </div>
  );
}

// ==================== LOGIN PAGE ====================
function LoginPage({ t, s, isRtl, fontFamily, onLogin, onBack }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState(false);
  
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <div style={{ background: s.bgCard, padding: 32, borderRadius: 16, width: 320 }}>
        <h2 style={{ textAlign: "center", marginBottom: 24 }}>{t.login}</h2>
        {err && <div style={{ color: s.danger, marginBottom: 16 }}>{t.wrongLogin}</div>}
        <input 
          placeholder={t.username} 
          value={u} 
          onChange={e => setU(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 12, borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text }}
        />
        <input 
          type="password"
          placeholder={t.password} 
          value={p} 
          onChange={e => setP(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 20, borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text }}
        />
        <button 
          onClick={() => onLogin(u, p)}
          style={{ width: "100%", padding: 12, background: s.primary, color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}
        >
          {t.enter}
        </button>
      </div>
    </div>
  );
}

// ==================== MAIN APP ====================
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [pKey, setPKey] = useState("");
  const [lang, setLang] = useState(() => getLS("karo_lang", "ku"));
  const [dark, setDark] = useState(() => getLS("karo_theme", false));
  const [font, setFont] = useState(() => getLS("karo_font", FONTS[0].value));
  
  const t = T[lang];
  const isRtl = lang === "ar" || lang === "ku";
  
  const handleLogin = (username, password) => {
    const found = USERS.find(u => u.username === username && u.password === password);
    if (found) {
      setUser(found);
      setPKey(found.project);
      setLoggedIn(true);
    } else {
      alert(t.wrongLogin);
    }
  };
  
  const handleLogout = () => {
    setLoggedIn(false);
    setUser(null);
  };
  
  const sTheme = {
    bg: dark ? "#0A0F1E" : "#F8FAFC",
    bgCard: dark ? "#151E2F" : "#FFFFFF",
    bgCard2: dark ? "#1E2A3A" : "#F1F5F9",
    text: dark ? "#E2E8F0" : "#1E293B",
    textMuted: dark ? "#94A3B8" : "#64748B",
    border: dark ? "#2D3A4A" : "#E2E8F0",
    success: "#10B981",
    danger: "#EF4444",
    warning: "#F59E0B",
    primary: PRIMARY,
  };
  
  if (!loggedIn) {
    return (
      <div style={{ minHeight: "100vh", background: sTheme.bg, color: sTheme.text, fontFamily: font, direction: isRtl ? "rtl" : "ltr" }}>
        <LoginPage t={t} s={sTheme} isRtl={isRtl} fontFamily={font} onLogin={handleLogin} onBack={() => {}} />
      </div>
    );
  }
  
  return (
    <div style={{ fontFamily: font, direction: isRtl ? "rtl" : "ltr" }}>
      <Dashboard 
        t={t} 
        s={sTheme} 
        isRtl={isRtl} 
        pKey={pKey} 
        user={user} 
        logout={handleLogout} 
      />
    </div>
  );
}
