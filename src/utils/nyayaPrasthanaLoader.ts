import { GranthaChapter, GranthaVerse, TextEntry } from "../types";
import { BRAHMASUTRA_ADHYAYA_1 } from "../brahmasutraAdhyaya1Data";
import { BRAHMASUTRA_ADHYAYA_2 } from "../brahmasutraAdhyaya2Data";
import { BRAHMASUTRA_ADHYAYA_3 } from "../brahmasutraAdhyaya3Data";
import { BRAHMASUTRA_ADHYAYA_4 } from "../brahmasutraAdhyaya4Data";
import { BRAHMASUTRA_GRANTHA } from "../brahmasutraniData";

export type PrasthanaType = "sruti" | "smrti" | "sampradaya" | "tarka";

export interface NyayaCrossReference {
  id: string;
  type: PrasthanaType;
  targetPrasthana: string; // e.g. "Śruti-Prasthāna (Upaniṣads)"
  sourceRef: string; // e.g. "Chāndogya Upaniṣad 6.2.1"
  sanskritQuote: string;
  quoteIast: string;
  hermeneuticalRole: string; // How this sūtra unpacks / resolves the passage
  granthaId?: string; // target text in PRESEEDED_GRANTHAS
  chapterId?: string;
  verseId?: string;
  traditionSchool?: string; // e.g. "Advaita", "Viśiṣṭādvaita", "Dvaita"
}

export interface NyayaAdhikaranaInfo {
  name: string;
  sanskritName: string;
  visayaVakya: string; // The Vedic statement under examination
  samsaya: string; // The doubt or contradictory interpretations
  purvapaksa: string; // The prima facie objection / rival thesis
  siddhanta: string; // The conclusive Vedantic aphoristic judgment
  sangati: string; // The logical connection to preceding & following topics
}

export interface NyayaSutraEntry {
  id: string; // e.g. "bs-1-1-1"
  sutraNumber: string; // "1.1.1"
  adhyayaIndex: 1 | 2 | 3 | 4;
  adhyayaTitle: string;
  adhyayaTitleSanskrit: string;
  padaNumber: 1 | 2 | 3 | 4;
  padaName: string;
  sutraTitle: string;
  mulaSanskrit: string;
  mulaIast: string;
  padaccheda: string;
  anvaya: string;
  bhashyaExtract: string;
  englishTranslation: string;
  commentaryNotes: string;
  adhikarana: NyayaAdhikaranaInfo;
  crossReferences: NyayaCrossReference[];
  philosophicalThemes: string[];
}

export interface AdhyayaSummaryInfo {
  number: 1 | 2 | 3 | 4;
  title: string;
  titleSanskrit: string;
  theme: string;
  totalPadas: number;
  sutraCount: number;
  padas: { padaNumber: 1 | 2 | 3 | 4; name: string; focus: string }[];
}

export const NYAYA_ADHYAYA_SUMMARIES: AdhyayaSummaryInfo[] = [
  {
    number: 1,
    title: "Samanvayādhyāya (Harmonious Synthesis)",
    titleSanskrit: "समन्वयाध्यायः",
    theme: "Harmonization of all ambiguous, obscure, and explicit Vedic statements onto non-dual Brahman",
    totalPadas: 4,
    sutraCount: 134,
    padas: [
      { padaNumber: 1, name: "Spasṭa-Brahma-Liṅga-Vākya", focus: "The Catussūtrī and clearly delineated passages of Brahman" },
      { padaNumber: 2, name: "Aspasṭa-Brahma-Liṅga-Vākya (Upāsana)", focus: "Vedic texts with subtle or obscure divine markers (Śāṇḍilyavidyā, Antaryāmī)" },
      { padaNumber: 3, name: "Aspasṭa-Brahma-Liṅga-Vākya (Jñāna)", focus: "Vedic passages concerning Dyubhvādyāyatana, Bhūmā, and Akṣara" },
      { padaNumber: 4, name: "Avyakta-Prakṛtyadhikaraṇa", focus: "Refuting Sāṅkhya Avyakta and establishing Brahman as both material and efficient cause" },
    ],
  },
  {
    number: 2,
    title: "Avirodhādhyāya (Non-Contradiction & Dialectic)",
    titleSanskrit: "अविरोधाध्यायः",
    theme: "Defending Vedāntic ontology against all rival philosophical schools and conflicting Smṛti traditions",
    totalPadas: 4,
    sutraCount: 157,
    padas: [
      { padaNumber: 1, name: "Smṛti-Pāda", focus: "Harmonizing Smṛti conflicts, Vivartavāda (Tadananyatva), and Divine Sport (Līlā)" },
      { padaNumber: 2, name: "Tarka-Pāda (Dialectical Critique)", focus: "Systematic dismantling of Sāṅkhya, Vaiśeṣika, Buddhist realism/idealism, Jaina, and Pāśupata systems" },
      { padaNumber: 3, name: "Viyad-ādi-Pāda", focus: "Origination and dissolution of subtle elements; the individual soul (Jīva) as reflection/portion" },
      { padaNumber: 4, name: "Prāṇa-Pāda", focus: "Origination and functions of the vital breaths, sensory faculties, and psychic organs" },
    ],
  },
  {
    number: 3,
    title: "Sādhanādhyāya (Spiritual Means & Epistemology)",
    titleSanskrit: "साधनाध्यायः",
    theme: "The spiritual disciplines, dream analysis, the twofold nature of Brahman (Ubhayaliṅga), and meditation Vidyās",
    totalPadas: 4,
    sutraCount: 186,
    padas: [
      { padaNumber: 1, name: "Vairāgya-Pāda", focus: "Transmigration of the enveloped soul in Pañcāgnividyā to evoke supreme dispassion" },
      { padaNumber: 2, name: "Ubhayaliṅga-Pāda", focus: "States of consciousness (waking, dream, deep sleep, swoon) and Brahman's formless majesty ('Neti Neti')" },
      { padaNumber: 3, name: "Guṇopasaṁhāra-Pāda", focus: "Synthesis and integration of contemplative Upaniṣadic Vidyās across Vedic recensions" },
      { padaNumber: 4, name: "Aṅgāvabaddha / Puruṣārtha-Pāda", focus: "Direct Self-Knowledge alone bestows liberation independent of ritual action" },
    ],
  },
  {
    number: 4,
    title: "Phalādhyāya (The Fruit of Liberation)",
    titleSanskrit: "फलाध्यायः",
    theme: "The destruction of karmas, Jīvanmukti, the departure of the subtle body, and eternal non-return to Saṁsāra",
    totalPadas: 4,
    sutraCount: 78,
    padas: [
      { padaNumber: 1, name: "Āvṛtti-Pāda", focus: "Repeated contemplation, meditating on Brahman as Self, incineration of Sañcita and Āgāmī karma" },
      { padaNumber: 2, name: "Utkrānti-Pāda", focus: "Dissolution of prāṇas at bodily death; non-departure for the Jñānī vs solar departure for the yogi" },
      { padaNumber: 3, name: "Gati-Pāda", focus: "The luminous celestial path of the Gods (Devayāna) guided by the amānava person" },
      { padaNumber: 4, name: "Mukti-Pāda", focus: "Manifestation in one's native luminous state, undivided non-dual union, and the ultimate assurance: Anāvṛttiḥ" },
    ],
  },
];

