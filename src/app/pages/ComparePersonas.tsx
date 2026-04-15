import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ArrowLeft, GraduationCap, Briefcase, Settings, Users, Heart, Monitor, Smartphone, Star, Route, FileDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from "recharts";
import { toast } from "sonner";
import { getActiveSchool, savedPersonasKey, journeyKey, journeyKeyByRole } from "../lib/schoolStore";
import type { Persona, JourneyStep } from "../lib/types";
import { exportElementToPdf } from "../lib/pdfExport";
import { useDocumentMeta } from "../lib/useDocumentMeta";

const ROLE_ICONS: Record<string, React.ReactNode> = {
  "Étudiant": <GraduationCap className="w-5 h-5" />,
  "Enseignant": <Briefcase className="w-5 h-5" />,
  "Administration": <Settings className="w-5 h-5" />
};

const ROLE_COLORS: Record<string, string> = {
  "Étudiant": "from-blue-500 to-blue-700",
  "Enseignant": "from-green-500 to-teal-700",
  "Administration": "from-purple-500 to-indigo-700"
};

const ROLE_BG: Record<string, string> = {
  "Étudiant": "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900",
  "Enseignant": "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-900",
  "Administration": "bg-purple-50 border-purple-200 dark:bg-purple-950/30 dark:border-purple-900"
};

interface CompareRow {
  label: string;
  icon: React.ReactNode;
  fields: (keyof Persona)[];
}

const COMPARE_ROWS: CompareRow[] = [
  { label: "Profil de base", icon: <Users className="w-4 h-4" />, fields: ["occupation", "studyLevel", "personality"] },
  { label: "Situation personnelle", icon: <Heart className="w-4 h-4" />, fields: ["maritalStatus", "children", "languages"] },
  { label: "Valeurs & Motivations", icon: <Star className="w-4 h-4" />, fields: ["values", "deepMotivations"] },
  { label: "Peurs profondes", icon: <Star className="w-4 h-4" />, fields: ["fears"] },
  { label: "Niveau tech", icon: <Smartphone className="w-4 h-4" />, fields: ["techSavvy", "devices"] },
  { label: "Temps sur le système", icon: <Monitor className="w-4 h-4" />, fields: ["timeSpentOnSystem", "systemUsage"] },
  { label: "Objectifs UX", icon: <Star className="w-4 h-4" />, fields: ["goals"] },
  { label: "Frustrations majeures", icon: <Star className="w-4 h-4" />, fields: ["frustrations"] },
  { label: "Besoins système", icon: <Monitor className="w-4 h-4" />, fields: ["needs"] },
  { label: "Deal Breaker", icon: <Star className="w-4 h-4" />, fields: ["dealBreaker"] },
  { label: "Citation", icon: <Star className="w-4 h-4" />, fields: ["quote"] },
];

function PersonaColumn({ persona }: { persona: Persona }) {
  const color = ROLE_COLORS[persona.role] ?? "from-gray-500 to-gray-700";
  const bg = ROLE_BG[persona.role] ?? "bg-gray-50 border-gray-200";

  return (
    <div className={`rounded-xl border-2 overflow-hidden ${bg}`}>
      {/* Header */}
      <div className={`bg-gradient-to-br ${color} text-white p-5 text-center`}>
        {persona.photo ? (
          <img src={persona.photo} alt={persona.name} className="w-20 h-20 rounded-full mx-auto mb-3 object-cover border-3 border-white shadow-lg" />
        ) : (
          <div className="w-20 h-20 rounded-full mx-auto mb-3 bg-white/20 flex items-center justify-center text-3xl font-bold border-3 border-white shadow-lg">
            {persona.name?.charAt(0) ?? "?"}
          </div>
        )}
        <h3 className="text-xl font-bold">{persona.name || "—"}</h3>
        <p className="text-sm opacity-80">{persona.age}</p>
        <Badge className="mt-2 bg-white/20 text-white border-white/30 gap-1">
          {ROLE_ICONS[persona.role]}
          {persona.type || persona.role}
        </Badge>
      </div>

      {/* Values strip */}
      {persona.introExtrovert && (
        <div className="px-4 py-2 text-xs text-muted-foreground border-b border-border/60 flex gap-3 flex-wrap bg-white/50 dark:bg-slate-900/40">
          <span>🧠 {persona.introExtrovert}</span>
          {persona.morningOrNight && <span>🌅 {persona.morningOrNight}</span>}
          {persona.stressLevel && <span>💆 Stress: {persona.stressLevel}</span>}
        </div>
      )}
    </div>
  );
}

