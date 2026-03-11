import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ==================== CONFIG ====================
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

// ==================== TRANSLATIONS ====================
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
    exchangeRate: "نرخی دۆلار بە دینار", saveRate: "پاشەکەوت", convertTo: "گۆڕین بۆ", fromUSD: "دۆلار → دینار", fromIQD: "دینار → دۆلار",
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
    depositNotClaimed: "تەئمین وەرنەگیراوە"
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
    exchangeRate: "USD Rate", saveRate: "Save", convertTo: "Convert to", fromUSD: "USD → IQD", fromIQD: "IQD → USD",
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
    depositNotClaimed: "Deposit not claimed"
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
    exchangeRate: "سعر الدولار", saveRate: "حفظ", convertTo: "تحويل إلى", fromUSD: "دولار → دينار", fromIQD: "دينار → دولار",
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
    depositNotClaimed: "التأمين لم يُستلم"
  }
};

// ==================== HELPERS ====================
const fmt = (n) => { const v = Number(n || 0); return v.toLocaleString(); };
const today = () => new Date().toISOString().split("T")[0];
const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const getLS = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } };
const setLS = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const trunc = (s, m = 25) => (!s ? "" : s.length > m ? s.slice(0, m) + "..." : s);

// ==================== ICONS (SVG) ====================
const I = {
  Sun: (p) => <svg {...p} width={p?.s||18} height={p?.s||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
  Moon: (p) => <svg {...p} width={p?.s||18} height={p?.s||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  Phone: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Mail: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  Menu: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  X: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Plus: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Trash: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Edit: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Logout: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Eye: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Upload: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  Download: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Check: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>,
  File: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Chart: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Printer: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  Globe: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Clock: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Warn: () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
};

// ==================== LOGO ====================
function Logo({ size = 40 }) {
  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", width: size + 14, height: size + 14, borderRadius: "50%", background: `${PRIMARY}20`, animation: "ping 2s cubic-bezier(0,0,0.2,1) infinite" }} />
      <div style={{ width: size, height: size, borderRadius: "50%", background: PRIMARY, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1, boxShadow: `0 4px 16px ${PRIMARY}40` }}>
        <span style={{ color: "#fff", fontWeight: 900, fontSize: size * 0.38, letterSpacing: -1 }}>KG</span>
      </div>
    </div>
  );
}

// ==================== ALERT MODAL ====================
function AlertModal({ message, onOk, s }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: s.bgCard, borderRadius: 16, padding: 32, maxWidth: 380, width: "100%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
        <div style={{ marginBottom: 16 }}><I.Warn /></div>
        <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 24, color: s.text }}>{message}</p>
        <button onClick={onOk} style={{ background: PRIMARY, color: "#fff", border: "none", borderRadius: 8, padding: "10px 40px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>OK</button>
      </div>
    </div>
  );
}

// ==================== SIZE MODAL ====================
function SizeModal({ onSelect, onClose, s, t }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: s.bgCard, borderRadius: 16, padding: 28, textAlign: "center" }}>
        <h3 style={{ marginBottom: 18, fontSize: 15, fontWeight: 700, color: s.text }}>{t.selectSize}</h3>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          {["A3", "A4", "A5"].map(sz => (
            <button key={sz} onClick={() => onSelect(sz)} style={{ padding: "12px 28px", borderRadius: 8, border: `2px solid ${PRIMARY}`, background: "transparent", color: PRIMARY, fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => { e.target.style.background = PRIMARY; e.target.style.color = "#fff"; }} onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = PRIMARY; }}>{sz}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==================== PRINT/EXPORT ====================
function doPrint({ title, headers, rows, totalRow, size, isRtl }) {
  const sz = { A3: "420mm 297mm", A4: "210mm 297mm", A5: "148mm 210mm" };
  const w = window.open("", "_blank");
  w.document.write(`<html dir="${isRtl?"rtl":"ltr"}"><head><title>${title}</title><style>@page{size:${sz[size]||sz.A4};margin:12mm}body{font-family:sans-serif;padding:16px}table{width:100%;border-collapse:collapse;margin-top:12px}th{background:${PRIMARY};color:#fff;padding:7px 5px;font-size:11px}td{border:1px solid #ddd;padding:5px;text-align:center;font-size:11px}h2{color:${PRIMARY};text-align:center;font-size:16px}.t{font-weight:bold;background:#f0fdf4}</style></head><body><h2>KARO GROUP — ${title}</h2><table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join("")}</tr>`).join("")}${totalRow?`<tr class="t">${totalRow.map(c=>`<td>${c}</td>`).join("")}</tr>`:""}</tbody></table></body></html>`);
  w.document.close(); w.print();
}
function doExcel({ title, headers, rows, totalRow }) {
  let csv = "\uFEFF" + headers.join(",") + "\n";
  rows.forEach(r => { csv += r.map(c => `"${c}"`).join(",") + "\n"; });
  if (totalRow) csv += totalRow.map(c => `"${c}"`).join(",") + "\n";
  const b = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = `${title}.csv`; a.click();
}

// ==================== STYLES ====================
const getS = (dark) => ({
  bg: dark ? "#0f0f0f" : "#ffffff",
  bgCard: dark ? "#1a1a1a" : "#ffffff",
  bgCard2: dark ? "#222" : "#f8f8f8",
  text: dark ? "#e5e5e5" : "#1c1917",
  textMuted: dark ? "#999" : "#78716c",
  border: dark ? "#333" : "#e5e5e5",
  danger: "#EF4444", success: "#22C55E"
});

// ==================== APP ====================
export default function App() {
  const [lang, setLang] = useState(getLS("karo_lang", "ku"));
  const [dark, setDark] = useState(getLS("karo_dark", false));
  const [page, setPage] = useState(getLS("karo_page", "landing"));
  const [loggedUser, setLoggedUser] = useState(getLS("karo_user", null));
  const [dashPage, setDashPage] = useState(getLS("karo_dashPage", "reports"));
  const [logoClicks, setLogoClicks] = useState(0);
  const [fontIdx, setFontIdx] = useState(getLS("karo_font", 0));
  const logoTimer = useRef(null);

  const t = T[lang]; const isRtl = lang !== "en"; const s = getS(dark);
  const fontFamily = FONTS[fontIdx]?.value || FONTS[0].value;

  // per-project keys
  const pKey = loggedUser?.project || "x";
  const [cashIQD, setCashIQD] = useState(getLS(`karo_cashIQD_${pKey}`, 0));
  const [cashUSD, setCashUSD] = useState(getLS(`karo_cashUSD_${pKey}`, 0));
  const [exchangeRate, setExchangeRate] = useState(getLS(`karo_rate_${pKey}`, 1500));
  const [cashLog, setCashLog] = useState(getLS(`karo_cashLog_${pKey}`, []));

  useEffect(() => { setLS("karo_lang", lang); }, [lang]);
  useEffect(() => { setLS("karo_dark", dark); }, [dark]);
  useEffect(() => { setLS("karo_page", page); }, [page]);
  useEffect(() => { setLS("karo_dashPage", dashPage); }, [dashPage]);
  useEffect(() => { setLS("karo_font", fontIdx); }, [fontIdx]);
  useEffect(() => { if (loggedUser) { setLS("karo_user", loggedUser); } }, [loggedUser]);
  useEffect(() => { setLS(`karo_cashIQD_${pKey}`, cashIQD); }, [cashIQD, pKey]);
  useEffect(() => { setLS(`karo_cashUSD_${pKey}`, cashUSD); }, [cashUSD, pKey]);
  useEffect(() => { setLS(`karo_rate_${pKey}`, exchangeRate); }, [exchangeRate, pKey]);
  useEffect(() => { setLS(`karo_cashLog_${pKey}`, cashLog); }, [cashLog, pKey]);

  // reload project data when user changes
  useEffect(() => {
    if (loggedUser) {
      const pk = loggedUser.project;
      setCashIQD(getLS(`karo_cashIQD_${pk}`, 0));
      setCashUSD(getLS(`karo_cashUSD_${pk}`, 0));
      setExchangeRate(getLS(`karo_rate_${pk}`, 1500));
      setCashLog(getLS(`karo_cashLog_${pk}`, []));
    }
  }, [loggedUser?.project]);

  const addCashLog = useCallback((desc, iqd, usd) => {
    setCashLog(prev => [...prev, { id: genId(), date: today(), desc, iqd: Number(iqd||0), usd: Number(usd||0), time: new Date().toLocaleTimeString() }]);
  }, []);

  // cleanup >30 days
  useEffect(() => {
    const iv = setInterval(() => {
      const c = new Date(); c.setDate(c.getDate() - 30);
      const cs = c.toISOString().split("T")[0];
      setCashLog(prev => prev.filter(i => i.date >= cs));
    }, 86400000);
    return () => clearInterval(iv);
  }, []);

  const handleLogoClick = () => {
    const n = logoClicks + 1; setLogoClicks(n); clearTimeout(logoTimer.current);
    if (n >= 3) { setLogoClicks(0); setPage(loggedUser ? "dashboard" : "login"); }
    else logoTimer.current = setTimeout(() => setLogoClicks(0), 2000);
  };

  const handleLogin = (u, p) => {
    const user = USERS.find(x => x.username === u && x.password === p);
    if (user) { setLoggedUser(user); setPage("dashboard"); setDashPage("reports"); return true; }
    return false;
  };
  const handleLogout = () => { setLoggedUser(null); setPage("landing"); localStorage.removeItem("karo_user"); setLS("karo_page", "landing"); };

  const shared = { t, s, isRtl, dark, lang, fontFamily, pKey, cashIQD, setCashIQD, cashUSD, setCashUSD, exchangeRate, setExchangeRate, cashLog, setCashLog, addCashLog };

  if (page === "login") return <LoginPage {...shared} onLogin={handleLogin} onBack={() => setPage("landing")} />;
  if (page === "dashboard" && loggedUser) return <Dashboard {...shared} setLang={setLang} user={loggedUser} dashPage={dashPage} setDashPage={setDashPage} onLogout={handleLogout} setDark={setDark} fontIdx={fontIdx} setFontIdx={setFontIdx} />;
  return <LandingPage {...shared} setLang={setLang} setDark={setDark} onLogoClick={handleLogoClick} />;
}

// ==================== LANDING ====================
function LandingPage({ t, s, isRtl, dark, lang, fontFamily, setLang, setDark, onLogoClick }) {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 40); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  const scrollTo = id => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMobileMenu(false); };

  return (
    <div dir={isRtl?"rtl":"ltr"} style={{ background: "#fff", color: "#1c1917", fontFamily, minHeight: "100vh" }}>
      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, background: scrolled ? "rgba(255,255,255,0.97)" : "transparent", backdropFilter: scrolled ? "blur(16px)" : "none", borderBottom: scrolled ? "1px solid #e5e5e5" : "none", transition: "all 0.3s", padding: scrolled ? "8px 0" : "14px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={onLogoClick}>
            <Logo size={34} /><span style={{ fontWeight: 800, fontSize: 18, color: PRIMARY }}>KARO GROUP</span>
          </div>
          <div className="dnav" style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {["home","services","about","contact"].map(x => (
              <button key={x} onClick={() => scrollTo(x)} style={{ background: "none", border: "none", color: "#1c1917", cursor: "pointer", fontSize: 13, fontWeight: 500, padding: "3px 0", borderBottom: "2px solid transparent", transition: "all 0.3s" }} onMouseEnter={e=>e.target.style.borderBottomColor=PRIMARY} onMouseLeave={e=>e.target.style.borderBottomColor="transparent"}>{t.nav[x]}</button>
            ))}
            <select value={lang} onChange={e => setLang(e.target.value)} style={{ background: "#f5f5f5", color: "#333", border: "1px solid #e5e5e5", borderRadius: 6, padding: "4px 8px", fontSize: 11, cursor: "pointer" }}>
              <option value="ku">کوردی</option><option value="en">English</option><option value="ar">عربي</option>
            </select>
          </div>
          <button className="mbtn" onClick={() => setMobileMenu(!mobileMenu)} style={{ display: "none", background: "none", border: "none", color: "#1c1917", cursor: "pointer" }}>{mobileMenu ? <I.X /> : <I.Menu />}</button>
        </div>
        {mobileMenu && (
          <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "rgba(255,255,255,0.98)", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            {["home","services","about","contact"].map(x => <button key={x} onClick={() => scrollTo(x)} style={{ background: "none", border: "none", color: "#1c1917", cursor: "pointer", fontSize: 14, textAlign: isRtl?"right":"left", padding: "5px 0" }}>{t.nav[x]}</button>)}
            <select value={lang} onChange={e => setLang(e.target.value)} style={{ background: "#f5f5f5", border: "1px solid #e5e5e5", borderRadius: 6, padding: "6px 10px", fontSize: 13 }}>
              <option value="ku">کوردی</option><option value="en">English</option><option value="ar">عربي</option>
            </select>
          </div>
        )}
      </nav>

      {/* HERO + IMAGES */}
      <section id="home" style={{ paddingTop: 80 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }} className="hgrid">
            {PROJECT_IMAGES.map((img, i) => (
              <div key={i} style={{ position: "relative" }}>
                <div onClick={() => setLightbox(img.src)} style={{ borderRadius: 10, overflow: "hidden", cursor: "pointer", aspectRatio: "16/9" }}>
                  <img src={img.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }} onMouseEnter={e=>e.target.style.transform="scale(1.04)"} onMouseLeave={e=>e.target.style.transform="scale(1)"} loading="lazy" />
                </div>
                <p style={{ textAlign: "center", fontSize: 12, color: "#78716c", marginTop: 4, fontWeight: 600 }}>{img[`desc_${lang}`]}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: "center", padding: "50px 20px 70px" }}>
          <div style={{ marginBottom: 20 }}><Logo size={64} /></div>
          <h1 style={{ fontSize: "clamp(28px,5vw,50px)", fontWeight: 900, color: PRIMARY, marginBottom: 16 }}>{t.hero.title}</h1>
          <p style={{ fontSize: "clamp(14px,2vw,17px)", color: "#78716c", lineHeight: 1.7, maxWidth: 560, margin: "0 auto 30px" }}>{t.hero.subtitle}</p>
          <button onClick={() => scrollTo("services")} style={{ background: PRIMARY, color: "#fff", border: "none", borderRadius: 8, padding: "12px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: `0 4px 20px ${PRIMARY}40` }}>{t.hero.cta}</button>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{ padding: "70px 20px", maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: 28, fontWeight: 800, marginBottom: 40, color: PRIMARY }}>{t.services.title}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          {[t.services.s1, t.services.s2, t.services.s3].map((sv, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: 12, padding: 28, borderTop: `3px solid ${PRIMARY}`, transition: "transform 0.3s" }} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-3px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: PRIMARY }}>{sv.name}</h3>
              <p style={{ color: "#78716c", lineHeight: 1.7, fontSize: 13 }}>{sv.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding: "70px 20px", background: "#f9fafb" }}>
        <div style={{ maxWidth: 750, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 28, fontWeight: 800, marginBottom: 36, color: PRIMARY }}>{t.about.title}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
            {t.about.items.map((item, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: 8, padding: "16px 14px", display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ color: PRIMARY, fontWeight: 800 }}>✦</span>
                <span style={{ fontSize: 13, lineHeight: 1.7 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding: "70px 20px" }}>
        <div style={{ maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 36, color: PRIMARY }}>{t.contact.title}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { icon: <I.Phone />, label: t.contact.phone, value: PHONE, href: `tel:${PHONE.replace(/\s/g,"")}` },
              { icon: "💬", label: t.contact.whatsapp, value: PHONE, href: `https://wa.me/${PHONE.replace(/[^0-9]/g,"")}` },
              { icon: "📱", label: t.contact.viber, value: PHONE, href: `viber://chat?number=${PHONE.replace(/[^0-9]/g,"")}` },
              { icon: <I.Mail />, label: t.contact.email, value: EMAIL, href: `mailto:${EMAIL}` },
            ].map((c, i) => (
              <a key={i} href={c.href} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "#fff", border: "1px solid #e5e5e5", borderRadius: 8, textDecoration: "none", color: "#1c1917", direction: "ltr", transition: "border-color 0.3s" }} onMouseEnter={e=>e.currentTarget.style.borderColor=PRIMARY} onMouseLeave={e=>e.currentTarget.style.borderColor="#e5e5e5"}>
                <span style={{ color: PRIMARY, display: "flex" }}>{c.icon}</span>
                <span style={{ fontWeight: 600, minWidth: 65 }}>{c.label}:</span>
                <span style={{ color: "#78716c" }}>{c.value}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "24px 20px", textAlign: "center", borderTop: "1px solid #e5e5e5" }}>
        <div onClick={onLogoClick} style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <Logo size={22} /><span style={{ fontWeight: 700, color: PRIMARY, fontSize: 13 }}>KARO GROUP</span>
        </div>
        <p style={{ color: "#78716c", fontSize: 11 }}>© 2024 {t.footer.poweredBy}. {t.footer.rights}.</p>
      </footer>

      {lightbox && <div onClick={() => setLightbox(null)} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 16 }}><img src={lightbox} alt="" style={{ maxWidth: "92%", maxHeight: "92vh", borderRadius: 6, objectFit: "contain" }} /><button onClick={() => setLightbox(null)} style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><I.X /></button></div>}

      <style>{`
        @media(max-width:768px){.dnav{display:none!important}.mbtn{display:flex!important}.hgrid{grid-template-columns:repeat(2,1fr)!important}}
        @media(min-width:769px){.mbtn{display:none!important}}
        *{margin:0;padding:0;box-sizing:border-box}body{margin:0}
        @keyframes ping{0%{transform:scale(1);opacity:.6}75%,100%{transform:scale(1.6);opacity:0}}
        input,select,textarea{font-family:inherit}
      `}</style>
    </div>
  );
}

