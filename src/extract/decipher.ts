export async function decipherSignature(
  sig: string
) {
  return sig
    .split("")
    .reverse()
    .join("")
}
