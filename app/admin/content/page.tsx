"use client";

import { useEffect, useState, useTransition } from "react";
import {
  getContentBlocks,
  updateContentBlock,
  seedDefaultContent,
} from "./actions";

type ContentBlock = {
  id: string;
  key: string;
  value: string;
  updatedAt: Date;
  updatedBy: string | null;
};

export default function ContentEditorPage() {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [seedMessage, setSeedMessage] = useState<string | null>(null);

  useEffect(() => {
    loadBlocks();
  }, []);

  async function loadBlocks() {
    const data = await getContentBlocks();
    setBlocks(data);
    const values: Record<string, string> = {};
    for (const block of data) {
      values[block.key] = block.value;
    }
    setEditedValues(values);
  }

  // Group blocks by page (first segment of key)
  const grouped = blocks.reduce<Record<string, ContentBlock[]>>(
    (acc, block) => {
      const page = block.key.split(".")[0] ?? "other";
      if (!acc[page]) acc[page] = [];
      acc[page].push(block);
      return acc;
    },
    {}
  );

  function handleSave(key: string) {
    const value = editedValues[key];
    if (value === undefined) return;
    setSavingKey(key);
    startTransition(async () => {
      await updateContentBlock(key, value);
      await loadBlocks();
      setSavingKey(null);
    });
  }

  function handleSeed() {
    startTransition(async () => {
      const result = await seedDefaultContent();
      setSeedMessage(result.message);
      await loadBlocks();
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Content Editor</h1>
        {blocks.length === 0 && (
          <button
            onClick={handleSeed}
            disabled={isPending}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            Seed Default Content
          </button>
        )}
      </div>

      {seedMessage && (
        <p className="mb-4 text-sm text-blue-700 bg-blue-50 px-3 py-2 rounded">
          {seedMessage}
        </p>
      )}

      {blocks.length === 0 && !seedMessage && (
        <p className="text-gray-500">
          No content blocks found. Click &quot;Seed Default Content&quot; to
          create initial entries.
        </p>
      )}

      {Object.entries(grouped)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([page, pageBlocks]) => (
          <div key={page} className="mb-8">
            <h2 className="text-lg font-semibold mb-3 capitalize text-gray-700">
              {page}
            </h2>
            <div className="space-y-4">
              {pageBlocks
                .sort((a, b) => a.key.localeCompare(b.key))
                .map((block) => (
                  <div
                    key={block.key}
                    className="bg-white border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-600">
                        {block.key}
                      </label>
                      <span className="text-xs text-gray-400">
                        Updated:{" "}
                        {new Date(block.updatedAt).toLocaleString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <textarea
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-y min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={editedValues[block.key] ?? ""}
                      onChange={(e) =>
                        setEditedValues((prev) => ({
                          ...prev,
                          [block.key]: e.target.value,
                        }))
                      }
                    />
                    <div className="flex items-center justify-end mt-2 gap-2">
                      {editedValues[block.key] !== block.value && (
                        <span className="text-xs text-amber-600">
                          Unsaved changes
                        </span>
                      )}
                      <button
                        onClick={() => handleSave(block.key)}
                        disabled={
                          savingKey === block.key ||
                          editedValues[block.key] === block.value
                        }
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {savingKey === block.key ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
    </div>
  );
}
