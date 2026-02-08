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
  const { locale, setLocale, t } = useLocale();

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
          <button
            type="button"
            onClick={() => setLocale(LOCALES.EN_US)}
            aria-pressed={locale === LOCALES.EN_US}
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              border: locale === LOCALES.EN_US ? `1px solid ${styles.gold}` : `1px solid ${styles.borderDim}`,
              background: locale === LOCALES.EN_US ? "rgba(191,155,48,0.12)" : "transparent",
              color: locale === LOCALES.EN_US ? styles.gold : styles.textDim,
              fontFamily: styles.body,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            {t("footer.english")}
          </button>
          <button
            type="button"
            onClick={() => setLocale(LOCALES.ES_ES)}
            aria-pressed={locale === LOCALES.ES_ES}
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              border: locale === LOCALES.ES_ES ? `1px solid ${styles.gold}` : `1px solid ${styles.borderDim}`,
              background: locale === LOCALES.ES_ES ? "rgba(191,155,48,0.12)" : "transparent",
              color: locale === LOCALES.ES_ES ? styles.gold : styles.textDim,
              fontFamily: styles.body,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            {t("footer.spanish")}
          </button>
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
