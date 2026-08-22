import PDFParser from 'pdf2json';

export async function parsePdfBuffer(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, true); // true = text content only

    pdfParser.on('pdfParser_dataError', (errData: any) => {
      reject(new Error(errData.parserError || 'Failed to parse PDF'));
    });

    pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
      // Extract raw text from parsed pages
      try {
        let rawText = '';
        if (pdfData && pdfData.Pages) {
          for (const page of pdfData.Pages) {
            for (const textItem of page.Texts) {
              for (const R of textItem.R) {
                rawText += decodeURIComponent(R.T) + ' ';
              }
            }
            rawText += '\n\n';
          }
        }
        resolve(rawText.trim());
      } catch (err) {
        reject(err);
      }
    });

    pdfParser.parseBuffer(buffer);
  });
}