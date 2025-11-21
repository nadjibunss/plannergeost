
"use client";

import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Wallet, TrendingDown, AlertTriangle, Plus } from "lucide-react";
import { toast } from "sonner";

interface WeeklyBudgetTrackerProps {
  transactions: any[];
  onAddTransaction: (transaction: any) => void;
}

export default function WeeklyBudgetTracker({
  transactions,
  onAddTransaction,
}: WeeklyBudgetTrackerProps) {
  const [weeklyBudget, setWeeklyBudget] = useState<number>(0);
  const [showDialog, setShowDialog] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("eplanner_weekly_budget");
    if (saved) {
      setWeeklyBudget(parseFloat(saved));
    }
  }, []);

  const getWeekStart = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(now.setDate(diff));
  };

  const weeklyExpenses = useMemo(() => {
    const weekStart = getWeekStart();
    weekStart.setHours(0, 0, 0, 0);

    return transactions
      .filter((t) => {
        const transDate = new Date(t.date);
        return t.type === "expense" && transDate >= weekStart;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const remaining = weeklyBudget - weeklyExpenses;
  const percentage = weeklyBudget > 0 ? (weeklyExpenses / weeklyBudget) * 100 : 0;
  const isWarning = percentage >= 80;

  const handleSetBudget = () => {
    if (!budgetInput || parseFloat(budgetInput) <= 0) {
      toast.error("Mohon masukkan jumlah anggaran yang valid");
      return;
    }

    const budget = parseFloat(budgetInput);
    setWeeklyBudget(budget);
    localStorage.setItem("eplanner_weekly_budget", budget.toString());
    setShowDialog(false);
    toast.success("Anggaran mingguan berhasil diatur!");
  };

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Wallet className="h-5 w-5 text-indigo-600" />
            Tracker Uang Saku Mingguan
          </h3>
          <Button
            onClick={() => setShowDialog(true)}
            variant="outline"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Atur Anggaran
          </Button>
        </div>

        {weeklyBudget > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Anggaran Mingguan
                </p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  Rp {weeklyBudget.toLocaleString("id-ID")}
                </p>
              </div>

              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Terpakai
                </p>
                <p className="text-lg font-bold text-red-600 dark:text-red-400">
                  Rp {weeklyExpenses.toLocaleString("id-ID")}
                </p>
              </div>

              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Tersisa
                </p>
                <p className={`text-lg font-bold ${remaining >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                  Rp {remaining.toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progres</span>
                <span className="text-sm font-semibold">{percentage.toFixed(1)}%</span>
              </div>
              <Progress
                value={Math.min(percentage, 100)}
                className={`h-3 ${isWarning ? "[&>div]:bg-red-600" : "[&>div]:bg-green-600"}`}
              />
            </div>

            {isWarning && (
              <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  <p className="font-semibold">Peringatan Anggaran!</p>
                  <p>Kamu sudah menggunakan {percentage.toFixed(0)}% dari uang saku mingguan. Coba lebih hemat ya!</p>
                </div>
              </div>
            )}

            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Minggu direset setiap hari Senin
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <TrendingDown className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="mb-2 font-medium">Belum ada anggaran mingguan</p>
            <p className="text-sm">Atur uang saku mingguan untuk mulai tracking</p>
          </div>
        )}
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atur Anggaran Mingguan</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Uang Saku Mingguan (Rp)</label>
              <Input
                type="number"
                placeholder="Masukkan anggaran mingguan"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                step="1000"
                min="0"
              />
              <p className="text-xs text-gray-500 mt-2">
                Ini akan menjadi batas pengeluaran untuk minggu ini
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSetBudget}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              >
                Simpan Anggaran
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDialog(false)}
                className="flex-1"
              >
                Batal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
