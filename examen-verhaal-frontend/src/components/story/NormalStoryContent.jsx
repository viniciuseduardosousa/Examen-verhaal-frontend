import RichTextDisplay from '../admin/RichTextDisplay';

const NormalStoryContent = ({ tekst }) => {
  return (
    <section className="py-8 animate-slideDown">
      <div
        className="prose prose-2xl max-w-7xl mx-auto font-serif leading-relaxed text-gray-700 text-xl
          prose-headings:font-bold prose-headings:text-gray-800
          prose-h2:text-4xl prose-h2:mt-16 prose-h2:mb-8
          prose-h3:text-3xl prose-h3:mt-12 prose-h3:mb-6
          prose-p:text-xl prose-p:my-8 prose-p:whitespace-pre-wrap
          prose-ul:list-disc prose-ul:pl-6 prose-ul:my-8
          prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-8
          prose-li:my-4 prose-li:text-xl
          prose-table:w-full prose-table:my-8
          prose-tr:border-b prose-tr:border-gray-200
          prose-td:p-3 prose-td:align-top prose-td:text-xl
          prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
          prose-strong:font-bold prose-strong:text-gray-800
          prose-img:rounded-lg prose-img:my-8
          prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:my-8 prose-blockquote:text-xl
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

export default NormalStoryContent; 