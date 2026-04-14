import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, accessRequests } from "@/lib/db/schema";
import { resend, FROM_EMAIL } from "@/lib/resend";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { type, data } = body;

  if (type === "user.created") {
    const { id, email_addresses, first_name, last_name } = data;
    const email = email_addresses?.[0]?.email_address ?? "";
    const name = [first_name, last_name].filter(Boolean).join(" ");

    // Insert user with pending status
    await db
      .insert(users)
      .values({ id, email, name, role: "user", status: "pending" })
      .onConflictDoNothing();

    // Insert access request
    await db
      .insert(accessRequests)
      .values({ clerkUserId: id, email, name });

    // Send notification email to admin
    await resend.emails.send({
      from: FROM_EMAIL,
      to: "nicholas@omniscient.swiss",
      subject: "CMIEV — New Access Request",
      html: `
        <h2>New Access Request</h2>
        <p>A new user has signed up and is requesting access to the CMIEV admin portal.</p>
        <ul>
          <li><strong>Name:</strong> ${name || "Not provided"}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Clerk ID:</strong> ${id}</li>
        </ul>
        <p>Please review this request in the admin dashboard.</p>
      `,
    });
  }

  return NextResponse.json({ received: true });
}
