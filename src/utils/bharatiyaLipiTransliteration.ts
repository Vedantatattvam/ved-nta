/**
 * Bharatiya Bhasha Lipi (Indian Scripts) Transliteration & Typography Engine
 * Supports bi-directional, high-precision phonetic mapping across 10+ Bharatiya Lipis:
 * 1. Devanāgarī (देवनागरी) - Sanskrit, Hindi, Marathi, Nepali
 * 2. Bengali / Assamese (বাংলা / অসমীয়া)
 * 3. Tamil / Grantha (தமிழ் / கிரந்தம்)
 * 4. Telugu (తెలుగు)
 * 5. Kannada (ಕನ್ನಡ)
 * 6. Malayalam (മലയാളം)
 * 7. Odia (ଓଡ଼ିଆ)
 * 8. Gujarati (ગુજરાતી)
 * 9. Gurmukhi (ਗੁਰਮੁਖੀ)
 * 10. IAST (Roman with full Sanskrit diacritics: ā, ī, ū, ṛ, ṝ, ḷ, ḹ, ṅ, ñ, ṭ, ḍ, ṇ, ś, ṣ, ḥ, ṃ)
 */

export type BharatiyaLipiId = 
  | "devanagari"
  | "bengali"
  | "tamil"
  | "telugu"
  | "kannada"
  | "malayalam"
  | "odia"
  | "gujarati"
  | "gurmukhi"
  | "iast";

export interface BharatiyaLipiConfig {
  id: BharatiyaLipiId;
  name: string;
  nativeName: string;
  sampleAkshara: string;
  region: string;
  associatedTraditions: string;
  defaultFont: string;
  availableFonts: {
    id: string;
    name: string;
    family: string;
    category: "serif" | "sans" | "traditional" | "display";
    description: string;
  }[];
}

