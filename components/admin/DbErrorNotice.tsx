export default function DbErrorNotice({ message }: { message: string }) {
  return (
    <div className="rounded-[24px] border border-[#E20E17]/40 bg-[#E20E17]/10 p-6 text-sm leading-7 text-[#EDEDED]">
      <p className="font-semibold">MySQL is not connected.</p>
      <p className="mt-2 text-muted">{message}</p>
      <p className="mt-3 text-muted">
        Start MySQL locally, then run <code className="text-[#EDEDED]">npm run db:seed</code>.
      </p>
    </div>
  );
}

export function dbErrorMessage(error: unknown) {
  const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
  if (code === "ETIMEDOUT" || code === "ECONNREFUSED" || code === "EHOSTUNREACH" || code === "ENOTFOUND") {
    return `Can't reach the MySQL server (${code}). Check that it is online and accepts remote connections from this computer's IP, then reload.`;
  }
  return error instanceof Error
    ? error.message
    : "Could not connect to MySQL. Start the database and try again.";
}
