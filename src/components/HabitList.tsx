
import { useState } from "react";
import { Edit2, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useHabits } from "@/hooks/useHabits";

export const HabitList = () => {
  const { habits, deleteHabit } = useHabits();
  const [editingId, setEditingId] = useState<string | null>(null);

  const getHabitStats = (habit: any) => {
    const totalDays = habit.completedDates.length;
    const today = new Date().toISOString().split('T')[0];
    
    // Calculate current streak
    let streak = 0;
    let checkDate = new Date();
    
    while (habit.completedDates.includes(checkDate.toISOString().split('T')[0])) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Calculate this week's completion
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    
    let weeklyCount = 0;
    for (let i = 0; i < 7; i++) {
      const checkDay = new Date(startOfWeek);
      checkDay.setDate(checkDay.getDate() + i);
      if (habit.completedDates.includes(checkDay.toISOString().split('T')[0])) {
        weeklyCount++;
      }
    }

    return { totalDays, streak, weeklyCount };
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Your Habits
        </h2>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full">
          <Plus className="w-4 h-4 mr-2" />
          Add New Habit
        </Button>
      </div>

      {habits.length === 0 ? (
        <Card className="p-12 text-center bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <Plus className="w-12 h-12 mx-auto mb-4 text-slate-400" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
            No habits yet
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Create your first habit to start tracking your daily routine.
          </p>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full">
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Habit
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {habits.map((habit) => {
            const stats = getHabitStats(habit);
            
            return (
              <Card key={habit.id} className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: habit.color }}
                    />
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                        {habit.name}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {habit.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingId(habit.id)}
                      className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteHabit(habit.id)}
                      className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Current Streak</span>
                    <span className="font-semibold text-orange-600 dark:text-orange-400">
                      🔥 {stats.streak} days
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">This Week</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {stats.weeklyCount}/7 days
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Total Days</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {stats.totalDays} days
                    </span>
                  </div>
                  
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((stats.weeklyCount / 7) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
