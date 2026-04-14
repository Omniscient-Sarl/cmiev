"use server";

import { db } from "@/lib/db";
import { accessRequests, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { resend, FROM_EMAIL } from "@/lib/resend";
import { desc } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function getAccessRequests() {
  return db
    .select()
    .from(accessRequests)
    .orderBy(desc(accessRequests.createdAt));
}

export async function approveRequest(requestId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Get the access request
  const [request] = await db
    .select()
    .from(accessRequests)
    .where(eq(accessRequests.id, requestId));

  if (!request) throw new Error("Request not found");

  // Update access request status
  await db
    .update(accessRequests)
    .set({
      status: "approved",
      reviewedBy: userId,
      reviewedAt: new Date(),
    })
    .where(eq(accessRequests.id, requestId));

  // Update user status
  await db
    .update(users)
    .set({ status: "approved" })
    .where(eq(users.id, request.clerkUserId));

  // Send approval email
  if (request.email) {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: request.email,
      subject: "CMIEV — Access Approved",
      html: `
        <h2>Your access has been approved</h2>
        <p>Hello ${request.name || ""},</p>
        <p>Your access request to the CMIEV admin portal has been approved. You can now sign in and access the platform.</p>
        <p>Best regards,<br/>CMIEV Team</p>
      `,
    });
  }

  revalidatePath("/admin/access-requests");
}

export async function rejectRequest(requestId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Get the access request
  const [request] = await db
    .select()
    .from(accessRequests)
    .where(eq(accessRequests.id, requestId));

  if (!request) throw new Error("Request not found");

  // Update access request status
  await db
    .update(accessRequests)
    .set({
      status: "rejected",
      reviewedBy: userId,
      reviewedAt: new Date(),
    })
    .where(eq(accessRequests.id, requestId));

  // Update user status
  await db
    .update(users)
    .set({ status: "rejected" })
    .where(eq(users.id, request.clerkUserId));

  // Send rejection email
  if (request.email) {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: request.email,
      subject: "CMIEV — Access Request Update",
      html: `
        <h2>Access Request Update</h2>
        <p>Hello ${request.name || ""},</p>
        <p>Your access request to the CMIEV admin portal has been reviewed and unfortunately could not be approved at this time.</p>
        <p>If you believe this is an error, please contact the administrator.</p>
        <p>Best regards,<br/>CMIEV Team</p>
      `,
    });
  }

  revalidatePath("/admin/access-requests");
}
