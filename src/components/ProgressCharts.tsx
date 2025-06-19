
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useHabits } from "@/hooks/useHabits";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export const ProgressCharts = () => {
  const { habits } = useHabits();

  // Generate weekly data for the last 8 weeks
  const getWeeklyData = () => {
    const weeks = [];
    const today = new Date();
    
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (i * 7) - today.getDay());
      
      const weekData = {
        week: `Week ${8 - i}`,
        date: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        completed: 0,
        total: habits.length * 7
      };

      habits.forEach(habit => {
        for (let d = 0; d < 7; d++) {
          const checkDate = new Date(weekStart);
          checkDate.setDate(checkDate.getDate() + d);
          const dateStr = checkDate.toISOString().split('T')[0];
          
          if (habit.completedDates.includes(dateStr)) {
            weekData.completed++;
          }
        }
      });

      weekData.total = habits.length * 7;
      weeks.push(weekData);
    }
    
    return weeks;
  };

  // Generate daily data for the last 30 days
  const getDailyData = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const completedCount = habits.filter(habit => 
        habit.completedDates.includes(dateStr)
      ).length;
      
      days.push({
        date: date.getDate(),
        fullDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        completed: completedCount,
        total: habits.length,
        percentage: habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0
      });
    }
    
    return days;
  };

  // Get habit category distribution
  const getCategoryData = () => {
    const categories = {};
    habits.forEach(habit => {
      categories[habit.category] = (categories[habit.category] || 0) + 1;
    });
    
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
    
    return Object.entries(categories).map(([category, count], index) => ({
      name: category,
      value: count,
      color: colors[index % colors.length]
    }));
  };

  const weeklyData = getWeeklyData();
  const dailyData = getDailyData();
  const categoryData = getCategoryData();

  // Calculate overall stats
  const totalCompletions = habits.reduce((acc, habit) => acc + habit.completedDates.length, 0);
  const averageCompletion = habits.length > 0 
    ? Math.round((totalCompletions / (habits.length * 30)) * 100) 
    : 0;

  const getBestStreak = () => {
    let maxStreak = 0;
    habits.forEach(habit => {
      let currentStreak = 0;
      let tempStreak = 0;
      
      // Sort dates to check consecutive days
      const sortedDates = [...habit.completedDates].sort();
      
      for (let i = 0; i < sortedDates.length; i++) {
        const currentDate = new Date(sortedDates[i]);
        const prevDate = i > 0 ? new Date(sortedDates[i - 1]) : null;
        
        if (prevDate) {
          const diffTime = currentDate.getTime() - prevDate.getTime();
          const diffDays = diffTime / (1000 * 60 * 60 * 24);
          
          if (diffDays === 1) {
            tempStreak++;
          } else {
            maxStreak = Math.max(maxStreak, tempStreak);
            tempStreak = 1;
          }
        } else {
          tempStreak = 1;
        }
      }
      
      maxStreak = Math.max(maxStreak, tempStreak);
    });
    
    return maxStreak;
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Progress Overview
        </h2>
        <div className="flex space-x-2">
          <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
            {habits.length} Active Habits
          </Badge>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalCompletions}</div>
            <div className="text-sm text-blue-700 dark:text-blue-300">Total Completions</div>
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{averageCompletion}%</div>
            <div className="text-sm text-green-700 dark:text-green-300">30-Day Average</div>
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{getBestStreak()}</div>
            <div className="text-sm text-orange-700 dark:text-orange-300">Best Streak</div>
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{habits.length}</div>
            <div className="text-sm text-purple-700 dark:text-purple-300">Active Habits</div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Progress */}
        <Card className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Weekly Progress
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="week" 
                className="text-slate-600 dark:text-slate-400"
                fontSize={12}
              />
              <YAxis className="text-slate-600 dark:text-slate-400" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Bar 
                dataKey="completed" 
                fill="url(#blueGradient)" 
                radius={[4, 4, 0, 0]}
              />
              <defs>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Daily Completion Rate */}
        <Card className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Daily Completion Rate (30 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                className="text-slate-600 dark:text-slate-400"
                fontSize={12}
              />
              <YAxis 
                domain={[0, 100]}
                className="text-slate-600 dark:text-slate-400" 
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
                formatter={(value) => [`${value}%`, 'Completion Rate']}
              />
              <Line 
                type="monotone" 
                dataKey="percentage" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Habit Categories */}
        {categoryData.length > 0 && (
          <Card className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Habit Categories
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>

      {habits.length === 0 && (
        <Card className="p-12 text-center bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <BarChart className="w-16 h-16 mx-auto mb-4 text-slate-400" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
            No data to display
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Start tracking habits to see your progress charts and analytics.
          </p>
        </Card>
      )}
    </div>
  );
};
    