import { GranthaChapter, GranthaVerse, TextEntry } from "../types";
import { BRAHMASUTRA_ADHYAYA_1 } from "../brahmasutraAdhyaya1Data";
import { BRAHMASUTRA_ADHYAYA_2 } from "../brahmasutraAdhyaya2Data";
import { BRAHMASUTRA_ADHYAYA_3 } from "../brahmasutraAdhyaya3Data";
import { BRAHMASUTRA_ADHYAYA_4 } from "../brahmasutraAdhyaya4Data";
import { BRAHMASUTRA_GRANTHA } from "../brahmasutraniData";
import { SHAKTI_BHASHYA_GRANTHA } from "../shaktibhashyaData";

/**
 * Nyāyaprasthāna (Brahmasūtram) Data Loading & Exegetical Cross-Referencing Engine
 * 
 * Provides verse-by-verse (sūtra-by-sūtra) parsing, Padaccheda word-tokenization,
 * 5-tier Adhikaraṇa reconstruction (Viṣaya, Saṁśaya, Pūrvapakṣa, Siddhānta, Saṅgati),
 * and multidirectional cross-referencing across Śruti, Smṛti, Tarka, and classical Bhāṣyas
 * including MM Pañcānana Tarkaratna's Śāktabhāṣyam.
 */

export type NyayaPrasthanaType = "sruti" | "smrti" | "tarka" | "internal" | "bhashya";

export interface NyayaWordToken {
  word: string;
  padaccheda: string;
  grammaticalRole?: string;
  meaningEn?: string;
}

export interface NyayaAdhikaranaDetails {
  name: string;
  sanskritName: string;
  adhyayaIndex: 1 | 2 | 3 | 4;
  padaIndex: 1 | 2 | 3 | 4;
  sutraRange: string;
  visayaVakya: string; // Vedic passage under inquiry
  visayaVakyaSource: string; // e.g. "Chāndogya Upaniṣad 6.2.1"
  samsaya: string; // Dialectical doubt
  purvapaksa: string; // Opponent thesis (Sāṅkhya, Mīmāṁsā, etc.)
  siddhanta: string; // Conclusive aphoristic judgment
  sangati: string; // Logical coherence within the treatise
}

export interface NyayaMappingCrossReference {
  id: string;
  type: NyayaPrasthanaType;
  targetCategory: string; // "Śruti-Prasthāna", "Smṛti-Prasthāna", "Tarka / Dialectical Refutation", "Bhāṣya Divergence"
  sourceRef: string; // e.g. "Chāndogya Upaniṣad 6.2.1", "Bhagavad Gītā 13.4"
  sanskritQuote: string;
  quoteIast: string;
  hermeneuticalRole: string; // How this sūtra interprets and resolves the passage
  traditionAlignment?: string; // "Advaita", "Śākta-Vedānta", "Viśiṣṭādvaita", "Dvaita"
  linkedSutraIds?: string[];
}

export interface ParsedNyayaSutra {
  id: string; // "bs-1-1-1"
  sutraNumber: string; // "1.1.1"
  adhyayaIndex: 1 | 2 | 3 | 4;
  padaIndex: 1 | 2 | 3 | 4;
  sutraTitle: string;
  mulaSanskrit: string;
  mulaIast: string;
  padaccheda: string;
  padacchedaWords: NyayaWordToken[];
  anvaya: string;
  englishTranslation: string;
  bhashyaExtract: string;
  commentaryNotes: string;
  adhikarana: NyayaAdhikaranaDetails;
  crossReferences: NyayaMappingCrossReference[];
  philosophicalThemes: string[];
  saktabhashyaSnippet?: {
    sanskritText: string;
    englishExplanation: string;
    doctrineTag: string;
  };
}

export interface NyayaMappingBundle {
  grantha: TextEntry;
  saktaGrantha: TextEntry;
  chapters: GranthaChapter[];
  allSutras: ParsedNyayaSutra[];
  adhikaranas: NyayaAdhikaranaDetails[];
  crossReferenceIndex: Map<string, NyayaMappingCrossReference[]>;
  totalSutras: number;
}

