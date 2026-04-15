"use client";

import { useEffect, useState, useTransition, use } from "react";
import { useRouter } from "next/navigation";
import {
  getContentBlocksByPrefix,
  updateContentBlock,
  getImageBlocks,
  saveImageUrl,
  deleteImageUrl,
} from "./actions";
import { useUploadThing } from "@/lib/uploadthing";

type ContentBlock = {
  id: string;
  key: string;
  value: string;
  updatedAt: Date;
  updatedBy: string | null;
};

/** Map admin page slugs to siteContent key prefixes. */
const PAGE_PREFIX_MAP: Record<string, string> = {
  accueil: "home",
  pilates: "pilates",
  "cours-collectifs": "groupClasses",
  galerie: "gallery",
  contact: "contact",
};

/** Labels for admin page slugs. */
const PAGE_LABELS: Record<string, string> = {
  accueil: "Accueil",
  pilates: "Pilates",
  "cours-collectifs": "Cours collectifs",
  galerie: "Galerie",
  contact: "Contact",
};

/** Image slots per page (key suffix after prefix, label). */
const PAGE_IMAGES: Record<string, { keySuffix: string; label: string }[]> = {
  accueil: [
    { keySuffix: "hero.image", label: "Image hero" },
    { keySuffix: "about.image", label: "Image section À propos" },
    { keySuffix: "quote.image", label: "Image citation" },
    { keySuffix: "gallery.image.1", label: "Galerie 1" },
    { keySuffix: "gallery.image.2", label: "Galerie 2" },
    { keySuffix: "gallery.image.3", label: "Galerie 3" },
    { keySuffix: "gallery.image.4", label: "Galerie 4" },
  ],
  pilates: [
    { keySuffix: "hero.image", label: "Image hero" },
    { keySuffix: "whatIs.image", label: "Image Qu&apos;est-ce que le Pilates" },
    { keySuffix: "sessions.image", label: "Image séances" },
    { keySuffix: "pricing.image", label: "Image tarifs" },
    { keySuffix: "strip.image.1", label: "Bandeau 1" },
    { keySuffix: "strip.image.2", label: "Bandeau 2" },
    { keySuffix: "strip.image.3", label: "Bandeau 3" },
    { keySuffix: "strip.image.4", label: "Bandeau 4" },
    { keySuffix: "strip.image.5", label: "Bandeau 5" },
  ],
  "cours-collectifs": [
    { keySuffix: "hero.image", label: "Image hero" },
    { keySuffix: "intro.image", label: "Image introduction" },
    { keySuffix: "why.image.1", label: "Pourquoi 1" },
    { keySuffix: "why.image.2", label: "Pourquoi 2" },
    { keySuffix: "why.image.3", label: "Pourquoi 3" },
    { keySuffix: "glad.image", label: "Image GLAD" },
  ],
  galerie: [
    { keySuffix: "image.1", label: "Photo 1" },
    { keySuffix: "image.2", label: "Photo 2" },
    { keySuffix: "image.3", label: "Photo 3" },
    { keySuffix: "image.4", label: "Photo 4" },
    { keySuffix: "image.5", label: "Photo 5" },
    { keySuffix: "image.6", label: "Photo 6" },
    { keySuffix: "image.7", label: "Photo 7" },
    { keySuffix: "image.8", label: "Photo 8" },
    { keySuffix: "image.9", label: "Photo 9" },
    { keySuffix: "image.10", label: "Photo 10" },
  ],
  contact: [
    { keySuffix: "hero.image", label: "Image hero" },
  ],
};

