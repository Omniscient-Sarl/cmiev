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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Practitioners</h1>
        <Link
          href="/admin/practitioners/new"
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          + Add practitioner
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Photo
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Name (FR)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Title (FR)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Phone
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Order
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
            {allPractitioners.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-sm text-gray-500"
                >
                  No practitioners yet. Add one to get started.
                </td>
              </tr>
            )}
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
                  {p.phone || "—"}
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
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