// Canonical Adhikaraṇa Knowledge-Base for the Nyāyaprasthāna
const ADHIKARANA_CATALOG: Record<string, Partial<NyayaAdhikaranaDetails>> = {
  "1.1.1": {
    name: "Jijñāsādhikaraṇa",
    sanskritName: "जिज्ञासाधिकरणम्",
    visayaVakya: "तद्विजिज्ञासस्व, तद्ब्रह्मेति ।",
    visayaVakyaSource: "Taittirīya Upaniṣad 3.1.1",
    samsaya: "Whether Brahman should be inquired into, or if ritual works alone suffice for final beatitude.",
    purvapaksa: "Ritual action (Dharma-Mīmāṁsā) is the sole Vedic mandate; Brahman, being an already existent entity, cannot be commanded.",
    siddhanta: "Inquiry into Brahman is imperative because the fruits of rituals are finite, whereas direct Brahman-realization confers eternal liberation.",
    sangati: "Opens the entire treatise by establishing the distinct subject-matter (Viṣaya) and fruit (Prayojana) of Vedānta.",
  },
  "1.1.2": {
    name: "Janmādyadhikaraṇa",
    sanskritName: "जन्माद्यधिकरणम्",
    visayaVakya: "यतो वा इमानि भूतानि जायन्ते, येन जातानि जीवन्ति, यत्प्रयन्त्यभिसंविशन्ति, तद्विजिज्ञासस्व, तद्ब्रह्मेति ।",
    visayaVakyaSource: "Taittirīya Upaniṣad 3.1.1",
    samsaya: "Can this world of astonishing complexity and design serve as the indicative definition (Taṭastha-Lakṣaṇa) of Brahman?",
    purvapaksa: "Matter (Pradhāna) or accidental atomic combinations (Paramāṇu) could spontaneously evolve into the universe without conscious supervision.",
    siddhanta: "Only an Omniscient, Omnipotent Conscious Absolute can be the source of cosmic origination, preservation, and dissolution.",
    sangati: "Provides the definitive cosmic characteristics of the Brahman introduced in the first sūtra.",
  },
  "1.1.3": {
    name: "Śāstrayonitvādhikaraṇa",
    sanskritName: "शास्त्रयोनित्वाधिकरणम्",
    visayaVakya: "तं त्वौपनिषदं पुरुषं पृच्छामि । अस्य महतो भूतस्य निःश्वसितमेतद् यदृग्वेदः ।",
    visayaVakyaSource: "Bṛhadāraṇyaka Upaniṣad 3.9.26 & 2.4.10",
    samsaya: "Is Brahman knowable via empirical inference (Anumāna) or solely through Scriptural Revelation (Śabda-Pramāṇa)?",
    purvapaksa: "Cosmic causation can be inferred dialectically like a pot from clay, rendering scripture redundant.",
    siddhanta: "Brahman is supersensuous and transcends all empirical inference; sacred Scripture alone is the authoritative means of knowledge.",
    sangati: "Substantiates the epistemological foundation (Pramāṇa) of the definition given in sūtra 1.1.2.",
  },
  "1.1.4": {
    name: "Samanvayādhikaraṇa",
    sanskritName: "समन्वयाधिकरणम्",
    visayaVakya: "सदेव सोम्येदमग्र आसीदेकमेवाद्वितीयम् । तत्त्वमसि श्वेतकेतो ।",
    visayaVakyaSource: "Chāndogya Upaniṣad 6.2.1 & 6.8.7",
    samsaya: "Do Upaniṣads directly reveal the existent Non-Dual Self, or do they merely enjoin contemplative action (Upāsanā-Vidhi)?",
    purvapaksa: "Scripture is valid only when enjoining action (Kāryaparatva); description of an already existing reality (Siddha-Vastu) is purposeless.",
    siddhanta: "All Vedānta passages harmoniously converge (Samanvaya) upon the self-luminous, non-dual Brahman, revealing direct freedom from ignorance.",
    sangati: "Culminates the Catussūtrī by harmonizing the entire canon on unconditioned Brahman.",
  },
  "1.1.5": {
    name: "Īkṣatyadhikaraṇa",
    sanskritName: "ईक्षत्यधिकरणम्",
    visayaVakya: "सदेव सोम्येदमग्र आसीत्... तदैक्षत बहु स्यां प्रजायेयेति ।",
    visayaVakyaSource: "Chāndogya Upaniṣad 6.2.1-3",
    samsaya: "Does the term 'Sat' (Being) denote the insentient Pradhāna of Sāṅkhya or the Conscious Brahman?",
    purvapaksa: "Pradhāna possessing three Guṇas can transform into manifold names and forms through creative equilibrium shift.",
    siddhanta: "Scripture ascribes conscious volition ('Aikṣata' - It saw/thought) to the First Cause, which is impossible for insentient Pradhāna.",
    sangati: "Begins the systematic refutation of rival materialist cosmological models.",
  },
  "1.4.23": {
    name: "Prakṛtyadhikaraṇa",
    sanskritName: "प्रकृत्यधिकरणम्",
    visayaVakya: "उत तमादेशमप्राक्ष्यः येनाश्रुतं श्रुतं भवत्यमतं मतमविज्ञातं विज्ञातम् ।",
    visayaVakyaSource: "Chāndogya Upaniṣad 6.1.3",
    samsaya: "Is Brahman merely the instrumental/efficient cause (Nimitta-Kāraṇa) or also the material cause (Upādāna-Kāraṇa)?",
    purvapaksa: "Like a potter making pots, God is merely the efficient architect, while matter provides the separate raw material.",
    siddhanta: "Brahman is both the indivisible material and efficient cause (Abhinna-Nimittopādāna-Kāraṇa), through conscious self-manifestation.",
    sangati: "Integrates the cosmological doctrine with the identity of the cosmic cause.",
  },
  "2.1.14": {
    name: "Tadananyatvādhikaraṇa",
    sanskritName: "तदनन्यत्वाधिकरणम्",
    visayaVakya: "वाचारम्भणं विकारो नामधेयं मृत्तिकेत्येव सत्यम् ।",
    visayaVakyaSource: "Chāndogya Upaniṣad 6.1.4",
    samsaya: "Is the created universe fundamentally different from Brahman or non-different?",
    purvapaksa: "The effect is visibly distinct in name, function, and form from its cause (Asatkāryavāda).",
    siddhanta: "The effect is non-different from its material ground (Satkāryavāda / Vivartavāda / Cit-Pariṇāmavāda); name and form are verbal designations upon the Absolute substrate.",
    sangati: "Defends Vedāntic non-duality against ontological fragmentation.",
  },
  "2.2.1": {
    name: "Racanānupapattyadhikaraṇa",
    sanskritName: "रचनानुपपत्त्यधिकरणम्",
    visayaVakya: "Dialectical Refutation of Sāṅkhya Dualistic Evolution",
    visayaVakyaSource: "Sāṅkhya-Kārikā 16 & Śruti Hermeneutics",
    samsaya: "Can insentient Pradhāna spontaneously organize the universe for the sake of Puruṣa's enjoyment and release?",
    purvapaksa: "Just as insentient milk spontaneously transforms into curd for the nourishment of a calf, Pradhāna evolves without divine oversight.",
    siddhanta: "Insentient entities have no spontaneous impetus or design capability; milk flows only within living, conscious physiological systems.",
    sangati: "Opens the Tarka-Pāda's philosophical dismantling of rival non-Vedic paradigms.",
  },
  "4.4.1": {
    name: "Sampadyāvirbhāvādhikaraṇa",
    sanskritName: "सम्पद्याविर्भावाधिकरणम्",
    visayaVakya: "एवमेवैष सम्प्रसादोऽस्माच्छरीरात्समुत्थाय परं ज्योतिरुपसम्पद्य स्वेन रूपेणाभिनिष्पद्यते ।",
    visayaVakyaSource: "Chāndogya Upaniṣad 8.12.3",
    samsaya: "Does the liberated soul acquire a brand new supernatural form, or merely manifest its innate, pristine divine nature?",
    purvapaksa: "Liberation is a newly generated status (Utpatti) or transformation (Vikāra) achieved through spiritual efforts.",
    siddhanta: "Liberation is the manifestation of one's own eternal, intrinsic self-nature ('Svena rūpeṇa') upon the removal of ignorance.",
    sangati: "Establishes the supreme fruit (Phala) of spiritual liberation.",
  },
};

