import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import Loader from "./Loader";
import ReactMarkdown from "react-markdown";
import { MessageSquare, Send, Trash2, GraduationCap } from "lucide-react";
import { CitationButton } from "./CitationButton";
import { GlossaryHover } from "./GlossaryHover";

const CHAT_SUGGESTIONS = [
  "What is the difference between Jīvanmukti (liberation in life) and Videhamukti?",
  "How does Rāmānuja define the relationship between Jīva and Brahman using Śarīra-Śarīrī Bhāva?",
  "Explain Lord Kṛṣṇa's assertion in Bhagavad Gītā 15.7: 'mamaivāṁśo jīvaloke...'"
];

interface QaUtilityProps {
  initialPrompt?: string;
}

export default function QaUtility({ initialPrompt }: QaUtilityProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `### Welcome to Scholarly Counsel (Praśnavihāra)
I stand ready to assist your textual and exegetical inquiries regarding the Prasthānatrayī, grammar (Vyākaraṇa), or comparative doctrinal disputes.

*Suggested research topics:*
1. Sanskrit textual interpretation of the Upaniṣads or Brahma Sūtras.
2. Dialects of Advaita (Vivaraṇa vs. Bhāmatī) or Bhedābheda.
3. Logical discrepancies in Pūrvapakṣas.

Please enter your query below in Devanāgarī, IAST, or English.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState(initialPrompt || "");
  const [isSending, setIsSending] = useState(false);
  const endOfChatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPrompt) {
      setInputMessage(initialPrompt);
    }
  }, [initialPrompt]);


  useEffect(() => {
    endOfChatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isSending) return;

    if (!customText) {
      setInputMessage("");
    }

    const newUserMessage: ChatMessage = {
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setIsSending(true);

    try {
      const historyPayload = messages.slice(1).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const res = await fetch("/api/scholastic-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Scholarly source connection timed out.");
      }

      const data = await res.json();
      const newResponse: ChatMessage = {
        role: "assistant",
        content: data.response,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, newResponse]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `**Critical Scholastic Disruption:** Failed to sync with model sources. Reason: ${err.message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        role: "assistant",
        content: "Dialogue archives successfully cleared. Let us initiate our scholastic study anew.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  return (
    <div className="space-y-6 flex flex-col h-[680px] card-3d-gold overflow-hidden">
      {/* Utility Header */}
      <div className="bg-[#FFFDF8] border-b border-[#bf953f]/30 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <GraduationCap className="text-[#8c6011] w-5 h-5" />
          <div>
            <h3 className="font-serif font-bold text-sm sm:text-base gold-text-gradient">
              Scholastic Dialogue Chamber (Praśnavihāra)
            </h3>
            <p className="text-xs text-[#5c4731]">
              Objective, citation-driven analysis aligned with primary commentaries
            </p>
          </div>
        </div>

        <button
          onClick={handleClearHistory}
          type="button"
          className="text-xs text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer font-medium"
          title="Clear conversational memory"
        >
          <Trash2 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Reset Dialogue</span>
        </button>
      </div>

      {/* Suggestion tags */}
      <div className="px-5 pt-3 bg-gradient-to-r from-[#FAF5EC] via-[#FFFDF8] to-[#FAF5EC] border-b border-[#bf953f]/20">
        <span className="text-[10px] font-bold text-[#8c6011] tracking-wider uppercase block mb-1.5 font-mono">
          Select scholarly inquiry:
        </span>
        <div className="flex flex-col sm:flex-row gap-2 pb-3 overflow-x-auto">
          {CHAT_SUGGESTIONS.map((sug, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(sug)}
              className="text-left text-xs bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF5] to-[#FFF8E7] border border-[#C59B27]/40 text-[#3D2C1D] hover:border-[#C59B27] hover:shadow-xs px-3.5 py-2 rounded-xl transition cursor-pointer font-serif truncate max-w-full sm:max-w-xs shadow-2xs font-semibold"
              disabled={isSending}
            >
              {sug}
            </button>
          ))}
        </div>
      </div>

      {/* Message bubble stream */}
      <div className="flex-1 overflow-y-auto p-5 bg-[#FAF5ED] space-y-4">
        {messages.map((msg, index) => {
          const isUser = msg.role === "user";
          return (
            <div key={index} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[88%] rounded-2xl p-5 border text-sm shadow-sm relative ${
                  isUser
                    ? "bg-gradient-to-r from-[#d4af37] via-[#fcf6ba] to-[#c59b27] border-[#ffe680] text-[#120e0b] rounded-br-xs font-semibold shadow-md"
                    : "bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF8] to-[#FFF9EE] border border-[#bf953f]/35 text-[#2D2319] rounded-bl-xs"
                }`}
              >
                {/* Meta details */}
                <div
                  className={`text-[10px] font-mono mb-2 flex items-center justify-between gap-2 border-b pb-1.5 ${
                    isUser ? "text-[#261c10] border-[#120e0b]/20" : "text-[#8c6011] border-[#bf953f]/20"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold uppercase tracking-wider">
                      {isUser ? "SCHOLAR SEEKER" : "VEDĀNTA COUNSEL"}
                    </span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {!isUser && (
                    <CitationButton
                      moduleName="Scholarly Counsel"
                      analysisContent={msg.content}
                    />
                  )}
                </div>

                {/* Message body */}
                <div className={`markdown-body ${isUser ? "text-[#120e0b] !color-[#120e0b]" : ""}`}>
                  {isUser ? (
                    <div className="font-serif text-base whitespace-pre-wrap text-[#120e0b]">{msg.content}</div>
                  ) : (
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex justify-start">
            <div className="bg-[#FFFDF8] border border-[#bf953f]/40 rounded-xl p-4 text-xs italic text-[#735013] flex items-center gap-2 shadow-sm font-medium">
              <span className="w-2.5 h-2.5 bg-[#d4af37] rounded-full animate-ping"></span>
              Consulting the Śāstra indexes & Bhāṣyas...
            </div>
          </div>
        )}
        <div ref={endOfChatRef} />
      </div>

      {/* Input bar */}
      <div className="bg-[#FFFDF8] p-4 border-t border-[#bf953f]/30">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            className="flex-1 p-3 border border-[#bf953f]/40 rounded-xl bg-[#FFFDF9] text-[#2D2319] placeholder-[#9c8266] focus:outline-none focus:ring-2 focus:ring-[#bf953f]/50 text-sm"
            placeholder="Pose your query (e.g., Explain the Śāstra-Yoni-Tvāt Brahma sūtra)..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isSending}
          />

          <button
            type="submit"
            disabled={isSending || !inputMessage.trim()}
            className="btn-3d-gold px-5 py-3 rounded-xl flex items-center gap-2 text-xs font-bold uppercase tracking-wider shrink-0 cursor-pointer disabled:opacity-40"
          >
            <Send className="w-4 h-4 text-[#120e0b]" /> Send
          </button>
        </form>
      </div>
    </div>
  );
}
