import express from "express";
import type { Request, Response } from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

dotenv.config();

const GEMINI_MODEL = "gemini-2.5-flash";

let aiClient: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required but not set in prompt or environment secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

const app = express();
const PORT = 3000;

app.use(express.json());

// API: Health Check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", service: "vedantatattvam", timestamp: new Date().toISOString() });
});

// API: OCR Correction & Textual Curation
app.post("/api/ocr-correct", async (req: Request, res: Response) => {
  try {
    const { rawText } = req.body;
    if (!rawText) {
      res.status(400).json({ error: "rawText is required" });
      return;
    }

    const ai = getAI();
    const prompt = `
You are an expert Sanskrit manuscript preservation scholar and expert in Sanskrit grammar (Vyākaraṇa) and Vedānta.
Review the following raw OCR-generated Sanskrit text, which might contain transcription errors, missing visargas/anusvaras, word-joining/splitting (Sandhi) issues, or digitized formatting artifacts.

Perform the following:
1. Provide the corrected Devanagari text.
2. Provide the standard, precise academic IAST romanization.
3. Detail each adjustment made (e.g., corrected from X to Y, added missing visarga, fixed spelling) in brackets/bullets.
4. Flag any uncertain corrections or alternative readings (pāṭhāntara) in brackets.

Format the output precisely:
- Avoid conversational filler.
- Be objective and scholarly.
- Structure it with clear markdown headings:
  - ### Corrected Text (Devanagari)
  - ### Transliteration (IAST)
  - ### Critical Correction Notes

Here is the raw OCR text:
"${rawText}"
`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });

    res.json({ result: response.text });
  } catch (err: any) {
    console.error("OCR API error:", err);
    res.status(500).json({ error: err.message || "Failed to process OCR correction." });
  }
});

// API: Precision Translation & Ontological Exegesis
app.post("/api/translate", async (req: Request, res: Response) => {
  try {
    const { text, context } = req.body;
    if (!text) {
      res.status(400).json({ error: "Sanskrit text is required" });
      return;
    }

    const ai = getAI();
    const prompt = `
You are a deeply learned, non-sectarian scholar of Vedānta Philosophy.
Translate the following complex Vedantic Sanskrit text (Upaniṣadic verse, sūtra, or commentarial Bhāṣya) into rigorous academic English.
Optional user context or specific text reference: "${context || "None provided"}"

Guidelines:
1. Use scholarly English with strict metaphysical precision.
2. Do not dilute core metaphysical concepts with loose Western religious equivalents (e.g. avoid using "Soul" for Ātman, "God" for Brahman, or "Hell" for Naśvara worlds, unless strictly defining them in an ontological context).
3. Identify and generate an "Ontological Vocabulary Glossary" of key Sanskrit technical terms used in the text. Provide their standard IAST transliteration, followed by a brief precise definition (e.g., Brahman, Jīva, Jagat, Māyā, Mokṣa, etc.).
4. Format the output with:
   - ### Devanagari & IAST Transliteration
   - ### Precision Academic English Translation
   - ### Ontological Vocabulary Glossary
   - ### Exegetical Commentary (academic philosophy summary)

Here is the Sanskrit text to translate:
"${text}"
`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });

    res.json({ result: response.text });
  } catch (err: any) {
    console.error("Translation API error:", err);
    res.status(500).json({ error: err.message || "Failed to finalize the translation." });
  }
});

// API: Comparative Analysis (Sampradāya Vimarśa)
app.post("/api/comparative-analysis", async (req: Request, res: Response) => {
  try {
    const { verseOrSutra, selectedSchools } = req.body;
    if (!verseOrSutra) {
      res.status(400).json({ error: "verseOrSutra is required" });
      return;
    }

    const schoolsList = selectedSchools && selectedSchools.length > 0 
      ? selectedSchools.join(", ") 
      : "Advaita (Śaṅkara), Viśiṣṭādvaita (Rāmānuja), and Dvaita (Madhva)";

    const ai = getAI();
    const prompt = `
You are an expert in comparative Vedantic hermeneutics (Sampradāya Vimarśa).
Analyze the following Vedantic text (verse, sūtra, or concept) across the specified schools of Vedānta: ${schoolsList}.

Guidelines:
1. Objectively map out how different Ācāryas interpret the text or concept. Maintain strict non-sectarian neutrality.
2. Structure the foundational logic each school uses to support its interpretation (e.g. Abheda vs. Bheda vs. Bhedābheda).
3. Include a Markdown table summarizing how each of these schools defines the main ontological categories in this text (e.g. Jīva, Jagat, and Brahman, or similar).
4. Outline your response in clean markdown:
   - ### Overview of the Text
   - ### School-by-School Hermeneutical Interpretations
   - ### Comparative Ontological Mapping (Include the markdown table)
   - ### Philosophical Dialectic Synthesis (Who is refuting who, key points of contention)

Text/Verse/Concept to analyze:
"${verseOrSutra}"
`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });

    res.json({ result: response.text });
  } catch (err: any) {
    console.error("Comparative API error:", err);
    res.status(500).json({ error: err.message || "Failed to generate comparative analysis." });
  }
});