// Canonical Cross-References Across Śruti, Smṛti, and Tarka
const SUTRA_CROSS_REFERENCES: Record<string, NyayaMappingCrossReference[]> = {
  "1.1.1": [
    {
      id: "cr-1-1-1-sruti",
      type: "sruti",
      targetCategory: "Śruti-Prasthāna (Upaniṣads)",
      sourceRef: "Taittirīya Upaniṣad 3.1.1",
      sanskritQuote: "तद्विजिज्ञासस्व, तद्ब्रह्मेति ।",
      quoteIast: "tad vijijñāsasva, tad brahmeti |",
      hermeneuticalRole: "Direct Vedic locus commanding the supreme spiritual inquiry into the source of all being.",
      traditionAlignment: "Synthesized in all schools",
    },
    {
      id: "cr-1-1-1-smrti",
      type: "smrti",
      targetCategory: "Smṛti-Prasthāna (Gītā)",
      sourceRef: "Bhagavad Gītā 13.4",
      sanskritQuote: "ब्रह्मसूत्रपदैश्चैव हेतुमद्भिर्विनिश्चितैः ॥",
      quoteIast: "brahmasūtrapadaiś caiva hetumadbhir viniścitaiḥ ||",
      hermeneuticalRole: "Lord Kṛṣṇa explicitly corroborates that the nature of the Kshetra and Kshetragna is determinately established by the aphorisms of the Brahma Sūtras.",
      traditionAlignment: "All Vedāntic Traditions",
    },
    {
      id: "cr-1-1-1-sakta",
      type: "bhashya",
      targetCategory: "Śāktabhāṣyam (Bhatpara Tradition)",
      sourceRef: "Brahmasūtra-Śāktabhāṣyam 1.1.1 (MM Pañcānana Tarkaratna)",
      sanskritQuote: "शक्तिरेव ब्रह्म, ब्रह्मैव शक्तिरिति शक्तिशक्तिमदभेदात् चिन्मय्या जगन्मातुर्जिज्ञासा ।",
      quoteIast: "śaktir eva brahma, brahmaiva śaktir iti śakti-śaktimad-abhedāt cinmayyā jagan-mātur jijñāsā |",
      hermeneuticalRole: "Establishes Svarūpādvaita: Brahman is none other than Cinmayī Parā-Śakti; inquiring into Brahman is inquiring into the Supreme Mother.",
      traditionAlignment: "Śākta-Vedānta Svarūpādvaita",
    },
  ],
  "1.1.2": [
    {
      id: "cr-1-1-2-sruti",
      type: "sruti",
      targetCategory: "Śruti-Prasthāna (Upaniṣads)",
      sourceRef: "Taittirīya Upaniṣad 3.1.1",
      sanskritQuote: "यतो वा इमानि भूतानि जायन्ते, येन जातानि जीवन्ति, यत्प्रयन्त्यभिसंविशन्ति...",
      quoteIast: "yato vā imāni bhūtāni jāyante, yena jātāni jīvanti, yat prayanty abhisaṁviśanti...",
      hermeneuticalRole: "Provides the classic threefold cosmic signposts (birth, life, dissolution) pointing to the Omniscient Ground of Reality.",
      traditionAlignment: "Catussūtrī Locus",
    },
    {
      id: "cr-1-1-2-sakta",
      type: "bhashya",
      targetCategory: "Śāktabhāṣyam (Bhatpara Tradition)",
      sourceRef: "Brahmasūtra-Śāktabhāṣyam 1.1.2 (MM Pañcānana Tarkaratna)",
      sanskritQuote: "न जडपरिणामः, अपि तु मणिरश्मिवत् स्वशक्त्या चिद्विलासरूपः परिणामः ।",
      quoteIast: "na jaḍa-pariṇāmaḥ, api tu maṇi-raśmivat sva-śaktyā cid-vilāsa-rūpaḥ pariṇāmaḥ |",
      hermeneuticalRole: "Refutes insentient transformation while upholding cosmic reality: creation is the conscious effulgence (Cit-Pariṇāma) of Parā-Śakti.",
      traditionAlignment: "Śākta-Vedānta Svarūpādvaita",
    },
  ],
  "1.1.3": [
    {
      id: "cr-1-1-3-sruti",
      type: "sruti",
      targetCategory: "Śruti-Prasthāna (Upaniṣads)",
      sourceRef: "Bṛhadāraṇyaka Upaniṣad 3.9.26",
      sanskritQuote: "तं त्वौपनिषदं पुरुषं पृच्छामि ।",
      quoteIast: "taṁ tv aupaniṣadaṁ puruṣaṁ pṛcchāmi |",
      hermeneuticalRole: "Proves that the Supreme Being is revealed exclusively through the sacred Upaniṣads (Aupaniṣada Puruṣa), not dry sensory deduction.",
      traditionAlignment: "Advaita & Śrī-Bhāṣya",
    },
    {
      id: "cr-1-1-3-sakta",
      type: "bhashya",
      targetCategory: "Śāktabhāṣyam (Bhatpara Tradition)",
      sourceRef: "Brahmasūtra-Śāktabhāṣyam 1.1.3 (MM Pañcānana Tarkaratna)",
      sanskritQuote: "शास्त्रं—ऋगादिवेदाः शैवशाक्तागमाश्च योनिरुत्पत्तिस्थानं प्रमाणं वा । आगमनिगमैकगम्यैव सा जगदम्बा ।",
      quoteIast: "śāstraṁ—ṛg-ādi-vedāḥ śaiva-śāktāgamāś ca yonir utpatti-sthānaṁ pramāṇaṁ vā | āgama-nigamaika-gamyāiva sā jagad-ambā |",
      hermeneuticalRole: "Harmonizes Vedic Nigama with Śākta Tantra-Āgama, proving the Supreme Mother is revealed through sacred canonical testimony.",
      traditionAlignment: "Śākta-Vedānta",
    },
  ],
  "1.1.4": [
    {
      id: "cr-1-1-4-sruti",
      type: "sruti",
      targetCategory: "Śruti-Prasthāna (Upaniṣads)",
      sourceRef: "Chāndogya Upaniṣad 6.2.1",
      sanskritQuote: "सदेव सोम्येदमग्र आसीदेकमेवाद्वितीयम् ।",
      quoteIast: "sad eva somyedam agra āsīd ekam evādvitīyam |",
      hermeneuticalRole: "The foundational proclamation of unconditioned non-dual reality upon which all Vedantic aphorisms converge.",
      traditionAlignment: "Universal Vedānta",
    },
    {
      id: "cr-1-1-4-sakta",
      type: "bhashya",
      targetCategory: "Śāktabhāṣyam (Bhatpara Tradition)",
      sourceRef: "Brahmasūtra-Śāktabhāṣyam 1.1.4 (MM Pañcānana Tarkaratna)",
      sanskritQuote: "शक्तिमान् शिवः, शक्तिश्च काली-तारा-महात्रिपुरसुन्दरीति न भेदगन्धोऽपि ।",
      quoteIast: "śaktimān śivaḥ, śaktiś ca kālī-tārā-mahātripurasundarīti na bheda-gandho'pi |",
      hermeneuticalRole: "Synthesizes Samanvaya into the transcendent non-dual identity of Śiva and Śakti: the eternal Mother of the cosmos.",
      traditionAlignment: "Śākta-Vedānta Svarūpādvaita",
    },
  ],
  "1.1.5": [
    {
      id: "cr-1-1-5-tarka",
      type: "tarka",
      targetCategory: "Tarka / Dialectical Refutation",
      sourceRef: "Sāṅkhya-Kārikā 10-11 & Chāndogya 6.2.3",
      sanskritQuote: "तदैक्षत बहु स्यां प्रजायेयेति तत्तेजोऽसृजत ।",
      quoteIast: "tad aikṣata bahu syāṁ prajāyeyeti tat tejo'sṛjata |",
      hermeneuticalRole: "Refutation of Sāṅkhya: Inanimate Pradhāna lacks conscious volition ('Aikṣata'); therefore, the cosmic origin is inherently intelligent.",
      traditionAlignment: "Refutation of Pradhāna",
    },
  ],
  "1.4.23": [
    {
      id: "cr-1-4-23-sruti",
      type: "sruti",
      targetCategory: "Śruti-Prasthāna (Upaniṣads)",
      sourceRef: "Taittirīya Upaniṣad 2.7.1",
      sanskritQuote: "तदात्मानं स्वयमकुरुत । तस्मात्तत्सुकृतमुच्यत इति ।",
      quoteIast: "tad ātmānaṁ svayam akuruta | tasmāt tat sukṛtam ucyata iti |",
      hermeneuticalRole: "Proves that Brahman fashioned the universe out of Itself, establishing non-different material causality.",
      traditionAlignment: "Prakṛtyadhikaraṇa",
    },
  ],
  "2.1.14": [
    {
      id: "cr-2-1-14-sruti",
      type: "sruti",
      targetCategory: "Śruti-Prasthāna (Upaniṣads)",
      sourceRef: "Chāndogya Upaniṣad 6.1.4",
      sanskritQuote: "वाचारम्भणं विकारो नामधेयं मृत्तिकेत्येव सत्यम् ।",
      quoteIast: "vācārambhaṇaṁ vikāro nāmadheyaṁ mṛttikety eva satyam |",
      hermeneuticalRole: "The clay and pot metaphor demonstrating that transformation is verbal and nominal, while the conscious ground is immutable reality.",
      traditionAlignment: "Advaita Vivartavāda & Cit-Pariṇāma",
    },
  ],
  "2.2.1": [
    {
      id: "cr-2-2-1-tarka",
      type: "tarka",
      targetCategory: "Tarka / Dialectical Refutation",
      sourceRef: "Sāṅkhya-Kārikā 57",
      sanskritQuote: "वत्सविवृद्धिनिमित्तं क्षीरस्य यथा प्रवृत्तिरज्ञस्य ।",
      quoteIast: "vatsa-vivṛddhi-nimittaṁ kṣīrasya yathā pravṛttir ajñasya |",
      hermeneuticalRole: "Dismantles the classic Sāṅkhya analogy of unthinking milk; unconscious matter cannot act teleologically without an immanent conscious ruler.",
      traditionAlignment: "Tarka-Pāda Dialectics",
    },
  ],
};

