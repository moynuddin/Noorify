"use client";

import { useDhikrStore } from "@/store/useDhikrStore";
import { format, subDays } from "date-fns";
import { motion } from "framer-motion";
import { Flame, Trophy, Calendar, Globe2, Sparkles, Medal } from "lucide-react";

export default function AnalyticsPage() {
  const { history, streaks, totalLifetimeCount, globalCommunityCount, badges } = useDhikrStore();

  // Generate last 7 days data
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(new Date(), 6 - i);
    const dateStr = format(d, 'yyyy-MM-dd');
    const record = history.find(r => r.date === dateStr);
    return {
      date: dateStr,
      label: format(d, 'EEE'),
      count: record ? record.count : 0,
    };
  });

  const maxCount = Math.max(...last7Days.map(d => d.count), 1);

  // Tree Growth Logic
  let TreeVisual = "🌱";
  let TreeStatus = "A Seed Planted";
  if (totalLifetimeCount > 100) { TreeVisual = "🪴"; TreeStatus = "Sprouting Plant"; }
  if (totalLifetimeCount > 1000) { TreeVisual = "🌿"; TreeStatus = "Growing Sapling"; }
  if (totalLifetimeCount > 5000) { TreeVisual = "🌳"; TreeStatus = "Firmly Rooted Tree"; }
  if (totalLifetimeCount > 10000) { TreeVisual = "🌲"; TreeStatus = "Evergreen Cedar"; }

  const nextMilestone = totalLifetimeCount < 100 ? 100 : totalLifetimeCount < 1000 ? 1000 : totalLifetimeCount < 5000 ? 5000 : totalLifetimeCount < 10000 ? 10000 : 50000;
  const treeProgress = Math.min((totalLifetimeCount / nextMilestone) * 100, 100);

  return (
    <div className="px-4 sm:px-8 md:px-12 py-8 md:py-12 min-h-screen transition-all duration-300">
      <motion.h1 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-3xl font-bold mb-6 md:mb-10 tracking-tight text-foreground flex items-center justify-between"
      >
        Your Progress
        
        {/* Global Pool Indicator */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-brand-500/10 to-brand-400/5 px-4 py-2 rounded-full border border-brand-500/20 shadow-sm">
          <Globe2 size={16} className="text-brand-500 animate-pulse" />
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider font-bold text-brand-600 dark:text-brand-400 leading-none">Global Dhikr</span>
            <span className="text-sm font-bold tabular-nums tracking-tight text-foreground leading-tight">{globalCommunityCount.toLocaleString()}</span>
          </div>
        </div>
      </motion.h1>

      {/* Hero: Spiritual Milestones */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 md:mb-12 relative overflow-hidden bg-gradient-to-br from-brand-500 text-white p-6 md:p-8 rounded-3xl md:rounded-[2rem] shadow-lg border border-brand-400/50"
      >
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 blur-3xl rounded-full" />
        
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h2 className="text-xs md:text-sm font-bold uppercase tracking-widest text-brand-100 flex items-center gap-2 mb-2">
              <Sparkles size={14} /> The Tree of Jannah
            </h2>
            <div className="text-5xl md:text-7xl mb-4 drop-shadow-md filter saturate-150">
              {TreeVisual}
            </div>
            <h3 className="font-semibold text-xl md:text-2xl">{TreeStatus}</h3>
            <p className="text-brand-100/90 text-sm md:text-base font-medium mt-1">
              Lifetime: <span className="font-bold tabular-nums text-white text-lg">{totalLifetimeCount.toLocaleString()}</span>
            </p>
          </div>
        </div>
        
        <div className="mt-6 md:mt-8 relative z-10">
          <div className="flex justify-between text-xs font-bold text-brand-100 mb-2 uppercase tracking-wider">
            <span>Current</span>
            <span>{nextMilestone.toLocaleString()}</span>
          </div>
          <div className="w-full bg-black/20 rounded-full h-3 md:h-4 overflow-hidden border border-black/10">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${treeProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-white h-full shadow-[0_0_10px_rgba(255,255,255,0.7)]"
            />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-card-bg border border-card-border p-5 md:p-8 rounded-3xl md:rounded-[2rem] shadow-sm flex flex-col items-center justify-center"
        >
          <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-orange-500/10 flex items-center justify-center mb-3 md:mb-4">
            <Flame className="text-orange-500 md:w-7 md:h-7" size={20} />
          </div>
          <span className="text-3xl md:text-5xl font-bold mb-1 md:mb-2 tabular-nums">{streaks.current}</span>
          <span className="text-xs md:text-sm text-foreground/50 tracking-wide uppercase font-medium">Day Streak</span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-card-bg border border-card-border p-5 md:p-8 rounded-3xl md:rounded-[2rem] shadow-sm flex flex-col items-center justify-center"
        >
          <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-brand-500/10 flex items-center justify-center mb-3 md:mb-4">
            <Trophy className="text-brand-500 md:w-7 md:h-7" size={20} />
          </div>
          <span className="text-3xl md:text-5xl font-bold mb-1 md:mb-2 tabular-nums">{streaks.best}</span>
          <span className="text-xs md:text-sm text-foreground/50 tracking-wide uppercase font-medium">Best Streak</span>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card-bg border border-card-border p-6 md:p-10 rounded-3xl md:rounded-[2rem] shadow-sm mb-8"
      >
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="text-brand-500 md:w-6 md:h-6" size={18} />
          <h2 className="font-semibold text-sm md:text-lg">Last 7 Days Activity</h2>
        </div>
        
        <div className="flex items-end justify-between h-40 md:h-56 gap-2 md:gap-4">
          {last7Days.map((day, i) => {
            const heightPercentage = Math.max((day.count / maxCount) * 100, 4); 
            return (
              <div key={day.date} className="flex flex-col items-center flex-1 gap-3 md:gap-4 relative group">
                <div className="w-full relative h-[120px] md:h-[180px] bg-foreground/5 rounded-t-lg md:rounded-t-xl overflow-hidden flex items-end">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercentage}%` }}
                    transition={{ delay: 0.5 + i * 0.05, duration: 0.6, type: "spring" }}
                    className="w-full bg-brand-400 dark:bg-brand-500 rounded-t-lg md:rounded-t-xl transition-colors group-hover:bg-brand-500 dark:group-hover:bg-brand-400"
                  />
                </div>
                {day.count > 0 && (
                  <span className="absolute -top-6 text-[10px] md:text-xs font-bold text-brand-600 dark:text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {day.count}
                  </span>
                )}
                <span className="text-[10px] md:text-xs text-foreground/50 font-medium uppercase">{day.label}</span>
              </div>
            );
          })}
        </div>
      </motion.div>
      
      {/* Badges Section */}
      {badges.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-4 pl-2">
            <Medal className="text-yellow-500 md:w-6 md:h-6" size={18} />
            <h2 className="font-semibold text-sm md:text-lg">Unlocked Badges</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
             {badges.map(b => (
               <div key={b} className="bg-yellow-500/10 border border-yellow-500/20 px-4 py-3 rounded-2xl flex items-center gap-3">
                 <span className="text-xl">🏆</span>
                 <span className="text-xs md:text-sm font-bold text-yellow-600 dark:text-yellow-500">{b}</span>
               </div>
             ))}
          </div>
        </motion.div>
      )}

    </div>
  );
}
