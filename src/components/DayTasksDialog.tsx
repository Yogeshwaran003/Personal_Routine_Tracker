import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Save } from "lucide-react";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface DayTasksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date;
}

export const DayTasksDialog = ({ open, onOpenChange, date }: DayTasksDialogProps) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem(`tasks-${date.toISOString().split('T')[0]}`);
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTask, setNewTask] = useState("");

  // Save tasks to localStorage whenever they change
  const saveTasks = (updatedTasks: Task[]) => {
    localStorage.setItem(
      `tasks-${date.toISOString().split('T')[0]}`,
      JSON.stringify(updatedTasks)
    );
    setTasks(updatedTasks);
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      text: newTask.trim(),
      completed: false
    };

    saveTasks([...tasks, task]);
    setNewTask("");
  };

  const toggleTask = (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    saveTasks(updatedTasks);
  };

  const deleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    saveTasks(updatedTasks);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-slate-100">
            Tasks for {date.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <form onSubmit={addTask} className="flex gap-2">
            <Input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 border-slate-200 dark:border-slate-600"
            />
            <Button 
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </form>

          <div className="space-y-2">
            {tasks.map(task => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <Checkbox
                  id={task.id}
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id)}
                  className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                />
                
                <label
                  htmlFor={task.id}
                  className={`flex-1 cursor-pointer ${
                    task.completed 
                      ? 'text-slate-400 dark:text-slate-500 line-through' 
                      : 'text-slate-900 dark:text-slate-100'
                  }`}
                >
                  {task.text}
                </label>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTask(task.id)}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}

            {tasks.length === 0 && (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <p>No tasks yet. Add your first task to get started!</p>
              </div>
            )}
          </div>

          {tasks.length > 0 && (
            <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button
                onClick={() => onOpenChange(false)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Submit Tasks
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}; 