// Helper to assemble the cross-references and adhikaraṇa metadata for a Brahmasūtra verse
function buildNyayaSutraEntry(
  verse: GranthaVerse,
  adhyayaIndex: 1 | 2 | 3 | 4,
  adhyayaTitle: string,
  adhyayaTitleSanskrit: string,
  padaNumber: 1 | 2 | 3 | 4,
  padaName: string,
  adhikarana: NyayaAdhikaranaInfo,
  crossReferences: NyayaCrossReference[],
  philosophicalThemes: string[]
): NyayaSutraEntry {
  const numMatch = verse.number.match(/(\d+\.\d+\.\d+)/);
  const sutraNumber = numMatch ? numMatch[1] : verse.number;

  return {
    id: verse.id,
    sutraNumber,
    adhyayaIndex,
    adhyayaTitle,
    adhyayaTitleSanskrit,
    padaNumber,
    padaName,
    sutraTitle: verse.title,
    mulaSanskrit: verse.mulaSanskrit,
    mulaIast: verse.mulaIast,
    padaccheda: verse.padaccheda,
    anvaya: verse.anvaya,
    bhashyaExtract: verse.bhashyaExtract,
    englishTranslation: verse.englishTranslation,
    commentaryNotes: verse.commentaryNotes,
    adhikarana,
    crossReferences,
    philosophicalThemes,
  };
}

