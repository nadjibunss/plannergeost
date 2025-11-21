
"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Target, Plus, Trash2, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  createdAt: string;
}

interface SavingsGoalProps {
  transactions: any[];
}

export default function SavingsGoal({ transactions }: SavingsGoalProps) {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showAddMoneyDialog, setShowAddMoneyDialog] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    targetAmount: "",
    deadline: "",
  });
  const [addAmount, setAddAmount] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("eplanner_savings_goals");
    if (saved) {
      setGoals(JSON.parse(saved));
    }
  }, []);

  const handleCreateGoal = () => {
    if (!formData.title || !formData.targetAmount || !formData.deadline) {
      toast.error("Mohon isi semua field");
      return;
    }

    const newGoal: SavingsGoal = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: 0,
      deadline: formData.deadline,
      createdAt: new Date().toISOString(),
    };

    const updated = [...goals, newGoal];
    setGoals(updated);
    localStorage.setItem("eplanner_savings_goals", JSON.stringify(updated));

    setFormData({ title: "", targetAmount: "", deadline: "" });
    setShowDialog(false);
    toast.success("Target tabungan berhasil dibuat!");
  };

  const handleAddMoney = () => {
    if (!addAmount || parseFloat(addAmount) <= 0) {
      toast.error("Mohon masukkan jumlah yang valid");
      return;
    }

    const updated = goals.map((goal) => {
      if (goal.id === selectedGoalId) {
        return {
          ...goal,
          currentAmount: goal.currentAmount + parseFloat(addAmount),
        };
      }
      return goal;
    });

    setGoals(updated);
    localStorage.setItem("eplanner_savings_goals", JSON.stringify(updated));

    setAddAmount("");
    setShowAddMoneyDialog(false);
    setSelectedGoalId("");
    toast.success("Uang berhasil ditambahkan ke target!");
  };

  const handleDeleteGoal = (goalId: string) => {
    const updated = goals.filter((g) => g.id !== goalId);
    setGoals(updated);
    localStorage.setItem("eplanner_savings_goals", JSON.stringify(updated));
    toast.success("Target dihapus");
  };

  const calculateDaysLeft = (deadline: string) => {
    const today = new Date();
    const target = new Date(deadline);
    const diff = target.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const calculateMonthlyTarget = (goal: SavingsGoal) => {
    const remaining = goal.targetAmount - goal.currentAmount;
    const daysLeft = calculateDaysLeft(goal.deadline);
    const monthsLeft = daysLeft / 30;
    return monthsLeft > 0 ? remaining / monthsLeft : 0;
  };

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Target className="h-5 w-5 text-indigo-600" />
            Target Tabungan
          </h3>
          <Button
            onClick={() => setShowDialog(true)}
            className="bg-indigo-600 hover:bg-indigo-700"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Target Baru
          </Button>
        </div>

        {goals.length > 0 ? (
          <div className="space-y-4">
            {goals.map((goal) => {
              const percentage = (goal.currentAmount / goal.targetAmount) * 100;
              const daysLeft = calculateDaysLeft(goal.deadline);
              const monthlyTarget = calculateMonthlyTarget(goal);

              return (
                <div
                  key={goal.id}
                  className="p-4 border border-gray-200 dark:border-slate-700 rounded-lg"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {goal.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Target: Rp {goal.targetAmount.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleDeleteGoal(goal.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Progres</span>
                      <span className="text-sm font-semibold">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                    <Progress
                      value={Math.min(percentage, 100)}
                      className="h-3 [&>div]:bg-green-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Terkumpul
                      </p>
                      <p className="text-sm font-bold text-green-600 dark:text-green-400">
                        Rp {goal.currentAmount.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Kurang
                      </p>
                      <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        Rp{" "}
                        {(goal.targetAmount - goal.currentAmount).toLocaleString(
                          "id-ID"
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded mb-3">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Estimasi Nabung Per Bulan
                    </p>
                    <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                      Rp {monthlyTarget.toLocaleString("id-ID", { maximumFractionDigits: 0 })}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {daysLeft > 0
                        ? `${daysLeft} hari lagi sampai ${new Date(goal.deadline).toLocaleDateString("id-ID")}`
                        : "Tenggat waktu terlewat"}
                    </p>
                  </div>

                  <Button
                    onClick={() => {
                      setSelectedGoalId(goal.id);
                      setShowAddMoneyDialog(true);
                    }}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Uang
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="mb-2 font-medium">Belum ada target tabungan</p>
            <p className="text-sm">Buat target untuk mulai menabung!</p>
          </div>
        )}
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buat Target Tabungan</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Judul Target</label>
              <Input
                placeholder="Contoh: Beli Laptop, Liburan"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Jumlah Target (Rp)</label>
              <Input
                type="number"
                placeholder="0"
                value={formData.targetAmount}
                onChange={(e) =>
                  setFormData({ ...formData, targetAmount: e.target.value })
                }
                step="10000"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Tanggal Target</label>
              <Input
                type="date"
                value={formData.deadline}
                onChange={(e) =>
                  setFormData({ ...formData, deadline: e.target.value })
                }
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleCreateGoal}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              >
                Buat Target
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

      <Dialog open={showAddMoneyDialog} onOpenChange={setShowAddMoneyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Uang ke Target</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Jumlah (Rp)</label>
              <Input
                type="number"
                placeholder="0"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                step="1000"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleAddMoney}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Tambah Uang
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddMoneyDialog(false);
                  setAddAmount("");
                  setSelectedGoalId("");
                }}
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
