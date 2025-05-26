import { jsPDF } from 'jspdf';

export const generatePDFWithWatermark = (title, description, content) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text(title, 20, 20);
  
  // Add description only if it exists and is not empty
  let y = 40; // Default y position after title
  if (description && description.trim()) {
    doc.setFontSize(12);
    const splitDesc = doc.splitTextToSize(description, 170);
    doc.text(splitDesc, 20, y);
    y = 60; // Move y position down if description was added
  }
  
  // Add content
  doc.setFontSize(12);
  
  // Create a temporary div to properly handle HTML content
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;
  
  // Process the content while preserving formatting
  const lineHeight = 7; // Line height in PDF units
  const maxWidth = 170; // Maximum width for text
  
  // Function to process text nodes and apply formatting
  const processNode = (node, isBold = false, isItalic = false) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      if (text.trim()) {
        // Set font style based on parent elements
        if (isBold && isItalic) {
          doc.setFont('helvetica', 'bolditalic');
        } else if (isBold) {
          doc.setFont('helvetica', 'bold');
        } else if (isItalic) {
          doc.setFont('helvetica', 'italic');
        } else {
          doc.setFont('helvetica', 'normal');
        }
        
        // Split text into lines that fit the width
        const lines = doc.splitTextToSize(text, maxWidth);
        
        // Add each line to the PDF
        lines.forEach(line => {
          if (y > doc.internal.pageSize.getHeight() - 30) {
            doc.addPage();
            y = 20;
          }
          doc.text(line, 20, y);
          y += lineHeight;
        });
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Check for formatting elements
      const isNodeBold = isBold || node.tagName === 'STRONG' || node.tagName === 'B';
      const isNodeItalic = isItalic || node.tagName === 'EM' || node.tagName === 'I';
      
      // Process child nodes with updated formatting
      Array.from(node.childNodes).forEach(child => processNode(child, isNodeBold, isNodeItalic));
      
      // Add extra line break after block elements
      if (['P', 'DIV', 'BR', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(node.tagName)) {
        y += lineHeight;
      }
    }
  };
  
  // Process all nodes in the content
  Array.from(tempDiv.childNodes).forEach(node => processNode(node));
  
  // Add copyright text at bottom left
  doc.setTextColor(0, 0, 0); // Black color
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal'); // Reset font to normal
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