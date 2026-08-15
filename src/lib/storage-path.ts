const EXTENSIONS_BY_MIME_TYPE = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

export type ListingImageMimeType = keyof typeof EXTENSIONS_BY_MIME_TYPE;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function createListingImageStoragePath(
  listingId: string,
  mimeType: ListingImageMimeType,
): string {
  if (!UUID_PATTERN.test(listingId))
    throw new Error("listingId debe ser un UUID válido.");
  return `listings/${listingId}/${crypto.randomUUID()}.${EXTENSIONS_BY_MIME_TYPE[mimeType]}`;
}
