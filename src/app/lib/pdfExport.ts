type JsPdfModule = typeof import("jspdf");
type Html2CanvasModule = typeof import("html2canvas");

interface ExportPdfOptions {
  element: HTMLElement;
  fileName: string;
  format?: "a4" | "a3";
  orientation?: "portrait" | "landscape";
  backgroundColor?: string;
  marginMm?: number;
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
  backgroundColor = "#ffffff",
  marginMm = 8,
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

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor,
    allowTaint: false,
  });
  if (!canvas.width || !canvas.height) {
    throw new Error("Capture du contenu PDF invalide (canvas vide).");
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

  const imgWidthMm = contentWidth;
  const imgHeightMm = (canvas.height * imgWidthMm) / canvas.width;

  let remainingHeight = imgHeightMm;
  let yOffset = 0;

  let imgData: string;
  try {
    imgData = canvas.toDataURL("image/png");
  } catch {
    throw new Error("Impossible de générer l'image PDF depuis le canvas.");
  }
  pdf.addImage(imgData, "PNG", marginMm, marginMm + yOffset, imgWidthMm, imgHeightMm);
  remainingHeight -= contentHeight;

  while (remainingHeight > 0) {
    yOffset = remainingHeight - imgHeightMm;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", marginMm, marginMm + yOffset, imgWidthMm, imgHeightMm);
    remainingHeight -= contentHeight;
  }

  try {
    pdf.save(fileName);
  } catch {
    throw new Error("Echec lors de l'enregistrement du PDF.");
  }
}

