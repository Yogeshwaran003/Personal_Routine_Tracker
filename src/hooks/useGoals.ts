import { useState, useEffect } from 'react';

interface Goal {
  id: string;
  title: string;
  description: string;
  deadline: string;
  color: string;
  category: string;
  createdAt: string;
}

export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);

  // Load goals from localStorage on mount
  useEffect(() => {
    const savedGoals = localStorage.getItem('routine-radar-goals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  // Save goals to localStorage whenever goals change
  useEffect(() => {
    localStorage.setItem('routine-radar-goals', JSON.stringify(goals));
  }, [goals]);

  const addGoal = (goal: Omit<Goal, 'id' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const updateGoalProgress = (id: string, currentValue: number) => {
    setGoals(prev => prev.map(goal => 
      goal.id === id ? { ...goal, currentValue } : goal
    ));
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(goal => 
      goal.id === id ? { ...goal, ...updates } : goal
    ));
  };

  const deleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
  };

  return {
    goals,
    addGoal,
    updateGoalProgress,
    updateGoal,
    deleteGoal
  };
};
