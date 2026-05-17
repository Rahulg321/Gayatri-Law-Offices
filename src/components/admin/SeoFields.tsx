import type { ReactFormExtendedApi } from "@tanstack/react-form";
import { Field, FieldError, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";

type SeoShape = {
  metaTitle: string;
  metaDescription: string;
  ogImageUrl: string;
};

type SeoFormApi<TFormData extends SeoShape> = Pick<
  ReactFormExtendedApi<
    TFormData,
    // Validator generics — any form with Zod/onBlur validators is accepted
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >,
  "Field"
>;

export function SeoFields<TFormData extends SeoShape>({
  form,
}: {
  form: SeoFormApi<TFormData>;
}) {
  return (
    <fieldset className="border-border space-y-4 rounded-xl border p-4">
      <legend className="px-1 text-sm font-semibold">SEO</legend>
      <form.Field name="metaTitle">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor="admin-meta-title">Meta title</FieldLabel>
              <Input
                id="admin-meta-title"
                name={field.name}
                value={String(field.state.value ?? "")}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value as never)}
                aria-invalid={isInvalid}
                placeholder="Optional — defaults to page title"
              />
              {isInvalid ? (
                <FieldError errors={field.state.meta.errors} />
              ) : null}
            </Field>
          );
        }}
      </form.Field>
      <form.Field name="metaDescription">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor="admin-meta-description">
                Meta description
              </FieldLabel>
              <Textarea
                id="admin-meta-description"
                name={field.name}
                value={String(field.state.value ?? "")}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value as never)}
                aria-invalid={isInvalid}
                rows={3}
                placeholder="Optional — defaults to excerpt or short description"
              />
              {isInvalid ? (
                <FieldError errors={field.state.meta.errors} />
              ) : null}
            </Field>
          );
        }}
      </form.Field>
      <form.Field name="ogImageUrl">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor="admin-og-image">OG image URL</FieldLabel>
              <Input
                id="admin-og-image"
                name={field.name}
                type="url"
                value={String(field.state.value ?? "")}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value as never)}
                aria-invalid={isInvalid}
                placeholder="https://..."
              />
              {isInvalid ? (
                <FieldError errors={field.state.meta.errors} />
              ) : null}
            </Field>
          );
        }}
      </form.Field>
    </fieldset>
  );
}
