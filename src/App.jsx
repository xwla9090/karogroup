import { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDoc, onSnapshot, query, orderBy, deleteDoc, updateDoc, getDocs, writeBatch } from "firebase/firestore";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQeptSMxY3NLPPdoAGw-yvMuEnQz0GJEs",
  authDomain: "karogroup-1d9b1.firebaseapp.com",
  projectId: "karogroup-1d9b1",
  storageBucket: "karogroup-1d9b1.firebasestorage.app",
  messagingSenderId: "48641077887",
  appId: "1:48641077887:web:75ac716deae4350ecac54a",
  measurementId: "G-PR5MCDRJ50"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Firebase Context
const FirebaseContext = createContext(null);

function FirebaseProvider({ children, user }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    cashIQD: 0,
    cashUSD: 0,
    exchangeRate: 1500,
    expenses: [],
    loans: [],
    concrete: [],
    contractor: [],
    invoices: [],
    cashLog: [],
    loanPersons: [],
    contrPersons: []
  });

  useEffect(() => {
    if (!user?.project) {
      setLoading(false);
      return;
    }

    const projectRef = doc(db, "projects", user.project);
    
    const unsubscribe = onSnapshot(projectRef, (docSnap) => {
      if (docSnap.exists()) {
        setData(prev => ({ ...prev, ...docSnap.data() }));
      } else {
        // Initialize empty project
        setDoc(projectRef, {
          cashIQD: 0,
          cashUSD: 0,
          exchangeRate: 1500,
          expenses: [],
          loans: [],
          concrete: [],
          contractor: [],
          invoices: [],
          cashLog: [],
          loanPersons: [],
          contrPersons: [],
          createdAt: new Date().toISOString()
        });
      }
      setLoading(false);
    }, (error) => {
      console.error("Firebase error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.project]);

  const updateData = useCallback(async (updates) => {
    if (!user?.project) return;
    const projectRef = doc(db, "projects", user.project);
    await updateDoc(projectRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  }, [user?.project]);

  const setDataField = useCallback(async (field, value) => {
    if (!user?.project) return;
    const projectRef = doc(db, "projects", user.project);
    await updateDoc(projectRef, {
      [field]: value,
      updatedAt: new Date().toISOString()
    });
  }, [user?.project]);

  return (
    <FirebaseContext.Provider value={{ data, updateData, setDataField, loading, db }}>
      {children}
    </FirebaseContext.Provider>
  );
}

function useFirebase() {
  const context = useContext(FirebaseContext);
  if (!context) throw new Error("useFirebase must be used within FirebaseProvider");
  return context;
}

// Constants
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

// Translations
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

// Utils
const fmt = (n) => {
  const v = Number(n || 0);
  return v.toLocaleString('en-US');
};

const today = () => new Date().toISOString().split("T")[0];

const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

const trunc = (s, m = 25) => (!s ? "" : s.length > m ? s.slice(0, m) + "…" : s);

// LocalStorage fallback (for offline)
const getLS = (k, d) => {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : d;
  } catch {
    return d;
  }
};

const setLS = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
};

// Icons
const I = {
  Sun: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
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

// Styles
const getS = (dark) => ({
  bg: dark ? "#0f0f0f" : "#ffffff",
  bgCard: dark ? "#1a1a1a" : "#ffffff",
  bgCard2: dark ? "#222" : "#f8f8f8",
  text: dark ? "#e5e5e5" : "#1c1917",
  textMuted: dark ? "#999" : "#78716c",
  border: dark ? "#333" : "#e5e5e5",
  danger: "#EF4444",
  success: "#22C55E"
});

// Fixed Table Styles - CENTERED TEXT
const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 12,
  tableLayout: "fixed"
};

const thStyle = {
  padding: "10px 8px",
  borderBottom: `2px solid ${PRIMARY}`,
  textAlign: "center",
  fontWeight: 700,
  fontSize: 11,
  color: PRIMARY,
  backgroundColor: "transparent",
  verticalAlign: "middle"
};

const tdStyle = {
  padding: "10px 8px",
  borderBottom: "1px solid #e5e5e5",
  textAlign: "center",
  verticalAlign: "middle",
  whiteSpace: "normal",
  wordWrap: "break-word"
};

// Table Components
const TH = ({ children, isRtl, style = {} }) => (
  <th style={{ ...thStyle, direction: isRtl ? "rtl" : "ltr", ...style }}>
    {children}
  </th>
);

const TD = ({ children, s, isRtl, style = {} }) => (
  <td style={{ 
    ...tdStyle, 
    borderBottomColor: s.border,
    color: s.text,
    direction: isRtl ? "rtl" : "ltr",
    ...style 
  }}>
    {children}
  </td>
);

// Export all
export {
  FirebaseProvider,
  useFirebase,
  db,
  PRIMARY,
  PRIMARY_DARK,
  PHONE,
  EMAIL,
  PROJECT_IMAGES,
  USERS,
  FONTS,
  T,
  fmt,
  today,
  genId,
  trunc,
  getLS,
  setLS,
  I,
  getS,
  tableStyle,
  TH,
  TD
};

import { useState, useEffect, useRef } from "react";
import {
  FirebaseProvider,
  useFirebase,
  PRIMARY,
  PHONE,
  EMAIL,
  PROJECT_IMAGES,
  USERS,
  FONTS,
  T,
  fmt,
  today,
  genId,
  trunc,
  I,
  getS,
  TH,
  TD
} from "./Part1";

// ==================== LOGO ====================
function Logo({ size = 40 }) {
  return (
    <div style={{ 
      width: size, 
      height: size, 
      borderRadius: "50%", 
      background: PRIMARY, 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      position: "relative", 
      zIndex: 1, 
      boxShadow: `0 4px 16px ${PRIMARY}40` 
    }}>
      <span style={{ 
        color: "#fff", 
        fontWeight: 900, 
        fontSize: size * 0.38, 
        letterSpacing: -1 
      }}>
        KG
      </span>
      <span style={{ 
        position: "absolute", 
        bottom: -2, 
        right: -2, 
        background: "#fff", 
        color: "#4DAF94", 
        fontSize: 8, 
        fontWeight: 800, 
        borderRadius: 4, 
        padding: "0 3px", 
        lineHeight: "12px" 
      }}>
        v3
      </span>
    </div>
  );
}

// ==================== MODALS ====================
function AlertModal({ message, onOk, s }) {
  return (
    <div style={{ 
      position: "fixed", 
      inset: 0, 
      zIndex: 99999, 
      background: "rgba(0,0,0,0.5)", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center" 
    }}>
      <div style={{ 
        background: s.bgCard, 
        borderRadius: 14, 
        padding: 28, 
        maxWidth: 340, 
        width: "100%", 
        textAlign: "center" 
      }}>
        <div style={{ marginBottom: 14 }}>
          <I.Warn />
        </div>
        <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 24, color: s.text }}>
          {message}
        </p>
        <button 
          onClick={onOk} 
          style={{ 
            background: PRIMARY, 
            color: "#fff", 
            border: "none", 
            borderRadius: 8, 
            padding: "10px 40px", 
            fontSize: 15, 
            fontWeight: 700, 
            cursor: "pointer" 
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
}

function ConfirmModal({ message, onYes, onNo, s, t }) {
  return (
    <div style={{ 
      position: "fixed", 
      inset: 0, 
      zIndex: 99999, 
      background: "rgba(0,0,0,0.5)", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center" 
    }}>
      <div style={{ 
        background: s.bgCard, 
        borderRadius: 14, 
        padding: 28, 
        maxWidth: 340, 
        width: "100%", 
        textAlign: "center" 
      }}>
        <div style={{ marginBottom: 14 }}>
          <I.Warn />
        </div>
        <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 24, color: s.text }}>
          {message}
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button 
            onClick={onYes} 
            style={{ 
              background: "#EF4444", 
              color: "#fff", 
              border: "none", 
              borderRadius: 8, 
              padding: "10px 28px", 
              fontSize: 14, 
              fontWeight: 700, 
              cursor: "pointer" 
            }}
          >
            {t.yes}
          </button>
          <button 
            onClick={onNo} 
            style={{ 
              background: s.bgCard2, 
              color: s.text, 
              border: `1px solid ${s.border}`, 
              borderRadius: 8, 
              padding: "10px 28px", 
              fontSize: 14, 
              cursor: "pointer" 
            }}
          >
            {t.no}
          </button>
        </div>
      </div>
    </div>
  );
}

function SizeModal({ onSelect, onClose, s, t }) {
  return (
    <div 
      style={{ 
        position: "fixed", 
        inset: 0, 
        zIndex: 99999, 
        background: "rgba(0,0,0,0.5)", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center" 
      }} 
      onClick={onClose}
    >
      <div 
        onClick={e => e.stopPropagation()} 
        style={{ 
          background: s.bgCard, 
          borderRadius: 16, 
          padding: 28, 
          textAlign: "center" 
        }}
      >
        <h3 style={{ marginBottom: 18, fontSize: 15, fontWeight: 700, color: s.text }}>
          {t.selectSize}
        </h3>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          {["A3", "A4", "A5"].map(sz => (
            <button 
              key={sz} 
              onClick={() => onSelect(sz)} 
              style={{ 
                padding: "12px 28px", 
                borderRadius: 8, 
                border: `2px solid ${PRIMARY}`, 
                background: "transparent", 
                color: PRIMARY, 
                fontSize: 15, 
                fontWeight: 700, 
                cursor: "pointer", 
                transition: "all 0.2s" 
              }}
              onMouseEnter={e => { 
                e.target.style.background = PRIMARY; 
                e.target.style.color = "#fff"; 
              }}
              onMouseLeave={e => { 
                e.target.style.background = "transparent"; 
                e.target.style.color = PRIMARY; 
              }}
            >
              {sz}
            </button>
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
  w.document.write(`
    <html dir="${isRtl ? "rtl" : "ltr"}">
      <head>
        <title>${title}</title>
        <style>
          @page { size: ${sz[size] || sz.A4}; margin: 12mm }
          body { 
            font-family: sans-serif; 
            padding: 16px;
            direction: ${isRtl ? "rtl" : "ltr"};
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 12px;
          }
          th { 
            background: ${PRIMARY}; 
            color: #fff; 
            padding: 10px 8px; 
            font-size: 11px;
            text-align: center;
          }
          td { 
            border: 1px solid #ddd; 
            padding: 8px; 
            text-align: center; 
            font-size: 11px;
          }
          h2 { 
            color: ${PRIMARY}; 
            text-align: center; 
            font-size: 16px;
          }
          .t { 
            font-weight: bold; 
            background: #f0fdf4;
          }
        </style>
      </head>
      <body>
        <h2>KARO GROUP — ${title}</h2>
        <table>
          <thead>
            <tr>
              ${headers.map(h => `<th>${h}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}
            ${totalRow ? `<tr class="t">${totalRow.map(c => `<td>${c}</td>`).join("")}</tr>` : ""}
          </tbody>
        </table>
      </body>
    </html>
  `);
  w.document.close();
  w.print();
}

function doExcel({ title, headers, rows, totalRow }) {
  let csv = "\uFEFF" + headers.join(",") + "\n";
  rows.forEach(r => { 
    csv += r.map(c => `"${c}"`).join(",") + "\n"; 
  });
  if (totalRow) csv += totalRow.map(c => `"${c}"`).join(",") + "\n";
  const b = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(b);
  a.download = `${title}.csv`;
  a.click();
}

// ==================== LANDING PAGE ====================
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
    <div style={{ 
      minHeight: "100vh", 
      background: "#fff", 
      color: "#1c1917",
      fontFamily 
    }}>
      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: scrolled ? "rgba(255,255,255,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        borderBottom: scrolled ? "1px solid #e5e5e5" : "none",
        transition: "all 0.3s"
      }}>
        <div style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div onClick={onLogoClick} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
            <Logo size={36} />
            <span style={{ fontWeight: 800, fontSize: 16, color: PRIMARY }}>KARO GROUP</span>
          </div>

          <div className="dnav" style={{ display: "flex", alignItems: "center", gap: 24 }}>
            {[
              { id: "home", label: t.nav.home },
              { id: "services", label: t.nav.services },
              { id: "about", label: t.nav.about },
              { id: "contact", label: t.nav.contact }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#1c1917",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 500,
                  fontFamily
                }}
              >
                {item.label}
              </button>
            ))}
            <select
              value={lang}
              onChange={e => setLang(e.target.value)}
              style={{
                background: "#f5f5f5",
                border: "1px solid #e5e5e5",
                borderRadius: 6,
                padding: "6px 10px",
                fontSize: 12,
                fontFamily
              }}
            >
              <option value="ku">کوردی</option>
              <option value="en">English</option>
              <option value="ar">عربي</option>
            </select>
          </div>

          <button
            className="mbtn"
            onClick={() => setMobileMenu(!mobileMenu)}
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4
            }}
          >
            {mobileMenu ? <I.X /> : <I.Menu />}
          </button>
        </div>

        {mobileMenu && (
          <div style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "rgba(255,255,255,0.98)",
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            borderBottom: "1px solid #e5e5e5"
          }}>
            {["home", "services", "about", "contact"].map(x => (
              <button
                key={x}
                onClick={() => scrollTo(x)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#1c1917",
                  cursor: "pointer",
                  fontSize: 14,
                  textAlign: isRtl ? "right" : "left",
                  padding: "5px 0",
                  fontFamily
                }}
              >
                {t.nav[x]}
              </button>
            ))}
            <select
              value={lang}
              onChange={e => setLang(e.target.value)}
              style={{
                background: "#f5f5f5",
                border: "1px solid #e5e5e5",
                borderRadius: 6,
                padding: "6px 10px",
                fontSize: 13,
                fontFamily
              }}
            >
              <option value="ku">کوردی</option>
              <option value="en">English</option>
              <option value="ar">عربي</option>
            </select>
          </div>
        )}
      </nav>

      <section id="home" style={{ paddingTop: 80 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(2, 1fr)", 
            gap: 12 
          }} className="hgrid">
            {PROJECT_IMAGES.map((img, i) => (
              <div key={i} style={{ position: "relative" }}>
                <div
                  onClick={() => setLightbox(img.src)}
                  style={{ 
                    borderRadius: 10, 
                    overflow: "hidden", 
                    cursor: "pointer", 
                    aspectRatio: "16/9" 
                  }}
                >
                  <img
                    src={img.src}
                    alt=""
                    style={{ 
                      width: "100%", 
                      height: "100%", 
                      objectFit: "cover", 
                      transition: "transform 0.4s" 
                    }}
                    onMouseEnter={e => e.target.style.transform = "scale(1.04)"}
                    onMouseLeave={e => e.target.style.transform = "scale(1)"}
                    loading="lazy"
                  />
                </div>
                <p style={{ 
                  textAlign: "right", 
                  fontSize: 12, 
                  color: "#78716c", 
                  marginTop: 4, 
                  fontWeight: 600, 
                  fontFamily 
                }}>
                  {img[`desc_${lang}`]}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: "right", padding: "50px 20px 70px" }}>
          <div style={{ marginBottom: 20 }}>
            <Logo size={64} />
          </div>
          <h1 style={{ 
            fontSize: "clamp(28px,5vw,50px)", 
            fontWeight: 900, 
            color: PRIMARY, 
            marginBottom: 16, 
            fontFamily 
          }}>
            {t.hero.title}
          </h1>
          <p style={{ 
            fontSize: "clamp(14px,2vw,17px)", 
            color: "#78716c", 
            lineHeight: 1.7, 
            maxWidth: 560, 
            margin: "0 auto 30px", 
            fontFamily 
          }}>
            {t.hero.subtitle}
          </p>
          <button
            onClick={() => scrollTo("services")}
            style={{
              background: PRIMARY,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "12px 32px",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: `0 4px 20px ${PRIMARY}40`,
              fontFamily
            }}
          >
            {t.hero.cta}
          </button>
        </div>
      </section>

      <section id="services" style={{ padding: "70px 20px", maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ 
          textAlign: "right", 
          fontSize: 28, 
          fontWeight: 800, 
          marginBottom: 40, 
          color: PRIMARY, 
          fontFamily 
        }}>
          {t.services.title}
        </h2>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", 
          gap: 20 
        }}>
          {[t.services.s1, t.services.s2, t.services.s3].map((sv, i) => (
            <div
              key={i}
              style={{
                background: "#fff",
                border: "1px solid #e5e5e5",
                borderRadius: 12,
                padding: 28,
                borderTop: `3px solid ${PRIMARY}`,
                transition: "transform 0.3s"
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              <h3 style={{ 
                fontSize: 18, 
                fontWeight: 700, 
                marginBottom: 8, 
                color: PRIMARY, 
                fontFamily 
              }}>
                {sv.name}
              </h3>
              <p style={{ color: "#78716c", lineHeight: 1.7, fontSize: 13, fontFamily }}>
                {sv.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="about" style={{ padding: "70px 20px", background: "#f9fafb" }}>
        <div style={{ maxWidth: 750, margin: "0 auto" }}>
          <h2 style={{ 
            textAlign: "right", 
            fontSize: 28, 
            fontWeight: 800, 
            marginBottom: 36, 
            color: PRIMARY, 
            fontFamily 
          }}>
            {t.about.title}
          </h2>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", 
            gap: 14 
          }}>
            {t.about.items.map((item, i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  border: "1px solid #e5e5e5",
                  borderRadius: 8,
                  padding: "16px 14px",
                  display: "flex",
                  gap: 8,
                  alignItems: "flex-start"
                }}
              >
                <span style={{ color: PRIMARY, fontWeight: 800 }}>✦</span>
                <span style={{ fontSize: 13, lineHeight: 1.7, fontFamily }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" style={{ padding: "70px 20px" }}>
        <div style={{ maxWidth: 500, margin: "0 auto", textAlign: "right" }}>
          <h2 style={{ 
            fontSize: 28, 
            fontWeight: 800, 
            marginBottom: 36, 
            color: PRIMARY, 
            fontFamily 
          }}>
            {t.contact.title}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { icon: <I.Phone />, label: t.contact.phone, value: PHONE, href: `tel:${PHONE.replace(/\s/g, "")}` },
              { icon: "💬", label: t.contact.whatsapp, value: PHONE, href: `https://wa.me/${PHONE.replace(/[^0-9]/g, "")}` },
              { icon: "📱", label: t.contact.viber, value: PHONE, href: `viber://chat?number=${PHONE.replace(/[^0-9]/g, "")}` },
              { icon: <I.Mail />, label: t.contact.email, value: EMAIL, href: `mailto:${EMAIL}` },
            ].map((c, i) => (
              <a
                key={i}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  background: "#fff",
                  border: "1px solid #e5e5e5",
                  borderRadius: 8,
                  textDecoration: "none",
                  color: "#1c1917",
                  direction: "ltr",
                  transition: "border-color 0.3s",
                  fontFamily
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = PRIMARY}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#e5e5e5"}
              >
                <span style={{ color: PRIMARY, display: "flex" }}>{c.icon}</span>
                <span style={{ fontWeight: 600, minWidth: 65 }}>{c.label}:</span>
                <span style={{ color: "#78716c" }}>{c.value}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ padding: "24px 20px", textAlign: "right", borderTop: "1px solid #e5e5e5" }}>
        <div 
          onClick={onLogoClick} 
          style={{ 
            cursor: "pointer", 
            display: "inline-flex", 
            alignItems: "center", 
            gap: 6, 
            marginBottom: 4 
          }}
        >
          <Logo size={22} />
          <span style={{ fontWeight: 700, color: PRIMARY, fontSize: 13 }}>KARO GROUP</span>
        </div>
        <p style={{ color: "#78716c", fontSize: 11, fontFamily }}>
          © 2024 {t.footer.poweredBy}. {t.footer.rights}.
        </p>
      </footer>

      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            padding: 16
          }}
        >
          <img
            src={lightbox}
            alt=""
            style={{ maxWidth: "92%", maxHeight: "92vh", borderRadius: 6, objectFit: "contain" }}
          />
          <button
            onClick={() => setLightbox(null)}
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              background: "rgba(255,255,255,0.2)",
              border: "none",
              borderRadius: "50%",
              width: 36,
              height: 36,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff"
            }}
          >
            <I.X />
          </button>
        </div>
      )}

      <style>{`
        @media(max-width:768px){
          .dnav{display:none!important}
          .mbtn{display:flex!important}
          .hgrid{grid-template-columns:repeat(2,1fr)!important}
        }
        @media(min-width:769px){
          .mbtn{display:none!important}
        }
        *{margin:0;padding:0;box-sizing:border-box}
        body{margin:0}
        @keyframes ping{
          0%{transform:scale(1);opacity:.6}
          75%,100%{transform:scale(1.6);opacity:0}
        }
        input,select,textarea,button,th,td,label,span,p,div,h1,h2,h3{font-family:${fontFamily}!important}
      `}</style>
    </div>
  );
}

