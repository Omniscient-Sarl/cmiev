import { getAccessRequests, approveRequest, rejectRequest } from "./actions";

export default async function AccessRequestsPage() {
  const requests = await getAccessRequests();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 md:text-3xl">Demandes d&apos;acces</h1>

      {requests.length === 0 ? (
        <p className="text-gray-500">Aucune demande d&apos;acces pour le moment.</p>
      ) : (
        <>
          {/* Mobile card layout */}
          <div className="space-y-3 md:hidden">
            {requests.map((req) => (
              <div
                key={req.id}
                className="rounded-lg border border-gray-200 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-gray-900">
                      {req.name || "\u2014"}
                    </p>
                    <p className="mt-0.5 truncate text-sm text-gray-500">
                      {req.email}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {req.createdAt.toLocaleDateString("fr-CH", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <StatusBadge status={req.status} />
                </div>
                {req.status === "pending" && (
                  <div className="mt-3 flex gap-2">
                    <form
                      action={async () => {
                        "use server";
                        await approveRequest(req.id);
                      }}
                      className="flex-1"
                    >
                      <button
                        type="submit"
                        className="w-full rounded bg-green-600 px-3 py-2.5 text-sm font-medium text-white hover:bg-green-700 transition-colors min-h-[44px]"
                      >
                        Approuver
                      </button>
                    </form>
                    <form
                      action={async () => {
                        "use server";
                        await rejectRequest(req.id);
                      }}
                      className="flex-1"
                    >
                      <button
                        type="submit"
                        className="w-full rounded bg-red-600 px-3 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition-colors min-h-[44px]"
                      >
                        Rejeter
                      </button>
                    </form>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop table layout */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">
                    Nom
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">
                    Email
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">
                    Date
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">
                    Statut
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id} className="border-b border-gray-100">
                    <td className="px-4 py-3 text-sm">{req.name || "\u2014"}</td>
                    <td className="px-4 py-3 text-sm">{req.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {req.createdAt.toLocaleDateString("fr-CH", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {req.status === "pending" && (
                        <div className="flex gap-2">
                          <form
                            action={async () => {
                              "use server";
                              await approveRequest(req.id);
                            }}
                          >
                            <button
                              type="submit"
                              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                            >
                              Approuver
                            </button>
                          </form>
                          <form
                            action={async () => {
                              "use server";
                              await rejectRequest(req.id);
                            }}
                          >
                            <button
                              type="submit"
                              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            >
                              Rejeter
                            </button>
                          </form>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  const labels: Record<string, string> = {
    pending: "En attente",
    approved: "Approuve",
    rejected: "Refuse",
  };

  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] ?? "bg-gray-100 text-gray-800"}`}
    >
      {labels[status] ?? status}
    </span>
  );
}
