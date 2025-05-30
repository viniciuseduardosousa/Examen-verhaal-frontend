import RichTextDisplay from './admin/RichTextDisplay';

const Hero = ({ subtitle }) => {
  console.log('Hero component received subtitle:', subtitle);
  
  return (
    <div className="w-full bg-[#FFFFF5] pt-32 pb-4">
      <div className="container mx-auto px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-2xl font-medium text-gray-800 text-center">
            <RichTextDisplay content={subtitle} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero; 