// ==================== LOGIN PAGE ====================
function LoginPage({ t, s, isRtl, fontFamily, onLogin, onBack }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState(false);

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      padding: 20, 
      background: s.bg 
    }}>
      <div style={{ 
        width: "100%", 
        maxWidth: 340, 
        background: s.bgCard, 
        borderRadius: 14, 
        padding: 28, 
        border: `1px solid ${s.border}` 
      }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <Logo size={56} />
          <h2 style={{ 
            marginTop: 12, 
            fontSize: 18, 
            fontWeight: 800, 
            color: PRIMARY 
          }}>
            {t.login}
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ 
              display: "block", 
              fontSize: 11, 
              color: s.textMuted, 
              marginBottom: 4, 
              fontWeight: 600 
            }}>
              {t.username}
            </label>
            <input
              value={u}
              onChange={e => setU(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: `1px solid ${s.border}`,
                background: s.bgCard2,
                color: s.text,
                fontSize: 14,
                outline: "none",
                direction: "ltr"
              }}
              placeholder="username"
            />
          </div>

          <div>
            <label style={{ 
              display: "block", 
              fontSize: 11, 
              color: s.textMuted, 
              marginBottom: 4, 
              fontWeight: 600 
            }}>
              {t.password}
            </label>
            <input
              type="password"
              value={p}
              onChange={e => setP(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: `1px solid ${s.border}`,
                background: s.bgCard2,
                color: s.text,
                fontSize: 14,
                outline: "none",
                direction: "ltr"
              }}
              placeholder="••••••"
            />
          </div>

          {err && (
            <p style={{ color: "#EF4444", fontSize: 11, textAlign: "center" }}>
              {t.wrongLogin}
            </p>
          )}

          <button
            onClick={() => { if (!onLogin(u, p)) setErr(true); }}
            style={{
              background: PRIMARY,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "12px",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              marginTop: 4
            }}
          >
            {t.enter}
          </button>

          <button
            onClick={onBack}
            style={{ 
              background: "none", 
              border: "none", 
              color: s.textMuted, 
              cursor: "pointer", 
              fontSize: 12,
              marginTop: 4
            }}
          >
            ← {t.nav.home}
          </button>
        </div>
      </div>

      <style>{`
        input,select,textarea,button,th,td,label,span,p,div,h1,h2,h3{
          font-family:${fontFamily}!important
        }
      `}</style>
    </div>
  );
}

