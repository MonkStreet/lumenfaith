import { useLocale } from "../i18n/LocaleContext";
import { LOCALES } from "../i18n/translations";

const styles = {
  gold: "#BF9B30",
  text: "#f5ecd7",
  textDim: "rgba(245,236,215,0.55)",
  borderDim: "rgba(191,155,48,0.15)",
  body: "'Lora', serif",
  heading: "'Cormorant Garamond', serif",
};

export default function Footer({ user, signOut, signInButton }) {
  const { locale, setLocale, t, childMode, setChildMode } = useLocale();

  const toggleBtn = (active, label, onClick, ariaLabel) => (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={ariaLabel}
      style={{
        padding: "6px 12px",
        borderRadius: 8,
        border: active ? `1px solid ${styles.gold}` : `1px solid ${styles.borderDim}`,
        background: active ? "rgba(191,155,48,0.12)" : "transparent",
        color: active ? styles.gold : styles.textDim,
        fontFamily: styles.body,
        fontSize: 12,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );

  return (
    <footer
      style={{
        padding: "14px 20px 20px",
        borderTop: `1px solid ${styles.borderDim}`,
        background: "rgba(13,17,23,0.6)",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: 16,
        fontFamily: styles.body,
        fontSize: 13,
        color: styles.textDim,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontFamily: styles.heading, color: styles.gold, letterSpacing: "0.04em" }}>
          {t("footer.language")}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {toggleBtn(locale === LOCALES.EN_US, t("footer.english"), () => setLocale(LOCALES.EN_US))}
          {toggleBtn(locale === LOCALES.ES_ES, t("footer.spanish"), () => setLocale(LOCALES.ES_ES))}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontFamily: styles.heading, color: styles.gold, letterSpacing: "0.04em" }}>
          {t("footer.audience")}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {toggleBtn(!childMode, t("footer.adults"), () => setChildMode(false))}
          {toggleBtn(childMode, t("footer.kids"), () => setChildMode(true))}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {user ? (
          <>
            <span style={{ fontFamily: styles.body, fontSize: 12, color: styles.textDim }}>
              {user.picture && <img src={user.picture} alt="" style={{ width: 20, height: 20, borderRadius: "50%", verticalAlign: "middle", marginRight: 5 }} referrerPolicy="no-referrer" />}
              {user.id === "local_user" ? t("common.demoUserName") : user.name}
            </span>
            <button
              type="button"
              onClick={signOut}
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                border: `1px solid ${styles.borderDim}`,
                background: "transparent",
                color: styles.textDim,
                fontFamily: styles.body,
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              {t("common.signOut")}
            </button>
          </>
        ) : (
          <div style={{ display: "flex", alignItems: "center" }}>
            {signInButton}
          </div>
        )}
      </div>
    </footer>
  );
}