export const BHARATIYA_LIPIS: BharatiyaLipiConfig[] = [
  {
    id: "devanagari",
    name: "Devanāgarī",
    nativeName: "देवनागरी",
    sampleAkshara: "ॐ तत्सद्ब्रह्मणे नमः",
    region: "Northern, Central & Pan-Indian Sanskrit",
    associatedTraditions: "Advaita, Viśiṣṭādvaita, Mīmāṁsā, Classical Prasthānatrayī",
    defaultFont: "'Tiro Devanagari Sanskrit', serif",
    availableFonts: [
      { id: "tiro-deva", name: "Tiro Devanagari Sanskrit", family: "'Tiro Devanagari Sanskrit', serif", category: "traditional", description: "Standard for classical Sanskrit ligatures, svara accents & Vedic texts" },
      { id: "noto-serif-deva", name: "Noto Serif Devanagari", family: "'Noto Serif Devanagari', serif", category: "serif", description: "Balanced academic serif with pristine contrast and legibility" },
      { id: "yantramanav", name: "Yantramanav", family: "'Yantramanav', sans-serif", category: "sans", description: "Modern geometric Indic typography with crisp vertical stems" },
      { id: "eczar", name: "Eczar", family: "'Eczar', serif", category: "display", description: "Expressive high-contrast calligraphic display face" },
      { id: "rozha-one", name: "Rozha One", family: "'Rozha One', serif", category: "display", description: "Distinctive high-contrast headline font inspired by wooden block types" },
      { id: "mukta-deva", name: "Mukta Devanagari", family: "'Mukta', sans-serif", category: "sans", description: "Contemporary compact multi-purpose typeface" }
    ]
  },
  {
    id: "bengali",
    name: "Bengali / Gauḍīya",
    nativeName: "বাংলা / অসমীয়া",
    sampleAkshara: "ওঁ তৎসদ্ ব্রহ্মণে নমঃ",
    region: "Bengal, Assam, Eastern India",
    associatedTraditions: "Gauḍīya Acintya-Bhedābheda, Śākta-Advaita, Navya-Nyāya, Vijñāna Vedānta",
    defaultFont: "'Tiro Bangla', serif",
    availableFonts: [
      { id: "adarsha-lipi", name: "Adarsha Lipi (আদর্শ লিপি)", family: "'Adarsha Lipi', 'AdorshoLipi', 'SutonnyMJ', 'Tiro Bangla', 'Noto Serif Bengali', serif", category: "traditional", description: "Classic Vidyasagari print type & traditional Bengali Sanskrit letterforms" },
      { id: "tiro-bangla", name: "Tiro Bangla", family: "'Tiro Bangla', serif", category: "traditional", description: "Traditional Eastern Indic typographic proportions and authentic conjuncts" },
      { id: "noto-serif-bengali", name: "Noto Serif Bengali", family: "'Noto Serif Bengali', serif", category: "serif", description: "Academic book weight with refined terminal loops" },
      { id: "noto-sans-bengali", name: "Noto Sans Bengali", family: "'Noto Sans Bengali', sans-serif", category: "sans", description: "Clean modern sans for effortless on-screen readability" },
      { id: "galada", name: "Galada", family: "'Galada', cursive", category: "display", description: "Fluid calligraphic flourish reminiscent of Bengali palm-leaf manuscripts" },
      { id: "anek-bangla", name: "Anek Bangla", family: "'Anek Bangla', sans-serif", category: "sans", description: "Sophisticated multi-weight variable typography" }
    ]
  },
  {
    id: "tamil",
    name: "Tamil / Grantha",
    nativeName: "தமிழ் / கிரந்தம்",
    sampleAkshara: "ௐ தத்ஸத் ப்ரஹ்மணே நம꞉",
    region: "Tamil Nadu, Southern India",
    associatedTraditions: "Viśiṣṭādvaita (Divya Prabandham), Śaiva Siddhānta, Śaṅkara Maṭhas",
    defaultFont: "'Tiro Tamil', serif",
    availableFonts: [
      { id: "tiro-tamil", name: "Tiro Tamil", family: "'Tiro Tamil', serif", category: "traditional", description: "Specialized for Sanskrit-Tamil transliteration and classical Dravidian glyphs" },
      { id: "noto-serif-tamil", name: "Noto Serif Tamil", family: "'Noto Serif Tamil', serif", category: "serif", description: "Formal scholarly serif with exquisite curves" },
      { id: "noto-sans-tamil", name: "Noto Sans Tamil", family: "'Noto Sans Tamil', sans-serif", category: "sans", description: "Clear sans-serif optimized for multi-script reading" },
      { id: "mukta-malar", name: "Mukta Malar", family: "'Mukta Malar', sans-serif", category: "sans", description: "Contemporary condensed Tamil typeface" }
    ]
  },
  {
    id: "telugu",
    name: "Telugu",
    nativeName: "తెలుగు",
    sampleAkshara: "ఓం తత్సద్ బ్రహ్మణే నమః",
    region: "Andhra Pradesh & Telangana",
    associatedTraditions: "Dvaitādvaita (Nimbārka roots), Viśiṣṭādvaita, Sītārāma-Anjaneya Vedānta",
    defaultFont: "'Tiro Telugu', serif",
    availableFonts: [
      { id: "tiro-telugu", name: "Tiro Telugu", family: "'Tiro Telugu', serif", category: "traditional", description: "Traditional Andhra Telugu literary curves and vowel attachments" },
      { id: "noto-serif-telugu", name: "Noto Serif Telugu", family: "'Noto Serif Telugu', serif", category: "serif", description: "Dignified academic serif with balanced round loops" },
      { id: "noto-sans-telugu", name: "Noto Sans Telugu", family: "'Noto Sans Telugu', sans-serif", category: "sans", description: "Crisp modern sans for high digital clarity" },
      { id: "suranna", name: "Suranna", family: "'Suranna', serif", category: "display", description: "Classic literary Telugu font named after poet Pingali Suranna" }
    ]
  },
  {
    id: "kannada",
    name: "Kannada",
    nativeName: "ಕನ್ನಡ",
    sampleAkshara: "ಓಂ ತತ್ಸದ್ ಬ್ರಹ್ಮಣೇ ನಮಃ",
    region: "Karnataka & Western Ghats",
    associatedTraditions: "Dvaita (Madhva Udupi Maṭhas), Śaṅkara Sringeri Pīṭham, Vīraśaiva Vedānta",
    defaultFont: "'Tiro Kannada', serif",
    availableFonts: [
      { id: "tiro-kannada", name: "Tiro Kannada", family: "'Tiro Kannada', serif", category: "traditional", description: "Authentic Karnataka manuscript style with smooth ligatures" },
      { id: "noto-serif-kannada", name: "Noto Serif Kannada", family: "'Noto Serif Kannada', serif", category: "serif", description: "Academic book font with elegant circular geometry" },
      { id: "noto-sans-kannada", name: "Noto Sans Kannada", family: "'Noto Sans Kannada', sans-serif", category: "sans", description: "Clean geometric sans with uniform stroke width" },
      { id: "baloo-tamma", name: "Baloo Tamma 2", family: "'Baloo Tamma 2', cursive", category: "display", description: "Warm rounded contemporary display typeface" }
    ]
  },
  {
    id: "malayalam",
    name: "Malayalam",
    nativeName: "മലയാളം",
    sampleAkshara: "ഓം തത്സദ് ബ്രഹ്മണേ നമഃ",
    region: "Kerala & Malabar",
    associatedTraditions: "Birthplace of Ādi Śaṅkara (Kalady), Nārāyaṇa Guru Advaita, Manipravalam",
    defaultFont: "'Tiro Malayalam', serif",
    availableFonts: [
      { id: "tiro-malayalam", name: "Tiro Malayalam", family: "'Tiro Malayalam', serif", category: "traditional", description: "Traditional Kerala orthography with rich conjuncts and chillu characters" },
      { id: "noto-serif-malayalam", name: "Noto Serif Malayalam", family: "'Noto Serif Malayalam', serif", category: "serif", description: "Graceful academic serif with traditional loop terminals" },
      { id: "noto-sans-malayalam", name: "Noto Sans Malayalam", family: "'Noto Sans Malayalam', sans-serif", category: "sans", description: "Modern reformed orthography with high legibility" },
      { id: "manjari", name: "Manjari", family: "'Manjari', sans-serif", category: "sans", description: "Spacious curved font created for literary Malayalam publications" }
    ]
  },
  {
    id: "odia",
    name: "Odia",
    nativeName: "ଓଡ଼ିଆ",
    sampleAkshara: "ଓଁ ତତ୍ସଦ୍ ବ୍ରହ୍ମଣେ ନମଃ",
    region: "Odisha & Utkala",
    associatedTraditions: "Jagannātha Puri Govardhana Pīṭham, Baladeva Vidyābhūṣaṇa, Utkala Vaiṣṇavism",
    defaultFont: "'Tiro Odia', serif",
    availableFonts: [
      { id: "tiro-odia", name: "Tiro Odia", family: "'Tiro Odia', serif", category: "traditional", description: "Classical rounded umbrella top strokes originating from palm-leaf stylus writing" },
      { id: "noto-serif-odia", name: "Noto Serif Odia", family: "'Noto Serif Odia', serif", category: "serif", description: "Scholarly serif with pristine curves and clear distinction of matras" },
      { id: "noto-sans-odia", name: "Noto Sans Odia", family: "'Noto Sans Odia', sans-serif", category: "sans", description: "Contemporary clean sans-serif" },
      { id: "baloo-bhaina", name: "Baloo Bhaina 2", family: "'Baloo Bhaina 2', cursive", category: "display", description: "Lively display font with strong distinctive loops" }
    ]
  },
  {
    id: "gujarati",
    name: "Gujarati",
    nativeName: "ગુજરાતી",
    sampleAkshara: "ૐ તત્સદ્ બ્રહ્મણે નમઃ",
    region: "Gujarat & Western India",
    associatedTraditions: "Śuddhādvaita (Vallabhācārya Puṣṭimārga), Dvārakā Śāradā Pīṭham, Akshar-Purushottam",
    defaultFont: "'Tiro Gujarati', serif",
    availableFonts: [
      { id: "tiro-gujarati", name: "Tiro Gujarati", family: "'Tiro Gujarati', serif", category: "traditional", description: "Exquisite shirorekha-less classical Gujarati typography" },
      { id: "noto-serif-gujarati", name: "Noto Serif Gujarati", family: "'Noto Serif Gujarati', serif", category: "serif", description: "Academic literary typeface with graceful baseline contrast" },
      { id: "noto-sans-gujarati", name: "Noto Sans Gujarati", family: "'Noto Sans Gujarati', sans-serif", category: "sans", description: "Crisp modern sans without top hanging lines" },
      { id: "rasa", name: "Rasa", family: "'Rasa', serif", category: "display", description: "High-contrast editorial serif designed specifically for continuous reading" }
    ]
  },
  {
    id: "gurmukhi",
    name: "Gurmukhi",
    nativeName: "ਗੁਰਮੁਖੀ",
    sampleAkshara: "ੴ ਤਤ੍ਸਦ੍ ਬ੍ਰਹ੍ਮਣੇ ਨਮਃ",
    region: "Punjab & Northwestern India",
    associatedTraditions: "Nirmala Vedāntic scholars (Pandit Tara Singh Narotam), Udāsī traditions",
    defaultFont: "'Tiro Gurmukhi', serif",
    availableFonts: [
      { id: "tiro-gurmukhi", name: "Tiro Gurmukhi", family: "'Tiro Gurmukhi', serif", category: "traditional", description: "Scholarly Nirmala style with full Sanskrit conjunct support" },
      { id: "noto-serif-gurmukhi", name: "Noto Serif Gurmukhi", family: "'Noto Serif Gurmukhi', serif", category: "serif", description: "Academic serif with strong horizontal alignment" },
      { id: "noto-sans-gurmukhi", name: "Noto Sans Gurmukhi", family: "'Noto Sans Gurmukhi', sans-serif", category: "sans", description: "Contemporary geometric sans" },
      { id: "baloo-paaji", name: "Baloo Paaji 2", family: "'Baloo Paaji 2', cursive", category: "display", description: "Dynamic rounded display face" }
    ]
  },
  {
    id: "iast",
    name: "IAST Roman Diacritics",
    nativeName: "IAST (Romanized Sanskrit)",
    sampleAkshara: "oṁ tat sad brahmaṇe namaḥ",
    region: "International Indology & Global Academia",
    associatedTraditions: "Critical Editions, Epigraphia Indica, Harvard Oriental Series, Motilal Banarsidass",
    defaultFont: "'Cardo', Georgia, serif",
    availableFonts: [
      { id: "cardo", name: "Cardo", family: "'Cardo', Georgia, serif", category: "serif", description: "Standard scholarly font engineered specifically for classicists and Sanskrit diacritics" },
      { id: "cormorant", name: "Cormorant Garamond", family: "'Cormorant Garamond', serif", category: "serif", description: "Breathtakingly elegant traditional serif with high aesthetic refinement" },
      { id: "cinzel", name: "Cinzel Decorative", family: "'Cinzel', serif", category: "display", description: "Majestic classical Roman epigraphic lettering" },
      { id: "inter", name: "Inter Sans", family: "'Inter', sans-serif", category: "sans", description: "Ultra-crisp UI sans with complete Unicode diacritic support" }
    ]
  }
];