// ==================== DASHBOARD LAYOUT ====================
function Dashboard({ 
  t, 
  s, 
  isRtl, 
  dark, 
  lang, 
  fontFamily, 
  user, 
  dashPage, 
  setDashPage, 
  onLogout, 
  setDark, 
  setLang, 
  fontIdx, 
  setFontIdx,
  children
}) {
  const [formatModal, setFormatModal] = useState(false);
  const [fmtUser, setFmtUser] = useState("");
  const [fmtPass, setFmtPass] = useState("");
  const { setDataField } = useFirebase();

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

  const doFormat = async () => {
    if (fmtUser === "admin" && fmtPass === "karo2024") {
      await setDataField("cashIQD", 0);
      await setDataField("cashUSD", 0);
      await setDataField("expenses", []);
      await setDataField("loans", []);
      await setDataField("concrete", []);
      await setDataField("contractor", []);
      await setDataField("invoices", []);
      await setDataField("cashLog", []);
      await setDataField("exchangeRate", 1500);
      setFormatModal(false);
      setFmtUser("");
      setFmtPass("");
      alert(t.formatSuccess);
    }
  };

  return (
    <div style={{ 
      display: "flex", 
      minHeight: "100vh", 
      background: s.bg, 
      color: s.text,
      fontFamily 
    }}>
      <aside style={{
        width: 240,
        minWidth: 240,
        background: s.bgCard,
        borderLeft: isRtl ? "none" : `1px solid ${s.border}`,
        borderRight: isRtl ? `1px solid ${s.border}` : "none",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        bottom: 0,
        [isRtl ? "right" : "left"]: 0,
        zIndex: 100
      }}>
        <div style={{ padding: 20, borderBottom: `1px solid ${s.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <Logo size={40} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 14, color: PRIMARY }}>KARO GROUP</div>
              <div style={{ fontSize: 11, color: s.textMuted }}>{user?.label}</div>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "12px 0" }}>
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => setDashPage(item.id)}
              style={{
                width: "100%",
                padding: "10px 20px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: dashPage === item.id ? `${PRIMARY}15` : "transparent",
                border: "none",
                borderRight: dashPage === item.id ? `3px solid ${PRIMARY}` : "none",
                color: dashPage === item.id ? PRIMARY : s.text,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: dashPage === item.id ? 600 : 500,
                textAlign: "right",
                transition: "all 0.2s"
              }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div style={{ padding: 16, borderTop: `1px solid ${s.border}` }}>
          <select
            value={fontIdx}
            onChange={e => setFontIdx(Number(e.target.value))}
            style={{
              width: "100%",
              padding: "6px 10px",
              borderRadius: 6,
              border: `1px solid ${s.border}`,
              background: s.bgCard2,
              color: s.text,
              fontSize: 11,
              marginBottom: 8
            }}
          >
            {FONTS.map((f, i) => (
              <option key={i} value={i}>{f.name}</option>
            ))}
          </select>

          <select
            value={lang}
            onChange={e => setLang(e.target.value)}
            style={{
              width: "100%",
              padding: "6px 10px",
              borderRadius: 6,
              border: `1px solid ${s.border}`,
              background: s.bgCard2,
              color: s.text,
              fontSize: 11,
              marginBottom: 8
            }}
          >
            <option value="ku">کوردی</option>
            <option value="en">English</option>
            <option value="ar">عربي</option>
          </select>

          <button
            onClick={() => setDark(!dark)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: 6,
              border: `1px solid ${s.border}`,
              background: s.bgCard2,
              color: s.text,
              cursor: "pointer",
              fontSize: 11,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              marginBottom: 8
            }}
          >
            {dark ? <I.Sun /> : <I.Moon />}
            {dark ? t.light : t.dark}
          </button>

          {user?.isAdmin && (
            <button
              onClick={() => setFormatModal(true)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: 6,
                border: `1px solid ${s.danger}`,
                background: "transparent",
                color: s.danger,
                cursor: "pointer",
                fontSize: 11,
                marginBottom: 8
              }}
            >
              {t.sidebar.formatData}
            </button>
          )}

          <button
            onClick={onLogout}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: 6,
              border: "none",
              background: s.danger,
              color: "#fff",
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6
            }}
          >
            <I.Logout />
            {t.logout}
          </button>
        </div>
      </aside>

      <main style={{
        flex: 1,
        [isRtl ? "marginRight" : "marginLeft"]: 240,
        padding: 16,
        minHeight: "100vh"
      }}>
        {children}
      </main>

      {formatModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 99999,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div style={{
            background: s.bgCard,
            borderRadius: 14,
            padding: 28,
            maxWidth: 340,
            width: "100%",
            textAlign: "right"
          }}>
            <div style={{ marginBottom: 14 }}>
              <I.Warn />
            </div>
            <p style={{ fontSize: 13, marginBottom: 16, color: s.text, lineHeight: 1.6 }}>
              {t.formatConfirm}
            </p>
            <input
              placeholder={t.username}
              value={fmtUser}
              onChange={e => setFmtUser(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: 6,
                border: `1px solid ${s.border}`,
                background: s.bgCard2,
                color: s.text,
                fontSize: 12,
                marginBottom: 8,
                direction: "ltr"
              }}
            />
            <input
              type="password"
              placeholder={t.password}
              value={fmtPass}
              onChange={e => setFmtPass(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: 6,
                border: `1px solid ${s.border}`,
                background: s.bgCard2,
                color: s.text,
                fontSize: 12,
                marginBottom: 14,
                direction: "ltr"
              }}
            />
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              <button
                onClick={doFormat}
                style={{
                  background: s.danger,
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "8px 20px",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                {t.delete}
              </button>
              <button
                onClick={() => setFormatModal(false)}
                style={{
                  background: s.bgCard2,
                  color: s.text,
                  border: `1px solid ${s.border}`,
                  borderRadius: 6,
                  padding: "8px 20px",
                  fontSize: 12,
                  cursor: "pointer"
                }}
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}
        body{margin:0}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:${PRIMARY}30;border-radius:2px}
        input,select,textarea,button,th,td,label,span,p,div,h1,h2,h3,a{font-family:${fontFamily}!important}
        @media print{aside,.noprint{display:none!important}main{margin:0!important;padding:8px!important;width:100%!important}}
        @keyframes ping{0%{transform:scale(1);opacity:.6}75%,100%{transform:scale(1.6);opacity:0}}
        @media(max-width:768px){
          aside{width:190px!important;min-width:190px!important}
          main{margin-left:190px!important;margin-right:190px!important}
        }
      `}</style>
    </div>
  );
}

// Export all
export {
  Logo,
  AlertModal,
  ConfirmModal,
  SizeModal,
  doPrint,
  doExcel,
  LandingPage,
  LoginPage,
  Dashboard
};

import { useState, useEffect, useCallback } from "react";
import {
  useFirebase,
  PRIMARY,
  T,
  fmt,
  today,
  genId,
  trunc,
  I,
  getS,
  TH,
  TD,
  AlertModal,
  ConfirmModal,
  SizeModal,
  doPrint,
  doExcel
} from "./Part2";

// ==================== REPORTS PAGE ====================
function ReportsPage({ t, s, isRtl }) {
  const { data } = useFirebase();
  const { cashIQD, cashUSD, exchangeRate, expenses, loans, concrete } = data;

  const tExpIQD = expenses.reduce((a, b) => a + Number(b.amountIQD || 0), 0);
  const tExpUSD = expenses.reduce((a, b) => a + Number(b.amountUSD || 0), 0);
  const tConcRec = concrete.reduce((a, b) => a + Number(b.received || 0), 0);
  const tConcDep = concrete.reduce((a, b) => a + Number(b.deposit || 0), 0);
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
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16, color: PRIMARY }}>
        {t.reportsTitle}
      </h1>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", 
        gap: 12, 
        marginBottom: 20 
      }}>
        {cards.map((card, i) => (
          <div
            key={i}
            style={{
              background: s.bgCard,
              border: `1px solid ${s.border}`,
              borderRadius: 10,
              padding: 14,
              borderTop: `3px solid ${card.c}`
            }}
          >
            <div style={{ fontSize: 10, color: s.textMuted, marginBottom: 4 }}>{card.label}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: card.c }}>{card.val}</div>
          </div>
        ))}
      </div>

      <div style={{ 
        background: s.bgCard, 
        border: `1px solid ${s.border}`, 
        borderRadius: 10, 
        padding: 16 
      }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>{t.profitLoss}</h3>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
          {chartData.map((d, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  width: "100%",
                  background: d.c,
                  borderRadius: "4px 4px 0 0",
                  height: `${(d.val / maxVal) * 80}px`,
                  minHeight: d.val > 0 ? 4 : 0,
                  transition: "height 0.3s"
                }}
              />
              <span style={{ fontSize: 9, color: s.textMuted, textAlign: "center", marginTop: 4 }}>
                {d.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==================== EXPENSES PAGE (چاککراو) ====================
function ExpensesPage({ t, s, isRtl }) {
  const { data, setDataField } = useFirebase();
  const { expenses, cashIQD, cashUSD } = data;
  
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ 
    amountIQD: "", 
    amountUSD: "", 
    receiptNo: "", 
    note: "", 
    date: today(), 
    receiptImg: "" 
  });
  const [search, setSearch] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [showMarkedOnly, setShowMarkedOnly] = useState(false);
  const [alert, setAlert] = useState(null);
  const [sizeModal, setSizeModal] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  const months = [...new Set(expenses.map(i => i.date?.slice(0, 7)))].sort().reverse();

  const filtered = expenses.filter(i => {
    if (search && !Object.values(i).some(v => 
      String(v || "").toLowerCase().includes(search.toLowerCase())
    )) return false;
    if (filterMonth && !i.date?.startsWith(filterMonth)) return false;
    if (showMarkedOnly && !i.marked) return false;
    return true;
  });

  const totalIQD = filtered.reduce((a, b) => a + Number(b.amountIQD || 0), 0);
  const totalUSD = filtered.reduce((a, b) => a + Number(b.amountUSD || 0), 0);

  const resetForm = () => {
    setForm({ 
      amountIQD: "", 
      amountUSD: "", 
      receiptNo: "", 
      note: "", 
      date: today(), 
      receiptImg: "" 
    });
    setEditId(null);
  };

  const addCashLog = useCallback(async (desc, iqd, usd) => {
    const newLog = {
      id: genId(),
      date: today(),
      time: new Date().toLocaleTimeString(),
      desc,
      iqd: Number(iqd || 0),
      usd: Number(usd || 0)
    };
    const currentLog = data.cashLog || [];
    await setDataField("cashLog", [...currentLog, newLog]);
  }, [data.cashLog, setDataField]);

  const handleSave = async () => {
    const iqd = Number(form.amountIQD || 0);
    const usd = Number(form.amountUSD || 0);
    
    if (iqd === 0 && usd === 0) return;

    if (editId) {
      const old = expenses.find(i => i.id === editId);
      if (old) {
        const diffIQD = Number(old.amountIQD || 0) - iqd;
        const diffUSD = Number(old.amountUSD || 0) - usd;
        
        if (diffIQD < 0 && Math.abs(diffIQD) > cashIQD) {
          setAlert(t.noBalance);
          return;
        }
        if (diffUSD < 0 && Math.abs(diffUSD) > cashUSD) {
          setAlert(t.noBalance);
          return;
        }
        
        await setDataField("cashIQD", cashIQD + diffIQD);
        await setDataField("cashUSD", cashUSD + diffUSD);
        await addCashLog(`${t.edit} ${t.sidebar.expenses}`, diffIQD, diffUSD);
      }
      
      const updated = expenses.map(i => 
        i.id === editId ? { ...i, ...form } : i
      );
      await setDataField("expenses", updated);
    } else {
      if (iqd > 0 && cashIQD < iqd) {
        setAlert(t.noBalance);
        return;
      }
      if (usd > 0 && cashUSD < usd) {
        setAlert(t.noBalance);
        return;
      }
      
      const newItem = { ...form, id: genId(), marked: false };
      await setDataField("expenses", [newItem, ...expenses]);
      
      if (iqd > 0) await setDataField("cashIQD", cashIQD - iqd);
      if (usd > 0) await setDataField("cashUSD", cashUSD - usd);
      await addCashLog(`${t.sidebar.expenses}: ${form.note || form.receiptNo}`, -iqd, -usd);
    }
    
    resetForm();
    setShowForm(false);
  };

  const doDelete = async (id) => {
    const item = expenses.find(i => i.id === id);
    if (item) {
      await setDataField("cashIQD", cashIQD + Number(item.amountIQD || 0));
      await setDataField("cashUSD", cashUSD + Number(item.amountUSD || 0));
      await addCashLog(
        `${t.delete} ${t.sidebar.expenses}`, 
        Number(item.amountIQD || 0), 
        Number(item.amountUSD || 0)
      );
      
      const updated = expenses.filter(i => i.id !== id);
      await setDataField("expenses", updated);
    }
    setConfirmDel(null);
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditId(item.id);
    setShowForm(true);
  };

  const toggleMark = async (id) => {
    const updated = expenses.map(i => 
      i.id === id ? { ...i, marked: !i.marked } : i
    );
    await setDataField("expenses", updated);
  };

  const handleImgUpload = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = ev => setForm(prev => ({ ...prev, receiptImg: ev.target.result }));
    r.readAsDataURL(f);
  };

  // چاککردنی Excel Import - ئێستا باشتر داتا دەخوێنێتەوە
  const handleImportExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const text = ev.target.result;
        const lines = text.split("\n").filter(l => l.trim());
        
        if (lines.length < 2) {
          alert("فایلەکە بەتاڵە");
          return;
        }

        // ناسینەوەی هەدرەکان
        const headerLine = lines[0].trim();
        const headers = headerLine.split(",").map(h => 
          h.replace(/"/g, "").trim().toLowerCase()
        );

        // دۆزینەوەی ئیندێکسی هەر ستونێک
        const findCol = (keywords) => {
          for (let i = 0; i < headers.length; i++) {
            for (const kw of keywords) {
              if (headers[i].includes(kw.toLowerCase())) return i;
            }
          }
          return -1;
        };

        // ناسینەوەی ستونەکان بەپێی ناوی کوردی و ئینگلیزی
        const colDate = findCol(["بەروار", "date", "تاریخ"]);
        const colIQD = findCol([
          "بڕ بە دینار", "amountIQD", "iqd", "دینار", "بری پارە دینار",
          "بڕی دینار", "مبلغ دینار", "amount iqd"
        ]);
        const colUSD = findCol([
          "بڕ بە دۆلار", "amountUSD", "usd", "دۆلار", "بری پارە دۆلار",
          "بڕی دۆلار", "مبلغ دولار", "amount usd", "دolar"
        ]);
        const colReceipt = findCol([
          "ژمارەی وەسڵ", "receiptNo", "وەسڵ", "receipt", "ژمارە",
          "رقم الوصل", "وصل"
        ]);
        const colNote = findCol([
          "تێبینی", "note", "ملاحظة", "تەبینی", "description", "desc"
        ]);

        console.log("Columns found:", { colDate, colIQD, colUSD, colReceipt, colNote });

        const newItems = [];
        
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          // چاککردنی جیاکردنەوەی کۆما لەناو دەقدا
          const cols = [];
          let current = "";
          let inQuotes = false;
          
          for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              cols.push(current.trim());
              current = "";
            } else {
              current += char;
            }
          }
          cols.push(current.trim());

          // ئەگەر کۆما نەبوو، ئەوە بەکارهێنە
          if (cols.length === 1) {
            const simpleCols = line.split(",").map(c => c.replace(/"/g, "").trim());
            cols.length = 0;
            cols.push(...simpleCols);
          }

          // خوێندنەوەی داتا
          let dateVal = colDate >= 0 ? (cols[colDate] || "").replace(/"/g, "").trim() : "";
          let amtIQD = colIQD >= 0 ? (cols[colIQD] || "").replace(/"/g, "").trim() : "";
          let amtUSD = colUSD >= 0 ? (cols[colUSD] || "").replace(/"/g, "").trim() : "";
          let receipt = colReceipt >= 0 ? (cols[colReceipt] || "").replace(/"/g, "").trim() : "";
          let note = colNote >= 0 ? (cols[colNote] || "").replace(/"/g, "").trim() : "";

          // چاککردنی بەروار
          if (dateVal) {
            // فۆرماتی DD/MM/YYYY
            const parts = dateVal.split(/[\/\-\.]/);
            if (parts.length === 3) {
              const d = parts[0].padStart(2, "0");
              const m = parts[1].padStart(2, "0");
              let y = parts[2];
              if (y.length === 2) y = "20" + y;
              dateVal = `${y}-${m}-${d}`;
            }
          }
          
          if (!dateVal || !/^\d{4}-\d{2}-\d{2}$/.test(dateVal)) {
            dateVal = today();
          }

          // چاککردنی ژمارەکان
          const iqd = Number(amtIQD.replace(/[^0-9.\-]/g, "")) || 0;
          const usd = Number(amtUSD.replace(/[^0-9.\-]/g, "")) || 0;

          if (iqd === 0 && usd === 0) continue;

          const item = {
            id: genId(),
            amountIQD: iqd || "",
            amountUSD: usd || "",
            receiptNo: receipt,
            note: note,
            date: dateVal,
            receiptImg: "",
            marked: false
          };

          newItems.push(item);

          // نوێکردنەوەی قاسە
          if (iqd > 0) {
            await setDataField("cashIQD", (data.cashIQD || 0) - iqd);
          }
          if (usd > 0) {
            await setDataField("cashUSD", (data.cashUSD || 0) - usd);
          }
          
          await addCashLog(
            `${t.importExcel}: ${note || receipt}`, 
            iqd > 0 ? -iqd : 0, 
            usd > 0 ? -usd : 0
          );
        }

        if (newItems.length > 0) {
          await setDataField("expenses", [...newItems, ...expenses]);
          alert(`${newItems.length} ${t.save}`);
        } else {
          alert("هیچ داتایەک نەدۆزرایەوە");
        }

      } catch (err) {
        console.error("Import error:", err);
        alert("هەڵە لە خوێندنەوەی فایلەکە");
      }
    };
    
    reader.readAsText(file);
    e.target.value = "";
  };

  const doExport = (type, size) => {
    const hdrs = [t.amountIQD, t.amountUSD, t.receiptNo, t.note, t.date];
    const rows = filtered.map(i => [
      fmt(i.amountIQD || 0),
      fmt(i.amountUSD || 0),
      i.receiptNo || "",
      i.note || "",
      i.date || ""
    ]);
    const tr = [fmt(totalIQD), fmt(totalUSD), "", t.total, ""];

    if (type === "pdf") {
      doPrint({ 
        title: t.sidebar.expenses, 
        headers: hdrs, 
        rows, 
        totalRow: tr, 
        size, 
        isRtl 
      });
    } else {
      doExcel({ title: "expenses", headers: hdrs, rows, totalRow: tr });
    }
    setSizeModal(null);
  };

  return (
    <div>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: 16,
        flexWrap: "wrap",
        gap: 10
      }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: PRIMARY }}>
          {t.sidebar.expenses}
        </h1>
        
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <label style={{
            padding: "8px 14px",
            borderRadius: 6,
            border: `1px solid ${s.border}`,
            background: s.bgCard,
            color: s.text,
            cursor: "pointer",
            fontSize: 12,
            display: "flex",
            alignItems: "center",
            gap: 6
          }}>
            <I.Upload />
            {t.importExcel}
            <input 
              type="file" 
              accept=".csv,.xlsx,.xls" 
              onChange={handleImportExcel} 
              style={{ display: "none" }} 
            />
          </label>
          
          <button
            onClick={() => setSizeModal({ type: "pdf" })}
            style={{
              padding: "8px 14px",
              borderRadius: 6,
              border: `1px solid ${s.border}`,
              background: s.bgCard,
              color: s.text,
              cursor: "pointer",
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              gap: 6
            }}
          >
            <I.File /> PDF
          </button>
          
          <button
            onClick={() => setSizeModal({ type: "excel" })}
            style={{
              padding: "8px 14px",
              borderRadius: 6,
              border: `1px solid ${s.border}`,
              background: s.bgCard,
              color: s.text,
              cursor: "pointer",
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              gap: 6
            }}
          >
            <I.Download /> Excel
          </button>
          
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: "none",
              background: PRIMARY,
              color: "#fff",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 6
            }}
          >
            <I.Plus /> {t.add}
          </button>
        </div>
      </div>

      <div style={{ 
        display: "flex", 
        gap: 10, 
        marginBottom: 10, 
        flexWrap: "wrap" 
      }}>
        <div style={{ 
          background: `${PRIMARY}10`, 
          borderRadius: 8, 
          padding: "6px 14px", 
          fontSize: 12 
        }}>
          <span style={{ color: s.textMuted }}>{t.total} {t.iqd}: </span>
          <strong style={{ color: PRIMARY }}>{fmt(totalIQD)}</strong>
        </div>
        <div style={{ 
          background: `${PRIMARY}10`, 
          borderRadius: 8, 
          padding: "6px 14px", 
          fontSize: 12 
        }}>
          <span style={{ color: s.textMuted }}>{t.total} {t.usd}: </span>
          <strong style={{ color: PRIMARY }}>${fmt(totalUSD)}</strong>
        </div>
      </div>

      <div style={{
        background: s.bgCard,
        border: `1px solid ${s.border}`,
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        display: "flex",
        gap: 8,
        flexWrap: "wrap",
        alignItems: "flex-end"
      }}>
        <div style={{ flex: 1, minWidth: 140 }}>
          <label style={{ 
            fontSize: 10, 
            color: s.textMuted, 
            fontWeight: 600,
            display: "block",
            marginBottom: 4
          }}>
            {t.search}
          </label>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "6px 10px",
              borderRadius: 6,
              border: `1px solid ${s.border}`,
              background: s.bgCard2,
              color: s.text,
              fontSize: 12,
              outline: "none"
            }}
          />
        </div>
        
        <div>
          <label style={{ 
            fontSize: 10, 
            color: s.textMuted, 
            fontWeight: 600,
            display: "block",
            marginBottom: 4
          }}>
            {t.filterMonth}
          </label>
          <select
            value={filterMonth}
            onChange={e => setFilterMonth(e.target.value)}
            style={{
              padding: "6px 10px",
              borderRadius: 6,
              border: `1px solid ${s.border}`,
              background: s.bgCard2,
              color: s.text,
              fontSize: 12
            }}
          >
            <option value="">{t.allMonths}</option>
            {months.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        {showMarkedOnly ? (
          <button
            onClick={() => {
              setShowMarkedOnly(false);
            }}
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              border: "none",
              background: "#D1FAE5",
              color: "#059669",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            {t.showAll}
          </button>
        ) : (
          <button
            onClick={() => setShowMarkedOnly(true)}
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              border: `1px solid ${s.border}`,
              background: s.bgCard2,
              color: s.text,
              fontSize: 11,
              cursor: "pointer"
            }}
          >
            {t.showMarked}
          </button>
        )}
      </div>

      {showForm && (
        <div style={{
          background: s.bgCard,
          border: `1px solid ${PRIMARY}40`,
          borderRadius: 10,
          padding: 14,
          marginBottom: 10
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 8
          }}>
            <div>
              <label style={{ 
                fontSize: 10, 
                color: s.textMuted, 
                fontWeight: 600,
                display: "block",
                marginBottom: 4
              }}>
                {t.amountIQD}
              </label>
              <input
                type="number"
                value={form.amountIQD}
                onChange={e => setForm({ ...form, amountIQD: e.target.value })}
                style={{
                  width: "100%",
                  padding: "6px 10px",
                  borderRadius: 6,
                  border: `1px solid ${s.border}`,
                  background: s.bgCard2,
                  color: s.text,
                  fontSize: 12
                }}
              />
            </div>
            
            <div>
              <label style={{ 
                fontSize: 10, 
                color: s.textMuted, 
                fontWeight: 600,
                display: "block",
                marginBottom: 4
              }}>
                {t.amountUSD}
              </label>
              <input
                type="number"
                value={form.amountUSD}
                onChange={e => setForm({ ...form, amountUSD: e.target.value })}
                style={{
                  width: "100%",
                  padding: "6px 10px",
                  borderRadius: 6,
                  border: `1px solid ${s.border}`,
                  background: s.bgCard2,
                  color: s.text,
                  fontSize: 12
                }}
              />
            </div>
            
            <div>
              <label style={{ 
                fontSize: 10, 
                color: s.textMuted, 
                fontWeight: 600,
                display: "block",
                marginBottom: 4
              }}>
                {t.receiptNo}
              </label>
              <input
                value={form.receiptNo}
                onChange={e => setForm({ ...form, receiptNo: e.target.value })}
                style={{
                  width: "100%",
                  padding: "6px 10px",
                  borderRadius: 6,
                  border: `1px solid ${s.border}`,
                  background: s.bgCard2,
                  color: s.text,
                  fontSize: 12
                }}
              />
            </div>
            
            <div>
              <label style={{ 
                fontSize: 10, 
                color: s.textMuted, 
                fontWeight: 600,
                display: "block",
                marginBottom: 4
              }}>
                {t.note}
              </label>
              <input
                value={form.note}
                onChange={e => setForm({ ...form, note: e.target.value })}
                style={{
                  width: "100%",
                  padding: "6px 10px",
                  borderRadius: 6,
                  border: `1px solid ${s.border}`,
                  background: s.bgCard2,
                  color: s.text,
                  fontSize: 12
                }}
              />
            </div>
            
            <div>
              <label style={{ 
                fontSize: 10, 
                color: s.textMuted, 
                fontWeight: 600,
                display: "block",
                marginBottom: 4
              }}>
                {t.date}
              </label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                style={{
                  width: "100%",
                  padding: "6px 10px",
                  borderRadius: 6,
                  border: `1px solid ${s.border}`,
                  background: s.bgCard2,
                  color: s.text,
                  fontSize: 12
                }}
              />
            </div>
            
            <div>
              <label style={{ 
                fontSize: 10, 
                color: s.textMuted, 
                fontWeight: 600,
                display: "block",
                marginBottom: 4
              }}>
                {t.receiptImg}
              </label>
              <label style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "6px 10px",
                borderRadius: 6,
                border: `1px dashed ${s.border}`,
                background: s.bgCard2,
                cursor: "pointer",
                fontSize: 11,
                color: s.textMuted
              }}>
                <I.Upload /> {form.receiptImg ? t.marked : t.receiptImg}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImgUpload} 
                  style={{ display: "none" }} 
                />
              </label>
              {form.receiptImg && (
                <div style={{ 
                  display: "flex", 
                  gap: 4, 
                  alignItems: "center", 
                  marginTop: 3 
                }}>
                  <img 
                    src={form.receiptImg} 
                    alt="" 
                    style={{ 
                      width: 32, 
                      height: 32, 
                      objectFit: "cover", 
                      borderRadius: 3 
                    }} 
                  />
                  <button
                    onClick={() => setForm(p => ({ ...p, receiptImg: "" }))}
                    style={{ 
                      background: "none", 
                      border: "none", 
                      color: s.danger, 
                      cursor: "pointer", 
                      fontSize: 10 
                    }}
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
                padding: "7px 18px",
                borderRadius: 6,
                border: "none",
                background: PRIMARY,
                color: "#fff",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              {editId ? t.edit : t.save}
            </button>
            <button
              onClick={() => { setShowForm(false); resetForm(); }}
              style={{
                padding: "7px 18px",
                borderRadius: 6,
                border: `1px solid ${s.border}`,
                background: s.bgCard2,
                color: s.text,
                fontSize: 12,
                cursor: "pointer"
              }}
            >
              {t.cancel}
            </button>
          </div>
        </div>
      )}

      <div style={{ 
        background: s.bgCard, 
        border: `1px solid ${s.border}`, 
        borderRadius: 10, 
        overflow: "hidden" 
      }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 12,
            tableLayout: "fixed"
          }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${PRIMARY}` }}>
                <TH isRtl={isRtl} style={{ width: "15%" }}>{t.amountIQD}</TH>
                <TH isRtl={isRtl} style={{ width: "15%" }}>{t.amountUSD}</TH>
                <TH isRtl={isRtl} style={{ width: "15%" }}>{t.receiptNo}</TH>
                <TH isRtl={isRtl} style={{ width: "25%" }}>{t.note}</TH>
                <TH isRtl={isRtl} style={{ width: "12%" }}>{t.date}</TH>
                <TH isRtl={isRtl} style={{ width: "8%" }}>{t.receiptImg}</TH>
                <TH isRtl={isRtl} style={{ width: "5%" }}>{t.mark}</TH>
                <TH isRtl={isRtl} style={{ width: "5%" }}></TH>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr 
                  key={item.id} 
                  style={{ 
                    background: item.marked ? `${PRIMARY}08` : "transparent",
                    borderBottom: `1px solid ${s.border}`
                  }}
                >
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
                  <TD s={s} isRtl={isRtl} title={item.note}>
                    {trunc(item.note, 30) || "—"}
                  </TD>
                  <TD s={s} isRtl={isRtl}>
                    <span style={{ direction: "ltr", display: "inline-block" }}>
                      {item.date}
                    </span>
                  </TD>
                  <TD s={s} isRtl={isRtl}>
                    {item.receiptImg ? (
                      <img
                        src={item.receiptImg}
                        alt=""
                        style={{ 
                          width: 24, 
                          height: 24, 
                          objectFit: "cover", 
                          borderRadius: 3, 
                          cursor: "pointer" 
                        }}
                        onClick={() => setImgPreview(item.receiptImg)}
                      />
                    ) : "—"}
                  </TD>
                  <TD s={s} isRtl={isRtl} style={{ textAlign: "center" }}>
                    <button
                      onClick={() => toggleMark(item.id)}
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 3,
                        border: `2px solid ${item.marked ? PRIMARY : s.border}`,
                        background: item.marked ? PRIMARY : "transparent",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff"
                      }}
                    >
                      {item.marked && <I.Check />}
                    </button>
                  </TD>
                  <TD s={s} isRtl={isRtl}>
                    <div style={{ display: "flex", gap: 3, justifyContent: "center" }}>
                      <button
                        onClick={() => handleEdit(item)}
                        style={{ 
                          background: "none", 
                          border: "none", 
                          color: PRIMARY, 
                          cursor: "pointer", 
                          padding: 2 
                        }}
                      >
                        <I.Edit />
                      </button>
                      <button
                        onClick={() => setConfirmDel(item.id)}
                        style={{ 
                          background: "none", 
                          border: "none", 
                          color: s.danger, 
                          cursor: "pointer", 
                          padding: 2 
                        }}
                      >
                        <I.Trash />
                      </button>
                    </div>
                  </TD>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filtered.length === 0 && (
            <div style={{ 
              padding: 30, 
              textAlign: "center", 
              color: s.textMuted, 
              fontSize: 12 
            }}>
              {t.noData}
            </div>
          )}
        </div>
      </div>

      {alert && (
        <AlertModal 
          message={alert} 
          onOk={() => { 
            setAlert(null); 
            resetForm(); 
            setShowForm(false); 
          }} 
          s={s} 
        />
      )}
      
      {confirmDel && (
        <ConfirmModal
          message={t.confirmDelete}
          onYes={() => doDelete(confirmDel)}
          onNo={() => setConfirmDel(null)}
          s={s}
          t={t}
        />
      )}
      
      {sizeModal && (
        <SizeModal
          t={t}
          s={s}
          onSelect={sz => doExport(sizeModal.type, sz)}
          onClose={() => setSizeModal(null)}
        />
      )}
      
      {imgPreview && (
        <div
          onClick={() => setImgPreview(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            background: "rgba(0,0,0,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            padding: 16
          }}
        >
          <img 
            src={imgPreview} 
            alt="" 
            style={{ 
              maxWidth: "90%", 
              maxHeight: "90vh", 
              borderRadius: 6 
            }} 
          />
        </div>
      )}
    </div>
  );
}

// Export all
export {
  ReportsPage,
  ExpensesPage
};

import { useState, useEffect, useCallback } from "react";
import {
  useFirebase,
  PRIMARY,
  T,
  fmt,
  today,
  genId,
  trunc,
  I,
  getS,
  TH,
  TD,
  AlertModal,
  ConfirmModal,
  SizeModal,
  doPrint,
  doExcel
} from "./Part3";

// ==================== LOANS PAGE ====================
function LoansPage({ t, s, isRtl }) {
  const { data, setDataField } = useFirebase();
  const { loans, cashIQD, cashUSD, loanPersons } = data;

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    type: "take",
    personName: "",
    amountIQD: "",
    amountUSD: "",
    note: "",
    date: today()
  });
  const [alert, setAlert] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState("");
  const [newPerson, setNewPerson] = useState("");
  const [sizeModal, setSizeModal] = useState(null);
  const [showMarkedOnly, setShowMarkedOnly] = useState(false);
  const [confirmDel, setConfirmDel] = useState(null);

  const personsList = loanPersons || [];

  useEffect(() => {
    const fromItems = [...new Set(loans.map(i => i.personName).filter(Boolean))];
    const merged = [...new Set([...personsList, ...fromItems])];
    if (merged.length !== personsList.length) {
      setDataField("loanPersons", merged);
    }
  }, [loans]);

  const filtered = loans.filter(i => {
    if (selectedPerson && i.personName !== selectedPerson) return false;
    if (showMarkedOnly && !i.marked) return false;
    return true;
  });

  const resetForm = () => {
    setForm({
      type: "take",
      personName: "",
      amountIQD: "",
      amountUSD: "",
      note: "",
      date: today()
    });
    setEditId(null);
    setNewPerson("");
  };

  const addCashLog = async (desc, iqd, usd) => {
    const newLog = {
      id: genId(),
      date: today(),
      time: new Date().toLocaleTimeString(),
      desc,
      iqd: Number(iqd || 0),
      usd: Number(usd || 0)
    };
    const currentLog = data.cashLog || [];
    await setDataField("cashLog", [...currentLog, newLog]);
  };

  const handleAddPerson = async () => {
    if (newPerson.trim() && !personsList.includes(newPerson.trim())) {
      await setDataField("loanPersons", [...personsList, newPerson.trim()]);
      setForm({ ...form, personName: newPerson.trim() });
      setNewPerson("");
    }
  };

  const handleSave = async () => {
    const iqd = Number(form.amountIQD || 0);
    const usd = Number(form.amountUSD || 0);
    if (iqd === 0 && usd === 0) return;

    const pName = form.personName || newPerson.trim();
    if (!pName) return;

    if (!personsList.includes(pName)) {
      await setDataField("loanPersons", [...personsList, pName]);
    }

    if (editId) {
      const old = loans.find(i => i.id === editId);
      if (old) {
        if (old.type === "take") {
          await setDataField("cashIQD", cashIQD - Number(old.amountIQD || 0));
          await setDataField("cashUSD", cashUSD - Number(old.amountUSD || 0));
        } else {
          await setDataField("cashIQD", cashIQD + Number(old.amountIQD || 0));
          await setDataField("cashUSD", cashUSD + Number(old.amountUSD || 0));
        }
      }

      if (form.type === "take") {
        await setDataField("cashIQD", cashIQD + iqd);
        await setDataField("cashUSD", cashUSD + usd);
        await addCashLog(`${t.edit} ${t.loanTake}: ${pName}`, iqd, usd);
      } else {
        if (iqd > cashIQD || usd > cashUSD) {
          setAlert(t.noBalance);
          return;
        }
        await setDataField("cashIQD", cashIQD - iqd);
        await setDataField("cashUSD", cashUSD - usd);
        await addCashLog(`${t.edit} ${t.loanGive}: ${pName}`, -iqd, -usd);
      }

      const updated = loans.map(i => i.id === editId ? { ...i, ...form, personName: pName } : i);
      await setDataField("loans", updated);
    } else {
      if (form.type === "give") {
        if (iqd > cashIQD || usd > cashUSD) {
          setAlert(t.noBalance);
          return;
        }
        await setDataField("cashIQD", cashIQD - iqd);
        await setDataField("cashUSD", cashUSD - usd);
        await addCashLog(`${t.loanGive}: ${pName}`, -iqd, -usd);
      } else {
        await setDataField("cashIQD", cashIQD + iqd);
        await setDataField("cashUSD", cashUSD + usd);
        await addCashLog(`${t.loanTake}: ${pName}`, iqd, usd);
      }

      await setDataField("loans", [{ ...form, personName: pName, id: genId(), marked: false }, ...loans]);
    }

    resetForm();
    setShowForm(false);
  };

  const doDelete = async (id) => {
    const item = loans.find(i => i.id === id);
    if (item) {
      if (item.type === "take") {
        await setDataField("cashIQD", cashIQD - Number(item.amountIQD || 0));
        await setDataField("cashUSD", cashUSD - Number(item.amountUSD || 0));
        await addCashLog(`${t.delete} ${t.loanTake}`, -Number(item.amountIQD || 0), -Number(item.amountUSD || 0));
      } else {
        await setDataField("cashIQD", cashIQD + Number(item.amountIQD || 0));
        await setDataField("cashUSD", cashUSD + Number(item.amountUSD || 0));
        await addCashLog(`${t.delete} ${t.loanGive}`, Number(item.amountIQD || 0), Number(item.amountUSD || 0));
      }

      const updated = loans.filter(i => i.id !== id);
      await setDataField("loans", updated);
    }
    setConfirmDel(null);
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditId(item.id);
    setShowForm(true);
  };

  const toggleMark = async (id) => {
    const updated = loans.map(i => i.id === id ? { ...i, marked: !i.marked } : i);
    await setDataField("loans", updated);
  };

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

    if (type === "pdf") {
      doPrint({ title: t.sidebar.loans, headers: hdrs, rows, size, isRtl });
    } else {
      doExcel({ title: "loans", headers: hdrs, rows });
    }
    setSizeModal(null);
  };

  const personBalance = selectedPerson ? (() => {
    const pItems = loans.filter(i => i.personName === selectedPerson);
    const takeIQD = pItems.filter(i => i.type === "take").reduce((a, b) => a + Number(b.amountIQD || 0), 0);
    const takeUSD = pItems.filter(i => i.type === "take").reduce((a, b) => a + Number(b.amountUSD || 0), 0);
    const giveIQD = pItems.filter(i => i.type === "give").reduce((a, b) => a + Number(b.amountIQD || 0), 0);
    const giveUSD = pItems.filter(i => i.type === "give").reduce((a, b) => a + Number(b.amountUSD || 0), 0);
    return { takeIQD, takeUSD, giveIQD, giveUSD, balIQD: giveIQD - takeIQD, balUSD: giveUSD - takeUSD };
  })() : null;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: PRIMARY }}>{t.sidebar.loans}</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setSizeModal({ type: "pdf" })} style={{ padding: "8px 14px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard, color: s.text, cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <I.File /> PDF
          </button>
          <button onClick={() => setSizeModal({ type: "excel" })} style={{ padding: "8px 14px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard, color: s.text, cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <I.Download /> Excel
          </button>
          <button onClick={() => setShowForm(true)} style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: PRIMARY, color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
            <I.Plus /> {t.add}
          </button>
        </div>
      </div>

      <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 10, padding: 10, marginBottom: 10 }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
          <input
            placeholder={t.addPerson}
            value={newPerson}
            onChange={e => setNewPerson(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAddPerson()}
            style={{ padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, width: 160 }}
          />
          <button onClick={handleAddPerson} style={{ padding: "6px 12px", borderRadius: 6, border: "none", background: PRIMARY, color: "#fff", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>
            <I.Plus /> {t.addPerson}
          </button>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <button onClick={() => setSelectedPerson("")} style={{ padding: "5px 12px", borderRadius: 20, border: !selectedPerson ? `2px solid ${PRIMARY}` : `1px solid ${s.border}`, background: !selectedPerson ? `${PRIMARY}15` : "transparent", color: !selectedPerson ? PRIMARY : s.text, cursor: "pointer", fontSize: 11, fontWeight: 600 }}>
            {t.allPersons}
          </button>
          {personsList.map(p => (
            <button key={p} onClick={() => setSelectedPerson(p)} style={{ padding: "5px 12px", borderRadius: 20, border: selectedPerson === p ? `2px solid ${PRIMARY}` : `1px solid ${s.border}`, background: selectedPerson === p ? `${PRIMARY}15` : "transparent", color: selectedPerson === p ? PRIMARY : s.text, cursor: "pointer", fontSize: 11, fontWeight: 600 }}>
              {p}
            </button>
          ))}
          {showMarkedOnly ? (
            <button onClick={() => { setShowMarkedOnly(false); }} style={{ padding: "5px 12px", borderRadius: 20, border: "none", background: "#D1FAE5", color: "#059669", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
              {t.showAll}
            </button>
          ) : (
            <button onClick={() => setShowMarkedOnly(true)} style={{ padding: "5px 12px", borderRadius: 20, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 11, cursor: "pointer" }}>
              {t.showMarked}
            </button>
          )}
        </div>
      </div>

      {personBalance && (
        <div style={{ display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
          <div style={{ background: "#D1FAE5", borderRadius: 8, padding: "6px 14px", fontSize: 12 }}>
            <span style={{ color: "#059669" }}>{t.loanTake}: {fmt(personBalance.takeIQD)} {t.iqd} / ${fmt(personBalance.takeUSD)}</span>
          </div>
          <div style={{ background: "#FEE2E2", borderRadius: 8, padding: "6px 14px", fontSize: 12 }}>
            <span style={{ color: "#EF4444" }}>{t.loanGive}: {fmt(personBalance.giveIQD)} {t.iqd} / ${fmt(personBalance.giveUSD)}</span>
          </div>
        </div>
      )}

      {showForm && (
        <div style={{ background: s.bgCard, border: `1px solid ${PRIMARY}40`, borderRadius: 10, padding: 14, marginBottom: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 8 }}>
            <div>
              <label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 4 }}>{t.loanType}</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12 }}>
                <option value="take">{t.loanTake}</option>
                <option value="give">{t.loanGive}</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 4 }}>{t.personName}</label>
              <select value={form.personName} onChange={e => setForm({ ...form, personName: e.target.value })} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12 }}>
                <option value="">— {t.personName} —</option>
                {personsList.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 4 }}>{t.amountIQD}</label>
              <input type="number" value={form.amountIQD} onChange={e => setForm({ ...form, amountIQD: e.target.value })} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12 }} />
            </div>
            <div>
              <label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 4 }}>{t.amountUSD}</label>
              <input type="number" value={form.amountUSD} onChange={e => setForm({ ...form, amountUSD: e.target.value })} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12 }} />
            </div>
            <div>
              <label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 4 }}>{t.note}</label>
              <input value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12 }} />
            </div>
            <div>
              <label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 4 }}>{t.date}</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12 }} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
            <button onClick={handleSave} style={{ padding: "7px 18px", borderRadius: 6, border: "none", background: PRIMARY, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              {editId ? t.edit : t.save}
            </button>
            <button onClick={() => { setShowForm(false); resetForm(); }} style={{ padding: "7px 18px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, cursor: "pointer" }}>
              {t.cancel}
            </button>
          </div>
        </div>
      )}

      <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 10, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, tableLayout: "fixed" }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${PRIMARY}` }}>
                <TH isRtl={isRtl} style={{ width: "12%" }}>{t.loanType}</TH>
                <TH isRtl={isRtl} style={{ width: "18%" }}>{t.personName}</TH>
                <TH isRtl={isRtl} style={{ width: "15%" }}>{t.amountIQD}</TH>
                <TH isRtl={isRtl} style={{ width: "15%" }}>{t.amountUSD}</TH>
                <TH isRtl={isRtl} style={{ width: "20%" }}>{t.note}</TH>
                <TH isRtl={isRtl} style={{ width: "12%" }}>{t.date}</TH>
                <TH isRtl={isRtl} style={{ width: "5%" }}>{t.mark}</TH>
                <TH isRtl={isRtl} style={{ width: "3%" }}></TH>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id} style={{ background: item.marked ? `${PRIMARY}08` : "transparent", borderBottom: `1px solid ${s.border}` }}>
                  <TD s={s} isRtl={isRtl}>
                    <span style={{ padding: "2px 8px", borderRadius: 10, fontSize: 10, fontWeight: 600, background: item.type === "take" ? "#D1FAE5" : "#FEE2E2", color: item.type === "take" ? "#059669" : "#EF4444" }}>
                      {item.type === "take" ? t.loanTake : t.loanGive}
                    </span>
                  </TD>
                  <TD s={s} isRtl={isRtl} style={{ fontWeight: 600 }}>{item.personName}</TD>
                  <TD s={s} isRtl={isRtl}>
                    {Number(item.amountIQD) ? <span style={{ direction: "ltr", display: "inline-block" }}>{fmt(item.amountIQD)}</span> : "—"}
                  </TD>
                  <TD s={s} isRtl={isRtl}>
                    {Number(item.amountUSD) ? <span style={{ direction: "ltr", display: "inline-block" }}>${fmt(item.amountUSD)}</span> : "—"}
                  </TD>
                  <TD s={s} isRtl={isRtl} title={item.note}>{trunc(item.note, 25) || "—"}</TD>
                  <TD s={s} isRtl={isRtl}><span style={{ direction: "ltr", display: "inline-block" }}>{item.date}</span></TD>
                  <TD s={s} isRtl={isRtl} style={{ textAlign: "center" }}>
                    <button onClick={() => toggleMark(item.id)} style={{ width: 20, height: 20, borderRadius: 3, border: `2px solid ${item.marked ? PRIMARY : s.border}`, background: item.marked ? PRIMARY : "transparent", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                      {item.marked && <I.Check />}
                    </button>
                  </TD>
                  <TD s={s} isRtl={isRtl}>
                    <div style={{ display: "flex", gap: 3, justifyContent: "center" }}>
                      <button onClick={() => handleEdit(item)} style={{ background: "none", border: "none", color: PRIMARY, cursor: "pointer", padding: 2 }}><I.Edit /></button>
                      <button onClick={() => setConfirmDel(item.id)} style={{ background: "none", border: "none", color: s.danger, cursor: "pointer", padding: 2 }}><I.Trash /></button>
                    </div>
                  </TD>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div style={{ padding: 30, textAlign: "center", color: s.textMuted, fontSize: 12 }}>{t.noData}</div>}
        </div>
      </div>

      {alert && <AlertModal message={alert} onOk={() => { setAlert(null); resetForm(); setShowForm(false); }} s={s} />}
      {confirmDel && <ConfirmModal message={t.confirmDelete} onYes={() => doDelete(confirmDel)} onNo={() => setConfirmDel(null)} s={s} t={t} />}
      {sizeModal && <SizeModal t={t} s={s} onSelect={sz => doExport(sizeModal.type, sz)} onClose={() => setSizeModal(null)} />}
    </div>
  );
}

