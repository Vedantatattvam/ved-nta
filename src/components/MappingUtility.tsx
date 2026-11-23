import { useState, useMemo, useEffect } from "react";
import { PRESEEDED_GRANTHAS } from "../data";
import { PARAMPARA_TRADITIONS } from "../paramparaData";
import { BibliographicQueryState, ParamparaId, TabType, TextEntry } from "../types";
import Loader from "./Loader";
import ReactMarkdown from "react-markdown";
import { 
  BookOpen, 
  Search, 
  Bookmark, 
  ChevronRight, 
  HelpCircle, 
  AlertCircle, 
  Scroll, 
  Sparkles, 
  BookMarked,
  ArrowRight,
  GitFork,
  Filter,
  Sparkle,
  Copy,
  Check,
  Scale,
  Columns,
  Eye,
  Minimize2,
  Compass,
  ChevronLeft,
  EyeOff,
  Layers,
} from "lucide-react";
import { CitationButton } from "./CitationButton";
import { GlossaryHover } from "./GlossaryHover";
import TextReaderView from "./TextReaderView";
import GranthaCompareView from "./GranthaCompareView";
import NyayaPrasthanaNavigator from "./NyayaPrasthanaNavigator";
import { BookmarksDrawer } from "./BookmarksDrawer";
import { getBookmarks, VerseBookmark } from "../utils/bookmarksStorage";
import { useBharatiyaLipi } from "../context/BharatiyaLipiContext";
import BhashyaTikaSelector from "./BhashyaTikaSelector";
import VedicChantButton from "./VedicChantButton";
import { BRAHMASUTRA_GRANTHA } from "../brahmasutraniData";
import { SHAKTI_BHASHYA_GRANTHA } from "../shaktibhashyaData";
import {
  loadNyayaPrasthanaMappingData,
  ParsedNyayaSutra,
  NyayaMappingCrossReference,
  parseRawNyayaText,
  NyayaMappingBundle,
} from "../utils/nyayaMappingDataLoader";

export interface AvailableCommentaryOption {
  id: string;
  name: string;
  devanagariName: string;
  author: string;
  authorDevanagari: string;
  tradition: string;
  school: string;
  paramparaId: ParamparaId;
  century: string;
  color: string;
  badge: string;
  description: string;
  coreDoctrine: string;
  granthaId?: string;
  keyDoctrines: string[];
  sampleSutras: {
    number: string;
    title: string;
    mulaSanskrit: string;
    padaccheda: string;
    anvaya: string;
    bhashyaText: string;
    tikaText?: string;
    englishExplanation: string;
  }[];
  tikas: {
    name: string;
    author: string;
    century: string;
    tradition: string;
    description: string;
  }[];
}

