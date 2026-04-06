import useAuthStore from '../store/authStore.js';

export const useAuth = () => {
  const { user, token, setUser, setToken, logout } = useAuthStore();
  return { user, token, setUser, setToken, logout };
};