// Complete classical cross-reference mapping database for the Nyāyaprasthāna
const NYAYA_SUTRAS_REGISTRY: Record<string, { adhikarana: NyayaAdhikaranaInfo; crossReferences: NyayaCrossReference[]; themes: string[]; pada: 1 | 2 | 3 | 4; padaName: string }> = {
  "bs-1-1-1": {
    pada: 1,
    padaName: "Spasṭa-Brahma-Liṅga",
    themes: ["Inquiry into Brahman", "Sādhana-Catuṣṭaya", "Transcendence of Ritual Action", "Mumukṣutva"],
    adhikarana: {
      name: "Jijñāsādhikaraṇa",
      sanskritName: "जिज्ञासाधिकरणम्",
      visayaVakya: "Muṇḍaka Upaniṣad 1.2.12 ('Parīkṣya lokān karmacitān brāhmaṇo nirvedam āyān nāsty akṛtaḥ kṛtena') & Bṛhadāraṇyaka 4.4.23 ('Śānto dānta uparatas titikṣuḥ samāhito bhūtvātmany evātmānaṁ paśyati').",
      samsaya: "Should the inquiry into Brahman be preceded by the performance and study of Vedic ritual action (Karma-Mīmāṁsā), or is it an independent inquiry requiring only ethical and metaphysical qualification?",
      purvapaksa: "The Mīmāṁsaka contends that 'Atha' (now) means after learning the ritual injunctions of the Vedas, since all Vedic revelation exists solely to enjoin action.",
      siddhanta: "Ādi Śaṅkara proves that 'Atha' signifies immediate succession upon acquiring the Sādhana-Catuṣṭaya (Viveka, Vairāgya, Śamadamādi, Mumukṣutva). Ritual work yields finite, impermanent fruit, whereas Knowledge of Brahman independently confers eternal liberation.",
      sangati: "Introduces the sovereign raison d'être of the entire Vedānta-darśana as a self-sufficient inquiry into the Infinite.",
    },
    crossReferences: [
      {
        id: "ref-1-1-1-mundaka",
        type: "sruti",
        targetPrasthana: "Śruti-Prasthāna (Muṇḍaka Upaniṣad)",
        sourceRef: "Muṇḍaka Upaniṣad 1.2.12",
        sanskritQuote: "परीक्ष्य लोकान् कर्मचितान् ब्राह्मणो निर्वेदमायान्नास्त्यकृतः कृतेन । तद्विज्ञानार्थं स गुरुमेवाभिगच्छेत्...",
        quoteIast: "parīkṣya lokān karmacitān brāhmaṇo nirvedam āyān nāsty akṛtaḥ kṛtena | tad-vijñānārthaṁ sa gurum evābhigacchet...",
        hermeneuticalRole: "Fundamental Śruti passage commanding absolute dispassion toward ritual worlds and mandating inquiry into the Uncreated Reality.",
        granthaId: "mundakopanisad",
      },
      {
        id: "ref-1-1-1-gita",
        type: "smrti",
        targetPrasthana: "Smṛti-Prasthāna (Bhagavad Gītā)",
        sourceRef: "Bhagavad Gītā 2.45-46 & 13.4",
        sanskritQuote: "त्रैगुण्यविषया वेदा निस्त्रैगुण्यो भवार्जुन । यावानर्थ उदपाने सर्वतः संप्लुतोदके । तावान् सर्वेषु वेदेषु ब्राह्मणस्य विजानतः ॥",
        quoteIast: "traiguṇya-viṣayā vedā nistraiguṇyo bhavārjuna | yāvān artha udapāne sarvataḥ saṁplutodake | tāvān sarveṣu vedeṣu brāhmaṇasya vijānataḥ ||",
        hermeneuticalRole: "Smṛti verification that ritual Vedic acts belong to the realm of the three Guṇas, which the seeker of Brahman must transcend.",
        granthaId: "bhagavadgita",
      },
      {
        id: "ref-1-1-1-sampradaya",
        type: "sampradaya",
        targetPrasthana: "Sampradāya Comparative Hermeneutics",
        sourceRef: "Śaṅkara-Bhāṣya vs. Śrī-Bhāṣya vs. Madhva-Bhāṣya",
        sanskritQuote: "अथातःशब्दाभ्यां साधनचतुष्टयसम्पत्तिरानन्तर्यार्था हेतुमत्त्वं चोच्यते (शङ्करः) / पूर्वावगतकर्मणः अनित्यफलत्वज्ञानादनन्तरं (रामानुजः)",
        quoteIast: "athātaḥ-śabdābhyāṁ sādhana-catuṣṭaya-sampattir ānantaryārthā (Śaṅkara) / pūrvāvagata-karmaṇaḥ anitya-phalatva-jñānād anantaraṁ (Rāmānuja)",
        hermeneuticalRole: "Advaita sees Brahma-jijñāsā as wholly independent of karma; Viśiṣṭādvaita views Pūrva-Mīmāṁsā and Uttara-Mīmāṁsā as one continuous single body of scripture (Eka-Śāstravāda).",
        traditionSchool: "Advaita vs. Viśiṣṭādvaita",
      },
      {
        id: "ref-1-1-1-saktabhashya",
        type: "sampradaya",
        targetPrasthana: "Śākta-Vedānta Svarūpādvaita (Bhatpara Prasthāna)",
        sourceRef: "Brahmasūtra-Śāktabhāṣyam 1.1.1 (MM Pañcānana Tarkaratna)",
        sanskritQuote: "अथशब्द आनन्तर्यार्थः साधनचतुष्टयसम्पत्त्यनन्तरम् । अतःशब्दो हेत्वर्थः... ब्रह्म च सच्चिदानन्दमयी परा शक्तिरेव । यदुक्तं शक्तिरहस्ये—यथा वह्नेः स्थितिर्नैव वह्नित्वेन विना क्वचित् । तथा ब्रह्मणो नैवास्ति शक्तिहीनस्य संस्थितिः ॥ अत एव शक्तिशक्तिमदभेदात् परब्रह्मभूताया भगवत्या जगन्मातुश्चिन्मय्या जिज्ञासा अत्र प्रतिज्ञायते ।",
        quoteIast: "atha-śabda ānantaryārthaḥ sādhana-catuṣṭaya-sampatty-anantaram... brahma ca saccidānandamayī parā śaktir eva | yathā vahneḥ sthitir naiva vahnittvena vinā kvacit, tathā brahmaṇo naivāsti śaktihīnasya saṁsthitiḥ || ata eva śakti-śaktimad-abhedāt parabrahma-bhūtāyā bhagavatyā jagan-mātuś cinmayyā jijñāsā atra pratijñāyate |",
        hermeneuticalRole: "Śāktabhāṣyam establishes that Brahma-jijñāsā is fundamentally the inquiry into the unconditioned Conscious Supreme Power (Cinmayī Parā-Śakti). Brahman without Śakti is a metaphysical impossibility (Śakti-Śaktimator-abhedaḥ).",
        granthaId: "brahmasutra-saktabhasya",
        traditionSchool: "Śākta-Vedānta (Svarūpādvaita)",
      },
    ],
  },
  "bs-1-1-2": {
    pada: 1,
    padaName: "Spasṭa-Brahma-Liṅga",
    themes: ["Taṭastha-Lakṣaṇa", "Cosmic Causality", "Omniscience", "Refutation of Materialism", "Cit-Pariṇāma"],
    adhikarana: {
      name: "Janmādyadhikaraṇa",
      sanskritName: "जन्माद्यधिकरणम्",
      visayaVakya: "Taittirīya Upaniṣad 3.1.1 ('Yato vā imāni bhūtāni jāyante, yena jātāni jīvanti, yat prayanty abhisaṁviśanti, tad vijijñāsasva, tad brahmeti').",
      samsaya: "Is the origin, sustenance, and dissolution of this complex universe caused by inert nature (Pradhāna), accidental atoms (Paramāṇu), or the Omniscient Brahman?",
      purvapaksa: "Materialist and dualist thinkers argue that insentient matter or unconscious mechanical causes can produce physical effects through natural laws without an intelligent spiritual cause.",
      siddhanta: "An intricate, mathematically ordered cosmos characterized by differentiated names, forms, agents, and fruit of actions could never arise from blind insentient matter, but only from the Omniscient, Omnipotent Supreme Being.",
      sangati: "Following the inception of inquiry in Sūtra 1, Sūtra 2 defines the essential ontological nature and indicative characteristics of the object of inquiry.",
    },
    crossReferences: [
      {
        id: "ref-1-1-2-taittiriya",
        type: "sruti",
        targetPrasthana: "Śruti-Prasthāna (Taittirīya Upaniṣad)",
        sourceRef: "Taittirīya Upaniṣad 3.1.1 (Bhṛgu-Vallī)",
        sanskritQuote: "यतो वा इमानि भूतानि जायन्ते । येन जातानि जीवन्ति । यत्प्रयन्त्यभिसंविशन्ति । तद्विजिज्ञासस्व । तद्ब्रह्मेति ॥",
        quoteIast: "yato vā imāni bhūtāni jāyante | yena jātāni jīvanti | yat prayanty abhisaṁviśanti | tad vijijñāsasva | tad brahmeti ||",
        hermeneuticalRole: "Direct textual source from which Bādarāyaṇa derived the aphorism 'Janmādyasya yataḥ'.",
        granthaId: "taittiriyopanisad",
      },
      {
        id: "ref-1-1-2-gita",
        type: "smrti",
        targetPrasthana: "Smṛti-Prasthāna (Bhagavad Gītā)",
        sourceRef: "Bhagavad Gītā 7.6 & 10.8",
        sanskritQuote: "अहं कृत्स्नस्य जगतः प्रभवः प्रलयस्तथा । अहं सर्वस्य प्रभवो मत्तः सर्वं प्रवर्तते ॥",
        quoteIast: "ahaṁ kṛtsnasya jagataḥ prabhavaḥ pralayas tathā | ahaṁ sarvasya prabhavo mattaḥ sarvaṁ pravartate ||",
        hermeneuticalRole: "Smṛti assertion echoing Brahman as the sole cosmic generator, sustainer, and dissolver.",
        granthaId: "bhagavadgita",
      },
      {
        id: "ref-1-1-2-saktabhashya",
        type: "sampradaya",
        targetPrasthana: "Śākta-Vedānta Svarūpādvaita (Bhatpara Prasthāna)",
        sourceRef: "Brahmasūtra-Śāktabhāṣyam 1.1.2 (MM Pañcānana Tarkaratna)",
        sanskritQuote: "सच्चिदानन्दमयी परा शक्तिरेव जगत्सृष्टिस्थितिलयकारणं, न तु जडं प्रधानं नापि मिथ्याभूता माया । चिच्छक्तेः परिणामेनैव जगद्रूपेण प्रकाशः ॥",
        quoteIast: "saccidānandamayī parā śaktir eva jagat-sṛṣṭi-sthiti-laya-kāraṇaṁ, na tu jaḍaṁ pradhānaṁ nāpi mithyā-bhūtā māyā | cic-chakteḥ pariṇāmenaiva jagad-rūpeṇa prakāśaḥ ||",
        hermeneuticalRole: "Establishes Parā-Śakti as both the material and efficient cause (Abhinna-Nimittopādāna-Kāraṇa) through authentic conscious self-unfolding (Cit-Pariṇāmavāda).",
        granthaId: "brahmasutra-saktabhasya",
        traditionSchool: "Śākta-Vedānta (Svarūpādvaita)",
      },
    ],
  },
  "bs-1-1-3": {
    pada: 1,
    padaName: "Spasṭa-Brahma-Liṅga",
    themes: ["Epistemology of Śabda", "Brahman beyond Inference", "Revelation as Breath of Reality"],
    adhikarana: {
      name: "Śāstrayonitvādhikaraṇa",
      sanskritName: "शास्त्रयोनित्वाधिकरणम्",
      visayaVakya: "Bṛhadāraṇyaka Upaniṣad 2.4.10 ('Asya mahato bhūtasya niḥśvasitam etad yad ṛgvedo yajurvedaḥ...') & 3.9.26 ('Taṁ tv aupaniṣadaṁ puruṣaṁ pṛcchāmi').",
      samsaya: "Can Brahman be established through independent logical inference (Anumāna) like an architect of a house, or is Brahman knowable solely through scriptural revelation (Śabda-Pramāṇa)?",
      purvapaksa: "Naiyāyika logicians argue that the creator of the world can be proven through syllogistic inference based on the world being an effect.",
      siddhanta: "Brahman is supersensory and formless; therefore, pure logical inference cannot establish Its unconditional nature without contradictions. Scripture is the sole valid means of knowledge (Aupaniṣadaḥ Puruṣaḥ), and Brahman is also the omniscient Source from which scripture issued like effortless breath.",
      sangati: "After defining Brahman through cosmic causality in Sūtra 2, Sūtra 3 validates the epistemological instrument through which alone this Cause is apprehended.",
    },
    crossReferences: [
      {
        id: "ref-1-1-3-brhadaranyaka",
        type: "sruti",
        targetPrasthana: "Śruti-Prasthāna (Bṛhadāraṇyaka Upaniṣad)",
        sourceRef: "Bṛhadāraṇyaka Upaniṣad 2.4.10 & 3.9.26",
        sanskritQuote: "अस्य महतो भूतस्य निःश्वसितमेतद्यदृग्वेदो यजुर्वेदः सामवेदोऽथर्वाङ्गिरसः... तं त्वौपनिषदं पुरुषं पृच्छामि ।",
        quoteIast: "asya mahato bhūtasya niḥśvasitam etad yad ṛgvedo yajurvedaḥ... taṁ tv aupaniṣadaṁ puruṣaṁ pṛcchāmi |",
        hermeneuticalRole: "Proves that Brahman is both the author of the Vedas and knowable exclusively through the Upaniṣadic corpus.",
        granthaId: "brhadaranyakopanisad",
      },
      {
        id: "ref-1-1-3-katha",
        type: "sruti",
        targetPrasthana: "Śruti-Prasthāna (Kaṭha Upaniṣad)",
        sourceRef: "Kaṭha Upaniṣad 1.2.9",
        sanskritQuote: "नैषा तर्केण मतिरापनेया प्रोक्तान्येनैव सुज्ञानाय प्रेष्ठ ।",
        quoteIast: "naiṣā tarkeṇa matir āpanīyā proktānyenaiva sujñānāya preṣṭha |",
        hermeneuticalRole: "Decisively negates dry speculative reason as the independent instrument for Self-realization.",
        granthaId: "kathopanisad",
      },
    ],
  },
  "bs-1-1-4": {
    pada: 1,
    padaName: "Spasṭa-Brahma-Liṅga",
    themes: ["Samanvaya", "Non-duality", "Mahāvākya Synthesis", "Siddha-Vastu vs. Kriyā"],
    adhikarana: {
      name: "Samanvayādhikaraṇa",
      sanskritName: "समन्वयाधिकरणम्",
      visayaVakya: "Chāndogya 6.2.1 ('Sad eva somyedam agra āsīd ekam evādvitīyam'), 6.8.7 ('Tat tvam asi'), and Bṛhadāraṇyaka 1.4.10 ('Ahaṁ brahmāsmi').",
      samsaya: "Do the Upaniṣads primarily teach the unconditioned, ever-existent Reality (Siddha-Vastu), or do they only serve as subordinate eulogies for injunctions of meditation and ritual works (Kārya-paravāda)?",
      purvapaksa: "The Prābhākara Mīmāṁsakas assert that language conveys meaning only when prompting an action (Niyoga/Vidhi); therefore, statements about an eternally existing Brahman are invalid unless subordinated to action.",
      siddhanta: "All Vedāntic declarations converge harmoniously (Samanvaya) upon the non-dual Brahman as an already-accomplished, eternal Truth. Knowledge is determined by the object (Vastu-tantra), not human volition (Puruṣa-tantra). Liberation is not an effect produced by activity, but the immediate removal of ignorance.",
      sangati: "Culmination of the celebrated Catussūtrī; seals the hermeneutic foundation of non-dual Advaita Vedānta.",
    },
    crossReferences: [
      {
        id: "ref-1-1-4-chandogya",
        type: "sruti",
        targetPrasthana: "Śruti-Prasthāna (Chāndogya Upaniṣad)",
        sourceRef: "Chāndogya Upaniṣad 6.2.1 & 6.8.7",
        sanskritQuote: "सदेव सोम्येदमग्र आसीदेकमेवाद्वितीयम् । तत्सत्यं स आत्मा तत्त्वमसि श्वेतकेतो ॥",
        quoteIast: "sad eva somyedam agra āsīd ekam evādvitīyam | tat satyaṁ sa ātmā tat tvam asi śvetaketo ||",
        hermeneuticalRole: "The foundational Mahāvākya revealing Brahman as the uncaused Ground and non-different from the inner Self.",
        granthaId: "chandogyopanisad",
      },
      {
        id: "ref-1-1-4-gita",
        type: "smrti",
        targetPrasthana: "Smṛti-Prasthāna (Bhagavad Gītā)",
        sourceRef: "Bhagavad Gītā 18.55",
        sanskritQuote: "भक्त्या मामभिजानाति यावान्यश्चास्मि तत्त्वतः । ततो मां तत्त्वतो ज्ञात्वा विशते तदनन्तरम् ॥",
        quoteIast: "bhaktyā mām abhijānāti yāvān yaś cāsmi tattvataḥ | tato māṁ tattvato jñātvā viśate tad-anantaram ||",
        hermeneuticalRole: "Affirms that direct essential knowledge (Tattvataḥ) brings undivided immersion in the Absolute.",
        granthaId: "bhagavadgita",
      },
    ],
  },
  "bs-1-1-5": {
    pada: 1,
    padaName: "Spasṭa-Brahma-Liṅga",
    themes: ["Īkṣaṇa", "Refutation of Sāṅkhya Pradhāna", "Conscious Cause"],
    adhikarana: {
      name: "Īkṣatyadhikaraṇa",
      sanskritName: "ईक्षत्यधिकरणम्",
      visayaVakya: "Chāndogya Upaniṣad 6.2.3 ('Tad aikṣata bahu syāṁ prajāyeyeti tat tejo'sṛjata').",
      samsaya: "Does the word 'Sat' (Being) in Chāndogya refer to the insentient Pradhāna of Sāṅkhya philosophy or to the conscious Supreme Brahman?",
      purvapaksa: "Sāṅkhya claims Pradhāna is the cause, and 'seeing' (Īkṣaṇa) is used metaphorically just as we say 'the light sees' or 'the river flows'.",
      siddhanta: "The text states 'It willed/saw' (Aikṣata); conscious ideation cannot be attributed to insentient Pradhāna. Furthermore, the seeker of liberation is instructed to merge into that Sat with 'Tat Tvam Asi'. One could never be taught identity with blind inert matter for liberation.",
      sangati: "Beginning the systematic refutation of rival non-Vedic interpretations of the source of the universe.",
    },
    crossReferences: [
      {
        id: "ref-1-1-5-chandogya",
        type: "sruti",
        targetPrasthana: "Śruti-Prasthāna (Chāndogya Upaniṣad)",
        sourceRef: "Chāndogya Upaniṣad 6.2.3",
        sanskritQuote: "तदैक्षत बहु स्यां प्रजायेयेति तत्तेजोऽसृजत ।",
        quoteIast: "tad aikṣata bahu syāṁ prajāyeyeti tat tejo'sṛjata |",
        hermeneuticalRole: "Proves that conscious intention (Īkṣati) precedes all cosmic manifestation.",
        granthaId: "chandogyopanisad",
      },
    ],
  },
  "bs-2-1-14": {
    pada: 1,
    padaName: "Smṛti-Pāda",
    themes: ["Vivartavāda", "Vācārambhaṇa", "Ananyatva", "Apparent Modification"],
    adhikarana: {
      name: "Ārambhaṇādhikaraṇa",
      sanskritName: "आरम्भणाधिकरणम्",
      visayaVakya: "Chāndogya Upaniṣad 6.1.4 ('Vācārambhaṇaṁ vikāro nāmadheyaṁ mṛttikety eva satyam').",
      samsaya: "Is the created world an entirely new entity generated from Brahman (Asatkāryavāda), a real transformation of Brahman (Pariṇāmavāda), or an apparent modification (Vivartavāda)?",
      purvapaksa: "Dualists claim the world has real independent existence separate from its cause, just as a cloth is distinct from threads.",
      siddhanta: "The effect is non-different (Ananya) from its material cause. Just as a clay pot is nothing other than clay under a name and form (Nāma-Rūpa), the universe has no independent ontological existence apart from Pure Being (Brahman).",
      sangati: "Establishes the supreme metaphysical cornerstone of Advaita: the world is an apparent appearance upon Brahman.",
    },
    crossReferences: [
      {
        id: "ref-2-1-14-chandogya",
        type: "sruti",
        targetPrasthana: "Śruti-Prasthāna (Chāndogya Upaniṣad)",
        sourceRef: "Chāndogya Upaniṣad 6.1.4",
        sanskritQuote: "यथा सोम्यैकेन मृत्पिण्डेन सर्वं मृन्मयं विज्ञातं स्याद्वाचारम्भणं विकारो नामधेयं मृत्तिकेत्येव सत्यम् ॥",
        quoteIast: "yathā somyaikena mṛt-piṇḍena sarvaṁ mṛn-mayaṁ vijñātaṁ syād vācārambhaṇaṁ vikāro nāmadheyaṁ mṛttikety eva satyam ||",
        hermeneuticalRole: "Direct scriptural foundation of Vivartavāda and causal non-difference.",
        granthaId: "chandogyopanisad",
      },
      {
        id: "ref-2-1-14-gita",
        type: "smrti",
        targetPrasthana: "Smṛti-Prasthāna (Bhagavad Gītā)",
        sourceRef: "Bhagavad Gītā 9.4",
        sanskritQuote: "मया ततमिदं सर्वं जगदव्यक्तमूर्तिना । मत्स्थानि सर्वभूतानि न चाहं तेष्ववस्थितः ॥",
        quoteIast: "mayā tatam idaṁ sarvaṁ jagad avyakta-mūrtinā | mat-sthāni sarva-bhūtāni na cāhaṁ teṣv avasthitaḥ ||",
        hermeneuticalRole: "Smṛti declaration of all beings residing in Brahman while Brahman remains untainted and transcendent.",
        granthaId: "bhagavadgita",
      },
    ],
  },
  "bs-2-1-33": {
    pada: 1,
    padaName: "Smṛti-Pāda",
    themes: ["Līlākaivalya", "Cosmic Play", "Unmotivated Creation", "Divine Fullness"],
    adhikarana: {
      name: "Līlādhikaraṇa",
      sanskritName: "लीलाधिकरणम्",
      visayaVakya: "Bṛhadāraṇyaka 1.4.1 & Śvetāśvatara 6.11.",
      samsaya: "Why does the completely fulfilled, desireless Supreme Lord engage in the exertion of cosmic creation?",
      purvapaksa: "If God creates for selfish gain, He is unfulfilled; if He creates for others, He is cruel, having made a world full of misery.",
      siddhanta: "Creation is not prompted by need or desire, but overflows spontaneously as divine sport (Līlā), just as an emperor engages in effortless games or a healthy person breathes out naturally.",
      sangati: "Resolves the profound theological problem of the teleological motive of creation.",
    },
    crossReferences: [
      {
        id: "ref-2-1-33-gita",
        type: "smrti",
        targetPrasthana: "Smṛti-Prasthāna (Bhagavad Gītā)",
        sourceRef: "Bhagavad Gītā 3.22",
        sanskritQuote: "न मे पार्थास्ति कर्तव्यं त्रिषु लोकेषु किञ्चन । नानवाप्तमवाप्तव्यं वर्त एव च कर्मणि ॥",
        quoteIast: "na me pārthāsti kartavyaṁ triṣu lokeṣu kiñcana | nānavāptam avāptavyaṁ varta eva ca karmaṇi ||",
        hermeneuticalRole: "Kṛṣṇa declares that although having nothing unobtained to gain, He acts spontaneously for cosmic harmony.",
        granthaId: "bhagavadgita",
      },
    ],
  },
  "bs-2-2-28": {
    pada: 2,
    padaName: "Tarka-Pāda",
    themes: ["Refutation of Buddhist Idealism", "Objective World Reality", "Nābhāva Upalabdheḥ"],
    adhikarana: {
      name: "Abhāvādhikaraṇa (Vijñānavāda-Nirākaraṇa)",
      sanskritName: "अभावाधिकरणम् (विज्ञानवादनिराकरणम्)",
      visayaVakya: "Bṛhadāraṇyaka Upaniṣad 4.3.7-14 and Buddhist Yogācāra Vijñaptimātratā treatises.",
      samsaya: "Do external objects exist independently of subjective cognitions, or are they mere internal ideas mistaken for external realities as Buddhist Vijñānavādins claim?",
      purvapaksa: "The Yogācāra Buddhist argues that because cognitions and objects are always apprehended together (Sahopalambha-Niyama), no external object exists beyond pure momentary consciousness.",
      siddhanta: "External objects cannot be denied, because they are directly experienced by every conscious being ('Upalabdheḥ'). In every perception, one experiences an external pillar or pot, not mere subjective consciousness of one's own awareness.",
      sangati: "Core pillar of Tarka-Pāda defending external realism on the empirical level (Vyāvahārika Satya) against Buddhist subjective reductionism.",
    },
    crossReferences: [
      {
        id: "ref-2-2-28-katha",
        type: "sruti",
        targetPrasthana: "Śruti-Prasthāna (Kaṭha Upaniṣad)",
        sourceRef: "Kaṭha Upaniṣad 2.1.1",
        sanskritQuote: "पराञ्चि खानि व्यतृणत् स्वयम्भूस्तस्मात् पराङ् पश्यति नान्तरात्मन् ।",
        quoteIast: "parāñci khāni vyatṛṇat svayambhūs tasmāt parāṅ paśyati nāntarātman |",
        hermeneuticalRole: "Explains why the creator fashioned sense organs turned outwards to apprehend external objects.",
        granthaId: "kathopanisad",
      },
    ],
  },
  "bs-3-2-3": {
    pada: 2,
    padaName: "Ubhayaliṅga-Pāda",
    themes: ["Dream Analysis", "Māyāmātra", "Three States of Consciousness", "Prātibhāsika"],
    adhikarana: {
      name: "Sandhyādhikaraṇa",
      sanskritName: "सन्ध्याधिकरणम्",
      visayaVakya: "Bṛhadāraṇyaka Upaniṣad 4.3.9-10 ('Na tatra rathā na rathayogā na panthāno bhavanti... atha rathān rathayogān pathaḥ sṛjate sa hi kartā').",
      samsaya: "Is the dream creation real and physical, or is it merely illusory mental projection (Māyā)?",
      purvapaksa: "Certain passages suggest the dreaming soul is an independent creator who actually manifests physical chariots and paths.",
      siddhanta: "Dream creation is mere illusion (Māyāmātra), lacking spatial extent, temporal consistency, and causal non-contradiction. It is sublated instantly upon awakening.",
      sangati: "Epistemological exploration of consciousness across waking, dreaming, and deep sleep.",
    },
    crossReferences: [
      {
        id: "ref-3-2-3-mandukya",
        type: "sruti",
        targetPrasthana: "Śruti-Prasthāna (Māṇḍūkya Upaniṣad & Kārikā)",
        sourceRef: "Māṇḍūkya Upaniṣad 4 & Gauḍapāda Kārikā 2.1-4",
        sanskritQuote: "स्वप्नवृत्तौ तु मिथ्यात्वमन्तःस्थानात्तु देहिनः । संवृतत्वेन गर्भाणां स्थानं तस्मात्तु दृश्यते ॥",
        quoteIast: "svapna-vṛttau tu mithyātvam antaḥsthānāt tu dehinaḥ | saṁvṛtatvena garbhāṇāṁ sthānaṁ tasmāt tu dṛśyate ||",
        hermeneuticalRole: "Direct corroboration that dream phenomena are illusory due to the confinement inside the physical frame.",
        granthaId: "mandukyopanisad",
      },
    ],
  },
  "bs-3-2-22": {
    pada: 2,
    padaName: "Ubhayaliṅga-Pāda",
    themes: ["Neti Neti", "Negation of Limits", "Pure Substrate", "Via Negativa"],
    adhikarana: {
      name: "Prakṛtaitāvattvādhikaraṇa",
      sanskritName: "प्रकृतैतावत्त्वाधिकरणम्",
      visayaVakya: "Bṛhadāraṇyaka Upaniṣad 2.3.6 ('Athāta ādeśo neti neti, na hy etasmād iti nety anyat param asti').",
      samsaya: "Does the famous formula 'Neti, Neti' (Not this, not this) negate everything including Brahman, landing in absolute void (Śūnyatā), or does it negate only empirical names and forms?",
      purvapaksa: "The nihilist asserts that by negating both gross and subtle forms, nothing remains, proving absolute void.",
      siddhanta: "Neti Neti negates the finite limitation (Prakṛtaitāvattva) ascribed to Brahman by limiting adjuncts, and then reveals the inexhaustible Absolute underlying all negations ('Tato bravīti ca bhūyaḥ'). An illusion can only be negated onto a real ground.",
      sangati: "The definitive Vedāntic exegesis of the greatest negative theological formula in world philosophy.",
    },
    crossReferences: [
      {
        id: "ref-3-2-22-brhadaranyaka",
        type: "sruti",
        targetPrasthana: "Śruti-Prasthāna (Bṛhadāraṇyaka Upaniṣad)",
        sourceRef: "Bṛhadāraṇyaka Upaniṣad 2.3.6 & 3.8.8",
        sanskritQuote: "अथात आदेशो नेति नेति न ह्येतस्मादिति नेत्यन्यत्परमस्त्यथ नामधेयं सत्यस्य सत्यमिति ।",
        quoteIast: "athāta ādeśo neti neti na hy etasmād iti nety anyat param asty atha nāmadheyaṁ satyasya satyam iti |",
        hermeneuticalRole: "Textual ground of Neti Neti, identifying Brahman as the 'Truth of Truth' (Satyasya Satyam).",
        granthaId: "brhadaranyakopanisad",
      },
      {
        id: "ref-3-2-22-katha",
        type: "sruti",
        targetPrasthana: "Śruti-Prasthāna (Kaṭha Upaniṣad)",
        sourceRef: "Kaṭha Upaniṣad 1.3.15",
        sanskritQuote: "अशब्दमस्पर्शमरूपमव्ययं तथाऽरसं नित्यमगन्धवच्च यत् ।",
        quoteIast: "aśabdam asparśam arūpam avyayaṁ tathā'rasaṁ nityam agandhavac ca yat |",
        hermeneuticalRole: "Affirms that Brahman has neither sound, touch, form, decay, nor taste, being eternally unconditioned.",
        granthaId: "kathopanisad",
      },
    ],
  },
  "bs-4-1-15": {
    pada: 1,
    padaName: "Āvṛtti-Pāda",
    themes: ["Jīvanmukti", "Prārabdha Karma", "Potter's Wheel Analogy", "Freedom while Living"],
    adhikarana: {
      name: "Itarakṣapaṇādhikaraṇa",
      sanskritName: "इतरक्षपणाधिकरणम्",
      visayaVakya: "Chāndogya Upaniṣad 6.14.2 ('Tasya tāvad eva ciraṁ yāvan na vimokṣye'tha sampatsye').",
      samsaya: "Does the body of the enlightened sage drop away at the instant of realization, or does the physical body continue to live until Prārabdha karma is exhausted?",
      purvapaksa: "If all ignorance and karma are incinerated by knowledge, the body must fall instantly, making Jīvanmukti impossible.",
      siddhanta: "Knowledge destroys only Sañcita (accumulated past) and Āgāmī (future) karmas. Prārabdha karma (the momentum already launched that gave birth to the present physical body) continues until its momentum runs out, just as an arrow already shot from a bow travels to its natural end or a potter's wheel continues rotating from previous momentum.",
      sangati: "Provides scriptural and experiential legitimacy to the sublime state of Jīvanmukti (living liberation).",
    },
    crossReferences: [
      {
        id: "ref-4-1-15-chandogya",
        type: "sruti",
        targetPrasthana: "Śruti-Prasthāna (Chāndogya Upaniṣad)",
        sourceRef: "Chāndogya Upaniṣad 6.14.2",
        sanskritQuote: "तस्य तावदेव चिरं यावन्न विमोक्ष्येऽथ संपत्स्ये ॥",
        quoteIast: "tasya tāvad eva ciraṁ yāvan na vimokṣye'tha saṁpatsye ||",
        hermeneuticalRole: "The primary Śruti proof that the sage waits only until the physical body is released before final immersion.",
        granthaId: "chandogyopanisad",
      },
      {
        id: "ref-4-1-15-gita",
        type: "smrti",
        targetPrasthana: "Smṛti-Prasthāna (Bhagavad Gītā)",
        sourceRef: "Bhagavad Gītā 2.54-72 & 4.37",
        sanskritQuote: "यथैधांसि समिद्धोऽग्निर्भस्मसात्कुरुतेऽर्जुन । ज्ञानाग्निः सर्वकर्माणि भस्मसात्कुरुते तथा ॥",
        quoteIast: "yathaidhāṁsi samiddho'gnir bhasmasāt kurute'rjuna | jñānāgniḥ sarva-karmāṇi bhasmasāt kurute tathā ||",
        hermeneuticalRole: "Describes the Sthitaprajña (sage established in wisdom) and the fire of knowledge incinerating karma.",
        granthaId: "bhagavadgita",
      },
    ],
  },
  "bs-4-4-23": {
    pada: 4,
    padaName: "Mukti-Pāda",
    themes: ["Anāvṛttiḥ", "Final Liberation", "Eternal Assurance", "Crowning Seal of Vedānta"],
    adhikarana: {
      name: "Anāvṛttyadhikaraṇa",
      sanskritName: "अनावृत्त्यधिकरणम्",
      visayaVakya: "Chāndogya Upaniṣad 8.15.1 ('Sa khalv evaṁ vartayan yāvadāyuṣaṁ brahmalokam abhisaṁpadyate na ca punar āvartate na ca punar āvartate').",
      samsaya: "Is there any possibility of the liberated soul ever falling back into the cycle of saṁsāra and transmigratory suffering?",
      purvapaksa: "Because even celestial realms come to an end, the soul might someday return to earthly rebirth.",
      siddhanta: "From the state of supreme liberation in Brahman, there is NO RETURN to transmigratory existence ('Anāvṛttiḥ śabdād anāvṛttiḥ śabdāt')! The repetition of the word in the sūtra marks the triumphant, auspicious completion of the entire Brahma Sūtras.",
      sangati: "The crowning seal of the Nyāyaprasthāna and the Prasthānatrayī, guaranteeing eternal, irreversible liberation.",
    },
    crossReferences: [
      {
        id: "ref-4-4-23-chandogya",
        type: "sruti",
        targetPrasthana: "Śruti-Prasthāna (Chāndogya Upaniṣad)",
        sourceRef: "Chāndogya Upaniṣad 8.15.1",
        sanskritQuote: "स खल्वेवं वर्तयन्यावदायुषं ब्रह्मलोकमभिसंपद्यते न च पुनरावर्तते न च पुनरावर्तते ॥",
        quoteIast: "sa khalv evaṁ vartayan yāvad-āyuṣaṁ brahma-lokam abhisaṁpadyate na ca punar āvartate na ca punar āvartate ||",
        hermeneuticalRole: "The foundational Vedic declaration concluding the Chāndogya with the immortal promise: 'Na ca punar āvartate'.",
        granthaId: "chandogyopanisad",
      },
      {
        id: "ref-4-4-23-gita",
        type: "smrti",
        targetPrasthana: "Smṛti-Prasthāna (Bhagavad Gītā)",
        sourceRef: "Bhagavad Gītā 8.16 & 15.6",
        sanskritQuote: "मामुपेत्य तु कौन्तेय पुनर्जन्म न विद्यते । यद्गत्वा न निवर्तन्ते तद्धाम परमं मम ॥",
        quoteIast: "mām upetya tu kaunteya punar-janma na vidyate | yad gatvā na nivartante tad dhāma paramaṁ mama ||",
        hermeneuticalRole: "Smṛti declaration: Reaching that supreme abode, souls never return again to mortality.",
        granthaId: "bhagavadgita",
      },
    ],
  },
};