// Extracts Padaccheda word tokens and simple grammatical hints
function tokenizePadaccheda(padaccheda: string): NyayaWordToken[] {
  if (!padaccheda) return [];
  const words = padaccheda.split(/[,;\s]+/).map((w) => w.trim()).filter(Boolean);

  return words.map((word) => {
    let grammaticalRole = "Padam";
    let meaningEn = "";

    if (word.endsWith("ात्") || word.endsWith("त्वात्") || word.endsWith("ेः")) {
      grammaticalRole = "Pañcamī (Ablative - Hetu / Logical Reason)";
    } else if (word.endsWith("म्") || word.endsWith("न्")) {
      grammaticalRole = "Dvitīyā / Prathamā";
    } else if (word.endsWith("ा") || word.endsWith("ः") || word === "तत्" || word === "अथ" || word === "अतः") {
      grammaticalRole = word === "अथ" ? "Avyaya (Mangalācaraṇa / Ānantarya)" : word === "अतः" ? "Avyaya (Hetu)" : "Prathamā (Nominative)";
    }

    if (word === "अथ") meaningEn = "Now / Next (immediately following qualification)";
    if (word === "अतः") meaningEn = "Therefore (because ritual action is finite)";
    if (word.includes("जिज्ञासा")) meaningEn = "Inquiry / Desire to know";
    if (word.includes("जन्मादि") || word.includes("जन्म-आदि")) meaningEn = "Origination, preservation, and dissolution";
    if (word === "अस्य") meaningEn = "Of this manifested universe";
    if (word === "यतः") meaningEn = "From which (Supreme Omniscient Cause)";
    if (word.includes("शास्त्रयोनित्वात्")) meaningEn = "Because Scripture is the source/pramāṇa of knowledge";
    if (word === "तत्") meaningEn = "That Vedāntic truth";
    if (word === "तु") meaningEn = "However / But (dispelling counter-objections)";
    if (word.includes("समन्वयात्")) meaningEn = "Due to the harmonious synthesis of all texts";
    if (word.includes("ईक्षतेः")) meaningEn = "Because of conscious seeing / willing";
    if (word === "न") meaningEn = "Not";
    if (word.includes("अशब्दम्")) meaningEn = "That which is not taught by the Veda (Pradhāna)";

    return {
      word,
      padaccheda: word,
      grammaticalRole,
      meaningEn,
    };
  });
}

