import Link from "next/link";
import { db } from "@/lib/db";
import { practitioners } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { VisibilityToggle } from "./visibility-toggle";

export default async function PractitionersPage() {
  const allPractitioners = await db
    .select()
    .from(practitioners)
    .orderBy(asc(practitioners.order));

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">Praticiens</h1>
        <Link
          href="/admin/practitioners/new"
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors min-h-[44px]"
        >
          + Ajouter un praticien
        </Link>
      </div>

      {allPractitioners.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-500">
          Aucun praticien. Ajoutez-en un pour commencer.
        </div>
      )}

      {/* Mobile card layout */}
      <div className="space-y-3 md:hidden">
        {allPractitioners.map((p) => (
          <div
            key={p.id}
            className="rounded-lg border border-gray-200 bg-white p-4"
          >
            <div className="flex items-center gap-3">
              {p.photoUrl ? (
                <img
                  src={p.photoUrl}
                  alt={p.nameFr}
                  className="h-12 w-12 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-xs text-gray-500 shrink-0">
                  N/A
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-gray-900">{p.nameFr}</p>
                <p className="truncate text-sm text-gray-500">{p.titleFr}</p>
              </div>
              <VisibilityToggle id={p.id} visible={p.visible} />
            </div>
            {p.phone && (
              <p className="mt-2 text-sm text-gray-500">{p.phone}</p>
            )}
            <Link
              href={`/admin/practitioners/${p.id}`}
              className="mt-3 flex w-full items-center justify-center rounded-md bg-gray-100 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors min-h-[44px]"
            >
              Modifier
            </Link>
          </div>
        ))}
      </div>

      {/* Desktop table layout */}
      {allPractitioners.length > 0 && (
        <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Photo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Nom (FR)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Titre (FR)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Telephone
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Ordre
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Visible
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {allPractitioners.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {p.photoUrl ? (
                      <img
                        src={p.photoUrl}
                        alt={p.nameFr}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-xs text-gray-500">
                        N/A
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {p.nameFr}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {p.titleFr}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {p.phone || "\u2014"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.order}</td>
                  <td className="px-4 py-3">
                    <VisibilityToggle id={p.id} visible={p.visible} />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/practitioners/${p.id}`}
                      className="inline-flex items-center rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      Modifier
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
