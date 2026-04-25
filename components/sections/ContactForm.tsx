"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, type ContactFormData } from "@/lib/schemas";
import { submitContactForm } from "@/app/[locale]/contact/action";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PractitionerOption {
  slug: string;
  label: string;
}

interface PhoneOnlyPractitioner {
  slug: string;
  name: string;
  phone: string;
}

interface ContactFormProps {
  practitioners: PractitionerOption[];
  phoneOnlyPractitioners?: PhoneOnlyPractitioner[];
  locale?: string;
  dict: {
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    practitionerLabel: string;
    practitionerPlaceholder: string;
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

export function ContactForm({ practitioners, phoneOnlyPractitioners = [], locale = "fr", dict }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [selectedSlug, setSelectedSlug] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      practitionerSlug: "",
      message: "",
      honeypot: "",
    },
  });

  async function onSubmit(data: ContactFormData) {
    setStatus("sending");
    const result = await submitContactForm(data);
    if (result.success) {
      setStatus("success");
      reset();
    } else {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg bg-primary/10 p-8 text-center">
        <h3 className="font-heading text-2xl font-bold text-primary">{dict.successTitle}</h3>
        <p className="mt-2 text-muted-foreground">{dict.successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {/* Honeypot */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="honeypot">Do not fill this</label>
        <input id="honeypot" type="text" tabIndex={-1} autoComplete="off" {...register("honeypot")} />
      </div>

      <div>
        <Label htmlFor="name">{dict.nameLabel}</Label>
        <Input
          id="name"
          placeholder={dict.namePlaceholder}
          {...register("name")}
          aria-invalid={!!errors.name}
          className="mt-1.5"
        />
        {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="email">{dict.emailLabel}</Label>
        <Input
          id="email"
          type="email"
          placeholder={dict.emailPlaceholder}
          {...register("email")}
          aria-invalid={!!errors.email}
          className="mt-1.5"
        />
        {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>}
      </div>

      <div>
        <Label htmlFor="phone">{dict.phoneLabel}</Label>
        <Input
          id="phone"
          type="tel"
          placeholder={dict.phonePlaceholder}
          {...register("phone")}
          className="mt-1.5"
        />
      </div>

      <div>
        <Label htmlFor="practitioner">{dict.practitionerLabel}</Label>
        <Select onValueChange={(value: string | null) => { if (value) { setValue("practitionerSlug", value); setSelectedSlug(value); } }}>
          <SelectTrigger id="practitioner" className="mt-1.5" aria-invalid={!!errors.practitionerSlug}>
            <SelectValue placeholder={dict.practitionerPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            {practitioners.map((p) => (
              <SelectItem key={p.slug} value={p.slug}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.practitionerSlug && <p className="mt-1 text-sm text-destructive">{errors.practitionerSlug.message}</p>}
      </div>

      {(() => {
        const phoneOnly = phoneOnlyPractitioners.find((p) => p.slug === selectedSlug);
        if (phoneOnly) {
          return (
            <div className="rounded-2xl bg-[#f5f0e8] p-8 text-center">
              <p className="text-muted-foreground">
                {locale === "fr"
                  ? "Ce praticien préfère être contacté directement par téléphone."
                  : "This practitioner prefers to be contacted directly by phone."}
              </p>
              <a
                href={`tel:${phoneOnly.phone.replace(/\s/g, "")}`}
                className="mt-4 inline-flex items-center gap-3 rounded-xl bg-accent px-8 py-4 text-lg font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-accent/30 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                {phoneOnly.phone}
              </a>
            </div>
          );
        }
        return null;
      })()}

      {!phoneOnlyPractitioners.some((p) => p.slug === selectedSlug) && (
        <>
          <div>
            <Label htmlFor="message">{dict.messageLabel}</Label>
            <Textarea
              id="message"
              placeholder={dict.messagePlaceholder}
              rows={5}
              {...register("message")}
              aria-invalid={!!errors.message}
              className="mt-1.5"
            />
            {errors.message && <p className="mt-1 text-sm text-destructive">{errors.message.message}</p>}
          </div>

          {status === "error" && (
            <div className="rounded-lg bg-destructive/10 p-4">
              <p className="text-sm font-medium text-destructive">{dict.errorTitle}</p>
              <p className="text-sm text-destructive/80">{dict.errorMessage}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={status === "sending"}
            className="w-full bg-accent text-accent-foreground hover:bg-warm-dark focus-visible:ring-2 focus-visible:ring-ring"
          >
            {status === "sending" ? dict.sending : dict.submit}
          </Button>
        </>
      )}
    </form>
  );
}
