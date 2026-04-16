import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ArrowLeft, BarChart3, AlertTriangle, Lightbulb, Smartphone, Clock } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { getActiveSchool, savedPersonasKey, journeyKey, journeyKeyByRole } from "../lib/schoolStore";
import type { Persona, JourneyStep } from "../lib/types";
import { useDocumentMeta } from "../lib/useDocumentMeta";

const ROLE_COLORS: Record<string, string> = {
  "Étudiant": "#3b82f6",
  "Enseignant": "#10b981",
  "Administration": "#8b5cf6",
};

function findCommonTerms(texts: string[]): string[] {
  const filtered = texts.filter(Boolean);
  if (filtered.length < 2) return [];

  const wordSets = filtered.map(t =>
    new Set(
      t.toLowerCase()
        .replace(/[^\wàâäéèêëïîôùûüÿçœæ\s-]/g, " ")
        .split(/\s+/)
        .filter(w => w.length > 3)
    )
  );

  const allWords = new Set(wordSets.flatMap(s => [...s]));
  const stopWords = new Set(["dans", "pour", "avec", "plus", "sans", "être", "avoir", "faire", "comme", "cette", "tout", "tous", "très", "bien", "mais", "aussi", "même", "autre", "encore"]);

  const common: string[] = [];
  for (const word of allWords) {
    if (stopWords.has(word)) continue;
    const count = wordSets.filter(s => s.has(word)).length;
    if (count >= 2) common.push(word);
  }
  return common.slice(0, 15);
}

