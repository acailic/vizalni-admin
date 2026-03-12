'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Report render errors so they appear in Sentry even before hydration completes.
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <h2>Došlo je do greške</h2>
        <p>{error.message}</p>
        <button type="button" onClick={() => reset()}>
          Pokušaj ponovo
        </button>
      </body>
    </html>
  );
}
