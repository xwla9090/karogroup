import { useState, useEffect, useCallback, useMemo } from “react”;

// ─── Constants ───
const STORAGE_KEY = “ft-accounting-v2”;
const DOLLAR_RATE_KEY = “ft-dollar-rate”;
const BRAND = “Karo Group”;

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
const today = () => new Date().toISOString().split(“T”)[0];

const fmtIQD = (n) => new Intl.NumberFormat(“en-US”).format(Math.round(n || 0));
const fmtUSD = (n) => new Intl.NumberFormat(“en-US”, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n || 0);

// ─── Storage (localStorage) ───
function loadStore() {
try {
const r = localStorage.getItem(STORAGE_KEY);
if (r) return JSON.parse(r);
} catch (e) { console.log(“Fresh start”); }
return { expenses: [], debts: [], slabs: [], contractor: [], invoices: [], cashIQD: 0, cashUSD: 0 };
}
function saveStore(data) {
try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); return true; } catch { return false; }
}
function loadRate() {
try {
const r = localStorage.getItem(DOLLAR_RATE_KEY);
if (r) return JSON.parse(r);
} catch {}
return { rate: 1500, date: today() };
}
function saveRateStorage(rate) {
try { localStorage.setItem(DOLLAR_RATE_KEY, JSON.stringify(rate)); } catch {}
}

// ─── Print helper ───
function printContent(htmlContent, title = “Print”) {
const w = window.open(””, “_blank”, “width=800,height=600”);
if (!w) return;
w.document.write(`<!DOCTYPE html><html dir="rtl"><head><meta charset="utf-8"><title>${title}</title>

<style>
@page{size:A4;margin:15mm}
*{box-sizing:border-box;font-family:'Segoe UI',Tahoma,sans-serif}
body{margin:0;padding:20px;font-size:12px;color:#1a1a1a;direction:rtl}
table{width:100%;border-collapse:collapse;margin:10px 0}
th,td{border:1px solid #ccc;padding:6px 10px;text-align:right;font-size:11px}
th{background:#f0f0f0;font-weight:700}
.header{text-align:center;margin-bottom:20px;border-bottom:2px solid #333;padding-bottom:15px}
.header h1{margin:0;font-size:22px;letter-spacing:1px}
.total-row{font-weight:700;background:#f8f8f8}
.meta{display:flex;justify-content:space-between;margin:10px 0;font-size:12px}
@media print{body{padding:0}}
</style></head><body>${htmlContent}</body></html>`);

w.document.close();
setTimeout(() => { w.print(); }, 300);
}

// ─── Theme ───
const T = {
bg: “#0c1117”,
card: “rgba(22,27,34,0.95)”,
border: “rgba(48,54,61,0.8)”,
text: “#e6edf3”,
textDim: “#7d8590”,
accent: “#e8983e”,
red: “#f85149”,
green: “#3fb950”,
blue: “#58a6ff”,
purple: “#bc8cff”,
input: “rgba(13,17,23,0.8)”,
inputBorder: “rgba(48,54,61,0.6)”,
};

const globalCSS = `@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap'); *{box-sizing:border-box;margin:0;padding:0} :root{color-scheme:dark} html,body,#root{height:100%;width:100%} body{background:${T.bg};color:${T.text};font-family:'IBM Plex Sans Arabic',sans-serif} ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:${T.border};border-radius:3px} input,select,textarea{font-family:inherit} input:focus,select:focus,textarea:focus{outline:none;border-color:${T.accent}!important;box-shadow:0 0 0 2px rgba(232,152,62,0.15)} button{font-family:inherit;cursor:pointer;transition:all .15s} button:hover{opacity:.88} tr:hover td{background:rgba(48,54,61,0.2)} @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}} @keyframes spin{to{transform:rotate(360deg)}} .animate-in{animation:fadeIn .25s ease}`;

// ─── Shared Components ───
const Input = ({ label, required, style: extraStyle, …props }) => (

  <div style={{ marginBottom: 12 }}>
    {label && <label style={{ display: "block", fontSize: 11, color: T.textDim, marginBottom: 4, fontWeight: 600 }}>{label}{required && " *"}</label>}
    <input {...props} style={{
      width: "100%", padding: "9px 12px", background: T.input, border: `1px solid ${T.inputBorder}`,
      borderRadius: 8, color: T.text, fontSize: 13, direction: props.type === "date" || props.type === "number" ? "ltr" : "rtl",
      textAlign: props.type === "date" || props.type === "number" ? "left" : "right", ...extraStyle
    }} />
  </div>
);

