import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, Download, MapPin, Home, Train, Clock, Smartphone, GraduationCap, Briefcase, Settings, Heart, FileDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { toast } from "sonner";
import { getActiveSchool, personaKey, journeyKey } from "../lib/schoolStore";
import type { Persona, JourneyStep } from "../lib/types";
import { exportElementToPdf } from "../lib/pdfExport";
import { useDocumentMeta } from "../lib/useDocumentMeta";
import { ThemeToggle } from "../components/ThemeToggle";

export function PosterView() {
  const navigate = useNavigate();
  const posterRef = useRef<HTMLDivElement>(null);
  const school = getActiveSchool();
  useDocumentMeta({
    title: "Poster | EduSystemDesign",
    description: "Poster final et export PDF",
    robots: "noindex,nofollow",
  });

  const [persona] = useState<Persona | null>(() => {
    const saved = localStorage.getItem(personaKey(school.id));
    return saved ? JSON.parse(saved) : null;
  });

  const [journeySteps] = useState<JourneyStep[]>(() => {
    const saved = localStorage.getItem(journeyKey(school.id));
    return saved ? JSON.parse(saved) : [];
  });

  const [exporting, setExporting] = useState(false);

  const chartData = journeySteps.map((step, i) => ({
    name: `${i + 1}`,
    emotion: step.emotion,
    label: step.title.length > 18 ? step.title.substring(0, 15) + "..." : step.title
  }));

  const handlePrint = () => window.print();

  const handleExportPDF = async () => {
    if (!posterRef.current) return;
    setExporting(true);
    try {
      const fileName = `Poster_${persona?.name || "Persona"}_${school.shortName || school.name}.pdf`;
      
      // Petit délai pour laisser Recharts désactiver les animations
      await new Promise(resolve => setTimeout(resolve, 150));

      await exportElementToPdf({
        element: posterRef.current,
        fileName,
        format: "a4",
        orientation: "portrait",
        backgroundColor: "#ffffff",
        marginMm: 8,
      });
      toast.success("PDF exporté avec succès !");
    } catch (err) {
      console.error(err);
      toast.error("Export PDF impossible. Utilisez l'impression navigateur.");
      const usePrint = window.confirm("L'export PDF a échoué. Voulez-vous lancer l'impression navigateur ?");
      if (usePrint) handlePrint();
    } finally {
      setExporting(false);
    }
  };

  if (!persona || journeySteps.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-950 dark:to-slate-900 p-8">
        <div className="max-w-6xl mx-auto text-center">
          <Button variant="outline" onClick={() => navigate("/home")} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />Retour
          </Button>
          <h1 className="text-3xl font-bold mb-4">Poster non disponible</h1>
          <p className="text-gray-600 mb-8">Veuillez d'abord compléter le Persona et la Journey Map pour <strong>{school.name}</strong>.</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate("/persona")}>Créer le Persona</Button>
            <Button variant="outline" onClick={() => navigate("/journey-map")}>Créer la Journey Map</Button>
          </div>
        </div>
      </div>
    );
  }

  const getRoleIcon = () => {
    if (persona.role === "Étudiant") return <GraduationCap className="w-6 h-6" />;
    if (persona.role === "Enseignant") return <Briefcase className="w-6 h-6" />;
    return <Settings className="w-6 h-6" />;
  };

  const roleGradient = persona.role === "Étudiant" ? "from-blue-600 to-blue-800"
    : persona.role === "Enseignant" ? "from-green-600 to-teal-800"
    : "from-purple-600 to-indigo-800";

  const avgEmotion = journeySteps.length
    ? (journeySteps.reduce((a, s) => a + s.emotion, 0) / journeySteps.length).toFixed(1) : "0";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Controls */}
        <div className="flex items-center justify-between mb-6 print:hidden">
          <Button variant="outline" onClick={() => navigate("/home")}>
            <ArrowLeft className="w-4 h-4 mr-2" />Retour
          </Button>
          <h1 className="text-2xl font-bold">Poster Final — {school.name}</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Download className="w-4 h-4 mr-2" />Imprimer
            </Button>
            <Button onClick={handleExportPDF} disabled={exporting} className="bg-purple-600 hover:bg-purple-700">
              <FileDown className="w-4 h-4 mr-2" />
              {exporting ? "Export en cours..." : "Export PDF"}
            </Button>
            <ThemeToggle />
          </div>
        </div>

        {/* POSTER */}
        <div ref={posterRef} className="bg-white rounded-xl shadow-2xl print:shadow-none overflow-hidden">

          {/* ── HEADER ── */}
          <div className={`bg-gradient-to-r ${roleGradient} text-white p-8 text-center`}>
            <h1 className="text-3xl font-bold mb-1">Nouveau Système de Gestion</h1>
            <h2 className="text-4xl font-bold mb-2">{school.name}</h2>
            <p className="text-lg opacity-80">Projet UX/UI — Persona & Journey Map — Remplacement {school.currentSoftware || "système actuel"}</p>
            <div className="flex items-center justify-center gap-4 mt-3 text-sm opacity-70">
              {school.totalStudents && <span>👨‍🎓 {school.totalStudents}</span>}
              {school.type && <span>🏛️ {school.type}</span>}
              {school.city && <span>📍 {school.city}</span>}
            </div>
            <Badge className="mt-3 bg-white/20 text-white border-white/30 text-base px-4 py-1 gap-2">
              {getRoleIcon()}{persona.role}
            </Badge>
          </div>

          <div className="p-6 space-y-6">

            {/* ── PERSONA SECTION ── */}
            <section>
              <div className={`bg-gradient-to-r ${roleGradient} text-white p-3 rounded-t-lg flex items-center gap-3`}>
                {getRoleIcon()}
                <h2 className="text-xl font-bold">Persona — {persona.type || persona.name}</h2>
              </div>
              <div className="border-2 border-t-0 rounded-b-lg p-5">

                {/* Identity row */}
                <div className="grid md:grid-cols-4 gap-6 mb-5">
                  {/* Avatar */}
                  <div className="md:col-span-1 text-center">
                    {persona.photo ? (
                      <img src={persona.photo} alt={persona.name} className="w-28 h-28 rounded-full mx-auto mb-3 object-cover border-4 border-blue-200 shadow-lg" />
                    ) : (
                      <div className="w-28 h-28 rounded-full mx-auto mb-3 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold border-4 border-blue-200 shadow-lg">
                        {persona.name.charAt(0) || "?"}
                      </div>
                    )}
                    <h3 className="text-xl font-bold">{persona.name || "—"}</h3>
                    <p className="text-gray-600">{persona.age}</p>
                    {persona.occupation && <p className="text-sm font-semibold text-gray-700 mt-1">{persona.occupation}</p>}
                    {persona.studyLevel && <p className="text-xs text-gray-600">{persona.studyLevel}</p>}
                    {persona.program && <p className="text-xs text-gray-500 mt-1">{persona.program}</p>}
                    {persona.yearOfStudy && <p className="text-xs text-gray-500">{persona.yearOfStudy}</p>}
                    {persona.position && <p className="text-sm font-semibold text-gray-700 mt-1">{persona.position}</p>}
                    {persona.department && <p className="text-xs text-gray-600">{persona.department}</p>}
                    {persona.yearsAtKeyce && <p className="text-xs text-gray-500 mt-1">Ancienneté: {persona.yearsAtKeyce}</p>}
                    {/* Perso infos */}
                    <div className="mt-3 text-left space-y-0.5">
                      {persona.maritalStatus && <p className="text-xs text-gray-600"><b>Situation:</b> {persona.maritalStatus}</p>}
                      {persona.children && <p className="text-xs text-gray-600"><b>Enfants:</b> {persona.children}</p>}
                      {persona.languages && <p className="text-xs text-gray-600"><b>Langues:</b> {persona.languages}</p>}
                      {persona.introExtrovert && <p className="text-xs text-gray-600"><b>Profil:</b> {persona.introExtrovert}</p>}
                      {persona.morningOrNight && <p className="text-xs text-gray-600"><b>Rythme:</b> {persona.morningOrNight}</p>}
                      {persona.stressLevel && <p className="text-xs text-gray-600"><b>Stress:</b> {persona.stressLevel}</p>}
                    </div>
                  </div>

                  {/* Bio + Psycho */}
                  <div className="md:col-span-3 space-y-3">
                    <div>
                      <h4 className="font-bold text-sm mb-1 text-gray-800">📝 Bio / Contexte</h4>
                      <p className="text-gray-700 text-xs leading-relaxed">{persona.bio}</p>
                    </div>
                    {persona.personality && (
                      <div>
                        <h4 className="font-bold text-xs mb-1 text-gray-800">🧠 Personnalité</h4>
                        <p className="text-xs text-gray-700">{persona.personality}</p>
                      </div>
                    )}
                    {/* Psycho deep */}
                    {(persona.values || persona.deepMotivations || persona.fears) && (
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <h4 className="font-bold text-xs mb-2 text-purple-800 flex items-center gap-1">
                          <Heart className="w-3 h-3" />Psychologie Profonde
                        </h4>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          {persona.values && <div><span className="font-semibold text-purple-700 block">Valeurs</span><span className="text-gray-700">{persona.values}</span></div>}
                          {persona.deepMotivations && <div><span className="font-semibold text-purple-700 block">Motivations</span><span className="text-gray-700">{persona.deepMotivations}</span></div>}
                          {persona.fears && <div><span className="font-semibold text-purple-700 block">Peurs</span><span className="text-gray-700">{persona.fears}</span></div>}
                        </div>
                        {persona.lifePhilosophy && <p className="text-xs text-gray-600 italic mt-2">"{persona.lifePhilosophy}"</p>}
                      </div>
                    )}
                    {/* Context */}
                    {(persona.transportation || persona.workSchedule) && (
                      <div className="bg-pink-50 p-3 rounded-lg">
                        <h4 className="font-bold text-xs mb-2 text-pink-800 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />Contexte & Horaires
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {persona.neighborhood && <div className="flex gap-1"><Home className="w-3 h-3 text-pink-600 flex-shrink-0 mt-0.5" /><span><b>Quartier:</b> {persona.neighborhood}{persona.housing ? ` — ${persona.housing}` : ""}</span></div>}
                          {persona.transportation && <div className="flex gap-1"><Train className="w-3 h-3 text-pink-600 flex-shrink-0 mt-0.5" /><span><b>Transport:</b> {persona.transportation}</span></div>}
                          {persona.workSchedule && <div className="flex gap-1"><Clock className="w-3 h-3 text-pink-600 flex-shrink-0 mt-0.5" /><span><b>Horaires:</b> {persona.workSchedule}</span></div>}
                          {persona.devices && <div className="flex gap-1"><Smartphone className="w-3 h-3 text-pink-600 flex-shrink-0 mt-0.5" /><span><b>Devices:</b> {persona.devices}</span></div>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Loisirs + Bien-être */}
                {(persona.hobbies || persona.sports || persona.stressManagement || persona.bigLifeEvent) && (
                  <div className="grid md:grid-cols-2 gap-3 mb-4">
                    {(persona.hobbies || persona.sports || persona.weekendActivities) && (
                      <div className="bg-orange-50 p-3 rounded-lg border-l-4 border-orange-400">
                        <h4 className="font-bold text-xs mb-1.5 text-orange-800">🎨 Loisirs & Mode de Vie</h4>
                        <div className="text-xs text-gray-700 space-y-0.5">
                          {persona.hobbies && <p><b>Passions:</b> {persona.hobbies}</p>}
                          {persona.sports && <p><b>Sports:</b> {persona.sports}</p>}
                          {persona.musicTaste && <p><b>Musique:</b> {persona.musicTaste}</p>}
                          {persona.weekendActivities && <p><b>Week-end:</b> {persona.weekendActivities}</p>}
                        </div>
                      </div>
                    )}
                    {(persona.stressManagement || persona.bigLifeEvent || persona.roleModel) && (
                      <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                        <h4 className="font-bold text-xs mb-1.5 text-green-800">💚 Bien-être & Événements Marquants</h4>
                        <div className="text-xs text-gray-700 space-y-0.5">
                          {persona.sleepSchedule && <p><b>Sommeil:</b> {persona.sleepSchedule}</p>}
                          {persona.stressManagement && <p><b>Gestion stress:</b> {persona.stressManagement}</p>}
                          {persona.bigLifeEvent && <p><b>Événement marquant:</b> {persona.bigLifeEvent}</p>}
                          {persona.roleModel && <p><b>Modèles:</b> {persona.roleModel}</p>}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Role-specific personal */}
                {persona.role === "Étudiant" && (persona.whyKeyce || persona.dreamJob || persona.parentsProfession) && (
                  <div className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400 mb-4">
                    <h4 className="font-bold text-xs mb-1.5 text-yellow-800 flex items-center gap-1"><GraduationCap className="w-3 h-3" />Profil Personnel Étudiant</h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs text-gray-700">
                      {persona.whyKeyce && <p><b>Pourquoi {school.shortName || school.name}:</b> {persona.whyKeyce}</p>}
                      {persona.previousSchool && <p><b>École précédente:</b> {persona.previousSchool}</p>}
                      {persona.parentsProfession && <p className="col-span-2"><b>Parents:</b> {persona.parentsProfession}</p>}
                      {persona.dreamJob && <p className="col-span-2"><b>Emploi rêvé:</b> {persona.dreamJob}</p>}
                      {persona.yearGoal && <p className="col-span-2"><b>Objectif cette année:</b> {persona.yearGoal}</p>}
                    </div>
                  </div>
                )}

                {persona.role === "Enseignant" && (persona.previousCareer || persona.teachingPhilosophy) && (
                  <div className="bg-teal-50 p-3 rounded-lg border-l-4 border-teal-400 mb-4">
                    <h4 className="font-bold text-xs mb-1.5 text-teal-800 flex items-center gap-1"><Briefcase className="w-3 h-3" />Profil Personnel Enseignant</h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs text-gray-700">
                      {persona.previousCareer && <p className="col-span-2"><b>Carrière précédente:</b> {persona.previousCareer}</p>}
                      {persona.whyTeaching && <p className="col-span-2"><b>Pourquoi enseigner:</b> {persona.whyTeaching}</p>}
                      {persona.teachingPhilosophy && <p className="col-span-2"><b>Philosophie péda:</b> {persona.teachingPhilosophy}</p>}
                      {persona.proudestAchievement && <p className="col-span-2"><b>Fierté:</b> {persona.proudestAchievement}</p>}
                      {persona.jobSatisfaction && <p><b>Satisfaction:</b> {persona.jobSatisfaction}</p>}
                    </div>
                  </div>
                )}

                {persona.role === "Administration" && (persona.managementStyle || persona.careerPath) && (
                  <div className="bg-indigo-50 p-3 rounded-lg border-l-4 border-indigo-400 mb-4">
                    <h4 className="font-bold text-xs mb-1.5 text-indigo-800 flex items-center gap-1"><Settings className="w-3 h-3" />Profil Personnel Administration</h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs text-gray-700">
                      {persona.managementStyle && <p><b>Style management:</b> {persona.managementStyle}</p>}
                      {persona.decisionAuthority && <p><b>Autorité:</b> {persona.decisionAuthority}</p>}
                      {persona.careerPath && <p className="col-span-2"><b>Parcours:</b> {persona.careerPath}</p>}
                      {persona.emailsPerDay && <p><b>Emails/jour:</b> {persona.emailsPerDay}</p>}
                      {persona.meetingsPerWeek && <p><b>Réunions/sem:</b> {persona.meetingsPerWeek}</p>}
                      {persona.proudestAchievementAdmin && <p className="col-span-2"><b>Fierté:</b> {persona.proudestAchievementAdmin}</p>}
                      {persona.adminSatisfaction && <p><b>Satisfaction:</b> {persona.adminSatisfaction}</p>}
                    </div>
                  </div>
                )}

                {/* UX Grid */}
                <div className="grid md:grid-cols-3 gap-3 mb-4">
                  {persona.goals && (
                    <div className="bg-green-50 p-3 rounded-lg border-2 border-green-200">
                      <h4 className="font-bold text-xs mb-2 text-green-800">✅ Objectifs</h4>
                      <ul className="text-xs space-y-0.5 text-gray-700">
                        {persona.goals.split("\n").slice(0, 5).map((g, i) => g.trim() && <li key={i}>• {g}</li>)}
                      </ul>
                    </div>
                  )}
                  {persona.frustrations && (
                    <div className="bg-red-50 p-3 rounded-lg border-2 border-red-200">
                      <h4 className="font-bold text-xs mb-2 text-red-800">❌ Frustrations</h4>
                      <ul className="text-xs space-y-0.5 text-gray-700">
                        {persona.frustrations.split("\n").slice(0, 5).map((f, i) => f.trim() && <li key={i}>• {f}</li>)}
                      </ul>
                    </div>
                  )}
                  {persona.needs && (
                    <div className="bg-blue-50 p-3 rounded-lg border-2 border-blue-200">
                      <h4 className="font-bold text-xs mb-2 text-blue-800">⭐ Besoins</h4>
                      <ul className="text-xs space-y-0.5 text-gray-700">
                        {persona.needs.split("\n").slice(0, 5).map((n, i) => n.trim() && <li key={i}>• {n}</li>)}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Quote */}
                {persona.quote && (
                  <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-lg border-l-4 border-purple-600 mb-3">
                    <p className="text-gray-800 italic text-sm">"{persona.quote}"</p>
                    <p className="text-xs text-gray-500 mt-1">— {persona.name}, {persona.type}</p>
                  </div>
                )}

                {/* Deal breaker + Ideal + Onboarding */}
                {(persona.idealFeature || persona.dealBreaker || persona.onboardingExpectation) && (
                  <div className="grid md:grid-cols-3 gap-3">
                    {persona.idealFeature && <div className="bg-yellow-50 p-2 rounded-lg border border-yellow-300"><p className="text-xs font-bold text-yellow-800 mb-1">✨ Feature rêvée</p><p className="text-xs text-gray-700">{persona.idealFeature}</p></div>}
                    {persona.dealBreaker && <div className="bg-red-50 p-2 rounded-lg border border-red-300"><p className="text-xs font-bold text-red-800 mb-1">🚫 Deal Breaker</p><p className="text-xs text-gray-700">{persona.dealBreaker}</p></div>}
                    {persona.onboardingExpectation && <div className="bg-teal-50 p-2 rounded-lg border border-teal-300"><p className="text-xs font-bold text-teal-800 mb-1">🚀 Onboarding</p><p className="text-xs text-gray-700">{persona.onboardingExpectation}</p></div>}
                  </div>
                )}

                {/* System usage */}
                {(persona.primarySystemNeeds || persona.timeSpentOnSystem) && (
                  <div className="grid md:grid-cols-2 gap-3 mt-3">
                    {persona.primarySystemNeeds && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h4 className="font-bold text-xs mb-1.5 text-gray-800">💻 Besoins système principaux</h4>
                        <ul className="text-xs space-y-0.5 text-gray-700">
                          {persona.primarySystemNeeds.split("\n").slice(0, 5).map((n, i) => n.trim() && <li key={i}>• {n}</li>)}
                        </ul>
                      </div>
                    )}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="font-bold text-xs mb-1.5 text-gray-800">⏱️ Profil d'utilisation</h4>
                      <div className="text-xs text-gray-700 space-y-0.5">
                        {persona.timeSpentOnSystem && <p><b>Temps/jour:</b> {persona.timeSpentOnSystem}</p>}
                        {persona.systemUsage && <p><b>Mode:</b> {persona.systemUsage}</p>}
                        {persona.techSavvy && <p><b>Tech:</b> {persona.techSavvy.split(" - ")[0]}</p>}
                        {persona.devices && <p><b>Devices:</b> {persona.devices}</p>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* ── JOURNEY MAP SECTION ── */}
            <section>
              <div className={`bg-gradient-to-r from-green-600 to-blue-600 text-white p-3 rounded-t-lg`}>
                <h2 className="text-xl font-bold">Journey Map — Courbe d'émotion ({persona.role})</h2>
                <p className="text-xs opacity-80 mt-0.5">Parcours utilisateur dans le nouveau système de gestion {school.name} · Émotion moyenne: {parseFloat(avgEmotion) > 0 ? "+" : ""}{avgEmotion}/10</p>
              </div>
              <div className="border-2 border-t-0 border-green-600 rounded-b-lg p-4">
                {/* Chart */}
                <div className="h-48 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" tick={{ fontSize: 9 }} />
                      <YAxis domain={[-10, 10]} tick={{ fontSize: 9 }} />
                      <ReferenceLine y={0} stroke="#9ca3af" strokeDasharray="4 4" />
                      <Tooltip content={({ active, payload }) => {
                        if (active && payload?.[0]) {
                          const d = payload[0].payload;
                          return <div className="bg-white p-2 border rounded shadow text-xs"><p className="font-bold">{d.label}</p><p>Émotion: {d.emotion > 0 ? "+" : ""}{d.emotion}</p></div>;
                        }
                        return null;
                      }} />
                      <Line type="monotone" dataKey="emotion" stroke="#3b82f6" strokeWidth={3}
                        isAnimationActive={!exporting}
                        dot={{ fill: "#3b82f6", r: 5 }} activeDot={{ r: 7 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Steps grid */}
                <div className="grid md:grid-cols-4 gap-2">
                  {journeySteps.map((step, i) => {
                    const col = step.emotion > 5 ? "bg-green-100 border-green-500"
                      : step.emotion > 0 ? "bg-green-50 border-green-300"
                      : step.emotion === 0 ? "bg-yellow-50 border-yellow-400"
                      : step.emotion > -5 ? "bg-orange-50 border-orange-300"
                      : "bg-red-100 border-red-500";
                    return (
                      <div key={step.id} className={`${col} p-2 rounded-lg border-l-4`}>
                        <div className="flex items-center gap-1 mb-1">
                          <span className="bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{i + 1}</span>
                          <span className="text-xs font-bold">{step.emotion > 0 ? "+" : ""}{step.emotion}</span>
                        </div>
                        <h5 className="font-bold text-xs mb-0.5 text-gray-800 leading-tight">{step.title}</h5>
                        <p className="text-xs text-gray-600 leading-tight">{step.description}</p>
                        {step.touchpoint && <p className="text-xs text-blue-600 mt-1 font-medium">📍 {step.touchpoint}</p>}
                        {step.opportunity && step.emotion < 0 && <p className="text-xs text-amber-700 mt-0.5">💡 {step.opportunity}</p>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Footer */}
            <div className="text-center text-xs text-gray-400 border-t pt-3">
              {school.name} — Projet UX/UI Système de Gestion — {new Date().toLocaleDateString("fr-FR")} — {persona.name} ({persona.role})
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print\\:shadow-none, .print\\:shadow-none * { visibility: visible; }
          .print\\:shadow-none { position: absolute; left: 0; top: 0; width: 100%; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}