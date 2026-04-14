import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse e-mail invalide"),
  phone: z.string().optional(),
  subject: z.enum(["appointment", "general", "other"], {
    message: "Veuillez choisir un sujet",
  }),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
  honeypot: z.string().max(0, "Bot detected"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const practitionerContactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10),
  practitionerSlug: z.string(),
  honeypot: z.string().max(0, "Bot detected"),
});

export type PractitionerContactData = z.infer<typeof practitionerContactSchema>;
