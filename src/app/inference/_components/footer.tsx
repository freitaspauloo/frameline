export function InferenceFooter() {
  return (
    <footer className="border-border border-t">
      <div className="mx-auto w-full max-w-7xl px-6 py-10">
        <p className="text-muted-foreground text-xs">
          Blocks vendored from the shadcn chat registry, the Vercel AI Elements
          registry and the two zero-dependency inference.sh blocks. Nothing on
          this route calls a model, a gateway or an API.
        </p>
      </div>
    </footer>
  );
}
