import { saveAs } from "file-saver";
import jsPDF from "jspdf";

export function exportAsJson(canvas, fileName = "FileName") {
  if (!canvas) return;

  try {
    const canvasData = canvas.toJSON(["id", "filters"]);

    const jsonString = JSON.stringify(canvasData, null, 2);

    const canvasJsonBlob = new Blob([jsonString], { type: "application/json" });
    saveAs(canvasJsonBlob, `${fileName}.json`);
  } catch (e) {
    return false;
  }
}

export function exportAsPng(canvas, fileName = "PNG FileName", options = {}) {
  if (!canvas) return;

  try {
    const defaultOptions = {
      format: "png",
      quality: 1,
      multiplier: 1,
      enableRetinaScaling: true,
      ...options,
    };

    const dataURL = canvas.toDataURL(defaultOptions);

    saveAs(dataURL, `${fileName}.png`);
  } catch (e) {
    return false;
  }
}

export function exportAsSVG(canvas, fileName = "SVG Design") {
  if (!canvas) return;

  try {
    const svgData = canvas.toSVG();

    const blob = new Blob([svgData], { type: "image/svg+xml" });
    saveAs(blob, `${fileName}.svg`);

    return true;
  } catch (e) {
    return false;
  }
}


export function exportAsPDF(canvas, fileName = "PDF Design") {
  if (!canvas) return;

  try {
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();

    // PDF uses pt → convert px → pt
    const pdfWidth = canvasWidth * 0.75;
    const pdfHeight = canvasHeight * 0.75;

    // Create PDF matching canvas size
    const pdf = new jsPDF({
      orientation: canvasWidth > canvasHeight ? "landscape" : "portrait",
      unit: "pt",
      format: [pdfWidth, pdfHeight],
    });

    // HIGH-RES EXPORT (very important)
    const imgData = canvas.toDataURL({
      format: "png",
      multiplier: 2,       // Increase DPI (2x or 3x recommended)
      quality: 1.0,
    });

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${fileName}.pdf`);

    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}
