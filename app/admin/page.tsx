import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { practitioners, accessRequests, siteContent } from "@/lib/db/schema";
import { eq, count, desc, asc } from "drizzle-orm";
import { AccessRequestActions } from "./AccessRequestActions";

export default async function AdminDashboard() {
  const topPractitioners = await db
    .select()
    .from(practitioners)
    .orderBy(asc(practitioners.order))
    .limit(5);

  const pendingRequests = await db
    .select()
    .from(accessRequests)
    .where(eq(accessRequests.status, "pending"))
    .orderBy(desc(accessRequests.createdAt));

  const [contentCount] = await db
    .select({ count: count() })
    .from(siteContent);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="mt-2 text-muted-foreground">
          Bienvenue sur le tableau de bord administrateur du CMIEV.
        </p>
      </div>

      {/* Practitioners section */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Praticiens
          </h2>
          <Link
            href="/admin/practitioners"
            className="text-sm font-medium text-primary hover:underline"
          >
            Voir tout →
          </Link>
        </div>

        <div className="mt-4 divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white shadow-sm">
          {topPractitioners.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>Aucun praticien pour le moment.</p>
              <Link
                href="/admin/practitioners/new"
                className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
              >
                Ajouter votre premier praticien →
              </Link>
            </div>
          ) : (
            topPractitioners.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-4 px-4 py-3"
              >
                {/* Photo thumbnail */}
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-100">
                  {p.photoUrl ? (
                    <Image
                      src={p.photoUrl}
                      alt={p.nameFr}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-400">
                      {p.nameFr
                        .split(" ")
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                  )}
                </div>

                {/* Name & title */}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-gray-900">
                    {p.nameFr}
                  </p>
                  <p className="truncate text-sm text-gray-500">
                    {p.titleFr}
                  </p>
                </div>

                {/* Edit button */}
                <Link
                  href={`/admin/practitioners/${p.id}`}
                  className="shrink-0 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Modifier
                </Link>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Access Requests section */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Demandes d&apos;accès
          </h2>
          <Link
            href="/admin/access-requests"
            className="text-sm font-medium text-primary hover:underline"
          >
            Voir tout →
          </Link>
        </div>

        <div className="mt-4 rounded-xl border border-gray-200 bg-white shadow-sm">
          {pendingRequests.length === 0 ? (
            <div className="flex items-center gap-3 p-6 text-gray-500">
              <svg
                className="h-5 w-5 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <span className="text-sm">
                Aucune demande d&apos;accès en attente — tout est à jour !
              </span>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between gap-4 px-4 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-gray-900">
                      {req.name || "Unknown"}
                    </p>
                    <p className="truncate text-sm text-gray-500">
                      {req.email}
                    </p>
                  </div>
                  <AccessRequestActions requestId={req.id} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Content blocks section */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Blocs de contenu
          </h2>
          <Link
            href="/admin/pages/accueil"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
          >
            Modifier les pages →
          </Link>
        </div>

        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </span>
            <div>
              <p className="font-medium text-gray-900">
                {contentCount.count} blocs de contenu
              </p>
              <p className="text-sm text-gray-500">
                Texte modifiable sur toutes les pages du site
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
