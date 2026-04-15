import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, GraduationCap, Briefcase, Settings, Users, Heart, Monitor, Smartphone, Star } from "lucide-react";
import { getActiveSchool, savedPersonasKey } from "../lib/schoolStore";
import type { Persona } from "./PersonaEditor";

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
  "Étudiant": "bg-blue-50 border-blue-200",
  "Enseignant": "bg-green-50 border-green-200",
  "Administration": "bg-purple-50 border-purple-200"
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
        <div className="px-4 py-2 text-xs text-gray-600 border-b flex gap-3 flex-wrap bg-white/50">
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
  if (!values.length) return <span className="text-gray-400 text-xs italic">Non renseigné</span>;
  return (
    <div className="space-y-1">
      {values.map((v, i) => (
        <p key={i} className="text-xs text-gray-700 leading-relaxed">
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

export function ComparePersonas() {
  const navigate = useNavigate();
  const school = getActiveSchool();

  const [personas, setPersonas] = useState<Record<string, Persona>>(() => {
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
        <div className="max-w-4xl mx-auto">
          <Button variant="outline" onClick={() => navigate("/home")} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />Retour
          </Button>
          <Card className="text-center py-16">
            <CardContent>
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-700 mb-2">Aucun persona enregistré</h2>
              <p className="text-gray-500 mb-6">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
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
            <p className="text-sm text-gray-500">Analyse côte à côte des {availablePersonas.length} personas enregistrés</p>
          </div>
          <Button onClick={() => navigate("/persona")}>+ Créer un Persona</Button>
        </div>

        {/* Missing personas notice */}
        {missingPersonas.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <span className="text-amber-600 text-sm">
              ⚠️ Personas manquants : <strong>{missingPersonas.join(", ")}</strong>. Créez-les pour une comparaison complète des 3 rôles.
            </span>
            <Button size="sm" variant="outline" onClick={() => navigate("/persona")} className="ml-auto">
              Créer un persona
            </Button>
          </div>
        )}

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
              <CardHeader className="py-3 bg-gray-50">
                <CardTitle className="text-sm flex items-center gap-2 text-gray-700">
                  {row.icon}
                  {row.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className={`grid ${gridClass}`}>
                  {availablePersonas.map((role, colIdx) => (
                    <div
                      key={role}
                      className={`p-4 ${colIdx < availablePersonas.length - 1 ? "border-r border-gray-100" : ""}`}
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
                <CardContent className="p-3 space-y-1 text-xs text-gray-600">
                  <p>⏱️ {p.timeSpentOnSystem || "N/A"} sur le système/jour</p>
                  <p>📱 {p.systemUsage || "N/A"}</p>
                  <p>🧠 Aisance tech: {p.techSavvy?.split(" - ")[0] || "N/A"}</p>
                  {p.stressLevel && <p>💆 Stress: {p.stressLevel}</p>}
                  {p.idealFeature && <p>✨ Rêve: {p.idealFeature.substring(0, 80)}{p.idealFeature.length > 80 ? "..." : ""}</p>}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
