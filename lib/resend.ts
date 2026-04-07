import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const CLINIC_EMAIL = process.env.CLINIC_EMAIL ?? "contact@cmiev.ch";
export const FROM_EMAIL = process.env.FROM_EMAIL ?? "CMIEV <noreply@cmiev.ch>";
