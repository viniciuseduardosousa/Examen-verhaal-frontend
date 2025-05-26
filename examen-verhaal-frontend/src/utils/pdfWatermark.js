import { jsPDF } from 'jspdf';

export const generatePDFWithWatermark = (title, description, content) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text(title, 20, 20);
  
  // Add description
  doc.setFontSize(12);
  const splitDesc = doc.splitTextToSize(description, 170);
  doc.text(splitDesc, 20, 40);
  
  // Add content
  doc.setFontSize(12);
  const cleanContent = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
  const splitContent = doc.splitTextToSize(cleanContent, 170);
  doc.text(splitContent, 20, 60);
  
  // Add copyright text at bottom left
  doc.setTextColor(0, 0, 0); // Black color
  doc.setFontSize(10);
  doc.text('© Ingrid van de Bovenkamp - http://www.ingsscribblings.nl/', 20, doc.internal.pageSize.getHeight() - 20);
  
  return doc;
};

export const regenerateExistingPDFs = async (stories) => {
  const regeneratedPDFs = [];
  
  for (const story of stories) {
    if (story.is_downloadable) {
      const doc = generatePDFWithWatermark(
        story.titel,
        story.beschrijving,
        story.tekst
      );
      
      // Convert PDF to blob
      const pdfBlob = doc.output('blob');
      
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('pdf_file', pdfBlob, `${story.titel}.pdf`);
      
      regeneratedPDFs.push({
        id: story.id,
        formData
      });
    }
  }
  
  return regeneratedPDFs;
}; 