// ==================== CONCRETE PAGE ====================
function ConcretePage({ t, s, isRtl }) {
  const { data, setDataField } = useFirebase();
  const { concrete, cashIQD, cashUSD } = data;

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    date: today(),
    meters: "",
    pricePerMeter: "",
    depositPercent: "",
    note: "",
    currency: "iqd"
  });
  const [alert, setAlert] = useState(null);
  const [showMarkedOnly, setShowMarkedOnly] = useState(false);
  const [confirmDel, setConfirmDel] = useState(null);

  const totalPrice = Number(form.meters || 0) * Number(form.pricePerMeter || 0);
  const depositAmt = Math.round(totalPrice * Number(form.depositPercent || 0) / 100);
  const receivedAmt = totalPrice - depositAmt;

  const filtered = concrete.filter(i => showMarkedOnly ? i.marked : true);

  const addCashLog = async (desc, iqd, usd) => {
    const newLog = { id: genId(), date: today(), time: new Date().toLocaleTimeString(), desc, iqd: Number(iqd || 0), usd: Number(usd || 0) };
    await setDataField("cashLog", [...(data.cashLog || []), newLog]);
  };

  const handleSave = async () => {
    if (totalPrice <= 0) return;
    const cur = form.currency || "iqd";
    const item = { ...form, id: genId(), totalPrice, deposit: depositAmt, received: receivedAmt, depositClaimed: false, isReceived: false, marked: false, currency: cur };
    await setDataField("concrete", [item, ...concrete]);
    setForm({ date: today(), meters: "", pricePerMeter: "", depositPercent: "", note: "", currency: "iqd" });
    setShowForm(false);
  };

  const markReceived = async (id) => {
    const item = concrete.find(i => i.id === id);
    if (item && !item.isReceived) {
      const cur = item.currency || "iqd";
      if (cur === "usd") {
        await setDataField("cashUSD", cashUSD + item.received);
      } else {
        await setDataField("cashIQD", cashIQD + item.received);
      }
      await addCashLog(`${t.received} ${t.sidebar.concrete}`, cur === "iqd" ? item.received : 0, cur === "usd" ? item.received : 0);
      const updated = concrete.map(i => i.id === id ? { ...i, isReceived: true } : i);
      await setDataField("concrete", updated);
    }
  };

  const claimDeposit = async (id) => {
    const item = concrete.find(i => i.id === id);
    if (item && !item.depositClaimed && item.deposit > 0) {
      const cur = item.currency || "iqd";
      if (cur === "usd") {
        await setDataField("cashUSD", cashUSD + item.deposit);
      } else {
        await setDataField("cashIQD", cashIQD + item.deposit);
      }
      await addCashLog(`${t.claimDeposit}: ${item.deposit}`, cur === "iqd" ? item.deposit : 0, cur === "usd" ? item.deposit : 0);
      const updated = concrete.map(i => i.id === id ? { ...i, depositClaimed: true } : i);
      await setDataField("concrete", updated);
    }
  };

  const doDelete = async (id) => {
    const item = concrete.find(i => i.id === id);
    if (item) {
      const cur = item.currency || "iqd";
      if (item.isReceived) {
        if (cur === "usd") await setDataField("cashUSD", cashUSD - Number(item.received || 0));
        else await setDataField("cashIQD", cashIQD - Number(item.received || 0));
      }
      if (item.depositClaimed) {
        if (cur === "usd") await setDataField("cashUSD", cashUSD - Number(item.deposit || 0));
        else await setDataField("cashIQD", cashIQD - Number(item.deposit || 0));
      }
      await addCashLog(`${t.delete} ${t.sidebar.concrete}`, cur === "iqd" ? -(Number(item.isReceived ? item.received : 0) + Number(item.depositClaimed ? item.deposit : 0)) : 0, cur === "usd" ? -(Number(item.isReceived ? item.received : 0) + Number(item.depositClaimed ? item.deposit : 0)) : 0);
      const updated = concrete.filter(i => i.id !== id);
      await setDataField("concrete", updated);
    }
    setConfirmDel(null);
  };

  const toggleMark = async (id) => {
    const updated = concrete.map(i => i.id === id ? { ...i, marked: !i.marked } : i);
    await setDataField("concrete", updated);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: PRIMARY }}>{t.sidebar.concrete}</h1>
        <button onClick={() => setShowForm(true)} style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: PRIMARY, color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
          <I.Plus /> {t.add}
        </button>
      </div>

      {showForm && (
        <div style={{ background: s.bgCard, border: `1px solid ${PRIMARY}40`, borderRadius: 10, padding: 14, marginBottom: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 8 }}>
            <div>
              <label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 4 }}>{t.date}</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12 }} />
            </div>
            <div>
              <label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 4 }}>{t.concCurrency}</label>
              <select value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12 }}>
                <option value="iqd">{t.iqd}</option>
                <option value="usd">{t.usd}</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 4 }}>{t.meters}</label>
              <input type="number" value={form.meters} onChange={e => setForm({ ...form, meters: e.target.value })} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12 }} />
            </div>
            <div>
              <label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 4 }}>{t.pricePerMeter}</label>
              <input type="number" value={form.pricePerMeter} onChange={e => setForm({ ...form, pricePerMeter: e.target.value })} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12 }} />
            </div>
            <div>
              <label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 4 }}>{t.totalConcrete}</label>
              <div style={{ padding: "6px 10px", borderRadius: 6, background: `${PRIMARY}10`, fontWeight: 700, color: PRIMARY, fontSize: 12 }}>{form.currency === "usd" ? "$" : ""}{fmt(totalPrice)}</div>
            </div>
            <div>
              <label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 4 }}>{t.depositPercent}</label>
              <input type="number" value={form.depositPercent} onChange={e => setForm({ ...form, depositPercent: e.target.value })} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12 }} placeholder="%" />
            </div>
            <div>
              <label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 4 }}>{t.deposit}</label>
              <div style={{ padding: "6px 10px", borderRadius: 6, background: "#FEF3C7", fontWeight: 700, color: "#D97706", fontSize: 12 }}>{form.currency === "usd" ? "$" : ""}{fmt(depositAmt)}</div>
            </div>
            <div>
              <label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 4 }}>{t.received}</label>
              <div style={{ padding: "6px 10px", borderRadius: 6, background: "#D1FAE5", fontWeight: 700, color: "#059669", fontSize: 12 }}>{form.currency === "usd" ? "$" : ""}{fmt(receivedAmt)}</div>
            </div>
            <div>
              <label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 4 }}>{t.note}</label>
              <input value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12 }} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
            <button onClick={handleSave} style={{ padding: "7px 18px", borderRadius: 6, border: "none", background: PRIMARY, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{t.save}</button>
            <button onClick={() => setShowForm(false)} style={{ padding: "7px 18px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, cursor: "pointer" }}>{t.cancel}</button>
          </div>
        </div>
      )}

      <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 10, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, tableLayout: "fixed" }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${PRIMARY}` }}>
                <TH isRtl={isRtl} style={{ width: "10%" }}>{t.date}</TH>
                <TH isRtl={isRtl} style={{ width: "8%" }}>{t.currency}</TH>
                <TH isRtl={isRtl} style={{ width: "10%" }}>{t.meters}</TH>
                <TH isRtl={isRtl} style={{ width: "12%" }}>{t.pricePerMeter}</TH>
                <TH isRtl={isRtl} style={{ width: "12%" }}>{t.totalConcrete}</TH>
                <TH isRtl={isRtl} style={{ width: "10%" }}>{t.deposit}</TH>
                <TH isRtl={isRtl} style={{ width: "10%" }}>{t.received}</TH>
                <TH isRtl={isRtl} style={{ width: "10%" }}>{t.receivedStatus}</TH>
                <TH isRtl={isRtl} style={{ width: "5%" }}>{t.mark}</TH>
                <TH isRtl={isRtl} style={{ width: "13%" }}></TH>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => {
                const cur = item.currency || "iqd";
                const sym = cur === "usd" ? "$" : "";
                return (
                  <tr key={item.id} style={{ background: item.marked ? `${PRIMARY}08` : "transparent", borderBottom: `1px solid ${s.border}` }}>
                    <TD s={s} isRtl={isRtl}><span style={{ direction: "ltr", display: "inline-block" }}>{item.date}</span></TD>
                    <TD s={s} isRtl={isRtl}>{cur === "usd" ? t.usd : t.iqd}</TD>
                    <TD s={s} isRtl={isRtl}><span style={{ direction: "ltr", display: "inline-block" }}>{fmt(item.meters)}</span></TD>
                    <TD s={s} isRtl={isRtl}><span style={{ direction: "ltr", display: "inline-block" }}>{sym}{fmt(item.pricePerMeter)}</span></TD>
                    <TD s={s} isRtl={isRtl} style={{ fontWeight: 700, color: PRIMARY }}><span style={{ direction: "ltr", display: "inline-block" }}>{sym}{fmt(item.totalPrice)}</span></TD>
                    <TD s={s} isRtl={isRtl} style={{ color: "#D97706" }}><span style={{ direction: "ltr", display: "inline-block" }}>{sym}{fmt(item.deposit)}</span></TD>
                    <TD s={s} isRtl={isRtl} style={{ color: s.success, fontWeight: 700 }}><span style={{ direction: "ltr", display: "inline-block" }}>{sym}{fmt(item.received)}</span></TD>
                    <TD s={s} isRtl={isRtl}>
                      {item.isReceived ? (
                        <span style={{ color: s.success, fontSize: 11, fontWeight: 600 }}>✓ {t.receivedStatus}</span>
                      ) : (
                        <button onClick={() => markReceived(item.id)} style={{ padding: "3px 8px", borderRadius: 4, border: `1px solid ${s.success}`, background: "#D1FAE5", color: "#059669", cursor: "pointer", fontSize: 10, fontWeight: 600 }}>{t.receivedStatus}</button>
                      )}
                    </TD>
                    <TD s={s} isRtl={isRtl} style={{ textAlign: "center" }}>
                      <button onClick={() => toggleMark(item.id)} style={{ width: 20, height: 20, borderRadius: 3, border: `2px solid ${item.marked ? PRIMARY : s.border}`, background: item.marked ? PRIMARY : "transparent", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                        {item.marked && <I.Check />}
                      </button>
                    </TD>
                    <TD s={s} isRtl={isRtl}>
                      <div style={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
                        {!item.depositClaimed && item.deposit > 0 && (
                          <button onClick={() => claimDeposit(item.id)} style={{ padding: "2px 6px", borderRadius: 4, border: `1px solid #D97706`, background: "#FEF3C7", color: "#D97706", cursor: "pointer", fontSize: 9, fontWeight: 600 }}>{t.claimDeposit}</button>
                        )}
                        {item.depositClaimed && <span style={{ fontSize: 9, color: s.success }}>✓</span>}
                        <button onClick={() => setConfirmDel(item.id)} style={{ background: "none", border: "none", color: s.danger, cursor: "pointer", padding: 2 }}><I.Trash /></button>
                      </div>
                    </TD>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <div style={{ padding: 30, textAlign: "center", color: s.textMuted, fontSize: 12 }}>{t.noData}</div>}
        </div>
      </div>

      {alert && <AlertModal message={alert} onOk={() => setAlert(null)} s={s} />}
      {confirmDel && <ConfirmModal message={t.confirmDelete} onYes={() => doDelete(confirmDel)} onNo={() => setConfirmDel(null)} s={s} t={t} />}
    </div>
  );
}

