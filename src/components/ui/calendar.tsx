"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface CalendarProps {
  mode?: "single";
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  className?: string;
}

export function Calendar({ selected, onSelect, className }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(() => {
    return selected ? new Date(selected.getFullYear(), selected.getMonth(), 1) : new Date();
  });

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  // Get total days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Get day of the week for first day of the month
  const firstDayIndex = new Date(year, month, 1).getDay();

  // Create array of days
  const days = [];
  // Padding for previous month
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null);
  }
  // Days of current month
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(new Date(year, month, d));
  }

  const isSelected = (d: Date) => {
    if (!selected) return false;
    return (
      d.getDate() === selected.getDate() &&
      d.getMonth() === selected.getMonth() &&
      d.getFullYear() === selected.getFullYear()
    );
  };

  const isToday = (d: Date) => {
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className={`p-4 bg-transparent text-white rounded-md select-none w-[280px] ${className || ""}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-semibold tracking-wider font-mono text-zinc-200">
          {monthNames[month].toUpperCase()} {year}
        </h2>
        <div className="flex gap-1">
          <button 
            onClick={handlePrevMonth} 
            className="p-1.5 rounded-md border border-white/5 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/10 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={handleNextMonth} 
            className="p-1.5 rounded-md border border-white/5 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/10 transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 font-mono">
        <span>Su</span>
        <span>Mo</span>
        <span>Tu</span>
        <span>We</span>
        <span>Th</span>
        <span>Fr</span>
        <span>Sa</span>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} />;
          
          const active = isSelected(day);
          const current = isToday(day);
          
          return (
            <button
              key={day.toISOString()}
              onClick={() => onSelect?.(day)}
              className={`h-8 w-8 text-xs rounded-md flex items-center justify-center transition-all duration-300 font-medium ${
                active 
                  ? "bg-cyber-blue text-black font-bold shadow-[0_0_12px_rgba(58,166,255,0.4)]" 
                  : current
                  ? "bg-white/5 text-cyber-blue border border-cyber-blue/30"
                  : "text-zinc-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
