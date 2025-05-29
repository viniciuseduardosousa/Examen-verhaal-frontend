import RichTextDisplay from './admin/RichTextDisplay';

const Hero = ({ subtitle }) => {
  console.log('Hero component received subtitle:', subtitle);
  
  return (
    <div className="w-full bg-[#FFFFF5] pt-40 pb-8">
      <div className="container mx-auto px-8">
        <div className="max-w-4xl">
          <div className="text-2xl font-medium text-gray-800 text-left">
            <RichTextDisplay content={subtitle} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero; 