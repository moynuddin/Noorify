"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart3, BookHeart, BookOpen, Settings } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Tasbih", icon: Home },
    { href: "/quran", label: "Quran", icon: BookOpen },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/duas", label: "Duas", icon: BookHeart },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card-bg/85 backdrop-blur-xl border-t border-card-border pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-md md:max-w-2xl mx-auto grid grid-cols-5 h-16 md:h-20 transition-all duration-300">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 transition-colors duration-200 ${
                isActive ? "text-brand-500" : "text-foreground/60 hover:text-foreground/80"
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className="md:w-7 md:h-7" />
              <span className="text-[10px] md:text-xs font-medium tracking-wide">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
