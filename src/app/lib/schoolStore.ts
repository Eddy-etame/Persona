// ─── School Data Model ───────────────────────────────────────────────────────

export interface School {
  id: string;
  name: string;
  shortName: string;
  country: string;
  city: string;
  type: string; // université, grande école, BTS, IUT, etc.
  foundingYear: string;
  accreditation: string;
  website: string;
  logo?: string; // base64
  isDemo?: boolean;

  // Scale & Organisation
  totalStudents: string;
  totalTeachers: string;
  totalAdminStaff: string;
  campusCount: string;
  campusLocations: string;
  departments: string;
  organizationStructure: string;

  // Academic Programs
  programs: string;
  degreeLevels: string;
  teachingModality: string;
  academicCalendar: string;
  gradingSystem: string;
  teachingLanguages: string;
  alternancePercent: string;
  internationalPercent: string;
  internshipRequired: string;
  researchActivity: string;

  // Current Digital System
  currentSoftware: string;
  currentSoftwareSince: string;
  currentPainPoints: string;
  currentStrengths: string;
  budget: string;
  implementationTimeline: string;
  decisionMakers: string;

  // Key Workflows
  attendanceMethod: string;
  gradeManagement: string;
  scheduleManagement: string;
  studentComm: string;
  docManagement: string;
  reportingNeeds: string;
  examOrganization: string;
  stageManagement: string;

  // User Roles
  adminRoles: string;
  teacherRoles: string;
  studentNeeds: string;
  externalStakeholders: string;
  studentPopulation: string;

  // Tech Infrastructure
  internetInfra: string;
  mobileUsage: string;
  existingIntegrations: string;
  securityReqs: string;
  gdprNeeds: string;
  accessibilityNeeds: string;
  onlineTeaching: string;

  // Vision & Culture
  primaryGoals: string;
  successMetrics: string;
  constraints: string;
  mustHave: string;
  niceToHave: string;
  dealBreakers: string;
  teachingPhilosophy: string;
  values: string;
  challenges: string;
  specificRequirements: string;
  competitorSystems: string;
}

// ─── Keyce Demo School ────────────────────────────────────────────────────────

