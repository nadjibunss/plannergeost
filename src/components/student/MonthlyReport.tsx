
"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { FileText, TrendingUp, TrendingDown, Lightbulb, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MonthlyReportProps {
  transactions: any[];
}

export default function MonthlyReport({ transactions }: MonthlyReportProps) {
  const monthlyData = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthTransactions = transactions.filter((t) => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const income = monthTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = monthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const categoryExpenses: Record<string, number> = {};
    monthTransactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        categoryExpenses[t.category] = (categoryExpenses[t.category] || 0) + t.amount;
      });

    const topCategory = Object.entries(categoryExpenses).sort(
      ([, a], [, b]) => b - a
    )[0];

    return {
      income,
      expense,
      balance: income - expense,
      topCategory: topCategory ? topCategory[0] : null,
      topCategoryAmount: topCategory ? topCategory[1] : 0,
      categoryExpenses,
      transactionCount: monthTransactions.length,
    };
  }, [transactions]);

  const generateTips = () => {
    const tips = [];

    if (monthlyData.topCategory) {
      const percentage = (monthlyData.topCategoryAmount / monthlyData.expense) * 100;
      
      if (monthlyData.topCategory === "Makanan" && percentage > 40) {
        tips.push({
          type: "warning",
          message: `Kamu menghabiskan ${percentage.toFixed(0)}% (Rp ${monthlyData.topCategoryAmount.toLocaleString("id-ID")}) untuk makanan. Coba masak sendiri untuk hemat Rp ${(monthlyData.topCategoryAmount * 0.3).toLocaleString("id-ID", { maximumFractionDigits: 0 })}/bulan!`,
        });
      }

      if (monthlyData.topCategory === "Hiburan" && percentage > 30) {
        tips.push({
          type: "info",
          message: `Hiburan menghabiskan ${percentage.toFixed(0)}% dari anggaranmu. Pertimbangkan aktivitas gratis untuk lebih hemat!`,
        });
      }

      if (monthlyData.topCategory === "Transportasi" && percentage > 25) {
        tips.push({
          type: "info",
          message: `Biaya transportasi cukup tinggi (${percentage.toFixed(0)}%). Coba carpool atau naik transportasi umum untuk hemat.`,
        });
      }
    }

    if (monthlyData.balance < 0) {
      tips.push({
        type: "warning",
        message: `Kamu overspending sebesar Rp ${Math.abs(monthlyData.balance).toLocaleString("id-ID")}. Review pengeluaran dan kurangi yang tidak perlu.`,
      });
    } else if (monthlyData.balance > monthlyData.income * 0.3) {
      tips.push({
        type: "success",
        message: `Keren! Kamu berhasil menabung ${((monthlyData.balance / monthlyData.income) * 100).toFixed(0)}% dari pemasukan bulan ini!`,
      });
    }

    if (monthlyData.transactionCount < 5) {
      tips.push({
        type: "info",
        message: "Catat lebih banyak transaksi untuk mendapat insight dan tips yang lebih personal!",
      });
    }

    if (tips.length === 0) {
      tips.push({
        type: "success",
        message: "Pengeluaranmu terlihat seimbang! Pertahankan!",
      });
    }

    return tips;
  };

  const tips = generateTips();
  const monthName = new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" });

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="h-5 w-5 text-indigo-600" />
        <h3 className="text-lg font-semibold">Laporan Bulanan - {monthName}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <p className="text-xs text-gray-600 dark:text-gray-400">Pemasukan</p>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            Rp {monthlyData.income.toLocaleString("id-ID")}
          </p>
        </div>

        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="h-4 w-4 text-red-600" />
            <p className="text-xs text-gray-600 dark:text-gray-400">Pengeluaran</p>
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            Rp {monthlyData.expense.toLocaleString("id-ID")}
          </p>
        </div>

        <div className={`p-4 rounded-lg ${monthlyData.balance >= 0 ? "bg-blue-50 dark:bg-blue-900/20" : "bg-orange-50 dark:bg-orange-900/20"}`}>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className={`h-4 w-4 ${monthlyData.balance >= 0 ? "text-blue-600" : "text-orange-600"}`} />
            <p className="text-xs text-gray-600 dark:text-gray-400">Saldo</p>
          </div>
          <p className={`text-2xl font-bold ${monthlyData.balance >= 0 ? "text-blue-600 dark:text-blue-400" : "text-orange-600 dark:text-orange-400"}`}>
            {monthlyData.balance >= 0 ? "+" : ""}Rp {monthlyData.balance.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {monthlyData.topCategory && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
          <p className="text-sm font-semibold mb-2">Kategori Pengeluaran Terbesar</p>
          <div className="flex items-center justify-between">
            <div>
              <Badge className="bg-indigo-600 text-white mb-1">
                {monthlyData.topCategory}
              </Badge>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {((monthlyData.topCategoryAmount / monthlyData.expense) * 100).toFixed(1)}% dari total pengeluaran
              </p>
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              Rp {monthlyData.topCategoryAmount.toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="h-5 w-5 text-yellow-600" />
          <h4 className="font-semibold">Tips Pintar & Insight</h4>
        </div>

        {tips.map((tip, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-lg border ${
              tip.type === "warning"
                ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                : tip.type === "success"
                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                  : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
            }`}
          >
            <p
              className={`text-sm ${
                tip.type === "warning"
                  ? "text-yellow-800 dark:text-yellow-200"
                  : tip.type === "success"
                    ? "text-green-800 dark:text-green-200"
                    : "text-blue-800 dark:text-blue-200"
              }`}
            >
              {tip.message}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Laporan dibuat berdasarkan {monthlyData.transactionCount} transaksi bulan ini
        </p>
      </div>
    </Card>
  );
}
