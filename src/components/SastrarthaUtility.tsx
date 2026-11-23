import React, { useState, useRef, useEffect } from "react";
import { 
  Sparkles, 
  Send, 
  RefreshCw, 
  BookOpen, 
  Layers, 
  MessageSquare, 
  CheckSquare, 
  Square, 
  Share2, 
  Download, 
  FileText, 
  Flame, 
  Scale, 
  Users, 
  HelpCircle, 
  Copy, 
  Check, 
  AlertCircle,
  ShieldCheck,
  Zap,
  Feather
} from "lucide-react";
import Markdown from "react-markdown";
import { jsPDF } from "jspdf";
import { ParamparaId } from "../types";

interface SastrarthaMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  topic?: string;
  schools?: string[];
  timestamp: string;
}

interface SastrarthaUtilityProps {
  initialTopic?: string;
  initialTradition?: ParamparaId;
  onOpenGrantha?: (granthaId: string) => void;
}

const PRESET_TOPICS = [
  {
    title: "Vivarta vs Pariṇāma vs Parāśakti-Vilāsa (Cosmic Reality Model)",
    query: "Is the manifest universe (Jagat) an apparent illusory superimposition (Vivartavāda of Śaṅkara), a real transformation of Brahman (Brahma-Pariṇāmavāda of Vallabha/Bhāskara), or the conscious, luminous vibrational unfolding of Parā-Śakti (Śāktaviśiṣṭādvaita of MM Pañcānana Tarkaratna)?",
    category: "Metaphysics & Cosmology"
  },
  {
    title: "Tat Tvam Asi: Abheda vs Śarīra-Śarīrī vs Bheda",
    query: "How do the different traditions interpret the Mahāvākya 'Tat Tvam Asi' (Chāndogya 6.8.7)? Compare Śaṅkara's Akhaṇḍārtha (absolute identity), Rāmānuja's Sāmānādhikaraṇya / Śarīra-Śarīrī-bhāva (qualified non-duality), Madhva's Atattvamasi / eternal distinction, and Pañcānana Tarkaratna's Śakti-Śaktimad-Abheda.",
    category: "Upaniṣadic Hermeneutics"
  },
  {
    title: "MM Pañcānana Tarkaratna's Śāktabhāṣya & Tantra-Vedānta Harmony",
    query: "How does Mahāmahopādhyāya Pañcānana Bhaṭṭācārya Tarkaratna in his Brahmasūtra-Śāktabhāṣyam prove that the Brahma Sūtras uphold Parā-Śakti as the supreme cause, and how does this resolve the tension between Nirguṇa Kevalādvaita and devotional Tantra-Āgama?",
    category: "Śāktaviśiṣṭādvaita & Bengal Darśana"
  },
  {
    title: "Advaitasiddhi vs Nyāyāmṛta (The Mithyātva-Nirukti Polemic)",
    query: "Examine the great dialectical debate between Vyāsatīrtha (Dvaita) and Madhusūdana Sarasvatī (Advaita) on the definition of Mithyātva (unreality/falsity) and the ontological status of perceptual knowledge (Pratyakṣa).",
    category: "Navya-Nyāya Dialectics"
  },
  {
    title: "Direct Means to Mokṣa: Nirvikalpa Jñāna vs Bhakti / Prapatti vs Śaktipāta",
    query: "What is the immediate, unmediated instrument of liberation (Mokṣa-Sādhana)? Is it Jñāna alone (Śaṅkara), Prapatti / Śaraṇāgati (Rāmānuja), Viṣṇu-Prasāda through Bhakti (Madhva), Puṣṭi-Mārga (Vallabha), or Jñāna consecrated by Divine Mother's Grace / Śaktipāta (Pañcānana Tarkaratna)?",
    category: "Soteriology & Sādhana"
  },
  {
    title: "Classical Non-Dualism vs Navyānubhava Vedānta (Vivekananda & Sri Aurobindo)",
    query: "How does Swami Vivekananda's 'Practical Vedānta' (seeing Jīva as Śiva) and Sri Aurobindo's 'Pūrṇa Vedānta' (evolutionary divinization of matter) develop or depart from classical Śaṅkara Advaita?",
    category: "Modern & Navyānubhava Vedānta"
  }
];