export const KEYCE_DEMO: School = {
  id: "keyce",
  name: "Keyce Toulouse",
  shortName: "Keyce",
  country: "France",
  city: "Toulouse",
  type: "École de Commerce & Management",
  foundingYear: "2010",
  accreditation: "Titre certifié RNCP, France Compétences",
  website: "https://keyce.edu",
  isDemo: true,

  totalStudents: "~500 étudiants",
  totalTeachers: "25 enseignants (CDI + vacataires)",
  totalAdminStaff: "8 personnes (direction, pédagogie, secrétariat)",
  campusCount: "2",
  campusLocations: "Toulouse Centre (23 Rue des Potiers), Bordeaux",
  departments: "Pôle Commerce, Pôle Marketing, Pôle RH",
  organizationStructure: "Direction Générale → Direction Pédagogique → Responsables filières → Enseignants",

  programs: "BTS MCO, BTS NDRC, BTS Commerce International, Bachelor Marketing Digital, Bachelor RH, Mastère Marketing Digital, Mastère Management RH",
  degreeLevels: "Bac+2 (BTS), Bac+3 (Bachelor), Bac+5 (Mastère)",
  teachingModality: "Présentiel principalement, quelques cours hybrides",
  academicCalendar: "Semestriel (septembre-janvier, février-juin)",
  gradingSystem: "Notes sur 20, contrôle continu + examens finaux",
  teachingLanguages: "Français (80%), Anglais des affaires (20%)",
  alternancePercent: "40% des étudiants en alternance",
  internationalPercent: "15% d'étudiants étrangers",
  internshipRequired: "Oui - stage obligatoire chaque année (6-12 semaines minimum)",
  researchActivity: "Aucune activité de recherche académique",

  currentSoftware: "Ypareo (Ymag)",
  currentSoftwareSince: "Environ 8 ans",
  currentPainPoints: "Interface vieillissante et lente, pas d'app mobile, émargement instable, zéro automatisation, exports manuels constants vers Excel, pas de notifications push, emploi du temps sans détection de conflits",
  currentStrengths: "Base de données complète et fiable, connu de toutes les équipes, gestion financière intégrée",
  budget: "50 000 - 100 000 € pour migration + licences annuelles",
  implementationTimeline: "Migration souhaitée avant rentrée de septembre",
  decisionMakers: "Directeur Général + Directrice Pédagogique + Responsables filières",

  attendanceMethod: "Émargement papier puis saisie numérique dans Ypareo - très chronophage",
  gradeManagement: "Saisie manuelle dans Ypareo, exports Excel pour analyses. Délai moyen de publication : 2 semaines",
  scheduleManagement: "Emploi du temps créé sous Ypareo, modifié fréquemment (absences profs). Pas de détection conflits.",
  studentComm: "Email principalement + SMS ponctuel pour urgences. Pas de messagerie intégrée.",
  docManagement: "Documents déposés dans Ypareo (peu utilisé) + Google Drive (officieux). Problème de versioning.",
  reportingNeeds: "Rapports trimestriels pour France Compétences, rapports annuels Rectorat, tableaux de bord internes",
  examOrganization: "Planning jury dans Excel, convocations éditées manuellement, résultats saisis dans Ypareo",
  stageManagement: "Conventions signées papier, suivi dans fichier Excel séparé. Pas intégré dans Ypareo.",

  adminRoles: "Responsable Pédagogique (planning, examens, bulletins), Assistantes pédagogiques (attestations, saisies), Directeur (vision, décisions)",
  teacherRoles: "Formateurs (cours, émargement, notes), Coordinateurs filière (référents pédagogiques)",
  studentNeeds: "Emploi du temps mobile, notes en temps réel, émargement rapide, documents en libre-service",
  externalStakeholders: "OPCO (financement alternance), Rectorat (certification BTS), Familles, Entreprises partenaires, CROUS",
  studentPopulation: "18-28 ans, très mobile-first, actifs sur réseaux sociaux, impatients avec interfaces vieillissantes",

  internetInfra: "Fibre optique sur les campus, WiFi couverture complète, parfois instable en pic d'usage",
  mobileUsage: "90% des étudiants sur mobile. 70% des enseignants sur ordi. Admins 100% ordi.",
  existingIntegrations: "Aucune API ouverte avec Ypareo. Connexion manuelle à l'OPCO. Gmail/Outlook séparé.",
  securityReqs: "Conformité RGPD obligatoire, données hébergées en France ou UE, accès role-based",
  gdprNeeds: "DPO à désigner, données étudiants mineurs à protéger, droit à l'effacement",
  accessibilityNeeds: "WCAG 2.1 recommandé, quelques étudiants en situation de handicap (RQTH)",
  onlineTeaching: "Cours en présentiel uniquement (quelques visios ponctuelles via Teams)",

  primaryGoals: "Remplacer Ypareo par un système moderne, mobile-first, intuitif pour les 3 rôles. Réduire le temps administratif de 50%. Améliorer l'expérience étudiante.",
  successMetrics: "Taux d'adoption > 90% dans les 3 mois, réduction émargement à < 30 secondes, satisfaction utilisateurs > 4/5",
  constraints: "Budget limité, équipes résistantes au changement, pas d'équipe IT dédiée, migration données Ypareo",
  mustHave: "App mobile iOS/Android, émargement QR code, emploi du temps temps réel, gestion notes, attestations automatiques, RGPD",
  niceToHave: "IA prédictive absences, chatbot administratif, portail parents, intégration LinkedIn Learning",
  dealBreakers: "Hébergement hors UE, pas d'app mobile, coût > 150k€/an",
  teachingPhilosophy: "Pédagogie active et professionnalisante, ancrage fort dans le monde de l'entreprise",
  values: "Proximité avec les étudiants, excellence pédagogique, innovation, insertion professionnelle",
  challenges: "Taux d'alternance croissant complexifie les emplois du temps, contraintes réglementaires plus fortes, attentes étudiants de plus en plus élevées",
  specificRequirements: "Gestion multi-campus (Toulouse + Bordeaux), suivi spécifique alternants vs formation initiale, reporting France Compétences intégré",
  competitorSystems: "Hyperplanning (emplois du temps), Aurion (scolarité), Edusign (émargement), Google Classroom (pédagogique)"
};

