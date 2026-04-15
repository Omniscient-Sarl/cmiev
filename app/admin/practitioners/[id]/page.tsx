"use client";

import { useEffect, useState, useTransition, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getPractitioner,
  updatePractitioner,
  deletePractitioner,
} from "../actions";
import { useUploadThing } from "@/lib/uploadthing";

const LANGUAGE_OPTIONS = [
  { code: "fr", label: "Français" },
  { code: "en", label: "Anglais" },
  { code: "de", label: "Allemand" },
  { code: "it", label: "Italien" },
  { code: "es", label: "Espagnol" },
  { code: "pt", label: "Portugais" },
  { code: "ar", label: "Arabe" },
  { code: "ru", label: "Russe" },
  { code: "zh", label: "Chinois" },
  { code: "ja", label: "Japonais" },
];

type Practitioner = Awaited<ReturnType<typeof getPractitioner>>;

export default function EditPractitionerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [practitioner, setPractitioner] = useState<Practitioner | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string>("");

  const { startUpload, isUploading } = useUploadThing("practitionerPhoto");

  useEffect(() => {
    getPractitioner(id).then((data) => {
      setPractitioner(data);
      if (data?.photoUrl) {
        setPhotoUrl(data.photoUrl);
        setPhotoPreview(data.photoUrl);
      }
      setLoading(false);
    });
  }, [id]);

  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    let finalPhotoUrl = photoUrl;

    if (photoFile) {
      const res = await startUpload([photoFile]);
      if (res?.[0]) {
        finalPhotoUrl = res[0].ufsUrl;
        setPhotoUrl(finalPhotoUrl);
      }
    }

    const formData = new FormData(form);
    formData.set("photoUrl", finalPhotoUrl);

    startTransition(async () => {
      await updatePractitioner(id, formData);
      router.push("/admin/practitioners");
    });
  }

  async function handleDelete() {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce praticien ? Cette action est irréversible.")) {
      return;
    }
    startTransition(async () => {
      await deletePractitioner(id);
      router.push("/admin/practitioners");
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">Chargement...</p>
      </div>
    );
  }

  if (!practitioner) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-gray-500">Praticien introuvable.</p>
        <Link href="/admin/practitioners" className="text-blue-600 hover:underline">
          Retour à la liste
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/practitioners"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            &larr; Retour
          </Link>
          <h1 className="text-2xl font-bold">Modifier le praticien</h1>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          Supprimer
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 rounded-lg border border-gray-200 bg-white p-6">
        {/* Photo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
          <div className="flex items-center gap-4">
            {photoPreview && (
              <img
                src={photoPreview}
                alt="Preview"
                className="h-20 w-20 rounded-full object-cover border border-gray-200"
              />
            )}
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="text-sm text-gray-600"
              />
              {isUploading && (
                <p className="mt-1 text-xs text-blue-600">Téléchargement...</p>
              )}
            </div>
          </div>
        </div>

        {/* Names */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="nameFr" className="block text-sm font-medium text-gray-700 mb-1">
              Nom (FR)
            </label>
            <input
              id="nameFr"
              name="nameFr"
              type="text"
              required
              defaultValue={practitioner.nameFr}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="nameEn" className="block text-sm font-medium text-gray-700 mb-1">
              Nom (EN)
            </label>
            <input
              id="nameEn"
              name="nameEn"
              type="text"
              required
              defaultValue={practitioner.nameEn}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Titles */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="titleFr" className="block text-sm font-medium text-gray-700 mb-1">
              Titre (FR)
            </label>
            <input
              id="titleFr"
              name="titleFr"
              type="text"
              required
              defaultValue={practitioner.titleFr}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="titleEn" className="block text-sm font-medium text-gray-700 mb-1">
              Titre (EN)
            </label>
            <input
              id="titleEn"
              name="titleEn"
              type="text"
              required
              defaultValue={practitioner.titleEn}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Bios */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="bioFr" className="block text-sm font-medium text-gray-700 mb-1">
              Bio (FR)
            </label>
            <textarea
              id="bioFr"
              name="bioFr"
              rows={5}
              defaultValue={practitioner.bioFr ?? ""}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="bioEn" className="block text-sm font-medium text-gray-700 mb-1">
              Bio (EN)
            </label>
            <textarea
              id="bioEn"
              name="bioEn"
              rows={5}
              defaultValue={practitioner.bioEn ?? ""}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Specialties */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="specialtiesFr" className="block text-sm font-medium text-gray-700 mb-1">
              Spécialités (FR)
            </label>
            <input
              id="specialtiesFr"
              name="specialtiesFr"
              type="text"
              defaultValue={practitioner.specialtiesFr.join(", ")}
              placeholder="Valeurs séparées par des virgules"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-400">Séparez les valeurs par des virgules</p>
          </div>
          <div>
            <label htmlFor="specialtiesEn" className="block text-sm font-medium text-gray-700 mb-1">
              Spécialités (EN)
            </label>
            <input
              id="specialtiesEn"
              name="specialtiesEn"
              type="text"
              defaultValue={practitioner.specialtiesEn.join(", ")}
              placeholder="Valeurs séparées par des virgules"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-400">Séparez les valeurs par des virgules</p>
          </div>
        </div>

        {/* Conditions */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="conditionsFr" className="block text-sm font-medium text-gray-700 mb-1">
              Pathologies (FR)
            </label>
            <input
              id="conditionsFr"
              name="conditionsFr"
              type="text"
              defaultValue={practitioner.conditionsFr.join(", ")}
              placeholder="Valeurs séparées par des virgules"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-400">Séparez les valeurs par des virgules</p>
          </div>
          <div>
            <label htmlFor="conditionsEn" className="block text-sm font-medium text-gray-700 mb-1">
              Pathologies (EN)
            </label>
            <input
              id="conditionsEn"
              name="conditionsEn"
              type="text"
              defaultValue={practitioner.conditionsEn.join(", ")}
              placeholder="Valeurs séparées par des virgules"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-400">Séparez les valeurs par des virgules</p>
          </div>
        </div>

        {/* Spoken Languages */}
        <div>
          <p className="block text-sm font-medium text-gray-700 mb-2">
            Langues parlées
          </p>
          <div className="flex flex-wrap gap-3">
            {LANGUAGE_OPTIONS.map(({ code, label }) => (
              <label key={code} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="spokenLanguages"
                  value={code}
                  defaultChecked={practitioner.spokenLanguages?.includes(code) ?? false}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              defaultValue={practitioner.phone ?? ""}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={practitioner.email ?? ""}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Slug, Order, Visible */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
              Slug
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              required
              defaultValue={practitioner.slug}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">
              Ordre d&apos;affichage
            </label>
            <input
              id="order"
              name="order"
              type="number"
              defaultValue={practitioner.order}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="visible" className="block text-sm font-medium text-gray-700 mb-1">
              Visible
            </label>
            <select
              id="visible"
              name="visible"
              defaultValue={practitioner.visible ? "true" : "false"}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="true">Oui</option>
              <option value="false">Non</option>
            </select>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end border-t border-gray-200 pt-6">
          <button
            type="submit"
            disabled={isPending || isUploading}
            className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isPending ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
}
