
import { useState } from "react";
import { Plus, Target, Trophy, Calendar, Clock, TrendingUp, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useGoals } from "@/hooks/useGoals";
import { AddGoalDialog } from "@/components/AddGoalDialog";

export const GoalTracker = () => {
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [editingProgress, setEditingProgress] = useState<string | null>(null);
  const [tempProgress, setTempProgress] = useState("");
  const { goals, updateGoalProgress, deleteGoal } = useGoals();

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-blue-500";
  };

  const getStatusBadge = (goal: any) => {
    const now = new Date();
    const deadline = new Date(goal.deadline);
    const progress = (goal.currentValue / goal.targetValue) * 100;

    if (progress >= 100) {
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">Completed</Badge>;
    }
    if (deadline < now) {
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200">Overdue</Badge>;
    }
    return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">In Progress</Badge>;
  };

  const handleProgressUpdate = (goalId: string, newValue: number) => {
    updateGoalProgress(goalId, newValue);
    setEditingProgress(null);
    setTempProgress("");
  };

  const startEditingProgress = (goalId: string, currentValue: number) => {
    setEditingProgress(goalId);
    setTempProgress(currentValue.toString());
  };

  const cancelEditing = () => {
    setEditingProgress(null);
    setTempProgress("");
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Goal Tracker</h2>
          <p className="text-slate-600 dark:text-slate-400">Set and track your personal goals</p>
        </div>
        
        <Button
          onClick={() => setIsAddGoalOpen(true)}
          className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-full transform hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Goal
        </Button>
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-12">
          <Target className="w-16 h-16 mx-auto mb-4 text-slate-400 dark:text-slate-600" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
            No goals yet
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Start by adding your first goal to track your progress
          </p>
          <Button
            onClick={() => setIsAddGoalOpen(true)}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Goal
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const progress = Math.min((goal.currentValue / goal.targetValue) * 100, 100);
            const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            
            return (
              <Card 
                key={goal.id} 
                className="p-6 hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 border-l-4 relative group"
                style={{ borderLeftColor: goal.color }}
              >
                {/* Delete Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteGoal(goal.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>

                <div className="flex items-start justify-between mb-4 pr-8">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: goal.color }}
                    />
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                      {goal.title}
                    </h3>
                  </div>
                  {getStatusBadge(goal)}
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  {goal.description}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Progress</span>
                    {editingProgress === goal.id ? (
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          value={tempProgress}
                          onChange={(e) => setTempProgress(e.target.value)}
                          className="w-16 h-6 text-xs"
                          max={goal.targetValue}
                          min={0}
                        />
                        <span className="text-xs">/ {goal.targetValue} {goal.unit}</span>
                        <Button
                          size="sm"
                          onClick={() => handleProgressUpdate(goal.id, Number(tempProgress))}
                          className="h-6 px-2 text-xs"
                        >
                          Save
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={cancelEditing}
                          className="h-6 px-2 text-xs"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div 
                        className="font-medium text-slate-900 dark:text-slate-100 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center space-x-1"
                        onClick={() => startEditingProgress(goal.id, goal.currentValue)}
                      >
                        <span>{goal.currentValue} / {goal.targetValue} {goal.unit}</span>
                        <Edit className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  
                  <Progress 
                    value={progress} 
                    className="h-2"
                  />
                  
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>{Math.round(progress)}% complete</span>
                    {daysLeft > 0 ? (
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {daysLeft} days left
                      </span>
                    ) : (
                      <span className="text-red-500">Overdue</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                    <Calendar className="w-3 h-3 mr-1" />
                    Due: {new Date(goal.deadline).toLocaleDateString()}
                  </div>
                  
                  {progress >= 100 && (
                    <Trophy className="w-5 h-5 text-yellow-500" />
                  )}
                </div>

                <div className="mt-3 text-xs text-slate-400 dark:text-slate-500">
                  Category: {goal.category}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <AddGoalDialog 
        open={isAddGoalOpen} 
        onOpenChange={setIsAddGoalOpen} 
      />
    </div>
  );
};
