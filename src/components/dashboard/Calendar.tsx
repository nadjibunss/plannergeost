
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  transactions: any[];
  reminders: any[];
}

export default function Calendar({
  selectedDate,
  onDateSelect,
  transactions,
  reminders,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getTransactionsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return transactions.filter((t) => t.date === dateStr);
  };

  const getRemindersForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return reminders.filter((r) => r.date === dateStr && r.active);
  };

  const getTotalForDate = (date: Date) => {
    const dayTransactions = getTransactionsForDate(date);
    return dayTransactions.reduce((sum, t) => {
      return sum + (t.type === "expense" ? -t.amount : t.amount);
    }, 0);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
  }

  const monthName = currentMonth.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  const upcomingReminders = reminders
    .filter((r) => {
      const reminderDate = new Date(r.date);
      const today = new Date();
      return reminderDate >= today && r.active;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Kalender Pengingat</h3>

      <div className="flex items-center justify-between mb-4">
        <Button
          onClick={handlePrevMonth}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="font-semibold text-center flex-1">{monthName}</h3>
        <Button
          onClick={handleNextMonth}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const isSelected =
            date.toDateString() === selectedDate.toDateString();
          const isToday = date.toDateString() === new Date().toDateString();
          const dayTransactions = getTransactionsForDate(date);
          const dayReminders = getRemindersForDate(date);
          const total = getTotalForDate(date);
          const hasReminder = dayReminders.length > 0;

          return (
            <button
              key={date.toISOString()}
              onClick={() => onDateSelect(date)}
              className={`aspect-square p-1 rounded-lg text-xs font-medium transition-all flex flex-col items-center justify-center relative ${
                isSelected
                  ? "bg-indigo-600 text-white shadow-lg scale-105"
                  : isToday
                    ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-600"
                    : "hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-900 dark:text-gray-100"
              }`}
            >
              <span className={hasReminder ? "font-bold underline decoration-indigo-600 decoration-2" : ""}>
                {date.getDate()}
              </span>
              {dayTransactions.length > 0 && (
                <div className="text-[10px] mt-0.5 line-clamp-1">
                  <span
                    className={`${
                      total > 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    } ${isSelected ? "text-white" : ""}`}
                  >
                    {total > 0 ? "+" : ""}
                    {Math.abs(total) > 999 ? `${(total / 1000).toFixed(0)}k` : total}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
          Dipilih: {selectedDate.toLocaleDateString("id-ID", { dateStyle: "long" })}
        </p>
        <div className="space-y-1">
          {getTransactionsForDate(selectedDate).length > 0 ? (
            getTransactionsForDate(selectedDate).map((t) => (
              <div
                key={t.id}
                className="text-xs p-2 bg-gray-50 dark:bg-slate-700 rounded"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{t.category}</span>
                  <span
                    className={
                      t.type === "income"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }
                  >
                    {t.type === "income" ? "+" : "-"}
                    Rp {t.amount.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Tidak ada transaksi
            </p>
          )}
        </div>
      </div>

      {upcomingReminders.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
            <Bell className="h-3 w-3" />
            Pengingat Terdekat
          </p>
          <div className="space-y-2">
            {upcomingReminders.map((reminder) => (
              <div
                key={reminder.id}
                className="text-xs p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800"
              >
                <div className="font-medium text-yellow-900 dark:text-yellow-200">
                  {reminder.title}
                </div>
                <div className="text-yellow-700 dark:text-yellow-400 text-[10px] mt-1">
                  {new Date(reminder.date).toLocaleDateString("id-ID", { dateStyle: "medium" })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
