import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useLocale } from "./i18n/LocaleContext";
import { LOCALES } from "./i18n/translations";
import Footer from "./components/Footer";

const GOSPEL_RSS_DIRECT = {
  [LOCALES.ES_ES]: "https://www.aciprensa.com/rss/evangelio",
  [LOCALES.EN_US]: "https://bible.usccb.org/readings.rss",
};
const GOSPEL_CACHE_PREFIX = "lumen_gospel_";
const CORS_PROXY = "https://corsproxy.io/?";
function getGospelRssUrl(locale) {
  const direct = GOSPEL_RSS_DIRECT[locale] || GOSPEL_RSS_DIRECT[LOCALES.EN_US];
  if (typeof import.meta !== "undefined" && import.meta.env?.DEV) {
    return locale === LOCALES.ES_ES ? "/api/gospel-es" : "/api/gospel-en";
  }
  if (CONFIG.GOSPEL_PROXY_BASE) {
    return CONFIG.GOSPEL_PROXY_BASE + encodeURIComponent(direct);
  }
  return CORS_PROXY + encodeURIComponent(direct);
}

// ═══════════════════════════════════════════════════════
// LUMEN — Catholic Spiritual Companion
// 100% Free · Google Auth · n8n Journal Sync
// ═══════════════════════════════════════════════════════

// ┌─────────────────────────────────────────────────────┐
// │  CONFIGURATION — Replace these with your values     │
// └─────────────────────────────────────────────────────┘
const CONFIG = {
  GOOGLE_CLIENT_ID: "959675340296-t0vdupimbdtr5mvalimr1mdu0cuqu2tq.apps.googleusercontent.com",
  N8N_SAVE_WEBHOOK: "https://n8n.monk.st/webhook/lumen-journal-save",
  N8N_LOAD_WEBHOOK: "https://n8n.monk.st/webhook/lumen-journal-load",
  /** Your proxy for Gospel RSS (avoids 403/CORS). Set to your deployed /api/gospel?url= so the app uses it in production. */
  GOSPEL_PROXY_BASE: "https://www.lumenfaith.app/api/gospel?url=",
};

// ═══════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════

const VIEWS = { HOME: "home", ROSARY: "rosary", ROSARY_PRAY: "rosary_pray", CONFESSION: "confession", EXAMEN: "examen", PRAYERS: "prayers", JOURNAL: "journal", GOSPEL: "gospel" };

// Rosary: only structure (day key + color). All text from translations.content.
const MYSTERY_META = {
  Joyful: { day: "Monday & Saturday", color: "#6BA368" },
  Sorrowful: { day: "Tuesday & Friday", color: "#8B3A3A" },
  Glorious: { day: "Wednesday & Sunday", color: "#BF9B30" },
  Luminous: { day: "Thursday", color: "#4A90D9" },
};

// ═══════════════════════════════════════════════════════
// STYLES & SHARED
// ═══════════════════════════════════════════════════════
const S = {
  bg: "linear-gradient(170deg, #0d1117 0%, #151d2b 30%, #1a2238 60%, #0f1923 100%)",
  gold: "#BF9B30", goldLight: "#E8D48B", text: "#f5ecd7", textDim: "rgba(245,236,215,0.55)",
  cardBg: "rgba(255,248,235,0.04)", borderDim: "rgba(191,155,48,0.15)",
  heading: "'Cormorant Garamond', serif", body: "'Lora', serif",
};

function CrossIcon({ size = 24, color = "currentColor" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="10" y="2" width="4" height="20" rx="0.5" fill={color}/><rect x="4" y="7" width="16" height="4" rx="0.5" fill={color}/></svg>;
}

function Header({ title, subtitle, onBack, right }) {
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "14px 20px", borderBottom: `1px solid ${S.borderDim}`, background: "rgba(13,17,23,0.92)", backdropFilter: "blur(20px)", flexShrink: 0, gap: 14, position: "sticky", top: 0, zIndex: 10 }}>
      <button onClick={onBack} style={{ background: "none", border: "1px solid rgba(191,155,48,0.25)", borderRadius: 10, padding: "7px 13px", cursor: "pointer", color: S.gold, fontSize: 14, fontFamily: S.body }}>←</button>
      <div style={{ flex: 1 }}>
        <h2 style={{ fontFamily: S.heading, fontSize: 20, fontWeight: 500, color: S.gold, letterSpacing: "0.04em" }}>{title}</h2>
        {subtitle && <p style={{ fontFamily: S.body, fontSize: 11, color: "rgba(245,236,215,0.38)", marginTop: 1 }}>{subtitle}</p>}
      </div>
      {right || <CrossIcon size={17} color="rgba(191,155,48,0.22)" />}
    </div>
  );
}

function ProgressBar({ total, current, color = S.gold }) {
  return <div style={{ display: "flex", padding: "10px 20px", gap: 4, flexShrink: 0 }}>{Array.from({ length: total }, (_, i) => <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < current ? color : i === current ? `${color}66` : "rgba(191,155,48,0.1)", transition: "all 0.4s" }}/>)}</div>;
}

/** Rosary: intro (short) + 5 mysteries (long) + closing (short). Pale = current, full color = done, dim = not yet. */
function RosaryProgressBar({ segmentIndex, color = S.gold }) {
  const segments = [
    { flex: 0.45, label: "intro" },
    { flex: 1, label: "1" }, { flex: 1, label: "2" }, { flex: 1, label: "3" }, { flex: 1, label: "4" }, { flex: 1, label: "5" },
    { flex: 0.45, label: "end" },
  ];
  return (
    <div style={{ display: "flex", padding: "10px 20px", gap: 4, flexShrink: 0, alignItems: "center" }}>
      {segments.map((s, i) => {
        const isDone = i < segmentIndex;
        const isCurrent = i === segmentIndex;
        const bg = isDone ? color : isCurrent ? `${color}99` : "rgba(191,155,48,0.1)";
        return <div key={i} style={{ flex: s.flex, height: 4, borderRadius: 2, background: bg, transition: "all 0.4s" }} />;
      })}
    </div>
  );
}

function Btn({ children, onClick, disabled, full, color }) {
  const bg = color || S.gold;
  return <button onClick={onClick} disabled={disabled} style={{ width: full ? "100%" : "auto", padding: "14px 28px", borderRadius: 13, border: "none", background: disabled ? "rgba(191,155,48,0.12)" : `linear-gradient(135deg, ${bg}, ${bg}cc)`, color: disabled ? "rgba(191,155,48,0.3)" : "#fff", fontFamily: S.heading, fontSize: 16, fontWeight: 600, cursor: disabled ? "default" : "pointer", letterSpacing: "0.04em", boxShadow: disabled ? "none" : `0 4px 16px ${bg}33` }}>{children}</button>;
}

function OutBtn({ children, onClick, disabled }) {
  return <button onClick={onClick} disabled={disabled} style={{ flex: 1, padding: "14px", borderRadius: 13, border: "1px solid rgba(191,155,48,0.2)", background: "transparent", color: disabled ? "rgba(191,155,48,0.18)" : S.gold, fontFamily: S.heading, fontSize: 16, fontWeight: 600, cursor: disabled ? "default" : "pointer" }}>{children}</button>;
}