// ==================== CONTRACTOR PAGE ====================
function ContractorPage({ t, s, isRtl }) {
  const { data, setDataField } = useFirebase();
  const { contractor, cashIQD, cashUSD, contrPersons } = data;

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    date: today(),
    type: "withdraw",
    personName: "",
    amountIQD: "",
    amountUSD: "",
    note: ""
  });
  const [alert, setAlert] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState("");
  const [newPerson, setNewPerson] = useState("");
  const [showMarkedOnly, setShowMarkedOnly] = useState(false);
  const [confirmDel, setConfirmDel] = useState(null);

  const personsList = contrPersons || [];

  useEffect(() => {
    const fromItems = [...new Set(contractor.map(i => i.personName).filter(Boolean))];
    const merged = [...new Set([...personsList, ...fromItems])];
    if (merged.length !== personsList.length) {
      setDataField("contrPersons", merged);
    }
  }, [contractor]);

  const filtered = contractor.filter(i => {
    if (selectedPerson && i.personName !== selectedPerson) return false;
    if (showMarkedOnly && !i.marked) return false;
    return true;
  });

  const resetForm = () => {
    setForm({ date: today(), type: "withdraw", personName: "", amountIQD: "", amountUSD: "", note: "" });
    setEditId(null);
    setNewPerson("");
  };

  const addCashLog = async (desc, iqd, usd) => {
    const newLog = { id: genId(), date: today(), time: new Date().toLocaleTimeString(), desc, iqd: Number(iqd || 0), usd: Number(usd || 0) };
    await setDataField("cashLog", [...(data.cashLog || []), newLog]);
  };

  const handleAddPerson = async () => {
    if (newPerson.trim() && !personsList.includes(newPerson.trim())) {
      await setDataField("contrPersons", [...personsList, newPerson.trim()]);
      setForm({ ...form, personName: newPerson.trim() });
      setNewPerson("");
    }
  };

  const handleSave = async () => {
    const iqd = Number(form.amountIQD || 0);
    const usd = Number(form.amountUSD || 0);
    if (iqd === 0 && usd === 0) return;

    const pName = form.personName || newPerson.trim();
    if (!pName) return;

    if (!personsList.includes(pName)) {
      await setDataField("contrPersons", [...personsList, pName]);
    }

    if (editId) {
      const old = contractor.find(i => i.id === editId);
      if (old) {
        if (old.type === "withdraw") {
          await setDataField("cashIQD", cashIQD + Number(old.amountIQD || 0));
          await setDataField("cashUSD", cashUSD + Number(old.amountUSD || 0));
        } else {
          await setDataField("cashIQD", cashIQD - Number(old.amountIQD || 0));
          await setDataField("cashUSD", cashUSD - Number(old.amountUSD || 0));
        }
      }

      if (form.type === "withdraw") {
        if (iqd > cashIQD || usd > cashUSD) {
          setAlert(t.noBalance);
          return;
        }
        await setDataField("cashIQD", cashIQD - iqd);
        await setDataField("cashUSD", cashUSD - usd);
        await addCashLog(`${t.edit} ${t.withdraw}: ${pName}`, -iqd, -usd);
      } else {
        await setDataField("cashIQD", cashIQD + iqd);
        await setDataField("cashUSD", cashUSD + usd);
        await addCashLog(`${t.edit} ${t.addMoney}: ${pName}`, iqd, usd);
      }

      const updated = contractor.map(i => i.id === editId ? { ...i, ...form, personName: pName } : i);
      await setDataField("contractor", updated);
    } else {
      if (form.type === "withdraw") {
        if (iqd > cashIQD || usd > cashUSD) {
          setAlert(t.noBalance);
          return;
        }
        await setDataField("cashIQD", cashIQD - iqd);
        await setDataField("cashUSD", cashUSD - usd);
        await addCashLog(`${t.withdraw}: ${pName}`, -iqd, -usd);
      } else {
        await setDataField("cashIQD", cashIQD + iqd);
        await setDataField("cashUSD", cashUSD + usd);
        await addCashLog(`${t.addMoney}: ${pName}`, iqd, usd);
      }

      await setDataField("contractor", [{ ...form, personName: pName, id: genId(), marked: false }, ...contractor]);
    }

    resetForm();
    setShowForm(false);
  };

  const doDelete = async (id) => {
    const item = contractor.find(i => i.id === id);
    if (item) {
      if (item.type === "withdraw") {
        await setDataField("cashIQD", cashIQD + Number(item.amountIQD || 0));
        await setDataField("cashUSD", cashUSD + Number(item.amountUSD || 0));
        await addCashLog(`${t.delete} ${t.withdraw}`, Number(item.amountIQD || 0), Number(item.amountUSD || 0));
      } else {
        await setDataField("cashIQD", cashIQD - Number(item.amountIQD || 0));
        await setDataField("cashUSD", cashUSD - Number(item.amountUSD || 0));
        await addCashLog(`${t.delete} ${t.addMoney}`, -Number(item.amountIQD || 0), -Number(item.amountUSD || 0));
      }

      const updated = contractor.filter(i => i.id !== id);
      await setDataField("contractor", updated);
    }
    setConfirmDel(null);
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditId(item.id);
    setShowForm(true);
  };

  const toggleMark = async (id) => {
    const updated = contractor.map(i => i.id === id ? { ...i, marked: !i.marked } : i);
    await setDataField("contractor", updated);
  };

  const personBalance = selectedPerson ? (() => {
    const pItems = contractor.filter(i => i.personName === selectedPerson);
    const wIQD = pItems.filter(i => i.type === "withdraw").reduce((a, b) => a + Number(b.amountIQD || 0), 0);
    const wUSD = pItems.filter(i => i.type === "withdraw").reduce((a, b) => a + Number(b.amountUSD || 0), 0);
    const aIQD = pItems.filter(i => i.type === "add").reduce((a, b) => a + Number(b.amountIQD || 0), 0);
    const aUSD = pItems.filter(i => i.type === "add").reduce((a, b) => a + Number(b.amountUSD || 0), 0);
    return { wIQD, wUSD, aIQD, aUSD, balIQD: aIQD - wIQD, balUSD: aUSD - wUSD };
  })() : null;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: PRIMARY }}>{t.sidebar.contractor}</h1>
        <button onClick={() => setShowForm(true)} style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: PRIMARY, color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
          <I.Plus /> {t.add}
        </button>
      </div>

      <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 10, padding: 10, marginBottom: 10 }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
          <input placeholder={t.addPerson} value={newPerson} onChange={e => setNewPerson(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAddPerson()} style={{ padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, width: 160 }} />
          <button onClick={handleAddPerson} style={{ padding: "6px 12px", borderRadius: 6, border: "none", background: PRIMARY, color: "#fff", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>
            <I.Plus /> {t.addPerson}
          </button>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <button onClick={() => setSelectedPerson("")} style={{ padding: "5px 12px", borderRadius: 20, border: !selectedPerson ? `2px solid ${PRIMARY}` : `1px solid ${s.border}`, background: !selectedPerson ? `${PRIMARY}15` : "transparent", color: !selectedPerson ? PRIMARY : s.text, cursor: "pointer", fontSize: 11, fontWeight: 600 }}>
            {t.allPersons}
          </button>
          {personsList.map(p => (
            <button key={p} onClick={() => setSelectedPerson(p)} style={{ padding: "5px 12px", borderRadius: 20, border: selectedPerson === p ? `2px solid ${PRIMARY}` : `1px solid ${s.border}`, background: selectedPerson === p ? `${PRIMARY}15` : "transparent", color: selectedPerson === p ? PRIMARY : s.text, cursor: "pointer", fontSize: 11, fontWeight: 600 }}>
              {p}
            </button>
          ))}
          {showMarkedOnly ? (
            <button onClick={() => { setShowMarkedOnly(false); }} style={{ padding: "5px 12px", borderRadius: 20, border: "none", background: "#D1FAE5", color: "#059669", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
              {t.showAll}
            </button>
          ) : (
            <button onClick={() => setShowMarkedOnly(true)} style={{ padding: "5px 12px", borderRadius: 20, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 11, cursor: "pointer" }}>
              {t.showMarked}
            </button>
          )}
        </div>
      </div>

      {personBalance && (
        <div style={{ display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
          <div style={{ background: "#FEE2E2", borderRadius: 8, padding: "6px 14px", fontSize: 12 }}>
            <span style={{ color: "#EF4444" }}>{t.withdraw}: {fmt(personBalance.wIQD)} {t.iqd} / ${fmt(personBalance.wUSD)}</span>
          </div>
          <div style={{ background: "#D1FAE5", borderRadius: 8, padding: "6px 14px", fontSize: 12 }}>
            <span style={{ color: "#059669" }}>{t.addMoney}: {fmt(personBalance.aIQD)} {t.iqd} / ${fmt(personBalance.aUSD)}</span>
          </div>
        </div>
      )}

      {showForm && (
        <div style={{ background: s.bgCard, border: `1px solid ${PRIMARY}40`, borderRadius: 10, padding: 14, marginBottom: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 8 }}>
            <div>
              <label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 4 }}>{t.date}</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12 }} />
            </div>
            <div>
              <label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 4 }}>{t.contractorType}</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12 }}>
                <option value="withdraw">{t.withdraw}</option>
                <option value="add">{t.addMoney}</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 4 }}>{t.personName}</label>
              <select value={form.personName} onChange={e => setForm({ ...form, personName: e.target.value })} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12 }}>
                <option value="">— {t.personName} —</option>
                {personsList.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 4 }}>{t.amountIQD}</label>
              <input type="number" value={form.amountIQD} onChange={e => setForm({ ...form, amountIQD: e.target.value })} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12 }} />
            </div>
            <div>
              <label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 4 }}>{t.amountUSD}</label>
              <input type="number" value={form.amountUSD} onChange={e => setForm({ ...form, amountUSD: e.target.value })} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12 }} />
            </div>
            <div>
              <label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 4 }}>{t.note}</label>
              <input value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12 }} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
            <button onClick={handleSave} style={{ padding: "7px 18px", borderRadius: 6, border: "none", background: PRIMARY, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{editId ? t.edit : t.save}</button>
            <button onClick={() => { setShowForm(false); resetForm(); }} style={{ padding: "7px 18px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, cursor: "pointer" }}>{t.cancel}</button>
          </div>
        </div>
      )}

      <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 10, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, tableLayout: "fixed" }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${PRIMARY}` }}>
                <TH isRtl={isRtl} style={{ width: "12%" }}>{t.date}</TH>
                <TH isRtl={isRtl} style={{ width: "12%" }}>{t.contractorType}</TH>
                <TH isRtl={isRtl} style={{ width: "18%" }}>{t.personName}</TH>
                <TH isRtl={isRtl} style={{ width: "15%" }}>{t.amountIQD}</TH>
                <TH isRtl={isRtl} style={{ width: "15%" }}>{t.amountUSD}</TH>
                <TH isRtl={isRtl} style={{ width: "20%" }}>{t.note}</TH>
                <TH isRtl={isRtl} style={{ width: "5%" }}>{t.mark}</TH>
                <TH isRtl={isRtl} style={{ width: "3%" }}></TH>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id} style={{ background: item.marked ? `${PRIMARY}08` : "transparent", borderBottom: `1px solid ${s.border}` }}>
                  <TD s={s} isRtl={isRtl}><span style={{ direction: "ltr", display: "inline-block" }}>{item.date}</span></TD>
                  <TD s={s} isRtl={isRtl}>
                    <span style={{ padding: "2px 8px", borderRadius: 10, fontSize: 10, fontWeight: 600, background: item.type === "add" ? "#D1FAE5" : "#FEE2E2", color: item.type === "add" ? "#059669" : "#EF4444" }}>
                      {item.type === "add" ? t.addMoney : t.withdraw}
                    </span>
                  </TD>
                  <TD s={s} isRtl={isRtl} style={{ fontWeight: 600 }}>{item.personName}</TD>
                  <TD s={s} isRtl={isRtl} style={{ fontWeight: 600 }}>
                    {Number(item.amountIQD) ? <span style={{ direction: "ltr", display: "inline-block" }}>{fmt(item.amountIQD)}</span> : "—"}
                  </TD>
                  <TD s={s} isRtl={isRtl} style={{ fontWeight: 600 }}>
                    {Number(item.amountUSD) ? <span style={{ direction: "ltr", display: "inline-block" }}>${fmt(item.amountUSD)}</span> : "—"}
                  </TD>
                  <TD s={s} isRtl={isRtl} title={item.note}>{trunc(item.note, 25) || "—"}</TD>
                  <TD s={s} isRtl={isRtl} style={{ textAlign: "center" }}>
                    <button onClick={() => toggleMark(item.id)} style={{ width: 20, height: 20, borderRadius: 3, border: `2px solid ${item.marked ? PRIMARY : s.border}`, background: item.marked ? PRIMARY : "transparent", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                      {item.marked && <I.Check />}
                    </button>
                  </TD>
                  <TD s={s} isRtl={isRtl}>
                    <div style={{ display: "flex", gap: 3, justifyContent: "center" }}>
                      <button onClick={() => handleEdit(item)} style={{ background: "none", border: "none", color: PRIMARY, cursor: "pointer", padding: 2 }}><I.Edit /></button>
                      <button onClick={() => setConfirmDel(item.id)} style={{ background: "none", border: "none", color: s.danger, cursor: "pointer", padding: 2 }}><I.Trash /></button>
                    </div>
                  </TD>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div style={{ padding: 30, textAlign: "center", color: s.textMuted, fontSize: 12 }}>{t.noData}</div>}
        </div>
      </div>

      {alert && <AlertModal message={alert} onOk={() => { setAlert(null); resetForm(); setShowForm(false); }} s={s} />}
      {confirmDel && <ConfirmModal message={t.confirmDelete} onYes={() => doDelete(confirmDel)} onNo={() => setConfirmDel(null)} s={s} t={t} />}
    </div>
  );
}

// Export all
export {
  LoansPage,
  ConcretePage,
  ContractorPage
};

import { useState, useEffect } from "react";
import {
  useFirebase,
  PRIMARY,
  T,
  fmt,
  today,
  genId,
  I,
  getS,
  TH,
  TD,
  AlertModal,
  ConfirmModal,
  SizeModal,
  doPrint,
  doExcel
} from "./Part4";

// ==================== CASH PAGE ====================
function CashPage({ t, s, isRtl }) {
  const { data, setDataField } = useFirebase();
  const { cashIQD, cashUSD, exchangeRate, cashLog } = data;

  const [editIQD, setEditIQD] = useState(false);
  const [editUSD, setEditUSD] = useState(false);
  const [tmpIQD, setTmpIQD] = useState(cashIQD);
  const [tmpUSD, setTmpUSD] = useState(cashUSD);

  const addCashLog = async (desc, iqd, usd) => {
    const newLog = {
      id: genId(),
      date: today(),
      time: new Date().toLocaleTimeString(),
      desc,
      iqd: Number(iqd || 0),
      usd: Number(usd || 0)
    };
    await setDataField("cashLog", [...(cashLog || []), newLog]);
  };

  const saveIQD = async () => {
    const diff = Number(tmpIQD) - cashIQD;
    await setDataField("cashIQD", Number(tmpIQD));
    if (diff !== 0) {
      await addCashLog(`${t.edit} ${t.cashIQD}`, diff, 0);
    }
    setEditIQD(false);
  };

  const saveUSD = async () => {
    const diff = Number(tmpUSD) - cashUSD;
    await setDataField("cashUSD", Number(tmpUSD));
    if (diff !== 0) {
      await addCashLog(`${t.edit} ${t.cashUSD}`, 0, diff);
    }
    setEditUSD(false);
  };

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16, color: PRIMARY }}>{t.cashBox}</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 20 }}>
        <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 12, padding: 16, textAlign: "center", borderTop: `3px solid ${PRIMARY}` }}>
          <div style={{ fontSize: 10, color: s.textMuted, fontWeight: 600, marginBottom: 5 }}>{t.cashIQD}</div>
          {editIQD ? (
            <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
              <input
                type="number"
                value={tmpIQD}
                onChange={e => setTmpIQD(e.target.value)}
                style={{ width: 100, padding: "4px 8px", borderRadius: 4, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 14 }}
              />
              <button onClick={saveIQD} style={{ padding: "4px 12px", borderRadius: 4, border: "none", background: PRIMARY, color: "#fff", cursor: "pointer", fontSize: 12 }}>{t.save}</button>
              <button onClick={() => { setEditIQD(false); setTmpIQD(cashIQD); }} style={{ padding: "4px 12px", borderRadius: 4, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, cursor: "pointer", fontSize: 12 }}>{t.cancel}</button>
            </div>
          ) : (
            <div onClick={() => { setEditIQD(true); setTmpIQD(cashIQD); }} style={{ cursor: "pointer" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: PRIMARY, direction: "ltr" }}>{fmt(cashIQD)}</div>
              <div style={{ fontSize: 9, color: s.textMuted, marginTop: 2 }}>{t.clickToChange}</div>
            </div>
          )}
        </div>

        <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 12, padding: 16, textAlign: "center", borderTop: `3px solid ${PRIMARY}` }}>
          <div style={{ fontSize: 10, color: s.textMuted, fontWeight: 600, marginBottom: 5 }}>{t.cashUSD}</div>
          {editUSD ? (
            <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
              <input
                type="number"
                value={tmpUSD}
                onChange={e => setTmpUSD(e.target.value)}
                style={{ width: 100, padding: "4px 8px", borderRadius: 4, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 14 }}
              />
              <button onClick={saveUSD} style={{ padding: "4px 12px", borderRadius: 4, border: "none", background: PRIMARY, color: "#fff", cursor: "pointer", fontSize: 12 }}>{t.save}</button>
              <button onClick={() => { setEditUSD(false); setTmpUSD(cashUSD); }} style={{ padding: "4px 12px", borderRadius: 4, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, cursor: "pointer", fontSize: 12 }}>{t.cancel}</button>
            </div>
          ) : (
            <div onClick={() => { setEditUSD(true); setTmpUSD(cashUSD); }} style={{ cursor: "pointer" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: PRIMARY, direction: "ltr" }}>${fmt(cashUSD)}</div>
              <div style={{ fontSize: 9, color: s.textMuted, marginTop: 2 }}>{t.clickToChange}</div>
            </div>
          )}
        </div>

        <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 12, padding: 16, textAlign: "center", borderTop: `3px solid ${PRIMARY}` }}>
          <div style={{ fontSize: 10, color: s.textMuted, fontWeight: 600, marginBottom: 5 }}>{t.totalInIQD}</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: PRIMARY, direction: "ltr" }}>{fmt(Math.round(cashIQD + cashUSD * exchangeRate))}</div>
          <div style={{ fontSize: 9, color: s.textMuted, marginTop: 2 }}>1$ = {fmt(exchangeRate)} {t.iqd}</div>
        </div>
      </div>

      <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 10, overflow: "hidden" }}>
        <h3 style={{ padding: "10px 12px 0", fontSize: 13, fontWeight: 700 }}>{t.cashLog}</h3>
        <div style={{ overflowX: "auto", maxHeight: 400, overflowY: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, tableLayout: "fixed" }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${PRIMARY}` }}>
                <TH isRtl={isRtl} style={{ width: "15%" }}>{t.date}</TH>
                <TH isRtl={isRtl} style={{ width: "10%" }}></TH>
                <TH isRtl={isRtl} style={{ width: "40%" }}>{t.type}</TH>
                <TH isRtl={isRtl} style={{ width: "17.5%" }}>{t.iqd}</TH>
                <TH isRtl={isRtl} style={{ width: "17.5%" }}>{t.usd}</TH>
              </tr>
            </thead>
            <tbody>
              {[...(cashLog || [])].reverse().map(log => (
                <tr key={log.id} style={{ borderBottom: `1px solid ${s.border}` }}>
                  <TD s={s} isRtl={isRtl} style={{ fontSize: 10 }}><span style={{ direction: "ltr", display: "inline-block" }}>{log.date}</span></TD>
                  <TD s={s} isRtl={isRtl} style={{ fontSize: 9, color: s.textMuted }}>{log.time}</TD>
                  <TD s={s} isRtl={isRtl}>{log.desc}</TD>
                  <TD s={s} isRtl={isRtl} style={{ color: log.iqd >= 0 ? s.success : s.danger, fontWeight: 600 }}><span style={{ direction: "ltr", display: "inline-block" }}>{log.iqd >= 0 ? "+" : ""}{fmt(log.iqd)}</span></TD>
                  <TD s={s} isRtl={isRtl} style={{ color: log.usd >= 0 ? s.success : s.danger, fontWeight: 600 }}><span style={{ direction: "ltr", display: "inline-block" }}>{log.usd >= 0 ? "+" : ""}${fmt(log.usd)}</span></TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==================== EXCHANGE PAGE ====================
function ExchangePage({ t, s, isRtl }) {
  const { data, setDataField } = useFirebase();
  const { cashIQD, cashUSD, exchangeRate } = data;

  const [tmpRate, setTmpRate] = useState(exchangeRate);
  const [dir, setDir] = useState("usd_to_iqd");
  const [amt, setAmt] = useState("");
  const [alert, setAlert] = useState(null);

  const result = dir === "usd_to_iqd" ? Number(amt || 0) * exchangeRate : Number(amt || 0) / exchangeRate;

  const addCashLog = async (desc, iqd, usd) => {
    const newLog = { id: genId(), date: today(), time: new Date().toLocaleTimeString(), desc, iqd: Number(iqd || 0), usd: Number(usd || 0) };
    await setDataField("cashLog", [...(data.cashLog || []), newLog]);
  };

  const saveRate = async () => {
    await setDataField("exchangeRate", Number(tmpRate));
  };

  const handleConvert = async () => {
    const a = Number(amt || 0);
    if (a <= 0) return;

    if (dir === "usd_to_iqd") {
      if (a > cashUSD) { setAlert(t.noBalance); return; }
      await setDataField("cashUSD", cashUSD - a);
      await setDataField("cashIQD", cashIQD + Math.round(a * exchangeRate));
      await addCashLog(`${t.convert}: $${a} → ${fmt(Math.round(a * exchangeRate))}`, Math.round(a * exchangeRate), -a);
    } else {
      if (a > cashIQD) { setAlert(t.noBalance); return; }
      await setDataField("cashIQD", cashIQD - a);
      await setDataField("cashUSD", cashUSD + Math.round(a / exchangeRate));
      await addCashLog(`${t.convert}: ${fmt(a)} → $${Math.round(a / exchangeRate)}`, -a, Math.round(a / exchangeRate));
    }
    setAmt("");
  };

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16, color: PRIMARY }}>{t.sidebar.exchange}</h1>

      <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 10, padding: 16, marginBottom: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>{t.exchangeRate}</h3>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 13 }}>1$ = </span>
          <input
            type="number"
            value={tmpRate}
            onChange={e => setTmpRate(e.target.value)}
            style={{ width: 100, padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 14 }}
          />
          <span style={{ fontSize: 13 }}>{t.iqd}</span>
          <button onClick={saveRate} style={{ padding: "6px 16px", borderRadius: 6, border: "none", background: PRIMARY, color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>{t.saveRate}</button>
        </div>
      </div>

      <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 10, padding: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>{t.convertTo}</h3>

        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <button
            onClick={() => setDir("usd_to_iqd")}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: 6,
              border: dir === "usd_to_iqd" ? "none" : `1px solid ${s.border}`,
              background: dir === "usd_to_iqd" ? PRIMARY : s.bgCard2,
              color: dir === "usd_to_iqd" ? "#fff" : s.text,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600
            }}
          >
            {t.fromUSD}
          </button>
          <button
            onClick={() => setDir("iqd_to_usd")}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: 6,
              border: dir === "iqd_to_usd" ? "none" : `1px solid ${s.border}`,
              background: dir === "iqd_to_usd" ? PRIMARY : s.bgCard2,
              color: dir === "iqd_to_usd" ? "#fff" : s.text,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600
            }}
          >
            {t.fromIQD}
          </button>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 4 }}>{t.amount}</label>
          <input
            type="number"
            value={amt}
            onChange={e => setAmt(e.target.value)}
            style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 14 }}
            placeholder={dir === "usd_to_iqd" ? "USD" : "IQD"}
          />
        </div>

        <div style={{ background: `${PRIMARY}10`, borderRadius: 8, padding: 12, marginBottom: 12, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: s.textMuted, marginBottom: 4 }}>{t.result}</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: PRIMARY, direction: "ltr" }}>
            {dir === "usd_to_iqd" ? fmt(Math.round(result)) + " " + t.iqd : "$" + fmt(Math.round(result * 100) / 100)}
          </div>
        </div>

        <button
          onClick={handleConvert}
          disabled={!amt || Number(amt) <= 0}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: 6,
            border: "none",
            background: !amt || Number(amt) <= 0 ? s.border : PRIMARY,
            color: "#fff",
            cursor: !amt || Number(amt) <= 0 ? "not-allowed" : "pointer",
            fontSize: 13,
            fontWeight: 600
          }}
        >
          {t.convert}
        </button>
      </div>

      {alert && <AlertModal message={alert} onOk={() => setAlert(null)} s={s} />}
    </div>
  );
}