// ============================================================================
// REAL-TIME PHONETIC SCRIPT CONVERSION ENGINE (AKSHARA TRANSLITERATOR)
// ============================================================================

// Base Phonetic Atoms (Sanskrit Sound Inventory)
interface PhonemeMap {
  iast: string;
  devanagari: string;
  bengali: string;
  tamil: string;
  telugu: string;
  kannada: string;
  malayalam: string;
  odia: string;
  gujarati: string;
  gurmukhi: string;
}

// Independent Vowels (Svaras)
const VOWELS: PhonemeMap[] = [
  { iast: "a",  devanagari: "अ", bengali: "অ", tamil: "அ", telugu: "అ", kannada: "ಅ", malayalam: "അ", odia: "ଅ", gujarati: "અ", gurmukhi: "ਅ" },
  { iast: "ā",  devanagari: "आ", bengali: "আ", tamil: "ஆ", telugu: "ఆ", kannada: "ಆ", malayalam: "ആ", odia: "ଆ", gujarati: "આ", gurmukhi: "ਆ" },
  { iast: "i",  devanagari: "इ", bengali: "ই", tamil: "இ", telugu: "ఇ", kannada: "ಇ", malayalam: "ഇ", odia: "ଇ", gujarati: "ઇ", gurmukhi: "ਇ" },
  { iast: "ī",  devanagari: "ई", bengali: "ঈ", tamil: "ஈ", telugu: "ఈ", kannada: "ಈ", malayalam: "ഈ", odia: "ଈ", gujarati: "ઈ", gurmukhi: "ਈ" },
  { iast: "u",  devanagari: "उ", bengali: "উ", tamil: "உ", telugu: "ఉ", kannada: "ಉ", malayalam: "ഉ", odia: "ଉ", gujarati: "ઉ", gurmukhi: "ਉ" },
  { iast: "ū",  devanagari: "ऊ", bengali: "ঊ", tamil: "ஊ", telugu: "ఊ", kannada: "ಊ", malayalam: "ഊ", odia: "ଊ", gujarati: "ઊ", gurmukhi: "ਊ" },
  { iast: "ṛ",  devanagari: "ऋ", bengali: "ঋ", tamil: "ரி", telugu: "ఋ", kannada: "ಋ", malayalam: "ഋ", odia: "ଋ", gujarati: "ઋ", gurmukhi: "ਰਿ" },
  { iast: "ṝ",  devanagari: "ॠ", bengali: "ৠ", tamil: "ரீ", telugu: "ౠ", kannada: "ೠ", malayalam: "ൠ", odia: "ୠ", gujarati: "ૠ", gurmukhi: "ਰੀ" },
  { iast: "ḷ",  devanagari: "ऌ", bengali: "ঌ", tamil: "லி", telugu: "ఌ", kannada: "ಌ", malayalam: "ഌ", odia: "ଌ", gujarati: "ઌ", gurmukhi: "ਲਿ" },
  { iast: "ḹ",  devanagari: "ॡ", bengali: "ৡ", tamil: "லீ", telugu: "ౡ", kannada: "ೡ", malayalam: "ൡ", odia: "ୡ", gujarati: "ૡ", gurmukhi: "ਲੀ" },
  { iast: "e",  devanagari: "ए", bengali: "এ", tamil: "ஏ", telugu: "ఏ", kannada: "ಏ", malayalam: "ഏ", odia: "ଏ", gujarati: "એ", gurmukhi: "ਏ" },
  { iast: "ai", devanagari: "ऐ", bengali: "ঐ", tamil: "ஐ", telugu: "ఐ", kannada: "ಐ", malayalam: "ഐ", odia: "ଐ", gujarati: "ઐ", gurmukhi: "ਐ" },
  { iast: "o",  devanagari: "ओ", bengali: "ও", tamil: "ஓ", telugu: "ఓ", kannada: "ಓ", malayalam: "ഓ", odia: "ଓ", gujarati: "ઓ", gurmukhi: "ਓ" },
  { iast: "au", devanagari: "औ", bengali: "ঔ", tamil: "ஔ", telugu: "ఔ", kannada: "ಔ", malayalam: "ഔ", odia: "ଔ", gujarati: "ઔ", gurmukhi: "ਔ" }
];

// Dependent Vowel Signs (Mātrās)
const MATRAS: PhonemeMap[] = [
  { iast: "ā",  devanagari: "ा", bengali: "া", tamil: "ா", telugu: "ా", kannada: "ಾ", malayalam: "ാ", odia: "ା", gujarati: "ા", gurmukhi: "ਾ" },
  { iast: "i",  devanagari: "ि", bengali: "ি", tamil: "ி", telugu: "ి", kannada: "ಿ", malayalam: "ി", odia: "ି", gujarati: "િ", gurmukhi: "ਿ" },
  { iast: "ī",  devanagari: "ी", bengali: "ী", tamil: "ீ", telugu: "ీ", kannada: "ೀ", malayalam: "ീ", odia: "ୀ", gujarati: "ી", gurmukhi: "ੀ" },
  { iast: "u",  devanagari: "ु", bengali: "ু", tamil: "ு", telugu: "ు", kannada: "ು", malayalam: "ു", odia: "ୁ", gujarati: "ુ", gurmukhi: "ੁ" },
  { iast: "ū",  devanagari: "ू", bengali: "ূ", tamil: "ூ", telugu: "ూ", kannada: "ೂ", malayalam: "ൂ", odia: "ୂ", gujarati: "ૂ", gurmukhi: "ੂ" },
  { iast: "ṛ",  devanagari: "ृ", bengali: "ৃ", tamil: "்ரி", telugu: "ృ", kannada: "ೃ", malayalam: "ൃ", odia: "ୃ", gujarati: "ૃ", gurmukhi: "੍ਰਿ" },
  { iast: "ṝ",  devanagari: "ॄ", bengali: "ৄ", tamil: "்ரீ", telugu: "ౄ", kannada: "ೄ", malayalam: "ൄ", odia: "ୄ", gujarati: "ૄ", gurmukhi: "੍ਰੀ" },
  { iast: "ḷ",  devanagari: "ॢ", bengali: "ৢ", tamil: "்லி", telugu: "ౢ", kannada: "ೢ", malayalam: "ൢ", odia: "ୢ", gujarati: "ૢ", gurmukhi: "੍ਲਿ" },
  { iast: "ḹ",  devanagari: "ॣ", bengali: "ৣ", tamil: "்லீ", telugu: "ౣ", kannada: "ೣ", malayalam: "ൣ", odia: "ୣ", gujarati: "ૣ", gurmukhi: "੍ਲੀ" },
  { iast: "e",  devanagari: "े", bengali: "ে", tamil: "ே", telugu: "ే", kannada: "ೇ", malayalam: "േ", odia: "େ", gujarati: "ે", gurmukhi: "ੇ" },
  { iast: "ai", devanagari: "ै", bengali: "ৈ", tamil: "ை", telugu: "ై", kannada: "ೈ", malayalam: "ൈ", odia: "ୈ", gujarati: "ૈ", gurmukhi: "ੈ" },
  { iast: "o",  devanagari: "ो", bengali: "ো", tamil: "ோ", telugu: "ో", kannada: "ೋ", malayalam: "ോ", odia: "ୋ", gujarati: "ો", gurmukhi: "ੋ" },
  { iast: "au", devanagari: "ौ", bengali: "ৌ", tamil: "ௌ", telugu: "ౌ", kannada: "ೌ", malayalam: "ൌ", odia: "ୌ", gujarati: "ૌ", gurmukhi: "ੌ" }
];