// ==================== LOGIN ====================
function LoginPage({ t, s, isRtl, fontFamily, onLogin, onBack }) {
  const [u, setU] = useState(""); const [p, setP] = useState(""); const [err, setErr] = useState(false);
  return (
    <div dir={isRtl?"rtl":"ltr"} style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9fafb", fontFamily, padding: 20 }}>
      <div style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: 16, padding: 40, width: "100%", maxWidth: 360, boxShadow: "0 8px 32px rgba(0,0,0,0.06)" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}><Logo size={50} /><h2 style={{ color: PRIMARY, marginTop: 12, fontSize: 20, fontWeight: 800 }}>{t.login}</h2></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div><label style={{ fontSize: 11, color: "#78716c", fontWeight: 600 }}>{t.username}</label><input value={u} onChange={e=>{setU(e.target.value);setErr(false)}} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${err?"#EF4444":"#e5e5e5"}`, background: "#f8f8f8", color: "#333", fontSize: 13, outline: "none", direction: "ltr", marginTop: 3 }} /></div>
          <div><label style={{ fontSize: 11, color: "#78716c", fontWeight: 600 }}>{t.password}</label><input type="password" value={p} onChange={e=>{setP(e.target.value);setErr(false)}} onKeyDown={e=>e.key==="Enter"&&(onLogin(u,p)||setErr(true))} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${err?"#EF4444":"#e5e5e5"}`, background: "#f8f8f8", color: "#333", fontSize: 13, outline: "none", direction: "ltr", marginTop: 3 }} /></div>
          {err && <p style={{ color: "#EF4444", fontSize: 11, textAlign: "center" }}>{t.wrongLogin}</p>}
          <button onClick={()=>{if(!onLogin(u,p))setErr(true)}} style={{ background: PRIMARY, color: "#fff", border: "none", borderRadius: 8, padding: "10px", fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 4 }}>{t.enter}</button>
          <button onClick={onBack} style={{ background: "none", border: "none", color: "#78716c", cursor: "pointer", fontSize: 12 }}>← {t.nav.home}</button>
        </div>
      </div>
    </div>
  );
}