// ==================== INVOICE PAGE ====================
function InvoicePage({ t, s, isRtl }) {
  const { data, setDataField } = useFirebase();
  const { invoices } = data;

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    date: today(),
    invoiceNo: "",
    currency: "iqd",
    billTo: "",
    billPhone: "",
    items: [{ name: "", qty: "", price: "", note: "" }]
  });
  const [preview, setPreview] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  const addItem = () => setForm({ ...form, items: [...form.items, { name: "", qty: "", price: "", note: "" }] });
  const removeItem = i => setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) });
  const updateItem = (i, f, v) => {
    const n = [...form.items];
    n[i] = { ...n[i], [f]: v };
    setForm({ ...form, items: n });
  };

  const total = form.items.reduce((a, b) => a + (Number(b.qty || 0) * Number(b.price || 0)), 0);

  const handleSave = async () => {
    await setDataField("invoices", [{ ...form, id: genId(), total, marked: false }, ...invoices]);
    setForm({ date: today(), invoiceNo: "", currency: "iqd", billTo: "", billPhone: "", items: [{ name: "", qty: "", price: "", note: "" }] });
    setShowForm(false);
  };

  const printInv = inv => {
    const cur = inv.currency === "usd" ? "$" : "";
    const curLabel = inv.currency === "usd" ? t.usd : t.iqd;
    const w = window.open("", "_blank");
    w.document.write(`
      <html dir="${isRtl ? "rtl" : "ltr"}">
        <head>
          <title>Invoice</title>
          <style>
            body { font-family: sans-serif; padding: 30px; max-width: 650px; margin: 0 auto; direction: ${isRtl ? "rtl" : "ltr"}; }
            .hdr { text-align: center; border-bottom: 3px solid ${PRIMARY}; padding-bottom: 12px; margin-bottom: 16px; }
            .hdr h1 { color: ${PRIMARY}; font-size: 22px; margin: 0; }
            .hdr p { color: #666; font-size: 11px; margin: 2px 0; }
            .info { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { background: ${PRIMARY}; color: #fff; padding: 8px; text-align: center; }
            td { border: 1px solid #ddd; padding: 8px; text-align: center; font-size: 11px; }
            .total { text-align: right; font-size: 16px; font-weight: bold; margin-top: 12px; color: ${PRIMARY}; }
          </style>
        </head>
        <body>
          <div class="hdr"><h1>KARO GROUP</h1><p>${PHONE} | ${EMAIL}</p></div>
          <div class="info"><div><strong>DATE:</strong> ${inv.date}</div><div><strong>INVOICE #:</strong> ${inv.invoiceNo}</div></div>
          ${inv.billTo ? `<div class="info"><div><strong>BILL TO:</strong> ${inv.billTo}</div>${inv.billPhone ? `<div><strong>Phone:</strong> ${inv.billPhone}</div>` : ""}</div>` : ""}
          <table>
            <thead>
              <tr><th>#</th><th>${t.itemName}</th><th>${t.qty}</th><th>${t.price}</th><th>${t.total}</th>${inv.items.some(i => i.note) ? `<th>${t.note}</th>` : ""}</tr>
            </thead>
            <tbody>
              ${inv.items.map((it, i) => `<tr><td>${i + 1}</td><td>${it.name}</td><td>${it.qty}</td><td>${cur}${fmt(it.price)}</td><td>${cur}${fmt(Number(it.qty || 0) * Number(it.price || 0))}</td>${inv.items.some(x => x.note) ? `<td>${it.note || ""}</td>` : ""}</tr>`).join("")}
            </tbody>
          </table>
          <div class="total">${t.total}: ${cur}${fmt(inv.total)} ${curLabel}</div>
        </body>
      </html>
    `);
    w.document.close();
    w.print();
  };

  const doDelete = async (id) => {
    await setDataField("invoices", invoices.filter(i => i.id !== id));
    setConfirmDel(null);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: PRIMARY }}>{t.sidebar.invoice}</h1>
        <button onClick={() => setShowForm(true)} style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: PRIMARY, color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
          <I.Plus /> {t.add}
        </button>
      </div>

      {showForm && (
        <div style={{ background: s.bgCard, border: `1px solid ${PRIMARY}40`, borderRadius: 10, padding: 14, marginBottom: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 8, marginBottom: 10 }}>
            <div>
              <label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 4 }}>DATE</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12 }} />
            </div>
            <div>
              <label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 4 }}>INVOICE #</label>
              <input value={form.invoiceNo} onChange={e => setForm({ ...form, invoiceNo: e.target.value })} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12 }} />
            </div>
            <div>
              <label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 4 }}>{t.currency}</label>
              <select value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12 }}>
                <option value="iqd">{t.iqd}</option>
                <option value="usd">{t.usd}</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 4 }}>BILL TO</label>
              <input value={form.billTo} onChange={e => setForm({ ...form, billTo: e.target.value })} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12 }} />
            </div>
            <div>
              <label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 4 }}>Phone</label>
              <input value={form.billPhone} onChange={e => setForm({ ...form, billPhone: e.target.value })} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12 }} />
            </div>
          </div>

          {form.items.map((item, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: 5, marginBottom: 5, alignItems: "flex-end" }}>
              <div>
                {i === 0 && <label style={{ fontSize: 10, color: s.textMuted, display: "block", marginBottom: 4 }}>{t.itemName}</label>}
                <input value={item.name} onChange={e => updateItem(i, "name", e.target.value)} style={{ width: "100%", padding: "6px 8px", borderRadius: 5, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 11 }} />
              </div>
              <div>
                {i === 0 && <label style={{ fontSize: 10, color: s.textMuted, display: "block", marginBottom: 4 }}>{t.qty}</label>}
                <input type="number" value={item.qty} onChange={e => updateItem(i, "qty", e.target.value)} style={{ width: "100%", padding: "6px 8px", borderRadius: 5, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 11 }} />
              </div>
              <div>
                {i === 0 && <label style={{ fontSize: 10, color: s.textMuted, display: "block", marginBottom: 4 }}>{t.price}</label>}
                <input type="number" value={item.price} onChange={e => updateItem(i, "price", e.target.value)} style={{ width: "100%", padding: "6px 8px", borderRadius: 5, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 11 }} />
              </div>
              <div>
                {i === 0 && <label style={{ fontSize: 10, color: s.textMuted, display: "block", marginBottom: 4 }}>{t.note}</label>}
                <input value={item.note} onChange={e => updateItem(i, "note", e.target.value)} style={{ width: "100%", padding: "6px 8px", borderRadius: 5, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 11 }} />
              </div>
              {form.items.length > 1 && (
                <button onClick={() => removeItem(i)} style={{ background: "none", border: "none", color: s.danger, cursor: "pointer", padding: 4 }}><I.Trash /></button>
              )}
            </div>
          ))}

          <button onClick={addItem} style={{ padding: "4px 10px", borderRadius: 5, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 10, cursor: "pointer", marginBottom: 8 }}>
            <I.Plus /> {t.addItem}
          </button>

          <div style={{ padding: "8px 12px", background: `${PRIMARY}10`, borderRadius: 6, textAlign: "right", marginBottom: 8 }}>
            <span style={{ fontWeight: 800, color: PRIMARY, fontSize: 15 }}>{t.total}: {form.currency === "usd" ? "$" : ""}{fmt(total)} {form.currency === "usd" ? t.usd : t.iqd}</span>
          </div>

          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={handleSave} style={{ padding: "7px 18px", borderRadius: 6, border: "none", background: PRIMARY, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{t.save}</button>
            <button onClick={() => setShowForm(false)} style={{ padding: "7px 18px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12, cursor: "pointer" }}>{t.cancel}</button>
          </div>
        </div>
      )}

      <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 10, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, tableLayout: "fixed" }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${PRIMARY}` }}>
                <TH isRtl={isRtl} style={{ width: "15%" }}>DATE</TH>
                <TH isRtl={isRtl} style={{ width: "20%" }}>INVOICE #</TH>
                <TH isRtl={isRtl} style={{ width: "25%" }}>{t.billTo}</TH>
                <TH isRtl={isRtl} style={{ width: "20%" }}>{t.total}</TH>
                <TH isRtl={isRtl} style={{ width: "20%" }}></TH>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id} style={{ borderBottom: `1px solid ${s.border}` }}>
                  <TD s={s} isRtl={isRtl}><span style={{ direction: "ltr", display: "inline-block" }}>{inv.date}</span></TD>
                  <TD s={s} isRtl={isRtl} style={{ fontWeight: 600 }}>{inv.invoiceNo}</TD>
                  <TD s={s} isRtl={isRtl}>{inv.billTo || "—"}</TD>
                  <TD s={s} isRtl={isRtl} style={{ fontWeight: 700, color: PRIMARY }}><span style={{ direction: "ltr", display: "inline-block" }}>{inv.currency === "usd" ? "$" : ""}{fmt(inv.total)} {inv.currency === "usd" ? t.usd : t.iqd}</span></TD>
                  <TD s={s} isRtl={isRtl}>
                    <div style={{ display: "flex", gap: 3, justifyContent: "center" }}>
                      <button onClick={() => printInv(inv)} style={{ background: "none", border: "none", color: PRIMARY, cursor: "pointer", padding: 2 }}><I.Printer /></button>
                      <button onClick={() => setPreview(inv)} style={{ background: "none", border: "none", color: PRIMARY, cursor: "pointer", padding: 2 }}><I.Eye /></button>
                      <button onClick={() => setConfirmDel(inv.id)} style={{ background: "none", border: "none", color: s.danger, cursor: "pointer", padding: 2 }}><I.Trash /></button>
                    </div>
                  </TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {preview && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#fff", color: "#000", borderRadius: 10, padding: 30, maxWidth: 600, width: "100%", maxHeight: "90vh", overflow: "auto" }}>
            <div style={{ textAlign: "right", borderBottom: `3px solid ${PRIMARY}`, paddingBottom: 10, marginBottom: 12 }}>
              <h2 style={{ color: PRIMARY, margin: 0, fontSize: 20 }}>KARO GROUP</h2>
              <p style={{ color: "#666", fontSize: 10, margin: "2px 0" }}>{PHONE} | {EMAIL}</p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 8 }}>
              <div><strong>DATE:</strong> {preview.date}</div>
              <div><strong>INVOICE #:</strong> {preview.invoiceNo}</div>
            </div>
            {preview.billTo && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 10 }}>
                <div><strong>BILL TO:</strong> {preview.billTo}</div>
                {preview.billPhone && <div><strong>Phone:</strong> {preview.billPhone}</div>}
              </div>
            )}
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, marginBottom: 10 }}>
              <thead>
                <tr style={{ background: PRIMARY, color: "#fff" }}>
                  <th style={{ padding: 5 }}>#</th>
                  <th style={{ padding: 5 }}>{t.itemName}</th>
                  <th style={{ padding: 5 }}>{t.qty}</th>
                  <th style={{ padding: 5 }}>{t.price}</th>
                  <th style={{ padding: 5 }}>{t.total}</th>
                </tr>
              </thead>
              <tbody>
                {preview.items.map((it, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #ddd", textAlign: "right" }}>
                    <td style={{ padding: 5 }}>{i + 1}</td>
                    <td style={{ padding: 5 }}>{it.name}</td>
                    <td style={{ padding: 5 }}>{it.qty}</td>
                    <td style={{ padding: 5 }}><span style={{ direction: "ltr", display: "inline-block" }}>{preview.currency === "usd" ? "$" : ""}{fmt(it.price)}</span></td>
                    <td style={{ padding: 5, fontWeight: 600 }}><span style={{ direction: "ltr", display: "inline-block" }}>{preview.currency === "usd" ? "$" : ""}{fmt(Number(it.qty || 0) * Number(it.price || 0))}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ textAlign: "right", fontSize: 16, fontWeight: 800, color: PRIMARY }}>
              {t.total}: {preview.currency === "usd" ? "$" : ""}{fmt(preview.total)} {preview.currency === "usd" ? t.usd : t.iqd}
            </div>
            <div style={{ textAlign: "right", marginTop: 16 }}>
              <button onClick={() => setPreview(null)} style={{ padding: "6px 20px", borderRadius: 6, border: "1px solid #ddd", background: "#f5f5f5", color: "#333", cursor: "pointer", fontSize: 12 }}>{t.cancel}</button>
            </div>
          </div>
        </div>
      )}

      {confirmDel && <ConfirmModal message={t.confirmDelete} onYes={() => doDelete(confirmDel)} onNo={() => setConfirmDel(null)} s={s} t={t} />}
    </div>
  );
}

// ==================== BACKUP PAGE ====================
function BackupPage({ t, s }) {
  const { data, setDataField } = useFirebase();

  const handleDownload = () => {
    const b = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(b);
    a.download = `karo_backup_${today()}.json`;
    a.click();
  };

  const handleUpload = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = async (ev) => {
      try {
        const d = JSON.parse(ev.target.result);
        await setDataField("cashIQD", d.cashIQD || 0);
        await setDataField("cashUSD", d.cashUSD || 0);
        await setDataField("exchangeRate", d.exchangeRate || 1500);
        await setDataField("expenses", d.expenses || []);
        await setDataField("loans", d.loans || []);
        await setDataField("concrete", d.concrete || []);
        await setDataField("contractor", d.contractor || []);
        await setDataField("invoices", d.invoices || []);
        await setDataField("cashLog", d.cashLog || []);
        await setDataField("loanPersons", d.loanPersons || []);
        await setDataField("contrPersons", d.contrPersons || []);
        alert(t.backupSuccess);
      } catch {
        alert("Error");
      }
    };
    r.readAsText(f);
    e.target.value = "";
  };

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16, color: PRIMARY }}>{t.sidebar.backup}</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <button
          onClick={handleDownload}
          style={{
            padding: "14px 24px",
            borderRadius: 10,
            border: `1px solid ${s.border}`,
            background: s.bgCard,
            color: s.text,
            cursor: "pointer",
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            gap: 10,
            justifyContent: "center"
          }}
        >
          <I.Download /> {t.downloadBackup}
        </button>

        <div style={{ padding: "14px 24px", borderRadius: 10, border: `1px solid ${s.border}`, background: s.bgCard }}>
          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", justifyContent: "center" }}>
            <I.Upload /> {t.uploadBackup}
            <input type="file" accept=".json" onChange={handleUpload} style={{ display: "none" }} />
          </label>
        </div>
      </div>
    </div>
  );
}

// ==================== HISTORY PAGE ====================
function HistoryPage({ t, s, isRtl }) {
  const { data } = useFirebase();
  const { cashLog } = data;

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  const cs = cutoff.toISOString().split("T")[0];
  const recent = (cashLog || []).filter(l => l.date >= cs);

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4, color: PRIMARY }}>{t.sidebar.history}</h1>
      <p style={{ color: s.textMuted, fontSize: 11, marginBottom: 12 }}>30 {t.date}</p>
      <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 10, overflow: "hidden" }}>
        <div style={{ overflowX: "auto", maxHeight: 450, overflowY: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, tableLayout: "fixed" }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${PRIMARY}` }}>
                <TH isRtl={isRtl} style={{ width: "15%" }}>{t.date}</TH>
                <TH isRtl={isRtl} style={{ width: "10%" }}></TH>
                <TH isRtl={isRtl} style={{ width: "40%" }}>{t.type}</TH>
                <TH isRtl={isRtl} style={{ width: "17.5%" }}>{t.iqd}</TH>
                <TH isRtl={isRtl} style={{ width: "17.5%" }}>{t.usd}</TH>
              </tr>
            </thead>
            <tbody>
              {[...recent].reverse().map(log => (
                <tr key={log.id} style={{ borderBottom: `1px solid ${s.border}` }}>
                  <TD s={s} isRtl={isRtl} style={{ fontSize: 10 }}><span style={{ direction: "ltr", display: "inline-block" }}>{log.date}</span></TD>
                  <TD s={s} isRtl={isRtl} style={{ fontSize: 9, color: s.textMuted }}>{log.time}</TD>
                  <TD s={s} isRtl={isRtl}>{log.desc}</TD>
                  <TD s={s} isRtl={isRtl} style={{ color: log.iqd >= 0 ? s.success : s.danger, fontWeight: 600 }}><span style={{ direction: "ltr", display: "inline-block" }}>{log.iqd >= 0 ? "+" : ""}{fmt(log.iqd)}</span></TD>
                  <TD s={s} isRtl={isRtl} style={{ color: log.usd >= 0 ? s.success : s.danger, fontWeight: 600 }}><span style={{ direction: "ltr", display: "inline-block" }}>{log.usd >= 0 ? "+" : ""}${fmt(log.usd)}</span></TD>
                </tr>
              ))}
            </tbody>
          </table>
          {recent.length === 0 && <div style={{ padding: 30, textAlign: "center", color: s.textMuted, fontSize: 12 }}>{t.noData}</div>}
        </div>
      </div>
    </div>
  );
}