export function Analytics() {
  const navigate = useNavigate();
  const school = getActiveSchool();
  useDocumentMeta({
    title: "Analytics | EduSystemDesign",
    description: "Dashboard d'insights UX",
    robots: "noindex,nofollow",
  });

  const personas: Record<string, Persona> = (() => {
    try {
      const raw = localStorage.getItem(savedPersonasKey(school.id));
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  })();

  const roles = ["Étudiant", "Enseignant", "Administration"];

  const journeyByRole: Record<string, JourneyStep[]> = roles.reduce((acc, role) => {
    try {
      const raw =
        localStorage.getItem(journeyKeyByRole(school.id, role)) ??
        localStorage.getItem(journeyKey(school.id));
      acc[role] = raw ? JSON.parse(raw) : [];
    } catch {
      acc[role] = [];
    }
    return acc;
  }, {} as Record<string, JourneyStep[]>);

  const availableRoles = roles.filter(r => personas[r]);

  if (availableRoles.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-cyan-50 dark:from-slate-950 dark:to-slate-900 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <Button variant="outline" onClick={() => navigate("/home")} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />Retour
          </Button>
          <Card className="text-center py-16">
            <CardContent>
              <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-700 mb-2">Aucune donnée à analyser</h2>
              <p className="text-gray-500 mb-6">Créez et sauvegardez des personas pour accéder au dashboard analytics.</p>
              <Button onClick={() => navigate("/persona")}>Créer un Persona</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Common pain points
  const frustrationTexts = availableRoles.map(r => personas[r].frustrations);
  const commonFrustrations = findCommonTerms(frustrationTexts);

  // Common needs
  const needTexts = availableRoles.map(r => personas[r].needs);
  const commonNeeds = findCommonTerms(needTexts);

  // Tech savviness comparison
  const techData = availableRoles.map(role => ({
    role,
    level: personas[role].techSavvy?.split(" - ")[0] || "N/A",
    score: personas[role].techSavvy?.includes("Expert") ? 5 :
           personas[role].techSavvy?.includes("Avancé") ? 4 :
           personas[role].techSavvy?.includes("Moyen") ? 3 :
           personas[role].techSavvy?.includes("Basique") ? 2 : 1,
  }));

  // Device usage
  const deviceMap: Record<string, number> = {};
  for (const role of availableRoles) {
    const devices = personas[role].devices?.toLowerCase() || "";
    if (devices.includes("iphone") || devices.includes("android")) deviceMap["Mobile"] = (deviceMap["Mobile"] || 0) + 1;
    if (devices.includes("macbook") || devices.includes("pc") || devices.includes("dell") || devices.includes("laptop")) deviceMap["Laptop/PC"] = (deviceMap["Laptop/PC"] || 0) + 1;
    if (devices.includes("ipad") || devices.includes("tablette")) deviceMap["Tablette"] = (deviceMap["Tablette"] || 0) + 1;
  }
  const deviceData = Object.entries(deviceMap).map(([name, value]) => ({ name, value }));
  const DEVICE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

  // Time on system comparison
  const timeData = availableRoles.map(role => {
    const raw = personas[role].timeSpentOnSystem || "";
    const match = raw.match(/(\d+)/);
    return {
      role,
      minutes: match ? parseInt(match[1]) : 0,
      raw,
    };
  });

  // Journey bottlenecks
  const maxSteps = Math.max(
    0,
    ...availableRoles.map((role) => journeyByRole[role]?.length ?? 0)
  );
  const negativeSteps = Array.from({ length: maxSteps }, (_, idx) => {
    const entries = availableRoles
      .map((role) => ({ role, step: journeyByRole[role]?.[idx] }))
      .filter((x) => x.step);
    if (entries.length === 0) return null;
    const allNegative = entries.every((x) => (x.step?.emotion ?? 0) < 0);
    if (!allNegative) return null;
    const avgEmotion =
      entries.reduce((sum, x) => sum + (x.step?.emotion ?? 0), 0) / entries.length;
    return {
      title: entries[0].step?.title ?? `Étape ${idx + 1}`,
      description: entries[0].step?.description ?? "",
      opportunity: entries.map((x) => `${x.role}: ${x.step?.opportunity ?? "N/A"}`).join(" | "),
      emotion: Number(avgEmotion.toFixed(1)),
    };
  })
    .filter((x): x is { title: string; description: string; opportunity: string; emotion: number } => !!x)
    .sort((a, b) => a.emotion - b.emotion);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-cyan-50 dark:from-slate-950 dark:to-slate-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <Button variant="outline" onClick={() => navigate("/home")}>
            <ArrowLeft className="w-4 h-4 mr-2" />Retour
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold flex items-center gap-2 justify-center">
              <BarChart3 className="w-6 h-6" />
              Analytics — {school.name}
            </h1>
            <p className="text-sm text-muted-foreground">Insights agrégés à partir de {availableRoles.length} personas</p>
          </div>
          <div />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Common Frustrations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-5 h-5" />
                Points de douleur communs
              </CardTitle>
            </CardHeader>
            <CardContent>
              {commonFrustrations.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {commonFrustrations.map((term, i) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-red-50 text-red-700 text-sm border border-red-200 font-medium">{term}</span>
                    ))}
                  </div>
                  <div className="mt-4 space-y-2">
                    {availableRoles.map(role => (
                      <div key={role} className="text-xs">
                        <span className="font-semibold" style={{ color: ROLE_COLORS[role] }}>{role}:</span>
                        <span className="text-gray-600 ml-1">{personas[role].frustrations?.split("\n")[0] || "N/A"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">Pas assez de données pour détecter des thèmes communs.</p>
              )}
            </CardContent>
          </Card>

          {/* Common Needs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Lightbulb className="w-5 h-5" />
                Besoins convergents
              </CardTitle>
            </CardHeader>
            <CardContent>
              {commonNeeds.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {commonNeeds.map((term, i) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm border border-blue-200 font-medium">{term}</span>
                    ))}
                  </div>
                  <div className="mt-4 space-y-2">
                    {availableRoles.map(role => (
                      <div key={role} className="text-xs">
                        <span className="font-semibold" style={{ color: ROLE_COLORS[role] }}>{role}:</span>
                        <span className="text-gray-600 ml-1">{personas[role].needs?.split("\n")[0] || "N/A"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">Pas assez de données pour détecter des thèmes communs.</p>
              )}
            </CardContent>
          </Card>

          {/* Tech Profile Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Profil Technologique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={techData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="role" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.[0]) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="bg-white border rounded-lg shadow p-2 text-xs">
                          <p className="font-semibold">{d.role}</p>
                          <p>{d.level}</p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="score" name="Aisance tech">
                    {techData.map((entry, i) => (
                      <Cell key={i} fill={ROLE_COLORS[entry.role] ?? "#666"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Device Usage */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Appareils utilisés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="w-full md:w-1/2 h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={deviceData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name }) => name}>
                      {deviceData.map((_, i) => (
                        <Cell key={i} fill={DEVICE_COLORS[i % DEVICE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 w-full md:w-1/2">
                  {availableRoles.map(role => (
                    <div key={role} className="text-xs">
                      <span className="font-semibold" style={{ color: ROLE_COLORS[role] }}>{role}:</span>
                      <span className="text-gray-600 ml-1">{personas[role].devices || "N/A"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Time on System */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Temps sur le système (min/jour)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={timeData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="role" type="category" tick={{ fontSize: 12 }} width={100} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.[0]) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="bg-white border rounded-lg shadow p-2 text-xs">
                          <p className="font-semibold">{d.role}</p>
                          <p>{d.raw}</p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="minutes" name="Minutes/jour">
                    {timeData.map((entry, i) => (
                      <Cell key={i} fill={ROLE_COLORS[entry.role] ?? "#666"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Journey Bottlenecks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <AlertTriangle className="w-5 h-5" />
                Bottlenecks émotionnels (Journey Map)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {negativeSteps.length > 0 ? (
                <div className="space-y-3">
                  {negativeSteps.slice(0, 5).map((step, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-orange-50 border border-orange-100">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        step.emotion <= -3 ? "bg-red-500" : "bg-orange-400"
                      }`}>
                        {step.emotion}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-800">{step.title}</p>
                        <p className="text-xs text-gray-500">{step.description?.substring(0, 80)}</p>
                        {step.opportunity && <p className="text-xs text-green-600 mt-1">Opportunité: {step.opportunity}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">Aucune étape négative dans la Journey Map.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Consensus Must-Haves */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Lightbulb className="w-5 h-5" />
              Must-Haves par rôle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {availableRoles.map(role => {
                const p = personas[role];
                return (
                  <div key={role}>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: ROLE_COLORS[role] }} />
                      {role}
                    </h4>
                    <ul className="space-y-1">
                      {p.needs?.split("\n").filter(Boolean).slice(0, 5).map((n, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-green-500 flex-shrink-0 mt-0.5">&#10003;</span>{n}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
