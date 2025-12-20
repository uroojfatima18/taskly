'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';


interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

type FilterType = 'all' | 'pending' | 'completed';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [isDemoUser, setIsDemoUser] = useState(true);
  const [showSignInModal, setShowSignInModal] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit states
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Check if user needs to sign in for task management
  const requireSignIn = () => {
    if (isDemoUser) {
      setShowSignInModal(true);
      return true;
    }
    return false;
  };

  // Initialize demo session and fetch tasks
  useEffect(() => {
    const initializeDemoSession = async () => {
      try {
        let token = localStorage.getItem('auth_token');
        const isDemo = localStorage.getItem('is_demo_user');

        if (!token) {
          const session = await api.demoLogin();
          localStorage.setItem('auth_token', session.token);
          localStorage.setItem('auth_user', JSON.stringify(session.user));
          localStorage.setItem('is_demo_user', 'true');
          setUserName(session.user.name);
          setIsDemoUser(true);
        } else {
          const userJson = localStorage.getItem('auth_user');
          if (userJson) {
            const user = JSON.parse(userJson);
            setUserName(user.name);
          }
          setIsDemoUser(isDemo === 'true');
        }

        await fetchTasks();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize');
        setIsLoading(false);
      }
    };

    initializeDemoSession();
  }, []);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.getTasks(filter);
      setTasks(response.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    if (localStorage.getItem('auth_token')) {
      fetchTasks();
    }
  }, [filter, fetchTasks]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || isSubmitting) return;

    // Demo users can add tasks to try the feature
    setIsSubmitting(true);
    try {
      const newTask = await api.createTask({
        title: newTitle.trim(),
        description: newDescription.trim() || undefined,
      });
      setTasks([newTask, ...tasks]);
      setNewTitle('');
      setNewDescription('');
      showToast('Task created successfully', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to create task', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTask = async (id: number) => {
    if (requireSignIn()) return;

    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    setTasks(tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));

    try {
      await api.toggleTaskStatus(id, { completed: !task.completed });
      showToast(task.completed ? 'Task marked as pending' : 'Task completed!', 'success');
    } catch (err) {
      setTasks(tasks.map((t) =>
        t.id === id ? { ...t, completed: task.completed } : t
      ));
      showToast(err instanceof Error ? err.message : 'Failed to update task', 'error');
    }
  };

  const deleteTask = async (id: number) => {
    if (requireSignIn()) return;

    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    setTasks(tasks.filter((t) => t.id !== id));

    try {
      await api.deleteTask(id);
      showToast('Task deleted', 'success');
    } catch (err) {
      setTasks([...tasks]);
      showToast(err instanceof Error ? err.message : 'Failed to delete task', 'error');
    }
  };

  const startEdit = (task: Task) => {
    if (requireSignIn()) return;

    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
  };

  const saveEdit = async (id: number) => {
    if (!editTitle.trim()) return;

    const originalTask = tasks.find((t) => t.id === id);
    if (!originalTask) return;

    setTasks(tasks.map((t) =>
      t.id === id
        ? { ...t, title: editTitle.trim(), description: editDescription.trim() || null }
        : t
    ));
    setEditingId(null);

    try {
      await api.updateTask(id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
      });
      showToast('Task updated', 'success');
    } catch (err) {
      setTasks(tasks.map((t) =>
        t.id === id ? originalTask : t
      ));
      showToast(err instanceof Error ? err.message : 'Failed to update task', 'error');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <div className="min-h-screen">
      {/* Sign In Required Modal */}
      {showSignInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSignInModal(false)}
          />
          <div className="relative bg-dark-surface rounded-2xl shadow-2xl max-w-md w-full p-8 animate-scale-in">
            {/* Close button */}
            <button
              onClick={() => setShowSignInModal(false)}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-300 hover:bg-neutral-100 rounded-lg transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Icon */}
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            {/* Content */}
            <h3 className="text-2xl font-bold text-neutral-100 text-center mb-3">
              Sign In Required
            </h3>
            <p className="text-neutral-300 text-center mb-8">
              To manage your tasks, track progress, and save your data, please sign in or create an account. It&apos;s free!
            </p>

            {/* Features list */}
            <div className="bg-neutral-50 rounded-xl p-4 mb-6">
              <p className="text-sm font-semibold text-neutral-700 mb-3">With an account you can:</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-neutral-300">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Save and track all your tasks
                </li>
                <li className="flex items-center gap-2 text-sm text-neutral-300">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Mark tasks as complete
                </li>
                <li className="flex items-center gap-2 text-sm text-neutral-300">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Edit and delete tasks anytime
                </li>
                <li className="flex items-center gap-2 text-sm text-neutral-300">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Access from any device
                </li>
              </ul>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3">
              <Link
                href="/signup"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl text-center shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all"
              >
                Create Free Account
              </Link>
              <Link
                href="/login"
                className="w-full py-3 bg-neutral-100 text-neutral-700 font-semibold rounded-xl text-center hover:bg-neutral-200 transition-all"
              >
                Sign In
              </Link>
            </div>

            <p className="text-xs text-neutral-400 text-center mt-4">
              Free forever. No credit card required.
            </p>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 px-6 py-4 rounded-xl shadow-lg z-50 text-white font-medium transition-all duration-300 ${
            toast.type === 'success'
              ? 'bg-gradient-to-r from-green-500 to-emerald-600'
              : 'bg-gradient-to-r from-red-500 to-rose-600'
          }`}
        >
          <div className="flex items-center gap-3">
            {toast.type === 'success' ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            {toast.message}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-dark-surface/80 backdrop-blur-md border-b border-dark-border/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Taskly
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-neutral-100">
                    {isDemoUser ? 'Demo User' : userName || 'User'}
                  </p>
                  {isDemoUser && (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                      Demo
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-500">
                  {isDemoUser ? 'Try it out!' : 'demo@taskly.app'}
                </p>
              </div>
              {isDemoUser ? (
                <Link
                  href="/login"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  Sign In
                </Link>
              ) : (
                <button
                  onClick={() => {
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('auth_user');
                    localStorage.removeItem('is_demo_user');
                    window.location.href = '/';
                  }}
                  className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-all"
                  title="Sign out"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Demo Banner */}
      {isDemoUser && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-amber-800">
                  <span className="font-semibold">Demo Mode:</span> You can add tasks to try it out. Sign in to manage and save your tasks.
                </p>
              </div>
              <Link
                href="/signup"
                className="text-sm font-semibold text-amber-700 hover:text-amber-900 underline underline-offset-2"
              >
                Create Free Account →
              </Link>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error State */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start gap-4">
              <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">{error}</p>
                <button onClick={fetchTasks} className="mt-2 text-sm font-medium text-red-700 hover:text-red-900">
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Dashboard */}
        {!isLoading && <AnalyticsDashboard tasks={tasks} />}

        {/* Add Task Form */}
        <div className="mb-8 bg-dark-surface/90 backdrop-blur-sm rounded-2xl shadow-lg border border-dark-border/50 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-dark-border/50">
            <h2 className="text-lg font-semibold text-neutral-100 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Task
            </h2>
          </div>
          <form onSubmit={handleAddTask} className="p-6">
            <div className="space-y-4">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full px-4 py-3 bg-neutral-50 border-2 border-dark-border rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                disabled={isSubmitting}
              />
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Add a description (optional)"
                rows={2}
                className="w-full px-4 py-3 bg-neutral-50 border-2 border-dark-border rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting || !newTitle.trim()}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? 'Adding...' : 'Add Task'}
              </button>
            </div>
          </form>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2">
          {(['all', 'pending', 'completed'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                filter === f
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-dark-surface/80 text-neutral-300 hover:bg-neutral-100'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
              <p className="mt-4 text-neutral-500">Loading tasks...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-16 bg-dark-surface/80 backdrop-blur-sm rounded-2xl border-2 border-dashed border-dark-border">
              <svg className="w-16 h-16 text-neutral-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-lg font-semibold text-neutral-700">No tasks yet</h3>
              <p className="text-neutral-500 mt-1">Create your first task above!</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`group bg-dark-surface/90 backdrop-blur-sm rounded-xl border-2 p-4 transition-all duration-300 ${
                  task.completed
                    ? 'border-green-200 bg-gradient-to-r from-green-50/80 to-emerald-50/80'
                    : 'border-dark-border hover:border-blue-300 hover:shadow-lg'
                }`}
              >
                {editingId === task.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                      autoFocus
                    />
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-dark-border rounded-lg focus:border-blue-300 focus:ring-2 focus:ring-blue-200 outline-none resize-none"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(task.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-4 py-2 bg-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-300 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4">
                    {/* Completion Button */}
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`flex-shrink-0 w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${
                        task.completed
                          ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-500 text-white shadow-md'
                          : 'border-neutral-300 hover:border-blue-500 hover:bg-blue-50'
                      }`}
                      title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      {task.completed && (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>

                    {/* Task Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold transition-all ${task.completed ? 'text-neutral-400 line-through' : 'text-neutral-100'}`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className={`mt-1 text-sm ${task.completed ? 'text-neutral-400' : 'text-neutral-300'}`}>
                          {task.description}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-neutral-400">
                        {new Date(task.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEdit(task)}
                        className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
