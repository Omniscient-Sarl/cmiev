import Link from "next/link";
import { db } from "@/lib/db";
import { practitioners, accessRequests } from "@/lib/db/schema";
import { eq, count } from "drizzle-orm";

export default async function AdminDashboard() {
  const [practitionerCount] = await db.select({ count: count() }).from(practitioners);
  const [pendingCount] = await db.select({ count: count() }).from(accessRequests).where(eq(accessRequests.status, "pending"));

  const cards = [
    { title: "Practitioners", count: practitionerCount.count, href: "/admin/practitioners", description: "Manage practitioner profiles" },
    { title: "Content", count: null, href: "/admin/content", description: "Edit site text blocks" },
    { title: "Access Requests", count: pendingCount.count, href: "/admin/access-requests", description: "Review signup requests" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">Welcome to the CMIEV admin dashboard.</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">{card.title}</h2>
              {card.count !== null && (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  {card.count}
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-500">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
