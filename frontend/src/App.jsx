import { useState, useEffect } from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid
} from "recharts";
import axios from "axios";

const API = "http://127.0.0.1:8000";

// ── Design tokens ──────────────────────────────────────────────────────────
const C = {
  bg:      "#0F1117",
  surface: "#161B27",
  card:    "#1E2434",
  border:  "#2A3148",
  blue:    "#3B82F6",
  blueD:   "#2563EB",
  green:   "#10B981",
  red:     "#EF4444",
  amber:   "#F59E0B",
  text:    "#F1F5F9",
  muted:   "#94A3B8",
  subtle:  "#64748B",
};

// ── Mock data ───────────────────────────────────────────────────────────────
const SEED_HISTORY = [
  { id: 1, date: "Aujourd'hui 14:32", text: "الخدمة زوينة بزاف ولكن الثمن غالي", sentiment: "Positif", score: 91 },
  { id: 2, date: "Aujourd'hui 13:10", text: "ماكلة ممتازة وخدمة سريعة",           sentiment: "Positif", score: 96 },
  { id: 3, date: "Aujourd'hui 11:45", text: "الانتظار طويل بزاف مزيانش",          sentiment: "Négatif", score: 88 },
  { id: 4, date: "Hier 20:15",        text: "بلاصة كلاش غير الطابور كبير",        sentiment: "Neutre",  score: 72 },
  { id: 5, date: "Hier 18:05",        text: "الطاجين بارد وما عجبنيش",            sentiment: "Négatif", score: 93 },
  { id: 6, date: "Hier 15:33",        text: "شكرا على الخدمة الراقية",             sentiment: "Positif", score: 98 },
];

const DAILY = [
  { day: "Lun", positif: 12, neutre: 4, négatif: 3 },
  { day: "Mar", positif: 9,  neutre: 6, négatif: 5 },
  { day: "Mer", positif: 7,  neutre: 5, négatif: 8 },
  { day: "Jeu", positif: 14, neutre: 3, négatif: 2 },
  { day: "Ven", positif: 18, neutre: 5, négatif: 4 },
  { day: "Sam", positif: 22, neutre: 7, négatif: 3 },
  { day: "Dim", positif: 11, neutre: 4, négatif: 6 },
];

const TREND = DAILY.map(d => ({
  day: d.day,
  score: Math.round((d.positif / (d.positif + d.neutre + d.négatif)) * 100),
}));

// ── Helpers ─────────────────────────────────────────────────────────────────
const sentimentIcon  = s => s === "Positif" ? "😊" : s === "Négatif" ? "😞" : "😐";
const sentimentColor = s => s === "Positif" ? C.green : s === "Négatif" ? C.red : C.amber;

function Badge({ s }) {
  return (
    <span style={{
      background: sentimentColor(s) + "22",
      color: sentimentColor(s),
      border: `1px solid ${sentimentColor(s)}44`,
      padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
    }}>
      {sentimentIcon(s)} {s}
    </span>
  );
}