export const MAPPING_AVAILABLE_COMMENTARIES: AvailableCommentaryOption[] = [
  {
    id: "shaktibhashya",
    name: "Śāktabhāṣyam (शाक्तभाष्यम्)",
    devanagariName: "शाक्तभाष्यम्",
    author: "Mahāmahopādhyāya Pañcānana Bhaṭṭācārya Tarkaratna",
    authorDevanagari: "महामहोपाध्याय पञ्चानन तर्करत्नः",
    tradition: "Bhatpara Scholastic Lineage (भाटपाड़ा सम्प्रदायः)",
    school: "Śākta-Vedānta Svarūpādvaita (स्वरूपाद्वैतवादः)",
    paramparaId: "saktavisistadvaita",
    century: "20th Century CE (1938 CE / 1344 B.S.)",
    color: "#e11d48",
    badge: "★ Śāktabhāṣya (Bhatpara Tradition)",
    description:
      "The definitive monumental commentary on the Brahma Sūtras expounding Svarūpādvaita (स्वरूपाद्वैतवादः) from the Bhatpara lineage of Bengal. Proves that Parā-Śakti is the intrinsic conscious self-nature (Svarūpa) of Supreme Brahman, creation is Her conscious self-unfolding (Cit-Pariṇāma), and harmonizes Vedic Upaniṣads with Śākta Tantras.",
    coreDoctrine: "Śakti-Śaktimad-Abheda (शक्तिशक्तिमदभेदः) & Parāśakti-Cit-Pariṇāmavāda",
    granthaId: "brahmasutra-saktabhasya",
    keyDoctrines: [
      "Śakti-Śaktimad-Abheda: Eternal ontological identity of Divine Power and Possessor of Power",
      "Svarūpādvaita: Brahman is eternally constituted of conscious Cit-Śakti as Her very Svarūpa",
      "Cit-Pariṇāmavāda: Creation is the real blissful self-effulgence (Līlā-Vilāsa) of Parā-Śakti, not illusory Mithyā",
      "Nigama-Āgama Samanvaya: Mutual harmony of Vedic Upaniṣads and Śākta-Śaiva Āgamas",
      "Mokṣa as conscious beatific communion and eternal absorption in the Divine Mother",
    ],
    sampleSutras: [
      {
        number: "1.1.1",
        title: "Athāto Brahmajijñāsā (अथातो ब्रह्मजिज्ञासा)",
        mulaSanskrit: "ॐ अथातो ब्रह्मजिज्ञासा ॐ ॥ १.१.१ ॥",
        padaccheda: "अथ, अतः, ब्रह्मजिज्ञासा",
        anvaya: "अथ (साधनसम्पत्त्यनन्तरम्) अतः (कर्मफलानामनित्यत्वात्) ब्रह्मजिज्ञासा (पराशक्तेर्ज्ञानार्थं विचारः कर्तव्यः) ।",
        bhashyaText:
          "अथशब्द आनन्तर्यार्थः साधनचतुष्टयसम्पत्त्यनन्तरम् । अतःशब्दो हेत्वर्थः, यस्मात्कर्मफलं क्षयिष्णु सातिशयं च, ब्रह्मज्ञानफलं च नित्यं निरतिशयानन्दस्वरूपम् । ब्रह्म च सच्चिदानन्दमयी परा शक्तिरेव । यदुक्तं शक्तिरहस्ये—'यथा वह्नेः स्थितिर्नैव वह्नित्वेन विना क्वचित् । तथा ब्रह्मणो नैवास्ति शक्तिहीनस्य संस्थितिः ॥' अत एव शक्तिशक्तिमदभेदात् परब्रह्मभूताया भगवत्या जगन्मातुश्चिन्मय्या जिज्ञासा अत्र प्रतिज्ञायते ।",
        tikaText:
          "भाष्ये 'शक्तिशक्तिमदभेदात्' इति यदुक्तं तत्तु स्वरूपाद्वैतस्य मूलसूत्रम् । शक्तिरेव ब्रह्म, ब्रह्मैव शक्तिः, द्वैतभानं तु लीलाविलासमात्रम् ।",
        englishExplanation:
          "Mahāmahopādhyāya Pañcānana Tarkaratna establishes that 'Brahman' in the sūtra denotes Supreme Conscious Power (Cinmayī Parā-Śakti). Brahman without Śakti is impossible, like fire devoid of burning power. Inquiry into Brahman is inquiry into the Divine Mother of the cosmos.",
      },
      {
        number: "1.1.2",
        title: "Janmādyasya Yataḥ (जन्माद्यस्य यतः)",
        mulaSanskrit: "ॐ जन्माद्यस्य यतः ॐ ॥ १.१.२ ॥",
        padaccheda: "जन्म-आदि, अस्य, यतः",
        anvaya: "अस्य (जगतः) जन्म-स्थिति-भङ्गं यतः (चिन्मय्याः पराशक्तेर्भवति, तद् ब्रह्म) ।",
        bhashyaText:
          "अस्य विचित्ररचनारूपस्य नामरूपात्मकस्य प्रपञ्चस्य जन्मादि—सृष्टिस्थितिसंहारात्मकं यतः—यस्याश्चिन्मय्याः पराशक्तेः सम्भवति सा पराशक्तिरेव ब्रह्म । न चात्र परिणामित्वे विकारित्वदोषः, क्षीरस्य दधिभावेनेव न जडपरिणामः, अपि तु मणिरश्मिवत् स्वशक्त्या चिद्विलासरूपः परिणामः । अतः सा परा शक्तिरभिन्ननिमित्तोपादानकारणम् ।",
        tikaText:
          "अभिन्ननिमित्तोपादानत्वं शक्तिमतः शक्तेश्च तादात्म्ये सत्येवोपपद्यते । जगन्मिथ्यात्ववादिनां मतापेक्षया अयं परिणामवादः श्रुतिप्रतिपाद्यसत्यत्वरक्षकः ।",
        englishExplanation:
          "Proves that the Divine Mother is both the material and efficient cause (Abhinna-Nimittopādāna-Kāraṇa). Creation is Her conscious self-unfolding (Cit-Pariṇāma) like radiant light streaming from a gem, refuting both illusory Vivartavāda and inanimate Sāṅkhya materialism.",
      },
      {
        number: "1.1.3",
        title: "Śāstrayonitvāt (शास्त्रयोनित्वात्)",
        mulaSanskrit: "ॐ शास्त्रयोनित्वात् ॐ ॥ १.१.३ ॥",
        padaccheda: "शास्त्र-योनित्वात्",
        anvaya: "शास्त्रयोनित्वात् (आगमनिगमैकगम्यत्वात् ब्रह्मणः) ।",
        bhashyaText:
          "शास्त्रं—ऋगादिवेदाः शैवशाक्तागमाश्च योनिरुत्पत्तिस्थानं प्रमाणं वा यस्य तच्छास्त्रयोनि । महतः सर्वविद्यानिलयस्य वेदान्तशास्त्रस्य प्रणेत्री परा शक्तिरेव, तद्बोधकप्रमाणभूता च सैव । न हि शुष्कतर्केण परब्रह्मस्वरूपा शक्तिर्निर्णोतुं शक्यते ।",
        tikaText:
          "निगमागमानामैक्यम् अत्र प्रतिपादितम् । उभयोरेव परब्रह्मप्रकाशकत्वेन प्रामाण्यं सिद्धम् ।",
        englishExplanation:
          "Demonstrates that the Vedas and Tantra-Āgamas find mutual concord in revealing Parā-Śakti. The transcendent Mother cannot be grasped by speculative ratiocination alone.",
      },
      {
        number: "1.1.4",
        title: "Tat Tu Samanvayāt (तत्तु समन्वयात्)",
        mulaSanskrit: "ॐ तत्तु समन्वयात् ॐ ॥ १.१.४ ॥",
        padaccheda: "तत्, तु, समन्वयात्",
        anvaya: "तत् तु (सर्ववेदान्तानां समन्वयः) सच्चिदानन्दमय्यां पराशक्तावेव सिद्धः ।",
        bhashyaText:
          "तुशब्देन पूर्वपक्षनिरासः । सर्वेषु वेदान्तेषु वाक्यानां तात्पर्यं सच्चिदानन्दमय्यां पराशक्तावेव पर्यवस्यति । 'सर्वं खल्विदं ब्रह्म', 'एकमेवाद्वितीयम्' इत्यादिश्रुतिवाक्यानां समन्वयः साक्षात् परब्रह्मभूतायां जगद्धात्र्यामेव सङ्गच्छते । शक्तिमान् शिवः, शक्तिश्च काली-तारा-महात्रिपुरसुन्दरीति न भेदगन्धोऽपि ।",
        tikaText:
          "सविशेषनिर्विशेषयोरैक्यमेव वेदान्तस्य चरमं रहस्यम् ।",
        englishExplanation:
          "Reconciles the Nirviśeṣa (transcendent) and Saviśeṣa (dynamic immanent) aspects of reality into the integral non-duality of Śiva and Śakti.",
      },
      {
        number: "1.1.5",
        title: "Īkṣater Nāśabdam (ईक्षतेर्नाशब्दम्)",
        mulaSanskrit: "ॐ ईक्षतेर्नाशब्दम् ॐ ॥ १.१.५ ॥",
        padaccheda: "ईक्षतेः, न, अशब्दम्",
        anvaya: "ईक्षतेः (चिद्विक्षणात्) अशब्दं (प्रधानं) जगत्कारणं न ।",
        bhashyaText:
          "साङ्ख्योक्तं त्रिगुणात्मकं जडं प्रधानं जगत्कारणं न भवति । कुतः ? 'ईक्षतेः'—'तदैक्षत बहु स्यां प्रजायेयेति' श्रुतौ ईक्षणस्य—सङ्कल्पपूर्वकज्ञानस्य श्रवणात् । ईक्षणं च चेतनधर्मः, स च चिन्मय्याः पराशक्तेरेव मुख्यतया सम्भवति ।",
        tikaText:
          "जडस्य प्रकृतेश्चेतनेक्षणशून्यत्वात् साक्षात् परा शक्तिरेव जगत्कारणमिति सिद्धम् ।",
        englishExplanation:
          "The Vedic declaration of creative volition ('Aikṣata' - It saw/thought) proves that the primal source of the cosmos is the conscious Mother (Cit-Śakti), refuting all mechanistic materialist cosmologies.",
      },
    ],
    tikas: [
      {
        name: "Śāktabhāṣya-Svarūpārtha-Dīpikā (स्वरूपाद्वैत-दीपिका)",
        author: "Bhatpara Scholastic Tradition",
        century: "20th Century CE",
        tradition: "Śākta-Vedānta Vistāra",
        description:
          "Dialectical sub-commentary elucidating the core axioms of Svarūpādvaita and establishing that phenomenal manifestation is the conscious play (Līlā-Vilāsa) of the Supreme Mother.",
      },
      {
        name: "Tattvabodhākhyā-Vivṛtiḥ (तत्त्वबोधाख्या-विवृतिः)",
        author: "Śākta Scholastic Circle",
        century: "20th Century CE",
        tradition: "Śākta Dialectics",
        description:
          "Scholarly gloss substantiating that Cit-Pariṇāmavāda preserves the direct Vedic declarations of divine cosmic reality far better than illusory Vivartavāda.",
      },
    ],
  },
  {
    id: "sankarabhāṣya",
    name: "Śārīraka-Bhāṣya (शारीरकभाष्यम्)",
    devanagariName: "शारीरकभाष्यम्",
    author: "Ādi Śaṅkarācārya",
    authorDevanagari: "आदिशङ्कराचार्यः",
    tradition: "Kevalādvaita Prasthāna (केवल-अद्वैतम्)",
    school: "Advaita Vedānta",
    paramparaId: "advaita",
    century: "8th Century CE",
    color: "#b45309",
    badge: "Śāṅkara (Advaita)",
    description: "The classic foundational non-dual commentary establishing Nirviśeṣa-Brahman, Adhyāsa (superimposition), Vivartavāda, and the illusory nature of phenomenal duality (Māyāvāda).",
    coreDoctrine: "Brahma Satyaṁ Jagan Mithyā Jīvo Brahmaiva Nāparaḥ",
    keyDoctrines: [
      "Adhyāsa-Bhāṣya: Beginningless mutual superimposition of Subject and Object",
      "Nirguṇa-Brahman as the sole transcendental reality",
      "Vivartavāda: Apparent transformation through Anirvacanīya-Māyā",
      "Jñāna alone as the direct proximate means to Mokṣa"
    ],
    sampleSutras: [
      {
        number: "1.1.1",
        title: "Athāto Brahmajijñāsā",
        mulaSanskrit: "ॐ अथातो ब्रह्मजिज्ञासा ॐ ॥ १.१.१ ॥",
        padaccheda: "अथ, अतः, ब्रह्मजिज्ञासा",
        anvaya: "अथ (साधनचतुष्टयसम्पत्त्यनन्तरम्) अतः (कर्मफलानामनित्यत्वात्) ब्रह्मजिज्ञासा ।",
        bhashyaText: "अथातो ब्रह्मजिज्ञासा । तत्र अथेत्ययं शब्द आनन्तर्यार्थः परिगृह्यते, न अधिकारार्थः... नित्यानित्यवस्तुविवेकः, इहामुत्रार्थभोगविरागः, शमदमादिसाधनसम्पत्, मुमुक्षुत्वं च—तेषु हि सत्सु प्रागपि धर्मजिज्ञासाया ऊर्ध्वं च शक्यते ब्रह्म जिज्ञासितुं ज्ञातुं च, न विपर्यये ।",
        tikaText: "भामत्याम्: अविद्योपादानकः प्रपञ्चः, ब्रह्म तु कूटस्थनित्यमिति समन्वयः ।",
        englishExplanation: "Defines the prerequisite fourfold spiritual discipline (Sādhana-Catuṣṭaya) and establishes that inquiry into eternal Brahman is distinct from ritual performance."
      }
    ],
    tikas: [
      {
        name: "Bhāmatī (भामती)",
        author: "Vācaspati Miśra",
        century: "9th-10th Century CE",
        tradition: "Bhāmatī Prasthāna",
        description: "Focuses on Avidyā seated in the Jīva and contemplative reflection."
      },
      {
        name: "Pañcapādikā (पञ्चपादिका)",
        author: "Padmapādācārya",
        century: "8th Century CE",
        tradition: "Vivaraṇa Prasthāna",
        description: "Dialectical exegesis of Adhyāsa and cosmic Mūlāvidyā."
      }
    ]
  },
  {
    id: "sribhasya",
    name: "Śrī-Bhāṣya (श्रीभाष्यम्)",
    devanagariName: "श्रीभाष्यम्",
    author: "Bhagavad Rāmānujācārya",
    authorDevanagari: "भगवद्रामानुजाचार्यः",
    tradition: "Viśiṣṭādvaita Prasthāna (विशिष्ट-अद्वैतम्)",
    school: "Viśiṣṭādvaita Vedānta",
    paramparaId: "visistadvaita",
    century: "11th-12th Century CE",
    color: "#4d7c0f",
    badge: "Śrī-Bhāṣya (Rāmānuja)",
    description: "Monumental qualified non-dualism establishing Brahman as Śrīman-Nārāyaṇa endowed with auspicious qualities, with Cit and Acit forming His eternal body (Śarīra-Śarīrī-Bhāva).",
    coreDoctrine: "Śarīra-Śarīrī-Bhāva & Saviśeṣa-Brahman",
    keyDoctrines: [
      "Brahman is organically embodied by sentient souls and insentient cosmos",
      "Refutation of Nirviśeṣa-Brahman and illusionism (Mahāsiddhānta)",
      "Bhakti and Prapatti (self-surrender) as the supreme pathway to Mokṣa"
    ],
    sampleSutras: [
      {
        number: "1.1.1",
        title: "Athāto Brahmajijñāsā",
        mulaSanskrit: "ॐ अथातो ब्रह्मजिज्ञासा ॐ ॥ १.१.१ ॥",
        padaccheda: "अथ, अतः, ब्रह्मजिज्ञासा",
        anvaya: "अथ (कर्मविचारानन्तरम्) अतः (अल्पस्थिरफलत्वात् कर्मणः) ब्रह्मजिज्ञासा ।",
        bhashyaText: "अथातो ब्रह्मजिज्ञासा । अत्र 'अथ'शब्द आनन्तर्ये । 'अतः'शब्दो हेतौ । वृत्तकर्मज्ञानस्य निदिध्यासितव्यपरब्रह्मस्वरूपज्ञानाय विचार आरम्भणीयः । अखिलहेयप्रत्यनीक-कल्याणैकतानः परब्रह्मभूतः पुरुषोत्तमो नारायणः ।",
        tikaText: "श्रुतप्रकाशिकायाम्: कर्मविचारस्य ब्रह्मविचारस्य चैकशास्त्र्यं समर्थितम् ।",
        englishExplanation: "Establishes that Brahma-Jijñāsā follows directly after the full investigation of ritual action (Karma-Mīmāṁsā), revealing Nārāyaṇa with boundless divine attributes."
      }
    ],
    tikas: [
      {
        name: "Śrutaprakāśikā (श्रुतप्रकाशिका)",
        author: "Sudarśana Sūri",
        century: "13th Century CE",
        tradition: "Śrī-Bhāṣya Master Commentary",
        description: "The definitive exhaustive sub-commentary resolving all rival objections."
      }
    ]
  },
  {
    id: "madhvabhashya",
    name: "Brahmasūtra-Bhāṣya & Aṇuvyākhyāna (अणुव्याख्यानम्)",
    devanagariName: "अणुव्याख्यानम् / सूत्रभाष्यम्",
    author: "Śrī Madhvācārya (Ānandatīrtha)",
    authorDevanagari: "श्रीमध्वानन्दतीर्थः",
    tradition: "Dvaita Prasthāna / Tattvavāda (द्वैतवेदान्तः)",
    school: "Dvaita Vedānta",
    paramparaId: "dvaita",
    century: "13th Century CE",
    color: "#0284c7",
    badge: "Madhva-Bhāṣya (Dvaita)",
    description: "Uncompromising realistic dualism asserting the absolute eternal reality of the cosmos, the fivefold difference (Pañca-Bheda), and the supreme sovereignty (Svatantra) of Lord Viṣṇu.",
    coreDoctrine: "Pañca-Bheda & Svatantrāsvatantra-Tattva",
    keyDoctrines: [
      "Fivefold fundamental eternal difference: God-Soul, God-Matter, Soul-Soul, Soul-Matter, Matter-Matter",
      "Viṣṇu as the only independent reality (Svatantra-Tattva)",
      "Unflinching defense of sensory perception and cosmic reality"
    ],
    sampleSutras: [
      {
        number: "1.1.1",
        title: "Athāto Brahmajijñāsā",
        mulaSanskrit: "ॐ अथातो ब्रह्मजिज्ञासा ॐ ॥ १.१.१ ॥",
        padaccheda: "अथ, अतः, ब्रह्मजिज्ञासा",
        anvaya: "अथ (अधिकारानन्तरम्) अतः (विष्णोः प्रसादादेव मोक्षसिद्धेः) ब्रह्मजिज्ञासा ।",
        bhashyaText: "नारायणं गुणैः सर्वैरुदीर्णं दोषवर्जितम् । ज्ञेयं गम्यं गुरून् वापि नत्वा सूत्रार्थ उच्यते ॥ अथातो ब्रह्मजिज्ञासा । परमो गुणपूर्णो भगवान् विष्णुरेव ब्रह्मशब्देनोच्यते ।",
        tikaText: "न्यायसुधायाम्: सकलगुणपरिपूर्णत्वमेव ब्रह्मत्वम् ।",
        englishExplanation: "Demonstrates that the term Brahman fundamentally denotes Lord Nārāyaṇa who is replete with all auspicious attributes and free from every trace of defect."
      }
    ],
    tikas: [
      {
        name: "Śrīman-Nyāyasudhā (श्रीमन्न्यायसुधा)",
        author: "Śrī Jayatīrtha",
        century: "14th Century CE",
        tradition: "Dvaita Dialectical Apex",
        description: "Monumental philosophical treatise refuting rival non-dual schools."
      }
    ]
  },
  {
    id: "swaminarayan",
    name: "Swaminarayan Bhashyam (स्वामिनारायणभाष्यम्)",
    devanagariName: "स्वामिनारायणभाष्यम्",
    author: "Mahāmahopādhyāya Sadhu Bhadreshdas Swami",
    authorDevanagari: "साधु भद्रेशदास स्वामी",
    tradition: "Akṣara-Puruṣottama Darśana (अक्षरपुरुषोत्तम-दर्शनम्)",
    school: "Akṣara-Puruṣottama Vedānta",
    paramparaId: "aksarapurusottama",
    century: "21st Century CE (2007 CE)",
    color: "#9333ea",
    badge: "Bhadreshdas (Svāminārāyaṇa)",
    description: "Contemporary classical Sanskrit commentary establishing five eternal entities with Parabrahman Puruṣottama as supreme and Akṣarabrahman as the divine abode and pathway to liberation.",
    coreDoctrine: "Five Eternal Entities (Jīva, Īśvara, Māyā, Akṣara, Puruṣottama)",
    keyDoctrines: [
      "Distinction between Akṣarabrahman (abode) and Parabrahman (supreme lord)",
      "Becoming Akṣararūpa to offer eternal worship to Puruṣottama",
      "Grounded in Bhagavān Svāmīnārāyaṇa's Vacanāmṛta"
    ],
    sampleSutras: [
      {
        number: "1.1.1",
        title: "Athāto Brahmajijñāsā",
        mulaSanskrit: "ॐ अथातो ब्रह्मजिज्ञासा ॐ ॥ १.१.१ ॥",
        padaccheda: "अथ, अतः, ब्रह्मजिज्ञासा",
        anvaya: "अथ (साधनसम्पत्त्यनन्तरम्) अतः (मोक्षाय) ब्रह्मजिज्ञासा (अक्षरब्रह्मणः परब्रह्मणश्च) ।",
        bhashyaText: "अथातो ब्रह्मजिज्ञासा । अत्र 'ब्रह्म'शब्देन अक्षरं परं चेत्युभयोर्जिज्ञासा विवक्षिता । अक्षरब्रह्मसाधर्म्यावाप्तौ परब्रह्मोपासना सिद्ध्यति ।",
        tikaText: "स्वामिनारायण-सिद्धान्त-सुधायाम्: अक्षरपुरुषोत्तमयोर्निरूपणं वेदान्ततत्त्वम् ।",
        englishExplanation: "Establishes that Brahma-Jijñāsā encompasses both Akṣarabrahman and Parabrahman Puruṣottama."
      }
    ],
    tikas: [
      {
        name: "Swaminarayan-Siddhanta-Sudha (स्वामिनारायण-सिद्धान्त-सुधा)",
        author: "Sadhu Bhadreshdas Swami",
        century: "21st Century CE",
        tradition: "Dialectical Treatise",
        description: "Comprehensive Vāda-Grantha defending Akṣara-Puruṣottama Vedānta."
      }
    ]
  }
];

