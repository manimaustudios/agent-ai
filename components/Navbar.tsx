import Link from "next/link";

import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  {
    name: "Privacy Policy",
    href: "/privacy-policy",
  },
  {
    name: "Terms of Service",
    href: "/terms-of-service",
  },
  {
    name: "Disclaimer",
    href: "/disclaimer",
  },
];

import Image from "next/image";

function Navbar() {
  return (
    <div className="mx-auto flex w-full max-w-screen-lg justify-between pt-2">
      <Link href="/" className="flex items-center justify-center gap-3">
        <div>
          <Image src="/logo.png" alt="logo" width={50} height={50} />
        </div>
        <span className="text-lg font-semibold text-foreground">
          AITherapistFree
        </span>
      </Link>
      <div className="flex items-center justify-center">
        {navLinks.map((link, i) => (
          <Link
            key={`navLink-${i}`}
            href={link.href}
            className="mr-4 text-sm text-muted-foreground hover:text-primary hover:underline"
          >
            {link.name}
          </Link>
        ))}
        <ThemeToggle />
      </div>
    </div>
  );
}

export default Navbar;