// Generic fallback generator for sūtras that don't have customized registry entries yet
function createDefaultSutraMetadata(verse: GranthaVerse, adhyayaNum: 1 | 2 | 3 | 4): { adhikarana: NyayaAdhikaranaInfo; crossReferences: NyayaCrossReference[]; themes: string[]; pada: 1 | 2 | 3 | 4; padaName: string } {
  const parts = verse.number.split(".");
  const padaNum = (parts.length > 1 ? parseInt(parts[1], 10) : 1) as 1 | 2 | 3 | 4;
  const padaSafe: 1 | 2 | 3 | 4 = [1, 2, 3, 4].includes(padaNum) ? padaNum : 1;
  const padaNameMap: Record<number, string> = {
    1: "Pāda 1: Thematic Exegesis",
    2: "Pāda 2: Philosophical Defense",
    3: "Pāda 3: Systematic Exposition",
    4: "Pāda 4: Dialectical Synthesis",
  };

  return {
    pada: padaSafe,
    padaName: padaNameMap[padaSafe],
    themes: ["Nyāya-Prasthāna", "Brahma-Mīmāṁsā", "Vedānta Dialectics", "Sūtra Hermeneutics"],
    adhikarana: {
      name: verse.title.split(":")[0] || "Nyāyādhikaraṇa",
      sanskritName: "न्यायाधिकरणम्",
      visayaVakya: "Upaniṣadic corpus corresponding to this sūtra's dialectical inquiry.",
      samsaya: "Investigation into the primary import of the Vedic aphorism.",
      purvapaksa: "Rival or literalist non-Vedāntic interpretation of the topic.",
      siddhanta: "Established Siddhānta of Bādarāyaṇa harmonizing the Vedic revelation.",
      sangati: "Contributes to the sequential coherence of the Adhyāya.",
    },
    crossReferences: [
      {
        id: `ref-${verse.id}-sruti`,
        type: "sruti",
        targetPrasthana: "Śruti-Prasthāna (Upaniṣads)",
        sourceRef: "Principal Upaniṣad viṣaya-vākya",
        sanskritQuote: "ॐ पूर्णमदः पूर्णमिदं पूर्णात्पूर्णमुदच्यते । पूर्णस्य पूर्णमादाय पूर्णमेवावशिष्यते ॥",
        quoteIast: "oṁ pūrṇam adaḥ pūrṇam idaṁ pūrṇāt pūrṇam udacyate | pūrṇasya pūrṇam ādāya pūrṇam evāvaśiṣyate ||",
        hermeneuticalRole: "Foundational Śruti passage synthesized and upheld by this sūtra.",
        granthaId: "isopanisad",
      },
      {
        id: `ref-${verse.id}-smrti`,
        type: "smrti",
        targetPrasthana: "Smṛti-Prasthāna (Bhagavad Gītā)",
        sourceRef: "Bhagavad Gītā 13.4",
        sanskritQuote: "ऋषिभिर्बहुधा गीतं छन्दोभिर्विविधैः पृथक् । ब्रह्मसूत्रपदैश्चैव हेतुमद्भिर्विनिश्चितैः ॥",
        quoteIast: "ṛṣibhir bahudhā gītaṁ chandobhir vividhaiḥ pṛthak | brahmasūtra-padaiś caiva hetumadbhir viniścitaiḥ ||",
        hermeneuticalRole: "The Gītā's explicit acknowledgment of the Brahma Sūtras as the decisive logical authority.",
        granthaId: "bhagavadgita",
      },
      {
        id: `ref-${verse.id}-saktabhashya`,
        type: "sampradaya",
        targetPrasthana: "Śākta-Vedānta Svarūpādvaita (Bhatpara Prasthāna)",
        sourceRef: "Brahmasūtra-Śāktabhāṣyam by MM Pañcānana Tarkaratna",
        sanskritQuote: "शक्तिशक्तिमदभेदात् परब्रह्मभूताया भगवत्या जगन्मातुश्चिन्मय्या जिज्ञासा अत्र प्रतिज्ञायते । शक्तिरेव ब्रह्म, ब्रह्मैव शक्तिरिति स्वरूपैक्यम् ॥",
        quoteIast: "śakti-śaktimad-abhedāt parabrahma-bhūtāyā bhagavatyā jagan-mātuś cinmayyā jijñāsā atra pratijñāyate | śaktir eva brahma, brahmaiva śaktir iti svarūpaikyam ||",
        hermeneuticalRole: "Śāktabhāṣyam hermeneutic: Establishes that Supreme Brahman is intrinsically non-different from Parā-Śakti; cosmic manifestation is Cit-Pariṇāma-Vilāsa (conscious divine play).",
        granthaId: "brahmasutra-saktabhasya",
        traditionSchool: "Śākta-Vedānta (Svarūpādvaita)",
      },
    ],
  };
}

