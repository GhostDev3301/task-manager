import { createContext, useState, useEffect } from 'react';
import { mockLogin, mockRegister } from '../mocks/authMock';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  // Simula la verificación de sesión al cargar la app
  useEffect(() => {
    setLoading(false);
  }, []);

  const login = (email, password) => {
    setLoading(true);
    const result = mockLogin(email, password);
    if (result.success) {
      setUser(result.user);
      localStorage.setItem('user', JSON.stringify(result.user));
      localStorage.setItem('token', result.token);
    }
    setLoading(false);
    return result;
  };

  const register = ({ name, email, password }) => {
    setLoading(true);
    const result = mockRegister({ name, email, password });
    setLoading(false);
    return result;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;