// ═══════════════════════════════════════════════════════
// GOOGLE AUTH + N8N JOURNAL SYNC
// ═══════════════════════════════════════════════════════

function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [googleReady, setGoogleReady] = useState(false);
  const [authError, setAuthError] = useState(null);
  const signInPopupTimeoutRef = useRef(null);
  const hasRealClientId = CONFIG.GOOGLE_CLIENT_ID && CONFIG.GOOGLE_CLIENT_ID !== "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

  const handleCredentialResponse = useCallback((response) => {
    if (signInPopupTimeoutRef.current) {
      clearTimeout(signInPopupTimeoutRef.current);
      signInPopupTimeoutRef.current = null;
    }
    setAuthError(null);
    try {
      const payload = JSON.parse(atob(response.credential.split(".")[1]));
      const userData = { id: payload.sub, name: payload.name, email: payload.email, picture: payload.picture };
      setUser(userData);
      try { localStorage.setItem("lumen_user", JSON.stringify(userData)); } catch {}
    } catch (e) {
      console.error("Auth error:", e);
      setAuthError("signInFailed");
    }
  }, []);

  useEffect(() => {
    try {
      const cached = localStorage.getItem("lumen_user");
      if (cached) setUser(JSON.parse(cached));
    } catch {}
    setLoading(false);

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      if (window.google && hasRealClientId) {
        try {
          window.google.accounts.id.initialize({
            client_id: CONFIG.GOOGLE_CLIENT_ID,
            callback: (response) => handleCredentialResponse(response),
          });
          setGoogleReady(true);
        } catch (e) {
          console.error("Google init error:", e);
        }
      } else if (!hasRealClientId) {
        setGoogleReady(true);
      }
    };
    script.onerror = () => setGoogleReady(true);
    document.head.appendChild(script);
    return () => {
      if (signInPopupTimeoutRef.current) clearTimeout(signInPopupTimeoutRef.current);
      try { document.head.removeChild(script); } catch {}
    };
  }, [hasRealClientId, handleCredentialResponse]);

  const signIn = useCallback(() => {
    setAuthError(null);
    if (hasRealClientId && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.prompt();
        signInPopupTimeoutRef.current = setTimeout(() => {
          signInPopupTimeoutRef.current = null;
          setAuthError("popupBlocked");
        }, 10000);
      } catch (e) {
        console.error("Sign-in prompt error:", e);
        setAuthError("popupBlocked");
      }
    } else if (!hasRealClientId) {
      const demo = { id: "local_user", name: "Pilgrim", email: "local", picture: null };
      setUser(demo);
      try { localStorage.setItem("lumen_user", JSON.stringify(demo)); } catch {}
    }
  }, [hasRealClientId]);

  const signOut = useCallback(() => {
    setUser(null);
    setAuthError(null);
    try { localStorage.removeItem("lumen_user"); } catch {}
  }, []);

  return { user, loading, signIn, signOut, googleReady, authError };
}

function useJournal(user) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // Load from n8n on login, fallback to local storage
  useEffect(() => {
    if (!user) { setLoading(false); return; }
    (async () => {
      // Always load from localStorage first
      let localEntries = [];
      try {
        const r = localStorage.getItem(`lumen_journal_${user.id}`);
        if (r) localEntries = JSON.parse(r);
      } catch {}
      setEntries(localEntries);

      // Then try n8n for remote sync (merge if newer)
      if (CONFIG.N8N_LOAD_WEBHOOK !== "https://your-n8n-instance.com/webhook/lumen-journal-load") {
        try {
          const res = await fetch(CONFIG.N8N_LOAD_WEBHOOK, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id, email: user.email }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data.entries && data.entries.length > localEntries.length) {
              setEntries(data.entries);
              try { localStorage.setItem(`lumen_journal_${user.id}`, JSON.stringify(data.entries)); } catch {}
            }
          }
        } catch {}
      }
      setLoading(false);
    })();
  }, [user]);

  const syncToN8n = async (updated) => {
    if (!user || CONFIG.N8N_SAVE_WEBHOOK === "https://your-n8n-instance.com/webhook/lumen-journal-save") return;
    setSyncing(true);
    try {
      await fetch(CONFIG.N8N_SAVE_WEBHOOK, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, email: user.email, name: user.name, entries: updated }),
      });
    } catch {}
    setSyncing(false);
  };

  const addEntry = async (entry) => {
    const updated = [...entries, { ...entry, date: new Date().toISOString() }];
    setEntries(updated);
    try { localStorage.setItem(`lumen_journal_${user.id}`, JSON.stringify(updated)); } catch {}
    syncToN8n(updated);
  };

  const clearEntries = async () => {
    setEntries([]);
    try { localStorage.removeItem(`lumen_journal_${user.id}`); } catch {}
    syncToN8n([]);
  };

  return { entries, loading, syncing, addEntry, clearEntries };
}

