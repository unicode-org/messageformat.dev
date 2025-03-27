export function encode(source: string): string {
  const textEncoder = new TextEncoder();
  const encoded = textEncoder.encode(source);
  return btoa(String.fromCharCode(...encoded));
}

export function decode(encoded: string): string {
  const textDecoder = new TextDecoder();
  const decoded = atob(encoded);
  return textDecoder.decode(Uint8Array.from(decoded, c => c.charCodeAt(0)));
}