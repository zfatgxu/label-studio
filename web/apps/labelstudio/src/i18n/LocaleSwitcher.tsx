import { useTranslation } from "react-i18next";
import { SUPPORTED_LOCALES, setLocale, type SupportedLocale } from "./index";

export function LocaleSwitcher() {
  const { i18n, t } = useTranslation();
  const language = SUPPORTED_LOCALES.includes(i18n.language as SupportedLocale)
    ? (i18n.language as SupportedLocale)
    : "zh-CN";

  return (
    <label className="text-sm text-neutral-content-subtle" title={t("common.language")}>
      <span className="sr-only">{t("common.language")}</span>
      <select
        aria-label={t("common.language")}
        className="bg-transparent border-0 cursor-pointer"
        value={language}
        onChange={(event) => void setLocale(event.target.value as SupportedLocale)}
      >
        {SUPPORTED_LOCALES.map((locale) => (
          <option key={locale} value={locale}>
            {locale === "zh-CN" ? t("common.chinese") : t("common.english")}
          </option>
        ))}
      </select>
    </label>
  );
}