function FieldValue({ persona, fields }: { persona: Persona; fields: (keyof Persona)[] }) {
  const values = fields.map(f => persona[f] as string).filter(Boolean);
  if (!values.length) return <span className="text-muted-foreground text-xs italic">Non renseigné</span>;
  return (
    <div className="space-y-1">
      {values.map((v, i) => (
        <p key={i} className="text-xs text-foreground leading-relaxed">
          {v.split("\n").map((line, j) => (
            <span key={j} className="block">
              {line.startsWith("•") || line.startsWith("-") ? line : line}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}

const ROLE_LINE_COLORS: Record<string, string> = {
  "Étudiant": "#3b82f6",
  "Enseignant": "#10b981",
  "Administration": "#8b5cf6"
};

function JourneyComparison({ schoolId, availablePersonas }: { schoolId: string; availablePersonas: string[] }) {
  const journeys: Record<string, JourneyStep[]> = {};
  for (const role of availablePersonas) {
    try {
      const raw =
        localStorage.getItem(journeyKeyByRole(schoolId, role)) ??
        localStorage.getItem(journeyKey(schoolId));
      if (raw) journeys[role] = JSON.parse(raw);
    } catch {}
  }

  const anyJourneys = Object.values(journeys).some(j => j && j.length > 0);
  if (!anyJourneys) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Route className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Aucune Journey Map enregistrée</h3>
          <p className="text-sm text-muted-foreground">Créez des journey maps pour chaque rôle pour voir la comparaison ici.</p>
        </CardContent>
      </Card>
    );
  }

  const maxSteps = Math.max(...Object.values(journeys).map(j => j?.length ?? 0));
  const chartData = Array.from({ length: maxSteps }, (_, i) => {
    const point: Record<string, string | number> = { step: `Étape ${i + 1}` };
    for (const role of availablePersonas) {
      const j = journeys[role];
      if (j && j[i]) {
        point[role] = j[i].emotion;
        point[`${role}_title`] = j[i].title;
      }
    }
    return point;
  });

  const divergenceData = Array.from({ length: maxSteps }, (_, i) => {
    const emotions = availablePersonas.map(role => journeys[role]?.[i]?.emotion).filter((e): e is number => e !== undefined);
    if (emotions.length < 2) return null;
    const delta = Math.max(...emotions) - Math.min(...emotions);
    return {
      step: i + 1,
      title: journeys[availablePersonas[0]]?.[i]?.title ?? `Étape ${i + 1}`,
      delta,
      emotions: Object.fromEntries(availablePersonas.map(role => [role, journeys[role]?.[i]?.emotion ?? "N/A"]))
    };
  }).filter(Boolean).sort((a, b) => (b?.delta ?? 0) - (a?.delta ?? 0));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="w-5 h-5" />
            Courbes d'émotion superposées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="step" tick={{ fontSize: 11 }} />
              <YAxis domain={[-5, 5]} ticks={[-5, -3, -1, 0, 1, 3, 5]} tick={{ fontSize: 11 }} />
              <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="4 4" />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload) return null;
                  return (
                    <div className="bg-popover text-popover-foreground border border-border rounded-lg shadow-lg p-3 text-xs">
                      <p className="font-semibold mb-1">{label}</p>
                      {payload.map((entry: { name?: string; value?: number; color?: string }) => (
                        <div key={entry.name} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
                          <span>{entry.name}: <strong>{entry.value}</strong></span>
                        </div>
                      ))}
                    </div>
                  );
                }}
              />
              <Legend />
              {availablePersonas.map(role => (
                <Line
                  key={role}
                  type="monotone"
                  dataKey={role}
                  name={role}
                  stroke={ROLE_LINE_COLORS[role] ?? "#666"}
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 7 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {divergenceData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Points de divergence maximale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {divergenceData.slice(0, 5).map((d, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    (d?.delta ?? 0) >= 4 ? "bg-red-500" : (d?.delta ?? 0) >= 2 ? "bg-orange-500" : "bg-yellow-500"
                  }`}>
                    {d?.delta}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{d?.title}</p>
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      {Object.entries(d?.emotions ?? {}).map(([role, emo]) => (
                        <span key={role} style={{ color: ROLE_LINE_COLORS[role] }}>{role}: {String(emo)}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export function ComparePersonas() {
  const navigate = useNavigate();
  const school = getActiveSchool();
  const [exporting, setExporting] = useState(false);
  useDocumentMeta({
    title: "Comparaison | EduSystemDesign",
    description: "Comparaison multi-personas",
    robots: "noindex,nofollow",
  });

  const [personas] = useState<Record<string, Persona>>(() => {
    try {
      const raw = localStorage.getItem(savedPersonasKey(school.id));
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  });

  const roles = ["Étudiant", "Enseignant", "Administration"];
  const availablePersonas = roles.filter(r => personas[r]);
  const missingPersonas = roles.filter(r => !personas[r]);

  if (availablePersonas.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-950 dark:to-slate-900 p-8">
        <div className="max-w-4xl mx-auto">
          <Button variant="outline" onClick={() => navigate("/home")} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />Retour
          </Button>
          <Card className="text-center py-16">
            <CardContent>
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Aucun persona enregistré</h2>
              <p className="text-muted-foreground mb-6">
                Créez et sauvegardez des personas pour les comparer ici.
                Les personas sont automatiquement archivés à chaque sauvegarde.
              </p>
              <Button onClick={() => navigate("/persona")}>Créer un Persona</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const columnCount = availablePersonas.length;
  const gridClass = columnCount === 1 ? "grid-cols-1 max-w-lg" : columnCount === 2 ? "grid-cols-2" : "grid-cols-3";

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={() => navigate("/home")}>
            <ArrowLeft className="w-4 h-4 mr-2" />Retour
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold flex items-center gap-2 justify-center">
              <Users className="w-6 h-6" />Mode Comparaison — {school.name}
            </h1>
            <p className="text-sm text-muted-foreground">Analyse côte à côte des {availablePersonas.length} personas enregistrés</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" disabled={exporting} onClick={async () => {
              setExporting(true);
              try {
                const element = document.getElementById("compare-content");
                if (!element) throw new Error("compare-content not found");
                await exportElementToPdf({
                  element,
                  fileName: `comparaison_${school.shortName || school.name}.pdf`,
                  format: "a3",
                  orientation: "landscape",
                  backgroundColor: "#f8fafc",
                  marginMm: 8,
                });
                toast.success("PDF de comparaison exporté !");
              } catch (err) {
                console.error(err);
                toast.error("Export PDF impossible. Vous pouvez utiliser l'impression navigateur.");
                const usePrint = window.confirm("L'export PDF a échoué. Voulez-vous lancer l'impression navigateur ?");
                if (usePrint) window.print();
              } finally {
                setExporting(false);
              }
            }}>
              <FileDown className="w-4 h-4 mr-2" />{exporting ? "Export..." : "Export PDF"}
            </Button>
            <Button onClick={() => navigate("/persona")}>+ Créer un Persona</Button>
          </div>
        </div>

        {/* Missing personas notice */}
        {missingPersonas.length > 0 && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl p-4 mb-6 flex items-center gap-3">
            <span className="text-amber-700 dark:text-amber-200 text-sm">
              Personas manquants : <strong>{missingPersonas.join(", ")}</strong>. Créez-les pour une comparaison complète des 3 rôles.
            </span>
            <Button size="sm" variant="outline" onClick={() => navigate("/persona")} className="ml-auto">
              Créer un persona
            </Button>
          </div>
        )}

        <div id="compare-content">
        <Tabs defaultValue="personas" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="personas" className="gap-2"><Users className="w-4 h-4" />Personas</TabsTrigger>
            <TabsTrigger value="journeys" className="gap-2"><Route className="w-4 h-4" />Journey Maps</TabsTrigger>
          </TabsList>

          <TabsContent value="personas">
            {/* Column headers */}
            <div className={`grid ${gridClass} gap-4 mb-6`}>
              {availablePersonas.map(role => (
                <PersonaColumn key={role} persona={personas[role]} />
              ))}
            </div>

            {/* Comparison rows */}
            <div className="space-y-4">
              {COMPARE_ROWS.map((row, rowIdx) => (
                <Card key={rowIdx}>
                  <CardHeader className="py-3 bg-muted/40">
                    <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                      {row.icon}
                      {row.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className={`grid ${gridClass}`}>
                      {availablePersonas.map((role, colIdx) => (
                        <div
                          key={role}
                          className={`p-4 ${colIdx < availablePersonas.length - 1 ? "border-r border-border/40" : ""}`}
                        >
                          <FieldValue persona={personas[role]} fields={row.fields} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {availablePersonas.map(role => {
                const p = personas[role];
                const color = ROLE_COLORS[role] ?? "from-gray-500 to-gray-700";
                return (
                  <Card key={role} className="border-0 overflow-hidden">
                    <div className={`bg-gradient-to-r ${color} text-white p-3`}>
                      <div className="flex items-center gap-2">
                        {ROLE_ICONS[role]}
                        <span className="font-bold">{p.name} — {role}</span>
                      </div>
                    </div>
                    <CardContent className="p-3 space-y-1 text-xs text-muted-foreground">
                      <p>Time: {p.timeSpentOnSystem || "N/A"} sur le système/jour</p>
                      <p>Usage: {p.systemUsage || "N/A"}</p>
                      <p>Tech: {p.techSavvy?.split(" - ")[0] || "N/A"}</p>
                      {p.stressLevel && <p>Stress: {p.stressLevel}</p>}
                      {p.idealFeature && <p>Rêve: {p.idealFeature.substring(0, 80)}{p.idealFeature.length > 80 ? "..." : ""}</p>}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="journeys">
            <JourneyComparison schoolId={school.id} availablePersonas={availablePersonas} />
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </div>
  );
}
