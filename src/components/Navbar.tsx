import Link from "next/link";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ThemeToggle";
import {
  Home,
  Droplet,
  UtensilsCrossed,
  Calculator,
  Flame,
} from "lucide-react";

const menu = [
  { href: "/", label: "Início", icon: Home },
  { href: "/imc", label: "IMC", icon: Calculator },
  { href: "/tmb", label: "TMB", icon: Flame },
  { href: "/agua", label: "Água", icon: Droplet },
  { href: "/dieta", label: "Dieta", icon: UtensilsCrossed },
];

export default function Navbar({ active }: { active?: string }) {
  return (
    <nav className="flex gap-4 py-4 px-8 bg-white shadow-md items-center justify-center sticky top-0 z-50 dark:bg-verde-escuro border-b border-verde-mais dark:text-white">
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
      <span className="">
        <ThemeToggle />
      </span>
    </nav>
  );
}