// ==================== MONTHLY PAGE ====================
function MonthlyPage({ t, s, isRtl }) {
  const { data } = useFirebase();
  const { expenses, concrete, cashIQD, cashUSD, exchangeRate } = data;

  const [dateFrom, setDateFrom] = useState(today().slice(0, 8) + "01");
  const [dateTo, setDateTo] = useState(today());
  const [activeTab, setActiveTab] = useState("summary");
  const [sizeModal, setSizeModal] = useState(null);

  const exp = (expenses || []).filter(i => i.date >= dateFrom && i.date <= dateTo);
  const conc = (concrete || []).filter(i => i.date >= dateFrom && i.date <= dateTo);

  const tExpIQD = exp.reduce((a, b) => a + Number(b.amountIQD || 0), 0);
  const tExpUSD = exp.reduce((a, b) => a + Number(b.amountUSD || 0), 0);
  const tConcRec = conc.reduce((a, b) => a + Number(b.received || 0), 0);
  const tConcDep = conc.reduce((a, b) => a + Number(b.deposit || 0), 0);

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
    const rows = [
      [t.totalExpIQD, fmt(tExpIQD), "—"],
      [t.totalExpUSD, "—", "$" + fmt(tExpUSD)],
      [t.totalConcreteReceived, fmt(tConcRec), "—"],
      [t.totalDeposit, fmt(tConcDep), "—"],
      [t.profitLoss, fmt(profitIQD), "—"]
    ];

    if (type === "pdf") {
      doPrint({ title: `${t.sidebar.monthlyReport} ${dateFrom} - ${dateTo}`, headers: hdrs, rows, size, isRtl });
    } else {
      doExcel({ title: `monthly_${dateFrom}_${dateTo}`, headers: hdrs, rows });
    }
    setSizeModal(null);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: PRIMARY }}>{t.sidebar.monthlyReport}</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setSizeModal({ type: "pdf" })} style={{ padding: "8px 14px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard, color: s.text, cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <I.File /> PDF
          </button>
          <button onClick={() => setSizeModal({ type: "excel" })} style={{ padding: "8px 14px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard, color: s.text, cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <I.Download /> Excel
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div>
          <label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 4 }}>{t.from}</label>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12 }} />
        </div>
        <div>
          <label style={{ fontSize: 10, color: s.textMuted, fontWeight: 600, display: "block", marginBottom: 4 }}>{t.to}</label>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ padding: "6px 10px", borderRadius: 6, border: `1px solid ${s.border}`, background: s.bgCard2, color: s.text, fontSize: 12 }} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "7px 16px",
              borderRadius: 6,
              border: activeTab === tab.id ? "none" : `1px solid ${s.border}`,
              background: activeTab === tab.id ? PRIMARY : s.bgCard2,
              color: activeTab === tab.id ? "#fff" : s.text,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "summary" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
          <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 12, padding: 14, textAlign: "right", borderTop: `3px solid ${s.danger}` }}>
            <div style={{ fontSize: 10, color: s.textMuted, marginBottom: 5 }}>{t.totalExpIQD}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: s.danger }}>{fmt(tExpIQD)}</div>
          </div>
          <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 12, padding: 14, textAlign: "right", borderTop: `3px solid ${s.danger}` }}>
            <div style={{ fontSize: 10, color: s.textMuted, marginBottom: 5 }}>{t.totalExpUSD}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: s.danger }}>${fmt(tExpUSD)}</div>
          </div>
          <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 12, padding: 14, textAlign: "right", borderTop: `3px solid ${s.success}` }}>
            <div style={{ fontSize: 10, color: s.textMuted, marginBottom: 5 }}>{t.totalConcreteReceived}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: s.success }}>{fmt(tConcRec)}</div>
          </div>
          <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 12, padding: 14, textAlign: "right", borderTop: `3px solid #F59E0B` }}>
            <div style={{ fontSize: 10, color: s.textMuted, marginBottom: 5 }}>{t.totalDeposit}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#F59E0B" }}>{fmt(tConcDep)}</div>
          </div>
          <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 12, padding: 14, textAlign: "right", borderTop: `3px solid ${profitIQD >= 0 ? s.success : s.danger}` }}>
            <div style={{ fontSize: 10, color: s.textMuted, marginBottom: 5 }}>{t.profitLoss} ({t.iqd})</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: profitIQD >= 0 ? s.success : s.danger }}>
              {profitIQD >= 0 ? t.profit : t.loss}: {fmt(Math.abs(profitIQD))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "expenses" && (
        <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 10, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, tableLayout: "fixed" }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${PRIMARY}` }}>
                  <TH isRtl={isRtl} style={{ width: "20%" }}>{t.amountIQD}</TH>
                  <TH isRtl={isRtl} style={{ width: "20%" }}>{t.amountUSD}</TH>
                  <TH isRtl={isRtl} style={{ width: "20%" }}>{t.receiptNo}</TH>
                  <TH isRtl={isRtl} style={{ width: "25%" }}>{t.note}</TH>
                  <TH isRtl={isRtl} style={{ width: "15%" }}>{t.date}</TH>
                </tr>
              </thead>
              <tbody>
                {exp.map(item => (
                  <tr key={item.id} style={{ borderBottom: `1px solid ${s.border}` }}>
                    <TD s={s} isRtl={isRtl} style={{ fontWeight: 600 }}>{Number(item.amountIQD) ? <span style={{ direction: "ltr", display: "inline-block" }}>{fmt(item.amountIQD)}</span> : "—"}</TD>
                    <TD s={s} isRtl={isRtl}>{Number(item.amountUSD) ? <span style={{ direction: "ltr", display: "inline-block" }}>${fmt(item.amountUSD)}</span> : "—"}</TD>
                    <TD s={s} isRtl={isRtl}>{item.receiptNo || "—"}</TD>
                    <TD s={s} isRtl={isRtl} style={{ color: s.textMuted }}>{item.note || "—"}</TD>
                    <TD s={s} isRtl={isRtl}><span style={{ direction: "ltr", display: "inline-block" }}>{item.date}</span></TD>
                  </tr>
                ))}
              </tbody>
            </table>
            {exp.length === 0 && <div style={{ padding: 30, textAlign: "center", color: s.textMuted, fontSize: 12 }}>{t.noData}</div>}
          </div>
        </div>
      )}

      {activeTab === "concrete" && (
        <div style={{ background: s.bgCard, border: `1px solid ${s.border}`, borderRadius: 10, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, tableLayout: "fixed" }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${PRIMARY}` }}>
                  <TH isRtl={isRtl} style={{ width: "15%" }}>{t.date}</TH>
                  <TH isRtl={isRtl} style={{ width: "15%" }}>{t.meters}</TH>
                  <TH isRtl={isRtl} style={{ width: "15%" }}>{t.pricePerMeter}</TH>
                  <TH isRtl={isRtl} style={{ width: "20%" }}>{t.totalConcrete}</TH>
                  <TH isRtl={isRtl} style={{ width: "17.5%" }}>{t.deposit}</TH>
                  <TH isRtl={isRtl} style={{ width: "17.5%" }}>{t.received}</TH>
                </tr>
              </thead>
              <tbody>
                {conc.map(item => (
                  <tr key={item.id} style={{ borderBottom: `1px solid ${s.border}` }}>
                    <TD s={s} isRtl={isRtl}><span style={{ direction: "ltr", display: "inline-block" }}>{item.date}</span></TD>
                    <TD s={s} isRtl={isRtl}><span style={{ direction: "ltr", display: "inline-block" }}>{fmt(item.meters)}</span></TD>
                    <TD s={s} isRtl={isRtl}><span style={{ direction: "ltr", display: "inline-block" }}>{fmt(item.pricePerMeter)}</span></TD>
                    <TD s={s} isRtl={isRtl} style={{ fontWeight: 700, color: PRIMARY }}><span style={{ direction: "ltr", display: "inline-block" }}>{fmt(item.totalPrice)}</span></TD>
                    <TD s={s} isRtl={isRtl} style={{ color: "#D97706" }}><span style={{ direction: "ltr", display: "inline-block" }}>{fmt(item.deposit)}</span></TD>
                    <TD s={s} isRtl={isRtl} style={{ color: s.success, fontWeight: 700 }}><span style={{ direction: "ltr", display: "inline-block" }}>{fmt(item.received)}</span></TD>
                  </tr>
                ))}
              </tbody>
            </table>
            {conc.length === 0 && <div style={{ padding: 30, textAlign: "center", color: s.textMuted, fontSize: 12 }}>{t.noData}</div>}
          </div>
        </div>
      )}

      {sizeModal && <SizeModal t={t} s={s} onSelect={sz => doExport(sizeModal.type, sz)} onClose={() => setSizeModal(null)} />}
    </div>
  );
}

