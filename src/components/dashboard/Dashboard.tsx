
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { toast } from "sonner";
import Calendar from "@/components/dashboard/Calendar";
import TransactionForm from "@/components/dashboard/TransactionForm";
import Charts from "@/components/dashboard/Charts";
import InvestmentTracker from "@/components/dashboard/InvestmentTracker";
import ActivityLog from "@/components/dashboard/ActivityLog";
import ReminderNotification from "@/components/dashboard/ReminderNotification";
import WeeklyBudgetTracker from "@/components/student/WeeklyBudgetTracker";
import SplitBillCalculator from "@/components/student/SplitBillCalculator";
import SavingsGoal from "@/components/student/SavingsGoal";
import MonthlyReport from "@/components/student/MonthlyReport";
import { ThemeToggle } from "@/components/ThemeToggle";
import LandingPage from "@/components/landing/LandingPage";

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
}

interface Reminder {
  id: string;
  title: string;
  description: string;
  date: string;
  notified: boolean;
  active: boolean;
  createdAt: string;
}

interface Investment {
  id: string;
  name: string;
  capital: number;
  pnlEntries: PnLEntry[];
  createdAt: string;
}

interface PnLEntry {
  id: string;
  value: number;
  date: string;
  createdAt: string;
}

interface ActivityLogEntry {
  id: string;
  type: string;
  title: string;
  amount?: number;
  description: string;
  timestamp: string;
}