/**
 * Primary Content Loader: Aggregates, enriches, and structures all Nyāyaprasthāna Sūtras
 * from the 4 Adhyāya data files into unified NyayaSutraEntry structures.
 */
export function loadAllNyayaPrasthanaSutras(): NyayaSutraEntry[] {
  const adhyayas: { data: GranthaChapter; num: 1 | 2 | 3 | 4 }[] = [
    { data: BRAHMASUTRA_ADHYAYA_1, num: 1 },
    { data: BRAHMASUTRA_ADHYAYA_2, num: 2 },
    { data: BRAHMASUTRA_ADHYAYA_3, num: 3 },
    { data: BRAHMASUTRA_ADHYAYA_4, num: 4 },
  ];

  const allEntries: NyayaSutraEntry[] = [];

  for (const item of adhyayas) {
    const summary = NYAYA_ADHYAYA_SUMMARIES.find((s) => s.number === item.num)!;
    for (const verse of item.data.verses) {
      const reg = NYAYA_SUTRAS_REGISTRY[verse.id] || createDefaultSutraMetadata(verse, item.num);
      const entry = buildNyayaSutraEntry(
        verse,
        item.num,
        summary.title,
        summary.titleSanskrit,
        reg.pada,
        reg.padaName,
        reg.adhikarana,
        reg.crossReferences,
        reg.themes
      );
      allEntries.push(entry);
    }
  }

  return allEntries;
}