// ==================== DASHBOARD ====================
function Dashboard({ t, s, isRtl, dark, lang, fontFamily, pKey, user, dashPage, setDashPage, onLogout, cashIQD, setCashIQD, cashUSD, setCashUSD, exchangeRate, setExchangeRate, cashLog, setCashLog, addCashLog, setDark, setLang, fontIdx, setFontIdx }) {
  const [formatModal, setFormatModal] = useState(false);
  const [fmtUser, setFmtUser] = useState(""); const [fmtPass, setFmtPass] = useState("");

  const items = [
    { id: "reports", label: t.sidebar.reports, icon: <I.Chart /> },
    { id: "cash", label: t.sidebar.cash, icon: "🏦" },
    { id: "expenses", label: t.sidebar.expenses, icon: "💰" },
    { id: "loans", label: t.sidebar.loans, icon: "🤝" },
    { id: "concrete", label: t.sidebar.concrete, icon: "🏗️" },
    { id: "contractor", label: t.sidebar.contractor, icon: "👷" },
    { id: "exchange", label: t.sidebar.exchange, icon: "💱" },
    { id: "invoice", label: t.sidebar.invoice, icon: "📄" },
    { id: "backup", label: t.sidebar.backup, icon: "💾" },
    { id: "history", label: t.sidebar.history, icon: <I.Clock /> },
    { id: "monthly", label: t.sidebar.monthlyReport, icon: "📊" },
  ];

  const doFormat = () => {
    if (fmtUser === "admin" && fmtPass === "karo2024") {
      const keys = []; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k?.startsWith("karo_") && k.includes(pKey)) keys.push(k); }
      keys.forEach(k => localStorage.removeItem(k));
      setCashIQD(0); setCashUSD(0); setCashLog([]); setExchangeRate(1500);
      setFormatModal(false); setFmtUser(""); setFmtPass("");
      alert(t.formatSuccess);
    }
  };

  const shared = { t, s, isRtl, dark, lang, fontFamily, pKey, cashIQD, setCashIQD, cashUSD, setCashUSD, exchangeRate, setExchangeRate, cashLog, setCashLog, addCashLog };

  return (
    <div dir={isRtl?"rtl":"ltr"} style={{ display: "flex", minHeight: "100vh", background: s.bg, fontFamily, color: s.text }}>
      {/* SIDEBAR - always visible */}
      <aside style={{ width: 240, minWidth: 240, background: dark?"#141414":"#fff", borderRight: isRtl?"none":`1px solid ${s.border}`, borderLeft: isRtl?`1px solid ${s.border}`:"none", display: "flex", flexDirection: "column", position: "fixed", top: 0, bottom: 0, [isRtl?"right":"left"]: 0, zIndex: 100, overflowY: "auto" }}>
        <div style={{ padding: "14px 12px", borderBottom: `1px solid ${s.border}`, display: "flex", alignItems: "center", gap: 7 }}>
          <Logo size={28} /><div><div style={{ fontWeight: 800, color: PRIMARY, fontSize: 13 }}>KARO GROUP</div><div style={{ fontSize: 9, color: s.textMuted }}>{user.label || user.project}</div></div>
        </div>
        {/* Cash */}
        <div style={{ padding: "10px 12px", borderBottom: `1px solid ${s.border}`, background: dark?"#0d0d0d":`${PRIMARY}06` }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: s.textMuted, marginBottom: 5 }}>{t.cashBox}</div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 2 }}><span>{t.iqd}:</span><span style={{ fontWeight: 700, color: cashIQD>=0?s.success:s.danger }}>{fmt(cashIQD)}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}><span>{t.usd}:</span><span style={{ fontWeight: 700, color: cashUSD>=0?s.success:s.danger }}>${fmt(cashUSD)}</span></div>
        </div>
        {/* Nav */}
        <nav style={{ flex: 1, padding: "6px 5px" }}>
          {items.map(p => (
            <button key={p.id} onClick={() => setDashPage(p.id)} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 10px", borderRadius: 7, border: "none", background: dashPage===p.id?`${PRIMARY}18`:"transparent", color: dashPage===p.id?PRIMARY:s.text, cursor: "pointer", fontSize: 12, fontWeight: dashPage===p.id?700:500, textAlign: isRtl?"right":"left", marginBottom: 1 }}>
              {typeof p.icon==="string"?<span style={{ fontSize: 14 }}>{p.icon}</span>:<span style={{ color: dashPage===p.id?PRIMARY:s.textMuted }}>{p.icon}</span>}{p.label}
            </button>
          ))}
          {/* Format Data */}
          <button onClick={() => setFormatModal(true)} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 10px", borderRadius: 7, border: "none", background: "transparent", color: s.danger, cursor: "pointer", fontSize: 12, fontWeight: 500, textAlign: isRtl?"right":"left", marginTop: 4 }}>🗑️ {t.sidebar.formatData}</button>
        </nav>
        {/* Bottom */}
        <div style={{ padding: "8px 10px", borderTop: `1px solid ${s.border}`, display: "flex", flexDirection: "column", gap: 4, fontSize: 11 }}>
          {/* Font */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ color: s.textMuted }}>{t.font}:</span>
            <select value={fontIdx} onChange={e => setFontIdx(Number(e.target.value))} style={{ flex: 1, background: s.bgCard2, color: s.text, border: `1px solid ${s.border}`, borderRadius: 5, padding: "3px 6px", fontSize: 10 }}>
              {FONTS.map((f, i) => <option key={i} value={i}>{f.name}</option>)}
            </select>
          </div>
          {/* Lang */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <I.Globe /><select value={lang} onChange={e => setLang(e.target.value)} style={{ flex: 1, background: s.bgCard2, color: s.text, border: `1px solid ${s.border}`, borderRadius: 5, padding: "3px 6px", fontSize: 10 }}><option value="ku">کوردی</option><option value="en">English</option><option value="ar">عربي</option></select>
          </div>
          <button onClick={() => setDark(!dark)} style={{ display: "flex", alignItems: "center", gap: 5, width: "100%", padding: "6px 8px", borderRadius: 5, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, cursor: "pointer", fontSize: 11 }}>{dark?<I.Sun />:<I.Moon />} {dark?t.light:t.dark}</button>
          <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 5, width: "100%", padding: "6px 8px", borderRadius: 5, border: "none", background: "#FEE2E2", color: "#EF4444", cursor: "pointer", fontSize: 11, fontWeight: 600 }}><I.Logout /> {t.logout}</button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, [isRtl?"marginRight":"marginLeft"]: 240, padding: 16, minHeight: "100vh", width: "calc(100vw - 240px)" }}>
        {dashPage === "reports" && <ReportsPage {...shared} />}
        {dashPage === "expenses" && <ExpensesPage {...shared} />}
        {dashPage === "loans" && <LoansPage {...shared} />}
        {dashPage === "concrete" && <ConcretePage {...shared} />}
        {dashPage === "contractor" && <ContractorPage {...shared} />}
        {dashPage === "cash" && <CashPage {...shared} />}
        {dashPage === "exchange" && <ExchangePage {...shared} />}
        {dashPage === "invoice" && <InvoicePage {...shared} />}
        {dashPage === "backup" && <BackupPage {...shared} />}
        {dashPage === "history" && <HistoryPage {...shared} />}
        {dashPage === "monthly" && <MonthlyPage {...shared} />}
      </main>

      {/* FORMAT MODAL */}
      {formatModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: s.bgCard, borderRadius: 14, padding: 28, maxWidth: 340, width: "100%", textAlign: "center" }}>
            <div style={{ marginBottom: 14 }}><I.Warn /></div>
            <p style={{ fontSize: 13, marginBottom: 16, color: s.text, lineHeight: 1.6 }}>{t.formatConfirm}</p>
            <input placeholder={t.username} value={fmtUser} onChange={e=>setFmtUser(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, marginBottom: 8, direction: "ltr" }} />
            <input type="password" placeholder={t.password} value={fmtPass} onChange={e=>setFmtPass(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, marginBottom: 14, direction: "ltr" }} />
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              <button onClick={doFormat} style={{ background: s.danger, color: "#fff", border: "none", borderRadius: 6, padding: "8px 20px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>{t.delete}</button>
              <button onClick={() => setFormatModal(false)} style={{ background: s.bgCard2, color: s.text, border: `1px solid ${s.border}`, borderRadius: 6, padding: "8px 20px", fontSize: 12, cursor: "pointer" }}>{t.cancel}</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}body{margin:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:${PRIMARY}30;border-radius:2px}
        input,select,textarea{font-family:inherit}
        @media print{aside,.noprint{display:none!important}main{margin:0!important;padding:8px!important;width:100%!important}}
        @keyframes ping{0%{transform:scale(1);opacity:.6}75%,100%{transform:scale(1.6);opacity:0}}
        @media(max-width:768px){aside{width:190px!important;min-width:190px!important}main{margin-left:190px!important;margin-right:190px!important;width:calc(100vw - 190px)!important}}
      `}</style>
    </div>
  );
}

// ==================== SHARED TABLE HEADER ====================
const TH = ({ children, isRtl, style }) => <th style={{ padding: "8px 6px", textAlign: isRtl?"right":"left", fontWeight: 600, fontSize: 11, whiteSpace: "nowrap", background: PRIMARY, color: "#fff", position: "sticky", top: 0, ...style }}>{children}</th>;

// ==================== REPORTS ====================
function ReportsPage({ t, s, isRtl, pKey, cashIQD, cashUSD, exchangeRate }) {
  const exp = getLS(`karo_exp_${pKey}`, []);
  const loans = getLS(`karo_loans_${pKey}`, []);
  const conc = getLS(`karo_conc_${pKey}`, []);

  const tExpIQD = exp.reduce((a,b) => a + Number(b.amountIQD||0), 0);
  const tExpUSD = exp.reduce((a,b) => a + Number(b.amountUSD||0), 0);
  const tConcRec = conc.reduce((a,b) => a + Number(b.received||0), 0);
  const tConcDep = conc.reduce((a,b) => a + Number(b.deposit||0), 0);
  const tLoanTake = loans.filter(l=>l.type==="take").reduce((a,b)=>a+Number(b.amountIQD||0),0);
  const tLoanGive = loans.filter(l=>l.type==="give").reduce((a,b)=>a+Number(b.amountIQD||0),0);

  const cards = [
    { label: t.cashIQD, val: fmt(cashIQD)+" "+t.iqd, c: cashIQD>=0?s.success:s.danger },
    { label: t.cashUSD, val: "$"+fmt(cashUSD), c: cashUSD>=0?s.success:s.danger },
    { label: t.totalInIQD, val: fmt(Math.round(cashIQD+cashUSD*exchangeRate))+" "+t.iqd, c: PRIMARY },
    { label: t.totalExpIQD, val: fmt(tExpIQD)+" "+t.iqd, c: s.danger },
    { label: t.totalExpUSD, val: "$"+fmt(tExpUSD), c: s.danger },
    { label: t.totalConcreteReceived, val: fmt(tConcRec), c: s.success },
    { label: t.totalDeposit, val: fmt(tConcDep), c: "#F59E0B" },
    { label: t.loanTake, val: fmt(tLoanTake), c: s.success },
    { label: t.loanGive, val: fmt(tLoanGive), c: s.danger },
  ];

  // simple bar chart data
  const chartData = [
    { label: t.sidebar.expenses, val: tExpIQD, c: s.danger },
    { label: t.totalConcreteReceived, val: tConcRec, c: s.success },
    { label: t.totalDeposit, val: tConcDep, c: "#F59E0B" },
    { label: t.loanTake, val: tLoanTake, c: PRIMARY },
    { label: t.loanGive, val: tLoanGive, c: "#8B5CF6" },
  ];
  const maxVal = Math.max(...chartData.map(d => d.val), 1);

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16, color: PRIMARY }}>{t.reportsTitle}</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginBottom: 24 }}>
        {cards.map((c, i) => (
          <div key={i} style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 12, padding: 16, borderTop: `3px solid ${c.c}`, textAlign: "center" }}>
            <div style={{ fontSize: 10, color: s.textMuted, fontWeight: 600, marginBottom: 6 }}>{c.label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: c.c, direction: "ltr" }}>{c.val}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 12, padding: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: PRIMARY }}>Report Chart</h3>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 200, paddingBottom: 30, position: "relative" }}>
          {chartData.map((d, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: d.c }}>{fmt(d.val)}</span>
              <div style={{ width: "100%", maxWidth: 60, height: `${Math.max((d.val / maxVal) * 160, 4)}px`, background: `linear-gradient(180deg, ${d.c}, ${d.c}90)`, borderRadius: "6px 6px 0 0", transition: "height 0.5s" }} />
              <span style={{ fontSize: 9, color: s.textMuted, textAlign: "center", lineHeight: 1.2 }}>{d.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==================== EXPENSES ====================
function ExpensesPage({ t, s, isRtl, pKey, cashIQD, setCashIQD, cashUSD, setCashUSD, addCashLog }) {
  const KEY = `karo_exp_${pKey}`;
  const [items, setItems] = useState(getLS(KEY, []));
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ amountIQD: "", amountUSD: "", receiptNo: "", note: "", date: today(), receiptImg: "" });
  const [search, setSearch] = useState(""); const [filterMonth, setFilterMonth] = useState("");
  const [showMarkedOnly, setShowMarkedOnly] = useState(false);
  const [alert, setAlert] = useState(null); const [sizeModal, setSizeModal] = useState(null); const [imgPreview, setImgPreview] = useState(null);

  useEffect(() => { setLS(KEY, items); }, [items, KEY]);

  const months = [...new Set(items.map(i => i.date?.slice(0,7)))].sort().reverse();
  const filtered = items.filter(i => {
    if (search && !Object.values(i).some(v => String(v||"").toLowerCase().includes(search.toLowerCase()))) return false;
    if (filterMonth && !i.date?.startsWith(filterMonth)) return false;
    if (showMarkedOnly && !i.marked) return false;
    return true;
  });
  const totalIQD = filtered.reduce((a,b) => a+Number(b.amountIQD||0), 0);
  const totalUSD = filtered.reduce((a,b) => a+Number(b.amountUSD||0), 0);

  const resetForm = () => { setForm({ amountIQD: "", amountUSD: "", receiptNo: "", note: "", date: today(), receiptImg: "" }); setEditId(null); };

  const handleSave = () => {
    const iqd = Number(form.amountIQD||0), usd = Number(form.amountUSD||0);
    if (iqd === 0 && usd === 0) return;

    if (editId) {
      const old = items.find(i => i.id === editId);
      if (old) {
        const diffIQD = Number(old.amountIQD||0) - iqd;
        const diffUSD = Number(old.amountUSD||0) - usd;
        if (diffIQD < 0 && Math.abs(diffIQD) > cashIQD) { setAlert(t.noBalance); return; }
        if (diffUSD < 0 && Math.abs(diffUSD) > cashUSD) { setAlert(t.noBalance); return; }
        setCashIQD(prev => prev + diffIQD); setCashUSD(prev => prev + diffUSD);
        addCashLog(`${t.edit} ${t.sidebar.expenses}`, diffIQD, diffUSD);
      }
      setItems(prev => prev.map(i => i.id === editId ? { ...i, ...form } : i));
    } else {
      if (iqd > 0 && cashIQD < iqd) { setAlert(t.noBalance); return; }
      if (usd > 0 && cashUSD < usd) { setAlert(t.noBalance); return; }
      setItems(prev => [{ ...form, id: genId(), marked: false }, ...prev]);
      if (iqd > 0) setCashIQD(prev => prev - iqd);
      if (usd > 0) setCashUSD(prev => prev - usd);
      addCashLog(`${t.sidebar.expenses}: ${form.note||form.receiptNo}`, -iqd, -usd);
    }
    resetForm(); setShowForm(false);
  };

  const handleDelete = (id) => {
    const item = items.find(i => i.id === id);
    if (item) { setCashIQD(prev => prev + Number(item.amountIQD||0)); setCashUSD(prev => prev + Number(item.amountUSD||0)); addCashLog(`${t.delete} ${t.sidebar.expenses}`, Number(item.amountIQD||0), Number(item.amountUSD||0)); }
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleEdit = (item) => { setForm(item); setEditId(item.id); setShowForm(true); };
  const toggleMark = id => setItems(prev => prev.map(i => i.id===id ? {...i, marked: !i.marked} : i));

  const handleImgUpload = e => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = ev => setForm(prev => ({...prev, receiptImg: ev.target.result})); r.readAsDataURL(f); };

  const handleImportExcel = e => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const text = ev.target.result;
      const lines = text.split("\n").filter(l => l.trim());
      if (lines.length < 2) return;
      const newItems = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",").map(c => c.replace(/"/g, "").trim());
        if (cols.length < 2) continue;
        const iqd = Number(cols[0]||0), usd = Number(cols[1]||0);
        const item = { id: genId(), amountIQD: cols[0]||"", amountUSD: cols[1]||"", receiptNo: cols[2]||"", note: cols[3]||"", date: cols[4]||today(), receiptImg: "", marked: false };
        newItems.push(item);
        if (iqd > 0) setCashIQD(prev => prev - iqd);
        if (usd > 0) setCashUSD(prev => prev - usd);
        addCashLog(`${t.importExcel}: ${item.note||item.receiptNo}`, -iqd, -usd);
      }
      setItems(prev => [...newItems, ...prev]);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const doExport = (type, size) => {
    const hdrs = [t.amountIQD, t.amountUSD, t.receiptNo, t.note, t.date];
    const rows = filtered.map(i => [fmt(i.amountIQD||0), fmt(i.amountUSD||0), i.receiptNo||"", i.note||"", i.date||""]);
    const tr = [fmt(totalIQD), fmt(totalUSD), "", t.total, ""];
    if (type==="pdf") doPrint({ title: t.sidebar.expenses, headers: hdrs, rows, totalRow: tr, size, isRtl });
    else doExcel({ title: "expenses", headers: hdrs, rows, totalRow: tr });
    setSizeModal(null);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 6 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: PRIMARY }}>{t.sidebar.expenses}</h1>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          <label style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, cursor: "pointer", fontSize: 11, color: s.text }}><I.Upload /> {t.importExcel}<input type="file" accept=".csv,.txt" onChange={handleImportExcel} style={{ display: "none" }} /></label>
          <button onClick={() => setSizeModal({type:"pdf"})} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}><I.File /> {t.savePDF}</button>
          <button onClick={() => setSizeModal({type:"excel"})} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}><I.Download /> {t.saveExcel}</button>
          <button onClick={() => { setShowForm(!showForm); resetForm(); }} style={{ padding: "6px 14px", borderRadius: 6, border: "none", background: PRIMARY, color: "#fff", cursor: "pointer", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}><I.Plus /> {t.add}</button>
        </div>
      </div>

      {/* Totals */}
      <div style={{ display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
        <div style={{ background: `${PRIMARY}10`, borderRadius: 8, padding: "6px 14px", fontSize: 12 }}><span style={{ color: s.textMuted }}>{t.total} {t.iqd}: </span><strong style={{ color: PRIMARY }}>{fmt(totalIQD)}</strong></div>
        <div style={{ background: `${PRIMARY}10`, borderRadius: 8, padding: "6px 14px", fontSize: 12 }}><span style={{ color: s.textMuted }}>{t.total} {t.usd}: </span><strong style={{ color: PRIMARY }}>${fmt(totalUSD)}</strong></div>
      </div>

      {/* Search/Filter */}
      <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 10, padding: 10, marginBottom: 10, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div style={{ flex: 1, minWidth: 140 }}><label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600 }}>{t.search}</label><input value={search} onChange={e=>setSearch(e.target.value)} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, outline: "none" }} /></div>
        <div><label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600 }}>{t.filterMonth}</label><select value={filterMonth} onChange={e=>setFilterMonth(e.target.value)} style={{ padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12 }}><option value="">{t.allMonths}</option>{months.map(m=><option key={m} value={m}>{m}</option>)}</select></div>
        {showMarkedOnly
          ? <button onClick={() => { setShowMarkedOnly(false); setItems(prev => prev.map(i => ({...i, marked: false}))); }} style={{ padding: "6px 12px", borderRadius: 6, border: "none", background: "#D1FAE5", color: "#059669", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>{t.showAll}</button>
          : <button onClick={() => setShowMarkedOnly(true)} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 11, cursor: "pointer" }}>{t.showMarked}</button>
        }
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ background: s.bgCard, border: `1px solid ${PRIMARY}40`, borderRadius: 10, padding: 14, marginBottom: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 8 }}>
            <div><label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600 }}>{t.amountIQD}</label><input type="number" value={form.amountIQD} onChange={e=>setForm({...form, amountIQD: e.target.value})} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, direction: "ltr" }} /></div>
            <div><label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600 }}>{t.amountUSD}</label><input type="number" value={form.amountUSD} onChange={e=>setForm({...form, amountUSD: e.target.value})} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, direction: "ltr" }} /></div>
            <div><label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600 }}>{t.receiptNo}</label><input value={form.receiptNo} onChange={e=>setForm({...form, receiptNo: e.target.value})} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12 }} /></div>
            <div><label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600 }}>{t.note}</label><input value={form.note} onChange={e=>setForm({...form, note: e.target.value})} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12 }} /></div>
            <div><label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600 }}>{t.date}</label><input type="date" value={form.date} onChange={e=>setForm({...form, date: e.target.value})} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, direction: "ltr" }} /></div>
            <div><label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600 }}>{t.receiptImg}</label><label style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 10px", borderRadius: 6, border: `1px dashed ${s.border}`, background: s.bgCard2, cursor: "pointer", fontSize: 11, color: s.textMuted }}><I.Upload /> {t.receiptImg}<input type="file" accept="image/*" onChange={handleImgUpload} style={{ display: "none" }} /></label>
              {form.receiptImg && <div style={{ display: "flex", gap: 4, alignItems: "center", marginTop: 3 }}><img src={form.receiptImg} alt="" style={{ width: 32, height: 32, objectFit: "cover", borderRadius: 3 }} /><button onClick={()=>setForm(p=>({...p,receiptImg:""}))} style={{ background: "none", border: "none", color: s.danger, cursor: "pointer", fontSize: 10 }}>{t.removeImg}</button></div>}
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
            <button onClick={handleSave} style={{ padding: "7px 18px", borderRadius: 6, border: "none", background: PRIMARY, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{editId ? t.edit : t.save}</button>
            <button onClick={()=>{setShowForm(false);resetForm()}} style={{ padding: "7px 18px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, cursor: "pointer" }}>{t.cancel}</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 10, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: "14%" }} /><col style={{ width: "12%" }} /><col style={{ width: "10%" }} /><col style={{ width: "20%" }} /><col style={{ width: "12%" }} /><col style={{ width: "6%" }} /><col style={{ width: "5%" }} /><col style={{ width: "8%" }} />
            </colgroup>
            <thead><tr>
              <TH isRtl={isRtl}>{t.amountIQD}</TH>
              <TH isRtl={isRtl}>{t.amountUSD}</TH>
              <TH isRtl={isRtl}>{t.receiptNo}</TH>
              <TH isRtl={isRtl}>{t.note}</TH>
              <TH isRtl={isRtl}>{t.date}</TH>
              <TH isRtl={isRtl}>{t.receiptImg}</TH>
              <TH isRtl={isRtl}>{t.mark}</TH>
              <TH isRtl={isRtl}></TH>
            </tr></thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id} style={{ borderBottom: `1px solid ${s.border}`, background: item.marked?`${PRIMARY}06`:"transparent" }}>
                  <td style={{ padding: "7px 6px", direction: "ltr", fontWeight: 600 }}>{Number(item.amountIQD)?fmt(item.amountIQD):"—"}</td>
                  <td style={{ padding: "7px 6px", direction: "ltr", fontWeight: 600 }}>{Number(item.amountUSD)?"$"+fmt(item.amountUSD):"—"}</td>
                  <td style={{ padding: "7px 6px" }}>{item.receiptNo}</td>
                  <td style={{ padding: "7px 6px", color: s.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={item.note}>{trunc(item.note)}</td>
                  <td style={{ padding: "7px 6px", direction: "ltr", whiteSpace: "nowrap" }}>{item.date}</td>
                  <td style={{ padding: "7px 6px" }}>{item.receiptImg ? <img src={item.receiptImg} alt="" style={{ width: 24, height: 24, objectFit: "cover", borderRadius: 3, cursor: "pointer" }} onClick={()=>setImgPreview(item.receiptImg)} /> : "—"}</td>
                  <td style={{ padding: "7px 6px", textAlign: "center" }}><button onClick={()=>toggleMark(item.id)} style={{ width: 20, height: 20, borderRadius: 3, border: `2px solid ${item.marked?PRIMARY:s.border}`, background: item.marked?PRIMARY:"transparent", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>{item.marked&&<I.Check />}</button></td>
                  <td style={{ padding: "7px 6px" }}><div style={{ display: "flex", gap: 2 }}><button onClick={()=>handleEdit(item)} style={{ background: "none", border: "none", color: PRIMARY, cursor: "pointer", padding: 2 }}><I.Edit /></button><button onClick={()=>handleDelete(item.id)} style={{ background: "none", border: "none", color: s.danger, cursor: "pointer", padding: 2 }}><I.Trash /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length===0 && <div style={{ padding: 30, textAlign: "center", color: s.textMuted, fontSize: 12 }}>{t.noData}</div>}
        </div>
      </div>

      {alert && <AlertModal message={alert} onOk={()=>{setAlert(null);resetForm();setShowForm(false)}} s={s} />}
      {sizeModal && <SizeModal t={t} s={s} onSelect={sz=>doExport(sizeModal.type, sz)} onClose={()=>setSizeModal(null)} />}
      {imgPreview && <div onClick={()=>setImgPreview(null)} style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 16 }}><img src={imgPreview} alt="" style={{ maxWidth: "90%", maxHeight: "90vh", borderRadius: 6 }} /></div>}
    </div>
  );
}

// ==================== LOANS (with persons) ====================
function LoansPage({ t, s, isRtl, pKey, cashIQD, setCashIQD, cashUSD, setCashUSD, addCashLog }) {
  const KEY = `karo_loans_${pKey}`;
  const [items, setItems] = useState(getLS(KEY, []));
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ type: "take", personName: "", amountIQD: "", amountUSD: "", note: "", date: today() });
  const [alert, setAlert] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState("");
  const [newPerson, setNewPerson] = useState("");
  const [sizeModal, setSizeModal] = useState(null);
  const [showMarkedOnly, setShowMarkedOnly] = useState(false);

  useEffect(() => { setLS(KEY, items); }, [items, KEY]);

  const persons = [...new Set(items.map(i => i.personName).filter(Boolean))];
  const filtered = items.filter(i => {
    if (selectedPerson && i.personName !== selectedPerson) return false;
    if (showMarkedOnly && !i.marked) return false;
    return true;
  });

  const resetForm = () => { setForm({ type: "take", personName: "", amountIQD: "", amountUSD: "", note: "", date: today() }); setEditId(null); };

  const handleSave = () => {
    const iqd = Number(form.amountIQD||0), usd = Number(form.amountUSD||0);
    if (iqd===0 && usd===0) return;
    const pName = newPerson || form.personName;
    if (!pName) return;

    if (editId) {
      const old = items.find(i => i.id === editId);
      if (old) {
        // reverse old effect
        if (old.type==="take") { setCashIQD(p=>p-Number(old.amountIQD||0)); setCashUSD(p=>p-Number(old.amountUSD||0)); }
        else { setCashIQD(p=>p+Number(old.amountIQD||0)); setCashUSD(p=>p+Number(old.amountUSD||0)); }
      }
      // apply new
      if (form.type==="take") { setCashIQD(p=>p+iqd); setCashUSD(p=>p+usd); addCashLog(`${t.edit} ${t.loanTake}: ${pName}`, iqd, usd); }
      else {
        if (iqd>cashIQD||usd>cashUSD) { setAlert(t.noBalance); return; }
        setCashIQD(p=>p-iqd); setCashUSD(p=>p-usd); addCashLog(`${t.edit} ${t.loanGive}: ${pName}`, -iqd, -usd);
      }
      setItems(prev => prev.map(i => i.id===editId ? {...i, ...form, personName: pName} : i));
    } else {
      if (form.type==="give") {
        if (iqd>cashIQD||usd>cashUSD) { setAlert(t.noBalance); return; }
        setCashIQD(p=>p-iqd); setCashUSD(p=>p-usd); addCashLog(`${t.loanGive}: ${pName}`, -iqd, -usd);
      } else {
        setCashIQD(p=>p+iqd); setCashUSD(p=>p+usd); addCashLog(`${t.loanTake}: ${pName}`, iqd, usd);
      }
      setItems(prev => [{...form, personName: pName, id: genId(), marked: false}, ...prev]);
    }
    resetForm(); setNewPerson(""); setShowForm(false);
  };

  const handleDelete = id => {
    const item = items.find(i=>i.id===id);
    if (item) {
      if (item.type==="take") { setCashIQD(p=>p-Number(item.amountIQD||0)); setCashUSD(p=>p-Number(item.amountUSD||0)); addCashLog(`${t.delete} ${t.loanTake}`, -Number(item.amountIQD||0), -Number(item.amountUSD||0)); }
      else { setCashIQD(p=>p+Number(item.amountIQD||0)); setCashUSD(p=>p+Number(item.amountUSD||0)); addCashLog(`${t.delete} ${t.loanGive}`, Number(item.amountIQD||0), Number(item.amountUSD||0)); }
    }
    setItems(prev => prev.filter(i=>i.id!==id));
  };

  const handleEdit = item => { setForm(item); setEditId(item.id); setShowForm(true); };
  const toggleMark = id => setItems(prev => prev.map(i => i.id===id?{...i,marked:!i.marked}:i));

  const doExport = (type, size) => {
    const hdrs = [t.loanType, t.personName, t.amountIQD, t.amountUSD, t.note, t.date];
    const rows = filtered.map(i => [i.type==="take"?t.loanTake:t.loanGive, i.personName, fmt(i.amountIQD||0), fmt(i.amountUSD||0), i.note||"", i.date||""]);
    if (type==="pdf") doPrint({ title: t.sidebar.loans, headers: hdrs, rows, size, isRtl });
    else doExcel({ title: "loans", headers: hdrs, rows });
    setSizeModal(null);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 6 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: PRIMARY }}>{t.sidebar.loans}</h1>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          <button onClick={()=>setSizeModal({type:"pdf"})} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}><I.File /> {t.savePDF}</button>
          <button onClick={()=>setSizeModal({type:"excel"})} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}><I.Download /> {t.saveExcel}</button>
          <button onClick={()=>{setShowForm(!showForm);resetForm()}} style={{ padding: "6px 14px", borderRadius: 6, border: "none", background: PRIMARY, color: "#fff", cursor: "pointer", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}><I.Plus /> {t.add}</button>
        </div>
      </div>

      {/* Persons filter */}
      <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
        <button onClick={()=>setSelectedPerson("")} style={{ padding: "5px 12px", borderRadius: 20, border: !selectedPerson?`2px solid ${PRIMARY}`:`1px solid ${s.border}`, background: !selectedPerson?`${PRIMARY}15`:"transparent", color: !selectedPerson?PRIMARY:s.text, cursor: "pointer", fontSize: 11, fontWeight: 600 }}>{t.allPersons}</button>
        {persons.map(p => (
          <button key={p} onClick={()=>setSelectedPerson(p)} style={{ padding: "5px 12px", borderRadius: 20, border: selectedPerson===p?`2px solid ${PRIMARY}`:`1px solid ${s.border}`, background: selectedPerson===p?`${PRIMARY}15`:"transparent", color: selectedPerson===p?PRIMARY:s.text, cursor: "pointer", fontSize: 11, fontWeight: 600 }}>{p}</button>
        ))}
        {showMarkedOnly
          ? <button onClick={()=>{setShowMarkedOnly(false);setItems(prev=>prev.map(i=>({...i,marked:false})))}} style={{ padding: "5px 12px", borderRadius: 20, border: "none", background: "#D1FAE5", color: "#059669", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>{t.showAll}</button>
          : <button onClick={()=>setShowMarkedOnly(true)} style={{ padding: "5px 12px", borderRadius: 20, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 11, cursor: "pointer" }}>{t.showMarked}</button>
        }
      </div>

      {showForm && (
        <div style={{ background: s.bgCard, border: `1px solid ${PRIMARY}40`, borderRadius: 10, padding: 14, marginBottom: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 8 }}>
            <div><label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600 }}>{t.loanType}</label><select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12 }}><option value="take">{t.loanTake}</option><option value="give">{t.loanGive}</option></select></div>
            <div><label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600 }}>{t.personName}</label>
              {persons.length > 0 && <select value={form.personName} onChange={e=>setForm({...form,personName:e.target.value})} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, marginBottom: 4 }}><option value="">—</option>{persons.map(p=><option key={p} value={p}>{p}</option>)}</select>}
              <input placeholder={t.addPerson} value={newPerson} onChange={e=>setNewPerson(e.target.value)} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12 }} />
            </div>
            <div><label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600 }}>{t.amountIQD}</label><input type="number" value={form.amountIQD} onChange={e=>setForm({...form,amountIQD:e.target.value})} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, direction: "ltr" }} /></div>
            <div><label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600 }}>{t.amountUSD}</label><input type="number" value={form.amountUSD} onChange={e=>setForm({...form,amountUSD:e.target.value})} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, direction: "ltr" }} /></div>
            <div><label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600 }}>{t.note}</label><input value={form.note} onChange={e=>setForm({...form,note:e.target.value})} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12 }} /></div>
            <div><label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600 }}>{t.date}</label><input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, direction: "ltr" }} /></div>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
            <button onClick={handleSave} style={{ padding: "7px 18px", borderRadius: 6, border: "none", background: PRIMARY, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{editId?t.edit:t.save}</button>
            <button onClick={()=>{setShowForm(false);resetForm()}} style={{ padding: "7px 18px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, cursor: "pointer" }}>{t.cancel}</button>
          </div>
        </div>
      )}

      <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 10, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, tableLayout: "fixed" }}>
            <colgroup><col style={{width:"12%"}}/><col style={{width:"16%"}}/><col style={{width:"14%"}}/><col style={{width:"12%"}}/><col style={{width:"18%"}}/><col style={{width:"12%"}}/><col style={{width:"5%"}}/><col style={{width:"8%"}}/></colgroup>
            <thead><tr>
              <TH isRtl={isRtl}>{t.loanType}</TH><TH isRtl={isRtl}>{t.personName}</TH><TH isRtl={isRtl}>{t.amountIQD}</TH><TH isRtl={isRtl}>{t.amountUSD}</TH><TH isRtl={isRtl}>{t.note}</TH><TH isRtl={isRtl}>{t.date}</TH><TH isRtl={isRtl}>{t.mark}</TH><TH isRtl={isRtl}></TH>
            </tr></thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id} style={{ borderBottom: `1px solid ${s.border}`, background: item.marked?`${PRIMARY}06`:"transparent" }}>
                  <td style={{ padding: "7px 6px" }}><span style={{ padding: "2px 8px", borderRadius: 10, fontSize: 10, fontWeight: 600, background: item.type==="take"?"#D1FAE5":"#FEE2E2", color: item.type==="take"?"#059669":"#EF4444" }}>{item.type==="take"?t.loanTake:t.loanGive}</span></td>
                  <td style={{ padding: "7px 6px", fontWeight: 600 }}>{item.personName}</td>
                  <td style={{ padding: "7px 6px", direction: "ltr" }}>{Number(item.amountIQD)?fmt(item.amountIQD):"—"}</td>
                  <td style={{ padding: "7px 6px", direction: "ltr" }}>{Number(item.amountUSD)?"$"+fmt(item.amountUSD):"—"}</td>
                  <td style={{ padding: "7px 6px", color: s.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={item.note}>{trunc(item.note)}</td>
                  <td style={{ padding: "7px 6px", direction: "ltr", whiteSpace: "nowrap" }}>{item.date}</td>
                  <td style={{ padding: "7px 6px", textAlign: "center" }}><button onClick={()=>toggleMark(item.id)} style={{ width: 20, height: 20, borderRadius: 3, border: `2px solid ${item.marked?PRIMARY:s.border}`, background: item.marked?PRIMARY:"transparent", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>{item.marked&&<I.Check />}</button></td>
                  <td style={{ padding: "7px 6px" }}><div style={{ display: "flex", gap: 2 }}><button onClick={()=>handleEdit(item)} style={{ background: "none", border: "none", color: PRIMARY, cursor: "pointer", padding: 2 }}><I.Edit /></button><button onClick={()=>handleDelete(item.id)} style={{ background: "none", border: "none", color: s.danger, cursor: "pointer", padding: 2 }}><I.Trash /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length===0 && <div style={{ padding: 30, textAlign: "center", color: s.textMuted, fontSize: 12 }}>{t.noData}</div>}
        </div>
      </div>

      {alert && <AlertModal message={alert} onOk={()=>{setAlert(null);resetForm();setShowForm(false)}} s={s} />}
      {sizeModal && <SizeModal t={t} s={s} onSelect={sz=>doExport(sizeModal.type, sz)} onClose={()=>setSizeModal(null)} />}
    </div>
  );
}

// ==================== CONCRETE ====================
function ConcretePage({ t, s, isRtl, pKey, cashIQD, setCashIQD, cashUSD, setCashUSD, addCashLog }) {
  const KEY = `karo_conc_${pKey}`;
  const [items, setItems] = useState(getLS(KEY, []));
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: today(), meters: "", pricePerMeter: "", depositPercent: "", note: "" });
  const [alert, setAlert] = useState(null);
  const [sizeModal, setSizeModal] = useState(null);
  const [showMarkedOnly, setShowMarkedOnly] = useState(false);

  useEffect(() => { setLS(KEY, items); }, [items, KEY]);

  const totalPrice = Number(form.meters||0) * Number(form.pricePerMeter||0);
  const depositAmt = Math.round(totalPrice * Number(form.depositPercent||0) / 100);
  const receivedAmt = totalPrice - depositAmt;

  const filtered = items.filter(i => showMarkedOnly ? i.marked : true);

  const handleSave = () => {
    if (totalPrice <= 0) return;
    const item = { ...form, id: genId(), totalPrice, deposit: depositAmt, received: receivedAmt, depositClaimed: false, marked: false };
    setItems(prev => [item, ...prev]);
    if (receivedAmt > 0) { setCashIQD(prev => prev + receivedAmt); addCashLog(`${t.received} ${t.sidebar.concrete}`, receivedAmt, 0); }
    setForm({ date: today(), meters: "", pricePerMeter: "", depositPercent: "", note: "" });
    setShowForm(false);
  };

  const claimDeposit = id => {
    const item = items.find(i => i.id === id);
    if (item && !item.depositClaimed && item.deposit > 0) {
      setCashIQD(prev => prev + item.deposit);
      addCashLog(`${t.claimDeposit}: ${item.deposit}`, item.deposit, 0);
      setItems(prev => prev.map(i => i.id === id ? { ...i, depositClaimed: true } : i));
    }
  };

  const handleDelete = id => {
    const item = items.find(i => i.id === id);
    if (item) {
      setCashIQD(prev => prev - Number(item.received||0));
      if (item.depositClaimed) setCashIQD(prev => prev - Number(item.deposit||0));
      addCashLog(`${t.delete} ${t.sidebar.concrete}`, -(Number(item.received||0) + (item.depositClaimed ? Number(item.deposit||0) : 0)), 0);
    }
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const toggleMark = id => setItems(prev => prev.map(i => i.id===id?{...i,marked:!i.marked}:i));

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 6 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: PRIMARY }}>{t.sidebar.concrete}</h1>
        <div style={{ display: "flex", gap: 5 }}>
          {showMarkedOnly
            ? <button onClick={()=>{setShowMarkedOnly(false);setItems(prev=>prev.map(i=>({...i,marked:false})))}} style={{ padding: "6px 12px", borderRadius: 6, border: "none", background: "#D1FAE5", color: "#059669", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>{t.showAll}</button>
            : <button onClick={()=>setShowMarkedOnly(true)} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 11, cursor: "pointer" }}>{t.showMarked}</button>
          }
          <button onClick={()=>setShowForm(!showForm)} style={{ padding: "6px 14px", borderRadius: 6, border: "none", background: PRIMARY, color: "#fff", cursor: "pointer", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}><I.Plus /> {t.add}</button>
        </div>
      </div>

      {showForm && (
        <div style={{ background: s.bgCard, border: `1px solid ${PRIMARY}40`, borderRadius: 10, padding: 14, marginBottom: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 8 }}>
            <div><label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600 }}>{t.date}</label><input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, direction: "ltr" }} /></div>
            <div><label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600 }}>{t.meters}</label><input type="number" value={form.meters} onChange={e=>setForm({...form,meters:e.target.value})} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, direction: "ltr" }} /></div>
            <div><label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600 }}>{t.pricePerMeter}</label><input type="number" value={form.pricePerMeter} onChange={e=>setForm({...form,pricePerMeter:e.target.value})} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, direction: "ltr" }} /></div>
            <div><label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600 }}>{t.totalConcrete}</label><div style={{ padding: "6px 10px", borderRadius: 6, background: `${PRIMARY}10`, fontWeight: 700, color: PRIMARY, fontSize: 12 }}>{fmt(totalPrice)}</div></div>
            <div><label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600 }}>{t.depositPercent}</label><input type="number" value={form.depositPercent} onChange={e=>setForm({...form,depositPercent:e.target.value})} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, direction: "ltr" }} placeholder="%" /></div>
            <div><label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600 }}>{t.deposit}</label><div style={{ padding: "6px 10px", borderRadius: 6, background: "#FEF3C7", fontWeight: 700, color: "#D97706", fontSize: 12 }}>{fmt(depositAmt)}</div></div>
            <div><label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600 }}>{t.received}</label><div style={{ padding: "6px 10px", borderRadius: 6, background: "#D1FAE5", fontWeight: 700, color: "#059669", fontSize: 12 }}>{fmt(receivedAmt)}</div></div>
            <div><label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600 }}>{t.note}</label><input value={form.note} onChange={e=>setForm({...form,note:e.target.value})} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12 }} /></div>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
            <button onClick={handleSave} style={{ padding: "7px 18px", borderRadius: 6, border: "none", background: PRIMARY, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{t.save}</button>
            <button onClick={()=>setShowForm(false)} style={{ padding: "7px 18px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, cursor: "pointer" }}>{t.cancel}</button>
          </div>
        </div>
      )}

      <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 10, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, tableLayout: "fixed" }}>
            <colgroup><col style={{width:"11%"}}/><col style={{width:"9%"}}/><col style={{width:"9%"}}/><col style={{width:"11%"}}/><col style={{width:"9%"}}/><col style={{width:"8%"}}/><col style={{width:"11%"}}/><col style={{width:"14%"}}/><col style={{width:"5%"}}/><col style={{width:"10%"}}/></colgroup>
            <thead><tr>
              <TH isRtl={isRtl}>{t.date}</TH><TH isRtl={isRtl}>{t.meters}</TH><TH isRtl={isRtl}>{t.pricePerMeter}</TH><TH isRtl={isRtl}>{t.totalConcrete}</TH><TH isRtl={isRtl}>{t.depositPercent}</TH><TH isRtl={isRtl}>{t.deposit}</TH><TH isRtl={isRtl}>{t.received}</TH><TH isRtl={isRtl}>{t.note}</TH><TH isRtl={isRtl}>{t.mark}</TH><TH isRtl={isRtl}></TH>
            </tr></thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id} style={{ borderBottom: `1px solid ${s.border}`, background: item.marked?`${PRIMARY}06`:"transparent" }}>
                  <td style={{ padding: "7px 6px", direction: "ltr", whiteSpace: "nowrap" }}>{item.date}</td>
                  <td style={{ padding: "7px 6px", direction: "ltr" }}>{fmt(item.meters)}</td>
                  <td style={{ padding: "7px 6px", direction: "ltr" }}>{fmt(item.pricePerMeter)}</td>
                  <td style={{ padding: "7px 6px", direction: "ltr", fontWeight: 700, color: PRIMARY }}>{fmt(item.totalPrice)}</td>
                  <td style={{ padding: "7px 6px", direction: "ltr" }}>{item.depositPercent}%</td>
                  <td style={{ padding: "7px 6px", direction: "ltr", color: "#D97706" }}>{fmt(item.deposit)}</td>
                  <td style={{ padding: "7px 6px", direction: "ltr", color: s.success, fontWeight: 700 }}>{fmt(item.received)}</td>
                  <td style={{ padding: "7px 6px", color: s.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={item.note}>{trunc(item.note)}</td>
                  <td style={{ padding: "7px 6px", textAlign: "center" }}><button onClick={()=>toggleMark(item.id)} style={{ width: 20, height: 20, borderRadius: 3, border: `2px solid ${item.marked?PRIMARY:s.border}`, background: item.marked?PRIMARY:"transparent", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>{item.marked&&<I.Check />}</button></td>
                  <td style={{ padding: "7px 6px" }}>
                    <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                      {!item.depositClaimed && item.deposit > 0 && <button onClick={()=>claimDeposit(item.id)} style={{ padding: "2px 6px", borderRadius: 4, border: `1px solid #D97706`, background: "#FEF3C7", color: "#D97706", cursor: "pointer", fontSize: 9, fontWeight: 600 }}>{t.claimDeposit}</button>}
                      {item.depositClaimed && <span style={{ fontSize: 9, color: s.success }}>✓</span>}
                      <button onClick={()=>handleDelete(item.id)} style={{ background: "none", border: "none", color: s.danger, cursor: "pointer", padding: 2 }}><I.Trash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length===0 && <div style={{ padding: 30, textAlign: "center", color: s.textMuted, fontSize: 12 }}>{t.noData}</div>}
        </div>
      </div>
      {alert && <AlertModal message={alert} onOk={()=>setAlert(null)} s={s} />}
    </div>
  );
}

