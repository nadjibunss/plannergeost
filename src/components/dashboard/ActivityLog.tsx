
"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Bell,
  TrendingUp,
  Briefcase,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";

interface ActivityLogProps {
  activityLog: any[];
}

export default function ActivityLog({ activityLog }: ActivityLogProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "expense":
        return <ArrowDownCircle className="h-5 w-5 text-red-600" />;
      case "income":
        return <ArrowUpCircle className="h-5 w-5 text-green-600" />;
      case "reminder":
        return <Bell className="h-5 w-5 text-yellow-600" />;
      case "investment":
        return <Briefcase className="h-5 w-5 text-blue-600" />;
      case "pnl":
        return <TrendingUp className="h-5 w-5 text-purple-600" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "expense":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      case "income":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "reminder":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "investment":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      case "pnl":
        return "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200";
      default:
        return "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "expense":
        return "Pengeluaran";
      case "income":
        return "Pemasukan";
      case "reminder":
        return "Pengingat";
      case "investment":
        return "Investasi";
      case "pnl":
        return "PnL";
      default:
        return type;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays < 7) return `${diffDays} hari lalu`;

    return date.toLocaleDateString("id-ID", { dateStyle: "medium" });
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Riwayat Aktivitas</h3>

      {activityLog.length > 0 ? (
        <div className="space-y-3">
          {activityLog.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-start gap-4 p-4 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all hover:scale-[1.02]"
            >
              <div className="flex-shrink-0 mt-1">{getIcon(entry.type)}</div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {entry.title}
                  </h4>
                  <Badge className={getTypeColor(entry.type)}>
                    {getTypeLabel(entry.type)}
                  </Badge>
                </div>

                {entry.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {entry.description}
                  </p>
                )}

                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {formatTime(entry.timestamp)}
                </p>
              </div>

              {entry.amount !== undefined && (
                <div className="flex-shrink-0 text-right">
                  <p
                    className={`font-semibold text-lg ${
                      entry.type === "income" || (entry.type === "pnl" && entry.amount >= 0)
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {entry.type === "income" || (entry.type === "pnl" && entry.amount >= 0)
                      ? "+"
                      : "-"}
                    Rp {Math.abs(entry.amount).toLocaleString("id-ID")}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Belum ada aktivitas. Mulai dengan menambahkan transaksi!</p>
        </div>
      )}
    </Card>
  );
}
