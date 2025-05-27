import React from 'react';

const RichTextDisplay = ({ content }) => {
  // URL regex pattern
  const urlPattern = /(https?:\/\/[^\s]+)/g;

  // Convert markdown-style text to React elements while preserving formatting
  const formatText = (text) => {
    if (!text) return null;

    // First, split the text into lines while preserving empty lines
    const lines = text.split(/\n/);

    return lines.map((line, lineIndex) => {
      // Skip empty lines
      if (!line.trim()) {
        return <br key={lineIndex} />;
      }

      // Split line into segments based on formatting markers and URLs
      const segments = line.split(/(\*\*.*?\*\*|\*.*?\*|__.*?__|~~.*?~~|`.*?`|https?:\/\/[^\s]+)/g);

      const formattedSegments = segments.map((segment, index) => {
        // Check if segment is a URL
        if (urlPattern.test(segment)) {
          return (
            <a 
              key={index} 
              href={segment} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {segment}
            </a>
          );
        }

        // Bold and italic
        if (segment.startsWith('***') && segment.endsWith('***')) {
          return <strong key={index}><em>{segment.slice(3, -3)}</em></strong>;
        }
        // Bold
        if (segment.startsWith('**') && segment.endsWith('**')) {
          return <strong key={index}>{segment.slice(2, -2)}</strong>;
        }
        // Italic
        if (segment.startsWith('*') && segment.endsWith('*')) {
          return <em key={index}>{segment.slice(1, -1)}</em>;
        }
        // Underline
        if (segment.startsWith('__') && segment.endsWith('__')) {
          return <u key={index}>{segment.slice(2, -2)}</u>;
        }
        // Strikethrough
        if (segment.startsWith('~~') && segment.endsWith('~~')) {
          return <del key={index}>{segment.slice(2, -2)}</del>;
        }
        // Code
        if (segment.startsWith('`') && segment.endsWith('`')) {
          return <code key={index}>{segment.slice(1, -1)}</code>;
        }
        // Regular text
        return <span key={index}>{segment}</span>;
      });

      return (
        <p key={lineIndex} className="mb-4">
          {formattedSegments}
        </p>
      );
    });
  };

  return (
    <div className="prose prose-sm max-w-none whitespace-pre-line">
      {formatText(content)}
    </div>
  );
};

export default RichTextDisplay; 