// ==================== CONTRACTOR (with persons) ====================
function ContractorPage({ t, s, isRtl, pKey, cashIQD, setCashIQD, cashUSD, setCashUSD, addCashLog }) {
  const KEY = `karo_contr_${pKey}`;
  const [items, setItems] = useState(getLS(KEY, []));
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ date: today(), type: "withdraw", personName: "", amountIQD: "", amountUSD: "", note: "" });
  const [alert, setAlert] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState("");
  const [newPerson, setNewPerson] = useState("");
  const [showMarkedOnly, setShowMarkedOnly] = useState(false);

  useEffect(() => { setLS(KEY, items); }, [items, KEY]);

  const persons = [...new Set(items.map(i => i.personName).filter(Boolean))];
  const filtered = items.filter(i => {
    if (selectedPerson && i.personName !== selectedPerson) return false;
    if (showMarkedOnly && !i.marked) return false;
    return true;
  });

  const resetForm = () => { setForm({ date: today(), type: "withdraw", personName: "", amountIQD: "", amountUSD: "", note: "" }); setEditId(null); setNewPerson(""); };

  const handleSave = () => {
    const iqd = Number(form.amountIQD||0), usd = Number(form.amountUSD||0);
    if (iqd===0 && usd===0) return;
    const pName = newPerson || form.personName;
    if (!pName) return;

    if (editId) {
      const old = items.find(i => i.id === editId);
      if (old) {
        if (old.type==="withdraw") { setCashIQD(p=>p+Number(old.amountIQD||0)); setCashUSD(p=>p+Number(old.amountUSD||0)); }
        else { setCashIQD(p=>p-Number(old.amountIQD||0)); setCashUSD(p=>p-Number(old.amountUSD||0)); }
      }
      if (form.type==="withdraw") {
        if (iqd>cashIQD||usd>cashUSD) { setAlert(t.noBalance); return; }
        setCashIQD(p=>p-iqd); setCashUSD(p=>p-usd); addCashLog(`${t.edit} ${t.withdraw}: ${pName}`, -iqd, -usd);
      } else { setCashIQD(p=>p+iqd); setCashUSD(p=>p+usd); addCashLog(`${t.edit} ${t.addMoney}: ${pName}`, iqd, usd); }
      setItems(prev => prev.map(i => i.id===editId ? {...i, ...form, personName: pName} : i));
    } else {
      if (form.type==="withdraw") {
        if (iqd>cashIQD||usd>cashUSD) { setAlert(t.noBalance); return; }
        setCashIQD(p=>p-iqd); setCashUSD(p=>p-usd); addCashLog(`${t.withdraw}: ${pName}`, -iqd, -usd);
      } else { setCashIQD(p=>p+iqd); setCashUSD(p=>p+usd); addCashLog(`${t.addMoney}: ${pName}`, iqd, usd); }
      setItems(prev => [{...form, personName: pName, id: genId(), marked: false}, ...prev]);
    }
    resetForm(); setShowForm(false);
  };

  const handleDelete = id => {
    const item = items.find(i=>i.id===id);
    if (item) {
      if (item.type==="withdraw") { setCashIQD(p=>p+Number(item.amountIQD||0)); setCashUSD(p=>p+Number(item.amountUSD||0)); addCashLog(`${t.delete} ${t.withdraw}`, Number(item.amountIQD||0), Number(item.amountUSD||0)); }
      else { setCashIQD(p=>p-Number(item.amountIQD||0)); setCashUSD(p=>p-Number(item.amountUSD||0)); addCashLog(`${t.delete} ${t.addMoney}`, -Number(item.amountIQD||0), -Number(item.amountUSD||0)); }
    }
    setItems(prev => prev.filter(i=>i.id!==id));
  };

  const handleEdit = item => { setForm(item); setEditId(item.id); setShowForm(true); };
  const toggleMark = id => setItems(prev => prev.map(i => i.id===id?{...i,marked:!i.marked}:i));

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 6 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: PRIMARY }}>{t.sidebar.contractor}</h1>
        <button onClick={()=>{setShowForm(!showForm);resetForm()}} style={{ padding: "6px 14px", borderRadius: 6, border: "none", background: PRIMARY, color: "#fff", cursor: "pointer", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}><I.Plus /> {t.add}</button>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
        <button onClick={()=>setSelectedPerson("")} style={{ padding: "5px 12px", borderRadius: 20, border: !selectedPerson?`2px solid ${PRIMARY}`:`1px solid ${s.border}`, background: !selectedPerson?`${PRIMARY}15`:"transparent", color: !selectedPerson?PRIMARY:s.text, cursor: "pointer", fontSize: 11, fontWeight: 600 }}>{t.allPersons}</button>
        {persons.map(p => <button key={p} onClick={()=>setSelectedPerson(p)} style={{ padding: "5px 12px", borderRadius: 20, border: selectedPerson===p?`2px solid ${PRIMARY}`:`1px solid ${s.border}`, background: selectedPerson===p?`${PRIMARY}15`:"transparent", color: selectedPerson===p?PRIMARY:s.text, cursor: "pointer", fontSize: 11, fontWeight: 600 }}>{p}</button>)}
        {showMarkedOnly
          ? <button onClick={()=>{setShowMarkedOnly(false);setItems(prev=>prev.map(i=>({...i,marked:false})))}} style={{ padding: "5px 12px", borderRadius: 20, border: "none", background: "#D1FAE5", color: "#059669", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>{t.showAll}</button>
          : <button onClick={()=>setShowMarkedOnly(true)} style={{ padding: "5px 12px", borderRadius: 20, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 11, cursor: "pointer" }}>{t.showMarked}</button>
        }
      </div>

      {showForm && (
        <div style={{ background: s.bgCard, border: `1px solid ${PRIMARY}40`, borderRadius: 10, padding: 14, marginBottom: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 8 }}>
            <div><label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600 }}>{t.date}</label><input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, direction: "ltr" }} /></div>
            <div><label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600 }}>{t.contractorType}</label><select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12 }}><option value="withdraw">{t.withdraw}</option><option value="add">{t.addMoney}</option></select></div>
            <div><label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600 }}>{t.personName}</label>
              {persons.length>0 && <select value={form.personName} onChange={e=>setForm({...form,personName:e.target.value})} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, marginBottom: 4 }}><option value="">—</option>{persons.map(p=><option key={p} value={p}>{p}</option>)}</select>}
              <input placeholder={t.addPerson} value={newPerson} onChange={e=>setNewPerson(e.target.value)} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12 }} />
            </div>
            <div><label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600 }}>{t.amountIQD}</label><input type="number" value={form.amountIQD} onChange={e=>setForm({...form,amountIQD:e.target.value})} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, direction: "ltr" }} /></div>
            <div><label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600 }}>{t.amountUSD}</label><input type="number" value={form.amountUSD} onChange={e=>setForm({...form,amountUSD:e.target.value})} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, direction: "ltr" }} /></div>
            <div><label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600 }}>{t.note}</label><input value={form.note} onChange={e=>setForm({...form,note:e.target.value})} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12 }} /></div>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
            <button onClick={handleSave} style={{ padding: "7px 18px", borderRadius: 6, border: "none", background: PRIMARY, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{editId?t.edit:t.save}</button>
            <button onClick={()=>{setShowForm(false);resetForm()}} style={{ padding: "7px 18px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, cursor: "pointer" }}>{t.cancel}</button>
          </div>
        </div>
      )}

      <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 10, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, tableLayout: "fixed" }}>
            <colgroup><col style={{width:"12%"}}/><col style={{width:"12%"}}/><col style={{width:"16%"}}/><col style={{width:"14%"}}/><col style={{width:"12%"}}/><col style={{width:"16%"}}/><col style={{width:"5%"}}/><col style={{width:"8%"}}/></colgroup>
            <thead><tr><TH isRtl={isRtl}>{t.date}</TH><TH isRtl={isRtl}>{t.contractorType}</TH><TH isRtl={isRtl}>{t.personName}</TH><TH isRtl={isRtl}>{t.amountIQD}</TH><TH isRtl={isRtl}>{t.amountUSD}</TH><TH isRtl={isRtl}>{t.note}</TH><TH isRtl={isRtl}>{t.mark}</TH><TH isRtl={isRtl}></TH></tr></thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id} style={{ borderBottom: `1px solid ${s.border}`, background: item.marked?`${PRIMARY}06`:"transparent" }}>
                  <td style={{ padding: "7px 6px", direction: "ltr", whiteSpace: "nowrap" }}>{item.date}</td>
                  <td style={{ padding: "7px 6px" }}><span style={{ padding: "2px 8px", borderRadius: 10, fontSize: 10, fontWeight: 600, background: item.type==="add"?"#D1FAE5":"#FEE2E2", color: item.type==="add"?"#059669":"#EF4444" }}>{item.type==="add"?t.addMoney:t.withdraw}</span></td>
                  <td style={{ padding: "7px 6px", fontWeight: 600 }}>{item.personName}</td>
                  <td style={{ padding: "7px 6px", direction: "ltr", fontWeight: 600 }}>{Number(item.amountIQD)?fmt(item.amountIQD):"—"}</td>
                  <td style={{ padding: "7px 6px", direction: "ltr", fontWeight: 600 }}>{Number(item.amountUSD)?"$"+fmt(item.amountUSD):"—"}</td>
                  <td style={{ padding: "7px 6px", color: s.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={item.note}>{trunc(item.note)}</td>
                  <td style={{ padding: "7px 6px", textAlign: "center" }}><button onClick={()=>toggleMark(item.id)} style={{ width: 20, height: 20, borderRadius: 3, border: `2px solid ${item.marked?PRIMARY:s.border}`, background: item.marked?PRIMARY:"transparent", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>{item.marked&&<I.Check />}</button></td>
                  <td style={{ padding: "7px 6px" }}><div style={{ display: "flex", gap: 2 }}><button onClick={()=>handleEdit(item)} style={{ background: "none", border: "none", color: PRIMARY, cursor: "pointer", padding: 2 }}><I.Edit /></button><button onClick={()=>handleDelete(item.id)} style={{ background: "none", border: "none", color: s.danger, cursor: "pointer", padding: 2 }}><I.Trash /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length===0 && <div style={{ padding: 30, textAlign: "center", color: s.textMuted, fontSize: 12 }}>{t.noData}</div>}
        </div>
      </div>
      {alert && <AlertModal message={alert} onOk={()=>{setAlert(null);resetForm();setShowForm(false)}} s={s} />}
    </div>
  );
}

// ==================== CASH ====================
function CashPage({ t, s, isRtl, cashIQD, setCashIQD, cashUSD, setCashUSD, exchangeRate, cashLog }) {
  const [editIQD, setEditIQD] = useState(false); const [editUSD, setEditUSD] = useState(false);
  const [tmpIQD, setTmpIQD] = useState(cashIQD); const [tmpUSD, setTmpUSD] = useState(cashUSD);
  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16, color: PRIMARY }}>{t.sidebar.cash}</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 16 }}>
        <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 12, padding: 16, textAlign: "center", cursor: "pointer", borderTop: `3px solid ${s.success}` }} onClick={()=>{if(!editIQD){setEditIQD(true);setTmpIQD(cashIQD)}}}>
          <div style={{ fontSize: 10, color: s.textMuted, fontWeight: 600, marginBottom: 5 }}>{t.cashIQD}</div>
          {editIQD ? <div style={{ display: "flex", gap: 5, justifyContent: "center" }}><input type="number" value={tmpIQD} onChange={e=>setTmpIQD(Number(e.target.value))} style={{ width: 120, padding: "5px 8px", borderRadius: 5, border: `1px solid ${PRIMARY}`, background: s.bgCard2, color: s.text, fontSize: 15, textAlign: "center", direction: "ltr" }} autoFocus /><button onClick={e=>{e.stopPropagation();setCashIQD(tmpIQD);setEditIQD(false)}} style={{ padding: "4px 10px", borderRadius: 5, background: PRIMARY, color: "#fff", border: "none", fontSize: 11, cursor: "pointer" }}>{t.save}</button></div>
          : <><div style={{ fontSize: 22, fontWeight: 800, color: cashIQD>=0?s.success:s.danger, direction: "ltr" }}>{fmt(cashIQD)}</div><div style={{ fontSize: 9, color: s.textMuted, marginTop: 2 }}>{t.clickToChange}</div></>}
        </div>
        <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 12, padding: 16, textAlign: "center", cursor: "pointer", borderTop: `3px solid ${s.success}` }} onClick={()=>{if(!editUSD){setEditUSD(true);setTmpUSD(cashUSD)}}}>
          <div style={{ fontSize: 10, color: s.textMuted, fontWeight: 600, marginBottom: 5 }}>{t.cashUSD}</div>
          {editUSD ? <div style={{ display: "flex", gap: 5, justifyContent: "center" }}><input type="number" value={tmpUSD} onChange={e=>setTmpUSD(Number(e.target.value))} style={{ width: 120, padding: "5px 8px", borderRadius: 5, border: `1px solid ${PRIMARY}`, background: s.bgCard2, color: s.text, fontSize: 15, textAlign: "center", direction: "ltr" }} autoFocus /><button onClick={e=>{e.stopPropagation();setCashUSD(tmpUSD);setEditUSD(false)}} style={{ padding: "4px 10px", borderRadius: 5, background: PRIMARY, color: "#fff", border: "none", fontSize: 11, cursor: "pointer" }}>{t.save}</button></div>
          : <><div style={{ fontSize: 22, fontWeight: 800, color: cashUSD>=0?s.success:s.danger, direction: "ltr" }}>${fmt(cashUSD)}</div><div style={{ fontSize: 9, color: s.textMuted, marginTop: 2 }}>{t.clickToChange}</div></>}
        </div>
        <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 12, padding: 16, textAlign: "center", borderTop: `3px solid ${PRIMARY}` }}>
          <div style={{ fontSize: 10, color: s.textMuted, fontWeight: 600, marginBottom: 5 }}>{t.totalInIQD}</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: PRIMARY, direction: "ltr" }}>{fmt(Math.round(cashIQD+cashUSD*exchangeRate))}</div>
          <div style={{ fontSize: 9, color: s.textMuted, marginTop: 2 }}>1$ = {fmt(exchangeRate)} {t.iqd}</div>
        </div>
      </div>
      <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 10, overflow: "hidden" }}>
        <h3 style={{ padding: "10px 12px 0", fontSize: 13, fontWeight: 700 }}>{t.cashLog}</h3>
        <div style={{ overflowX: "auto", maxHeight: 400, overflowY: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead><tr>{[t.date,"",t.type,t.iqd,t.usd].map((h,i)=><TH key={i} isRtl={isRtl}>{h}</TH>)}</tr></thead>
            <tbody>{[...cashLog].reverse().map(log=>(
              <tr key={log.id} style={{ borderBottom: `1px solid ${s.border}` }}>
                <td style={{ padding: "6px", direction: "ltr", fontSize: 10 }}>{log.date}</td>
                <td style={{ padding: "6px", fontSize: 9, color: s.textMuted }}>{log.time}</td>
                <td style={{ padding: "6px" }}>{log.desc}</td>
                <td style={{ padding: "6px", direction: "ltr", color: log.iqd>=0?s.success:s.danger, fontWeight: 600 }}>{log.iqd>=0?"+":""}{fmt(log.iqd)}</td>
                <td style={{ padding: "6px", direction: "ltr", color: log.usd>=0?s.success:s.danger, fontWeight: 600 }}>{log.usd>=0?"+":""}${fmt(log.usd)}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==================== EXCHANGE ====================
function ExchangePage({ t, s, isRtl, exchangeRate, setExchangeRate, cashIQD, setCashIQD, cashUSD, setCashUSD, addCashLog }) {
  const [tmpRate, setTmpRate] = useState(exchangeRate);
  const [dir, setDir] = useState("usd_to_iqd");
  const [amt, setAmt] = useState("");
  const [alert, setAlert] = useState(null);
  const result = dir==="usd_to_iqd" ? Number(amt||0)*exchangeRate : Number(amt||0)/exchangeRate;

  const handleConvert = () => {
    const a = Number(amt||0); if (a<=0) return;
    if (dir==="usd_to_iqd") {
      if (a>cashUSD) { setAlert(t.noBalance); return; }
      setCashUSD(p=>p-a); setCashIQD(p=>p+Math.round(a*exchangeRate)); addCashLog(`${t.convert}: $${a} → ${fmt(Math.round(a*exchangeRate))}`, Math.round(a*exchangeRate), -a);
    } else {
      if (a>cashIQD) { setAlert(t.noBalance); return; }
      setCashIQD(p=>p-a); setCashUSD(p=>p+Math.round(a/exchangeRate)); addCashLog(`${t.convert}: ${fmt(a)} → $${Math.round(a/exchangeRate)}`, -a, Math.round(a/exchangeRate));
    }
    setAmt("");
  };

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16, color: PRIMARY }}>{t.sidebar.exchange}</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
        <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 12, padding: 18 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>{t.exchangeRate}</h3>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}><label style={{ fontSize: 10, color: s.textMuted }}>1 USD =</label><input type="number" value={tmpRate} onChange={e=>setTmpRate(Number(e.target.value))} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 13, direction: "ltr" }} /></div>
            <button onClick={()=>setExchangeRate(tmpRate)} style={{ padding: "7px 14px", borderRadius: 6, background: PRIMARY, color: "#fff", border: "none", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>{t.saveRate}</button>
          </div>
          <div style={{ marginTop: 8, padding: "8px 12px", background: `${PRIMARY}10`, borderRadius: 6, textAlign: "center" }}><span style={{ fontSize: 16, fontWeight: 800, color: PRIMARY }}>1$ = {fmt(exchangeRate)} {t.iqd}</span></div>
        </div>
        <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 12, padding: 18 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>{t.convert}</h3>
          <div><label style={{ fontSize: 10, color: s.textMuted }}>{t.convertTo}</label><select value={dir} onChange={e=>setDir(e.target.value)} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, marginBottom: 8, direction: "ltr" }}><option value="usd_to_iqd">{t.fromUSD}</option><option value="iqd_to_usd">{t.fromIQD}</option></select></div>
          <div><label style={{ fontSize: 10, color: s.textMuted }}>{t.amount}</label><input type="number" value={amt} onChange={e=>setAmt(e.target.value)} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, marginBottom: 8, direction: "ltr" }} /></div>
          <div style={{ padding: "10px", background: "#D1FAE5", borderRadius: 6, textAlign: "center", marginBottom: 8 }}>
            <div style={{ fontSize: 10, color: s.textMuted }}>{t.result}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#059669", direction: "ltr" }}>{dir==="usd_to_iqd"?`${fmt(Math.round(result))} ${t.iqd}`:`$${fmt(Math.round(result*100)/100)}`}</div>
          </div>
          <button onClick={handleConvert} style={{ width: "100%", padding: "8px", borderRadius: 6, background: PRIMARY, color: "#fff", border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>{t.convert}</button>
        </div>
      </div>
      {alert && <AlertModal message={alert} onOk={()=>setAlert(null)} s={s} />}
    </div>
  );
}

