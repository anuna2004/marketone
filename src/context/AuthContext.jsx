import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const login = async (credentials) => {
    // TODO: Replace with actual login logic
    // Mock login response
    const mockResponse = {
      user: {
        id: '123',
        role: 'provider',
        name: 'Test Provider',
      },
      token: 'mock-jwt-token',
    };

    setUser(mockResponse.user);
    setToken(mockResponse.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};