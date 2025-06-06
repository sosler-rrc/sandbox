import { encodeBase32LowerCaseNoPadding } from "@oslojs/encoding";

export function generateToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export const dateOffset = (days:number) => (1000 * 60 * 60 * 24 * days);