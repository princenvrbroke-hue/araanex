'use client';

import { ErrorScreen, ghostBtn, primaryBtn } from '@/components/ui/ErrorScreen';

// Replaces the root layout when it fails, so it must render its own <html>/<body>.
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  console.error(error);
  return (
    <html lang="en" style={{ background: '#05080f' }}>
      <body style={{ margin: 0, background: '#05080f' }}>
        <ErrorScreen
          code="ERROR"
          title="Signal lost"
          message="This page couldn't load. Reload to try again."
        >
          <button type="button" style={primaryBtn} onClick={() => window.location.reload()}>
            Reload
          </button>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/" style={ghostBtn}>
            Back to home
          </a>
        </ErrorScreen>
      </body>
    </html>
  );
}