// Export all
export {
  CashPage,
  ExchangePage,
  InvoicePage,
  BackupPage,
  HistoryPage,
  MonthlyPage
};
// ==================== PART 6: MAIN APP COMPONENT ====================

import { useState, useEffect, useRef } from "react";
import {
  FirebaseProvider,
  useFirebase,
  PRIMARY,
  USERS,
  FONTS,
  T,
  getS
} from "./Part1";

import {
  LandingPage,
  LoginPage,
  Dashboard
} from "./Part2";

import {
  ReportsPage,
  ExpensesPage
} from "./Part3";

import {
  LoansPage,
  ConcretePage,
  ContractorPage
} from "./Part4";

import {
  CashPage,
  ExchangePage,
  InvoicePage,
  BackupPage,
  HistoryPage,
  MonthlyPage
} from "./Part5";

// ==================== MAIN APP ====================
function AppContent() {
  const [lang, setLang] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("karo_lang") || "ku";
    }
    return "ku";
  });
  
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("karo_dark") === "true";
    }
    return false;
  });
  
  const [page, setPage] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("karo_page") || "landing";
    }
    return "landing";
  });
  
  const [dashPage, setDashPage] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("karo_dashPage") || "reports";
    }
    return "reports";
  });
  
  const [fontIdx, setFontIdx] = useState(() => {
    if (typeof window !== "undefined") {
      return Number(localStorage.getItem("karo_font")) || 0;
    }
    return 0;
  });
  
  const [loggedUser, setLoggedUser] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("karo_user");
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });
  
  const [logoClicks, setLogoClicks] = useState(0);
  const logoTimer = useRef(null);

  const t = T[lang];
  const isRtl = lang !== "en";
  const s = getS(dark);
  const fontFamily = FONTS[fontIdx]?.value || FONTS[0].value;

  // Save preferences
  useEffect(() => { localStorage.setItem("karo_lang", lang); }, [lang]);
  useEffect(() => { localStorage.setItem("karo_dark", dark); }, [dark]);
  useEffect(() => { localStorage.setItem("karo_page", page); }, [page]);
  useEffect(() => { localStorage.setItem("karo_dashPage", dashPage); }, [dashPage]);
  useEffect(() => { localStorage.setItem("karo_font", fontIdx); }, [fontIdx]);
  useEffect(() => { 
    if (loggedUser) {
      localStorage.setItem("karo_user", JSON.stringify(loggedUser));
    }
  }, [loggedUser]);

  // Logo triple-click handler
  const handleLogoClick = () => {
    const n = logoClicks + 1;
    setLogoClicks(n);
    clearTimeout(logoTimer.current);
    
    if (n >= 3) {
      setLogoClicks(0);
      setPage(loggedUser ? "dashboard" : "login");
    } else {
      logoTimer.current = setTimeout(() => setLogoClicks(0), 2000);
    }
  };

  // Login handler
  const handleLogin = (u, p) => {
    const user = USERS.find(x => x.username === u && x.password === p);
    if (user) {
      setLoggedUser(user);
      setPage("dashboard");
      setDashPage("reports");
      return true;
    }
    return false;
  };

  // Logout handler
  const handleLogout = () => {
    setLoggedUser(null);
    setPage("landing");
    localStorage.removeItem("karo_user");
    localStorage.setItem("karo_page", "landing");
  };

  // Render page content
  const renderDashboardContent = () => {
    switch (dashPage) {
      case "reports":
        return <ReportsPage t={t} s={s} isRtl={isRtl} />;
      case "expenses":
        return <ExpensesPage t={t} s={s} isRtl={isRtl} />;
      case "loans":
        return <LoansPage t={t} s={s} isRtl={isRtl} />;
      case "concrete":
        return <ConcretePage t={t} s={s} isRtl={isRtl} />;
      case "contractor":
        return <ContractorPage t={t} s={s} isRtl={isRtl} />;
      case "cash":
        return <CashPage t={t} s={s} isRtl={isRtl} />;
      case "exchange":
        return <ExchangePage t={t} s={s} isRtl={isRtl} />;
      case "invoice":
        return <InvoicePage t={t} s={s} isRtl={isRtl} />;
      case "backup":
        return <BackupPage t={t} s={s} />;
      case "history":
        return <HistoryPage t={t} s={s} isRtl={isRtl} />;
      case "monthly":
        return <MonthlyPage t={t} s={s} isRtl={isRtl} />;
      default:
        return <ReportsPage t={t} s={s} isRtl={isRtl} />;
    }
  };

  // Main render
  if (page === "login") {
    return (
      <LoginPage
        t={t}
        s={s}
        isRtl={isRtl}
        fontFamily={fontFamily}
        onLogin={handleLogin}
        onBack={() => setPage("landing")}
      />
    );
  }

  if (page === "dashboard" && loggedUser) {
    return (
      <FirebaseProvider user={loggedUser}>
        <Dashboard
          t={t}
          s={s}
          isRtl={isRtl}
          dark={dark}
          lang={lang}
          fontFamily={fontFamily}
          user={loggedUser}
          dashPage={dashPage}
          setDashPage={setDashPage}
          onLogout={handleLogout}
          setDark={setDark}
          setLang={setLang}
          fontIdx={fontIdx}
          setFontIdx={setFontIdx}
        >
          {renderDashboardContent()}
        </Dashboard>
      </FirebaseProvider>
    );
  }

  // Landing page
  return (
    <LandingPage
      t={t}
      s={s}
      isRtl={isRtl}
      dark={dark}
      lang={lang}
      fontFamily={fontFamily}
      setLang={setLang}
      setDark={setDark}
      onLogoClick={handleLogoClick}
    />
  );
}

// ==================== ROOT APP ====================
function App() {
  return <AppContent />;
}

export default App;
