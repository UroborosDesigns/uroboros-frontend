import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t mt-16">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-8 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Uroboros. Hecho a mano, con cariño.</p>
        <Link href="/admin/login" className="hover:text-foreground">
          Admin
        </Link>
      </div>
    </footer>
  );
}
