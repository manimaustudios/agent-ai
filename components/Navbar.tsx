"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { HiMenuAlt4, HiX } from "react-icons/hi";

import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";

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
  {
    name: "Contact",
    href: "/contact",
  },
];

function Navbar() {
  const [toggle, setToggle] = useState(false);

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
      <div>
        <div className="hidden items-center justify-center md:flex">
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
        <div className="md:hidden">
          <ThemeToggle />
          <Button
            variant="outline"
            size="icon"
            aria-controls="navbar-default"
            aria-expanded={toggle ? "true" : "false"}
            onClick={() => setToggle(!toggle)}
            className="z-20 ml-2"
          >
            <span className="sr-only">Open main menu</span>
            {toggle ? (
              <HiX className="h-5 w-5" />
            ) : (
              <HiMenuAlt4 className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {toggle && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.5 }}
            className="fixed left-0 top-16 z-10 w-full bg-gray-900 md:hidden"
            id="navbar-default"
          >
            <ul className="flex flex-col rounded-lg bg-gray-800 p-4 font-medium">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="block rounded px-3 py-2 text-slate-100 transition-all delay-75 ease-in-out hover:bg-gray-700 hover:text-slate-100 md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-500"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Navbar;
