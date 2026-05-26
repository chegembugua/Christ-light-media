
import { useState, useRef, useCallback, KeyboardEvent } from 'react';
import { Send, Smile, Loader2 } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  loading?: boolean;
  maxLength?: number;
}

export default function MessageInput({
  onSendMessage,
  loading,
  maxLength = 500,
}: MessageInputProps) {
  const [text, setText] = useState('');
  const [rows, setRows] = useState(1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustRows = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    const lineHeight = 22; // px, matches leading-relaxed
    const maxRows = Math.floor(120 / lineHeight);
    const computedRows = Math.max(1, Math.min(maxRows, Math.ceil(el.scrollHeight / lineHeight)));
    setRows(computedRows);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length > maxLength) return;
    setText(val);
    adjustRows();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!text.trim() || loading || text.length > maxLength) return;
    onSendMessage(text);
    setText('');
    setRows(1);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const charCount = text.length;
  const overLimit = charCount > maxLength;

  return (
    <div className="border-t border-white/5 bg-[#0F0F0F] p-4">
      <div className="flex items-end gap-3">
        <div className="flex flex-1 items-end gap-2 rounded-xl border border-white/10 bg-[#1A1A1A] transition-colors focus-within:border-[#C8A24A]/60">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            rows={rows}
            placeholder="Share faith, encouragement, prayer..."
            className="flex-1 resize-none bg-transparent px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none text-wrap"
            maxLength={maxLength + 10}
            disabled={loading}
          />
          <div className="flex flex-col items-end gap-1 px-3 pb-2">
            {/* Emoji picker placeholder — TODO: integrate emoji-picker-react */}
            <button
              type="button"
              disabled
              className="text-gray-500 hover:text-gray-400 disabled:pointer-events-none"
              title="Emoji picker — coming soon"
            >
              <Smile size={18} />
            </button>
            <span
              className={`text-[10px] ${
                overLimit ? 'text-red-500' : charCount > maxLength * 0.9 ? 'text-amber-400' : 'text-gray-600'
              }`}
            >
              {charCount} / {maxLength}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSend}
          disabled={!text.trim() || loading || overLimit}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#C8A24A] text-black transition-all hover:bg-[#B38A3D] hover:shadow-lg hover:shadow-[#C8A24A]/20 disabled:pointer-events-none disabled:opacity-40"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Send size={18} />
          )}
        </button>
      </div>
    </div>
  );
}
