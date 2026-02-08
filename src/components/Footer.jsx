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

const GoogleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

export default function Footer({ user, signIn, signOut, googleReady = true, authError = null }) {
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
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
            <button
              type="button"
              onClick={signIn}
              disabled={!googleReady}
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                border: `1px solid ${styles.borderDim}`,
                background: "rgba(255,255,255,0.05)",
                color: googleReady ? styles.text : styles.textDim,
                fontFamily: styles.body,
                fontSize: 12,
                cursor: googleReady ? "pointer" : "wait",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <GoogleIcon />
              {googleReady ? t("common.signInWithGoogle") : t("common.loadingSignIn")}
            </button>
            {authError === "popupBlocked" && (
              <span style={{ fontSize: 10, color: styles.textDim, maxWidth: 200, textAlign: "right" }}>{t("common.signInPopupBlocked")}</span>
            )}
          </div>
        )}
      </div>
    </footer>
  );
}