const Select = ({ label, options, …props }) => (

  <div style={{ marginBottom: 12 }}>
    {label && <label style={{ display: "block", fontSize: 11, color: T.textDim, marginBottom: 4, fontWeight: 600 }}>{label}</label>}
    <select {...props} style={{
      width: "100%", padding: "9px 12px", background: T.input, border: `1px solid ${T.inputBorder}`,
      borderRadius: 8, color: T.text, fontSize: 13, direction: "rtl"
    }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const Btn = ({ variant = “primary”, children, style: extraStyle, …props }) => {
const vs = {
primary: { background: `linear-gradient(135deg,${T.accent},#d4782e)`, color: “#fff”, fontWeight: 700, border: “none” },
danger: { background: “rgba(248,81,73,0.12)”, color: T.red, border: `1px solid rgba(248,81,73,0.25)` },
ghost: { background: “rgba(125,133,144,0.1)”, color: T.textDim, border: `1px solid ${T.inputBorder}` },
success: { background: `linear-gradient(135deg,${T.green},#2ea043)`, color: “#fff”, fontWeight: 700, border: “none” },
blue: { background: `linear-gradient(135deg,${T.blue},#388bfd)`, color: “#fff”, fontWeight: 700, border: “none” },
};
return <button {…props} style={{ …vs[variant], borderRadius: 8, padding: “8px 16px”, fontSize: 12, display: “inline-flex”, alignItems: “center”, gap: 6, …extraStyle }}>{children}</button>;
};

const Card = ({ children, style }) => (

  <div className="animate-in" style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 18, marginBottom: 14, ...style }}>{children}</div>
);

const Modal = ({ show, onClose, title, children, wide }) => {
if (!show) return null;
return (
<div style={{ position: “fixed”, inset: 0, background: “rgba(0,0,0,0.6)”, display: “flex”, alignItems: “center”, justifyContent: “center”, zIndex: 999, backdropFilter: “blur(4px)” }} onClick={onClose}>
<div className=“animate-in” onClick={e => e.stopPropagation()} style={{
background: “#161b22”, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24,
width: “92%”, maxWidth: wide ? 700 : 480, maxHeight: “88vh”, overflowY: “auto”, direction: “rtl”
}}>
<div style={{ fontSize: 17, fontWeight: 700, marginBottom: 18, color: T.text }}>{title}</div>
{children}
</div>
</div>
);
};

const Row = ({ children }) => <div style={{ display: “grid”, gridTemplateColumns: “1fr 1fr”, gap: 12 }}>{children}</div>;

const StatCard = ({ label, value, color, sub }) => (

  <div style={{ background: `${color}08`, border: `1px solid ${color}25`, borderRadius: 12, padding: "16px 18px", flex: 1, minWidth: 140 }}>
    <div style={{ fontSize: 24, fontWeight: 800, color, letterSpacing: -0.5 }}>{value}</div>
    <div style={{ fontSize: 11, color: T.textDim, marginTop: 3 }}>{label}</div>
    {sub && <div style={{ fontSize: 10, color: T.textDim, marginTop: 2 }}>{sub}</div>}
  </div>
);

const Empty = ({ icon, text }) => (

  <div style={{ textAlign: "center", padding: "40px 20px", color: T.textDim }}>
    <div style={{ fontSize: 36, marginBottom: 10 }}>{icon}</div>
    <div style={{ fontSize: 14, fontWeight: 500 }}>{text}</div>
  </div>
);

const Badge = ({ color, children }) => (
<span style={{ background: `${color}18`, color, padding: “2px 10px”, borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{children}</span>
);

const Th = ({ children, style }) => (

  <th style={{ textAlign: "right", padding: "10px 12px", fontSize: 10, color: T.textDim, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: `1px solid ${T.border}`, whiteSpace: "nowrap", ...style }}>{children}</th>
);
const Td = ({ children, style }) => (
  <td style={{ padding: "10px 12px", borderBottom: `1px solid rgba(48,54,61,0.3)`, fontSize: 12, ...style }}>{children}</td>
);

function ImageViewer({ src, onClose }) {
if (!src) return null;
return (
<div style={{ position: “fixed”, inset: 0, background: “rgba(0,0,0,0.85)”, display: “flex”, alignItems: “center”, justifyContent: “center”, zIndex: 1000, cursor: “pointer” }} onClick={onClose}>
<img src={src} style={{ maxWidth: “90%”, maxHeight: “90%”, borderRadius: 8, boxShadow: “0 20px 60px rgba(0,0,0,0.5)” }} alt=”” />
</div>
);
}

const getMonths = (items) => {
const set = new Set();
items.forEach(i => { if (i.date) set.add(i.date.substring(0, 7)); });
return […set].sort().reverse();
};

// ─── EXPENSES PAGE ───
function ExpensesPage({ data, onSave }) {
const [showModal, setShowModal] = useState(false);
const [editItem, setEditItem] = useState(null);
const [search, setSearch] = useState(””);
const [monthFilter, setMonthFilter] = useState(””);
const [markedIds, setMarkedIds] = useState(new Set());
const [viewImg, setViewImg] = useState(null);
const [form, setForm] = useState({ date: today(), receiptNo: “”, receiptImg: “”, amountIQD: “”, amountUSD: “”, note: “” });

const months = useMemo(() => getMonths(data.expenses), [data.expenses]);
const filtered = useMemo(() => {
let items = […data.expenses].sort((a, b) => (b.date || “”).localeCompare(a.date || “”));
if (monthFilter) items = items.filter(e => e.date?.startsWith(monthFilter));
if (search) {
const s = search.toLowerCase();
items = items.filter(e => (e.receiptNo || “”).toLowerCase().includes(s) || (e.note || “”).toLowerCase().includes(s) || String(e.amountIQD || “”).includes(s) || String(e.amountUSD || “”).includes(s));
}
return items;
}, [data.expenses, monthFilter, search]);

const totalIQD = filtered.reduce((s, e) => s + (Number(e.amountIQD) || 0), 0);
const totalUSD = filtered.reduce((s, e) => s + (Number(e.amountUSD) || 0), 0);

const openAdd = () => { setEditItem(null); setForm({ date: today(), receiptNo: “”, receiptImg: “”, amountIQD: “”, amountUSD: “”, note: “” }); setShowModal(true); };
const openEdit = (e) => { setEditItem(e); setForm({ date: e.date, receiptNo: e.receiptNo || “”, receiptImg: e.receiptImg || “”, amountIQD: e.amountIQD || “”, amountUSD: e.amountUSD || “”, note: e.note || “” }); setShowModal(true); };

const handleSave = () => {
if (!form.amountIQD && !form.amountUSD) return;
const entry = { …form, amountIQD: Number(form.amountIQD) || 0, amountUSD: Number(form.amountUSD) || 0 };
if (editItem) {
onSave({ …data, expenses: data.expenses.map(e => e.id === editItem.id ? { …e, …entry } : e) });
} else {
onSave({ …data, expenses: […data.expenses, { id: generateId(), …entry }] });
}
setShowModal(false);
};

const handleDelete = (id) => onSave({ …data, expenses: data.expenses.filter(e => e.id !== id) });
const toggleMark = (id) => { const s = new Set(markedIds); s.has(id) ? s.delete(id) : s.add(id); setMarkedIds(s); };

const handleImageUpload = (e) => {
const file = e.target.files?.[0];
if (!file) return;
const reader = new FileReader();
reader.onload = (ev) => setForm(f => ({ …f, receiptImg: ev.target.result }));
reader.readAsDataURL(file);
};

const generatePrintHTML = () => {
const rows = filtered.map(e => `<tr${markedIds.has(e.id) ? ' style="background:#fff3cd"' : ""}><td>${e.date || ""}</td><td>${e.receiptNo || ""}</td><td style="text-align:left">${fmtIQD(e.amountIQD)}</td><td style="text-align:left">${fmtUSD(e.amountUSD)}</td><td>${e.note || ""}</td></tr>`).join(””);
return `<div class="header"><h1>${BRAND}</h1><p>کشفی خەرجییەکان</p></div><div class="meta"><span>بەروار: ${today()}</span><span>${monthFilter ? "مانگ: " + monthFilter : "هەموو"}</span></div><table><thead><tr><th>بەروار</th><th>ژ.وەسڵ</th><th>دینار</th><th>دۆلار</th><th>تێبینی</th></tr></thead><tbody>${rows}</tbody><tfoot><tr class="total-row"><td colspan="2">کۆی گشتی</td><td style="text-align:left">${fmtIQD(totalIQD)}</td><td style="text-align:left">$${fmtUSD(totalUSD)}</td><td></td></tr></tfoot></table>`;
};

return (
<div>
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “center”, marginBottom: 20, flexWrap: “wrap”, gap: 10 }}>
<h2 style={{ fontSize: 22, fontWeight: 800 }}>خەرجییەکان (مەسارف)</h2>
<div style={{ display: “flex”, gap: 8, flexWrap: “wrap” }}>
<Btn variant=“ghost” onClick={() => printContent(generatePrintHTML(), “Expenses”)}>🖨️ پرینت</Btn>
<Btn onClick={openAdd}>+ خەرجی نوێ</Btn>
</div>
</div>
<Card style={{ display: “flex”, gap: 12, alignItems: “center”, flexWrap: “wrap”, padding: 14 }}>
<input placeholder=“گەڕان…” value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, minWidth: 150, padding: “8px 12px”, background: T.input, border: `1px solid ${T.inputBorder}`, borderRadius: 8, color: T.text, fontSize: 13, direction: “rtl” }} />
<select value={monthFilter} onChange={e => setMonthFilter(e.target.value)} style={{ padding: “8px 12px”, background: T.input, border: `1px solid ${T.inputBorder}`, borderRadius: 8, color: T.text, fontSize: 13, direction: “rtl”, minWidth: 140 }}>
<option value="">هەموو مانگەکان</option>
{months.map(m => <option key={m} value={m}>{m}</option>)}
</select>
</Card>
<div style={{ display: “flex”, gap: 12, marginBottom: 14 }}>
<StatCard label=“کۆی دینار” value={fmtIQD(totalIQD)} color={T.red} sub={`${filtered.length} تۆمار`} />
<StatCard label=“کۆی دۆلار” value={`$${fmtUSD(totalUSD)}`} color={T.blue} />
</div>
{filtered.length === 0 ? <Card><Empty icon="📋" text="هیچ خەرجییەک نییە" /></Card> : (
<Card style={{ overflowX: “auto”, padding: 0 }}>
<table style={{ width: “100%”, borderCollapse: “collapse” }}>
<thead><tr><Th style={{ width: 30 }}>✓</Th><Th>بەروار</Th><Th>ژ.وەسڵ</Th><Th>وێنە</Th><Th>دینار</Th><Th>دۆلار</Th><Th>تێبینی</Th><Th>کردار</Th></tr></thead>
<tbody>
{filtered.map(e => (
<tr key={e.id} style={{ background: markedIds.has(e.id) ? “rgba(232,152,62,0.08)” : “transparent” }}>
<Td><input type=“checkbox” checked={markedIds.has(e.id)} onChange={() => toggleMark(e.id)} style={{ accentColor: T.accent }} /></Td>
<Td style={{ fontSize: 11, color: T.textDim, direction: “ltr”, textAlign: “right” }}>{e.date}</Td>
<Td>{e.receiptNo || “—”}</Td>
<Td>{e.receiptImg ? (<div onClick={() => setViewImg(e.receiptImg)} style={{ width: 32, height: 32, borderRadius: 6, overflow: “hidden”, cursor: “pointer”, border: `1px solid ${T.border}` }}><img src={e.receiptImg} style={{ width: “100%”, height: “100%”, objectFit: “cover” }} alt=”” /></div>) : <span style={{ color: T.textDim }}>—</span>}</Td>
<Td style={{ color: T.red, fontWeight: 700, direction: “ltr”, textAlign: “right” }}>{e.amountIQD ? fmtIQD(e.amountIQD) : “—”}</Td>
<Td style={{ color: T.blue, fontWeight: 700, direction: “ltr”, textAlign: “right” }}>{e.amountUSD ? `$${fmtUSD(e.amountUSD)}` : “—”}</Td>
<Td style={{ maxWidth: 160, overflow: “hidden”, textOverflow: “ellipsis”, whiteSpace: “nowrap” }}>{e.note || “—”}</Td>
<Td><div style={{ display: “flex”, gap: 4 }}><Btn variant=“ghost” style={{ padding: “4px 8px” }} onClick={() => openEdit(e)}>✏️</Btn><Btn variant=“danger” style={{ padding: “4px 8px” }} onClick={() => handleDelete(e.id)}>🗑</Btn></div></Td>
</tr>
))}
</tbody>
</table>
</Card>
)}
<ImageViewer src={viewImg} onClose={() => setViewImg(null)} />
<Modal show={showModal} onClose={() => setShowModal(false)} title={editItem ? “دەستکاری خەرجی” : “خەرجی نوێ”}>
<Row><Input label=“بەروار” type=“date” value={form.date} onChange={e => setForm({ …form, date: e.target.value })} /><Input label=“ژمارەی وەسڵ” value={form.receiptNo} onChange={e => setForm({ …form, receiptNo: e.target.value })} placeholder=“001” /></Row>
<div style={{ marginBottom: 12 }}>
<label style={{ display: “block”, fontSize: 11, color: T.textDim, marginBottom: 4, fontWeight: 600 }}>وێنەی وەسڵ</label>
<input type=“file” accept=“image/*” onChange={handleImageUpload} style={{ width: “100%”, padding: 8, background: T.input, border: `1px solid ${T.inputBorder}`, borderRadius: 8, color: T.text, fontSize: 12 }} />
{form.receiptImg && <img src={form.receiptImg} style={{ width: 60, height: 60, objectFit: “cover”, borderRadius: 6, marginTop: 6, border: `1px solid ${T.border}` }} alt=”” />}
</div>
<Row><Input label=“بڕی پارە (دینار)” type=“number” value={form.amountIQD} onChange={e => setForm({ …form, amountIQD: e.target.value })} placeholder=“0” /><Input label=“بڕی پارە (دۆلار)” type=“number” value={form.amountUSD} onChange={e => setForm({ …form, amountUSD: e.target.value })} placeholder=“0.00” /></Row>
<Input label=“تێبینی” value={form.note} onChange={e => setForm({ …form, note: e.target.value })} placeholder=“تێبینی…” />
<div style={{ display: “flex”, gap: 10, marginTop: 16 }}><Btn onClick={handleSave}>✓ پاشەکەوت</Btn><Btn variant=“ghost” onClick={() => setShowModal(false)}>پاشگەزبوونەوە</Btn></div>
</Modal>
</div>
);
}

// ─── DEBTS PAGE ───
function DebtsPage({ data, onSave }) {
const [showModal, setShowModal] = useState(false);
const [form, setForm] = useState({ date: today(), type: “borrow”, person: “”, amountIQD: “”, amountUSD: “”, note: “” });
const sorted = useMemo(() => […data.debts].sort((a, b) => (b.date || “”).localeCompare(a.date || “”)), [data.debts]);
const totalBorrowIQD = sorted.filter(d => d.type === “borrow”).reduce((s, d) => s + (Number(d.amountIQD) || 0), 0);
const totalBorrowUSD = sorted.filter(d => d.type === “borrow”).reduce((s, d) => s + (Number(d.amountUSD) || 0), 0);
const totalLendIQD = sorted.filter(d => d.type === “lend”).reduce((s, d) => s + (Number(d.amountIQD) || 0), 0);
const totalLendUSD = sorted.filter(d => d.type === “lend”).reduce((s, d) => s + (Number(d.amountUSD) || 0), 0);
const handleSave = () => { if (!form.person) return; onSave({ …data, debts: […data.debts, { id: generateId(), …form, amountIQD: Number(form.amountIQD) || 0, amountUSD: Number(form.amountUSD) || 0 }] }); setShowModal(false); };
const handleDelete = (id) => onSave({ …data, debts: data.debts.filter(d => d.id !== id) });
return (
<div>
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “center”, marginBottom: 20 }}><h2 style={{ fontSize: 22, fontWeight: 800 }}>قەرزەکان</h2><Btn onClick={() => { setForm({ date: today(), type: “borrow”, person: “”, amountIQD: “”, amountUSD: “”, note: “” }); setShowModal(true); }}>+ قەرزی نوێ</Btn></div>
<div style={{ display: “flex”, gap: 12, marginBottom: 14, flexWrap: “wrap” }}><StatCard label="قەرزی وەرگرتوو (دینار)" value={fmtIQD(totalBorrowIQD)} color={T.red} /><StatCard label=“قەرزی وەرگرتوو ($)” value={`$${fmtUSD(totalBorrowUSD)}`} color={T.red} /><StatCard label="قەرزی دراو (دینار)" value={fmtIQD(totalLendIQD)} color={T.green} /><StatCard label=“قەرزی دراو ($)” value={`$${fmtUSD(totalLendUSD)}`} color={T.green} /></div>
<Card style={{ overflowX: “auto”, padding: 0 }}>
<table style={{ width: “100%”, borderCollapse: “collapse” }}>
<thead><tr><Th>بەروار</Th><Th>جۆر</Th><Th>کەس</Th><Th>دینار</Th><Th>دۆلار</Th><Th>تێبینی</Th><Th>کردار</Th></tr></thead>
<tbody>{sorted.length === 0 ? <tr><td colSpan={7}><Empty icon="🤝" text="هیچ قەرزێک نییە" /></td></tr> : sorted.map(d => (<tr key={d.id}><Td style={{ fontSize: 11, color: T.textDim }}>{d.date}</Td><Td><Badge color={d.type === “borrow” ? T.red : T.green}>{d.type === “borrow” ? “وەرگرتن” : “دان”}</Badge></Td><Td style={{ fontWeight: 600 }}>{d.person}</Td><Td style={{ direction: “ltr”, textAlign: “right”, fontWeight: 700 }}>{d.amountIQD ? fmtIQD(d.amountIQD) : “—”}</Td><Td style={{ direction: “ltr”, textAlign: “right”, fontWeight: 700 }}>{d.amountUSD ? `$${fmtUSD(d.amountUSD)}` : “—”}</Td><Td>{d.note || “—”}</Td><Td><Btn variant=“danger” style={{ padding: “4px 8px” }} onClick={() => handleDelete(d.id)}>🗑</Btn></Td></tr>))}</tbody>
</table>
</Card>
<Modal show={showModal} onClose={() => setShowModal(false)} title=“قەرزی نوێ”>
<Row><Input label=“بەروار” type=“date” value={form.date} onChange={e => setForm({ …form, date: e.target.value })} /><Select label=“جۆر” value={form.type} onChange={e => setForm({ …form, type: e.target.value })} options={[{ value: “borrow”, label: “قەرز وەرگرتن” }, { value: “lend”, label: “قەرز دان” }]} /></Row>
<Input label=“ناوی کەس” required value={form.person} onChange={e => setForm({ …form, person: e.target.value })} placeholder=“ناو” />
<Row><Input label=“دینار” type=“number” value={form.amountIQD} onChange={e => setForm({ …form, amountIQD: e.target.value })} placeholder=“0” /><Input label=“دۆلار” type=“number” value={form.amountUSD} onChange={e => setForm({ …form, amountUSD: e.target.value })} placeholder=“0” /></Row>
<Input label=“تێبینی” value={form.note} onChange={e => setForm({ …form, note: e.target.value })} placeholder=“تێبینی…” />
<div style={{ display: “flex”, gap: 10, marginTop: 16 }}><Btn onClick={handleSave}>✓ پاشەکەوت</Btn><Btn variant=“ghost” onClick={() => setShowModal(false)}>پاشگەزبوونەوە</Btn></div>
</Modal>
</div>
);
}

// ─── SLABS PAGE ───
function SlabsPage({ data, onSave }) {
const [showModal, setShowModal] = useState(false);
const [form, setForm] = useState({ date: today(), meters: “”, pricePerMeter: “”, deposit: “”, note: “” });
const sorted = useMemo(() => […data.slabs].sort((a, b) => (b.date || “”).localeCompare(a.date || “”)), [data.slabs]);
const calcTotal = (m, p) => (Number(m) || 0) * (Number(p) || 0);
const handleSave = () => { const total = calcTotal(form.meters, form.pricePerMeter); onSave({ …data, slabs: […data.slabs, { id: generateId(), …form, meters: Number(form.meters) || 0, pricePerMeter: Number(form.pricePerMeter) || 0, totalPrice: total, deposit: Number(form.deposit) || 0, netReceive: total - (Number(form.deposit) || 0) }] }); setShowModal(false); };
const handleDelete = (id) => onSave({ …data, slabs: data.slabs.filter(s => s.id !== id) });
const totalMeters = sorted.reduce((s, sl) => s + (Number(sl.meters) || 0), 0);
const totalAmount = sorted.reduce((s, sl) => s + (Number(sl.totalPrice) || 0), 0);
const totalDeposit = sorted.reduce((s, sl) => s + (Number(sl.deposit) || 0), 0);
const totalNet = sorted.reduce((s, sl) => s + (Number(sl.netReceive) || 0), 0);
return (
<div>
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “center”, marginBottom: 20 }}><h2 style={{ fontSize: 22, fontWeight: 800 }}>سلفەکان (کۆنکریت)</h2><Btn onClick={() => { setForm({ date: today(), meters: “”, pricePerMeter: “”, deposit: “”, note: “” }); setShowModal(true); }}>+ سلفەی نوێ</Btn></div>
<div style={{ display: “flex”, gap: 12, marginBottom: 14, flexWrap: “wrap” }}><StatCard label="کۆی مەتر" value={fmtIQD(totalMeters)} color={T.accent} /><StatCard label="کۆی پارە" value={fmtIQD(totalAmount)} color={T.blue} /><StatCard label="کۆی تەئمین" value={fmtIQD(totalDeposit)} color={T.red} /><StatCard label="کۆی وەرگرتن" value={fmtIQD(totalNet)} color={T.green} /></div>
<Card style={{ overflowX: “auto”, padding: 0 }}>
<table style={{ width: “100%”, borderCollapse: “collapse” }}>
<thead><tr><Th>بەروار</Th><Th>مەتر</Th><Th>نرخ/مەتر</Th><Th>کۆی پارە</Th><Th>تەئمین</Th><Th>وەرگرتن</Th><Th>تێبینی</Th><Th>کردار</Th></tr></thead>
<tbody>{sorted.length === 0 ? <tr><td colSpan={8}><Empty icon="🏗️" text="هیچ سلفەیەک نییە" /></td></tr> : sorted.map(s => (<tr key={s.id}><Td style={{ fontSize: 11, color: T.textDim }}>{s.date}</Td><Td style={{ fontWeight: 700 }}>{fmtIQD(s.meters)}</Td><Td>{fmtIQD(s.pricePerMeter)}</Td><Td style={{ fontWeight: 700, color: T.blue }}>{fmtIQD(s.totalPrice)}</Td><Td style={{ color: T.red }}>{fmtIQD(s.deposit)}</Td><Td style={{ color: T.green, fontWeight: 700 }}>{fmtIQD(s.netReceive)}</Td><Td>{s.note || “—”}</Td><Td><Btn variant=“danger” style={{ padding: “4px 8px” }} onClick={() => handleDelete(s.id)}>🗑</Btn></Td></tr>))}</tbody>
</table>
</Card>
<Modal show={showModal} onClose={() => setShowModal(false)} title=“سلفەی نوێ”>
<Input label=“بەروار” type=“date” value={form.date} onChange={e => setForm({ …form, date: e.target.value })} />
<Row><Input label=“بڕی مەتر” type=“number” value={form.meters} onChange={e => setForm({ …form, meters: e.target.value })} placeholder=“0” /><Input label=“نرخی هەر مەترێک” type=“number” value={form.pricePerMeter} onChange={e => setForm({ …form, pricePerMeter: e.target.value })} placeholder=“0” /></Row>
<div style={{ background: `${T.blue}10`, border: `1px solid ${T.blue}25`, borderRadius: 8, padding: 12, marginBottom: 12, textAlign: “center” }}><span style={{ color: T.textDim, fontSize: 12 }}>کۆی پارەی سلفە: </span><span style={{ color: T.blue, fontSize: 18, fontWeight: 800 }}>{fmtIQD(calcTotal(form.meters, form.pricePerMeter))}</span></div>
<Input label=“تەئمین (بارمتە)” type=“number” value={form.deposit} onChange={e => setForm({ …form, deposit: e.target.value })} placeholder=“0” />
<div style={{ background: `${T.green}10`, border: `1px solid ${T.green}25`, borderRadius: 8, padding: 12, marginBottom: 12, textAlign: “center” }}><span style={{ color: T.textDim, fontSize: 12 }}>بڕی وەرگرتن: </span><span style={{ color: T.green, fontSize: 18, fontWeight: 800 }}>{fmtIQD(calcTotal(form.meters, form.pricePerMeter) - (Number(form.deposit) || 0))}</span></div>
<Input label=“تێبینی” value={form.note} onChange={e => setForm({ …form, note: e.target.value })} placeholder=“تێبینی…” />
<div style={{ display: “flex”, gap: 10, marginTop: 16 }}><Btn onClick={handleSave}>✓ پاشەکەوت</Btn><Btn variant=“ghost” onClick={() => setShowModal(false)}>پاشگەزبوونەوە</Btn></div>
</Modal>
</div>
);
}

// ─── CONTRACTOR PAGE ───
function ContractorPage({ data, onSave }) {
const [showModal, setShowModal] = useState(false);
const [form, setForm] = useState({ date: today(), type: “withdraw”, amountIQD: “”, amountUSD: “”, note: “” });
const sorted = useMemo(() => […data.contractor].sort((a, b) => (b.date || “”).localeCompare(a.date || “”)), [data.contractor]);
const balanceIQD = sorted.reduce((s, c) => s + (c.type === “add” ? 1 : -1) * (Number(c.amountIQD) || 0), 0);
const balanceUSD = sorted.reduce((s, c) => s + (c.type === “add” ? 1 : -1) * (Number(c.amountUSD) || 0), 0);
const handleSave = () => { onSave({ …data, contractor: […data.contractor, { id: generateId(), …form, amountIQD: Number(form.amountIQD) || 0, amountUSD: Number(form.amountUSD) || 0 }] }); setShowModal(false); };
const handleDelete = (id) => onSave({ …data, contractor: data.contractor.filter(c => c.id !== id) });
return (
<div>
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “center”, marginBottom: 20 }}><h2 style={{ fontSize: 22, fontWeight: 800 }}>حیسابی مقاول</h2><Btn onClick={() => { setForm({ date: today(), type: “withdraw”, amountIQD: “”, amountUSD: “”, note: “” }); setShowModal(true); }}>+ تۆمار</Btn></div>
<div style={{ display: “flex”, gap: 12, marginBottom: 14 }}><StatCard label="باڵانسی دینار" value={fmtIQD(Math.abs(balanceIQD))} color={balanceIQD >= 0 ? T.green : T.red} sub={balanceIQD >= 0 ? “+” : “−”} /><StatCard label=“باڵانسی دۆلار” value={`$${fmtUSD(Math.abs(balanceUSD))}`} color={balanceUSD >= 0 ? T.green : T.red} sub={balanceUSD >= 0 ? “+” : “−”} /></div>
<Card style={{ overflowX: “auto”, padding: 0 }}>
<table style={{ width: “100%”, borderCollapse: “collapse” }}>
<thead><tr><Th>بەروار</Th><Th>جۆر</Th><Th>دینار</Th><Th>دۆلار</Th><Th>تێبینی</Th><Th>کردار</Th></tr></thead>
<tbody>{sorted.length === 0 ? <tr><td colSpan={6}><Empty icon="👷" text="هیچ تۆمارێک نییە" /></td></tr> : sorted.map(c => (<tr key={c.id}><Td style={{ fontSize: 11, color: T.textDim }}>{c.date}</Td><Td><Badge color={c.type === “add” ? T.green : T.red}>{c.type === “add” ? “زیادکردن” : “ڕاکێشان”}</Badge></Td><Td style={{ direction: “ltr”, textAlign: “right”, fontWeight: 700 }}>{c.amountIQD ? fmtIQD(c.amountIQD) : “—”}</Td><Td style={{ direction: “ltr”, textAlign: “right”, fontWeight: 700 }}>{c.amountUSD ? `$${fmtUSD(c.amountUSD)}` : “—”}</Td><Td>{c.note || “—”}</Td><Td><Btn variant=“danger” style={{ padding: “4px 8px” }} onClick={() => handleDelete(c.id)}>🗑</Btn></Td></tr>))}</tbody>
</table>
</Card>
<Modal show={showModal} onClose={() => setShowModal(false)} title=“تۆماری نوێ”>
<Row><Input label=“بەروار” type=“date” value={form.date} onChange={e => setForm({ …form, date: e.target.value })} /><Select label=“جۆر” value={form.type} onChange={e => setForm({ …form, type: e.target.value })} options={[{ value: “withdraw”, label: “ڕاکێشانی پارە” }, { value: “add”, label: “زیادکردنی پارە” }]} /></Row>
<Row><Input label=“دینار” type=“number” value={form.amountIQD} onChange={e => setForm({ …form, amountIQD: e.target.value })} placeholder=“0” /><Input label=“دۆلار” type=“number” value={form.amountUSD} onChange={e => setForm({ …form, amountUSD: e.target.value })} placeholder=“0” /></Row>
<Input label=“تێبینی” value={form.note} onChange={e => setForm({ …form, note: e.target.value })} />
<div style={{ display: “flex”, gap: 10, marginTop: 16 }}><Btn onClick={handleSave}>✓ پاشەکەوت</Btn><Btn variant=“ghost” onClick={() => setShowModal(false)}>پاشگەزبوونەوە</Btn></div>
</Modal>
</div>
);
}

// ─── CASH PAGE ───
function CashPage({ data, onSave, dollarRate }) {
const [editIQD, setEditIQD] = useState(false);
const [editUSD, setEditUSD] = useState(false);
const [valIQD, setValIQD] = useState(String(data.cashIQD || 0));
const [valUSD, setValUSD] = useState(String(data.cashUSD || 0));
const rate = dollarRate?.rate || 1500;
return (
<div>
<h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>قاسە</h2>
<div style={{ display: “flex”, gap: 14, marginBottom: 20, flexWrap: “wrap” }}>
<Card style={{ flex: 1, minWidth: 250, textAlign: “center”, padding: 28 }}>
<div style={{ fontSize: 12, color: T.textDim, marginBottom: 8 }}>پارەی دینار لە قاسە</div>
{editIQD ? (<div style={{ display: “flex”, gap: 8, justifyContent: “center”, alignItems: “center” }}><input type=“number” value={valIQD} onChange={e => setValIQD(e.target.value)} style={{ width: 160, padding: “8px 12px”, background: T.input, border: `1px solid ${T.accent}`, borderRadius: 8, color: T.text, fontSize: 18, textAlign: “center”, direction: “ltr” }} autoFocus /><Btn onClick={() => { onSave({ …data, cashIQD: Number(valIQD) || 0 }); setEditIQD(false); }}>✓</Btn></div>
) : (<div onClick={() => { setValIQD(String(data.cashIQD || 0)); setEditIQD(true); }} style={{ cursor: “pointer” }}><div style={{ fontSize: 36, fontWeight: 800, color: T.accent }}>{fmtIQD(data.cashIQD || 0)}</div><div style={{ fontSize: 10, color: T.textDim, marginTop: 4 }}>کلیک بکە بۆ گۆڕین</div></div>)}
</Card>
<Card style={{ flex: 1, minWidth: 250, textAlign: “center”, padding: 28 }}>
<div style={{ fontSize: 12, color: T.textDim, marginBottom: 8 }}>پارەی دۆلار لە قاسە</div>
{editUSD ? (<div style={{ display: “flex”, gap: 8, justifyContent: “center”, alignItems: “center” }}><input type=“number” value={valUSD} onChange={e => setValUSD(e.target.value)} style={{ width: 160, padding: “8px 12px”, background: T.input, border: `1px solid ${T.accent}`, borderRadius: 8, color: T.text, fontSize: 18, textAlign: “center”, direction: “ltr” }} autoFocus /><Btn onClick={() => { onSave({ …data, cashUSD: Number(valUSD) || 0 }); setEditUSD(false); }}>✓</Btn></div>
) : (<div onClick={() => { setValUSD(String(data.cashUSD || 0)); setEditUSD(true); }} style={{ cursor: “pointer” }}><div style={{ fontSize: 36, fontWeight: 800, color: T.green }}>$ {fmtUSD(data.cashUSD || 0)}</div><div style={{ fontSize: 10, color: T.textDim, marginTop: 4 }}>کلیک بکە بۆ گۆڕین</div></div>)}
</Card>
</div>
<Card style={{ textAlign: “center”, padding: 24 }}><div style={{ fontSize: 12, color: T.textDim, marginBottom: 6 }}>کۆی گشتی بە دینار (نرخ: {fmtIQD(rate)})</div><div style={{ fontSize: 32, fontWeight: 800, color: T.blue }}>{fmtIQD((data.cashIQD || 0) + (data.cashUSD || 0) * rate)}<span style={{ fontSize: 14, color: T.textDim, marginRight: 8 }}> IQD</span></div></Card>
</div>
);
}

// ─── EXCHANGE PAGE ───
function ExchangePage({ dollarRate, setDollarRate }) {
const [fromCurrency, setFromCurrency] = useState(“USD”);
const [amount, setAmount] = useState(””);
const [rateInput, setRateInput] = useState(String(dollarRate?.rate || 1500));
const rate = Number(rateInput) || 1500;
const converted = fromCurrency === “USD” ? (Number(amount) || 0) * rate : (Number(amount) || 0) / rate;
return (
<div>
<h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>ئالوگۆری دراو</h2>
<Card style={{ maxWidth: 450 }}>
<div style={{ marginBottom: 16 }}><label style={{ display: “block”, fontSize: 11, color: T.textDim, marginBottom: 4, fontWeight: 600 }}>نرخی دۆلار بە دینار</label><div style={{ display: “flex”, gap: 8 }}><input type=“number” value={rateInput} onChange={e => setRateInput(e.target.value)} style={{ flex: 1, padding: “10px 14px”, background: T.input, border: `1px solid ${T.inputBorder}`, borderRadius: 8, color: T.text, fontSize: 16, direction: “ltr”, textAlign: “center” }} /><Btn variant=“success” onClick={() => { const r = { rate, date: today() }; setDollarRate(r); saveRateStorage(r); }}>پاشەکەوت</Btn></div></div>
<div style={{ display: “flex”, gap: 8, marginBottom: 16 }}><Btn variant={fromCurrency === “USD” ? “primary” : “ghost”} onClick={() => setFromCurrency(“USD”)} style={{ flex: 1, justifyContent: “center” }}>$ → IQD</Btn><Btn variant={fromCurrency === “IQD” ? “primary” : “ghost”} onClick={() => setFromCurrency(“IQD”)} style={{ flex: 1, justifyContent: “center” }}>IQD → $</Btn></div>
<Input label={fromCurrency === “USD” ? “بڕی دۆلار” : “بڕی دینار”} type=“number” value={amount} onChange={e => setAmount(e.target.value)} placeholder=“0” />
<div style={{ background: `${T.accent}12`, border: `1px solid ${T.accent}30`, borderRadius: 10, padding: 20, textAlign: “center” }}><div style={{ fontSize: 12, color: T.textDim, marginBottom: 6 }}>{fromCurrency === “USD” ? “بڕی دینار” : “بڕی دۆلار”}</div><div style={{ fontSize: 28, fontWeight: 800, color: T.accent }}>{fromCurrency === “USD” ? fmtIQD(converted) : `$ ${fmtUSD(converted)}`}</div></div>
</Card>
</div>
);
}

// ─── INVOICE PAGE ───
function InvoicePage({ data, onSave }) {
const [showModal, setShowModal] = useState(false);
const [viewInvoice, setViewInvoice] = useState(null);
const [form, setForm] = useState({ date: today(), invoiceNo: “”, items: [{ name: “”, qty: “”, price: “”, note: “” }] });
const sorted = useMemo(() => […data.invoices].sort((a, b) => (b.date || “”).localeCompare(a.date || “”)), [data.invoices]);
const addItem = () => setForm(f => ({ …f, items: […f.items, { name: “”, qty: “”, price: “”, note: “” }] }));
const removeItem = (i) => setForm(f => ({ …f, items: f.items.filter((_, idx) => idx !== i) }));
const updateItem = (i, field, val) => setForm(f => ({ …f, items: f.items.map((item, idx) => idx === i ? { …item, [field]: val } : item) }));
const getTotal = (items) => items.reduce((s, it) => s + (Number(it.qty) || 0) * (Number(it.price) || 0), 0);
const handleSave = () => { if (!form.invoiceNo) return; onSave({ …data, invoices: […data.invoices, { id: generateId(), …form, total: getTotal(form.items) }] }); setShowModal(false); };
const handleDelete = (id) => onSave({ …data, invoices: data.invoices.filter(i => i.id !== id) });
const printInvoice = (inv) => {
const rows = inv.items.map((it, i) => `<tr><td>${i + 1}</td><td>${it.name || ""}</td><td>${it.qty || 0}</td><td style="text-align:left">${fmtIQD(it.price)}</td><td style="text-align:left">${fmtIQD((Number(it.qty) || 0) * (Number(it.price) || 0))}</td><td>${it.note || ""}</td></tr>`).join(””);
printContent(`<div class="header"><h1 style="font-size:28px;letter-spacing:2px">${BRAND}</h1><p style="margin:4px 0;color:#666">INVOICE</p></div><div class="meta"><span><strong>Date:</strong> ${inv.date}</span><span><strong>Invoice #:</strong> ${inv.invoiceNo}</span></div><table><thead><tr><th>#</th><th>Item</th><th>Qty</th><th>Price</th><th>Total</th><th>Note</th></tr></thead><tbody>${rows}</tbody><tfoot><tr class="total-row"><td colspan="4" style="text-align:left;font-size:14px">TOTAL:</td><td style="text-align:left;font-size:14px">${fmtIQD(inv.total || getTotal(inv.items))}</td><td></td></tr></tfoot></table>`, `Invoice-${inv.invoiceNo}`);
};
return (
<div>
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “center”, marginBottom: 20 }}><h2 style={{ fontSize: 22, fontWeight: 800 }}>ئینڤۆیسەکان</h2><Btn onClick={() => { setForm({ date: today(), invoiceNo: String(sorted.length + 1).padStart(3, “0”), items: [{ name: “”, qty: “”, price: “”, note: “” }] }); setShowModal(true); }}>+ ئینڤۆیسی نوێ</Btn></div>
{sorted.length === 0 ? <Card><Empty icon="🧾" text="هیچ ئینڤۆیسێک نییە" /></Card> : (
<Card style={{ overflowX: “auto”, padding: 0 }}>
<table style={{ width: “100%”, borderCollapse: “collapse” }}>
<thead><tr><Th>بەروار</Th><Th>ژمارە</Th><Th>ئایتم</Th><Th>تۆتاڵ</Th><Th>کردار</Th></tr></thead>
<tbody>{sorted.map(inv => (<tr key={inv.id}><Td style={{ fontSize: 11, color: T.textDim }}>{inv.date}</Td><Td style={{ fontWeight: 700 }}>{inv.invoiceNo}</Td><Td>{inv.items?.length || 0}</Td><Td style={{ fontWeight: 700, color: T.accent }}>{fmtIQD(inv.total || getTotal(inv.items || []))}</Td><Td><div style={{ display: “flex”, gap: 4 }}><Btn variant=“blue” style={{ padding: “4px 8px”, fontSize: 11 }} onClick={() => printInvoice(inv)}>🖨️</Btn><Btn variant=“ghost” style={{ padding: “4px 8px” }} onClick={() => setViewInvoice(inv)}>👁</Btn><Btn variant=“danger” style={{ padding: “4px 8px” }} onClick={() => handleDelete(inv.id)}>🗑</Btn></div></Td></tr>))}</tbody>
</table>
</Card>
)}
<Modal show={!!viewInvoice} onClose={() => setViewInvoice(null)} title={`Invoice #${viewInvoice?.invoiceNo}`} wide>
{viewInvoice && (<div><div style={{ textAlign: “center”, marginBottom: 16 }}><div style={{ fontSize: 24, fontWeight: 800, letterSpacing: 2, color: T.accent }}>{BRAND}</div><div style={{ fontSize: 11, color: T.textDim }}>Date: {viewInvoice.date} | Invoice #: {viewInvoice.invoiceNo}</div></div><table style={{ width: “100%”, borderCollapse: “collapse” }}><thead><tr><Th>#</Th><Th>Item</Th><Th>Qty</Th><Th>Price</Th><Th>Total</Th><Th>Note</Th></tr></thead><tbody>{viewInvoice.items?.map((it, i) => (<tr key={i}><Td>{i + 1}</Td><Td>{it.name}</Td><Td>{it.qty}</Td><Td style={{ direction: “ltr”, textAlign: “right” }}>{fmtIQD(it.price)}</Td><Td style={{ direction: “ltr”, textAlign: “right”, fontWeight: 700 }}>{fmtIQD((Number(it.qty) || 0) * (Number(it.price) || 0))}</Td><Td>{it.note || “—”}</Td></tr>))}</tbody></table><div style={{ textAlign: “left”, marginTop: 14, fontSize: 18, fontWeight: 800, color: T.accent }}>TOTAL: {fmtIQD(viewInvoice.total || getTotal(viewInvoice.items || []))}</div><Btn variant=“blue” onClick={() => printInvoice(viewInvoice)} style={{ marginTop: 12 }}>🖨️ Print / PDF</Btn></div>)}
</Modal>
<Modal show={showModal} onClose={() => setShowModal(false)} title=“ئینڤۆیسی نوێ” wide>
<Row><Input label=“Date” type=“date” value={form.date} onChange={e => setForm({ …form, date: e.target.value })} /><Input label=“Invoice Number” value={form.invoiceNo} onChange={e => setForm({ …form, invoiceNo: e.target.value })} /></Row>
<div style={{ marginBottom: 12 }}>
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “center”, marginBottom: 10 }}><label style={{ fontSize: 13, fontWeight: 700, color: T.text }}>ئایتمەکان</label><Btn variant=“ghost” onClick={addItem} style={{ padding: “4px 12px”, fontSize: 11 }}>+ ئایتم</Btn></div>
{form.items.map((it, i) => (<div key={i} style={{ background: T.input, border: `1px solid ${T.inputBorder}`, borderRadius: 10, padding: 12, marginBottom: 8 }}><div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “center”, marginBottom: 8 }}><span style={{ fontSize: 11, color: T.textDim }}>#{i + 1}</span>{form.items.length > 1 && <Btn variant=“danger” onClick={() => removeItem(i)} style={{ padding: “2px 8px”, fontSize: 10 }}>✕</Btn>}</div><Row><Input label=“ناوی کاڵا” value={it.name} onChange={e => updateItem(i, “name”, e.target.value)} placeholder=“Item” /><Input label=“حەدەد” type=“number” value={it.qty} onChange={e => updateItem(i, “qty”, e.target.value)} placeholder=“0” /></Row><Row><Input label=“نرخی حەدەد” type=“number” value={it.price} onChange={e => updateItem(i, “price”, e.target.value)} placeholder=“0” /><Input label=“تێبینی” value={it.note} onChange={e => updateItem(i, “note”, e.target.value)} placeholder=”…” /></Row><div style={{ textAlign: “left”, fontSize: 12, color: T.accent, fontWeight: 700 }}>Subtotal: {fmtIQD((Number(it.qty) || 0) * (Number(it.price) || 0))}</div></div>))}
</div>
<div style={{ background: `${T.accent}12`, border: `1px solid ${T.accent}30`, borderRadius: 10, padding: 16, textAlign: “center”, marginBottom: 14 }}><span style={{ color: T.textDim, fontSize: 13 }}>TOTAL: </span><span style={{ fontSize: 24, fontWeight: 800, color: T.accent }}>{fmtIQD(getTotal(form.items))}</span></div>
<div style={{ display: “flex”, gap: 10 }}><Btn onClick={handleSave}>✓ پاشەکەوت</Btn><Btn variant=“ghost” onClick={() => setShowModal(false)}>پاشگەزبوونەوە</Btn></div>
</Modal>
</div>
);
}

// ─── MAIN APP ───
export default function App() {
const [data, setData] = useState(() => loadStore());
const [dollarRate, setDollarRate] = useState(() => loadRate());
const [page, setPage] = useState(“expenses”);
const [saved, setSaved] = useState(””);
const [menuOpen, setMenuOpen] = useState(false);

const handleSave = useCallback((newData) => {
setData(newData);
saveStore(newData);
setSaved(“ok”);
setTimeout(() => setSaved(””), 1500);
}, []);

const nav = [
{ id: “expenses”, label: “خەرجی”, icon: “💰” },
{ id: “debts”, label: “قەرز”, icon: “🤝” },
{ id: “slabs”, label: “سلفە”, icon: “🏗️” },
{ id: “contractor”, label: “مقاول”, icon: “👷” },
{ id: “cash”, label: “قاسە”, icon: “🏦” },
{ id: “exchange”, label: “ئالوگۆر”, icon: “💱” },
{ id: “invoice”, label: “ئینڤۆیس”, icon: “🧾” },
];

return (
<div style={{ background: T.bg, minHeight: “100vh”, display: “flex”, direction: “rtl”, fontFamily: “‘IBM Plex Sans Arabic’,sans-serif” }}>
<style>{globalCSS}</style>

```
  {/* Mobile menu button */}
  <button onClick={() => setMenuOpen(!menuOpen)} style={{
    display: "none", position: "fixed", top: 12, right: 12, zIndex: 1001, background: T.accent, color: "#fff",
    border: "none", borderRadius: 8, padding: "8px 12px", fontSize: 18,
    ...(window.innerWidth <= 768 ? { display: "block" } : {})
  }}>☰</button>

  {/* Sidebar */}
  <div style={{
    width: 200, minWidth: 200, background: "rgba(13,17,23,0.97)", borderLeft: `1px solid ${T.border}`,
    padding: "20px 0", display: "flex", flexDirection: "column",
    ...(window.innerWidth <= 768 ? {
      position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 1000,
      transform: menuOpen ? "translateX(0)" : "translateX(100%)", transition: "transform .2s"
    } : {})
  }}>
    <div style={{ padding: "0 18px 18px", borderBottom: `1px solid ${T.border}`, marginBottom: 6 }}>
      <div style={{ fontSize: 20, fontWeight: 800, background: `linear-gradient(135deg,${T.accent},${T.red})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{BRAND}</div>
      <div style={{ fontSize: 10, color: T.textDim, marginTop: 3 }}>karo-group.com</div>
    </div>
    {nav.map(n => (
      <div key={n.id} onClick={() => { setPage(n.id); setMenuOpen(false); }} style={{
        display: "flex", alignItems: "center", gap: 10, padding: "10px 18px", cursor: "pointer",
        background: page === n.id ? `${T.accent}15` : "transparent",
        color: page === n.id ? T.accent : T.textDim,
        borderLeft: page === n.id ? `3px solid ${T.accent}` : "3px solid transparent",
        fontSize: 13, fontWeight: page === n.id ? 700 : 400, transition: "all .15s"
      }}>
        <span>{n.icon}</span><span>{n.label}</span>
      </div>
    ))}
    <div style={{ marginTop: "auto", padding: "14px 18px", borderTop: `1px solid ${T.border}`, fontSize: 10, color: T.textDim }}>$ = {fmtIQD(dollarRate.rate)} IQD</div>
  </div>

  {/* Overlay for mobile menu */}
  {menuOpen && <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 999 }} />}

  {/* Main */}
  <div style={{ flex: 1, padding: "24px 28px", overflowY: "auto", maxHeight: "100vh" }}>
    {page === "expenses" && <ExpensesPage data={data} onSave={handleSave} />}
    {page === "debts" && <DebtsPage data={data} onSave={handleSave} />}
    {page === "slabs" && <SlabsPage data={data} onSave={handleSave} />}
    {page === "contractor" && <ContractorPage data={data} onSave={handleSave} />}
    {page === "cash" && <CashPage data={data} onSave={handleSave} dollarRate={dollarRate} />}
    {page === "exchange" && <ExchangePage dollarRate={dollarRate} setDollarRate={setDollarRate} />}
    {page === "invoice" && <InvoicePage data={data} onSave={handleSave} />}
  </div>

  {saved && (<div style={{ position: "fixed", bottom: 20, left: 20, background: T.green, color: "#fff", padding: "8px 18px", borderRadius: 8, fontSize: 12, fontWeight: 700, zIndex: 1000, animation: "fadeIn .2s ease" }}>پاشەکەوت کرا ✓</div>)}
</div>
```

);
}
