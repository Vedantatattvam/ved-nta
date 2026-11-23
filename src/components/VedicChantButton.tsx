import { useState, useEffect } from "react";
import {
  vedicChantSynthesizer,
  ChantAudioState,
} from "../utils/vedicChantSynthesizer";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  Sparkles,
  Music2,
  FastForward,
} from "lucide-react";

interface VedicChantButtonProps {
  verseText: string;
  variant?: "compact" | "badge" | "player" | "inline";
  className?: string;
  label?: string;
}

export default function VedicChantButton({
  verseText,
  variant = "badge",
  className = "",
  label,
}: VedicChantButtonProps) {
  const [audioState, setAudioState] = useState<ChantAudioState>(() =>
    vedicChantSynthesizer.getState()
  );
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const unsubscribe = vedicChantSynthesizer.subscribe((state) => {
      setAudioState(state);
    });
    return unsubscribe;
  }, []);

  const isThisVersePlaying =
    audioState.isPlaying &&
    vedicChantSynthesizer
      .prepareVedicRecitationText(verseText)
      .substring(0, 40) === audioState.currentSegment.substring(0, 40);

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isThisVersePlaying) {
      if (audioState.isPaused) {
        vedicChantSynthesizer.resume();
      } else {
        vedicChantSynthesizer.pause();
      }
    } else {
      vedicChantSynthesizer.chant(verseText);
    }
  };

  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation();
    vedicChantSynthesizer.stop();
  };

  const handleSpeedChange = (speed: number, e: React.MouseEvent) => {
    e.stopPropagation();
    vedicChantSynthesizer.setSpeed(speed);
  };

  const handleToggleDrone = (e: React.MouseEvent) => {
    e.stopPropagation();
    vedicChantSynthesizer.toggleDrone();
  };

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={handleTogglePlay}
        className={`p-1.5 rounded-lg border transition cursor-pointer flex items-center gap-1 ${
          isThisVersePlaying
            ? "bg-amber-600 text-white border-amber-700 shadow-sm animate-pulse"
            : "bg-[#FAF5ED] hover:bg-[#ebd9bd] border-[#bf953f]/40 text-[#8c6011] hover:text-[#2D2319]"
        } ${className}`}
        title={
          isThisVersePlaying
            ? audioState.isPaused
              ? "Resume Vedic Chanting"
              : "Pause Vedic Chanting"
            : "Chant Sanskrit Verse Aloud (Vedic Synthesis)"
        }
      >
        {isThisVersePlaying && !audioState.isPaused ? (
          <Pause className="w-3.5 h-3.5" />
        ) : (
          <Volume2 className="w-3.5 h-3.5" />
        )}
      </button>
    );
  }

  if (variant === "badge") {
    return (
      <div className={`relative inline-flex items-center gap-1 ${className}`}>
        <button
          type="button"
          onClick={handleTogglePlay}
          className={`px-2.5 py-1 rounded-lg border text-xs font-serif font-medium transition cursor-pointer flex items-center gap-1.5 shadow-2xs ${
            isThisVersePlaying
              ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white border-amber-800 shadow-sm"
              : "bg-gradient-to-r from-[#FAF5ED] to-[#FFFDF9] hover:bg-[#FAF1E2] border-[#bf953f]/40 text-[#735013] hover:text-[#2D2319]"
          }`}
          title="Recite Sanskrit verse with authentic Vedic chanting cadence & Tanpura overtone"
        >
          {isThisVersePlaying ? (
            audioState.isPaused ? (
              <>
                <Play className="w-3.5 h-3.5 fill-current text-white" />
                <span className="text-[11px] font-mono font-bold">Resume Chanting</span>
              </>
            ) : (
              <>
                <div className="flex items-center gap-0.5">
                  <span className="w-1 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1 h-4 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1 h-2.5 bg-white rounded-full animate-bounce" />
                </div>
                <span className="text-[11px] font-mono font-bold">Chanting...</span>
              </>
            )
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#8c6011]" />
              <span className="text-[11px] font-mono font-bold text-[#8c6011]">
                {label || "Vedic Chanting"}
              </span>
            </>
          )}
        </button>

        {isThisVersePlaying && (
          <div className="flex items-center gap-1 bg-[#FAF5ED] p-1 rounded-lg border border-[#bf953f]/40 shadow-xs animate-in fade-in duration-150">
            <button
              type="button"
              onClick={handleStop}
              className="p-1 text-[#8c6011] hover:text-red-700 rounded transition cursor-pointer"
              title="Stop recitation"
            >
              <Square className="w-3 h-3 fill-current" />
            </button>

            <button
              type="button"
              onClick={handleToggleDrone}
              className={`p-1 rounded transition cursor-pointer ${
                audioState.droneEnabled
                  ? "text-amber-700 bg-amber-100"
                  : "text-[#9c8266] hover:text-[#735013]"
              }`}
              title={
                audioState.droneEnabled
                  ? "Tanpura Drone Active (Click to mute drone)"
                  : "Tanpura Drone Muted (Click to enable drone)"
              }
            >
              <Music2 className="w-3 h-3" />
            </button>

            {/* Speed Options */}
            <div className="flex items-center text-[9px] font-mono font-bold">
              {[0.8, 1.0, 1.2].map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={(e) => handleSpeedChange(spd, e)}
                  className={`px-1 py-0.5 rounded transition cursor-pointer ${
                    audioState.speed === spd
                      ? "bg-amber-700 text-white"
                      : "text-[#8c6011] hover:bg-[#FAF1E2]"
                  }`}
                  title={`Speed: ${spd}x`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full Player Bar
  return (
    <div
      className={`p-3 rounded-xl bg-gradient-to-r from-[#FAF5ED] via-[#FFFDF8] to-[#FAF5ED] border border-[#bf953f]/40 flex flex-wrap items-center justify-between gap-3 shadow-xs ${className}`}
    >
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={handleTogglePlay}
          className="p-2 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#8c6011] text-white shadow-xs hover:brightness-110 transition cursor-pointer flex items-center justify-center"
        >
          {isThisVersePlaying && !audioState.isPaused ? (
            <Pause className="w-4 h-4 fill-white" />
          ) : (
            <Play className="w-4 h-4 fill-white ml-0.5" />
          )}
        </button>

        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono font-bold text-[#8c6011] uppercase tracking-wider">
              Vedic Chanting Prosody
            </span>
            {isThisVersePlaying && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold animate-pulse">
                Active Recitation
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#6e5842] font-serif italic">
            Authentic Sanskrit meter prosody with resonant Sa-Pa Tanpura drone.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleToggleDrone}
          className={`px-2 py-1 rounded-lg border text-xs font-mono flex items-center gap-1 transition cursor-pointer ${
            audioState.droneEnabled
              ? "bg-amber-100 text-amber-900 border-amber-300 font-bold"
              : "bg-[#FFFDF9] text-[#735013] border-[#bf953f]/30 hover:bg-[#FAF1E2]"
          }`}
          title="Toggle Sa-Pa Harmonic Tanpura drone"
        >
          <Music2 className="w-3 h-3" />
          <span>Tanpura {audioState.droneEnabled ? "ON" : "OFF"}</span>
        </button>

        <div className="flex items-center bg-[#FAF1E2] p-0.5 rounded-lg border border-[#bf953f]/30 text-xs font-mono">
          {[0.8, 1.0, 1.2].map((spd) => (
            <button
              key={spd}
              type="button"
              onClick={(e) => handleSpeedChange(spd, e)}
              className={`px-2 py-0.5 rounded transition cursor-pointer ${
                audioState.speed === spd
                  ? "bg-[#8c6011] text-[#FFFDF8] font-bold"
                  : "text-[#8c6011] hover:text-[#2D2319]"
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>

        {isThisVersePlaying && (
          <button
            type="button"
            onClick={handleStop}
            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 transition cursor-pointer"
            title="Stop recitation"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
          </button>
        )}
      </div>
    </div>
  );
}