// API: Scholastic Academic Q&A (Deep Scholar Chat)
app.post("/api/scholastic-chat", async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      res.status(400).json({ error: "message is required" });
      return;
    }

    const ai = getAI();
    
    // Construct system instructions and feed conversational history
    // Since we want standard response generation with history, let's assemble it carefully.
    const systemInstruction = `
You are the primary intelligence of the vedāntatattvaṁ platform (vedantatattvam.com), a deeply learned, non-sectarian academic scholar and guide of Vedānta Philosophy.
Your expertise spans the Prasthānatrayī (Upaniṣads, Brahma Sūtras, Bhagavad Gītā) and the diverse commentarial traditions (Bhāṣyas) of all major schools, including:
- Advaita (Śaṅkara)
- Viśiṣṭādvaita (Rāmānuja)
- Dvaita (Madhva)
- Śuddhādvaita (Vallabha)
- Acintya Bhedābheda (Caitanya / Baladeva Vidyābhūṣaṇa)

Rules for output:
1. Be scholarly, precise, reverent, objective, and non-sectarian.
2. Quote source material in Devanagari first, then standard IAST romanization, then English translation.
3. Structure responses with highly readable Markdown (bold headings, bullet points, block quotes).
4. Avoid any colloquialisms, fluff, or conversational filler. Enter directly into intellectual exposition.
`;

    const chatHistory = history || [];
    
    // Format the prompt containing history and system instructions
    let formattedPrompt = `${systemInstruction}\n\n`;
    formattedPrompt += `Conversation history so far:\n`;
    for (const turn of chatHistory) {
      formattedPrompt += `${turn.role === "user" ? "Scholar/Seeker User" : "Vedānta Expert"}: ${turn.content}\n`;
    }
    formattedPrompt += `Scholar/Seeker User's Current Query: ${message}\n`;
    formattedPrompt += `Vedānta Expert Prompted Scholar Response:`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: formattedPrompt,
    });

    res.json({ response: response.text });
  } catch (err: any) {
    console.error("Scholastic chat API error:", err);
    res.status(500).json({ error: err.message || "Failed to proceed with scholastic Q&A." });
  }
});

