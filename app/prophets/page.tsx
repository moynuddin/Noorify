"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Users, GitBranch } from "lucide-react";
import {
  PROPHETS,
  MAIN_CHAIN_IDS,
  IBRAHIM_BRANCH_IDS,
  getProphetById,
  type Prophet,
} from "@/constants/prophets";

// ─── Prophet Card ─────────────────────────────────────────────────────────────

function ProphetCard({
  prophet,
  defaultOpen = false,
}: {
  prophet: Prophet;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <motion.div
      layout
      className="bg-card-bg border border-card-border rounded-2xl overflow-hidden"
    >
      {/* Header row */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        {/* Arabic name bubble */}
        <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0">
          <span className="text-lg font-bold text-brand-600 dark:text-brand-400 leading-none">
            {prophet.arabicName.slice(0, 2)}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-foreground text-base leading-tight">
              {prophet.name}
            </span>
            <span className="text-brand-500 text-sm font-semibold">
              {prophet.honorific}
            </span>
          </div>
          <p className="text-xs text-foreground/50 truncate mt-0.5">
            {prophet.title}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="text-right">
            <p className="text-[10px] text-foreground/40 leading-none">Quran</p>
            <p className="text-xs font-bold text-brand-500 leading-tight">
              {prophet.quranicMentions}×
            </p>
          </div>
          {open ? (
            <ChevronUp size={16} className="text-foreground/40" />
          ) : (
            <ChevronDown size={16} className="text-foreground/40" />
          )}
        </div>
      </button>

      {/* Expandable detail */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 border-t border-card-border pt-4">
              {/* Arabic name */}
              <div className="text-center">
                <p
                  className="text-3xl font-bold text-brand-600 dark:text-brand-400"
                  dir="rtl"
                >
                  {prophet.arabicName}
                </p>
                <p className="text-xs text-foreground/40 mt-1">{prophet.era}</p>
              </div>

              {/* Description */}
              <p className="text-sm text-foreground/70 leading-relaxed selectable-text">
                {prophet.description}
              </p>

              {/* Nation sent to */}
              <div className="bg-brand-500/5 border border-brand-500/15 rounded-xl p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-500 mb-1">
                  Sent to
                </p>
                <p className="text-sm text-foreground/80 selectable-text">
                  {prophet.nation}
                </p>
              </div>

              {/* Family Section */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-2">
                  Family
                </p>
                <div className="space-y-2">
                  <FamilyRow label="Father" value={prophet.family.father} />
                  {prophet.family.mother && (
                    <FamilyRow label="Mother" value={prophet.family.mother} />
                  )}
                  {prophet.family.wives && prophet.family.wives.length > 0 && (
                    <FamilyRow
                      label={
                        prophet.family.wives.length === 1 ? "Wife" : "Wives"
                      }
                      value={prophet.family.wives.join(" · ")}
                    />
                  )}
                  {prophet.family.siblings &&
                    prophet.family.siblings.length > 0 && (
                      <FamilyRow
                        label="Siblings"
                        value={prophet.family.siblings.join(" · ")}
                      />
                    )}
                  {prophet.family.sons && prophet.family.sons.length > 0 && (
                    <FamilyRow
                      label="Sons"
                      value={prophet.family.sons.join(" · ")}
                    />
                  )}
                  {prophet.family.daughters &&
                    prophet.family.daughters.length > 0 && (
                      <FamilyRow
                        label="Daughters"
                        value={prophet.family.daughters.join(" · ")}
                      />
                    )}
                  {prophet.family.notable && (
                    <FamilyRow label="Notable" value={prophet.family.notable} />
                  )}
                </div>
              </div>

              {/* Key Events */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-2">
                  Key Events
                </p>
                <ul className="space-y-2">
                  {prophet.keyEvents.map((ev, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-brand-500 font-bold text-sm leading-relaxed shrink-0">
                        {i + 1}.
                      </span>
                      <span className="text-sm text-foreground/70 leading-relaxed selectable-text">
                        {ev}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Lineage note */}
              {prophet.lineageNote && (
                <div className="bg-card-border/50 rounded-xl p-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">
                    Lineage Connection
                  </p>
                  <p className="text-xs text-foreground/60 selectable-text">
                    {prophet.lineageNote}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FamilyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-xs font-semibold text-foreground/40 w-16 shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-xs text-foreground/70 flex-1 leading-relaxed selectable-text">
        {value}
      </span>
    </div>
  );
}

// ─── Tree View ────────────────────────────────────────────────────────────────

function TreeNodeButton({
  prophet,
  isMain,
  onSelect,
}: {
  prophet: Prophet;
  isMain?: boolean;
  onSelect: (p: Prophet) => void;
}) {
  return (
    <button
      onClick={() => onSelect(prophet)}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-150 active:scale-95 ${
        isMain
          ? "bg-brand-500 border-brand-600 text-white shadow-md shadow-brand-500/20"
          : "bg-card-bg border-card-border text-foreground"
      }`}
    >
      <span
        className={`text-base font-bold leading-none ${isMain ? "text-white" : "text-brand-500"}`}
      >
        {prophet.arabicName.slice(0, 2)}
      </span>
      <div className="text-left">
        <p
          className={`text-xs font-bold leading-tight ${isMain ? "text-white" : "text-foreground"}`}
        >
          {prophet.name}
        </p>
        <p
          className={`text-[9px] leading-none ${isMain ? "text-white/70" : "text-foreground/40"}`}
        >
          {prophet.honorific}
        </p>
      </div>
    </button>
  );
}

/** Vertical connector line */
function Connector({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-0.5 h-4 bg-brand-500/30" />
      {label && (
        <span className="text-[9px] text-foreground/30 italic px-2 text-center leading-tight my-0.5">
          {label}
        </span>
      )}
      <div className="w-0.5 h-4 bg-brand-500/30" />
    </div>
  );
}

/** Horizontal fork arrow pointing right */
function BranchLine() {
  return (
    <div className="flex items-center">
      <div className="w-4 h-0.5 bg-brand-300/50" />
      <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-[6px] border-l-brand-300/50" />
    </div>
  );
}

function TreeView({ onSelect }: { onSelect: (p: Prophet) => void }) {
  const mainChain = MAIN_CHAIN_IDS.map((id) => getProphetById(id)!).filter(
    Boolean,
  );

  // Branches off Ibrahim
  const ibrahimBranches = IBRAHIM_BRANCH_IDS.map(
    (id) => getProphetById(id)!,
  ).filter(Boolean);

  // Banu Israil prophets under Ishaq
  const banuIsrailMain = (
    [
      "ishaq",
      "yaqub",
      "yusuf",
      "musa",
      "ayyub",
      "dhul-kifl",
      "dawud",
      "sulayman",
      "zakariyya",
      "yahya",
      "isa",
    ] as const
  ).map((id) => getProphetById(id)!);

  const arabTribal = (["hud", "salih"] as const).map(
    (id) => getProphetById(id)!,
  );

  return (
    <div className="space-y-1 pb-6">
      {/* === Main Chain: Adam → Nuh === */}
      {mainChain.slice(0, 3).map((p, i) => (
        <div key={p.id} className="flex flex-col items-start pl-4">
          <TreeNodeButton prophet={p} isMain onSelect={onSelect} />
          {i < 2 && (
            <div className="pl-5">
              <Connector
                label={
                  i === 0
                    ? "through Seth & descendants"
                    : "through Shem → Arphaxad → … → Azar (Terah)"
                }
              />
            </div>
          )}

          {/* Arab tribal branches off Nuh */}
          {p.id === "nuh" && (
            <div className="pl-6 mt-2 mb-1 space-y-1">
              <p className="text-[9px] uppercase tracking-widest text-foreground/30 font-semibold mb-1 pl-1">
                Sent to ancient Arab tribes
              </p>
              <div className="flex gap-2 flex-wrap">
                {arabTribal.map((bp) => (
                  <div key={bp.id} className="flex items-center gap-1">
                    <BranchLine />
                    <TreeNodeButton prophet={bp} onSelect={onSelect} />
                  </div>
                ))}
              </div>
              <div className="pl-5 mt-1">
                <div className="w-0.5 h-6 bg-brand-500/30" />
              </div>
            </div>
          )}
        </div>
      ))}

      {/* === Ibrahim (main chain) === */}
      <div className="pl-4">
        <TreeNodeButton
          prophet={getProphetById("ibrahim")!}
          isMain
          onSelect={onSelect}
        />
      </div>

      {/* Branches off Ibrahim */}
      <div className="pl-8 mt-1 mb-1">
        <p className="text-[9px] uppercase tracking-widest text-foreground/30 font-semibold mb-1">
          From Ibrahim's family
        </p>
        <div className="flex gap-2 flex-wrap">
          {ibrahimBranches.map((bp) => (
            <div key={bp.id} className="flex items-center gap-1">
              <BranchLine />
              <TreeNodeButton prophet={bp} onSelect={onSelect} />
            </div>
          ))}
        </div>
      </div>

      {/* Ibrahim → two branches fork */}
      <div className="pl-4 mt-1">
        <div className="flex gap-2 items-start">
          {/* Left: Main chain (Ismail → Muhammad ﷺ) */}
          <div className="flex flex-col items-start">
            <div className="w-0.5 h-4 bg-brand-500/30 ml-5" />
            <TreeNodeButton
              prophet={getProphetById("ismail")!}
              isMain
              onSelect={onSelect}
            />
            <div className="pl-5">
              <Connector label="through Qaydar → Adnan → … → Hashim → Abdullah" />
            </div>
            <TreeNodeButton
              prophet={getProphetById("muhammad")!}
              isMain
              onSelect={onSelect}
            />
          </div>

          {/* Divider */}
          <div className="flex flex-col items-center pt-4">
            <div className="h-0.5 w-6 bg-card-border" />
          </div>

          {/* Right: Ishaq → Banu Israil branch */}
          <div className="flex flex-col items-start">
            <div className="w-0.5 h-4 bg-brand-300/40 ml-5" />
            <div className="bg-brand-50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-900 rounded-2xl p-3 space-y-1">
              <p className="text-[9px] uppercase tracking-widest text-brand-600 dark:text-brand-400 font-bold mb-2">
                Banu Israil (Children of Israel)
              </p>
              {banuIsrailMain.map((p, i) => (
                <div key={p.id} className="flex flex-col items-start">
                  {/* Harun branches from Musa */}
                  {p.id === "musa" && (
                    <div className="flex items-center gap-1 mb-1 pl-4">
                      <BranchLine />
                      <TreeNodeButton
                        prophet={getProphetById("harun")!}
                        onSelect={onSelect}
                      />
                    </div>
                  )}
                  {/* Ilyas + Yunus alongside Dawud */}
                  {p.id === "dawud" && (
                    <div className="flex gap-1 mb-1 flex-wrap pl-0">
                      {(["ilyas", "al-yasa", "yunus"] as const).map((id) => (
                        <div key={id} className="flex items-center gap-0.5">
                          <BranchLine />
                          <TreeNodeButton
                            prophet={getProphetById(id)!}
                            onSelect={onSelect}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  <TreeNodeButton prophet={p} onSelect={onSelect} />
                  {i < banuIsrailMain.length - 1 && (
                    <div className="ml-5 w-0.5 h-3 bg-brand-300/30" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Tab = "tree" | "all";

export default function ProphetsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("tree");
  const [selectedProphet, setSelectedProphet] = useState<Prophet | null>(null);

  return (
    <div className="min-h-screen px-4 pt-6 pb-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-brand-500/15 flex items-center justify-center">
            <Users size={18} className="text-brand-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Prophets of Islam
            </h1>
            <p className="text-xs text-foreground/50">
              Lineage &amp; family of all 25 Quranic prophets
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tab Switcher */}
      <div className="flex gap-2 mb-6 bg-card-bg border border-card-border rounded-2xl p-1">
        <button
          onClick={() => setActiveTab("tree")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            activeTab === "tree"
              ? "bg-brand-500 text-white shadow-sm"
              : "text-foreground/60 hover:text-foreground/80"
          }`}
        >
          <GitBranch size={14} />
          Family Tree
        </button>
        <button
          onClick={() => setActiveTab("all")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            activeTab === "all"
              ? "bg-brand-500 text-white shadow-sm"
              : "text-foreground/60 hover:text-foreground/80"
          }`}
        >
          <Users size={14} />
          All Prophets
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* ── Tree Tab ── */}
        {activeTab === "tree" && (
          <motion.div
            key="tree"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Legend */}
            <div className="flex items-center gap-4 mb-4 px-1">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-brand-500" />
                <span className="text-xs text-foreground/50">
                  Main prophetic chain
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-card-bg border border-card-border" />
                <span className="text-xs text-foreground/50">
                  Branch / other prophets
                </span>
              </div>
            </div>
            <p className="text-xs text-foreground/40 mb-4 px-1 italic">
              Tap any prophet to view their full profile
            </p>

            <TreeView onSelect={setSelectedProphet} />
          </motion.div>
        )}

        {/* ── All Prophets Tab ── */}
        {activeTab === "all" && (
          <motion.div
            key="all"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {PROPHETS.map((p) => (
              <ProphetCard key={p.id} prophet={p} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Prophet Detail Modal (from Tree tap) ── */}
      <AnimatePresence>
        {selectedProphet && (
          <motion.div
            key="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end justify-center"
            onClick={() => setSelectedProphet(null)}
          >
            <motion.div
              key="modal-sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="w-full max-w-md bg-background rounded-t-3xl overflow-hidden max-h-[85dvh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-card-border" />
              </div>

              {/* Scrollable content */}
              <div className="overflow-y-auto px-4 pb-8 pt-2 flex-1">
                <ProphetCard prophet={selectedProphet} defaultOpen />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
