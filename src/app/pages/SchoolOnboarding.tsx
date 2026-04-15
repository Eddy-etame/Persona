import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { ArrowLeft, ArrowRight, Save, Building2, Users, BookOpen, Monitor, Settings, Heart, Target, Layers, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { School, saveSchool, setActiveSchoolId, generateSchoolId, SCHOOL_TYPES, COUNTRIES } from "../lib/schoolStore";

// ─── Field helpers (defined outside to avoid focus loss) ─────────────────────

function FF({
  label, value, onChange, placeholder, rows, hint
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; rows?: number; hint?: string;
}) {
  return (
    <div>
      <Label className="mb-1 block text-sm font-medium">{label}</Label>
      {hint && <p className="text-xs text-gray-500 mb-1">{hint}</p>}
      {rows ? (
        <Textarea placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} rows={rows} />
      ) : (
        <Input placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
      )}
    </div>
  );
}

function FS({
  label, value, onChange, options, placeholder
}: {
  label: string; value: string; onChange: (v: string) => void;
  options: string[]; placeholder?: string;
}) {
  return (
    <div>
      <Label className="mb-1 block text-sm font-medium">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger><SelectValue placeholder={placeholder ?? "Choisir..."} /></SelectTrigger>
        <SelectContent>
          {options.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}

// ─── Steps ────────────────────────────────────────────────────────────────────

const STEPS = [
  { id: "identity", label: "Identité", icon: Building2, color: "blue" },
  { id: "scale", label: "Effectifs", icon: Users, color: "green" },
  { id: "academic", label: "Pédagogie", icon: BookOpen, color: "purple" },
  { id: "current", label: "Système actuel", icon: Monitor, color: "orange" },
  { id: "workflows", label: "Processus", icon: Settings, color: "teal" },
  { id: "users", label: "Utilisateurs", icon: Users, color: "pink" },
  { id: "tech", label: "Infrastructure", icon: Layers, color: "indigo" },
  { id: "vision", label: "Vision & Besoins", icon: Target, color: "red" },
  { id: "culture", label: "Culture & Valeurs", icon: Heart, color: "rose" },
];

const EMPTY: School = {
  id: "", name: "", shortName: "", country: "France", city: "", type: "", foundingYear: "",
  accreditation: "", website: "", logo: undefined, isDemo: false,
  totalStudents: "", totalTeachers: "", totalAdminStaff: "", campusCount: "1",
  campusLocations: "", departments: "", organizationStructure: "",
  programs: "", degreeLevels: "", teachingModality: "", academicCalendar: "",
  gradingSystem: "", teachingLanguages: "", alternancePercent: "", internationalPercent: "",
  internshipRequired: "", researchActivity: "",
  currentSoftware: "", currentSoftwareSince: "", currentPainPoints: "", currentStrengths: "",
  budget: "", implementationTimeline: "", decisionMakers: "",
  attendanceMethod: "", gradeManagement: "", scheduleManagement: "", studentComm: "",
  docManagement: "", reportingNeeds: "", examOrganization: "", stageManagement: "",
  adminRoles: "", teacherRoles: "", studentNeeds: "", externalStakeholders: "", studentPopulation: "",
  internetInfra: "", mobileUsage: "", existingIntegrations: "", securityReqs: "",
  gdprNeeds: "", accessibilityNeeds: "", onlineTeaching: "",
  primaryGoals: "", successMetrics: "", constraints: "", mustHave: "", niceToHave: "",
  dealBreakers: "", teachingPhilosophy: "", values: "", challenges: "",
  specificRequirements: "", competitorSystems: ""
};

export function SchoolOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [school, setSchool] = useState<School>({ ...EMPTY, id: generateSchoolId() });

  const u = (field: keyof School, value: string) =>
    setSchool(prev => ({ ...prev, [field]: value }));

  const handleSave = () => {
    if (!school.name.trim()) {
      toast.error("Le nom de l'établissement est obligatoire.");
      setStep(0);
      return;
    }
    const finalSchool = {
      ...school,
      shortName: school.shortName || school.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 5)
    };
    saveSchool(finalSchool);
    setActiveSchoolId(finalSchool.id);
    toast.success(`${finalSchool.name} configuré avec succès !`);
    navigate("/home");
  };

  const goNext = () => {
    if (step === 0 && !school.name.trim()) {
      toast.error("Le nom de l'établissement est obligatoire.");
      return;
    }
    if (step < STEPS.length - 1) setStep(step + 1);
    else handleSave();
  };

  const goPrev = () => {
    if (step > 0) setStep(step - 1);
    else navigate("/");
  };

  const progress = Math.round(((step + 1) / STEPS.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">

      {/* Top Bar */}
      <div className="bg-white border-b shadow-sm px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={goPrev} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            {step === 0 ? "Retour" : "Précédent"}
          </Button>
          <div className="text-center">
            <p className="text-sm text-gray-500">Étape {step + 1} / {STEPS.length}</p>
            <p className="font-semibold text-gray-900">{STEPS[step].label}</p>
          </div>
          <Button variant="outline" onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            Sauvegarder
          </Button>
        </div>
        {/* Progress bar */}
        <div className="max-w-4xl mx-auto mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step Pills */}
      <div className="bg-white border-b overflow-x-auto">
        <div className="max-w-4xl mx-auto px-6 py-3 flex gap-2 min-w-max">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setStep(i)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                i === step
                  ? "bg-blue-600 text-white"
                  : i < step
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {i < step ? <CheckCircle2 className="w-3 h-3" /> : <s.icon className="w-3 h-3" />}
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* ── STEP 0 : IDENTITÉ ── */}
        {step === 0 && (
          <div className="space-y-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Building2 className="w-7 h-7 text-blue-600" />
                Identité de l'établissement
              </h2>
              <p className="text-gray-500 mt-1">Ces informations seront utilisées dans tout le système pour personnaliser l'expérience.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <FF label="Nom complet de l'établissement *" value={school.name} onChange={v => u("name", v)}
                  placeholder="Ex: Université Paris-Saclay, École de Commerce de Lyon, IUT de Grenoble..." />
              </div>
              <FF label="Nom court / Sigle" value={school.shortName} onChange={v => u("shortName", v)}
                placeholder="Ex: UPS, ECL, IUT-G (généré automatiquement si vide)" />
              <FF label="Site web" value={school.website} onChange={v => u("website", v)}
                placeholder="Ex: https://www.paris-saclay.fr" />
              <FS label="Pays" value={school.country} onChange={v => u("country", v)} options={COUNTRIES} />
              <FF label="Ville principale" value={school.city} onChange={v => u("city", v)}
                placeholder="Ex: Paris, Lyon, Toulouse, Bruxelles..." />
              <div className="md:col-span-2">
                <FS label="Type d'établissement" value={school.type} onChange={v => u("type", v)} options={SCHOOL_TYPES} />
              </div>
              <FF label="Année de fondation" value={school.foundingYear} onChange={v => u("foundingYear", v)}
                placeholder="Ex: 1968, 2005..." />
              <FF label="Accréditations / Certifications" value={school.accreditation} onChange={v => u("accreditation", v)}
                placeholder="Ex: AACSB, EQUIS, AMBA, RNCP, CTI, France Compétences..." />
            </div>

            <Card className="bg-blue-50 border-blue-200 mt-4">
              <CardContent className="py-4">
                <p className="text-blue-800 text-sm font-medium">💡 Pourquoi ces infos ?</p>
                <p className="text-blue-700 text-xs mt-1">
                  Le nom de votre établissement apparaîtra dans toutes les pages du système :
                  "Nouveau Système de Gestion {school.name || "[Nom de l'école]"}", les personas, journey maps et posters
                  seront automatiquement personnalisés avec le contexte de votre école.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── STEP 1 : EFFECTIFS ── */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Users className="w-7 h-7 text-green-600" />
                Effectifs & Organisation
              </h2>
              <p className="text-gray-500 mt-1">Comprendre l'échelle et la structure pour calibrer le système.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <FF label="Nombre total d'étudiants" value={school.totalStudents} onChange={v => u("totalStudents", v)}
                placeholder="Ex: ~500, 2000-2500, moins de 200..." />
              <FF label="Nombre d'enseignants / formateurs" value={school.totalTeachers} onChange={v => u("totalTeachers", v)}
                placeholder="Ex: 25 (CDI + vacataires), environ 80 enseignants-chercheurs..." />
              <FF label="Nombre de personnels administratifs" value={school.totalAdminStaff} onChange={v => u("totalAdminStaff", v)}
                placeholder="Ex: 8 personnes (direction, scolarité, RH, comptabilité...)" />
              <FF label="Nombre de campus / sites" value={school.campusCount} onChange={v => u("campusCount", v)}
                placeholder="Ex: 1, 2, 5 campus régionaux..." />
              <div className="md:col-span-2">
                <FF label="Localisation(s) des campus" value={school.campusLocations} onChange={v => u("campusLocations", v)}
                  placeholder="Ex: Campus principal Lyon Part-Dieu, Site annexe Villeurbanne, Centre formation continue"
                  rows={2} />
              </div>
              <div className="md:col-span-2">
                <FF label="Départements / UFR / Pôles pédagogiques" value={school.departments} onChange={v => u("departments", v)}
                  placeholder="Ex: UFR Sciences, UFR Lettres, Pôle Commerce, Pôle Ingénierie, École Doctorale..."
                  rows={3} hint="Listez les grandes divisions académiques de votre établissement" />
              </div>
              <div className="md:col-span-2">
                <FF label="Structure organisationnelle" value={school.organizationStructure} onChange={v => u("organizationStructure", v)}
                  placeholder="Ex: Président → VP Formation → Directeurs d'UFR → Responsables de formation → Équipes pédagogiques"
                  rows={2} hint="Décrivez la hiérarchie et qui décide quoi" />
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2 : PÉDAGOGIE ── */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <BookOpen className="w-7 h-7 text-purple-600" />
                Offre Pédagogique & Programmes
              </h2>
              <p className="text-gray-500 mt-1">Ces informations permettent de créer des personas et journey maps spécifiques à votre offre.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <FF label="Formations / Diplômes proposés" value={school.programs} onChange={v => u("programs", v)}
                  placeholder="Ex: Licence Économie-Gestion, Master Finance, DUT Informatique, BTS MCO, MBA International, Doctorat Sciences..."
                  rows={3} hint="Listez toutes les formations, séparées par des virgules" />
              </div>
              <FF label="Niveaux de diplômes (nomenclature)" value={school.degreeLevels} onChange={v => u("degreeLevels", v)}
                placeholder="Ex: Bac+2 (BTS/DUT), Bac+3 (Licence/Bachelor), Bac+5 (Master/Mastère), Bac+8 (Doctorat)" />
              <FS label="Modalité principale d'enseignement" value={school.teachingModality} onChange={v => u("teachingModality", v)}
                options={["100% Présentiel", "Majoritairement présentiel (quelques hybrides)", "Hybride équilibré (50/50)", "Majoritairement distanciel", "100% Distanciel / E-learning", "Variable selon les formations"]} />
              <FS label="Calendrier académique" value={school.academicCalendar} onChange={v => u("academicCalendar", v)}
                options={["Semestriel (2 semestres/an)", "Trimestriel (3 trimestres/an)", "Annuel (une session)", "Modulaire (modules séquentiels)", "Continue (entrées permanentes)"]} />
              <FS label="Système de notation" value={school.gradingSystem} onChange={v => u("gradingSystem", v)}
                options={["Notes sur 20 (système français)", "Crédits ECTS + notes sur 20", "Crédits ECTS + lettres (A-F)", "Compétences (acquis / non acquis)", "Mixte (ECTS + notes + compétences)"]} />
              <FF label="Langues d'enseignement" value={school.teachingLanguages} onChange={v => u("teachingLanguages", v)}
                placeholder="Ex: Français (90%), Anglais (10%) / Bilingue Français-Anglais / 100% Anglais pour Masters internationaux" />
              <FF label="Part de l'alternance / apprentissage (%)" value={school.alternancePercent} onChange={v => u("alternancePercent", v)}
                placeholder="Ex: 60% des étudiants en apprentissage / Aucune alternance / 100% formation initiale" />
              <FF label="Part d'étudiants internationaux (%)" value={school.internationalPercent} onChange={v => u("internationalPercent", v)}
                placeholder="Ex: 30% d'étudiants étrangers, dont 15% en Erasmus" />
              <FF label="Stages obligatoires ?" value={school.internshipRequired} onChange={v => u("internshipRequired", v)}
                placeholder="Ex: Oui, 6 mois obligatoires en L3 et M2 / Non / Optionnel" />
              <FF label="Activité de recherche" value={school.researchActivity} onChange={v => u("researchActivity", v)}
                placeholder="Ex: 12 laboratoires de recherche, 200 doctorants / Aucune / Appliquée uniquement" />
            </div>
          </div>
        )}

        {/* ── STEP 3 : SYSTÈME ACTUEL ── */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Monitor className="w-7 h-7 text-orange-600" />
                Système de Gestion Actuel
              </h2>
              <p className="text-gray-500 mt-1">Comprendre d'où vous partez pour mieux définir où aller.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <FF label="Logiciel(s) actuellement utilisé(s)" value={school.currentSoftware} onChange={v => u("currentSoftware", v)}
                placeholder="Ex: Apogée, Pégase, Ypareo, AURION, GEFI, Excel+SharePoint, Solution interne..." />
              <FF label="Depuis combien de temps ?" value={school.currentSoftwareSince} onChange={v => u("currentSoftwareSince", v)}
                placeholder="Ex: 10 ans pour Apogée, 3 ans pour l'outil RH" />
              <div className="md:col-span-2">
                <FF label="Principaux points de douleur / frustrations avec le système actuel" value={school.currentPainPoints}
                  onChange={v => u("currentPainPoints", v)} rows={4}
                  placeholder="Ex: Interface des années 90, pas de mobile, aucune automatisation, exports manuels vers Excel constants, impossible d'avoir un tableau de bord global, chaque département a son propre outil..."
                  hint="Soyez le plus précis possible - ce sont les problèmes que le nouveau système doit résoudre" />
              </div>
              <div className="md:col-span-2">
                <FF label="Ce qui fonctionne bien dans le système actuel (à conserver)" value={school.currentStrengths}
                  onChange={v => u("currentStrengths", v)} rows={3}
                  placeholder="Ex: Base de données fiable et complète, équipes formées dessus depuis 10 ans, module financier robuste..."
                  hint="Ces atouts doivent être préservés ou améliorés dans le nouveau système" />
              </div>
              <FF label="Budget envisagé (fourchette)" value={school.budget} onChange={v => u("budget", v)}
                placeholder="Ex: 50 000 - 100 000 €/an, 200 000 € total sur 3 ans, Non défini..." />
              <FF label="Délai d'implémentation souhaité" value={school.implementationTimeline} onChange={v => u("implementationTimeline", v)}
                placeholder="Ex: Avant rentrée de septembre, Q1 2026, Dès que possible..." />
              <div className="md:col-span-2">
                <FF label="Qui prend les décisions de choix logiciel ?" value={school.decisionMakers}
                  onChange={v => u("decisionMakers", v)} rows={2}
                  placeholder="Ex: Président + VP Numérique, Directeur Général + DSI + Directrice Pédagogique, Conseil d'administration..." />
              </div>
              <div className="md:col-span-2">
                <FF label="Systèmes concurrents / alternatives considérées" value={school.competitorSystems}
                  onChange={v => u("competitorSystems", v)} rows={2}
                  placeholder="Ex: AURION (en benchmark), Campus Online, solution SaaS sur mesure, développement interne..." />
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4 : PROCESSUS CLÉS ── */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Settings className="w-7 h-7 text-teal-600" />
                Processus & Workflows Clés
              </h2>
              <p className="text-gray-500 mt-1">Les processus métier qui doivent être pris en charge par le nouveau système.</p>
            </div>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <FF label="Gestion des présences / émargement" value={school.attendanceMethod}
                  onChange={v => u("attendanceMethod", v)} rows={3}
                  placeholder="Ex: Feuilles papier puis saisie, QR code, biométrie, application dédiée, intégré au système central..." />
                <FF label="Gestion des notes et évaluations" value={school.gradeManagement}
                  onChange={v => u("gradeManagement", v)} rows={3}
                  placeholder="Ex: Saisie manuelle, import Excel, jury en ligne, délibérations automatiques, publication avec workflow validation..." />
                <FF label="Gestion des emplois du temps" value={school.scheduleManagement}
                  onChange={v => u("scheduleManagement", v)} rows={3}
                  placeholder="Ex: Hyperplanning séparé, Celcat, outil interne, manuel sous Excel, synchronisé calendriers étudiants..." />
                <FF label="Communication avec les étudiants" value={school.studentComm}
                  onChange={v => u("studentComm", v)} rows={3}
                  placeholder="Ex: Email institutionnel, SMS urgences, ENT (espace numérique de travail), application dédiée, Discord officieux..." />
                <FF label="Gestion documentaire (cours, admin)" value={school.docManagement}
                  onChange={v => u("docManagement", v)} rows={3}
                  placeholder="Ex: Moodle / LMS pour supports cours, SharePoint pour admin, clés USB en salle, tout par email..." />
                <FF label="Reporting réglementaire" value={school.reportingNeeds}
                  onChange={v => u("reportingNeeds", v)} rows={3}
                  placeholder="Ex: Rapport annuel Rectorat, tableau de bord Ministère, statistiques DGESIP, reporting OPCO, accréditations..." />
                <FF label="Organisation des examens et jurys" value={school.examOrganization}
                  onChange={v => u("examOrganization", v)} rows={3}
                  placeholder="Ex: Convocations papier, sujets déposés sur ENT, délibérations en jury physique, PV numériques signés..." />
                <FF label="Gestion des stages / apprentissage" value={school.stageManagement}
                  onChange={v => u("stageManagement", v)} rows={3}
                  placeholder="Ex: Conventions papier signées, suivi visites entreprises, carnet de bord numérique, intégration OPCO..." />
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 5 : UTILISATEURS ── */}
        {step === 5 && (
          <div className="space-y-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Users className="w-7 h-7 text-pink-600" />
                Profils Utilisateurs & Parties Prenantes
              </h2>
              <p className="text-gray-500 mt-1">Qui utilisera le système et quels sont leurs besoins spécifiques ?</p>
            </div>
            <div className="space-y-4">
              <Card className="border-blue-200 bg-blue-50/50">
                <CardHeader className="pb-2"><CardTitle className="text-base text-blue-800">👩‍💼 Rôles Administratifs</CardTitle></CardHeader>
                <CardContent>
                  <FF label="Quels sont les rôles admin et leurs responsabilités ?" value={school.adminRoles}
                    onChange={v => u("adminRoles", v)} rows={4}
                    placeholder="Ex: Scolarité (inscriptions, attestations), Emploi du temps (planification), RH enseignants (contrats), Direction (pilotage stratégique), Comptabilité (frais scolarité)..." />
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50/50">
                <CardHeader className="pb-2"><CardTitle className="text-base text-green-800">👨‍🏫 Rôles Enseignants</CardTitle></CardHeader>
                <CardContent>
                  <FF label="Quels sont les rôles enseignants et leurs besoins ?" value={school.teacherRoles}
                    onChange={v => u("teacherRoles", v)} rows={4}
                    placeholder="Ex: Enseignants-chercheurs (cours + recherche), Enseignants du secondaire détachés, Vacataires professionnels, Ingénieurs pédagogiques, Tuteurs de stage..." />
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-purple-50/50">
                <CardHeader className="pb-2"><CardTitle className="text-base text-purple-800">🎓 Profil & Besoins Étudiants</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <FF label="Quels sont les besoins prioritaires des étudiants ?" value={school.studentNeeds}
                    onChange={v => u("studentNeeds", v)} rows={3}
                    placeholder="Ex: Accès mobile à l'emploi du temps, notes en temps réel, téléchargement attestations, prise de RDV en ligne, accès aux ressources pédagogiques..." />
                  <FF label="Profil et comportement numérique des étudiants" value={school.studentPopulation}
                    onChange={v => u("studentPopulation", v)} rows={3}
                    placeholder="Ex: 18-26 ans, très mobile-first, impatients, habitués aux apps grand public (Instagram, Uber, Netflix), peu tolérants aux interfaces complexes..." />
                </CardContent>
              </Card>

              <Card className="border-orange-200 bg-orange-50/50">
                <CardHeader className="pb-2"><CardTitle className="text-base text-orange-800">🤝 Parties Prenantes Externes</CardTitle></CardHeader>
                <CardContent>
                  <FF label="Qui sont les intervenants externes avec qui le système doit interagir ?" value={school.externalStakeholders}
                    onChange={v => u("externalStakeholders", v)} rows={3}
                    placeholder="Ex: Entreprises partenaires (alternance, stages), Parents (pour étudiants mineurs), OPCO (financement), Rectorat / Ministère (reporting), Organismes certificateurs (accréditations)..." />
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* ── STEP 6 : INFRASTRUCTURE TECH ── */}
        {step === 6 && (
          <div className="space-y-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Layers className="w-7 h-7 text-indigo-600" />
                Infrastructure Technologique
              </h2>
              <p className="text-gray-500 mt-1">L'environnement technique conditionne les choix de solution.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <FF label="Infrastructure réseau / internet" value={school.internetInfra}
                  onChange={v => u("internetInfra", v)} rows={2}
                  placeholder="Ex: Fibre optique, WiFi campus couverture totale / Connexion ADSL instable dans certaines salles / Réseau séparé admin-pédagogie-étudiants..." />
              </div>
              <div className="md:col-span-2">
                <FF label="Usage mobile sur votre campus (étudiants, enseignants, admin)" value={school.mobileUsage}
                  onChange={v => u("mobileUsage", v)} rows={2}
                  placeholder="Ex: 95% étudiants sur smartphone, 60% enseignants sur laptop, admin 100% PC bureau fixe. App mobile non utilisée actuellement..." />
              </div>
              <div className="md:col-span-2">
                <FF label="Systèmes et logiciels existants à intégrer" value={school.existingIntegrations}
                  onChange={v => u("existingIntegrations", v)} rows={3}
                  placeholder="Ex: Active Directory (authentification), comptabilité SAP, Moodle (LMS), ERP RH, Google Workspace / Microsoft 365, système biométrique..."
                  hint="Le nouveau système devra potentiellement s'interfacer avec ces outils" />
              </div>
              <div className="md:col-span-2">
                <FS label="Enseignement en ligne / hybride" value={school.onlineTeaching}
                  onChange={v => u("onlineTeaching", v)}
                  options={[
                    "Uniquement présentiel - pas de besoin online",
                    "Quelques cours en visio (Teams / Zoom) ponctuels",
                    "Hybride : 20-30% des cours en ligne",
                    "Hybride : 50% en ligne, 50% présentiel",
                    "Majoritairement en ligne (>70%)",
                    "100% en ligne / formation à distance"
                  ]} />
              </div>
              <div className="md:col-span-2">
                <FF label="Exigences de sécurité et hébergement" value={school.securityReqs}
                  onChange={v => u("securityReqs", v)} rows={2}
                  placeholder="Ex: Données hébergées obligatoirement en France (HDS), authentification SSO SAML2, chiffrement bout en bout, audits de sécurité annuels..." />
              </div>
              <div className="md:col-span-2">
                <FF label="Besoins RGPD spécifiques" value={school.gdprNeeds}
                  onChange={v => u("gdprNeeds", v)} rows={2}
                  placeholder="Ex: DPO désigné, données mineurs à protéger spécifiquement, droit à l'effacement, registre traitements à tenir, Privacy by Design requis..." />
              </div>
              <div className="md:col-span-2">
                <FF label="Accessibilité numérique (RGAA, WCAG)" value={school.accessibilityNeeds}
                  onChange={v => u("accessibilityNeeds", v)} rows={2}
                  placeholder="Ex: RGAA niveau AA obligatoire (établissement public), quelques étudiants RQTH, lecteurs d'écran à supporter, dyslexie..." />
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 7 : VISION & BESOINS ── */}
        {step === 7 && (
          <div className="space-y-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Target className="w-7 h-7 text-red-600" />
                Vision, Besoins & Priorités
              </h2>
              <p className="text-gray-500 mt-1">Ce que vous voulez vraiment atteindre avec ce nouveau système.</p>
            </div>
            <div className="space-y-4">
              <div className="md:col-span-2">
                <FF label="Objectifs principaux du nouveau système (top 5)" value={school.primaryGoals}
                  onChange={v => u("primaryGoals", v)} rows={4}
                  placeholder="Ex: 1. Réduire de 50% le temps administratif. 2. Interface 100% mobile. 3. Zéro papier en 2026. 4. Améliorer satisfaction étudiants. 5. Reporting réglementaire automatisé."
                  hint="Ces objectifs guideront la priorisation des fonctionnalités" />
              </div>
              <div className="md:col-span-2">
                <FF label="Indicateurs de succès (comment saurez-vous que c'est réussi ?)" value={school.successMetrics}
                  onChange={v => u("successMetrics", v)} rows={3}
                  placeholder="Ex: Taux adoption > 90% à 3 mois, émargement < 30 secondes, satisfaction utilisateurs > 4/5, 0 réclamation sur non-publication notes..." />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <FF label="Contraintes à respecter absolument" value={school.constraints}
                    onChange={v => u("constraints", v)} rows={4}
                    placeholder="Ex: Budget max 80k€/an, timeline septembre, équipe IT nulle (pas de dev interne), migration données Apogée obligatoire, résistance au changement équipes..."
                    hint="Ce que vous ne pouvez pas changer ou dépasser" />
                </div>
                <div>
                  <FF label="Deal Breakers (ce qui exclut immédiatement une solution)" value={school.dealBreakers}
                    onChange={v => u("dealBreakers", v)} rows={4}
                    placeholder="Ex: Hébergement hors UE, pas d'app mobile, coût > 100k€/an, pas d'API ouverte, solution non maintenue, propriétaire exclusif des données..." />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <FF label="Fonctionnalités INDISPENSABLES (must-have)" value={school.mustHave}
                  onChange={v => u("mustHave", v)} rows={5}
                  placeholder="Ex: App mobile iOS/Android, émargement numérique, emploi du temps temps réel, gestion des notes avec workflow, attestations automatiques, RGPD intégré..." />
                <FF label="Fonctionnalités SOUHAITÉES (nice-to-have)" value={school.niceToHave}
                  onChange={v => u("niceToHave", v)} rows={5}
                  placeholder="Ex: Chatbot administratif, IA prédictive (détection décrochage), portail parents, intégration LinkedIn Learning, module carrières/insertion..." />
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 8 : CULTURE & VALEURS ── */}
        {step === 8 && (
          <div className="space-y-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Heart className="w-7 h-7 text-rose-600" />
                Culture, Valeurs & Spécificités
              </h2>
              <p className="text-gray-500 mt-1">Comprendre l'ADN de votre établissement pour un système qui vous ressemble.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <FF label="Philosophie et approche pédagogique" value={school.teachingPhilosophy}
                  onChange={v => u("teachingPhilosophy", v)} rows={3}
                  placeholder="Ex: Pédagogie par compétences et projets, ancrage fort entreprise, excellence académique et recherche, innovation et créativité, inclusion et accessibilité pour tous..." />
              </div>
              <div className="md:col-span-2">
                <FF label="Valeurs fondamentales de l'établissement" value={school.values}
                  onChange={v => u("values", v)} rows={3}
                  placeholder="Ex: Excellence, Innovation, Ouverture internationale, Ancrage territorial, Durabilité, Inclusion, Esprit d'entreprise, Service public de l'éducation..." />
              </div>
              <div className="md:col-span-2">
                <FF label="Défis actuels de l'établissement" value={school.challenges}
                  onChange={v => u("challenges", v)} rows={3}
                  placeholder="Ex: Baisse démographique, concurrence avec universités en ligne, pression financière, accélération de la transformation numérique, adaptation aux nouvelles modalités d'apprentissage, recrutement enseignants..."
                  hint="Les problèmes stratégiques que votre établissement doit résoudre" />
              </div>
              <div className="md:col-span-2">
                <FF label="Exigences spécifiques à votre établissement (non couvertes par les questions précédentes)"
                  value={school.specificRequirements} onChange={v => u("specificRequirements", v)} rows={4}
                  placeholder="Ex: Gestion spécifique des étudiants en situation de handicap, module de VAE (validation acquis expérience), gestion multi-établissements (réseau d'écoles), interface en arabe/anglais obligatoire pour étudiants étrangers, conformité loi locale X..."
                  hint="Tout ce qui rend votre établissement unique et qui doit être pris en compte" />
              </div>
            </div>

            {/* Summary card */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 mt-6">
              <CardHeader>
                <CardTitle className="text-blue-800 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Récapitulatif
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-3 text-sm">
                <div><span className="font-semibold text-gray-700">Établissement : </span><span className="text-gray-600">{school.name || "—"}</span></div>
                <div><span className="font-semibold text-gray-700">Type : </span><span className="text-gray-600">{school.type || "—"}</span></div>
                <div><span className="font-semibold text-gray-700">Localisation : </span><span className="text-gray-600">{school.city}{school.city && school.country ? ", " : ""}{school.country || "—"}</span></div>
                <div><span className="font-semibold text-gray-700">Étudiants : </span><span className="text-gray-600">{school.totalStudents || "—"}</span></div>
                <div><span className="font-semibold text-gray-700">Système actuel : </span><span className="text-gray-600">{school.currentSoftware || "—"}</span></div>
                <div><span className="font-semibold text-gray-700">Budget : </span><span className="text-gray-600">{school.budget || "—"}</span></div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={goPrev} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            {step === 0 ? "Annuler" : "Précédent"}
          </Button>
          <Button onClick={goNext} className="gap-2 bg-blue-600 hover:bg-blue-700">
            {step === STEPS.length - 1 ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Créer l'établissement
              </>
            ) : (
              <>
                Suivant
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
