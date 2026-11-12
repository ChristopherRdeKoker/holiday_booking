import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { FieldError } from "@/components/FieldError";
import { guestDetailsSchema } from "@/lib/schemas/guestDetailsSchema";

type GuestDetailsFormProps = {
  maxGuests: number;
  initialGuests: number;
  onConfirm: (details: z.output<typeof guestDetailsSchema>) => void;
};

export function GuestDetailsForm({ maxGuests, initialGuests, onConfirm }: GuestDetailsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<z.input<typeof guestDetailsSchema>, unknown, z.output<typeof guestDetailsSchema>>({
    resolver: zodResolver(guestDetailsSchema),
    defaultValues: { name: "", email: "", guests: String(initialGuests), agree: false },
  });
  const guestOptions = Array.from({ length: maxGuests }, (_, index) => index + 1);

  return (
    <form className="guest-form" aria-labelledby="guest-heading" noValidate onSubmit={handleSubmit(onConfirm)}>
      <h2 id="guest-heading">Your details</h2>
      <div className="field">
        <label htmlFor="name">Full name</label>
        <input id="name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby="err-name" {...register("name")} />
        <FieldError id="err-name" message={errors.name?.message} />
      </div>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby="err-email" {...register("email")} />
        <FieldError id="err-email" message={errors.email?.message} />
      </div>
      <div className="field">
        <label htmlFor="guests">Guests</label>
        <select id="guests" aria-invalid={!!errors.guests} aria-describedby="err-guests" {...register("guests")}>
          {guestOptions.map((count) => (
            <option key={count} value={String(count)}>
              {count} {count === 1 ? "guest" : "guests"}
            </option>
          ))}
        </select>
        <FieldError id="err-guests" message={errors.guests?.message} />
      </div>
      <div className="check-field">
        <input id="agree" type="checkbox" aria-invalid={!!errors.agree} aria-describedby="err-agree" {...register("agree")} />
        <label htmlFor="agree">I understand this is a demo: no real stay is booked and nothing is charged.</label>
      </div>
      <FieldError id="err-agree" message={errors.agree?.message} />
      <button type="submit" className="button button-primary button-block" disabled={!isDirty || isSubmitting}>
        Confirm booking
      </button>
    </form>
  );
}
