import fs from "fs";
import path from "path";
import pdf from "pdf-parse";

const readPdf = async (pathToPdf: string): Promise<string> => {
    const pdfPath = path.resolve(pathToPdf);
    const dataBuffer = fs.readFileSync(pdfPath);

    const { text } = await pdf(dataBuffer);
    return text.replaceAll("\n", "");
};

export default readPdf;