// ─── Ynov Demo School (multi-campus) ──────────────────────────────────────────
// Sources used to shape this demo (public pages): ynov.com "Des parcours pour tous"
// and program pages listing campus coverage + general figures (14 campus, ~10k students).
export const YNOV_DEMO: School = {
  id: "ynov",
  name: "Ynov Campus (Réseau)",
  shortName: "Ynov",
  country: "France",
  city: "Paris (réseau multi-campus)",
  type: "École supérieure du digital & des industries créatives",
  foundingYear: "2013",
  accreditation: "Titres RNCP (niveaux 6 & 7) selon programmes",
  website: "https://ynov.com",
  isDemo: true,

  totalStudents: "~10 000 étudiants",
  totalTeachers: "Intervenants professionnels + équipe pédagogique (multi-campus)",
  totalAdminStaff: "Équipes campus + services mutualisés (admissions, scolarité, alternance)",
  campusCount: "14",
  campusLocations:
    "Aix-en-Provence, Bordeaux, Lille, Lyon, Montpellier, Nantes, Paris (Est & Ouest), Rennes, Rouen, Sophia (Nice), Strasbourg, Toulouse, Val d'Europe",
  departments:
    "Informatique, Cybersécurité, IA & Data, Marketing & Communication Digitale, Digital & IA, Création & Digital Design, Audiovisuel, 3D/Animation/Jeu vidéo, Architecture d'Intérieur, Bâtiment Numérique",
  organizationStructure:
    "Direction nationale → Directions de campus → Responsables de filières → Équipe pédagogique → Intervenants pros",

  programs:
    "Bachelors & Mastères : Informatique (développement, cloud, réseau), Cybersécurité, Intelligence Artificielle & Data, Marketing & Communication Digitale, Digital & IA, Création & Digital Design (UX/UI, motion), Audiovisuel, 3D/Animation/Jeu vidéo & immersif, Architecture d'Intérieur, Bâtiment Numérique (BIM)",
  degreeLevels: "Post-bac à Bac+5 (Bachelor 3 ans, Mastère 2 ans) + parcours en alternance",
  teachingModality: "Présentiel en campus + projets intensifs + périodes entreprise (alternance/stages)",
  academicCalendar: "Semestriel + périodes projets (challenges 48h, hackathons, projets fil rouge)",
  gradingSystem: "Contrôle continu + évaluations projets + soutenances + certifications selon filières",
  teachingLanguages: "Français (majoritaire) + modules en anglais selon programmes",
  alternancePercent: "Élevé à partir de Bac+3 (selon filière/campus)",
  internationalPercent: "Variable selon campus (mobilités possibles)",
  internshipRequired: "Oui (stages et/ou alternance selon parcours)",
  researchActivity: "Orientation professionnalisante (projets/partenariats entreprise) plutôt que recherche académique",

  currentSoftware:
    "Stack multi-outils : LMS (type Moodle), outils planning, CRM admissions, messagerie, outils projets (Notion/Trello), signatures/émargement selon campus",
  currentSoftwareSince: "Écosystème évolutif (outils ajoutés au fil des années)",
  currentPainPoints:
    "Systèmes fragmentés par filière/campus, SSO incomplet, données du student lifecycle dispersées, exports manuels (alternance, certifications), reporting multi-campus lent, notifications hétérogènes, expérience mobile inégale",
  currentStrengths:
    "Culture digitale forte, adoption élevée des outils, pédagogie projet structurée, forte proximité entreprises",
  budget: "Investissement piloté au niveau réseau (outils mutualisés + spécificités campus)",
  implementationTimeline: "Déploiement progressif (pilote 1-2 campus puis généralisation réseau)",
  decisionMakers: "Direction réseau + Directions de campus + Responsables filières + Référents alternance",

  attendanceMethod: "Émargement digital (QR/présence) + contrôles selon campus et filière",
  gradeManagement: "Évaluations projets + soutenances, notes centralisées via LMS/outil scolarité",
  scheduleManagement: "Planning par campus + contraintes salles/intervenants, besoin vue réseau pour mutualisation",
  studentComm: "Email + outils collaboratifs, besoin d’un canal unifié + notifications mobiles",
  docManagement: "Supports cours/projets dans LMS + espaces partagés, besoin de gouvernance documentaire",
  reportingNeeds: "KPI réseau (admissions, scolarité, alternance, certifications RNCP), pilotage par campus et filière",
  examOrganization: "Soutenances/jurys multi-filières, gestion convocations, traçabilité attestations/parchemins",
  stageManagement: "Suivi stages/alternance multi-campus, matching entreprises, conventions & signatures",

  adminRoles:
    "Admissions, Scolarité, Alternance, Relations entreprises, Directions campus, Référents handicap/RGPD",
  teacherRoles: "Intervenants pros, responsables modules, coordinateurs filière, jurys de soutenance",
  studentNeeds:
    "Expérience mobile fluide, planning temps réel, suivi projets, accès notes/attendus, notifications changements, démarches alternance simplifiées",
  externalStakeholders: "Entreprises partenaires, OPCO, certificateurs RNCP, plateformes e-learning, prestataires",
  studentPopulation: "18-30 ans, digital-native, très orienté projets/portfolio, forte attente d’outils fluides",

  internetInfra: "Campus connectés (WiFi) + besoins forts en labs (cyber, cloud, audiovisuels)",
  mobileUsage: "Très élevé côté étudiants; mix laptop + mobile côté intervenants; admin majoritairement desktop",
  existingIntegrations:
    "Outils SaaS + besoins API/SSO (Microsoft/Google), intégrations alternance/certifications souhaitées",
  securityReqs:
    "Accès role-based, SSO, traçabilité, gestion multi-campus, conformité cybersécurité (filière cyber très exigeante)",
  gdprNeeds: "RGPD réseau + gestion consentements + droit à l’effacement + gouvernance données multi-outils",
  accessibilityNeeds: "Accessibilité recommandée (WCAG) + accompagnement handicap (référents campus)",
  onlineTeaching: "Hybride ponctuel (visio, contenus en ligne) + besoin continuité pédagogique",

  primaryGoals:
    "Unifier le student lifecycle multi-campus (admissions → scolarité → alternance → diplômation), améliorer l’expérience mobile, accélérer le reporting réseau, standardiser les workflows et intégrations",
  successMetrics:
    "Réduction exports manuels, adoption > 90%, délai publication résultats réduit, satisfaction utilisateurs > 4/5, fiabilité planning/notifications",
  constraints:
    "Hétérogénéité campus/filières, calendrier alternance, dépendances outils existants, migration progressive sans casser le quotidien",
  mustHave:
    "SSO + rôles, API/integrations, mobile-first, planning fiable, notifications, workflows alternance/certifications, multi-campus natif, exports/BI",
  niceToHave:
    "Portail entreprise, matching alternance assisté, analytics avancés, automatisations no-code, catalogue compétences/portfolio",
  dealBreakers:
    "Pas de multi-campus, pas d’API/SSO, expérience mobile lente, perte de données, reporting impossible",
  teachingPhilosophy:
    "Apprentissage par projets, immersion métier, progression par challenges, portfolio & employabilité",
  values: "Innovation, professionnalisation, agilité, créativité, collaboration",
  challenges:
    "Coordination multi-campus, standardisation sans brider les filières, gestion alternance à grande échelle, cohérence expérience digitale",
  specificRequirements:
    "Workflows multi-campus + multi-filières, certifications RNCP (traçabilité), gestion jurys/soutenances, accès labs (cyber) et contenus lourds (audiovisuel/3D)",
  competitorSystems:
    "Moodle/Canvas (LMS), Hyperplanning (planning), Aurion (scolarité), Teams/Google Workspace, solutions émargement (Edusign), CRM admissions",
};

