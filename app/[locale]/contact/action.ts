"use server";

import { contactFormSchema, type ContactFormData } from "@/lib/schemas";
import { resend, CLINIC_EMAIL, FROM_EMAIL } from "@/lib/resend";

export async function submitContactForm(data: ContactFormData) {
  const parsed = contactFormSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Invalid form data" };
  }

  // Honeypot check
  if (parsed.data.honeypot) {
    // Silently succeed (it's a bot)
    return { success: true };
  }

  const { name, email, phone, subject, message } = parsed.data;

  const subjectLabels: Record<string, string> = {
    appointment: "Prise de rendez-vous",
    general: "Question générale",
    other: "Autre",
  };

  try {
    // Send to clinic
    await resend.emails.send({
      from: FROM_EMAIL,
      to: CLINIC_EMAIL,
      subject: `[CMIEV] ${subjectLabels[subject]} — ${name}`,
      html: `
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Téléphone :</strong> ${phone || "Non renseigné"}</p>
        <p><strong>Sujet :</strong> ${subjectLabels[subject]}</p>
        <p><strong>Message :</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    // Send confirmation to user
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Confirmation — CMIEV",
      html: `
        <h2>Merci pour votre message</h2>
        <p>Nous avons bien reçu votre demande et vous répondrons dans les plus brefs délais.</p>
        <p>— Centre de Médecine Intégrative des Eaux-Vives</p>
        <p>Rue des Eaux-Vives 3, 1207 Genève</p>
      `,
    });

    return { success: true };
  } catch {
    return { success: false, error: "Failed to send email" };
  }
}
