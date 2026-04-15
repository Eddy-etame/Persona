import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { MapPin } from "lucide-react";
import type { Persona } from "../../lib/types";
import type { School } from "../../lib/schoolStore";
import { makeFieldHelper, type UpdateFieldFn } from "./PersonaFields";

interface Props {
  persona: Persona;
  updateField: UpdateFieldFn;
  school: School;
}

export function PersonaContextTab({ persona, updateField, school }: Props) {
  const { makeF } = makeFieldHelper(persona, updateField);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="w-5 h-5" />&#127963;&#65039; Contexte & Campus</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          {makeF("campus", "Campus / Établissement", `Ex: ${school.name} - ${school.city}`, undefined, true)}
          {makeF("neighborhood", "Quartier de résidence", "Ex: Centre-ville, Jean-Jaurès, Banlieue proche...")}
          {makeF("housing", "Type de logement", "Ex: Studio étudiant / Appartement propriétaire T3")}
          {makeF("transportation", "Transport quotidien (détaillé)", "Ex: Métro + marche 10min / Voiture + parking campus", undefined, true)}
          {makeF("arriveTime", "Heure d'arrivée au campus", "Ex: 8h15 / 7h45")}
          {makeF("departTime", "Heure de départ du campus", "Ex: 17h30 / 18h30")}
          {makeF("workSchedule", "Emploi du temps type", "Ex: 8h30-17h30 (lundi-vendredi) / Horaires variables 24h cours/semaine", undefined, true)}
          {makeF("favoriteSpots", "Lieux favoris (campus + ville)", "Ex: Bibliothèque, Coworking, Café du quartier, Marché local", 2, true)}
        </CardContent>
      </Card>
    </div>
  );
}
