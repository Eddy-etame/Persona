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
      return schools;
    }
  } catch {}
  const defaults = [KEYCE_DEMO];
  localStorage.setItem(SCHOOLS_KEY, JSON.stringify(defaults));
  return defaults;
}

export function getSchoolById(id: string): School | null {
  if (id === "keyce") return KEYCE_DEMO;
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

export const COUNTRIES = [
  "France", "Belgique", "Suisse", "Luxembourg", "Canada (Québec)",
  "Maroc", "Tunisie", "Algérie", "Sénégal", "Côte d'Ivoire",
  "Cameroun", "Madagascar", "Autre"
];
