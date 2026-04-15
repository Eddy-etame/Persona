import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, ResponsiveContainer, Legend } from "recharts";
import { getActiveSchool, savedPersonasKey, journeyKey } from "../lib/schoolStore";
import type { Persona, JourneyStep } from "../lib/types";
import { ChevronLeft, ChevronRight, X, Maximize2, Minimize2 } from "lucide-react";
import { useDocumentMeta } from "../lib/useDocumentMeta";

const ROLE_COLORS: Record<string, string> = {
  "Étudiant": "#3b82f6",
  "Enseignant": "#10b981",
  "Administration": "#8b5cf6",
};

interface Slide {
  title: string;
  render: () => React.ReactNode;
}

export function PresentationMode() {
  const navigate = useNavigate();
  const school = getActiveSchool();
  useDocumentMeta({
    title: "Presentation | EduSystemDesign",
    description: "Mode presentation",
    robots: "noindex,nofollow",
  });
  const [current, setCurrent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const personas: Record<string, Persona> = (() => {
    try {
      const raw = localStorage.getItem(savedPersonasKey(school.id));
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  })();

  const journey: JourneyStep[] = (() => {
    try {
      const raw = localStorage.getItem(journeyKey(school.id));
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  })();

  const availableRoles = ["Étudiant", "Enseignant", "Administration"].filter(r => personas[r]);

  const slides: Slide[] = [];

  // Slide 1: School context
  slides.push({
    title: "Contexte de l'établissement",
    render: () => (
      <div className="flex flex-col items-center justify-center h-full gap-8">
        <h1 className="text-5xl font-bold text-white">{school.name}</h1>
        <div className="flex gap-8 text-xl text-white/80">
          <span>{school.totalStudents || "?"} étudiants</span>
          <span>{school.totalTeachers || "?"} enseignants</span>
          <span>{school.type}</span>
        </div>
        {school.currentPainPoints && (
          <div className="max-w-2xl bg-white/10 rounded-2xl p-6 backdrop-blur">
            <h3 className="text-lg font-semibold text-white mb-3">Points de douleur actuels</h3>
            <ul className="space-y-2">
              {school.currentPainPoints.split(/[\n,]+/).map(s => s.trim()).filter(Boolean).slice(0, 5).map((p, i) => (
                <li key={i} className="text-white/80 flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">&#9679;</span>{p}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  });

  // Slides 2-4: One persona per role
  for (const role of availableRoles) {
    const p = personas[role];
    slides.push({
      title: `Persona — ${role}`,
      render: () => (
        <div className="flex items-center justify-center h-full gap-10">
          <div className="flex-shrink-0">
            {p.photo ? (
              <img src={p.photo} alt={p.name} className="w-40 h-40 rounded-full object-cover border-4 shadow-2xl" style={{ borderColor: ROLE_COLORS[role] }} />
            ) : (
              <div className="w-40 h-40 rounded-full flex items-center justify-center text-6xl font-bold text-white shadow-2xl" style={{ background: ROLE_COLORS[role] }}>
                {p.name?.charAt(0) ?? "?"}
              </div>
            )}
          </div>
          <div className="max-w-xl space-y-4">
            <div>
              <h2 className="text-4xl font-bold text-white">{p.name || "—"}</h2>
              <p className="text-xl text-white/70">{p.age} — {p.type || role}</p>
            </div>
            {p.bio && <p className="text-white/80 text-lg leading-relaxed">{p.bio.substring(0, 250)}{p.bio.length > 250 ? "..." : ""}</p>}
            <div className="grid grid-cols-2 gap-4 text-sm">
              {p.techSavvy && <div className="bg-white/10 rounded-lg p-3"><span className="text-white/50">Tech:</span> <span className="text-white">{p.techSavvy.split(" - ")[0]}</span></div>}
              {p.timeSpentOnSystem && <div className="bg-white/10 rounded-lg p-3"><span className="text-white/50">Temps système:</span> <span className="text-white">{p.timeSpentOnSystem}</span></div>}
              {p.stressLevel && <div className="bg-white/10 rounded-lg p-3"><span className="text-white/50">Stress:</span> <span className="text-white">{p.stressLevel}</span></div>}
              {p.systemUsage && <div className="bg-white/10 rounded-lg p-3"><span className="text-white/50">Usage:</span> <span className="text-white">{p.systemUsage}</span></div>}
            </div>
            {p.quote && (
              <blockquote className="border-l-4 pl-4 italic text-white/70 text-lg" style={{ borderColor: ROLE_COLORS[role] }}>
                "{p.quote.substring(0, 150)}{p.quote.length > 150 ? "..." : ""}"
              </blockquote>
            )}
          </div>
        </div>
      )
    });
  }

  // Slide: Journey map emotion curves (if data exists)
  if (journey.length > 0) {
    const chartData = journey.map((step, i) => ({
      step: `${i + 1}. ${step.title.substring(0, 15)}`,
      Émotion: step.emotion,
    }));

    slides.push({
      title: "Journey Map — Courbe d'émotion",
      render: () => (
        <div className="flex flex-col items-center justify-center h-full gap-6">
          <h2 className="text-3xl font-bold text-white">Parcours Utilisateur</h2>
          <div className="w-full max-w-4xl bg-white/10 rounded-2xl p-6 backdrop-blur">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="step" tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 11 }} />
                <YAxis domain={[-5, 5]} tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 11 }} />
                <ReferenceLine y={0} stroke="rgba(255,255,255,0.3)" strokeDasharray="4 4" />
                <Line type="monotone" dataKey="Émotion" stroke="#f59e0b" strokeWidth={3} dot={{ r: 6, fill: "#f59e0b" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-4xl w-full">
            {journey.slice(0, 6).map((step, i) => (
              <div key={i} className="bg-white/10 rounded-lg p-3 backdrop-blur text-sm">
                <span className="font-semibold text-white">{step.title}</span>
                {step.opportunity && <p className="text-green-300 text-xs mt-1">Opportunité: {step.opportunity}</p>}
              </div>
            ))}
          </div>
        </div>
      )
    });
  }

  // Slide: Key Insights Summary
  if (availableRoles.length > 0) {
    slides.push({
      title: "Insights Clés",
      render: () => (
        <div className="flex flex-col items-center justify-center h-full gap-8">
          <h2 className="text-4xl font-bold text-white">Synthèse des Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
            {availableRoles.map(role => {
              const p = personas[role];
              return (
                <div key={role} className="bg-white/10 rounded-2xl p-6 backdrop-blur border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 rounded-full" style={{ background: ROLE_COLORS[role] }} />
                    <h3 className="text-xl font-bold text-white">{role}</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    {p.frustrations && (
                      <div>
                        <p className="text-red-400 font-medium mb-1">Frustrations:</p>
                        <p className="text-white/70">{p.frustrations.split("\n")[0]}</p>
                      </div>
                    )}
                    {p.needs && (
                      <div>
                        <p className="text-blue-400 font-medium mb-1">Besoin #1:</p>
                        <p className="text-white/70">{p.needs.split("\n")[0]}</p>
                      </div>
                    )}
                    {p.idealFeature && (
                      <div>
                        <p className="text-green-400 font-medium mb-1">Fonctionnalité rêvée:</p>
                        <p className="text-white/70">{p.idealFeature.substring(0, 100)}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )
    });
  }

  const goNext = useCallback(() => setCurrent(c => Math.min(c + 1, slides.length - 1)), [slides.length]);
  const goPrev = useCallback(() => setCurrent(c => Math.max(c - 1, 0)), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); goNext(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
      if (e.key === "Escape") navigate("/home");
      if (e.key === "f" || e.key === "F") {
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev, navigate]);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  if (slides.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Aucun contenu à présenter</h2>
          <p className="text-gray-400 mb-6">Créez des personas et des journey maps d'abord.</p>
          <button onClick={() => navigate("/home")} className="text-blue-400 underline">Retour</button>
        </div>
      </div>
    );
  }

  const slide = slides[current];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 relative select-none">
      {/* Top controls */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div className="text-white/60 text-sm">
          {current + 1} / {slides.length} — {slide.title}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (document.fullscreenElement) document.exitFullscreen();
              else document.documentElement.requestFullscreen();
            }}
            className="p-2 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 transition"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => navigate("/home")}
            className="p-2 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Slide content */}
      <div className="min-h-screen px-12 py-20">
        {slide.render()}
      </div>

      {/* Navigation arrows */}
      {current > 0 && (
        <button
          onClick={goPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}
      {current < slides.length - 1 && (
        <button
          onClick={goNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${((current + 1) / slides.length) * 100}%` }}
        />
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-white w-6" : "bg-white/30"}`}
          />
        ))}
      </div>
    </div>
  );
}
