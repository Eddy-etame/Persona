import { useEffect } from "react";

interface MetaConfig {
  title: string;
  description?: string;
  robots?: string;
}

function upsertMeta(name: string, content: string) {
  let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.name = name;
    document.head.appendChild(tag);
  }
  tag.content = content;
}

export function useDocumentMeta({ title, description, robots }: MetaConfig) {
  useEffect(() => {
    document.title = title;
    if (description) upsertMeta("description", description);
    if (robots) upsertMeta("robots", robots);
  }, [title, description, robots]);
}

