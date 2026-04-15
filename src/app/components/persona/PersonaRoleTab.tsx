import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { Persona } from "../../lib/types";
import type { School } from "../../lib/schoolStore";
import { makeFieldHelper, type UpdateFieldFn } from "./PersonaFields";

interface Props {
  persona: Persona;
  updateField: UpdateFieldFn;
  school: School;
}

export function PersonaRoleTab({ persona, updateField, school }: Props) {
  const { makeF, makeSF } = makeFieldHelper(persona, updateField);

  if (persona.role === "Étudiant") return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle>&#127891; Profil Académique Étudiant</CardTitle></CardHeader>
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
          {makeF("program", "Programme / Filière", "Ex: BTS MCO, Bachelor Marketing, Master Finance...", undefined, true)}
          {makeF("scholarshipStatus", "Statut bourse (CROUS ou autre)", "Ex: Boursier échelon 4 / Non boursier / Bourse étrangère")}
          {makeF("learningStyle", "Style d'apprentissage préféré", "Ex: Visuel et pratique - préfère vidéos et cas concrets")}
          {makeF("studyHabits", "Habitudes d'étude", "Ex: Travail en groupe, révisions de dernière minute, utilise YouTube", 2, true)}
          {makeF("academicStrengths", "Points forts académiques", "Ex: Présentation orale, travaux pratiques, projets groupe")}
          {makeF("academicWeaknesses", "Points faibles académiques", "Ex: Manque rigueur à l'écrit, gestion du temps long terme")}
          {makeF("bestSubject", "Matière préférée", "Ex: Management commercial, Marketing digital, Gestion de projet")}
          {makeF("worstSubject", "Matière la plus difficile", "Ex: Comptabilité, Droit commercial, Anglais écrit")}
          {makeF("extracurricular", "Activités extra-scolaires", "Ex: Président BDE, équipe football, tuteur bénévole", 2, true)}
          {makeF("careerGoals", "Objectifs de carrière", "Ex: Responsable magasin → Marketing → Créer sa propre entreprise", 2, true)}
          {makeF("yearGoal", "Objectif principal pour cette année scolaire", "Ex: Obtenir BTS avec mention, décrocher alternance, développer réseau", undefined, true)}
        </CardContent>
      </Card>
    </div>
  );

  if (persona.role === "Enseignant") return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle>&#128104;&#8205;&#127979; Profil Professionnel Enseignant</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          {makeF("position", "Poste / Fonction officielle", "Ex: Formateur(trice) en Marketing et Commerce")}
          {makeF("department", "Département / Pôle", "Ex: Pôle Commerce / Marketing")}
          {makeF("yearsAtKeyce", `Ancienneté à ${school.shortName || school.name}`, "Ex: 6 ans")}
          {makeSF("contractType", "Type de contrat", [
            { value: "CDI temps plein", label: "CDI temps plein" },
            { value: "CDI temps partiel", label: "CDI temps partiel" },
            { value: "CDD", label: "CDD" },
            { value: "Vacataire / Intervenant ponctuel", label: "Vacataire / Intervenant" },
            { value: "Formateur alternant", label: "Formateur alternant" },
            { value: "Enseignant-chercheur", label: "Enseignant-chercheur (EC)" }
          ])}
          {makeF("teachingHours", "Volume horaire d'enseignement", "Ex: 24h/semaine cours + 10h préparation/correction")}
          {makeF("studyLevel", "Diplôme le plus élevé", "Ex: Master 2 Commerce International, Doctorat Mathématiques")}
          {makeF("subjectsTaught", "Matières enseignées", "Ex: Marketing digital, E-commerce, Stratégie commerciale, Négociation", 2, true)}
          {makeF("teachingStyle", "Style pédagogique", "Ex: Pédagogie active avec études de cas, travaux de groupe, interventions pro", 2, true)}
          {makeF("classSize", "Taille des classes", "Ex: Classes de 20-30 étudiants")}
          {makeF("teamSize", "Nombre total d'étudiants suivis", "Ex: 180 étudiants sur 8 classes")}
          {makeF("assessmentMethods", "Méthodes d'évaluation utilisées", "Ex: Contrôles continus, projets de groupe, soutenances orales, examens finaux", 2, true)}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle>&#127970; Profil Professionnel Administration</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          {makeF("position", "Poste / Fonction officielle", "Ex: Responsable Pédagogique BTS/Bachelor")}
          {makeF("department", "Service / Direction", "Ex: Direction Pédagogique et Vie Scolaire")}
          {makeF("yearsAtKeyce", `Ancienneté à ${school.shortName || school.name}`, "Ex: 12 ans")}
          {makeF("contractType", "Contrat", "Ex: CDI Cadre, Fonctionnaire catégorie A")}
          {makeF("studyLevel", "Diplôme le plus élevé", "Ex: Master 2 Management des Organisations")}
          {makeF("teamSize", "Taille de l'équipe", "Ex: 3 assistantes pédagogiques + 18 enseignants")}
          {makeF("responsibleFor", "Responsabilités principales (scope)",
            "Ex: Coordination pédagogique 4 formations (240 étudiants), gestion EDT, supervision enseignants...", 4, true)}
          {makeF("keyProcesses", "Processus clés gérés au quotidien",
            "Ex: Inscriptions, emplois du temps, suivi absences, examens/jurys, bulletins, stages, reporting...", 3, true)}
        </CardContent>
      </Card>
    </div>
  );
}
