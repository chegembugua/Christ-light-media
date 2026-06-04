
import { useState, useRef, useCallback, type ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export default function Tooltip({
  content,
  children,
  side = 'top',
  delay = 600,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const anchorRef = useRef<HTMLDivElement>(null);

  const show = useCallback(() => {
    timerRef.current = setTimeout(() => setVisible(true), delay);
  }, [delay]);

  const hide = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
  }, []);

  const position =
    side === 'top'
      ? 'bottom-full left-1/2 -translate-x-1/2 mb-2'
      : side === 'bottom'
        ? 'top-full left-1/2 -translate-x-1/2 mt-2'
        : side === 'left'
          ? 'right-full top-1/2 -translate-y-1/2 mr-2'
          : 'left-full top-1/2 -translate-y-1/2 ml-2';

  return (
    <div
      ref={anchorRef}
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}

      {/* Tooltip bubble */}
      {visible && (
        <>
          {/* Arrow */}
          <span
            aria-hidden="true"
            className="absolute z-50 h-2 w-2 rotate-45 bg-[#1E1E1E] border-[rgba(200,162,74,0.25)]"
            style={{
              [side === 'top' ? 'bottom' : 'top']: '-4px',
              left: '50%',
              transform: 'translateX(-50%)',
              borderTopWidth: side === 'bottom' ? '1px' : '0',
              borderBottomWidth: side === 'top' ? '1px' : '0',
              borderLeftWidth: side === 'right' ? '1px' : '0',
              borderRightWidth:  side === 'left'   ? '1px' : '0',
              borderStyle: 'solid',
              borderColor:
                side === 'top'
                  ? 'rgba(200,162,74,0.25) rgba(200,162,74,0.25) transparent transparent'
                  : side === 'bottom'
                    ? 'transparent transparent rgba(200,162,74,0.25) rgba(200,162,74,0.25)'
                    : side === 'left'
                      ? 'transparent rgba(200,162,74,0.25) transparent transparent'
                      : 'transparent transparent transparent rgba(200,162,74,0.25)',
            }}
          />

          <span
            role="tooltip"
            className={`absolute z-50 px-3.5 py-2 rounded-lg text-[0.7rem] font-medium text-white whitespace-nowrap
                       animate-fade-in pointer-events-none select-none
                       ${position}`}
            style={{
              background: '#1E1E1E',
              border:    '1px solid rgba(200,162,74,0.22)',
              boxShadow: '0 6px 20px rgba(0,0,0,0.45), 0 0 22px rgba(200,162,74,0.08)',
            }}
          >
            {content}
          </span>
        </>
      )}
    </div>
  );
}
