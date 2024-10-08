export const createPkceChallenge = async () => {
  const verifier = createVerifier();
  const challenge = await createChallenge(verifier);

  return { verifier, challenge };
};

export const createVerifier = () => {
  const randomBytes = crypto.getRandomValues(new Uint32Array(96));
  return base64urlEncode(randomBytes);
};

export const createChallenge = async (state: string) => {
  const hashed = await sha256(state);
  return base64urlEncode(hashed);
};

export const base64urlEncode = (buffer: ArrayBuffer): string => {
  return btoa(
    Array.from(new Uint8Array(buffer), (b) => String.fromCharCode(b)).join("")
  )
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

export const sha256 = (plain: string): Promise<ArrayBuffer> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest("SHA-256", data);
};
