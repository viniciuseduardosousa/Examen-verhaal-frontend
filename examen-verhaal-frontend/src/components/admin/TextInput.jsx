import React from 'react';

const TextInput = ({ label, name, value, onChange, rows = 3 }) => {
  return (
    <div>
      <label className="block text-sm font-mono font-bold mb-1">
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border rounded-md bg-[#F7F6ED] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        rows={rows}
      />
    </div>
  );
};

export default TextInput; 