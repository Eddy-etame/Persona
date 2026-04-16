type JsPdfModule = typeof import("jspdf");
type Html2CanvasModule = typeof import("html2canvas");

interface ExportPdfOptions {
  element: HTMLElement;
  fileName: string;
  format?: "a4" | "a3";
  orientation?: "portrait" | "landscape";
  backgroundColor?: string | null;
  marginMm?: number;
  imageType?: "png" | "jpeg";
  quality?: number;
  scale?: number;
  /**
   * If true, forces inline rgb/rgba computed colors inside the cloned DOM
   * before capture. This avoids html2canvas failing on modern color functions
   * like `oklch(...)` used by Tailwind/shadcn tokens.
   */
  sanitizeColors?: boolean;
}

type JsPdfCtor = new (options?: {
  orientation?: "portrait" | "landscape";
  unit?: "mm" | "pt" | "px" | "cm" | "in";
  format?: "a4" | "a3";
}) => import("jspdf").jsPDF;

function resolveJsPdfCtor(module: JsPdfModule): JsPdfCtor {
  const candidates: unknown[] = [
    (module as { jsPDF?: unknown }).jsPDF,
    (module as { default?: unknown }).default,
    (module as { default?: { jsPDF?: unknown } }).default?.jsPDF,
  ];
  const ctor = candidates.find((item): item is JsPdfCtor => typeof item === "function");
  if (!ctor) {
    throw new Error("Impossible de charger le constructeur jsPDF.");
  }
  return ctor;
}

/**
 * Export a DOM section to a paginated PDF with deterministic sizing.
 */
