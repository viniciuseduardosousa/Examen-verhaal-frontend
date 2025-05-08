import { Toaster } from 'react-hot-toast';

const Toast = () => {
  return (
    <Toaster 
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#fff',
          color: '#111',
          border: '2px solid #111',
          borderRadius: '8px',
          fontFamily: 'monospace',
          padding: '12px 16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
        success: {
          iconTheme: {
            primary: '#22c55e',
            secondary: '#fff',
          },
          style: {
            background: '#dcfce7',
            color: '#166534',
            border: '2px solid #22c55e',
            animation: 'bounce 0.5s ease-in-out',
          },
        },
        error: {
          iconTheme: {
            primary: '#fff',
            secondary: '#dc2626',
          },
          style: {
            background: '#fee2e2',
            color: '#991b1b',
            border: '2px solid #dc2626',
            animation: 'shake 0.5s ease-in-out',
          },
        },
      }}
    />
  );
};

// Add global styles for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
`;
document.head.appendChild(style);

export default Toast; 