// ─── Storage Utilities ────────────────────────────────────────────────────────

const SCHOOLS_KEY = "edu-schools";
const ACTIVE_SCHOOL_KEY = "edu-active-school";

export function getAllSchools(): School[] {
  try {
    const raw = localStorage.getItem(SCHOOLS_KEY);
    if (raw) {
      const schools = JSON.parse(raw) as School[];
      // Ensure Keyce demo is always present
      if (!schools.find(s => s.id === "keyce")) {
        schools.unshift(KEYCE_DEMO);
        localStorage.setItem(SCHOOLS_KEY, JSON.stringify(schools));
      }
      // Ensure Ynov demo is always present
      if (!schools.find(s => s.id === "ynov")) {
        schools.unshift(YNOV_DEMO);
        localStorage.setItem(SCHOOLS_KEY, JSON.stringify(schools));
      }
      return schools;
    }
  } catch {}
  const defaults = [YNOV_DEMO, KEYCE_DEMO];
  localStorage.setItem(SCHOOLS_KEY, JSON.stringify(defaults));
  return defaults;
}

export function getSchoolById(id: string): School | null {
  if (id === "keyce") return KEYCE_DEMO;
  if (id === "ynov") return YNOV_DEMO;
  return getAllSchools().find(s => s.id === id) ?? null;
}

export function saveSchool(school: School): void {
  const schools = getAllSchools().filter(s => s.id !== school.id);
  schools.push(school);
  localStorage.setItem(SCHOOLS_KEY, JSON.stringify(schools));
}