interface MappingUtilityProps {
  onNavigateToTab?: (tab: TabType, payload?: any) => void;
  onOpenFacilitiesDrawer?: () => void;
  initialTextId?: string;
  initialChapterId?: string;
  initialVerseId?: string;
  initialCompareMode?: boolean;
  initialCompareLeftId?: string;
  initialCompareRightId?: string;
  initialCommentaryId?: string;
  initialViewMode?: "catalog" | "reader" | "compare" | "commentary";
  onViewStateChange?: (state: {
    subView: "catalog" | "reader" | "compare" | "commentary";
    textId?: string;
    chapterId?: string;
    verseId?: string;
    compareLeftId?: string;
    compareRightId?: string;
    commentaryId?: string;
  }) => void;
  isFocusedReadingMode?: boolean;
  onToggleFocusedReadingMode?: (active?: boolean) => void;
}

export default function MappingUtility({
  onNavigateToTab,
  onOpenFacilitiesDrawer,
  initialTextId,
  initialChapterId,
  initialVerseId,
  initialCompareMode = false,
  initialCompareLeftId,
  initialCompareRightId,
  initialCommentaryId,
  initialViewMode = "catalog",
  onViewStateChange,
  isFocusedReadingMode,
  onToggleFocusedReadingMode,
}: MappingUtilityProps) {
  const { transliterate, activeLipi, getTypographyStyle } = useBharatiyaLipi();
  const [internalFocusedReadingMode, setInternalFocusedReadingMode] = useState(false);
  const isFocused = isFocusedReadingMode !== undefined ? isFocusedReadingMode : internalFocusedReadingMode;

  const toggleFocusedReadingMode = (nextVal?: boolean) => {
    const target = nextVal !== undefined ? nextVal : !isFocused;
    setInternalFocusedReadingMode(target);
    onToggleFocusedReadingMode?.(target);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFocused) {
        toggleFocusedReadingMode(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFocused]);

  const [selectedPreset, setSelectedPreset] = useState<TextEntry>(() => {
    if (initialTextId) {
      const found = PRESEEDED_GRANTHAS.find((g) => g.id === initialTextId);
      if (found) return found;
    }
    return PRESEEDED_GRANTHAS[0];
  });
  const [customQuery, setCustomQuery] = useState("");
  const [librarySearchFilter, setLibrarySearchFilter] = useState("");
  const [selectedParamparaFilter, setSelectedParamparaFilter] = useState<ParamparaId | "all">("all");
  const [onlyNeoVedanta, setOnlyNeoVedanta] = useState(false);

  // Compare Mode State
  const [isCompareMode, setIsCompareMode] = useState<boolean>(initialCompareMode);
  const [compareLeftId, setCompareLeftId] = useState<string>(initialCompareLeftId || "vivekacudamani");
  const [compareRightId, setCompareRightId] = useState<string>(initialCompareRightId || "sribhasya");

  const [customState, setCustomState] = useState<BibliographicQueryState>({
    title: "",
    isProcessing: false,
    result: null,
    error: null,
  });

  // Dedicated Reader View State
  const [readingGrantha, setReadingGrantha] = useState<TextEntry | null>(() => {
    if (initialTextId) {
      const found = PRESEEDED_GRANTHAS.find((g) => g.id === initialTextId);
      if (found) return found;
    }
    return null;
  });
  const [readingChapterId, setReadingChapterId] = useState<string | undefined>(initialChapterId);
  const [readingVerseId, setReadingVerseId] = useState<string | undefined>(initialVerseId);
  const [isFetchingFullText, setIsFetchingFullText] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Nyāyaprasthāna (Brahmasūtrāṇi) view mode
  const [nyayaActiveSubView, setNyayaActiveSubView] = useState<"sutras" | "synthesis">("sutras");

  // Active Chapter and Verse for Exegetical Reader directly within MappingUtility
  const [utilityChapterIndex, setUtilityChapterIndex] = useState(0);
  const [utilityVerseIndex, setUtilityVerseIndex] = useState(0);
  const [utilityShowPadaccheda, setUtilityShowPadaccheda] = useState(true);
  const [utilityShowAnvaya, setUtilityShowAnvaya] = useState(true);

  // Quick loaders for Nyāyaprasthāna and Śāktabhāṣya
  const handleLoadNyayaPrasthana = (adhyayaNum: 1 | 2 | 3 | 4 = 1, sutraId?: string) => {
    const bsGrantha = PRESEEDED_GRANTHAS.find((g) => g.id === "brahmasutra") || BRAHMASUTRA_GRANTHA;
    setSelectedPreset(bsGrantha);
    setNyayaActiveSubView("sutras");
    if (sutraId) {
      openReader(bsGrantha, `brahmasutra-adhyaya-${adhyayaNum}`, sutraId);
    }
  };

  const handleLoadShaktibhashya = () => {
    const saktaGrantha = PRESEEDED_GRANTHAS.find((g) => g.id === "brahmasutra-saktabhasya") || SHAKTI_BHASHYA_GRANTHA;
    setSelectedPreset(saktaGrantha);
    setSelectedCommentaryOptionId("shaktibhashya");
    openReader(saktaGrantha);
    onViewStateChange?.({
      subView: "reader",
      textId: saktaGrantha.id,
      commentaryId: "shaktibhashya",
    });
  };

  // Commentary Option Selection (e.g. Śāktabhāṣyam, Śāṅkara, Śrī-Bhāṣya)
  const [selectedCommentaryOptionId, setSelectedCommentaryOptionId] = useState<string | null>(initialCommentaryId || null);
  const [selectedCommentarySutraIndex, setSelectedCommentarySutraIndex] = useState<number>(0);

  // Navigation history & sub-view control helpers
  const openReader = (grantha: TextEntry, chapterId?: string, verseId?: string) => {
    setReadingGrantha(grantha);
    setSelectedPreset(grantha);
    setReadingChapterId(chapterId);
    setReadingVerseId(verseId);
    setIsCompareMode(false);
    onViewStateChange?.({
      subView: "reader",
      textId: grantha.id,
      chapterId,
      verseId,
    });
  };

  const closeReader = () => {
    setReadingGrantha(null);
    setReadingChapterId(undefined);
    setReadingVerseId(undefined);
    onViewStateChange?.({
      subView: "catalog",
    });
  };

  const openCompareMode = (leftId?: string, rightId?: string) => {
    setIsCompareMode(true);
    if (leftId) setCompareLeftId(leftId);
    if (rightId) setCompareRightId(rightId);
    onViewStateChange?.({
      subView: "compare",
      compareLeftId: leftId || compareLeftId,
      compareRightId: rightId || compareRightId,
    });
  };

  const closeCompareMode = () => {
    setIsCompareMode(false);
    onViewStateChange?.({
      subView: "catalog",
    });
  };

  const selectCommentaryOption = (commId: string | null) => {
    setSelectedCommentaryOptionId(commId);
    setSelectedCommentarySutraIndex(0);
    onViewStateChange?.({
      subView: commId ? "commentary" : "catalog",
      commentaryId: commId || undefined,
    });
  };

  // Synchronize internal state when browser back/forward or hash updates initial props
  useEffect(() => {
    if (initialViewMode === "catalog") {
      setReadingGrantha(null);
      setIsCompareMode(false);
      setSelectedCommentaryOptionId(null);
    } else if (initialViewMode === "reader") {
      setIsCompareMode(false);
      const textToLoad = initialTextId
        ? PRESEEDED_GRANTHAS.find((g) => g.id === initialTextId) || PRESEEDED_GRANTHAS[0]
        : selectedPreset;
      setReadingGrantha(textToLoad);
      setSelectedPreset(textToLoad);
      setReadingChapterId(initialChapterId);
      setReadingVerseId(initialVerseId);
    } else if (initialViewMode === "compare") {
      setReadingGrantha(null);
      setIsCompareMode(true);
      if (initialCompareLeftId) setCompareLeftId(initialCompareLeftId);
      if (initialCompareRightId) setCompareRightId(initialCompareRightId);
    } else if (initialViewMode === "commentary") {
      setReadingGrantha(null);
      setIsCompareMode(false);
      setSelectedCommentaryOptionId(initialCommentaryId || "shaktibhashya");
    }
  }, [
    initialViewMode,
    initialTextId,
    initialChapterId,
    initialVerseId,
    initialCompareLeftId,
    initialCompareRightId,
    initialCommentaryId,
  ]);

  // Nyāyaprasthāna data loader bundle (verse-by-verse parsing and cross-referencing)
  const nyayaMappingBundle = useMemo(() => {
    return loadNyayaPrasthanaMappingData();
  }, []);

  const activeCommentaryOption = useMemo(() => {
    if (!selectedCommentaryOptionId) return null;
    return MAPPING_AVAILABLE_COMMENTARIES.find((c) => c.id === selectedCommentaryOptionId) || null;
  }, [selectedCommentaryOptionId]);

  // Reset indices when selectedPreset changes
  useEffect(() => {
    setUtilityChapterIndex(0);
    setUtilityVerseIndex(0);
  }, [selectedPreset.id]);

  const handleOpenNyayaSutraInReader = (sutraId: string, adhyayaId: string) => {
    const bsGrantha = PRESEEDED_GRANTHAS.find((g) => g.id === "brahmasutra");
    if (bsGrantha) {
      setReadingGrantha(bsGrantha);
      setReadingChapterId(adhyayaId);
      setReadingVerseId(sutraId);
      setIsCompareMode(false);
    }
  };

  const handleNavigateToGranthaFromNyaya = (granthaId: string, chapterId?: string, verseId?: string) => {
    const found = PRESEEDED_GRANTHAS.find((g) => g.id === granthaId);
    if (found) {
      setReadingGrantha(found);
      setReadingChapterId(chapterId);
      setReadingVerseId(verseId);
      setIsCompareMode(false);
    }
  };

  const handleCompareWithGranthaFromNyaya = (granthaId: string) => {
    setCompareLeftId("brahmasutra");
    setCompareRightId(granthaId);
    setIsCompareMode(true);
  };

  useEffect(() => {
    if (initialTextId) {
      const found = PRESEEDED_GRANTHAS.find((g) => g.id === initialTextId);
      if (found) {
        setReadingGrantha(found);
        setSelectedPreset(found);
        setReadingChapterId(initialChapterId);
        setReadingVerseId(initialVerseId);
        setIsCompareMode(false);
      }
    }
  }, [initialTextId, initialChapterId, initialVerseId]);

  // Bookmarks Drawer State
  const [isBookmarksDrawerOpen, setIsBookmarksDrawerOpen] = useState(false);
  const [bookmarksVersion, setBookmarksVersion] = useState(0);

  const allBookmarks = useMemo(() => {
    return getBookmarks();
  }, [bookmarksVersion, isBookmarksDrawerOpen]);

  const handleSelectBookmarkFromCatalog = (bookmark: VerseBookmark) => {
    const foundGrantha = PRESEEDED_GRANTHAS.find((g) => g.id === bookmark.granthaId);
    if (foundGrantha) {
      setReadingGrantha(foundGrantha);
      setReadingChapterId(bookmark.chapterId);
      setReadingVerseId(bookmark.verseId);
      setIsBookmarksDrawerOpen(false);
    }
  };

  // Filtered granthas in library
  const [copiedPresetId, setCopiedPresetId] = useState<string | null>(null);

  const handleCopyPresetSynthesis = (preset: TextEntry) => {
    const textToCopy = `=== ${preset.title} (${preset.transliteratedTitle}) ===
Author: ${preset.author} | School: ${preset.school} | Era: ${preset.century}
Foundational Text: ${preset.foundationalText}

[Bibliographical Synthesis]
${preset.description}

[Pūrvapakṣa (Dialectical Opposition)]
${preset.refutationsDet}

[Siddhānta (Philosophical Assertion)]
${preset.supportsDet}

Academic Reference: vedāntatattvaṁ (https://vedantatattvam.com). Accessed on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}.`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedPresetId(preset.id);
    setTimeout(() => setCopiedPresetId(null), 2500);
  };

  const filteredGranthas = useMemo(() => {
    return PRESEEDED_GRANTHAS.filter((g) => {
      // Parampara filter
      if (selectedParamparaFilter !== "all" && g.paramparaId !== selectedParamparaFilter) {
        return false;
      }
      // Neo-Vedanta toggle
      if (onlyNeoVedanta && !g.isNeoVedanta) {
        return false;
      }
      // Text search
      if (librarySearchFilter.trim()) {
        const q = librarySearchFilter.toLowerCase();
        return (
          g.title.toLowerCase().includes(q) ||
          g.transliteratedTitle.toLowerCase().includes(q) ||
          g.author.toLowerCase().includes(q) ||
          g.school.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedParamparaFilter, onlyNeoVedanta, librarySearchFilter]);

  const handleCustomLookup = async () => {
    if (!customQuery.trim()) return;

    setCustomState({
      title: customQuery,
      isProcessing: true,
      error: null,
      result: null,
    });

    try {
      const res = await fetch("/api/text-explore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: customQuery }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to locate bibliography.");
      }

      const data = await res.json();
      setCustomState((prev) => ({ ...prev, isProcessing: false, result: data.result }));
    } catch (err: any) {
      setCustomState((prev) => ({ ...prev, isProcessing: false, error: err.message }));
    }
  };

  const handleOpenCustomInReader = async (titleToFetch: string) => {
    const lower = titleToFetch.toLowerCase();
    if (
      lower.includes("brahma") ||
      lower.includes("nyaya") ||
      lower.includes("badarayana") ||
      lower.includes("vyasa")
    ) {
      const bsGrantha = PRESEEDED_GRANTHAS.find((g) => g.id === "brahmasutra") || BRAHMASUTRA_GRANTHA;
      setReadingGrantha(bsGrantha);
      setSelectedPreset(bsGrantha);
      return;
    }
    if (
      lower.includes("sakta") ||
      lower.includes("shakti") ||
      lower.includes("tarkaratna")
    ) {
      const saktaGrantha = PRESEEDED_GRANTHAS.find((g) => g.id === "brahmasutra-saktabhasya") || SHAKTI_BHASHYA_GRANTHA;
      setReadingGrantha(saktaGrantha);
      setSelectedPreset(saktaGrantha);
      return;
    }

    setIsFetchingFullText(true);
    setFetchError(null);

    try {
      const res = await fetch("/api/fetch-full-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: titleToFetch }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to compile full source text for reader.");
      }

      const data = await res.json();
      if (data.grantha && data.grantha.chapters) {
        setReadingGrantha(data.grantha);
      } else {
        throw new Error("Invalid manuscript text received from server.");
      }
    } catch (err: any) {
      setFetchError(err.message || "Failed to launch text reader.");
    } finally {
      setIsFetchingFullText(false);
    }
  };

  // If user is in Compare Mode
  if (isCompareMode) {
    return (
      <GranthaCompareView
        initialLeftGranthaId={compareLeftId}
        initialRightGranthaId={compareRightId}
        onBackToCatalog={closeCompareMode}
        onNavigateToTab={onNavigateToTab}
      />
    );
  }

  // If user is reading a Grantha in the dedicated reader view
  if (readingGrantha) {
    return (
      <TextReaderView
        grantha={readingGrantha}
        initialChapterId={readingChapterId}
        initialVerseId={readingVerseId}
        onBack={closeReader}
        onNavigateToTab={onNavigateToTab}
        onOpenFacilitiesDrawer={onOpenFacilitiesDrawer}
        isFocusedReadingMode={isFocused}
        onToggleFocusedReadingMode={toggleFocusedReadingMode}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Distraction-Free Mode Top Indicator in Catalog */}
      {isFocused && (
        <div className="bg-[#FFFDF8] border-2 border-[#bf953f]/50 p-3 sm:p-4 rounded-2xl shadow-md flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#8c6011] text-white rounded-lg">
              <Eye className="w-4 h-4" />
            </span>
            <div>
              <span className="text-xs font-mono font-bold text-[#8c6011] uppercase tracking-wider block">
                Focused Reading Mode Active
              </span>
              <p className="text-xs text-[#5c4731] font-serif">
                Navigation header and sidebar are hidden. Select any treatise or click &ldquo;Open Actual Text Reader&rdquo; below for deep distraction-free study.
              </p>
            </div>
          </div>
          <button
            onClick={() => toggleFocusedReadingMode(false)}
            type="button"
            className="px-3 py-1.5 bg-[#8c6011] hover:bg-[#735013] text-[#FFFDF8] text-xs font-bold font-mono rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm shrink-0"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Exit Focused Mode</span>
            <kbd className="hidden sm:inline text-[9px] bg-black/25 px-1.5 py-0.5 rounded">Esc</kbd>
          </button>
        </div>
      )}

      {/* Overview Block */}
      <div className="card-3d-gold p-5 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#8c6011]" />
            <h3 className="font-serif font-bold gold-text-gradient text-base sm:text-lg">
              Granthasāraṇī: Bibliographical Canon & Sanskrit Text Reader
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Focused Reading Mode Button */}
            <button
              id="mapping-focused-reading-mode-btn"
              type="button"
              onClick={() => {
                if (!readingGrantha) {
                  openReader(selectedPreset);
                }
                toggleFocusedReadingMode(true);
              }}
              className={`text-xs font-mono font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition cursor-pointer shadow-xs ${
                isFocused
                  ? "bg-gradient-to-r from-[#d4af37] via-[#fcf6ba] to-[#c59b27] border-[#ffe680] text-[#120e0b] shadow-md ring-1 ring-[#bf953f]"
                  : "bg-gradient-to-r from-[#FAF5ED] to-[#f5e6ce] hover:brightness-95 text-[#8c6011] border-[#bf953f]/40"
              }`}
              title="Activate Distraction-Free Focused Reading Mode for Deep Scriptural Study (Hides Navigation & Header, Increases Font & Line Spacing)"
            >
              <Eye className="w-3.5 h-3.5 text-[#8c6011]" />
              <span>{isFocused ? "Focused Reading Active" : "Focused Reading Mode"}</span>
            </button>

            {/* Nyāyaprasthāna Sūtras Navigator Button */}
            <button
              type="button"
              onClick={() => {
                const bs = PRESEEDED_GRANTHAS.find((g) => g.id === "brahmasutra");
                if (bs) {
                  setSelectedPreset(bs);
                  setNyayaActiveSubView("sutras");
                }
              }}
              className="text-xs font-mono font-bold text-[#8c6011] bg-gradient-to-r from-[#FAF5ED] to-[#f5e6ce] hover:brightness-95 px-3 py-1.5 rounded-xl border border-[#bf953f]/40 flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              title="Launch Nyāyaprasthāna (Brahmasūtrāṇi) Verse-by-Verse Navigator & Cross-Referencing Engine"
            >
              <Compass className="w-3.5 h-3.5 text-[#8c6011]" />
              <span>Nyāya-Prasthāna (Brahmasūtras)</span>
            </button>

            {/* Compare Mode Button */}
            <button
              type="button"
              onClick={() => {
                setCompareLeftId(selectedPreset.id);
                setIsCompareMode(true);
              }}
              className="text-xs font-mono font-bold text-[#8c6011] bg-gradient-to-r from-[#FAF5ED] to-[#f5e6ce] hover:brightness-95 px-3 py-1.5 rounded-xl border border-[#bf953f]/40 flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              title="Open Dual-Column Side-by-Side Comparison for Verses and Chapters"
            >
              <Scale className="w-3.5 h-3.5 text-[#8c6011]" />
              <span>Compare Mode (Side-by-Side)</span>
            </button>

            {/* Saved Bookmarks Button */}
            <button
              type="button"
              onClick={() => setIsBookmarksDrawerOpen(true)}
              className="text-xs font-mono font-bold text-[#8c6011] bg-[#FAF5ED] hover:bg-[#f3e5ce] px-3 py-1.5 rounded-xl border border-[#bf953f]/30 flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              title="View all saved verse bookmarks"
            >
              <BookMarked className="w-3.5 h-3.5 text-[#8c6011]" />
              <span>Saved Bookmarks</span>
              {allBookmarks.length > 0 && (
                <span className="bg-amber-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {allBookmarks.length}
                </span>
              )}
            </button>

            {onNavigateToTab && (
              <button
                type="button"
                onClick={() => onNavigateToTab("tree")}
                className="text-xs font-mono font-bold text-[#8c6011] bg-[#bf953f]/15 hover:bg-[#bf953f]/25 px-3 py-1.5 rounded-xl border border-[#bf953f]/30 flex items-center gap-1.5 transition cursor-pointer"
              >
                <GitFork className="w-3.5 h-3.5" />
                <span>View Knowledge Tree</span>
              </button>
            )}
            <div className="text-xs font-mono text-[#8c6011] bg-[#bf953f]/15 px-3 py-1 rounded-full border border-[#bf953f]/30">
              {PRESEEDED_GRANTHAS.length} Canonical Works Classified
            </div>
          </div>
        </div>

        <div className="text-sm text-[#4a3928] leading-relaxed">
          The literary canon of Vedānta spans millennia of treatises (<GlossaryHover termName="Bhāṣya">Bhāṣyas</GlossaryHover>, sub-commentaries, dialectical texts, and modern integral expositions). Select any Paramparā below to explore its foundational treatises or search any work to read authentic Sanskrit verses, <GlossaryHover termName="Pūrvapakṣa">Pūrvapakṣa</GlossaryHover> refutations, and classical commentaries.
        </div>

        {/* Parampara Filter Tabs */}
        <div className="mt-4 pt-3 border-t border-[#bf953f]/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#8c6011] uppercase tracking-wider flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Paramparā Classification:
            </span>
            <label className="flex items-center gap-1.5 text-xs text-[#4a3928] font-mono cursor-pointer">
              <input
                type="checkbox"
                checked={onlyNeoVedanta}
                onChange={(e) => setOnlyNeoVedanta(e.target.checked)}
                className="rounded text-[#8c6011] focus:ring-[#8c6011]"
              />
              <span>Navyānubhava Vedānta Texts Only</span>
            </label>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedParamparaFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer ${
                selectedParamparaFilter === "all"
                  ? "bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border-2 border-[#C59B27] shadow-xs ring-1 ring-[#E2B755]/60 font-bold"
                  : "bg-[#FFFDF9] hover:bg-[#FAF3E4] text-[#3D2C1D] border border-[#bf953f]/30 shadow-xs"
              }`}
            >
              All Traditions ({PRESEEDED_GRANTHAS.length})
            </button>
            {PARAMPARA_TRADITIONS.map((trad) => {
              const count = PRESEEDED_GRANTHAS.filter((g) => g.paramparaId === trad.id).length;
              const isSelected = selectedParamparaFilter === trad.id;
              return (
                <button
                  key={trad.id}
                  type="button"
                  onClick={() => setSelectedParamparaFilter(trad.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border-2 border-[#C59B27] shadow-xs ring-1 ring-[#E2B755]/60 font-bold"
                      : "bg-[#FFFDF9] hover:bg-[#FAF3E4] text-[#3D2C1D] border border-[#bf953f]/30 shadow-xs"
                  }`}
                >
                  <span>{trad.name.split(" ")[0]}</span>
                  <span className={`text-[10px] font-mono px-1 rounded ${isSelected ? "bg-[#FAF2E3] text-[#7A3E00] border border-[#d4af37] font-bold" : "bg-[#FAF2E3] text-[#8c6011]"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {isFetchingFullText && (
        <Loader label={`Retrieving canonical Sanskrit manuscript and Bhāṣya for "${customState.title || customQuery}"...`} />
      )}

      {fetchError && (
        <div className="bg-red-50 border border-red-300 text-red-900 p-4 rounded-xl text-sm flex gap-2 items-start shadow-md">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <div>
            <strong className="text-red-950">Text Reader Error:</strong> {fetchError}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left pane: Library selector of presets & Nyayaprasthana Data Loader */}
        <div className="lg:col-span-5 space-y-4">
          {/* Dedicated Nyāyaprasthāna (Brahmasūtrāṇi) Data Loader */}
          <div className="card-3d-gold p-4 space-y-3 bg-gradient-to-br from-[#FFFDF8] via-[#FAF3E4] to-[#F5EAD4] border-2 border-[#bf953f] shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#8c6011] text-[#FFFDF8] flex items-center justify-center shadow-xs">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#8c6011] uppercase tracking-wider font-mono">
                    Nyāyaprasthāna Data Loader
                  </h4>
                  <div className="text-[11px] font-serif text-[#3D2C1D] font-bold">
                    ब्रह्मसूत्राणि (555 Sūtras • 4 Adhyāyas)
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#8c6011]/15 text-[#8c6011] border border-[#bf953f]/40 font-bold">
                Brahma-Mīmāṁsā
              </span>
            </div>

            <p className="text-xs text-[#5c4731] leading-relaxed">
              Foundational dialectical pillar of Vedānta with verse-by-verse navigation, 5-limb Adhikaraṇa exegesis, Upaniṣadic Viṣaya-Vākya cross-references, and multi-school commentary analysis.
            </p>

            {/* Commentary Options Badges & Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-[#8c6011] uppercase tracking-wider">
                  Available Commentaries & Ṭīkās:
                </span>
                {selectedCommentaryOptionId && (
                  <button
                    type="button"
                    onClick={() => selectCommentaryOption(null)}
                    className="text-[10px] font-mono text-rose-700 hover:underline cursor-pointer font-bold"
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-1">
                {MAPPING_AVAILABLE_COMMENTARIES.map((comm) => {
                  const isSelected = selectedCommentaryOptionId === comm.id;
                  const isSakta = comm.id === "shaktibhashya";
                  return (
                    <button
                      key={comm.id}
                      type="button"
                      onClick={() => {
                        selectCommentaryOption(isSelected ? null : comm.id);
                      }}
                      className={`px-2 py-1 rounded-md text-[10px] font-mono transition cursor-pointer flex items-center gap-1 text-left ${
                        isSelected
                          ? isSakta
                            ? "bg-rose-700 text-white font-bold shadow-xs ring-2 ring-rose-400"
                            : "bg-[#8c6011] text-white font-bold shadow-xs ring-2 ring-[#bf953f]"
                          : isSakta
                          ? "bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-900 font-bold"
                          : "bg-[#FFFDF8] hover:bg-[#FAF1E2] border border-[#bf953f]/30 text-[#4a3928]"
                      }`}
                      title={`Select ${comm.name} by ${comm.author}`}
                    >
                      <span>{comm.badge}</span>
                    </button>
                  );
                })}
              </div>

              {/* Quick Commentary Dropdown Selector */}
              <div className="pt-1">
                <label htmlFor="commentary-quick-selector" className="sr-only">Select Commentary Option</label>
                <select
                  id="commentary-quick-selector"
                  value={selectedCommentaryOptionId || ""}
                  onChange={(e) => {
                    setSelectedCommentaryOptionId(e.target.value || null);
                    setSelectedCommentarySutraIndex(0);
                  }}
                  className="w-full text-xs p-2 rounded-xl border border-[#bf953f]/40 bg-[#FFFDF8] text-[#2D2319] focus:outline-none focus:ring-1 focus:ring-[#8c6011]"
                >
                  <option value="">-- Select Commentary Option (भाष्य-विकल्पः) --</option>
                  {MAPPING_AVAILABLE_COMMENTARIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.school}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleLoadNyayaPrasthana(1)}
                className="px-3 py-2 bg-[#8c6011] hover:bg-[#735013] text-[#FFFDF8] font-bold text-xs rounded-xl transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                title="Load full 555 Sūtras of Nyāyaprasthāna with Adhikaraṇa and cross-references"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Load Brahmasūtram</span>
              </button>
              <button
                type="button"
                onClick={handleLoadShaktibhashya}
                className="px-3 py-2 bg-gradient-to-r from-rose-700 to-rose-800 hover:from-rose-800 hover:to-rose-900 text-white font-bold text-xs rounded-xl transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                title="Load Śāktabhāṣyam by MM Pañcānana Tarkaratna of Bhatpara"
              >
                <Scroll className="w-3.5 h-3.5" />
                <span>Load Śāktabhāṣyam</span>
              </button>
            </div>
          </div>

          <div className="card-3d-gold p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#8c6011] uppercase tracking-wider flex items-center gap-1 font-mono">
                <Bookmark className="w-3.5 h-3.5" /> Canon Library:
              </h4>
              <span className="text-[11px] text-[#6e5842] font-serif italic">
                Showing {filteredGranthas.length} of {PRESEEDED_GRANTHAS.length} Works
              </span>
            </div>

            {/* Quick Search inside Library */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#8c6011] absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Filter by title, author, school..."
                value={librarySearchFilter}
                onChange={(e) => setLibrarySearchFilter(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-[#bf953f]/30 rounded-lg text-xs bg-[#FFFDF9] text-[#2D2319] placeholder-[#9c8266] focus:outline-none focus:ring-1 focus:ring-[#bf953f]"
              />
            </div>
            
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredGranthas.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#6e5842] bg-white/50 rounded-xl border border-dashed border-[#bf953f]/30">
                  No texts match your filter. Try selecting "All Traditions" or clearing the search.
                </div>
              ) : (
                filteredGranthas.map((grantha) => {
                  const isActive = selectedPreset.id === grantha.id && !customState.result;
                  return (
                    <div
                      key={grantha.id}
                      className={`p-3.5 rounded-xl border transition-all duration-150 ${
                        isActive
                          ? "bg-gradient-to-r from-[#FAF1E2] via-[#FFFDF8] to-[#FAF1E2] border-[#bf953f] shadow-md ring-1 ring-[#bf953f]"
                          : "bg-[#FFFDF8] border-[#bf953f]/30 hover:bg-[#FAF3E6]"
                      }`}
                    >
                      <div 
                        onClick={() => {
                          setSelectedPreset(grantha);
                          setCustomState({ title: "", isProcessing: false, result: null, error: null });
                        }}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-serif font-bold text-sm text-[#2D2319] font-indic" style={getTypographyStyle()}>
                            {transliterate(grantha.transliteratedTitle, activeLipi)}
                          </span>
                          <ChevronRight className={`w-4 h-4 ${isActive ? "text-[#8c6011] translate-x-1" : "text-[#8c6011] opacity-40"} transition-all`} />
                        </div>
                        <div className="text-[11px] mt-1 flex flex-wrap items-center justify-between gap-1 text-[#6e5842]">
                          <span>{grantha.author}</span>
                          <div className="flex items-center gap-1">
                            {grantha.isNeoVedanta && (
                              <span className="text-[9px] font-mono px-1 rounded bg-teal-100 text-teal-800 border border-teal-200">
                                Navyānubhava
                              </span>
                            )}
                            <span className="italic font-serif text-[10px] text-[#8c6011]">
                              {grantha.school.split(" ")[0]}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Button to Open Reader or Sūtra Navigator Immediately */}
                      <div className="mt-3 pt-2.5 border-t border-[#bf953f]/20 flex items-center justify-between gap-1 flex-wrap">
                        <span className="text-[10px] text-[#8c6011] font-mono font-medium">
                          {grantha.chapters ? `${grantha.chapters.length} Section(s)` : "Sanskrit Text Ready"}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {grantha.id === "brahmasutra" && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPreset(grantha);
                                setNyayaActiveSubView("sutras");
                              }}
                              className="px-2.5 py-1 bg-[#8c6011] text-[#FFFDF8] hover:bg-[#735013] font-bold text-xs rounded-lg transition shadow-xs flex items-center gap-1 cursor-pointer"
                              title="Navigate Nyāyaprasthāna verse-by-verse with cross-references"
                            >
                              <Compass className="w-3 h-3 text-[#FFFDF8]" />
                              <span>Sūtras</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => openReader(grantha)}
                            className="px-3 py-1 bg-gradient-to-r from-[#d4af37] via-[#fcf6ba] to-[#c59b27] hover:brightness-105 border border-[#ffe680] text-[#120e0b] font-bold text-xs rounded-lg transition shadow-sm flex items-center gap-1.5 cursor-pointer"
                          >
                            <Scroll className="w-3.5 h-3.5 text-[#120e0b]" />
                            <span>Read Actual Text</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Prompt custom searching */}
          <div className="card-3d-gold p-4 space-y-3">
            <h4 className="text-xs font-bold text-[#8c6011] uppercase tracking-wider flex items-center gap-1 font-mono">
              <Search className="w-3.5 h-3.5" /> Deep Archive Lookup:
            </h4>
            <p className="text-xs text-[#5c4731] leading-relaxed">
              Query any other historic text (e.g. <em>Bhāmatī, Pañcadaśī, Khaṇḍanakhaṇḍakhādya, Brahmasūtra-Śāṅkarabhāṣya, Gītābhāṣya</em>) and open its Sanskrit verses in the reader.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 p-2.5 border border-[#bf953f]/40 rounded-xl text-sm bg-[#FFFDF9] text-[#2D2319] placeholder-[#9c8266] focus:outline-none focus:ring-2 focus:ring-[#bf953f]/50"
                placeholder="e.g., Pañcadaśī, Vedāntasāra"
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCustomLookup()}
              />
              <button
                type="button"
                onClick={handleCustomLookup}
                className="btn-3d-gold px-4 py-2 rounded-xl text-xs font-bold uppercase shrink-0 cursor-pointer"
              >
                Lookup
              </button>
            </div>
          </div>
        </div>

        {/* Right pane: Display Area */}
        <div className="lg:col-span-7">
          {/* Custom results loading */}
          {customState.isProcessing && <Loader label={`Retrieving academic records for "${customState.title}"...`} />}

          {customState.error && (
            <div className="bg-red-50 border border-red-300 text-red-900 p-4 rounded-xl text-sm flex gap-2 items-start mb-4 shadow-md">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <div>
                <strong className="text-red-950">Archival Disruption:</strong> {customState.error}
              </div>
            </div>
          )}

          {/* Showing Custom Search Result */}
          {customState.result && !customState.isProcessing && (
            <div className="card-3d-gold p-6 relative overflow-hidden space-y-4 min-h-[400px]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#bf953f]/30 pb-3">
                <div className="flex items-center gap-2 text-xs font-mono text-[#735013]">
                  <Search className="w-4 h-4 text-[#8c6011]" />
                  <span className="font-bold uppercase tracking-wider text-[#8c6011]">
                    Deep Scholarly Inventory: "{customState.title.toUpperCase()}"
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenCustomInReader(customState.title)}
                    className="px-3 py-1.5 bg-gradient-to-r from-[#d4af37] via-[#fcf6ba] to-[#c59b27] hover:brightness-105 border border-[#ffe680] text-[#120e0b] font-bold text-xs rounded-xl transition shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <Scroll className="w-4 h-4 text-[#120e0b]" />
                    <span>Open in Full Text Reader</span>
                  </button>

                  <CitationButton
                    moduleName="Granthasāraṇī Inventory"
                    title={customState.title}
                    analysisContent={customState.result}
                  />
                </div>
              </div>

              {/* Callout to open reader */}
              <div className="p-4 rounded-xl bg-[#FAF3E6] border border-[#bf953f]/30 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <BookMarked className="w-5 h-5 text-[#8c6011]" />
                  <div>
                    <div className="text-xs font-bold text-[#2D2319]">
                      Canonical Sanskrit Text Available
                    </div>
                    <div className="text-[11px] text-[#6e5842]">
                      Open the complete source text, sūtras, padaccheda, and commentary in the dedicated reader.
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenCustomInReader(customState.title)}
                  className="px-3.5 py-1.5 bg-[#8c6011] hover:bg-[#735013] text-[#FFFDF8] font-bold text-xs rounded-lg transition flex items-center gap-1 cursor-pointer shadow-sm"
                >
                  <span>Launch Text Reader</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="markdown-body">
                <ReactMarkdown>{customState.result}</ReactMarkdown>
              </div>
            </div>
          )}

          {/* Showing standard pre-seeded entry (default view) */}
          {!customState.result && !customState.isProcessing && (
            <div className="card-3d-gold p-6 space-y-6 relative overflow-hidden">
              <div className="border-b border-[#bf953f]/30 pb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#8c6011] tracking-wider uppercase font-mono">
                      {selectedPreset.school}
                    </span>
                    {selectedPreset.isNeoVedanta && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-100 text-teal-900 border border-teal-300 font-bold">
                        Navyānubhava Vedānta
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif font-black text-2xl gold-text-gradient mt-1 font-indic" style={getTypographyStyle()}>
                    {transliterate(selectedPreset.transliteratedTitle, activeLipi)}
                  </h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-[#5c4731]">
                    <div>
                      <strong className="text-[#8c6011]">Siddhānta Scholar:</strong> {selectedPreset.author}
                    </div>
                    <div>•</div>
                    <div>
                      <strong className="text-[#8c6011]">Composition Era:</strong> {selectedPreset.century}
                    </div>
                    {selectedPreset.paramparaId && onNavigateToTab && (
                      <>
                        <div>•</div>
                        <button
                          type="button"
                          onClick={() => onNavigateToTab("tree", { paramparaId: selectedPreset.paramparaId })}
                          className="text-[#8c6011] font-mono font-bold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <GitFork className="w-3 h-3" />
                          <span>View in Paramparā Tree</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyPresetSynthesis(selectedPreset)}
                    className="px-3 py-1.5 bg-[#FAF5ED] hover:bg-[#FAF1E2] border border-[#bf953f]/40 text-[#735013] hover:text-[#2D2319] font-medium text-xs rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                    title="Copy complete bibliographical synthesis and citation"
                  >
                    {copiedPresetId === selectedPreset.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        <span className="text-emerald-800 font-bold">Copied Citation!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#8c6011]" />
                        <span className="hidden sm:inline">Copy Citation</span>
                        <span className="sm:hidden">Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      openCompareMode(selectedPreset.id);
                    }}
                    className="px-3 py-1.5 bg-[#FAF5ED] hover:bg-[#FAF1E2] border border-[#bf953f]/40 text-[#735013] hover:text-[#2D2319] font-medium text-xs rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                    title="Compare this text side-by-side with another treatise"
                  >
                    <Scale className="w-3.5 h-3.5 text-[#8c6011]" />
                    <span>Compare</span>
                  </button>

                  <button
                    id="preset-focused-reading-mode-btn"
                    type="button"
                    onClick={() => {
                      openReader(selectedPreset);
                      toggleFocusedReadingMode(true);
                    }}
                    className="px-3.5 py-1.5 bg-[#8c6011] hover:bg-[#735013] text-[#FFFDF8] font-bold text-xs rounded-xl transition shadow-md flex items-center gap-1.5 cursor-pointer"
                    title="Read in distraction-free Focused Reading Mode (Hides Header & Navigation, Increases Font & Line Spacing)"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#FFFDF8]" />
                    <span>Focused Reading</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openReader(selectedPreset)}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-[#d4af37] via-[#fcf6ba] to-[#c59b27] hover:brightness-105 border border-[#ffe680] text-[#120e0b] font-bold text-xs rounded-xl transition shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <Scroll className="w-4 h-4 text-[#120e0b]" />
                    <span>Open Actual Text Reader</span>
                  </button>

                  <CitationButton
                    moduleName="Granthasāraṇī Inventory"
                    title={selectedPreset.title}
                    schools={[selectedPreset.school]}
                    analysisContent={`${selectedPreset.description}\n\nPūrvapakṣa: ${selectedPreset.refutationsDet}\n\nSiddhānta: ${selectedPreset.supportsDet}`}
                  />
                </div>
              </div>

              {/* If Brahmasūtra, provide view switcher between Sūtra Navigator and Canon Synthesis */}
              {selectedPreset.id === "brahmasutra" && (
                <div className="flex items-center gap-2 p-1.5 bg-[#FAF3E6] border border-[#bf953f]/30 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setNyayaActiveSubView("sutras")}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                      nyayaActiveSubView === "sutras"
                        ? "bg-[#8c6011] text-[#FFFDF8] shadow-sm"
                        : "text-[#735013] hover:bg-[#FAF1E2]"
                    }`}
                  >
                    <Compass className="w-4 h-4" />
                    <span>Nyāyaprasthāna Sūtra-by-Sūtra Navigator & Cross-References</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNyayaActiveSubView("synthesis")}
                    className={`py-2 px-4 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                      nyayaActiveSubView === "synthesis"
                        ? "bg-[#8c6011] text-[#FFFDF8] shadow-sm"
                        : "text-[#735013] hover:bg-[#FAF1E2]"
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Synthesis & Dialectics</span>
                  </button>
                </div>
              )}

              {/* Dedicated Commentary Option View when selected from available commentaries */}
              {activeCommentaryOption && (
                <div
                  id={`commentary-option-view-${activeCommentaryOption.id}`}
                  className={`p-5 rounded-2xl border-2 transition shadow-sm space-y-5 ${
                    activeCommentaryOption.id === "shaktibhashya"
                      ? "bg-gradient-to-b from-rose-50/70 via-[#FFFDF9] to-rose-50/40 border-rose-300 ring-2 ring-rose-200/50"
                      : "bg-gradient-to-b from-[#FFFDF9] via-[#FAF6ED] to-[#FFFDF9] border-[#bf953f]/40"
                  }`}
                >
                  {/* Header & Meta */}
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#bf953f]/30 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                            activeCommentaryOption.id === "shaktibhashya"
                              ? "bg-rose-100 text-rose-900 border border-rose-300"
                              : "bg-amber-100 text-amber-900 border border-amber-300"
                          }`}
                        >
                          {activeCommentaryOption.badge}
                        </span>
                        <span className="text-xs font-mono text-[#8c6011] font-bold">
                          {activeCommentaryOption.school}
                        </span>
                        <span className="text-xs text-[#5c4731]">• {activeCommentaryOption.century}</span>
                      </div>

                      <h3
                        className="text-xl sm:text-2xl font-serif font-black text-[#2D2319] font-indic"
                        style={getTypographyStyle()}
                      >
                        {transliterate(activeCommentaryOption.name, activeLipi)}
                      </h3>

                      <div className="text-xs text-[#5c4731] flex items-center gap-1.5 flex-wrap">
                        <span>
                          <strong className="text-[#8c6011]">Bhāṣyakāra:</strong>{" "}
                          {activeCommentaryOption.author} (
                          <span className="font-sanskrit text-sm">
                            {activeCommentaryOption.authorDevanagari}
                          </span>
                          )
                        </span>
                        <span>•</span>
                        <span>
                          <strong className="text-[#8c6011]">Paramparā:</strong>{" "}
                          {activeCommentaryOption.tradition}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {activeCommentaryOption.granthaId && (
                        <button
                          type="button"
                          onClick={() => {
                            const targetGrantha =
                              PRESEEDED_GRANTHAS.find((g) => g.id === activeCommentaryOption.granthaId) ||
                              (activeCommentaryOption.id === "shaktibhashya" ? SHAKTI_BHASHYA_GRANTHA : null);
                            if (targetGrantha) {
                              openReader(targetGrantha);
                            }
                          }}
                          className="px-3 py-1.5 bg-gradient-to-r from-rose-700 to-rose-800 hover:from-rose-800 hover:to-rose-900 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition cursor-pointer"
                          title="Read full commentary in Text Reader"
                        >
                          <Scroll className="w-3.5 h-3.5" />
                          <span>Open in Text Reader</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          openCompareMode("brahmasutra", activeCommentaryOption.granthaId || "brahmasutra-saktabhasya");
                        }}
                        className="px-3 py-1.5 bg-[#FAF5ED] hover:bg-[#FAF1E2] border border-[#bf953f]/40 text-[#735013] font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Scale className="w-3.5 h-3.5 text-[#8c6011]" />
                        <span>Compare View</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => selectCommentaryOption(null)}
                        className="px-2.5 py-1.5 text-xs text-rose-700 hover:text-rose-900 font-mono hover:bg-rose-50 rounded-lg transition cursor-pointer font-bold"
                        title="Dismiss commentary view"
                      >
                        ✕ Close
                      </button>
                    </div>
                  </div>

                  {/* Description and Key Doctrines */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2 text-xs text-[#4a3928] leading-relaxed p-3 bg-white/70 rounded-xl border border-[#bf953f]/20">
                      <strong className="text-[#8c6011] block mb-1 font-mono uppercase tracking-wider text-[11px]">
                        Hermeneutical Exposition & Significance:
                      </strong>
                      {activeCommentaryOption.description}
                    </div>

                    <div className="p-3 bg-white/70 rounded-xl border border-[#bf953f]/20 space-y-1.5">
                      <strong className="text-[#8c6011] block font-mono uppercase tracking-wider text-[11px]">
                        Core Doctrine (सिद्धान्तः):
                      </strong>
                      <p className="text-xs font-bold text-[#2D2319]">
                        {activeCommentaryOption.coreDoctrine}
                      </p>
                      <ul className="text-[11px] text-[#5c4731] space-y-1 list-disc list-inside">
                        {activeCommentaryOption.keyDoctrines.slice(0, 3).map((doc, idx) => (
                          <li key={idx}>{doc}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Sample Sūtras Tabs */}
                  {activeCommentaryOption.sampleSutras && activeCommentaryOption.sampleSutras.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-xs font-mono font-bold text-[#8c6011] uppercase tracking-wider flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" />
                          Exemplary Sūtra Exegesis (सूत्रभाष्य-निदर्शनम्):
                        </span>
                        <div className="flex items-center gap-1 flex-wrap">
                          {activeCommentaryOption.sampleSutras.map((sutra, idx) => (
                            <button
                              key={sutra.number}
                              type="button"
                              onClick={() => setSelectedCommentarySutraIndex(idx)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition cursor-pointer ${
                                selectedCommentarySutraIndex === idx
                                  ? activeCommentaryOption.id === "shaktibhashya"
                                    ? "bg-rose-700 text-white font-bold shadow-xs"
                                    : "bg-[#8c6011] text-white font-bold shadow-xs"
                                  : "bg-white/80 hover:bg-[#FAF1E2] border border-[#bf953f]/30 text-[#4a3928]"
                              }`}
                            >
                              Sūtra {sutra.number}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Selected Sample Sūtra Details */}
                      {(() => {
                        const sample =
                          activeCommentaryOption.sampleSutras[selectedCommentarySutraIndex] ||
                          activeCommentaryOption.sampleSutras[0];
                        if (!sample) return null;

                        return (
                          <div className="p-4 rounded-xl bg-white border border-[#bf953f]/30 shadow-xs space-y-3">
                            {/* Sūtra Title & Mūla */}
                            <div className="flex items-start justify-between flex-wrap gap-2 border-b border-[#bf953f]/20 pb-2.5">
                              <div>
                                <span className="text-[10px] font-mono text-[#8c6011] font-bold uppercase tracking-wider block">
                                  Sūtra {sample.number}
                                </span>
                                <h4 className="font-serif font-bold text-base text-[#2D2319]">
                                  {sample.title}
                                </h4>
                              </div>
                              <VedicChantButton verseText={sample.mulaSanskrit} variant="compact" label="Recite Sūtra" />
                            </div>

                            {/* Mūla Sanskrit in Tiro Devanagari */}
                            <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-200/60">
                              <span className="text-[10px] font-mono font-bold text-[#8c6011] uppercase tracking-wider block mb-1">
                                Mūla Sūtra (मूलसूत्रम्):
                              </span>
                              <p className="font-sanskrit text-lg sm:text-xl font-bold text-[#8c6011] tracking-wide" style={{ fontFamily: "'Tiro Devanagari Sanskrit', serif" }}>
                                {transliterate(sample.mulaSanskrit, activeLipi)}
                              </p>
                            </div>

                            {/* Padaccheda & Anvaya */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                              <div className="p-2.5 rounded-lg bg-[#FAF5ED] border border-[#bf953f]/20">
                                <strong className="text-[#8c6011] block mb-1 font-mono uppercase tracking-wider text-[10px]">
                                  Padaccheda (पदच्छेदः):
                                </strong>
                                <span className="font-sanskrit text-sm text-[#4a3928]">
                                  {transliterate(sample.padaccheda, activeLipi)}
                                </span>
                              </div>
                              <div className="p-2.5 rounded-lg bg-[#FAF5ED] border border-[#bf953f]/20">
                                <strong className="text-[#8c6011] block mb-1 font-mono uppercase tracking-wider text-[10px]">
                                  Anvaya (अन्वयः):
                                </strong>
                                <span className="font-sanskrit text-sm text-[#4a3928]">
                                  {transliterate(sample.anvaya, activeLipi)}
                                </span>
                              </div>
                            </div>

                            {/* Bhāṣya Text in Tiro Devanagari */}
                            <div className="p-3.5 rounded-xl bg-white border border-[#bf953f]/30 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-mono font-bold text-[#8c6011] uppercase tracking-wider flex items-center gap-1">
                                  <Scroll className="w-3.5 h-3.5" />
                                  Bhāṣya Exposition (भाष्यम्):
                                </span>
                                <VedicChantButton verseText={sample.bhashyaText} variant="compact" label="Recite Bhāṣya" />
                              </div>
                              <p className="font-sanskrit text-sm sm:text-base leading-relaxed text-[#2D2319]" style={{ fontFamily: "'Tiro Devanagari Sanskrit', serif" }}>
                                {transliterate(sample.bhashyaText, activeLipi)}
                              </p>
                            </div>

                            {/* Ṭīkā if present */}
                            {sample.tikaText && (
                              <div className="p-3 rounded-lg bg-rose-50/50 border border-rose-200/60 space-y-1">
                                <span className="text-[10px] font-mono font-bold text-rose-900 uppercase tracking-wider block">
                                  Ṭīkā Gloss (टीका-विवृतिः):
                                </span>
                                <p className="font-sanskrit text-xs sm:text-sm text-rose-950 leading-relaxed" style={{ fontFamily: "'Tiro Devanagari Sanskrit', serif" }}>
                                  {transliterate(sample.tikaText, activeLipi)}
                                </p>
                              </div>
                            )}

                            {/* English Hermeneutical Context */}
                            <div className="p-3 rounded-lg bg-[#FAF7F0] border border-[#bf953f]/20 text-xs text-[#5c4731] leading-relaxed">
                              <strong className="text-[#8c6011] block mb-0.5 font-mono uppercase tracking-wider text-[10px]">
                                Hermeneutical Insight & English Analysis:
                              </strong>
                              {sample.englishExplanation}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* Associated Ṭīkās list */}
                  {activeCommentaryOption.tikas && activeCommentaryOption.tikas.length > 0 && (
                    <div className="border-t border-[#bf953f]/20 pt-3 space-y-2">
                      <span className="text-[11px] font-mono font-bold text-[#8c6011] uppercase tracking-wider block">
                        Associated Ṭīkās & Dialectical Vistāras:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {activeCommentaryOption.tikas.map((tika, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-lg bg-white/80 border border-[#bf953f]/20 text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between font-bold text-[#2D2319]">
                              <span>{tika.name}</span>
                              <span className="text-[10px] font-mono text-[#8c6011]">{tika.century}</span>
                            </div>
                            <div className="text-[11px] text-[#8c6011]">Author: {tika.author} ({tika.tradition})</div>
                            <p className="text-[11px] text-[#5c4731] leading-normal">{tika.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {selectedPreset.id === "brahmasutra" && nyayaActiveSubView === "sutras" ? (
                <NyayaPrasthanaNavigator
                  onOpenInReader={handleOpenNyayaSutraInReader}
                  onNavigateToGrantha={handleNavigateToGranthaFromNyaya}
                  onCompareWithGrantha={handleCompareWithGranthaFromNyaya}
                />
              ) : (
                <>
                  {/* Interactive Canonical Verse Explorer with Multi-Commentary Dropdown */}
                  {selectedPreset.chapters && selectedPreset.chapters.length > 0 && (() => {
                    const activeChap = selectedPreset.chapters[utilityChapterIndex] || selectedPreset.chapters[0];
                    const activeVer = activeChap?.verses?.[utilityVerseIndex] || activeChap?.verses?.[0];
                    const totalVersesInChap = activeChap?.verses?.length || 0;

                    if (!activeVer) return null;

                    return (
                      <div
                        id={`canonical-verse-explorer-${selectedPreset.id}`}
                        className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF6ED] to-[#FFFDF9] border-2 border-[#bf953f]/40 shadow-sm space-y-4"
                      >
                        {/* Header Navigation: Chapter & Verse Selector, Visibility Toggles */}
                        <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-[#bf953f]/30">
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="p-1.5 rounded-lg bg-[#8c6011]/15 text-[#8c6011]">
                              <BookOpen className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8c6011] font-bold block">
                                Canonical Exegetical Explorer
                              </span>
                              <h3 className="font-serif font-bold text-sm sm:text-base text-[#2D2319]">
                                {selectedPreset.title} ({activeChap.chapterTitle || activeChap.title || ""})
                              </h3>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            {/* Chapter Selector if more than 1 chapter */}
                            {selectedPreset.chapters.length > 1 && (
                              <select
                                value={utilityChapterIndex}
                                onChange={(e) => {
                                  setUtilityChapterIndex(Number(e.target.value));
                                  setUtilityVerseIndex(0);
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-[#FAF5ED] border border-[#bf953f]/40 text-xs font-serif text-[#3d2f21] focus:outline-hidden focus:ring-1 focus:ring-[#8c6011] cursor-pointer"
                              >
                                {selectedPreset.chapters.map((ch, cIdx) => (
                                  <option key={ch.id || cIdx} value={cIdx}>
                                    {ch.chapterTitle || ch.title || `Chapter ${cIdx + 1}`}
                                  </option>
                                ))}
                              </select>
                            )}

                            {/* Verse Selector Dropdown */}
                            {totalVersesInChap > 1 && (
                              <select
                                value={utilityVerseIndex}
                                onChange={(e) => setUtilityVerseIndex(Number(e.target.value))}
                                className="px-2.5 py-1.5 rounded-lg bg-[#FAF5ED] border border-[#bf953f]/40 text-xs font-mono font-medium text-[#3d2f21] focus:outline-hidden focus:ring-1 focus:ring-[#8c6011] cursor-pointer"
                              >
                                {activeChap.verses.map((v, vIdx) => (
                                  <option key={v.id || vIdx} value={vIdx}>
                                    {v.number ? `Sūtra/Verse ${v.number}` : `Verse ${vIdx + 1}`}: {v.title || v.id}
                                  </option>
                                ))}
                              </select>
                            )}

                            {/* Previous / Next buttons */}
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={utilityVerseIndex <= 0 && utilityChapterIndex <= 0}
                                onClick={() => {
                                  if (utilityVerseIndex > 0) {
                                    setUtilityVerseIndex(utilityVerseIndex - 1);
                                  } else if (utilityChapterIndex > 0) {
                                    const prevChap = selectedPreset.chapters![utilityChapterIndex - 1];
                                    setUtilityChapterIndex(utilityChapterIndex - 1);
                                    setUtilityVerseIndex((prevChap.verses?.length || 1) - 1);
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-[#FAF5ED] hover:bg-[#FAF1E2] disabled:opacity-40 disabled:cursor-not-allowed border border-[#bf953f]/30 text-[#8c6011] transition cursor-pointer"
                                title="Previous Sūtra / Verse"
                              >
                                <ChevronLeft className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={
                                  utilityVerseIndex >= totalVersesInChap - 1 &&
                                  utilityChapterIndex >= selectedPreset.chapters!.length - 1
                                }
                                onClick={() => {
                                  if (utilityVerseIndex < totalVersesInChap - 1) {
                                    setUtilityVerseIndex(utilityVerseIndex + 1);
                                  } else if (utilityChapterIndex < selectedPreset.chapters!.length - 1) {
                                    setUtilityChapterIndex(utilityChapterIndex + 1);
                                    setUtilityVerseIndex(0);
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-[#FAF5ED] hover:bg-[#FAF1E2] disabled:opacity-40 disabled:cursor-not-allowed border border-[#bf953f]/30 text-[#8c6011] transition cursor-pointer"
                                title="Next Sūtra / Verse"
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Padaccheda Visibility Toggle */}
                            <button
                              type="button"
                              onClick={() => setUtilityShowPadaccheda((prev) => !prev)}
                              className={`inline-flex items-center gap-1 px-2 py-1.5 rounded-lg border text-xs font-mono font-medium transition cursor-pointer ${
                                utilityShowPadaccheda
                                  ? "bg-[#FAF5ED] border-[#bf953f]/50 text-[#8c6011]"
                                  : "bg-[#F5EDE1] border-[#bf953f]/30 text-[#8c6011]/60 hover:text-[#8c6011]"
                              }`}
                              title="Toggle morphological word separation (Padaccheda)"
                            >
                              {utilityShowPadaccheda ? (
                                <>
                                  <Eye className="w-3.5 h-3.5 text-[#8c6011]" />
                                  <span className="hidden sm:inline">Padaccheda</span>
                                  <span className="sm:hidden">Pada</span>
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-3.5 h-3.5 text-[#8c6011]/60" />
                                  <span className="hidden sm:inline">Padaccheda (Hidden)</span>
                                  <span className="sm:hidden">Pada (Off)</span>
                                </>
                              )}
                            </button>

                            {/* Anvaya Visibility Toggle */}
                            <button
                              type="button"
                              onClick={() => setUtilityShowAnvaya((prev) => !prev)}
                              className={`inline-flex items-center gap-1 px-2 py-1.5 rounded-lg border text-xs font-mono font-medium transition cursor-pointer ${
                                utilityShowAnvaya
                                  ? "bg-[#FAF5ED] border-[#bf953f]/50 text-[#8c6011]"
                                  : "bg-[#F5EDE1] border-[#bf953f]/30 text-[#8c6011]/60 hover:text-[#8c6011]"
                              }`}
                              title="Toggle syntactic prose order (Anvaya)"
                            >
                              {utilityShowAnvaya ? (
                                <>
                                  <Eye className="w-3.5 h-3.5 text-[#8c6011]" />
                                  <span className="hidden sm:inline">Anvaya</span>
                                  <span className="sm:hidden">Anvaya</span>
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-3.5 h-3.5 text-[#8c6011]/60" />
                                  <span className="hidden sm:inline">Anvaya (Hidden)</span>
                                  <span className="sm:hidden">Anvaya (Off)</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Mūla Verse Display */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-full bg-[#8c6011]/15 text-[#8c6011] font-mono text-xs font-bold">
                                {activeVer.number || activeVer.id}
                              </span>
                              {activeVer.title && (
                                <h4 className="font-serif font-bold text-xs sm:text-sm text-[#3d2f21]">
                                  {activeVer.title}
                                </h4>
                              )}
                            </div>

                            <div className="flex items-center gap-1">
                              {/* Audio Chant Button */}
                              <VedicChantButton
                                verseText={activeVer.mulaSanskrit}
                                variant="compact"
                                label="Chant Verse"
                              />

                              {/* Copy Verse Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    `${activeVer.mulaSanskrit}\n${activeVer.mulaIast || ""}\n\n[Translation]: ${activeVer.englishTranslation || ""}`
                                  );
                                }}
                                className="p-1.5 rounded-lg bg-[#FAF5ED] hover:bg-[#FAF1E2] border border-[#bf953f]/30 text-[#8c6011] transition cursor-pointer"
                                title="Copy verse text"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Sanskrit Mūla Text */}
                          <div
                            className={`p-4 rounded-xl bg-[#FAF5ED] border border-[#bf953f]/35 font-devanagari font-indic text-[#2D2319] leading-relaxed select-text shadow-2xs ${
                              isFocused ? "text-xl sm:text-2xl" : "text-base sm:text-lg"
                            }`}
                            style={{ fontFamily: activeLipi === "devanagari" ? "'Tiro Devanagari Sanskrit', serif" : undefined }}
                          >
                            {transliterate(activeVer.mulaSanskrit, activeLipi)}
                          </div>

                          {/* IAST Transliteration */}
                          {activeVer.mulaIast && (
                            <div className="px-1 text-xs sm:text-sm font-mono text-[#735013] italic">
                              {activeVer.mulaIast}
                            </div>
                          )}

                          {/* Padaccheda (Controllable by user toggle) */}
                          {utilityShowPadaccheda && activeVer.padaccheda && (
                            <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#bf953f]/25 space-y-1.5 animate-in fade-in duration-200">
                              <span className="font-mono font-bold text-[#8c6011] uppercase tracking-wider text-[10px] block mb-1">
                                Padaccheda (पदच्छेदः — Morphological Word Analysis):
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {activeVer.padaccheda
                                  .split(/[\s।|]+/)
                                  .filter(Boolean)
                                  .map((word, wIdx) => (
                                    <span
                                      key={wIdx}
                                      className="px-2 py-0.5 rounded-md bg-[#FFFDF9] border border-[#bf953f]/35 text-[#3d2f21] font-serif font-semibold text-xs shadow-2xs"
                                    >
                                      {transliterate(word, activeLipi)}
                                    </span>
                                  ))}
                              </div>
                            </div>
                          )}

                          {/* Anvaya (Controllable by user toggle) */}
                          {utilityShowAnvaya && activeVer.anvaya && (
                            <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#bf953f]/25 space-y-1 animate-in fade-in duration-200">
                              <span className="font-mono font-bold text-[#8c6011] uppercase tracking-wider text-[10px] block mb-0.5">
                                Anvaya (अन्वयः — Prose Syntactic Order):
                              </span>
                              <p className="font-serif text-[#4a3928] text-xs sm:text-sm leading-relaxed">
                                {transliterate(activeVer.anvaya, activeLipi)}
                              </p>
                            </div>
                          )}

                          {/* English Translation */}
                          {activeVer.englishTranslation && (
                            <div className="p-3.5 rounded-xl bg-[#FFFDF8] border border-[#bf953f]/20">
                              <span className="font-mono font-bold text-[#8c6011] uppercase tracking-wider text-[10px] block mb-1">
                                English Scholarly Translation:
                              </span>
                              <p className="font-serif text-[#2D2319] text-xs sm:text-sm leading-relaxed">
                                {activeVer.englishTranslation}
                              </p>
                            </div>
                          )}

                          {/* Dynamic Dropdown for Bhāṣyas and Ṭīkās */}
                          <div className="pt-2 border-t border-[#bf953f]/25">
                            <BhashyaTikaSelector
                              verse={activeVer}
                              granthaId={selectedPreset.id}
                              isFocused={isFocused}
                              preferredBhashyaId={selectedCommentaryOptionId || undefined}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Action Banner to Enter Reader */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-[#FAF3E6] via-[#FFFDF8] to-[#FAF3E6] border border-[#bf953f]/40 flex flex-wrap items-center justify-between gap-3 shadow-inner">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-[#8c6011] text-[#FFFDF8]">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#2D2319] font-serif">
                          Read Complete Canonical Sanskrit Edition
                        </h4>
                        <p className="text-[11px] text-[#6e5842]">
                          Includes Devanāgarī mūla, IAST transliteration, word padaccheda, classical Bhāṣya extracts, and scholarly exegesis.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          openReader(selectedPreset);
                          toggleFocusedReadingMode(true);
                        }}
                        className="px-3.5 py-2 bg-gradient-to-r from-[#d4af37] via-[#fcf6ba] to-[#c59b27] border border-[#ffe680] text-[#120e0b] font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm hover:brightness-105"
                        title="Open in Distraction-Free Focused Reading Mode"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#120e0b]" />
                        <span>Focused Reading Mode</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openReader(selectedPreset)}
                        className="px-4 py-2 bg-[#8c6011] hover:bg-[#735013] text-[#FFFDF8] font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <span>Open Text Reader</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-[#8c6011] uppercase tracking-wider mb-1 font-mono">
                        Bibliographical Synthesis
                      </h4>
                      <p className={`text-[#2D2319] font-cardo ${
                        isFocused ? "text-lg leading-loose" : "text-base leading-relaxed"
                      }`}>
                        {selectedPreset.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="bg-red-50/80 border border-red-200 p-4 rounded-xl">
                        <h5 className="text-xs font-bold text-red-900 uppercase tracking-wider mb-1 font-mono">
                          Pūrvapakṣa (Dialectical Opposition)
                        </h5>
                        <p className={`text-red-950 font-medium ${
                          isFocused ? "text-base sm:text-lg leading-[2.0]" : "text-xs leading-relaxed"
                        }`}>
                          {selectedPreset.refutationsDet}
                        </p>
                      </div>

                      <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-xl">
                        <h5 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1 font-mono">
                          Siddhānta (Philosophical Assertion)
                        </h5>
                        <p className={`text-emerald-950 font-medium ${
                          isFocused ? "text-base sm:text-lg leading-[2.0]" : "text-xs leading-relaxed"
                        }`}>
                          {selectedPreset.supportsDet}
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 bg-[#FFFDF8] border border-[#bf953f]/30 rounded-xl flex gap-2.5 items-start">
                      <HelpCircle className="w-5 h-5 text-[#8c6011] mt-0.5 shrink-0" />
                      <div>
                        <h5 className="text-xs font-bold text-[#735013] uppercase tracking-wider font-mono">
                          Mūlasūtram (Sanskrit Root Base)
                        </h5>
                        <p className={`text-[#5c4731] mt-0.5 ${
                          isFocused ? "text-base sm:text-lg leading-[2.0]" : "text-xs"
                        }`}>
                          This text rests upon or directly references standard commentaries of:{" "}
                          <strong className="text-[#8c6011] font-bold">{selectedPreset.foundationalText}</strong>.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bookmarks Drawer */}
      <BookmarksDrawer
        isOpen={isBookmarksDrawerOpen}
        onClose={() => setIsBookmarksDrawerOpen(false)}
        onSelectBookmark={handleSelectBookmarkFromCatalog}
      />
    </div>
  );
}