// Check for authentic Śāktabhāṣya verse from SHAKTI_BHASHYA_GRANTHA
function findShaktibhashyaVerse(sutraNumber: string, sutraId: string): GranthaVerse | undefined {
  if (!SHAKTI_BHASHYA_GRANTHA.chapters) return undefined;
  for (const ch of SHAKTI_BHASHYA_GRANTHA.chapters) {
    const v = ch.verses.find((item) => item.id === sutraId || item.number.includes(sutraNumber));
    if (v) return v;
  }
  return undefined;
}

/**
 * Parses a GranthaVerse into a rich, structured ParsedNyayaSutra entry
 */
export function parseSutraVerse(
  verse: GranthaVerse,
  adhyayaNum: 1 | 2 | 3 | 4 = 1,
  padaNum: 1 | 2 | 3 | 4 = 1
): ParsedNyayaSutra {
  const cleanNumber = verse.number.replace(/[^0-9.]/g, "").split(" ")[0] || `1.${adhyayaNum}.${padaNum}`;
  const padacchedaWords = tokenizePadaccheda(verse.padaccheda || "");

  // Match Adhikarana metadata from the catalog or construct fallbacks
  const catalogEntry = ADHIKARANA_CATALOG[cleanNumber] || ADHIKARANA_CATALOG[verse.id];
  const adhikarana: NyayaAdhikaranaDetails = {
    name: catalogEntry?.name || verse.title.split(":")[0] || "Nyāyādhikaraṇam",
    sanskritName: catalogEntry?.sanskritName || "न्यायाधिकरणम्",
    adhyayaIndex: adhyayaNum,
    padaIndex: padaNum,
    sutraRange: cleanNumber,
    visayaVakya: catalogEntry?.visayaVakya || "वेदान्तवाक्यसमन्वयः ।",
    visayaVakyaSource: catalogEntry?.visayaVakyaSource || "Classical Upaniṣadic Corpus",
    samsaya: catalogEntry?.samsaya || "Whether this sūtra reveals the unconditioned Supreme Brahman or a conditioned auxiliary.",
    purvapaksa: catalogEntry?.purvapaksa || "Prima facie objection based on conventional empirical understanding or rival schools.",
    siddhanta: catalogEntry?.siddhanta || "Conclusive aphoristic harmonization in non-dual Supreme Brahman.",
    sangati: catalogEntry?.sangati || "Harmonious link with the preceding and following sūtras.",
  };

  // Cross-references
  const crossReferences = SUTRA_CROSS_REFERENCES[cleanNumber] || SUTRA_CROSS_REFERENCES[verse.id] || [];

  // Śāktabhāṣya specific lookup
  const saktaMatch = findShaktibhashyaVerse(cleanNumber, verse.id);
  const saktabhashyaSnippet = saktaMatch
    ? {
        sanskritText: saktaMatch.bhashyaExtract || "",
        englishExplanation: saktaMatch.englishTranslation || saktaMatch.commentaryNotes || "",
        doctrineTag: "Śākta-Vedānta Svarūpādvaita (Bhatpara Tradition)",
      }
    : undefined;

  // Philosophical themes
  const themes: string[] = ["Brahma-Vidyā", "Samanvaya"];
  if (cleanNumber.startsWith("1.1")) themes.push("Catussūtrī", "Epistemology", "Taṭastha-Lakṣaṇa");
  if (cleanNumber.startsWith("1.2") || cleanNumber.startsWith("1.3")) themes.push("Upāsanā-Vākya", "Spasṭa-Brahma-Liṅga");
  if (cleanNumber.startsWith("1.4")) themes.push("Prakṛti-Kāraṇatva", "Sāṅkhya-Nirākaraṇa");
  if (cleanNumber.startsWith("2.1")) themes.push("Smṛti-Avirodha", "Satkāryavāda", "Tadananyatva");
  if (cleanNumber.startsWith("2.2")) themes.push("Tarka-Pāda", "Dialectical Refutation", "Kṣaṇikavāda-Bhaṅga");
  if (cleanNumber.startsWith("3.")) themes.push("Sādhanā", "Vidyās", "Ubhayaliṅga");
  if (cleanNumber.startsWith("4.")) themes.push("Mokṣa", "Utkrānti", "Svena Rūpeṇa");

  return {
    id: verse.id,
    sutraNumber: cleanNumber,
    adhyayaIndex: adhyayaNum,
    padaIndex: padaNum,
    sutraTitle: verse.title,
    mulaSanskrit: verse.mulaSanskrit,
    mulaIast: verse.mulaIast,
    padaccheda: verse.padaccheda || "",
    padacchedaWords,
    anvaya: verse.anvaya || "",
    englishTranslation: verse.englishTranslation || "",
    bhashyaExtract: verse.bhashyaExtract || "",
    commentaryNotes: verse.commentaryNotes || "",
    adhikarana,
    crossReferences,
    philosophicalThemes: themes,
    saktabhashyaSnippet,
  };
}

