import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";
import {
  ArrowLeft, Save, User, Briefcase, GraduationCap, Settings,
  Heart, MapPin, Monitor, Smartphone, Star, Upload, Camera, Users
} from "lucide-react";
import { toast } from "sonner";
import { getActiveSchool, personaKey, savedPersonasKey } from "../lib/schoolStore";

// ─── Persona interface ────────────────────────────────────────────────────────

export interface Persona {
  name: string; age: string; role: string; type: string; photo: string;
  occupation: string; studyLevel: string; program: string; yearOfStudy: string;
  bio: string; personality: string;
  maritalStatus: string; children: string; nationality: string; languages: string;
  hobbies: string; sports: string; musicTaste: string; readingHabits: string;
  socialStyle: string; values: string; fears: string; deepMotivations: string;
  stressLevel: string; stressManagement: string; sleepSchedule: string;
  diet: string; healthConsiderations: string; volunteerWork: string;
  travelHistory: string; roleModel: string; lifePhilosophy: string;
  weekendActivities: string; personalSocialMedia: string; monthlyBudget: string;
  dreamVacation: string; petOrNot: string; politicalEngagement: string;
  religiousViews: string; currentReads: string; favoriteSeries: string;
  introExtrovert: string; morningOrNight: string; bigLifeEvent: string;
  campus: string; neighborhood: string; housing: string; transportation: string;
  arriveTime: string; departTime: string; workSchedule: string; favoriteSpots: string;
  studentId: string; enrollmentDate: string; scholarshipStatus: string; partTimeJob: string;
  whyKeyce: string; previousSchool: string; parentsProfession: string; siblings: string;
  dreamJob: string; internshipExperience: string; relationWithTeachers: string;
  bestSubject: string; worstSubject: string; yearGoal: string; afterSchoolPlan: string;
  financialAid: string; dailyBudget: string; learningStyle: string; studyHabits: string;
  extracurricular: string; careerGoals: string; academicStrengths: string; academicWeaknesses: string;
  groupOrSolo: string; examStress: string; repeatYear: string;
  position: string; department: string; yearsAtKeyce: string; contractType: string;
  teachingHours: string; subjectsTaught: string; teachingStyle: string; classSize: string;
  assessmentMethods: string; previousCareer: string; whyTeaching: string;
  teachingPhilosophy: string; proudestAchievement: string; biggestChallenge: string;
  mentors: string; workLifeBalance: string; hopeForStudents: string;
  careerPlans: string; jobSatisfaction: string; prepTime: string;
  teachingAtOtherSchools: string; continuingEducation: string; unionMembership: string;
  relationWithStudents: string; relationWithAdmin: string; salaryRange: string;
  responsibleFor: string; teamSize: string; keyProcesses: string;
  managementStyle: string; decisionAuthority: string; careerPath: string;
  teamRelations: string; remoteWork: string; emailsPerDay: string;
  meetingsPerWeek: string; reportTo: string; externalRelations: string;
  biggestChallengeAdmin: string; proudestAchievementAdmin: string;
  workLifeBalanceAdmin: string; regulatoryPressure: string; conflictManagement: string;
  adminSatisfaction: string;
  primarySystemNeeds: string; frequentTasks: string; timeSpentOnSystem: string; systemUsage: string;
  techSavvy: string; digitalTools: string; devices: string; apps: string;
  privacyConcerns: string; techFrustrations: string; learnNewTechHow: string;
  goals: string; frustrations: string; needs: string; quote: string;
  idealFeature: string; dealBreaker: string; onboardingExpectation: string;
}

// ─── Field components — defined OUTSIDE to prevent remount on state change ───

interface FProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  type?: "input" | "textarea";
  span2?: boolean;
}

const F = ({ label, value, onChange, placeholder, rows, type = "input", span2 }: FProps) => (
  <div className={span2 ? "md:col-span-2" : ""}>
    <Label className="mb-1 block text-sm">{label}</Label>
    {type === "textarea" ? (
      <Textarea placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} rows={rows ?? 3} />
    ) : (
      <Input placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
    )}
  </div>
);

interface SFProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  span2?: boolean;
}

