import React, { ReactNode } from 'react';

interface ErrorScreenProps {
  code: string;
  title: string;
  message: string;
  children: ReactNode;
}

/** Shared full-screen state for error / not-found pages (inline styles so it also works inside global-error). */
export function ErrorScreen({ code, title, message, children }: ErrorScreenProps) {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background:
          'radial-gradient(ellipse at 60% 40%, rgba(40,80,160,0.22), transparent 60%), linear-gradient(180deg, #05080f 0%, #0a0f1a 50%, #05080f 100%)',
        color: '#fff',
        fontFamily: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: 480,
          width: '100%',
          textAlign: 'center',
          padding: '40px 32px',
          borderRadius: 6,
          border: '1px solid rgba(160,190,255,0.18)',
          background: 'rgba(15,25,45,0.65)',
          backdropFilter: 'blur(14px)',
          boxShadow: '0 0 35px rgba(70,150,255,0.2)',
        }}
      >
        <p style={{ margin: 0, fontSize: 12, letterSpacing: '0.28em', color: '#5aa9ff' }}>
          ARANEX · {code}
        </p>
        <h1 style={{ margin: '16px 0 0', fontSize: 30, fontWeight: 400, letterSpacing: '-0.01em' }}>
          {title}
        </h1>
        <p style={{ margin: '12px 0 0', fontSize: 15, fontWeight: 300, lineHeight: 1.6, color: '#c9d3e6' }}>
          {message}
        </p>
        <div style={{ marginTop: 28, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          {children}
        </div>
      </div>
    </main>
  );
}

export const primaryBtn: React.CSSProperties = {
  height: 44,
  padding: '0 28px',
  borderRadius: 999,
  border: 'none',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  background: 'linear-gradient(90deg, #8cc4ff 0%, #5aa9ff 100%)',
  color: '#061021',
  fontSize: 14,
  fontWeight: 500,
  textDecoration: 'none',
};

export const ghostBtn: React.CSSProperties = {
  ...primaryBtn,
  background: 'transparent',
  color: '#fff',
  border: '1px solid rgba(160,190,255,0.35)',
};