export function getActiveSchoolId(): string {
  return localStorage.getItem(ACTIVE_SCHOOL_KEY) ?? "keyce";
}

export function setActiveSchoolId(id: string): void {
  localStorage.setItem(ACTIVE_SCHOOL_KEY, id);
}

export function getActiveSchool(): School {
  const id = getActiveSchoolId();
  return getSchoolById(id) ?? KEYCE_DEMO;
}

export function personaKey(schoolId: string): string {
  return `${schoolId}-persona`;
}

export function journeyKey(schoolId: string): string {
  return `${schoolId}-journey`;
}

export function journeyKeyByRole(schoolId: string, role: string): string {
  const roleSlug = role
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${schoolId}-journey-${roleSlug}`;
}

export function savedPersonasKey(schoolId: string): string {
  return `${schoolId}-saved-personas`;
}

export function generateSchoolId(): string {
  return `school-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export const SCHOOL_TYPES = [
  "Université",
  "Grande École",
  "École de Commerce & Management",
  "École d'Ingénieurs",
  "IUT (Institut Universitaire de Technologie)",
  "BTS / Lycée Professionnel",
  "École d'Art & Design",
  "École de Santé",
  "École Normale Supérieure",
  "Institut Spécialisé",
  "École de Droit",
  "École de Journalisme & Communication",
  "Conservatoire",
  "Autre établissement d'enseignement supérieur"
];

// ─── Export / Import ──────────────────────────────────────────────────────────

export interface SchoolExportData {
  version: 1;
  exportedAt: string;
  school: School;
  persona: unknown | null;
  savedPersonas: Record<string, unknown> | null;
  journeySteps: unknown[] | null;
  journeysByRole?: Record<string, unknown[]>;
}

export function exportSchoolData(schoolId: string): SchoolExportData | null {
  const school = getSchoolById(schoolId);
  if (!school) return null;

  let persona = null;
  try { const raw = localStorage.getItem(personaKey(schoolId)); if (raw) persona = JSON.parse(raw); } catch {}

  let savedPersonas = null;
  try { const raw = localStorage.getItem(savedPersonasKey(schoolId)); if (raw) savedPersonas = JSON.parse(raw); } catch {}

  let journeySteps = null;
  try { const raw = localStorage.getItem(journeyKey(schoolId)); if (raw) journeySteps = JSON.parse(raw); } catch {}

  let journeysByRole: Record<string, unknown[]> = {};
  try {
    const savedPersonasRaw = localStorage.getItem(savedPersonasKey(schoolId));
    const saved = savedPersonasRaw ? (JSON.parse(savedPersonasRaw) as Record<string, unknown>) : {};
    Object.keys(saved).forEach((role) => {
      const raw = localStorage.getItem(journeyKeyByRole(schoolId, role));
      if (raw) journeysByRole[role] = JSON.parse(raw);
    });
  } catch {}

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    school,
    persona,
    savedPersonas,
    journeySteps,
    journeysByRole: Object.keys(journeysByRole).length > 0 ? journeysByRole : undefined,
  };
}

export function importSchoolData(data: SchoolExportData): { success: boolean; schoolName: string; error?: string } {
  try {
    if (!data.version || !data.school || !data.school.name) {
      return { success: false, schoolName: "", error: "Format de fichier invalide" };
    }

    const newId = generateSchoolId();
    const school: School = { ...data.school, id: newId, isDemo: false };

    saveSchool(school);

    if (data.persona) {
      localStorage.setItem(personaKey(newId), JSON.stringify(data.persona));
    }
    if (data.savedPersonas) {
      localStorage.setItem(savedPersonasKey(newId), JSON.stringify(data.savedPersonas));
    }
    if (data.journeySteps) {
      localStorage.setItem(journeyKey(newId), JSON.stringify(data.journeySteps));
    }
    if (data.journeysByRole) {
      Object.entries(data.journeysByRole).forEach(([role, steps]) => {
        localStorage.setItem(journeyKeyByRole(newId, role), JSON.stringify(steps));
      });
    }

    return { success: true, schoolName: school.name };
  } catch {
    return { success: false, schoolName: "", error: "Erreur lors de l'import" };
  }
}

export const COUNTRIES = [
  "France", "Belgique", "Suisse", "Luxembourg", "Canada (Québec)",
  "Maroc", "Tunisie", "Algérie", "Sénégal", "Côte d'Ivoire",
  "Cameroun", "Madagascar", "Autre"
];
