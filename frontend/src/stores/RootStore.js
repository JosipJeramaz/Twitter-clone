// RootStore.js - Glavni store koji kombinuje sve store-ove
import AuthStore from './AuthStore';
import PostStore from './PostStore';
import CommentStore from './CommentStore';
import LikeStore from './LikeStore';
import NotificationStore from './NotificationStore';
import UserStore from './UserStore';

class RootStore {
  constructor() {
    this.authStore = new AuthStore(this);
    this.postStore = new PostStore(this);
    this.commentStore = new CommentStore(this);
    this.likeStore = new LikeStore(this);
    this.notificationStore = new NotificationStore(this);
    this.userStore = new UserStore(this);
  }
}

// Export default RootStore class
export default RootStore;

// Export individual stores for direct import if needed
export { AuthStore, PostStore, CommentStore, LikeStore, NotificationStore, UserStore };
