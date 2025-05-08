const Divider = ({ show = true }) => {
  if (!show) return null;
  
  return (
    <div className="w-full py-12">
      <div className="container mx-auto px-8">
        <div className="h-[1px] w-full bg-gray-800/20"></div>
      </div>
    </div>
  );
};

export default Divider; 