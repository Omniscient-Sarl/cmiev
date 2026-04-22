"use server";

import { contactFormSchema, type ContactFormData } from "@/lib/schemas";
import { resend, FROM_EMAIL } from "@/lib/resend";
import { db } from "@/lib/db";
import { practitioners as practitionersTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function submitContactForm(data: ContactFormData) {
  const parsed = contactFormSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Invalid form data" };
  }

  // Honeypot check
  if (parsed.data.honeypot) {
    return { success: true };
  }

  const { name, email, phone, practitionerSlug, message } = parsed.data;

  // Look up practitioner email from DB
  const [practitioner] = await db
    .select({ email: practitionersTable.email, nameFr: practitionersTable.nameFr })
    .from(practitionersTable)
    .where(eq(practitionersTable.slug, practitionerSlug))
    .limit(1);

  if (!practitioner?.email) {
    return { success: false, error: "Practitioner not found" };
  }

  try {
    // Send to practitioner
    await resend.emails.send({
      from: FROM_EMAIL,
      to: practitioner.email,
      subject: `Nouveau message via cmiev.ch — ${practitioner.nameFr}`,
      html: `
        <h2>Nouveau message via cmiev.ch</h2>
        <hr style="border:none;border-top:1px solid #e5e5e5;margin:16px 0" />
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Téléphone :</strong> ${phone || "Non renseigné"}</p>
        <p><strong>Message :</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
        <hr style="border:none;border-top:1px solid #e5e5e5;margin:16px 0" />
        <p style="color:#888;font-size:12px">Envoyé depuis cmiev.ch</p>
      `,
    });

    // Send confirmation to sender
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Votre message a bien été envoyé — CMIEV",
      html: `
        <h2>Bonjour ${name},</h2>
        <p>Votre message a bien été transmis à <strong>${practitioner.nameFr}</strong>.</p>
        <p>Vous recevrez une réponse dans les meilleurs délais.</p>
        <hr style="border:none;border-top:1px solid #e5e5e5;margin:16px 0" />
        <p><strong>CMIEV — Centre de Médecine Intégrative des Eaux-Vives</strong></p>
        <p>Rue des Eaux-Vives 3, 1207 Genève</p>
      `,
    });

    return { success: true };
  } catch {
    return { success: false, error: "Failed to send email" };
  }
}