// ═══════════════════════════════════════════════════════
// HOME
// ═══════════════════════════════════════════════════════
function HomeScreen({ setView, user, signIn, signOut }) {
  const { t, translations } = useLocale();
  const saintsQuotes = translations?.content?.saintsQuotes || [];
  const [qi] = useState(() => (saintsQuotes.length ? Math.floor(Math.random() * saintsQuotes.length) : 0));
  const q = saintsQuotes[qi] || { quote: "", saint: "" };

  const Card = ({ title, icon, desc, onClick, delay }) => {
    const [h, setH] = useState(false);
    return (
      <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
        background: h ? "rgba(191,155,48,0.1)" : S.cardBg, border: `1px solid rgba(191,155,48,${h ? 0.38 : 0.15})`,
        borderRadius: 16, padding: "20px 16px", cursor: "pointer", textAlign: "left",
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)", transform: h ? "translateY(-2px)" : "none",
        boxShadow: h ? "0 8px 28px rgba(191,155,48,0.1)" : "none", animation: `fadeUp 0.5s ease-out ${delay}s both`,
        display: "flex", flexDirection: "column", gap: 7,
      }}>
        <span style={{ fontSize: 26 }}>{icon}</span>
        <span style={{ fontFamily: S.heading, fontSize: 17, fontWeight: 600, color: S.gold }}>{title}</span>
        <span style={{ fontFamily: S.body, fontSize: 11.5, color: S.textDim, lineHeight: 1.45 }}>{desc}</span>
      </button>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "28px 20px", maxWidth: 560, margin: "0 auto" }}>
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: 28, animation: "fadeUp 0.5s ease-out" }}>
        <div style={{ animation: "crossGlow 4s ease-in-out infinite, float 6s ease-in-out infinite", marginBottom: 12, display: "inline-block" }}>
          <CrossIcon size={40} color={S.gold} />
        </div>
        <h1 style={{
          fontFamily: S.heading, fontSize: 48, fontWeight: 300, letterSpacing: "0.15em", marginBottom: 4,
          background: `linear-gradient(135deg, ${S.gold} 0%, ${S.goldLight} 50%, ${S.gold} 100%)`, backgroundSize: "200% auto",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "shimmer 6s linear infinite",
        }}>LUMEN</h1>
        <p style={{ fontFamily: S.heading, fontSize: 12, letterSpacing: "0.25em", color: "rgba(191,155,48,0.45)", textTransform: "uppercase", marginBottom: 22 }}>{t("home.tagline")}</p>
        <div style={{ maxWidth: 360, margin: "0 auto", padding: "15px 18px", background: "rgba(191,155,48,0.04)", borderRadius: 11, borderLeft: "3px solid rgba(191,155,48,0.18)" }}>
          <p style={{ fontFamily: S.heading, fontSize: 15.5, fontStyle: "italic", lineHeight: 1.6, color: "rgba(245,236,215,0.68)", marginBottom: 4 }}>"{q.quote}"</p>
          <p style={{ fontFamily: S.body, fontSize: 11, color: "rgba(191,155,48,0.5)" }}>— {q.saint}</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, width: "100%", marginBottom: 12 }}>
        <Card title={t("home.holyRosary")} icon="📿" desc={t("home.holyRosaryDesc")} onClick={() => setView(VIEWS.ROSARY)} delay={0.08} />
        <Card title={t("home.dailyExamen")} icon="🕯️" desc={t("home.dailyExamenDesc")} onClick={() => setView(VIEWS.EXAMEN)} delay={0.13} />
        <Card title={t("home.confessionPrep")} icon="💧" desc={t("home.confessionPrepDesc")} onClick={() => setView(VIEWS.CONFESSION)} delay={0.18} />
        <Card title={t("home.prayerLibrary")} icon="📖" desc={t("home.prayerLibraryDesc")} onClick={() => setView(VIEWS.PRAYERS)} delay={0.23} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, width: "100%", marginBottom: 12 }}>
        <Card title={t("home.prayerJournal")} icon="✍️" desc={user ? t("home.prayerJournalDescSynced", { name: user.id === "local_user" ? t("common.demoUserName") : user.name }) : t("home.prayerJournalDescGuest")} onClick={() => setView(VIEWS.JOURNAL)} delay={0.28} />
        <Card title={t("home.dailyGospel")} icon="📜" desc={t("home.dailyGospelDesc")} onClick={() => setView(VIEWS.GOSPEL)} delay={0.3} />
      </div>

      <p style={{ fontFamily: S.heading, fontSize: 11.5, color: "rgba(245,236,215,0.22)", textAlign: "center", lineHeight: 1.6, maxWidth: 300, animation: "fadeUp 0.5s ease-out 0.4s both" }}>
        {t("home.disclaimer")}<br/><em>{t("home.amdg")}</em>
      </p>
    </div>
  );
}

// Map day string to translation key
const MYSTERY_DAY_KEYS = { "Monday & Saturday": "dayMondaySaturday", "Tuesday & Friday": "dayTuesdayFriday", "Wednesday & Sunday": "dayWednesdaySunday", "Thursday": "dayThursday" };

