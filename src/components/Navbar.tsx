import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ThemeToggle";
import {
  Home,
  Droplet,
  UtensilsCrossed,
  Calculator,
  Flame,
  Menu,
} from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

const menu = [
  { href: "/", label: "Início", icon: Home },
  { href: "/imc", label: "IMC", icon: Calculator },
  { href: "/tmb", label: "TMB", icon: Flame },
  { href: "/agua", label: "Água", icon: Droplet },
  { href: "/dieta", label: "Dieta", icon: UtensilsCrossed },
];

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/imc", label: "IMC" },
  { href: "/tmb", label: "TMB" },
  { href: "/agua", label: "Água" },
  { href: "/dieta", label: "Dieta" },
];

export default function Navbar({ active }: { active?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between p-4 w-full bg-white shadow-md dark:bg-verde-escuro border-b border-verde-mais dark:text-white">
      <div className="font-bold text-xl">NutriFácil</div>
      {/* Desktop menu */}
      <ul className="hidden md:flex gap-4">
        {menu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition hover:bg-gray-100 dark:hover:bg-verde-mais/20",
              active === item.href && ""
            )}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </ul>
      <span className="hidden md:flex">
        <ThemeToggle />
      </span>
      {/* Mobile hamburger */}
      <div className="md:hidden">
        <Drawer open={open} onOpenChange={setOpen} direction="right">
          <DrawerTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Menu">
              <Menu className="w-6 h-6" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="p-4">
            <ul className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-700 ${
                      active === link.href
                        ? "bg-green-100 dark:bg-green-800 font-semibold"
                        : ""
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <span className="flex justify-end mt-4">
                <ThemeToggle />
              </span>
            </ul>
          </DrawerContent>
        </Drawer>
      </div>
    </nav>
  );
}
