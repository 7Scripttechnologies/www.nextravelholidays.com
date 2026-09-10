"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type ParsedStat = {
  target: number;
  /** k / K for compact values like 4k+ */
  compact: "k" | "K" | null;
  suffix: string;
  useComma: boolean;
  ratioRest: string | null;
};

function parseStatValue(raw: string): ParsedStat {
  const value = raw.trim();
  const ratio = value.match(/^(\d+)\s*(\/\s*\d+)$/);
  if (ratio) {
    return {
      target: Number(ratio[1]),
      compact: null,
      suffix: "",
      useComma: false,
      ratioRest: ratio[2].replace(/\s/g, ""),
    };
  }

  const compact = value.match(/^(\d+(?:\.\d+)?)([kK])([+%]?)$/);
  if (compact) {
    return {
      target: Number(compact[1]) * 1000,
      compact: compact[2] as "k" | "K",
      suffix: compact[3],
      useComma: false,
      ratioRest: null,
    };
  }

  const plain = value.match(/^([\d,]+)([+%]?)$/);
  if (plain) {
    return {
      target: Number(plain[1].replace(/,/g, "")),
      compact: null,
      suffix: plain[2],
      useComma: plain[1].includes(","),
      ratioRest: null,
    };
  }

  return { target: 0, compact: null, suffix: value, useComma: false, ratioRest: null };
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function formatParts(current: number, parsed: ParsedStat, done: boolean) {
  if (parsed.ratioRest) {
    return { amount: String(Math.round(current)), rest: parsed.ratioRest };
  }

  if (parsed.compact) {
    const kValue = done ? parsed.target / 1000 : current / 1000;
    const amount = done
      ? String(Math.round(parsed.target / 1000))
      : kValue.toFixed(1).replace(/\.0$/, "");
    return { amount: `${amount}${parsed.compact}`, rest: parsed.suffix };
  }

  const rounded = Math.round(current);
  const amount = parsed.useComma ? rounded.toLocaleString("en-US") : String(rounded);
  return { amount, rest: parsed.suffix };
}

interface CountUpProps {
  value: string;
  className?: string;
  numberClassName?: string;
  suffixClassName?: string;
  delay?: number;
  duration?: number;
}

export default function CountUp({
  value,
  className,
  numberClassName,
  suffixClassName,
  delay = 0,
  duration = 1600,
}: CountUpProps) {
  const parsed = parseStatValue(value);
  const ref = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || parsed.target <= 0) {
      setCurrent(parsed.target);
      setDone(true);
      return;
    }

    let frame = 0;
    let startAt = 0;
    let started = false;

    const tick = (now: number) => {
      if (!startAt) startAt = now + delay;
      const elapsed = now - startAt;
      if (elapsed < 0) {
        frame = requestAnimationFrame(tick);
        return;
      }
      const progress = Math.min(1, elapsed / duration);
      setCurrent(parsed.target * easeOutCubic(progress));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
        return;
      }
      setCurrent(parsed.target);
      setDone(true);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        observer.disconnect();
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [delay, duration, parsed.target]);

  const parts = formatParts(current, parsed, done);

  return (
    <span
      ref={ref}
      className={cn("inline-block tabular-nums", className)}
      aria-label={value}
      style={{ minWidth: `${Math.max(value.length, 3)}ch` }}
    >
      <span aria-hidden="true">
        <span className={numberClassName}>{parts.amount}</span>
        {parts.rest ? <span className={suffixClassName}>{parts.rest}</span> : null}
      </span>
    </span>
  );
}
