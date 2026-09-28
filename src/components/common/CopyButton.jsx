import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

export const CopyButton = ({
  textToCopy,
  label = 'Salin Nomor Rekening',
  className = '',
  variant = 'primary', // 'primary' | 'gold' | 'custom'
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

  const variantStyles = {
    primary:
      'bg-primary text-white hover:bg-primary-light border border-gold/30 shadow-sm',
    gold: 'bg-gradient-to-r from-gold via-gold-light to-gold text-primary font-bold hover:brightness-105 border border-white/40 shadow-md',
  };

  const activeStyle = copied
    ? 'bg-emerald-600 text-white border-transparent'
    : variantStyles[variant] || '';

  return (
    <button
      onClick={handleCopy}
      type="button"
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all duration-300 active:scale-95 cursor-pointer ${activeStyle} ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-white animate-bounce" />
          <span>Tersalin ke Clipboard!</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 opacity-85" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
