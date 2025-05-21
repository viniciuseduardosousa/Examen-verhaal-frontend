import WordStoryContent from './WordStoryContent';
import NormalStoryContent from './NormalStoryContent';

const StoryContent = ({ tekst, isWordImport }) => {
  return isWordImport ? (
    <WordStoryContent tekst={tekst} />
  ) : (
    <NormalStoryContent tekst={tekst} />
  );
};

export default StoryContent; 