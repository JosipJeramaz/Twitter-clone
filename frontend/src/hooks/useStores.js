// useStores.js - Custom hooks za MobX stores
import RootStore from '../stores/RootStore';

// Singleton instance of RootStore
// Kreiran samo jednom, dijeli se kroz cijelu aplikaciju
const rootStore = new RootStore();

// Export root store direktno ako treba pristup iz ne-React fajlova
export { rootStore };

/**
 * Custom hooks za pristup individualnim store-ovima
 * Ovi nisu "pravi" React hooks (ne koriste React state),
 * već samo getter funkcije koje vraćaju singleton store instance.
 * 
 * Zašto ovako?
 * - MobX automatski prati promjene kroz observable/observer pattern
 * - Komponente se automatski re-renderaju kada se observable promijeni
 * - Ne trebamo React state jer MobX upravlja reaktivnošću
 */

// Custom hook za pristup AuthStore
export const useAuthStore = () => {
  return rootStore.authStore;
};

// Custom hook za pristup PostStore
export const usePostStore = () => {
  return rootStore.postStore;
};

// Custom hook za pristup CommentStore
export const useCommentStore = () => {
  return rootStore.commentStore;
};

// Custom hook za pristup LikeStore
export const useLikeStore = () => {
  return rootStore.likeStore;
};

// Custom hook za pristup NotificationStore
export const useNotificationStore = () => {
  return rootStore.notificationStore;
};

// Custom hook za pristup UserStore
export const useUserStore = () => {
  return rootStore.userStore;
};

// Custom hook za pristup kompletnom RootStore
export const useRootStore = () => {
  return rootStore;
};