/// Consonants (Vyañjanas without inherent 'a')
const CONSONANTS: PhonemeMap[] = [
  // Guttural (Ka-varga)
  { iast: "k",  devanagari: "क", bengali: "ক", tamil: "க", telugu: "క", kannada: "ಕ", malayalam: "ക", odia: "କ", gujarati: "ક", gurmukhi: "ਕ" },
  { iast: "kh", devanagari: "ख", bengali: "খ", tamil: "க", telugu: "ఖ", kannada: "ಖ", malayalam: "ഖ", odia: "ଖ", gujarati: "ખ", gurmukhi: "ਖ" },
  { iast: "g",  devanagari: "ग", bengali: "গ", tamil: "க", telugu: "గ", kannada: "ಗ", malayalam: "ഗ", odia: "ଗ", gujarati: "ગ", gurmukhi: "ਗ" },
  { iast: "gh", devanagari: "घ", bengali: "ঘ", tamil: "க", telugu: "ఘ", kannada: "ಘ", malayalam: "ഘ", odia: "ଘ", gujarati: "ઘ", gurmukhi: "ਘ" },
  { iast: "ṅ",  devanagari: "ङ", bengali: "ঙ", tamil: "ங", telugu: "ఙ", kannada: "ಙ", malayalam: "ങ", odia: "ଙ", gujarati: "ઙ", gurmukhi: "ਙ" },

  // Palatal (Ca-varga)
  { iast: "c",  devanagari: "च", bengali: "চ", tamil: "ச", telugu: "చ", kannada: "ಚ", malayalam: "ച", odia: "ଚ", gujarati: "ચ", gurmukhi: "ਚ" },
  { iast: "ch", devanagari: "छ", bengali: "ছ", tamil: "ச", telugu: "ఛ", kannada: "ಛ", malayalam: "ഛ", odia: "ଛ", gujarati: "છ", gurmukhi: "ਛ" },
  { iast: "j",  devanagari: "ज", bengali: "জ", tamil: "ஜ", telugu: "జ", kannada: "ಜ", malayalam: "ജ", odia: "ଜ", gujarati: "જ", gurmukhi: "ਜ" },
  { iast: "jh", devanagari: "झ", bengali: "ঝ", tamil: "ஜ", telugu: "ఝ", kannada: "ಝ", malayalam: "ഝ", odia: "ଝ", gujarati: "ઝ", gurmukhi: "ਝ" },
  { iast: "ñ",  devanagari: "ञ", bengali: "ঞ", tamil: "ஞ", telugu: "ఞ", kannada: "ಞ", malayalam: "ഞ", odia: "ଞ", gujarati: "ઞ", gurmukhi: "ਞ" },

  // Retroflex (Ṭa-varga)
  { iast: "ṭ",  devanagari: "ट", bengali: "ট", tamil: "ட", telugu: "ట", kannada: "ಟ", malayalam: "ട", odia: "ଟ", gujarati: "ટ", gurmukhi: "ਟ" },
  { iast: "ṭh", devanagari: "ठ", bengali: "ঠ", tamil: "ட", telugu: "ఠ", kannada: "ಠ", malayalam: "ഠ", odia: "ଠ", gujarati: "ઠ", gurmukhi: "ਠ" },
  { iast: "ḍ",  devanagari: "ड", bengali: "ড", tamil: "ட", telugu: "డ", kannada: "ಡ", malayalam: "ഡ", odia: "ଡ", gujarati: "ડ", gurmukhi: "ਡ" },
  { iast: "ḍh", devanagari: "ढ", bengali: "ঢ", tamil: "ட", telugu: "ఢ", kannada: "ಢ", malayalam: "ഢ", odia: "ଢ", gujarati: "ઢ", gurmukhi: "ਢ" },
  { iast: "ṇ",  devanagari: "ण", bengali: "ণ", tamil: "ண", telugu: "ణ", kannada: "ಣ", malayalam: "ണ", odia: "ଣ", gujarati: "ણ", gurmukhi: "ਣ" },

  // Dental (Ta-varga)
  { iast: "t",  devanagari: "त", bengali: "ত", tamil: "த", telugu: "త", kannada: "ತ", malayalam: "ത", odia: "ତ", gujarati: "ત", gurmukhi: "ਤ" },
  { iast: "th", devanagari: "थ", bengali: "থ", tamil: "த", telugu: "థ", kannada: "ಥ", malayalam: "ഥ", odia: "ଥ", gujarati: "થ", gurmukhi: "ਥ" },
  { iast: "d",  devanagari: "द", bengali: "দ", tamil: "த", telugu: "ద", kannada: "ದ", malayalam: "ദ", odia: "ଦ", gujarati: "દ", gurmukhi: "ਦ" },
  { iast: "dh", devanagari: "ध", bengali: "ধ", tamil: "த", telugu: "ధ", kannada: "ಧ", malayalam: "ധ", odia: "ଧ", gujarati: "ધ", gurmukhi: "ਧ" },
  { iast: "n",  devanagari: "न", bengali: "ন", tamil: "ந", telugu: "న", kannada: "ನ", malayalam: "ന", odia: "ନ", gujarati: "ન", gurmukhi: "ਨ" },

  // Labial (Pa-varga)
  { iast: "p",  devanagari: "प", bengali: "প", tamil: "ப", telugu: "ప", kannada: "ಪ", malayalam: "പ", odia: "ପ", gujarati: "પ", gurmukhi: "ਪ" },
  { iast: "ph", devanagari: "फ", bengali: "ফ", tamil: "ப", telugu: "ఫ", kannada: "ಫ", malayalam: "ഫ", odia: "ଫ", gujarati: "ફ", gurmukhi: "ਫ" },
  { iast: "b",  devanagari: "ब", bengali: "ব", tamil: "ப", telugu: "బ", kannada: "ಬ", malayalam: "ബ", odia: "ବ", gujarati: "બ", gurmukhi: "ਬ" },
  { iast: "bh", devanagari: "भ", bengali: "ভ", tamil: "ப", telugu: "భ", kannada: "ಭ", malayalam: "ഭ", odia: "ଭ", gujarati: "ભ", gurmukhi: "ਭ" },
  { iast: "m",  devanagari: "म", bengali: "ম", tamil: "ம", telugu: "మ", kannada: "ಮ", malayalam: "മ", odia: "ମ", gujarati: "મ", gurmukhi: "ਮ" },

  // Semi-vowels (Antaḥstha)
  { iast: "y",  devanagari: "य", bengali: "য়", tamil: "ய", telugu: "య", kannada: "ಯ", malayalam: "യ", odia: "ଯ", gujarati: "ય", gurmukhi: "ਯ" },
  { iast: "r",  devanagari: "र", bengali: "র", tamil: "ர", telugu: "ర", kannada: "ರ", malayalam: "ര", odia: "ର", gujarati: "ર", gurmukhi: "ਰ" },
  { iast: "l",  devanagari: "ल", bengali: "ল", tamil: "ல", telugu: "ల", kannada: "ಲ", malayalam: "ല", odia: "ଲ", gujarati: "લ", gurmukhi: "ਲ" },
  { iast: "v",  devanagari: "व", bengali: "ৱ", tamil: "வ", telugu: "వ", kannada: "ವ", malayalam: "വ", odia: "ଵ", gujarati: "વ", gurmukhi: "ਵ" },

  // Sibilants & Aspirate (Ūṣma)
  { iast: "ś",  devanagari: "श", bengali: "শ", tamil: "ஶ", telugu: "శ", kannada: "ಶ", malayalam: "ശ", odia: "ଶ", gujarati: "શ", gurmukhi: "ਸ਼" },
  { iast: "ṣ",  devanagari: "ष", bengali: "ষ", tamil: "ஷ", telugu: "ష", kannada: "ಷ", malayalam: "ഷ", odia: "ଷ", gujarati: "ષ", gurmukhi: "ਸ਼" },
  { iast: "s",  devanagari: "स", bengali: "স", tamil: "ஸ", telugu: "స", kannada: "ಸ", malayalam: "സ", odia: "ସ", gujarati: "સ", gurmukhi: "ਸ" },
  { iast: "h",  devanagari: "ह", bengali: "হ", tamil: "ஹ", telugu: "హ", kannada: "ಹ", malayalam: "ഹ", odia: "ହ", gujarati: "હ", gurmukhi: "ਹ" },

  // Additional Vedic / Classical
  { iast: "ḻ",  devanagari: "ळ", bengali: "ল", tamil: "ள", telugu: "ళ", kannada: "ಳ", malayalam: "ള", odia: "ଳ", gujarati: "ળ", gurmukhi: "ਲ਼" },
  { iast: "kṣ", devanagari: "क्ष", bengali: "ক্ষ", tamil: "க்ஷ", telugu: "క్ష", kannada: "ಕ್ಷ", malayalam: "ക്ഷ", odia: "କ୍ଷ", gujarati: "ક્ષ", gurmukhi: "ਕ੍ਸ਼" },
  { iast: "jñ", devanagari: "ज्ञ", bengali: "জ্ঞ", tamil: "ஜ்ஞ", telugu: "జ్ఞ", kannada: "ಜ್ಞ", malayalam: "ജ്ഞ", odia: "ଜ୍ଞ", gujarati: "જ્ઞ", gurmukhi: "ਜ੍ਞ" }
];

