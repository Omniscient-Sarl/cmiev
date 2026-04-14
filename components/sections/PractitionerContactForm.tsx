"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { practitionerContactSchema, type PractitionerContactData } from "@/lib/schemas";
import { submitPractitionerContact } from "@/app/[locale]/praticiens/[slug]/contact-action";

interface PractitionerContactFormProps {
  practitionerSlug: string;
  practitionerName: string;
  dict: {
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submit: string;
    sending: string;
    successTitle: string;
    successMessage: string;
    errorTitle: string;
    errorMessage: string;
  };
}

export function PractitionerContactForm({
  practitionerSlug,
  practitionerName,
  dict,
}: PractitionerContactFormProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PractitionerContactData>({
    resolver: zodResolver(practitionerContactSchema),
    defaultValues: { practitionerSlug },
  });

  const onSubmit = async (data: PractitionerContactData) => {
    setStatus("sending");
    const result = await submitPractitionerContact(data);
    if (result.success) {
      setStatus("success");
      reset();
    } else {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl bg-green-50 p-8 text-center">
        <h3 className="font-heading text-xl font-bold text-green-800">{dict.successTitle}</h3>
        <p className="mt-2 text-green-700">{dict.successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <input type="hidden" {...register("practitionerSlug")} />
      <div className="hidden">
        <input {...register("honeypot")} tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">{dict.nameLabel}</label>
          <input
            {...register("name")}
            placeholder={dict.namePlaceholder}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">{dict.emailLabel}</label>
          <input
            {...register("email")}
            type="email"
            placeholder={dict.emailPlaceholder}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">{dict.phoneLabel}</label>
        <input
          {...register("phone")}
          placeholder={dict.phonePlaceholder}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">{dict.messageLabel}</label>
        <textarea
          {...register("message")}
          rows={5}
          placeholder={`${dict.messagePlaceholder} ${practitionerName}`}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
      </div>

      {status === "error" && (
        <div className="rounded-lg bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">{dict.errorTitle}</p>
          <p className="text-sm text-red-700">{dict.errorMessage}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-xl bg-accent px-6 py-4 text-base font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg disabled:opacity-50"
      >
        {status === "sending" ? dict.sending : dict.submit}
      </button>
    </form>
  );
}
