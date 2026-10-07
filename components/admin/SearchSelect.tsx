"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type SearchSelectOption = {
  value: number;
  label: string;
  hint?: string;
  /** Extra text to match against, e.g. phone and city. */
  keywords?: string;
};

const digitsOnly = (value: string) => value.replace(/\D/g, "");

function matches(option: SearchSelectOption, query: string) {
  const haystack = `${option.label} ${option.hint ?? ""} ${option.keywords ?? ""}`.toLowerCase();
  const haystackDigits = digitsOnly(haystack);
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => {
      if (haystack.includes(term)) return true;
      // Lets "98489 69246" or "+91 98489…" find a number stored without spaces.
      const termDigits = digitsOnly(term);
      return termDigits.length >= 3 && haystackDigits.includes(termDigits);
    });
}

export default function SearchSelect({
  options,
  value,
  onChange,
  placeholder,
  emptyText = "No matches",
  clearLabel = "Clear",
}: {
  options: SearchSelectOption[];
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder: string;
  emptyText?: string;
  clearLabel?: string;
}) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  // null = not typing, so the field shows the selected label and the list shows everything.
  const [query, setQuery] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const selected = options.find((option) => option.value === value) ?? null;
  const filtered = useMemo(
    () => (query?.trim() ? options.filter((option) => matches(option, query)) : options),
    [options, query],
  );

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery(null);
      }
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  function openList() {
    if (open) return;
    const index = filtered.findIndex((option) => option.value === value);
    setActiveIndex(Math.max(0, index));
    setOpen(true);
  }

  function choose(option: SearchSelectOption) {
    onChange(option.value);
    setOpen(false);
    setQuery(null);
    inputRef.current?.blur();
  }

  function clear() {
    onChange(null);
    setQuery(null);
    inputRef.current?.focus();
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) return openList();
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((index) => (filtered.length ? (index + step + filtered.length) % filtered.length : 0));
    } else if (event.key === "Enter") {
      if (!open) return;
      event.preventDefault();
      const option = filtered[activeIndex];
      if (option) choose(option);
    } else if (event.key === "Escape" && open) {
      event.preventDefault();
      setOpen(false);
      setQuery(null);
    }
  }

  return (
    <div ref={rootRef} className="relative mt-1.5">
      <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" />
      <input
        ref={inputRef}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open && filtered[activeIndex] ? `${listId}-${activeIndex}` : undefined}
        value={query ?? selected?.label ?? ""}
        placeholder={placeholder}
        autoComplete="off"
        onFocus={(event) => {
          event.currentTarget.select();
          openList();
        }}
        onClick={openList}
        onChange={(event) => {
          setQuery(event.target.value);
          setActiveIndex(0);
          setOpen(true);
        }}
        onKeyDown={onKeyDown}
        className="w-full rounded-xl border border-line bg-black py-3 pr-20 pl-11 text-sm text-[#EDEDED] outline-none placeholder:text-muted/70 focus:border-[#E20E17]"
      />
      <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-0.5">
        {selected ? (
          <button
            type="button"
            onClick={clear}
            aria-label={clearLabel}
            title={clearLabel}
            className="flex size-8 items-center justify-center rounded-lg text-muted transition hover:bg-white/5 hover:text-[#EDEDED]"
          >
            <X className="size-4" />
          </button>
        ) : null}
        <button
          type="button"
          tabIndex={-1}
          aria-label={open ? "Close list" : "Show all"}
          onClick={() => {
            if (open) {
              setOpen(false);
              setQuery(null);
            } else {
              inputRef.current?.focus();
              openList();
            }
          }}
          className="flex size-8 items-center justify-center rounded-lg text-muted transition hover:bg-white/5 hover:text-[#EDEDED]"
        >
          <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
        </button>
      </div>

      {open ? (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          className="absolute inset-x-0 top-full z-30 mt-1.5 max-h-72 overflow-y-auto rounded-xl border border-white/10 bg-[#0B0B0B] p-1.5 shadow-[0_18px_40px_rgba(0,0,0,0.6)]"
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-3 text-sm text-muted">
              {emptyText}
              {query?.trim() ? ` for “${query.trim()}”` : ""}
            </li>
          ) : (
            filtered.map((option, index) => {
              const isSelected = option.value === value;
              return (
                <li
                  key={option.value}
                  id={`${listId}-${index}`}
                  data-index={index}
                  role="option"
                  aria-selected={isSelected}
                  // Keep focus in the input so the click registers before blur closes the list.
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => choose(option)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5",
                    index === activeIndex ? "bg-white/[0.07]" : "",
                  )}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-[#EDEDED]">{option.label}</span>
                    {option.hint ? <span className="block truncate text-xs text-muted">{option.hint}</span> : null}
                  </span>
                  {isSelected ? <Check className="size-4 shrink-0 text-[#E20E17]" /> : null}
                </li>
              );
            })
          )}
        </ul>
      ) : null}
    </div>
  );
}
