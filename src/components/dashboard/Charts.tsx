
"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Bell } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ChartsProps {
  transactions: any[];
  investments: any[];
  onNewTransaction?: () => void;
  onNewReminder?: () => void;
}

const COLORS = [
  "#EF4444",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
];

export default function Charts({ transactions, investments, onNewTransaction, onNewReminder }: ChartsProps) {
  const categoryData = useMemo(() => {
    const categories: Record<string, number> = {};

    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
      });

    return Object.entries(categories)
      .map(([name, value]) => ({
        name,
        value: parseFloat(value.toFixed(2)),
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const totalIncome = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const totalExpense = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const balance = totalIncome - totalExpense;

  const summaryData = [
    { name: "Pemasukan", value: totalIncome, color: "#10B981" },
    { name: "Pengeluaran", value: totalExpense, color: "#EF4444" },
    { name: "Saldo", value: balance > 0 ? balance : 0, color: "#3B82F6" },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Ringkasan Keuangan</h3>
        <div className="flex gap-2">
          {onNewReminder && (
            <Button
              onClick={onNewReminder}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Bell className="h-4 w-4" />
              Pengingat
            </Button>
          )}
          {onNewTransaction && (
            <Button
              onClick={onNewTransaction}
              className="bg-indigo-600 hover:bg-indigo-700 gap-2"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              Baru
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h4 className="text-sm font-semibold mb-4 text-center">
            Distribusi Keuangan
          </h4>
          {summaryData.some((d) => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={summaryData.filter((d) => d.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {summaryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => `Rp ${value.toLocaleString("id-ID")}`}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-500 dark:text-gray-400">
              Belum ada data
            </div>
          )}

          <div className="mt-4 space-y-2">
            {summaryData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-slate-700 rounded"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <span className="text-sm font-semibold">
                  Rp {item.value.toLocaleString("id-ID")}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30 rounded-lg text-center">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              Saldo Tersisa Anda
            </p>
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              Rp {balance.toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-4">
            Pengeluaran per Kategori
          </h4>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={categoryData}
                layout="vertical"
                margin={{ left: 80, right: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" style={{ fontSize: "12px" }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  style={{ fontSize: "12px" }}
                />
                <Tooltip
                  formatter={(value: any) => `Rp ${value.toLocaleString("id-ID")}`}
                />
                <Bar dataKey="value" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
              Belum ada data pengeluaran
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
