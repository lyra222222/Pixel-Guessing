import React, { useState, useEffect, useRef } from 'react';

interface GuessInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  shake?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function GuessInput({
  value,
  onChange,
  onSubmit,
  shake = false,
  disabled = false,
  placeholder = '输入歌名…',
}: GuessInputProps) {
  const [focused, setFocused] = useState(false);
  const [shaking, setShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (shake) {
      setShaking(true);
      const timer = setTimeout(() => setShaking(false), 500);
      return () => clearTimeout(timer);
    }
  }, [shake]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim()) {
      onSubmit();
    }
  };

  return (
    <div
      className={shaking ? 'pixel-shake' : ''}
      style={{
        width: '100%',
        position: 'relative',
        maxWidth: '600px',
      }}
    >
      {/* Input field */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          borderBottom: `4px solid ${focused ? '#00ffff' : '#2a2a6e'}`,
          padding: '16px 8px 12px 8px',
          fontSize: '1.4rem',
          fontFamily: "'Press Start 2P', 'Courier New', monospace",
          color: '#ffffff',
          outline: 'none',
          caretColor: '#00ffff',
          letterSpacing: '0.05em',
          transition: 'border-color 0.15s',
        }}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
      />

      {/* Animated underline glow when focused */}
      {focused && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: '4px',
            background: 'linear-gradient(90deg, transparent, #00ffff, transparent)',
            animation: 'underline-grow 0.3s ease-out forwards',
            pointerEvents: 'none',
            filter: 'blur(1px)',
            opacity: 0.6,
          }}
        />
      )}

      {/* Placeholder pixel text */}
      {!value && !focused && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '8px',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '0.9rem',
            color: '#333366',
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
          }}
        >
          <span>{placeholder}</span>
          <span
            style={{
              display: 'inline-block',
              width: '12px',
              height: '1.2em',
              background: '#00ffff',
              opacity: 0.7,
              animation: 'pixel-blink 1s step-end infinite',
              verticalAlign: 'middle',
              marginLeft: '2px',
            }}
          />
        </div>
      )}

      {/* Corner pixel decorations */}
      <div
        style={{
          position: 'absolute',
          bottom: '-4px',
          left: 0,
          width: '8px',
          height: '8px',
          background: focused ? '#00ffff' : '#2a2a6e',
          transition: 'background 0.15s',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-4px',
          right: 0,
          width: '8px',
          height: '8px',
          background: focused ? '#00ffff' : '#2a2a6e',
          transition: 'background 0.15s',
        }}
      />
    </div>
  );
}
