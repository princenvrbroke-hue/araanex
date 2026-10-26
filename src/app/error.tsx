'use client';

import { useEffect } from 'react';
import { ErrorScreen, ghostBtn, primaryBtn } from '@/components/ui/ErrorScreen';

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorScreen
      code="ERROR"
      title="Signal lost"
      message="Something went wrong while loading this page. Try again, or head back to the start."
    >
      <button type="button" style={primaryBtn} onClick={() => retry()}>
        Try again
      </button>
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- full reload clears broken client state */}
      <a href="/" style={ghostBtn}>
        Back to home
      </a>
    </ErrorScreen>
  );
}