// ═══════════════════════════════════════════════════════
// ROSARY — COMPLETE TRADITIONAL STRUCTURE
// ═══════════════════════════════════════════════════════
function RosarySelect({ onSelect, onBack }) {
  const { t } = useLocale();
  const todayM = ["Glorious","Joyful","Sorrowful","Glorious","Luminous","Sorrowful","Joyful"][new Date().getDay()];
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header title={t("rosary.title")} subtitle={t("rosary.chooseMysteries")} onBack={onBack} />
      <div style={{ padding: 20, maxWidth: 540, margin: "0 auto", width: "100%" }}>
        <p style={{ fontFamily: S.heading, fontSize: 15, color: S.textDim, textAlign: "center", marginBottom: 20, fontStyle: "italic" }}>
          {t("rosary.todayMysteries")} <strong style={{ color: S.gold }}>{t(`mysteries.${todayM}`)}</strong>
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {Object.entries(MYSTERY_META).map(([name, meta], i) => (
            <button key={name} onClick={() => onSelect(name)} style={{
              background: name === todayM ? `${meta.color}15` : S.cardBg, border: `1px solid ${name === todayM ? meta.color + "44" : S.borderDim}`,
              borderRadius: 13, padding: "18px 15px", cursor: "pointer", textAlign: "left", transition: "all 0.3s",
              animation: `fadeUp 0.4s ease-out ${i * 0.07}s both`,
            }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: meta.color, marginBottom: 9, boxShadow: `0 0 10px ${meta.color}44` }} />
              <div style={{ fontFamily: S.heading, fontSize: 18, fontWeight: 600, color: meta.color, marginBottom: 2 }}>{t(`mysteries.${name}`)}</div>
              <div style={{ fontFamily: S.body, fontSize: 11, color: S.textDim }}>{t(`mysteries.${MYSTERY_DAY_KEYS[meta.day]}`)}</div>
              {name === todayM && <div style={{ fontFamily: S.body, fontSize: 10.5, color: meta.color, marginTop: 5, fontWeight: 600 }}>★ {t("common.today")}</div>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function RosaryPray({ mysterySet, onBack }) {
  const { t, translations } = useLocale();
  const content = translations?.content;
  const meta = MYSTERY_META[mysterySet];
  const ordinals = translations?.rosary?.mysteryOrdinals || ["1st", "2nd", "3rd", "4th", "5th"];

  const steps = useMemo(() => {
    if (!content?.prayers || !content?.mysteries?.[mysterySet]) return [];
    const pr = content.prayers;
    const pt = content.prayerTitles;
    const mysteriesList = content.mysteries[mysterySet];
    const out = [];
    out.push({ type: "prayer", title: pt.signOfCross, text: pr.signOfCross, section: "opening" });
    out.push({ type: "prayer", title: pt.creed, text: pr.creed, section: "opening" });
    out.push({ type: "prayer", title: pt.ourFather, text: pr.ourFather, section: "opening", note: true });
    out.push({ type: "prayer", title: pt.hailMaryFaith, text: pr.hailMary, section: "opening" });
    out.push({ type: "prayer", title: pt.hailMaryHope, text: pr.hailMary, section: "opening" });
    out.push({ type: "prayer", title: pt.hailMaryCharity, text: pr.hailMary, section: "opening" });
    out.push({ type: "prayer", title: pt.gloryBe, text: pr.gloryBe, section: "opening" });
    mysteriesList.forEach((m, mi) => {
      out.push({ type: "mystery", title: m.title, fruit: m.fruit, scripture: m.scripture, meditation: m.meditation, decadeNum: mi + 1, section: "decade" });
      out.push({ type: "prayer", title: pt.ourFather, text: pr.ourFather, section: "decade", decadeNum: mi + 1 });
      const hailMaryDecadeTemplate = translations?.rosary?.hailMaryDecade || "Hail Mary {n}/10";
      for (let hm = 1; hm <= 10; hm++) {
        out.push({ type: "hail_mary", title: hailMaryDecadeTemplate.replace("{n}", hm), text: pr.hailMary, hmNum: hm, decadeNum: mi + 1, mysteryTitle: m.title, section: "decade" });
      }
      out.push({ type: "prayer", title: pt.gloryBe, text: pr.gloryBe, section: "decade", decadeNum: mi + 1 });
      out.push({ type: "prayer", title: pt.fatima, text: pr.fatima, section: "decade", decadeNum: mi + 1 });
    });
    out.push({ type: "prayer", title: pt.hailHolyQueen, text: pr.hailHolyQueen, section: "closing" });
    out.push({ type: "litany", title: translations?.rosary?.litanyOfLoreto || "Litany of Loreto", section: "closing" });
    out.push({ type: "prayer", title: pt.closingPrayer, text: pr.closingPrayer, section: "closing" });
    out.push({ type: "prayer", title: pt.signOfCross, text: pr.signOfCross, section: "closing" });
    return out;
  }, [mysterySet, content, translations]);

  const [si, setSi] = useState(0);
  const totalSteps = steps.length;
  const d = meta ? { color: meta.color } : { color: S.gold };

  if (totalSteps === 0) return null;

  if (si >= totalSteps) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header title={t("rosary.rosaryComplete")} onBack={onBack} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 20, animation: "float 3s ease-in-out infinite" }}>📿</div>
          <h2 style={{ fontFamily: S.heading, fontSize: 28, color: S.gold, marginBottom: 16 }}>{t("rosary.amen")}</h2>
          <p style={{ fontFamily: S.body, fontSize: 14, color: "rgba(245,236,215,0.6)", maxWidth: 400, lineHeight: 1.7 }}>
            {t("rosary.mayTheyRest")}
          </p>
          <div style={{ marginTop: 28 }}><Btn onClick={onBack} color={S.gold}>{t("common.returnHome")}</Btn></div>
        </div>
      </div>
    );
  }

  const step = steps[si];
  const currentDecade = step.decadeNum || 0;
  const segmentIndex = step.section === "opening" ? 0 : step.section === "closing" ? 6 : Math.min(5, Math.max(1, currentDecade));

  const getSectionLabel = () => {
    if (step.section === "opening") return t("rosary.openingPrayers");
    if (step.section === "closing") return t("rosary.closingPrayers");
    return t("rosary.decadeOf", { n: currentDecade });
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header title={t(`mysteries.${mysterySet}Mysteries`)} subtitle={getSectionLabel()} onBack={onBack} />
      <RosaryProgressBar segmentIndex={segmentIndex} color={d.color} />

      {/* Hail Mary bead counter */}
      {step.type === "hail_mary" && (
        <div style={{ display: "flex", justifyContent: "center", gap: 6, padding: "10px 20px", flexShrink: 0 }}>
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} style={{
              width: i < step.hmNum ? 11 : 8, height: i < step.hmNum ? 11 : 8, borderRadius: "50%",
              background: i < step.hmNum ? d.color : "rgba(191,155,48,0.12)",
              border: i + 1 === step.hmNum ? `2px solid ${d.color}` : "none",
              boxShadow: i + 1 === step.hmNum ? `0 0 8px ${d.color}44` : "none", transition: "all 0.3s",
            }} />
          ))}
        </div>
      )}

      {/* Content */}
      <div key={si} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 22px", textAlign: "center", overflow: "auto", animation: "fadeUp 0.3s ease-out" }}>
        {step.type === "mystery" ? (
          <>
            <div style={{ fontFamily: S.body, fontSize: 12, color: d.color, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
              {ordinals[step.decadeNum - 1]} {t("rosary.mysteryWord")} — {t("rosary.fruit")} {step.fruit}
            </div>
            <h3 style={{ fontFamily: S.heading, fontSize: 28, fontWeight: 500, color: d.color, marginBottom: 16 }}>{step.title}</h3>
            <p style={{ fontFamily: S.body, fontSize: 13.5, color: S.textDim, fontStyle: "italic", marginBottom: 14, maxWidth: 460, lineHeight: 1.6 }}>{step.scripture}</p>
            <p style={{ fontFamily: S.body, fontSize: 15, color: "rgba(245,236,215,0.82)", lineHeight: 1.8, maxWidth: 480 }}>{step.meditation}</p>
          </>
        ) : step.type === "litany" ? (
          <div style={{ maxWidth: 480, width: "100%", textAlign: "left" }}>
            <h3 style={{ fontFamily: S.heading, fontSize: 24, color: S.gold, marginBottom: 18, textAlign: "center" }}>{t("rosary.litanyOfLoreto")}</h3>
            <div style={{ maxHeight: 350, overflowY: "auto", paddingRight: 4 }}>
              {(content?.litany || []).map((line, i) => (
                <div key={i} style={{ marginBottom: 8, fontSize: 13, fontFamily: S.body, lineHeight: 1.5 }}>
                  <p style={{ color: "rgba(245,236,215,0.75)" }}>{line.v}</p>
                  <p style={{ color: S.gold, fontStyle: "italic", paddingLeft: 16 }}>{line.r}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <h3 style={{ fontFamily: S.heading, fontSize: 25, fontWeight: 500, color: d.color, marginBottom: 14 }}>{step.title}</h3>
            {step.note === true && <p style={{ fontFamily: S.body, fontSize: 12.5, color: S.textDim, fontStyle: "italic", marginBottom: 10 }}>{t("rosary.forIntentionsOfHolyFather")}</p>}
            {step.type === "hail_mary" && <p style={{ fontFamily: S.body, fontSize: 12, color: `${d.color}88`, marginBottom: 10 }}>{t("rosary.meditatingOn")} {step.mysteryTitle}</p>}
            <p style={{ fontFamily: S.body, fontSize: 15.5, color: "rgba(245,236,215,0.85)", lineHeight: 1.8, maxWidth: 480, whiteSpace: "pre-line" }}>{step.text}</p>
          </>
        )}
      </div>

      {/* Navigation */}
      <div style={{ padding: "12px 20px 20px", display: "flex", gap: 10, flexShrink: 0 }}>
        <OutBtn onClick={() => setSi(Math.max(0, si - 1))} disabled={si === 0}>←</OutBtn>
        <div style={{ flex: 2 }}>
          <button onClick={() => si < totalSteps - 1 ? setSi(si + 1) : setSi(totalSteps)} style={{
            width: "100%", background: `linear-gradient(135deg, ${d.color}, ${d.color}cc)`, border: "none", borderRadius: 13,
            padding: "14px", cursor: "pointer", fontFamily: S.heading, fontSize: 16, fontWeight: 600, color: "#fff",
            boxShadow: `0 4px 14px ${d.color}33`,
          }}>
            {si < totalSteps - 1 ? t("common.continue") : t("common.complete")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// CONFESSION PREP
// ═══════════════════════════════════════════════════════
function ConfessionPrep({ onBack }) {
  const { t, translations } = useLocale();
  const commandmentExam = translations?.content?.commandmentExam || [];
  const actOfContritionText = translations?.content?.prayers?.actOfContrition || "";
  const [ci, setCi] = useState(0);
  const [checked, setChecked] = useState({});
  const [done, setDone] = useState(false);
  const toggle = (c, q) => { const k = `${c}-${q}`; setChecked(p => ({ ...p, [k]: !p[k] })); };
  const sinCount = Object.values(checked).filter(Boolean).length;

  if (done) {
    const sins = [];
    commandmentExam.forEach((c, ci2) => c.questions.forEach((q, qi) => { if (checked[`${ci2}-${qi}`]) sins.push(q); }));
    const summarySub = sins.length !== 1 ? t("confession.summarySubtitlePlural", { count: sins.length }) : t("confession.summarySubtitle", { count: sins.length });
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header title={t("confession.summaryTitle")} subtitle={summarySub} onBack={onBack} />
        <div style={{ flex: 1, padding: 20, maxWidth: 540, margin: "0 auto", width: "100%", overflow: "auto" }}>
          <div style={{ textAlign: "center", marginBottom: 22, padding: 18, background: "rgba(191,155,48,0.04)", borderRadius: 12, borderLeft: "3px solid rgba(191,155,48,0.2)" }}>
            <p style={{ fontFamily: S.heading, fontSize: 17, color: S.gold, marginBottom: 5 }}>{t("confession.quote")}</p>
            <p style={{ fontFamily: S.body, fontSize: 11.5, color: S.textDim }}>{t("confession.quoteRef")}</p>
          </div>
          {sins.length > 0 ? sins.map((s, i) => (
            <p key={i} style={{ fontFamily: S.body, fontSize: 13, color: "rgba(245,236,215,0.68)", marginBottom: 9, paddingLeft: 13, borderLeft: "2px solid rgba(191,155,48,0.15)", lineHeight: 1.5 }}>{s}</p>
          )) : <p style={{ fontFamily: S.body, fontSize: 13.5, color: S.textDim, textAlign: "center" }}>{t("confession.noItemsChecked")}</p>}
          <div style={{ marginTop: 24, padding: 16, background: "rgba(139,58,58,0.07)", borderRadius: 12, border: "1px solid rgba(139,58,58,0.15)" }}>
            <h4 style={{ fontFamily: S.heading, fontSize: 16, color: "#d4a0a0", marginBottom: 8 }}>{t("confession.actOfContrition")}</h4>
            <p style={{ fontFamily: S.body, fontSize: 13, color: "rgba(245,236,215,0.78)", lineHeight: 1.75 }}>{actOfContritionText}</p>
          </div>
          <div style={{ marginTop: 18 }}><Btn full onClick={onBack} color={S.gold}>{t("common.returnHome")}</Btn></div>
        </div>
      </div>
    );
  }

  const cmd = commandmentExam[ci];
  if (!cmd) return null;
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header title={t("confession.title")} subtitle={t("confession.subtitle", { current: ci + 1, count: sinCount })} onBack={onBack} />
      <ProgressBar total={10} current={ci} />
      <div style={{ flex: 1, padding: 20, maxWidth: 540, margin: "0 auto", width: "100%", overflow: "auto" }}>
        <h3 key={ci} style={{ fontFamily: S.heading, fontSize: 19, color: S.gold, marginBottom: 16, lineHeight: 1.4, animation: "fadeUp 0.3s ease-out" }}>{cmd.commandment}</h3>
        {cmd.questions.map((q, qi) => {
          const on = checked[`${ci}-${qi}`];
          return (
            <button key={qi} onClick={() => toggle(ci, qi)} style={{
              display: "flex", alignItems: "flex-start", gap: 12, width: "100%", padding: "12px 14px", marginBottom: 8,
              background: on ? "rgba(139,58,58,0.08)" : S.cardBg, border: `1px solid ${on ? "rgba(139,58,58,0.25)" : S.borderDim}`,
              borderRadius: 10, cursor: "pointer", textAlign: "left", transition: "all 0.2s",
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: 5, border: `2px solid ${on ? "#8B3A3A" : "rgba(191,155,48,0.2)"}`,
                background: on ? "#8B3A3A" : "transparent", display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, marginTop: 1,
              }}>{on && <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>✓</span>}</div>
              <span style={{ fontFamily: S.body, fontSize: 13.5, color: "rgba(245,236,215,0.75)", lineHeight: 1.5 }}>{q}</span>
            </button>
          );
        })}
      </div>
      <div style={{ padding: "12px 20px 20px", display: "flex", gap: 10, flexShrink: 0 }}>
        <OutBtn onClick={() => setCi(Math.max(0, ci-1))} disabled={ci === 0}>←</OutBtn>
        <div style={{ flex: 1.5 }}><Btn full onClick={() => ci < 9 ? setCi(ci+1) : setDone(true)} color={S.gold}>{ci < 9 ? t("common.next") : t("common.summary")}</Btn></div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// DAILY GOSPEL (RSS: ACI Prensa / USCCB)
// ═══════════════════════════════════════════════════════
function decodeHtmlEntities(str) {
  if (!str) return str;
  const el = document.createElement("span");
  el.innerHTML = str;
  return el.textContent || str;
}

function parseGospelRss(xmlText) {
  const doc = new DOMParser().parseFromString(xmlText, "text/xml");
  const items = doc.getElementsByTagName("item");
  const item = items[0];
  if (!item) return null;
  const titleEl = item.getElementsByTagName("title")[0];
  const descEl = item.getElementsByTagName("description")[0];
  const dayTitle = decodeHtmlEntities((titleEl?.textContent || "").trim());
  const descriptionHtml = (descEl?.textContent || "").trim();
  if (!descriptionHtml) return { dayTitle, readings: [] };
  const htmlDoc = new DOMParser().parseFromString(descriptionHtml, "text/html");
  const readings = [];

  // ACI Prensa (Spanish): <h3>reference</h3> + <div class="readings__verse-container"> with <span class="readings__text">
  const verseContainers = htmlDoc.body.querySelectorAll(".readings__verse-container");
  if (verseContainers.length > 0) {
    const h3s = htmlDoc.body.querySelectorAll("h3");
    h3s.forEach((h3) => {
      const subtitle = decodeHtmlEntities(h3.textContent.trim());
      const parent = h3.closest("div");
      if (!parent) return;
      const verseDivs = parent.querySelectorAll(".readings__verse-container");
      const parts = [];
      verseDivs.forEach((div) => {
        const textSpan = div.querySelector(".readings__text");
        if (textSpan) {
          const raw = textSpan.innerHTML.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "").trim();
          const t = decodeHtmlEntities(raw);
          if (t) parts.push(t);
        }
      });
      const text = parts.join("\n\n");
      if (subtitle) readings.push({ subtitle, text });
    });
  }

  // USCCB (English) or legacy: <h4> + <div class="poetry"><p>...</p></div>
  if (readings.length === 0) {
    const h4s = htmlDoc.body.querySelectorAll("h4");
    h4s.forEach((h4) => {
      const subtitle = decodeHtmlEntities(h4.textContent.trim());
      let text = "";
      let next = h4.nextElementSibling;
      if (next && (next.classList.contains("poetry") || next.tagName === "DIV")) {
        const p = next.querySelector("p");
        if (p) {
          const raw = p.innerHTML.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "").trim();
          text = decodeHtmlEntities(raw);
        }
      }
      if (subtitle) readings.push({ subtitle, text });
    });
  }

  return { dayTitle, readings };
}

function DailyGospel({ onBack }) {
  const { t, locale } = useLocale();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const dateKey = useMemo(() => new Date().toISOString().slice(0, 10).replace(/-/g, ""), []);

  useEffect(() => {
    const cacheKey = `${GOSPEL_CACHE_PREFIX}${locale}_${dateKey}`;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        setData(parsed);
        setLoading(false);
        return;
      }
    } catch (_) {}

    const url = getGospelRssUrl(locale);
    fetch(url, { mode: "cors" })
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error("Fetch failed"))))
      .then((xmlText) => {
        const parsed = parseGospelRss(xmlText);
        if (parsed && (parsed.dayTitle || parsed.readings?.length)) {
          setData(parsed);
          try {
            localStorage.setItem(cacheKey, JSON.stringify(parsed));
          } catch (_) {}
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [locale, dateKey]);

  const sourceLabel = locale === LOCALES.ES_ES ? t("gospel.sourceAciprensa") : t("gospel.sourceUsccb");

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header title={t("gospel.title")} onBack={onBack} />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
          <p style={{ fontFamily: S.body, fontSize: 14, color: S.textDim }}>{t("gospel.loading")}</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header title={t("gospel.title")} onBack={onBack} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center" }}>
          <p style={{ fontFamily: S.body, fontSize: 14, color: S.textDim, marginBottom: 16 }}>{t("gospel.error")}</p>
          <Btn onClick={onBack} color={S.gold}>{t("common.returnHome")}</Btn>
        </div>
      </div>
    );
  }

  const { dayTitle, readings } = data;
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header title={t("gospel.title")} onBack={onBack} />
      <div style={{ flex: 1, padding: "20px 20px 24px", maxWidth: 560, margin: "0 auto", width: "100%", overflow: "auto" }}>
        <h1 style={{ fontFamily: S.heading, fontSize: 26, fontWeight: 600, color: S.gold, textAlign: "center", marginBottom: 24, lineHeight: 1.3 }}>
          {dayTitle}
        </h1>
        {readings.map((r, i) => (
          <div key={i} style={{ marginBottom: 24, padding: "16px 18px", background: S.cardBg, border: `1px solid ${S.borderDim}`, borderRadius: 12 }}>
            <h4 style={{ fontFamily: S.heading, fontSize: 16, fontWeight: 600, color: S.gold, marginBottom: 10, letterSpacing: "0.02em" }}>
              {r.subtitle}
            </h4>
            <p style={{ fontFamily: S.body, fontSize: 14, color: "rgba(245,236,215,0.88)", lineHeight: 1.65, whiteSpace: "pre-line", textAlign: "left" }}>
              {r.text}
            </p>
          </div>
        ))}
        <p style={{ fontFamily: S.body, fontSize: 11, color: "rgba(245,236,215,0.35)", textAlign: "center", marginTop: 8 }}>
          {sourceLabel}
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// DAILY EXAMEN
// ═══════════════════════════════════════════════════════
function DailyExamen({ onBack, addJournalEntry, user, signIn, googleReady = true, authError = null }) {
  const { t, translations } = useLocale();
  const examenSteps = translations?.content?.examenSteps || [];
  const [si, setSi] = useState(0);
  const [notes, setNotes] = useState({});
  const [phase, setPhase] = useState("praying"); // praying | saving | done | prompt_signin
  const [pendingEntry, setPendingEntry] = useState(null);
  const [didSave, setDidSave] = useState(false);

  // When user signs in after "prompt_signin", save pending entry and go to done
  useEffect(() => {
    if (phase !== "prompt_signin" || !addJournalEntry || !pendingEntry) return;
    addJournalEntry(pendingEntry);
    setPendingEntry(null);
    setDidSave(true);
    setPhase("saving");
    const tId = setTimeout(() => setPhase("done"), 1200);
    return () => clearTimeout(tId);
  }, [phase, addJournalEntry, pendingEntry]);

  const handleComplete = () => {
    const noteValues = Object.values(notes).filter(Boolean);
    if (noteValues.length > 0) {
      const labeledNotes = {};
      examenSteps.forEach((step, i) => {
        if (notes[i]) labeledNotes[step.title] = notes[i];
      });
      const entry = { notes: labeledNotes, type: "examen" };
      if (addJournalEntry) {
        setDidSave(true);
        addJournalEntry(entry);
        setPhase("saving");
        setTimeout(() => setPhase("done"), 1200);
      } else {
        setPendingEntry(entry);
        setPhase("prompt_signin");
      }
    } else {
      setDidSave(false);
      setPhase("done");
    }
  };

  if (phase === "prompt_signin") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header title={t("examen.title")} onBack={onBack} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🔐</div>
          <h3 style={{ fontFamily: S.heading, fontSize: 22, color: S.gold, marginBottom: 10 }}>{t("examen.signInToSave")}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 320, marginTop: 20 }}>
            <button onClick={signIn} disabled={!googleReady} style={{
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 10,
              padding: "12px 20px", cursor: googleReady ? "pointer" : "wait", color: S.text, fontFamily: S.body, fontSize: 14,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            }}>
              <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
              {googleReady ? t("common.signInWithGoogle") : t("common.loadingSignIn")}
            </button>
            {authError === "popupBlocked" && <p style={{ fontFamily: S.body, fontSize: 11, color: S.textDim, marginTop: 4 }}>{t("common.signInPopupBlocked")}</p>}
            <button onClick={() => { setPendingEntry(null); setPhase("done"); setDidSave(false); }} style={{
              background: "none", border: "1px solid rgba(191,155,48,0.25)", borderRadius: 10,
              padding: "12px 20px", cursor: "pointer", color: S.textDim, fontFamily: S.body, fontSize: 13,
            }}>
              {t("examen.continueWithoutSaving")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "saving") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header title={t("examen.title")} subtitle={t("examen.savingReflections")} onBack={onBack} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center" }}>
          <div style={{ width: 32, height: 32, border: "3px solid rgba(191,155,48,0.2)", borderTop: `3px solid ${S.gold}`, borderRadius: "50%", animation: "spin 0.8s linear infinite", marginBottom: 18 }} />
          <p style={{ fontFamily: S.body, fontSize: 15, color: S.gold }}>{t("examen.savingYourReflections")}</p>
        </div>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header title={t("examen.completeTitle")} onBack={onBack} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 18, animation: "float 3s ease-in-out infinite" }}>🕯️</div>
          <h2 style={{ fontFamily: S.heading, fontSize: 26, color: S.gold, marginBottom: 8 }}>{t("examen.wellDone")}</h2>
          <p style={{ fontFamily: S.body, fontSize: 13.5, color: "rgba(245,236,215,0.55)", maxWidth: 360, lineHeight: 1.7, marginBottom: 24 }}>{didSave ? t("examen.reflectionsSaved") : t("examen.completeNoSave")}</p>
          <Btn onClick={onBack} color={S.gold}>{t("common.returnHome")}</Btn>
        </div>
      </div>
    );
  }

  const s = examenSteps[si];
  const showTextarea = si > 0;
  if (!s) return null;
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header title={t("examen.title")} subtitle={`${t("examen.step", { n: si + 1 })} — ${s.title}`} onBack={onBack} />
      <div style={{ display: "flex", padding: "9px 20px", gap: 7, flexShrink: 0 }}>
        {examenSteps.map((x, i) => <div key={i} style={{ flex: 1, textAlign: "center", opacity: i === si ? 1 : 0.3, transition: "all 0.3s" }}><div style={{ fontSize: 16 }}>{x.icon}</div><div style={{ fontFamily: S.body, fontSize: 9, color: "rgba(245,236,215,0.5)" }}>{x.title}</div></div>)}
      </div>
      <div style={{ flex: 1, padding: "16px 22px", maxWidth: 540, margin: "0 auto", width: "100%", overflow: "auto" }}>
        <div key={si} style={{ animation: "fadeUp 0.3s ease-out" }}>
          <h3 style={{ fontFamily: S.heading, fontSize: 24, color: S.gold, marginBottom: 9 }}>{s.icon} {s.title}</h3>
          <p style={{ fontFamily: S.body, fontSize: 14, color: "rgba(245,236,215,0.78)", lineHeight: 1.7, marginBottom: 12 }}>{s.instruction}</p>
          <p style={{ fontFamily: S.heading, fontSize: 14, fontStyle: "italic", color: "rgba(191,155,48,0.55)", marginBottom: 18, lineHeight: 1.5 }}>{s.prompt}</p>
          {s.questions.map((q, i) => <div key={i} style={{ padding: "9px 0", borderBottom: "1px solid rgba(191,155,48,0.06)" }}><p style={{ fontFamily: S.body, fontSize: 13.5, color: "rgba(245,236,215,0.55)", lineHeight: 1.5 }}>{q}</p></div>)}
          {showTextarea && <textarea placeholder={t("examen.yourReflections")} value={notes[si] || ""} onChange={e => setNotes({ ...notes, [si]: e.target.value })}
            style={{ width: "100%", marginTop: 16, padding: "12px 14px", background: "rgba(255,248,235,0.04)", border: `1px solid ${S.borderDim}`, borderRadius: 10, color: S.text, fontFamily: S.body, fontSize: 16, lineHeight: 1.6, minHeight: 80, resize: "vertical" }} />}
        </div>
      </div>
      <div style={{ padding: "12px 20px 20px", display: "flex", gap: 10, flexShrink: 0 }}>
        <OutBtn onClick={() => setSi(Math.max(0, si-1))} disabled={si === 0}>←</OutBtn>
        <div style={{ flex: 1.5 }}><Btn full onClick={() => si < 4 ? setSi(si + 1) : handleComplete()} color={S.gold}>{si < 4 ? t("common.continue") : t("common.completeExamen")}</Btn></div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// PRAYER LIBRARY
