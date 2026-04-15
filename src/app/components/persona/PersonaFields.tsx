import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import type { Persona } from "../../lib/types";

export interface FProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  type?: "input" | "textarea";
  span2?: boolean;
}

export const F = ({ label, value, onChange, placeholder, rows, type = "input", span2 }: FProps) => (
  <div className={span2 ? "md:col-span-2" : ""}>
    <Label className="mb-1 block text-sm text-foreground">{label}</Label>
    {type === "textarea" ? (
      <Textarea
        className="text-foreground placeholder:text-muted-foreground"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={rows ?? 3}
      />
    ) : (
      <Input
        className="text-foreground placeholder:text-muted-foreground"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    )}
  </div>
);

export interface SFProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  span2?: boolean;
}

export const SF = ({ label, value, onChange, options, placeholder, span2 }: SFProps) => (
  <div className={span2 ? "md:col-span-2" : ""}>
    <Label className="mb-1 block text-sm text-foreground">{label}</Label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="text-foreground">
        <SelectValue placeholder={placeholder ?? "Choisir..."} />
      </SelectTrigger>
      <SelectContent>
        {options.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
      </SelectContent>
    </Select>
  </div>
);

export type UpdateFieldFn = (field: keyof Persona, value: string) => void;

export function makeFieldHelper(persona: Persona, updateField: UpdateFieldFn) {
  const makeF = (field: keyof Persona, label: string, placeholder?: string, rows?: number, span2?: boolean) => (
    <F key={field} label={label} value={persona[field] as string} onChange={v => updateField(field, v)}
      placeholder={placeholder} rows={rows} type={rows ? "textarea" : "input"} span2={span2} />
  );

  const makeSF = (field: keyof Persona, label: string, options: { value: string; label: string }[], placeholder?: string, span2?: boolean) => (
    <SF key={field} label={label} value={persona[field] as string} onChange={v => updateField(field, v)}
      options={options} placeholder={placeholder} span2={span2} />
  );

  return { makeF, makeSF };
}
