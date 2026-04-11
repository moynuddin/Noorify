"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export function AuthButton() {
  const { user, loading } = useAuthStore();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="w-9 h-9 rounded-full bg-foreground/10 animate-pulse" />
    );
  }

  if (!user) {
    return (
      <Link
        href="/auth"
        className="flex items-center gap-2 bg-brand-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-brand-600 transition-all shadow-sm hover:shadow-md"
      >
        <User size={16} />
        <span className="hidden sm:inline">Sign In</span>
      </Link>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-card-bg/60 backdrop-blur-xl border border-card-border rounded-full pl-1 pr-3 py-1 hover:bg-card-bg/80 transition-all shadow-sm"
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt="Avatar"
            className="w-8 h-8 rounded-full object-cover border-2 border-brand-500/30"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-500">
            <User size={16} />
          </div>
        )}
        <span className="text-sm font-medium max-w-[80px] truncate hidden sm:block">
          {user.displayName || (user.isAnonymous ? "Guest" : "User")}
        </span>
        <motion.div animate={{ rotate: open ? 180 : 0 }}>
          <ChevronDown size={14} className="text-foreground/50" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-52 bg-card-bg/95 backdrop-blur-2xl border border-card-border rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3.5 hover:bg-brand-500/10 transition-colors border-b border-card-border/50"
            >
              <User size={16} className="text-brand-500" />
              <span className="text-sm font-medium">My Profile</span>
            </Link>
            <button
              onClick={() => {
                setOpen(false);
                useAuthStore.getState().logout();
              }}
              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-red-500/10 transition-colors text-red-500"
            >
              <LogOut size={16} />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
