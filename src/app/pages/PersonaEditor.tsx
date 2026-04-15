import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  ArrowLeft, Save, User, Briefcase, GraduationCap, Settings,
  Heart, MapPin, Monitor, Smartphone, Star, Users
} from "lucide-react";
import { toast } from "sonner";
import { getActiveSchool, personaKey, savedPersonasKey } from "../lib/schoolStore";
import { useAutosave } from "../lib/useAutosave";
import { SaveStatus } from "../components/SaveStatus";

import type { Persona } from "../lib/types";
export type { Persona } from "../lib/types";

import { EMPTY_PERSONA, PERSONA_TEMPLATES, computeCompletion } from "../components/persona/personaData";
import { makeFieldHelper } from "../components/persona/PersonaFields";
import { PersonaIdentityTab } from "../components/persona/PersonaIdentityTab";
import { PersonaPersonalTab } from "../components/persona/PersonaPersonalTab";
import { PersonaContextTab } from "../components/persona/PersonaContextTab";
import { PersonaRoleTab } from "../components/persona/PersonaRoleTab";
import { PersonaSystemTab } from "../components/persona/PersonaSystemTab";
import { PersonaTechTab } from "../components/persona/PersonaTechTab";
import { PersonaUXTab } from "../components/persona/PersonaUXTab";
import { useDocumentMeta } from "../lib/useDocumentMeta";
import { ThemeToggle } from "../components/ThemeToggle";

export function PersonaEditor() {
  const navigate = useNavigate();
  const school = getActiveSchool();
  const storageKey = personaKey(school.id);
  const savedKey = savedPersonasKey(school.id);

  const [persona, setPersona] = useState<Persona>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) return JSON.parse(saved);
    return { ...EMPTY_PERSONA, campus: `${school.name} - ${school.city}` };
  });

  useDocumentMeta({
    title: "Persona | EduSystemDesign",
    description: "Creation de persona detaille",
    robots: "noindex,nofollow",
  });

  const { status: autosaveStatus, forceSave } = useAutosave(storageKey, persona);

  const updateField = useCallback((field: keyof Persona, value: string) => {
    setPersona(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleTemplateChange = (template: string) => {
    if (PERSONA_TEMPLATES[template]) {
      setPersona({ ...EMPTY_PERSONA, campus: `${school.name} - ${school.city}`, ...PERSONA_TEMPLATES[template] });
    }
  };

  const handleSave = () => {
    forceSave();
    try {
      const saved = JSON.parse(localStorage.getItem(savedKey) ?? "{}");
      saved[persona.role] = persona;
      localStorage.setItem(savedKey, JSON.stringify(saved));
    } catch {}
    toast.success("Persona sauvegardé !");
  };

  const handleNext = () => { handleSave(); navigate("/journey-map"); };

  const completion = computeCompletion(persona);
  const completionColor = completion >= 80 ? "bg-green-500" : completion >= 50 ? "bg-blue-500" : completion >= 30 ? "bg-yellow-500" : "bg-red-400";
  const { makeSF } = makeFieldHelper(persona, updateField);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <Button variant="outline" onClick={() => navigate("/home")}>
            <ArrowLeft className="w-4 h-4 mr-2" />Retour
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Mission 1 : Créer un Persona</h1>
            <p className="text-sm text-muted-foreground">Nouveau Système de Gestion {school.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <SaveStatus status={autosaveStatus} />
            <Button variant="outline" onClick={() => navigate("/compare")}><Users className="w-4 h-4 mr-2" />Comparer</Button>
            <Button onClick={handleSave}><Save className="w-4 h-4 mr-2" />Sauvegarder</Button>
            <ThemeToggle />
          </div>
        </div>

        {/* Completion Bar */}
        <Card className="mb-4">
          <CardContent className="py-3">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground font-medium">Score de complétude du persona</span>
                  <span className={`font-bold ${completion >= 80 ? "text-green-600 dark:text-green-300" : completion >= 50 ? "text-blue-600 dark:text-blue-300" : "text-orange-600 dark:text-orange-300"}`}>
                    {completion}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full transition-all duration-500 ${completionColor}`} style={{ width: `${completion}%` }} />
                </div>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
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
        <Card className="mb-4 bg-card text-card-foreground">
          <CardContent className="py-4 grid md:grid-cols-2 gap-4">
            {makeSF("role", "Rôle du persona *", [
              { value: "Étudiant", label: "👨‍🎓 Étudiant" },
              { value: "Enseignant", label: "👨‍🏫 Enseignant / Formateur" },
              { value: "Administration", label: "🏢 Administration / Direction" }
            ])}
            <div>
              <Label className="mb-1 block text-sm text-foreground">Modèle pré-rempli (optionnel — contexte Keyce Toulouse)</Label>
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
          <TabsList className="grid w-full grid-cols-7 text-xs bg-card text-card-foreground">
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

          <TabsContent value="identite">
            <PersonaIdentityTab persona={persona} updateField={updateField} />
          </TabsContent>
          <TabsContent value="perso">
            <PersonaPersonalTab persona={persona} updateField={updateField} schoolShortName={school.shortName} schoolName={school.name} />
          </TabsContent>
          <TabsContent value="contexte">
            <PersonaContextTab persona={persona} updateField={updateField} school={school} />
          </TabsContent>
          <TabsContent value="role-specifique">
            <PersonaRoleTab persona={persona} updateField={updateField} school={school} />
          </TabsContent>
          <TabsContent value="systeme">
            <PersonaSystemTab persona={persona} updateField={updateField} school={school} />
          </TabsContent>
          <TabsContent value="tech">
            <PersonaTechTab persona={persona} updateField={updateField} />
          </TabsContent>
          <TabsContent value="ux">
            <PersonaUXTab persona={persona} updateField={updateField} />
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
