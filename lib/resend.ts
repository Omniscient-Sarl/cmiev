import { Resend } from "resend";

let _resend: Resend | null = null;

function getResend() {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const resend = new Proxy({} as Resend, {
  get(_, prop) {
    return (getResend() as any)[prop];
  },
});

export const CLINIC_EMAIL = process.env.CLINIC_EMAIL ?? "contact@cmiev.ch";
export const FROM_EMAIL = process.env.FROM_EMAIL ?? "CMIEV <noreply@cmiev.ch>";