// API: Cross-Sampradaya AI Shastrartha Chatbot & Dialectical Arena
app.post("/api/sastrartha-chat", async (req: Request, res: Response) => {
  try {
    const { topic, selectedSchools, format = "structured_debate", message, history = [] } = req.body;
    
    if (!topic && !message) {
      res.status(400).json({ error: "Topic or message is required for Shastrartha dialogue." });
      return;
    }

    const ai = getAI();
    const schoolsStr = (selectedSchools && selectedSchools.length > 0) 
      ? selectedSchools.join(", ") 
      : "Advaita (Śaṅkara), Viśiṣṭādvaita (Rāmānuja), Dvaita (Madhva), Śāktaviśiṣṭādvaita (Pañcānana Tarkaratna), Acintya Bhedābheda (Baladeva Vidyābhūṣaṇa), Neo-Vedānta (Vivekananda)";

    const systemInstruction = `
You are the venerable **Sabhāpati (सभापतिः / Impartial Moderator & Arbiter)** and Multi-Perspective Scholarly Intelligence of the **Śāstrārtha Mahāmaṇḍapam (शास्त्रार्थ-महामण्डपम्)** at vedāntatattvaṁ.
Your purpose is to stage authentic, deep, respectful, and razor-sharp cross-referential philosophical debates (*Śāstrārtha-Vimarsa*) among the major Vedānta traditions on any chosen metaphysical inquiry, Upaniṣadic sūtra, or dispute.

Participating traditions to actively represent based on the user's selection:
- **Advaita Kevalādvaita** (Ādi Śaṅkara, Sureśvara, Madhusūdana Sarasvatī) — Vivartavāda, Nirguṇa Brahman, Anirvacanīya Māyā, Jñāna as sole direct cause of Mokṣa.
- **Viśiṣṭādvaita** (Śrī Rāmānuja, Vedānta Deśika) — Śarīra-Śarīrī-Bhāva, Saguṇa Brahman (Nārāyaṇa), Aprthaksiddha-Viśeṣaṇa, Prapatti/Bhakti as supreme.
- **Dvaita Tattvavāda** (Śrī Madhvācārya, Jayatīrtha, Vyāsatīrtha) — Pañcabheda, Svatantra Viṣṇu vs Paratantra Jīva/Jagat, Bhedavāda.
- **Śuddhādvaita** (Śrī Vallabhācārya) — Pure Non-Dualism devoid of Māyā, Avikṛta Pariṇāma, Puṣṭi Bhakti.
- **Dvaitādvaita** (Śrī Nimbārka) — Svābhāvika Bhedābheda, Rādhā-Kṛṣṇa Yugala Svarūpa.
- **Acintya Bhedābheda** (Śrī Caitanya, Jīva Gosvāmī, Baladeva Vidyābhūṣaṇa) — Inconceivable simultaneous oneness and difference of Śakti and Śaktimān (Govinda Bhāṣya).
- **Śāktaviśiṣṭādvaita** (Mahāmahopādhyāya Pañcānana Bhaṭṭācārya Tarkaratna) — Śaktiviśiṣṭa-Brahma-Vāda, Brahmasūtra-Śāktabhāṣyam, Parāśakti as dynamic conscious non-different nature of Brahman, Parāśakti-Pariṇāma & Spanda, Divine Mother's grace.
- **Neo-Vedānta & Pūrṇādvaita** (Sri Ramakrishna, Swami Vivekananda, Sri Aurobindo) — Vijñāna Vedānta, Practical Vedānta (Jīva as Śiva), Evolutionary Divinization of Matter.

Required Output Structure:
1. **Pratijñā & Viṣaya-Vākya (प्रतिज्ञा विषयवाक्यं च)**: Statement of the dispute with relevant canonical Sanskrit citation in Devanāgarī and IAST.
2. **Pūrvapakṣa & Siddhānta Round-Robin (पक्ष-प्रतिपक्ष-विमर्शः)**:
   For EACH selected school:
   - **School Title & Ācārya Voice**: Clear icon and title.
   - **Core Position (Siddhānta)**: Precise ontological & epistemological stance.
   - **Pramāṇa (Scriptural & Logical Proof)**: Key Upaniṣad/Brahma-Sūtra verse with Devanagari, IAST, and translation.
   - **Rebuttal of Opposing Schools (Khaṇḍana-Yukti)**: How this tradition refutes the rival doctrines (e.g. Advaita refuting Pariṇāma, Śāktaviśiṣṭādvaita refuting Vivarta's world-negation, Dvaita refuting Abheda, etc.).
3. **Sabhāpati-Samanvaya & Madhyastha-Nirṇaya (सभापति-समन्वयः)**:
   - Objective synthesis highlighting points of consensus, core divergences of methodology, and practical spiritual application for modern seekers.

Style Guidelines:
- Classical, rigorous Sanskrit terminology (Devanagari, IAST, and clean English).
- High intellectual caliber without sectarian bias.
- Beautiful, formatted Markdown with blockquotes, bold headings, and bullet points.
`;

    let formattedPrompt = `${systemInstruction}\n\n`;
    formattedPrompt += `Active Shastrartha Topic / Query: "${topic || message}"\n`;
    formattedPrompt += `Participating Vedānta Traditions: ${schoolsStr}\n`;
    formattedPrompt += `Dialogue Format: ${format}\n\n`;

    if (history && history.length > 0) {
      formattedPrompt += `Previous Dialogue Turns:\n`;
      for (const turn of history) {
        formattedPrompt += `${turn.role === "user" ? "Participant Scholar" : "Sabhāpati & Ācāryas"}: ${turn.content}\n`;
      }
      formattedPrompt += `\nParticipant Scholar's Follow-up Inquiry / Challenge: "${message || topic}"\n`;
    }

    formattedPrompt += `\nCommence the Śāstrārtha Sabha exposition now:`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: formattedPrompt,
    });

    res.json({ result: response.text });
  } catch (err: any) {
    console.error("Sastrartha chat API error:", err);
    res.status(500).json({ error: err.message || "Failed to generate Shastrartha dialogue." });
  }
});