export async function exportElementToPdf({
  element,
  fileName,
  format = "a4",
  orientation = "portrait",
  backgroundColor = null,
  marginMm = 8,
  imageType = "png",
  quality = 0.92,
  scale,
  sanitizeColors = true,
}: ExportPdfOptions) {
  const [jspdfModule, html2canvasModule]: [JsPdfModule, Html2CanvasModule] = await Promise.all([
    import("jspdf"),
    import("html2canvas"),
  ]);
  const JsPdf = resolveJsPdfCtor(jspdfModule);
  const html2canvas = html2canvasModule.default;
  if (!html2canvas) {
    throw new Error("Impossible de charger html2canvas.");
  }

  // Prefetch current document stylesheets so the onclone callback can run synchronously.
  const stylesheetClones = await (async () => {
    try {
      const links = Array.from(
        document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"][href]'),
      );
      const results = await Promise.all(
        links.map(async (link) => {
          const href = link.href;
          try {
            const res = await fetch(href, { cache: "force-cache" });
            const text = await res.text();
            return { href, cssText: text };
          } catch {
            return { href, cssText: "" };
          }
        }),
      );

      // html2canvas fails on unsupported color functions such as `oklch()`.
      // We keep the overall CSS but neutralize these tokens, then override theme vars with rgb values.
      return results
        .filter((r) => r.cssText && r.cssText.length > 0)
        .map((r) => ({
          href: r.href,
          cssText: r.cssText.replace(/oklch\\([^)]*\\)/g, "rgb(0 0 0)"),
        }));
    } catch {
      return [] as Array<{ href: string; cssText: string }>;
    }
  })();

  const safeScale = scale ?? (Math.max(element.scrollHeight, element.clientHeight) > 3500 ? 1.5 : 2);

  const sanitizeClonedSubtreeColors = (doc: Document, root: HTMLElement) => {
    const props: Array<keyof CSSStyleDeclaration> = [
      "color",
      "backgroundColor",
      "borderTopColor",
      "borderRightColor",
      "borderBottomColor",
      "borderLeftColor",
      "outlineColor",
      "textDecorationColor",
      // svg-related (typed as any to satisfy TS)
      "fill" as any,
      "stroke" as any,
    ];

    const view = doc.defaultView ?? window;

    const walk = (node: Element) => {
      const style = view.getComputedStyle(node);
      const el = node as HTMLElement;
      props.forEach((p) => {
        const value = (style as any)[p] as string | undefined;
        if (!value) return;
        try {
          (el.style as any)[p] = value;
        } catch {
          // ignore unsupported inline assignments
        }
      });
    };

    walk(root);
    root.querySelectorAll("*").forEach(walk);
  };

  const THEME_COLOR_VARS = [
    "--background",
    "--foreground",
    "--card",
    "--card-foreground",
    "--popover",
    "--popover-foreground",
    "--primary",
    "--primary-foreground",
    "--secondary",
    "--secondary-foreground",
    "--muted",
    "--muted-foreground",
    "--accent",
    "--accent-foreground",
    "--destructive",
    "--destructive-foreground",
    "--border",
    "--input",
    "--input-background",
    "--switch-background",
    "--ring",
    "--chart-1",
    "--chart-2",
    "--chart-3",
    "--chart-4",
    "--chart-5",
    "--sidebar",
    "--sidebar-foreground",
    "--sidebar-primary",
    "--sidebar-primary-foreground",
    "--sidebar-accent",
    "--sidebar-accent-foreground",
    "--sidebar-border",
    "--sidebar-ring",
  ] as const;

  const resolveColorVar = (doc: Document, varName: string): string | null => {
    const view = doc.defaultView ?? window;
    const el = doc.createElement("span");
    el.style.position = "fixed";
    el.style.left = "-9999px";
    el.style.top = "-9999px";
    el.style.color = `var(${varName})`;
    el.style.backgroundColor = `var(${varName})`;
    doc.body.appendChild(el);
    try {
      const cs = view.getComputedStyle(el);
      const bg = cs.backgroundColor;
      const fg = cs.color;
      const val = bg && bg !== "rgba(0, 0, 0, 0)" ? bg : fg;
      if (!val) return null;
      // Prefer rgb/rgba output; if not, fallback to null.
      if (val.includes("rgb")) return val;
      return null;
    } finally {
      el.remove();
    }
  };

  const buildThemeVarOverrideCss = (doc: Document) => {
    const root = doc.documentElement;
    const originalDark = root.classList.contains("dark");

    const computeMap = (isDark: boolean) => {
      if (isDark) root.classList.add("dark");
      else root.classList.remove("dark");

      const map = new Map<string, string>();
      THEME_COLOR_VARS.forEach((v) => {
        const resolved = resolveColorVar(doc, v);
        if (resolved) map.set(v, resolved);
      });
      return map;
    };

    const light = computeMap(false);
    const dark = computeMap(true);

    if (originalDark) root.classList.add("dark");
    else root.classList.remove("dark");

    const toDecls = (m: Map<string, string>) =>
      Array.from(m.entries())
        .map(([k, v]) => `${k}:${v};`)
        .join("");

    return `:root{${toDecls(light)}}.dark{${toDecls(dark)}}`;
  };

  const restoreId = (() => {
    if (!sanitizeColors) return () => {};
    const existingId = element.id;
    if (existingId) return () => {};
    const tempId = `pdf-export-${Math.random().toString(36).slice(2, 9)}`;
    element.id = tempId;
    return () => {
      // restore for cleanliness
      element.id = "";
    };
  })();

  const canvas = await (async () => {
    try {
      return await html2canvas(element, {
        scale: safeScale,
        useCORS: true,
        backgroundColor,
        allowTaint: false,
        logging: false,
        onclone: (doc) => {
          if (!sanitizeColors) return;
          try {
            doc.documentElement.style.colorScheme = "light";
            const root = doc.getElementById(element.id) as HTMLElement | null;

            // Replace stylesheet links with sanitized style tags to avoid `oklch()` parsing crashes.
            // We keep overall CSS rules, but neutralize unsupported tokens, and then override vars with rgb values.
            const head = doc.head ?? doc.getElementsByTagName("head")[0];
            if (head && stylesheetClones.length > 0) {
              Array.from(doc.querySelectorAll('link[rel="stylesheet"]')).forEach((n) => n.remove());
              stylesheetClones.forEach((s) => {
                const styleEl = doc.createElement("style");
                styleEl.setAttribute("data-export-css", "true");
                styleEl.textContent = s.cssText;
                head.appendChild(styleEl);
              });
            }

            // Override theme variables with resolved rgb/rgba values so the sanitized CSS still renders correctly.
            const overrideCss = buildThemeVarOverrideCss(doc);
            if (head && overrideCss) {
              const overrideEl = doc.createElement("style");
              overrideEl.setAttribute("data-export-theme-vars", "true");
              overrideEl.textContent = overrideCss;
              head.appendChild(overrideEl);
            }

            if (root) sanitizeClonedSubtreeColors(doc, root);
          } catch {
            // best-effort
          }
        },
      });
    } finally {
      restoreId();
    }
  })();
  
  if (!canvas || canvas.width === 0 || canvas.height === 0) {
    throw new Error("La capture du contenu a échoué (canvas vide). Vérifiez que l'élément est bien visible.");
  }

  const pdf = new JsPdf({
    orientation,
    unit: "mm",
    format,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const contentWidth = pageWidth - marginMm * 2;
  const contentHeight = pageHeight - marginMm * 2;

  const pageHeightPx = Math.max(1, Math.floor((contentHeight * canvas.width) / contentWidth));
  const totalPages = Math.max(1, Math.ceil(canvas.height / pageHeightPx));

  for (let pageIndex = 0; pageIndex < totalPages; pageIndex += 1) {
    const srcY = pageIndex * pageHeightPx;
    const sliceHeightPx = Math.min(pageHeightPx, canvas.height - srcY);
    if (sliceHeightPx <= 0) break;

    const pageCanvas = document.createElement("canvas");
    pageCanvas.width = canvas.width;
    pageCanvas.height = sliceHeightPx;
    const ctx = pageCanvas.getContext("2d");
    if (!ctx) {
      throw new Error("Impossible de préparer la pagination PDF.");
    }

    ctx.drawImage(
      canvas,
      0,
      srcY,
      canvas.width,
      sliceHeightPx,
      0,
      0,
      pageCanvas.width,
      pageCanvas.height,
    );

    let mimeType = imageType === "jpeg" ? "image/jpeg" : "image/png";
    let imgData: string;

    try {
      imgData = pageCanvas.toDataURL(mimeType, quality);
    } catch {
      mimeType = "image/jpeg";
      try {
        imgData = pageCanvas.toDataURL(mimeType, quality);
      } catch {
        throw new Error("Impossible de générer une image PDF (PNG/JPEG).");
      }
    }

    const sliceHeightMm = (sliceHeightPx * contentWidth) / canvas.width;

    if (pageIndex > 0) {
      pdf.addPage();
    }

    pdf.addImage(
      imgData,
      mimeType === "image/jpeg" ? "JPEG" : "PNG",
      marginMm,
      marginMm,
      contentWidth,
      sliceHeightMm,
    );
  }

  try {
    pdf.save(fileName);
  } catch (error) {
    console.error("PDF save error:", error);
    throw new Error("Echec lors de l'enregistrement du PDF.");
  }
}

