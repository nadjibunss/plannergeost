
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, Calculator, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface SplitBill {
  id: string;
  title: string;
  totalAmount: number;
  people: string[];
  perPerson: number;
  paidBy: string[];
  createdAt: string;
}

export default function SplitBillCalculator() {
  const [showDialog, setShowDialog] = useState(false);
  const [bills, setBills] = useState<SplitBill[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    totalAmount: "",
    peopleCount: "2",
    peopleNames: ["", ""],
  });

  useState(() => {
    const saved = localStorage.getItem("eplanner_split_bills");
    if (saved) {
      setBills(JSON.parse(saved));
    }
  });

  const handleAddBill = () => {
    if (!formData.title || !formData.totalAmount) {
      toast.error("Mohon isi semua field yang diperlukan");
      return;
    }

    const total = parseFloat(formData.totalAmount);
    const count = parseInt(formData.peopleCount);
    const perPerson = total / count;

    const newBill: SplitBill = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      totalAmount: total,
      people: formData.peopleNames.filter((n) => n.trim()),
      perPerson,
      paidBy: [],
      createdAt: new Date().toISOString(),
    };

    const updated = [newBill, ...bills];
    setBills(updated);
    localStorage.setItem("eplanner_split_bills", JSON.stringify(updated));

    setFormData({
      title: "",
      totalAmount: "",
      peopleCount: "2",
      peopleNames: ["", ""],
    });
    setShowDialog(false);
    toast.success("Patungan berhasil dibuat!");
  };

  const handleMarkPaid = (billId: string, personName: string) => {
    const updated = bills.map((bill) => {
      if (bill.id === billId) {
        const paidBy = bill.paidBy.includes(personName)
          ? bill.paidBy.filter((p) => p !== personName)
          : [...bill.paidBy, personName];
        return { ...bill, paidBy };
      }
      return bill;
    });

    setBills(updated);
    localStorage.setItem("eplanner_split_bills", JSON.stringify(updated));
  };

  const handleDeleteBill = (billId: string) => {
    const updated = bills.filter((b) => b.id !== billId);
    setBills(updated);
    localStorage.setItem("eplanner_split_bills", JSON.stringify(updated));
    toast.success("Patungan dihapus");
  };

  const updatePeopleCount = (count: string) => {
    const num = parseInt(count) || 2;
    const names = Array(num).fill("").map((_, i) => formData.peopleNames[i] || "");
    setFormData({ ...formData, peopleCount: count, peopleNames: names });
  };

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-600" />
            Patungan Bareng Teman
          </h3>
          <Button
            onClick={() => setShowDialog(true)}
            className="bg-indigo-600 hover:bg-indigo-700"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Patungan Baru
          </Button>
        </div>

        {bills.length > 0 ? (
          <div className="space-y-3">
            {bills.map((bill) => (
              <div
                key={bill.id}
                className="p-4 border border-gray-200 dark:border-slate-700 rounded-lg"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {bill.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total: Rp {bill.totalAmount.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleDeleteBill(bill.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded mb-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Per Orang
                  </p>
                  <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                    Rp {bill.perPerson.toLocaleString("id-ID")}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Status Pembayaran:
                  </p>
                  {bill.people.map((person, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-slate-700 rounded"
                    >
                      <span className="text-sm font-medium">
                        {person || `Orang ${idx + 1}`}
                      </span>
                      <Button
                        onClick={() =>
                          handleMarkPaid(bill.id, person || `Orang ${idx + 1}`)
                        }
                        variant={
                          bill.paidBy.includes(person || `Orang ${idx + 1}`)
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        className={
                          bill.paidBy.includes(person || `Orang ${idx + 1}`)
                            ? "bg-green-600 hover:bg-green-700"
                            : ""
                        }
                      >
                        {bill.paidBy.includes(person || `Orang ${idx + 1}`)
                          ? "Sudah Bayar ✓"
                          : "Belum Bayar"}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Calculator className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="mb-2 font-medium">Belum ada patungan</p>
            <p className="text-sm">Buat satu saat nongkrong bareng teman!</p>
          </div>
        )}
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Kalkulator Patungan</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Judul Tagihan</label>
              <Input
                placeholder="Contoh: Makan di Cafe"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Total Tagihan (Rp)</label>
              <Input
                type="number"
                placeholder="0"
                value={formData.totalAmount}
                onChange={(e) =>
                  setFormData({ ...formData, totalAmount: e.target.value })
                }
                step="1000"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Jumlah Orang</label>
              <Input
                type="number"
                min="2"
                max="10"
                value={formData.peopleCount}
                onChange={(e) => updatePeopleCount(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Nama (Opsional)</label>
              <div className="space-y-2 mt-2">
                {formData.peopleNames.map((name, idx) => (
                  <Input
                    key={idx}
                    placeholder={`Orang ${idx + 1}`}
                    value={name}
                    onChange={(e) => {
                      const names = [...formData.peopleNames];
                      names[idx] = e.target.value;
                      setFormData({ ...formData, peopleNames: names });
                    }}
                  />
                ))}
              </div>
            </div>

            {formData.totalAmount && (
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Per Orang:
                </p>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  Rp{" "}
                  {(
                    parseFloat(formData.totalAmount) /
                    parseInt(formData.peopleCount)
                  ).toLocaleString("id-ID")}
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={handleAddBill}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              >
                Buat Patungan
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
