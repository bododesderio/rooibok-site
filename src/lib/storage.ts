import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { randomBytes } from "crypto";

/**
 * Storage interface — local VPS implementation.
 * Swap implementation later for S3-compatible storage without changing callers.
 */

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

export type SaveFileOptions = {
  /** Subfolder under /public/uploads (e.g. "resumes", "media") */
  folder: string;
  /** Original filename — used to derive extension */
  originalName: string;
  /** File contents */
  buffer: Buffer;
  /** Allowed file extensions (without dot), lowercased */
  allowedExtensions?: string[];
  /** Max size in bytes */
  maxBytes?: number;
};

export type SavedFile = {
  /** Public URL (e.g. /uploads/resumes/abc123.pdf) */
  url: string;
  /** Stored filename */
  filename: string;
  /** Size in bytes */
  size: number;
};

export async function saveFile(opts: SaveFileOptions): Promise<SavedFile> {
  const { folder, originalName, buffer, allowedExtensions, maxBytes } = opts;

  if (maxBytes && buffer.length > maxBytes) {
    throw new Error(`File exceeds maximum size of ${Math.round(maxBytes / 1024 / 1024)}MB`);
  }

  const ext = path.extname(originalName).toLowerCase().replace(".", "");
  if (!ext) throw new Error("File has no extension");
  if (allowedExtensions && !allowedExtensions.includes(ext)) {
    throw new Error(`File type .${ext} not allowed`);
  }

  // Sanitize folder — only allow simple subfolder names
  if (!/^[a-z0-9_-]+$/i.test(folder)) {
    throw new Error("Invalid folder name");
  }

  const targetDir = path.join(UPLOAD_ROOT, folder);
  if (!existsSync(targetDir)) {
    await mkdir(targetDir, { recursive: true });
  }

  const filename = `${randomBytes(16).toString("hex")}.${ext}`;
  const filepath = path.join(targetDir, filename);
  await writeFile(filepath, buffer);

  return {
    url: `/uploads/${folder}/${filename}`,
    filename,
    size: buffer.length,
  };
}
