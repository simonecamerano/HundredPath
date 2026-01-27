import { reactive } from 'vue';

const state = reactive({
  notifications: []
});

let notificationId = 0;

export function useNotification() {
  const notify = (message, type = 'info', duration = 3000) => {
    const id = notificationId++;
    const notification = {
      id,
      message,
      type, // 'success', 'error', 'warning', 'info'
      duration
    };
    
    state.notifications.push(notification);
    
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
    
    return id;
  };
  
  const removeNotification = (id) => {
    const index = state.notifications.findIndex(n => n.id === id);
    if (index > -1) {
      state.notifications.splice(index, 1);
    }
  };
  
  return {
    notifications: state.notifications,
    notify,
    success: (message, duration) => notify(message, 'success', duration),
    error: (message, duration) => notify(message, 'error', duration),
    warning: (message, duration) => notify(message, 'warning', duration),
    info: (message, duration) => notify(message, 'info', duration),
    removeNotification
  };
}