/**
 * Parses raw text input containing Brahmasūtra verses into structured ParsedNyayaSutra entries.
 * Supports custom imported Nyayaprasthana texts, formatting delimiters, and verse-by-verse parsing.
 */
export function parseRawNyayaText(rawText: string): ParsedNyayaSutra[] {
  if (!rawText.trim()) return [];

  // Split lines or double newlines
  const blocks = rawText
    .split(/\n\s*\n+/)
    .map((b) => b.trim())
    .filter(Boolean);

  const parsedResults: ParsedNyayaSutra[] = [];

  blocks.forEach((block, idx) => {
    // Detect sūtra numbering like 1.1.1 or ॥ १.१.१ ॥ or Sūtra 1
    const numMatch = block.match(/(\d+\.\d+\.\d+)|([१-४]\.[१-४]\.\d+)|(?:sūtra|verse)\s*(\d+)/i);
    const sutraNumber = numMatch ? numMatch[1] || numMatch[2] || `1.1.${idx + 1}` : `1.1.${idx + 1}`;

    // Extract Sanskrit line
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    const sanskritLine = lines.find((l) => /[\u0900-\u097F]/.test(l)) || lines[0] || "";
    const englishLine = lines.find((l) => /[a-zA-Z]/.test(l) && !l.toLowerCase().includes("padaccheda")) || "";
    const padacchedaLine = lines.find((l) => l.toLowerCase().includes("padaccheda") || l.includes("पदच्छेद")) || "";

    const cleanPadaccheda = padacchedaLine.replace(/^.*[:：]\s*/, "");
    const verseStub: GranthaVerse = {
      id: `custom-bs-${sutraNumber.replace(/\./g, "-")}-${idx}`,
      number: `Brahma Sūtra ${sutraNumber}`,
      title: `Sūtra ${sutraNumber}`,
      mulaSanskrit: sanskritLine,
      mulaIast: "",
      padaccheda: cleanPadaccheda,
      anvaya: "",
      englishTranslation: englishLine,
    };

    const parts = sutraNumber.split(".").map((n) => parseInt(n, 10));
    const adhIdx = (parts[0] >= 1 && parts[0] <= 4 ? parts[0] : 1) as 1 | 2 | 3 | 4;
    const padIdx = (parts[1] >= 1 && parts[1] <= 4 ? parts[1] : 1) as 1 | 2 | 3 | 4;

    parsedResults.push(parseSutraVerse(verseStub, adhIdx, padIdx));
  });

  return parsedResults;
}

