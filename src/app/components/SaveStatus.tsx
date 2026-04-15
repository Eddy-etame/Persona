import { Check, Loader2, AlertCircle } from "lucide-react";
import type { AutosaveStatus } from "../lib/useAutosave";

const STATUS_CONFIG: Record<AutosaveStatus, { icon: React.ReactNode; text: string; className: string }> = {
  saved: {
    icon: <Check className="w-3 h-3" />,
    text: "Sauvegardé",
    className: "text-green-600 bg-green-50 border-green-200",
  },
  saving: {
    icon: <Loader2 className="w-3 h-3 animate-spin" />,
    text: "Sauvegarde...",
    className: "text-blue-600 bg-blue-50 border-blue-200",
  },
  unsaved: {
    icon: <AlertCircle className="w-3 h-3" />,
    text: "Non sauvegardé",
    className: "text-amber-600 bg-amber-50 border-amber-200",
  },
};

export function SaveStatus({ status }: { status: AutosaveStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium transition-all ${config.className}`}>
      {config.icon}
      {config.text}
    </div>
  );
}
