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
  doc.text('@ingsscriblings', 20, doc.internal.pageSize.getHeight() - 20);
  
  return doc;
}; 