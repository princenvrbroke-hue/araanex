import Link from 'next/link';
import type { Metadata } from 'next';
import { ErrorScreen, primaryBtn } from '@/components/ui/ErrorScreen';

export const metadata: Metadata = { title: 'Not found — ARAANEX' };

export default function NotFound() {
  return (
    <ErrorScreen
      code="404"
      title="Off the pattern"
      message="The page you're looking for doesn't exist or has moved."
    >
      <Link href="/" style={primaryBtn}>
        Back to home
      </Link>
    </ErrorScreen>
  );
}