// ═══════════════════════════════════════════════════════
function PrayerLibrary({ onBack }) {
  const { t, translations } = useLocale();
  const content = translations?.content;
  const prayerLibrary = content?.prayerLibrary || [];
  const prayersContent = content?.prayers || {};
  // Resolve categories to { name, prayers: [{ title, text }] }
  const categories = useMemo(() => prayerLibrary.map(cat => ({
    name: t(`prayers.${cat.nameKey}`),
    prayers: cat.prayers.map(p => ({
      title: p.title,
      text: p.text !== undefined ? p.text : (p.textKey ? prayersContent[p.textKey] : ""),
    })),
  })), [prayerLibrary, prayersContent, t]);
  const [sel, setSel] = useState(null); // { ci, pi } so content updates when locale changes
  const [exp, setExp] = useState(0);
  const selectedPrayer = sel != null && categories[sel.ci]?.prayers[sel.pi] ? categories[sel.ci].prayers[sel.pi] : null;
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header title={t("prayers.title")} onBack={onBack} />
      <div style={{ flex: 1, padding: 20, maxWidth: 540, margin: "0 auto", width: "100%", overflow: "auto" }}>
        {selectedPrayer ? (
          <div style={{ animation: "fadeUp 0.3s ease-out" }}>
            <button onClick={() => setSel(null)} style={{ background: "none", border: "none", color: S.gold, fontFamily: S.body, fontSize: 13, cursor: "pointer", marginBottom: 16 }}>{t("common.allPrayers")}</button>
            <h3 style={{ fontFamily: S.heading, fontSize: 24, color: S.gold, marginBottom: 16 }}>{selectedPrayer.title}</h3>
            <p style={{ fontFamily: S.body, fontSize: 15, color: "rgba(245,236,215,0.83)", lineHeight: 1.85, whiteSpace: "pre-line" }}>{selectedPrayer.text}</p>
          </div>
        ) : categories.map((cat, ci) => (
          <div key={ci} style={{ marginBottom: 13 }}>
            <button onClick={() => setExp(exp === ci ? -1 : ci)} style={{
              width: "100%", textAlign: "left", padding: "14px 16px", background: exp === ci ? "rgba(191,155,48,0.05)" : S.cardBg,
              border: `1px solid ${S.borderDim}`, borderRadius: exp === ci ? "10px 10px 0 0" : 10, cursor: "pointer",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span style={{ fontFamily: S.heading, fontSize: 17, fontWeight: 600, color: S.gold }}>{cat.name}</span>
              <span style={{ color: "rgba(191,155,48,0.35)", fontSize: 15, transform: exp === ci ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
            </button>
            {exp === ci && <div style={{ border: `1px solid ${S.borderDim}`, borderTop: "none", borderRadius: "0 0 10px 10px" }}>
              {cat.prayers.map((p, pi) => <button key={pi} onClick={() => setSel({ ci, pi })} style={{ width: "100%", textAlign: "left", padding: "12px 16px", background: "transparent", border: "none", borderBottom: pi < cat.prayers.length - 1 ? "1px solid rgba(191,155,48,0.06)" : "none", cursor: "pointer", fontFamily: S.body, fontSize: 14, color: "rgba(245,236,215,0.68)" }}>{p.title}</button>)}
            </div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// JOURNAL (WITH N8N SYNC)
// ═══════════════════════════════════════════════════════
function JournalView({ onBack, journal, user, signIn, googleReady = true, authError = null }) {
  const { t, locale } = useLocale();
  const [text, setText] = useState("");
  if (!user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header title={t("journal.title")} onBack={onBack} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🔐</div>
          <h3 style={{ fontFamily: S.heading, fontSize: 22, color: S.gold, marginBottom: 10 }}>{t("journal.signInTitle")}</h3>
          <p style={{ fontFamily: S.body, fontSize: 13.5, color: S.textDim, maxWidth: 340, lineHeight: 1.6, marginBottom: 24 }}>{t("journal.signInDesc")}</p>
          <button onClick={signIn} disabled={!googleReady} style={{
            background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 10,
            padding: "12px 24px", cursor: googleReady ? "pointer" : "wait", color: S.text, fontFamily: S.body, fontSize: 14,
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            {googleReady ? t("common.signInWithGoogle") : t("common.loadingSignIn")}
          </button>
          {authError === "popupBlocked" && <p style={{ fontFamily: S.body, fontSize: 11, color: S.textDim, marginTop: 12, maxWidth: 320 }}>{t("common.signInPopupBlocked")}</p>}
        </div>
      </div>
    );
  }

  const { entries, loading, syncing, addEntry, clearEntries } = journal;
  const entriesSubtitle = syncing ? t("common.syncing") : t("journal.entriesCount", { n: entries.length }) + (entries.length !== 1 ? t("journal.entriesCountPlural") : t("journal.entriesCountSingular"));

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header title={t("journal.title")} subtitle={entriesSubtitle} onBack={onBack} />
      <div style={{ flex: 1, padding: 20, maxWidth: 540, margin: "0 auto", width: "100%", overflow: "auto" }}>
        <div style={{ marginBottom: 20 }}>
          <textarea placeholder={t("journal.placeholder")} value={text} onChange={e => setText(e.target.value)}
            style={{ width: "100%", padding: "12px 14px", background: "rgba(255,248,235,0.04)", border: `1px solid ${S.borderDim}`, borderRadius: 10, color: S.text, fontFamily: S.body, fontSize: 13, lineHeight: 1.6, minHeight: 70, resize: "vertical", marginBottom: 8 }} />
          <Btn full onClick={() => { addEntry({ notes: { 0: text.trim() }, type: "reflection" }); setText(""); }} disabled={!text.trim()} color={S.gold}>{t("common.saveReflection")}</Btn>
        </div>
        {loading ? <p style={{ textAlign: "center", color: S.textDim, fontFamily: S.body }}>{t("common.loading")}</p>
        : entries.length === 0 ? (
          <div style={{ textAlign: "center", padding: 24, color: S.textDim }}>
            <p style={{ fontSize: 28, marginBottom: 8 }}>📖</p>
            <p style={{ fontFamily: S.heading, fontSize: 16 }}>{t("journal.emptyTitle")}</p>
            <p style={{ fontFamily: S.body, fontSize: 11.5, marginTop: 5 }}>{t("journal.emptyDesc")}</p>
          </div>
        ) : <>
          {[...entries].reverse().map((e, i) => (
            <div key={i} style={{ padding: "13px 15px", marginBottom: 9, background: S.cardBg, border: `1px solid ${S.borderDim}`, borderRadius: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontFamily: S.body, fontSize: 10.5, color: "rgba(191,155,48,0.4)" }}>{new Date(e.date).toLocaleDateString(locale, { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</span>
                <span style={{ fontFamily: S.body, fontSize: 10.5, color: e.type === "examen" ? "rgba(191,155,48,0.5)" : "rgba(245,236,215,0.3)", textTransform: "capitalize", fontWeight: e.type === "examen" ? 600 : 400 }}>{e.type === "examen" ? t("journal.typeExamen") : t("journal.typeReflection")}</span>
              </div>
              {Object.entries(e.notes || {}).filter(([_, v]) => v).map(([key, val], ni) => (
                <div key={ni} style={{ marginTop: ni > 0 ? 8 : 0 }}>
                  {isNaN(key) && <p style={{ fontFamily: S.heading, fontSize: 12, color: "rgba(191,155,48,0.45)", marginBottom: 2, letterSpacing: "0.05em" }}>{key}</p>}
                  <p style={{ fontFamily: S.body, fontSize: 13, color: "rgba(245,236,215,0.68)", lineHeight: 1.55 }}>{val}</p>
                </div>
              ))}
            </div>
          ))}
          <button onClick={clearEntries} style={{ marginTop: 8, background: "none", border: "1px solid rgba(139,58,58,0.2)", borderRadius: 8, padding: "8px 14px", cursor: "pointer", color: "rgba(139,58,58,0.45)", fontFamily: S.body, fontSize: 11, width: "100%" }}>{t("common.clearJournal")}</button>
        </>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════
const VIEW_VALUES = Object.values(VIEWS);

export default function Lumen() {
  const [view, setView] = useState(() => {
    const path = (typeof window !== "undefined" && window.location.pathname.replace(/^\//, "")) || "";
    return VIEW_VALUES.includes(path) ? path : VIEWS.HOME;
  });
  const [rosarySet, setRosarySet] = useState(null);
  const { user, loading: authLoading, signIn, signOut, googleReady, authError } = useAuth();
  const journal = useJournal(user);

  const isFromPopStateRef = useRef(false);

  // Sync URL with view: pushState on in-app navigation (so back button works), skip when we're handling back/forward
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isFromPopStateRef.current) {
      isFromPopStateRef.current = false;
      return;
    }
    const path = view === VIEWS.HOME ? "/" : `/${view}`;
    if (window.location.pathname !== path) {
      window.history.pushState({ view }, "", path);
    }
  }, [view]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onPopState = () => {
      const path = window.location.pathname.replace(/^\//, "") || VIEWS.HOME;
      if (VIEW_VALUES.includes(path)) {
        isFromPopStateRef.current = true;
        setView(path);
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Set dark theme for iPhone safe areas & prevent zoom
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "theme-color";
    meta.content = "#0d1117";
    document.head.appendChild(meta);
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) viewport.content = "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover";
    document.body.style.background = "#0d1117";
    document.body.style.overflowX = "hidden";
    document.documentElement.style.overflowX = "hidden";
    // Apple status bar
    const appleMeta = document.createElement("meta");
    appleMeta.name = "apple-mobile-web-app-status-bar-style";
    appleMeta.content = "black-translucent";
    document.head.appendChild(appleMeta);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: S.bg, fontFamily: S.body, color: S.text, position: "relative", overflowX: "hidden", width: "100%", maxWidth: "100vw", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes glow { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes crossGlow { 0%, 100% { filter: drop-shadow(0 0 8px rgba(191,155,48,0.3)); } 50% { filter: drop-shadow(0 0 20px rgba(191,155,48,0.6)); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        html, body, #root { background: #0d1117 !important; margin: 0; padding: 0; overflow-x: hidden; width: 100%; max-width: 100vw; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        textarea:focus { outline: none; }
        textarea, input, button { font-size: 16px !important; } /* Prevent iOS zoom on focus */
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(191,155,48,0.2); border-radius: 3px; }
      `}</style>
      <div style={{ position: "fixed", top: "-20%", right: "0", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(191,155,48,0.05) 0%, transparent 70%)", animation: "glow 8s ease-in-out infinite", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", minHeight: 0 }}>
        {view === VIEWS.HOME && <HomeScreen setView={setView} user={user} signIn={signIn} signOut={signOut} />}
        {view === VIEWS.ROSARY && <RosarySelect onSelect={s => { setRosarySet(s); setView(VIEWS.ROSARY_PRAY); }} onBack={() => setView(VIEWS.HOME)} />}
        {view === VIEWS.ROSARY_PRAY && <RosaryPray mysterySet={rosarySet} onBack={() => setView(VIEWS.HOME)} />}
        {view === VIEWS.CONFESSION && <ConfessionPrep onBack={() => setView(VIEWS.HOME)} />}
        {view === VIEWS.EXAMEN && <DailyExamen onBack={() => setView(VIEWS.HOME)} addJournalEntry={user ? journal.addEntry : null} user={user} signIn={signIn} googleReady={googleReady} authError={authError} />}
        {view === VIEWS.PRAYERS && <PrayerLibrary onBack={() => setView(VIEWS.HOME)} />}
        {view === VIEWS.JOURNAL && <JournalView onBack={() => setView(VIEWS.HOME)} journal={journal} user={user} signIn={signIn} googleReady={googleReady} authError={authError} />}
        {view === VIEWS.GOSPEL && <DailyGospel onBack={() => setView(VIEWS.HOME)} />}
      </div>
      <Footer user={user} signIn={signIn} signOut={signOut} googleReady={googleReady} authError={authError} />
    </div>
  );
}
