
import { useState } from "react";
import { Calendar, Plus, BarChart3, Settings, Moon, Sun, Goal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarView } from "@/components/CalendarView";
import { HabitList } from "@/components/HabitList";
import { ProgressCharts } from "@/components/ProgressCharts";
import { GoalTracker } from "@/components/GoalTracker";
import { AddHabitDialog } from "@/components/AddHabitDialog";
import { useTheme } from "@/hooks/useTheme";
import { useHabits } from "@/hooks/useHabits";

const Index = () => {
  const [activeView, setActiveView] = useState("calendar");
  const [isAddHabitOpen, setIsAddHabitOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { habits } = useHabits();

  // Calculate current overall streak
  const getCurrentStreak = () => {
    if (habits.length === 0) return 0;
    
    let streak = 0;
    const checkDate = new Date();
    
    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const completedHabitsToday = habits.filter(habit => 
        habit.completedDates.includes(dateStr)
      ).length;
      
      // If at least one habit was completed on this day
      if (completedHabitsToday > 0) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const currentStreak = getCurrentStreak();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 transition-colors">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Routine Radar
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">Track your daily habits</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Streak Counter with Fire Icon */}
              {currentStreak > 0 && (
                <div className="flex items-center space-x-2 px-3 py-2 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                  <span className="text-2xl animate-pulse">🔥</span>
                  <div className="text-sm">
                    <span className="font-bold text-orange-800 dark:text-orange-200">{currentStreak}</span>
                    <span className="text-orange-600 dark:text-orange-300 ml-1">days</span>
                  </div>
                </div>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="rounded-full"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              
              <Button
                onClick={() => setIsAddHabitOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Habit
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex space-x-1 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl p-1 w-fit mx-auto">
          <Button
            variant={activeView === "calendar" ? "default" : "ghost"}
            onClick={() => setActiveView("calendar")}
            className={`rounded-xl transition-all transform hover:scale-105 active:scale-95 ${
              activeView === "calendar" 
                ? "bg-blue-600 text-white shadow-lg" 
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Calendar
          </Button>
          
          <Button
            variant={activeView === "habits" ? "default" : "ghost"}
            onClick={() => setActiveView("habits")}
            className={`rounded-xl transition-all transform hover:scale-105 active:scale-95 ${
              activeView === "habits" 
                ? "bg-blue-600 text-white shadow-lg" 
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Settings className="w-4 h-4 mr-2" />
            Habits
          </Button>
          
          <Button
            variant={activeView === "progress" ? "default" : "ghost"}
            onClick={() => setActiveView("progress")}
            className={`rounded-xl transition-all transform hover:scale-105 active:scale-95 ${
              activeView === "progress" 
                ? "bg-blue-600 text-white shadow-lg" 
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Progress
          </Button>

          <Button
            variant={activeView === "goals" ? "default" : "ghost"}
            onClick={() => setActiveView("goals")}
            className={`rounded-xl transition-all transform hover:scale-105 active:scale-95 ${
              activeView === "goals" 
                ? "bg-blue-600 text-white shadow-lg" 
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Goal className="w-4 h-4 mr-2" />
            Goals
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pb-8">
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-slate-200 dark:border-slate-700 shadow-xl rounded-3xl overflow-hidden">
          {activeView === "calendar" && <CalendarView />}
          {activeView === "habits" && <HabitList />}
          {activeView === "progress" && <ProgressCharts />}
          {activeView === "goals" && <GoalTracker />}
        </Card>
      </main>

      <AddHabitDialog 
        open={isAddHabitOpen} 
        onOpenChange={setIsAddHabitOpen} 
      />
    </div>
  );
};

export default Index;
