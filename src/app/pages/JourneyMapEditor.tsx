import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Slider } from "../components/ui/slider";
import { ArrowLeft, Save, Plus, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { getActiveSchool, personaKey, journeyKey, journeyKeyByRole } from "../lib/schoolStore";
import { useAutosave } from "../lib/useAutosave";
import { SaveStatus } from "../components/SaveStatus";
import type { JourneyStep } from "../lib/types";
import { useDocumentMeta } from "../lib/useDocumentMeta";

// ─── Role-specific default steps ─────────────────────────────────────────────

const DEFAULT_STEPS_ETUDIANT: JourneyStep[] = [
  { id: "1", title: "Première connexion mobile", description: "L'étudiant télécharge l'app et se connecte pour la première fois avec ses identifiants campus", emotion: 3, touchpoint: "App mobile / Accueil", opportunity: "Onboarding guidé et tutoriel interactif" },
  { id: "2", title: "Découverte de l'emploi du temps", description: "Consultation du planning hebdomadaire avec salles, enseignants et codes de couleur par matière", emotion: 7, touchpoint: "Onglet EDT", opportunity: "Widget sur écran d'accueil du téléphone" },
  { id: "3", title: "Signature émargement (QR code)", description: "Scan rapide du QR code projeté par le prof en début de cours — validation instantanée en 10 secondes", emotion: 8, touchpoint: "Scanner in-app", opportunity: "Géolocalisation automatique en backup" },
  { id: "4", title: "Notification changement de salle", description: "Alerte push reçue la veille pour annonce de changement de salle — perturbation du planning", emotion: -2, touchpoint: "Notification push", opportunity: "Carte interactive du campus avec itinéraire" },
  { id: "5", title: "Vérification des notes", description: "Consultation des résultats du partiel de marketing — le prof a publié la nuit", emotion: 4, touchpoint: "Onglet Notes", opportunity: "Notification dès publication + graphique évolution" },
  { id: "6", title: "Téléchargement attestation scolarité", description: "Génération et téléchargement de l'attestation pour la CAF — document disponible immédiatement", emotion: 9, touchpoint: "Espace documents", opportunity: "Partage direct vers email / administration" },
  { id: "7", title: "Contact avec l'administration", description: "Demande de justification d'absence par message intégré — réponse reçue en 2h", emotion: 5, touchpoint: "Messagerie intégrée", opportunity: "Chatbot FAQ pour réponses instantanées" },
  { id: "8", title: "Suivi des absences restantes", description: "Vue du compteur d'absences par matière — encore 2 absences avant convocation automatique", emotion: -3, touchpoint: "Dashboard étudiant", opportunity: "Alerte préventive avant seuil critique" }
];

const DEFAULT_STEPS_ENSEIGNANT: JourneyStep[] = [
  { id: "1", title: "Connexion portail enseignant", description: "Ouverture du portail depuis l'iPad avant d'entrer en cours — chargement rapide", emotion: 2, touchpoint: "Portail web / App tablette", opportunity: "Mode hors-ligne pour salles sans WiFi stable" },
  { id: "2", title: "Vue du planning hebdomadaire", description: "Consultation de la semaine : classes, salles, horaires et collègues partagés — tout en un coup d'oeil", emotion: 5, touchpoint: "Calendrier enseignant", opportunity: "Synchronisation Google Calendar / Outlook" },
  { id: "3", title: "Émargement en classe (bug)", description: "Tentative de valider la présence des 25 étudiants — le système plante, il faut refaire manuellement", emotion: -7, touchpoint: "Module émargement tablette", opportunity: "Mode offline avec synchronisation différée" },
  { id: "4", title: "Dépôt du support de cours", description: "Upload du PDF du cours sur le portail — étudiants notifiés automatiquement", emotion: 4, touchpoint: "Gestionnaire documents", opportunity: "Glisser-déposer multi-fichiers avec tags auto" },
  { id: "5", title: "Saisie des notes (fastidieuse)", description: "Entrée manuelle des 25 notes de partiel — pas d'import Excel, copier-coller impossible", emotion: -8, touchpoint: "Module notes", opportunity: "Import Excel + calcul automatique moyennes" },
  { id: "6", title: "Message aux étudiants", description: "Envoi d'une annonce à toute la classe pour report de la soutenance — reçue instantanément", emotion: 6, touchpoint: "Messagerie groupée", opportunity: "Modèles de messages réutilisables" },
  { id: "7", title: "Consultation rapport de classe", description: "Tableau de bord automatique : assiduité, moyennes, distribution des notes par classe", emotion: 7, touchpoint: "Dashboard enseignant", opportunity: "Détection automatique élèves en difficulté" },
  { id: "8", title: "Validation des justificatifs", description: "Traitement des 6 justificatifs d'absence reçus cette semaine — workflow clair et rapide", emotion: 3, touchpoint: "Module absences", opportunity: "Validation en 1 clic avec archivage automatique" }
];

const DEFAULT_STEPS_ADMIN: JourneyStep[] = [
  { id: "1", title: "Connexion matin (7h45)", description: "Ouverture du tableau de bord double écran — vue instantanée des alertes du jour", emotion: 6, touchpoint: "Dashboard admin", opportunity: "Résumé email automatique la veille au soir" },
  { id: "2", title: "Alertes absences anormales", description: "3 étudiants absents depuis 5+ jours — alertes automatiques déclenchées, mails envoyés", emotion: 7, touchpoint: "Module surveillance absences", opportunity: "Intégration contact famille en un clic" },
  { id: "3", title: "Modification emploi du temps urgente", description: "Professeur malade → chercher remplaçant + modifier EDT + notifier 3 classes — 45 minutes de travail", emotion: -6, touchpoint: "Éditeur EDT", opportunity: "IA suggestion de remplacement + notif auto" },
  { id: "4", title: "Traitement des justificatifs", description: "20 justificatifs reçus cette semaine — traitement individuel sans workflow clair, très chronophage", emotion: -4, touchpoint: "Boîte mail + Ypareo", opportunity: "Workflow intégré avec validation en masse" },
  { id: "5", title: "Génération des bulletins (mi-semestre)", description: "Édition de 240 bulletins manuellement — processus qui prend toute une journée complète", emotion: -9, touchpoint: "Module bulletins Ypareo", opportunity: "Génération automatique en 5 minutes, batch" },
  { id: "6", title: "Réponse aux demandes d'attestations", description: "15 attestations générées automatiquement depuis le portail — plus de traitement manuel", emotion: 8, touchpoint: "Module attestations auto", opportunity: "Portail étudiant en libre-service 24h/7j" },
  { id: "7", title: "Rapport pour la direction", description: "Extraction des KPI hebdomadaires — données centralisées, rapport généré en 3 clics", emotion: 7, touchpoint: "Module reporting", opportunity: "Tableau de bord direction en temps réel" },
  { id: "8", title: "Gestion conflits étudiants-prof", description: "Médiation sur contestation de note — historique complet consultable, processus tracé", emotion: 2, touchpoint: "Dossier étudiant", opportunity: "Journal de bord numérique avec signature" }
];

function getDefaultSteps(role: string): JourneyStep[] {
  if (role === "Enseignant") return DEFAULT_STEPS_ENSEIGNANT;
  if (role === "Administration") return DEFAULT_STEPS_ADMIN;
  return DEFAULT_STEPS_ETUDIANT;
}

function getEmotionColor(emotion: number) {
  if (emotion > 5) return "bg-green-500";
  if (emotion > 0) return "bg-green-300";
  if (emotion === 0) return "bg-yellow-400";
  if (emotion > -5) return "bg-orange-400";
  return "bg-red-500";
}

function getEmotionLabel(emotion: number) {
  if (emotion > 7) return "😄 Très positif";
  if (emotion > 4) return "😊 Positif";
  if (emotion > 0) return "🙂 Légèrement positif";
  if (emotion === 0) return "😐 Neutre";
  if (emotion > -4) return "😕 Légèrement négatif";
  if (emotion > -7) return "😟 Négatif";
  return "😢 Très négatif";
}

// ─── Step Card — defined outside to avoid remount ────────────────────────────

interface StepCardProps {
  step: JourneyStep;
  index: number;
  onUpdate: (id: string, field: keyof JourneyStep, value: any) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

function StepCard({ step, index, onUpdate, onRemove, canRemove }: StepCardProps) {
  return (
    <Card className="relative">
      <CardContent className="pt-5">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm">
              {index + 1}
            </div>
          </div>

          <div className="flex-1 grid md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor={`title-${step.id}`} className="text-xs">Étape / Moment</Label>
              <Input
                id={`title-${step.id}`}
                value={step.title}
                onChange={e => onUpdate(step.id, "title", e.target.value)}
                placeholder="Titre de l'étape"
              />
            </div>
            <div>
              <Label htmlFor={`desc-${step.id}`} className="text-xs">Description détaillée</Label>
              <Input
                id={`desc-${step.id}`}
                value={step.description}
                onChange={e => onUpdate(step.id, "description", e.target.value)}
                placeholder="Ce qui se passe, comment l'utilisateur vit ce moment..."
              />
            </div>
            <div>
              <Label htmlFor={`touch-${step.id}`} className="text-xs">Point de contact (touchpoint)</Label>
              <Input
                id={`touch-${step.id}`}
                value={step.touchpoint ?? ""}
                onChange={e => onUpdate(step.id, "touchpoint", e.target.value)}
                placeholder="Ex: App mobile, Portail web, Email..."
              />
            </div>
            <div>
              <Label htmlFor={`opp-${step.id}`} className="text-xs">Opportunité d'amélioration</Label>
              <Input
                id={`opp-${step.id}`}
                value={step.opportunity ?? ""}
                onChange={e => onUpdate(step.id, "opportunity", e.target.value)}
                placeholder="Ex: Notification automatique, Import Excel..."
              />
            </div>
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs">Émotion : <span className="font-bold">{step.emotion > 0 ? "+" : ""}{step.emotion}</span> — {getEmotionLabel(step.emotion)}</Label>
                <div className={`px-3 py-1 rounded-full text-white text-xs font-bold ${getEmotionColor(step.emotion)}`}>
                  {step.emotion > 0 ? "+" : ""}{step.emotion}
                </div>
              </div>
              <Slider
                value={[step.emotion]}
                onValueChange={v => onUpdate(step.id, "emotion", v[0])}
                min={-10}
                max={10}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>😢 -10</span><span>😐 0</span><span>😄 +10</span>
              </div>
            </div>
          </div>

          {canRemove && (
            <Button variant="ghost" size="icon" onClick={() => onRemove(step.id)} className="flex-shrink-0">
              <Trash2 className="w-4 h-4 text-red-600" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function JourneyMapEditor() {
  const navigate = useNavigate();
  const school = getActiveSchool();
  useDocumentMeta({
    title: "Journey Map | EduSystemDesign",
    description: "Cartographie du parcours utilisateur",
    robots: "noindex,nofollow",
  });

  // Read active persona role from localStorage
  const currentPersona = (() => {
    try {
      const raw = localStorage.getItem(personaKey(school.id));
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  })();
  const currentRole: string = currentPersona?.role ?? "Étudiant";

  const roleStorageKey = journeyKeyByRole(school.id, currentRole);
  const legacyStorageKey = journeyKey(school.id);

  const [steps, setSteps] = useState<JourneyStep[]>(() => {
    const roleSaved = localStorage.getItem(roleStorageKey);
    if (roleSaved) return JSON.parse(roleSaved);
    const legacySaved = localStorage.getItem(legacyStorageKey);
    return legacySaved ? JSON.parse(legacySaved) : getDefaultSteps(currentRole);
  });

  const { status: autosaveStatus, forceSave } = useAutosave(roleStorageKey, steps);

  const handleSave = () => {
    forceSave();
    toast.success("Journey Map sauvegardée !", { duration: 6000 });
  };

  const handleNext = () => { handleSave(); navigate("/poster"); };

  const addStep = () => {
    setSteps(prev => [...prev, {
      id: Date.now().toString(),
      title: "Nouvelle étape",
      description: "",
      emotion: 0,
      touchpoint: "",
      opportunity: ""
    }]);
  };

  const removeStep = (id: string) => setSteps(prev => prev.filter(s => s.id !== id));

  const updateStep = (id: string, field: keyof JourneyStep, value: any) =>
    setSteps(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));

  const resetToDefaults = () => {
    const defaults = getDefaultSteps(currentRole);
    setSteps(defaults);
    toast.success(`Journey Map réinitialisée pour le rôle : ${currentRole}`, { duration: 6000 });
  };

  const roleColor = currentRole === "Étudiant" ? "from-blue-600 to-blue-800"
    : currentRole === "Enseignant" ? "from-green-600 to-teal-800"
    : "from-purple-600 to-indigo-800";

  const avgEmotion = steps.length ? (steps.reduce((a, s) => a + s.emotion, 0) / steps.length).toFixed(1) : "0";
  const minStep = steps.length ? steps.reduce((a, s) => s.emotion < a.emotion ? s : a) : null;
  const maxStep = steps.length ? steps.reduce((a, s) => s.emotion > a.emotion ? s : a) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <Button variant="outline" onClick={() => navigate("/home")}>
            <ArrowLeft className="w-4 h-4 mr-2" />Retour
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold">Mission 2 : Journey Map</h1>
            <p className="text-sm text-muted-foreground">Nouveau Système de Gestion {school.name}</p>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <SaveStatus status={autosaveStatus} />
            <Button onClick={resetToDefaults} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Templates {currentRole}</span>
            </Button>
            <Button onClick={handleSave} variant="outline" className="gap-2">
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Sauvegarder</span>
            </Button>
            <Button onClick={addStep} className="gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Ajouter</span>
            </Button>
          </div>
        </div>

        {/* Role Banner */}
        <div className={`bg-gradient-to-r ${roleColor} text-white rounded-xl p-4 mb-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-lg">
                {currentRole === "Étudiant" && "👨‍🎓"} {currentRole === "Enseignant" && "👨‍🏫"} {currentRole === "Administration" && "🏢"}
                {" "}Parcours utilisateur — {currentRole}
                {currentPersona?.name ? ` (${currentPersona.name})` : ""}
              </p>
              <p className="text-sm opacity-80 mt-0.5">
                {school.name} · {steps.length} étapes tracées
                {currentRole === "Étudiant" && " · De la connexion à la génération de document"}
                {currentRole === "Enseignant" && " · De la connexion à la validation des justificatifs"}
                {currentRole === "Administration" && " · Du tableau de bord matinal à la gestion des conflits"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{parseFloat(avgEmotion) > 0 ? "+" : ""}{avgEmotion}</p>
              <p className="text-xs opacity-70">Émotion moyenne</p>
            </div>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="py-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Moment le plus positif</p>
              <p className="font-bold text-green-700 text-sm">{maxStep?.title ?? "—"}</p>
              <p className="text-2xl font-bold text-green-600">{maxStep ? `+${maxStep.emotion}` : "—"}</p>
            </CardContent>
          </Card>
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="py-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Score moyen de satisfaction</p>
              <p className="text-2xl font-bold text-blue-600">{parseFloat(avgEmotion) > 0 ? "+" : ""}{avgEmotion}</p>
              <p className="text-xs text-muted-foreground">sur {steps.length} étapes</p>
            </CardContent>
          </Card>
          <Card className="border-red-200 bg-red-50">
            <CardContent className="py-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Point de friction majeur</p>
              <p className="font-bold text-red-700 text-sm">{minStep?.title ?? "—"}</p>
              <p className="text-2xl font-bold text-red-600">{minStep?.emotion ?? "—"}</p>
            </CardContent>
          </Card>
        </div>

        {/* Steps */}
        <div className="space-y-3 mb-6">
          {steps.map((step, index) => (
            <StepCard
              key={step.id}
              step={step}
              index={index}
              onUpdate={updateStep}
              onRemove={removeStep}
              canRemove={steps.length > 1}
            />
          ))}
        </div>

        {/* Emotion Curve Visualization */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📈 Courbe d'émotion — {currentRole}
              {currentPersona?.name ? ` (${currentPersona.name})` : ""}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Custom curve */}
            <div className="relative h-64 border-b-2 border-l-2 border-border mb-4 ml-6 sm:ml-8">
              {/* Grid lines */}
              {[-10, -5, 0, 5, 10].map(val => (
                <div
                  key={val}
                  className="absolute left-0 right-0 border-t border-dashed border-gray-200"
                  style={{ bottom: `${((val + 10) / 20) * 100}%` }}
                >
                  <span className="absolute -left-6 sm:-left-8 -translate-y-1/2 text-xs text-muted-foreground w-6 text-right">{val}</span>
                </div>
              ))}
              {/* Zero line highlighted */}
              <div className="absolute left-0 right-0 border-t-2 border-muted-foreground/50" style={{ bottom: "50%" }} />

              {/* SVG curve */}
              <svg className="absolute inset-0 w-full h-full overflow-visible">
                {steps.map((step, i) => {
                  if (i === 0) return null;
                  const prev = steps[i - 1];
                  const x1 = ((i - 1) / (steps.length - 1)) * 100;
                  const y1 = 100 - ((prev.emotion + 10) / 20) * 100;
                  const x2 = (i / (steps.length - 1)) * 100;
                  const y2 = 100 - ((step.emotion + 10) / 20) * 100;
                  return (
                    <line
                      key={step.id}
                      x1={`${x1}%`} y1={`${y1}%`}
                      x2={`${x2}%`} y2={`${y2}%`}
                      stroke={step.emotion > 0 ? "#22c55e" : step.emotion === 0 ? "#eab308" : "#ef4444"}
                      strokeWidth="2.5"
                    />
                  );
                })}
                {steps.map((step, i) => {
                  const x = (i / Math.max(steps.length - 1, 1)) * 100;
                  const y = 100 - ((step.emotion + 10) / 20) * 100;
                  return (
                    <circle
                      key={step.id}
                      cx={`${x}%`} cy={`${y}%`} r="5"
                      fill={step.emotion > 0 ? "#22c55e" : step.emotion === 0 ? "#eab308" : "#ef4444"}
                      stroke="white" strokeWidth="2"
                    />
                  );
                })}
              </svg>

              {/* Step labels */}
              {steps.map((step, i) => {
                const x = (i / Math.max(steps.length - 1, 1)) * 100;
                return (
                  <div
                    key={step.id}
                    className="absolute bottom-[-2.5rem] transform -translate-x-1/2 text-[10px] sm:text-xs text-muted-foreground text-center w-16 leading-tight"
                    style={{ left: `${x}%` }}
                  >
                    {step.title.length > 14 ? step.title.substring(0, 11) + "..." : step.title}
                  </div>
                );
              })}
            </div>
            <div className="mt-12 flex flex-wrap justify-between gap-2 text-xs text-muted-foreground px-2">
              <span>😢 Très négatif (-10)</span>
              <span>😐 Neutre (0)</span>
              <span>😄 Très positif (+10)</span>
            </div>

            {/* Opportunities highlight */}
            {steps.some(s => s.opportunity) && (
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-xs font-bold text-yellow-800 mb-2">💡 Opportunités d'amélioration identifiées</p>
                <div className="space-y-1">
                  {steps.filter(s => s.opportunity && s.emotion < 0).map((s, i) => (
                    <p key={i} className="text-xs text-gray-700">
                      <span className="font-semibold text-red-600">Étape "{s.title}"</span> ({s.emotion}) → {s.opportunity}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleNext} size="lg">
            Voir le Poster Final →
          </Button>
        </div>
      </div>
    </div>
  );
}
