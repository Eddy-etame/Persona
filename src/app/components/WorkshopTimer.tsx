import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Timer, Play, Pause, RotateCcw, X, ChevronDown, ChevronUp, Bell } from "lucide-react";

interface Phase {
  label: string;
  minutes: number;
  color: string;
}

const DEFAULT_PHASES: Phase[] = [
  { label: "Persona", minutes: 30, color: "bg-blue-500" },
  { label: "Journey Map", minutes: 45, color: "bg-green-500" },
  { label: "Poster Final", minutes: 15, color: "bg-purple-500" },
];

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function WorkshopTimer({ onClose }: { onClose: () => void }) {
  const [phases, setPhases] = useState<Phase[]>(DEFAULT_PHASES);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_PHASES[0].minutes * 60);
  const [running, setRunning] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const totalSeconds = phases[currentPhase].minutes * 60;
  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;
  const isWarning = secondsLeft <= 300 && secondsLeft > 0;
  const isFinished = secondsLeft === 0;

  const playAlert = useCallback(() => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.value = 0.3;
      osc.start();
      setTimeout(() => { osc.stop(); ctx.close(); }, 500);
    } catch {}
  }, []);

  useEffect(() => {
    if (!running || secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          setRunning(false);
          playAlert();
          return 0;
        }
        if (prev === 301) playAlert();
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [running, secondsLeft, playAlert]);

  const selectPhase = (idx: number) => {
    setCurrentPhase(idx);
    setSecondsLeft(phases[idx].minutes * 60);
    setRunning(false);
  };

  const adjustMinutes = (idx: number, delta: number) => {
    setPhases(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], minutes: Math.max(1, updated[idx].minutes + delta) };
      if (idx === currentPhase && !running) {
        setSecondsLeft(updated[idx].minutes * 60);
      }
      return updated;
    });
  };

  const reset = () => {
    setSecondsLeft(phases[currentPhase].minutes * 60);
    setRunning(false);
  };

  const nextPhase = () => {
    if (currentPhase < phases.length - 1) {
      selectPhase(currentPhase + 1);
    }
  };

  if (minimized) {
    return (
      <div
        className={`fixed bottom-4 right-4 z-50 rounded-full shadow-xl px-4 py-2 flex items-center gap-3 cursor-pointer transition-all ${
          isWarning ? "bg-amber-500 text-white animate-pulse" : isFinished ? "bg-red-500 text-white" : "bg-white border"
        }`}
        onClick={() => setMinimized(false)}
      >
        <Timer className="w-4 h-4" />
        <span className="font-mono font-bold text-lg">{formatTime(secondsLeft)}</span>
        <span className="text-xs opacity-80">{phases[currentPhase].label}</span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="shadow-2xl border-2">
        <CardHeader className="py-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Timer className="w-4 h-4" />
            Workshop Timer
          </CardTitle>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => setMinimized(true)}>
              <ChevronDown className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="icon" className="w-6 h-6" onClick={onClose}>
              <X className="w-3 h-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Phase selector */}
          <div className="flex gap-1">
            {phases.map((phase, i) => (
              <button
                key={i}
                onClick={() => selectPhase(i)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  i === currentPhase
                    ? `${phase.color} text-white`
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {phase.label}
              </button>
            ))}
          </div>

          {/* Timer display */}
          <div className="text-center">
            <div className={`text-5xl font-mono font-bold ${isWarning ? "text-amber-500 animate-pulse" : isFinished ? "text-red-500" : "text-gray-800"}`}>
              {formatTime(secondsLeft)}
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-1000 ${isWarning ? "bg-amber-500" : isFinished ? "bg-red-500" : phases[currentPhase].color}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            {isWarning && !isFinished && (
              <p className="text-amber-600 text-xs mt-1 flex items-center justify-center gap-1">
                <Bell className="w-3 h-3" /> 5 minutes restantes !
              </p>
            )}
            {isFinished && (
              <p className="text-red-600 text-sm font-semibold mt-1">Temps écoulé !</p>
            )}
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-2">
            <Button
              size="sm"
              onClick={() => setRunning(!running)}
              className={running ? "bg-amber-500 hover:bg-amber-600" : "bg-green-500 hover:bg-green-600"}
            >
              {running ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
              {running ? "Pause" : "Démarrer"}
            </Button>
            <Button size="sm" variant="outline" onClick={reset}>
              <RotateCcw className="w-4 h-4 mr-1" />Reset
            </Button>
            {isFinished && currentPhase < phases.length - 1 && (
              <Button size="sm" onClick={nextPhase}>
                Phase suivante
              </Button>
            )}
          </div>

          {/* Duration adjustments */}
          <div className="space-y-1">
            <p className="text-xs text-gray-500 font-medium">Durées (minutes) :</p>
            {phases.map((phase, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="flex-1 text-gray-600">{phase.label}</span>
                <Button variant="ghost" size="icon" className="w-5 h-5" onClick={() => adjustMinutes(i, -5)}>
                  <ChevronDown className="w-3 h-3" />
                </Button>
                <span className="w-8 text-center font-mono font-bold">{phase.minutes}</span>
                <Button variant="ghost" size="icon" className="w-5 h-5" onClick={() => adjustMinutes(i, 5)}>
                  <ChevronUp className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
