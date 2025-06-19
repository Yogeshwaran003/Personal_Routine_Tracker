
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface DayNotesProps {
  date: Date;
}

export const DayNotes = ({ date }: DayNotesProps) => {
  const [notes, setNotes] = useState("");
  const [mood, setMood] = useState("");

  const dateStr = date.toISOString().split('T')[0];

  useEffect(() => {
    const savedNotes = localStorage.getItem(`notes-${dateStr}`);
    const savedMood = localStorage.getItem(`mood-${dateStr}`);
    
    setNotes(savedNotes || "");
    setMood(savedMood || "");
  }, [dateStr]);

  const saveNotes = (value: string) => {
    setNotes(value);
    localStorage.setItem(`notes-${dateStr}`, value);
  };

  const saveMood = (moodValue: string) => {
    setMood(moodValue);
    localStorage.setItem(`mood-${dateStr}`, moodValue);
  };

  const moods = [
    { emoji: "😊", label: "Great", value: "great" },
    { emoji: "🙂", label: "Good", value: "good" },
    { emoji: "😐", label: "Okay", value: "okay" },
    { emoji: "😔", label: "Low", value: "low" },
    { emoji: "😴", label: "Tired", value: "tired" }
  ];

  return (
    <Card className="p-4 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-4">Daily Notes</h4>
      
      <div className="space-y-4">
        {/* Mood Selector */}
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">How are you feeling?</p>
          <div className="flex flex-wrap gap-2">
            {moods.map((moodOption) => (
              <button
                key={moodOption.value}
                onClick={() => saveMood(moodOption.value)}
                className={`
                  px-3 py-2 rounded-full text-sm transition-all
                  ${mood === moodOption.value
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 ring-2 ring-blue-500'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }
                `}
              >
                {moodOption.emoji} {moodOption.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Notes</p>
          <Textarea
            value={notes}
            onChange={(e) => saveNotes(e.target.value)}
            placeholder="Write your thoughts for the day..."
            className="min-h-[100px] resize-none"
          />
        </div>
      </div>
    </Card>
  );
};