// Special Marks (Virāma, Anusvāra, Visarga, Avagraha, Oṁ)
const SPECIAL_SIGNS: PhonemeMap[] = [
  { iast: "",   devanagari: "्", bengali: "্", tamil: "்", telugu: "్", kannada: "್", malayalam: "്", odia: "୍", gujarati: "્", gurmukhi: "੍" }, // Virāma
  { iast: "ṃ",  devanagari: "ं", bengali: "ং", tamil: "ஂ", telugu: "ం", kannada: "ಂ", malayalam: "ം", odia: "ଂ", gujarati: "ં", gurmukhi: "ਂ" }, // Anusvāra
  { iast: "ḥ",  devanagari: "ः", bengali: "ঃ", tamil: "꞉", telugu: "ః", kannada: "ಃ", malayalam: "ഃ", odia: "ଃ", gujarati: "ઃ", gurmukhi: "ਃ" }, // Visarga
  { iast: "'",  devanagari: "ऽ", bengali: "ঽ", tamil: "ऽ", telugu: "ఽ", kannada: "ಽ", malayalam: "ഽ", odia: "ଽ", gujarati: "ઽ", gurmukhi: "'" }, // Avagraha
  { iast: "om̐", devanagari: "ँ", bengali: "ঁ", tamil: "ஂ", telugu: "ఁ", kannada: "ँ", malayalam: "ँ", odia: "ଁ", gujarati: "ઁ", gurmukhi: "ਁ" }, // Candrabindu
  { iast: "oṁ", devanagari: "ॐ", bengali: "ওঁ", tamil: "ௐ", telugu: "ఓం", kannada: "ಓಂ", malayalam: "ഓം", odia: "ଓଁ", gujarati: "ૐ", gurmukhi: "ੴ" }  // Praṇava Oṁ
];

// Digits (0 to 9)
const DIGITS: PhonemeMap[] = [
  { iast: "0", devanagari: "०", bengali: "০", tamil: "௦", telugu: "౦", kannada: "೦", malayalam: "൦", odia: "୦", gujarati: "૦", gurmukhi: "੦" },
  { iast: "1", devanagari: "१", bengali: "১", tamil: "௧", telugu: "౧", kannada: "೧", malayalam: "൧", odia: "୧", gujarati: "૧", gurmukhi: "੧" },
  { iast: "2", devanagari: "२", bengali: "২", tamil: "௨", telugu: "౨", kannada: "೨", malayalam: "൨", odia: "୨", gujarati: "૨", gurmukhi: "੨" },
  { iast: "3", devanagari: "३", bengali: "৩", tamil: "௩", telugu: "౩", kannada: "೩", malayalam: "൩", odia: "୩", gujarati: "૩", gurmukhi: "੩" },
  { iast: "4", devanagari: "४", bengali: "৪", tamil: "௪", telugu: "౪", kannada: "೪", malayalam: "൪", odia: "୪", gujarati: "૪", gurmukhi: "੪" },
  { iast: "5", devanagari: "५", bengali: "৫", tamil: "௫", telugu: "౫", kannada: "೫", malayalam: "൫", odia: "୫", gujarati: "૫", gurmukhi: "੫" },
  { iast: "6", devanagari: "६", bengali: "৬", tamil: "௬", telugu: "౬", kannada: "೬", malayalam: "൬", odia: "୬", gujarati: "૬", gurmukhi: "੬" },
  { iast: "7", devanagari: "७", bengali: "৭", tamil: "௭", telugu: "౭", kannada: "೭", malayalam: "൭", odia: "୭", gujarati: "૭", gurmukhi: "੭" },
  { iast: "8", devanagari: "८", bengali: "৮", tamil: "௮", telugu: "౮", kannada: "೮", malayalam: "൮", odia: "୮", gujarati: "૮", gurmukhi: "੮" },
  { iast: "9", devanagari: "९", bengali: "৯", tamil: "௯", telugu: "౯", kannada: "೯", malayalam: "൯", odia: "୯", gujarati: "૯", gurmukhi: "੯" }
];