/**
 * Filter sūtras by Adhyāya index (1, 2, 3, or 4)
 */
export function getNyayaSutrasByAdhyaya(adhyayaNum: 1 | 2 | 3 | 4): NyayaSutraEntry[] {
  return loadAllNyayaPrasthanaSutras().filter((s) => s.adhyayaIndex === adhyayaNum);
}

/**
 * Retrieve a specific sūtra by ID
 */
export function getNyayaSutraById(sutraId: string): NyayaSutraEntry | undefined {
  return loadAllNyayaPrasthanaSutras().find((s) => s.id === sutraId);
}

/**
 * Search sūtras across Sanskrit text, IAST, English translation, themes, or cross-references
 */
export function searchNyayaSutras(query: string): NyayaSutraEntry[] {
  if (!query.trim()) return loadAllNyayaPrasthanaSutras();
  const q = query.toLowerCase();

  return loadAllNyayaPrasthanaSutras().filter((s) => {
    return (
      s.sutraNumber.includes(q) ||
      s.sutraTitle.toLowerCase().includes(q) ||
      s.mulaSanskrit.includes(query) ||
      s.mulaIast.toLowerCase().includes(q) ||
      s.englishTranslation.toLowerCase().includes(q) ||
      s.adhikarana.name.toLowerCase().includes(q) ||
      s.adhikarana.sanskritName.includes(query) ||
      s.adhikarana.visayaVakya.toLowerCase().includes(q) ||
      s.philosophicalThemes.some((t) => t.toLowerCase().includes(q)) ||
      s.crossReferences.some(
        (cr) =>
          cr.sourceRef.toLowerCase().includes(q) ||
          cr.targetPrasthana.toLowerCase().includes(q) ||
          cr.hermeneuticalRole.toLowerCase().includes(q)
      )
    );
  });
}

/**
 * Returns the complete pre-seeded canonical Nyāyaprasthāna (Brahma Sūtras) TextEntry,
 * fully hydrated with all 4 Adhyāyas, 16 Pādas, and 555 Sūtras.
 */
export function getNyayaPrasthanaGrantha(): TextEntry {
  return BRAHMASUTRA_GRANTHA;
}
