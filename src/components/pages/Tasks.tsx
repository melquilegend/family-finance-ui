import React, { useState } from 'react';
import { Plus, CheckSquare, Square, Calendar, User, Edit, Trash2, Clock } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Task } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';
import { Card } from '../ui/Card';

const Tasks: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask } = useData();
  const { auth, getAllUsers } = useAuth();
  const { t } = useLanguage();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: '',
  });

  const users = getAllUsers();
  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!auth.user) return;
    
    const taskData = {
      title: formData.title,
      description: formData.description,
      completed: false,
      assignedTo: formData.assignedTo,
      createdBy: auth.user.id,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
    };

    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      assignedTo: '',
      dueDate: '',
    });
    setEditingTask(null);
    setIsModalOpen(false);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      assignedTo: task.assignedTo,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
    }
  };

  const toggleTaskCompletion = (task: Task) => {
    updateTask(task.id, { completed: !task.completed });
  };

  const getAssignedUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  const isOverdue = (task: Task) => {
    if (!task.dueDate || task.completed) return false;
    return new Date(task.dueDate) < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('tasks')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage tasks and stay organized together
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          {t('addTask')}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {pendingTasks.length}
            </p>
            <p className="text-gray-600 dark:text-gray-400">{t('pendingTasks')}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {completedTasks.length}
            </p>
            <p className="text-gray-600 dark:text-gray-400">{t('completed')}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {tasks.length}
            </p>
            <p className="text-gray-600 dark:text-gray-400">Total Tasks</p>
          </div>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Card padding={false}>
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {[
            { id: 'all', label: t('all'), count: tasks.length },
            { id: 'pending', label: 'Pending', count: pendingTasks.length },
            { id: 'completed', label: t('completed'), count: completedTasks.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`
                flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors
                ${filter === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }
              `}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </Card>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks
            .sort((a, b) => {
              // Sort by completion status first, then by due date
              if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
              }
              if (a.dueDate && b.dueDate) {
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
              }
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            })
            .map((task) => (
              <Card key={task.id} className={task.completed ? 'opacity-75' : ''}>
                <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                  <button
                    onClick={() => toggleTaskCompletion(task)}
                    className="self-start sm:mt-1 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    {task.completed ? (
                      <CheckSquare className="w-5 h-5 text-green-600" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-2 sm:space-y-0">
                      <div className="flex-1">
                        <h3 className={`font-semibold ${
                          task.completed 
                            ? 'line-through text-gray-500 dark:text-gray-400' 
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {task.description}
                          </p>
                        )}
                        
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400 space-y-1 sm:space-y-0">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{getAssignedUserName(task.assignedTo)}</span>
                          </div>
                          
                          {task.dueDate && (
                            <div className={`flex items-center space-x-1 ${
                              isOverdue(task) ? 'text-red-600 dark:text-red-400' : ''
                            }`}>
                              <Calendar className="w-4 h-4" />
                              <span>
                                {new Date(task.dueDate).toLocaleDateString()}
                                {isOverdue(task) && ' (Overdue)'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 sm:ml-4 self-start">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(task)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(task.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
        ) : (
          <Card>
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <CheckSquare className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No tasks found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {filter === 'all' 
                  ? 'Start organizing by adding your first task.'
                  : `No ${filter} tasks at the moment.`
                }
              </p>
              {filter === 'all' && (
                <Button onClick={() => setIsModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t('addTask')}
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={resetForm}
        title={editingTask ? 'Edit Task' : t('addTask')}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            label={t('taskTitle')}
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
            placeholder="What needs to be done?"
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('description')} (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Add more details..."
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('assignedTo')}
            </label>
            <select
              value={formData.assignedTo}
              onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
              required
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select assignee</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <Input
            type="date"
            label="Due Date (Optional)"
            value={formData.dueDate}
            onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
            icon={<Calendar className="w-4 h-4 text-gray-400" />}
          />

          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingTask ? t('save') : t('add')}
            </Button>
            <Button type="button" variant="secondary" onClick={resetForm}>
              {t('cancel')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Tasks;