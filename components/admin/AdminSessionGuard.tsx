"use client";

import { startTransition, useEffect, useState } from "react";
import { logoutAdmin, refreshAdminSession } from "@/app/admin/actions";
import Button from "@/components/Button";

function cappedDeadline(expiresAt: number, sessionMs: number, graceMs: number) {
  return Math.min(expiresAt, Date.now() + sessionMs + graceMs);
}

export default function AdminSessionGuard({
  expiresAt,
  sessionMs,
  graceMs,
}: {
  expiresAt: number;
  sessionMs: number;
  graceMs: number;
}) {
  const [deadline, setDeadline] = useState(() => cappedDeadline(expiresAt, sessionMs, graceMs));
  const [promptOpen, setPromptOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(Math.ceil(graceMs / 1000));
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setDeadline(cappedDeadline(expiresAt, sessionMs, graceMs));
    setPromptOpen(false);
  }, [expiresAt, sessionMs, graceMs]);

  useEffect(() => {
    const maxFresh = Date.now() + sessionMs + graceMs + 2000;
    if (expiresAt <= maxFresh) return;

    startTransition(async () => {
      try {
        const result = await refreshAdminSession();
        setDeadline(result.expiresAt);
      } catch {
        // Keep the capped client timer if the cookie cannot be rewritten.
      }
    });
  }, [expiresAt, sessionMs, graceMs]);

  useEffect(() => {
    const promptAt = deadline - graceMs;

    const tick = () => {
      const now = Date.now();
      if (now >= deadline) {
        startTransition(() => {
          void logoutAdmin();
        });
        return;
      }

      if (now >= promptAt) {
        if (document.hidden) {
          startTransition(() => {
            void logoutAdmin();
          });
          return;
        }
        setPromptOpen(true);
        setSecondsLeft(Math.max(1, Math.ceil((deadline - now) / 1000)));
      }
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [deadline, graceMs]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden && Date.now() >= deadline - graceMs) {
        startTransition(() => {
          void logoutAdmin();
        });
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [deadline, graceMs]);

  useEffect(() => {
    if (!promptOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [promptOpen]);

  function signOut() {
    startTransition(() => {
      void logoutAdmin();
    });
  }

  function staySignedIn() {
    setPending(true);
    startTransition(async () => {
      try {
        const result = await refreshAdminSession();
        setDeadline(result.expiresAt);
        setPromptOpen(false);
      } catch {
        await logoutAdmin();
      } finally {
        setPending(false);
      }
    });
  }

  if (!promptOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-session-title"
        className="w-full max-w-md rounded-[28px] border border-line bg-card p-8 shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
      >
        <p className="text-[11px] font-semibold tracking-[0.2em] text-[#E20E17] uppercase">
          Session
        </p>
        <h2 id="admin-session-title" className="mt-2 text-2xl font-extrabold text-[#EDEDED]">
          Stay signed in?
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#9A9A9A]">
          Your admin session is about to expire. Stay logged in to keep working, or log out now.
        </p>
        <p className="mt-4 text-sm font-semibold text-[#EDEDED]">
          Logging out in {secondsLeft}s
        </p>
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={signOut} disabled={pending} className="w-full sm:w-auto">
            Log out
          </Button>
          <Button onClick={staySignedIn} disabled={pending} className="w-full sm:w-auto">
            {pending ? "Staying..." : "Stay logged in"}
          </Button>
        </div>
      </div>
    </div>
  );
}
