import { generatePDFWithWatermark } from '../../utils/pdfWatermark';

const StoryActions = ({ verhaal }) => {
  const handleDownload = async () => {
    try {
      if (verhaal.pdf_file) {
        // Handle DOCX-generated PDFs
        window.open(verhaal.pdf_file, '_blank');
        
        const response = await fetch(verhaal.pdf_file);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${verhaal.titel}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        // Handle regular stories
        const doc = generatePDFWithWatermark(
          verhaal.titel,
          verhaal.beschrijving,
          verhaal.tekst
        );
        
        // Save the PDF
        doc.save(`${verhaal.titel}.pdf`);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="flex flex-col justify-end gap-4">
      <div className="flex gap-4">
        {verhaal.is_downloadable && (
          <button 
            onClick={handleDownload}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e3e3e3"
            >
              <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
            </svg>
            Download als PDF
          </button>
        )}
        {verhaal.url && verhaal.url.trim() !== '' && (
          <a
            href={verhaal.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#FFFFF5] border-2 border-gray-800 text-gray-800 rounded hover:bg-gray-100 transition-colors flex items-center gap-2 font-mono"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="currentColor"
            >
              <path d="M440-280H280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h160v80H280q-50 0-85 35t-35 85q0 50 35 85t85 35h160v80ZM320-440v-80h320v80H320Zm200 160v-80h160q50 0 85-35t35-85q0-50-35-85t-85-35H520v-80h160q83 0 141.5 58.5T880-480q0 83-58.5 141.5T680-280H520Z" />
            </svg>
            See More
          </a>
        )}
      </div>
    </div>
  );
};

export default StoryActions; 