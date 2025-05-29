import React from 'react';

const TextInput = ({ label, name, value, onChange, rows = 3, required, isSubmitted, type = 'text', className = '' }) => {
  return (
    <div>
      <label className="block text-sm font-mono font-bold mb-1">
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        className={`w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-[#F7F6ED] focus:outline-none focus:border-black overflow-y-auto resize-none ${
          isSubmitted ? 'invalid:border-red-500' : ''
        } ${className}`}
      />
    </div>
  );
};

export default TextInput; 