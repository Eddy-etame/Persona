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

  const safeScale = scale ?? (Math.max(element.scrollHeight, element.clientHeight) > 3500 ? 1.5 : 2);

  const canvas = await html2canvas(element, {
    scale: safeScale,
    useCORS: true,
    backgroundColor,
    allowTaint: false,
    logging: false,
  });
  
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

