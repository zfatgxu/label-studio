import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { enUS } from "./en-US";
import { zhCN } from "./zh-CN";

export const LOCALE_STORAGE_KEY = "gxu-label-studio.locale";
export const SUPPORTED_LOCALES = ["zh-CN", "en-US"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

type LocaleWindow = Window & { GXU_DEFAULT_LOCALE?: string };

function initialLocale(): SupportedLocale {
  const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  if (SUPPORTED_LOCALES.includes(saved as SupportedLocale)) return saved as SupportedLocale;
  const configured = (window as LocaleWindow).GXU_DEFAULT_LOCALE;
  if (SUPPORTED_LOCALES.includes(configured as SupportedLocale)) return configured as SupportedLocale;
  return "zh-CN";
}

void i18n.use(initReactI18next).init({
  resources: { "en-US": { translation: enUS }, "zh-CN": { translation: zhCN } },
  lng: initialLocale(),
  fallbackLng: "en-US",
  supportedLngs: SUPPORTED_LOCALES as unknown as string[],
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export function setLocale(locale: SupportedLocale) {
  window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  return i18n.changeLanguage(locale);
}

export default i18n;
