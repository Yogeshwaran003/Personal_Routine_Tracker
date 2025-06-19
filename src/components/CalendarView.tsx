import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HabitCard } from "./HabitCard";
import { DayNotes } from "./DayNotes";
import { useHabits } from "@/hooks/useHabits";

export const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { habits, toggleHabit } = useHabits();

  const today = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

  const weeks = [];
  let currentWeek = [];
  const endDate = new Date(lastDayOfMonth);
  endDate.setDate(endDate.getDate() + (6 - lastDayOfMonth.getDay()));

  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    currentWeek.push(new Date(date));
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getHabitsForDate = (date: Date) => {
    const dateStr = formatDate(date);
    return habits.filter(habit => habit.completedDates.includes(dateStr));
  };

  const getStreakForDate = (date: Date, habit: any) => {
    const dateStr = formatDate(date);
    let streak = 0;
    let checkDate = new Date(date);
    
    while (habit.completedDates.includes(formatDate(checkDate))) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
    
    return streak;
  };

  return (
    <div className="p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('prev')}
            className="rounded-full transform hover:scale-110 active:scale-95 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('next')}
            className="rounded-full transform hover:scale-110 active:scale-95 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const today = new Date();
            setCurrentDate(today);
            setSelectedDate(today);
          }}
          className="rounded-full transform hover:scale-105 active:scale-95 transition-all"
        >
          Today
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-3 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {weeks.flat().map((date, index) => {
              const isCurrentMonth = date.getMonth() === currentDate.getMonth();
              const isToday = date.toDateString() === today.toDateString();
              const isSelected = date.toDateString() === selectedDate.toDateString();
              const completedHabits = getHabitsForDate(date);
              const totalHabits = habits.length;
              const completionRate = totalHabits > 0 ? (completedHabits.length / totalHabits) * 100 : 0;

              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(date)}
                  className={`
                    relative p-3 h-20 border border-slate-200 dark:border-slate-700 rounded-xl
                    transition-all duration-200 transform hover:scale-105 hover:shadow-lg active:scale-95
                    ${isCurrentMonth ? 'bg-white dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-900/50'}
                    ${isToday ? 'ring-2 ring-blue-500 shadow-blue-200 dark:shadow-blue-800' : ''}
                    ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 shadow-lg scale-105' : ''}
                    hover:border-blue-300 dark:hover:border-blue-600
                  `}
                >
                  <div className="flex flex-col h-full">
                    <span className={`
                      text-sm font-medium mb-1 transition-colors
                      ${isCurrentMonth ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400 dark:text-slate-600'}
                      ${isToday ? 'text-blue-600 dark:text-blue-400 font-bold' : ''}
                    `}>
                      {date.getDate()}
                    </span>
                    
                    {totalHabits > 0 && (
                      <div className="flex-1 flex flex-col justify-end">
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1 mb-1">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-1 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${completionRate}%` }}
                          />
                        </div>
                        
                        {completedHabits.length > 0 && (
                          <div className="flex flex-wrap gap-0.5">
                            {completedHabits.slice(0, 3).map((habit, idx) => (
                              <div
                                key={idx}
                                className="w-1.5 h-1.5 rounded-full animate-pulse"
                                style={{ backgroundColor: habit.color }}
                              />
                            ))}
                            {completedHabits.length > 3 && (
                              <span className="text-xs text-slate-500 animate-bounce">+{completedHabits.length - 3}</span>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Details */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            
            <div className="space-y-3">
              {habits.map(habit => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  date={selectedDate}
                  onToggle={() => toggleHabit(habit.id, selectedDate)}
                  streak={getStreakForDate(selectedDate, habit)}
                />
              ))}
              
              {habits.length === 0 && (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <Plus className="w-8 h-8 mx-auto mb-2" />
                  <p>No habits yet. Add your first habit to get started!</p>
                </div>
              )}
            </div>
          </div>

          <DayNotes date={selectedDate} />
        </div>
      </div>
    </div>
  );
};
