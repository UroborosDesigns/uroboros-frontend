export function SiteFooter() {
  return (
    <footer className="border-t mt-16">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Uroboros. Hecho a mano, con cariño.</p>
      </div>
    </footer>
  );
}
