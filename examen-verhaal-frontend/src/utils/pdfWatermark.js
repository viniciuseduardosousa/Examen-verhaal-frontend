import { jsPDF } from 'jspdf';

// Function to convert markdown-style formatting to HTML
const convertMarkdownToHtml = (text) => {
  if (!text) return '';
  
  return text
    // Convert bold and italic (must be done first)
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    // Convert bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Convert italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Convert underline
    .replace(/__(.*?)__/g, '<u>$1</u>')
    // Convert strikethrough
    .replace(/~~(.*?)~~/g, '<s>$1</s>')
    // Convert code
    .replace(/`(.*?)`/g, '<code>$1</code>')
    // Convert paragraphs
    .replace(/\n\n/g, '</p><p>')
    // Convert line breaks
    .replace(/\n/g, '<br>')
    // Wrap in paragraph tags if not already wrapped
    .replace(/^(.+)$/g, '<p>$1</p>');
};

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
  
  // Convert markdown to HTML first
  const htmlContent = convertMarkdownToHtml(content);
  
  // Create a temporary div to properly handle HTML content
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  
  // Process the content while preserving formatting
  const lineHeight = 7; // Line height in PDF units
  const maxWidth = 170;
  
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
      
      // Only add extra line break after block elements that aren't already followed by a line break
      if (['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(node.tagName)) {
        const nextNode = node.nextSibling;
        if (!nextNode || (nextNode.nodeType === Node.ELEMENT_NODE && !['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(nextNode.tagName))) {
          y += lineHeight;
        }
      }
    }
  };
  
  // Process all nodes in the content
  Array.from(tempDiv.childNodes).forEach(node => processNode(node));
  
  // Add copyright text at bottom left
  doc.setTextColor(0, 0, 0); // Black color
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const currentYear = new Date().getFullYear();
  doc.text(`© ${currentYear} Ingrid van de Bovenkamp - https://www.ingsscribblings.nl/`, 20, doc.internal.pageSize.getHeight() - 20);
  
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