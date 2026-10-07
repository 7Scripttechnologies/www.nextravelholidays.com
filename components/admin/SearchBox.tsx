import Link from "next/link";
import { Search } from "lucide-react";

export default function SearchBox({
  action,
  query,
  placeholder,
  hiddenParams,
}: {
  action: string;
  query: string;
  placeholder: string;
  /** Extra filters (e.g. the selected status tab) kept when searching or clearing. */
  hiddenParams?: Record<string, string>;
}) {
  const extra = Object.entries(hiddenParams ?? {}).filter(([, value]) => value);
  const clearHref = extra.length > 0 ? `${action}?${new URLSearchParams(extra).toString()}` : action;

  return (
    <form action={action} method="get" className="flex w-full max-w-md items-center gap-2">
      {extra.map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <label className="relative flex-1">
        <span className="sr-only">Search</span>
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" />
        <input
          name="q"
          defaultValue={query}
          placeholder={placeholder}
          className="w-full rounded-full border border-line bg-black py-2.5 pr-4 pl-10 text-sm text-[#EDEDED] outline-none placeholder:text-muted/70 focus:border-[#E20E17]"
        />
      </label>
      {query ? (
        <Link href={clearHref} className="text-xs font-semibold text-muted hover:text-[#EDEDED]">
          Clear
        </Link>
      ) : null}
    </form>
  );
}
