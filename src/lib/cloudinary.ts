import type { UploadSignatureResponse } from "uroboros-types";

/**
 * Uploads a file directly from the browser to Cloudinary using a signature
 * obtained from the backend (see admin/productos actions). The API secret
 * never reaches the browser, and image bytes never pass through our backend.
 */
export async function uploadToCloudinary(
  file: File,
  signature: UploadSignatureResponse,
): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  form.append("api_key", signature.apiKey);
  form.append("timestamp", String(signature.timestamp));
  form.append("signature", signature.signature);
  form.append("folder", signature.folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    throw new Error("Image upload to Cloudinary failed");
  }

  const data = (await res.json()) as { secure_url: string };
  return data.secure_url;
}
