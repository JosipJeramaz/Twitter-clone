// UserStore.js - User profili
import { makeAutoObservable } from 'mobx';

class UserStore {
  users = new Map(); // userId -> user object
  currentProfile = null;
  following = [];
  followers = [];
  loading = false;
  error = null;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  // Actions will be implemented here
}

export default UserStore;
