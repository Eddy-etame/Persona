import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Smartphone } from "lucide-react";
import type { Persona } from "../../lib/types";
import { makeFieldHelper, type UpdateFieldFn } from "./PersonaFields";

interface Props {
  persona: Persona;
  updateField: UpdateFieldFn;
}

export function PersonaTechTab({ persona, updateField }: Props) {
  const { makeF, makeSF } = makeFieldHelper(persona, updateField);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Smartphone className="w-5 h-5" />&#128241; Profil Technologique</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          {makeSF("techSavvy", "Aisance technologique générale", [
            { value: "Expert - Early adopter, teste tout en premier", label: "Expert - Early adopter" },
            { value: "Avancé - Utilisateur régulier et autonome", label: "Avancé - Utilisateur régulier autonome" },
            { value: "Moyen - Utilise le nécessaire sans plus", label: "Moyen - Utilise le nécessaire" },
            { value: "Basique - Préfère la simplicité maximale", label: "Basique - Préfère la simplicité" },
            { value: "Réfractaire - Utilise uniquement si obligé", label: "Réfractaire - Utilise si obligé" }
          ])}
          {makeF("devices", "Appareils utilisés (perso + pro)", "Ex: iPhone 13, MacBook Air M1, iPad / PC Dell double écran 24 pouces")}
          {makeF("apps", "Applications fréquentes (perso)", "Ex: Instagram, TikTok, Notion, Discord, Spotify...", 2, true)}
          {makeF("digitalTools", "Outils numériques professionnels / études", "Ex: Notion, Google Calendar, Discord, Slack, Trello, Moodle, Google Workspace...", 2, true)}
          {makeF("privacyConcerns", "Rapport à la vie privée numérique / RGPD", "Ex: Peu préoccupé si service utile / Très vigilant sur données étudiants (RGPD)", 2, true)}
          {makeF("techFrustrations", "Frustrations technologiques habituelles", "Ex: Apps lentes, interfaces non intuitives, trop d'étapes pour action simple", 2, true)}
          {makeF("learnNewTechHow", "Comment apprend-il/elle un nouvel outil ?", "Ex: YouTube tutorials + trial & error / Formation formelle obligatoire + documentation", 2, true)}
        </CardContent>
      </Card>
    </div>
  );
}
