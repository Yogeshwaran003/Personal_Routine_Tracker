
import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface HabitCardProps {
  habit: {
    id: string;
    name: string;
    color: string;
    category: string;
    completedDates: string[];
  };
  date: Date;
  onToggle: () => void;
  streak: number;
}

export const HabitCard = ({ habit, date, onToggle, streak }: HabitCardProps) => {
  const dateStr = date.toISOString().split('T')[0];
  const isCompleted = habit.completedDates.includes(dateStr);
  const isToday = date.toDateString() === new Date().toDateString();

  return (
    <Card 
      className={`
        p-4 cursor-pointer transition-all duration-200 transform hover:scale-105 hover:shadow-lg active:scale-95
        ${isCompleted 
          ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800 shadow-green-100 dark:shadow-green-900/20' 
          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
        }
      `}
      onClick={onToggle}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`
            w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 transform hover:scale-110
            ${isCompleted 
              ? 'bg-green-500 border-green-500 animate-pulse' 
              : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 hover:scale-110'
            }
          `}>
            {isCompleted && <Check className="w-4 h-4 text-white animate-bounce" />}
          </div>
          
          <div>
            <p className={`font-medium transition-colors ${isCompleted ? 'text-green-900 dark:text-green-100' : 'text-slate-900 dark:text-slate-100'}`}>
              {habit.name}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {habit.category}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {streak > 0 && (
            <Badge variant="secondary" className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 animate-pulse">
              🔥 {streak}
            </Badge>
          )}
          
          <div 
            className="w-3 h-3 rounded-full transition-all duration-200 hover:scale-125"
            style={{ backgroundColor: habit.color }}
          />
        </div>
      </div>
    </Card>
  );
};
