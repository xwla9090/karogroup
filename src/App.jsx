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
};
// ==================== LOGO ====================
function Logo({ size = 40 }) {
return (
);
}
return ;
}
// ==================== LANDING ====================
function LandingPage({ t, s, isRtl, dark, lang, fontFamily, setLang, setDark, onLogoClick }) {
const [mobileMenu, setMobileMenu] = useState(false);
const [lightbox, setLightbox] = useState(null);
const [scrolled, setScrolled] = useState(false);
useEffect(() => {
const h = () => setScrolled(window.scrollY > 40);
window.addEventListener("scroll", h);
return () => window.removeEventListener("scroll", h);
}, []);
const scrollTo = id => {
document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
setMobileMenu(false);
};
return (
: }
</button>
{lightbox && (


</button>
</div>
)}
);
}
// ==================== LOGIN ====================
function LoginPage({ t, s, isRtl, fontFamily, onLogin, onBack }) {
const [u, setU] = useState("");
const [p, setP] = useState("");
const [err, setErr] = useState(false);
return (
: } {dark ? t.light : t.dark}
</button>
{t.logout}
</button>
{formatModal && (
</div>


<div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
<button
onClick={doFormat}
style={{
background: s.danger, color: "#fff", border: "none",
borderRadius: 6, padding: "8px 20px", fontSize: 12,
fontWeight: 700, cursor: "pointer"
}}
>
{t.delete}
</button>
<button
onClick={() => setFormatModal(false)}
style={{
background: s.bgCard2, color: s.text, border: 1px solid ${s.border},
borderRadius: 6, padding: "8px 20px", fontSize: 12, cursor: "pointer"
}}
>
{t.cancel}
</button>
</div>
</div>
</div>
)}
);
}
// ==================== REPORTS ====================
function ReportsPage({ t, s, isRtl, pKey, cashIQD, cashUSD, exchangeRate }) {
const exp = getLS(karo_exp_${pKey}, []);
const loans = getLS(karo_loans_${pKey}, []);
const conc = getLS(karo_conc_${pKey}, []);
const tExpIQD = exp.reduce((a, b) => a + Number(b.amountIQD || 0), 0);
const tExpUSD = exp.reduce((a, b) => a + Number(b.amountUSD || 0), 0);
const tConcRec = conc.reduce((a, b) => a + Number(b.received || 0), 0);
const tConcDep = conc.reduce((a, b) => a + Number(b.deposit || 0), 0);
const tLoanTake = loans.filter(l => l.type === "take").reduce((a, b) => a + Number(b.amountIQD || 0), 0);
const tLoanGive = loans.filter(l => l.type === "give").reduce((a, b) => a + Number(b.amountIQD || 0), 0);
const cards = [
{ label: t.cashIQD, val: fmt(cashIQD) + " " + t.iqd, c: cashIQD >= 0 ? s.success : s.danger },
{ label: t.cashUSD, val: "$" + fmt(cashUSD), c: cashUSD >= 0 ? s.success : s.danger },
{ label: t.totalInIQD, val: fmt(Math.round(cashIQD + cashUSD * exchangeRate)) + " " + t.iqd, c: PRIMARY },
{ label: t.totalExpIQD, val: fmt(tExpIQD) + " " + t.iqd, c: s.danger },
{ label: t.totalExpUSD, val: "$" + fmt(tExpUSD), c: s.danger },
{ label: t.totalConcreteReceived, val: fmt(tConcRec), c: s.success },
{ label: t.totalDeposit, val: fmt(tConcDep), c: "#F59E0B" },
{ label: t.loanTake, val: fmt(tLoanTake), c: s.success },
{ label: t.loanGive, val: fmt(tLoanGive), c: s.danger },
];
const chartData = [
{ label: t.sidebar.expenses, val: tExpIQD, c: s.danger },
{ label: t.totalConcreteReceived, val: tConcRec, c: s.success },
{ label: t.totalDeposit, val: tConcDep, c: "#F59E0B" },
{ label: t.loanTake, val: tLoanTake, c: PRIMARY },
{ label: t.loanGive, val: tLoanGive, c: "#8B5CF6" },
];
const maxVal = Math.max(...chartData.map(d => d.val), 1);
return (
<span style={{ fontSize: 9, color: s.textMuted, textAlign: "center", lineHeight: 1.2 }}>{d.label}</span>
const amtIQD = iIQD >= 0 ? cols[iIQD] || "" : "";
const amtUSD = iUSD >= 0 ? cols[iUSD] || "" : "";
const receipt = iReceipt >= 0 ? cols[iReceipt] || "" : "";
const note = iNote >= 0 ? cols[iNote] || "" : "";
let dateVal = iDate >= 0 ? cols[iDate] || "" : "";

if (dateVal) {
  const parts = dateVal.split("/");
  if (parts.length === 3) {
    const d = parts[0].padStart(2, "0");
    const m = parts[1].padStart(2, "0");
    const y = parts[2].length === 2 ? "20" + parts[2] : parts[2];
    dateVal = `${y}-${m}-${d}`;
  }
}
if (!dateVal || !/^\d{4}-\d{2}-\d{2}$/.test(dateVal)) dateVal = today();

const iqd = Number(amtIQD.replace(/[^0-9.-]/g, "") || 0);
const usd = Number(amtUSD.replace(/[^0-9.-]/g, "") || 0);

const item = { 
  id: genId(), amountIQD: iqd || "", amountUSD: usd || "", 
  receiptNo: receipt, note: note, date: dateVal, receiptImg: "", marked: false 
};
newItems.push(item);
if (iqd > 0) setCashIQD(prev => prev - iqd);
if (usd > 0) setCashUSD(prev => prev - usd);
addCashLog(`${t.importExcel}: ${note || receipt}`, iqd > 0 ? -iqd : 0, usd > 0 ? -usd : 0);

}
setItems(prev => [...newItems, ...prev]);
};
reader.readAsText(file);
e.target.value = "";
};
const doExport = (type, size) => {
const hdrs = [t.amountIQD, t.amountUSD, t.receiptNo, t.note, t.date];
const rows = filtered.map(i => [fmt(i.amountIQD || 0), fmt(i.amountUSD || 0), i.receiptNo || "", i.note || "", i.date || ""]);
const tr = [fmt(totalIQD), fmt(totalUSD), "", t.total, ""];
if (type === "pdf") doPrint({ title: t.sidebar.expenses, headers: hdrs, rows, totalRow: tr, size, isRtl });
else doExcel({ title: "expenses", headers: hdrs, rows, totalRow: tr });
setSizeModal(null);
};
return (
{showForm && (

</div>
<div>

</div>
<div>

</div>
<div>

</div>
<div>

</div>
<div>
 {t.receiptImg}

</label>
{form.receiptImg && (

<button
onClick={() => setForm(p => ({ ...p, receiptImg: "" }))}
style={{ background: "none", border: "none", color: s.danger, cursor: "pointer", fontSize: 10 }}
>
{t.removeImg}
</button>
</div>
)}
</div>
</div>
<div style={{ display: "flex", gap: 6, marginTop: 10 }}>
<button
onClick={handleSave}
style={{
padding: "7px 18px", borderRadius: 6, border: "none",
background: PRIMARY, color: "#fff", fontSize: 12,
fontWeight: 600, cursor: "pointer"
}}
>
{editId ? t.edit : t.save}
</button>
<button
onClick={() => { setShowForm(false); resetForm(); }}
style={{
padding: "7px 18px", borderRadius: 6, border: 1px solid ${s.border},
background: s.bgCard2, color: s.text, fontSize: 12, cursor: "pointer"
}}
>
{t.cancel}
</button>
</div>
</div>
)}
{alert && }
{confirmDel && }
{sizeModal && }
{imgPreview && (

</div>
)}
);
}
// ==================== LOANS (چاککراو) ====================
function LoansPage({ t, s, isRtl, pKey, cashIQD, setCashIQD, cashUSD, setCashUSD, addCashLog }) {
const KEY = karo_loans_${pKey};
const PKEY = karo_loanPersons_${pKey};
const [items, setItems] = useState(getLS(KEY, []));
const [personsList, setPersonsList] = useState(getLS(PKEY, []));
const [showForm, setShowForm] = useState(false);
const [editId, setEditId] = useState(null);
const [form, setForm] = useState({ type: "take", personName: "", amountIQD: "", amountUSD: "", note: "", date: today() });
const [alert, setAlert] = useState(null);
const [selectedPerson, setSelectedPerson] = useState("");
const [newPerson, setNewPerson] = useState("");
const [sizeModal, setSizeModal] = useState(null);
const [showMarkedOnly, setShowMarkedOnly] = useState(false);
const [confirmDel, setConfirmDel] = useState(null);
useEffect(() => { setLS(KEY, items); }, [items, KEY]);
useEffect(() => { setLS(PKEY, personsList); }, [personsList, PKEY]);
useEffect(() => {
const fromItems = [...new Set(items.map(i => i.personName).filter(Boolean))];
const merged = [...new Set([...personsList, ...fromItems])];
if (merged.length !== personsList.length) setPersonsList(merged);
}, [items]);
const filtered = items.filter(i => {
if (selectedPerson && i.personName !== selectedPerson) return false;
if (showMarkedOnly && !i.marked) return false;
return true;
});
const resetForm = () => {
setForm({ type: "take", personName: "", amountIQD: "", amountUSD: "", note: "", date: today() });
setEditId(null);
setNewPerson("");
};
const handleAddPerson = () => {
if (newPerson.trim() && !personsList.includes(newPerson.trim())) {
setPersonsList(prev => [...prev, newPerson.trim()]);
setForm({ ...form, personName: newPerson.trim() });
setNewPerson("");
}
};
const handleSave = () => {
const iqd = Number(form.amountIQD || 0), usd = Number(form.amountUSD || 0);
if (iqd === 0 && usd === 0) return;
const pName = form.personName || newPerson.trim();
if (!pName) return;
if (!personsList.includes(pName)) setPersonsList(prev => [...prev, pName]);
if (editId) {
const old = items.find(i => i.id === editId);
if (old) {
if (old.type === "take") {
setCashIQD(p => p - Number(old.amountIQD || 0));
setCashUSD(p => p - Number(old.amountUSD || 0));
} else {
setCashIQD(p => p + Number(old.amountIQD || 0));
setCashUSD(p => p + Number(old.amountUSD || 0));
}
}
if (form.type === "take") {
setCashIQD(p => p + iqd);
setCashUSD(p => p + usd);
addCashLog(${t.edit} ${t.loanTake}: ${pName}, iqd, usd);
} else {
if (iqd > cashIQD || usd > cashUSD) { setAlert(t.noBalance); return; }
setCashIQD(p => p - iqd);
setCashUSD(p => p - usd);
addCashLog(${t.edit} ${t.loanGive}: ${pName}, -iqd, -usd);
}
setItems(prev => prev.map(i => i.id === editId ? { ...i, ...form, personName: pName } : i));
} else {
if (form.type === "give") {
if (iqd > cashIQD || usd > cashUSD) { setAlert(t.noBalance); return; }
setCashIQD(p => p - iqd);
setCashUSD(p => p - usd);
addCashLog(${t.loanGive}: ${pName}, -iqd, -usd);
} else {
setCashIQD(p => p + iqd);
setCashUSD(p => p + usd);
addCashLog(${t.loanTake}: ${pName}, iqd, usd);
}
setItems(prev => [{ ...form, personName: pName, id: genId(), marked: false }, ...prev]);
}
resetForm();
setShowForm(false);
};
const doDelete = id => {
const item = items.find(i => i.id === id);
if (item) {
if (item.type === "take") {
setCashIQD(p => p - Number(item.amountIQD || 0));
setCashUSD(p => p - Number(item.amountUSD || 0));
addCashLog(${t.delete} ${t.loanTake}, -Number(item.amountIQD || 0), -Number(item.amountUSD || 0));
} else {
setCashIQD(p => p + Number(item.amountIQD || 0));
setCashUSD(p => p + Number(item.amountUSD || 0));
addCashLog(${t.delete} ${t.loanGive}, Number(item.amountIQD || 0), Number(item.amountUSD || 0));
}
}
setItems(prev => prev.filter(i => i.id !== id));
setConfirmDel(null);
};
const handleEdit = item => { setForm(item); setEditId(item.id); setShowForm(true); };
const toggleMark = id => setItems(prev => prev.map(i => i.id === id ? { ...i, marked: !i.marked } : i));
const doExport = (type, size) => {
const hdrs = [t.loanType, t.personName, t.amountIQD, t.amountUSD, t.note, t.date];
const rows = filtered.map(i => [
i.type === "take" ? t.loanTake : t.loanGive,
i.personName,
fmt(i.amountIQD || 0),
fmt(i.amountUSD || 0),
i.note || "",
i.date || ""
]);
if (type === "pdf") doPrint({ title: t.sidebar.loans, headers: hdrs, rows, size, isRtl });
else doExcel({ title: "loans", headers: hdrs, rows });
setSizeModal(null);
};
const personBalance = selectedPerson ? (() => {
const pItems = items.filter(i => i.personName === selectedPerson);
const takeIQD = pItems.filter(i => i.type === "take").reduce((a, b) => a + Number(b.amountIQD || 0), 0);
const takeUSD = pItems.filter(i => i.type === "take").reduce((a, b) => a + Number(b.amountUSD || 0), 0);
const giveIQD = pItems.filter(i => i.type === "give").reduce((a, b) => a + Number(b.amountIQD || 0), 0);
const giveUSD = pItems.filter(i => i.type === "give").reduce((a, b) => a + Number(b.amountUSD || 0), 0);
return { takeIQD, takeUSD, giveIQD, giveUSD, balIQD: giveIQD - takeIQD, balUSD: giveUSD - takeUSD };
})() : null;
return (
{personBalance && (
<div style={{ display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
<div style={{ background: "#D1FAE5", borderRadius: 8, padding: "6px 14px", fontSize: 12 }}>
<span style={{ color: "#059669" }}>
{t.loanTake}: {fmt(personBalance.takeIQD)} {t.iqd} / ${fmt(personBalance.takeUSD)}
</span>
</div>
<div style={{ background: "#FEE2E2", borderRadius: 8, padding: "6px 14px", fontSize: 12 }}>
<span style={{ color: "#EF4444" }}>
{t.loanGive}: {fmt(personBalance.giveIQD)} {t.iqd} / ${fmt(personBalance.giveUSD)}
</span>
</div>
</div>
)}
{showForm && (

</div>
<div>

</div>
<div>

</div>
<div>

</div>
</div>
<div style={{ display: "flex", gap: 6, marginTop: 10 }}>
<button
onClick={handleSave}
style={{
padding: "7px 18px", borderRadius: 6, border: "none",
background: PRIMARY, color: "#fff", fontSize: 12,
fontWeight: 600, cursor: "pointer"
}}
>
{editId ? t.edit : t.save}
</button>
<button
onClick={() => { setShowForm(false); resetForm(); }}
style={{
padding: "7px 18px", borderRadius: 6, border: 1px solid ${s.border},
background: s.bgCard2, color: s.text, fontSize: 12, cursor: "pointer"
}}
>
{t.cancel}
</button>
</div>
</div>
)}
{alert && }
{confirmDel && }
{sizeModal && }
);
}
// ==================== CONCRETE (چاککراو) ====================
function ConcretePage({ t, s, isRtl, pKey, cashIQD, setCashIQD, cashUSD, setCashUSD, addCashLog }) {
const KEY = karo_conc_${pKey};
const [items, setItems] = useState(getLS(KEY, []));
const [showForm, setShowForm] = useState(false);
const [form, setForm] = useState({ date: today(), meters: "", pricePerMeter: "", depositPercent: "", note: "", currency: "iqd" });
const [alert, setAlert] = useState(null);
const [sizeModal, setSizeModal] = useState(null);
const [showMarkedOnly, setShowMarkedOnly] = useState(false);
const [confirmDel, setConfirmDel] = useState(null);
useEffect(() => { setLS(KEY, items); }, [items, KEY]);
const totalPrice = Number(form.meters || 0) * Number(form.pricePerMeter || 0);
const depositAmt = Math.round(totalPrice * Number(form.depositPercent || 0) / 100);
const receivedAmt = totalPrice - depositAmt;
const filtered = items.filter(i => showMarkedOnly ? i.marked : true);
const handleSave = () => {
if (totalPrice <= 0) return;
const cur = form.currency || "iqd";
const item = {
...form, id: genId(), totalPrice, deposit: depositAmt,
received: receivedAmt, depositClaimed: false, isReceived: false,
marked: false, currency: cur
};
setItems(prev => [item, ...prev]);
setForm({ date: today(), meters: "", pricePerMeter: "", depositPercent: "", note: "", currency: "iqd" });
setShowForm(false);
};
const markReceived = id => {
const item = items.find(i => i.id === id);
if (item && !item.isReceived) {
const cur = item.currency || "iqd";
if (cur === "usd") { setCashUSD(prev => prev + item.received); }
else { setCashIQD(prev => prev + item.received); }
addCashLog(${t.received} ${t.sidebar.concrete}, cur === "iqd" ? item.received : 0, cur === "usd" ? item.received : 0);
setItems(prev => prev.map(i => i.id === id ? { ...i, isReceived: true } : i));
}
};
const claimDeposit = id => {
const item = items.find(i => i.id === id);
if (item && !item.depositClaimed && item.deposit > 0) {
const cur = item.currency || "iqd";
if (cur === "usd") { setCashUSD(prev => prev + item.deposit); }
else { setCashIQD(prev => prev + item.deposit); }
addCashLog(${t.claimDeposit}: ${item.deposit}, cur === "iqd" ? item.deposit : 0, cur === "usd" ? item.deposit : 0);
setItems(prev => prev.map(i => i.id === id ? { ...i, depositClaimed: true } : i));
}
};
const doDelete = id => {
const item = items.find(i => i.id === id);
if (item) {
const cur = item.currency || "iqd";
if (item.isReceived) {
if (cur === "usd") setCashUSD(prev => prev - Number(item.received || 0));
else setCashIQD(prev => prev - Number(item.received || 0));
}
if (item.depositClaimed) {
if (cur === "usd") setCashUSD(prev => prev - Number(item.deposit || 0));
else setCashIQD(prev => prev - Number(item.deposit || 0));
}
addCashLog(
${t.delete} ${t.sidebar.concrete},
cur === "iqd" ? -(Number(item.isReceived ? item.received : 0) + Number(item.depositClaimed ? item.deposit : 0)) : 0,
cur === "usd" ? -(Number(item.isReceived ? item.received : 0) + Number(item.depositClaimed ? item.deposit : 0)) : 0
);
}
setItems(prev => prev.filter(i => i.id !== id));
setConfirmDel(null);
};
const toggleMark = id => setItems(prev => prev.map(i => i.id === id ? { ...i, marked: !i.marked } : i));
return (
);
}
// ==================== CONTRACTOR (چاککراو) ====================
function ContractorPage({ t, s, isRtl, pKey, cashIQD, setCashIQD, cashUSD, setCashUSD, addCashLog }) {
const KEY = karo_contr_${pKey};
const PKEY = karo_contrPersons_${pKey};
const [items, setItems] = useState(getLS(KEY, []));
const [personsList, setPersonsList] = useState(getLS(PKEY, []));
const [showForm, setShowForm] = useState(false);
const [editId, setEditId] = useState(null);
const [form, setForm] = useState({ date: today(), type: "withdraw", personName: "", amountIQD: "", amountUSD: "", note: "" });
const [alert, setAlert] = useState(null);
const [selectedPerson, setSelectedPerson] = useState("");
const [newPerson, setNewPerson] = useState("");
const [showMarkedOnly, setShowMarkedOnly] = useState(false);
const [confirmDel, setConfirmDel] = useState(null);
useEffect(() => { setLS(KEY, items); }, [items, KEY]);
useEffect(() => { setLS(PKEY, personsList); }, [personsList, PKEY]);
useEffect(() => {
const fromItems = [...new Set(items.map(i => i.personName).filter(Boolean))];
const merged = [...new Set([...personsList, ...fromItems])];
if (merged.length !== personsList.length) setPersonsList(merged);
}, [items]);
const filtered = items.filter(i => {
if (selectedPerson && i.personName !== selectedPerson) return false;
if (showMarkedOnly && !i.marked) return false;
return true;
});
const resetForm = () => {
setForm({ date: today(), type: "withdraw", personName: "", amountIQD: "", amountUSD: "", note: "" });
setEditId(null);
setNewPerson("");
};
const handleAddPerson = () => {
if (newPerson.trim() && !personsList.includes(newPerson.trim())) {
setPersonsList(prev => [...prev, newPerson.trim()]);
setForm({ ...form, personName: newPerson.trim() });
setNewPerson("");
}
};
const handleSave = () => {
const iqd = Number(form.amountIQD || 0), usd = Number(form.amountUSD || 0);
if (iqd === 0 && usd === 0) return;
const pName = form.personName || newPerson.trim();
if (!pName) return;
if (!personsList.includes(pName)) setPersonsList(prev => [...prev, pName]);
if (editId) {
const old = items.find(i => i.id === editId);
if (old) {
if (old.type === "withdraw") {
setCashIQD(p => p + Number(old.amountIQD || 0));
setCashUSD(p => p + Number(old.amountUSD || 0));
} else {
setCashIQD(p => p - Number(old.amountIQD || 0));
setCashUSD(p => p - Number(old.amountUSD || 0));
}
}
if (form.type === "withdraw") {
if (iqd > cashIQD || usd > cashUSD) { setAlert(t.noBalance); return; }
setCashIQD(p => p - iqd);
setCashUSD(p => p - usd);
addCashLog(${t.edit} ${t.withdraw}: ${pName}, -iqd, -usd);
} else {
setCashIQD(p => p + iqd);
setCashUSD(p => p + usd);
addCashLog(${t.edit} ${t.addMoney}: ${pName}, iqd, usd);
}
setItems(prev => prev.map(i => i.id === editId ? { ...i, ...form, personName: pName } : i));
} else {
if (form.type === "withdraw") {
if (iqd > cashIQD || usd > cashUSD) { setAlert(t.noBalance); return; }
setCashIQD(p => p - iqd);
setCashUSD(p => p - usd);
addCashLog(${t.withdraw}: ${pName}, -iqd, -usd);
} else {
setCashIQD(p => p + iqd);
setCashUSD(p => p + usd);
addCashLog(${t.addMoney}: ${pName}, iqd, usd);
}
setItems(prev => [{ ...form, personName: pName, id: genId(), marked: false }, ...prev]);
}
resetForm();
setShowForm(false);
};
const doDelete = id => {
const item = items.find(i => i.id === id);
if (item) {
if (item.type === "withdraw") {
setCashIQD(p => p + Number(item.amountIQD || 0));
setCashUSD(p => p + Number(item.amountUSD || 0));
addCashLog(${t.delete} ${t.withdraw}, Number(item.amountIQD || 0), Number(item.amountUSD || 0));
} else {
setCashIQD(p => p - Number(item.amountIQD || 0));
setCashUSD(p => p - Number(item.amountUSD || 0));
addCashLog(${t.delete} ${t.addMoney}, -Number(item.amountIQD || 0), -Number(item.amountUSD || 0));
}
}
setItems(prev => prev.filter(i => i.id !== id));
setConfirmDel(null);
};
const handleEdit = item => { setForm(item); setEditId(item.id); setShowForm(true); };
const toggleMark = id => setItems(prev => prev.map(i => i.id === id ? { ...i, marked: !i.marked } : i));
const personBalance = selectedPerson ? (() => {
const pItems = items.filter(i => i.personName === selectedPerson);
const wIQD = pItems.filter(i => i.type === "withdraw").reduce((a, b) => a + Number(b.amountIQD || 0), 0);
const wUSD = pItems.filter(i => i.type === "withdraw").reduce((a, b) => a + Number(b.amountUSD || 0), 0);
const aIQD = pItems.filter(i => i.type === "add").reduce((a, b) => a + Number(b.amountIQD || 0), 0);
const aUSD = pItems.filter(i => i.type === "add").reduce((a, b) => a + Number(b.amountUSD || 0), 0);
return { wIQD, wUSD, aIQD, aUSD, balIQD: aIQD - wIQD, balUSD: aUSD - wUSD };
})() : null;
return (
{personBalance && (
<div style={{ display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
<div style={{ background: "#FEE2E2", borderRadius: 8, padding: "6px 14px", fontSize: 12 }}>
<span style={{ color: "#EF4444" }}>
{t.withdraw}: {fmt(personBalance.wIQD)} {t.iqd} / ${fmt(personBalance.wUSD)}
</span>
</div>
<div style={{ background: "#D1FAE5", borderRadius: 8, padding: "6px 14px", fontSize: 12 }}>
<span style={{ color: "#059669" }}>
{t.addMoney}: {fmt(personBalance.aIQD)} {t.iqd} / ${fmt(personBalance.aUSD)}
</span>
</div>
</div>
)}
{showForm && (

</div>
<div>

</div>
<div>

</div>
<div>

</div>
</div>
<div style={{ display: "flex", gap: 6, marginTop: 10 }}>
<button
onClick={handleSave}
style={{
padding: "7px 18px", borderRadius: 6, border: "none",
background: PRIMARY, color: "#fff", fontSize: 12,
fontWeight: 600, cursor: "pointer"
}}
>
{editId ? t.edit : t.save}
</button>
<button
onClick={() => { setShowForm(false); resetForm(); }}
style={{
padding: "7px 18px", borderRadius: 6, border: 1px solid ${s.border},
background: s.bgCard2, color: s.text, fontSize: 12, cursor: "pointer"
}}
>
{t.cancel}
</button>
</div>
</div>
)}
);
}
// ==================== CASH (چاککراو) ====================
function CashPage({ t, s, isRtl, cashIQD, setCashIQD, cashUSD, setCashUSD, exchangeRate, cashLog }) {
const [editIQD, setEditIQD] = useState(false);
const [editUSD, setEditUSD] = useState(false);
const [tmpIQD, setTmpIQD] = useState(cashIQD);
const [tmpUSD, setTmpUSD] = useState(cashUSD);
return (
)}
)}
{preview && (
}
);
}
// ==================== BACKUP ====================
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
a.download = karo_backup_${today()}.json;
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
e.target.value = "";
};
return (
{t.downloadBackup}
</button>
{t.uploadBackup}
{activeTab === "summary" && (
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
<div style={{
background: s.bgCard, border: 1px solid ${s.border}, borderRadius: 12,
padding: 14, textAlign: "right", borderTop: 3px solid ${s.danger}
}}>
<div style={{ fontSize: 10, color: s.textMuted, marginBottom: 5 }}>{t.totalExpIQD}</div>
<div style={{ fontSize: 20, fontWeight: 800, color: s.danger }}>{fmt(tExpIQD)}</div>
</div>
<div style={{
background: s.bgCard, border: 1px solid ${s.border}, borderRadius: 12,
padding: 14, textAlign: "right", borderTop: 3px solid ${s.danger}
}}>
<div style={{ fontSize: 10, color: s.textMuted, marginBottom: 5 }}>{t.totalExpUSD}</div>
<div style={{ fontSize: 20, fontWeight: 800, color: s.danger }}>${fmt(tExpUSD)}</div>
</div>
<div style={{
background: s.bgCard, border: 1px solid ${s.border}, borderRadius: 12,
padding: 14, textAlign: "right", borderTop: 3px solid ${s.success}
}}>
<div style={{ fontSize: 10, color: s.textMuted, marginBottom: 5 }}>{t.totalConcreteReceived}</div>
<div style={{ fontSize: 20, fontWeight: 800, color: s.success }}>{fmt(tConcRec)}</div>
</div>
<div style={{
background: s.bgCard, border: 1px solid ${s.border}, borderRadius: 12,
padding: 14, textAlign: "right", borderTop: 3px solid #F59E0B
}}>
<div style={{ fontSize: 10, color: s.textMuted, marginBottom: 5 }}>{t.totalDeposit}</div>
<div style={{ fontSize: 20, fontWeight: 800, color: "#F59E0B" }}>{fmt(tConcDep)}</div>
</div>
<div style={{
background: s.bgCard, border: 1px solid ${s.border}, borderRadius: 12,
padding: 14, textAlign: "right", borderTop: 3px solid ${profitIQD >= 0 ? s.success : s.danger}
}}>
<div style={{ fontSize: 10, color: s.textMuted, marginBottom: 5 }}>{t.profitLoss} ({t.iqd})</div>
<div style={{ fontSize: 20, fontWeight: 800, color: profitIQD >= 0 ? s.success : s.danger }}>
{profitIQD >= 0 ? t.profit : t.loss}: {fmt(Math.abs(profitIQD))}
</div>
</div>
</div>
)}
{activeTab === "expenses" && (
<div style={{ background: s.bgCard, border: 1px solid ${s.border}, borderRadius: 10, overflow: "hidden" }}>
<div style={{ overflowX: "auto" }}>
<table style={tableStyle}>
<thead>
<tr>
{[t.amountIQD, t.amountUSD, t.receiptNo, t.note, t.date].map((h, i) => <TH key={i} isRtl={isRtl}>{h}</TH>)}
</tr>
</thead>
<tbody>
{exp.map(item => (
<tr key={item.id}>
<TD s={s} isRtl={isRtl} style={{ fontWeight: 600 }}>
{Number(item.amountIQD) ? (
<span style={{ direction: "ltr", display: "inline-block" }}>
{fmt(item.amountIQD)}
</span>
) : "—"}
</TD>
<TD s={s} isRtl={isRtl}>
{Number(item.amountUSD) ? (
<span style={{ direction: "ltr", display: "inline-block" }}>
${fmt(item.amountUSD)}
</span>
) : "—"}
</TD>
<TD s={s} isRtl={isRtl}>{item.receiptNo || "—"}</TD>
<TD s={s} isRtl={isRtl} style={{ color: s.textMuted }}>{item.note || "—"}</TD>
<TD s={s} isRtl={isRtl}>
<span style={{ direction: "ltr", display: "inline-block" }}>
{item.date}
</span>
</TD>
</tr>
))}
</tbody>
</table>
{exp.length === 0 && (
<div style={{ padding: 30, textAlign: "right", color: s.textMuted, fontSize: 12 }}>
{t.noData}
</div>
)}
</div>
</div>
)}
{activeTab === "concrete" && (
<div style={{ background: s.bgCard, border: 1px solid ${s.border}, borderRadius: 10, overflow: "hidden" }}>
<div style={{ overflowX: "auto" }}>
<table style={tableStyle}>
<thead>
<tr>
{[t.date, t.meters, t.pricePerMeter, t.totalConcrete, t.deposit, t.received].map((h, i) => <TH key={i} isRtl={isRtl}>{h}</TH>)}
</tr>
</thead>
<tbody>
{conc.map(item => (
<tr key={item.id}>
<TD s={s} isRtl={isRtl}>
<span style={{ direction: "ltr", display: "inline-block" }}>
{item.date}
</span>
</TD>
<TD s={s} isRtl={isRtl}>
<span style={{ direction: "ltr", display: "inline-block" }}>
{fmt(item.meters)}
</span>
</TD>
<TD s={s} isRtl={isRtl}>
<span style={{ direction: "ltr", display: "inline-block" }}>
{fmt(item.pricePerMeter)}
</span>
</TD>
<TD s={s} isRtl={isRtl} style={{ fontWeight: 700, color: PRIMARY }}>
<span style={{ direction: "ltr", display: "inline-block" }}>
{fmt(item.totalPrice)}
</span>
</TD>
<TD s={s} isRtl={isRtl} style={{ color: "#D97706" }}>
<span style={{ direction: "ltr", display: "inline-block" }}>
{fmt(item.deposit)}
</span>
</TD>
<TD s={s} isRtl={isRtl} style={{ color: s.success, fontWeight: 700 }}>
<span style={{ direction: "ltr", display: "inline-block" }}>
{fmt(item.received)}
</span>
</TD>
</tr>
))}
</tbody>
</table>
{conc.length === 0 && (
<div style={{ padding: 30, textAlign: "right", color: s.textMuted, fontSize: 12 }}>
{t.noData}
</div>
)}
</div>
</div>
)}
{sizeModal && }
);
}
