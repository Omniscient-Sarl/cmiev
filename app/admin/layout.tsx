import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata = { title: "Admin — CMIEV" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Check user exists in DB and is approved
  const [user] = await db.select().from(users).where(eq(users.id, userId));

  if (!user) {
    // New user — create pending record
    await db.insert(users).values({ id: userId, email: "", role: "user", status: "pending" }).onConflictDoNothing();
    return (
      <html lang="en">
        <body className="min-h-screen flex items-center justify-center bg-background font-sans antialiased">
          <div className="max-w-md text-center p-8">
            <h1 className="font-heading text-2xl font-bold mb-4">Access Pending</h1>
            <p className="text-muted-foreground">Your access request is pending approval. You will receive an email when your account has been reviewed.</p>
          </div>
        </body>
      </html>
    );
  }

  if (user.status === "pending" || user.status === "rejected") {
    return (
      <html lang="en">
        <body className="min-h-screen flex items-center justify-center bg-background font-sans antialiased">
          <div className="max-w-md text-center p-8">
            <h1 className="font-heading text-2xl font-bold mb-4">
              {user.status === "pending" ? "Access Pending" : "Access Denied"}
            </h1>
            <p className="text-muted-foreground">
              {user.status === "pending"
                ? "Your access request is pending approval. You will receive an email when your account has been reviewed."
                : "Your access request has been denied. Please contact the administrator."}
            </p>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 font-sans antialiased">
        <div className="flex min-h-screen">
          <AdminSidebar isAdmin={user.role === "admin"} />
          <main className="flex-1 overflow-auto">
            <div className="mx-auto max-w-7xl p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