export default function PageEditorPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = use(params);
  const router = useRouter();
  const prefix = PAGE_PREFIX_MAP[page] ?? null;

  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // Image state
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const { startUpload } = useUploadThing("pageImage");

  async function loadData() {
    if (!prefix) return;
    const data = await getContentBlocksByPrefix(prefix);
    // Separate text blocks from image blocks
    const textBlocks: ContentBlock[] = [];
    const imgMap: Record<string, string> = {};
    for (const block of data) {
      if (block.key.includes("image")) {
        imgMap[block.key] = block.value;
      } else {
        textBlocks.push(block);
      }
    }
    setBlocks(textBlocks);
    const values: Record<string, string> = {};
    for (const block of textBlocks) {
      values[block.key] = block.value;
    }
    setEditedValues(values);

    // Also load image blocks that might use a different pattern
    const imgBlocks = await getImageBlocks(prefix);
    for (const block of imgBlocks) {
      imgMap[block.key] = block.value;
    }
    setImageUrls(imgMap);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadData(); }, [prefix]);

  function handleSave(key: string) {
    const value = editedValues[key];
    if (value === undefined) return;
    setSavingKey(key);
    startTransition(async () => {
      await updateContentBlock(key, value);
      await loadData();
      setSavingKey(null);
    });
  }

  async function handleImageUpload(fullKey: string, file: File) {
    setUploadingKey(fullKey);
    try {
      const res = await startUpload([file]);
      if (res?.[0]) {
        await saveImageUrl(fullKey, res[0].ufsUrl);
        setImageUrls((prev) => ({ ...prev, [fullKey]: res[0].ufsUrl }));
      }
    } finally {
      setUploadingKey(null);
    }
  }

  async function handleImageDelete(fullKey: string) {
    if (!confirm("Supprimer cette image ?")) return;
    await deleteImageUrl(fullKey);
    setImageUrls((prev) => {
      const next = { ...prev };
      delete next[fullKey];
      return next;
    });
  }

  if (!prefix) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-gray-500">Page introuvable.</p>
        <button
          onClick={() => router.push("/admin")}
          className="text-blue-600 hover:underline"
        >
          Retour au tableau de bord
        </button>
      </div>
    );
  }

  const pageLabel = PAGE_LABELS[page] ?? page;
  const imageSlots = PAGE_IMAGES[page] ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 md:mb-6 md:text-3xl">{pageLabel}</h1>

      {/* Content blocks */}
      {blocks.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">
            Contenu texte
          </h2>
          <div className="space-y-4">
            {blocks
              .sort((a, b) => a.key.localeCompare(b.key))
              .map((block) => (
                <div
                  key={block.key}
                  className="bg-white border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex flex-col gap-1 mb-2 sm:flex-row sm:items-center sm:justify-between">
                    <label className="text-sm font-medium text-gray-600 break-all">
                      {block.key}
                    </label>
                    <span className="text-xs text-gray-400 shrink-0">
                      Modifie :{" "}
                      {new Date(block.updatedAt).toLocaleString("fr-CH", {
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
                        Modifications non enregistrées
                      </span>
                    )}
                    <button
                      onClick={() => handleSave(block.key)}
                      disabled={
                        savingKey === block.key ||
                        editedValues[block.key] === block.value
                      }
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                    >
                      {savingKey === block.key
                        ? "Enregistrement..."
                        : "Enregistrer"}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {blocks.length === 0 && (
        <p className="mb-10 text-sm text-gray-500">
          Aucun bloc de contenu pour cette page.
        </p>
      )}

      {/* Image uploads */}
      {imageSlots.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3 text-gray-700">
            Images
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {imageSlots.map((slot) => {
              const fullKey = `${prefix}.${slot.keySuffix}`;
              const currentUrl = imageUrls[fullKey];
              const isUploading = uploadingKey === fullKey;

              return (
                <div
                  key={fullKey}
                  className="rounded-lg border border-gray-200 bg-white p-4"
                >
                  <p className="mb-3 text-sm font-medium text-gray-700">
                    {slot.label}
                  </p>

                  {/* Preview */}
                  <div className="relative mb-3 aspect-video overflow-hidden rounded-lg bg-gray-100">
                    {currentUrl ? (
                      <img
                        src={currentUrl}
                        alt={slot.label}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                        Aucune image
                      </div>
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <span className="text-sm font-medium text-white">
                          Téléchargement...
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <label className="flex-1 cursor-pointer">
                      <span className="inline-block w-full rounded bg-blue-50 px-3 py-1.5 text-center text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100">
                        {currentUrl ? "Remplacer" : "Ajouter"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploading}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(fullKey, file);
                        }}
                        className="hidden"
                      />
                    </label>
                    {currentUrl && (
                      <button
                        type="button"
                        onClick={() => handleImageDelete(fullKey)}
                        disabled={isUploading}
                        className="rounded bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    {fullKey}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