const AVAILABLE_SCHOOLS = [
  { id: "advaita", name: "Advaita Kevalādvaita", acharya: "Ādi Śaṅkara / Madhusūdana", color: "border-amber-400 bg-amber-50 text-amber-900" },
  { id: "visistadvaita", name: "Viśiṣṭādvaita", acharya: "Śrī Rāmānuja / Vedānta Deśika", color: "border-blue-400 bg-blue-50 text-blue-900" },
  { id: "dvaita", name: "Dvaita (Tattvavāda)", acharya: "Śrī Madhvācārya / Jayatīrtha", color: "border-orange-400 bg-orange-50 text-orange-900" },
  { id: "saktavisistadvaita", name: "Śāktaviśiṣṭādvaita", acharya: "MM Pañcānana Tarkaratna", color: "border-rose-400 bg-rose-50 text-rose-900" },
  { id: "acintya", name: "Acintya Bhedābheda", acharya: "Baladeva Vidyābhūṣaṇa / Jīva Gosvāmī", color: "border-purple-400 bg-purple-50 text-purple-900" },
  { id: "suddhadvaita", name: "Śuddhādvaita", acharya: "Śrī Vallabhācārya", color: "border-yellow-400 bg-yellow-50 text-yellow-900" },
  { id: "dvaitadvaita", name: "Dvaitādvaita", acharya: "Śrī Nimbārkācārya", color: "border-emerald-400 bg-emerald-50 text-emerald-900" },
  { id: "neo_vedanta", name: "Navyānubhava Vedānta & Pūrṇādvaita", acharya: "Sri Ramakrishna / Vivekananda / Aurobindo", color: "border-teal-400 bg-teal-50 text-teal-900" }
];

