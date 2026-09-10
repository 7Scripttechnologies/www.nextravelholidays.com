import { readFile } from "fs/promises";
import { NextResponse } from "next/server";
import { resolveUploadedFile, uploadMime } from "@/lib/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;
  const filePath = resolveUploadedFile(filename);

  if (!filePath) {
    return new NextResponse("Not found", { status: 404 });
  }

  const body = await readFile(filePath);
  return new NextResponse(body, {
    headers: {
      "Content-Type": uploadMime(filename),
      "Cache-Control": "public, max-age=60",
    },
  });
}