/**
 * Loads the complete Nyāyaprasthāna dataset for the MappingUtility
 * with verse-by-verse parsing and comprehensive cross-referencing capabilities.
 */
export function loadNyayaPrasthanaMappingData(): NyayaMappingBundle {
  const chapters: GranthaChapter[] = [
    BRAHMASUTRA_ADHYAYA_1,
    BRAHMASUTRA_ADHYAYA_2,
    BRAHMASUTRA_ADHYAYA_3,
    BRAHMASUTRA_ADHYAYA_4,
  ];

  const allSutras: ParsedNyayaSutra[] = [];
  const adhikaranaMap = new Map<string, NyayaAdhikaranaDetails>();
  const crossReferenceIndex = new Map<string, NyayaMappingCrossReference[]>();

  chapters.forEach((chapter, chIdx) => {
    const adhyayaNum = (chIdx + 1) as 1 | 2 | 3 | 4;

    chapter.verses.forEach((verse) => {
      // Determine pada index from verse numbering or index
      let padaNum: 1 | 2 | 3 | 4 = 1;
      const numMatch = verse.number.match(/(\d+)\.(\d+)\.(\d+)/);
      if (numMatch && numMatch[2]) {
        const parsedPada = parseInt(numMatch[2], 10);
        if (parsedPada >= 1 && parsedPada <= 4) {
          padaNum = parsedPada as 1 | 2 | 3 | 4;
        }
      }

      const parsedSutra = parseSutraVerse(verse, adhyayaNum, padaNum);
      allSutras.push(parsedSutra);

      // Collect Adhikaranas
      if (parsedSutra.adhikarana.name) {
        adhikaranaMap.set(parsedSutra.adhikarana.name, parsedSutra.adhikarana);
      }

      // Collect Cross References
      if (parsedSutra.crossReferences.length > 0) {
        crossReferenceIndex.set(parsedSutra.sutraNumber, parsedSutra.crossReferences);
        crossReferenceIndex.set(parsedSutra.id, parsedSutra.crossReferences);
      }
    });
  });

  return {
    grantha: BRAHMASUTRA_GRANTHA,
    saktaGrantha: SHAKTI_BHASHYA_GRANTHA,
    chapters,
    allSutras,
    adhikaranas: Array.from(adhikaranaMap.values()),
    crossReferenceIndex,
    totalSutras: allSutras.length,
  };
}

