"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  const crumbs = segments.map((seg, i) => ({
    label: seg.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase()),
    href: "/" + segments.slice(0, i + 1).join("/"),
  }));

  return (
    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
      <Link href="/" className="hover:text-indigo-600 transition">
        Home
      </Link>
      {crumbs.map((crumb, i) => (
        <span key={crumb.href} className="flex items-center gap-2">
          <span className="text-gray-300">/</span>
          {i === crumbs.length - 1 ? (
            <span className="text-gray-800 font-medium">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="hover:text-indigo-600 transition">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
