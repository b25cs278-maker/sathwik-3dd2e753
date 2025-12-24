import { en } from "./translations/en";
import { hi } from "./translations/hi";
import { te } from "./translations/te";
import { ta } from "./translations/ta";
import { kn } from "./translations/kn";
import { ml } from "./translations/ml";
import { ur } from "./translations/ur";

export const translations = { en, hi, te, ta, kn, ml, ur };

export const languages = [
  { code: "en", name: "English", nativeName: "English", rtl: false },
  { code: "hi", name: "Hindi", nativeName: "हिंदी", rtl: false },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", rtl: false },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", rtl: false },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", rtl: false },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", rtl: false },
  { code: "ur", name: "Urdu", nativeName: "اردو", rtl: true },
] as const;

export type LanguageCode = typeof languages[number]["code"];
export type { TranslationKeys } from "./translations/en";
