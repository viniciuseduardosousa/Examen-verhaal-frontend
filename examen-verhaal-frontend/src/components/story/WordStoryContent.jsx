import RichTextDisplay from '../admin/RichTextDisplay';

const WordStoryContent = ({ tekst }) => {
  // Clean up the HTML content
  const cleanHtml = tekst
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '<h2>$1</h2>')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '<h2>$1</h2>')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '<h3>$1</h3>')
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '<p>$1</p>')
    .replace(/<ul[^>]*>(.*?)<\/ul>/gi, '<ul>$1</ul>')
    .replace(/<ol[^>]*>(.*?)<\/ol>/gi, '<ol>$1</ol>')
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '<li>$1</li>')
    .replace(/<table[^>]*>(.*?)<\/table>/gi, '<table>$1</table>')
    .replace(/<tr[^>]*>(.*?)<\/tr>/gi, '<tr>$1</tr>')
    .replace(/<td[^>]*>(.*?)<\/td>/gi, '<td>$1</td>')
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '<strong>$1</strong>')
    // Preserve links with proper styling
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: underline;">$2</a>')
    .replace(/<br\s*\/?>/gi, '<br />')
    .replace(/\n\s*\n/g, '\n')
    .replace(/\n/g, '<br />')
    .replace(/<br \/><br \/><h/g, '<br /><h')
    .trim();

  return (
    <section className="py-8 animate-slideDown">
      <div
        className="prose prose-xl max-w-4xl mx-auto font-serif leading-relaxed text-gray-700 text-lg
          prose-headings:font-bold prose-headings:text-gray-800
          prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-8
          prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-6
          prose-p:text-lg prose-p:my-8 prose-p:whitespace-pre-line
          prose-ul:list-disc prose-ul:pl-6 prose-ul:my-8
          prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-8
          prose-li:my-4 prose-li:text-lg
          prose-table:w-full prose-table:my-8
          prose-tr:border-b prose-tr:border-gray-200
          prose-td:p-3 prose-td:align-top prose-td:text-lg
          prose-strong:font-bold prose-strong:text-gray-800
          prose-img:rounded-lg prose-img:my-8
          prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:my-8 prose-blockquote:text-lg
          prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:my-8
          prose-hr:my-12 prose-hr:border-gray-200
          prose-br:block prose-br:my-6
          [&>*:first-child]:mt-0
          [&>*:last-child]:mb-0
          [&>p+p]:mt-8
          [&>h2+h2]:mt-12
          [&>h3+h3]:mt-10
          [&>p+h2]:mt-16
          [&>p+h3]:mt-12
          [&>h2+p]:mt-8
          [&>h3+p]:mt-6
          [&>ul+p]:mt-8
          [&>ol+p]:mt-8
          [&>p+ul]:mt-8
          [&>p+ol]:mt-8
          [&>blockquote+p]:mt-8
          [&>p+blockquote]:mt-8
          [&>img+p]:mt-8
          [&>p+img]:mt-8
          px-4 sm:px-6 md:px-8"
      >
        <RichTextDisplay content={tekst} />
      </div>
    </section>
  );
};

export default WordStoryContent; 