// API: Textual Mapping (Granthasāraṇī Lookup)
app.post("/api/text-explore", async (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    if (!title) {
      res.status(400).json({ error: "title is required" });
      return;
    }

    const ai = getAI();
    const prompt = `
You are an expert Vedantic bibliographer and textual mapping specialist. Provide a detailed entry for the Granthasāraṇī (Vedantic database) for the text titled: "${title}".

Provide the following details:
1. Name of the work & Transliterated Sanskrit Title
2. Primary Author & Estimated Century/Era (with date range)
3. Foundational Sampradāya (School)
4. Foundational text(s) it is commenting on or based on (Mūla Granthas)
5. Dialectical Position (Which views/adversaries does it refute? Which positions does it defend?)
6. Structure/Format (Chapters, verses, style - prose, verse, or sūtra)
7. Selected Famous Commentaries or sub-commentaries on this work.

Format the output cleanly in academic Markdown with precise headers.
- Devanagari and IAST titles where possible.
- Avoid loose conversational speech.
`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });

    res.json({ result: response.text });
  } catch (err: any) {
    console.error("Text explorer error:", err);
    res.status(500).json({ error: err.message || "Failed to retrieve bibliographic mapping." });
  }
});

// API: Dynamic Full Text Reader Generation (Grantha Reader)
app.post("/api/fetch-full-text", async (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    if (!title) {
      res.status(400).json({ error: "Grantha title is required" });
      return;
    }

    const ai = getAI();
    const prompt = `
You are an expert academic curator of classical Sanskrit Vedānta manuscripts.
The user wants to open and read the actual authentic source text of the work: "${title}".

Provide a structured, JSON response containing authentic Sanskrit source text, IAST transliteration, word-by-word padaccheda, classical Bhāṣya/commentary extract, and precision English translation for the canonical opening verses/sūtras and major chapters of this work.

Return ONLY valid JSON matching this schema:
{
  "id": "generated-id",
  "title": "Clean Roman Title",
  "transliteratedTitle": "Title in IAST and (Devanagari)",
  "author": "Name of primary Ācārya / Author",
  "century": "Historical Era / Century",
  "school": "Specific Vedānta Sampradāya",
  "foundationalText": "Parent text or independent treatise",
  "totalVersesOrSutras": "Estimate of total chapters/verses",
  "language": "Classical Sanskrit (Metre/Prose type)",
  "scriptStyle": "Standard Devanāgarī",
  "description": "Scholarly overview of this text's purpose and status",
  "refutationsDet": "Key opponent schools refuted",
  "supportsDet": "Key theological/philosophical doctrines upheld",
  "chapters": [
    {
      "id": "chap-1",
      "chapterTitle": "Chapter 1 English Title",
      "chapterTitleSanskrit": "प्रथमोऽध्यायः / मङ्गलाचरणम्",
      "summary": "Brief summary of this section",
      "verses": [
        {
          "id": "v-1",
          "number": "Verse/Sūtra 1",
          "title": "Specific Title of this verse",
          "mulaSanskrit": "Authentic Sanskrit Devanagari text",
          "mulaIast": "Authentic IAST transliteration",
          "padaccheda": "Word by word Sanskrit split",
          "anvaya": "Sanskrit prose sentence order",
          "bhashyaExtract": "Classical Sanskrit commentarial extract (Śāṅkara, Rāmānuja, Madhva, etc.)",
          "englishTranslation": "Rigorous, accurate academic translation",
          "commentaryNotes": "Explanatory insight and philosophical significance"
        },
        {
          "id": "v-2",
          "number": "Verse/Sūtra 2",
          "title": "Specific Title of second verse",
          "mulaSanskrit": "Authentic Sanskrit Devanagari text",
          "mulaIast": "Authentic IAST transliteration",
          "padaccheda": "Word by word Sanskrit split",
          "anvaya": "Sanskrit prose sentence order",
          "bhashyaExtract": "Classical Sanskrit commentarial extract",
          "englishTranslation": "Rigorous, accurate academic translation",
          "commentaryNotes": "Explanatory insight and philosophical significance"
        }
      ]
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json({ grantha: parsedData });
  } catch (err: any) {
    console.error("Fetch full text API error:", err);
    res.status(500).json({ error: err.message || "Failed to retrieve full canonical text for reader." });
  }
});



// Global process error handlers to prevent crash
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

// Initialize middleware and start server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
      console.log("Vite development middleware attached successfully.");
    } catch (err) {
      console.error("Failed to initialize Vite dev middleware:", err);
    }
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`vedāntatattvaṁ server is live and listening on http://0.0.0.0:${PORT}`);
  });

  server.on("error", (err: any) => {
    console.error("Server listen error:", err);
  });
}

startServer();

export default app;
