
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, ShieldCheck, PieChart, Calendar, Wallet, Users, Target } from "lucide-react";
import { motion } from "framer-motion";

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 dark:from-indigo-500 dark:to-indigo-600 mb-6 shadow-lg">
            <span className="text-4xl font-bold text-white">E</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to E-Planner
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Smart financial planning solution for your personal finances - specially designed for students
          </p>

          <Card className="max-w-md mx-auto p-8 shadow-2xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <Button
              onClick={onGetStarted}
              className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              size="lg"
            >
              Get Started
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Start managing your finances today
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
        >
          <Card className="p-6 text-center hover:shadow-xl transition-all hover:scale-105 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
              <ShieldCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              Safe & Secure
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your financial data is securely stored locally in your browser
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-xl transition-all hover:scale-105 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
              <PieChart className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              Visual Analytics
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Financial visualization with interactive and easy-to-understand charts
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-xl transition-all hover:scale-105 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 mb-4">
              <Calendar className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              Smart Calendar
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Manage payment reminders and transactions with an interactive calendar
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6"
        >
          <Card className="p-6 text-center hover:shadow-xl transition-all hover:scale-105 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900 mb-4">
              <Wallet className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              Weekly Budget
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Track your weekly allowance and get alerts when overspending
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-xl transition-all hover:scale-105 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-100 dark:bg-pink-900 mb-4">
              <Users className="h-8 w-8 text-pink-600 dark:text-pink-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              Split Bills
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Calculate and track shared expenses with friends easily
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-xl transition-all hover:scale-105 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900 mb-4">
              <Target className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              Savings Goals
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Set and track your savings goals with progress visualization
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