function KpiCard({ label, value, sub, accent }) {
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`,
      borderRadius: 16, padding: "24px 28px",
      display: "flex", flexDirection: "column", gap: 8,
    }}>
      <span style={{ color: C.muted, fontSize: 13, fontWeight: 500, textTransform: "uppercase", letterSpacing: 1 }}>{label}</span>
      <span style={{ color: accent || C.text, fontSize: 32, fontWeight: 700, lineHeight: 1 }}>{value}</span>
      {sub && <span style={{ color: C.subtle, fontSize: 13 }}>{sub}</span>}
    </div>
  );
}

// ── LANDING PAGE ─────────────────────────────────────────────────────────────
function Landing({ onStart }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 2000);
    return () => clearInterval(t);
  }, []);

  const samples = [
    { t: "الخدمة زوينة بزاف ولكن الثمن غالي", s: "Positif",  score: "91%" },
    { t: "الانتظار طويل بزاف مزيانش",          s: "Négatif",  score: "88%" },
    { t: "ماكلة ممتازة وخدمة سريعة",           s: "Positif",  score: "96%" },
  ];
  const demo = samples[tick % samples.length];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Inter',sans-serif", display: "flex", flexDirection: "column" }}>
      {/* Nav */}
      <nav style={{ padding: "20px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 26, fontWeight: 800, background: "linear-gradient(135deg,#3B82F6,#10B981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>DarijaInsight</span>
          <span style={{ background: C.blueD + "22", color: C.blue, fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6, border: `1px solid ${C.blueD}44` }}>BETA</span>
        </div>
        <button onClick={onStart} style={{ background: C.blueD, color: "#fff", border: "none", borderRadius: 10, padding: "10px 24px", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
          Commencer l'analyse →
        </button>
      </nav>

      {/* Hero */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", textAlign: "center", gap: 32 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.card, border: `1px solid ${C.border}`, borderRadius: 40, padding: "6px 16px", fontSize: 13, color: C.muted }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, display: "inline-block", boxShadow: `0 0 6px ${C.green}` }}></span>
          NLP spécialisé Darija marocain — MARBERT fine-tuné
        </div>

        <h1 style={{ fontSize: "clamp(36px,6vw,72px)", fontWeight: 800, lineHeight: 1.1, maxWidth: 820, margin: 0 }}>
          Comprenez ce que vos clients<br />
          <span style={{ background: "linear-gradient(135deg,#3B82F6,#10B981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>disent vraiment en Darija</span>
        </h1>

        <p style={{ color: C.muted, fontSize: 18, maxWidth: 560, lineHeight: 1.7, margin: 0 }}>
          Les entreprises marocaines reçoivent des milliers d'avis sur Facebook, Google et WhatsApp — en Darija. Aucun outil ne les comprend. DarijaInsight, oui.
        </p>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          <button onClick={onStart} style={{ background: "linear-gradient(135deg,#2563EB,#1D4ED8)", color: "#fff", border: "none", borderRadius: 12, padding: "16px 36px", fontWeight: 700, cursor: "pointer", fontSize: 16, boxShadow: "0 0 40px #2563EB44" }}>
            Commencer l'analyse
          </button>
        </div>

        {/* Live demo card */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 28, maxWidth: 480, width: "100%", textAlign: "right", marginTop: 16 }}>
          <p style={{ fontSize: 13, color: C.muted, textAlign: "left", margin: "0 0 12px 0", fontFamily: "monospace" }}>// Analyse en cours…</p>
          <p style={{ fontSize: 18, color: C.text, fontFamily: "'Segoe UI',sans-serif", direction: "rtl", margin: "0 0 16px 0", lineHeight: 1.6 }}>{demo.t}</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Badge s={demo.s} />
            <span style={{ color: C.muted, fontSize: 13 }}>Confiance <strong style={{ color: C.text }}>{demo.score}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ANALYSE TAB ──────────────────────────────────────────────────────────────
function AnalyseTab({ onResult }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const analyze = async () => {
    if (!text.trim()) return;
    setLoading(true); setResult(null);
    try {
      const response = await axios.post(`${API}/predict`, { text: text });
      const data = response.data;
      const r = { text, sentiment: data.sentiment, score: Math.round(data.score * 100) };
      setResult(r);
      onResult(r);
    } catch (error) {
      console.error(error);
      // Demo Fallback si le serveur FastAPI n'est pas lancé
      const mocks = ["Positif", "Négatif", "Neutre"];
      const s = text.includes("زوين") || text.includes("ممتاز") ? "Positif" : text.includes("خايب") || text.includes("بارد") ? "Négatif" : mocks[Math.floor(Math.random() * 3)];
      const r = { text, sentiment: s, score: Math.floor(Math.random() * 15) + 84 };
      setResult(r);
      onResult(r);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 4px 0" }}>Analyser un avis</h2>
        <p style={{ color: C.muted, margin: 0, fontSize: 14 }}>Collez un commentaire client en Darija, arabe, ou mélange franco-arabe.</p>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="الخدمة زوينة بزاف ولكن الثمن غالي…"
          style={{
            width: "100%", minHeight: 140, background: "transparent",
            border: "none", outline: "none", color: C.text, fontSize: 18,
            fontFamily: "'Segoe UI',sans-serif", resize: "vertical", direction: "rtl",
            lineHeight: 1.7,
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
          <span style={{ color: C.subtle, fontSize: 13 }}>{text.length} caractères</span>
          <button
            onClick={analyze}
            disabled={loading || !text.trim()}
            style={{
              background: loading || !text.trim() ? C.border : "linear-gradient(135deg,#2563EB,#1D4ED8)",
              color: loading || !text.trim() ? C.subtle : "#fff",
              border: "none", borderRadius: 10, padding: "12px 28px", fontWeight: 700,
              cursor: loading || !text.trim() ? "not-allowed" : "pointer", fontSize: 15,
              transition: "all .2s",
            }}
          >
            {loading ? "Analyse en cours…" : "Analyser →"}
          </button>
        </div>
      </div>

      {result && (
        <div style={{ background: C.card, border: `2px solid ${sentimentColor(result.sentiment)}44`, borderRadius: 16, padding: 28, display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 13, color: C.muted, marginBottom: 8, fontWeight: 500, textTransform: "uppercase", letterSpacing: 1 }}>Résultat</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 48 }}>{sentimentIcon(result.sentiment)}</span>
                <span style={{ fontSize: 32, fontWeight: 800, color: sentimentColor(result.sentiment) }}>{result.sentiment}</span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, color: C.muted, marginBottom: 4 }}>Confiance</div>
              <div style={{ fontSize: 40, fontWeight: 800, color: C.text }}>{result.score}<span style={{ fontSize: 20, color: C.muted }}>%</span></div>
            </div>
          </div>
          <div style={{ background: C.border, borderRadius: 8, height: 8, overflow: "hidden" }}>
            <div style={{ width: `${result.score}%`, height: "100%", background: `linear-gradient(90deg,${sentimentColor(result.sentiment)},${sentimentColor(result.sentiment)}88)`, borderRadius: 8, transition: "width 1s ease" }} />
          </div>
        </div>
      )}
    </div>
  );
}

// ── HISTORIQUE TAB ───────────────────────────────────────────────────────────
function HistoriqueTab({ history }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Tous");

  const filtered = history.filter(h =>
    (filter === "Tous" || h.sentiment === filter) &&
    (h.text.includes(search) || h.date.includes(search))
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200, background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: C.muted }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher dans les avis…" style={{ background: "transparent", border: "none", outline: "none", color: C.text, fontSize: 14, flex: 1 }} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["Tous", "Positif", "Neutre", "Négatif"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              background: filter === f ? C.blueD : C.card,
              color: filter === f ? "#fff" : C.muted,
              border: `1px solid ${filter === f ? C.blueD : C.border}`,
              borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600,
            }}>{f}</button>
          ))}
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {["Date", "Avis", "Sentiment", "Score"].map(h => (
                <th key={h} style={{ padding: "14px 18px", textAlign: "left", color: C.muted, fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr key={row.id} style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <td style={{ padding: "14px 18px", color: C.subtle, fontSize: 13, whiteSpace: "nowrap" }}>{row.date}</td>
                <td style={{ padding: "14px 18px", color: C.text, fontSize: 14, fontFamily: "'Segoe UI',sans-serif", direction: "rtl", maxWidth: 280 }}>{row.text}</td>
                <td style={{ padding: "14px 18px" }}><Badge s={row.sentiment} /></td>
                <td style={{ padding: "14px 18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1, background: C.border, borderRadius: 4, height: 6, maxWidth: 80 }}>
                      <div style={{ width: `${row.score}%`, height: "100%", background: sentimentColor(row.sentiment), borderRadius: 4 }} />
                    </div>
                    <span style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>{row.score}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── STATISTIQUES TAB ─────────────────────────────────────────────────────────
function StatistiquesTab({ history }) {
  const pos   = history.filter(h => h.sentiment === "Positif").length;
  const neg   = history.filter(h => h.sentiment === "Négatif").length;
  const neu   = history.filter(h => h.sentiment === "Neutre").length;
  const total = history.length;
  const pie   = [
    { name: "Positif", value: pos, color: C.green },
    { name: "Neutre",  value: neu, color: C.amber },
    { name: "Négatif", value: neg, color: C.red   },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16 }}>
        <KpiCard label="Total avis"  value={total} sub={`${SEED_HISTORY.length} exemples inclus`} />
        <KpiCard label="Positifs"    value={`${total ? Math.round(pos / total * 100) : 0}%`} accent={C.green} sub={`${pos} avis`} />
        <KpiCard label="Neutres"     value={`${total ? Math.round(neu / total * 100) : 0}%`} accent={C.amber} sub={`${neu} avis`} />
        <KpiCard label="Négatifs"    value={`${total ? Math.round(neg / total * 100) : 0}%`} accent={C.red}   sub={`${neg} avis`} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 20 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
          <h3 style={{ margin: "0 0 20px 0", fontSize: 15, fontWeight: 600 }}>Répartition des sentiments</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pie} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                {pie.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [`${v} avis`, n]} contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
          <h3 style={{ margin: "0 0 20px 0", fontSize: 15, fontWeight: 600 }}>Avis par jour (7 jours)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={DAILY} barSize={10}>
              <XAxis dataKey="day" tick={{ fill: C.muted, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.muted, fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8 }} />
              <Bar dataKey="positif" stackId="a" fill={C.green} />
              <Bar dataKey="neutre"  stackId="a" fill={C.amber} />
              <Bar dataKey="négatif" stackId="a" fill={C.red} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ── RAPPORT TAB ──────────────────────────────────────────────────────────────
function RapportTab({ history, company }) {
  const pos   = history.filter(h => h.sentiment === "Positif").length;
  const neg   = history.filter(h => h.sentiment === "Négatif").length;
  const neu   = history.filter(h => h.sentiment === "Neutre").length;
  const total = history.length;
  const pct   = n => total ? Math.round(n / total * 100) : 0;
  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28 }}>
        <h3>Rapport pour {company || "Votre Entreprise"}</h3>
        <p>Généré le {today}</p>
        <p>Total avis traités : {total} ({pct(pos)}% Positifs, {pct(neu)}% Neutres, {pct(neg)}% Négatifs)</p>
      </div>
    </div>
  );
}

// ── PARAMETRES TAB ───────────────────────────────────────────────────────────
function ParamsTab({ company, setCompany, city, setCity }) {
  return (
    <div style={{ maxWidth: 560, display: "flex", flexDirection: "column", gap: 24 }}>
      <label style={{ color: C.text }}>Nom de l'entreprise</label>
      <input value={company} onChange={e => setCompany(e.target.value)} style={{ background: C.card, color: C.text, padding: 10, border: `1px solid ${C.border}` }} />
      <label style={{ color: C.text }}>Ville</label>
      <input value={city} onChange={e => setCity(e.target.value)} style={{ background: C.card, color: C.text, padding: 10, border: `1px solid ${C.border}` }} />
    </div>
  );
}

// ── MAIN APPLICATION SHELL ───────────────────────────────────────────────────
const TABS = ["Analyse", "Historique", "Statistiques", "Rapport", "Paramètres"];
const ICONS = ["✨", "🗂️", "📊", "📄", "⚙️"];

export default function App() {
  const [page, setPage]       = useState("landing");
  const [tab, setTab]         = useState(0);
  const [history, setHistory] = useState(SEED_HISTORY);
  const [company, setCompany] = useState("Mon Entreprise");
  const [city, setCity]       = useState("Casablanca");

  const addResult = r => {
    setHistory(h => [{
      id: Date.now(), 
      date: "Aujourd'hui", 
      text: r.text, 
      sentiment: r.sentiment, 
      score: r.score
    }, ...h]);
  };

  if (page === "landing") return <Landing onStart={() => setPage("dash")} />;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Inter',sans-serif", display: "flex" }}>
      {/* Sidebar */}
      <div style={{ width: 240, background: C.surface, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0 }}>
        <div style={{ padding: "24px 20px", borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: C.blue }}>DarijaInsight</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: 12 }}>
          {TABS.map((t, idx) => (
            <button key={t} onClick={() => setTab(idx)} style={{
              background: tab === idx ? C.card : "transparent",
              color: tab === idx ? C.text : C.muted,
              border: "none", padding: "12px 16px", borderRadius: 8, textAlign: "left", cursor: "pointer", fontWeight: 600
            }}>
              {ICONS[idx]} {t}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content View */}
      <div style={{ flex: 1, padding: 40, overflowY: "auto" }}>
        {tab === 0 && <AnalyseTab onResult={addResult} />}
        {tab === 1 && <HistoriqueTab history={history} />}
        {tab === 2 && <StatistiquesTab history={history} />}
        {tab === 3 && <RapportTab history={history} company={company} />}
        {tab === 4 && <ParamsTab company={company} setCompany={setCompany} city={city} setCity={setCity} />}
      </div>
    </div>
  );
}