/**
 * Query cross-references for a given sūtra ID or number
 */
export function getCrossReferencesForSutra(
  sutraIdOrNumber: string,
  bundle?: NyayaMappingBundle
): NyayaMappingCrossReference[] {
  if (bundle && bundle.crossReferenceIndex.has(sutraIdOrNumber)) {
    return bundle.crossReferenceIndex.get(sutraIdOrNumber) || [];
  }
  return SUTRA_CROSS_REFERENCES[sutraIdOrNumber] || [];
}

/**
 * Filter sūtras by cross-referenced school or source text
 */
export function searchCrossReferencedSutras(
  query: string,
  allSutras: ParsedNyayaSutra[]
): ParsedNyayaSutra[] {
  if (!query.trim()) return allSutras;
  const q = query.toLowerCase();

  return allSutras.filter((s) => {
    return (
      s.sutraNumber.includes(q) ||
      s.sutraTitle.toLowerCase().includes(q) ||
      s.mulaSanskrit.includes(query) ||
      s.adhikarana.name.toLowerCase().includes(q) ||
      s.adhikarana.sanskritName.includes(query) ||
      s.crossReferences.some(
        (cr) =>
          cr.sourceRef.toLowerCase().includes(q) ||
          cr.targetCategory.toLowerCase().includes(q) ||
          cr.sanskritQuote.includes(query) ||
          cr.hermeneuticalRole.toLowerCase().includes(q) ||
          (cr.traditionAlignment && cr.traditionAlignment.toLowerCase().includes(q))
      )
    );
  });
}
