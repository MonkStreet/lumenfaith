import { useLocale } from "../i18n/LocaleContext";
import { LOCALES } from "../i18n/translations";

const styles = {
  gold: "#BF9B30",
  textDim: "rgba(245,236,215,0.55)",
  borderDim: "rgba(191,155,48,0.15)",
  body: "'Lora', serif",
  heading: "'Cormorant Garamond', serif",
};

export default function Footer() {
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
        gap: 16,
        fontFamily: styles.body,
        fontSize: 13,
        color: styles.textDim,
      }}
    >
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
    </footer>
  );
}
