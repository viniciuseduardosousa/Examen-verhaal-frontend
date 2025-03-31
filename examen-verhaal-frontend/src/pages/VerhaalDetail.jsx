import { useParams } from 'react-router-dom';

const VerhaalDetail = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Verhaal Detail</h1>
      {/* Voeg hier je verhaal detail content toe */}
    </div>
  );
};

export default VerhaalDetail; 