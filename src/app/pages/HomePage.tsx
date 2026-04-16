import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { User, Route, FileText, Users, Building2, Settings, ArrowRight, CheckCircle2, BookOpen, Download, Upload, Presentation, BarChart3, Timer } from "lucide-react";
import { getActiveSchool, getAllSchools, exportSchoolData, School } from "../lib/schoolStore";
import { toast } from "sonner";
import { ThemeToggle } from "../components/ThemeToggle";
import { WorkshopTimer } from "../components/WorkshopTimer";
import { useDocumentMeta } from "../lib/useDocumentMeta";

export function HomePage() {
  const navigate = useNavigate();
  const [school, setSchool] = useState<School | null>(null);
  const [showTimer, setShowTimer] = useState(false);

  useEffect(() => {
    setSchool(getActiveSchool());
  }, []);

  useDocumentMeta({
    title: "Accueil | EduSystemDesign",
    description: "Accueil du projet UX/UI pour votre etablissement",
    robots: "noindex,nofollow",
  });

  if (!school) return null;

  const allSchools = getAllSchools();
  const typeColor = school.isDemo ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800";

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 dark:from-slate-950 dark:to-slate-900">

      {/* Top navigation */}
      <div className="bg-white dark:bg-slate-900 border-b border-border shadow-sm px-3 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              {school.shortName?.charAt(0) ?? school.name.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-foreground text-sm">{school.name}</p>
              <p className="text-xs text-muted-foreground">{school.city}, {school.country}</p>
            </div>
            {school.isDemo && <Badge className="bg-amber-100 text-amber-700 text-xs">Démo</Badge>}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground w-full sm:w-auto">
              {allSchools.length} établissement{allSchools.length > 1 ? "s" : ""} configuré{allSchools.length > 1 ? "s" : ""}
            </span>
            <Button variant="outline" size="sm" onClick={() => {
              const data = exportSchoolData(school.id);
              if (!data) return;
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `${school.shortName || school.name}_export.json`;
              a.click();
              URL.revokeObjectURL(url);
              toast.success("Données exportées !");
            }} className="gap-2">
              <Download className="w-3 h-3" />
              <span className="hidden sm:inline">Exporter</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/")} className="gap-2">
              <Building2 className="w-3 h-3" />
              <span className="hidden sm:inline">Changer d'école</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate(`/school-setup?edit=${school.id}`)} className="gap-2">
              <Settings className="w-3 h-3" />
              <span className="hidden sm:inline">Configurer</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowTimer(true)} className="gap-2 border-amber-300 text-amber-700 hover:bg-amber-50">
              <Timer className="w-3 h-3" />
              <span className="hidden sm:inline">Workshop</span>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-3 sm:p-8">

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm mb-4">
            <BookOpen className="w-4 h-4" />
            {school.type || "Établissement d'enseignement supérieur"}
          </div>
          <h1 className="text-4xl font-bold mb-3 text-foreground">
            Nouveau Système de Gestion<br />
            <span className="text-blue-600">{school.name}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Concevoir le remplaçant de{" "}
            <span className="font-semibold">{school.currentSoftware || "l'ancien système"}</span>
            {" "} — Projet UX/UI pour Étudiants, Enseignants &amp; Administration
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
            {school.totalStudents && <span>👨‍🎓 {school.totalStudents}</span>}
            {school.totalTeachers && <span>👨‍🏫 {school.totalTeachers}</span>}
            {school.campusCount && <span>🏛️ {school.campusCount} campus</span>}
            {school.degreeLevels && <span>🎓 {school.degreeLevels.split(",")[0].trim()}</span>}
          </div>
        </div>

        {/* Main Missions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <Card className="hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer group" onClick={() => navigate("/persona")}>
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Mission 1 · 30 min</span>
              </div>
              <CardTitle>Créer un Persona</CardTitle>
              <CardDescription>
                Persona ultra-détaillé : Étudiant, Enseignant ou Administration. 7 onglets, photo, score de complétude,
                questions sur vie personnelle, valeurs, peurs et motivations profondes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full group-hover:bg-blue-700">
                Créer le Persona <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer group" onClick={() => navigate("/journey-map")}>
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <Route className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">Mission 2 · 45 min</span>
              </div>
              <CardTitle>Journey Map</CardTitle>
              <CardDescription>
                Courbes d'émotion spécifiques à chaque rôle. Touchpoints, opportunités d'amélioration.
                Templates pré-remplis pour Étudiant, Enseignant et Administration.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Créer la Journey Map <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer group" onClick={() => navigate("/poster")}>
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-sm font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">Livrable PDF</span>
              </div>
              <CardTitle>Poster Final</CardTitle>
              <CardDescription>
                Poster professionnel avec persona complet et courbe d'émotion. Export PDF haute qualité. 
                Intègre photo, psychologie profonde et analyse UX complète.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Voir le Poster <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
          <Card className="hover:shadow-lg transition-all cursor-pointer group bg-card text-card-foreground" onClick={() => navigate("/present")}>
            <CardContent className="py-6 flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors flex-shrink-0">
                <Presentation className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-card-foreground break-words">Mode Présentation</h3>
                <p className="text-sm text-muted-foreground break-words">Diaporama plein écran : contexte, personas, journey maps et insights clés</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-amber-600 transition-colors" />
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-all cursor-pointer group bg-card text-card-foreground" onClick={() => navigate("/analytics")}>
            <CardContent className="py-6 flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center group-hover:bg-cyan-200 transition-colors flex-shrink-0">
                <BarChart3 className="w-6 h-6 text-cyan-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-card-foreground break-words">Analytics</h3>
                <p className="text-sm text-muted-foreground break-words">Dashboard d'insights : points communs, profils tech, bottlenecks émotionnels</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-cyan-600 transition-colors" />
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-all cursor-pointer group bg-card text-card-foreground" onClick={() => navigate("/compare")}>
            <CardContent className="py-6 flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors flex-shrink-0">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-card-foreground break-words">Mode Comparaison</h3>
                <p className="text-sm text-muted-foreground break-words">Comparez les 3 personas côte à côte : valeurs, besoins, frustrations, tech profile</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all cursor-pointer group bg-card text-card-foreground" onClick={() => navigate("/school-setup")}>
            <CardContent className="py-6 flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors flex-shrink-0">
                <Settings className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-card-foreground break-words">Configurer l'établissement</h3>
                <p className="text-sm text-muted-foreground break-words">Modifier les informations de {school.name} : programmes, effectifs, système actuel, besoins</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
            </CardContent>
          </Card>
        </div>

        {/* School info + Pain points */}
        {(school.currentPainPoints || school.mustHave) && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {school.currentPainPoints && (
              <Card className="border-red-200 bg-red-50/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-red-800">❌ Points de douleur actuels ({school.currentSoftware || "système actuel"})</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {school.currentPainPoints.split(/[\n,]+/).map(s => s.trim()).filter(Boolean).slice(0, 5).map((p, i) => (
                      <li key={i} className="text-sm text-gray-800 flex items-start gap-2 leading-relaxed">
                        <span className="text-red-500 flex-shrink-0">•</span>{p}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            {school.mustHave && (
              <Card className="border-green-200 bg-green-50/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-green-800">✅ Fonctionnalités indispensables (must-have)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {school.mustHave.split(/[\n,]+/).map(s => s.trim()).filter(Boolean).slice(0, 5).map((f, i) => (
                      <li key={i} className="text-sm text-gray-800 flex items-start gap-2 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />{f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Instructions */}
        <Card className="bg-white/80 dark:bg-slate-900/90">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Instructions du Projet — {school.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { n: "1", color: "blue" as const, title: "Répartition", desc: "3 groupes de 3 étudiants — chaque groupe prend un rôle : Étudiant, Enseignant ou Administration" },
              { n: "2", color: "green" as const, title: "Mission 1 — Persona (30 min)", desc: `Créez un persona ultra-détaillé (7 onglets) pour votre rôle dans le contexte de ${school.name}. Photo, vie personnelle, valeurs, peurs, besoins système.` },
              { n: "3", color: "purple" as const, title: "Mission 2 — Journey Map (45 min)", desc: "Tracez le parcours utilisateur avec courbe d'émotion. Templates spécifiques par rôle disponibles. Identifiez touchpoints et opportunités." },
              { n: "4", color: "orange" as const, title: "Livrable — Poster Final", desc: "Exportez le poster PDF professionnel. Utilisez le mode comparaison pour présenter les 3 rôles côte à côte." }
            ].map(item => {
              const COLOR_MAP: Record<string, string> = {
                blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200",
                green: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200",
                purple: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-200",
                orange: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-200",
              };
              return (
                <div key={item.n} className="flex items-start gap-3">
                  <div className={`${COLOR_MAP[item.color]} rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0`}>
                    {item.n}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-0.5 text-foreground">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Workshop Timer */}
      {showTimer && <WorkshopTimer onClose={() => setShowTimer(false)} />}
    </div>
  );
}