// ==================== INVOICE ====================
function InvoicePage({ t, s, isRtl, pKey }) {
  const KEY = `karo_inv_${pKey}`;
  const [invoices, setInvoices] = useState(getLS(KEY, []));
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: today(), invoiceNo: "", currency: "iqd", billTo: "", billPhone: "", items: [{ name: "", qty: "", price: "", note: "" }] });
  const [preview, setPreview] = useState(null);
  useEffect(() => { setLS(KEY, invoices); }, [invoices, KEY]);

  const addItem = () => setForm({...form, items: [...form.items, { name: "", qty: "", price: "", note: "" }]});
  const removeItem = i => setForm({...form, items: form.items.filter((_,idx)=>idx!==i)});
  const updateItem = (i, f, v) => { const n=[...form.items]; n[i]={...n[i],[f]:v}; setForm({...form, items: n}); };
  const total = form.items.reduce((a,b)=>a+(Number(b.qty||0)*Number(b.price||0)),0);

  const handleSave = () => {
    setInvoices(prev => [{...form, id: genId(), total, marked: false}, ...prev]);
    setForm({ date: today(), invoiceNo: "", currency: "iqd", billTo: "", billPhone: "", items: [{ name: "", qty: "", price: "", note: "" }] });
    setShowForm(false);
  };

  const printInv = inv => {
    const cur = inv.currency==="usd"?"$":"";
    const curLabel = inv.currency==="usd"?t.usd:t.iqd;
    const w = window.open("","_blank");
    w.document.write(`<html dir="${isRtl?"rtl":"ltr"}"><head><title>Invoice</title><style>
      body{font-family:sans-serif;padding:30px;max-width:650px;margin:0 auto}
      .hdr{text-align:center;border-bottom:3px solid ${PRIMARY};padding-bottom:12px;margin-bottom:16px}
      .hdr h1{color:${PRIMARY};font-size:22px;margin:0}
      .hdr p{color:#666;font-size:11px;margin:2px 0}
      .info{display:flex;justify-content:space-between;margin-bottom:12px;font-size:12px}
      table{width:100%;border-collapse:collapse;margin-top:10px}
      th{background:${PRIMARY};color:#fff;padding:6px}td{border:1px solid #ddd;padding:6px;text-align:center;font-size:11px}
      .total{text-align:right;font-size:16px;font-weight:bold;margin-top:12px;color:${PRIMARY}}
    </style></head><body>
    <div class="hdr"><h1>KARO GROUP</h1><p>${PHONE} | ${EMAIL}</p></div>
    <div class="info"><div><strong>DATE:</strong> ${inv.date}</div><div><strong>INVOICE #:</strong> ${inv.invoiceNo}</div></div>
    ${inv.billTo?`<div class="info"><div><strong>BILL TO:</strong> ${inv.billTo}</div>${inv.billPhone?`<div><strong>Phone:</strong> ${inv.billPhone}</div>`:""}</div>`:""}
    <table><thead><tr><th>#</th><th>${t.itemName}</th><th>${t.qty}</th><th>${t.price}</th><th>${t.total}</th>${inv.items.some(i=>i.note)?`<th>${t.note}</th>`:""}</tr></thead><tbody>
    ${inv.items.map((it,i)=>`<tr><td>${i+1}</td><td>${it.name}</td><td>${it.qty}</td><td>${cur}${fmt(it.price)}</td><td>${cur}${fmt(Number(it.qty||0)*Number(it.price||0))}</td>${inv.items.some(x=>x.note)?`<td>${it.note||""}</td>`:""}</tr>`).join("")}
    </tbody></table><div class="total">${t.total}: ${cur}${fmt(inv.total)} ${curLabel}</div></body></html>`);
    w.document.close(); w.print();
  };

  const handleDelete = id => setInvoices(prev => prev.filter(i=>i.id!==id));

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 6 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: PRIMARY }}>{t.sidebar.invoice}</h1>
        <button onClick={()=>setShowForm(!showForm)} style={{ padding: "6px 14px", borderRadius: 6, border: "none", background: PRIMARY, color: "#fff", cursor: "pointer", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}><I.Plus /> {t.add}</button>
      </div>

      {showForm && (
        <div style={{ background: s.bgCard, border: `1px solid ${PRIMARY}40`, borderRadius: 10, padding: 14, marginBottom: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 8, marginBottom: 10 }}>
            <div><label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600 }}>DATE</label><input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, direction: "ltr" }} /></div>
            <div><label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600 }}>INVOICE #</label><input value={form.invoiceNo} onChange={e=>setForm({...form,invoiceNo:e.target.value})} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12 }} /></div>
            <div><label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600 }}>{t.currency}</label><select value={form.currency} onChange={e=>setForm({...form,currency:e.target.value})} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12 }}><option value="iqd">{t.iqd}</option><option value="usd">{t.usd}</option></select></div>
            <div><label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600 }}>BILL TO</label><input value={form.billTo} onChange={e=>setForm({...form,billTo:e.target.value})} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12 }} /></div>
            <div><label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600 }}>Phone</label><input value={form.billPhone} onChange={e=>setForm({...form,billPhone:e.target.value})} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, direction: "ltr" }} /></div>
          </div>
          {form.items.map((item,i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: 5, marginBottom: 5, alignItems: "flex-end" }}>
              <div>{i===0&&<label style={{ fontSize: 10, color: s.textMuted }}>{t.itemName}</label>}<input value={item.name} onChange={e=>updateItem(i,"name",e.target.value)} style={{ width: "100%", padding: "6px 8px", borderRadius: 5, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 11 }} /></div>
              <div>{i===0&&<label style={{ fontSize: 10, color: s.textMuted }}>{t.qty}</label>}<input type="number" value={item.qty} onChange={e=>updateItem(i,"qty",e.target.value)} style={{ width: "100%", padding: "6px 8px", borderRadius: 5, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 11, direction: "ltr" }} /></div>
              <div>{i===0&&<label style={{ fontSize: 10, color: s.textMuted }}>{t.price}</label>}<input type="number" value={item.price} onChange={e=>updateItem(i,"price",e.target.value)} style={{ width: "100%", padding: "6px 8px", borderRadius: 5, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 11, direction: "ltr" }} /></div>
              <div>{i===0&&<label style={{ fontSize: 10, color: s.textMuted }}>{t.note}</label>}<input value={item.note} onChange={e=>updateItem(i,"note",e.target.value)} style={{ width: "100%", padding: "6px 8px", borderRadius: 5, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 11 }} /></div>
              {form.items.length>1 && <button onClick={()=>removeItem(i)} style={{ background: "none", border: "none", color: s.danger, cursor: "pointer", padding: 4 }}><I.Trash /></button>}
            </div>
          ))}
          <button onClick={addItem} style={{ padding: "4px 10px", borderRadius: 5, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 10, cursor: "pointer", marginBottom: 8 }}><I.Plus /> {t.addItem}</button>
          <div style={{ padding: "8px 12px", background: `${PRIMARY}10`, borderRadius: 6, textAlign: "center", marginBottom: 8 }}>
            <span style={{ fontWeight: 800, color: PRIMARY, fontSize: 15 }}>{t.total}: {form.currency==="usd"?"$":""}{fmt(total)} {form.currency==="usd"?t.usd:t.iqd}</span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={handleSave} style={{ padding: "7px 18px", borderRadius: 6, border: "none", background: PRIMARY, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{t.save}</button>
            <button onClick={()=>setShowForm(false)} style={{ padding: "7px 18px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, cursor: "pointer" }}>{t.cancel}</button>
          </div>
        </div>
      )}

      <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 10, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead><tr>{["DATE","INVOICE #",t.billTo,t.total,""].map((h,i)=><TH key={i} isRtl={isRtl}>{h}</TH>)}</tr></thead>
            <tbody>{invoices.map(inv=>(
              <tr key={inv.id} style={{ borderBottom: `1px solid ${s.border}` }}>
                <td style={{ padding: "7px 6px", direction: "ltr", whiteSpace: "nowrap" }}>{inv.date}</td>
                <td style={{ padding: "7px 6px", fontWeight: 600 }}>{inv.invoiceNo}</td>
                <td style={{ padding: "7px 6px" }}>{inv.billTo||"—"}</td>
                <td style={{ padding: "7px 6px", direction: "ltr", fontWeight: 700, color: PRIMARY }}>{inv.currency==="usd"?"$":""}{fmt(inv.total)} {inv.currency==="usd"?t.usd:t.iqd}</td>
                <td style={{ padding: "7px 6px" }}>
                  <div style={{ display: "flex", gap: 3 }}>
                    <button onClick={()=>printInv(inv)} style={{ background: "none", border: "none", color: PRIMARY, cursor: "pointer", padding: 2 }}><I.Printer /></button>
                    <button onClick={()=>setPreview(inv)} style={{ background: "none", border: "none", color: PRIMARY, cursor: "pointer", padding: 2 }}><I.Eye /></button>
                    <button onClick={()=>handleDelete(inv.id)} style={{ background: "none", border: "none", color: s.danger, cursor: "pointer", padding: 2 }}><I.Trash /></button>
                  </div>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>

      {preview && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#fff", color: "#000", borderRadius: 10, padding: 30, maxWidth: 600, width: "100%", maxHeight: "90vh", overflow: "auto" }}>
            <div style={{ textAlign: "center", borderBottom: `3px solid ${PRIMARY}`, paddingBottom: 10, marginBottom: 12 }}><h2 style={{ color: PRIMARY, margin: 0, fontSize: 20 }}>KARO GROUP</h2><p style={{ color: "#666", fontSize: 10, margin: "2px 0" }}>{PHONE} | {EMAIL}</p></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 8 }}><div><strong>DATE:</strong> {preview.date}</div><div><strong>INVOICE #:</strong> {preview.invoiceNo}</div></div>
            {preview.billTo && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 10 }}><div><strong>BILL TO:</strong> {preview.billTo}</div>{preview.billPhone&&<div><strong>Phone:</strong> {preview.billPhone}</div>}</div>}
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, marginBottom: 10 }}>
              <thead><tr style={{ background: PRIMARY, color: "#fff" }}><th style={{padding:5}}>#</th><th style={{padding:5}}>{t.itemName}</th><th style={{padding:5}}>{t.qty}</th><th style={{padding:5}}>{t.price}</th><th style={{padding:5}}>{t.total}</th></tr></thead>
              <tbody>{preview.items.map((it,i)=><tr key={i} style={{ borderBottom: "1px solid #ddd", textAlign: "center" }}><td style={{padding:5}}>{i+1}</td><td style={{padding:5}}>{it.name}</td><td style={{padding:5}}>{it.qty}</td><td style={{padding:5}}>{preview.currency==="usd"?"$":""}{fmt(it.price)}</td><td style={{padding:5,fontWeight:600}}>{preview.currency==="usd"?"$":""}{fmt(Number(it.qty||0)*Number(it.price||0))}</td></tr>)}</tbody>
            </table>
            <div style={{ textAlign: "right", fontSize: 16, fontWeight: 800, color: PRIMARY }}>{t.total}: {preview.currency==="usd"?"$":""}{fmt(preview.total)} {preview.currency==="usd"?t.usd:t.iqd}</div>
            <div style={{ textAlign: "center", marginTop: 16 }}><button onClick={()=>setPreview(null)} style={{ padding: "6px 20px", borderRadius: 6, border: "1px solid #ddd", background: "#f5f5f5", color: "#333", cursor: "pointer", fontSize: 12 }}>{t.cancel}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== BACKUP ====================
