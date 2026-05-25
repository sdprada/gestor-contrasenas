/**
 * Lightweight password strength: 0..4
 * 0 = muy débil, 4 = muy fuerte
 */
export function scoreStrength(pw: string): number {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;
  if (pw.length >= 16) score = Math.min(4, score + 1);
  return Math.min(4, score);
}

export function strengthLabel(score: number) {
  return ["Muy débil", "Débil", "Media", "Fuerte", "Excelente"][score];
}

export function strengthColor(score: number) {
  return ["bg-destructive", "bg-destructive", "bg-warning", "bg-success", "bg-success"][score];
}

export function generatePassword(length = 18) {
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  const symbols = "!@#$%^&*()-_=+[]{}";
  const all = lower + upper + digits + symbols;
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  let out = "";
  for (let i = 0; i < length; i++) out += all[arr[i] % all.length];
  return out;
}
