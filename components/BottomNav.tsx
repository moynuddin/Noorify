"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BarChart3,
  BookHeart,
  BookOpen,
  User,
  Compass,
} from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Tasbih", icon: Home },
    { href: "/quran", label: "Quran", icon: BookOpen },
    { href: "/qibla", label: "Qibla", icon: Compass },
    { href: "/analytics", label: "Stats", icon: BarChart3 },
    { href: "/duas", label: "Duas", icon: BookHeart },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card-bg/85 backdrop-blur-xl border-t border-card-border pb-[env(safe-area-inset-bottom)] overflow-x-auto hide-scrollbar">
      <div className="max-w-md md:max-w-4xl mx-auto flex sm:grid sm:grid-cols-6 h-16 md:h-20 min-w-max sm:min-w-0 transition-all duration-300 px-2 sm:px-0">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center gap-1 min-w-[72px] sm:min-w-0 transition-colors duration-200 ${
                isActive
                  ? "text-brand-500"
                  : "text-foreground/60 hover:text-foreground/80"
              }`}
            >
              <Icon
                size={24}
                strokeWidth={isActive ? 2.5 : 2}
                className="md:w-7 md:h-7"
              />
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