// Helper: Check if text contains Indic Unicode characters
export function hasIndicCharacters(text: string): boolean {
  if (!text) return false;
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code >= 0x0900 && code <= 0x0D7F) return true;
  }
  return false;
}

// Helper: Detect script of input text
export function detectBharatiyaLipi(text: string): BharatiyaLipiId {
  if (!text) return "devanagari";
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code >= 0x0900 && code <= 0x097F) return "devanagari";
    if (code >= 0x0980 && code <= 0x09FF) return "bengali";
    if (code >= 0x0B80 && code <= 0x0BFF) return "tamil";
    if (code >= 0x0C00 && code <= 0x0C7F) return "telugu";
    if (code >= 0x0C80 && code <= 0x0CFF) return "kannada";
    if (code >= 0x0D00 && code <= 0x0D7F) return "malayalam";
    if (code >= 0x0B00 && code <= 0x0B7F) return "odia";
    if (code >= 0x0A80 && code <= 0x0AFF) return "gujarati";
    if (code >= 0x0A00 && code <= 0x0A7F) return "gurmukhi";
  }
  return "devanagari";
}

// Virama character per script
const VIRAMA_MAP: Record<BharatiyaLipiId, string> = {
  devanagari: "्",
  bengali: "্",
  tamil: "்",
  telugu: "్",
  kannada: "್",
  malayalam: "്",
  odia: "୍",
  gujarati: "્",
  gurmukhi: "੍",
  iast: ""
};

/**
 * Universal High-Speed Indic Transliteration Function
 * Converts any Sanskrit or Indic text from an origin script to a target Bharatiya Lipi.
 * If text contains Devanagari Sanskrit characters alongside English/punctuation,
 * it converts only the Devanagari characters and leaves other characters intact.
 */
export function transliterateBharatiyaText(
  text: string,
  targetLipi: BharatiyaLipiId,
  sourceLipi?: BharatiyaLipiId
): string {
  if (!text || typeof text !== "string") return text;
  
  // If target is devanagari and no source given:
  // If it has non-devanagari Indic chars, convert to Devanagari. If already Devanagari or English, return as-is.
  const hasIndic = hasIndicCharacters(text);
  
  if (!hasIndic && sourceLipi !== "iast") {
    // Pure Latin / English text with no Indic characters and no explicit IAST flag -> return as-is
    return text;
  }

  const fromLipi = sourceLipi || (hasIndic ? detectBharatiyaLipi(text) : "devanagari");
  if (fromLipi === targetLipi) return text;

  // Step 1: Normalize any Indic script to internal Devanagari representation if not already Devanagari or IAST
  let devaText = text;
  if (fromLipi !== "devanagari" && fromLipi !== "iast") {
    devaText = convertToDevanagari(text, fromLipi);
  } else if (fromLipi === "iast") {
    devaText = iastToDevanagari(text);
  }

  // Step 2: Convert Devanagari to Target Lipi
  if (targetLipi === "devanagari") return devaText;
  if (targetLipi === "iast") return devanagariToIast(devaText);

  return devanagariToIndic(devaText, targetLipi);
}

// Convert from specific Indic script to Devanagari via Unicode offset equivalence
function convertToDevanagari(text: string, fromLipi: BharatiyaLipiId): string {
  if (fromLipi === "bengali") {
    return convertBengaliToDevanagari(text);
  }

  // Most Brahmic scripts in Unicode share congruent offset relative to their block base!
  const BLOCK_BASES: Partial<Record<BharatiyaLipiId, number>> = {
    devanagari: 0x0900,
    bengali: 0x0980,
    gurmukhi: 0x0A00,
    gujarati: 0x0A80,
    odia: 0x0B00,
    tamil: 0x0B80,
    telugu: 0x0C00,
    kannada: 0x0C80,
    malayalam: 0x0D00
  };

  const base = BLOCK_BASES[fromLipi];
  if (!base) return text;

  let result = "";
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    // Danda (U+0964) and Double Danda (U+0965) are pan-Indic in Unicode
    if (code === 0x0964 || code === 0x0965) {
      result += text[i];
      continue;
    }

    if (code >= base && code <= base + 0x7F) {
      const offset = code - base;
      const devaCode = 0x0900 + offset;
      result += String.fromCharCode(devaCode);
    } else {
      result += text[i];
    }
  }
  return result;
}

// Convert Devanagari to Target Indic Script via Unicode offset equivalence + special handling
function devanagariToIndic(text: string, targetLipi: BharatiyaLipiId): string {
  if (targetLipi === "bengali") {
    return convertDevaToBengali(text);
  }

  const BLOCK_BASES: Partial<Record<BharatiyaLipiId, number>> = {
    devanagari: 0x0900,
    bengali: 0x0980,
    gurmukhi: 0x0A00,
    gujarati: 0x0A80,
    odia: 0x0B00,
    tamil: 0x0B80,
    telugu: 0x0C00,
    kannada: 0x0C80,
    malayalam: 0x0D00
  };

  const targetBase = BLOCK_BASES[targetLipi];
  if (!targetBase) return text;

  let result = "";
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);

    // Pan-Indic Punctuation: Danda (। U+0964) and Double Danda (॥ U+0965)
    // In Unicode, Danda & Double Danda are shared by all Indic scripts in U+0964 / U+0965
    if (code === 0x0964) {
      result += "।";
      continue;
    }
    if (code === 0x0965) {
      result += "॥";
      continue;
    }
    if (code === 0x0970) {
      result += "॰";
      continue;
    }

    // Standard Devanagari block 0x0900 - 0x097F
    if (code >= 0x0900 && code <= 0x097F) {
      const offset = code - 0x0900;
      
      // Tamil special handling for unrepresented voiced/aspirated stops in pure Tamil Unicode
      if (targetLipi === "tamil") {
        result += mapDevaCharToTamil(code);
        continue;
      }

      const targetCode = targetBase + offset;
      result += String.fromCharCode(targetCode);
    } else {
      result += text[i];
    }
  }
  return result;
}

/**
 * Applies authentic Bengali orthographic rules:
 * Converts 'ত্' (Ta + Virama) to Khanda Ta 'ৎ' (U+09CE) when followed by a space,
 * whitespace, punctuation, word-boundary, or end of string.
 * Strictly preserves 'ত্' when immediately followed by a Bengali consonant to form valid conjuncts (e.g. তত্ত্ব, সত্য, আত্মা, ইত্যাদি).
 */
export function formatBengaliKhandaTa(text: string): string {
  if (!text || typeof text !== "string") return text;
  // Bengali consonants range: ক-হ (\u0995-\u09B9), ড়-ঢ়-য় (\u09DC-\u09DF), ৱ-ৰ (\u09F0-\u09F1)
  // If 'ত্' (U+09A4 U+09CD) is NOT followed by a Bengali consonant, replace with 'ৎ' (U+09CE)
  return text.replace(/ত্(?![ক-হড়-য়ৱৰ])/g, "ৎ");
}

