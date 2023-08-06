import React, { createContext, useContext, useReducer, useEffect, ReactNode, Dispatch } from 'react';

type AuthState = {
  isAuthenticated: boolean;
};

type AuthAction =
  | { type: 'LOGIN' }
  | { type: 'LOGOUT' };

const initialState: AuthState = {
  isAuthenticated: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<{
  state: AuthState;
  dispatch: Dispatch<AuthAction>;
} | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for a valid token in localStorage during initial setup
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    console.log('Access Token:', accessToken); // Check the console for the token value
    if (accessToken) {
      dispatch({ type: 'LOGIN' });
    }
  }, []);
  

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
