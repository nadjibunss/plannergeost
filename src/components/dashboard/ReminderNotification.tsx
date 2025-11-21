
"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Bell } from "lucide-react";

interface ReminderNotificationProps {
  reminders: any[];
}

export default function ReminderNotification({
  reminders,
}: ReminderNotificationProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [todayReminders, setTodayReminders] = useState<any[]>([]);

  useEffect(() => {
    const checkReminders = () => {
      const today = new Date().toISOString().split("T")[0];

      const pending = reminders.filter(
        (reminder) =>
          reminder.date === today &&
          !reminder.notified &&
          reminder.active
      );

      if (pending.length > 0) {
        setTodayReminders(pending);
        setShowDialog(true);
      }
    };

    checkReminders();
  }, [reminders]);

  const handleMarkComplete = () => {
    todayReminders.forEach((reminder) => {
      const allReminders = JSON.parse(
        localStorage.getItem("eplanner_reminders") || "[]"
      );
      const updated = allReminders.map((r: any) =>
        r.id === reminder.id ? { ...r, notified: true, active: false } : r
      );
      localStorage.setItem("eplanner_reminders", JSON.stringify(updated));
    });

    setShowDialog(false);
    window.location.reload();
  };

  const handleDismiss = () => {
    todayReminders.forEach((reminder) => {
      const allReminders = JSON.parse(
        localStorage.getItem("eplanner_reminders") || "[]"
      );
      const updated = allReminders.map((r: any) =>
        r.id === reminder.id ? { ...r, notified: true } : r
      );
      localStorage.setItem("eplanner_reminders", JSON.stringify(updated));
    });

    setShowDialog(false);
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Bell className="h-6 w-6 text-yellow-600" />
            Pengingat Hari Ini
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {todayReminders.map((reminder) => (
            <div
              key={reminder.id}
              className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
            >
              <h4 className="font-semibold text-lg text-yellow-900 dark:text-yellow-200 mb-2">
                {reminder.title}
              </h4>
              <p className="text-sm text-yellow-800 dark:text-yellow-300 mb-2">
                Jatuh tempo: {new Date(reminder.date).toLocaleDateString("id-ID", { dateStyle: "long" })}
              </p>
              {reminder.description && (
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  {reminder.description}
                </p>
              )}
            </div>
          ))}
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            onClick={handleMarkComplete}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Tandai Selesai
          </Button>
          <Button
            onClick={handleDismiss}
            variant="outline"
            className="flex-1"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
