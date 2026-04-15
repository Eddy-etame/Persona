import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { Persona } from "../../lib/types";
import type { UpdateFieldFn } from "./PersonaFields";

interface Props {
  persona: Persona;
  updateField: UpdateFieldFn;
}

export function PersonaUXTab({ persona, updateField }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-green-300 dark:border-green-900 bg-green-50/20 dark:bg-green-950/20">
          <CardHeader><CardTitle className="text-green-700 dark:text-green-200">&#9989; Objectifs & Motivations</CardTitle></CardHeader>
          <CardContent>
            <Textarea placeholder="Objectifs vis-à-vis du nouveau système (un par ligne)"
              value={persona.goals} onChange={e => updateField("goals", e.target.value)} rows={9} />
          </CardContent>
        </Card>
        <Card className="border-red-300 dark:border-red-900 bg-red-50/20 dark:bg-red-950/20">
          <CardHeader><CardTitle className="text-red-700 dark:text-red-200">&#10060; Frustrations & Points de douleur</CardTitle></CardHeader>
          <CardContent>
            <Textarea placeholder="Frustrations actuelles avec le système existant (une par ligne)"
              value={persona.frustrations} onChange={e => updateField("frustrations", e.target.value)} rows={9} />
          </CardContent>
        </Card>
        <Card className="border-blue-300 dark:border-blue-900 bg-blue-50/20 dark:bg-blue-950/20">
          <CardHeader><CardTitle className="text-blue-700 dark:text-blue-200">&#11088; Besoins & Attentes pour le nouveau système</CardTitle></CardHeader>
          <CardContent>
            <Textarea placeholder="Besoins pour le nouveau système (un par ligne)"
              value={persona.needs} onChange={e => updateField("needs", e.target.value)} rows={9} />
          </CardContent>
        </Card>
        <Card className="border-purple-300 dark:border-purple-900 bg-purple-50/20 dark:bg-purple-950/20">
          <CardHeader><CardTitle className="text-purple-700 dark:text-purple-200">&#128172; Citation Représentative</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Textarea placeholder="Citation qui capture ses frustrations et sa vision idéale..."
              value={persona.quote} onChange={e => updateField("quote", e.target.value)} rows={5} />
            <div>
              <Label className="mb-1 block text-sm">&#10024; Fonctionnalité idéale rêvée</Label>
              <Textarea placeholder="Ex: Widget emploi du temps sur l'écran d'accueil iOS et notifications instantanées"
                value={persona.idealFeature} onChange={e => updateField("idealFeature", e.target.value)} rows={3} />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-orange-300 dark:border-orange-900 bg-orange-50/20 dark:bg-orange-950/20">
          <CardHeader><CardTitle className="text-orange-700 dark:text-orange-200">&#128683; Deal Breaker (ce qui le/la ferait abandonner)</CardTitle></CardHeader>
          <CardContent>
            <Textarea placeholder="Ex: Pas d'application mobile = rédhibitoire. Plus de 3 clics pour une action fréquente."
              value={persona.dealBreaker} onChange={e => updateField("dealBreaker", e.target.value)} rows={4} />
          </CardContent>
        </Card>
        <Card className="border-teal-300 dark:border-teal-900 bg-teal-50/20 dark:bg-teal-950/20">
          <CardHeader><CardTitle className="text-teal-700 dark:text-teal-200">&#128640; Attentes Onboarding / Prise en main</CardTitle></CardHeader>
          <CardContent>
            <Textarea placeholder="Ex: Tutoriel interactif à la première connexion. Aide contextuelle. Pas de manuel PDF."
              value={persona.onboardingExpectation} onChange={e => updateField("onboardingExpectation", e.target.value)} rows={4} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