function BackupPage({ t, s, pKey }) {
  const handleDownload = () => {
    const data = {};
    for (let i=0;i<localStorage.length;i++) { const k=localStorage.key(i); if(k?.startsWith("karo_")) data[k]=localStorage.getItem(k); }
    const b = new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
    const a=document.createElement("a"); a.href=URL.createObjectURL(b); a.download=`karo_backup_${today()}.json`; a.click();
  };
  const handleUpload = e => {
    const f=e.target.files[0]; if(!f)return;
    const r=new FileReader();
    r.onload=ev=>{ try { const d=JSON.parse(ev.target.result); Object.entries(d).forEach(([k,v])=>localStorage.setItem(k,v)); alert(t.backupSuccess); window.location.reload(); } catch{alert("Error")} };
    r.readAsText(f); e.target.value="";
  };
  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16, color: PRIMARY }}>{t.sidebar.backup}</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 14 }}>
        <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 12, padding: 24, textAlign: "center" }}>
          <I.Download /><h3 style={{ margin: "10px 0 6px", fontWeight: 700, fontSize: 14 }}>{t.downloadBackup}</h3>
          <button onClick={handleDownload} style={{ padding: "8px 20px", borderRadius: 6, background: PRIMARY, color: "#fff", border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", marginTop: 6 }}><I.Download /> {t.downloadBackup}</button>
        </div>
        <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 12, padding: 24, textAlign: "center" }}>
          <I.Upload /><h3 style={{ margin: "10px 0 6px", fontWeight: 700, fontSize: 14 }}>{t.uploadBackup}</h3>
          <label style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "8px 20px", borderRadius: 6, background: PRIMARY, color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, marginTop: 6 }}><I.Upload /> {t.uploadBackup}<input type="file" accept=".json" onChange={handleUpload} style={{ display: "none" }} /></label>
        </div>
      </div>
    </div>
  );
}

