"use client";

import { useTransition } from "react";
import { approveRequest, rejectRequest } from "./access-requests/actions";

export function AccessRequestActions({ requestId }: { requestId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex shrink-0 gap-2">
      <button
        disabled={isPending}
        onClick={() => startTransition(() => approveRequest(requestId))}
        className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 transition-colors hover:bg-green-100 disabled:opacity-50"
      >
        Approve
      </button>
      <button
        disabled={isPending}
        onClick={() => startTransition(() => rejectRequest(requestId))}
        className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  );
}
