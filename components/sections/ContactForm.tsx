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

interface ContactFormProps {
  practitioners: PractitionerOption[];
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

export function ContactForm({ practitioners, dict }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

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
        <Select onValueChange={(value: string | null) => { if (value) setValue("practitionerSlug", value); }}>
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
    </form>
  );
}