/**
 * Dedicated Bengali Converter adhering strictly to Sanskrit scholarly conventions:
 * 1. व (0x0935) -> ৱ (U+09F1)
 * 2. ब (0x092C) -> ব (U+09AC)
 * 3. य (0x092F):
 *    - In conjuncts after Virama (् / 0x094D): renders as ya-phalā ্য (্ + য)
 *    - Standalone / syllable-initial: renders as য় (U+09DF)
 * 4. र (0x0930) -> র (U+09B0)
 * 5. ॐ (0x0950) -> ওঁ (U+0993 U+0981)
 * 6. त् (त + ्):
 *    - When followed by space, punctuation, or non-consonant -> ৎ (Khanda Ta U+09CE)
 *    - When followed by a consonant (conjunct) -> ত্ (forms standard conjunct ligatures: ত্ত, ত্য, ত্ব, etc.)
 * 7. Danda (।) -> । (U+0964 Dari) and Double Danda (॥) -> ॥ (U+0965)
 */
function convertDevaToBengali(text: string): string {
  let result = "";
  const len = text.length;

  for (let i = 0; i < len; i++) {
    const ch = text[i];
    const code = ch.charCodeAt(0);

    // Pan-Indic Punctuation: Danda (। U+0964) and Double Danda (॥ U+0965)
    if (code === 0x0964) {
      result += "।";
      continue;
    }
    if (code === 0x0965) {
      result += "॥";
      continue;
    }
    if (code === 0x0970) {
      result += "॰";
      continue;
    }

    // 1. Va -> ৱ (U+09F1)
    if (code === 0x0935) { // व
      result += "ৱ";
      continue;
    }

    // 2. Ba -> ব (U+09AC)
    if (code === 0x092C) { // ब
      result += "ব";
      continue;
    }

    // 3. Ya -> য় (standalone) vs ্য (conjunct with virama)
    if (code === 0x092F) { // य
      // If preceded by virama ् (0x094D), standard Bengali ya-phalā ligature is formed with য (0x09AF)
      if (i > 0 && text[i - 1] === "्") {
        result += "য";
      } else {
        result += "য়";
      }
      continue;
    }

    // 4. Ra -> র (0x09B0)
    if (code === 0x0930) { // र
      result += "র";
      continue;
    }

    // 5. Pranava Om -> ওঁ
    if (code === 0x0950) { // ॐ
      result += "ওঁ";
      continue;
    }

    // 6. Avagraha ऽ -> ঽ
    if (code === 0x093D) { // ऽ
      result += "ঽ";
      continue;
    }

    // 7. Vocalic R / L svara
    if (code === 0x090B) { result += "ঋ"; continue; }
    if (code === 0x0960) { result += "ৠ"; continue; }
    if (code === 0x090C) { result += "ঌ"; continue; }
    if (code === 0x0961) { result += "ৡ"; continue; }
    if (code === 0x0943) { result += "ৃ"; continue; }
    if (code === 0x0944) { result += "ৄ"; continue; }
    if (code === 0x0962) { result += "ৢ"; continue; }
    if (code === 0x0963) { result += "ৣ"; continue; }

    // 8. Lateral ळ -> ল
    if (code === 0x0933) { result += "ল"; continue; }

    // 9. Special check for Ta + Virama (त्):
    // If त is followed by ् (0x094D) and next character is NOT a Devanagari consonant (space, punctuation, end of string)
    if (code === 0x0924 && i + 1 < len && text[i + 1] === "्") { // त्
      const nextNext = i + 2 < len ? text[i + 2] : "";
      const nextNextCode = nextNext ? nextNext.charCodeAt(0) : 0;
      const isNextConsonant = (nextNextCode >= 0x0915 && nextNextCode <= 0x0939) || (nextNextCode >= 0x0958 && nextNextCode <= 0x095F);
      
      if (!isNextConsonant) {
        // Isolated / word-final halanta ta followed by space, punctuation, or end of string -> ৎ
        result += "ৎ";
        i++; // skip virama ्
        continue;
      }
    }

    // Standard Brahmic offset for Bengali
    if (code >= 0x0900 && code <= 0x097F) {
      const offset = code - 0x0900;
      const targetCode = 0x0980 + offset;
      result += String.fromCharCode(targetCode);
    } else {
      result += ch;
    }
  }

  return formatBengaliKhandaTa(result);
}

/**
 * Convert Bengali script back to Devanagari accurately preserving ৱ -> व, ব -> ब, য়/য -> य
 */
function convertBengaliToDevanagari(text: string): string {
  let result = "";
  const len = text.length;

  for (let i = 0; i < len; i++) {
    const ch = text[i];
    const code = ch.charCodeAt(0);

    if (ch === "ৱ") {
      result += "व";
      continue;
    }
    if (ch === "ব") {
      result += "ब";
      continue;
    }
    if (ch === "য়" || ch === "য") {
      result += "य";
      continue;
    }
    if (ch === "র") {
      result += "र";
      continue;
    }
    if (ch === "ড়") {
      result += "ड";
      continue;
    }
    if (ch === "ঢ়") {
      result += "ढ";
      continue;
    }
    if (ch === "ৎ") {
      result += "त्";
      continue;
    }
    if (ch === "ঋ") { result += "ऋ"; continue; }
    if (ch === "ৠ") { result += "ॠ"; continue; }
    if (ch === "ঌ") { result += "ऌ"; continue; }
    if (ch === "ৡ") { result += "ॡ"; continue; }
    if (ch === "ৃ") { result += "ृ"; continue; }
    if (ch === "ৄ") { result += "ॄ"; continue; }
    if (ch === "ৢ") { result += "ॢ"; continue; }
    if (ch === "ৣ") { result += "ॣ"; continue; }
    if (ch === "ঽ") { result += "ऽ"; continue; }

    if (code >= 0x0980 && code <= 0x09FF) {
      const offset = code - 0x0980;
      result += String.fromCharCode(0x0900 + offset);
    } else {
      result += ch;
    }
  }

  return result;
}

// Special Tamil consonant fallback mapping for classical Sanskrit texts
function mapDevaCharToTamil(code: number): string {
  // Ka group (क, ख, ग, घ -> க, ङ -> ங)
  if (code >= 0x0915 && code <= 0x0918) return "க";
  if (code === 0x0919) return "ங";
  // Ca group (च, छ -> ச, ज, झ -> ஜ, ञ -> ஞ)
  if (code === 0x091A || code === 0x091B) return "ச";
  if (code === 0x091C || code === 0x091D) return "ஜ";
  if (code === 0x091E) return "ஞ";
  // Ta retroflex (ट, ठ, ड, ढ -> ட, ण -> ண)
  if (code >= 0x091F && code <= 0x0922) return "ட";
  if (code === 0x0923) return "ண";
  // Ta dental (त, थ, द, ध -> த, न -> ந)
  if (code >= 0x0924 && code <= 0x0927) return "த";
  if (code === 0x0928) return "ந";
  // Pa labial (प, फ, ब, भ -> ப, म -> ம)
  if (code >= 0x092A && code <= 0x092D) return "ப";
  if (code === 0x092E) return "ம";
  // Sibilants
  if (code === 0x0936) return "ஶ";
  if (code === 0x0937) return "ஷ";
  if (code === 0x0938) return "ஸ";
  if (code === 0x0939) return "ஹ";
  if (code === 0x0902) return "ஂ"; // Anusvara
  if (code === 0x0903) return "꞉"; // Visarga

  const offset = code - 0x0900;
  return String.fromCharCode(0x0B80 + offset);
}

