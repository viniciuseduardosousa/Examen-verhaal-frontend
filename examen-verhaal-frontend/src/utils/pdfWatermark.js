import { jsPDF } from 'jspdf';

// Markdown inline elementen omzetten naar gestileerde delen
const tokenizeMarkdownInline = (text) => {
  const tokens = [];
  const regex = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|__([^_]+?)__|~~(.+?)~~|`(.+?)`|[^*_~`]+)/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match[2]) {
      tokens.push({ text: match[2], style: 'bolditalic' });
    } else if (match[3]) {
      tokens.push({ text: match[3], style: 'bold' });
    } else if (match[4]) {
      tokens.push({ text: match[4], style: 'italic' });
    } else if (match[5]) {
      tokens.push({ text: match[5], style: 'underline' });
    } else if (match[6]) {
      tokens.push({ text: match[6], style: 'strikethrough' });
    } else if (match[7]) {
      tokens.push({ text: match[7], style: 'code' });
    } else {
      tokens.push({ text: match[0], style: 'normal' });
    }
  }

  return tokens;
};

// Gestileerde tekst renderen naar PDF met wrapping en formatting
const renderTextTokens = (doc, tokens, startX, startY, maxWidth, lineHeight) => {
  let x = startX;
  let y = startY;

  tokens.forEach(({ text, style }) => {
    switch (style) {
      case 'bolditalic':
        doc.setFont('helvetica', 'bolditalic');
        break;
      case 'bold':
        doc.setFont('helvetica', 'bold');
        break;
      case 'italic':
        doc.setFont('helvetica', 'italic');
        break;
      default:
        doc.setFont('helvetica', 'normal');
    }

    const words = text.split(/(\s+)/);

    words.forEach(word => {
      const wordWidth = doc.getTextWidth(word);

      if (x + wordWidth > startX + maxWidth) {
        x = startX;
        y += lineHeight;
        if (y > doc.internal.pageSize.getHeight() - 30) {
          doc.addPage();
          y = 20;
        }
      }

      doc.text(word, x, y);
      x += wordWidth;
    });
  });

  return y + lineHeight;
};

// PDF genereren met titel, beschrijving, opgemaakt content en watermark
export const generatePDFWithWatermark = (title, description, content) => {
  const doc = new jsPDF();
  let y = 20;
  const maxWidth = 170;
  const lineHeight = 7;

  // Titel
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 20, y);
  y += 15;

  // Beschrijving
  if (description?.trim()) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(description, maxWidth);
    doc.text(descLines, 20, y);
    y += descLines.length * lineHeight;
    y += 10; // Extra ruimte tussen beschrijving en hoofdtekst
  }

  // Content
  doc.setFontSize(12);
  // Normaliseer line breaks en verwijder overbodige spaties
  const normalizedContent = content
    .replace(/\r\n/g, '\n')  // Windows line breaks omzetten naar Unix
    .replace(/\n{3,}/g, '\n\n')  // 3+ line breaks vervangen door dubbele
    .replace(/[ \t]+/g, ' ')  // Meerdere spaties/tabs vervangen door enkele spatie
    .trim();

  // Controleer of content van Word import komt (heeft meestal geen line breaks)
  const isWordImport = !normalizedContent.includes('\n\n');
  
  const paragraphs = isWordImport 
    ? normalizedContent.split(/\n/)  // Splits op enkele newline voor Word import
    : normalizedContent.split(/\n{2,}/);  // Splits op dubbele newline voor normale content

  paragraphs.forEach((para, index) => {
    const tokens = tokenizeMarkdownInline(para);
  
    if (index > 0) {
      y += isWordImport ? 7 : 12;  // Verschillende spacing voor Word import vs normale content
    }
  
    y = renderTextTokens(doc, tokens, 20, y, maxWidth, lineHeight);
  });

  // Footer
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const currentYear = new Date().getFullYear();
  doc.text(`© ${currentYear} Ingrid van de Bovenkamp - https://www.ingsscribblings.nl/`, 20, doc.internal.pageSize.getHeight() - 20);

  return doc;
};

// PDFs opnieuw genereren voor downloadbare verhalen
export const regenerateExistingPDFs = async (stories) => {
  const regeneratedPDFs = [];

  for (const story of stories) {
    if (story.is_downloadable) {
      const doc = generatePDFWithWatermark(
        story.titel,
        story.beschrijving,
        story.tekst
      );

      const pdfBlob = doc.output('blob');
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