// ==================== HISTORY ====================
function HistoryPage({ t, s, isRtl, cashLog }) {
  const cutoff = new Date(); cutoff.setDate(cutoff.getDate()-30);
  const cs = cutoff.toISOString().split("T")[0];
  const recent = cashLog.filter(l=>l.date>=cs);
  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4, color: PRIMARY }}>{t.sidebar.history}</h1>
      <p style={{ color: s.textMuted, fontSize: 11, marginBottom: 12 }}>30 {t.date}</p>
      <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 10, overflow: "hidden" }}>
        <div style={{ overflowX: "auto", maxHeight: 450, overflowY: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead><tr>{[t.date,"",t.type,t.iqd,t.usd].map((h,i)=><TH key={i} isRtl={isRtl}>{h}</TH>)}</tr></thead>
            <tbody>{[...recent].reverse().map(log=>(
              <tr key={log.id} style={{ borderBottom: `1px solid ${s.border}` }}>
                <td style={{ padding: "6px", direction: "ltr", fontSize: 10 }}>{log.date}</td><td style={{ padding: "6px", fontSize: 9, color: s.textMuted }}>{log.time}</td><td style={{ padding: "6px" }}>{log.desc}</td>
                <td style={{ padding: "6px", direction: "ltr", color: log.iqd>=0?s.success:s.danger, fontWeight: 600 }}>{log.iqd>=0?"+":""}{fmt(log.iqd)}</td>
                <td style={{ padding: "6px", direction: "ltr", color: log.usd>=0?s.success:s.danger, fontWeight: 600 }}>{log.usd>=0?"+":""}${fmt(log.usd)}</td>
              </tr>
            ))}</tbody>
          </table>
          {recent.length===0&&<div style={{ padding: 30, textAlign: "center", color: s.textMuted, fontSize: 12 }}>{t.noData}</div>}
        </div>
      </div>
    </div>
  );
}

