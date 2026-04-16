import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { getAllSchools, getActiveSchoolId, setActiveSchoolId, importSchoolData, School, SchoolExportData } from "../lib/schoolStore";
import { toast } from "sonner";
import { GraduationCap, Plus, CheckCircle2, Building2, Globe, Users, BookOpen, ArrowRight, Star, Upload, Download as DownloadIcon } from "lucide-react";
import { ThemeToggle } from "../components/ThemeToggle";
import { useDocumentMeta } from "../lib/useDocumentMeta";
import { PageShell } from "../components/layout/PageShell";
import { TopActions } from "../components/layout/TopActions";

export function SchoolSelection() {
  const navigate = useNavigate();
  const [schools, setSchools] = useState<School[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const deferredPromptRef = useRef<Event | null>(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    setSchools(getAllSchools());
    setActiveId(getActiveSchoolId());

    const handler = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e;
      setCanInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useDocumentMeta({
    title: "EduSystemDesign",
    description: "Plateforme UX/UI de conception de systemes de gestion pour l'enseignement superieur",
    robots: "index,follow",
  });

  const handleSelect = (schoolId: string) => {
    setActiveSchoolId(schoolId);
    setActiveId(schoolId);
    navigate("/home");
  };

  const typeColor = (type: string) => {
    if (type.includes("Commerce") || type.includes("Management")) return "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-200";
    if (type.includes("Ingénieurs")) return "bg-orange-100 text-orange-800 dark:bg-orange-950/40 dark:text-orange-200";
    if (type.includes("Université")) return "bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-200";
    if (type.includes("BTS")) return "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-200";
    if (type.includes("Art")) return "bg-pink-100 text-pink-800 dark:bg-pink-950/40 dark:text-pink-200";
    return "bg-muted text-muted-foreground";
  };

  return (
    <PageShell
      variant="hero"
      className="flex flex-col bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-900"
    >

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-start pt-10 sm:pt-16 pb-8 px-3 sm:px-6">

        {/* Logo / Title */}
        <div className="text-center mb-8 sm:mb-12 w-full max-w-5xl">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-white/70 dark:bg-white/10 backdrop-blur mb-4 sm:mb-6 shadow-xl border border-white/50 dark:border-white/10">
            <GraduationCap className="w-7 h-7 sm:w-10 sm:h-10 text-blue-700 dark:text-white" />
          </div>
          <h1 className="font-bold text-foreground mb-3 tracking-tight leading-tight break-words text-[clamp(1.6rem,7vw,3rem)]">
            EduSystem<span className="text-blue-500 dark:text-blue-400">Design</span>
          </h1>
          <p className="text-blue-700 dark:text-blue-200 max-w-2xl mx-auto text-[clamp(0.95rem,3.6vw,1.25rem)] leading-snug">
            Plateforme UX/UI de conception de systèmes de gestion pour l'enseignement supérieur
          </p>
          <p className="text-blue-700/80 dark:text-blue-300/70 mt-2 text-xs sm:text-sm">
            Persona · Journey Map · Poster · Comparaison — adapté à chaque établissement
          </p>
        </div>

        {/* What is it */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl w-full mb-8 sm:mb-12">
          {[
            { icon: <Users className="w-5 h-5" />, title: "Personas Détaillés", desc: "3 rôles : Étudiant, Enseignant, Admin" },
            { icon: <BookOpen className="w-5 h-5" />, title: "Journey Maps", desc: "Courbes d'émotion par rôle" },
            { icon: <Globe className="w-5 h-5" />, title: "Multi-Écoles", desc: "Adapté à chaque établissement" },
            { icon: <Building2 className="w-5 h-5" />, title: "Posters Pro", desc: "Export PDF qualité livrable" }
          ].map((f, i) => (
            <div key={i} className="bg-white/70 dark:bg-white/5 backdrop-blur rounded-xl p-3 sm:p-4 border border-white/60 dark:border-white/10 text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/20 text-blue-700 dark:text-blue-300 mb-3">
                {f.icon}
              </div>
              <p className="text-foreground font-semibold text-sm">{f.title}</p>
              <p className="text-blue-700/80 dark:text-blue-300/70 text-xs mt-1">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* School Picker */}
        <div className="max-w-5xl w-full">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6">
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">Choisissez votre établissement</h2>
              <p className="text-blue-700/80 dark:text-blue-300/70 text-sm mt-1">Sélectionnez une école existante ou ajoutez-en une nouvelle</p>
            </div>
            <TopActions>
              <Button
                variant="outline"
                className="w-full sm:w-auto gap-2 border-border/70 bg-background/90 text-foreground hover:bg-accent"
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = ".json";
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      try {
                        const data = JSON.parse(ev.target?.result as string) as SchoolExportData;
                        const result = importSchoolData(data);
                        if (result.success) {
                          toast.success(`"${result.schoolName}" importé avec succès !`, { duration: 6000 });
                          setSchools(getAllSchools());
                        } else {
                          toast.error(result.error || "Erreur d'import");
                        }
                      } catch {
                        toast.error("Fichier JSON invalide");
                      }
                    };
                    reader.readAsText(file);
                  };
                  input.click();
                }}
              >
                <Upload className="w-4 h-4" />
                Importer
              </Button>
              <Button
                onClick={() => navigate("/school-setup")}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter un établissement
              </Button>
            </TopActions>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Add New Card */}
            <button
              onClick={() => navigate("/school-setup")}
              className="group border-2 border-dashed border-border rounded-xl p-5 sm:p-6 text-center hover:border-blue-400 hover:bg-white/40 dark:hover:bg-white/5 transition-all cursor-pointer bg-white/50 dark:bg-transparent"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/70 dark:bg-white/5 group-hover:bg-blue-500/20 mb-3 transition-colors">
                <Plus className="w-6 h-6 text-muted-foreground group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
              </div>
              <p className="text-muted-foreground group-hover:text-foreground font-semibold transition-colors">Ajouter un établissement</p>
              <p className="text-muted-foreground text-xs mt-1">Questionnaire complet d'onboarding</p>
            </button>

            {/* Existing Schools */}
            {schools.map(school => (
              <button
                key={school.id}
                onClick={() => handleSelect(school.id)}
                className={`relative group text-left rounded-xl p-6 border-2 transition-all cursor-pointer ${
                  activeId === school.id
                    ? "border-blue-400 bg-blue-500/10"
                    : "border-border bg-white/60 dark:bg-white/5 hover:border-white/30 hover:bg-white/80 dark:hover:bg-white/10"
                }`}
              >
                {/* Demo badge */}
                {school.isDemo && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-xs gap-1">
                      <Star className="w-3 h-3" /> Démo
                    </Badge>
                  </div>
                )}

                {/* Selected check */}
                {activeId === school.id && (
                  <div className="absolute top-3 left-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-400" />
                  </div>
                )}

                {/* Logo / Initial */}
                <div className="mb-4 mt-2">
                  {school.logo ? (
                    <img src={school.logo} alt={school.name} className="w-12 h-12 rounded-lg object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                      {school.shortName?.charAt(0) ?? school.name.charAt(0)}
                    </div>
                  )}
                </div>

                <h3 className="text-foreground font-bold text-lg leading-tight mb-1">{school.name}</h3>
                <p className="text-blue-700/80 dark:text-blue-300/70 text-xs mb-3">{school.city}, {school.country}</p>

                <span className={`inline-block text-xs px-2 py-1 rounded-full font-medium mb-3 ${typeColor(school.type)}`}>
                  {school.type}
                </span>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  {school.totalStudents && (
                    <div className="text-xs text-muted-foreground">
                      <span className="text-foreground font-semibold block">{school.totalStudents}</span>
                      Étudiants
                    </div>
                  )}
                  {school.programs && (
                    <div className="text-xs text-muted-foreground">
                      <span className="text-foreground font-semibold block">{school.programs.split(",").length}</span>
                      Formations
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-2 text-blue-400 text-sm group-hover:gap-3 transition-all">
                  <span>Sélectionner</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center gap-4 py-4">
        <span className="text-blue-700/70 dark:text-blue-300/40 text-xs">EduSystemDesign — Plateforme UX/UI Enseignement Supérieur</span>
        {canInstall && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-xs border-border/70 bg-background/90 text-foreground hover:bg-accent"
            onClick={async () => {
              const prompt = deferredPromptRef.current as any;
              if (prompt?.prompt) {
                prompt.prompt();
                const result = await prompt.userChoice;
                if (result.outcome === "accepted") {
                  setCanInstall(false);
                  toast.success("Application installée !", { duration: 6000 });
                }
              }
            }}
          >
            <DownloadIcon className="w-3 h-3" />
            Installer l'app
          </Button>
        )}
        <ThemeToggle />
      </div>
    </PageShell>
  );
}
