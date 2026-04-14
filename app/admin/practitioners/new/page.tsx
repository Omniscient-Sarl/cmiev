"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createPractitioner } from "../actions";
import { useUploadThing } from "@/lib/uploadthing";

export default function NewPractitionerPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const { startUpload, isUploading } = useUploadThing("practitionerPhoto");

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

    let photoUrl = "";

    if (photoFile) {
      const res = await startUpload([photoFile]);
      if (res?.[0]) {
        photoUrl = res[0].ufsUrl;
      }
    }

    const formData = new FormData(form);
    formData.set("photoUrl", photoUrl);

    startTransition(async () => {
      await createPractitioner(formData);
      router.push("/admin/practitioners");
    });
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/admin/practitioners"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          &larr; Back
        </Link>
        <h1 className="text-2xl font-bold">New Practitioner</h1>
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
                <p className="mt-1 text-xs text-blue-600">Uploading...</p>
              )}
            </div>
          </div>
        </div>

        {/* Names */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="nameFr" className="block text-sm font-medium text-gray-700 mb-1">
              Name (FR)
            </label>
            <input
              id="nameFr"
              name="nameFr"
              type="text"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="nameEn" className="block text-sm font-medium text-gray-700 mb-1">
              Name (EN)
            </label>
            <input
              id="nameEn"
              name="nameEn"
              type="text"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Titles */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="titleFr" className="block text-sm font-medium text-gray-700 mb-1">
              Title (FR)
            </label>
            <input
              id="titleFr"
              name="titleFr"
              type="text"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="titleEn" className="block text-sm font-medium text-gray-700 mb-1">
              Title (EN)
            </label>
            <input
              id="titleEn"
              name="titleEn"
              type="text"
              required
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
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Specialties */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="specialtiesFr" className="block text-sm font-medium text-gray-700 mb-1">
              Specialties (FR)
            </label>
            <input
              id="specialtiesFr"
              name="specialtiesFr"
              type="text"
              placeholder="Comma-separated values"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-400">Separate multiple values with commas</p>
          </div>
          <div>
            <label htmlFor="specialtiesEn" className="block text-sm font-medium text-gray-700 mb-1">
              Specialties (EN)
            </label>
            <input
              id="specialtiesEn"
              name="specialtiesEn"
              type="text"
              placeholder="Comma-separated values"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-400">Separate multiple values with commas</p>
          </div>
        </div>

        {/* Conditions */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="conditionsFr" className="block text-sm font-medium text-gray-700 mb-1">
              Conditions (FR)
            </label>
            <input
              id="conditionsFr"
              name="conditionsFr"
              type="text"
              placeholder="Comma-separated values"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-400">Separate multiple values with commas</p>
          </div>
          <div>
            <label htmlFor="conditionsEn" className="block text-sm font-medium text-gray-700 mb-1">
              Conditions (EN)
            </label>
            <input
              id="conditionsEn"
              name="conditionsEn"
              type="text"
              placeholder="Comma-separated values"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-400">Separate multiple values with commas</p>
          </div>
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
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
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">
              Display Order
            </label>
            <input
              id="order"
              name="order"
              type="number"
              defaultValue={0}
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
              defaultValue="true"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
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
            {isPending ? "Creating..." : "Create Practitioner"}
          </button>
        </div>
      </form>
    </div>
  );
}