// ==================== MONTHLY REPORT ====================
function MonthlyPage({ t, s, isRtl, pKey, cashIQD, cashUSD, exchangeRate }) {
  const [dateFrom, setDateFrom] = useState(today().slice(0,8)+"01");
  const [dateTo, setDateTo] = useState(today());
  const [activeTab, setActiveTab] = useState("summary");
  const [sizeModal, setSizeModal] = useState(null);

  const exp = getLS(`karo_exp_${pKey}`,[]).filter(i=>i.date>=dateFrom&&i.date<=dateTo);
  const conc = getLS(`karo_conc_${pKey}`,[]).filter(i=>i.date>=dateFrom&&i.date<=dateTo);

  const tExpIQD = exp.reduce((a,b)=>a+Number(b.amountIQD||0),0);
  const tExpUSD = exp.reduce((a,b)=>a+Number(b.amountUSD||0),0);
  const tConcRec = conc.reduce((a,b)=>a+Number(b.received||0),0);
  const tConcDep = conc.reduce((a,b)=>a+Number(b.deposit||0),0);

  const incomeIQD = tConcRec;
  const expenseIQD = tExpIQD;
  const profitIQD = incomeIQD - expenseIQD;

  const tabs = [
    { id: "summary", label: t.reportsTitle },
    { id: "expenses", label: t.sidebar.expenses },
    { id: "concrete", label: t.sidebar.concrete },
  ];

  const doExport = (type, size) => {
    const hdrs = [t.type, t.iqd, t.usd];
    const rows = [[t.totalExpIQD, fmt(tExpIQD), "—"], [t.totalExpUSD, "—", "$"+fmt(tExpUSD)], [t.totalConcreteReceived, fmt(tConcRec), "—"], [t.totalDeposit, fmt(tConcDep), "—"], [t.profitLoss, fmt(profitIQD), "—"]];
    if (type==="pdf") doPrint({ title: `${t.sidebar.monthlyReport} ${dateFrom} - ${dateTo}`, headers: hdrs, rows, size, isRtl });
    else doExcel({ title: `monthly_${dateFrom}_${dateTo}`, headers: hdrs, rows });
    setSizeModal(null);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 6 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: PRIMARY }}>{t.sidebar.monthlyReport}</h1>
        <div style={{ display: "flex", gap: 5 }}>
          <button onClick={()=>setSizeModal({type:"pdf"})} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}><I.File /> {t.savePDF}</button>
          <button onClick={()=>setSizeModal({type:"excel"})} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}><I.Download /> {t.saveExcel}</button>
        </div>
      </div>

      {/* Date Range */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div><label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600 }}>{t.from}</label><input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} style={{ padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, direction: "ltr" }} /></div>
        <div><label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600 }}>{t.to}</label><input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} style={{ padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, direction: "ltr" }} /></div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={()=>setActiveTab(tab.id)} style={{ padding: "7px 16px", borderRadius: 6, border: activeTab===tab.id?"none":`1px solid ${s.border}`, background: activeTab===tab.id?PRIMARY:s.bgCard2, color: activeTab===tab.id?"#fff":s.text, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{tab.label}</button>
        ))}
      </div>

      {activeTab==="summary" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
            <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 12, padding: 14, textAlign: "center", borderTop: `3px solid ${s.danger}` }}><div style={{ fontSize: 10, color: s.textMuted, marginBottom: 5 }}>{t.totalExpIQD}</div><div style={{ fontSize: 20, fontWeight: 800, color: s.danger }}>{fmt(tExpIQD)}</div></div>
            <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 12, padding: 14, textAlign: "center", borderTop: `3px solid ${s.danger}` }}><div style={{ fontSize: 10, color: s.textMuted, marginBottom: 5 }}>{t.totalExpUSD}</div><div style={{ fontSize: 20, fontWeight: 800, color: s.danger }}>${fmt(tExpUSD)}</div></div>
            <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 12, padding: 14, textAlign: "center", borderTop: `3px solid ${s.success}` }}><div style={{ fontSize: 10, color: s.textMuted, marginBottom: 5 }}>{t.totalConcreteReceived}</div><div style={{ fontSize: 20, fontWeight: 800, color: s.success }}>{fmt(tConcRec)}</div></div>
            <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 12, padding: 14, textAlign: "center", borderTop: `3px solid #F59E0B` }}><div style={{ fontSize: 10, color: s.textMuted, marginBottom: 5 }}>{t.totalDeposit}</div><div style={{ fontSize: 20, fontWeight: 800, color: "#F59E0B" }}>{fmt(tConcDep)}</div></div>
            <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 12, padding: 14, textAlign: "center", borderTop: `3px solid ${profitIQD>=0?s.success:s.danger}` }}><div style={{ fontSize: 10, color: s.textMuted, marginBottom: 5 }}>{t.profitLoss} ({t.iqd})</div><div style={{ fontSize: 20, fontWeight: 800, color: profitIQD>=0?s.success:s.danger }}>{profitIQD>=0?t.profit:t.loss}: {fmt(Math.abs(profitIQD))}</div></div>
          </div>
        </div>
      )}

      {activeTab==="expenses" && (
        <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 10, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead><tr>{[t.amountIQD,t.amountUSD,t.receiptNo,t.note,t.date].map((h,i)=><TH key={i} isRtl={isRtl}>{h}</TH>)}</tr></thead>
              <tbody>{exp.map(item=>(
                <tr key={item.id} style={{ borderBottom: `1px solid ${s.border}` }}>
                  <td style={{ padding: "7px 6px", direction: "ltr", fontWeight: 600 }}>{Number(item.amountIQD)?fmt(item.amountIQD):"—"}</td>
                  <td style={{ padding: "7px 6px", direction: "ltr" }}>{Number(item.amountUSD)?"$"+fmt(item.amountUSD):"—"}</td>
                  <td style={{ padding: "7px 6px" }}>{item.receiptNo}</td>
                  <td style={{ padding: "7px 6px", color: s.textMuted }}>{item.note}</td>
                  <td style={{ padding: "7px 6px", direction: "ltr", whiteSpace: "nowrap" }}>{item.date}</td>
                </tr>
              ))}</tbody>
            </table>
            {exp.length===0&&<div style={{ padding: 30, textAlign: "center", color: s.textMuted, fontSize: 12 }}>{t.noData}</div>}
          </div>
        </div>
      )}

      {activeTab==="concrete" && (
        <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 10, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead><tr>{[t.date,t.meters,t.pricePerMeter,t.totalConcrete,t.deposit,t.received].map((h,i)=><TH key={i} isRtl={isRtl}>{h}</TH>)}</tr></thead>
              <tbody>{conc.map(item=>(
                <tr key={item.id} style={{ borderBottom: `1px solid ${s.border}` }}>
                  <td style={{ padding: "7px 6px", direction: "ltr" }}>{item.date}</td>
                  <td style={{ padding: "7px 6px", direction: "ltr" }}>{fmt(item.meters)}</td>
                  <td style={{ padding: "7px 6px", direction: "ltr" }}>{fmt(item.pricePerMeter)}</td>
                  <td style={{ padding: "7px 6px", direction: "ltr", fontWeight: 700, color: PRIMARY }}>{fmt(item.totalPrice)}</td>
                  <td style={{ padding: "7px 6px", direction: "ltr", color: "#D97706" }}>{fmt(item.deposit)}</td>
                  <td style={{ padding: "7px 6px", direction: "ltr", color: s.success, fontWeight: 700 }}>{fmt(item.received)}</td>
                </tr>
              ))}</tbody>
            </table>
            {conc.length===0&&<div style={{ padding: 30, textAlign: "center", color: s.textMuted, fontSize: 12 }}>{t.noData}</div>}
          </div>
        </div>
      )}

      {sizeModal && <SizeModal t={t} s={s} onSelect={sz=>doExport(sizeModal.type, sz)} onClose={()=>setSizeModal(null)} />}
    </div>
  );
}
