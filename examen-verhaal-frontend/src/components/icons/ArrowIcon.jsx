const ArrowIcon = ({ className = "w-6 h-6" }) => {
  return (
    <svg 
      className={className}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor"
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M15 5l7 7-7 7" />
    </svg>
  );
};

export default ArrowIcon; 