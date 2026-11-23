import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";

const SCHOLAR_MESSAGES = [
  "Consulting the Prasthānatrayī source texts...",
  "Analyzing Sandhi alterations and Vyākaraṇa conventions...",
  "Retrieving classical Sampradāya commentaries (Bhāṣyas)...",
  "Synthesizing comparative ontological tables (Abheda vs. Bheda)...",
  "Checking for transcriptional visarga and anusvara corrections...",
  "Formatting precise IAST romanization and exegesis...",
  "Aggregating dialectical polemics and historical rebuttals..."
];

export default function Loader({ label }: { label?: string }) {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const term = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % SCHOLAR_MESSAGES.length);
    }, 3000);
    return () => clearInterval(term);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-[#faf8f3] border border-[#e5dfcf] rounded-lg shadow-sm">
      <div className="relative mb-4">
        <div className="w-16 h-16 border-4 border-[#bfa885] border-t-transparent rounded-full animate-spin"></div>
        <BookOpen className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#8c6a3c] w-6 h-6" />
      </div>
      <p className="font-semibold text-lg text-[#2c2419] font-serif mb-1">
        {label || "Consulting the Council..."}
      </p>
      <p className="text-xs text-[#8c7a65] font-mono italic animate-pulse max-w-md">
        {SCHOLAR_MESSAGES[msgIdx]}
      </p>
    </div>
  );
}
