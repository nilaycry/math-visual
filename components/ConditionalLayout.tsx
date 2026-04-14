"use client";

import { usePathname } from "next/navigation";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (isHome) {
    // Homepage manages its own layout entirely
    return <main>{children}</main>;
  }

  return (
    <>
      <main className="pt-16 min-h-screen">{children}</main>
      <footer className="border-t border-border/50 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground">
            built with ♥ — nilay
          </p>
        </div>
      </footer>
    </>
  );
}
