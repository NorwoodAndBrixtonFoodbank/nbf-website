import fs from "fs";
import path from "path";
import pdf from "pdf-parse";

let timeDelay = 1000;

const delay = (time: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, time));
};

const readPdf = async (pathToPdf: string, maxRetries = 4): Promise<string> => {
    const pdfPath = path.resolve(pathToPdf);

    for (let retries = 0; retries < maxRetries; retries++) {
        try {
            const dataBuffer = fs.readFileSync(pdfPath);
            const { text } = await pdf(dataBuffer);
            return text.replaceAll("\n", "");
        } catch {
            await delay(timeDelay);
            timeDelay *= 2;
            continue;
        }
    }

    throw new Error("File is corrupted after multiple retries");
};

export default readPdf;
