import { supabase } from "@/integrations/supabase/client";

const BUCKET = "my-bucket-green";

/**
 * Resolve a stored photo reference to a viewable URL.
 * - Legacy submissions stored full public URLs; return them as-is.
 * - New submissions store the storage path; generate a short-lived signed URL.
 */
export async function resolvePhotoUrl(ref: string, expiresIn = 3600): Promise<string> {
  if (!ref) return ref;
  if (/^https?:\/\//i.test(ref)) return ref;
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(ref, expiresIn);
  if (error || !data?.signedUrl) return ref;
  return data.signedUrl;
}

export async function resolvePhotoUrls(refs: string[] = [], expiresIn = 3600): Promise<string[]> {
  return Promise.all(refs.map((r) => resolvePhotoUrl(r, expiresIn)));
}
