"use server";

import { practitionerContactSchema, type PractitionerContactData } from "@/lib/schemas";
import { resend, FROM_EMAIL } from "@/lib/resend";
import { db } from "@/lib/db";
import { practitioners as practitionersTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getPractitionerBySlug } from "@/lib/practitioners";

export async function submitPractitionerContact(data: PractitionerContactData) {
  const parsed = practitionerContactSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Invalid form data" };
  }

  if (parsed.data.honeypot) {
    return { success: true };
  }

  const { name, email, phone, message, practitionerSlug } = parsed.data;

  // Try DB first, fall back to static data
  let practitionerEmail: string | null = null;
  let practitionerName = "";

  const [dbPractitioner] = await db
    .select({ email: practitionersTable.email, nameFr: practitionersTable.nameFr })
    .from(practitionersTable)
    .where(eq(practitionersTable.slug, practitionerSlug))
    .limit(1);

  if (dbPractitioner?.email) {
    practitionerEmail = dbPractitioner.email;
    practitionerName = dbPractitioner.nameFr;
  } else {
    const staticPractitioner = getPractitionerBySlug(practitionerSlug);
    if (staticPractitioner?.email) {
      practitionerEmail = staticPractitioner.email;
      practitionerName = staticPractitioner.name;
    }
  }

  if (!practitionerEmail) {
    return { success: false, error: "Practitioner not found" };
  }

  try {
    // Send to practitioner
    await resend.emails.send({
      from: FROM_EMAIL,
      to: practitionerEmail,
      subject: `[CMIEV] Nouveau message de ${name}`,
      html: `
        <h2>Nouveau message via le site CMIEV</h2>
        <p><strong>De :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Téléphone :</strong> ${phone || "Non renseigné"}</p>
        <p><strong>Message :</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    // Send confirmation to sender
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Confirmation — ${practitionerName}, CMIEV`,
      html: `
        <h2>Merci pour votre message</h2>
        <p>Votre message a été transmis à ${practitionerName}. Vous recevrez une réponse dans les plus brefs délais.</p>
        <p>— Centre de Médecine Intégrative des Eaux-Vives</p>
        <p>Rue des Eaux-Vives 3, 1207 Genève</p>
      `,
    });

    return { success: true };
  } catch {
    return { success: false, error: "Failed to send email" };
  }
}
