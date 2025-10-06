// NotificationStore.js - Real-time notifikacije
import { makeAutoObservable } from 'mobx';

class NotificationStore {
  notifications = [];
  unreadCount = 0;
  loading = false;
  error = null;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  // Actions will be implemented here
}

export default NotificationStore;
