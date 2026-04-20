"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  BarChart3,
  BookHeart,
  BookOpen,
  User,
  Compass,
  GraduationCap,
  Clock,
  Users,
  MoreHorizontal,
  Settings,
  X,
} from "lucide-react";

// ─── All features ─────────────────────────────────────────────────────────────
// To add a new feature, just append to MORE_ITEMS. The bottom nav never changes.

const PRIMARY_ITEMS = [
  { href: "/", label: "Tasbih", icon: Home },
  { href: "/quran", label: "Quran", icon: BookOpen },
  { href: "/prayers", label: "Prayers", icon: Clock },
  { href: "/qibla", label: "Qibla", icon: Compass },
] as const;

const MORE_ITEMS = [
  {
    href: "/analytics",
    label: "Stats",
    icon: BarChart3,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    href: "/duas",
    label: "Duas",
    icon: BookHeart,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    href: "/prophets",
    label: "Prophets",
    icon: Users,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    href: "/learn",
    label: "Learn",
    icon: GraduationCap,
    color: "text-sky-500",
    bg: "bg-sky-500/10",
  },
  {
    href: "/profile",
    label: "Profile",
    icon: User,
    color: "text-brand-500",
    bg: "bg-brand-500/10",
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
    color: "text-slate-500",
    bg: "bg-slate-500/10",
  },
] as const;

// ─── More Drawer ──────────────────────────────────────────────────────────────

function MoreDrawer({
  open,
  onClose,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-3xl border-t border-card-border pb-[calc(env(safe-area-inset-bottom)+4rem)] md:pb-[calc(env(safe-area-inset-bottom)+5rem)]"
          >
            {/* Handle + header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-5">
              <div>
                <div className="w-10 h-1 rounded-full bg-card-border mx-auto mb-4" />
                <p className="text-base font-bold text-foreground">More</p>
                <p className="text-xs text-foreground/40">All features</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-card-bg border border-card-border flex items-center justify-center"
              >
                <X size={14} className="text-foreground/50" />
              </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-3 gap-3 px-5 pb-2">
              {MORE_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-150 active:scale-95 ${
                      isActive
                        ? "border-brand-500/40 bg-brand-500/8"
                        : "border-card-border bg-card-bg"
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center`}
                    >
                      <Icon
                        size={22}
                        className={item.color}
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                    </div>
                    <span
                      className={`text-xs font-semibold ${isActive ? "text-brand-500" : "text-foreground/70"}`}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Bottom Nav ───────────────────────────────────────────────────────────────

export function BottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  // If the active route is in MORE_ITEMS, highlight the More button
  const moreIsActive =
    !moreOpen && MORE_ITEMS.some((item) => item.href === pathname);

  return (
    <>
      <MoreDrawer
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        pathname={pathname}
      />

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card-bg/85 backdrop-blur-xl border-t border-card-border pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-md md:max-w-2xl mx-auto flex h-16 md:h-20 px-2">
          {/* Primary items */}
          {PRIMARY_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors duration-200 ${
                  isActive
                    ? "text-brand-500"
                    : "text-foreground/60 hover:text-foreground/80"
                }`}
              >
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 2}
                  className="md:w-6 md:h-6"
                />
                <span className="text-[10px] md:text-xs font-medium tracking-wide">
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* More button */}
          <button
            onClick={() => setMoreOpen((o) => !o)}
            className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors duration-200 ${
              moreIsActive || moreOpen
                ? "text-brand-500"
                : "text-foreground/60 hover:text-foreground/80"
            }`}
          >
            <MoreHorizontal
              size={22}
              strokeWidth={moreIsActive || moreOpen ? 2.5 : 2}
              className="md:w-6 md:h-6"
            />
            <span className="text-[10px] md:text-xs font-medium tracking-wide">
              More
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
