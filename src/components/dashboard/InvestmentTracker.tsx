
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, TrendingUp, TrendingDown, Info, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface InvestmentTrackerProps {
  investments: any[];
  onAddInvestment: (investment: any) => void;
  onAddPnL: (investmentId: string, pnl: any) => void;
}

export default function InvestmentTracker({
  investments,
  onAddInvestment,
  onAddPnL,
}: InvestmentTrackerProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    capital: "",
  });
  const [pnlData, setPnlData] = useState({
    value: "",
  });

  const hasInvestment = investments.length > 0;
  const mainInvestment = investments[0];

  const handleAddInvestment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.capital) {
      toast.error("Mohon isi jumlah modal");
      return;
    }

    if (hasInvestment) {
      toast.error("Modal awal hanya bisa diinput sekali");
      return;
    }

    onAddInvestment({
      name: "Investasi Utama",
      capital: parseFloat(formData.capital),
    });

    setFormData({ capital: "" });
    setShowDialog(false);
  };

  const canAddPnL = (investment: any) => {
    const createdDate = new Date(investment.createdAt);
    const today = new Date();
    const daysDiff = Math.floor(
      (today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff < 1) return false;

    const todayStr = today.toISOString().split("T")[0];
    const hasTodayPnL = (investment.pnlEntries || []).some(
      (entry: any) => entry.date === todayStr
    );

    return !hasTodayPnL;
  };

  const getTotalPnL = (investment: any) => {
    return (investment.pnlEntries || []).reduce((sum: number, entry: any) => sum + entry.value, 0);
  };

  const getLast7DaysPnL = (investment: any) => {
    const entries = investment.pnlEntries || [];
    return entries.slice(-7).map((entry: any) => ({
      date: new Date(entry.date).toLocaleDateString("id-ID", { day: "2-digit", month: "short" }),
      pnl: entry.value,
    }));
  };

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Investasi & PnL</h3>
          {!hasInvestment && (
            <Button
              onClick={() => setShowDialog(true)}
              className="bg-indigo-600 hover:bg-indigo-700"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Input Modal
            </Button>
          )}
        </div>

        {hasInvestment && mainInvestment ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Total Aset Saat Ini
                </p>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  Rp {(mainInvestment.capital + getTotalPnL(mainInvestment)).toLocaleString("id-ID")}
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Modal Awal
                </p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  Rp {mainInvestment.capital.toLocaleString("id-ID")}
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Total PnL
                </p>
                <div className="flex items-center gap-2">
                  {getTotalPnL(mainInvestment) >= 0 ? (
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  )}
                  <p
                    className={`text-xl font-semibold ${
                      getTotalPnL(mainInvestment) >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {getTotalPnL(mainInvestment) >= 0 ? "+" : ""}
                    Rp {getTotalPnL(mainInvestment).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            </div>

            {getLast7DaysPnL(mainInvestment).length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-3">Performa 7 Hari Terakhir</h4>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={getLast7DaysPnL(mainInvestment)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" style={{ fontSize: "12px" }} />
                    <YAxis style={{ fontSize: "12px" }} />
                    <Tooltip
                      formatter={(value: any) => `Rp ${value.toLocaleString("id-ID")}`}
                    />
                    <Bar dataKey="pnl" fill="#4F46E5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
              <h4 className="text-sm font-semibold mb-3">Input PnL Harian</h4>
              <div className="flex gap-3">
                <Input
                  type="number"
                  placeholder="Masukkan nilai PnL (gunakan minus untuk rugi)"
                  value={pnlData.value}
                  onChange={(e) =>
                    setPnlData((prev) => ({ ...prev, value: e.target.value }))
                  }
                  step="0.01"
                  className="flex-1"
                />
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    if (!canAddPnL(mainInvestment)) {
                      const createdDate = new Date(mainInvestment.createdAt);
                      const today = new Date();
                      const daysDiff = Math.floor(
                        (today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
                      );

                      if (daysDiff < 1) {
                        toast.error("PnL hanya bisa diinput setelah 1 hari dari input modal");
                      } else {
                        toast.error("PnL hanya bisa diinput sekali per hari");
                      }
                      return;
                    }

                    if (!pnlData.value) {
                      toast.error("Mohon masukkan nilai PnL");
                      return;
                    }

                    const todayStr = new Date().toISOString().split("T")[0];
                    onAddPnL(mainInvestment.id, {
                      value: parseFloat(pnlData.value),
                      date: todayStr,
                    });

                    setPnlData({ value: "" });
                  }}
                  disabled={!canAddPnL(mainInvestment)}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Simpan PnL
                </Button>
              </div>
              <div className="flex items-start gap-2 mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded text-xs text-blue-800 dark:text-blue-200">
                <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <p>
                  {!canAddPnL(mainInvestment)
                    ? "PnL hanya bisa diinput sekali per hari dan minimal 1 hari setelah input modal"
                    : "Masukkan PnL hari ini. Gunakan angka negatif untuk kerugian."}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Briefcase className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="mb-2 font-medium">Belum ada investasi</p>
            <p className="text-sm">Input modal awal untuk mulai tracking investasi</p>
          </div>
        )}
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Input Modal Awal (Sekali Saja)</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddInvestment} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Jumlah Modal (Rp)</label>
              <Input
                type="number"
                placeholder="0"
                value={formData.capital}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, capital: e.target.value }))
                }
                step="0.01"
                min="0"
              />
            </div>

            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded text-sm text-yellow-800 dark:text-yellow-200 flex items-start gap-2">
              <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <p>
                Modal awal hanya bisa diinput sekali. Pastikan jumlahnya sudah benar.
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              >
                Simpan Modal
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowDialog(false);
                  setFormData({ capital: "" });
                }}
                className="flex-1"
              >
                Batal
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
