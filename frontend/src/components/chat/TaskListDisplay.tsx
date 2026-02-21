import React from 'react';

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  created_at?: string;
}

interface TaskListDisplayProps {
  tasks: Task[];
  statusFilter?: 'all' | 'pending' | 'completed';
}

const TaskListDisplay: React.FC<TaskListDisplayProps> = ({ tasks, statusFilter = 'all' }) => {
  const filteredTasks = tasks.filter(task => {
    if (statusFilter === 'pending') return !task.completed;
    if (statusFilter === 'completed') return task.completed;
    return true; // 'all'
  });

  if (filteredTasks.length === 0) {
    return (
      <div className="p-4 bg-dark-surface/50 rounded-xl border border-dark-border text-center">
        <p className="text-neutral-500 text-sm italic">
          {statusFilter === 'pending'
            ? 'No pending tasks found.'
            : statusFilter === 'completed'
              ? 'No completed tasks found.'
              : 'No tasks found.'}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-dark-surface rounded-xl border border-dark-border shadow-sm">
      <h3 className="font-bold text-neutral-100 mb-4 flex items-center justify-between">
        <span className="flex items-center gap-2">
          {statusFilter === 'pending' ? 'To Do' : statusFilter === 'completed' ? 'Done' : 'All Tasks'}
          <span className="px-2 py-0.5 bg-dark-elevated text-neutral-400 text-[10px] rounded-full font-mono">
            {filteredTasks.length}
          </span>
        </span>
      </h3>

      <ul className="space-y-2">
        {filteredTasks.map((task) => (
          <li
            key={task.id}
            className={`p-3 rounded-lg border transition-all ${task.completed
              ? 'bg-green-900/10 border-green-500/20 text-green-400'
              : 'bg-dark-elevated border-dark-border text-neutral-300'
              }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${task.completed ? 'bg-green-500' : 'bg-primary-500'}`}></div>
              <span className={`flex-1 font-medium ${task.completed ? 'opacity-60 line-through' : ''}`}>
                {task.title}
              </span>
            </div>

            {task.description && (
              <p className="mt-2 text-xs text-neutral-500 ml-5">{task.description}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskListDisplay;