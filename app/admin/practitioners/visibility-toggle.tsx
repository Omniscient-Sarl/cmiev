"use client";

import { useTransition } from "react";
import { toggleVisibility } from "./actions";

export function VisibilityToggle({
  id,
  visible,
}: {
  id: string;
  visible: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await toggleVisibility(id, !visible);
        })
      }
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 ${
        visible ? "bg-blue-600" : "bg-gray-200"
      }`}
      role="switch"
      aria-checked={visible}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          visible ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}