export const SastrarthaUtility: React.FC<SastrarthaUtilityProps> = ({
  initialTopic,
  initialTradition,
  onOpenGrantha
}) => {
  const [topicInput, setTopicInput] = useState<string>(initialTopic || "");
  const [selectedSchools, setSelectedSchools] = useState<string[]>([
    "Advaita Kevalādvaita",
    "Viśiṣṭādvaita",
    "Dvaita (Tattvavāda)",
    "Śāktaviśiṣṭādvaita",
    "Acintya Bhedābheda",
    "Navyānubhava Vedānta & Pūrṇādvaita"
  ]);
  const [debateFormat, setDebateFormat] = useState<"structured_debate" | "cross_examination" | "dialogue">("structured_debate");
  const [messages, setMessages] = useState<SastrarthaMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activePresetCategory, setActivePresetCategory] = useState<string>("All");

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialTopic && messages.length === 0) {
      handleInitiateSastrartha(initialTopic);
    }
  }, [initialTopic]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const toggleSchool = (schoolName: string) => {
    if (selectedSchools.includes(schoolName)) {
      if (selectedSchools.length > 2) {
        setSelectedSchools(selectedSchools.filter(s => s !== schoolName));
      }
    } else {
      setSelectedSchools([...selectedSchools, schoolName]);
    }
  };

  const handleInitiateSastrartha = async (customQuery?: string) => {
    const activeQuery = (customQuery || topicInput).trim();
    if (!activeQuery) return;

    const userMessage: SastrarthaMessage = {
      id: "msg-" + Date.now(),
      role: "user",
      content: activeQuery,
      topic: activeQuery,
      schools: [...selectedSchools],
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, userMessage]);
    setTopicInput("");
    setIsLoading(true);

    try {
      // Build history for API
      const apiHistory = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch("/api/sastrartha-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: activeQuery,
          selectedSchools,
          format: debateFormat,
          history: apiHistory
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned error ${res.status}`);
      }

      const data = await res.json();
      const assistantMessage: SastrarthaMessage = {
        id: "msg-" + (Date.now() + 1),
        role: "assistant",
        content: data.result || "No response received from the Śāstrārtha assembly.",
        schools: [...selectedSchools],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error("Failed to fetch shastrartha debate:", err);
      const errorMessage: SastrarthaMessage = {
        id: "msg-err-" + Date.now(),
        role: "assistant",
        content: `**Śāstrārtha Interruption:** Failed to assemble the philosophical debate due to network or service error. (${err.message}). Please verify your connection or try with a more focused sūtra query.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportPDF = () => {
    if (messages.length === 0) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(120, 53, 15);
    doc.text("vedāntatattvaṁ — Śāstrārtha Vimarśa Record", 14, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text(`Generated: ${new Date().toLocaleString()} | Format: ${debateFormat}`, 14, yPos);
    yPos += 6;
    doc.text(`Participating Traditions: ${selectedSchools.join(", ")}`, 14, yPos);
    yPos += 10;
    doc.line(14, yPos, pageWidth - 14, yPos);
    yPos += 10;

    messages.forEach((m, idx) => {
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      if (m.role === "user") {
        doc.setTextColor(30, 41, 59);
        doc.text(`Topic / Query: ${m.content}`, 14, yPos);
        yPos += 8;
      } else {
        doc.setTextColor(180, 83, 9);
        doc.text(`Sabhāpati & Ācāryas Deliberation (${m.timestamp}):`, 14, yPos);
        yPos += 8;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(40, 40, 40);

        // Strip basic markdown hashes for clean text output
        const cleanContent = m.content.replace(/#{1,6}\s?/g, "").replace(/\*\*/g, "");
        const splitText = doc.splitTextToSize(cleanContent, pageWidth - 28);
        
        splitText.forEach((line: string) => {
          if (yPos > 275) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(line, 14, yPos);
          yPos += 5;
        });

        yPos += 8;
      }
    });

    doc.save("vedantatattvam-sastrartha-dialogue.pdf");
  };

  const handleClearSession = () => {
    setMessages([]);
  };

  const presetCategories = ["All", "Metaphysics & Cosmology", "Upaniṣadic Hermeneutics", "Śāktaviśiṣṭādvaita & Bengal Darśana", "Navya-Nyāya Dialectics", "Soteriology & Sādhana", "Modern & Navyānubhava Vedānta"];

  const filteredPresets = activePresetCategory === "All"
    ? PRESET_TOPICS
    : PRESET_TOPICS.filter(p => p.category === activePresetCategory);

  return (
    <div id="sastrartha-utility-container" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#FFFDF9] via-[#FAF5EC] to-[#F5EADB] rounded-2xl p-6 sm:p-8 text-[#2D2319] shadow-sm border border-[#bf953f]/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#f3d999]/20 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF1E2] border border-[#bf953f]/40 text-[#8c6011] text-xs font-semibold uppercase tracking-wider shadow-xs">
              <Scale className="w-3.5 h-3.5 text-[#8c6011]" />
              <span>Śāstrārtha Mahāmaṇḍapam • Cross-Sampradāya AI Dialogue</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold gold-text-gradient tracking-wide">
              Cross-Sampradāya Philosophical Dialogue & Debate
            </h2>
            <p className="text-[#5c4731] text-sm sm:text-base leading-relaxed font-serif">
              Step into the classical assembly of debate (*शास्त्रार्थः*). Stage cross-referential intellectual dialogues between Ādi Śaṅkara, Śrī Rāmānuja, Śrī Madhva, MM Pañcānana Tarkaratna's Śāktaviśiṣṭādvaita, Baladeva Vidyābhūṣaṇa, and modern thinkers with authentic Sanskrit Pramāṇas and Pūrvapakṣa-Siddhānta dialectics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-[#FAF2E3] p-3 sm:p-4 rounded-xl border border-[#bf953f]/35 self-start md:self-auto shrink-0 text-xs text-[#735013] shadow-xs">
            <div className="flex items-center gap-1.5 font-bold">
              <Users className="w-4 h-4 text-[#8c6011]" />
              <span>8 Represented Darśanas</span>
            </div>
            <div className="h-4 w-px bg-[#bf953f]/30"></div>
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-[#8c6011]" />
              <span>Pramāṇa & Yukti Grounded</span>
            </div>
          </div>
        </div>
      </div>

      {/* Assembly Setup & Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Participating Schools & Format Selection */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2 text-stone-900 font-serif font-bold text-base">
                <Users className="w-4 h-4 text-amber-700" />
                <span>Participating Traditions</span>
              </div>
              <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                {selectedSchools.length} Selected
              </span>
            </div>

            <p className="text-xs text-stone-500">
              Select which Ācāryas and schools take the floor during the debate:
            </p>

            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {AVAILABLE_SCHOOLS.map(school => {
                const isSelected = selectedSchools.includes(school.name);
                return (
                  <button
                    key={school.id}
                    onClick={() => toggleSchool(school.name)}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? `${school.color} shadow-2xs`
                        : "border-stone-200 bg-stone-50/60 text-stone-500 hover:bg-stone-100"
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-amber-700" />
                      ) : (
                        <Square className="w-4 h-4 text-stone-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold truncate">{school.name}</div>
                      <div className="text-[11px] opacity-80 truncate">{school.acharya}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Debate Format Mode */}
            <div className="pt-3 border-t border-stone-100 space-y-2">
              <label className="text-xs font-bold text-[#8c6011] font-mono block">
                Debate Moderation Format:
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                <button
                  onClick={() => setDebateFormat("structured_debate")}
                  className={`px-3 py-2 rounded-xl text-xs font-serif font-bold text-left border flex items-center justify-between transition-all cursor-pointer ${
                    debateFormat === "structured_debate"
                      ? "bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border-2 border-[#C59B27] ring-1 ring-[#E2B755]/60 shadow-xs"
                      : "bg-[#FFFDF9] text-[#5c4731] border-[#bf953f]/30 hover:bg-[#FAF3E4]"
                  }`}
                >
                  <span>1. Full Śāstrārtha Sabha (Round-Robin & Synthesis)</span>
                  <Scale className="w-3.5 h-3.5 shrink-0 opacity-80" />
                </button>
                <button
                  onClick={() => setDebateFormat("cross_examination")}
                  className={`px-3 py-2 rounded-xl text-xs font-serif font-bold text-left border flex items-center justify-between transition-all cursor-pointer ${
                    debateFormat === "cross_examination"
                      ? "bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border-2 border-[#C59B27] ring-1 ring-[#E2B755]/60 shadow-xs"
                      : "bg-[#FFFDF9] text-[#5c4731] border-[#bf953f]/30 hover:bg-[#FAF3E4]"
                  }`}
                >
                  <span>2. Cross-Examination (Ācārya vs Ācārya Rebuttals)</span>
                  <Flame className="w-3.5 h-3.5 shrink-0 opacity-80" />
                </button>
                <button
                  onClick={() => setDebateFormat("dialogue")}
                  className={`px-3 py-2 rounded-xl text-xs font-serif font-bold text-left border flex items-center justify-between transition-all cursor-pointer ${
                    debateFormat === "dialogue"
                      ? "bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border-2 border-[#C59B27] ring-1 ring-[#E2B755]/60 shadow-xs"
                      : "bg-[#FFFDF9] text-[#5c4731] border-[#bf953f]/30 hover:bg-[#FAF3E4]"
                  }`}
                >
                  <span>3. Interactive Scholarly Dialogue (Direct Q&A)</span>
                  <MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-80" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Active Dialogue Stage & Input */}
        <div className="lg:col-span-2 space-y-4 flex flex-col">
          {/* Main Active Assembly Viewport */}
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-5 flex-1 flex flex-col min-h-[460px] max-h-[620px] overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                  Sabhā Mandapam Viewport
                </span>
              </div>
              <div className="flex items-center gap-2">
                {messages.length > 0 && (
                  <>
                    <button
                      onClick={handleExportPDF}
                      className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md text-xs font-medium flex items-center gap-1 transition-colors"
                      title="Export dialogue to PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>
                    <button
                      onClick={handleClearSession}
                      className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md text-xs font-medium transition-colors"
                      title="Clear session"
                    >
                      Reset
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                    <Scale className="w-6 h-6" />
                  </div>
                  <div className="space-y-1 max-w-md">
                    <h3 className="text-base font-serif font-bold text-stone-800">
                      The Śāstrārtha Assembly Awaits Your Query
                    </h3>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      Select a canonical topic below, or formulate your own philosophical inquiry or sūtra dilemma to inaugurate the debate.
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.role === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-[92%] sm:max-w-[85%] rounded-xl p-4 text-xs sm:text-sm leading-relaxed space-y-2 ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-[#d4af37] to-[#c59b27] text-[#120e0b] font-serif font-bold rounded-br-2xs shadow-xs"
                          : "bg-[#FFFDF8] border border-[#bf953f]/35 text-[#2D2319] rounded-bl-2xs shadow-2xs"
                      }`}
                    >
                      {msg.role === "assistant" && (
                        <div className="flex items-center justify-between pb-2 border-b border-amber-200/60 mb-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 font-serif">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            <span>Sabhāpati & Ācārya Deliberation</span>
                          </div>
                          <button
                            onClick={() => handleCopyText(msg.id, msg.content)}
                            className="text-stone-400 hover:text-stone-700 transition-colors p-1"
                            title="Copy response"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      )}

                      <div className={`prose prose-xs max-w-none ${msg.role === "user" ? "prose-invert" : "text-stone-800"}`}>
                        <div className="markdown-body">
                          <Markdown>{msg.content}</Markdown>
                        </div>
                      </div>

                      <div
                        className={`text-[10px] text-right pt-1 opacity-70 ${
                          msg.role === "user" ? "text-stone-300" : "text-stone-500"
                        }`}
                      >
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                ))
              )}

              {isLoading && (
                <div className="flex items-start gap-3 bg-amber-50/70 border border-amber-200 rounded-xl p-4 max-w-[85%] animate-pulse">
                  <RefreshCw className="w-4 h-4 text-amber-600 animate-spin mt-0.5" />
                  <div className="space-y-1.5 flex-1">
                    <div className="text-xs font-bold text-amber-900 font-serif">
                      The Sabhāpati is assembling the Ācāryas & Pramāṇa sources...
                    </div>
                    <div className="h-2 bg-amber-200/60 rounded w-5/6"></div>
                    <div className="h-2 bg-amber-200/40 rounded w-4/6"></div>
                  </div>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Input Bar */}
            <div className="pt-3 border-t border-stone-100 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleInitiateSastrartha();
                }}
                className="flex items-center gap-2"
              >
                <input
                  id="sastrartha-topic-input"
                  type="text"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  placeholder="Pose a philosophical challenge, sūtra, or dispute (e.g. Is Jagat Vivarta or Parāśakti-Vilāsa?)..."
                  className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !topicInput.trim()}
                  className="px-4 py-2.5 bg-amber-800 hover:bg-amber-900 disabled:opacity-50 text-white rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <span>Debate</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Canonical Vedantic Disputes */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-600" />
            <h3 className="text-base font-serif font-bold text-stone-900">
              Canonical Vedantic Controversies & Vādas (शास्त्रार्थ-विषयाः)
            </h3>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {presetCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActivePresetCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-serif font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activePresetCategory === cat
                    ? "bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] text-[#7A3E00] border-2 border-[#C59B27] ring-1 ring-[#E2B755]/60 shadow-xs"
                    : "bg-[#FFFDF9] text-[#6e5842] border border-[#bf953f]/30 hover:bg-[#FAF3E4]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredPresets.map((preset, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-[#C59B27]/30 hover:border-[#C59B27] bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF8] to-[#FAF4E8] hover:shadow-xs transition-all flex flex-col justify-between gap-3 group shadow-2xs"
            >
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-[#8c6011] uppercase tracking-wider font-mono">
                  {preset.category}
                </div>
                <h4 className="text-xs sm:text-sm font-serif font-bold text-[#2D2319] group-hover:text-[#7A3E00] transition-colors">
                  {preset.title}
                </h4>
                <p className="text-xs text-[#5c4731] line-clamp-3 leading-relaxed font-serif">
                  {preset.query}
                </p>
              </div>

              <button
                onClick={() => handleInitiateSastrartha(preset.query)}
                className="w-full py-2 px-3 bg-gradient-to-r from-[#d4af37] via-[#fcf6ba] to-[#c59b27] hover:brightness-105 text-[#120e0b] border border-[#ffe680] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-[#120e0b]" />
                <span>Launch This Śāstrārtha</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
