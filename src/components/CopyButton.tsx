import React, { useState, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
    contentToCopy: string;
      className?: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ contentToCopy, className }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (contentToCopy) {
      navigator.clipboard.writeText(contentToCopy)
        .then(() => {
          setCopied(true);
          setTimeout(() => {
            setCopied(false);
          }, 2000);
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
        });
    }
  }, [contentToCopy]);

  return (
    <button
      onClick={handleCopy}
      className={`absolute top-2 right-2 p-1.5 rounded-lg text-xs font-semibold transition-all duration-200 
                  ${copied 
                    ? 'bg-green-500 text-white shadow-md' 
                    : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  }
                  ${className}`}
      aria-label={copied ? "Copied to clipboard" : "Copy code to clipboard"}
      disabled={copied}
    >
      {copied ? (
        <span className="flex items-center space-x-1">
          <Check className="w-3 h-3" />
          <span>Copied!</span>
        </span>
      ) : (
        <span className="flex items-center space-x-1">
          <Copy className="w-3 h-3" />
          <span>Copy</span>
        </span>
      )}
    </button>
  );
};

export default CopyButton;