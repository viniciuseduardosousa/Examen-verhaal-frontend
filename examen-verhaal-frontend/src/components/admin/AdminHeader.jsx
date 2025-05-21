import React from 'react';

const AdminHeader = ({ onLogout }) => {
  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-mono font-bold">IngsScribblings</h1>
        <button 
          onClick={onLogout}
          className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
        >
          Log-out
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.33333 18C2.96667 18 2.65278 17.8694 2.39167 17.6083C2.13056 17.3472 2 17.0333 2 16.6667V7.33333C2 6.96667 2.13056 6.65278 2.39167 6.39167C2.65278 6.13056 2.96667 6 3.33333 6H8V7.33333H3.33333V16.6667H8V18H3.33333ZM10.6667 15.3333L9.75 14.3667L11.45 12.6667H6V11.3333H11.45L9.75 9.63333L10.6667 8.66667L14 12L10.6667 15.3333Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>

      {/* Welcome and Create Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-mono font-bold">welkom, Ingrid</h2>
      </div>
    </>
  );
};

export default AdminHeader; 