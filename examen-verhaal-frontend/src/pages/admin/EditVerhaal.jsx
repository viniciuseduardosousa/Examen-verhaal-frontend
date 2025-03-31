import { useParams } from 'react-router-dom';

const EditVerhaal = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Verhaal Bewerken</h1>
      {/* Voeg hier je edit formulier toe */}
    </div>
  );
};

export default EditVerhaal; 