export default function Dashboard() {
  const [hasStarted, setHasStarted] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showTransactionDialog, setShowTransactionDialog] = useState(false);
  const [showReminderDialog, setShowReminderDialog] = useState(false);

  useEffect(() => {
    // Check if user has started using the app
    const started = localStorage.getItem("eplanner_started");
    if (started === "true") {
      setHasStarted(true);
      loadAllData();
    }
  }, []);

  const handleGetStarted = () => {
    localStorage.setItem("eplanner_started", "true");
    setHasStarted(true);
    toast.success("Welcome to E-Planner!");
  };

  const loadAllData = () => {
    const savedTransactions = localStorage.getItem("eplanner_transactions");
    const savedReminders = localStorage.getItem("eplanner_reminders");
    const savedInvestments = localStorage.getItem("eplanner_investments");
    const savedActivityLog = localStorage.getItem("eplanner_activity_log");

    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    if (savedReminders) setReminders(JSON.parse(savedReminders));
    if (savedInvestments) setInvestments(JSON.parse(savedInvestments));
    if (savedActivityLog) setActivityLog(JSON.parse(savedActivityLog));
  };

  useEffect(() => {
    if (!hasStarted) return;

    const checkReminders = () => {
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];

      reminders.forEach((reminder) => {
        if (
          reminder.date === todayStr &&
          !reminder.notified &&
          reminder.active
        ) {
          toast.success(`Reminder: ${reminder.title}`, {
            description: reminder.description,
            duration: 5000,
          });

          const updated = reminders.map((r) =>
            r.id === reminder.id ? { ...r, notified: true } : r
          );
          setReminders(updated);
          localStorage.setItem("eplanner_reminders", JSON.stringify(updated));
        }
      });
    };

    checkReminders();
    const interval = setInterval(checkReminders, 60000);

    return () => clearInterval(interval);
  }, [reminders, hasStarted]);

  const handleAddTransaction = (transaction: any) => {
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      ...transaction,
      createdAt: new Date().toISOString(),
    };

    const updated = [newTransaction, ...transactions];
    setTransactions(updated);
    localStorage.setItem("eplanner_transactions", JSON.stringify(updated));

    addActivityLog({
      type: transaction.type,
      title: `${transaction.type === "income" ? "Income" : "Expense"}: ${transaction.category}`,
      amount: transaction.amount,
      description: transaction.description,
    });

    setRefreshKey((prev) => prev + 1);
    toast.success("Transaction added successfully!");
  };

  const handleAddReminder = (reminder: any) => {
    const newReminder: Reminder = {
      id: Math.random().toString(36).substr(2, 9),
      ...reminder,
      notified: false,
      active: true,
      createdAt: new Date().toISOString(),
    };

    const updated = [...reminders, newReminder];
    setReminders(updated);
    localStorage.setItem("eplanner_reminders", JSON.stringify(updated));

    addActivityLog({
      type: "reminder",
      title: `Reminder created: ${reminder.title}`,
      description: reminder.description,
    });

    toast.success("Reminder created successfully!");
  };

  const handleAddInvestment = (investment: any) => {
    const newInvestment: Investment = {
      id: Math.random().toString(36).substr(2, 9),
      ...investment,
      pnlEntries: [],
      createdAt: new Date().toISOString(),
    };

    const updated = [...investments, newInvestment];
    setInvestments(updated);
    localStorage.setItem("eplanner_investments", JSON.stringify(updated));

    addActivityLog({
      type: "investment",
      title: `Investment: ${investment.name}`,
      amount: investment.capital,
      description: `Initial Capital: Rp ${investment.capital.toLocaleString("id-ID")}`,
    });

    setRefreshKey((prev) => prev + 1);
    toast.success("Investment added successfully!");
  };

  const handleAddPnL = (investmentId: string, pnl: any) => {
    const investment = investments.find((inv) => inv.id === investmentId);
    if (!investment) return;

    const newPnLEntry: PnLEntry = {
      id: Math.random().toString(36).substr(2, 9),
      value: pnl.value,
      date: pnl.date,
      createdAt: new Date().toISOString(),
    };

    const updatedInvestments = investments.map((inv) =>
      inv.id === investmentId
        ? { ...inv, pnlEntries: [...inv.pnlEntries, newPnLEntry] }
        : inv
    );

    setInvestments(updatedInvestments);
    localStorage.setItem(
      "eplanner_investments",
      JSON.stringify(updatedInvestments)
    );

    addActivityLog({
      type: "pnl",
      title: `PnL Update: ${investment.name}`,
      amount: pnl.value,
      description: `PnL: ${pnl.value > 0 ? "+" : ""}Rp ${pnl.value.toLocaleString("id-ID")}`,
    });

    setRefreshKey((prev) => prev + 1);
    toast.success("PnL recorded successfully!");
  };

  const addActivityLog = (log: Omit<ActivityLogEntry, "id" | "timestamp">) => {
    const newLog: ActivityLogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      ...log,
      timestamp: new Date().toISOString(),
    };

    const updated = [newLog, ...activityLog].slice(0, 50);
    setActivityLog(updated);
    localStorage.setItem("eplanner_activity_log", JSON.stringify(updated));
  };

  // Show landing page if user hasn't started
  if (!hasStarted) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <header className="sticky top-0 z-40 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border-b border-gray-200 dark:border-slate-700 shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center shadow-lg">
              <span className="text-xl font-bold text-white">E</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                E-Planner
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              transactions={transactions}
              reminders={reminders}
            />

            <WeeklyBudgetTracker
              key={refreshKey}
              transactions={transactions}
              onAddTransaction={handleAddTransaction}
            />
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SplitBillCalculator />
              <SavingsGoal transactions={transactions} />
            </div>

            <Charts
              transactions={transactions}
              investments={investments}
              onNewTransaction={() => setShowTransactionDialog(true)}
              onNewReminder={() => setShowReminderDialog(true)}
            />

            <InvestmentTracker
              key={refreshKey}
              investments={investments}
              onAddInvestment={handleAddInvestment}
              onAddPnL={handleAddPnL}
            />

            <MonthlyReport transactions={transactions} />
          </div>
        </div>

        <div className="mt-8">
          <ActivityLog activityLog={activityLog} />
        </div>
      </main>

      <ReminderNotification reminders={reminders} />

      <TransactionForm
        selectedDate={selectedDate}
        onAddTransaction={handleAddTransaction}
        onAddReminder={handleAddReminder}
        showTransactionDialog={showTransactionDialog}
        showReminderDialog={showReminderDialog}
        onClose={() => {
          setShowTransactionDialog(false);
          setShowReminderDialog(false);
        }}
      />
    </div>
  );
}
