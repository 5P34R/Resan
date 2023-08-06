import { useAuth } from './authContext';

export const useAuthActions = () => {
  const { dispatch } = useAuth();

  const login = () => {
    dispatch({ type: 'LOGIN' });
  };

  const logout = () => {
    // Clear the tokens from storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    dispatch({ type: 'LOGOUT' });
  };

  return {
    login,
    logout,
  };
};
