import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { Persona } from "../../lib/types";
import { makeFieldHelper, type UpdateFieldFn } from "./PersonaFields";

interface Props {
  persona: Persona;
  updateField: UpdateFieldFn;
  schoolShortName: string;
  schoolName: string;
}

export function PersonaPersonalTab({ persona, updateField, schoolShortName, schoolName }: Props) {
  const { makeF, makeSF } = makeFieldHelper(persona, updateField);

  return (
    <div className="space-y-4">
      <Card className="border-pink-200 bg-pink-50/30 dark:border-pink-900 dark:bg-pink-950/30">
        <CardHeader><CardTitle className="text-pink-800 dark:text-pink-200">&#10084;&#65039; État Civil & Famille</CardTitle></CardHeader>
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
          {makeF("siblings", "Fratrie / Famille proche", "Ex: 2 sœurs cadettes. Se sent responsable de les inspirer.", 2, true)}
          {persona.role === "Étudiant" && makeF("parentsProfession", "Profession des parents / tuteurs",
            "Ex: Mère aide-soignante CHU, Père décédé. Grand-père ex-commerçant.", 2, true)}
        </CardContent>
      </Card>

      <Card className="border-orange-200 bg-orange-50/30 dark:border-orange-900 dark:bg-orange-950/30">
        <CardHeader><CardTitle className="text-orange-800 dark:text-orange-200">&#127912; Loisirs, Culture & Passions</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          {makeF("hobbies", "Hobbies & Passions principales", "Ex: Gaming, Photographie urbaine, Cuisine autodidacte, Podcasts entrepreneuriat", 2, true)}
          {makeF("sports", "Sports pratiqués (fréquence)", "Ex: Football (équipe campus), Running 5km, Fitness 2x/semaine")}
          {makeF("musicTaste", "Goûts musicaux", "Ex: Hip-hop français, R&B, Electronic pour travailler")}
          {makeF("readingHabits", "Habitudes de lecture & médias", "Ex: Quasi exclusivement podcasts/YouTube. Lit 1-2 livres/an.", 2, true)}
          {makeF("currentReads", "Livre / Podcast en cours", "Ex: 'L'entrepreneur millionnaire', revue Cahiers pédagogiques")}
          {makeF("favoriteSeries", "Séries / Films favoris", "Ex: Money Heist, Breaking Bad, documentaires Netflix entreprise")}
          {makeF("weekendActivities", "Activités habituelles du week-end", "Ex: Sorties amis, football dimanche matin, cuisine, gaming vendredi soir", 2, true)}
          {makeF("petOrNot", "Animal de compagnie", "Ex: Labrador 'Gaston' 7 ans / Voudrait un chien mais studio interdit")}
          {makeF("travelHistory", "Expériences de voyage / Étranger", "Ex: Séjour linguistique Londres. Vacances Maroc. Rêve d'Asie.")}
          {makeF("dreamVacation", "Destination de vacances rêvée", "Ex: Road trip Californie + Silicon Valley / Islande")}
        </CardContent>
      </Card>

      <Card className="border-purple-200 bg-purple-50/30 dark:border-purple-900 dark:bg-purple-950/30">
        <CardHeader><CardTitle className="text-purple-800 dark:text-purple-200">&#129504; Psychologie & Valeurs Profondes</CardTitle></CardHeader>
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
          {makeF("values", "Valeurs personnelles fondamentales", "Ex: Ambition, authenticité, loyauté, liberté financière, famille avant tout", 2, true)}
          {makeF("fears", "Peurs & Anxiétés profondes", "Ex: Échouer les examens, décevoir ses parents, ne pas trouver de travail", 2, true)}
          {makeF("deepMotivations", "Motivations profondes", "Ex: Prouver qu'il peut réussir malgré contexte modeste, offrir une vie meilleure", 3, true)}
          {makeF("lifePhilosophy", "Philosophie de vie / Citation personnelle", 'Ex: "Travaille dur en silence, laisse le succès faire le bruit"', 2, true)}
          {makeF("roleModel", "Modèles inspirants / Mentors", "Ex: Elon Musk (ambition), Gary Vaynerchuk (entrepreneuriat), son oncle entrepreneur", 2, true)}
          {makeF("bigLifeEvent", "Événement marquant de sa vie (qui l'a façonné(e))", "Ex: Perte de son père à 15 ans - l'a rendu très autonome. Reconversion à 32 ans.", 2, true)}
        </CardContent>
      </Card>

      <Card className="border-green-200 bg-green-50/30 dark:border-green-900 dark:bg-green-950/30">
        <CardHeader><CardTitle className="text-green-800 dark:text-green-200">&#128154; Bien-être, Santé & Mode de Vie</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          {makeF("stressLevel", "Niveau de stress habituel (0-10 / contexte)", "Ex: Élevé en examens (8/10), modéré le reste du temps (4/10)")}
          {makeF("stressManagement", "Comment gère-t-il/elle le stress ?", "Ex: Gaming, appels mère, yoga quotidien, jardinage")}
          {makeF("sleepSchedule", "Rythme de sommeil", "Ex: Couche-tard (minuit), lever difficile 7h15. Manque chronique de sommeil.")}
          {makeF("diet", "Alimentation / Rapport à la nourriture", "Ex: Mange au campus ou snacks. Cuisine le week-end. Budget serré.")}
          {makeF("healthConsiderations", "Santé / Bien-être / Considérations particulières", "Ex: Légères douleurs au dos. Lunettes. Anxiété ponctuelle. Tendinite poignet.", 2, true)}
          {makeF("volunteerWork", "Engagement associatif / Bénévolat", "Ex: Président BDE. Tuteur bénévole lycéens. Banque alimentaire.", 2, true)}
        </CardContent>
      </Card>

      <Card className="border-blue-200 bg-blue-50/30 dark:border-blue-900 dark:bg-blue-950/30">
        <CardHeader><CardTitle className="text-blue-800 dark:text-blue-200">&#128172; Société & Identité Numérique</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          {makeSF("socialStyle", "Style social (comment se comporte-t-il/elle en groupe ?)", [
            { value: "Leader naturel - prend les devants", label: "Leader naturel" },
            { value: "Extraverti - parle facilement à tout le monde", label: "Extraverti - parle facilement à tous" },
            { value: "Ambivert - s'adapte au contexte", label: "Ambivert - s'adapte au contexte" },
            { value: "Observateur - préfère écouter avant de parler", label: "Observateur - écoute avant de parler" },
            { value: "Introverti - préfère les petits groupes", label: "Introverti - petits groupes" }
          ])}
          {makeF("monthlyBudget", "Budget mensuel & situation financière", "Ex: 850€ (APL+bourse+job). Loyer 450€, nourriture 150€")}
          {makeF("personalSocialMedia", "Réseaux sociaux personnels utilisés", "Ex: Instagram (450 followers), TikTok (consommateur), LinkedIn (en construction)")}
          {makeF("politicalEngagement", "Engagement politique / civic", "Ex: Vote régulièrement. Sensible aux politiques éducatives.")}
          {makeF("religiousViews", "Rapport à la religion / spiritualité", "Ex: Athée pratiquant. Catholique discrète. Respectueux des croyances.")}
        </CardContent>
      </Card>

      {persona.role === "Étudiant" && (
        <Card className="border-yellow-200 bg-yellow-50/30 dark:border-yellow-900 dark:bg-yellow-950/30">
          <CardHeader><CardTitle className="text-yellow-800 dark:text-yellow-200">&#127891; Vie Perso — Spécifique Étudiant</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            {makeF("whyKeyce", `Pourquoi avoir choisi ${schoolShortName || schoolName} ?`, "Ex: Réputation de la formation, coût accessible, campus centre-ville, alternance proposée")}
            {makeF("previousSchool", "Établissement précédent", "Ex: Lycée Pierre de Fermat - Bac STMG mention Bien")}
            {makeF("partTimeJob", "Job étudiant (type, heures, revenus)", "Ex: Vendeur Décathlon 15h/semaine - 200€/mois")}
            {makeF("financialAid", "Aides financières (bourse, APL, CAF...)", "Ex: Bourse CROUS échelon 4 (4500€/an), APL 200€/mois")}
            {makeF("dailyBudget", "Budget quotidien sur le campus", "Ex: ~15€/jour (repas campus 5€, transport 2€)")}
            {makeF("dreamJob", "Rêve professionnel ultime", "Ex: Créer startup e-commerce sportif, Responsable marketing Nike/Adidas")}
            {makeF("internshipExperience", "Expériences stage / alternance à ce jour", "Ex: Stage 6 semaines Décathlon. Actuellement alternance vendeur 15h/sem.", 2, true)}
            {makeF("relationWithTeachers", "Relation avec les enseignants", "Ex: Bonne. Apprécie les profs terrain. Moins à l'aise avec théorie pure.")}
            {makeF("afterSchoolPlan", "Projet après le diplôme (court terme)", "Ex: Bachelor Marketing Digital en alternance (ici ou autre école)")}
            {makeF("groupOrSolo", "Travaille plutôt seul ou en groupe ?", "Ex: Fortement groupe (8/10) - apprend mieux en expliquant aux autres")}
            {makeF("examStress", "Rapport aux examens / stress évaluation", "Ex: Stress élevé mais canalisé. Dort mal la veille mais performant le jour J.")}
            {makeF("repeatYear", "A déjà redoublé ?", "Ex: Non - première tentative. Pression de réussir du premier coup.")}
          </CardContent>
        </Card>
      )}

      {persona.role === "Enseignant" && (
        <Card className="border-teal-200 bg-teal-50/30 dark:border-teal-900 dark:bg-teal-950/30">
          <CardHeader><CardTitle className="text-teal-800 dark:text-teal-200">&#128104;&#8205;&#127979; Vie Perso — Spécifique Enseignant</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            {makeF("previousCareer", "Carrière précédente avant l'enseignement", "Ex: 8 ans marketing B2B : Chef produit (2 ans), Resp. marketing Fnac (3 ans), Consultante", 2, true)}
            {makeF("whyTeaching", "Pourquoi avoir choisi l'enseignement ?", "Ex: Lassitude du corporate, envie de transmettre, flexibilité famille")}
            {makeF("teachingPhilosophy", "Philosophie pédagogique personnelle", "Ex: Pédagogie active et expérientielle. Chaque cours doit avoir un ancrage concret.", 2, true)}
            {makeF("proudestAchievement", "Sa plus grande fierté professionnelle", "Ex: 3 anciens étudiants créent leur startup. Une étudiante décroche CDI chez LVMH.", 2, true)}
            {makeF("biggestChallenge", "Son plus grand défi actuel", "Ex: Maintenir cours à jour dans domaine qui évolue tous les 6 mois.", 2, true)}
            {makeF("mentors", "Mentors / modèles (pro ou perso)", "Ex: Son directeur pédagogique (bienveillance). Ex-collègue consultante (rigueur).")}
            {makeF("workLifeBalance", "Équilibre vie professionnelle / personnelle", "Ex: Difficile avec 2 jeunes enfants + double campus. Mari très impliqué.")}
            {makeF("hopeForStudents", "Espoir pour ses étudiants", "Ex: Qu'ils trouvent un métier qui leur plait. Qu'ils gardent leur curiosité.", 2, true)}
            {makeF("careerPlans", "Plans de carrière futurs (3-5 ans)", "Ex: Coordination pédagogique dans 3-5 ans. Veut rester proche du terrain.")}
            {makeF("jobSatisfaction", "Satisfaction au travail (note et pourquoi)", "Ex: 7/10 - Passion intacte pour péda. Frustration face au temps perdu en admin.")}
            {makeF("prepTime", "Temps de préparation des cours", "Ex: 2-3h/heure nouveau cours, 30min cours rodé. Corrections: 1h30/25 copies.")}
            {makeF("teachingAtOtherSchools", "Intervient dans d'autres établissements ?", "Ex: 2 jours/mois à Bordeaux campus. A refusé autres écoles (fidélité).")}
            {makeF("continuingEducation", "Formation continue récente", "Ex: Google Analytics 4 (2023), cert. HubSpot marketing (2022)")}
            {makeF("unionMembership", "Membre d'un syndicat ?", "Ex: Non syndiqué(e) mais suit les actualités de la CFDT Enseignement")}
            {makeF("relationWithStudents", "Relation avec les étudiants", "Ex: Excellente - exigeante mais juste. Connaît tous les prénoms.")}
            {makeF("relationWithAdmin", "Relation avec l'administration", "Ex: Correcte mais tendue sur délais saisie notes et changements EDT.")}
            {makeF("salaryRange", "Fourchette de salaire (orientative)", "Ex: ~38 000€/an brut CDI plein temps. Pense mériter plus.")}
          </CardContent>
        </Card>
      )}

      {persona.role === "Administration" && (
        <Card className="border-red-200 bg-red-50/30 dark:border-red-900 dark:bg-red-950/30">
          <CardHeader><CardTitle className="text-red-800 dark:text-red-200">&#127970; Vie Perso — Spécifique Administration</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            {makeSF("managementStyle", "Style de management", [
              { value: "Directif - décisions rapides, cadre clair", label: "Directif - décisions rapides" },
              { value: "Participatif - consulte l'équipe avant de décider", label: "Participatif - consulte l'équipe" },
              { value: "Délégateur - fait confiance et laisse faire", label: "Délégateur - fait confiance" },
              { value: "Bienveillant-exigeant - écoute + rigueur", label: "Bienveillant-exigeant" },
              { value: "Situationnel - adapte selon contexte", label: "Situationnel - adapte selon contexte" }
            ])}
            {makeF("decisionAuthority", "Niveau d'autorité décisionnelle", "Ex: Autonomie totale gestion péda. Consulte directeur pour finances, sanctions graves.")}
            {makeF("careerPath", "Parcours professionnel (comment est arrivé(e) à ce poste)", "Ex: Assistante péda (2012) → Coordinatrice BTS (2015) → Resp. Pédagogique (2018)", 2, true)}
            {makeF("teamRelations", "Relations avec l'équipe", "Ex: Très bonne avec 3 assistantes. Complexe avec certains enseignants (résistance).")}
            {makeF("remoteWork", "Télétravail possible ?", "Ex: Possible mais rarement pratiqué - présence, urgences, accès système.")}
            {makeF("emailsPerDay", "Volume d'emails / jour", "Ex: 80-120 emails/jour (étudiants, profs, parents, direction, OPCO)")}
            {makeF("meetingsPerWeek", "Nombre de réunions / semaine", "Ex: 8-12 réunions (équipe péda lundi, conseil classe mensuel, direction)")}
            {makeF("reportTo", "Rapporte à qui ?", "Ex: DG (hebdo). Coordinatrice nationale (mensuel KPI).")}
            {makeF("externalRelations", "Relations avec partenaires externes", "Ex: OPCO, Rectorat, entreprises partenaires, familles, CROUS", 2, true)}
            {makeF("biggestChallengeAdmin", "Son plus grand défi quotidien", "Ex: Gérer changements EDT dernière minute tout en maintenant qualité pédagogique", 2, true)}
            {makeF("proudestAchievementAdmin", "Sa plus grande fierté professionnelle", "Ex: Taux réussite examens 89% (meilleur historique). Zéro recours légal en 12 ans.", 2, true)}
            {makeF("workLifeBalanceAdmin", "Équilibre vie pro / perso", "Ex: Difficile. Efforts depuis divorce pour ne pas rester après 18h30.")}
            {makeF("regulatoryPressure", "Pression réglementaire / conformité", "Ex: Forte pression certif. (France Compétences, Rectorat). Contrôles annuels.")}
            {makeF("conflictManagement", "Gestion des conflits (méthode)", "Ex: Médiation avant sanctions. Garde traces écrites. Applique règlement avec équité.")}
            {makeF("adminSatisfaction", "Satisfaction dans le poste (note et pourquoi)", "Ex: 6/10 - Aime son impact. Épuisement face aux tâches répétitives. Envisage évolution.")}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
