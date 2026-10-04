"use client";

import { useEffect } from "react";
import { Button, Icon, LinkButton } from "@/components/ui";

// Route error boundary: a crash in one page shows this instead of a blank screen.
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] text-center" role="alert">
      <Icon name="error" className="text-5xl text-secondary mb-4" />
      <h1 className="text-xl font-bold text-primary mb-2">Something went wrong on this page</h1>
      <p className="text-sm text-on-surface-variant mb-6 max-w-md">
        Try again. If it keeps happening, go back to the overview; your session data is still there.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Button variant="dark" icon="refresh" onClick={reset}>
          Try again
        </Button>
        <LinkButton href="/" variant="secondary">
          Go to overview
        </LinkButton>
      </div>
    </div>
  );
}
