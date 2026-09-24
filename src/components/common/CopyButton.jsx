import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

export const CopyButton = ({
  textToCopy,
  label = 'Salin Nomor Rekening',
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback untuk browser lama
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wider transition-all duration-300 shadow-sm active:scale-95 ${
        copied
          ? 'bg-emerald-600 text-white'
          : 'bg-primary text-white hover:bg-primary-light'
      } ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-white animate-bounce" />
          <span>Tersalin ke Clipboard!</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