const SF = ({ label, value, onChange, options, placeholder, span2 }: SFProps) => (
  <div className={span2 ? "md:col-span-2" : ""}>
    <Label className="mb-1 block text-sm">{label}</Label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger><SelectValue placeholder={placeholder ?? "Choisir..."} /></SelectTrigger>
      <SelectContent>
        {options.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
      </SelectContent>
    </Select>
  </div>
);

// ─── Templates ────────────────────────────────────────────────────────────────

const EMPTY_PERSONA: Persona = {
  name: "", age: "", role: "Étudiant", type: "", photo: "",
  occupation: "", studyLevel: "", program: "", yearOfStudy: "", bio: "", personality: "",
  maritalStatus: "", children: "", nationality: "", languages: "", hobbies: "", sports: "",
  musicTaste: "", readingHabits: "", socialStyle: "", values: "", fears: "", deepMotivations: "",
  stressLevel: "", stressManagement: "", sleepSchedule: "", diet: "", healthConsiderations: "",
  volunteerWork: "", travelHistory: "", roleModel: "", lifePhilosophy: "", weekendActivities: "",
  personalSocialMedia: "", monthlyBudget: "", dreamVacation: "", petOrNot: "",
  politicalEngagement: "", religiousViews: "", currentReads: "", favoriteSeries: "",
  introExtrovert: "", morningOrNight: "", bigLifeEvent: "",
  campus: "", neighborhood: "", housing: "", transportation: "",
  arriveTime: "", departTime: "", workSchedule: "", favoriteSpots: "",
  studentId: "", enrollmentDate: "", scholarshipStatus: "", partTimeJob: "",
  whyKeyce: "", previousSchool: "", parentsProfession: "", siblings: "", dreamJob: "",
  internshipExperience: "", relationWithTeachers: "", bestSubject: "", worstSubject: "",
  yearGoal: "", afterSchoolPlan: "", financialAid: "", dailyBudget: "",
  learningStyle: "", studyHabits: "", extracurricular: "", careerGoals: "",
  academicStrengths: "", academicWeaknesses: "", groupOrSolo: "", examStress: "", repeatYear: "",
  position: "", department: "", yearsAtKeyce: "", contractType: "", teachingHours: "", subjectsTaught: "",
  teachingStyle: "", classSize: "", assessmentMethods: "", previousCareer: "", whyTeaching: "",
  teachingPhilosophy: "", proudestAchievement: "", biggestChallenge: "", mentors: "",
  workLifeBalance: "", hopeForStudents: "", careerPlans: "", jobSatisfaction: "", prepTime: "",
  teachingAtOtherSchools: "", continuingEducation: "", unionMembership: "",
  relationWithStudents: "", relationWithAdmin: "", salaryRange: "",
  responsibleFor: "", teamSize: "", keyProcesses: "", managementStyle: "",
  decisionAuthority: "", careerPath: "", teamRelations: "", remoteWork: "",
  emailsPerDay: "", meetingsPerWeek: "", reportTo: "", externalRelations: "",
  biggestChallengeAdmin: "", proudestAchievementAdmin: "", workLifeBalanceAdmin: "",
  regulatoryPressure: "", conflictManagement: "", adminSatisfaction: "",
  primarySystemNeeds: "", frequentTasks: "", timeSpentOnSystem: "", systemUsage: "",
  techSavvy: "", digitalTools: "", devices: "", apps: "",
  privacyConcerns: "", techFrustrations: "", learnNewTechHow: "",
  goals: "", frustrations: "", needs: "", quote: "",
  idealFeature: "", dealBreaker: "", onboardingExpectation: ""
};

const PERSONA_TEMPLATES: Record<string, Partial<Persona>> = {
  "etudiant-bts": {
    role: "Étudiant", type: "L'étudiant connecté", occupation: "Étudiant BTS",
    studyLevel: "Bac+2", program: "BTS MCO (Management Commercial Opérationnel)", yearOfStudy: "2ème année",
    neighborhood: "Jean-Jaurès", housing: "Studio étudiant - Résidence Studéa Jean Jaurès",
    transportation: "Métro Ligne B (Jean-Jaurès → Jeanne d'Arc)",
    arriveTime: "8h15", departTime: "17h30", workSchedule: "8h30-17h30 (lundi au vendredi)",
    favoriteSpots: "Bibliothèque François Mitterrand, Espace Coworking Wellio, Café Bibent",
    studentId: "KEY2024-MCO-0156", enrollmentDate: "Septembre 2023", scholarshipStatus: "Boursier échelon 4",
    partTimeJob: "Vendeur chez Décathlon Wilson (15h/semaine)",
    bio: "Lucas Martin, 21 ans, étudiant en 2ème année de BTS MCO. Originaire de Colomiers, il habite un studio près de Jean-Jaurès. Entre ses cours, son job étudiant et sa vie sociale, il jongle avec de nombreux emplois du temps. Il trouve Ypareo peu ergonomique et difficile d'accès sur mobile.",
    personality: "Dynamique, organisé, tech-savvy, sociable, impatient face aux interfaces complexes",
    maritalStatus: "Célibataire", children: "Aucun", nationality: "Française",
    languages: "Français (natif), Anglais (B2), Espagnol (A2 scolaire)",
    hobbies: "Gaming (FIFA, Valorant), Photographie urbaine, Cuisine autodidacte, Podcasts entrepreneuriat",
    sports: "Football (équipe campus), Running 5km, Fitness 2x/semaine",
    musicTaste: "Hip-hop français (Ninho, SCH, Orelsan), R&B, Electronic pour travailler",
    readingHabits: "Quasi exclusivement podcasts et YouTube. Lit 1-2 livres/an (business).",
    socialStyle: "Extraverti modéré - aime les groupes mais a besoin de moments seul",
    values: "Ambition, authenticité, loyauté, liberté financière",
    fears: "Échouer les examens et décevoir ses parents, ne pas trouver de travail",
    deepMotivations: "Prouver qu'il peut réussir malgré un contexte modeste, offrir une vie meilleure à sa famille",
    stressLevel: "Élevé en examens (7/10), modéré le reste (4/10)",
    stressManagement: "Gaming pour décompresser, appels avec sa mère, sorties amis, musique forte",
    sleepSchedule: "Couche-tard (minuit-1h), lever difficile (7h15). Manque chronique de sommeil.",
    diet: "Mange souvent au campus ou snacks rapides. Cuisine le week-end. Budget alimentaire serré.",
    healthConsiderations: "Légères douleurs au dos (posture ordi). Lunettes. Anxiété ponctuelle.",
    volunteerWork: "Président BDE campus. Tuteur bénévole lycéens en difficulté.",
    travelHistory: "Séjour linguistique Londres (lycée). Vacances famille Maroc. Rêve d'Asie.",
    roleModel: "Elon Musk (ambition), Gary Vaynerchuk (entrepreneuriat), son oncle entrepreneur",
    lifePhilosophy: "Travaille dur en silence, laisse le succès faire le bruit",
    weekendActivities: "Sorties amis (bars Jean-Jaurès), football dimanche, courses et cuisine, gaming vendredi",
    personalSocialMedia: "Instagram (450 followers), TikTok (consommateur), LinkedIn (en construction)",
    monthlyBudget: "850€ (APL 200€ + bourse 450€ + job 200€). Loyer 450€.",
    dreamVacation: "Road trip Californie + visite Silicon Valley",
    petOrNot: "Voudrait un chien mais studio interdit",
    introExtrovert: "Extraverti (7/10)", morningOrNight: "Noctambule (couche après minuit)",
    bigLifeEvent: "Perte de son père à 15 ans - l'a rendu très autonome et mature précocement",
    whyKeyce: "Réputation formation MCO, coût accessible, campus centre-ville",
    previousSchool: "Lycée Pierre de Fermat (Toulouse) - Bac STMG mention Bien",
    parentsProfession: "Mère aide-soignante (CHU Purpan), père décédé",
    siblings: "2 sœurs cadettes (17 et 14 ans)",
    dreamJob: "Créer sa startup e-commerce sportif, ou responsable marketing Nike/Adidas",
    internshipExperience: "Stage 6 semaines Décathlon (gestion rayon). Actuellement alternance vendeur 15h/sem.",
    relationWithTeachers: "Bonne. Apprécie les profs qui viennent du terrain.",
    bestSubject: "Management commercial, Marketing digital, Gestion de projet",
    worstSubject: "Comptabilité, Droit commercial, Anglais écrit",
    yearGoal: "Obtenir BTS avec mention, décrocher alternance pour Bachelor",
    afterSchoolPlan: "Bachelor Marketing Digital en alternance",
    financialAid: "Bourse CROUS échelon 4 (4500€/an), APL 200€/mois",
    dailyBudget: "~15€/jour (repas campus 5€, transport 2€)",
    learningStyle: "Visuel et pratique - préfère les vidéos et cas concrets",
    studyHabits: "Travail en groupe, révisions de dernière minute, utilise YouTube",
    extracurricular: "Président BDE, équipe football, tuteur bénévole",
    careerGoals: "Responsable magasin → Responsable marketing → Créer sa propre entreprise retail",
    academicStrengths: "Présentation orale, travaux pratiques, projets groupe",
    academicWeaknesses: "Manque de rigueur à l'écrit, gestion du temps long terme",
    groupOrSolo: "Fortement groupe (8/10)", examStress: "Stress élevé mais canalisé",
    repeatYear: "Non - première tentative",
    primarySystemNeeds: "Consultation rapide emploi du temps\nAccès aux notes et résultats\nSignature émargement\nTéléchargement documents\nSuivi des absences",
    frequentTasks: "Consulter l'emploi du temps (2-3x/jour)\nSigner émargement (chaque cours)\nVérifier les notes (1-2x/semaine)",
    timeSpentOnSystem: "10-15 min/jour, 5-8 connexions", systemUsage: "90% mobile",
    devices: "iPhone 13, MacBook Air M1, iPad (occasionnel)",
    apps: "Instagram, TikTok, Notion, Discord, Spotify",
    techSavvy: "Expert - Early adopter, très à l'aise avec toute technologie",
    digitalTools: "Notion, Google Calendar, Discord, Slack, Trello",
    privacyConcerns: "Peu préoccupé - partage volontiers ses données si service utile",
    techFrustrations: "Apps lentes, interfaces non intuitives, trop d'étapes pour action simple",
    learnNewTechHow: "YouTube tutorials + trial & error, jamais les notices",
    goals: "Accéder rapidement à mon emploi du temps depuis mon téléphone\nRecevoir des notifications pour les changements\nSigner l'émargement sans bug\nTélécharger mes documents en 2 clics\nVoir mes notes dès publication",
    frustrations: "Ypareo plante souvent sur mobile\nInterface datée et peu intuitive\nPas de notifications push\nÉmargement instable\nDocuments difficiles à trouver",
    needs: "Application mobile native et fluide\nNotifications push intelligentes\nÉmargement par QR code\nTableau de bord centralisé\nMode hors ligne emploi du temps",
    quote: "Je perds 5 minutes à chaque fois que je veux juste voir à quelle heure j'ai cours demain. J'aimerais une app aussi simple que mon app de banque !",
    idealFeature: "Widget emploi du temps sur l'écran d'accueil iOS et notifications instantanées",
    dealBreaker: "Pas d'application mobile. Plus de 3 clics pour une action fréquente.",
    onboardingExpectation: "Tutoriel interactif à la première connexion. Aide contextuelle dans l'app."
  },
  "enseignant": {
    role: "Enseignant", type: "L'enseignante multi-campus", occupation: "Enseignante / Formatrice",
    studyLevel: "Master 2 Commerce International", program: "N/A - Personnel enseignant",
    neighborhood: "Compans-Caffarelli", housing: "Appartement propriétaire - Rue Riquet (T3, 68m²)",
    transportation: "Voiture (déplacements inter-campus) + Métro Ligne B",
    arriveTime: "8h00", departTime: "19h00", workSchedule: "Horaires variables - 24h cours/semaine",
    favoriteSpots: "Marché Victor Hugo, Bibliothèque Universitaire, Co-working La Cantine",
    position: "Formatrice en Marketing et Commerce", department: "Pôle Commerce / Marketing", yearsAtKeyce: "6 ans",
    contractType: "CDI temps plein", teachingHours: "24h/semaine (+ 10h préparation/correction)",
    subjectsTaught: "Marketing digital, E-commerce, Stratégie commerciale, Négociation",
    bio: "Sophie Mercier, 38 ans, enseignante en marketing et commerce depuis 6 ans. Ancienne responsable marketing en entreprise 8 ans. Enseigne à 8 classes (~180 étudiants). Trouve le système actuel trop fragmenté.",
    personality: "Pédagogue, organisée, exigeante mais bienveillante, frustrée par les outils obsolètes",
    maritalStatus: "Mariée depuis 8 ans", children: "2 enfants (Emma 6 ans, Théo 4 ans)",
    nationality: "Française (parents algériens)",
    languages: "Français (natif), Anglais (C1 - vécu 2 ans à Londres), Arabe (compréhension)",
    hobbies: "Yoga (3x/semaine), Cuisine méditerranéenne, Jardinage (balcon), Déco intérieure",
    sports: "Yoga Vinyasa, Randonnée en famille (Pyrénées), Natation ponctuelle",
    musicTaste: "Jazz français, Chansons françaises classiques, World Music, Podcasts culture G",
    readingHabits: "15-20 livres/an. Romans, essais pédagogiques, podcasts France Culture.",
    socialStyle: "Ambivert - extravertie au travail, introvertie à la maison",
    values: "Équité, transmission, exigence bienveillante, travail bien fait, famille avant tout",
    fears: "Perdre le lien avec ses étudiants, épuisement professionnel, être dépassée technologiquement",
    deepMotivations: "Voir ses étudiants réussir professionnellement, laisser une empreinte positive",
    stressLevel: "Élevé en examens (8/10), modéré le reste (5/10)",
    stressManagement: "Yoga quotidien (indispensable), jardinage, discussions avec mari, lecture",
    sleepSchedule: "Couche-tôt quand possible (22h30), souvent 23h30 en période chargée. Lever 6h30.",
    healthConsiderations: "Tendinite épaule droite (trop d'ordi). Migraines lors des pics de stress.",
    volunteerWork: "Marraine dans programme 'Femmes & Entreprises'. Ex-membre CA association culturelle.",
    travelHistory: "2 ans expatriée Londres. Voyages pro Bruxelles, Barcelone. Famille en Algérie.",
    roleModel: "Ken Robinson (pédagogie créative), Christine Lagarde, ses parents (résilience)",
    lifePhilosophy: "Enseigner ce n'est pas remplir un vase, c'est allumer un feu (Plutarque)",
    weekendActivities: "Activités famille, marché samedi matin, dîner amis, préparation cours dimanche",
    personalSocialMedia: "LinkedIn (1200 contacts, profil soigné), Instagram privé, Pinterest",
    monthlyBudget: "Famille 2 revenus confortables. Propriétaires. Budget vacances 3000€/an.",
    introExtrovert: "Ambivert (5/10)", morningOrNight: "Matin (6h30 lever)",
    bigLifeEvent: "Reconversion professionnelle à 32 ans (du marketing à l'enseignement)",
    previousCareer: "8 ans marketing B2B : Chef produit (2 ans), Resp. marketing Fnac (3 ans), Consultante (3 ans)",
    whyTeaching: "Lassitude du corporate, envie de transmettre, flexibilité famille",
    teachingPhilosophy: "Pédagogie active et expérientielle. Chaque cours doit avoir un ancrage concret.",
    proudestAchievement: "3 anciens étudiants créent leur startup. Une étudiante décroche CDI chez LVMH.",
    biggestChallenge: "Maintenir cours à jour dans domaine qui évolue tous les 6 mois. Surcharge administrative.",
    workLifeBalance: "Difficile avec 2 jeunes enfants + double campus. Équilibre fragile mais possible.",
    hopeForStudents: "Qu'ils trouvent un métier qui leur plait. Qu'ils aient confiance en leurs capacités.",
    jobSatisfaction: "7/10 - Passion intacte pour la pédagogie. Frustration face au temps perdu en admin.",
    prepTime: "2-3h/heure nouveau cours, 30min cours rodé. Corrections: 1h30 pour 25 copies.",
    teachingStyle: "Pédagogie active avec études de cas, travaux de groupe, interventions professionnels",
    classSize: "Classes de 20-30 étudiants",
    assessmentMethods: "Contrôles continus, projets de groupe, soutenances orales, examens finaux",
    primarySystemNeeds: "Gestion des émargements\nDépôt de documents et supports de cours\nSaisie et publication des notes\nConsultation de l'emploi du temps\nCommunication avec les étudiants",
    frequentTasks: "Émarger les cours (3-4x/jour)\nDéposer supports (2-3x/semaine)\nSaisir notes (hebdomadaire)",
    timeSpentOnSystem: "45-60 min/jour sur tâches admin", systemUsage: "Ordinateur portable (70%), tablette en classe (20%)",
    devices: "MacBook Pro 14 pouces, iPad Pro (émargement classe), iPhone 12",
    apps: "Outlook, Teams, OneNote, Google Drive, Slack, LinkedIn",
    techSavvy: "Avancé - Utilise régulièrement des outils numériques mais attend qu'ils soient intuitifs",
    digitalTools: "Moodle, Google Workspace, Canva, Trello, Zoom",
    goals: "Émarger rapidement mes cours sans bugs\nDéposer et organiser facilement mes supports\nSaisir notes avec import Excel\nAvoir vue claire emploi du temps avec salles",
    frustrations: "Interface complexe avec trop de clics\nÉmargement qui plante régulièrement\nPas d'import notes par tableur\nDifficile de retrouver les anciens documents",
    needs: "Interface simplifiée et moderne\nÉmargement fiable mobile/tablette\nUpload groupé avec tags\nImport/export Excel pour les notes",
    quote: "Je passe 1h par jour sur des tâches administratives basiques. C'est 5h par semaine que je pourrais consacrer à améliorer mes cours !",
    idealFeature: "Module 'Cours du jour' : liste présence + supports + émargement en un seul écran",
    dealBreaker: "Perte de données (notes, émargements). Système qui force à ressaisir ce déjà saisi.",
    onboardingExpectation: "Demi-journée de formation en groupe + documentation PDF + support téléphonique"
  },
  "admin": {
    role: "Administration", type: "La responsable pédagogique", occupation: "Responsable Pédagogique et Administrative",
    studyLevel: "Master 2 Management des Organisations",
    neighborhood: "Capitole", housing: "Maison propriétaire - Quartier Saint-Agne (4 pièces, jardin)",
    transportation: "Voiture + Parking campus",
    arriveTime: "7h45", departTime: "18h30", workSchedule: "8h-18h (lundi-vendredi) + samedi 1x/mois",
    favoriteSpots: "Campus, Jardin des Plantes (pause déjeuner)",
    position: "Responsable Pédagogique BTS/Bachelor", department: "Direction Pédagogique et Vie Scolaire",
    yearsAtKeyce: "12 ans", contractType: "CDI Cadre",
    bio: "Marie Dubois, 45 ans, responsable pédagogique depuis 12 ans. Supervise 4 formations (240 étudiants, 18 enseignants). Gère inscriptions, planification, absences, examens, bulletins, stages. Utilise Ypareo 4-6h/jour.",
    personality: "Rigoureuse, multitâche, diplomate, résistante au stress, perfectionniste",
    maritalStatus: "Divorcée depuis 4 ans - garde alternée", children: "2 enfants (Pierre 16 ans, Lucie 13 ans)",
    nationality: "Française",
    languages: "Français (natif), Anglais (B1 - fonctionnel)",
    hobbies: "Jardinage (passion), Aquarelle (cours soir 1x/semaine), Cuisine du terroir, Jeux de société",
    sports: "Marche nordique (2x/semaine, Bords de Garonne), Natation (mercredi midi)",
    musicTaste: "Variété française 80-90, Jazz, Radio Classique pendant travail concentré",
    readingHabits: "10-12 livres/an. Romans policiers (Fred Vargas), biographies, management.",
    socialStyle: "Introvertie au fond mais parfaitement adaptée aux contextes sociaux professionnels",
    values: "Intégrité, rigueur, service aux autres, équité, travail bien fait même sans reconnaissance",
    fears: "Commettre une erreur administrative grave (légal, certification), perdre le contrôle",
    deepMotivations: "Être le pilier invisible sur lequel tout repose. Fierté de voir des centaines d'étudiants diplômés.",
    stressLevel: "Structurellement élevé (6/10 quotidien, 9/10 en examens/inscriptions)",
    stressManagement: "Jardinage week-end (thérapeutique), marche nordique, organisation ultra-rigoureuse",
    sleepSchedule: "Couche tôt (22h) mais réveils nocturnes fréquents en stress. Lever 6h30.",
    healthConsiderations: "Troubles du sommeil chroniques. Tendinite poignet droit (Excel toute la journée).",
    volunteerWork: "Ex-présidente association parents d'élèves. Bénévole banque alimentaire 1 dimanche/mois.",
    travelHistory: "Rarement. Week-end Barcelone (annuel), vacances Bretagne famille. Rêve d'Islande.",
    roleModel: "Sa directrice pédagogique (retraitée, bienveillance). Angela Merkel (rigueur). Sa mère (institutrice).",
    lifePhilosophy: "Le travail bien fait est sa propre récompense",
    weekendActivities: "Jardin (samedi), courses marché, activités enfants, aquarelle (dimanche), préparation semaine",
    personalSocialMedia: "LinkedIn (600 contacts, pro), Facebook (famille uniquement)",
    monthlyBudget: "Salaire cadre (~2800€ net). Propriétaire. Budget contraint depuis divorce.",
    introExtrovert: "Introvertie (3/10 extraverti)", morningOrNight: "Matin (7h45 au campus quand personne)",
    bigLifeEvent: "Divorce 2020 (COVID+séparation simultanés). Révélatrice de résilience et autonomie.",
    managementStyle: "Bienveillant-exigeant - écoute + rigueur",
    decisionAuthority: "Autonomie totale gestion pédagogique. Consulte directeur pour financier, recrutements, sanctions graves.",
    careerPath: "Assistante pédagogique (2012) → Coordinatrice BTS (2015) → Responsable Pédagogique (2018)",
    teamRelations: "Très bonne avec 3 assistantes. Complexe avec certains enseignants (résistance au changement).",
    emailsPerDay: "80-120 emails/jour. Tri et réponse = 1h30/jour minimum.",
    meetingsPerWeek: "8-12 réunions/semaine",
    responsibleFor: "Coordination pédagogique 4 formations (240 étudiants)\nGestion emplois du temps\nSupervision 18 enseignants\nSuivi absences et sanctions\nOrganisation examens",
    teamSize: "3 assistantes pédagogiques + 18 enseignants",
    keyProcesses: "Inscriptions et réinscriptions\nCréation emplois du temps\nSuivi absences\nOrganisation examens/jurys\nÉdition bulletins et attestations\nGestion stages\nReporting direction et organismes",
    primarySystemNeeds: "Gestion complète du cycle de vie étudiant\nCréation et gestion des emplois du temps\nSuivi des absences avec alertes automatiques\nÉdition de documents administratifs\nGénération rapports et statistiques",
    frequentTasks: "Vérification absences (30 min/jour)\nRéponse attestations (10-15/jour)\nGestion modifications EDT (quotidien)\nTraitement justificatifs (20-30/semaine)",
    timeSpentOnSystem: "4 à 6 heures par jour", systemUsage: "100% ordinateur (double écran indispensable)",
    devices: "PC Dell double écran 24 pouces, iPhone 11",
    apps: "Outlook, Excel, Teams, Adobe Acrobat, outils signature électronique",
    techSavvy: "Avancé - Expert des systèmes de gestion mais frustrée par les limitations",
    digitalTools: "Excel (expert), Ypareo (expert), Outlook, Teams, outils de reporting",
    goals: "Automatiser les tâches répétitives\nVue d'ensemble temps réel sur tous les étudiants\nGénérer rapidement des rapports\nGérer emplois du temps avec détection conflits\nSuivre absences avec alertes automatiques",
    frustrations: "Interface vieillissante et lente\nPas de génération automatique de documents\nManque de tableaux de bord visuels\nPas d'alertes pour seuils critiques\nGestion EDT sans détection conflits",
    needs: "Tableau de bord KPI temps réel\nGénération automatique documents\nSystème d'alertes intelligent\nGestion EDT drag & drop avec conflits détectés\nWorkflow de validation\nModule reporting avancé",
    quote: "J'ai l'impression de passer 60% de mon temps à faire des tâches répétitives qui devraient être automatisées. On a besoin d'un vrai système moderne.",
    idealFeature: "Tableau de bord matinal 'Alertes du jour' : absences anormales, documents en attente, conflits EDT",
    dealBreaker: "Système qui perd des données ou ne trace pas les actions (RGPD). Pas d'export Excel.",
    onboardingExpectation: "Formation complète 2 jours + manuel détaillé + hotline 6 mois + transition parallèle"
  }
};

// ─── Completion score ─────────────────────────────────────────────────────────

const SCORED_FIELDS: (keyof Persona)[] = [
  "name", "age", "role", "type", "bio", "personality",
  "maritalStatus", "children", "nationality", "languages",
  "hobbies", "values", "fears", "deepMotivations", "stressLevel",
  "lifePhilosophy", "introExtrovert", "morningOrNight", "bigLifeEvent",
  "campus", "neighborhood", "housing", "transportation", "workSchedule",
  "techSavvy", "devices", "apps", "digitalTools",
  "primarySystemNeeds", "frequentTasks", "timeSpentOnSystem", "systemUsage",
  "goals", "frustrations", "needs", "quote"
];

const ROLE_FIELDS: Record<string, (keyof Persona)[]> = {
  "Étudiant": ["studentId", "studyLevel", "program", "learningStyle", "careerGoals", "whyKeyce"],
  "Enseignant": ["position", "department", "teachingStyle", "previousCareer", "teachingPhilosophy"],
  "Administration": ["position", "department", "responsibleFor", "managementStyle", "keyProcesses"]
};

function computeCompletion(persona: Persona): number {
  const roleSpecific = ROLE_FIELDS[persona.role] ?? [];
  const allFields = [...SCORED_FIELDS, ...roleSpecific];
  const filled = allFields.filter(f => (persona[f] as string)?.trim().length > 0).length;
  return Math.round((filled / allFields.length) * 100);
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function PersonaEditor() {
  const navigate = useNavigate();
  const school = getActiveSchool();
  const storageKey = personaKey(school.id);
  const savedKey = savedPersonasKey(school.id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [persona, setPersona] = useState<Persona>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) return JSON.parse(saved);
    return { ...EMPTY_PERSONA, campus: `${school.name} - ${school.city}` };
  });

  const updateField = useCallback((field: keyof Persona, value: string) => {
    setPersona(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleTemplateChange = (template: string) => {
    if (PERSONA_TEMPLATES[template]) {
      setPersona({ ...EMPTY_PERSONA, campus: `${school.name} - ${school.city}`, ...PERSONA_TEMPLATES[template] });
    }
  };

  const handleSave = () => {
    localStorage.setItem(storageKey, JSON.stringify(persona));
    // Also save to role-specific archive
    try {
      const saved = JSON.parse(localStorage.getItem(savedKey) ?? "{}");
      saved[persona.role] = persona;
      localStorage.setItem(savedKey, JSON.stringify(saved));
    } catch {}
    toast.success("Persona sauvegardé !");
  };

  const handleNext = () => { handleSave(); navigate("/journey-map"); };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image trop lourde (max 2 Mo)");
      return;
    }
    const reader = new FileReader();
    reader.onload = ev => {
      const result = ev.target?.result as string;
      updateField("photo", result);
    };
    reader.readAsDataURL(file);
  };

  const completion = computeCompletion(persona);
  const completionColor = completion >= 80 ? "bg-green-500" : completion >= 50 ? "bg-blue-500" : completion >= 30 ? "bg-yellow-500" : "bg-red-400";

  // Helper creators that close over updateField (stable reference)
  const makeF = (field: keyof Persona, label: string, placeholder?: string, rows?: number, span2?: boolean) => (
    <F key={field} label={label} value={persona[field] as string} onChange={v => updateField(field, v)}
      placeholder={placeholder} rows={rows} type={rows ? "textarea" : "input"} span2={span2} />
  );

  const makeSF = (field: keyof Persona, label: string, options: { value: string; label: string }[], placeholder?: string, span2?: boolean) => (
    <SF key={field} label={label} value={persona[field] as string} onChange={v => updateField(field, v)}
      options={options} placeholder={placeholder} span2={span2} />
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <Button variant="outline" onClick={() => navigate("/home")}>
            <ArrowLeft className="w-4 h-4 mr-2" />Retour
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold">Mission 1 : Créer un Persona</h1>
            <p className="text-sm text-gray-500">Nouveau Système de Gestion {school.name}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/compare")}><Users className="w-4 h-4 mr-2" />Comparer</Button>
            <Button onClick={handleSave}><Save className="w-4 h-4 mr-2" />Sauvegarder</Button>
          </div>
        </div>

        {/* Completion Bar */}
        <Card className="mb-4">
          <CardContent className="py-3">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 font-medium">Score de complétude du persona</span>
                  <span className={`font-bold ${completion >= 80 ? "text-green-600" : completion >= 50 ? "text-blue-600" : "text-orange-600"}`}>
                    {completion}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full transition-all duration-500 ${completionColor}`} style={{ width: `${completion}%` }} />
                </div>
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {completion < 30 ? "🔴 Incomplet" : completion < 60 ? "🟡 En cours" : completion < 80 ? "🔵 Bien avancé" : "🟢 Complet"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Banner */}
        <Card className="mb-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <CardContent className="py-3">
            <p className="text-sm">Créez un persona <strong>ultra-détaillé</strong> pour l'un des 3 rôles du nouveau système de gestion <strong>{school.name}</strong>.
            <span className="ml-2 opacity-80">• {school.totalStudents || "N/A"} étudiants • {school.totalTeachers || "N/A"} enseignants • {school.type}</span></p>
          </CardContent>
        </Card>

        {/* Role + Template */}
        <Card className="mb-4">
          <CardContent className="py-4 grid md:grid-cols-2 gap-4">
            {makeSF("role", "Rôle du persona *", [
              { value: "Étudiant", label: "👨‍🎓 Étudiant" },
              { value: "Enseignant", label: "👨‍🏫 Enseignant / Formateur" },
              { value: "Administration", label: "🏢 Administration / Direction" }
            ])}
            <div>
              <Label className="mb-1 block text-sm">Modèle pré-rempli (optionnel — contexte Keyce Toulouse)</Label>
              <Select onValueChange={handleTemplateChange}>
                <SelectTrigger><SelectValue placeholder="Choisir un modèle..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="etudiant-bts">Lucas Martin - L'étudiant connecté (BTS MCO)</SelectItem>
                  <SelectItem value="enseignant">Sophie Mercier - L'enseignante multi-campus</SelectItem>
                  <SelectItem value="admin">Marie Dubois - La responsable pédagogique</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* TABS — 7 onglets */}
        <Tabs defaultValue="identite" className="space-y-4">
          <TabsList className="grid w-full grid-cols-7 text-xs">
            <TabsTrigger value="identite" className="flex items-center gap-1">
              <User className="w-3 h-3" /><span className="hidden sm:inline">Identité</span>
            </TabsTrigger>
            <TabsTrigger value="perso" className="flex items-center gap-1">
              <Heart className="w-3 h-3" /><span className="hidden sm:inline">Vie Perso</span>
            </TabsTrigger>
            <TabsTrigger value="contexte" className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /><span className="hidden sm:inline">Contexte</span>
            </TabsTrigger>
            <TabsTrigger value="role-specifique" className="flex items-center gap-1">
              {persona.role === "Étudiant" && <GraduationCap className="w-3 h-3" />}
              {persona.role === "Enseignant" && <Briefcase className="w-3 h-3" />}
              {persona.role === "Administration" && <Settings className="w-3 h-3" />}
              <span className="hidden sm:inline">{persona.role === "Administration" ? "Admin" : persona.role}</span>
            </TabsTrigger>
            <TabsTrigger value="systeme" className="flex items-center gap-1">
              <Monitor className="w-3 h-3" /><span className="hidden sm:inline">Système</span>
            </TabsTrigger>
            <TabsTrigger value="tech" className="flex items-center gap-1">
              <Smartphone className="w-3 h-3" /><span className="hidden sm:inline">Tech</span>
            </TabsTrigger>
            <TabsTrigger value="ux" className="flex items-center gap-1">
              <Star className="w-3 h-3" /><span className="hidden sm:inline">UX/Besoins</span>
            </TabsTrigger>
          </TabsList>

          {/* ─── ONGLET 1 : IDENTITÉ ─── */}
          <TabsContent value="identite" className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><User className="w-5 h-5" />Informations de base</CardTitle></CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                {makeF("name", "Nom et Prénom *", "Ex: Lucas Martin")}
                {makeF("age", "Âge *", "Ex: 21 ans")}
                {makeF("type", "Type de Persona *", "Ex: L'étudiant connecté")}
                {makeF("occupation", "Occupation principale", "Ex: Étudiant BTS MCO")}
                {makeF("bio", "Bio / Contexte détaillé *",
                  "Décrivez le persona : parcours, situation actuelle, rapport au système de gestion...",
                  7, true)}
                {makeF("personality", "Traits de personnalité (mots-clés)",
                  "Ex: Dynamique, organisé, tech-savvy, impatient, sociable...", undefined, true)}
              </CardContent>
            </Card>

            {/* Photo Upload */}
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Camera className="w-5 h-5" />Photo du Persona</CardTitle></CardHeader>
              <CardContent className="flex items-center gap-6">
                <div className="flex-shrink-0">
                  {persona.photo ? (
                    <img src={persona.photo} alt="Photo persona" className="w-24 h-24 rounded-full object-cover border-4 border-blue-200 shadow" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold border-4 border-blue-200 shadow">
                      {persona.name.charAt(0) || "?"}
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-sm text-gray-600">Téléversez une photo pour ce persona (JPG, PNG, max 2 Mo)</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="gap-2">
                      <Upload className="w-4 h-4" />
                      {persona.photo ? "Changer la photo" : "Téléverser une photo"}
                    </Button>
                    {persona.photo && (
                      <Button variant="ghost" onClick={() => updateField("photo", "")} className="text-red-600">
                        Supprimer
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">La photo sera incluse dans le poster final et la comparaison de personas.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── ONGLET 2 : VIE PERSONNELLE ─── */}
          <TabsContent value="perso" className="space-y-4">

            <Card className="border-pink-200 bg-pink-50/30">
              <CardHeader><CardTitle className="text-pink-800">❤️ État Civil & Famille</CardTitle></CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                {makeSF("maritalStatus", "Situation familiale", [
                  { value: "Célibataire", label: "Célibataire" },
                  { value: "En couple", label: "En couple" },
                  { value: "Marié(e)", label: "Marié(e)" },
                  { value: "Pacsé(e)", label: "Pacsé(e)" },
                  { value: "Divorcé(e)", label: "Divorcé(e)" },
                  { value: "Veuf/Veuve", label: "Veuf/Veuve" }
                ])}
                {makeF("children", "Enfants", "Ex: 2 enfants (6 et 4 ans) ou Aucun")}
                {makeF("nationality", "Nationalité / Origine", "Ex: Française, parents algériens")}
                {makeF("languages", "Langues parlées (niveau)", "Ex: Français natif, Anglais B2, Espagnol A2")}
                {makeF("siblings", "Fratrie / Famille proche",
                  "Ex: 2 sœurs cadettes. Se sent responsable de les inspirer.", 2, true)}
                {persona.role === "Étudiant" && makeF("parentsProfession", "Profession des parents / tuteurs",
                  "Ex: Mère aide-soignante CHU, Père décédé. Grand-père ex-commerçant.", 2, true)}
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50/30">
              <CardHeader><CardTitle className="text-orange-800">🎨 Loisirs, Culture & Passions</CardTitle></CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                {makeF("hobbies", "Hobbies & Passions principales",
                  "Ex: Gaming, Photographie urbaine, Cuisine autodidacte, Podcasts entrepreneuriat", 2, true)}
                {makeF("sports", "Sports pratiqués (fréquence)",
                  "Ex: Football (équipe campus), Running 5km, Fitness 2x/semaine")}
                {makeF("musicTaste", "Goûts musicaux",
                  "Ex: Hip-hop français, R&B, Electronic pour travailler")}
                {makeF("readingHabits", "Habitudes de lecture & médias",
                  "Ex: Quasi exclusivement podcasts/YouTube. Lit 1-2 livres/an.", 2, true)}
                {makeF("currentReads", "Livre / Podcast en cours",
                  "Ex: 'L'entrepreneur millionnaire', revue Cahiers pédagogiques")}
                {makeF("favoriteSeries", "Séries / Films favoris",
                  "Ex: Money Heist, Breaking Bad, documentaires Netflix entreprise")}
                {makeF("weekendActivities", "Activités habituelles du week-end",
                  "Ex: Sorties amis, football dimanche matin, cuisine, gaming vendredi soir", 2, true)}
                {makeF("petOrNot", "Animal de compagnie",
                  "Ex: Labrador 'Gaston' 7 ans / Voudrait un chien mais studio interdit")}
                {makeF("travelHistory", "Expériences de voyage / Étranger",
                  "Ex: Séjour linguistique Londres. Vacances Maroc. Rêve d'Asie.")}
                {makeF("dreamVacation", "Destination de vacances rêvée",
                  "Ex: Road trip Californie + Silicon Valley / Islande")}
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50/30">
              <CardHeader><CardTitle className="text-purple-800">🧠 Psychologie & Valeurs Profondes</CardTitle></CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                {makeSF("introExtrovert", "Profil introversion / extraversion", [
                  { value: "Très extraverti (9-10/10)", label: "Très extraverti (9-10/10)" },
                  { value: "Extraverti (7-8/10)", label: "Extraverti (7-8/10)" },
                  { value: "Ambivert (5-6/10)", label: "Ambivert (5-6/10)" },
                  { value: "Introverti (3-4/10)", label: "Introverti (3-4/10)" },
                  { value: "Très introverti (1-2/10)", label: "Très introverti (1-2/10)" }
                ])}
                {makeSF("morningOrNight", "Lève-tôt ou Noctambule ?", [
                  { value: "Lève-tôt prononcé (avant 7h)", label: "Lève-tôt prononcé (avant 7h)" },
                  { value: "Matin (7h-8h30)", label: "Matin (7h-8h30)" },
                  { value: "Neutre - s'adapte", label: "Neutre - s'adapte" },
                  { value: "Noctambule (couche après 23h)", label: "Noctambule (couche après 23h)" },
                  { value: "Très noctambule (couche après 1h)", label: "Très noctambule (couche après 1h)" }
                ])}
                {makeF("values", "Valeurs personnelles fondamentales",
                  "Ex: Ambition, authenticité, loyauté, liberté financière, famille avant tout", 2, true)}
                {makeF("fears", "Peurs & Anxiétés profondes",
                  "Ex: Échouer les examens, décevoir ses parents, ne pas trouver de travail", 2, true)}
                {makeF("deepMotivations", "Motivations profondes",
                  "Ex: Prouver qu'il peut réussir malgré contexte modeste, offrir une vie meilleure", 3, true)}
                {makeF("lifePhilosophy", "Philosophie de vie / Citation personnelle",
                  'Ex: "Travaille dur en silence, laisse le succès faire le bruit"', 2, true)}
                {makeF("roleModel", "Modèles inspirants / Mentors",
                  "Ex: Elon Musk (ambition), Gary Vaynerchuk (entrepreneuriat), son oncle entrepreneur", 2, true)}
                {makeF("bigLifeEvent", "Événement marquant de sa vie (qui l'a façonné(e))",
                  "Ex: Perte de son père à 15 ans - l'a rendu très autonome. Reconversion à 32 ans.", 2, true)}
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50/30">
              <CardHeader><CardTitle className="text-green-800">💚 Bien-être, Santé & Mode de Vie</CardTitle></CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                {makeF("stressLevel", "Niveau de stress habituel (0-10 / contexte)",
                  "Ex: Élevé en examens (8/10), modéré le reste du temps (4/10)")}
                {makeF("stressManagement", "Comment gère-t-il/elle le stress ?",
                  "Ex: Gaming, appels mère, yoga quotidien, jardinage")}
                {makeF("sleepSchedule", "Rythme de sommeil",
                  "Ex: Couche-tard (minuit), lever difficile 7h15. Manque chronique de sommeil.")}
                {makeF("diet", "Alimentation / Rapport à la nourriture",
                  "Ex: Mange au campus ou snacks. Cuisine le week-end. Budget serré.")}
                {makeF("healthConsiderations", "Santé / Bien-être / Considérations particulières",
                  "Ex: Légères douleurs au dos. Lunettes. Anxiété ponctuelle. Tendinite poignet.", 2, true)}
                {makeF("volunteerWork", "Engagement associatif / Bénévolat",
                  "Ex: Président BDE. Tuteur bénévole lycéens. Banque alimentaire.", 2, true)}
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50/30">
              <CardHeader><CardTitle className="text-blue-800">💬 Société & Identité Numérique</CardTitle></CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                {makeSF("socialStyle", "Style social (comment se comporte-t-il/elle en groupe ?)", [
                  { value: "Leader naturel - prend les devants", label: "Leader naturel" },
                  { value: "Extraverti - parle facilement à tout le monde", label: "Extraverti - parle facilement à tous" },
                  { value: "Ambivert - s'adapte au contexte", label: "Ambivert - s'adapte au contexte" },
                  { value: "Observateur - préfère écouter avant de parler", label: "Observateur - écoute avant de parler" },
                  { value: "Introverti - préfère les petits groupes", label: "Introverti - petits groupes" }
                ])}
                {makeF("monthlyBudget", "Budget mensuel & situation financière",
                  "Ex: 850€ (APL+bourse+job). Loyer 450€, nourriture 150€")}
                {makeF("personalSocialMedia", "Réseaux sociaux personnels utilisés",
                  "Ex: Instagram (450 followers), TikTok (consommateur), LinkedIn (en construction)")}
                {makeF("politicalEngagement", "Engagement politique / civic",
                  "Ex: Vote régulièrement. Sensible aux politiques éducatives.")}
                {makeF("religiousViews", "Rapport à la religion / spiritualité",
                  "Ex: Athée pratiquant. Catholique discrète. Respectueux des croyances.")}
              </CardContent>
            </Card>

            {/* Questions spécifiques par rôle dans Vie Perso */}
            {persona.role === "Étudiant" && (
              <Card className="border-yellow-200 bg-yellow-50/30">
                <CardHeader><CardTitle className="text-yellow-800">🎓 Vie Perso — Spécifique Étudiant</CardTitle></CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  {makeF("whyKeyce", `Pourquoi avoir choisi ${school.shortName || school.name} ?`,
                    "Ex: Réputation de la formation, coût accessible, campus centre-ville, alternance proposée")}
                  {makeF("previousSchool", "Établissement précédent",
                    "Ex: Lycée Pierre de Fermat - Bac STMG mention Bien")}
                  {makeF("partTimeJob", "Job étudiant (type, heures, revenus)",
                    "Ex: Vendeur Décathlon 15h/semaine - 200€/mois")}
                  {makeF("financialAid", "Aides financières (bourse, APL, CAF...)",
                    "Ex: Bourse CROUS échelon 4 (4500€/an), APL 200€/mois")}
                  {makeF("dailyBudget", "Budget quotidien sur le campus",
                    "Ex: ~15€/jour (repas campus 5€, transport 2€)")}
                  {makeF("dreamJob", "Rêve professionnel ultime",
                    "Ex: Créer startup e-commerce sportif, Responsable marketing Nike/Adidas")}
                  {makeF("internshipExperience", "Expériences stage / alternance à ce jour",
                    "Ex: Stage 6 semaines Décathlon. Actuellement alternance vendeur 15h/sem.", 2, true)}
                  {makeF("relationWithTeachers", "Relation avec les enseignants",
                    "Ex: Bonne. Apprécie les profs terrain. Moins à l'aise avec théorie pure.")}
                  {makeF("afterSchoolPlan", "Projet après le diplôme (court terme)",
                    "Ex: Bachelor Marketing Digital en alternance (ici ou autre école)")}
                  {makeF("groupOrSolo", "Travaille plutôt seul ou en groupe ?",
                    "Ex: Fortement groupe (8/10) - apprend mieux en expliquant aux autres")}
                  {makeF("examStress", "Rapport aux examens / stress évaluation",
                    "Ex: Stress élevé mais canalisé. Dort mal la veille mais performant le jour J.")}
                  {makeF("repeatYear", "A déjà redoublé ?",
                    "Ex: Non - première tentative. Pression de réussir du premier coup.")}
                </CardContent>
              </Card>
            )}

            {persona.role === "Enseignant" && (
              <Card className="border-teal-200 bg-teal-50/30">
                <CardHeader><CardTitle className="text-teal-800">👨‍🏫 Vie Perso — Spécifique Enseignant</CardTitle></CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  {makeF("previousCareer", "Carrière précédente avant l'enseignement",
                    "Ex: 8 ans marketing B2B : Chef produit (2 ans), Resp. marketing Fnac (3 ans), Consultante", 2, true)}
                  {makeF("whyTeaching", "Pourquoi avoir choisi l'enseignement ?",
                    "Ex: Lassitude du corporate, envie de transmettre, flexibilité famille")}
                  {makeF("teachingPhilosophy", "Philosophie pédagogique personnelle",
                    "Ex: Pédagogie active et expérientielle. Chaque cours doit avoir un ancrage concret.", 2, true)}
                  {makeF("proudestAchievement", "Sa plus grande fierté professionnelle",
                    "Ex: 3 anciens étudiants créent leur startup. Une étudiante décroche CDI chez LVMH.", 2, true)}
                  {makeF("biggestChallenge", "Son plus grand défi actuel",
                    "Ex: Maintenir cours à jour dans domaine qui évolue tous les 6 mois.", 2, true)}
                  {makeF("mentors", "Mentors / modèles (pro ou perso)",
                    "Ex: Son directeur pédagogique (bienveillance). Ex-collègue consultante (rigueur).")}
                  {makeF("workLifeBalance", "Équilibre vie professionnelle / personnelle",
                    "Ex: Difficile avec 2 jeunes enfants + double campus. Mari très impliqué.")}
                  {makeF("hopeForStudents", "Espoir pour ses étudiants",
                    "Ex: Qu'ils trouvent un métier qui leur plait. Qu'ils gardent leur curiosité.", 2, true)}
                  {makeF("careerPlans", "Plans de carrière futurs (3-5 ans)",
                    "Ex: Coordination pédagogique dans 3-5 ans. Veut rester proche du terrain.")}
                  {makeF("jobSatisfaction", "Satisfaction au travail (note et pourquoi)",
                    "Ex: 7/10 - Passion intacte pour péda. Frustration face au temps perdu en admin.")}
                  {makeF("prepTime", "Temps de préparation des cours",
                    "Ex: 2-3h/heure nouveau cours, 30min cours rodé. Corrections: 1h30/25 copies.")}
                  {makeF("teachingAtOtherSchools", "Intervient dans d'autres établissements ?",
                    "Ex: 2 jours/mois à Bordeaux campus. A refusé autres écoles (fidélité).")}
                  {makeF("continuingEducation", "Formation continue récente",
                    "Ex: Google Analytics 4 (2023), cert. HubSpot marketing (2022)")}
                  {makeF("unionMembership", "Membre d'un syndicat ?",
                    "Ex: Non syndiqué(e) mais suit les actualités de la CFDT Enseignement")}
                  {makeF("relationWithStudents", "Relation avec les étudiants",
                    "Ex: Excellente - exigeante mais juste. Connaît tous les prénoms.")}
                  {makeF("relationWithAdmin", "Relation avec l'administration",
                    "Ex: Correcte mais tendue sur délais saisie notes et changements EDT.")}
                  {makeF("salaryRange", "Fourchette de salaire (orientative)",
                    "Ex: ~38 000€/an brut CDI plein temps. Pense mériter plus.")}
                </CardContent>
              </Card>
            )}

            {persona.role === "Administration" && (
              <Card className="border-red-200 bg-red-50/30">
                <CardHeader><CardTitle className="text-red-800">🏢 Vie Perso — Spécifique Administration</CardTitle></CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  {makeSF("managementStyle", "Style de management", [
                    { value: "Directif - décisions rapides, cadre clair", label: "Directif - décisions rapides" },
                    { value: "Participatif - consulte l'équipe avant de décider", label: "Participatif - consulte l'équipe" },
                    { value: "Délégateur - fait confiance et laisse faire", label: "Délégateur - fait confiance" },
                    { value: "Bienveillant-exigeant - écoute + rigueur", label: "Bienveillant-exigeant" },
                    { value: "Situationnel - adapte selon contexte", label: "Situationnel - adapte selon contexte" }
                  ])}
                  {makeF("decisionAuthority", "Niveau d'autorité décisionnelle",
                    "Ex: Autonomie totale gestion péda. Consulte directeur pour finances, sanctions graves.")}
                  {makeF("careerPath", "Parcours professionnel (comment est arrivé(e) à ce poste)",
                    "Ex: Assistante péda (2012) → Coordinatrice BTS (2015) → Resp. Pédagogique (2018)", 2, true)}
                  {makeF("teamRelations", "Relations avec l'équipe",
                    "Ex: Très bonne avec 3 assistantes. Complexe avec certains enseignants (résistance).")}
                  {makeF("remoteWork", "Télétravail possible ?",
                    "Ex: Possible mais rarement pratiqué - présence, urgences, accès système.")}
                  {makeF("emailsPerDay", "Volume d'emails / jour",
                    "Ex: 80-120 emails/jour (étudiants, profs, parents, direction, OPCO)")}
                  {makeF("meetingsPerWeek", "Nombre de réunions / semaine",
                    "Ex: 8-12 réunions (équipe péda lundi, conseil classe mensuel, direction)")}
                  {makeF("reportTo", "Rapporte à qui ?",
                    "Ex: DG (hebdo). Coordinatrice nationale (mensuel KPI).")}
                  {makeF("externalRelations", "Relations avec partenaires externes",
                    "Ex: OPCO, Rectorat, entreprises partenaires, familles, CROUS", 2, true)}
                  {makeF("biggestChallengeAdmin", "Son plus grand défi quotidien",
                    "Ex: Gérer changements EDT dernière minute tout en maintenant qualité pédagogique", 2, true)}
                  {makeF("proudestAchievementAdmin", "Sa plus grande fierté professionnelle",
                    "Ex: Taux réussite examens 89% (meilleur historique). Zéro recours légal en 12 ans.", 2, true)}
                  {makeF("workLifeBalanceAdmin", "Équilibre vie pro / perso",
                    "Ex: Difficile. Efforts depuis divorce pour ne pas rester après 18h30.")}
                  {makeF("regulatoryPressure", "Pression réglementaire / conformité",
                    "Ex: Forte pression certif. (France Compétences, Rectorat). Contrôles annuels.")}
                  {makeF("conflictManagement", "Gestion des conflits (méthode)",
                    "Ex: Médiation avant sanctions. Garde traces écrites. Applique règlement avec équité.")}
                  {makeF("adminSatisfaction", "Satisfaction dans le poste (note et pourquoi)",
                    "Ex: 6/10 - Aime son impact. Épuisement face aux tâches répétitives. Envisage évolution.")}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ─── ONGLET 3 : CONTEXTE ─── */}
          <TabsContent value="contexte" className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="w-5 h-5" />🏙️ Contexte & Campus</CardTitle></CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                {makeF("campus", "Campus / Établissement", `Ex: ${school.name} - ${school.city}`, undefined, true)}
                {makeSF("neighborhood", "Quartier de résidence", [
                  { value: "Centre-ville", label: "Centre-ville" },
                  { value: "Jean-Jaurès / Carmes", label: "Jean-Jaurès / Carmes" },
                  { value: "Saint-Cyprien", label: "Saint-Cyprien" },
                  { value: "Compans-Caffarelli / Minimes", label: "Compans-Caffarelli" },
                  { value: "Rangueil / Sauzelong", label: "Rangueil / Sauzelong" },
                  { value: "Mirail / Université", label: "Mirail / Université" },
                  { value: "Saint-Agne / Pech-David", label: "Saint-Agne / Pech-David" },
                  { value: "Banlieue proche", label: "Banlieue proche" },
                  { value: "Autre / Hors ville", label: "Autre / Hors ville" }
                ])}
                {makeF("housing", "Type de logement", "Ex: Studio étudiant / Appartement propriétaire T3")}
                {makeF("transportation", "Transport quotidien (détaillé)",
                  "Ex: Métro + marche 10min / Voiture + parking campus", undefined, true)}
                {makeF("arriveTime", "Heure d'arrivée au campus", "Ex: 8h15 / 7h45")}
                {makeF("departTime", "Heure de départ du campus", "Ex: 17h30 / 18h30")}
                {makeF("workSchedule", "Emploi du temps type",
                  "Ex: 8h30-17h30 (lundi-vendredi) / Horaires variables 24h cours/semaine", undefined, true)}
                {makeF("favoriteSpots", "Lieux favoris (campus + ville)",
                  "Ex: Bibliothèque, Coworking, Café du quartier, Marché local", 2, true)}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── ONGLET 4 : RÔLE SPÉCIFIQUE ─── */}
          <TabsContent value="role-specifique" className="space-y-4">
            {persona.role === "Étudiant" && (
              <Card>
                <CardHeader><CardTitle>🎓 Profil Académique Étudiant</CardTitle></CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  {makeF("studentId", "Numéro étudiant", "Ex: KEY2024-MCO-0156")}
                  {makeF("enrollmentDate", "Date d'inscription", "Ex: Septembre 2023")}
                  {makeSF("studyLevel", "Niveau d'études", [
                    { value: "Bac+1", label: "Bac+1 (1ère année)" },
                    { value: "Bac+2", label: "Bac+2 (BTS/DUT)" },
                    { value: "Bac+3", label: "Bac+3 (Licence/Bachelor)" },
                    { value: "Bac+4", label: "Bac+4 (Master 1 / Maîtrise)" },
                    { value: "Bac+5", label: "Bac+5 (Master 2 / Mastère)" },
                    { value: "Bac+8", label: "Bac+8 (Doctorat)" }
                  ])}
                  {makeF("yearOfStudy", "Année d'études", "Ex: 2ème année")}
                  {makeF("program", "Programme / Filière",
                    "Ex: BTS MCO, Bachelor Marketing, Master Finance...", undefined, true)}
                  {makeF("scholarshipStatus", "Statut bourse (CROUS ou autre)",
                    "Ex: Boursier échelon 4 / Non boursier / Bourse étrangère")}
                  {makeF("learningStyle", "Style d'apprentissage préféré",
                    "Ex: Visuel et pratique - préfère vidéos et cas concrets")}
                  {makeF("studyHabits", "Habitudes d'étude",
                    "Ex: Travail en groupe, révisions de dernière minute, utilise YouTube", 2, true)}
                  {makeF("academicStrengths", "Points forts académiques",
                    "Ex: Présentation orale, travaux pratiques, projets groupe")}
                  {makeF("academicWeaknesses", "Points faibles académiques",
                    "Ex: Manque rigueur à l'écrit, gestion du temps long terme")}
                  {makeF("bestSubject", "Matière préférée",
                    "Ex: Management commercial, Marketing digital, Gestion de projet")}
                  {makeF("worstSubject", "Matière la plus difficile",
                    "Ex: Comptabilité, Droit commercial, Anglais écrit")}
                  {makeF("extracurricular", "Activités extra-scolaires",
                    "Ex: Président BDE, équipe football, tuteur bénévole", 2, true)}
                  {makeF("careerGoals", "Objectifs de carrière",
                    "Ex: Responsable magasin → Marketing → Créer sa propre entreprise", 2, true)}
                  {makeF("yearGoal", "Objectif principal pour cette année scolaire",
                    "Ex: Obtenir BTS avec mention, décrocher alternance, développer réseau", undefined, true)}
                </CardContent>
              </Card>
            )}

            {persona.role === "Enseignant" && (
              <Card>
                <CardHeader><CardTitle>👨‍🏫 Profil Professionnel Enseignant</CardTitle></CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  {makeF("position", "Poste / Fonction officielle",
                    "Ex: Formateur(trice) en Marketing et Commerce")}
                  {makeF("department", "Département / Pôle",
                    "Ex: Pôle Commerce / Marketing")}
                  {makeF("yearsAtKeyce", `Ancienneté à ${school.shortName || school.name}`,
                    "Ex: 6 ans")}
                  {makeSF("contractType", "Type de contrat", [
                    { value: "CDI temps plein", label: "CDI temps plein" },
                    { value: "CDI temps partiel", label: "CDI temps partiel" },
                    { value: "CDD", label: "CDD" },
                    { value: "Vacataire / Intervenant ponctuel", label: "Vacataire / Intervenant" },
                    { value: "Formateur alternant", label: "Formateur alternant" },
                    { value: "Enseignant-chercheur", label: "Enseignant-chercheur (EC)" }
                  ])}
                  {makeF("teachingHours", "Volume horaire d'enseignement",
                    "Ex: 24h/semaine cours + 10h préparation/correction")}
                  {makeF("studyLevel", "Diplôme le plus élevé",
                    "Ex: Master 2 Commerce International, Doctorat Mathématiques")}
                  {makeF("subjectsTaught", "Matières enseignées",
                    "Ex: Marketing digital, E-commerce, Stratégie commerciale, Négociation", 2, true)}
                  {makeF("teachingStyle", "Style pédagogique",
                    "Ex: Pédagogie active avec études de cas, travaux de groupe, interventions pro", 2, true)}
                  {makeF("classSize", "Taille des classes",
                    "Ex: Classes de 20-30 étudiants")}
                  {makeF("teamSize", "Nombre total d'étudiants suivis",
                    "Ex: 180 étudiants sur 8 classes")}
                  {makeF("assessmentMethods", "Méthodes d'évaluation utilisées",
                    "Ex: Contrôles continus, projets de groupe, soutenances orales, examens finaux", 2, true)}
                </CardContent>
              </Card>
            )}

            {persona.role === "Administration" && (
              <Card>
                <CardHeader><CardTitle>🏢 Profil Professionnel Administration</CardTitle></CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  {makeF("position", "Poste / Fonction officielle",
                    "Ex: Responsable Pédagogique BTS/Bachelor")}
                  {makeF("department", "Service / Direction",
                    "Ex: Direction Pédagogique et Vie Scolaire")}
                  {makeF("yearsAtKeyce", `Ancienneté à ${school.shortName || school.name}`,
                    "Ex: 12 ans")}
                  {makeF("contractType", "Contrat", "Ex: CDI Cadre, Fonctionnaire catégorie A")}
                  {makeF("studyLevel", "Diplôme le plus élevé",
                    "Ex: Master 2 Management des Organisations")}
                  {makeF("teamSize", "Taille de l'équipe",
                    "Ex: 3 assistantes pédagogiques + 18 enseignants")}
                  {makeF("responsibleFor", "Responsabilités principales (scope)",
                    "Ex: Coordination pédagogique 4 formations (240 étudiants), gestion EDT, supervision enseignants...",
                    4, true)}
                  {makeF("keyProcesses", "Processus clés gérés au quotidien",
                    "Ex: Inscriptions, emplois du temps, suivi absences, examens/jurys, bulletins, stages, reporting...",
                    3, true)}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ─── ONGLET 5 : SYSTÈME ─── */}
          <TabsContent value="systeme" className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Monitor className="w-5 h-5" />💻 Utilisation du Système de Gestion</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {makeF("primarySystemNeeds",
                  `Besoins principaux vis-à-vis du nouveau système ${school.name} (une fonctionnalité par ligne)`,
                  "Ex: Consultation emploi du temps\nSignature émargement\nAccès aux notes\nTéléchargement attestations",
                  8, true)}
                {makeF("frequentTasks", "Tâches fréquentes (avec fréquence estimée)",
                  "Ex: Consulter emploi du temps (2-3x/jour)\nSigner émargement (chaque cours)\nVérifier notes (1-2x/semaine)",
                  6, true)}
                <div className="grid md:grid-cols-2 gap-4">
                  {makeF("timeSpentOnSystem", "Temps passé sur le système par jour",
                    "Ex: 10-15 min/jour / 4-6 heures/jour")}
                  {makeF("systemUsage", "Mode d'utilisation principal",
                    "Ex: 90% mobile / 100% ordinateur double écran")}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── ONGLET 6 : TECH ─── */}
          <TabsContent value="tech" className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Smartphone className="w-5 h-5" />📱 Profil Technologique</CardTitle></CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                {makeSF("techSavvy", "Aisance technologique générale", [
                  { value: "Expert - Early adopter, teste tout en premier", label: "Expert - Early adopter" },
                  { value: "Avancé - Utilisateur régulier et autonome", label: "Avancé - Utilisateur régulier autonome" },
                  { value: "Moyen - Utilise le nécessaire sans plus", label: "Moyen - Utilise le nécessaire" },
                  { value: "Basique - Préfère la simplicité maximale", label: "Basique - Préfère la simplicité" },
                  { value: "Réfractaire - Utilise uniquement si obligé", label: "Réfractaire - Utilise si obligé" }
                ])}
                {makeF("devices", "Appareils utilisés (perso + pro)",
                  "Ex: iPhone 13, MacBook Air M1, iPad / PC Dell double écran 24 pouces")}
                {makeF("apps", "Applications fréquentes (perso)",
                  "Ex: Instagram, TikTok, Notion, Discord, Spotify...", 2, true)}
                {makeF("digitalTools", "Outils numériques professionnels / études",
                  "Ex: Notion, Google Calendar, Discord, Slack, Trello, Moodle, Google Workspace...", 2, true)}
                {makeF("privacyConcerns", "Rapport à la vie privée numérique / RGPD",
                  "Ex: Peu préoccupé si service utile / Très vigilant sur données étudiants (RGPD)", 2, true)}
                {makeF("techFrustrations", "Frustrations technologiques habituelles",
                  "Ex: Apps lentes, interfaces non intuitives, trop d'étapes pour action simple", 2, true)}
                {makeF("learnNewTechHow", "Comment apprend-il/elle un nouvel outil ?",
                  "Ex: YouTube tutorials + trial & error / Formation formelle obligatoire + documentation", 2, true)}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── ONGLET 7 : UX / BESOINS ─── */}
          <TabsContent value="ux" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-green-300">
                <CardHeader><CardTitle className="text-green-700">✅ Objectifs & Motivations</CardTitle></CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Objectifs vis-à-vis du nouveau système (un par ligne)"
                    value={persona.goals} onChange={e => updateField("goals", e.target.value)} rows={9} />
                </CardContent>
              </Card>
              <Card className="border-red-300">
                <CardHeader><CardTitle className="text-red-700">❌ Frustrations & Points de douleur</CardTitle></CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Frustrations actuelles avec le système existant (une par ligne)"
                    value={persona.frustrations} onChange={e => updateField("frustrations", e.target.value)} rows={9} />
                </CardContent>
              </Card>
              <Card className="border-blue-300">
                <CardHeader><CardTitle className="text-blue-700">⭐ Besoins & Attentes pour le nouveau système</CardTitle></CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Besoins pour le nouveau système (un par ligne)"
                    value={persona.needs} onChange={e => updateField("needs", e.target.value)} rows={9} />
                </CardContent>
              </Card>
              <Card className="border-purple-300">
                <CardHeader><CardTitle className="text-purple-700">💬 Citation Représentative</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Citation qui capture ses frustrations et sa vision idéale..."
                    value={persona.quote} onChange={e => updateField("quote", e.target.value)} rows={5} />
                  <div>
                    <Label className="mb-1 block text-sm">✨ Fonctionnalité idéale rêvée</Label>
                    <Textarea
                      placeholder="Ex: Widget emploi du temps sur l'écran d'accueil iOS et notifications instantanées"
                      value={persona.idealFeature} onChange={e => updateField("idealFeature", e.target.value)} rows={3} />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-orange-300">
                <CardHeader><CardTitle className="text-orange-700">🚫 Deal Breaker (ce qui le/la ferait abandonner)</CardTitle></CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Ex: Pas d'application mobile = rédhibitoire. Plus de 3 clics pour une action fréquente."
                    value={persona.dealBreaker} onChange={e => updateField("dealBreaker", e.target.value)} rows={4} />
                </CardContent>
              </Card>
              <Card className="border-teal-300">
                <CardHeader><CardTitle className="text-teal-700">🚀 Attentes Onboarding / Prise en main</CardTitle></CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Ex: Tutoriel interactif à la première connexion. Aide contextuelle. Pas de manuel PDF."
                    value={persona.onboardingExpectation} onChange={e => updateField("onboardingExpectation", e.target.value)} rows={4} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleNext} size="lg" className="text-lg px-8 py-6">
            Suivant : Journey Map →
          </Button>
        </div>
      </div>
    </div>
  );
}
