import type { ReactFormExtendedApi } from "@tanstack/react-form";
import { AssetUrlPreview } from "#/components/admin/AssetUrlPreview";
import { Field, FieldError, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";

type SeoShape = {
  metaTitle: string;
  metaDescription: string;
  ogImageUrl: string;
  canonicalUrl?: string;
  twitterCard?: string;
};

type SeoFormApi<TFormData extends SeoShape> = Pick<
  ReactFormExtendedApi<
    TFormData,
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

type SeoFieldsProps<TFormData extends SeoShape> = {
  form: SeoFormApi<TFormData>;
  showCanonical?: boolean;
  showTwitterCard?: boolean;
  showOgImage?: boolean;
};

export function SeoFields<TFormData extends SeoShape>({
  form,
  showCanonical = false,
  showTwitterCard = false,
  showOgImage = true,
}: SeoFieldsProps<TFormData>) {
  return (
    <fieldset className="border-border space-y-4 rounded-xl border p-4">
      <legend className="px-1 text-sm font-semibold">SEO & social</legend>
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
                placeholder="Optional — ~150–160 characters for search & social"
              />
              {isInvalid ? (
                <FieldError errors={field.state.meta.errors} />
              ) : null}
            </Field>
          );
        }}
      </form.Field>
      {showOgImage ? (
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
                  placeholder="https://… (1200×675+ recommended)"
                />
                {String(field.state.value ?? "").trim() ? (
                  <AssetUrlPreview
                    url={String(field.state.value ?? "")}
                    className="mt-2"
                  />
                ) : null}
                {isInvalid ? (
                  <FieldError errors={field.state.meta.errors} />
                ) : null}
              </Field>
            );
          }}
        </form.Field>
      ) : null}
      {showCanonical ? (
        <form.Field name="canonicalUrl">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor="admin-canonical">Canonical URL</FieldLabel>
                <Input
                  id="admin-canonical"
                  name={field.name}
                  type="url"
                  value={String(field.state.value ?? "")}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value as never)}
                  aria-invalid={isInvalid}
                  placeholder="Optional — prevents duplicate content issues"
                />
                {isInvalid ? (
                  <FieldError errors={field.state.meta.errors} />
                ) : null}
              </Field>
            );
          }}
        </form.Field>
      ) : null}
      {showTwitterCard ? (
        <form.Field name="twitterCard">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel>Twitter card</FieldLabel>
                <Select
                  value={String(field.state.value ?? "summary_large_image")}
                  onValueChange={(v) => field.handleChange(v as never)}
                >
                  <SelectTrigger className="w-full max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summary_large_image">
                      Large image summary
                    </SelectItem>
                    <SelectItem value="summary">Summary</SelectItem>
                  </SelectContent>
                </Select>
                {isInvalid ? (
                  <FieldError errors={field.state.meta.errors} />
                ) : null}
              </Field>
            );
          }}
        </form.Field>
      ) : null}
    </fieldset>
  );
}
