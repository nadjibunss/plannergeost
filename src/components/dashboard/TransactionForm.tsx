
"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Bell, Plus, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { toast } from "sonner";

interface TransactionFormProps {
  selectedDate: Date;
  onAddTransaction: (transaction: any) => void;
  onAddReminder: (reminder: any) => void;
  onClose?: () => void;
  showTransactionDialog?: boolean;
  showReminderDialog?: boolean;
}

const EXPENSE_CATEGORIES = [
  "Makanan",
  "Transportasi",
  "Kos/Sewa",
  "Print/Fotokopi",
  "Pulsa/Internet",
  "Alat Tulis",
  "Nongkrong",
  "Hiburan",
  "Kesehatan",
  "Lainnya",
];

const INCOME_CATEGORIES = [
  "Uang Saku",
  "Gaji",
  "Freelance",
  "Bonus",
  "Hadiah",
  "Lainnya",
];

export default function TransactionForm({
  selectedDate,
  onAddTransaction,
  onAddReminder,
  onClose,
  showTransactionDialog = false,
  showReminderDialog = false,
}: TransactionFormProps) {
  const [activeTab, setActiveTab] = useState<"income" | "expense">("expense");
  const [internalShowTransactionDialog, setInternalShowTransactionDialog] = useState(showTransactionDialog);
  const [internalShowReminderDialog, setInternalShowReminderDialog] = useState(showReminderDialog);
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
  });
  const [reminderData, setReminderData] = useState({
    title: "",
    description: "",
    date: selectedDate.toISOString().split("T")[0],
  });

  useEffect(() => {
    setInternalShowTransactionDialog(showTransactionDialog);
  }, [showTransactionDialog]);

  useEffect(() => {
    setInternalShowReminderDialog(showReminderDialog);
  }, [showReminderDialog]);

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount || !formData.category) {
      toast.error("Mohon isi semua field yang diperlukan");
      return;
    }

    onAddTransaction({
      type: activeTab,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      date: selectedDate.toISOString().split("T")[0],
    });

    setFormData({ amount: "", category: "", description: "" });
    setInternalShowTransactionDialog(false);
    if (onClose) onClose();
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!reminderData.title || !reminderData.date) {
      toast.error("Mohon isi semua field yang diperlukan");
      return;
    }

    onAddReminder(reminderData);
    setReminderData({
      title: "",
      description: "",
      date: selectedDate.toISOString().split("T")[0],
    });
    setInternalShowReminderDialog(false);
    if (onClose) onClose();
  };

  const categories = activeTab === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <>
      <Dialog open={internalShowTransactionDialog} onOpenChange={(open) => {
        setInternalShowTransactionDialog(open);
        if (!open && onClose) onClose();
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Transaksi Baru</DialogTitle>
          </DialogHeader>

          <div className="flex gap-2 mb-4">
            <Button
              onClick={() => setActiveTab("income")}
              variant={activeTab === "income" ? "default" : "outline"}
              className={`flex-1 ${activeTab === "income" ? "bg-green-600 hover:bg-green-700" : ""}`}
            >
              <ArrowUpCircle className="h-4 w-4 mr-2" />
              Pemasukan
            </Button>
            <Button
              onClick={() => setActiveTab("expense")}
              variant={activeTab === "expense" ? "default" : "outline"}
              className={`flex-1 ${activeTab === "expense" ? "bg-red-600 hover:bg-red-700" : ""}`}
            >
              <ArrowDownCircle className="h-4 w-4 mr-2" />
              Pengeluaran
            </Button>
          </div>

          <form onSubmit={handleAddTransaction} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Jumlah (Rp)</label>
              <Input
                type="number"
                placeholder="0"
                value={formData.amount}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, amount: e.target.value }))
                }
                step="0.01"
                min="0"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Kategori</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    type="button"
                    variant={formData.category === cat ? "default" : "outline"}
                    className={`${
                      formData.category === cat
                        ? activeTab === "income"
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-red-600 hover:bg-red-700"
                        : ""
                    }`}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, category: cat }))
                    }
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Catatan</label>
              <Textarea
                placeholder="Tambahkan catatan (opsional)"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                className={`flex-1 ${
                  activeTab === "income"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Simpan
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setInternalShowTransactionDialog(false);
                  if (onClose) onClose();
                }}
                className="flex-1"
              >
                Batal
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={internalShowReminderDialog} onOpenChange={(open) => {
        setInternalShowReminderDialog(open);
        if (!open && onClose) onClose();
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buat Pengingat</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddReminder} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Judul/Tagihan</label>
              <Input
                placeholder="Contoh: Bayar listrik"
                value={reminderData.title}
                onChange={(e) =>
                  setReminderData((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Tanggal Jatuh Tempo</label>
              <Input
                type="date"
                value={reminderData.date}
                onChange={(e) =>
                  setReminderData((prev) => ({
                    ...prev,
                    date: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Catatan</label>
              <Textarea
                placeholder="Tambahkan detail pembayaran"
                value={reminderData.description}
                onChange={(e) =>
                  setReminderData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded text-sm text-blue-800 dark:text-blue-200">
              Pengingat akan muncul di kalender pada tanggal yang dipilih
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              >
                Simpan
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setInternalShowReminderDialog(false);
                  if (onClose) onClose();
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