// Convert Devanagari to IAST (Roman with diacritics)
export function devanagariToIast(text: string): string {
  if (!text) return "";
  
  const DEVA_VOWELS: Record<string, string> = {
    "अ": "a", "आ": "ā", "इ": "i", "ई": "ī", "उ": "u", "ऊ": "ū",
    "ऋ": "ṛ", "ॠ": "ṝ", "ऌ": "ḷ", "ॡ": "ḹ", "ए": "e", "ऐ": "ai",
    "ओ": "o", "औ": "au"
  };

  const DEVA_MATRAS: Record<string, string> = {
    "ा": "ā", "ि": "i", "ी": "ī", "ु": "u", "ू": "ū",
    "ृ": "ṛ", "ॄ": "ṝ", "ॢ": "ḷ", "ॣ": "ḹ", "े": "e", "ै": "ai",
    "ो": "o", "ौ": "au"
  };

  const DEVA_CONSONANTS: Record<string, string> = {
    "क": "k", "ख": "kh", "ग": "g", "घ": "gh", "ङ": "ṅ",
    "च": "c", "छ": "ch", "ज": "j", "झ": "jh", "ञ": "ñ",
    "ट": "ṭ", "ठ": "ṭh", "ड": "ḍ", "ढ": "ḍh", "ण": "ṇ",
    "त": "t", "थ": "th", "द": "d", "ध": "dh", "न": "n",
    "प": "p", "फ": "ph", "ब": "b", "भ": "bh", "म": "m",
    "य": "y", "र": "r", "ल": "l", "व": "v",
    "श": "ś", "ष": "ṣ", "स": "s", "ह": "h",
    "ळ": "ḻ"
  };

  const DEVA_SPECIAL: Record<string, string> = {
    "ं": "ṃ", "ः": "ḥ", "ँ": "m̐", "ऽ": "'", "ॐ": "oṁ",
    "०": "0", "१": "1", "२": "2", "३": "3", "४": "4",
    "५": "5", "६": "6", "७": "7", "८": "8", "९": "9",
    "।": " |", "॥": " ||"
  };

  let out = "";
  const len = text.length;

  for (let i = 0; i < len; i++) {
    const ch = text[i];
    
    // Check Independent Vowels
    if (DEVA_VOWELS[ch]) {
      out += DEVA_VOWELS[ch];
      continue;
    }

    // Check Special signs / Digits
    if (DEVA_SPECIAL[ch]) {
      out += DEVA_SPECIAL[ch];
      continue;
    }

    // Check Consonants
    if (DEVA_CONSONANTS[ch]) {
      const cons = DEVA_CONSONANTS[ch];
      const next = i + 1 < len ? text[i + 1] : "";
      
      // If followed by Virama (्), drop inherent 'a'
      if (next === "्") {
        out += cons;
        i++; // skip virama
      }
      // If followed by Matra, attach matra sound
      else if (DEVA_MATRAS[next]) {
        out += cons + DEVA_MATRAS[next];
        i++; // skip matra
      }
      // Inherent 'a'
      else {
        out += cons + "a";
      }
      continue;
    }

    // Default passthrough
    out += ch;
  }

  return out;
}

// Convert IAST to Devanagari
export function iastToDevanagari(text: string): string {
  if (!text) return "";

  // Sort longest keys first for greedy match
  const IAST_MAP: [string, string][] = [
    ["oṁ", "ॐ"], ["om", "ॐ"],
    ["kṣ", "क्ष्"], ["jñ", "ज्ञ्"],
    ["kh", "ख्"], ["gh", "घ्"], ["ch", "छ्"], ["jh", "झ्"],
    ["ṭh", "ठ्"], ["ḍh", "ढ्"], ["th", "थ्"], ["dh", "ध्"],
    ["ph", "फ्"], ["bh", "भ्"],
    ["k", "क्"], ["g", "ग्"], ["ṅ", "ङ्"],
    ["c", "च्"], ["j", "ज्"], ["ñ", "ञ्"],
    ["ṭ", "ट्"], ["ḍ", "ड्"], ["ṇ", "ण्"],
    ["t", "त्"], ["d", "द्"], ["n", "न्"],
    ["p", "प्"], ["b", "ब्"], ["m", "म्"],
    ["y", "य्"], ["r", "र्"], ["l", "ल्"], ["v", "व्"],
    ["ś", "श्"], ["ṣ", "ष्"], ["s", "स्"], ["h", "ह्"], ["ḻ", "ळ्"],
    ["ai", "ऐ"], ["au", "औ"],
    ["ā", "आ"], ["ī", "ई"], ["ū", "ऊ"],
    ["ṛ", "ऋ"], ["ṝ", "ॠ"], ["ḷ", "ऌ"], ["ḹ", "ॡ"],
    ["a", "अ"], ["i", "इ"], ["u", "उ"], ["e", "ए"], ["o", "ओ"],
    ["ṃ", "ं"], ["ḥ", "ः"], ["m̐", "ँ"], ["'", "ऽ"]
  ];

  const MATRA_MAP: Record<string, string> = {
    "a": "", "ā": "ा", "i": "ि", "ī": "ी", "u": "ु", "ū": "ू",
    "ṛ": "ृ", "ṝ": "ॄ", "ḷ": "ॢ", "ḹ": "ॣ", "e": "े", "ai": "ै",
    "o": "ो", "au": "ौ"
  };

  // Process tokens with consonant + vowel coalescing
  let result = "";
  let i = 0;
  const len = text.length;

  while (i < len) {
    let matched = false;

    // Check consonant combinations
    for (const [iast, deva] of IAST_MAP) {
      if (text.substr(i, iast.length).toLowerCase() === iast) {
        // If it's a consonant ending with virama '्'
        if (deva.endsWith("्")) {
          const pureConsonant = deva.slice(0, -1);
          const nextIdx = i + iast.length;
          
          // Check following vowel for Matra
          let vowelFound = false;
          for (const [vIast, matra] of [
            ["ai", "ै"], ["au", "ौ"],
            ["ā", "ा"], ["ī", "ी"], ["ū", "ू"],
            ["ṛ", "ृ"], ["ṝ", "ॄ"], ["ḷ", "ॢ"], ["ḹ", "ॣ"],
            ["a", ""], ["i", "ि"], ["u", "ु"], ["e", "े"], ["o", "ो"]
          ] as [string, string][]) {
            if (text.substr(nextIdx, vIast.length).toLowerCase() === vIast) {
              result += pureConsonant + matra;
              i = nextIdx + vIast.length;
              vowelFound = true;
              break;
            }
          }

          if (!vowelFound) {
            result += deva; // virama remains
            i += iast.length;
          }
          matched = true;
          break;
        } else {
          // Pure vowel or special symbol
          result += deva;
          i += iast.length;
          matched = true;
          break;
        }
      }
    }

    if (!matched) {
      result += text[i];
      i++;
    }
  }

  return result;
}
