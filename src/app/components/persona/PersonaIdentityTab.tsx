import { useRef } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { User, Upload, Camera } from "lucide-react";
import { toast } from "sonner";
import type { Persona } from "../../lib/types";
import { makeFieldHelper, type UpdateFieldFn } from "./PersonaFields";

interface Props {
  persona: Persona;
  updateField: UpdateFieldFn;
}

export function PersonaIdentityTab({ persona, updateField }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { makeF } = makeFieldHelper(persona, updateField);

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

  return (
    <div className="space-y-4">
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
            <p className="text-sm text-muted-foreground">Téléversez une photo pour ce persona (JPG, PNG, max 2 Mo)</p>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="gap-2">
                <Upload className="w-4 h-4" />
                {persona.photo ? "Changer la photo" : "Téléverser une photo"}
              </Button>
              {persona.photo && (
                <Button variant="ghost" onClick={() => updateField("photo", "")} className="text-red-600">Supprimer</Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">La photo sera incluse dans le poster final et la comparaison de personas.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
