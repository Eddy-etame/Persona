import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Monitor } from "lucide-react";
import type { Persona } from "../../lib/types";
import type { School } from "../../lib/schoolStore";
import { makeFieldHelper, type UpdateFieldFn } from "./PersonaFields";

interface Props {
  persona: Persona;
  updateField: UpdateFieldFn;
  school: School;
}

export function PersonaSystemTab({ persona, updateField, school }: Props) {
  const { makeF } = makeFieldHelper(persona, updateField);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Monitor className="w-5 h-5" />&#128187; Utilisation du Système de Gestion</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {makeF("primarySystemNeeds",
            `Besoins principaux vis-à-vis du nouveau système ${school.name} (une fonctionnalité par ligne)`,
            "Ex: Consultation emploi du temps\nSignature émargement\nAccès aux notes\nTéléchargement attestations",
            8, true)}
          {makeF("frequentTasks", "Tâches fréquentes (avec fréquence estimée)",
            "Ex: Consulter emploi du temps (2-3x/jour)\nSigner émargement (chaque cours)\nVérifier notes (1-2x/semaine)",
            6, true)}
          <div className="grid md:grid-cols-2 gap-4">
            {makeF("timeSpentOnSystem", "Temps passé sur le système par jour", "Ex: 10-15 min/jour / 4-6 heures/jour")}
            {makeF("systemUsage", "Mode d'utilisation principal", "Ex: 90% mobile / 100% ordinateur double écran")}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
