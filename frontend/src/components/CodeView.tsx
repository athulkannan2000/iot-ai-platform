import { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-javascript';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface CodeViewProps {
  code: string;
  language: 'python' | 'cpp' | 'javascript';
}

export default function CodeView({ code, language }: CodeViewProps) {
  const codeRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, language]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const prismLanguage = language === 'cpp' ? 'c' : language;

  const emptyCodeMessage = `# Your code will appear here
# Start by dragging blocks to the workspace

# Example:
# - Add an "on start" event block
# - Add IoT blocks to control sensors
# - Add AI blocks for intelligence
`;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
        <span className="text-sm text-slate-400">
          Generated {language.toUpperCase()} Code
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-400" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="flex-1 overflow-auto bg-slate-900 p-4">
        <pre className="code-view text-sm">
          <code ref={codeRef} className={`language-${prismLanguage}`}>
            {code || emptyCodeMessage}
          </code>
        </pre>
      </div>
    </div>
  );
}
