import fs from "fs";
import path from "path";
import pdf from "pdf-parse";

const readPdf = (pathToPdf: string): Promise<string> => {
    return new Promise((resolve) => {
        const pdfPath = path.resolve(pathToPdf);
        const dataBuffer = fs.readFileSync(pdfPath);
        pdf(dataBuffer).then(function ({ text }: { text: string }) {
            resolve(text);
        });
    });
};

export default readPdf;
