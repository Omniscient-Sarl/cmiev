import { Resend } from "resend";

let _resend: Resend | null = null;

function getResend() {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

export const resend = new Proxy({} as Resend, {
  get(_, prop: string) {
    return getResend()[prop as keyof Resend];
  },
});

export const CLINIC_EMAIL = process.env.CLINIC_EMAIL ?? "contact@cmiev.ch";
export const FROM_EMAIL = process.env.FROM_EMAIL ?? "CMIEV <noreply@cmiev.ch>";
