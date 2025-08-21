import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle, AlertCircle, Info, Clock, X, Filter, Search } from 'lucide-react';

// Mock notifications data
const MOCK_NOTIFICATIONS = {
  project: [
    {
      id: 1,
      type: 'success',
      title: 'Stage 1 Completed',
      message: 'Document & Code Ingestion stage completed successfully. Engines started at 2024-01-15 09:30:00',
      timestamp: '2024-01-15T09:30:00Z',
      read: false,
      project: 'MISC'
    },
    {
      id: 2,
      type: 'info',
      title: 'Stage 2 Started',
      message: 'Comprehension Documentation stage has begun. AI processing cores are analyzing code files.',
      timestamp: '2024-01-15T10:15:00Z',
      read: false,
      project: 'MISC'
    },
    {
      id: 3,
      type: 'warning',
      title: 'Quality Threshold Not Met',
      message: 'Document generation quality score is 3.8/5.0. Additional iterations may be required.',
      timestamp: '2024-01-15T11:45:00Z',
      read: true,
      project: 'MISC'
    },
    {
      id: 4,
      type: 'success',
      title: 'Stage 2 Completed',
      message: 'Comprehension Documentation completed. Quality score achieved: 4.6/5.0',
      timestamp: '2024-01-15T14:20:00Z',
      read: false,
      project: 'MISC'
    },
    {
      id: 5,
      type: 'info',
      title: 'Stage 3 Started',
      message: 'Capability Documentation stage initiated. System interaction analysis in progress.',
      timestamp: '2024-01-15T15:00:00Z',
      read: false,
      project: 'MISC'
    }
  ],
  global: [
    {
      id: 101,
      type: 'success',
      title: 'New Project Added',
      message: 'GEVIS project has been added to the Falcon system. Initial assessment completed.',
      timestamp: '2024-01-15T08:00:00Z',
      read: false,
      project: 'GEVIS'
    },
    {
      id: 102,
      type: 'info',
      title: 'System Maintenance',
      message: 'Scheduled maintenance completed. All AI engines are running at optimal performance.',
      timestamp: '2024-01-15T07:30:00Z',
      read: true,
      project: 'System'
    },
    {
      id: 103,
      type: 'warning',
      title: 'High CPU Usage',
      message: 'AI processing cores are experiencing high load. Consider scaling resources.',
      timestamp: '2024-01-15T06:45:00Z',
      read: false,
      project: 'System'
    },
    {
      id: 104,
      type: 'success',
      title: 'Project Completed',
      message: 'AC625100 project has been successfully completed. All stages finished.',
      timestamp: '2024-01-14T16:30:00Z',
      read: false,
      project: 'AC625100'
    },
    {
      id: 105,
      type: 'info',
      title: 'New User Onboarded',
      message: 'User Mayur has been granted access to the Falcon system.',
      timestamp: '2024-01-14T14:15:00Z',
      read: true,
      project: 'System'
    }
  ]
};

const NotificationItem = ({ notification, onMarkAsRead, onDelete, theme }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getTypeColor = () => {
    switch (notification.type) {
      case 'success':
        return theme.name === "Vibrant" ? 'border-green-500/30 bg-green-600/20' : 'border-green-200 bg-green-50';
      case 'warning':
        return theme.name === "Vibrant" ? 'border-yellow-500/30 bg-yellow-600/20' : 'border-yellow-200 bg-yellow-50';
      case 'error':
        return theme.name === "Vibrant" ? 'border-red-500/30 bg-red-600/20' : 'border-red-200 bg-red-50';
      default:
        return theme.name === "Vibrant" ? 'border-blue-500/30 bg-blue-600/20' : 'border-blue-200 bg-blue-50';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`p-4 rounded-xl border ${getTypeColor()} ${!notification.read ? 'ring-2 ring-blue-500/20' : ''}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className={`font-semibold ${theme.colors.text} mb-1`}>
                {notification.title}
              </h4>
              <p className={`text-sm ${theme.colors.textSecondary} mb-2`}>
                {notification.message}
              </p>
              <div className="flex items-center gap-4 text-xs">
                <span className={`flex items-center gap-1 ${theme.colors.textMuted}`}>
                  <Clock className="h-3 w-3" />
                  {formatTimestamp(notification.timestamp)}
                </span>
                {notification.project && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    theme.name === "Vibrant" ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {notification.project}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              {!notification.read && (
                <button
                  onClick={() => onMarkAsRead(notification.id)}
                  className={`p-1 rounded hover:bg-white/10 transition-colors`}
                  title="Mark as read"
                >
                  <CheckCircle className="h-4 w-4 text-gray-400 hover:text-green-500" />
                </button>
              )}
              <button
                onClick={() => onDelete(notification.id)}
                className={`p-1 rounded hover:bg-white/10 transition-colors`}
                title="Delete notification"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-red-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function NotificationsPage({ projectName, isGlobal = false, onClose, theme }) {
  const [notifications, setNotifications] = useState(
    isGlobal ? MOCK_NOTIFICATIONS.global : MOCK_NOTIFICATIONS.project
  );
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && !notification.read) ||
      (filter === 'read' && notification.read) ||
      notification.type === filter;
    
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (notification.project && notification.project.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const handleDelete = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`${theme.colors.card} rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border ${theme.colors.border}`}
      >
        {/* Header */}
        <div className={`p-6 border-b ${theme.colors.border}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${theme.colors.accent} text-white`}>
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${theme.colors.text}`}>
                  {isGlobal ? 'Global Notifications' : `${projectName} Notifications`}
                </h2>
                <p className={`text-sm ${theme.colors.textMuted}`}>
                  {unreadCount} unread notifications
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  unreadCount === 0 
                    ? 'opacity-50 cursor-not-allowed' 
                    : theme.colors.accent + ' text-white ' + theme.colors.accentHover
                } transition-colors`}
              >
                Mark All Read
              </button>
              <button
                onClick={handleClearAll}
                className={`px-3 py-1 rounded-lg text-sm font-medium border ${theme.colors.border} ${theme.colors.text} hover:bg-gray-100 transition-colors`}
              >
                Clear All
              </button>
              <button
                onClick={onClose}
                className={`p-2 rounded-xl hover:bg-gray-100 transition-colors ${theme.colors.text}`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className={`p-4 border-b ${theme.colors.border}`}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${theme.colors.border} focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.colors.text} ${theme.name === "Vibrant" ? "bg-white/20" : "bg-white"}`}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className={`px-3 py-2 rounded-lg border ${theme.colors.border} focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.colors.text} ${theme.name === "Vibrant" ? "bg-white/20" : "bg-white"}`}
              >
                <option value="all">All</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
                <option value="info">Info</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-auto p-4">
          <AnimatePresence>
            {filteredNotifications.length > 0 ? (
              <div className="space-y-3">
                {filteredNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                    onDelete={handleDelete}
                    theme={theme}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className={`text-lg font-semibold ${theme.colors.text} mb-2`}>
                  No notifications found
                </h3>
                <p className={`text-sm ${theme.colors.textMuted}`}>
                  {searchQuery || filter !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'You\'re all caught up! No notifications at the moment.'
                  }
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
